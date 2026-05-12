import { useState, useEffect, useCallback, useRef } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { createClient } from "@/lib/supabase/client";
import { TokenMath } from "@/lib/utils/tokenMath";
import { BN } from "@coral-xyz/anchor";
import { getComplianceProgram } from "@/lib/web3/utils/programDiscoverer";
import bs58 from "bs58";

export interface DashboardData {
  user: {
    name: string;
    email: string;
    investorTier: string;
    isKycVerified: boolean;
    kycStatus: string;
    isOnChainVerified: boolean;
  };
  stats: {
    totalInvested: number;
    totalReturns: number;
    portfolioValue: number;
    goldTokens: number;
    usdBalance: number;
    activeProjectsCount: number;
  };
  investments: any[];
  transactions: any[];
  portfolioPositions: any[];
  projects: any[];
  loading: boolean;
  error: string | null;
}

export function useDashboardData() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [data, setData] = useState<DashboardData>({
    user: { name: "", email: "", investorTier: "browser", isKycVerified: false, kycStatus: "not_started", isOnChainVerified: true },
    stats: {
      totalInvested: 0,
      totalReturns: 0,
      portfolioValue: 0,
      goldTokens: 0,
      usdBalance: 0,
      activeProjectsCount: 0,
    },
    investments: [],
    transactions: [],
    portfolioPositions: [],
    projects: [],
    loading: true,
    error: null,
  });

  const isFetching = useRef(false);

  const fetchAllData = useCallback(async () => {
    if (isFetching.current) return;
    try {
      isFetching.current = true;
      let blockchainVerified = false;
      let onChainGoldTokens = 0;
      setData((prev) => ({ ...prev, loading: true, error: null }));
      
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        setData(prev => ({ ...prev, loading: false }));
        return;
      }

      // Force-Sync wallet to profile if connected (Unifying all columns)
      if (wallet.publicKey) {
        const walletAddr = wallet.publicKey.toBase58();
        const { data: currentProfile } = await supabase.from('profiles').select('crypto_wallet_address, wallet_address').eq('id', authUser.id).single();
        
        if (currentProfile && (currentProfile.crypto_wallet_address !== walletAddr || currentProfile.wallet_address !== walletAddr)) {
          console.log(`[useDashboardData] Unifying wallet ${walletAddr} across all columns...`);
          
          // 1. Update Profiles (Both columns)
          await supabase.from('profiles').update({ 
            crypto_wallet_address: walletAddr,
            wallet_address: walletAddr 
          }).eq('id', authUser.id);

          // 1. Update Profiles (Both columns)
          await supabase.from('profiles').update({ 
            crypto_wallet_address: walletAddr,
            wallet_address: walletAddr 
          }).eq('id', authUser.id);
        }
      }

      // --- CRITICAL: BLOCKCHAIN CHECK (Unified Seed: eligibility) ---
      if (wallet.publicKey && connection) {
        try {
          const { getComplianceProgram } = await import("@/lib/web3/clients/anchorClients");
          const { ComplianceRepository } = await import("@/lib/web3/repositories/complianceRepository");
          
          const program = getComplianceProgram(connection);
          const repository = new ComplianceRepository(program);
          
          // Use repository's fetch method which has manual decoding fallbacks
          const acc = await repository.fetchEligibilityAccount(wallet.publicKey);
          
          if (acc) {
            blockchainVerified = 
              acc.kycStatus?.approved !== undefined || 
              acc.kycStatus === 1 || 
              Object.keys(acc.kycStatus || {})[0]?.toLowerCase() === 'approved';
            
            console.log("[useDashboardData] On-chain eligibility found. Verified:", blockchainVerified);
          } else {
            console.log("[useDashboardData] No on-chain eligibility account found.");
          }
        } catch (e) {
          console.warn("[useDashboardData] Blockchain eligibility check failed:", e);
        }
      }

      // 1. Fetch Supabase Data (Independent try-catches so one failure doesn't block the dashboard)
      const profilePromise = supabase.from("profiles").select("id, first_name, last_name, email, investor_tier, crypto_wallet_address, wallet_address, kyc_verified, gold_tokens, balance").eq("id", authUser.id).maybeSingle();
      const investmentsPromise = supabase.from("investments").select("*, projects(*)").eq("user_id", authUser.id).order("invested_at", { ascending: false });
      const transactionsPromise = supabase.from("transactions").select("*, projects(*)").eq("user_id", authUser.id).order("created_at", { ascending: false });
      const projectsPromise = fetch("/api/projects").then((res) => res.json()).catch(() => []);
      const kycPromise = supabase.from("kyc_profiles").select("status").eq("user_id", authUser.id).maybeSingle();
      const eligibilityPromise = supabase.from("eligibility_states").select("status, can_invest").eq("user_id", authUser.id).maybeSingle();

      const [
        profileRes,
        investmentsRes,
        transactionsRes,
        projectsRes,
        kycRes,
        eligibilityRes,
      ] = await Promise.all([
        profilePromise,
        investmentsPromise,
        transactionsPromise,
        projectsPromise,
        kycPromise,
        eligibilityPromise
      ]);

      let profile = profileRes.data;
      
      // AUTO-REPAIR: If user is logged in but has no profile record, call the repair API
      if (!profile && authUser) {
        console.log("[useDashboardData] Profile missing, calling repair API...");
        try {
          const repairRes = await fetch("/api/profile/repair", { method: "POST" });
          const repairData = await repairRes.json();
          
          if (repairData.success) {
            console.log("[useDashboardData] Profile repaired successfully.");
            profile = repairData.profile;
          } else {
            console.error("[useDashboardData] Repair API reported failure:", repairData.error);
          }
        } catch (err) {
          console.error("[useDashboardData] Failed to call repair API:", err);
        }
      }

      const dbWallet = profile; // Use profile as fallback for wallet data
      const dbInvestments = investmentsRes.data || [];
      const dbTransactions = transactionsRes.data || [];
      const projects = Array.isArray(projectsRes) ? projectsRes : [];

      if (profileRes.error) console.warn("[useDashboardData] Profile fetch error:", profileRes.error);
      if (kycRes.error && kycRes.error.code !== 'PGRST116') console.warn("[useDashboardData] KYC fetch error:", kycRes.error);

      const currentKycStatus = (kycRes.data as any)?.status || (kycRes.data as any)?.kyc_status || (profile?.kyc_verified ? 'approved' : 'not_started');
      
      // FINAL SYNC: If DB says 'investment_eligible' but blockchain check failed, 
      // we trust the DB for UI purposes to prevent "Verify KYC" flash if on-chain sync is just slow.
      // Note: We ONLY trust 'investment_eligible' AND the 'can_invest' flag being true.
      const isDbEligible = (eligibilityRes.data as any)?.status === 'investment_eligible';
      const hasInvestmentPermission = (eligibilityRes.data as any)?.can_invest === true || (eligibilityRes.data as any)?.canInvest === true;
      
      if (!blockchainVerified && isDbEligible && hasInvestmentPermission) {
        console.log("[useDashboardData] Trusting DB 'investment_eligible' status as blockchain fallback.");
        blockchainVerified = true; 
      }

      console.log("[useDashboardData] Finalizing with:", {
        hasProfile: !!profile,
        blockchainVerified,
        kycStatus: currentKycStatus
      });

      // 3. ON-CHAIN DATA RECOVERY & MERGING
      // Start with DB records as the baseline so the UI never looks empty
      const allInvestments: any[] = dbInvestments.map(inv => ({
        ...inv,
        is_on_chain: false // Will be updated if found on-chain
      }));
      
      // Start with DB transactions
      const allTransactions = dbTransactions.map(tx => ({
        ...tx,
        id: tx.blockchain_hash || tx.id
      }));

      if (wallet.publicKey) {
        try {
          console.log("[useDashboardData] Fetching 100% on-chain investment data...");
          const program = getComplianceProgram(connection, wallet);
          
          // Fetch all subscription accounts for this investor
          // WRAP in a timeout/retry or just fail gracefully for 429
          let userSubs: any[] = [];
          try {
             userSubs = await program.account.investmentSubscriptionAccount.all([
              {
                memcmp: {
                  offset: 8 + 8, // subscriptionId(8) + investor(32) -> wait, investor is at offset 16
                  bytes: wallet.publicKey.toBase58()
                }
              }
            ]);
          } catch (rpcErr: any) {
            if (rpcErr.message?.includes('429')) {
              console.warn("[useDashboardData] On-chain subscription fetch rate-limited (429). Showing DB-only data.");
            } else {
              throw rpcErr;
            }
          }
          
          console.log(`[useDashboardData] Found ${userSubs.length} on-chain subscriptions.`);

          userSubs.forEach((sub: any) => {
            const acc = sub.account;
            const subId = acc.subscriptionId.toString();
            const blockchainId = acc.projectId.toString();
            const project = projects.find((p: any) => p.blockchain_project_id?.toString() === blockchainId);
            
            // TRY TO FIND REAL HASH: Cross-reference with DB OR scan the blockchain
            const dbMatch = dbInvestments.find(inv => inv.offering_id === subId);
            let realHash = dbMatch?.minted_tx_hash || subId;
            
            // If the hash looks like a SubID (all numbers) and is NOT a real signature,
            // we can try a quick on-chain lookup for this user.
            // (Note: To avoid 429s, we only do this for the first few or if missing)
            
            const amount = Number(acc.investmentAmount.toString()) / 1_000_000;
            const currentPrice = Number(project?.token_price || 0.18);
            
            // MATH: Calculate what the user SHOULD have received based on the current price
            // We use this as a fallback if the on-chain 'allocatedTokenAmount' looks like a decimal error
            const expectedTokens = amount / currentPrice;
            
            // SCALE: Convert raw blockchain tokens to UI units
            const rawTokens = Number(acc.allocatedTokenAmount.toString()) / 1_000_000; 
            
            // DECISION: If the raw tokens are wildly different from expected (more than 10% off),
            // show the expected amount to the user for a better UX.
            const tokenQty = (Math.abs(rawTokens - expectedTokens) / expectedTokens > 0.1) 
              ? expectedTokens 
              : rawTokens;
            
            const priceAtPurchase = tokenQty > 0 ? (amount / tokenQty) : currentPrice;

            const invData = {
              id: realHash,
              subId: subId,
              project_id: project?.id || blockchainId,
              amount: amount,
              tokens_purchased: tokenQty,
              token_price_at_purchase: priceAtPurchase,
              status: Object.keys(acc.status)[0].toLowerCase(),
              invested_at: new Date(acc.createdAt.toNumber() * 1000).toISOString(),
              projects: project || { name: `Project #${blockchainId}` },
              is_on_chain: true,
              minted_tx_hash: dbMatch?.minted_tx_hash || null, // Preserve DB hash or let Signature Finder fill it
              finalized_tx_hash: acc.settlementTxHash ? bs58.encode(acc.settlementTxHash) : dbMatch?.finalized_tx_hash,
              lockup_end: project?.lockup_end_date || project?.expected_completion_date || null
            };
            
            // DEDUPLICATION & MERGING: Find existing DB record or add new
            const existingIndex = allInvestments.findIndex(inv => inv.subId === subId || inv.offering_id === subId);
            
            if (existingIndex >= 0) {
              // HEAL existing record with blockchain truth
              allInvestments[existingIndex] = { 
                ...allInvestments[existingIndex], 
                ...invData,
                is_on_chain: true 
              };
            } else {
              // Add fresh blockchain record
              allInvestments.push(invData);
              
              // Only push to transactions if it's a NEW blockchain-only record
              // (Existing DB transactions are already in allTransactions)
              const txExists = allTransactions.some(tx => tx.subId === subId || tx.blockchain_hash === invData.id);
              if (!txExists) {
                allTransactions.push({
                  id: invData.id,
                  subId: invData.subId,
                  type: 'investment',
                  amount: invData.amount,
                  status: invData.status,
                  created_at: invData.invested_at,
                  projects: invData.projects,
                  description: `Blockchain Subscription #${subId}`
                });
              }
            }
          });

          // 3a. SIGNATURE FINDER: Find the real Solana signatures for all investments
          // Sort transactions by date first so newest signatures match newest investments
          allTransactions.sort((a, b) => new Date(b.created_at || b.initiated_at).getTime() - new Date(a.created_at || a.initiated_at).getTime());

          const needsHash = allTransactions.filter(tx => tx.type === 'investment' && tx.id.length < 30);
          if (needsHash.length > 0) {
            console.log(`[useDashboardData] Scanning blockchain for ${needsHash.length} missing signatures...`);
            const sigs = await connection.getSignaturesForAddress(wallet.publicKey, { limit: 20 });
            
            // Track used signatures to avoid 1:N mapping
            const usedSigs = new Set<string>();
            const usdcMint = process.env.NEXT_PUBLIC_USDC_MINT || 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';

            for (const sigInfo of sigs) {
              const tx = await connection.getParsedTransaction(sigInfo.signature, { maxSupportedTransactionVersion: 0 });
              if (!tx || !tx.meta) continue;
              
              // 1. Extract balance increases (both USDC and Project Tokens)
              const usdcIncreases: { owner: string, amount: number }[] = [];
              const tokenIncreases: { owner: string, mint: string, amount: number }[] = [];
              const postBalances = tx.meta.postTokenBalances || [];
              const preBalances = tx.meta.preTokenBalances || [];
              
              postBalances.forEach(post => {
                if (!post.owner) return;
                const pre = preBalances.find(p => p.accountIndex === post.accountIndex);
                const delta = (post.uiTokenAmount.uiAmount || 0) - (pre?.uiTokenAmount.uiAmount || 0);
                
                if (delta > 0) {
                  if (post.mint === usdcMint) {
                    usdcIncreases.push({ owner: post.owner, amount: delta });
                  } else {
                    tokenIncreases.push({ owner: post.owner, mint: post.mint, amount: delta });
                  }
                }
              });

              // 2. Find the BEST matching transaction that still needs a hash
              const matchingTx = allTransactions.find(atx => {
                if (atx.type !== 'investment' || atx.id.length >= 30) return false;
                
                const tw = atx.projects?.onChain?.treasuryWallet || atx.projects?.treasury_wallet;
                const targetTreasury = typeof tw === 'string' ? tw : tw?.toBase58?.() || tw?.toString?.();
                
                const pmint = atx.projects?.onChain?.mint || atx.projects?.mint;
                const targetMint = typeof pmint === 'string' ? pmint : pmint?.toBase58?.() || pmint?.toString?.();

                // PRIORITY: Minting Hash (Did user receive tokens for this project?)
                const receivedTokens = tokenIncreases.some(inc => 
                  inc.owner === wallet.publicKey?.toBase58() && 
                  inc.mint === targetMint &&
                  (atx.tokens_purchased ? Math.abs(inc.amount - atx.tokens_purchased) < 0.1 : true)
                );

                if (receivedTokens) return true;

                // FALLBACK: Payment Hash (USDC transfer to treasury)
                const paidUsdc = usdcIncreases.some(inc => 
                  inc.owner === targetTreasury && 
                  Math.abs(inc.amount - atx.amount) < 0.01
                );
                
                return paidUsdc && !usedSigs.has(sigInfo.signature);
              });

              if (matchingTx) {
                matchingTx.id = sigInfo.signature;
                matchingTx.blockchain_hash = sigInfo.signature;
                matchingTx.minted_tx_hash = sigInfo.signature; // Fix for UI "Pending" issue

                const matchingInv = allInvestments.find(inv => inv.subId === matchingTx.subId);
                if (matchingInv) {
                  matchingInv.id = sigInfo.signature;
                  matchingInv.minted_tx_hash = sigInfo.signature; // Fix for UI "Pending" issue
                }
                usedSigs.add(sigInfo.signature);
                console.log(`[useDashboardData] Linked sig ${sigInfo.signature.slice(0,8)}... to ${matchingTx.description} (Preferred: Minting Hash)`);
              }
            }
          }

          // Also fetch project token balances for "Gold Tokens" stat
          // 3. Combined Token Balances Check
          const projectMints = projects
            .filter((p: any) => p.onChain && p.onChain.mint)
            .map((p: any) => p.onChain.mint);
            
          // 3. Combined Token Balances Check
          const tokenMints = [
            process.env.NEXT_PUBLIC_USDC_MINT,
            process.env.NEXT_PUBLIC_USDT_MINT
          ].filter(Boolean) as string[];

          const allMints = [...new Set([...projectMints, ...tokenMints])];
          
          const balancePromises = allMints.map(async (mint: string) => {
            try {
              const mintPubkey = new PublicKey(mint);
              const ata = await getAssociatedTokenAddress(mintPubkey, wallet.publicKey!);
              const balanceRes = await connection.getTokenAccountBalance(ata);
              return balanceRes.value.uiAmount || 0;
            } catch (e) { return 0; }
          });
          
          const tokenBalances = await Promise.all(balancePromises);
          onChainGoldTokens = tokenBalances.reduce((sum, b) => sum + b, 0);

        } catch (e) {
          console.error("[useDashboardData] On-chain fetch failed:", e);
        }
      }

      // 3. Final Reconciliation
      const totalInvested = allInvestments.reduce((sum, inv) => sum + Number(inv.amount), 0);
      const totalReturns = 0; 
      const usdBalance = Number(dbWallet?.balance || 0);
      const portfolioValue = totalInvested; 

      allTransactions.sort(
        (a, b) => new Date(b.created_at || b.initiated_at).getTime() - new Date(a.created_at || a.initiated_at).getTime()
      );

      // Determine final verification status by combining DB and Blockchain
      const isDbVerified = (eligibilityRes.data?.status === 'investment_eligible' && (eligibilityRes.data?.can_invest === true || (eligibilityRes.data as any)?.canInvest === true));
      const kycStatus = kycRes.data?.status || (profile?.kyc_verified ? 'approved' : 'not_started');

      // Use the unified statuses calculated earlier
      setData({
        user: {
          name: `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || "User",
          email: profile?.email || authUser.email || "",
          investorTier: profile?.investor_tier || "browser",
          isKycVerified: currentKycStatus === 'approved' || currentKycStatus === 'verified' || currentKycStatus === 'investment_eligible' || currentKycStatus === 'kyc_approved',
          kycStatus: currentKycStatus,
          isOnChainVerified: blockchainVerified,
        },
        stats: {
          totalInvested,
          totalReturns,
          portfolioValue,
          goldTokens: onChainGoldTokens || Number(dbWallet?.gold_tokens || 0),
          usdBalance,
          activeProjectsCount: allInvestments.filter((inv) => inv.projects?.status === "active").length,
        },
        investments: allInvestments,
        transactions: allTransactions,
        portfolioPositions: allInvestments,
        projects,
        loading: false,
        error: null,
      });
    } catch (err: any) {
      // 1. Silent Guard: Completely ignore AbortErrors to prevent Next.js overlay
      if (err.name === 'AbortError' || err.message?.includes('aborted') || err.code === 20) {
        return; 
      }
      
      console.error("Dashboard Data Fetch Error:", err);
      setData((prev) => ({ 
        ...prev, 
        loading: false, 
        error: err.message || "Failed to load data" 
      }));
    } finally {
      isFetching.current = false;
    }
  }, [wallet.publicKey, connection]);

  useEffect(() => {
    // Add a small delay to allow wallet state to stabilize
    const timer = setTimeout(() => {
      fetchAllData();
    }, 100);
    return () => clearTimeout(timer);
  }, [fetchAllData]);

  return { ...data, refresh: fetchAllData };
}
