'use server';

import { z } from 'zod';
import { createClient, createAdminClient } from '@/lib/supabase/server';
import { AdminService, createAuditLog } from '@/lib/domains/admin/service';
import { 
  RecordVerifiedWalletSchema, 
  RevokeWalletSchema 
} from '@/lib/web3/schemas/compliance';

/**
 * Server Action: syncKycApproval
 * 
 * Synchronizes a successful blockchain KYC verification with Supabase.
 * Enforces strict RBAC and creates an immutable audit log.
 */
export async function syncKycApprovalAction(input: any) {
  try {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();
    const { data: { user: adminUser } } = await supabase.auth.getUser();

    // 1. RBAC Check (Server-Side)
    if (!adminUser || !(await AdminService.isAdmin(adminUser.id))) {
      return { success: false, error: "UNAUTHORIZED: Admin privileges required" };
    }

    // 2. Strict Input Validation (With added signature requirement)
    const schema = RecordVerifiedWalletSchema.extend({
      signature: z.string().min(32),
    });
    const validated = schema.parse(input);

    // 3. Database Synchronization (Unified for Legacy & New)
    // Find user by checking BOTH profiles.crypto_wallet_address and profiles.wallet_address
    const { data: profileByCrypto } = await adminSupabase.from('profiles').select('id').eq('crypto_wallet_address', validated.wallet).maybeSingle();
    const { data: profileByStandard } = await adminSupabase.from('profiles').select('id').eq('wallet_address', validated.wallet).maybeSingle();
    
    const profileId = profileByCrypto?.id || profileByStandard?.id;
    
    if (!profileId) throw new Error(`User not found for wallet: ${validated.wallet}`);

    // Update kyc_profiles: Create or Update (All status columns)
    const { error: kycError } = await adminSupabase
      .from('kyc_profiles')
      .upsert({
        user_id: profileId,
        status: 'approved',
        approved_at: new Date().toISOString(),
        expires_at: new Date(validated.expiryTimestamp * 1000).toISOString(),
        metadata: { 
          blockchain_signature: validated.signature,
          last_synced_at: new Date().toISOString(),
          wallet_at_approval: validated.wallet
        }
      }, { onConflict: 'user_id' });

    if (kycError) throw kycError;

    // Update global profile: Sync ALL duplicate columns for consistency
    await adminSupabase
      .from('profiles')
      .update({ 
        crypto_wallet_address: validated.wallet,
        wallet_address: validated.wallet
      })
      .eq('id', profileId);

    // Sync the separate 'wallets' table too
    await adminSupabase
      .from('wallets')
      .upsert({ 
        user_id: profileId,
        wallet_address: validated.wallet 
      }, { onConflict: 'user_id' });

    // UPDATE eligibility_states to 'investment_eligible'
    await adminSupabase
      .from('eligibility_states')
      .upsert({
        user_id: profileId,
        status: 'investment_eligible',
        can_invest: true,
        can_trade: true,
        can_withdraw: true
      }, { onConflict: 'user_id' });

    // 4. Audit Logging
    await createAuditLog({
      eventType: 'kyc_approved',
      userId: profileId,
      actorId: adminUser.id,
      actorRole: 'admin',
      description: `Wallet ${validated.wallet} verified on-chain. Signature: ${validated.signature}`,
      metadata: { ...validated }
    });

    return { success: true, data: { status: 'synced' } };

  } catch (error: any) {
    console.error("[Server Action] syncKycApproval failed:", error);
    return { 
      success: false, 
      error: error.name === 'ZodError' ? "Validation failed" : "Internal Server Error" 
    };
  }
}

/**
 * Server Action: syncKycRevoke
 */
export async function syncKycRevokeAction(input: any) {
  try {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();
    const { data: { user: adminUser } } = await supabase.auth.getUser();

    if (!adminUser || !(await AdminService.isAdmin(adminUser.id))) {
      return { success: false, error: "UNAUTHORIZED: Admin privileges required" };
    }

    const schema = RevokeWalletSchema.extend({
      signature: z.string().min(32),
    });
    const validated = schema.parse(input);

    // Find user by checking BOTH profiles.crypto_wallet_address and profiles.wallet_address
    const { data: profileByCrypto } = await adminSupabase.from('profiles').select('id').eq('crypto_wallet_address', validated.wallet).maybeSingle();
    const { data: profileByStandard } = await adminSupabase.from('profiles').select('id').eq('wallet_address', validated.wallet).maybeSingle();
    
    const profileId = profileByCrypto?.id || profileByStandard?.id;
    
    if (!profileId) throw new Error("User not found");

    await adminSupabase
      .from('kyc_profiles')
      .update({ status: 'rejected', rejected_at: new Date().toISOString() })
      .eq('user_id', profileId);

    await adminSupabase
      .from('profiles')
      .update({ id: profileId }) // Just a no-op update or just remove it
      .eq('id', profileId);

    await createAuditLog({
      eventType: 'kyc_rejected',
      userId: profileId,
      actorId: adminUser.id,
      actorRole: 'admin',
      description: `Wallet ${validated.wallet} eligibility revoked on-chain. Signature: ${validated.signature}`,
      metadata: { ...validated }
    });

    return { success: true, data: { status: 'revoked-synced' } };

  } catch (error: any) {
    console.error("[Server Action] syncKycRevoke failed:", error);
    return { success: false, error: "Internal Server Error" };
  }
}

function mapKycStatusToString(status: number): string {
  const map: Record<number, string> = {
    0: 'pending',
    1: 'approved',
    2: 'rejected',
    3: 'expired'
  };
  return map[status] || 'unknown';
}
