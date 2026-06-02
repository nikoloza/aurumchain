-- Migration: Create secondary market listings and trades tables

-- 1. Create secondary listings table
CREATE TABLE IF NOT EXISTS public.secondary_listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sell_order_pda TEXT UNIQUE NOT NULL,
  investor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,

  -- Token info
  token_amount DECIMAL(20, 8) NOT NULL CHECK (token_amount > 0),
  token_listing_price DECIMAL(15, 2) NOT NULL CHECK (token_listing_price > 0), -- price in stablecoin (USDC)
  sold DECIMAL(20, 8) DEFAULT 0 NOT NULL CHECK (sold >= 0),
  remaining DECIMAL(20, 8) NOT NULL CHECK (remaining >= 0),

  -- Transactions tracking
  creation_tx TEXT NOT NULL,
  cancelled_tx TEXT,
  cancelled_at TIMESTAMPTZ,

  -- Anchor sequence seed counter
  sequence BIGINT NOT NULL,

  -- Status
  status TEXT DEFAULT 'active' 
    CHECK (status IN ('active', 'cancelled', 'filled')) NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT valid_balances CHECK (remaining = token_amount - sold)
);

-- 2. Create secondary trades table
CREATE TABLE IF NOT EXISTS public.secondary_trades (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id UUID REFERENCES public.secondary_listings(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,

  -- Trade details
  token_amount DECIMAL(20, 8) NOT NULL CHECK (token_amount > 0),
  paid_amount DECIMAL(15, 2) NOT NULL CHECK (paid_amount > 0), -- paid in stablecoin (USDC)
  trade_tx TEXT NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Create Indexes
CREATE INDEX IF NOT EXISTS idx_secondary_listings_investor_id ON public.secondary_listings(investor_id);
CREATE INDEX IF NOT EXISTS idx_secondary_listings_project_id ON public.secondary_listings(project_id);
CREATE INDEX IF NOT EXISTS idx_secondary_listings_status ON public.secondary_listings(status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_secondary_listings_pda ON public.secondary_listings(sell_order_pda);

CREATE INDEX IF NOT EXISTS idx_secondary_trades_listing_id ON public.secondary_trades(listing_id);
CREATE INDEX IF NOT EXISTS idx_secondary_trades_seller_id ON public.secondary_trades(seller_id);
CREATE INDEX IF NOT EXISTS idx_secondary_trades_buyer_id ON public.secondary_trades(buyer_id);
CREATE INDEX IF NOT EXISTS idx_secondary_trades_created_at ON public.secondary_trades(created_at DESC);

-- 4. Enable Row Level Security
ALTER TABLE public.secondary_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secondary_trades ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
CREATE POLICY "Anyone can view active secondary listings"
  ON public.secondary_listings FOR SELECT
  USING (status = 'active');

CREATE POLICY "Users can view own listings"
  ON public.secondary_listings FOR SELECT
  USING (auth.uid() = investor_id);

CREATE POLICY "Users can view trades they participated in"
  ON public.secondary_trades FOR SELECT
  USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

-- 6. Trigger for updated_at column
CREATE TRIGGER update_secondary_listings_updated_at
  BEFORE UPDATE ON public.secondary_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Trigger & Function to update portfolio positions when a trade is completed
CREATE OR REPLACE FUNCTION update_portfolio_positions_on_secondary_trade()
RETURNS TRIGGER AS $$
DECLARE
  seller_average_price DECIMAL(15, 2);
  buyer_position_exists BOOLEAN;
  v_project_id UUID;
  v_seller_id UUID;
BEGIN
  -- Retrieve project_id and seller_id from the listing
  SELECT project_id, investor_id INTO v_project_id, v_seller_id
  FROM public.secondary_listings
  WHERE id = NEW.listing_id;

  -- Fetch seller's average token price from portfolio_positions
  SELECT average_token_price INTO seller_average_price
  FROM public.portfolio_positions
  WHERE user_id = v_seller_id AND project_id = v_project_id;

  -- Fallback if no average price exists
  IF seller_average_price IS NULL THEN
    seller_average_price := NEW.paid_amount / NEW.token_amount;
  END IF;

  -- 1. Update Seller Position
  UPDATE public.portfolio_positions
  SET
    total_tokens = GREATEST(0, total_tokens - NEW.token_amount),
    total_invested = GREATEST(0, total_invested - (NEW.token_amount * seller_average_price)),
    is_active = (total_tokens - NEW.token_amount > 0),
    closed_at = CASE WHEN total_tokens - NEW.token_amount <= 0 THEN NOW() ELSE NULL END,
    updated_at = NOW()
  WHERE user_id = v_seller_id AND project_id = v_project_id;

  -- 2. Check and Update/Insert Buyer Position
  SELECT EXISTS(
    SELECT 1 FROM public.portfolio_positions
    WHERE user_id = NEW.buyer_id AND project_id = v_project_id
  ) INTO buyer_position_exists;

  IF buyer_position_exists THEN
    UPDATE public.portfolio_positions
    SET
      total_tokens = total_tokens + NEW.token_amount,
      total_invested = total_invested + NEW.paid_amount,
      average_token_price = (total_invested + NEW.paid_amount) / (total_tokens + NEW.token_amount),
      is_active = TRUE,
      closed_at = NULL,
      updated_at = NOW()
    WHERE user_id = NEW.buyer_id AND project_id = v_project_id;
  ELSE
    INSERT INTO public.portfolio_positions (
      user_id,
      project_id,
      total_tokens,
      total_invested,
      average_token_price,
      is_active
    ) VALUES (
      NEW.buyer_id,
      v_project_id,
      NEW.token_amount,
      NEW.paid_amount,
      NEW.paid_amount / NEW.token_amount,
      TRUE
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_secondary_trade_logged_update_portfolio
  AFTER INSERT ON public.secondary_trades
  FOR EACH ROW EXECUTE FUNCTION update_portfolio_positions_on_secondary_trade();

COMMENT ON TABLE public.secondary_listings IS 'Active and historical peer-to-peer listings for secondary market trading';
COMMENT ON TABLE public.secondary_trades IS 'Completed trade matching transactions executed on the secondary market';
