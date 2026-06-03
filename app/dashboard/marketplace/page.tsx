'use client';

import { useState, useEffect, useMemo } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { BuyListingModal } from '@/app/_components/marketplace/BuyListingModal';
import { SecondaryMarketService } from '@/lib/web3/services/secondaryMarketService';
import { ListTokenModal } from '@/app/_components/portfolio/ListTokenModal';
import { createClient } from '@/lib/supabase/client';

export default function TokenMarketplacePage() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [cancellingListingId, setCancellingListingId] = useState<string | null>(null);

  // States for selecting and listing token
  const [isSelectTokenModalOpen, setIsSelectTokenModalOpen] = useState(false);
  const [eligiblePositions, setEligiblePositions] = useState<any[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<any | null>(null);
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  const fetchListings = async () => {
    try {
      setLoading(true);
      // Hit the new Orderbook API instead of raw listings
      const res = await fetch('/api/secondary-market/orderbook');
      if (!res.ok) throw new Error('Failed to load orderbook');
      const data = await res.json();
      setListings(data);
    } catch (err: any) {
      console.error("[TokenMarketplace] Error fetching orderbook:", err);
      setError(err.message || 'Failed to fetch orderbook');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const secondaryMarketService = useMemo(() => {
    if (!connection || !publicKey) return null;
    const mockWallet = {
      publicKey,
      sendTransaction: (tx: any, conn: any, opts: any) => sendTransaction(tx, conn, opts),
    };
    return new SecondaryMarketService(connection, mockWallet);
  }, [connection, publicKey, sendTransaction]);

  const handleBuyClick = (listing: any) => {
    setSelectedListing(listing);
    setIsBuyModalOpen(true);
  };

  const handleListTokenClick = async () => {
    if (!publicKey) {
      alert("Please connect your wallet first.");
      return;
    }
    
    setIsSelectTokenModalOpen(true);
    setLoadingPositions(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('portfolio_positions')
        .select(`
          *,
          projects:project_id (
            id,
            name,
            slug,
            location,
            country,
            status,
            token_symbol,
            token_decimals,
            blockchain_project_id,
            mint_address,
            images,
            lockup_end_date
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const filtered = (data || []).filter((pos: any) => {
        if (!pos.projects || Number(pos.total_tokens) <= 0) return false;
        if (pos.projects.status !== 'active') return false;
        if (!pos.projects.lockup_end_date) return false;
        return new Date(pos.projects.lockup_end_date).getTime() < Date.now();
      });
      setEligiblePositions(filtered);
    } catch (err) {
      console.error("[TokenMarketplace] Error loading positions for listing:", err);
    } finally {
      setLoadingPositions(false);
    }
  };

  if (loading && listings.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white text-xl flex items-center gap-3">
          <svg className="animate-spin h-6 w-6 text-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading marketplace offers...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Token Marketplace</h1>
          <p className="text-gray-400">Buy and sell project fractional tokens peer-to-peer</p>
        </div>
        <button
          onClick={handleListTokenClick}
          className="px-6 py-3 bg-gradient-to-r from-gold to-gold-light hover:scale-105 text-navy font-bold rounded-xl transition-all shadow-lg shadow-gold/20 text-sm flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          List Token
        </button>
      </div>

      {listings.length === 0 ? (
        <div className="glass rounded-xl p-12 border border-gold/20 text-center">
          <svg className="w-16 h-16 text-gold/20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h3 className="text-xl font-bold text-white mb-2">No Active Listings</h3>
          <p className="text-gray-400">There are currently no active fractional tokens listed for sale on the secondary market.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => {
            return (
              <div 
                key={listing.id} 
                className="glass rounded-xl p-6 border border-gold/20 hover:border-gold/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gold mb-1">{listing.projects?.name}</h3>
                      <p className="text-xs text-gray-400">{listing.projects?.location}, {listing.projects?.country}</p>
                    </div>
                    <span className="bg-gold/10 text-gold text-xs px-3 py-1 rounded-full font-bold border border-gold/20">
                      {listing.projects?.token_symbol}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6 bg-navy-dark/40 border border-gold/5 p-4 rounded-lg text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price per Token:</span>
                      <span className="text-white font-bold">${Number(listing.price).toFixed(2)} USDC</span>
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
                  className="w-full bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold text-navy font-bold py-3 rounded-lg transition-all text-sm"
                >
                  Buy Tokens
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Select Token Modal */}
      {isSelectTokenModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSelectTokenModalOpen(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-[#0A1628] rounded-2xl border-2 border-gold/30 shadow-2xl shadow-gold/20 max-w-lg w-full p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -mr-16 -mt-16" />
              
              <button 
                onClick={() => setIsSelectTokenModalOpen(false)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-2xl font-bold text-white mb-2">Select Token to List</h2>
              <p className="text-xs text-gray-400 mb-6">Choose one of your active positions to list on the secondary marketplace.</p>

              {loadingPositions ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold"></div>
                </div>
              ) : eligiblePositions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p className="mb-2">No eligible tokens found in your portfolio.</p>
                  <p className="text-[10px]">Only tokens from active projects can be listed for sale.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {eligiblePositions.map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => {
                        setSelectedPosition({
                          total_tokens: Number(pos.total_tokens),
                          project_id: pos.project_id,
                          projects: pos.projects
                        });
                        setIsSelectTokenModalOpen(false);
                        setIsListModalOpen(true);
                      }}
                      className="w-full text-left p-4 bg-[#0e1d33] hover:bg-gold/5 border border-gold/15 rounded-xl transition-all flex justify-between items-center group"
                    >
                      <div>
                        <p className="font-bold text-white group-hover:text-gold transition-colors">{pos.projects.name}</p>
                        <p className="text-xs text-gray-400">{pos.projects.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gold">{Number(pos.total_tokens).toLocaleString()} {pos.projects.token_symbol}</p>
                        <p className="text-[10px] text-gray-500">${Number(pos.total_invested).toLocaleString()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Buy Listing Modal */}
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

      {/* List Token Modal */}
      <ListTokenModal
        isOpen={isListModalOpen}
        onClose={() => {
          setIsListModalOpen(false);
          setSelectedPosition(null);
        }}
        position={selectedPosition}
        onSuccess={fetchListings}
      />
    </div>
  );
}
