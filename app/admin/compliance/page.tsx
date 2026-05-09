/**
 * Page: Admin Compliance Dashboard
 * Review and manage KYC verifications
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { redirect } from 'next/navigation';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { AdminService } from '@/lib/domains/admin/service';
import { ComplianceReviewList } from '@/components/admin/ComplianceReviewList';
import { ApprovedInvestorsList } from '@/components/admin/ApprovedInvestorsList';


export default async function AdminCompliancePage() {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user has compliance officer role or admin
  const hasAccess =
    await AdminService.hasRole(user.id, 'compliance_officer') ||
    await AdminService.hasRole(user.id, 'admin') ||
    await AdminService.hasRole(user.id, 'super_admin');

  if (!hasAccess) {
    redirect('/dashboard');
  }

  // 1. Fetch true on-chain approvals first to use for filtering
  let onChainApprovals: any[] = [];
  try {
    const { createDefaultConnection } = await import('@/lib/web3/config/rpc');
    const { getComplianceProgram } = await import('@/lib/web3/clients/anchorClients');
    const connection = createDefaultConnection();
    const program = getComplianceProgram(connection);
    
    // Fetch all InvestorEligibilityAccounts
    const accounts = await program.account.investorEligibilityAccount.all();
    
    onChainApprovals = accounts
      .filter((acc: any) => {
        const k = acc.account.kycStatus;
        return k && (k.approved !== undefined || k === 1 || Object.keys(k)[0]?.toLowerCase() === 'approved');
      })
      .map((acc: any) => ({
        id: acc.publicKey.toBase58(),
        wallet: acc.account.wallet.toBase58(), // ADDED THIS LINE
        user: {
          first_name: 'Wallet:',
          last_name: `${acc.account.wallet.toBase58().substring(0, 4)}...${acc.account.wallet.toBase58().slice(-4)}`,
          email: 'On-Chain Verified'
        },
        metadata: {
          wallet_address: acc.account.wallet.toBase58()
        },
        approved_at: new Date(Number(acc.account.approvalTimestamp) * 1000).toISOString(),
        status: 'approved',
        lockupBypass: acc.account.lockupBypass
      }));
      
    // Sort on-chain approvals by newest first
    onChainApprovals.sort((a, b) => new Date(b.approved_at).getTime() - new Date(a.approved_at).getTime());
  } catch (err) {
    console.error("[AdminCompliancePage] Failed to fetch on-chain approvals:", err);
  }

  // Helper set for fast filtering
  const onChainWalletSet = new Set(onChainApprovals.map(a => a.metadata.wallet_address));

  // 2. Fetch Profiles with wallets directly (No Joins to prevent 406 errors)
  const { data: usersWithWallets, error: profileErr } = await adminSupabase
    .from('profiles')
    .select('id, email, first_name, last_name, crypto_wallet_address')
    .not('crypto_wallet_address', 'is', null)
    .limit(200);

  if (profileErr) console.error("[AdminCompliance] Profile fetch error:", profileErr);

  // Fetch ALL kyc_profiles separately
  const { data: allKycProfiles } = await adminSupabase
    .from('kyc_profiles')
    .select('id, user_id, status, metadata, provider_applicant_id');
    
  // Manually join them in memory
  const usersWithKyc = usersWithWallets?.map(u => ({
    ...u,
    kyc_profiles: allKycProfiles?.filter(k => k.user_id === u.id) || []
  })) || [];

  // 3. Transform and Filter: Show only those who need on-chain verification
  // A user needs verification if:
  // - They have a linked wallet
  // - They are verified off-chain (in DB)
  // - BUT they are either NOT on-chain OR their on-chain status is not 'approved'
  
  const transformedPending = usersWithKyc.filter((profile: any) => {
    const walletAddr = profile.crypto_wallet_address;
    if (!walletAddr) return false;
    
    // Check if they are fully approved on-chain
    const onChainAccount = onChainApprovals.find((acc: any) => acc.wallet === walletAddr);
    const isFullyApproved = !!onChainAccount; // The set only contains approved wallets
    
    // Condition B: Has passed off-chain KYC
    const kycProfile = profile.kyc_profiles?.[0];
    const isKycApproved = 
      kycProfile?.status === 'approved' || 
      kycProfile?.status === 'verified' ||
      kycProfile?.status === 'under_review';

    return isKycApproved && !isFullyApproved;
  }).map((profile: any) => {
    const kycProfile = profile.kyc_profiles?.[0];
    return {
      id: kycProfile?.id || `temp-${profile.id}`,
      user_id: profile.id,
      status: kycProfile?.status || 'pending',
      provider_applicant_id: kycProfile?.provider_applicant_id || 'Legacy/Manual',
      user: {
        id: profile.id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        crypto_wallet_address: profile.crypto_wallet_address
      },
      metadata: {
        ...kycProfile?.metadata,
        wallet_address: profile.crypto_wallet_address
      }
    };
  }) || [];

  // 4. Transform Verified Investors (for searching)
  const transformedVerified = usersWithKyc.filter((profile: any) => {
    const walletAddr = profile.crypto_wallet_address;
    if (!walletAddr) return false;
    return onChainApprovals.some((acc: any) => acc.wallet === walletAddr);
  }).map((profile: any) => {
    const kycProfile = profile.kyc_profiles?.[0];
    return {
      id: kycProfile?.id || `v-${profile.id}`,
      user_id: profile.id,
      status: 'approved',
      user: {
        id: profile.id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        crypto_wallet_address: profile.crypto_wallet_address
      },
      metadata: {
        wallet_address: profile.crypto_wallet_address
      }
    };
  }) || [];

  // 5. Get recent approvals from DB (fallback/legacy)
  const { data: dbRecentApprovals } = await adminSupabase
    .from('kyc_profiles')
    .select(`
      *,
      user:user_id (
        id,
        email,
        first_name,
        last_name
      )
    `)
    .eq('status', 'approved')
    .order('approved_at', { ascending: false })
    .limit(10);

  // Merge on-chain with DB, prioritizing on-chain for the "Approved" list
  const recentApprovals = onChainApprovals.length > 0 ? onChainApprovals : (dbRecentApprovals || []);

  return (
    <div className="min-h-screen bg-navy pt-24 px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <a href="/admin" className="text-gold hover:text-gold-light mb-4 inline-block transition-colors">
              ← Back to Admin Dashboard
            </a>
            <h1 className="text-5xl font-black gradient-text mb-2 tracking-tight">Compliance & KYC</h1>
            <p className="text-gray-400 text-lg">On-chain identity verification and investor allow-listing</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="Pending Review"
            value={transformedPending.length}
            color="yellow"
          />
          <StatCard
            title="Recent Approvals"
            value={recentApprovals?.length || 0}
            color="green"
          />
          <StatCard
            title="Verification Rate"
            value="84%"
            color="blue"
          />
          <StatCard
            title="Program Status"
            value="ACTIVE"
            color="purple"
          />
        </div>

        {/* Pending Reviews - Main Action Area */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">Investor Requests</h2>
              <p className="text-gray-400 text-sm">Users who have connected a wallet and are awaiting on-chain sync</p>
            </div>
          </div>
          <div className="space-y-8">
          <ComplianceReviewList 
            initialPending={transformedPending} 
            initialVerified={transformedVerified}
          />
        </div>

        {/* Recent Approvals */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">On-Chain Verified Investors</h2>
          <ApprovedInvestorsList investors={recentApprovals} />
        </div>
      </div>
    </div>
  </div>
);
}

function StatCard({ title, value, color }: {
  title: string;
  value: number | string;
  color: 'yellow' | 'green' | 'blue' | 'purple';
}) {
  const colors = {
    yellow: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-400',
    green: 'border-green-500/30 bg-green-500/5 text-green-400',
    blue: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
    purple: 'border-purple-500/30 bg-purple-500/5 text-purple-400',
  };

  return (
    <div className={`glass rounded-xl p-6 border-2 ${colors[color]}`}>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-300">{title}</div>
    </div>
  );
}
