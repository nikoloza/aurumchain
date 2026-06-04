import { NextRequest, NextResponse } from 'next/server';
// Trigger HMR
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { isRateLimited } from '@/lib/api/rateLimit';
import { SecondaryMarketService } from '@/lib/web3/services/secondaryMarketService';
import { createDefaultConnection } from '@/lib/web3/config/rpc';
import { Keypair, Transaction, ComputeBudgetProgram } from '@solana/web3.js';
import { getAssociatedTokenAddressSync, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';

const buyOrderSchema = z.object({
  projectId: z.string().uuid(),
  amount: z.number().positive(),
  walletAddress: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const validationResult = buyOrderSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }
    const { projectId, amount, walletAddress } = validationResult.data;

    const supabase = await createClient();
    const supabaseAdmin = createAdminClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    // Check KYC
    const { data: kycProfile } = await supabase
      .from('kyc_profiles')
      .select('status')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!kycProfile || kycProfile.status !== 'approved') {
      return NextResponse.json({ error: 'Your KYC profile must be approved to trade.' }, { status: 403 });
    }

    // Fetch Project
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('id, blockchain_project_id, mint_address, token_decimals, accepted_stablecoin')
      .eq('id', projectId)
      .single();

    console.log('[API/buy] Fetched project:', project, 'Error:', projectError, 'ProjectId:', projectId);

    if (projectError) {
      return NextResponse.json({ error: `Supabase Error: ${projectError.message}. Details: ${projectError.details} Hint: ${projectError.hint}` }, { status: 500 });
    }

    if (!project || project.blockchain_project_id == null) {
      return NextResponse.json({ error: 'Project not found or not initialized.' }, { status: 404 });
    }

    const mintAddress = project.mint_address;
    const stablecoinMint = project.accepted_stablecoin || process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS;
    
    if (!mintAddress || !stablecoinMint) {
      return NextResponse.json({ error: 'Project mint or stablecoin configuration missing.' }, { status: 400 });
    }

    // Match Orders in Database
    const { data: activeOrders } = await supabaseAdmin
      .from('secondary_listings')
      .select('id, sell_order_pda, token_amount, remaining, token_listing_price, sequence, profiles!investor_id(wallet_address, crypto_wallet_address)')
      .eq('project_id', projectId)
      .eq('status', 'active')
      .gt('remaining', 0)
      .order('token_listing_price', { ascending: true })
      .order('created_at', { ascending: true });

    if (!activeOrders || activeOrders.length === 0) {
      return NextResponse.json({ error: 'No active listings available for this project.' }, { status: 404 });
    }

    let remainingToBuy = amount;
    const matchedChunks: any[] = [];
    let totalCost = 0;

    for (const order of activeOrders) {
      if (remainingToBuy <= 0) break;

      const availableInOrder = Number(order.remaining);
      if (availableInOrder <= 0) continue;

      const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles;
      const sellerWallet = profile?.wallet_address || profile?.crypto_wallet_address;

      if (!sellerWallet) continue; // Skip invalid rows

      const fillAmount = Math.min(remainingToBuy, availableInOrder);
      const price = Number(order.token_listing_price);

      matchedChunks.push({
        listingId: order.id,
        sellOrderPda: order.sell_order_pda,
        sellerPubkey: sellerWallet,
        sequence: order.sequence,
        amount: fillAmount,
        pricePerToken: price
      });

      totalCost += fillAmount * price;
      remainingToBuy -= fillAmount;
    }

    if (remainingToBuy > 0) {
      return NextResponse.json({ 
        error: `Not enough liquidity. Only ${amount - remainingToBuy} tokens are currently available for sale.` 
      }, { status: 400 });
    }

    // Build Transaction with multiple instructions
    const connection = createDefaultConnection();
    const dummyWallet = {
      publicKey: Keypair.generate().publicKey,
      signTransaction: async (tx: any) => tx,
      signAllTransactions: async (txs: any[]) => txs,
    };
    const service = new SecondaryMarketService(connection, dummyWallet as any);

    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    const priorityFeeIx = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 50000 });
    const transaction = new Transaction().add(priorityFeeIx);

    const addedAtaInstructions = new Set<string>();

    for (const chunk of matchedChunks) {
      const { instructions } = await service.buildFillOrderInstructions({
        buyerPubkey: walletAddress,
        sellerPubkey: chunk.sellerPubkey,
        sequence: chunk.sequence,
        amount: chunk.amount,
        projectMint: mintAddress,
        stablecoinMint: stablecoinMint,
        projectId: Number(project.blockchain_project_id),
        tokenDecimals: project.token_decimals || 6,
        sellOrderPda: chunk.sellOrderPda
      });

      // Filter out duplicate create_ata instructions
      for (const ix of instructions) {
        // Simple heuristic: if it's the create ATA instruction (Program ID matches SPL Associated Token)
        if (ix.programId.toBase58() === 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL') {
          // Unique key based on payer and ATA address
          const key = `${ix.keys[0].pubkey.toBase58()}-${ix.keys[1].pubkey.toBase58()}`;
          if (!addedAtaInstructions.has(key)) {
            addedAtaInstructions.add(key);
            transaction.add(ix);
          }
        } else {
          transaction.add(ix);
        }
      }
    }

    transaction.recentBlockhash = blockhash;
    transaction.feePayer = new (await import('@solana/web3.js')).PublicKey(walletAddress);

    const serializedTransaction = transaction.serialize({ requireAllSignatures: false }).toString('base64');

    return NextResponse.json({
      transaction: serializedTransaction,
      matchedChunks,
      totalCost,
    });

  } catch (error: any) {
    console.error('[API/buy] Error:', error);
    return NextResponse.json(
      { error: error.message || 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
