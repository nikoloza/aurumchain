
import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { createDefaultConnection } from '@/lib/web3/config/rpc';
import { ProjectRegistryService } from '@/lib/web3/services/projectRegistryService';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = createAdminClient();

    console.log(`[API/projects/${slug}/details] Fetching project...`);

    // 1. Fetch Supabase project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (projectError) {
      console.error(`[API/projects/${slug}/details] Project error:`, projectError);
      return NextResponse.json({ error: 'Database error', details: projectError.message }, { status: 500 });
    }

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    console.log(`[API/projects/${slug}/details] Fetching investments...`);

    // 2. Fetch recent purchases
    const { data: purchases, error: purchaseError } = await supabase
      .from('investments')
      .select('id, amount, tokens_purchased, invested_at, status, finalized_tx_hash, user_id')
      .eq('project_id', project.id)
      .eq('status', 'approved')
      .order('invested_at', { ascending: false })
      .limit(20);

    if (purchaseError) {
      console.error(`[API/projects/${slug}/details] Purchase error:`, purchaseError);
    }

    // 3. Fetch holders (all approved investments for aggregation)
    const { data: allInvestments, error: allError } = await supabase
      .from('investments')
      .select('user_id, tokens_purchased')
      .eq('project_id', project.id)
      .eq('status', 'approved');

    if (allError) {
      console.error(`[API/projects/${slug}/details] All investments error:`, allError);
    }

    // 4. Fetch Profiles for all involved users
    const userIds = Array.from(new Set([
      ...(purchases?.map(p => p.user_id) || []),
      ...(allInvestments?.map(i => i.user_id) || [])
    ]));

    let profileMap = new Map();
    if (userIds.length > 0) {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, wallet_address')
        .in('id', userIds);
      
      if (profileError) {
        console.error(`[API/projects/${slug}/details] Profile error:`, profileError);
      } else if (profiles) {
        profiles.forEach(p => profileMap.set(p.id, p));
      }
    }

    // 5. Aggregate Holders
    const holderMap = new Map();
    if (allInvestments) {
      allInvestments.forEach((h: any) => {
        const userId = h.user_id;
        const profile = profileMap.get(userId);
        const fullName = profile ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') : 'Anonymous';
        
        const current = holderMap.get(userId) || { 
          tokens: 0, 
          name: fullName, 
          wallet: profile?.wallet_address || '—' 
        };
        current.tokens += Number(h.tokens_purchased);
        holderMap.set(userId, current);
      });
    }

    const topHolders = Array.from(holderMap.values())
      .sort((a, b) => b.tokens - a.tokens)
      .slice(0, 10);

    // 6. Enriched Purchases with user data
    const enrichedPurchases = (purchases || []).map(p => ({
      ...p,
      user: profileMap.get(p.user_id) || null
    }));

    // 7. Fetch Payout Cycles
    const { data: payoutCycles, error: payoutError } = await supabase
      .from('payout_cycles')
      .select('*')
      .eq('project_id', project.id)
      .order('scheduled_date', { ascending: false });

    if (payoutError) {
      console.error(`[API/projects/${slug}/details] Payout error:`, payoutError);
    }

    // Normalize payout amounts (divide by USDC decimals 10^6 if they look like raw values)
    const normalizedPayouts = (payoutCycles || []).map(c => {
      const total = Number(c.total_amount);
      const perToken = Number(c.amount_per_token);
      
      return {
        ...c,
        total_amount: total > 1000 ? total / 1_000_000 : total,
        amount_per_token: perToken > 10 ? perToken / 1_000_000 : perToken
      };
    });

    // 8. Enrich with On-Chain data
    let enrichedProject = { ...project, onChain: null };
    try {
      if (project.blockchain_project_id !== null) {
        console.log(`[API/projects/${slug}/details] Fetching on-chain data for ID: ${project.blockchain_project_id}...`);
        const connection = createDefaultConnection();
        const service = new ProjectRegistryService(connection, undefined);
        const chainData = await service.fetchProject(Number(project.blockchain_project_id));

        if (chainData) {
          const safeNum = (bn: any, decimals = 0) => {
            if (!bn) return 0;
            const s = bn.toString();
            return parseFloat(s) / (10 ** decimals);
          };
          const decimals = project.token_decimals || 9;

          enrichedProject.onChain = {
            symbol: chainData.symbol || '',
            supplyCap: safeNum(chainData.supplyCap, decimals),
            tokensIssued: safeNum(chainData.tokensIssued, decimals),
            minInvestmentUsdc: safeNum(chainData.minInvestmentUsdc, 6),
            maxInvestmentUsdc: safeNum(chainData.maxInvestmentUsdc, 6),
            tokenPriceUsdc: safeNum(chainData.tokenPriceUsdc, 6),
            mint: chainData.mint?.toString() || '',
            subscriptionEnd: safeNum(chainData.subscriptionEnd),
            isActive: chainData.status?.active !== undefined,
          };
          console.log(`[API/projects/${slug}/details] On-chain data fetched successfully.`);
        } else {
          console.warn(`[API/projects/${slug}/details] No on-chain project found for ID: ${project.blockchain_project_id}`);
        }
      }
    } catch (e: any) {
      console.error('[API/projects/[slug]/details] On-chain enrichment failed:', e.message);
    }

    return NextResponse.json({
      project: enrichedProject,
      recentPurchases: enrichedPurchases,
      topHolders,
      payoutCycles: normalizedPayouts
    });
  } catch (err: any) {
    console.error('[GET /api/projects/[slug]/details] CRITICAL failure:', err);
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: err.message,
      stack: err.stack
    }, { status: 500 });
  }
}
