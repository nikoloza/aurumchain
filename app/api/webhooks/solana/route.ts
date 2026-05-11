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
      // Add a small random jitter to prevent simultaneous requests from racing
      if (type === 'SYNC_TRIGGER') {
        const jitter = Math.floor(Math.random() * 1000);
        await new Promise(resolve => setTimeout(resolve, jitter));
      }
      console.log(`[INDEXER] Running Global Smart Sync...`);
      
      const { data: projects } = await supabase.from('projects').select('*');
      const { data: profiles } = await supabase.from('profiles').select('*');
      
      console.log(`[INDEXER] Found ${projects?.length} projects and ${profiles?.length} profiles in DB`);
      
      const allSubs = await connection.getProgramAccounts(
        new PublicKey(process.env.NEXT_PUBLIC_COMPLIANCE_PROGRAM_ID!),
        {
          filters: [
            { dataSize: 194 } // InvestmentSubscriptionAccount size
          ]
        }
      );

      for (const p of (projects || [])) {
        if (p.blockchain_project_id === null) continue;
        
        const projectSubs = allSubs.filter(s => {
          try {
            return s.account.data.readBigUInt64LE(48) === BigInt(p.blockchain_project_id);
          } catch (e) {
            return false;
          }
        });
        
        if (projectSubs.length > 0) {
          console.log(`[INDEXER] Project ${p.name} (ID: ${p.blockchain_project_id}) has ${projectSubs.length} subscriptions on-chain`);
        }
        
        for (const sub of projectSubs) {
          const data = sub.account.data;
          
          // --- SOURCE OF TRUTH: Direct Memory Offsets ---
          const offeringId = data.readBigUInt64LE(8).toString();
          const investorWallet = new PublicKey(data.slice(16, 48)).toBase58();
          const usdInvested = Number(data.readBigUInt64LE(56)) / 1_000_000;
          
          // Dynamic Token Decimals
          const decimals = p.token_decimals || 7;
          const tokensAllocated = Number(data.readBigUInt64LE(97)) / Math.pow(10, decimals);
          
          // Settlement Hash (Payment)
          const rawHash = data.slice(105, 169); // Hash starts at 105 in 194-byte struct
          const paymentHash = bs58.encode(rawHash).replace(/1+$/, ''); // Clean padding
          
          console.log(`[INDEXER] Synchronizing Sub ${offeringId}: ${investorWallet} | Project ${p.name}`);

          // --- 1. SYNC SUBSCRIPTIONS TABLE (Global Ledger) ---
          // Status Map: 0: Pending, 1: Settled, 2: Allocated, 3: Refunded
          const statusByte = data[96];
          const statusMap: Record<number, string> = {
            0: 'pending',
            1: 'settled',
            2: 'allocated',
            3: 'refunded'
          };
          const subStatus = statusMap[statusByte] || 'pending';
          const settledAtRaw = data.readBigUInt64LE(169);
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

          console.log(`[INDEXER] Updating Subscription Table for ID: ${offeringId}`);
          await supabase.from('subscriptions').upsert(subscriptionData, { onConflict: 'subscription_id' });

          // --- 2. SYNC INVESTMENTS TABLE (User Linked) ---
          const profile = profiles?.find((pr: any) => 
            (pr.crypto_wallet_address && pr.crypto_wallet_address.toLowerCase() === investorWallet.toLowerCase()) ||
            (pr.wallet_address && pr.wallet_address.toLowerCase() === investorWallet.toLowerCase())
          );
          
          if (profile) {
            // Find existing investment by offering_id
            const { data: existing } = await supabase
              .from('investments')
              .select('id, minted_tx_hash')
              .eq('offering_id', offeringId)
              .eq('project_id', p.id) // Added this safeguard to prevent cross-project collisions
              .maybeSingle();

            const investmentData: any = {
              offering_id: offeringId,
              user_id: profile.id,
              project_id: p.id,
              amount: usdInvested,
              tokens_purchased: tokensAllocated,
              token_price_at_purchase: p.token_price || 0,
              status: 'approved',
              finalized_tx_hash: paymentHash.length > 20 ? paymentHash : null,
              updated_at: new Date().toISOString()
            };

            if (existing) {
              console.log(`[INDEXER] Updating existing investment: ${existing.id}`);
              // Preserve existing minted_tx_hash if it already exists
              if (!existing.minted_tx_hash && signature && signature !== 'manual-trigger' && signature !== 'reconcile-all') {
                investmentData.minted_tx_hash = signature;
              }
              const { error: updateError } = await supabase.from('investments').update(investmentData).eq('id', existing.id);
              if (updateError) console.error(`[INDEXER] Error updating investment ${existing.id}:`, updateError.message);
            } else {
              console.log(`[INDEXER] Creating new investment record for Sub: ${offeringId}`);
              if (signature && signature !== 'manual-trigger' && signature !== 'reconcile-all') {
                investmentData.minted_tx_hash = signature;
              }
              const { error: insertError } = await supabase.from('investments').insert(investmentData);
              if (insertError) console.error(`[INDEXER] Error inserting investment for Sub ${offeringId}:`, insertError.message);
            }
          } else {
            console.warn(`[INDEXER] No profile found for wallet: ${investorWallet} - Skipping user-linked investment update`);
          }
        }
      }
      return NextResponse.json({ success: true, message: 'Global Sync Complete' });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(`[INDEXER] Error:`, err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
