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
      
      const allSubs = await connection.getProgramAccounts(new PublicKey(process.env.NEXT_PUBLIC_COMPLIANCE_PROGRAM_ID!));

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
              await supabase.from('investments').update(investmentData).eq('id', existing.id);
            } else {
              console.log(`[INDEXER] Creating new investment record for Sub: ${offeringId}`);
              if (signature && signature !== 'manual-trigger' && signature !== 'reconcile-all') {
                investmentData.minted_tx_hash = signature;
              }
              await supabase.from('investments').insert(investmentData);
            }
          } else {
            console.warn(`[INDEXER] No profile found for wallet: ${investorWallet}`);
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
