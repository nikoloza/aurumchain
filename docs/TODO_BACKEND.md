# Backend TODO — what `aurc.app` uses today

An audit of the backend that the **live** site depends on, and the work needed
to carry it onto the Symbols rebuild. Audited 2026-08-18 against production.

Companion documents: [TODO.md](./TODO.md) for product and frontend work,
[SPEC.md](./SPEC.md) §9 for the route contract, [api.md](./api.md) for the
endpoint reference.

---

## 1. What is actually running

`aurc.app` **redirects to `www.aurc.app`, which serves the legacy Next.js
build** — the `main` branch, on Vercel. It is not the Symbols rebuild. Both
stacks read the **same Supabase project** (`qetdqwmmnpmgrixkorqg`), so the two
front ends are already looking at one database.

Evidence, collected by probing production directly:

| Probe | Result | What it proves |
| --- | --- | --- |
| `GET https://aurc.app/` | `308` → `www.aurc.app`, `200`, `_next/static` chunks | live, legacy Next build |
| `GET /api/projects` | `200 []` | route works; **the catalogue is empty** — and this route reads with elevated server credentials, so the emptiness is real, not an RLS artefact |
| `GET /api/secondary-market/orderbook` | `200 []` | route works, no listings |
| `GET /api/secondary-market/listings` | **`500` — `column projects_1.token_decimals does not exist`** | deployed code queries a column that exists in no migration — a live production defect |
| `GET /api/portfolio/summary`, `/api/wallet/active` | `401 Unauthorized` | auth-gated routes behave correctly |
| `GET /api/admin/projects` | `405` | POST-only, as designed |

Database state (REST, as the anonymous role and as the demo user):

- All 16 application tables exist: `projects`, `offerings`, `investments`,
  `subscriptions`, `profiles`, `kyc_profiles`, `eligibility_states`,
  `wallet_links`, `wallets`, `portfolio_positions`, `payout_cycles`,
  `payout_records`, `transactions`, `audit_logs`, `secondary_listings`,
  `secondary_trades`.
- Every one of them is **empty**, except `profiles` and `eligibility_states`,
  which hold one row each — the demo account's own. RLS is owner-scoped, so
  those two return exactly one row per signed-in user.
- `token_decimals` appears in **no migration** on either branch.

**The practical consequence:** production is a fully deployed platform with no
data in it. Nothing is lost by moving the front end; what must be preserved is
the *route contract* and the services behind it.

---

## 2. The backend surface in use

38 route handlers under `app/api/` on `main`. They stayed on `main` because
they are Vercel constructs — but every service they call
(`lib/domains/*/service.ts`, `lib/web3/services/*`, `lib/supabase/server.ts`)
**is already restored on `next`**. The work is to re-expose them, not rewrite
them.

Legend — **Called**: reached from the legacy client. **Server**: invoked by
another route or a webhook. **Dead**: no caller found in `app/`,
`components/`, `hooks/`, `context/`, or `lib/`.

### Projects and catalogue

| Route | Method | Use | Tables | Service on `next` |
| --- | --- | --- | --- | --- |
| `/api/projects` | GET | Called | `projects` | `web3/services/projectRegistryService` |
| `/api/projects/[slug]/details` | GET | Called | `projects`, `investments`, `payout_cycles`, `profiles`, `secondary_trades` | `projectRegistryService` |
| `/api/admin/projects` | POST | Called | `projects` | `domains/admin/service` |
| `/api/admin/projects/[id]` | GET, PUT, DELETE | Called | `projects` | `domains/admin/service`, `projectRegistryService` |

### Auth, profile, KYC

| Route | Method | Use | Tables | Service on `next` |
| --- | --- | --- | --- | --- |
| `/api/auth/log-login` | POST | Called | — | `domains/auth/service` |
| `/api/auth/log-signup` | POST | Called | — | `domains/auth/service` |
| `/api/auth/log-logout` | POST | Dead | — | `domains/auth/service` |
| `/api/profile/repair` | POST | Called | `profiles`, `eligibility_states` | — |
| `/api/kyc/token` | GET | Called | — | `sumsub/client` |
| `/api/kyc/complete` | POST | Called | `kyc_profiles`, `profiles`, `eligibility_states` | — |
| `/api/compliance/webhook` | POST | Server (Sumsub) | — | `domains/compliance/service` |

