"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useWalletStatus } from '@/hooks/useWalletStatus';
// EVM Import Commented Out
// import { ConnectButton } from '@rainbow-me/rainbowkit';
import dynamic from 'next/dynamic';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

export function WalletBanner() {
  const { isWalletConnected, isWalletLinked, isKycVerified, kycStatus, linkWallet, isLinking, error, investorTier } = useWalletStatus();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if wallet is already linked or user dismissed
  if (isWalletLinked || dismissed) {
    return null;
  }

  return (
    <div className="relative bg-gradient-to-r from-gold/20 via-gold/10 to-transparent border-2 border-gold/30 rounded-xl p-6 mb-6 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-40 h-40 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-gold rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative">
        {/* Dismiss Button */}
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-0 right-0 text-gray-400 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-start gap-6">
          {/* Icon */}
          <div className="hidden md:flex w-16 h-16 bg-gold/30 rounded-2xl items-center justify-center flex-shrink-0">
            <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {/* Text & Actions */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-bold text-white">
                {isWalletConnected ? 'Almost There!' : 'Unlock Investment Features'}
              </h3>
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full">
                Browser Tier
              </span>
            </div>

            <p className="text-gray-300 text-sm mb-4">
              {isWalletConnected
                ? 'Your wallet is connected! Sign a message to verify ownership and start investing.'
                : 'Connect your crypto wallet to upgrade to Investor tier and unlock the ability to invest in gold mining projects and receive blockchain dividends.'}
            </p>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                <div className="flex gap-2">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {kycStatus === 'under_review' || (kycStatus === 'approved' && isWalletLinked) ? (
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-6 py-3 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                  <span className="text-blue-400 font-bold">Pending Admin On-Chain Sync</span>
                </div>
              ) : !isKycVerified && kycStatus === 'not_started' ? (
                <Link
                  href="/kyc"
                  className="bg-red-500 hover:bg-red-600 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/20"
                >
                  Verify Identity (KYC) Required
                </Link>
              ) : !isWalletConnected ? (
                <div className="flex flex-col gap-2">
                  <WalletMultiButton 
                    className="!h-[50px] !px-6 !bg-gradient-to-r !from-gold !to-[#b5952f] !text-navy !font-bold !rounded-lg hover:!scale-105 !transition-transform !shadow-lg !shadow-gold/20 flex flex-shrink-0 items-center justify-center w-auto whitespace-nowrap min-w-[160px]"
                  />
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Connect your Solana wallet to continue</p>
                </div>
              ) : !isWalletLinked ? (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={linkWallet}
                    disabled={isLinking}
                    className="bg-gradient-to-r from-gold to-gold-light text-navy font-bold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLinking ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verifying Ownership...
                      </span>
                    ) : (
                      'Sign Message to Verify & Link Wallet'
                    )}
                  </button>
                  <p className="text-[10px] text-gold/60 uppercase tracking-widest font-bold animate-pulse">Action Required: Link your wallet to your profile</p>
                </div>
              ) : kycStatus === 'approved' ? (
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-6 py-3 flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-400 font-bold">KYC Approved - Waiting for Admin Sync</span>
                </div>
              ) : (
                 <div className="bg-gold/10 border border-gold/30 rounded-lg px-6 py-3 text-gold text-sm font-bold">
                   Status: {kycStatus === 'not_started' ? 'KYC Required' : 'Processing...'}
                 </div>
              )}
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Make investments</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Receive dividends</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Own mining shares</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
