-- Migration to fix subscription table column types for decimal precision
-- Uses unconstrained NUMERIC to avoid overflow and support dynamic decimals

-- Clear existing "big number" data so we can start fresh with accurate decimals
TRUNCATE public.subscriptions;

ALTER TABLE public.subscriptions 
ALTER COLUMN investment_amount TYPE NUMERIC,
ALTER COLUMN allocated_token_amount TYPE NUMERIC;

COMMENT ON COLUMN public.subscriptions.investment_amount IS 'Actual USDC amount (6 decimals)';
COMMENT ON COLUMN public.subscriptions.allocated_token_amount IS 'Actual token amount (dynamic decimals)';
