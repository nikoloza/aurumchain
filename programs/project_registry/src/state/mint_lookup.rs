use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct MintLookupAccount {
    /// The Project ID this mint belongs to.
    pub project_id: u64,
    /// The Project PDA address.
    pub project_pda: Pubkey,
    /// The timestamp when the lock-up ends.
    pub lockup_end_ts: i64,
    /// PDA bump.
    pub bump: u8,
}

impl MintLookupAccount {
    pub const SIZE: usize = 8 + 8 + 32 + 8 + 1;
}
