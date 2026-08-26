# Seeds

Demo data for the two tables the surfaces read live (`projects`,
`offerings`). Everything here is DML — the schema and policies are never
touched.

| File | What |
| --- | --- |
| `backup-2026-08-25.json` | Snapshot of both tables taken before the demo seed was authored (both were empty) |
| `2026-08-25-demo-seed.sql` | Four projects + four offerings matching the surfaces' illustrative placeholder set. Idempotent (fixed UUIDs, `ON CONFLICT DO NOTHING`); rollback DELETEs included at the bottom |

## Apply

Supabase Dashboard → SQL editor on `qetdqwmmnpmgrixkorqg` → paste
`2026-08-25-demo-seed.sql` → run. RLS refuses these inserts to the anon and
authenticated roles by design (probe on 2026-08-25 returned `42501`), so
seeding is an operator action — the same path the repo's migrations use.

## What flips to live

- **Dashboard → Offerings** (`loadOfferings`) — renders the seeded rows the
  moment they exist; the in-page placeholder set remains only as the
  empty-state fallback.
- **Governance → Projects** (`loadRegistry`) — same.

Both pages show skeleton rows while the request is in flight
(`backendOfferingsLoaded` / `backendRegistryLoaded` flags).
