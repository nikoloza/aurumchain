"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { PublicKey } from '@solana/web3.js';

export default function PayoutsTab() {
  const [loading, setLoading] = useState(true);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const { investments: onChainInvestments } = useDashboardData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        let userId = user?.id;

        if (!userId && publicKey) {
          const { data: link } = await supabase
            .from('wallet_links')
            .select('user_id')
            .eq('wallet_address', publicKey.toBase58())
            .maybeSingle();
          
          if (link) userId = link.user_id;
        }

        if (!userId) {
          setLoading(false);
          return;
        }

        const { data: dbRecords } = await supabase
          .from('payout_records')
          .select(`
            *,
            projects(id, name, token_symbol, blockchain_project_id, token_price),
            payout_cycles(name, profit_per_token)
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!dbRecords) {
          setLoading(false);
          return;
        }

        // Enrich records with profit metrics
        const enrichedRecords = dbRecords.map(record => {
          const totalInvestedForProject = onChainInvestments
            ?.filter(inv => 
              inv.project_id === record.project_id || 
              inv.projects?.id === record.project_id
            )
            .reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0) || 0;

          const epochWiseNetProfit = Number(record.amount_due) - totalInvestedForProject;

          return { 
            ...record, 
            totalInvestedForProject, 
            epochWiseNetProfit,
            // Fallback for missing cycle names
            payout_cycles: record.payout_cycles || { name: `Epoch #${record.project_id.slice(0,4)}` }
          };
        });

        setPayouts(enrichedRecords);
        const total = enrichedRecords.reduce((acc, r) => acc + (Number(r.amount_due) || 0), 0);
        setTotalEarned(total);
        
      } catch (err) {
        console.error("Error fetching distributions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
  }, [publicKey, connection, onChainInvestments]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6 border border-gold/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">💰</div>
          <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">Total Lifetime Earnings</h3>
          <div className="text-2xl font-black gradient-text">${totalEarned.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} USDC</div>
        </div>
        
        <div className="glass rounded-xl p-6 border border-white/5">
          <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">Total Payouts</h3>
          <div className="text-2xl font-black text-white">{payouts.length}</div>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="glass rounded-xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h2 className="text-lg font-bold text-white">Payout History</h2>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-12 bg-white/5 animate-pulse rounded-lg"></div>)}
          </div>
        ) : payouts.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3 opacity-20">💸</div>
            <h3 className="text-lg font-bold text-white mb-1">No Distributions Yet</h3>
            <p className="text-gray-500 text-sm">You haven't received any payouts yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-gray-500 text-[10px] uppercase tracking-widest bg-black/20">
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Project</th>
                  <th className="p-4 font-bold">Epoch</th>
                  <th className="p-4 font-bold text-right">Invested</th>
                  <th className="p-4 font-bold text-right">Tokens</th>
                  <th className="p-4 font-bold text-right">Payout</th>
                  <th className="p-4 font-bold text-right">Net Profit</th>
                  <th className="p-4 font-bold text-center">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="text-sm text-white">
                        {new Date(payout.paid_at || payout.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-bold text-white">
                        {payout.projects?.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-[10px] px-2 py-0.5 bg-white/5 rounded text-gray-300 inline-block font-medium">
                        {payout.payout_cycles?.name || `Epoch #${payout.epoch_id}`}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-sm text-gray-400">
                        ${Number(payout.totalInvestedForProject || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-sm text-white font-mono">
                        {Number(payout.tokens_held).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="text-sm font-black text-white">
                        ${Number(payout.amount_due).toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className={`text-sm font-bold ${payout.epochWiseNetProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {payout.epochWiseNetProfit >= 0 ? '+' : '-'} ${Math.abs(payout.epochWiseNetProfit).toLocaleString(undefined, {minimumFractionDigits: 2})}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      {payout.tx_hash ? (
                        <a 
                          href={`https://solscan.io/tx/${payout.tx_hash}?cluster=devnet`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                        >
                          ↗
                        </a>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
}
