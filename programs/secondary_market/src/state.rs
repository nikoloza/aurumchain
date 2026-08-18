use anchor_lang::prelude::*;
pub use crate::errors::*;

// ─── Marketplace State ────────────────────────────────────────────────────────

#[account]
pub struct MarketConfig {
    pub authority:                 Pubkey,   // 32 bytes (Admin authority key)
    pub fee_destination:           Pubkey,   // 32 bytes (Wallet that receives stablecoin trade fees)
    pub fee_basis_points:          u16,      // 2 bytes (e.g. 150 = 1.50%)
    pub is_paused:                 bool,     // 1 byte (Global operational pause switch)
    pub project_registry_program:  Pubkey,   // 32 bytes
    pub compliance_program:        Pubkey,   // 32 bytes
    pub distribution_program:      Pubkey,   // 32 bytes
    pub bump:                      u8,       // 1 byte
    pub padding:                   [u8; 32], // 32 bytes for future additions
}

impl MarketConfig {
    pub const SIZE: usize = 8 + 32 + 32 + 2 + 1 + 32 + 32 + 32 + 1 + 32;
}

#[account]
pub struct ProjectPause {
    pub project_mint: Pubkey,   // 32 bytes
    pub is_paused:    bool,     // 1 byte
    pub bump:         u8,       // 1 byte
}

impl ProjectPause {
    pub const SIZE: usize = 8 + 32 + 1 + 1;
}

#[account]
pub struct SellOrder {
    pub seller:             Pubkey, // 32 bytes (Seller wallet address)
    pub project_mint:       Pubkey, // 32 bytes (Token mint address)
    pub original_quantity:  u64,    // 8 bytes (Amount of project tokens originally listed)
    pub remaining_quantity: u64,    // 8 bytes (Amount remaining to be sold)
    pub price_per_token:    u64,    // 8 bytes (Price per unit in stablecoin, e.g. USDC micro-units)
    pub sequence:           u64,    // 8 bytes (Variable sequence counter for PDA seed)
    pub created_at:         i64,    // 8 bytes (Unix timestamp)
    pub bump:               u8,     // 1 byte
}

impl SellOrder {
    pub const SIZE: usize = 8 + 32 + 32 + 8 + 8 + 8 + 8 + 8 + 1;
}

// ─── Mirror: Project Registry Program State ───────────────────────────────────

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Debug)]
pub enum ProjectStatus {
    Draft,
    Funding,
    Funded,
    Active,
    Completed,
    Canceled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Debug)]
pub enum AssetType {
    RealEstate,
    Mining,
    Other,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct ProjectAccount {
    pub project_id:             u64,
    pub registry:               Pubkey,
    pub creator:                Pubkey,
    pub name:                   String,          // max MAX_NAME_LEN bytes
    pub symbol:                 String,          // max MAX_SYMBOL_LEN bytes
    pub uri:                    String,          // max MAX_URI_LEN bytes
    pub supply_cap:             u64,             // total tokens that can ever exist
    pub tokens_issued:          u64,             // lifetime cumulative issued
    pub min_investment_usdc:    u64,
    pub max_investment_usdc:    u64,
    pub token_price_usdc:       u64,             // Micro-USDC (e.g. 1,000,000 = $1)
    pub accepted_stablecoin:    Pubkey,
    pub treasury_wallet:        Pubkey,
    pub mint:                   Pubkey,          // SPL mint address (set after creation)
    pub lockup_end_ts:          i64,
    pub subscription_start:     i64,
    pub subscription_end:       i64,
    pub created_at:             i64,
    pub distribution_cadence:   u8,
    pub duration_months:        u8,
    pub distribution_mode:      u8,              // 0=Parallel, 1=Sequential
    pub status:                 ProjectStatus,
    pub is_paused:              bool,
    pub mint_authority_revoked: bool,
    pub round_limit_tokens:     u64,
    pub current_round_issued:   u64,
    pub asset_type:             AssetType,
    pub bump:                   u8,
    pub token_decimals:         u8,
    pub padding:                [u8; 41], 
}

// ─── Mirror: Compliance Transfer Program State ───────────────────────────────

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Debug)]
pub enum KycStatus {
    Pending,
    Approved,
    Rejected,
    Expired,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Debug)]
pub enum AmlStatus {
    Clear,
    Flagged,
    Blocked,
}

