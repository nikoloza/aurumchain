use anchor_lang::prelude::*;
use crate::state::MarketConfig;

#[derive(Accounts)]
pub struct InitializeMarket<'info> {
    #[account(
        init,
        payer = admin,
        space = MarketConfig::SIZE,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, MarketConfig>,

    /// CHECK: Recipient of trading fees in stablecoin
    pub fee_destination: UncheckedAccount<'info>,

    #[account(mut)]
    pub admin: Signer<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handle_initialize_market<'info>(
    ctx: Context<'_, '_, '_, 'info, InitializeMarket<'info>>,
    fee_basis_points: u16,
    project_registry_program: Pubkey,
    compliance_program: Pubkey,
    distribution_program: Pubkey,
) -> Result<()> {
    let config = &mut ctx.accounts.config;
    config.authority = ctx.accounts.admin.key();
    config.fee_destination = ctx.accounts.fee_destination.key();
    config.fee_basis_points = fee_basis_points;
    config.is_paused = false;
    config.project_registry_program = project_registry_program;
    config.compliance_program = compliance_program;
    config.distribution_program = distribution_program;
    config.bump = ctx.bumps.config;

    msg!("Secondary Market Initialized. Authority: {}", config.authority);
    Ok(())
}
