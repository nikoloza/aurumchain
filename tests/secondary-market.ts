import 'dotenv/config';
import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { 
  PublicKey, 
  SystemProgram, 
  Keypair, 
  Transaction, 
  ComputeBudgetProgram 
} from "@solana/web3.js";
import assert from "assert";
import * as fs from "fs";
import * as path from "path";
import bs58 from "bs58";
import { 
  PROJECT_REGISTRY_PROGRAM_ID, 
  COMPLIANCE_PROGRAM_ID, 
  SECONDARY_MARKET_PROGRAM_ID 
} from "../lib/web3/config/programs";
import { confirmTransactionRobustly } from "../lib/web3/utils/transactionUtils";
import { 
  getAssociatedTokenAddressSync, 
  TOKEN_PROGRAM_ID, 
  TOKEN_2022_PROGRAM_ID, 
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createInitializeMintInstruction,
  ExtensionType,
  getMintLen
} from "@solana/spl-token";

describe("secondary_market_integration_tests", () => {
  // Manual Provider Setup to bypass environment pollution
  const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";
  const connection = new anchor.web3.Connection(RPC_URL, "confirmed");
  
  const privateKeyStr = process.env.WALLET_PRIVATE_KEY!;
  const secretKey = privateKeyStr.startsWith("[") 
    ? Uint8Array.from(JSON.parse(privateKeyStr))
    : bs58.decode(privateKeyStr);
  
  const wallet = new anchor.Wallet(anchor.web3.Keypair.fromSecretKey(secretKey));
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  });
  
  anchor.setProvider(provider);

  // Load IDLs
  const registryIdlPath = path.resolve(process.cwd(), "programs/project_registry/src/idl.json");
  const registryIdl = JSON.parse(fs.readFileSync(registryIdlPath, "utf8"));
  const registryProgram = new Program(registryIdl, PROJECT_REGISTRY_PROGRAM_ID, provider);

  const complianceIdlPath = path.resolve(process.cwd(), "programs/compliance_transfer/src/idl.json");
  const complianceIdl = JSON.parse(fs.readFileSync(complianceIdlPath, "utf8"));
  const complianceProgram = new Program(complianceIdl, COMPLIANCE_PROGRAM_ID, provider);

  const marketIdlPath = path.resolve(process.cwd(), "programs/secondary_market/src/idl.json");
  const marketIdl = JSON.parse(fs.readFileSync(marketIdlPath, "utf8"));
  const marketProgram = new Program(marketIdl, SECONDARY_MARKET_PROGRAM_ID, provider);

  const authority = provider.wallet;

  // Derive global PDAs
  const [complianceControlPda] = PublicKey.findProgramAddressSync([Buffer.from("compliance_control")], complianceProgram.programId);
  const [registryControlPda] = PublicKey.findProgramAddressSync([Buffer.from("control")], registryProgram.programId);
  const [marketConfigPda] = PublicKey.findProgramAddressSync([Buffer.from("config")], marketProgram.programId);
  const [vaultAuthorityPda] = PublicKey.findProgramAddressSync([Buffer.from("vault_authority")], marketProgram.programId);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async function getBlockhashResilient() {
    let retries = 0;
    while (retries < 5) {
      try {
        const fresh = await provider.connection.getLatestBlockhash("confirmed");
        return fresh;
      } catch (err: any) {
        if (err.toString().includes("429")) {
          const wait = (retries + 1) * 5000;
          console.log(`   ⚠️ RPC Throttling (429). Backing off for ${wait/1000}s...`);
          await sleep(wait);
          retries++;
        } else {
          throw err;
        }
      }
    }
    throw new Error("RPC is permanently throttled.");
  }

  async function sendUnique(methodBuilder: any) {
    await sleep(3500); 
    const fresh = await getBlockhashResilient();
    const tx = await methodBuilder.transaction();
    tx.recentBlockhash = fresh.blockhash;
    tx.feePayer = authority.publicKey;

    let signature = "";
    let sent = false;
    let retries = 0;
    
    while (!sent && retries < 3) {
      try {
        const signedTx = await provider.wallet.signTransaction(tx);
        signature = await provider.connection.sendRawTransaction(signedTx.serialize(), {
          skipPreflight: true,
        });
        sent = true;
      } catch (err: any) {
        if (err.toString().includes("429")) {
          console.log("   ⚠️ Send throttled. Waiting 5s...");
          await sleep(5000);
          retries++;
        } else { throw err; }
      }
    }
    
    await confirmTransactionRobustly(provider.connection, signature, fresh.lastValidBlockHeight, 'confirmed');
    return signature;
  }

  async function sendAndConfirmCustom(tx: Transaction, extraSigners: Keypair[] = []) {
    const fresh = await getBlockhashResilient();
    tx.recentBlockhash = fresh.blockhash;
    tx.feePayer = authority.publicKey;
    
    const signed = await provider.wallet.signTransaction(tx);
    for (const s of extraSigners) {
      signed.partialSign(s);
    }

    const sig = await provider.connection.sendRawTransaction(signed.serialize(), { skipPreflight: true });
    await confirmTransactionRobustly(provider.connection, sig, fresh.lastValidBlockHeight, 'confirmed');
    return sig;
  }

  async function registerWallet(walletPubkey: PublicKey) {
    const [eligibilityPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("eligibility"), walletPubkey.toBuffer()],
      complianceProgram.programId
    );

    const eligibilityInfo = await connection.getAccountInfo(eligibilityPda);
    if (!eligibilityInfo) {
      console.log(`📝 Registering eligibility for ${walletPubkey.toBase58().slice(0, 8)}...`);
      await sendUnique(
        complianceProgram.methods.recordVerifiedWallet({
          kycStatus: { approved: {} },
          amlStatus: { clear: {} },
          identityHash: Array(32).fill(1),
          investmentAllowed: true,
          transferAllowed: true,
          expiryTimestamp: new BN(Math.floor(Date.now() / 1000) + 86400 * 365),
        }).accounts({
          eligibility: eligibilityPda,
          wallet: walletPubkey,
          control: complianceControlPda,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
      );
    }
    return eligibilityPda;
  }

  it("1. Initialize Marketplace Config (if not initialized)", async () => {
    const configInfo = await connection.getAccountInfo(marketConfigPda);
    if (!configInfo) {
      console.log("🏗️  Initializing Secondary Market Config...");
      await sendUnique(
        marketProgram.methods.initializeMarket(
          150, // 1.50% fee
          registryProgram.programId,
          complianceProgram.programId,
          registryProgram.programId
        ).accounts({
          config: marketConfigPda,
          feeDestination: authority.publicKey,
          admin: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
      );
      console.log("✅ Market config initialized.");
    } else {
      console.log("✅ Market config already initialized.");
    }
  });

  it("2. Execute End-to-End P2P Trade Lifecycle", async () => {
    // A. Generate seller & buyer keypairs and fund them with Devnet SOL
    const seller = Keypair.generate();
    const buyer = Keypair.generate();

    console.log(`👤 Seller: ${seller.publicKey.toBase58()}`);
    console.log(`👤 Buyer: ${buyer.publicKey.toBase58()}`);

    const fundingTx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: authority.publicKey,
        toPubkey: seller.publicKey,
        lamports: 100_000_000, // 0.1 SOL
      }),
      SystemProgram.transfer({
        fromPubkey: authority.publicKey,
        toPubkey: buyer.publicKey,
        lamports: 100_000_000, // 0.1 SOL
      })
    );
    await sendAndConfirmCustom(fundingTx);
    console.log("✅ Seller & Buyer funded with SOL.");

    // B. Register seller, buyer, and vault authority PDA in compliance
    const sellerEligibilityPda = await registerWallet(seller.publicKey);
    const buyerEligibilityPda = await registerWallet(buyer.publicKey);
    const vaultAuthEligibilityPda = await registerWallet(vaultAuthorityPda);
    console.log("✅ Seller, Buyer, and Vault Authority registered in compliance.");

    // C. Setup Project & Project Token Mint
    const registryConfig: any = await registryProgram.account.controlAccount.fetch(registryControlPda);
    const projectId = registryConfig.projectCount;
    const projectIdNum = projectId.toNumber();

    const [projectPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("project"), projectId.toArrayLike(Buffer, "le", 8)],
      registryProgram.programId
    );

    const [mintAuthPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("mint_authority"), projectId.toArrayLike(Buffer, "le", 8)],
      registryProgram.programId
    );

    console.log(`🏗️  Creating Test Project ID: ${projectIdNum}...`);
    // Create stablecoin mint (we use dummy USDC)
    const usdcMintKeypair = Keypair.generate();
    const projectMintKeypair = Keypair.generate();

    // Create USDC mint
    const usdcRent = await connection.getMinimumBalanceForRentExemption(getMintLen([]));
    const createUsdcMintTx = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: authority.publicKey,
        newAccountPubkey: usdcMintKeypair.publicKey,
        lamports: usdcRent,
        space: getMintLen([]),
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMintInstruction(
        usdcMintKeypair.publicKey,
        6,
        authority.publicKey,
        null,
        TOKEN_PROGRAM_ID
      )
    );
    await sendAndConfirmCustom(createUsdcMintTx, [usdcMintKeypair]);
    console.log("✅ USDC Mint Created.");

    // Create Project Token mint (using TOKEN_2022_PROGRAM_ID with Transfer Hook extension)
    const extensions = [ExtensionType.TransferHook];
    const mintLen = getMintLen(extensions);
    const projectRent = await connection.getMinimumBalanceForRentExemption(mintLen);

    const { createInitializeTransferHookInstruction } = await import("@solana/spl-token");

    const createProjectMintTx = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: authority.publicKey,
        newAccountPubkey: projectMintKeypair.publicKey,
        lamports: projectRent,
        space: mintLen,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeTransferHookInstruction(
        projectMintKeypair.publicKey,
        authority.publicKey,
        complianceProgram.programId,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeMintInstruction(
        projectMintKeypair.publicKey,
        6,
        authority.publicKey, // We are the initial mint authority so we can mint directly to seller
        null,
        TOKEN_2022_PROGRAM_ID
      )
    );
    await sendAndConfirmCustom(createProjectMintTx, [projectMintKeypair]);
    console.log("✅ Project Token Mint Created.");

    // Create project registry account
    await sendUnique(
      registryProgram.methods.createProject({
        name: "Secondary Market UAT",
        symbol: "SMU",
        uri: "https://secondary-market-uat.com",
        supplyCap: new BN(1_000_000_000),
        minInvestmentUsdc: new BN(1000),
        maxInvestmentUsdc: new BN(1_000_000_000),
        tokenPriceUsdc: new BN(1_000_000),
        acceptedStablecoin: usdcMintKeypair.publicKey,
        treasuryWallet: authority.publicKey,
        lockupEndTs: new BN(0), // No lockup
        subscriptionStart: new BN(Math.floor(Date.now() / 1000) - 3600),
        subscriptionEnd: new BN(Math.floor(Date.now() / 1000) + 3600),
        distributionCadence: 0,
        durationMonths: 12,
        distributionMode: 0,
        assetType: { other: {} },
        roundLimitTokens: new BN(1_000_000_000),
        tokenDecimals: 6,
      }).accounts({
        project: projectPda,
        control: registryControlPda,
        mintAuthorityPda: mintAuthPda,
        admin: authority.publicKey,
        systemProgram: SystemProgram.programId,
      } as any)
    );
    console.log("✅ Project created in Registry.");

    // Register project mint
    const [mintLookupPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("mint_lookup"), projectMintKeypair.publicKey.toBuffer()],
      registryProgram.programId
    );

    await sendUnique(
      registryProgram.methods.setProjectMint().accounts({
        project: projectPda,
        control: registryControlPda,
        mint: projectMintKeypair.publicKey,
        mintLookup: mintLookupPda,
        admin: authority.publicKey,
        token2022Program: TOKEN_2022_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      } as any)
    );
    console.log("✅ Project Mint Registered in Registry.");

    // Update status to Active
    await sendUnique(
      registryProgram.methods.updateProjectStatus(
        projectId,
        { active: {} },
        false
      ).accounts({
        project: projectPda,
        control: registryControlPda,
        admin: authority.publicKey,
      })
    );
    console.log("✅ Project status promoted to Active.");

    // D. Initialize ATAs and Mint Tokens
    const sellerTokenAccount = getAssociatedTokenAddressSync(projectMintKeypair.publicKey, seller.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const buyerTokenAccount = getAssociatedTokenAddressSync(projectMintKeypair.publicKey, buyer.publicKey, false, TOKEN_2022_PROGRAM_ID);
    const buyerUsdcAccount = getAssociatedTokenAddressSync(usdcMintKeypair.publicKey, buyer.publicKey, false, TOKEN_PROGRAM_ID);
    const sellerUsdcAccount = getAssociatedTokenAddressSync(usdcMintKeypair.publicKey, seller.publicKey, false, TOKEN_PROGRAM_ID);
    const feeDestinationUsdc = getAssociatedTokenAddressSync(usdcMintKeypair.publicKey, authority.publicKey, false, TOKEN_PROGRAM_ID);

    const setupAtasTx = new Transaction().add(
      createAssociatedTokenAccountInstruction(authority.publicKey, sellerTokenAccount, seller.publicKey, projectMintKeypair.publicKey, TOKEN_2022_PROGRAM_ID),
      createAssociatedTokenAccountInstruction(authority.publicKey, buyerTokenAccount, buyer.publicKey, projectMintKeypair.publicKey, TOKEN_2022_PROGRAM_ID),
      createAssociatedTokenAccountInstruction(authority.publicKey, buyerUsdcAccount, buyer.publicKey, usdcMintKeypair.publicKey, TOKEN_PROGRAM_ID),
      createAssociatedTokenAccountInstruction(authority.publicKey, sellerUsdcAccount, seller.publicKey, usdcMintKeypair.publicKey, TOKEN_PROGRAM_ID),
      createAssociatedTokenAccountInstruction(authority.publicKey, feeDestinationUsdc, authority.publicKey, usdcMintKeypair.publicKey, TOKEN_PROGRAM_ID)
    );
    await sendAndConfirmCustom(setupAtasTx);
    console.log("✅ ATAs Created.");

    // Mint project tokens to seller (500 tokens)
    const mintProjectTx = new Transaction().add(
      createMintToInstruction(projectMintKeypair.publicKey, sellerTokenAccount, authority.publicKey, 500 * 1_000_000, [], TOKEN_2022_PROGRAM_ID)
    );
    await sendAndConfirmCustom(mintProjectTx);
    console.log("✅ 500 project tokens minted to Seller.");

    // Mint USDC to buyer (150,000,000 units = 150 USDC)
    const mintUsdcTx = new Transaction().add(
      createMintToInstruction(usdcMintKeypair.publicKey, buyerUsdcAccount, authority.publicKey, 150_000_000, [], TOKEN_PROGRAM_ID)
    );
    await sendAndConfirmCustom(mintUsdcTx);
    console.log("✅ 150 USDC minted to Buyer.");

    // E. Test createSellOrder
    const sequence = new BN(1);
    const [sellOrderPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("sell_order"), seller.publicKey.toBuffer(), sequence.toArrayLike(Buffer, "le", 8)],
      marketProgram.programId
    );

    const [escrowVaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow_vault"), projectMintKeypair.publicKey.toBuffer()],
      marketProgram.programId
    );

    // Dummy PDA for uninitialized project pause / distribution control
    const dummyPda = Keypair.generate().publicKey;

    console.log("📝 Creating Sell Order (100 tokens at 1 USDC each)...");
    await marketProgram.methods.createSellOrder(
      new BN(100 * 1_000_000), // amount
      new BN(1_000_000),       // price per token (1 USDC)
      sequence
    ).accounts({
      config: marketConfigPda,
      seller: seller.publicKey,
      sellerTokenAccount: sellerTokenAccount,
      projectMint: projectMintKeypair.publicKey,
      escrowVault: escrowVaultPda,
      vaultAuthority: vaultAuthorityPda,
      sellOrder: sellOrderPda,
      projectAccount: projectPda,
      sellerEligibility: sellerEligibilityPda,
      projectPause: dummyPda,
      distributionControl: dummyPda,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    } as any).signers([seller]).rpc({ skipPreflight: true });

    let orderData = await marketProgram.account.sellOrder.fetch(sellOrderPda) as any;
    assert.strictEqual(orderData.remainingQuantity.toNumber(), 100 * 1_000_000, "Should list 100 tokens");
    console.log("✅ Sell Order Created.");

    // F. Test cancelSellOrder (using another sequence to list and cancel)
    const cancelSeq = new BN(2);
    const [cancelOrderPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("sell_order"), seller.publicKey.toBuffer(), cancelSeq.toArrayLike(Buffer, "le", 8)],
      marketProgram.programId
    );

    console.log("📝 Creating temporary Sell Order to test cancellation...");
    await marketProgram.methods.createSellOrder(
      new BN(20 * 1_000_000), // amount
      new BN(1_000_000),      // price per token
      cancelSeq
    ).accounts({
      config: marketConfigPda,
      seller: seller.publicKey,
      sellerTokenAccount: sellerTokenAccount,
      projectMint: projectMintKeypair.publicKey,
      escrowVault: escrowVaultPda,
      vaultAuthority: vaultAuthorityPda,
      sellOrder: cancelOrderPda,
      projectAccount: projectPda,
      sellerEligibility: sellerEligibilityPda,
      projectPause: dummyPda,
      distributionControl: dummyPda,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    } as any).signers([seller]).rpc({ skipPreflight: true });

    console.log("📝 Cancelling temporary Sell Order...");
    await marketProgram.methods.cancelSellOrder().accounts({
      sellOrder: cancelOrderPda,
      seller: seller.publicKey,
      sellerTokenAccount: sellerTokenAccount,
      projectMint: projectMintKeypair.publicKey,
      escrowVault: escrowVaultPda,
      vaultAuthority: vaultAuthorityPda,
      config: marketConfigPda,
      projectAccount: projectPda,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
    } as any).rpc({ skipPreflight: true });

    const cancelAccountInfo = await connection.getAccountInfo(cancelOrderPda);
    assert.ok(cancelAccountInfo === null, "Cancel order PDA should be closed.");
    console.log("✅ Cancel Sell Order Verified.");

    // G. Test fillOrder (Partial Fill of 40 tokens)
    console.log("📝 Executing Partial Fill (40 tokens)...");
    const fillIx1 = await marketProgram.methods.fillOrder(
      new BN(40 * 1_000_000)
    ).accounts({
      config: marketConfigPda,
      buyer: buyer.publicKey,
      buyerTokenAccount: buyerTokenAccount,
      buyerUsdcAccount: buyerUsdcAccount,
      seller: seller.publicKey,
      sellerUsdcAccount: sellerUsdcAccount,
      projectMint: projectMintKeypair.publicKey,
      stablecoinMint: usdcMintKeypair.publicKey,
      escrowVault: escrowVaultPda,
      vaultAuthority: vaultAuthorityPda,
      sellOrder: sellOrderPda,
      feeDestinationUsdc: feeDestinationUsdc,
      buyerEligibility: buyerEligibilityPda,
      projectAccount: projectPda,
      projectPause: dummyPda,
      distributionControl: dummyPda,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      stablecoinProgram: TOKEN_PROGRAM_ID,
    } as any).instruction();
    await sendAndConfirmCustom(new Transaction().add(fillIx1), [buyer]);

    orderData = await marketProgram.account.sellOrder.fetch(sellOrderPda) as any;
    assert.strictEqual(orderData.remainingQuantity.toNumber(), 60 * 1_000_000, "Should have 60 tokens left");
    console.log("✅ Partial Fill Completed.");

    // H. Test fillOrder (Complete Fill of remaining 60 tokens)
    console.log("📝 Executing Complete Fill (remaining 60 tokens)...");
    const fillIx2 = await marketProgram.methods.fillOrder(
      new BN(60 * 1_000_000)
    ).accounts({
      config: marketConfigPda,
      buyer: buyer.publicKey,
      buyerTokenAccount: buyerTokenAccount,
      buyerUsdcAccount: buyerUsdcAccount,
      seller: seller.publicKey,
      sellerUsdcAccount: sellerUsdcAccount,
      projectMint: projectMintKeypair.publicKey,
      stablecoinMint: usdcMintKeypair.publicKey,
      escrowVault: escrowVaultPda,
      vaultAuthority: vaultAuthorityPda,
      sellOrder: sellOrderPda,
      feeDestinationUsdc: feeDestinationUsdc,
      buyerEligibility: buyerEligibilityPda,
      projectAccount: projectPda,
      projectPause: dummyPda,
      distributionControl: dummyPda,
      tokenProgram: TOKEN_2022_PROGRAM_ID,
      stablecoinProgram: TOKEN_PROGRAM_ID,
    } as any).instruction();
    await sendAndConfirmCustom(new Transaction().add(fillIx2), [buyer]);

    const orderAccountInfo = await connection.getAccountInfo(sellOrderPda);
    assert.ok(orderAccountInfo === null, "Fully filled order account should be closed");
    console.log("✅ Complete Fill & Manual Closure Verified.");
  });
});
