import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const status = searchParams.get('status') || 'active';

    const supabase = createAdminClient();

    let query = supabase
      .from('secondary_listings')
      .select(`
        *,
        projects:project_id (
          id,
          name,
          slug,
          location,
          country,
          token_symbol,
          token_decimals,
          images
        ),
        profiles:investor_id (
          id,
          first_name,
          last_name,
          wallet_address,
          crypto_wallet_address
        )
      `);

    if (projectId) {
      query = query.eq('project_id', projectId);
    }
    
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    // Order by newest listings first
    query = query.order('created_at', { ascending: false });

    const { data: listings, error } = await query;

    if (error) throw error;

    return NextResponse.json(listings || []);
  } catch (error: any) {
    console.error('[SecondaryListingsAPI] Error fetching listings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch secondary listings' },
      { status: 500 }
    );
  }
}
