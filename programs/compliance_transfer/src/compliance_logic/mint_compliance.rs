use anchor_lang::prelude::*;
use crate::state::*;
use crate::ComplianceError;

#[derive(Accounts)]
pub struct SyncMintCompliance<'info> {
    #[account(
        mut,
        seeds = [b"compliance_control"],
        bump = control.bump,
    )]
    pub control: Account<'info, ComplianceControl>,

    #[account(
        mut,
        constraint = (
            authority.key() == control.authority ||
            authority.key() == control.super_admin
        ) @ ComplianceError::Unauthorized
    )]
    pub authority: Signer<'info>,

    #[account(
        init_if_needed,
        payer = authority,
        space = MintToProjectLookup::SIZE,
        seeds = [b"mint_lookup", mint.key().as_ref()],
        bump
    )]
    pub mint_lookup: Account<'info, MintToProjectLookup>,

    /// The Registry Project account to sync from
    /// CHECK: We deserialize this manually and check its mint
    pub registry_project: UncheckedAccount<'info>,

    /// The mint for which we are syncing compliance
    pub mint: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handle_sync_mint_compliance(
    ctx: Context<SyncMintCompliance>,
) -> Result<()> {
    // 1. Manually deserialize the ProjectAccount from the Registry program
    let project_info = &ctx.accounts.registry_project;
    let data = project_info.try_borrow_data()?;
    let mut data_ptr = &data[8..]; 
    
    let project = ProjectAccount::deserialize(&mut data_ptr)
        .map_err(|_| ProgramError::InvalidAccountData)?;

    // 2. CRITICAL VALIDATION: Ensure this project record actually belongs to this mint
    require_keys_eq!(
        project.mint, 
        ctx.accounts.mint.key(), 
        ComplianceError::InvalidRegistryProgram
    );

    // 3. Status validation: Ensure project is in a state where lockup is defined
    require!(
        project.status == ProjectStatus::Funding || project.status == ProjectStatus::Active || project.status == ProjectStatus::Funded,
        ComplianceError::ProjectNotActive
    );

    let lookup = &mut ctx.accounts.mint_lookup;
    lookup.project_id    = project.project_id;
    lookup.project_pda   = project_info.key();
    lookup.lockup_end_ts = project.lockup_end_ts;

    msg!("Synced compliance for mint {}: lockup={}", 
        ctx.accounts.mint.key(), project.lockup_end_ts);

    Ok(())
}
