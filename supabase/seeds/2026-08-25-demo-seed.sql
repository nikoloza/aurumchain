-- Demo seed — 2026-08-25
-- ─────────────────────────────────────────────────────────────────────────────
-- Fills the two tables the surfaces read live (projects + offerings) with the
-- same illustrative set the pages ship as placeholders, so Dashboard →
-- Offerings and Governance → Projects flip from fallback data to real backend
-- reads with no code change (see README "Data — live vs placeholder").
--
-- • DML only — no DDL, no schema or policy changes.
-- • Idempotent — fixed UUIDs + ON CONFLICT DO NOTHING; safe to run twice.
-- • Apply in Supabase Dashboard → SQL editor on qetdqwmmnpmgrixkorqg
--   (RLS correctly refuses these inserts to the anon/authenticated roles —
--   verified 2026-08-25 with a probe that returned 42501 — so seeding is an
--   operator action, same path as the migrations).
-- • Pre-seed state: both tables empty — snapshot in backup-2026-08-25.json.
-- • Roll back with the DELETEs at the bottom (kept commented).

INSERT INTO public.projects
  (id, name, slug, description, location, country,
   funding_goal, current_funding, min_investment, token_price,
   total_tokens, available_tokens,
   expected_return_percentage, project_duration_months, status)
VALUES
  ('a0000000-0000-4000-8000-000000000001',
   'Riverbend Extraction', 'riverbend-extraction',
   'Alluvial gold extraction along the Ankobra riverbend. Revenue settles to token holders each distribution epoch.',
   'Ashanti', 'Ghana',
   2400000.00, 1840000.00, 500.00, 25.00,
   96000, 22400,
   11.40, 36, 'funding'),
  ('a0000000-0000-4000-8000-000000000002',
   'Kalgoorlie Tailings', 'kalgoorlie-tailings',
   'Reprocessing of legacy tailings stacks outside Kalgoorlie. Recovery yields distribute quarterly.',
   'Western Australia', 'Australia',
   1500000.00, 620000.00, 250.00, 10.00,
   150000, 88000,
   9.20, 24, 'funding'),
  ('a0000000-0000-4000-8000-000000000003',
   'Serra Verde Plant', 'serra-verde-plant',
   'Ore processing plant expansion in Minas Gerais. Fully subscribed; payouts run on plant throughput.',
   'Minas Gerais', 'Brazil',
   3100000.00, 3100000.00, 1000.00, 50.00,
   62000, 0,
   12.80, 48, 'funded'),
  ('a0000000-0000-4000-8000-000000000004',
   'Atlas Grain Belt', 'atlas-grain-belt',
   'Row-crop farmland portfolio across the grain belt. Harvest revenue maps onto distribution epochs.',
   'Saskatchewan', 'Canada',
   1200000.00, 1200000.00, 250.00, 20.00,
   60000, 0,
   8.60, 30, 'active')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.offerings
  (id, project_id, token_symbol, token_name,
   total_tokens, available_tokens, token_price, token_standard,
   offering_start_date, offering_end_date, is_active, is_closed)
VALUES
  ('b0000000-0000-4000-8000-000000000001',
   'a0000000-0000-4000-8000-000000000001',
   'RBX-001', 'Riverbend Extraction',
   96000, 22400, 25.00, 'custom',
   '2026-06-01T00:00:00Z', '2026-09-15T00:00:00Z', TRUE, FALSE),
  ('b0000000-0000-4000-8000-000000000002',
   'a0000000-0000-4000-8000-000000000002',
   'KGT-002', 'Kalgoorlie Tailings',
   150000, 88000, 10.00, 'custom',
   '2026-07-01T00:00:00Z', '2026-10-01T00:00:00Z', TRUE, FALSE),
  ('b0000000-0000-4000-8000-000000000003',
   'a0000000-0000-4000-8000-000000000003',
   'SVP-003', 'Serra Verde Plant',
   62000, 0, 50.00, 'custom',
   '2026-03-01T00:00:00Z', '2026-06-30T00:00:00Z', FALSE, TRUE),
  ('b0000000-0000-4000-8000-000000000004',
   'a0000000-0000-4000-8000-000000000004',
   'AGB-004', 'Atlas Grain Belt',
   60000, 0, 20.00, 'custom',
   '2026-01-15T00:00:00Z', '2026-04-15T00:00:00Z', FALSE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- ── Rollback ────────────────────────────────────────────────────────────────
-- DELETE FROM public.offerings WHERE id IN
--   ('b0000000-0000-4000-8000-000000000001','b0000000-0000-4000-8000-000000000002',
--    'b0000000-0000-4000-8000-000000000003','b0000000-0000-4000-8000-000000000004');
-- DELETE FROM public.projects WHERE id IN
--   ('a0000000-0000-4000-8000-000000000001','a0000000-0000-4000-8000-000000000002',
--    'a0000000-0000-4000-8000-000000000003','a0000000-0000-4000-8000-000000000004');
