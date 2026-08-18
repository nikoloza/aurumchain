use anchor_lang::prelude::*;
use crate::state::*;
use crate::ComplianceError;
use spl_transfer_hook_interface::instruction::ExecuteInstruction;
use spl_tlv_account_resolution::state::ExtraAccountMetaList;
use spl_tlv_account_resolution::account::ExtraAccountMeta;
use spl_tlv_account_resolution::seeds::Seed;
use anchor_spl::token_interface::Mint;

pub fn handle_initialize_extra_account_meta_list(
    ctx: Context<InitializeExtraAccountMetaList>,
) -> Result<()> {
    let account_metas = vec![
        // Index 5: Control Account (Constant PDA)
        ExtraAccountMeta::new_with_seeds(
            &[Seed::Literal { bytes: b"compliance_control".to_vec() }],
            false, // is_signer
            false, // is_writable
        )?,
        // Index 6: Sender Eligibility PDA
        ExtraAccountMeta::new_with_seeds(
            &[
                Seed::Literal { bytes: b"eligibility".to_vec() },
                Seed::AccountKey { index: 3 }, // Source (Owner)
            ],
            false,
            false,
        )?,
        // Index 7: Receiver Eligibility PDA
        ExtraAccountMeta::new_with_seeds(
            &[
                Seed::Literal { bytes: b"eligibility".to_vec() },
                Seed::AccountData { account_index: 2, data_index: 32, length: 32 }, // Destination (Owner) extracted from Token Account Data
            ],
            false,
            false,
        )?,
        // Index 8: Mint-to-Project Lookup PDA
        ExtraAccountMeta::new_with_seeds(
            &[
                Seed::Literal { bytes: b"mint_lookup".to_vec() },
                Seed::AccountKey { index: 1 }, // Mint
            ],
            false,
            false,
        )?,
    ];

    // Initialize the ExtraAccountMetaList account
    let account = &ctx.accounts.extra_account_meta_list;
    let mut data = account.try_borrow_mut_data()?;
    
    // Wipe existing data to allow re-initialization for legacy tokens
    for byte in data.iter_mut() {
        *byte = 0;
    }
    
    ExtraAccountMetaList::init::<ExecuteInstruction>(&mut data, &account_metas)?;

    Ok(())
}

pub fn handle_transfer_hook(accounts: &TransferHook, _amount: u64) -> Result<()> {
    let clock = Clock::get()?;
    let control = &accounts.control;
    let bypass = control.kyc_bypass;

    // Load eligibility accounts
    let sender = InvestorEligibilityAccount::load_checked(&accounts.sender_eligibility)?;
    let receiver = InvestorEligibilityAccount::load_checked(&accounts.receiver_eligibility)?;

    // 1. Global Pause check
    if control.transfers_paused {
        return err!(ComplianceError::GlobalTransfersPaused);
    }

    // 2. MANDATORY LOCK-UP CHECK (Always enforced, even if KYC is bypassed)
    let lockup_end_ts = accounts.mint_lookup.lockup_end_ts;
    
    // If current time < lockup end time, block transfer
    // UNLESS the sender has an explicit lockup_bypass flag (admin/special)
    if clock.unix_timestamp < lockup_end_ts && !sender.lockup_bypass {
        return err!(ComplianceError::LockupPeriodActive);
    }

    // 3. Compliance Logic (KYC/AML) - Skippable via global bypass for testing
    if !bypass {
        // --- SENDER CHECKS ---
        if sender.aml_status == AmlStatus::Blocked {
            return err!(ComplianceError::SenderAmlBlocked);
        }
        if sender.kyc_status != KycStatus::Approved || !sender.transfer_allowed {
            return err!(ComplianceError::SenderNotApproved);
        }
        if sender.expiry_timestamp > 0 && clock.unix_timestamp >= sender.expiry_timestamp {
            return err!(ComplianceError::SenderKycExpired);
        }

        // --- RECEIVER CHECKS ---
        if receiver.aml_status == AmlStatus::Blocked {
            return err!(ComplianceError::ReceiverAmlBlocked);
        }
        if receiver.kyc_status != KycStatus::Approved || !receiver.transfer_allowed {
            return err!(ComplianceError::ReceiverNotApproved);
        }
        if receiver.expiry_timestamp > 0 && clock.unix_timestamp >= receiver.expiry_timestamp {
            return err!(ComplianceError::ReceiverKycExpired);
        }
    }

    Ok(())
}

#[derive(Accounts)]
pub struct InitializeExtraAccountMetaList<'info> {
    #[account(
        init_if_needed,
        seeds = [b"extra-account-metas", mint.key().as_ref()],
        bump,
        payer = payer,
        space = ExtraAccountMetaList::size_of(4)? 
    )]
    /// CHECK: ExtraAccountMetaList account
    pub extra_account_meta_list: UncheckedAccount<'info>,
    
    pub mint: InterfaceAccount<'info, Mint>,
    
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferHook<'info> {
    #[account(
        token::mint = mint,
        token::authority = owner,
    )]
    pub source_token: InterfaceAccount<'info, anchor_spl::token_interface::TokenAccount>,
    
    pub mint: InterfaceAccount<'info, Mint>,
    
    #[account(
        token::mint = mint,
    )]
    pub destination_token: InterfaceAccount<'info, anchor_spl::token_interface::TokenAccount>,
    
    /// CHECK: source token account owner
    pub owner: UncheckedAccount<'info>,
    
    /// CHECK: ExtraAccountMetaList account
    #[account(
        seeds = [b"extra-account-metas", mint.key().as_ref()],
        bump,
    )]
    pub extra_account_meta_list: UncheckedAccount<'info>,

    // Extra Accounts (indexed 5, 6, 7, 8 in the meta list)
    #[account(
        seeds = [b"compliance_control"],
        bump = control.bump,
    )]
    pub control: Account<'info, ComplianceControl>,

    /// CHECK: Sender Eligibility
    pub sender_eligibility: UncheckedAccount<'info>,

    /// CHECK: Receiver Eligibility
    pub receiver_eligibility: UncheckedAccount<'info>,

    /// Mint-to-Project Lookup (Index 8)
    pub mint_lookup: Account<'info, MintToProjectLookup>,
}
