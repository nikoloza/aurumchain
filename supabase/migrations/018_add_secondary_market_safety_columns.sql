-- Migration 018: Add Secondary Market Safety Constraints (Non-Disruptive)

BEGIN;

-- 1. Add locked_tokens column to portfolio_positions
ALTER TABLE public.portfolio_positions 
ADD COLUMN IF NOT EXISTS locked_tokens DECIMAL(15, 8) DEFAULT 0 NOT NULL CHECK (locked_tokens >= 0);

-- 2. Add platform_fee and fee_recipient to secondary_trades
ALTER TABLE public.secondary_trades
ADD COLUMN IF NOT EXISTS platform_fee DECIMAL(15, 2),
ADD COLUMN IF NOT EXISTS fee_recipient TEXT;

-- 3. Backfill locked_tokens from active secondary_listings
-- This instantly corrects the balance for all existing active listings
UPDATE public.portfolio_positions pp
SET locked_tokens = COALESCE((
  SELECT SUM(sl.remaining)
  FROM public.secondary_listings sl
  WHERE sl.investor_id = pp.user_id 
    AND sl.project_id = pp.project_id 
    AND sl.status = 'active'
), 0);

-- 4. Create trigger to automatically sync locked_tokens whenever a listing changes
-- This trigger handles creation (INSERT), cancellation/fills (UPDATE), and DELETES
CREATE OR REPLACE FUNCTION sync_locked_tokens_from_listings()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_project_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_user_id := OLD.investor_id;
    v_project_id := OLD.project_id;
  ELSE
    v_user_id := NEW.investor_id;
    v_project_id := NEW.project_id;
  END IF;

  UPDATE public.portfolio_positions pp
  SET locked_tokens = COALESCE((
    SELECT SUM(remaining)
    FROM public.secondary_listings sl
    WHERE sl.investor_id = v_user_id 
      AND sl.project_id = v_project_id 
      AND sl.status = 'active'
  ), 0),
  updated_at = NOW()
  WHERE user_id = v_user_id AND project_id = v_project_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists (idempotency)
DROP TRIGGER IF EXISTS on_secondary_listing_sync_locked_tokens ON public.secondary_listings;

-- Apply trigger
CREATE TRIGGER on_secondary_listing_sync_locked_tokens
  AFTER INSERT OR UPDATE OR DELETE ON public.secondary_listings
  FOR EACH ROW EXECUTE FUNCTION sync_locked_tokens_from_listings();

COMMIT;
