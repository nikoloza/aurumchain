-- Migration: Update secondary_listings status CHECK constraint
-- Adds 'pending', 'partially_filled', and 'open' to align with the spec and API requirements.

DO $$
DECLARE
  r RECORD;
BEGIN
  -- Find and drop the existing CHECK constraint on the status column
  FOR r IN 
    SELECT conname 
    FROM pg_constraint 
    WHERE conrelid = 'public.secondary_listings'::regclass 
      AND contype = 'c' 
      AND (
        pg_get_constraintdef(oid) LIKE '%status = ANY%' OR 
        pg_get_constraintdef(oid) LIKE '%status IN%' OR
        conname LIKE '%status%'
      )
  LOOP
    EXECUTE 'ALTER TABLE public.secondary_listings DROP CONSTRAINT ' || quote_ident(r.conname);
  END LOOP;
END;
$$;

-- Add the new, comprehensive constraint
ALTER TABLE public.secondary_listings 
  ADD CONSTRAINT secondary_listings_status_check 
  CHECK (status IN ('active', 'cancelled', 'filled', 'pending', 'partially_filled', 'open'));
