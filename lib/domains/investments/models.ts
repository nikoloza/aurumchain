/**
 * Investments domain models
 */

import { z } from 'zod';
import { uuidSchema, moneySchema, tokenAmountSchema } from '../shared/schemas';
import type { InvestmentStatus } from '../shared/types';

// Investment model
export const investmentSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  project_id: uuidSchema,
  offering_id: uuidSchema.optional(),

  // Investment amounts
  amount: moneySchema,
  tokens_purchased: tokenAmountSchema,
  token_price_at_purchase: moneySchema,

  // Status
  status: z.enum(['pending', 'approved', 'completed', 'cancelled', 'refunded'] as const) as z.ZodType<InvestmentStatus>,

  // Blockchain tracking
  transaction_hash: z.string().optional(),
  blockchain_subscription_id: z.string().optional(), // On-chain numeric ID
  investor_wallet: z.string().optional(),           // Public key of investor
  block_number: z.bigint().optional(),
  confirmed: z.boolean().default(false),


  // Timestamps
  invested_at: z.date(),
  completed_at: z.date().optional(),
  cancelled_at: z.date().optional(),
  refunded_at: z.date().optional(),

  metadata: z.record(z.string(), z.unknown()).optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Investment = z.infer<typeof investmentSchema>;

// Portfolio position - aggregated view of user's holdings in a project
export const portfolioPositionSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  project_id: uuidSchema,

  // Holdings
  total_tokens: tokenAmountSchema,
  total_invested: moneySchema,
  average_token_price: moneySchema,

  // Earnings
  total_dividends_received: moneySchema.default(0),
  total_dividends_pending: moneySchema.default(0),
  total_return: moneySchema.default(0),
  return_percentage: z.number().default(0),

  // Status
  is_active: z.boolean().default(true),
  closed_at: z.date().optional(),

  metadata: z.record(z.string(), z.unknown()).optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type PortfolioPosition = z.infer<typeof portfolioPositionSchema>;

// Create investment input
export const createInvestmentSchema = z.object({
  userId: uuidSchema,
  projectId: uuidSchema,
  offeringId: uuidSchema.optional(),
  amount: moneySchema,
  tokensPurchased: tokenAmountSchema,
  blockchainSubscriptionId: z.string().optional(),
  blockchainSignature: z.string().optional(),
  investorWallet: z.string().optional(),
});


export type CreateInvestmentInput = z.infer<typeof createInvestmentSchema>;
