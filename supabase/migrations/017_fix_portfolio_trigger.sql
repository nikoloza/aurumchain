-- Migration: Update portfolio trigger to support 'approved' status and backfill positions

-- 1. Update the trigger function to handle 'approved' and 'completed' statuses
CREATE OR REPLACE FUNCTION update_portfolio_position_on_investment()
RETURNS TRIGGER AS $$
DECLARE
  position_exists BOOLEAN;
BEGIN
  -- Only process completed/approved investments
  IF (NEW.status::text = 'approved' OR NEW.status::text = 'completed') AND 
     (OLD.status IS NULL OR (OLD.status::text != 'approved' AND OLD.status::text != 'completed')) THEN

    -- Check if position exists
    SELECT EXISTS(
      SELECT 1 FROM public.portfolio_positions
      WHERE user_id = NEW.user_id AND project_id = NEW.project_id
    ) INTO position_exists;

    IF position_exists THEN
      -- Update existing position
      UPDATE public.portfolio_positions
      SET
        total_tokens = total_tokens + NEW.tokens_purchased,
        total_invested = total_invested + NEW.amount,
        average_token_price = (total_invested + NEW.amount) / (total_tokens + NEW.tokens_purchased),
        updated_at = NOW()
      WHERE user_id = NEW.user_id AND project_id = NEW.project_id;
    ELSE
      -- Create new position
      INSERT INTO public.portfolio_positions (
        user_id, project_id, total_tokens, total_invested, average_token_price
      ) VALUES (
        NEW.user_id, NEW.project_id, NEW.tokens_purchased, NEW.amount, NEW.token_price_at_purchase
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. One-time backfill of portfolio positions from existing approved/completed investments
INSERT INTO public.portfolio_positions (
  user_id,
  project_id,
  total_tokens,
  total_invested,
  average_token_price,
  is_active
)
SELECT
  user_id,
  project_id,
  SUM(tokens_purchased) as total_tokens,
  SUM(amount) as total_invested,
  CASE WHEN SUM(tokens_purchased) > 0 THEN SUM(amount) / SUM(tokens_purchased) ELSE 0 END as average_token_price,
  TRUE as is_active
FROM public.investments
WHERE status::text = 'approved' OR status::text = 'completed'
GROUP BY user_id, project_id
ON CONFLICT (user_id, project_id) DO UPDATE SET
  total_tokens = EXCLUDED.total_tokens,
  total_invested = EXCLUDED.total_invested,
  average_token_price = EXCLUDED.average_token_price,
  is_active = TRUE,
  updated_at = NOW();
