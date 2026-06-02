use anchor_lang::prelude::*;
use anchor_spl::token_interface::{Mint, TokenAccount, TokenInterface};
use crate::state::*;

#[derive(Accounts)]
pub struct CancelSellOrder<'info> {
    #[account(
        mut,
        seeds = [b"sell_order", seller.key().as_ref(), sell_order.sequence.to_le_bytes().as_ref()],
        bump = sell_order.bump,
        close = seller
    )]
    pub sell_order: Account<'info, SellOrder>,

    /// CHECK: The seller address to close rent and refund tokens
    #[account(
        mut,
        constraint = (
            seller.key() == sell_order.seller || 
            seller.key() == config.authority
        ) @ SecondaryMarketError::Unauthorized
    )]
    pub seller: UncheckedAccount<'info>,

    #[account(
        mut,
        token::mint = project_mint,
        token::authority = seller
    )]
    pub seller_token_account: InterfaceAccount<'info, TokenAccount>,

    pub project_mint: InterfaceAccount<'info, Mint>,

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
        seeds = [b"config"],
        bump = config.bump,
    )]
    pub config: Account<'info, MarketConfig>,

    /// CHECK: Project Registry account, validated in handler
    pub project_account: UncheckedAccount<'info>,

    pub token_program: Interface<'info, TokenInterface>,
}

pub fn handle_cancel_sell_order<'info>(
    ctx: Context<'_, '_, '_, 'info, CancelSellOrder<'info>>,
) -> Result<()> {
    let clock = Clock::get()?;
    let order = &ctx.accounts.sell_order;
    let amount = order.remaining_quantity;

    require!(amount > 0, SecondaryMarketError::InsufficientRemaining);

    // Perform CPI Token-2022 Transfer (Escrow Vault -> Seller)
    // Signed by vault_authority PDA
    let seeds = &[
        b"vault_authority".as_ref(),
        &[ctx.bumps.vault_authority],
    ];
    let signer = &[&seeds[..]];

    let project_info = &ctx.accounts.project_account;
    let mut p_data: &[u8] = &project_info.data.borrow()[8..];
    let project = ProjectAccount::deserialize(&mut p_data)?;

    let mut ix = spl_token_2022::instruction::transfer_checked(
        ctx.accounts.token_program.key,
        ctx.accounts.escrow_vault.to_account_info().key,
        ctx.accounts.project_mint.to_account_info().key,
        ctx.accounts.seller_token_account.to_account_info().key,
        ctx.accounts.vault_authority.to_account_info().key,
        &[],
        amount,
        project.token_decimals,
    )?;

    let mut account_infos = vec![
        ctx.accounts.escrow_vault.to_account_info(),
        ctx.accounts.project_mint.to_account_info(),
        ctx.accounts.seller_token_account.to_account_info(),
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

    emit!(OrderCancelled {
        order_id: order.key(),
        seller: order.seller,
        project_mint: order.project_mint,
        amount_refunded: amount,
        timestamp: clock.unix_timestamp,
    });

    Ok(())
}

#[event]
pub struct OrderCancelled {
    pub order_id:        Pubkey,
    pub seller:          Pubkey,
    pub project_mint:    Pubkey,
    pub amount_refunded: u64,
    pub timestamp:       i64,
}
