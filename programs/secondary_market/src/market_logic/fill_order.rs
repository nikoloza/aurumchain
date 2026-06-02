use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, Mint, TokenAccount, TokenInterface};
use crate::state::*;

#[derive(Accounts)]
pub struct FillOrder<'info> {
    #[account(
        seeds = [b"config"],
        bump = config.bump,
    )]
    pub config: Account<'info, MarketConfig>,

    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
        mut,
        token::mint = project_mint,
        token::authority = buyer
    )]
    pub buyer_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        token::mint = stablecoin_mint,
        token::authority = buyer
    )]
    pub buyer_usdc_account: InterfaceAccount<'info, TokenAccount>,

    /// CHECK: The seller address receiving payment
    #[account(mut)]
    pub seller: UncheckedAccount<'info>,

    #[account(
        mut,
        token::mint = stablecoin_mint,
        token::authority = seller
    )]
    pub seller_usdc_account: InterfaceAccount<'info, TokenAccount>,

    pub project_mint: InterfaceAccount<'info, Mint>,

    pub stablecoin_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        token::mint = project_mint,
        token::authority = vault_authority,
        seeds = [b"escrow_vault", project_mint.key().as_ref()],
        bump
    )]
    pub escrow_vault: InterfaceAccount<'info, TokenAccount>,

    /// CHECK: Vault authority PDA (pre-allowlisted in compliance)
    #[account(
        seeds = [b"vault_authority"],
        bump
    )]
    pub vault_authority: UncheckedAccount<'info>,

    #[account(
        mut,
        seeds = [b"sell_order", seller.key().as_ref(), sell_order.sequence.to_le_bytes().as_ref()],
        bump = sell_order.bump,
    )]
    pub sell_order: Account<'info, SellOrder>,

    #[account(
        mut,
        token::mint = stablecoin_mint,
        token::authority = config.fee_destination
    )]
    pub fee_destination_usdc: InterfaceAccount<'info, TokenAccount>,

    /// CHECK: Buyer Eligibility Account (Compliance), validated in handler
    pub buyer_eligibility: UncheckedAccount<'info>,

    /// CHECK: Project Registry account, validated in handler
    pub project_account: UncheckedAccount<'info>,

    /// CHECK: Optional Project Pause PDA, checked dynamically if initialized
    pub project_pause: UncheckedAccount<'info>,

    /// CHECK: Optional Distribution Control Account, checked dynamically if initialized
    pub distribution_control: UncheckedAccount<'info>,

    pub token_program: Interface<'info, TokenInterface>,
    pub stablecoin_program: Interface<'info, TokenInterface>,
}

