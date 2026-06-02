
"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { InvestmentModal } from "../../_components/projects/InvestmentModal";
import { BuyListingModal } from "../../_components/marketplace/BuyListingModal";

// --- Types ---
interface ProjectDetails {
  project: any;
  recentPurchases: any[];
  topHolders: any[];
  payoutCycles: any[];
}

// --- Helpers ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatTokens = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

const truncateAddress = (address: string) => {
  if (!address) return "—";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function ProjectPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [data, setData] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [secondaryListings, setSecondaryListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/projects/${slug}/details`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.details || errorData.error || "Failed to load project details");
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    async function loadUser() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
        }
      } catch (err) {
        console.error("[ProjectPage] Error fetching user:", err);
      }
    }
    loadUser();
  }, []);

  const isLockupPassed = useMemo(() => {
    if (!data?.project) return false;
    const proj = data.project;
    if (proj.status !== 'active') return false;
    if (!proj.lockup_end_date) return false;
    return new Date(proj.lockup_end_date).getTime() < Date.now();
  }, [data?.project]);

  const fetchSecondaryListings = async () => {
    if (!isLockupPassed || !data?.project?.id) return;
    setLoadingListings(true);
    try {
      const res = await fetch(`/api/secondary-market/listings?projectId=${data.project.id}&status=active`);
      if (res.ok) {
        const json = await res.json();
        setSecondaryListings(json);
      }
    } catch (err) {
      console.error("[ProjectPage] Error fetching secondary listings:", err);
    } finally {
      setLoadingListings(false);
    }
  };

  useEffect(() => {
    if (isLockupPassed && data?.project?.id) {
      fetchSecondaryListings();
    }
  }, [isLockupPassed, data?.project?.id]);

  const filteredListings = useMemo(() => {
    if (!currentUserId) return secondaryListings;
    return secondaryListings.filter(l => l.investor_id !== currentUserId);
  }, [secondaryListings, currentUserId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-navy pt-32 px-6">
        <div className="max-w-4xl mx-auto glass p-12 border border-red-500/30 text-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Project Loading Error</h1>
          <div className="bg-black/30 rounded-xl p-4 mb-8 text-left font-mono text-sm text-red-200 border border-red-500/20 whitespace-pre-wrap">
            {error || "Unknown error occurred while fetching project details."}
          </div>
          <Link href="/projects" className="inline-flex items-center gap-2 text-gold hover:text-gold-light font-bold">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const { project, recentPurchases, topHolders, payoutCycles } = data;
  const onChain = project.onChain;
  
  // Derived Stats
  const tokenPrice = onChain?.tokenPriceUsdc || project.token_price || 0;
  const supplyCap = onChain?.supplyCap || project.total_tokens || 0;
  const issued = onChain?.tokensIssued || project.current_funding / (tokenPrice || 1) || 0;
  const marketCap = issued * tokenPrice;
  const progressPct = supplyCap > 0 ? Math.min(100, Math.round((issued / supplyCap) * 100)) : 0;

  return (
    <div className="min-h-screen bg-navy pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 lg:px-24 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column: Info & Description */}
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold/10 text-gold border border-gold/30">
                    Project Profile
                  </span>
                  {onChain && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      Live On-Chain
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    project.status === 'funding' ? 'bg-gold/20 text-gold border border-gold/30' :
                    project.status === 'active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                  {project.name} <span className="text-gold">[{onChain?.symbol || "TOKEN"}]</span>
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                  {project.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {project.status === 'funding' && (
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 py-4 bg-gradient-to-r from-gold to-gold-light text-navy font-bold rounded-xl shadow-xl shadow-gold/20 hover:scale-105 transition-all"
                  >
                    Buy {onChain?.symbol || "Tokens"} Now
                  </button>
                )}
                <Link 
                  href={`https://solscan.io/address/${onChain?.mint}?cluster=devnet`}
                  target="_blank"
                  className="px-8 py-4 glass border border-gold/30 text-white font-bold rounded-xl hover:border-gold/60 transition-all flex items-center gap-2"
                >
                  View Mint on Explorer
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </Link>
              </div>
            </div>

            {/* Right Column: Key Metrics Card */}
            <div className="w-full lg:w-[400px]">
              <div className="glass rounded-3xl p-8 border border-gold/20 shadow-2xl space-y-6">
                <div className="flex justify-between items-end border-b border-gold/10 pb-4">
                  <div>
                    <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Current Price</p>
                    <p className="text-3xl font-bold text-white">{formatCurrency(tokenPrice)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 text-sm font-bold">+0.00%</p>
                    <p className="text-gray-500 text-xs">Last 24h</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Cap</span>
                    <span className="text-white font-bold">{formatCurrency(marketCap)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Circulating Supply</span>
                    <span className="text-white font-bold">{formatTokens(issued)} {onChain?.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Supply Cap</span>
                    <span className="text-white font-bold">{formatTokens(supplyCap)} {onChain?.symbol}</span>
                  </div>
                  {project.lockup_end_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Lockup End</span>
                      <span className="text-white font-bold">{new Date(project.lockup_end_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs pt-2">
                    <span className="text-gray-500 italic">Blockchain Verified</span>
                    <span className="text-gold font-mono">{truncateAddress(onChain?.mint)}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Supply Distribution</span>
                    <span className="text-gold font-bold">{progressPct}% Issued</span>
                  </div>
                  <div className="w-full h-2.5 bg-navy/60 rounded-full border border-gold/10 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-1000"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          
          {/* Top Holders Section */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Top Holders
            </h3>
            <div className="glass rounded-2xl border border-gold/10 overflow-hidden">
              <div className="p-0">
                <table className="w-full text-sm text-left">
                  <thead className="bg-navy-dark/50 text-gray-400 uppercase text-xs border-b border-gold/10">
                    <tr>
                      <th className="px-6 py-4 font-medium">Rank</th>
                      <th className="px-6 py-4 font-medium">Address</th>
                      <th className="px-6 py-4 font-medium text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/5">
                    {topHolders.length > 0 ? topHolders.map((holder, idx) => (
                      <tr key={idx} className="hover:bg-gold/5 transition-colors group">
                        <td className="px-6 py-4 font-bold text-gray-500">#{idx + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-white font-medium group-hover:text-gold transition-colors">{holder.name}</span>
                            <span className="text-[10px] text-gray-500 font-mono">{truncateAddress(holder.wallet)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-white font-bold">{formatTokens(holder.tokens)}</p>
                          <p className="text-[10px] text-gray-500 italic">{( (holder.tokens / supplyCap) * 100 ).toFixed(2)}%</p>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-gray-500">No holders found yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Recent Purchases Section & Secondary Listings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Purchases */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Recent Token Purchases
              </h3>
              <div className="glass rounded-2xl border border-gold/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-navy-dark/50 text-gray-400 uppercase text-xs border-b border-gold/10">
                      <tr>
                        <th className="px-6 py-4 font-medium">Time</th>
                        <th className="px-6 py-4 font-medium">Investor</th>
                        <th className="px-6 py-4 font-medium">Amount</th>
                        <th className="px-6 py-4 font-medium">Tokens</th>
                        <th className="px-6 py-4 font-medium">Transaction</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold/5">
                      {recentPurchases.length > 0 ? recentPurchases.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-gold/5 transition-colors">
                          <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                            {new Date(tx.invested_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            <span className="block text-[10px]">{new Date(tx.invested_at).toLocaleDateString()}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-white font-medium">
                              {tx.user ? [tx.user.first_name, tx.user.last_name].filter(Boolean).join(' ') : "Anonymous"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-green-400 font-bold">
                            {formatCurrency(tx.amount)}
                          </td>
                          <td className="px-6 py-4 text-white">
                            {formatTokens(tx.tokens_purchased)} {onChain?.symbol}
                          </td>
                          <td className="px-6 py-4">
                            {tx.finalized_tx_hash ? (
                              <a 
                                href={`https://solscan.io/tx/${tx.finalized_tx_hash}?cluster=devnet`}
                                target="_blank"
                                className="text-gold hover:underline font-mono text-xs"
                              >
                                {truncateAddress(tx.finalized_tx_hash)}
                              </a>
                            ) : (
                              <span className="text-gray-500 italic text-xs">Pending</span>
                            )}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No recent purchases found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Secondary Market Listings */}
            {isLockupPassed && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Secondary Market Listings
                </h3>
                <div className="glass rounded-2xl border border-gold/10 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-navy-dark/50 text-gray-400 uppercase text-xs border-b border-gold/10">
                        <tr>
                          <th className="px-6 py-4 font-medium">Seller</th>
                          <th className="px-6 py-4 font-medium">Available Amount</th>
                          <th className="px-6 py-4 font-medium">Price (USDC)</th>
                          <th className="px-6 py-4 font-medium">Total Value</th>
                          <th className="px-6 py-4 font-medium text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold/5">
                        {filteredListings.length > 0 ? filteredListings.map((listing: any) => {
                          const sellerAddr = listing.profiles?.wallet_address || listing.profiles?.crypto_wallet_address || '';
                          const totalVal = Number(listing.remaining) * Number(listing.token_listing_price);
                          return (
                            <tr key={listing.id} className="hover:bg-gold/5 transition-colors group animate-fade-in">
                              <td className="px-6 py-4 font-mono text-xs text-white">
                                {sellerAddr ? `${sellerAddr.slice(0, 8)}...${sellerAddr.slice(-8)}` : 'Unknown'}
                                {listing.investor_id === currentUserId && (
                                  <span className="ml-2 px-1.5 py-0.5 rounded bg-gold/15 text-gold text-[9px] font-bold uppercase tracking-wider">
                                    Your Listing
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-white font-bold">
                                {formatTokens(listing.remaining)} {onChain?.symbol || 'Tokens'}
                              </td>
                              <td className="px-6 py-4 text-gold font-bold">
                                ${Number(listing.token_listing_price).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 text-gray-400">
                                ${totalVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedListing({
                                      ...listing,
                                      projects: {
                                        ...listing.projects,
                                        blockchain_project_id: project.blockchain_project_id,
                                        blockchain_mint_address: project.blockchain_mint_address || project.mint_address,
                                        accepted_stablecoin: project.accepted_stablecoin,
                                        token_decimals: project.token_decimals
                                      }
                                    });
                                    setIsBuyModalOpen(true);
                                  }}
                                  className="px-4 py-2 bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-xs rounded-lg hover:scale-105 transition-all shadow-md shadow-gold/10"
                                >
                                  Buy
                                </button>
                              </td>
                            </tr>
                          );
                        }) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                              No active listings from other sellers on the secondary market.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Payout History Section (Visible if project is active or has payouts) */}
      {(project.status === 'active' || payoutCycles?.length > 0) && (
        <section className="mt-20 px-6 md:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Dividend Distribution History
                </h3>
                <p className="text-gray-400 text-sm mt-1">Track payouts and gold yield for this project.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="glass p-6 border border-gold/10 rounded-2xl">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Total Distributed</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(payoutCycles?.reduce((sum: number, c: any) => sum + (c.total_amount || 0), 0) || 0)}</p>
              </div>
              <div className="glass p-6 border border-gold/10 rounded-2xl">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Payout Frequency</p>
                <p className="text-2xl font-bold text-white">Quarterly</p>
              </div>
              <div className="glass p-6 border border-gold/10 rounded-2xl">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Last Payout</p>
                <p className="text-2xl font-bold text-green-400">
                  {payoutCycles && payoutCycles[0] ? formatCurrency(payoutCycles[0].total_amount) : "—"}
                </p>
              </div>
              <div className="glass p-6 border border-gold/10 rounded-2xl">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Next Scheduled</p>
                <p className="text-2xl font-bold text-gold">Q3 2026</p>
              </div>
            </div>

            <div className="glass rounded-2xl border border-gold/10 overflow-hidden mt-8">
              <table className="w-full text-sm text-left">
                <thead className="bg-navy-dark/50 text-gray-400 uppercase text-xs border-b border-gold/10">
                  <tr>
                    <th className="px-6 py-4 font-medium">Payout Name</th>
                    <th className="px-6 py-4 font-medium">Period</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Yield</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Transaction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/5">
                  {payoutCycles && payoutCycles.length > 0 ? payoutCycles.map((cycle, idx) => (
                    <tr key={idx} className="hover:bg-gold/5 transition-colors">
                      <td className="px-6 py-4 text-white font-bold">{cycle.name}</td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(cycle.period_start).toLocaleDateString()} - {new Date(cycle.period_end).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-white font-mono">
                        {formatCurrency(cycle.total_amount)}
                      </td>
                      <td className="px-6 py-4 text-gold font-bold">
                        {cycle.amount_per_token ? `$${cycle.amount_per_token.toFixed(4)} / Token` : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          cycle.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-gold/20 text-gold'
                        }`}>
                          {cycle.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {cycle.distribution_tx_hash ? (
                          <a 
                            href={`https://solscan.io/tx/${cycle.distribution_tx_hash}?cluster=devnet`}
                            target="_blank"
                            className="text-gold hover:underline font-mono text-xs"
                          >
                            {truncateAddress(cycle.distribution_tx_hash)}
                          </a>
                        ) : (
                          <span className="text-gray-500 italic text-xs">Internal</span>
                        )}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No payout history recorded yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Project Gallery / Details */}
      <section className="mt-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-gold/20 shadow-2xl">
              {project.images && project.images[0] ? (
                <img src={project.images[0]} alt="Project Detail" className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-navy-dark to-navy flex items-center justify-center">
                  <Image src="/logo.png" alt="Logo" width={120} height={120} className="opacity-20" />
                </div>
              )}
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white">Geological & Financial Overview</h3>
              <p className="text-gray-400 leading-relaxed">
                This project focuses on sustainable extraction and processing using state-of-the-art technology. 
                Our on-chain model ensures that every gram of gold produced is tracked and distributed 
                transparently to token holders.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass p-4 border border-gold/10 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase">Estimated Reserve</p>
                  <p className="text-xl font-bold text-gold">250,000 oz</p>
                </div>
                <div className="glass p-4 border border-gold/10 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase">Annual Target</p>
                  <p className="text-xl font-bold text-gold">15,000 oz</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Modal */}
      {isModalOpen && (
        <InvestmentModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          project={project}
        />
      )}

      {/* Buy Listing Modal */}
      {isBuyModalOpen && selectedListing && (
        <BuyListingModal
          isOpen={isBuyModalOpen}
          onClose={() => setIsBuyModalOpen(false)}
          listing={selectedListing}
          onSuccess={() => {
            fetchSecondaryListings();
            const reloadDetails = async () => {
              try {
                const res = await fetch(`/api/projects/${slug}/details`);
                if (res.ok) {
                  const json = await res.json();
                  setData(json);
                }
              } catch (err) {
                console.error(err);
              }
            };
            reloadDetails();
          }}
        />
      )}
    </div>
  );
}