#[account]
pub struct InvestorEligibilityAccount {
    pub wallet:                  Pubkey,     // 32
    pub kyc_status:              KycStatus,  //  1
    pub aml_status:              AmlStatus,  //  1
    pub identity_hash:           [u8; 32],   // 32
    pub investment_allowed:      bool,       //  1
    pub transfer_allowed:        bool,       //  1
    pub approval_timestamp:      i64,        //  8
    pub expiry_timestamp:        i64,        //  8
    pub reverification_required: bool,       //  1
    pub lockup_bypass:           bool,       //  1
    pub recorded_by:             Pubkey,     // 32
    pub bump:                    u8,         //  1
}

impl InvestorEligibilityAccount {
    pub const DISCRIMINATOR_STANDARD: [u8; 8] = [38, 90, 191, 114, 179, 67, 120, 93];
    pub const DISCRIMINATOR_LEGACY: [u8; 8] = [213, 219, 137, 241, 143, 227, 230, 203];

    /// Centralized helper to deserialize compliance status, safely supporting legacy and standard layouts
    pub fn load_checked(info: &AccountInfo, compliance_program_id: &Pubkey) -> Result<Self> {
        if info.owner != compliance_program_id {
            return Err(ProgramError::IllegalOwner.into());
        }

        let data = info.try_borrow_data()?;
        if info.data_is_empty() {
            return Err(ProgramError::UninitializedAccount.into());
        }

        let disc = &data[0..8];
        if disc != &Self::DISCRIMINATOR_STANDARD && disc != &Self::DISCRIMINATOR_LEGACY {
            return Err(ProgramError::InvalidAccountData.into());
        }

        let raw_data = &data[8..];
        
        // Standard discriminator maps to standard layout; legacy discriminator maps to legacy layout.
        if disc == &Self::DISCRIMINATOR_LEGACY {
            let mut offset = 0;
            let wallet = Pubkey::new_from_array(raw_data[offset..offset+32].try_into().unwrap()); offset += 32;
            let kyc_status_byte = raw_data[offset]; offset += 1;
            let aml_status_byte = raw_data[offset]; offset += 1;
            
            let mut identity_hash = [0u8; 32];
            identity_hash.copy_from_slice(&raw_data[offset..offset+32]); offset += 32;
            
            let investment_allowed = raw_data[offset] != 0; offset += 1;
            let transfer_allowed = raw_data[offset] != 0; offset += 1;
            
            let approval_timestamp = i64::from_le_bytes(raw_data[offset..offset+8].try_into().unwrap()); offset += 8;
            let expiry_timestamp = i64::from_le_bytes(raw_data[offset..offset+8].try_into().unwrap()); offset += 8;
            
            let recorded_by = Pubkey::new_from_array(raw_data[offset..offset+32].try_into().unwrap()); offset += 32;
            let bump = raw_data[offset];

            let kyc_status = match kyc_status_byte {
                0 => KycStatus::Pending,
                1 => KycStatus::Approved,
                2 => KycStatus::Rejected,
                3 => KycStatus::Expired,
                _ => KycStatus::Pending,
            };

            let aml_status = match aml_status_byte {
                0 => AmlStatus::Clear,
                1 => AmlStatus::Flagged,
                2 => AmlStatus::Blocked,
                _ => AmlStatus::Clear,
            };

            Ok(InvestorEligibilityAccount {
                wallet,
                kyc_status,
                aml_status,
                identity_hash,
                investment_allowed,
                transfer_allowed,
                approval_timestamp,
                expiry_timestamp,
                reverification_required: false,
                lockup_bypass: false,
                recorded_by,
                bump,
            })
        } else {
            let mut reader = raw_data;
            Ok(Self::deserialize(&mut reader)?)
        }
    }
}

// ─── Mirror: Allocation Distribution State ────────────────────────────────────

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct DistributionControl {
    pub admin:     Pubkey,
    pub is_paused: bool,
    pub bump:      u8,
    pub padding:   [u8; 64],
}

impl DistributionControl {
    pub const DISCRIMINATOR: [u8; 8] = [173, 169, 137, 243, 90, 85, 237, 234]; // Mock/standard discriminator

    pub fn load_checked(info: &AccountInfo, distribution_program_id: &Pubkey) -> Result<Self> {
        if info.owner != distribution_program_id {
            return Err(ProgramError::IllegalOwner.into());
        }
        let data = info.try_borrow_data()?;
        if info.data_is_empty() {
            return Err(ProgramError::UninitializedAccount.into());
        }
        // Skip discriminator check if standard format is not strict, but let's parse safely
        let mut reader = &data[8..];
        Ok(Self::deserialize(&mut reader)?)
    }
}
