use anchor_lang::prelude::*;
use crate::state::{MarketConfig, SecondaryMarketError};

#[derive(Accounts)]
pub struct UpdateMarketConfig<'info> {
    #[account(
        mut,
        seeds = [b"config"],
        bump = config.bump,
        has_one = authority @ SecondaryMarketError::Unauthorized
    )]
    pub config: Account<'info, MarketConfig>,

    pub authority: Signer<'info>,
}

pub fn handle_update_market_config<'info>(
    ctx: Context<'_, '_, '_, 'info, UpdateMarketConfig<'info>>,
    fee_basis_points: Option<u16>,
    is_paused: Option<bool>,
    fee_destination: Option<Pubkey>,
) -> Result<()> {
    let config = &mut ctx.accounts.config;
    if let Some(bps) = fee_basis_points {
        config.fee_basis_points = bps;
    }
    if let Some(paused) = is_paused {
        config.is_paused = paused;
    }
    if let Some(dest) = fee_destination {
        config.fee_destination = dest;
    }
    msg!("Market config updated.");
    Ok(())
}
