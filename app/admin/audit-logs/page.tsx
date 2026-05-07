/**
 * Page: Admin Audit Logs
 * View immutable record of system activity
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { redirect } from 'next/navigation';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { AdminService } from '@/lib/domains/admin/service';
import { AuditLogClient } from './_components/AuditLogClient';

export default async function AdminAuditLogsPage() {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user is an admin
  const isAdmin = await AdminService.isAdmin(user.id);

  if (!isAdmin) {
    redirect('/dashboard');
  }

  // Fetch audit logs
  const { data: logs, error } = await adminSupabase
    .from('audit_logs')
    .select(`
      *,
      actor:actor_id (first_name, last_name, email),
      user:user_id (first_name, last_name, email)
    `)
    .order('timestamp', { ascending: false })
    .limit(200);

  if (error) {
    console.error('[AdminAuditLogs] Error fetching logs:', error);
  }

  return (
    <div className="min-h-screen bg-navy pt-24 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <a href="/admin" className="text-gold hover:text-gold-light mb-4 inline-block transition-colors">
              ← Back to Admin Dashboard
            </a>
            <h1 className="text-5xl font-black gradient-text mb-2 tracking-tight">Audit Logs</h1>
            <p className="text-gray-400 text-lg">Immutable record of platform activity and security events</p>
          </div>
          
          <div className="flex gap-4">
            <div className="glass px-4 py-2 rounded-xl border border-gold/20 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-gray-300 font-mono">Ledger Live</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <div className="glass p-4 rounded-xl border border-gold/10">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Total Records</p>
              <p className="text-2xl font-bold text-white">{logs?.length || 0}</p>
           </div>
           <div className="glass p-4 rounded-xl border border-gold/10">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Critical Events</p>
              <p className="text-2xl font-bold text-red-400">
                {logs?.filter(l => l.event_type.includes('rejected') || l.event_type.includes('suspended')).length || 0}
              </p>
           </div>
           <div className="glass p-4 rounded-xl border border-gold/10">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Compliance Actions</p>
              <p className="text-2xl font-bold text-blue-400">
                {logs?.filter(l => l.event_type.includes('kyc') || l.event_type.includes('eligibility')).length || 0}
              </p>
           </div>
           <div className="glass p-4 rounded-xl border border-gold/10">
              <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Last Activity</p>
              <p className="text-sm font-bold text-gold">
                {logs?.[0] ? new Date(logs[0].timestamp).toLocaleTimeString() : 'N/A'}
              </p>
           </div>
        </div>

        {/* Interactive Log Viewer */}
        <AuditLogClient initialLogs={logs || []} />
      </div>
    </div>
  );
}
