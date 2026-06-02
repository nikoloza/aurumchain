use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};
use crate::state::*;

#[derive(Accounts)]
#[instruction(amount: u64, price_per_token: u64, sequence: u64)]
pub struct CreateSellOrder<'info> {
    #[account(
        seeds = [b"config"],
        bump = config.bump,
    )]
    pub config: Account<'info, MarketConfig>,

    #[account(mut)]
    pub seller: Signer<'info>,

    #[account(
        mut,
        token::mint = project_mint,
        token::authority = seller
    )]
    pub seller_token_account: InterfaceAccount<'info, TokenAccount>,

    pub project_mint: InterfaceAccount<'info, Mint>,

    /// Shared Escrow Vault token account for this project, owned by the program's vault authority PDA.
    #[account(
        init_if_needed,
        payer = seller,
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
        init,
        payer = seller,
        space = SellOrder::SIZE,
        seeds = [b"sell_order", seller.key().as_ref(), sequence.to_le_bytes().as_ref()],
        bump
    )]
    pub sell_order: Account<'info, SellOrder>,

    /// CHECK: Project Registry account, validated in handler (owner & signature alignment)
    pub project_account: UncheckedAccount<'info>,

    /// CHECK: Seller Eligibility Account (Compliance), validated in handler
    pub seller_eligibility: UncheckedAccount<'info>,

    /// CHECK: Optional Project Pause PDA, checked dynamically if initialized
    pub project_pause: UncheckedAccount<'info>,

    /// CHECK: Optional Distribution Control Account, checked dynamically if initialized
    pub distribution_control: UncheckedAccount<'info>,

    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

pub fn handle_create_sell_order<'info>(
    ctx: Context<'_, '_, '_, 'info, CreateSellOrder<'info>>,
    amount: u64,
    price_per_token: u64,
    sequence: u64,
) -> Result<()> {
    let clock = Clock::get()?;
    let config = &ctx.accounts.config;

    // 1. Operational Safeguards
    require!(!config.is_paused, SecondaryMarketError::GlobalPause);

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

    // 2. Validate Project Registry Account & State
    let project_info = &ctx.accounts.project_account;
    require_keys_eq!(project_info.owner.key(), config.project_registry_program, SecondaryMarketError::InvalidRegistry);
    
    let mut p_data: &[u8] = &project_info.data.borrow()[8..];
    let project = ProjectAccount::deserialize(&mut p_data)?;
    require_keys_eq!(project.mint, ctx.accounts.project_mint.key(), SecondaryMarketError::InvalidMint);
    require!(project.status == ProjectStatus::Active, SecondaryMarketError::InvalidStatus);
    require!(!project.is_paused, SecondaryMarketError::ProjectPause);

    // 3. Validate Distribution Control State (if provided)
    if ctx.accounts.distribution_control.to_account_info().data_len() > 0 {
        let dist_info = &ctx.accounts.distribution_control;
        require_keys_eq!(dist_info.owner.key(), config.distribution_program, SecondaryMarketError::InvalidDistribution);
        let dist_control = DistributionControl::load_checked(dist_info, &config.distribution_program)?;
        require!(!dist_control.is_paused, SecondaryMarketError::GlobalPause);
    }

    // 4. KYC Compliance Check (Seller)
    let seller_eligibility = InvestorEligibilityAccount::load_checked(
        &ctx.accounts.seller_eligibility,
        &config.compliance_program,
    )?;
    
    require_keys_eq!(seller_eligibility.wallet, ctx.accounts.seller.key(), SecondaryMarketError::SellerNotApproved);
    require!(seller_eligibility.kyc_status == KycStatus::Approved, SecondaryMarketError::SellerNotApproved);
    require!(seller_eligibility.aml_status == AmlStatus::Clear, SecondaryMarketError::SellerNotApproved);
    require!(seller_eligibility.transfer_allowed, SecondaryMarketError::SellerNotApproved);
    if seller_eligibility.expiry_timestamp > 0 {
        require!(clock.unix_timestamp < seller_eligibility.expiry_timestamp, SecondaryMarketError::SellerNotApproved);
    }
    require!(!seller_eligibility.reverification_required, SecondaryMarketError::SellerNotApproved);

    // 5. Lockup Validation
    if clock.unix_timestamp < project.lockup_end_ts {
        require!(seller_eligibility.lockup_bypass, SecondaryMarketError::LockupActive);
    }

    // 6. Token Math / Transfer (Escrow Deposit)
    let order = &mut ctx.accounts.sell_order;
    order.seller = ctx.accounts.seller.key();
    order.project_mint = ctx.accounts.project_mint.key();
    order.original_quantity = amount;
    order.remaining_quantity = amount;
    order.price_per_token = price_per_token;
    order.sequence = sequence;
    order.created_at = clock.unix_timestamp;
    order.bump = ctx.bumps.sell_order;

    // Perform CPI Token-2022 Transfer (Seller -> Escrow Vault)
    let mut ix = spl_token_2022::instruction::transfer_checked(
        ctx.accounts.token_program.key,
        ctx.accounts.seller_token_account.to_account_info().key,
        ctx.accounts.project_mint.to_account_info().key,
        ctx.accounts.escrow_vault.to_account_info().key,
        ctx.accounts.seller.to_account_info().key,
        &[],
        amount,
        project.token_decimals,
    )?;

    let mut account_infos = vec![
        ctx.accounts.seller_token_account.to_account_info(),
        ctx.accounts.project_mint.to_account_info(),
        ctx.accounts.escrow_vault.to_account_info(),
        ctx.accounts.seller.to_account_info(),
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

    solana_program::program::invoke(
        &ix,
        &account_infos,
    )?;

    emit!(OrderCreated {
        order_id: order.key(),
        seller: order.seller,
        project_mint: order.project_mint,
        amount,
        price_per_token,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}

#[event]
pub struct OrderCreated {
    pub order_id:        Pubkey,
    pub seller:          Pubkey,
    pub project_mint:    Pubkey,
    pub amount:          u64,
    pub price_per_token: u64,
    pub timestamp:       i64,
}
