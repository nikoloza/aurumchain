use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, Burn, Mint, TokenInterface, TokenAccount};
use crate::state::*;
use crate::RegistryError;

// ─── Accounts ─────────────────────────────────────────────────────────────────
#[derive(Accounts)]
pub struct BurnTokens<'info> {
    #[account(
        seeds = [b"control"],
        bump,
    )]
    pub control: Account<'info, ControlAccount>,

    #[account(
        mut,
        seeds = [b"project", project.project_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub project: Account<'info, ProjectAccount>,

    #[account(
        mut,
        constraint = mint.key() == project.mint @ RegistryError::InvalidMint
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    #[account(mut)]
    pub target_token_account: InterfaceAccount<'info, TokenAccount>,

    /// Authorised caller: super_admin or operational_admin.
    #[account(
        constraint = (
            admin.key() == control.super_admin ||
            admin.key() == control.operational_admin
        ) @ RegistryError::Unauthorized
    )]
    pub admin: Signer<'info>,

    pub token_program: Interface<'info, TokenInterface>,
}

// ─── Handler ──────────────────────────────────────────────────────────────────
pub fn handle_burn_tokens(
    ctx:    Context<BurnTokens>,
    amount: u64,
    _reason_code: u8,
    _audit_hash: String, // Kept in params for auditability (logs)
) -> Result<()> {
    require!(!ctx.accounts.control.is_emergency_paused, RegistryError::Unauthorized);

    let project = &mut ctx.accounts.project;

    // ── Update State ──────────────────────────────────────────────────────────
    project.tokens_issued = project.tokens_issued
        .checked_sub(amount)
        .ok_or(RegistryError::Overflow)?;

    // ── CPI: burn tokens ──────────────────────────────────────────────────────
    // Note: This requires the admin to have 'Burn' authority or the user to sign.
    // In a 'correction' path, usually the program or a permanent delegate signs.
    token_interface::burn(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.mint.to_account_info(),
                from: ctx.accounts.target_token_account.to_account_info(),
                authority: ctx.accounts.admin.to_account_info(),
            },
        ),
        amount,
    )?;

    emit!(TokensBurned {
        project_id: project.project_id,
        target:     ctx.accounts.target_token_account.owner,
        amount,
        reason_code: _reason_code,
        audit_hash: _audit_hash,
    });

    Ok(())
}

// ─── Event ────────────────────────────────────────────────────────────────────
#[event]
pub struct TokensBurned {
    pub project_id: u64,
    pub target:     Pubkey,
    pub amount:     u64,
    pub reason_code: u8,
    pub audit_hash: String,
}
