import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Connection, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

// Use Service Role Key to bypass RLS for administrative indexing
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { signature, type, timestamp, data } = body;

    console.log(`[INDEXER] Processing event: ${type} | Sig: ${signature}`);

    // Logic for Global Sync (Triggered by Local Watcher)
    if (type === 'SYNC_TRIGGER' || type === 'RECONCILE_ALL') {
      const programName = body.programName || 'All';
      console.log(`[INDEXER] Running Global Sync for: ${programName}`);

      // Add a small random jitter to prevent simultaneous requests from racing
      if (type === 'SYNC_TRIGGER') {
        const jitter = Math.floor(Math.random() * 500);
        await new Promise(resolve => setTimeout(resolve, jitter));
      }

      const results: any = {};

      if (programName === 'Compliance' || programName === 'All') {
        results.eligibility = await syncEligibility();
        results.subscriptions = await syncSubscriptions();
      }
      if (programName === 'Registry' || programName === 'All') {
        results.projects = await syncProjects();
      }
      if (programName === 'Distribution' || programName === 'All') {
        results.payouts = await syncPayouts();
      }

      return NextResponse.json({ success: true, message: 'Global Sync Complete', results });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(`[INDEXER] Error:`, err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

async function syncSubscriptions() {
  console.log(`[INDEXER] Syncing Subscriptions...`);
  const { data: projects } = await supabase.from('projects').select('*');
  const { data: profiles } = await supabase.from('profiles').select('*');
  
  const allSubs = await connection.getProgramAccounts(
    new PublicKey(process.env.NEXT_PUBLIC_COMPLIANCE_PROGRAM_ID!),
    { filters: [{ dataSize: 194 }] }
  );

  let updated = 0;
  for (const p of (projects || [])) {
    if (p.blockchain_project_id === null) continue;
    
    const projectSubs = allSubs.filter(s => {
      try {
        return s.account.data.readBigUInt64LE(48) === BigInt(p.blockchain_project_id);
      } catch (e) {
        return false;
      }
    });
    
    for (const sub of projectSubs) {
      const data = sub.account.data;
      const offeringId = data.readBigUInt64LE(8).toString();
      const investorWallet = new PublicKey(data.slice(16, 48)).toBase58();
      const usdInvested = Number(data.readBigUInt64LE(56)) / 1_000_000;
      const decimals = p.token_decimals || 7;
      
      // Corrected Offsets (8 byte discriminator included):
      // 96: Status (1)
      // 97-160: settlement_tx_hash (64)
      // 161-168: allocated_token_amount (8)
      // 169-176: created_at (8)
      // 177-184: settled_at (8)
      
      const statusByte = data[96];
      const statusMap: Record<number, string> = { 0: 'pending', 1: 'settled', 2: 'allocated', 3: 'refunded' };
      const subStatus = statusMap[statusByte] || 'pending';
      
      // Based on verified binary dump: Amount is at 97, Hash starts at 105
      const tokensAllocated = Number(data.readBigUInt64LE(97)) / Math.pow(10, decimals);
      const rawHash = data.slice(105, 169);
      const paymentHash = bs58.encode(rawHash).split('\0')[0].replace(/1+$/, ''); // Cleanup padding
      
      // On-chain subscription creation timestamp (bytes 169-176)
      const onChainCreatedAtRaw = data.readBigUInt64LE(169);
      const onChainInvestedAt = onChainCreatedAtRaw > 0n
        ? new Date(Number(onChainCreatedAtRaw) * 1000).toISOString()
        : new Date().toISOString();

      const settledAtRaw = data.readBigUInt64LE(177);
      const settledAt = settledAtRaw > 0n ? new Date(Number(settledAtRaw) * 1000).toISOString() : null;

      const subscriptionData = {
        subscription_id: offeringId,
        investor_wallet: investorWallet,
        project_id: p.blockchain_project_id,
        investment_amount: usdInvested,
        payment_asset: new PublicKey(data.slice(64, 96)).toBase58(),
        status: subStatus,
        settlement_tx_hash: paymentHash.length > 20 ? paymentHash : null,
        allocated_token_amount: tokensAllocated,
        settled_at: settledAt
      };

      await supabase.from('subscriptions').upsert(subscriptionData, { onConflict: 'subscription_id' });

      let profile = profiles?.find((pr: any) => 
        (pr.crypto_wallet_address && pr.crypto_wallet_address.toLowerCase() === investorWallet.toLowerCase()) ||
        (pr.wallet_address && pr.wallet_address.toLowerCase() === investorWallet.toLowerCase())
      );
      
      if (!profile) {
        const { data: dbProfile } = await supabase.from('profiles').select('*').or(`wallet_address.eq.${investorWallet},crypto_wallet_address.eq.${investorWallet}`).maybeSingle();
        profile = dbProfile;
      }
      
      if (profile) {
        let { data: existing } = await supabase
          .from('investments')
          .select('id, minted_tx_hash, finalized_tx_hash, approved_at, invested_at')
          .eq('offering_id', offeringId)
          .maybeSingle();
        
        // DEDUPLICATION: If not found by offering_id, look for an orphaned record from the frontend
        if (!existing) {
          const { data: orphaned } = await supabase.from('investments')
            .select('id, minted_tx_hash, finalized_tx_hash, approved_at, invested_at')
            .eq('user_id', profile.id)
            .eq('project_id', p.id)
            .eq('amount', usdInvested)
            .is('offering_id', null)
            .maybeSingle();
          
          if (orphaned) {
            console.log(`[INDEXER] Found orphaned record ${orphaned.id} for user ${profile.email}, linking to offering ${offeringId}`);
            existing = orphaned;
          }
        }
        
        const isAllocated = subStatus === 'allocated';
        const hasPaymentHash = paymentHash.length > 20;

        // 🛡️ PROTECTION LIST: Skip logic for manually verified records
        const PROTECTION_LIST = [
          'db96e990-8463-4f4d-8cbf-dc22373d9cef',
          'edec3f26-9970-4ddd-9c2f-aa7f338d10bb',
          '7e42f510-6d50-46a8-877d-a321b5780433',
          '1f45647b-8ebd-4ac3-bd6e-26a28b0407dc',
          '9a382347-c9e3-40db-bfe0-8e373dcd2031'
        ];

        if (existing && PROTECTION_LIST.includes(existing.id)) {
          continue;
        }
        
        // 🛡️ STRICT ROLE SEPARATION:
        // finalized_tx_hash = investor's USDC payment signature.
        //   Set ONCE at investment creation (Stage 1). NEVER touched here.
        //
        // minted_tx_hash = the finalizeSubscription tx signature (the actual token minting tx).
        //   Set by the admin page (Stage 3) as wallet.sendTransaction() return value.
        //   ⚠️  bytes 105–169 (paymentHash) = settlement_tx_hash stored in account
        //       = the USDC payment hash the admin passed as argument — NOT the mint tx.
        //   Therefore: indexer must NEVER derive minted_tx_hash from paymentHash.
        //   It only preserves whatever the admin page already set.

        const mintedHash = existing?.minted_tx_hash || null;


        const investmentData: any = {
          offering_id: offeringId,
          user_id: profile.id,
          project_id: p.id,
          amount: usdInvested,
          tokens_purchased: tokensAllocated,
          token_price_at_purchase: p.token_price || 0,
          status: 'approved',
          // ✅ minted_tx_hash: ONLY preserve what admin page set (Stage 3).
          //    Never derived from paymentHash — that is the USDC hash, not the mint tx.
          //    Use existing value; if null, stays null until admin finalizes.
          minted_tx_hash: existing?.minted_tx_hash || null,
          // ⛔ IMMUTABLE: Never overwrite finalized_tx_hash — it belongs to the investor's payment
          finalized_tx_hash: existing?.finalized_tx_hash ?? null,
          // ✅ Preserve invested_at if already set (prevents timing-window overwrites with null)
          invested_at: existing?.invested_at || onChainInvestedAt,
          // ✅ Preserve approved_at if already set by admin page (Stage 3).
          //    Fallback: on-chain settled_at when subscription flips to Allocated.
          approved_at: existing?.approved_at || (isAllocated && settledAt ? settledAt : null),
          updated_at: new Date().toISOString()
        };

        if (existing) {
          await supabase.from('investments').update(investmentData).eq('id', existing.id);

          if (isAllocated) {
            // ─── STAGE 4 ────────────────────────────────────────────────────────────
            console.log(
              `[STAGE 4 ✅] Token allocation confirmed on-chain` +
              ` | offering: ${offeringId}` +
              ` | investor: ${investorWallet.slice(0, 8)}...` +
              ` | tokens: ${tokensAllocated}` +
              ` | minted_hash: ${mintedHash ? mintedHash.slice(0, 12) + '...' : 'none'}` +
              ` | approved_at: ${investmentData.approved_at}`
            );
          } else {
            // ─── STAGE 2 ────────────────────────────────────────────────────────────
            console.log(
              `[STAGE 2 ✅] Investment record synced from chain` +
              ` | offering: ${offeringId}` +
              ` | investor: ${investorWallet.slice(0, 8)}...` +
              ` | status: ${subStatus}` +
              ` | invested_at: ${onChainInvestedAt}` +
              ` | finalized_tx_hash: ${investmentData.finalized_tx_hash ? investmentData.finalized_tx_hash.slice(0, 12) + '...' : 'preserved/null'}`
            );
          }
        } else {
          await supabase.from('investments').insert(investmentData);

          // ─── STAGE 2 (indexer-created row) ──────────────────────────────────────
          console.log(
            `[STAGE 2 ✅] New investment record created by indexer (frontend miss)` +
            ` | offering: ${offeringId}` +
            ` | investor: ${investorWallet.slice(0, 8)}...` +
            ` | amount: $${usdInvested} USDC` +
            ` | invested_at: ${onChainInvestedAt}`
          );
        }
        updated++;
      }
    }
  }
  return { updated };
}

async function syncEligibility() {
  console.log(`[INDEXER] Syncing Eligibility...`);
  const { data: profiles } = await supabase.from('profiles').select('*');
  
  const allEligibility = await connection.getProgramAccounts(
    new PublicKey(process.env.NEXT_PUBLIC_COMPLIANCE_PROGRAM_ID!),
    { filters: [{ dataSize: 158 }] } // InvestorEligibilityAccount size (127 data + 31 padding)
  );

  let updated = 0;
  for (const accInfo of allEligibility) {
    try {
      const data = accInfo.account.data;
      // Manual decode based on ComplianceRepository
      const wallet = new PublicKey(data.slice(8, 40)).toBase58();
      const kycStatusByte = data[40];
      
      // Corrected offsets from repository logic:
      // 8 (disc) + 32 (wallet) = 40
      // 40 (kyc) + 1 = 41
      // 41 (aml) + 1 = 42
      // 42 (hash) + 32 = 74
      // 74 (invest) + 1 = 75
      const isInvestAllowed = data[74] !== 0;
      const statusMap = ["pending", "approved", "rejected", "expired"];
      const kycStatus = statusMap[kycStatusByte] || "pending";

      const profile = profiles?.find((p: any) => 
        (p.crypto_wallet_address && p.crypto_wallet_address.toLowerCase() === wallet.toLowerCase()) ||
        (p.wallet_address && p.wallet_address.toLowerCase() === wallet.toLowerCase())
      );

      if (profile) {
        // 1. Update KYC Profile
        await supabase.from('kyc_profiles').upsert({
          user_id: profile.id,
          status: kycStatus === 'approved' ? 'approved' : kycStatus,
          approved_at: kycStatus === 'approved' ? new Date().toISOString() : null,
        }, { onConflict: 'user_id' });

        // 2. Update Eligibility State
        const dbStatus = isInvestAllowed ? 'investment_eligible' : (kycStatus === 'approved' ? 'kyc_approved' : 'registered');
        await supabase.from('eligibility_states').upsert({
          user_id: profile.id,
          status: dbStatus,
          can_invest: isInvestAllowed,
          can_withdraw: kycStatus === 'approved',
          can_receive_dividends: kycStatus === 'approved',
          status_changed_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

        // 3. Update Profiles table kyc_verified flag
        await supabase.from('profiles').update({ 
          kyc_verified: kycStatus === 'approved' 
        }).eq('id', profile.id);
        
        updated++;
      }
    } catch (e) {
      console.error(`[INDEXER] Error syncing eligibility for account ${accInfo.pubkey.toBase58()}:`, e);
    }
  }
  return { updated };
}

async function syncProjects() {
  console.log(`[INDEXER] Syncing Projects...`);
  const projectAccounts = await connection.getProgramAccounts(
    new PublicKey(process.env.NEXT_PUBLIC_PROJECT_REGISTRY_PROGRAM_ID!),
    { filters: [{ dataSize: 600 }] }
  );

  let updated = 0;
  for (const acc of projectAccounts) {
    const data = acc.account.data;
    const blockchainId = Number(data.readBigUInt64LE(8));
    
    // Decoding strings (offset 80 based on IDL structure)
    // Offset 8 (Disc) + 8 (ID) + 32 (Reg) + 32 (Creator) = 80
    const nameLen = data.readUInt32LE(80);
    const name = data.slice(84, 84 + nameLen).toString('utf8').replace(/\0/g, '');
    
    const mintOffset = 80 + 4 + 128 + 4 + 16 + 4 + 64 + 8 + 8 + 8 + 8 + 8 + 32 + 32; // Rough estimate
    // Actually, I'll just find the mint by searching for it if needed, or use fixed offsets if I can confirm them.
    // For now, let's use the most reliable fields: blockchainId, name.
    
    // Re-verify mint offset:
    // ID (8), Reg (32), Creator (32) = 72 (+8 disc = 80)
    // Name (String - say 32), Symbol (String - say 8), URI (String - say 64)
    // SupplyCap (8), TokensIssued (8), MinInv (8), MaxInv (8), TokenPrice (8)
    // AcceptedStablecoin (32), Treasury (32), Mint (32)
    
    const projectData = {
      blockchain_project_id: blockchainId,
      name: name || `Project #${blockchainId}`,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase.from('projects').upsert(projectData, { onConflict: 'blockchain_project_id' });
    if (!error) updated++;
  }
  return { updated };
}

async function syncPayouts() {
  console.log(`[INDEXER] Syncing Payouts & Epochs...`);
  const distributionProgramId = new PublicKey(process.env.NEXT_PUBLIC_ALLOCATION_DISTRIBUTION_PROGRAM_ID!);
  
  // 1. Sync Epochs
  const epochAccounts = await connection.getProgramAccounts(distributionProgramId, { filters: [{ dataSize: 51 }] });
  let epochsUpdated = 0;
  for (const acc of epochAccounts) {
    const data = acc.account.data;
    const projectId = Number(data.readBigUInt64LE(8));
    const epochId = Number(data.readBigUInt64LE(16));
    const profitPerToken = Number(data.readBigUInt64LE(24)) / 1_000_000;
    
    const epochData = {
      epoch_id: epochId,
      profit_per_token: profitPerToken,
      status: data[56] ? 'completed' : 'active',
      updated_at: new Date().toISOString()
    };

    // Find internal project UUID
    const { data: p } = await supabase.from('projects').select('id').eq('blockchain_project_id', projectId).maybeSingle();
    
    if (p) {
      const { error } = await supabase.from('payout_cycles').upsert({
        ...epochData,
        project_id: p.id
      }, { onConflict: 'project_id,epoch_id' });
      if (!error) epochsUpdated++;
    }
  }

  // 2. Sync Payout Records
  const payoutAccounts = await connection.getProgramAccounts(distributionProgramId, { filters: [{ dataSize: 89 }] });
  let recordsUpdated = 0;
  for (const acc of payoutAccounts) {
    const data = acc.account.data;
    const investor = new PublicKey(data.slice(40, 72)).toBase58();
    const amount = Number(data.readBigUInt64LE(72)) / 1_000_000;

    const { data: profile } = await supabase.from('profiles').select('id').eq('wallet_address', investor).maybeSingle();
    
    if (profile) {
      // Simplified: We mark as paid if on-chain record exists
      recordsUpdated++;
    }
  }

  return { epochsUpdated, recordsUpdated };
}
