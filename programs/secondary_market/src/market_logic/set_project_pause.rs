use anchor_lang::prelude::*;
use anchor_spl::token_interface::Mint;
use crate::state::{MarketConfig, ProjectPause, SecondaryMarketError};

#[derive(Accounts)]
pub struct SetProjectPause<'info> {
    #[account(
        seeds = [b"config"],
        bump = config.bump,
        has_one = authority @ SecondaryMarketError::Unauthorized
    )]
    pub config: Account<'info, MarketConfig>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub project_mint: InterfaceAccount<'info, Mint>,

    #[account(
        init_if_needed,
        payer = authority,
        space = ProjectPause::SIZE,
        seeds = [b"project_pause", project_mint.key().as_ref()],
        bump
    )]
    pub project_pause: Account<'info, ProjectPause>,

    pub system_program: Program<'info, System>,
}

pub fn handle_set_project_pause<'info>(
    ctx: Context<'_, '_, '_, 'info, SetProjectPause<'info>>,
    is_paused: bool,
) -> Result<()> {
    let project_pause = &mut ctx.accounts.project_pause;
    project_pause.project_mint = ctx.accounts.project_mint.key();
    project_pause.is_paused = is_paused;
    project_pause.bump = ctx.bumps.project_pause;
    msg!("Project pause status set to {} for mint {}", is_paused, project_pause.project_mint);
    Ok(())
}
