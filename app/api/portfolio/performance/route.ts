import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Placeholder data for performance chart
    // In a real implementation, this would fetch historical portfolio values from a snapshots table
    const performance = [
      { date: '2026-01-01', value: 0 },
      { date: '2026-02-01', value: 5000 },
      { date: '2026-03-01', value: 12000 },
      { date: '2026-04-01', value: 18500 },
      { date: '2026-05-01', value: 25000 },
    ];

    return NextResponse.json(performance);
  } catch (error: any) {
    console.error('[PortfolioPerformanceAPI] Error fetching performance:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch portfolio performance' },
      { status: 500 }
    );
  }
}
