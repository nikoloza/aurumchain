import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { isRateLimited } from '@/lib/api/rateLimit';
import { createDefaultConnection } from '@/lib/web3/config/rpc';
import { SecondaryMarketService } from '@/lib/web3/services/secondaryMarketService';
import { Keypair } from '@solana/web3.js';

const confirmBuySchema = z.object({
  signature: z.string().min(1),
  projectId: z.string().uuid(),
  matchedChunks: z.array(
    z.object({
      listingId: z.string().uuid(),
      sellOrderPda: z.string().min(1),
      sellerPubkey: z.string().min(1),
      amount: z.number().positive(),
      pricePerToken: z.number().positive(),
    })
  ),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const validationResult = confirmBuySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }
    const { signature, projectId, matchedChunks } = validationResult.data;

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
      console.error('[API/buy/confirm] Error confirming tx:', e);
      return NextResponse.json({ error: 'Could not confirm transaction on the blockchain.' }, { status: 400 });
    }

    // Fetch live market config for accurate fee
    const dummyWallet = {
      publicKey: Keypair.generate().publicKey,
      signTransaction: async (tx: any) => tx,
      signAllTransactions: async (txs: any[]) => txs,
    };
    const service = new SecondaryMarketService(connection, dummyWallet as any);
    let feeBasisPoints = 200; // default 2%
    try {
      const configData: any = await (service as any).program.account.marketConfig.fetch((service as any).getConfigPda());
      feeBasisPoints = configData.feeBasisPoints;
    } catch (e) {
      console.warn("Could not fetch MarketConfig, defaulting to 2% fee", e);
    }

    // Since transaction is confirmed on-chain, we apply database updates synchronously for immediate UI feedback.
    // Note: The indexer_watcher script will also process this, but it uses upserts/checks to prevent double counting.

    for (const chunk of matchedChunks) {
      // 1. Fetch current listing
      const { data: listing } = await supabase
        .from('secondary_listings')
        .select('sold, remaining, token_amount, investor_id')
        .eq('id', chunk.listingId)
        .single();
        
      if (!listing) continue;

      const fillAmount = chunk.amount;
      const newSold = Number(listing.sold) + fillAmount;
      const newRemaining = Math.max(0, Number(listing.remaining) - fillAmount);
      const newStatus = newRemaining === 0 ? 'filled' : 'active';

      // 2. Update listing
      await supabase.from('secondary_listings')
        .update({
          sold: newSold,
          remaining: newRemaining,
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', chunk.listingId);

      // 3. Create Trade Record
      const totalCost = fillAmount * chunk.pricePerToken;
      const platformFee = totalCost * (feeBasisPoints / 10000);
      
      const { data: existingTrade } = await supabase.from('secondary_trades')
        .select('id')
        .eq('trade_tx', signature)
        .eq('listing_id', chunk.listingId)
        .maybeSingle();

      if (!existingTrade) {
        await supabase.from('secondary_trades').insert({
          listing_id: chunk.listingId,
          project_id: projectId,
          seller_id: listing.investor_id,
          buyer_id: user.id,
          token_amount: fillAmount,
          paid_amount: totalCost,
          platform_fee: platformFee,
          trade_tx: signature,
        });
        
        // 4. Update Portfolio Positions 
        // We rely purely on the DB trigger `update_portfolio_positions_on_secondary_trade` 
        // to handle the balances accurately and avoid double deductions.
      }
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[API/buy/confirm] Error:', error);
    return NextResponse.json(
      { error: error.message || 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
