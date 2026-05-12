/**
 * Investments service - handles investment creation and management
 */

import { createClient, createAdminClient } from '@/lib/supabase/server';
import type { Investment, CreateInvestmentInput, PortfolioPosition } from './models';
import { ComplianceService } from '../compliance/service';
import { ProjectsService } from '../projects/service';
import { createAuditLog } from '../admin/service';

export class InvestmentsService {
  /**
   * Create a new investment
   */
  static async createInvestment(input: CreateInvestmentInput): Promise<Investment> {
    // Check eligibility
    const isEligible = await ComplianceService.isEligibleToInvest(input.userId);
    if (!isEligible) {
      throw new Error('User is not eligible to invest. Please complete KYC verification and wallet verification.');
    }

    // Check if project is accepting investments
    const isAccepting = await ProjectsService.isAcceptingInvestments(input.projectId);
    if (!isAccepting) {
      throw new Error('This project is not currently accepting investments.');
    }

    // Get offering (optional for some projects)
    const offering = await ProjectsService.getOfferingForProject(input.projectId);
    
    // Check token availability if offering exists
    if (offering && offering.availableTokens < input.tokensPurchased) {
      throw new Error('Not enough tokens available for this investment amount.');
    }

    const supabase = await createClient();
    const adminSupabase = createAdminClient();

    // Create investment using admin client to bypass RLS
    const { data, error } = await adminSupabase
      .from('investments')
      .insert({
        user_id: input.userId,
        project_id: input.projectId,
        offering_id: input.offeringId || input.blockchainSubscriptionId, // Use blockchain ID as fallback to prevent duplicates
        amount: input.amount,
        tokens_purchased: input.tokensPurchased,
        token_price_at_purchase: (input.amount && input.tokensPurchased) ? input.amount / input.tokensPurchased : 0,
        status: input.blockchainSignature ? 'approved' : 'pending',
        transaction_hash: undefined, // Deprecated
        minted_tx_hash: null, // Will be filled during admin approval
        finalized_tx_hash: input.blockchainSignature, // Initial payment signature
        invested_at: new Date().toISOString(),
        approved_at: input.blockchainSignature ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;

    const investment = data as any;

    // 2. Create corresponding transaction record
    await supabase.from('transactions').insert({
      user_id: input.userId,
      project_id: input.projectId,
      investment_id: investment.id,
      amount: input.amount,
      type: 'investment',
      status: input.blockchainSignature ? 'completed' : 'pending',
      blockchain_hash: input.blockchainSignature,
      blockchain_confirmed: !!input.blockchainSignature,
      description: `Investment in ${input.projectId}`,
      initiated_at: new Date().toISOString(),
      completed_at: input.blockchainSignature ? new Date().toISOString() : null,
    });

    // Audit log
    await createAuditLog({
      eventType: 'investment_created',
      userId: input.userId,
      actorId: input.userId,
      actorRole: 'user',
      description: `Investment of ${input.amount} for ${input.tokensPurchased} tokens created`,
      metadata: { projectId: input.projectId, amount: input.amount, tokens: input.tokensPurchased },
    });

    return data as Investment;
  }

  /**
   * Complete investment (after payment confirmation)
   */
  static async completeInvestment(investmentId: string, actorId?: string): Promise<Investment> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('investments')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
      })
      .eq('id', investmentId)
      .select()
      .single();

    if (error) throw error;

    const investment = data as Investment;

    // Audit log
    await createAuditLog({
      eventType: 'investment_completed',
      userId: investment.userId,
      actorId: actorId,
      actorRole: 'admin',
      description: `Investment ${investmentId} completed`,
      metadata: { investmentId, amount: investment.amount },
    });

    return investment;
  }

  /**
   * Get user's investments
   */
  static async getUserInvestments(userId: string): Promise<Investment[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', userId)
      .order('invested_at', { ascending: false });

    if (error) throw error;

    return (data || []) as Investment[];
  }

  /**
   * Get investments for a project
   */
  static async getProjectInvestments(projectId: string): Promise<Investment[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .eq('project_id', projectId)
      .eq('status', 'completed')
      .order('invested_at', { ascending: false });

    if (error) throw error;

    return (data || []) as Investment[];
  }
}
