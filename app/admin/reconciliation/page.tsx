/**
 * Page: Admin Reconciliation
 * Verify On-Chain vs Off-Chain consistency
 */

import { redirect } from 'next/navigation';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { AdminService } from '@/lib/domains/admin/service';
import { ReconciliationDashboard } from './_components/ReconciliationDashboard';

export default async function AdminReconciliationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user is an admin
  const isAdmin = await AdminService.isAdmin(user.id);
  if (!isAdmin) {
    redirect('/dashboard');
  }

  // Fetch projects for the dashboard
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-navy pt-24 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <a href="/admin" className="text-gold hover:text-gold-light mb-4 inline-block transition-colors">
              ← Back to Admin Dashboard
            </a>
            <h1 className="text-5xl font-black gradient-text mb-2 tracking-tight">Reconciliation</h1>
            <p className="text-gray-400 text-lg">Cross-reference on-chain token supply with database investment records</p>
          </div>
        </div>

        <ReconciliationDashboard initialProjects={projects || []} />
      </div>
    </div>
  );
}
