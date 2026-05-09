import { Connection, PublicKey, Transaction, Keypair, SystemProgram, ComputeBudgetProgram } from '@solana/web3.js';
import { Program, BN } from '@coral-xyz/anchor';
import { 
  MINT_SIZE, 
  TOKEN_PROGRAM_ID, 
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createInitializeMintInstruction, 
  getMinimumBalanceForRentExemptMint,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountIdempotentInstruction,
  createSetAuthorityInstruction,
  AuthorityType,
  getMint
} from '@solana/spl-token';
import { 
  createCreateMetadataAccountV3Instruction, 
  PROGRAM_ID as METAPLEX_PROGRAM_ID 
} from '@metaplex-foundation/mpl-token-metadata';
import { 
  TOKEN_2022_PROGRAM_ID,
  ExtensionType,
  getMintLen,
  createInitializeTransferHookInstruction,
  createInitializeMintInstruction as createInitializeMint2022Instruction,
  createInitializeMetadataPointerInstruction
} from '@solana/spl-token';
import { 
  createInitializeInstruction as createInitializeMetadataInstruction, 
  pack, 
  TokenMetadata
} from '@solana/spl-token-metadata';

const TYPE_SIZE = 2;
const LENGTH_SIZE = 2;

import { 
  getMetadataPDA, 
  getMintAuthorityPDA,
  getExtraAccountMetaListPDA
} from '../utils/pdaHelpers';
import { COMPLIANCE_PROGRAM_ID } from '../config/programs';
import { getComplianceProgram } from '../utils/programDiscoverer';
import { TokenMath } from '@/lib/utils/tokenMath';
import { ProjectRegistryRepository } from '../repositories/projectRegistryRepository';
import { getRegistryProgram } from '../utils/programDiscoverer';
import { confirmTransactionRobustly } from '../utils/transactionUtils';

/**
 * ProjectRegistryService
 * 
 * High-level service for Project Registry operations.
 * Orchestrates transaction construction and robust RPC execution.
 */
export class ProjectRegistryService {
  private repository: ProjectRegistryRepository;
  private connection: Connection;
  private wallet: any;

  constructor(connection: Connection, wallet: any) {
    this.connection = connection;
    this.wallet = wallet;
    const program = getRegistryProgram(connection, wallet);
    this.repository = new ProjectRegistryRepository(program);
  }

  /**
   * Returns the program ID used by this service.
   */
  getProgramId(): PublicKey {
    return this.repository.getProgramId();
  }

  /**
   * Fetches a single project by its on-chain ID.
   */
  async fetchProject(projectId: number): Promise<any> {
    try {
      return await this.repository.fetchProjectAccount(projectId);
    } catch (error) {
      console.warn(`[ProjectRegistryService] Project ID ${projectId} not found on-chain.`);
      return null;
    }
  }