### Wallet

| Route | Method | Use | Tables | Service on `next` |
| --- | --- | --- | --- | --- |
| `/api/wallet/connect` | POST | Called | — | `domains/wallet/service` |
| `/api/wallet/verify` | POST | Called | — | `domains/wallet/service` |
| `/api/wallet/active` | GET | Called | — | `domains/wallet/service` |
| `/api/wallet/sync` | POST | Called | `wallets`, `transactions` | — |

### Investment and portfolio

| Route | Method | Use | Tables | Service on `next` |
| --- | --- | --- | --- | --- |
| `/api/investments/create` | POST | Called | — | `domains/investments/service` |
| `/api/investments/[id]/complete` | POST | Server | — | `domains/investments/service`, `web3/services/adminBlockchainService` |
| `/api/admin/investments` | GET | Called | `investments`, `profiles` | — |
| `/api/admin/investments/finalize` | POST | Called | `investments`, `transactions` | `domains/admin/service` |
| `/api/portfolio/summary` | GET | Called | — | `domains/portfolio/service` |
| `/api/portfolio/assets` | GET | Dead | — | `domains/portfolio/service` |
| `/api/portfolio/performance` | GET | Dead | — | — |

### Distributions and payouts

| Route | Method | Use | Tables | Service on `next` |
| --- | --- | --- | --- | --- |
| `/api/admin/distributions/investors` | GET | Called | `payout_records`, `portfolio_positions`, `profiles`, `wallet_links` | — |
| `/api/admin/distributions/sync-batch` | POST | Called | `payout_records` | — |
| `/api/indexer/sync-epoch` | POST | Called | `payout_cycles` | `domains/admin/service` |
| `/api/payouts/claim/[id]` | POST | Dead | — | `domains/payouts/service` |

### Secondary market

| Route | Method | Use | Tables | Service on `next` |
| --- | --- | --- | --- | --- |
| `/api/secondary-market/orderbook` | GET | Called | `secondary_listings` | — |
| `/api/secondary-market/listings` | GET | Dead (**and 500 in prod**) | `secondary_listings` | — |
| `/api/secondary-market/orders/create` | POST | Called | `secondary_listings`, `portfolio_positions`, `projects`, `kyc_profiles` | `secondaryMarketService` |
| `/api/secondary-market/orders/confirm` | POST | Called | `secondary_listings` | — |
| `/api/secondary-market/orders/cancel` | POST | Called | `secondary_listings`, `projects` | `secondaryMarketService` |
| `/api/secondary-market/orders/cancel/confirm` | POST | Dead | `secondary_listings`, `portfolio_positions` | — |
| `/api/secondary-market/buy` | POST | Called | `secondary_listings`, `projects`, `kyc_profiles` | `secondaryMarketService` |
| `/api/secondary-market/buy/confirm` | POST | Called | `secondary_listings`, `secondary_trades` | `secondaryMarketService` |

Every secondary-market write is rate-limited through `lib/api/rateLimit`.

### Audit, reconciliation, indexing

| Route | Method | Use | Tables | Service on `next` |
| --- | --- | --- | --- | --- |
| `/api/admin/audit-logs` | POST | Called | — | `domains/admin/service` |
| `/api/admin/audit-logs/sync-onchain` | POST | Called | `audit_logs`, `profiles`, `projects` | `web3/clients/anchorClients` |
| `/api/admin/reconciliation` | GET, POST, DELETE | Called | `investments`, `transactions`, `wallet_links`, `audit_logs`, `profiles`, `projects` | `domains/admin/service` |
| `/api/webhooks/solana` | POST | Server (chain) | 9 tables — the widest writer in the system | — |

---

## 3. Tasks

### P0 — decide the API layer's home

- [ ] **Choose the shape.** Either restore `app/api/**` onto `next` behind a
      thin server (Bun/Hono/Express — the handlers are framework-agnostic apart
      from `NextRequest`/`NextResponse`), or re-expose `lib/domains/*` as
      Supabase Edge Functions. Every service the routes call already lives on
      `next`; only the HTTP shell is missing. Record the decision in
      [SPEC.md](./SPEC.md) §9.
