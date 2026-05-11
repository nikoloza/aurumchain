-- Fix for update_project_funding trigger
-- Corrects the status check to use 'approved' instead of the legacy 'completed'

CREATE OR REPLACE FUNCTION update_project_funding()
RETURNS TRIGGER AS $$
BEGIN
  -- Updated to use 'approved' from investment_status_v2
  IF (NEW.status::text = 'approved') AND (OLD.status IS NULL OR OLD.status::text != 'approved') THEN
    UPDATE public.projects
    SET
      current_funding = current_funding + NEW.amount,
      available_tokens = available_tokens - NEW.tokens_purchased
    WHERE id = NEW.project_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
