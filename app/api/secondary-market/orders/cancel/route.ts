import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { isRateLimited } from '@/lib/api/rateLimit';
import { SecondaryMarketService } from '@/lib/web3/services/secondaryMarketService';
import { createDefaultConnection } from '@/lib/web3/config/rpc';
import { Keypair } from '@solana/web3.js';

const cancelOrderSchema = z.object({
  projectId: z.string().uuid(),
  sequence: z.number().positive(),
  walletAddress: z.string().min(1),
  sellOrderPda: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const validationResult = cancelOrderSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }
    const { projectId, sequence, walletAddress, sellOrderPda } = validationResult.data;

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check Ownership of Order
    const { data: listing } = await supabase
      .from('secondary_listings')
      .select('id, investor_id, status')
      .eq('sell_order_pda', sellOrderPda)
      .single();

    if (!listing) {
      return NextResponse.json({ error: 'Order not found in database.' }, { status: 404 });
    }

    if (listing.investor_id !== user.id) {
      return NextResponse.json({ error: 'You do not own this order.' }, { status: 403 });
    }

    if (listing.status !== 'active' && listing.status !== 'pending') {
      return NextResponse.json({ error: 'Order cannot be cancelled in its current state.' }, { status: 400 });
    }

    // Fetch Project Details
    const supabaseAdmin = createAdminClient();
    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('id, blockchain_project_id, mint_address')
      .eq('id', projectId)
      .single();

    if (!project || project.blockchain_project_id == null) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    const mintAddress = project.mint_address;

    // Build Transaction
    const connection = createDefaultConnection();
    const dummyWallet = {
      publicKey: Keypair.generate().publicKey,
      signTransaction: async (tx: any) => tx,
      signAllTransactions: async (txs: any[]) => txs,
    };
    const service = new SecondaryMarketService(connection, dummyWallet as any);

    const { transaction } = await service.buildCancelSellOrderTransaction({
      sellerPubkey: walletAddress,
      sequence,
      projectMint: mintAddress,
      projectId: Number(project.blockchain_project_id),
    });

    const serializedTransaction = transaction.serialize({ requireAllSignatures: false }).toString('base64');

    return NextResponse.json({
      transaction: serializedTransaction
    });

  } catch (error: any) {
    console.error('[API/orders/cancel] Error:', error);
    return NextResponse.json(
      { error: error.message || 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
