'use client';

import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ComplianceService } from '@/lib/web3/services/complianceService';
import { useWalletEligibility } from '@/hooks/useWalletEligibility';
import { syncKycApprovalAction, syncKycRevokeAction } from '@/app/admin/compliance/actions';

interface KycProfile {
// ... existing types
}

export function ComplianceReviewList({ 
  initialPending, 
  initialVerified = [] 
}: { 
  initialPending: any[], 
  initialVerified?: any[] 
}) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [pendingItems, setPendingItems] = useState(initialPending);
  const [verifiedItems, setVerifiedItems] = useState(initialVerified);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const filteredPending = pendingItems.filter(item => 
    item.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.metadata?.wallet_address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVerified = verifiedItems.filter(item => 
    item.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.metadata?.wallet_address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Default expiry: 1 year from now
  const [expiryDate, setExpiryDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  });

  const hashIdentity = async (applicantId: string): Promise<number[]> => {
    try {
      if (!applicantId) return new Array(32).fill(1); // Safety fallback
      const msgBuffer = new TextEncoder().encode(applicantId);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      return Array.from(new Uint8Array(hashBuffer));
    } catch (e) {
      console.error("Hashing failed, using fallback", e);
      return new Array(32).fill(1);
    }
  };

  const handleApprove = async (kyc: any, walletAddress: string) => {
    if (!wallet.connected) {
      setError("Please connect your admin wallet first.");
      return;
    }

    setLoadingId(kyc.id);
    setError(null);

    try {
      const service = new ComplianceService(connection, wallet);
      
      const identityHash = await hashIdentity(kyc.provider_applicant_id); 
      const expiryTimestamp = Math.floor(new Date(expiryDate).getTime() / 1000);

      // 1. Blockchain Transaction
      const result = await service.recordVerifiedWallet({
        wallet: walletAddress,
        kycStatus: 1, // Pass as number (mapped to Anchor object in Service)
        amlStatus: 0, 
        identityHash,
        investmentAllowed: true,
        transferAllowed: true,
        expiryTimestamp,
      });

      if (!result.success) {
        throw new Error(result.error || "On-chain transaction failed");
      }

      // 2. Server-side DB Synchronization
      const syncResult = await syncKycApprovalAction({
        wallet: walletAddress,
        kycStatus: 1, // Keep as number for Database sync
        amlStatus: 0, 
        identityHash,
        investmentAllowed: true,
        transferAllowed: true,
        expiryTimestamp,
        signature: result.data.signature
      });

      if (!syncResult.success) {
        console.warn("[ComplianceReviewList] On-chain success but DB sync failed:", syncResult.error);
        setError("On-chain verification succeeded, but database sync failed. Please refresh.");
      }

      setPendingItems(prev => prev.filter(p => p.id !== kyc.id));
      alert(`Success! Investor verified.\nTX: ${result.data.signature}`);

    } catch (err: any) {
      setError(err.message || "Operation failed");
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleBypass = async (walletAddress: string, currentState: boolean) => {
    if (!wallet.connected) return;
    setLoadingId(walletAddress);
    setError(null);
    try {
      const service = new ComplianceService(connection, wallet);
      const result = await service.toggleLockupBypass(walletAddress, !currentState);
      if (!result.success) throw new Error(result.error || "Failed to toggle bypass");
      alert(`Success! Lockup bypass ${!currentState ? 'ENABLED' : 'DISABLED'} for ${walletAddress}`);
    } catch (err: any) {
      setError(err.message || "Bypass toggle failed");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (kyc: any, walletAddress: string) => {
    if (!wallet.connected) return;

    setLoadingId(kyc.id);
    setError(null);

    try {
      const service = new ComplianceService(connection, wallet);
      
      // 1. Blockchain Transaction
      const result = await service.revokeWallet({ wallet: walletAddress });

      if (!result.success) {
        throw new Error(result.error || "On-chain revocation failed");
      }

      // 2. Server-side DB Synchronization
      const syncResult = await syncKycRevokeAction({
        wallet: walletAddress,
        signature: result.data.signature
      });

      if (syncResult.success) {
        setPendingItems(prev => prev.filter(p => p.id !== kyc.id));
      } else {
        setError("On-chain revocation succeeded, but DB sync failed.");
      }
    } catch (err: any) {
      setError(err.message || "Operation failed");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-200 hover:text-white">&times;</button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative group mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input 
          type="text"
          placeholder="Search by email or wallet address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-navy border border-gold/20 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-gold transition-all shadow-lg focus:shadow-gold/10"
        />
      </div>

      {/* Results Section */}
      {searchTerm && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-gray-400 text-sm">Found {filteredPending.length + filteredVerified.length} results for "{searchTerm}"</span>
          <button onClick={() => setSearchTerm('')} className="text-gold text-xs hover:underline">Clear</button>
        </div>
      )}

      {(filteredPending.length === 0 && filteredVerified.length === 0) ? (
        <div className="glass rounded-xl p-12 border border-gold/20 text-center">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-gray-400 text-lg">No matching requests found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Show Pending First */}
          {filteredPending.map((kyc: any) => (
            <KycCard 
              key={kyc.id} 
              kyc={kyc} 
              onApprove={handleApprove} 
              onReject={handleReject}
              onToggleBypass={handleToggleBypass}
              isLoading={loadingId === kyc.id || loadingId === (kyc.metadata?.wallet_address)}
              expiryDate={expiryDate}
              setExpiryDate={setExpiryDate}
            />
          ))}

          {/* Then Show Verified if searching */}
          {searchTerm && filteredVerified.length > 0 && (
            <>
              <div className="flex items-center gap-4 py-4">
                <div className="h-[1px] flex-1 bg-gold/20"></div>
                <span className="text-gold/50 text-[10px] font-bold uppercase tracking-widest">Verified Investors</span>
                <div className="h-[1px] flex-1 bg-gold/20"></div>
              </div>
              {filteredVerified.map((kyc: any) => (
                <KycCard 
                  key={kyc.id} 
                  kyc={kyc} 
                  onApprove={handleApprove} 
                  onReject={handleReject}
                  onToggleBypass={handleToggleBypass}
                  isLoading={loadingId === kyc.id || loadingId === (kyc.metadata?.wallet_address)}
                  expiryDate={expiryDate}
                  setExpiryDate={setExpiryDate}
                />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function KycCard({ kyc, onApprove, onReject, onToggleBypass, isLoading, expiryDate, setExpiryDate }: any) {
  const walletAddress = kyc.metadata?.wallet_address || ""; 
  const [shouldVerify, setShouldVerify] = useState(false);
  const { eligibility, loading: onChainLoading, error: rpcError } = useWalletEligibility(walletAddress, { enabled: shouldVerify });

  if (!walletAddress) {
    return (
      <div className="glass rounded-xl p-6 border border-red-500/20">
        <p className="text-red-400 text-sm">Error: No wallet address linked to this profile.</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6 border border-gold/20 transition-all hover:border-gold/40">
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white">
              {kyc.user?.first_name} {kyc.user?.last_name}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
              kyc.status === 'approved' || kyc.status === 'verified' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {kyc.status === 'approved' || kyc.status === 'verified' ? 'KYC VERIFIED' : kyc.status}
            </span>
            
            {shouldVerify ? (
              onChainLoading ? (
                <span className="animate-pulse bg-gold/10 text-gold/60 px-3 py-1 rounded-full text-xs font-medium">
                  CHECKING CHAIN...
                </span>
              ) : eligibility ? (
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-medium">
                   ON-CHAIN VERIFIED
                </span>
              ) : rpcError ? (
                <span className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-medium">
                   RPC ERROR (RATE LIMIT)
                </span>
              ) : (
                <span className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-xs font-medium">
                  NOT FOUND ON-CHAIN
                </span>
              )
            ) : (
              <button 
                onClick={() => setShouldVerify(true)}
                className="bg-gold/10 hover:bg-gold/20 text-gold px-3 py-1 rounded-full text-xs font-medium transition-colors border border-gold/30"
              >
                🔍 VERIFY ON-CHAIN
              </button>
            )}
          </div>

          <p className="text-gray-400 text-sm mb-4">{kyc.user?.email}</p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm mb-6">
            <div className="space-y-1">
              <span className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Passport / ID</span>
              <p className="text-white font-mono text-xs truncate">
                {kyc.provider_applicant_id}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Nationality</span>
              <p className="text-white">{kyc.nationality || 'Not specified'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-gray-500 uppercase text-[10px] font-bold tracking-widest">Target Wallet</span>
              <p className="text-gold font-mono text-xs truncate">{walletAddress}</p>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col gap-3">
          <div className="flex flex-col gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
            <label className="text-[10px] text-gray-400 uppercase font-bold">Verification Expiry</label>
            <input 
              type="date" 
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="bg-navy border border-gold/30 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-gold"
            />
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => onApprove(kyc, walletAddress)}
              disabled={isLoading}
              className="flex-1 bg-green-500/80 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            >
              {isLoading ? 'Processing...' : 'Approve On-Chain'}
            </button>
            {eligibility && (
              <button 
                onClick={() => onToggleBypass(walletAddress, eligibility.lockupBypass)}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg font-bold transition-all border ${
                  eligibility.lockupBypass 
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/30 hover:bg-orange-500/30' 
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30'
                }`}
                title={eligibility.lockupBypass ? "Disable Emergency Exit" : "Enable Emergency Exit"}
              >
                {eligibility.lockupBypass ? '🔓 Unlocked' : '🔒 Locked'}
              </button>
            )}
            <button 
              onClick={() => onReject(kyc, walletAddress)}
              disabled={isLoading}
              className="bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30 font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
