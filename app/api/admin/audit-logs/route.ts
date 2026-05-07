import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AdminService, createAuditLog } from '@/lib/domains/admin/service';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await AdminService.isAdmin(user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { eventType, description, metadata, previousState, newState, userId } = body;

    const log = await createAuditLog({
      eventType,
      description,
      metadata: metadata || {},
      previousState,
      newState,
      userId: userId || user.id,
      actorId: user.id,
      actorRole: 'admin',
      ipAddress: req.headers.get('x-forwarded-for') || undefined,
      userAgent: req.headers.get('user-agent') || undefined,
    });

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    console.error('[AuditLogAPI] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
