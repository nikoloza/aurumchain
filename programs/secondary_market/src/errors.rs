use anchor_lang::prelude::*;

#[error_code]
pub enum SecondaryMarketError {
    #[msg("Caller is not authorized to perform this action")]
    Unauthorized,
    #[msg("Secondary trading is globally paused")]
    GlobalPause,
    #[msg("Trading is paused for this project")]
    ProjectPause,
    #[msg("Project is not in Active status")]
    InvalidStatus,
    #[msg("Project lock-up period is active")]
    LockupActive,
    #[msg("Seller wallet is not KYC-approved or transfer not allowed")]
    SellerNotApproved,
    #[msg("Buyer wallet is not KYC-approved or transfer not allowed")]
    BuyerNotApproved,
    #[msg("Order does not have enough remaining tokens to fill this amount")]
    InsufficientRemaining,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Mint address mismatch")]
    InvalidMint,
    #[msg("Stablecoin mint mismatch")]
    InvalidStablecoin,
    #[msg("Escrow vault mismatch")]
    InvalidEscrow,
    #[msg("Project registry program mismatch")]
    InvalidRegistry,
    #[msg("Compliance program mismatch")]
    InvalidCompliance,
    #[msg("Distribution program mismatch")]
    InvalidDistribution,
}
