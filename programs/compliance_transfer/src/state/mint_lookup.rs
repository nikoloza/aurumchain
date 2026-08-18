use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct MintToProjectLookup {
    pub project_id: u64,
    pub project_pda: Pubkey,
    pub lockup_end_ts: i64,
}

impl MintToProjectLookup {
    pub const SIZE: usize = 8 + 8 + 32 + 8;
}
