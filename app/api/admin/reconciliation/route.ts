/**
 * API Route: Admin Reconciliation
 * BUILD_ID: REFRESH_67890
 */

import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, createClient } from '@/lib/supabase/server';
import { AdminService } from '@/lib/domains/admin/service';
import { Connection, PublicKey } from '@solana/web3.js';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const isAdmin = await AdminService.isAdmin(user.id);
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    }

    console.log(`Reconciliation Scan initiated for projectId: ${projectId}`);
    
    const adminSupabase = createAdminClient();
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com');

    // 0. Fetch Project Configuration
    const { data: project, error: pError } = await adminSupabase
      .from('projects')
      .select('mint_address, blockchain_project_id, name, token_price')
      .eq('id', projectId)
      .maybeSingle();

    if (pError) console.error("Project fetch error:", pError);
    if (!project) {
      console.warn(`Project ${projectId} not found in database, but scanning anyway...`);
    }

    // 1. Fetch DB Total (Normalized Status Check)
    const { data: investments } = await adminSupabase
      .from('investments')
      .select('id, tokens_purchased, status, status_legacy, profiles(email, crypto_wallet_address)')
      .eq('project_id', projectId);

    const dbTotal = investments?.reduce((sum, i) => {
      const isVerified = i.status === 'approved' || i.status_legacy === 'completed';
      return isVerified ? sum + Number(i.tokens_purchased || 0) : sum;
    }, 0) || 0;

    // 2. Discover On-Chain Wallets
    const onChainWallets: any[] = [];
    
    try {
      const complianceProgramId = new PublicKey(process.env.NEXT_PUBLIC_COMPLIANCE_PROGRAM_ID || 'BYg6sLi3UHLPB8de7J6Z3wAM5PcdV9T5HxtqBfuD85V9');
      
      if (project && project.blockchain_project_id !== null) {
        const blockchainId = BigInt(project.blockchain_project_id);
        const buffer = Buffer.alloc(8);
        buffer.writeBigUInt64LE(blockchainId);
        
        console.log(`[SCANNER] Searching Program: ${complianceProgramId.toBase58()}`);
        console.log(`[SCANNER] For Blockchain Project ID: ${blockchainId}`);

        const subs = await connection.getProgramAccounts(complianceProgramId, {
          filters: [
            { memcmp: { offset: 48, bytes: buffer.toString('base64'), encoding: 'base64' } }
          ]
        });
        
        console.log(`[SCANNER] Found ${subs.length} total accounts for this project.`);
        
        for (const sub of (subs || [])) {
          const data = sub.account.data;
          const owner = new PublicKey(data.slice(16, 48)).toBase58();
          // DYNAMIC SCAN: Find where the tokens and amounts are
          // We know amount_invested is usually after project_id (offset 48)
          // and tokens_issued is usually after the tx_hash.
          // Since there's a version mismatch (171 bytes vs 218 bytes), we'll try common offsets.
          
          let amountInvested = 0;
          let tokensIssued = 0;

          // 1. Amount Invested (Always at 56)
          if (data.length >= 64) amountInvested = Number(data.readBigUInt64LE(56)) / 1_000_000;
          
          // 2. Status Check (Offset 96)
          const status = data[96]; // 0=Pending, 1=Settled, 2=Allocated
          
          // 3. Token Check
          if (status === 0) {
            // PENDING: Tokens aren't issued on-chain yet, so we calculate what THEY SHOULD BE
            // We found the REAL price is at offset 189 in the Registry
            let onChainPrice = 0.25;
            if (project) {
              try {
                const idBuffer = Buffer.alloc(8);
                idBuffer.writeBigUInt64LE(BigInt(project.blockchain_project_id));
                const [registryPda] = PublicKey.findProgramAddressSync(
                  [Buffer.from("project"), idBuffer],
                  new PublicKey(process.env.NEXT_PUBLIC_PROJECT_REGISTRY_PROGRAM_ID!)
                );
                const registryAcc = await connection.getAccountInfo(registryPda);
                if (registryAcc) {
                  onChainPrice = Number(registryAcc.data.readBigUInt64LE(189)) / 1_000_000;
                }
              } catch (e) {
                console.warn("Could not read on-chain price, using DB default:", project.token_price);
                onChainPrice = project?.token_price || 0.25;
              }
            }

            tokensIssued = amountInvested / onChainPrice;
            console.log(`Account ${owner} is PENDING. Price=${onChainPrice}, Tokens=${tokensIssued}`);
          } else {
            // FINALIZED: Read tokens from offset 104 or 168
            const rawTokens = Number(data.readBigUInt64LE(104));
            tokensIssued = rawTokens / 1_000_000;
            
            // Fallback for different program versions
            if (tokensIssued === 0 || tokensIssued > 1_000_000_000) {
              tokensIssued = amountInvested; // Assume 1:1 if reading garbage
            }
          }
          
          onChainWallets.push({
            owner,
            amount: amountInvested / 1_000_000, // Convert from 6 decimal USDC
            tokens: tokensIssued,
            address: sub.pubkey.toBase58() // The unique subscription account address
          });
        }
      }
    } catch (e) {
      console.error("[SCAN ERROR]", e);
    }

    // Deduplicate/Aggregate by unique subscription account, not just wallet
    let orphanedWallets: any[] = [];
    let missingLedgerWallets: any[] = [];

    if (onChainWallets.length > 0) {
      const uniqueWallets = Array.from(new Set(onChainWallets.map(w => w.owner)));
      
      const [profilesRes, linksRes] = await Promise.all([
        adminSupabase.from('profiles').select('id, email, crypto_wallet_address').in('crypto_wallet_address', uniqueWallets),
        adminSupabase.from('wallet_links').select('user_id, wallet_address').in('wallet_address', uniqueWallets)
      ]);

      const dbProfiles = profilesRes.data || [];
      const dbLinks = linksRes.data || [];
      const dbWalletsMap = new Map();
      
      dbProfiles.forEach(p => {
        if (p.crypto_wallet_address) dbWalletsMap.set(p.crypto_wallet_address, { id: p.id, email: p.email });
      });
      
      dbLinks.forEach(l => {
        if (!dbWalletsMap.has(l.wallet_address)) {
          const profile = dbProfiles.find(p => p.id === l.user_id);
          dbWalletsMap.set(l.wallet_address, { id: l.user_id, email: profile?.email || 'linked-wallet' });
        }
      });

      // 4. Trace Orphaned Wallets in Transaction History
      for (const entry of onChainWallets) {
        if (!dbWalletsMap.has(entry.owner)) {
          // Deep Search: Check transactions for this wallet
          const { data: txData } = await adminSupabase
            .from('transactions')
            .select('user_id, profiles(email)')
            .eq('wallet_address', entry.owner)
            .limit(1)
            .maybeSingle();

          orphanedWallets.push({
            wallet: entry.owner,
            tokens: entry.tokens,
            amount: entry.amount,
            address: entry.address,
            suggestedUser: txData ? {
              id: txData.user_id,
              email: (txData as any).profiles?.email || 'Unknown'
            } : null
          });
        } else {
          // Known wallet, check for missing ledger entry
          const knownUser = dbWalletsMap.get(entry.owner);
          const { data: inv } = await adminSupabase
            .from('investments')
            .select('id, status, status_legacy')
            .eq('project_id', projectId)
            .eq('user_id', knownUser.id)
            .eq('tokens_purchased', entry.tokens)
            .maybeSingle();
            
          const isVerified = inv?.status === 'approved' || inv?.status_legacy === 'completed';
          if (!inv || !isVerified) {
            missingLedgerWallets.push({ 
              wallet: entry.owner, 
              userId: knownUser.id, 
              email: knownUser.email || 'linked-user',
              amount: entry.amount,
              tokens: entry.tokens,
              address: entry.address
            });
          }
        }
      }
    }

      // 5. Build final action lists
      let onChainSupply = 0;
      if (project?.mint_address) {
        try {
          const mintInfo = await connection.getTokenSupply(new PublicKey(project.mint_address));
          onChainSupply = Number(mintInfo.value.uiAmount);
        } catch (e) {
          console.error("Mint supply fetch failed:", e);
        }
      }
      
      const ghostRecords: any[] = [];
      const dbInvestments = investments; // Link the supabase data to the expected name
      const identifiedOnChainAddresses = new Set(onChainWallets.map(w => w.address));

      // Find DB records that DON'T exist on-chain
      for (const inv of (dbInvestments || []) as any[]) {
        const profile = Array.isArray(inv.profiles) ? inv.profiles[0] : inv.profiles;
        
        const match = onChainWallets.find(w => 
          w.owner === profile?.crypto_wallet_address && 
          Math.abs(w.tokens - Number(inv.tokens_purchased)) < 0.01
        );
        if (!match) {
          ghostRecords.push({
            id: inv.id,
            email: profile?.email || 'Unknown',
            tokens: inv.tokens_purchased,
            status: inv.status
          });
        }
      }

      return NextResponse.json({ 
        total: dbTotal, 
        onChainSupply,
        delta: onChainSupply - dbTotal,
        orphanedWallets,
        missingLedgerWallets,
        ghostRecords
      });
  } catch (error: any) {
    console.error('Reconciliation API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId, projectId, amount, walletAddress } = await req.json();
    const adminSupabase = createAdminClient();

    // SAFETY GUARD: Prevent numeric overflow from stale/garbage data
    // Now that numbers are normalized (300 instead of 300,000,000), 100M is a safe limit.
    if (amount > 100_000_000) {
      throw new Error(`Sanity Check Failed: ${amount.toLocaleString()} tokens is too large.`);
    }
    const { data: project } = await adminSupabase
      .from('projects')
      .select('token_price')
      .eq('id', projectId)
      .single();

    const price = project?.token_price || 1.0;

    const investmentData = {
      user_id: userId,
      project_id: projectId,
      tokens_purchased: amount,
      amount: amount * price,
      token_price_at_purchase: price,
      status: 'approved',
      approved_at: new Date().toISOString()
    };

    const { error } = await adminSupabase.from('investments').insert(investmentData);
    if (error) throw new Error(`Database rejected repair: ${error.message}`);

    if (walletAddress && walletAddress !== 'MANUAL_SYNC') {
      await adminSupabase.from('wallet_links').upsert({
        user_id: userId,
        wallet_address: walletAddress,
        status: 'verified'
      });
    }

    await adminSupabase.from('audit_logs').insert({
      event_type: 'manual_reconciliation',
      user_id: userId,
      description: `Manually reconciled ${amount} tokens for project ${projectId}`,
      metadata: { wallet: walletAddress, source: 'repair_tool', projectId, amount }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Repair API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { investmentId } = await req.json();
    const adminSupabase = createAdminClient();

    const { error } = await adminSupabase
      .from('investments')
      .delete()
      .eq('id', investmentId);

    if (error) throw new Error(`Database rejected deletion: ${error.message}`);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