pub fn handle_fill_order<'info>(
    ctx: Context<'_, '_, '_, 'info, FillOrder<'info>>,
    buy_amount: u64,
) -> Result<()> {
    let clock = Clock::get()?;
    let config = &ctx.accounts.config;
    let order = &mut ctx.accounts.sell_order;

    // 1. Safeguards & Lifecycle Checks
    require!(!config.is_paused, SecondaryMarketError::GlobalPause);
    require!(order.remaining_quantity >= buy_amount, SecondaryMarketError::InsufficientRemaining);

    if ctx.accounts.project_pause.to_account_info().data_len() > 0 {
        require_keys_eq!(
            ctx.accounts.project_pause.owner.key(),
            crate::ID,
            SecondaryMarketError::Unauthorized
        );
        let mut data: &[u8] = &ctx.accounts.project_pause.try_borrow_data()?;
        let project_pause = ProjectPause::try_deserialize(&mut data)?;
        require!(!project_pause.is_paused, SecondaryMarketError::ProjectPause);
    }

    let project_info = &ctx.accounts.project_account;
    require_keys_eq!(project_info.owner.key(), config.project_registry_program, SecondaryMarketError::InvalidRegistry);
    let mut p_data: &[u8] = &project_info.data.borrow()[8..];
    let project = ProjectAccount::deserialize(&mut p_data)?;
    require_keys_eq!(project.mint, ctx.accounts.project_mint.key(), SecondaryMarketError::InvalidMint);
    require!(project.status == ProjectStatus::Active, SecondaryMarketError::InvalidStatus);
    require!(!project.is_paused, SecondaryMarketError::ProjectPause);

    // 2. Validate Distribution Control State (if provided)
    if ctx.accounts.distribution_control.to_account_info().data_len() > 0 {
        let dist_info = &ctx.accounts.distribution_control;
        require_keys_eq!(dist_info.owner.key(), config.distribution_program, SecondaryMarketError::InvalidDistribution);
        let dist_control = DistributionControl::load_checked(dist_info, &config.distribution_program)?;
        require!(!dist_control.is_paused, SecondaryMarketError::GlobalPause);
    }

    // 3. KYC Compliance Check (Buyer)
    let buyer_eligibility = InvestorEligibilityAccount::load_checked(
        &ctx.accounts.buyer_eligibility,
        &config.compliance_program,
    )?;
    
    require_keys_eq!(buyer_eligibility.wallet, ctx.accounts.buyer.key(), SecondaryMarketError::BuyerNotApproved);
    require!(buyer_eligibility.kyc_status == KycStatus::Approved, SecondaryMarketError::BuyerNotApproved);
    require!(buyer_eligibility.aml_status == AmlStatus::Clear, SecondaryMarketError::BuyerNotApproved);
    require!(buyer_eligibility.transfer_allowed, SecondaryMarketError::BuyerNotApproved);
    if buyer_eligibility.expiry_timestamp > 0 {
        require!(clock.unix_timestamp < buyer_eligibility.expiry_timestamp, SecondaryMarketError::BuyerNotApproved);
    }
    require!(!buyer_eligibility.reverification_required, SecondaryMarketError::BuyerNotApproved);

    // 4. Lockup Validation (Buyer Early Exit)
    if clock.unix_timestamp < project.lockup_end_ts {
        require!(buyer_eligibility.lockup_bypass, SecondaryMarketError::LockupActive);
    }

    // 5. Financial Math
    let cost = buy_amount
        .checked_mul(order.price_per_token)
        .ok_or(SecondaryMarketError::Overflow)?
        .checked_div(10u64.pow(project.token_decimals as u32))
        .ok_or(SecondaryMarketError::Overflow)?;

    require!(cost > 0, SecondaryMarketError::Overflow);

    let fee = cost
        .checked_mul(config.fee_basis_points as u64)
        .ok_or(SecondaryMarketError::Overflow)?
        .checked_div(10000)
        .ok_or(SecondaryMarketError::Overflow)?;

    let payment = cost.checked_sub(fee).ok_or(SecondaryMarketError::Overflow)?;

    // 6. Execute Stablecoin Payments
    let stablecoin_decimals = ctx.accounts.stablecoin_mint.decimals;
    
    if fee > 0 {
        let fee_ctx = CpiContext::new(
            ctx.accounts.stablecoin_program.to_account_info(),
            token_interface::TransferChecked {
                from: ctx.accounts.buyer_usdc_account.to_account_info(),
                to: ctx.accounts.fee_destination_usdc.to_account_info(),
                mint: ctx.accounts.stablecoin_mint.to_account_info(),
                authority: ctx.accounts.buyer.to_account_info(),
            }
        );
        token_interface::transfer_checked(fee_ctx, fee, stablecoin_decimals)?;
    }

    let payment_ctx = CpiContext::new(
        ctx.accounts.stablecoin_program.to_account_info(),
        token_interface::TransferChecked {
            from: ctx.accounts.buyer_usdc_account.to_account_info(),
            to: ctx.accounts.seller_usdc_account.to_account_info(),
            mint: ctx.accounts.stablecoin_mint.to_account_info(),
            authority: ctx.accounts.buyer.to_account_info(),
        }
    );
    token_interface::transfer_checked(payment_ctx, payment, stablecoin_decimals)?;

    // 7. Deliver Project Tokens from Escrow to Buyer
    let seeds = &[
        b"vault_authority".as_ref(),
        &[ctx.bumps.vault_authority],
    ];
    let signer = &[&seeds[..]];

    let mut ix = spl_token_2022::instruction::transfer_checked(
        ctx.accounts.token_program.key,
        ctx.accounts.escrow_vault.to_account_info().key,
        ctx.accounts.project_mint.to_account_info().key,
        ctx.accounts.buyer_token_account.to_account_info().key,
        ctx.accounts.vault_authority.to_account_info().key,
        &[],
        buy_amount,
        project.token_decimals,
    )?;

    let mut account_infos = vec![
        ctx.accounts.escrow_vault.to_account_info(),
        ctx.accounts.project_mint.to_account_info(),
        ctx.accounts.buyer_token_account.to_account_info(),
        ctx.accounts.vault_authority.to_account_info(),
        ctx.accounts.token_program.to_account_info(),
    ];

    for account in ctx.remaining_accounts.iter() {
        ix.accounts.push(AccountMeta {
            pubkey: *account.key,
            is_signer: account.is_signer,
            is_writable: account.is_writable,
        });
        account_infos.push(account.clone());
    }

    solana_program::program::invoke_signed(
        &ix,
        &account_infos,
        signer,
    )?;

    // 8. Update Order State
    order.remaining_quantity = order.remaining_quantity
        .checked_sub(buy_amount)
        .ok_or(SecondaryMarketError::Overflow)?;

    emit!(OrderFilled {
        order_id: order.key(),
        buyer: ctx.accounts.buyer.key(),
        seller: order.seller,
        project_mint: order.project_mint,
        amount_filled: buy_amount,
        price_per_token: order.price_per_token,
        fee_charged: fee,
        timestamp: clock.unix_timestamp,
    });

    // 9. Manual Account Closure if fully filled
    if order.remaining_quantity == 0 {
        let dest_info = ctx.accounts.seller.to_account_info();
        let order_info = order.to_account_info();
        
        let dest_lamports = dest_info.lamports();
        let order_lamports = order_info.lamports();
        
        **dest_info.lamports.borrow_mut() = dest_lamports
            .checked_add(order_lamports)
            .ok_or(SecondaryMarketError::Overflow)?;
        **order_info.lamports.borrow_mut() = 0;
        
        order_info.realloc(0, false)?;
        order_info.assign(&anchor_lang::solana_program::system_program::ID);
    }

    Ok(())
}

#[event]
pub struct OrderFilled {
    pub order_id:        Pubkey,
    pub buyer:           Pubkey,
    pub seller:          Pubkey,
    pub project_mint:    Pubkey,
    pub amount_filled:   u64,
    pub price_per_token: u64,
    pub fee_charged:     u64,
    pub timestamp:       i64,
}
