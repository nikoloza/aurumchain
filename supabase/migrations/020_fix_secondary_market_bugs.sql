-- Migration 020: Fix Secondary Market Bugs
-- 1. Drop NOT NULL constraint on creation_tx to allow pending orders
-- 2. Update sync_locked_tokens_from_listings trigger to include 'pending' orders

BEGIN;

-- 1. Drop NOT NULL on creation_tx
ALTER TABLE public.secondary_listings 
ALTER COLUMN creation_tx DROP NOT NULL;

-- 2. Replace sync_locked_tokens_from_listings trigger to include pending listings
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
      AND sl.status IN ('active', 'pending') -- FIX: added pending to the sum
  ), 0),
  updated_at = NOW()
  WHERE user_id = v_user_id AND project_id = v_project_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
