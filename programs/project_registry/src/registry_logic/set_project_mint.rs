use anchor_lang::prelude::*;
use crate::state::*;
use crate::RegistryError;
use anchor_spl::token_interface::{Mint, Token2022};

#[derive(Accounts)]
pub struct SetProjectMint<'info> {
    #[account(
        seeds = [b"control"],
        bump,
    )]
    pub control: Account<'info, ControlAccount>,

    #[account(mut)]
    pub project: Account<'info, ProjectAccount>,

    /// The Mint must be owned by the Token-2022 program.
    #[account(
        constraint = mint.to_account_info().owner == &token_2022_program.key() @ RegistryError::InvalidTokenProgram
    )]
    pub mint: InterfaceAccount<'info, Mint>,

    pub token_2022_program: Program<'info, Token2022>,

    #[account(
        mut,
        constraint = (
            admin.key() == control.super_admin ||
            admin.key() == control.operational_admin
        ) @ RegistryError::Unauthorized
    )]
    pub admin: Signer<'info>,

    #[account(
        init,
        payer = admin,
        space = MintLookupAccount::SIZE,
        seeds = [b"mint_lookup", mint.key().as_ref()],
        bump
    )]
    pub mint_lookup: Account<'info, MintLookupAccount>,

    pub system_program: Program<'info, System>,
}

pub fn handle_set_project_mint(
    ctx: Context<SetProjectMint>,
) -> Result<()> {
    let project = &mut ctx.accounts.project;
    let mint_key = ctx.accounts.mint.key();

    require!(
        project.mint == Pubkey::default(),
        RegistryError::MintAlreadySet
    );
    require!(mint_key != Pubkey::default(), RegistryError::InvalidMint);

    project.mint = mint_key;

    // ── Create Lookup Record ──────────────────────────────────────────────────
    let mint_lookup = &mut ctx.accounts.mint_lookup;
    mint_lookup.project_id = project.project_id;
    mint_lookup.project_pda = project.key();
    mint_lookup.lockup_end_ts = project.lockup_end_ts;
    mint_lookup.bump = ctx.bumps.mint_lookup;

    emit!(MintRegistered {
        project_id: project.project_id,
        mint:       mint_key,
    });

    Ok(())
}

#[event]
pub struct MintRegistered {
    pub project_id: u64,
    pub mint:       Pubkey,
}
