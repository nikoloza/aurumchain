/**
 * API Route: Sync On-Chain Purchases to Audit Logs
 * POST /api/admin/audit-logs/sync-onchain
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { AdminService } from '@/lib/domains/admin/service';
import { Connection } from '@solana/web3.js';
import { getComplianceProgram } from '@/lib/web3/clients/anchorClients';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();
    
    // 1. Auth Check (Admin Only)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const isAdmin = await AdminService.isAdmin(user.id);
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // 2. Setup Blockchain Connection
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
    const connection = new Connection(rpcUrl, 'confirmed');
    const program = getComplianceProgram(connection);

    console.log('[Sync] Fetching all on-chain subscriptions...');
    const onChainSubs = await program.account.investmentSubscriptionAccount.all();
    console.log(`[Sync] Found ${onChainSubs.length} subscriptions on-chain.`);

    if (onChainSubs.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: 'No on-chain subscriptions found.' });
    }

    // 3. Pre-fetch mappings to avoid N+1
    const { data: projects } = await adminSupabase.from('projects').select('id, blockchain_project_id');
    const { data: profiles } = await adminSupabase.from('profiles').select('id, crypto_wallet_address');
    
    const projectMap = new Map(projects?.map(p => [p.blockchain_project_id, p.id]) || []);
    const profileMap = new Map(profiles?.map(p => [p.crypto_wallet_address, p.id]) || []);

    // 4. Fetch existing audit logs to avoid duplicates (excluding synced ones we're about to delete)
    const { data: existingLogs } = await adminSupabase
      .from('audit_logs')
      .select('metadata')
      .eq('event_type', 'investment_created')
      .not('description', 'ilike', '%[Sync]%');
    
    const existingSubIds = new Set(existingLogs?.map(l => l.metadata?.subscriptionId?.toString()).filter(Boolean) || []);

    // 5. CLEAR PREVIOUSLY SYNCED LOGS (To allow refreshing with TX Hashes)
    console.log('[Sync] Clearing previously synced logs to allow refresh...');
    await adminSupabase
      .from('audit_logs')
      .delete()
      .eq('event_type', 'investment_created')
      .ilike('description', '%[Sync]%');

    const logsToInsert = [];
    let skippedCount = 0;

    // 5. Process each subscription
    for (const sub of onChainSubs) {
      const acc = sub.account;
      const subId = acc.subscriptionId.toString();
      
      if (existingSubIds.has(subId)) {
        skippedCount++;
        continue;
      }

      const investorPubkey = acc.investor.toBase58();
      const blockchainProjectId = Number(acc.projectId.toString());
      
      const userId = profileMap.get(investorPubkey);
      const projectId = projectMap.get(blockchainProjectId);

      const amount = Number(acc.investmentAmount.toString()) / 1_000_000;
      const tokens = Number(acc.allocatedTokenAmount.toString()) / 1_000_000;
      const timestamp = new Date(acc.createdAt.toNumber() * 1000).toISOString();

      // Attempt to find the real transaction signature for this subscription
      let txHash = null;
      try {
        const sigs = await connection.getSignaturesForAddress(sub.publicKey, { limit: 1 });
        if (sigs.length > 0) {
          txHash = sigs[0].signature;
        }
      } catch (err) {
        console.warn(`[Sync] Could not fetch signature for sub ${subId}:`, err);
      }

      logsToInsert.push({
        event_type: 'investment_created',
        user_id: userId || null,
        actor_id: userId || null,
        actor_role: 'user',
        description: `[Sync] On-chain investment of $${amount.toLocaleString()} detected`,
        metadata: {
          subscriptionId: subId,
          blockchainProjectId,
          dbProjectId: projectId,
          amount,
          tokens,
          investor: investorPubkey,
          txHash: txHash, // Now including the real txHash
          syncedAt: new Date().toISOString(),
          onChainStatus: Object.keys(acc.status)[0]
        },
        timestamp: timestamp
      });
    }

    // 6. Batch insert logs
    if (logsToInsert.length > 0) {
      const { error: insertError } = await adminSupabase.from('audit_logs').insert(logsToInsert);
      if (insertError) throw insertError;
    }

    return NextResponse.json({
      success: true,
      newLogs: logsToInsert.length,
      skipped: skippedCount,
      totalProcessed: onChainSubs.length
    });

  } catch (error: any) {
    console.error('[Sync] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