  /**
   * Fetches the global registry configuration.
   */
  async fetchRegistryConfig(): Promise<any> {
    try {
      return await this.repository.fetchRegistryConfig();
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Alias for fetchRegistryConfig (backwards compatibility).
   */
  async syncRegistryState(): Promise<any> {
    return this.fetchRegistryConfig();
  }

  /**
   * Fetches all projects from the registry.
   */
  async fetchAllProjects(): Promise<any[]> {
    return await this.repository.fetchAllProjects();
  }

  /**
   * Initializes the registry control account (One-time setup).
   */
  async initializeControl(params: {
    operationalAdmin: PublicKey;
    operationalLimits: number;
  }): Promise<string> {
    try {
      const instruction = await this.repository.getInitializeControlInstruction(
        params.operationalAdmin,
        TokenMath.toRawUsdc(params.operationalLimits)
      );
      return await this.sendAndConfirm(instruction);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Sets the registry-wide emergency pause state.
   */
  async setEmergencyPause(isPaused: boolean): Promise<string> {
    try {
      const instruction = await this.repository.getSetEmergencyPauseInstruction(isPaused);
      return await this.sendAndConfirm(instruction);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Manually calibrates the on-chain project counter (AC-BC-000 Rescue).
   */
  async calibrateRegistry(newCount: number): Promise<string> {
    try {
      const instruction = await this.repository.getCalibrateRegistryInstruction(newCount);
      return await this.sendAndConfirm(instruction);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * ATOMIC PROJECT CREATION:
   * 1. Creates SPL Mint account
   * 2. Initializes Mint (Dynamic decimals)
   * 3. Registers Metaplex Metadata
   * 4. Initializes Project in Registry
   * 5. Links Mint to Project
   */
  async createProjectWithMint(params: {
    symbol: string;
    name: string;
    uri: string;
    supplyCap: number;
    minInvestmentUsdc: number;
    maxInvestmentUsdc: number;
    lockupEndTs: number;
    subscriptionStart: number;
    subscriptionEnd: number;
    treasuryWallet: PublicKey;
    acceptedStablecoin: PublicKey;
    distributionCadence: number;
    durationMonths: number;
    tokenDecimals: number;
    tokenPriceUsdc: number;      // New Field
    distributionMode: number;    // New Field
    assetType?: any;
    roundLimitTokens?: number;
  }): Promise<{ signature: string; projectId: number; mintAddress: string }> {
    try {
      if (!this.wallet.publicKey) throw new Error("Wallet not connected");

      const mintKeypair = Keypair.generate();
      const mintAddress = mintKeypair.publicKey;

      // 1. Get next project ID from registry config
      const registryConfig = await this.repository.fetchRegistryConfig();
      const nextId = (registryConfig.projectCount as BN).toNumber();

      // 2. Prepare instructions and identify Mint Authority PDA
      const metadataPda = getMetadataPDA(mintAddress);
      const mintAuthorityPda = getMintAuthorityPDA(nextId, this.repository.getProgramId());
      const extraAccountMetaListPda = getExtraAccountMetaListPDA(mintAddress, COMPLIANCE_PROGRAM_ID);

      // Token-2022: Prepare Metadata
      const metaData: TokenMetadata = {
        updateAuthority: this.wallet.publicKey,
        mint: mintAddress,
        name: params.name,
        symbol: params.symbol,
        uri: params.uri,
        additionalMetadata: [],
      };

      // Token-2022: Calculate space for Mint + TransferHook + MetadataPointer + TokenMetadata
      // Note: getMintLen() throws for variable-length extensions like TokenMetadata, 
      // so we handle its header manually. SPACE MUST BE EXACT.
      const extensions = [
        ExtensionType.TransferHook, 
        ExtensionType.MetadataPointer,
      ];
      // Important: Initial space must EXACTLY match the extensions initialized before InitializeMint
      // to avoid 'InvalidAccountData'. We'll reallocate for Metadata later.
      const mintLen = getMintLen(extensions);
      
      const metadataLen = pack(metaData).length;
      // Calculate total lamports for the FINAL size (including metadata + small buffer)
      const totalLen = mintLen + TYPE_SIZE + LENGTH_SIZE + metadataLen + 64; 
      const totalLamports = await this.connection.getMinimumBalanceForRentExemption(totalLen);

      const createMintAccIx = SystemProgram.createAccount({
        fromPubkey: this.wallet.publicKey,
        newAccountPubkey: mintAddress,
        space: mintLen, // Create with minimal space to satisfy InitializeMint
        lamports: totalLamports, // Fund with full lamports to allow reallocation
        programId: TOKEN_2022_PROGRAM_ID,
      });

      // Initialize the Metadata Pointer extension
      const initMetadataPointerIx = createInitializeMetadataPointerInstruction(
        mintAddress,
        this.wallet.publicKey, // Admin wallet as authority
        mintAddress,           // metadata account (the mint itself)
        TOKEN_2022_PROGRAM_ID
      );

      // Initialize the Transfer Hook extension
      const initTransferHookIx = createInitializeTransferHookInstruction(
        mintAddress,
        this.wallet.publicKey, // Admin wallet as authority
        COMPLIANCE_PROGRAM_ID, // the hook program
        TOKEN_2022_PROGRAM_ID
      );

      // Initialize the Metadata within the mint account
      // IMPORTANT: In some environments, this must happen BEFORE InitializeMint
      const initMetadataIx = createInitializeMetadataInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        metadata: mintAddress,
        updateAuthority: this.wallet.publicKey, // Admin wallet as update authority
        mint: mintAddress,
        mintAuthority: this.wallet.publicKey,
        name: metaData.name,
        symbol: metaData.symbol,
        uri: metaData.uri,
      });

      const initMintIx = createInitializeMint2022Instruction(
        mintAddress,
        params.tokenDecimals, 
        this.wallet.publicKey, 
        this.wallet.publicKey,
        TOKEN_2022_PROGRAM_ID
      );

      // Initialize the ExtraAccountMetaList on the compliance program
      const complianceProgram = getComplianceProgram(this.connection, this.wallet);
      const initExtraMetaIx = await complianceProgram.methods
        .initializeExtraAccountMetaList()
        .accounts({
          extraAccountMetaList: extraAccountMetaListPda,
          mint: mintAddress,
          payer: this.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        } as any)
        .instruction();

      /* 
      // NOTE: Metaplex V2 CreateMetadataAccountV3 is incompatible with Token-2022 mints using extensions.
      // This causes 'InstructionKeyMismatch' (153). Bypassing for now; Project name/symbol are still stored 
      // natively in the ProjectAccount.
      const metadataIx = createCreateMetadataAccountV3Instruction(
        {
          metadata: metadataPda,
          mint: mintAddress,
          mintAuthority: this.wallet.publicKey,
          payer: this.wallet.publicKey,
          updateAuthority: this.wallet.publicKey,
        },
        {
          createMetadataAccountArgsV3: {
            data: {
              name: params.name,
              symbol: params.symbol,
              uri: params.uri,
              sellerFeeBasisPoints: 0,
              creators: null,
              collection: null,
              uses: null,
            },
            isMutable: true,
            collectionDetails: null,
          },
        }
      );

      metadataIx.keys.push({
        pubkey: SYSVAR_RENT_PUBKEY,
        isSigner: false,
        isWritable: false,
      });
      metadataIx.keys.push({
        pubkey: TOKEN_2022_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      });
      */

      // Map assetType (handles both raw string and already-mapped object)
      const mappedAssetType = 
        (params.assetType === 'mining' || params.assetType === 'industrial' || params.assetType?.mining) ? { mining: {} } :
        (params.assetType === 'real-estate' || params.assetType === 'real_estate' || params.assetType?.realEstate) ? { realEstate: {} } :
        { other: {} }; // Fallback to 'other' for safety

      const createProjectIx = await this.repository.getCreateProjectInstruction(nextId, {
        name: params.name,
        symbol: params.symbol,
        uri: params.uri,
        supplyCap: TokenMath.toRawTokens(params.supplyCap, params.tokenDecimals), 
        minInvestmentUsdc: TokenMath.toRawUsdc(params.minInvestmentUsdc),
        maxInvestmentUsdc: TokenMath.toRawUsdc(params.maxInvestmentUsdc),
        tokenPriceUsdc: TokenMath.toRawUsdc(params.tokenPriceUsdc),
        lockupEndTs: new BN(params.lockupEndTs),
        subscriptionStart: new BN(params.subscriptionStart),
        subscriptionEnd: new BN(params.subscriptionEnd),
        acceptedStablecoin: params.acceptedStablecoin,
        treasuryWallet: params.treasuryWallet,
        distributionCadence: params.distributionCadence,
        durationMonths: params.durationMonths,
        distributionMode: params.distributionMode, 
        assetType: mappedAssetType, 
        roundLimitTokens: TokenMath.toRawTokens(params.roundLimitTokens || params.supplyCap, params.tokenDecimals),
        tokenDecimals: params.tokenDecimals,
      });

      const setMintIx = await this.repository.getSetProjectMintInstruction(nextId, mintAddress);

      // 3. Assemble and Send Transaction
      const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash('finalized');
      const priorityFeeIx = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 100000, // Increased priority fee
      });
      const computeLimitIx = ComputeBudgetProgram.setComputeUnitLimit({
        units: 400000, // Increased CU limit for complex Token-2022 + Metadata + Hook setup
      });

      // 4. AUTOMATED HANDOVER: Transfer ONLY Mint Authority to Project PDA
      const handoverMintAuthIx = createSetAuthorityInstruction(
        mintAddress,
        this.wallet.publicKey,
        AuthorityType.MintTokens,
        mintAuthorityPda,
        [],
        TOKEN_2022_PROGRAM_ID
      );

      // 5. Build Transaction 1: Mint & Metadata Setup
      const transaction1 = new Transaction().add(
        priorityFeeIx,
        computeLimitIx,
        createMintAccIx,
        initMetadataPointerIx,
        initTransferHookIx,
        initMintIx,      // Now happy because space == mintLen
        initMetadataIx,  // Now happy because mint is initialized (reallocates automatically)
        initExtraMetaIx
      );
      
      transaction1.recentBlockhash = blockhash;
      transaction1.feePayer = this.wallet.publicKey;
      transaction1.partialSign(mintKeypair);

      console.log("[createProjectWithMint] Sending Transaction 1 (Mint & Metadata)...");
      const signature1 = await this.wallet.sendTransaction(transaction1, this.connection, {
        skipPreflight: true,
      });

      // Wait for Mint Setup to be confirmed before proceeding to project registration
      await confirmTransactionRobustly(this.connection, signature1, lastValidBlockHeight, 'confirmed');

      // 6. Build Transaction 2: Project Registry & Authority Handover
      // Re-fetch blockhash for the second transaction to ensure freshness
      const { blockhash: blockhash2, lastValidBlockHeight: lastValidBlockHeight2 } = await this.connection.getLatestBlockhash('finalized');

      const transaction2 = new Transaction().add(
        priorityFeeIx,
        createProjectIx,
        setMintIx,
        handoverMintAuthIx
      );

      transaction2.recentBlockhash = blockhash2;
      transaction2.feePayer = this.wallet.publicKey;

      console.log("[createProjectWithMint] Sending Transaction 2 (Project Registry & Handover)...");
      const signature2 = await this.wallet.sendTransaction(transaction2, this.connection, {
        skipPreflight: true,
      });

      // Robust confirmation for the second transaction
      await confirmTransactionRobustly(this.connection, signature2, lastValidBlockHeight2, 'confirmed');

      return { signature: signature2, projectId: nextId, mintAddress: mintAddress.toString() };
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Revokes the mint authority for a project (Irreversible).
   */
  async revokeMintAuthority(projectId: number): Promise<string> {
    try {
      const instruction = await this.repository.getRevokeMintAuthorityInstruction(projectId);
      return await this.sendAndConfirm(instruction);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Manually sets the mint address for a project.
   */
  async setProjectMint(projectId: number, mint: PublicKey): Promise<string> {
    try {
      const instruction = await this.repository.getSetProjectMintInstruction(projectId, mint);
      return await this.sendAndConfirm(instruction);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Updates mutable project parameters.
   */
  async updateProject(projectId: number, params: any): Promise<string> {
    try {
      const instruction = await this.repository.getUpdateProjectParamsInstruction(projectId, params);
      return await this.sendAndConfirm(instruction);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Updates on-chain project status flags (AC-BC-102).
   */
  async updateProjectStatus(
    projectId: number,
    newStatus: any,
    isPaused: boolean
  ): Promise<string> {
    try {
      const instruction = await this.repository.getUpdateProjectStatusInstruction(
        projectId,
        newStatus,
        isPaused
      );
      return await this.sendAndConfirm(instruction);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Transfers registry authority roles (AC-BC-103-3).
   * Note: The newAdmin must also be present (or signed) for the multi-sig logic.
   * 
   * @param params - target role, new admin address, and optional limits.
   */
  async transferAuthority(params: {
    roleFlag: number; // 0: operational_admin, 1: upgrade_authority, 2: limits
    newAdmin: PublicKey;
    newLimits?: number;
  }): Promise<string> {
    try {
      const instruction = await this.repository.getTransferAuthorityInstruction(
        params.roleFlag,
        params.newAdmin,
        params.newLimits ? TokenMath.toRawUsdc(params.newLimits) : null
      );
      return await this.sendAndConfirm(instruction);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Internal helper for single-instruction transactions.
   */
  private async sendAndConfirm(instruction: any): Promise<string> {
    const { blockhash, lastValidBlockHeight } = await this.connection.getLatestBlockhash('confirmed');
    
    const priorityFeeIx = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: 50000, 
    });

    const transaction = new Transaction().add(priorityFeeIx, instruction);
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = this.wallet.publicKey;

    const signature = await this.wallet.sendTransaction(transaction, this.connection, {
      skipPreflight: true,
    });

    await confirmTransactionRobustly(this.connection, signature, lastValidBlockHeight, 'confirmed');

    return signature;
  }

  /**
   * Issues tokens directly to an investor's wallet.
   * @param projectId - The on-chain project ID.
   * @param investorWallet - The recipient's public key.
   * @param amount - The human-readable amount of tokens (will be scaled by decimals).
   */
  async issueTokens(projectId: number, recipientWallet: PublicKey, amount: number): Promise<string> {
    try {
      const project = await this.repository.fetchProjectAccount(projectId);
      if (!project) throw new Error("Project not found");
      if (!project.mint || project.mint.equals(PublicKey.default)) {
        throw new Error("Project has no linked SPL Token Mint.");
      }

      // 2. Derive PDA and Resolve Recipient ATA
      const mintAuthorityPda = getMintAuthorityPDA(projectId, this.repository.getProgramId());
      const recipientTokenAccount = getAssociatedTokenAddressSync(
        project.mint,
        recipientWallet,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      // 3. SCALE-UP: Self-Healing Authority check
      const transaction = new Transaction();
      const mintInfo = await getMint(this.connection, project.mint);
      
      // If the mint authority isn't the program PDA yet, add a handover instruction
      if (mintInfo.mintAuthority && !mintInfo.mintAuthority.equals(mintAuthorityPda)) {
        console.log(`[Self-Healing] Authority mismatch detected for Project #${projectId}. Prepending handover instruction...`);
        const handoverIx = createSetAuthorityInstruction(
          project.mint,
          this.wallet.publicKey, // Current authority
          AuthorityType.MintTokens,
          mintAuthorityPda, // New authority
          []
        );
        transaction.add(handoverIx);
      }

      // 4. Build ATA Creation Instruction (Idempotent)
      const createAtaIx = createAssociatedTokenAccountIdempotentInstruction(
        this.wallet.publicKey,
        recipientTokenAccount,
        recipientWallet,
        project.mint,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      );
      transaction.add(createAtaIx);

      // 5. Build Issue Instruction using REAL on-chain decimals
      const decimals = await this.getMintDecimals(project.mint);
      const amountBN = TokenMath.toRawTokens(amount, decimals);

      console.log(`[issueTokens] Scaling: ${amount} tokens -> ${amountBN.toString()} raw units (Decimals: ${decimals})`);

      const instruction = await this.repository.getIssueTokensInstruction(
        projectId,
        amountBN,
        project.mint,
        recipientTokenAccount
      );
      transaction.add(instruction);

      return await this.sendAndConfirm(transaction);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  /**
   * Resets the current issuance round for a project.
   * @param projectId - The on-chain project ID.
   * @param newRoundLimit - Optional new limit for the next round (human readable).
   */
  async resetRound(projectId: number, newRoundLimit?: number): Promise<string> {
    try {
      const project = await this.repository.fetchProjectAccount(projectId);
      if (!project) throw new Error("Project not found");
      
      const decimals = await this.getMintDecimals(project.mint);

      const limitBN = newRoundLimit 
        ? new BN(newRoundLimit).mul(new BN(10).pow(new BN(decimals))) 
        : null;

      const instruction = await this.repository.getResetRoundInstruction(projectId, limitBN);
      return await this.sendAndConfirm(instruction);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private async getMintDecimals(mint: PublicKey): Promise<number> {
    try {
      const info = await this.connection.getParsedAccountInfo(mint);
      return (info.value?.data as any).parsed.info.decimals;
    } catch (e) {
      return 9; // Fallback
    }
  }


  private handleError(error: any): Error {
    if (error.logs) {
      console.error("ProjectRegistryService failure logs:", error.logs);
      const pattern = /custom program error: (0x[0-9a-fA-F]+)/;
      for (const log of error.logs) {
        const match = log.match(pattern);
        if (match) return new Error(`BLOCKCHAIN_ERROR: Custom Program Error ${match[1]}`);
      }
    }
    
    // Check for uninitialized registry
    if (error.message && error.message.includes("Account does not exist")) {
      return new Error("NOT_INITIALIZED");
    }
    
    // Check for Account size mismatch (indicates old schema)
    if (error.message && (error.message.includes("Account layout mismatch") || error.message.includes("could not deserialize"))) {
      return new Error("SCHEMA_MISMATCH: This project was created with an old version of the program. Please create a NEW project.");
    }

    console.error("ProjectRegistryService failure detailed:", error);
    return error instanceof Error ? error : new Error(JSON.stringify(error));
  }
}
