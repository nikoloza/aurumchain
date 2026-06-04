import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { isRateLimited } from '@/lib/api/rateLimit';
import { createDefaultConnection } from '@/lib/web3/config/rpc';

const confirmCancelSchema = z.object({
  signature: z.string().min(1),
  sellOrderPda: z.string().min(1),
  projectId: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const validationResult = confirmCancelSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }
    const { signature, sellOrderPda, projectId } = validationResult.data;

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const connection = createDefaultConnection();

    // Verify transaction exists on chain
    try {
      const { value } = await connection.getSignatureStatus(signature, { searchTransactionHistory: true });
      if (value?.err) {
        return NextResponse.json({ error: 'Transaction failed on the blockchain.' }, { status: 400 });
      }
      
      if (!value || (value.confirmationStatus !== 'confirmed' && value.confirmationStatus !== 'finalized')) {
        await connection.confirmTransaction(signature, 'confirmed');
      }
    } catch (e) {
      console.error('[API/orders/cancel/confirm] Error confirming tx:', e);
      return NextResponse.json({ error: 'Could not confirm transaction on the blockchain.' }, { status: 400 });
    }

    // Update listing status
    const { data: listing } = await supabase
      .from('secondary_listings')
      .select('id, remaining')
      .eq('sell_order_pda', sellOrderPda)
      .eq('investor_id', user.id)
      .single();

    if (listing) {
      await supabase.from('secondary_listings').update({
        status: 'cancelled',
        cancelled_tx: signature,
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', listing.id);

      // Unlock tokens optimistically in UI (Indexer will do a more robust pass later)
      const { data: portfolio } = await supabase
        .from('portfolio_positions')
        .select('locked_tokens')
        .eq('user_id', user.id)
        .eq('project_id', projectId)
        .maybeSingle();

      if (portfolio) {
        const lockedTokens = Number(portfolio.locked_tokens || 0);
        await supabase.from('portfolio_positions').update({
          locked_tokens: Math.max(0, lockedTokens - Number(listing.remaining))
        })
        .eq('user_id', user.id)
        .eq('project_id', projectId);
      }
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[API/orders/cancel/confirm] Error:', error);
    return NextResponse.json(
      { error: error.message || 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
