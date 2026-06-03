use anchor_lang::prelude::*;

mod errors;
mod logic;
mod state;

use crate::logic::*;

declare_id!("EZXJQXX2vYoDrUP6JUcqeShhqKpSRuDecLK9JUiVzkTz");

#[program]
pub mod allocation_distribution {
    use super::*;

    pub fn initialize_config(
        ctx:   Context<InitializeConfig>, 
        admin: Pubkey
    ) -> Result<()> {
        handle_initialize_config(ctx, admin)
    }

    pub fn create_epoch(
        ctx:              Context<CreateEpoch>,
        project_id:       u64,
        profit_per_token: u64,
        token_decimals:   u8,
    ) -> Result<()> {
        handle_create_epoch(ctx, project_id, profit_per_token, token_decimals)
    }

    pub fn execute_payout(ctx: Context<ExecutePayout>, snapshot_balance: u64) -> Result<()> {
        handle_execute_payout(ctx, snapshot_balance)
    }
}
