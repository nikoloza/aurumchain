/**
 * Portfolio service - handles user portfolio and positions
 */

import { createClient } from '@/lib/supabase/server';
import type { PortfolioPosition } from '../investments/models';

export class PortfolioService {
  /**
   * Get user's portfolio positions
   */
  static async getUserPortfolio(userId: string): Promise<PortfolioPosition[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('portfolio_positions')
      .select(`
        *,
        projects:project_id (
          id,
          name,
          slug,
          location,
          country,
          status,
          images
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []) as PortfolioPosition[];
  }

  /**
   * Get portfolio summary for user calculated from live data
   */
  static async getPortfolioSummary(userId: string): Promise<{
    totalInvested: number;
    totalValue: number;
    totalReturn: number;
    returnPercentage: number;
    activePositions: number;
    tokenBalances: Record<string, number>;
  }> {
    const supabase = await createClient();

    // 1. Fetch all completed/approved investments
    const { data: investments } = await supabase
      .from('investments')
      .select('amount, tokens_purchased, project_id, status')
      .eq('user_id', userId)
      .in('status', ['approved', 'completed']);

    // 2. Fetch all payout records
    const { data: payouts } = await supabase
      .from('payout_records')
      .select('amount_due, status')
      .eq('user_id', userId)
      .eq('status', 'completed');

    const totalInvested = (investments || []).reduce((sum, inv) => sum + Number(inv.amount), 0);
    const totalReturn = (payouts || []).reduce((sum, p) => sum + Number(p.amount_due), 0);
    
    // Calculate token balances per project
    const tokenBalances: Record<string, number> = {};
    const uniqueProjects = new Set<string>();

    (investments || []).forEach(inv => {
      if (inv.project_id) {
        uniqueProjects.add(inv.project_id);
        tokenBalances[inv.project_id] = (tokenBalances[inv.project_id] || 0) + Number(inv.tokens_purchased);
      }
    });

    const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    return {
      totalInvested,
      totalValue: totalInvested + totalReturn, // Simple valuation: Cost + Cash Returns
      totalReturn,
      returnPercentage,
      activePositions: uniqueProjects.size,
      tokenBalances
    };
  }

  /**
   * Get breakdown of project assets held in portfolio
   */
  static async getPortfolioAssets(userId: string): Promise<any[]> {
    const supabase = await createClient();

    // 1. Get token balances from investments
    const { data: investments } = await supabase
      .from('investments')
      .select(`
        tokens_purchased,
        project_id,
        projects (
          id,
          name,
          slug,
          token_symbol,
          token_price,
          images
        )
      `)
      .eq('user_id', userId)
      .in('status', ['approved', 'completed']);

    if (!investments) return [];

    // Aggregate by project
    const assetMap: Record<string, any> = {};

    investments.forEach((inv: any) => {
      const project = inv.projects;
      if (!project) return;

      if (!assetMap[project.id]) {
        assetMap[project.id] = {
          projectId: project.id,
          name: project.name,
          slug: project.slug,
          symbol: project.token_symbol || 'TOKEN',
          balance: 0,
          currentPrice: project.token_price || 0,
          value: 0,
          image: project.images?.[0] || null
        };
      }

      assetMap[project.id].balance += Number(inv.tokens_purchased);
      assetMap[project.id].value = assetMap[project.id].balance * assetMap[project.id].currentPrice;
    });

    return Object.values(assetMap);
  }

  /**
   * Get position for a specific project
   */
  static async getPosition(userId: string, projectId: string): Promise<PortfolioPosition | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('portfolio_positions')
      .select('*')
      .eq('user_id', userId)
      .eq('project_id', projectId)
      .single();

    if (error || !data) return null;

    return data as PortfolioPosition;
  }
}