- [ ] **Port the four routes the Symbols surfaces will need first**, in this
      order: `GET /api/projects`, `GET /api/projects/[slug]/details`,
      `GET /api/portfolio/summary`, `GET /api/secondary-market/orderbook`.
      They are all read-only, and they unblock Offerings, Portfolio and
      Marketplace at once.
- [ ] **Keep `lib/api/rateLimit` in front of every secondary-market write** —
      it is the only abuse control in the system.

### P0 — live defects

- [ ] **`/api/secondary-market/listings` returns 500 in production**:
      `column projects_1.token_decimals does not exist`. The column is in no
      migration. Decide whether to add it (`projects.token_decimals smallint
      not null default 9` matches SPL convention) or to drop it from the
      query, then redeploy. Until then the endpoint is unusable — the client
      does not call it, which is why the failure went unnoticed.
- [ ] **Audit the rest of the schema for the same drift.** `token_decimals`
      proves that deployed code and `supabase/migrations/` are out of step;
      diff the columns each route selects against the live schema.

### P1 — data

- [ ] **Seed the catalogue.** `projects` and `offerings` are empty in
      production, so *both* front ends show nothing real. One seeded project
      with an offering lights up the legacy site, the Symbols Offerings page
      and Governance → Projects simultaneously.
- [ ] **Give the demo account a `kyc_profiles` row** — it has `profiles` and
      `eligibility_states` rows but no KYC record, so every compliance-gated
      path is untestable end to end.
- [ ] **Confirm RLS for the operator role.** Governance reads
      (`projects`, `audit_logs`, `investments`) currently return nothing to a
      signed-in non-admin, which is correct; verify an operator account *can*
      read them before wiring those pages.

### P1 — the processes behind the routes

- [ ] **Run the indexer.** `scripts/indexer_watcher.ts` keeps
      `portfolio_positions`, `audit_logs` and `payout_cycles` in step with the
      chain, and it is the baseline the reconciliation page compares against.
      Without it, on-chain state never reaches the database. The file is
      **gitignored** (`.gitignore:59`, `scripts/*.ts`) — recover it from the
      deployment checkout and decide where it runs.
- [ ] **Re-point the two webhooks.** `/api/compliance/webhook` (Sumsub) and
      `/api/webhooks/solana` are configured at the provider against the Vercel
      host. They must move with the API layer, and both need their signature
      verification re-checked after the move.

### P2 — cleanup

- [ ] **Retire the dead routes** unless the rebuild needs them:
      `auth/log-logout`, `portfolio/assets`, `portfolio/performance`,
      `payouts/claim/[id]`, `secondary-market/listings`,
      `secondary-market/orders/cancel/confirm`. `payouts/claim/[id]` is the
      one worth keeping — the Payouts page will need it.
- [ ] **Fold `/api/profile/repair` into signup.** It exists because profile
      rows went missing; fix the cause rather than shipping the repair route
      again.
- [ ] `investments.status_legacy` — remove once no reader uses it
      ([SPEC.md](./SPEC.md) §12).
- [ ] The wallet-address constraint accepts EVM format only — correct it
      before any Solana address is written ([SPEC.md](./SPEC.md) §12).

---

## 4. How to re-run this audit

```sh
# live route behaviour (read-only endpoints only — never POST at production)
curl -s -o /dev/null -w '%{http_code}\n' https://www.aurc.app/api/projects

# table inventory and row counts, as the anonymous role
curl -s "$SUPABASE_URL/rest/v1/<table>?select=*&limit=1" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H 'Prefer: count=exact' -D - -o /dev/null

# the same as a signed-in user, to separate "empty" from "hidden by RLS"
curl -s "$SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $SUPABASE_PUBLISHABLE_KEY" -H 'Content-Type: application/json' \
  -d '{"email":"…","password":"…"}'

# route → tables → services map
cd .legacy && for r in $(find app/api -name route.ts); do
  grep -oE "\.from\('[a-z_]+'" "$r"; grep -oE "from '@/lib/[a-zA-Z0-9/_-]+'" "$r"
done
```

Credentials live in the repo-root `.env` (not committed).
