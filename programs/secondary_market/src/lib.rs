use anchor_lang::prelude::*;

pub mod state;
pub mod market_logic;
pub mod errors;

use crate::market_logic::*;

declare_id!("8sQeYFf2kDEM33n3ZjnwEsMqwriR6eFNhjtAg7J5Lo6c"); // Placeholder for deployment, upgradeable via Solpg

#[program]
pub mod secondary_market {
    use super::*;

    pub fn initialize_market<'info>(
        ctx: Context<'_, '_, '_, 'info, InitializeMarket<'info>>,
        fee_basis_points: u16,
        project_registry_program: Pubkey,
        compliance_program: Pubkey,
        distribution_program: Pubkey,
    ) -> Result<()> {
        handle_initialize_market(
            ctx,
            fee_basis_points,
            project_registry_program,
            compliance_program,
            distribution_program,
        )
    }

    pub fn update_market_config<'info>(
        ctx: Context<'_, '_, '_, 'info, UpdateMarketConfig<'info>>,
        fee_basis_points: Option<u16>,
        is_paused: Option<bool>,
        fee_destination: Option<Pubkey>,
    ) -> Result<()> {
        handle_update_market_config(ctx, fee_basis_points, is_paused, fee_destination)
    }

    pub fn set_project_pause<'info>(
        ctx: Context<'_, '_, '_, 'info, SetProjectPause<'info>>,
        is_paused: bool,
    ) -> Result<()> {
        handle_set_project_pause(ctx, is_paused)
    }

    pub fn create_sell_order<'info>(
        ctx: Context<'_, '_, '_, 'info, CreateSellOrder<'info>>,
        amount: u64,
        price_per_token: u64,
        sequence: u64,
    ) -> Result<()> {
        handle_create_sell_order(ctx, amount, price_per_token, sequence)
    }

    pub fn cancel_sell_order<'info>(ctx: Context<'_, '_, '_, 'info, CancelSellOrder<'info>>) -> Result<()> {
        handle_cancel_sell_order(ctx)
    }

    pub fn fill_order<'info>(ctx: Context<'_, '_, '_, 'info, FillOrder<'info>>, buy_amount: u64) -> Result<()> {
        handle_fill_order(ctx, buy_amount)
    }
}
