import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// --- Simple In-Memory Rate Limiter ---
// (Note: In a multi-instance production environment, use Redis/Upstash. 
// This is sufficient for single-instance or basic protection)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  record.count += 1;
  return false;
}
// -------------------------------------

// Zod Schema for strict input validation
const querySchema = z.object({
  projectId: z.string().uuid("Invalid project ID format. Must be a valid UUID.").optional(),
});

export async function GET(request: NextRequest) {
  try {
    // 1. Rate Limiting Check
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // 2. Input Validation
    const { searchParams } = new URL(request.url);
    const projectIdRaw = searchParams.get('projectId') || undefined;
    
    const validationResult = querySchema.safeParse({ projectId: projectIdRaw });
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0]?.message || 'Invalid request parameters' },
        { status: 400 }
      );
    }

    const { projectId } = validationResult.data;

    // 3. Database Query
    const supabase = createAdminClient();

    let query = supabase
      .from('secondary_listings')
      .select(`
        token_listing_price, 
        remaining, 
        token_amount,
        project_id,
        sequence,
        sell_order_pda,
        projects:project_id (
          id,
          name,
          slug,
          location,
          country,
          token_symbol,
          images,
          mint_address,
          blockchain_project_id
        ),
        profiles:investor_id (
          wallet_address,
          crypto_wallet_address
        )
      `)
      .eq('status', 'active');

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data: listings, error } = await query;

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    if (!listings || listings.length === 0) {
      return NextResponse.json([]);
    }

    // 4. Aggregation Logic (Orderbook grouping)
    // Group by (projectId + priceLevel)
    const orderbookMap = new Map<string, any>();

    for (const listing of listings) {
      const price = parseFloat(listing.token_listing_price);
      const remaining = parseFloat(listing.remaining);
      const original = parseFloat(listing.token_amount);
      const pId = listing.project_id;
      
      // Supabase sometimes types joins as arrays depending on schema inference
      const profile: any = Array.isArray(listing.profiles) ? listing.profiles[0] : listing.profiles;
      const sellerWallet = profile?.wallet_address || profile?.crypto_wallet_address || 'Unknown';

      if (isNaN(price) || isNaN(remaining) || remaining <= 0) continue;

      const groupKey = `${pId}_${price}`;

      if (orderbookMap.has(groupKey)) {
        const entry = orderbookMap.get(groupKey)!;
        entry.totalRemaining += remaining;
        entry.totalOriginal += original;
        entry.listingCount += 1;
        entry.sellers.push({ address: sellerWallet, remaining, sequence: listing.sequence, sellOrderPda: listing.sell_order_pda });
      } else {
        orderbookMap.set(groupKey, {
          id: groupKey, // mock ID for React keys
          projectId: pId,
          projects: listing.projects,
          price: price,
          totalRemaining: remaining,
          totalOriginal: original,
          listingCount: 1,
          sellers: [{ address: sellerWallet, remaining, sequence: listing.sequence, sellOrderPda: listing.sell_order_pda }]
        });
      }
    }

    // Convert to array and sort ascending by price
    const aggregatedOrderbook = Array.from(orderbookMap.values()).sort((a, b) => a.price - b.price);

    return NextResponse.json(aggregatedOrderbook);
  } catch (error: any) {
    console.error('[SecondaryOrderbookAPI] Error generating orderbook:', error);
    return NextResponse.json(
      { error: 'An internal server error occurred while fetching the orderbook.' },
      { status: 500 }
    );
  }
}
