import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminClient = createAdminClient();

    // Check if profile exists first to be safe
    const { data: existingProfile } = await adminClient
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (existingProfile) {
      return NextResponse.json({ success: true, message: 'Profile already exists' });
    }

    // Create the profile record using privileged admin client to bypass RLS
    const { data: newProfile, error: createErr } = await adminClient
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        first_name: user.user_metadata?.first_name || 'User',
        last_name: user.user_metadata?.last_name || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })
      .select()
      .single();

    if (createErr) {
      console.error('[Profile Repair] Failed to create profile:', createErr);
      return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
    }

    // Also initialize eligibility state if missing
    await adminClient
      .from('eligibility_states')
      .upsert({
        user_id: user.id,
        status: 'registered',
        can_invest: false,
        can_trade: false,
        can_withdraw: false
      }, { onConflict: 'user_id' });

    return NextResponse.json({ success: true, profile: newProfile });

  } catch (error: any) {
    console.error('[Profile Repair] Unexpected error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
