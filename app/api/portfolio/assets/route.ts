import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PortfolioService } from '@/lib/domains/portfolio/service';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const assets = await PortfolioService.getPortfolioAssets(user.id);

    return NextResponse.json(assets);
  } catch (error: any) {
    console.error('[PortfolioAssetsAPI] Error fetching assets:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch portfolio assets' },
      { status: 500 }
    );
  }
}
