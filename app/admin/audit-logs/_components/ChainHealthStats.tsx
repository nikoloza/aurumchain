"use client";

import { useEffect, useState } from 'react';
import { Connection } from '@solana/web3.js';

export function ChainHealthStats() {
  const [stats, setStats] = useState({
    blockHeight: 0,
    latency: 0,
    status: 'connecting',
    slot: 0,
    cluster: 'devnet'
  });

  useEffect(() => {
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
    const connection = new Connection(rpcUrl);
    
    const updateStats = async () => {
      const start = Date.now();
      try {
        const [slot, blockHeight] = await Promise.all([
          connection.getSlot(),
          connection.getBlockHeight()
        ]);
        
        const latency = Date.now() - start;
        
        setStats({
          blockHeight,
          latency,
          status: 'healthy',
          slot,
          cluster: rpcUrl.includes('mainnet') ? 'mainnet-beta' : 'devnet'
        });
      } catch (err) {
        console.error("Health check failed:", err);
        setStats(prev => ({ ...prev, status: 'error' }));
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 10000); // Update every 10s
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* RPC Status */}
      <div className="glass p-4 rounded-xl border border-white/5 relative overflow-hidden group">
        <div className={`absolute top-0 left-0 w-1 h-full ${
          stats.status === 'healthy' ? 'bg-green-500' : 
          stats.status === 'error' ? 'bg-red-500' : 'bg-gold animate-pulse'
        }`}></div>
        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-widest">Network Status</p>
        <div className="flex items-center gap-2">
          <p className={`text-xl font-black uppercase ${
            stats.status === 'healthy' ? 'text-green-400' : 
            stats.status === 'error' ? 'text-red-400' : 'text-gold'
          }`}>
            {stats.status}
          </p>
          <span className="text-[10px] text-gray-600 font-mono">({stats.cluster})</span>
        </div>
      </div>

      {/* Block Height */}
      <div className="glass p-4 rounded-xl border border-white/5 group hover:border-gold/20 transition-all">
        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-widest">Current Block Height</p>
        <div className="flex items-baseline gap-2">
          <p className="text-xl font-black text-white tabular-nums">
            {stats.blockHeight.toLocaleString()}
          </p>
          <span className="text-[10px] text-gray-600 font-mono">Slot: {stats.slot.toLocaleString()}</span>
        </div>
      </div>

      {/* Latency */}
      <div className="glass p-4 rounded-xl border border-white/5 group hover:border-gold/20 transition-all">
        <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-widest">RPC Latency</p>
        <div className="flex items-center gap-2">
          <p className={`text-xl font-black tabular-nums ${
            stats.latency < 200 ? 'text-green-400' : 
            stats.latency < 500 ? 'text-gold' : 'text-red-400'
          }`}>
            {stats.latency}ms
          </p>
          <div className="flex gap-0.5 items-end h-4">
            <div className={`w-1 h-1 rounded-full ${stats.latency < 500 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
            <div className={`w-1 h-2 rounded-full ${stats.latency < 300 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
            <div className={`w-1 h-3 rounded-full ${stats.latency < 150 ? 'bg-green-500' : 'bg-gray-700'}`}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
