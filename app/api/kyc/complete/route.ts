import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a production environment, this should ideally be triggered by a Sumsub Webhook
    // For this implementation, we allow the authenticated client to mark themselves as verified
    // after the Sumsub SDK reports success.
    
    const adminClient = createAdminClient();
    
    // 1. Update public.profiles
    const { error: profileError } = await adminClient
      .from('profiles')
      .update({ 
        kyc_verified: true
      })
      .eq('id', user.id);

    // 2. Update public.kyc_profiles (Upsert in case it doesn't exist yet)
    const { error: kycProfileError } = await adminClient
      .from('kyc_profiles')
      .upsert({ 
        user_id: user.id,
        status: 'approved',
        approved_at: new Date().toISOString(),
        reviewed_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    // 3. Update public.eligibility_states (Upsert in case it doesn't exist yet)
    const { error: eligibilityError } = await adminClient
      .from('eligibility_states')
      .upsert({
        user_id: user.id,
        status: 'kyc_approved',
        can_invest: false,
        can_trade: false,
        can_withdraw: true,
        can_receive_dividends: true,
        status_changed_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (profileError || kycProfileError || eligibilityError) {
      console.error('Failed to update KYC status in DB:', { profileError, kycProfileError, eligibilityError });
      return NextResponse.json({ error: 'Failed to update database' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('KYC complete endpoint error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
