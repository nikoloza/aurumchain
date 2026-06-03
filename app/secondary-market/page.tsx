'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { BuyListingModal } from '@/app/_components/marketplace/BuyListingModal';

export default function PublicSecondaryMarketPage() {
  const router = useRouter();
  const { publicKey } = useWallet();

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    }
    checkAuth();
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/secondary-market/orderbook');
      if (!res.ok) throw new Error('Failed to load listings');
      const data = await res.json();
      setListings(data);
    } catch (err: any) {
      console.error("[PublicMarketplace] Error fetching listings:", err);
      setError(err.message || 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyClick = (listing: any) => {
    if (!isAuthenticated) {
      // Redirect to login if unauthenticated
      router.push(`/login?redirectTo=/secondary-market`);
      return;
    }
    
    setSelectedListing(listing);
    setIsBuyModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-navy pt-32 pb-20">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[150%] bg-gold/5 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[100%] bg-gold/5 rounded-full blur-[100px] mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block py-1 px-3 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold tracking-widest uppercase mb-4">
            Peer-to-Peer Trading
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Secondary <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-gold-light">Market</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Discover and purchase fractional gold mine tokens directly from other investors. Our on-chain marketplace ensures secure, transparent, and immediate settlement.
          </p>
        </div>

        {/* Listings Content */}
        {loading && listings.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white text-xl flex items-center gap-3">
              <svg className="animate-spin h-6 w-6 text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading marketplace offers...
            </div>
          </div>
        ) : listings.length === 0 ? (
          <div className="glass rounded-2xl p-12 border border-gold/20 text-center max-w-2xl mx-auto">
            <svg className="w-16 h-16 text-gold/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <h3 className="text-2xl font-bold text-white mb-2">No Active Listings</h3>
            <p className="text-gray-400">There are currently no fractional tokens listed for sale by investors. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => {
              // We removed 'isOwnListing' calculation here since sellers are grouped
              // It's possible to check if ANY seller is the user, but for now we omit it
              
              return (
                <div 
                  key={listing.id} 
                  className="glass rounded-2xl p-6 border border-gold/20 hover:border-gold/40 transition-all duration-300 flex flex-col justify-between group hover:shadow-2xl hover:shadow-gold/10"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <Link 
                          href={`/projects/${listing.projects.slug}`}
                          className="text-xl font-bold text-white group-hover:text-gold transition-colors inline-block mb-1"
                        >
                          {listing.projects.name}
                        </Link>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {listing.projects.location}, {listing.projects.country}
                        </p>
                      </div>
                      <span className="bg-gold/10 text-gold text-xs px-3 py-1 rounded-full font-bold border border-gold/20 shadow-sm">
                        {listing.projects.token_symbol}
                      </span>
                    </div>

                    <div className="space-y-4 mb-8 bg-navy-dark/60 border border-gold/10 p-5 rounded-xl text-sm shadow-inner">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Price per Token:</span>
                        <span className="text-white font-bold text-lg">${Number(listing.price).toFixed(2)} USDC</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Available:</span>
                        <span className="text-white font-bold text-gold">{Number(listing.totalRemaining).toLocaleString()}</span>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gold/10 flex flex-col gap-2">
                        <span className="text-gray-400 text-xs uppercase tracking-widest">Sellers in this pool:</span>
                        <div className="max-h-24 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                          {listing.sellers?.map((s: any, idx: number) => (
                            <div key={idx} className="flex justify-between items-center text-xs bg-[#0A1628] rounded p-2 border border-gold/10">
                              <span className="text-gold font-mono truncate mr-2 text-[10px]" title={s.address}>
                                {s.address}
                              </span>
                              <span className="text-white font-bold whitespace-nowrap">{s.remaining.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBuyClick(listing)}
                    className="w-full bg-gradient-to-r from-gold to-gold-light hover:scale-[1.02] active:scale-[0.98] text-navy font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-gold/20 flex items-center justify-center gap-2"
                  >
                    {isAuthenticated ? (
                      <>
                        Buy Tokens
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Log In to Buy
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {isBuyModalOpen && (
        <BuyListingModal
          isOpen={isBuyModalOpen}
          onClose={() => {
            setIsBuyModalOpen(false);
            setSelectedListing(null);
          }}
          listing={selectedListing}
          onSuccess={fetchListings}
        />
      )}
    </div>
  );
}
