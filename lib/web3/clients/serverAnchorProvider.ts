import * as anchor from "@coral-xyz/anchor";
import { Keypair, Transaction, VersionedTransaction } from "@solana/web3.js";
import { createDefaultConnection } from "../config/rpc";
import bs58 from "bs58";

/**
 * Custom NodeWallet implementation to bypass Next.js ESM build issues
 * where '@coral-xyz/anchor' does not export a 'Wallet' class statically.
 */
class NodeWallet {
  constructor(public payer: Keypair) {}

  async signTransaction<T extends Transaction | VersionedTransaction>(tx: T): Promise<T> {
    if (tx instanceof Transaction) {
      tx.partialSign(this.payer);
    } else {
      tx.sign([this.payer]);
    }
    return tx;
  }

  async signAllTransactions<T extends Transaction | VersionedTransaction>(txs: T[]): Promise<T[]> {
    return txs.map((t) => {
      if (t instanceof Transaction) {
        t.partialSign(this.payer);
      } else {
        t.sign([this.payer]);
      }
      return t;
    });
  }

  get publicKey() {
    return this.payer.publicKey;
  }
}

/**
 * ServerAnchorProvider factory
 * 
 * Creates a secure, server-side Anchor provider using administrative keys.
 * This should ONLY be used in server-side files (API routes, background workers).
 */
export function getServerAnchorProvider(): anchor.AnchorProvider {
  const connection = createDefaultConnection();

  const privateKeyStr = process.env.WALLET_PRIVATE_KEY;
  if (!privateKeyStr) {
    throw new Error("SERVER_RPC_ERROR: WALLET_PRIVATE_KEY not found in environment. Backend signing disabled.");
  }

  let secretKey: Uint8Array;
  try {
    secretKey = privateKeyStr.startsWith("[")
      ? Uint8Array.from(JSON.parse(privateKeyStr))
      : bs58.decode(privateKeyStr);
  } catch (err) {
    throw new Error("SERVER_RPC_ERROR: Invalid WALLET_PRIVATE_KEY format (expected JSON array or Base58 string).");
  }

  const keypair = Keypair.fromSecretKey(secretKey);
  const wallet = new NodeWallet(keypair);

  return new anchor.AnchorProvider(connection, wallet as any, {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  });
}
