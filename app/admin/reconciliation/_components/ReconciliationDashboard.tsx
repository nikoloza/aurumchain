"use client";

import { useState, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';
import { createClient } from '@/lib/supabase/client';
import { getComplianceProgram } from '@/lib/web3/utils/programDiscoverer';

interface ReconciliationResult {
  projectId: string;
  projectName: string;
  onChainSupply: number;
  dbTotal: number;
  delta: number;
  status: 'match' | 'mismatch' | 'loading' | 'error';
  orphanedWallets: any[]; // Changed from string[] to any[]
  missingLedgerWallets: any[];
  ghostRecords: any[];
}

export function ReconciliationDashboard({ initialProjects }: { initialProjects: any[] }) {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [results, setResults] = useState<Record<string, ReconciliationResult>>({});
  const [isScanning, setIsScanning] = useState(false);
  const [repairingEntry, setRepairingEntry] = useState<any | null>(null); // Changed from repairingWallet
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [repairingProject, setRepairingProject] = useState<string | null>(null);

  const runReconciliation = async () => {
    if (!wallet.publicKey) return;
    setIsScanning(true);

    for (const project of initialProjects) {
      await new Promise(r => setTimeout(r, 100));

      setResults(prev => ({
        ...prev,
        [project.id]: {
          projectId: project.id,
          projectName: project.name,
          onChainSupply: 0,
          dbTotal: 0,
          delta: 0,
          status: 'loading',
          orphanedWallets: [],
          missingLedgerWallets: []
        }
      }));

      try {
        let onChainSupply = 0;
        if (project.mint_address || project.mint) {
          const mintInfo = await connection.getTokenSupply(new PublicKey(project.mint_address || project.mint));
          onChainSupply = mintInfo.value.uiAmount || 0;
        }

        const mintAddr = project.mint_address || project.mint;
        const dbRes = await fetch(`/api/admin/reconciliation?projectId=${project.id}`);
        
        if (!dbRes.ok) {
          const errorData = await dbRes.json().catch(() => ({}));
          setResults(prev => ({
            ...prev,
            [project.id]: { 
              projectId: project.id,
              projectName: project.name,
              dbTotal: 0,
              onChainSupply: 0,
              delta: 0,
              status: 'error',
              orphanedWallets: [],
              missingLedgerWallets: [],
              ghostRecords: [],
              errorMessage: errorData.error || `API ${dbRes.status}`
            }
          }));
          continue;
        }
        
        const dbData = await dbRes.json();
        
        setResults(prev => ({
          ...prev,
          [project.id]: {
            ...prev[project.id],
            onChainSupply,
            dbTotal: dbData.total || 0,
            delta: Math.abs(onChainSupply - (dbData.total || 0)),
            status: Math.abs(onChainSupply - (dbData.total || 0)) < 0.000001 ? 'match' : 'mismatch',
            orphanedWallets: dbData.orphanedWallets || [],
            missingLedgerWallets: dbData.missingLedgerWallets || []
          }
        }));
      } catch (err) {
        console.error(`Error reconciling project ${project.name}:`, err);
        setResults(prev => ({
          ...prev,
          [project.id]: { ...prev[project.id], status: 'error' }
        }));
      }
    }
    setIsScanning(false);
  };

  const handleSearchUser = async () => {
    if (!searchEmail) return;
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name')
      .ilike('email', `%${searchEmail}%`)
      .limit(5);
    setSearchResults(data || []);
  };

  const handleLinkWallet = async (user: any) => {
    if (!repairingEntry || !repairingProject) return;
    
    try {
      const res = await fetch('/api/admin/reconciliation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          projectId: repairingProject,
          amount: repairingEntry.tokens, // Use specific token count from Solana
          walletAddress: repairingEntry.wallet
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Server repair failed');
      }

      alert("Ledger successfully reconciled!");
      setRepairingEntry(null);
      setRepairingProject(null);
      setSearchEmail('');
      setSearchResults([]);
      runReconciliation(); 
    } catch (e: any) {
      alert(`Repair failed: ${e.message}`);
    }
  };

  const handleRemoveRecord = async (id: string) => {
    if (!confirm("Are you sure you want to remove this extra database record? This will permanently delete the investment from the DB to match the blockchain.")) return;
    
    try {
      const res = await fetch('/api/admin/reconciliation', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investmentId: id })
      });

      if (!res.ok) throw new Error('Failed to delete record');
      alert("Database record removed successfully.");
      runReconciliation();
    } catch (e: any) {
      alert(`Delete failed: ${e.message}`);
    }
  };

  const handleSyncLedger = async (entry: any, projectId: string) => {
    try {
      const res = await fetch('/api/admin/reconciliation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: entry.userId,
          projectId: projectId,
          amount: entry.tokens, // Use specific token count from Solana
          walletAddress: entry.wallet
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Sync failed');
      }

      alert('Ledger reconciled successfully!');
      runReconciliation();
    } catch (e: any) {
      alert(`Sync failed: ${e.message}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-navy/40 p-6 rounded-2xl border border-white/5">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Scanner Control</h3>
          <p className="text-sm text-gray-500">Run a full cross-check of all active projects</p>
        </div>
        <button 
          onClick={runReconciliation}
          disabled={isScanning || !wallet.publicKey}
          className="px-8 py-3 bg-gold text-navy font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all disabled:opacity-50"
        >
          {isScanning ? 'Scanning...' : 'Start Full Scan'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {Object.values(results).map((res) => (
          <div key={res.projectId} className="glass p-8 rounded-3xl border border-white/10">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h4 className="text-2xl font-black text-white">{res.projectName}</h4>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    res.status === 'match' ? 'bg-green-500/20 text-green-400' :
                    res.status === 'mismatch' ? 'bg-red-500/20 text-red-400' :
                    res.status === 'loading' ? 'bg-gold/20 text-gold animate-pulse' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {res.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">On-Chain Supply</p>
                    <p className="text-2xl font-black text-white">{res.onChainSupply.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Database Total</p>
                    <p className="text-2xl font-black text-white">{res.dbTotal.toLocaleString()}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 relative">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Delta</p>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className={`text-2xl font-black ${Math.abs(res.delta) < 0.01 ? 'text-green-400' : 'text-red-400'}`}>
                          {res.delta.toLocaleString()}
                        </p>
                        {Math.abs(res.delta) < 0.01 && res.orphanedWallets.length === 0 && res.missingLedgerWallets.length === 0 && (
                           <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[8px] font-black uppercase rounded border border-green-500/30">
                             Project Healthy
                           </span>
                        )}
                      </div>

                      {/* Suggested Instant Fixes */}
                      {(res.missingLedgerWallets.length > 0 || res.orphanedWallets.some(w => w.suggestedUser)) && (
                        <div className="pt-4 border-t border-white/5 space-y-2">
                          <p className="text-[10px] font-black text-gold uppercase tracking-tighter">Identified Solutions</p>
                          {res.missingLedgerWallets.slice(0, 2).map((m: any) => (
                            <button 
                              key={m.wallet}
                              onClick={() => handleSyncLedger(m, res.projectId)}
                              className="w-full flex items-center justify-between p-2 bg-gold/10 rounded-lg border border-gold/20 hover:bg-gold/20 transition-all group"
                            >
                              <span className="text-[10px] font-bold text-white group-hover:text-gold">{m.email}</span>
                              <span className="text-[10px] font-black text-gold">+{m.tokens.toLocaleString()}</span>
                            </button>
                          ))}
                          {res.orphanedWallets.filter(w => w.suggestedUser).slice(0, 2).map((w: any) => (
                            <button 
                              key={w.wallet}
                              onClick={() => handleSyncLedger({ 
                                userId: w.suggestedUser.id, 
                                email: w.suggestedUser.email,
                                tokens: w.tokens,
                                wallet: w.wallet
                              }, res.projectId)}
                              className="w-full flex items-center justify-between p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 hover:bg-blue-500/20 transition-all group"
                            >
                              <span className="text-[10px] font-bold text-white group-hover:text-blue-400">{w.suggestedUser.email}</span>
                              <span className="text-[10px] font-black text-blue-400">+{w.tokens.toLocaleString()}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Fallback Manual Fix (Only if scanner found nothing) */}
                      {res.delta > 0.01 && res.missingLedgerWallets.length === 0 && !res.orphanedWallets.some(w => w.suggestedUser) && (
                        <button 
                          onClick={() => {
                            setRepairingEntry({ wallet: 'MANUAL_SYNC', tokens: res.delta });
                            setRepairingProject(res.projectId);
                          }}
                          className="w-full py-2 bg-red-500 text-white text-[10px] font-black uppercase rounded-lg hover:bg-white hover:text-red-500 transition-all shadow-lg"
                        >
                          Manual Search Repair
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {(res.orphanedWallets.length > 0 || res.missingLedgerWallets.length > 0) && (
                <div className="lg:w-96 border-l border-white/10 lg:pl-8">
                  <h5 className="text-sm font-black text-gold uppercase tracking-widest mb-4 flex items-center gap-2">
                    {res.orphanedWallets.length + res.missingLedgerWallets.length} Actions Required
                  </h5>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {/* Orphaned Wallets (Unknown) */}
                    {res.orphanedWallets.map((entry, idx) => (
                      <div key={`${entry.address}-${idx}`} className="flex items-center justify-between p-3 bg-red-500/5 rounded-xl border border-red-500/10">
                        <div className="truncate w-40">
                          <p className="text-[10px] font-bold text-white">{entry.tokens.toLocaleString()} Tokens</p>
                          <p className="text-[8px] font-mono text-gray-500 truncate">{entry.wallet}</p>
                          {entry.suggestedUser && (
                            <p className="text-[8px] text-gold mt-1 font-bold italic truncate">Found owner: {entry.suggestedUser.email}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                          {entry.suggestedUser ? (
                            <button 
                              onClick={() => handleSyncLedger({ 
                                userId: entry.suggestedUser.id, 
                                email: entry.suggestedUser.email,
                                tokens: entry.tokens,
                                wallet: entry.wallet
                              }, res.projectId)}
                              className="px-2 py-1 bg-gold text-navy text-[8px] font-black uppercase rounded hover:bg-white transition-all shadow-glow-gold"
                            >
                              Quick Link
                            </button>
                          ) : (
                            <button 
                              onClick={() => {
                                setRepairingEntry(entry);
                                setRepairingProject(res.projectId);
                              }}
                              className="text-[10px] font-black uppercase text-gold hover:text-white transition-colors"
                            >
                              Repair Link
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Missing Ledger (Known User but no investment record) */}
                    {res.missingLedgerWallets.map((m: any, idx: number) => (
                      <div key={`${m.address}-${idx}`} className="flex items-center justify-between p-3 bg-gold/5 rounded-xl border border-gold/10">
                        <div className="truncate w-40">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[10px] font-bold text-white truncate">{m.email}</p>
                            <p className="text-[10px] font-black text-gold">{m.tokens.toLocaleString()}</p>
                          </div>
                          <p className="text-[8px] font-mono text-gray-500 truncate">{m.wallet}</p>
                        </div>
                        <button 
                          onClick={() => handleSyncLedger(m, res.projectId)}
                          className="px-2 py-1 bg-gold text-navy text-[8px] font-black uppercase rounded hover:bg-white transition-all"
                        >
                          Sync Ledger
                        </button>
                      </div>
                    ))}

                    {/* Cleanup: DB records with no on-chain proof */}
                    {res.ghostRecords && res.ghostRecords.length > 0 && (
                      <div className="pt-4 border-t border-white/10 mt-4">
                        <h5 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                          Cleanup Required (DB Only)
                        </h5>
                        <div className="space-y-2">
                          {res.ghostRecords.map((g: any) => (
                            <div key={g.id} className="flex items-center justify-between p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                              <div className="truncate w-40">
                                <p className="text-[10px] font-bold text-white">{g.email}</p>
                                <p className="text-[10px] font-black text-red-400">{g.tokens.toLocaleString()} Tokens</p>
                              </div>
                              <button 
                                onClick={() => handleRemoveRecord(g.id)}
                                className="px-2 py-1 bg-red-500 text-white text-[8px] font-black uppercase rounded hover:bg-white hover:text-red-500 transition-all"
                              >
                                Delete Extra
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Repair Modal */}
      {repairingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/90 backdrop-blur-md">
          <div className="bg-[#0D1B2D] border border-white/10 rounded-3xl w-full max-w-lg p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-white mb-1">Repair Wallet Link</h3>
                <p className="text-xs text-gold font-bold">{repairingEntry.tokens.toLocaleString()} Tokens Found On-Chain</p>
              </div>
              <button onClick={() => setRepairingEntry(null)} className="text-gray-500 hover:text-white text-2xl">×</button>
            </div>
            <p className="text-[10px] text-gray-500 font-mono mb-6 truncate bg-black/20 p-2 rounded">{repairingEntry.wallet}</p>
            
            {/* NEW: Suggested Fixes Inside Modal */}
            {repairingProject && (results[repairingProject]?.missingLedgerWallets?.length > 0 || results[repairingProject]?.orphanedWallets?.some(w => w.suggestedUser)) && (
              <div className="mb-8 p-4 bg-gold/5 border border-gold/10 rounded-2xl">
                <p className="text-[10px] font-black text-gold uppercase mb-3 tracking-widest">Identified Investors</p>
                <div className="space-y-2">
                  {results[repairingProject]?.missingLedgerWallets?.map((m: any) => (
                    <button 
                      key={m.wallet}
                      onClick={() => {
                        handleSyncLedger(m, repairingProject);
                        setRepairingEntry(null);
                      }}
                      className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-gold/50 transition-all text-left group"
                    >
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-gold">{m.email}</p>
                        <p className="text-[8px] text-gray-500 font-mono">{m.wallet}</p>
                      </div>
                      <span className="text-[8px] font-black text-gold uppercase">Sync Now</span>
                    </button>
                  ))}
                  {results[repairingProject]?.orphanedWallets?.filter(w => w.suggestedUser).map((w: any) => (
                    <button 
                      key={w.wallet}
                      onClick={() => {
                        handleSyncLedger({ 
                          userId: w.suggestedUser.id, 
                          email: w.suggestedUser.email,
                          tokens: w.tokens,
                          wallet: w.wallet
                        }, repairingProject);
                        setRepairingEntry(null);
                      }}
                      className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/50 transition-all text-left group"
                    >
                      <div>
                        <p className="text-xs font-bold text-white group-hover:text-blue-400">{w.suggestedUser.email}</p>
                        <p className="text-[8px] text-gray-500 font-mono">{w.wallet}</p>
                      </div>
                      <span className="text-[8px] font-black text-blue-400 uppercase">Sync Now</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase mb-2 tracking-widest">Manual Search (Backup)</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    placeholder="Enter investor email..."
                    className="flex-1 bg-navy/50 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 transition-all"
                  />
                  <button 
                    onClick={handleSearchUser}
                    className="p-4 bg-gold text-navy rounded-2xl hover:bg-white transition-all"
                  >
                    🔍
                  </button>
                </div>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-2 mt-4">
                  {searchResults.map(u => (
                    <button 
                      key={u.id}
                      onClick={() => handleLinkWallet(u)}
                      className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-gold/50 transition-all text-left"
                    >
                      <div>
                        <p className="text-sm font-bold text-white">{u.first_name} {u.last_name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                      <span className="text-[10px] font-black text-gold uppercase tracking-widest">Link Wallet</span>
                    </button>
                  ))}
                </div>
              )}

              <button 
                onClick={() => setRepairingEntry(null)}
                className="w-full py-4 text-gray-500 font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
