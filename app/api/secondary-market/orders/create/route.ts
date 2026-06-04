import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { isRateLimited } from '@/lib/api/rateLimit';
import { SecondaryMarketService } from '@/lib/web3/services/secondaryMarketService';
import { createDefaultConnection } from '@/lib/web3/config/rpc';
import { Keypair } from '@solana/web3.js';

// Define input validation schema
const createOrderSchema = z.object({
  projectId: z.string().uuid(),
  amount: z.number().positive(),
  pricePerToken: z.number().positive(),
  walletAddress: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    // 2. Parse and Validate Request Body
    const body = await request.json();
    const validationResult = createOrderSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
    }
    const { projectId, amount, pricePerToken, walletAddress } = validationResult.data;

    // 3. Database Initialization
    const supabase = await createClient();

    // 4. Authenticate User (Ensure they are logged in)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    // 5. Check KYC Status
    const { data: kycProfile } = await supabase
      .from('kyc_profiles')
      .select('status')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!kycProfile || kycProfile.status !== 'approved') {
      return NextResponse.json({ error: 'Your KYC profile must be approved to trade.' }, { status: 403 });
    }

    // 6. Fetch Project Details
    const supabaseAdmin = createAdminClient();
    
    // Fetch Project and verify it is initialized on blockchain
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('id, blockchain_project_id, mint_address, token_decimals')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    const mintAddress = project.mint_address;
    if (project.blockchain_project_id == null || !mintAddress) {
      return NextResponse.json({ error: 'Project is not fully initialized on the blockchain.' }, { status: 400 });
    }

    // 7. Check User Balance & Locked Tokens
    const { data: portfolio } = await supabase
      .from('portfolio_positions')
      .select('total_tokens, locked_tokens')
      .eq('user_id', user.id)
      .eq('project_id', project.id)
      .maybeSingle();

    if (!portfolio) {
      return NextResponse.json({ error: 'You do not own any tokens for this project.' }, { status: 400 });
    }

    const totalTokens = Number(portfolio.total_tokens || 0);
    const lockedTokens = Number(portfolio.locked_tokens || 0);
    const availableTokens = totalTokens - lockedTokens;

    if (amount > availableTokens) {
      return NextResponse.json({ error: `Insufficient available balance. You only have ${availableTokens} unlocked tokens.` }, { status: 400 });
    }

    // 8. Build Solana Transaction
    const connection = createDefaultConnection();
    // Dummy wallet for reading state / building instructions
    const dummyWallet = {
      publicKey: Keypair.generate().publicKey,
      signTransaction: async (tx: any) => tx,
      signAllTransactions: async (txs: any[]) => txs,
    };
    const service = new SecondaryMarketService(connection, dummyWallet as any);

    const { transaction, sequence, sellOrderPda } = await service.buildCreateSellOrderTransaction({
      sellerPubkey: walletAddress,
      projectId: Number(project.blockchain_project_id),
      projectMint: mintAddress,
      amount,
      pricePerToken,
      tokenDecimals: project.token_decimals || 6,
    });

    // 9. Serialize Transaction to Base64
    const serializedTransaction = transaction.serialize({ requireAllSignatures: false }).toString('base64');

    // 10. Record "pending" order in DB (Optional, but good for UI tracking)
    // The background indexer will update this to 'active' once confirmed on chain
    await supabase.from('secondary_listings').upsert({
      sell_order_pda: sellOrderPda,
      investor_id: user.id,
      project_id: project.id,
      token_amount: amount,
      token_listing_price: pricePerToken,
      sold: 0,
      remaining: amount,
      sequence: sequence,
      status: 'pending',
    }, { onConflict: 'sell_order_pda' });

    // Lock tokens in DB optimistically
    await supabase.from('portfolio_positions').update({
      locked_tokens: lockedTokens + amount
    })
    .eq('user_id', user.id)
    .eq('project_id', project.id);

    return NextResponse.json({
      transaction: serializedTransaction,
      sellOrderPda,
      sequence
    });

  } catch (error: any) {
    console.error('[API/orders/create] Error:', error);
    return NextResponse.json(
      { error: error.message || 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
