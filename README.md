# Fractyco

Fractyco divides a real-world asset into tokens. An investor buys the tokens,
holds them in a personal wallet, and receives the asset's profit on-chain.

**The front end lives in `packages/`.** Three Symbols surfaces plus the shared
design system — `packages/landing`, `packages/dashboard`, `packages/governance`
and `packages/brand` — wired together as Bun workspaces. Everything outside
`packages/` is chain and backend: the Anchor programs, the TypeScript service
layer, the database schema and the integration tests.

All documentation is in [`docs/`](./docs):

| Document | Covers |
| --- | --- |
| [SPEC.md](./docs/SPEC.md) | the full technical specification |
| [SMBLS.md](./docs/SMBLS.md) | running, publishing and operating the Symbols toolchain — read before writing DOMQL |
| [BRAND.md](./docs/BRAND.md) | the brand identity and how it maps onto the design system — read before styling anything |
| [DESIGN.md](./docs/DESIGN.md) | the applied design language — the hero ring-world, the motion system, section choreography, interaction rules |
| [DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md) | deploying programs, database, indexer and surfaces end to end |
| [TODO.md](./docs/TODO.md) | product and frontend work |
| [TODO_BACKEND.md](./docs/TODO_BACKEND.md) | what the live `aurc.app` backend uses, and what the rebuild must take over |
| [api.md](./docs/api.md) | the API route contract (served by `main`, not yet by `next`) |

## Live demos

| Surface | Production | Purpose |
| --- | --- | --- |
| Landing | https://fractyco--landing.at.symbo.ls | Marketing site |
| Dashboard | https://fractyco--app.at.symbo.ls | Investor application |
| Governance | https://fractyco--governance.at.symbo.ls | Operator / compliance console |
| Brand | https://fractyco--uikit.at.symbo.ls | Design-system reference (`packages/brand` published as the `uikit` library) |

Staging and development follow the pattern
`fractyco--<surface>--staging.at.symbo.ls` / `--development`. The dashboards
sign in against the live Supabase backend; the demo account lives in `.env`
(not committed).

## Data — live vs placeholder

Read this before trusting any number on a screen. Almost every figure the
surfaces show today is **placeholder content written into the page objects**,
not a backend read.

**Live — reads the Supabase backend (`qetdqwmmnpmgrixkorqg`):**

| Where | What | Path |
| --- | --- | --- |
| every dashboard/governance page | sign-in, session gate, sign-out | GoTrue password grant → `fractyco_session` in `localStorage` |
| Topbar, Settings → Email | the signed-in account's email | the session token |
| Dashboard → Offerings | offering rows | `loadOfferings` → `GET /rest/v1/projects?…offerings(…)` |
| Governance → Projects | registry rows | `loadRegistry` → `GET /rest/v1/projects?…` |

**Placeholder — hard-coded in the page object, no backend call:**

Dashboard: Overview, Portfolio, Marketplace, Payouts, Transactions, Wallet,
Identity, and every Settings row except Email.
Governance: Overview, Compliance, Subscriptions, Distributions, Market,
Reconciliation, Audit, Roles, Authorities, Control plane, Emergency.

> **Seeding:** `supabase/seeds/2026-08-25-demo-seed.sql` fills both tables
> with the illustrative set (idempotent, DML only, rollback included) — apply
> it in the Supabase SQL editor; see `supabase/seeds/README.md`.

> **The two live pages also show placeholders right now.** `projects` and
> `offerings` are readable but **empty**, and both loaders fall back to the
> illustrative set when the query returns no rows. Seed the tables and those
> two pages switch to real data with no code change — see
> [docs/TODO.md](./docs/TODO.md).

No page writes to the backend yet. There is no mock server and no fixture
layer: "placeholder" means literal values inside `pages/*.js`. To make a page
live, add a loader to `packages/brand/functions/backend.js` following
`loadOfferings`, then read `s.root.<key>` in the page with the placeholder
kept as the empty-state fallback.

## Layout

```
fractyco/
├── packages/         ← the entire front end, as Bun workspaces
│   ├── brand/        design system + component library, shared by every surface
│   ├── landing/      marketing site                     (fractyco.localhost)
│   ├── dashboard/    investor application               (fractyco-app.localhost)
│   └── governance/   operator and compliance console    (fractyco-gov.localhost)
├── programs/         the four Anchor programs (registry, compliance, distribution, market)
├── lib/              web3 + domain service layer (TypeScript) — from `main`, unchanged
├── tests/            on-chain integration tests (mocha/tsx) — `bun run test:*`
├── supabase/         database schema and migrations — borrowed from `main`, unchanged
├── docs/             every Markdown document in the repo
├── scripts/          the cross-surface runner
└── .legacy/          reference worktree — the pre-Symbols source, on `main`
```

Nothing outside `packages/` renders UI, and nothing inside it talks to Solana:
the surfaces read Supabase over REST, and the chain work happens in `programs/`
and `lib/`.

`packages/*` are Bun workspaces. Every surface links `brand/` through its
`symbols.json` (`"fractyco/uikit": {}` on the platform, `../brand` locally).
Put a reusable component in `brand/`; a surface keeps only its pages and the
sections those pages compose.

## Prerequisites

- **Bun** ≥ 1.2 — package manager and script runner for the whole repo
- **Solana CLI** (latest stable) and **Anchor** — to build or redeploy programs
- **Phantom Wallet** with Devnet enabled
- **Supabase** project — schema in `supabase/migrations/`

## Install and run

```sh
bun install               # one lockfile, all four workspaces
bun start                 # all three dev servers, prefixed output
bun run start:dashboard   # or one surface at a time
bun run build             # production build per surface
bun run publish:all       # push + publish every surface, then the brand library
bun run docs:push         # regenerate the Note copies of docs/ and sync them
```

## Smart contracts — 4 programs

All programs run on **Solana Devnet** and build with Anchor.

| Program | Folder | Devnet ID | Purpose |
| --- | --- | --- | --- |
| `project_registry` | `programs/project_registry/` | `DZBcioGMWiriWXejSRYo3kjVJtS9VLe5RvwdUhr5HxJN` | Creates projects, mints SPL tokens, stores on-chain project state |
| `compliance_transfer` | `programs/compliance_transfer/` | `BYg6sLi3UHLPB8de7J6Z3wAM5PcdV9T5HxtqBfuD85V9` | KYC whitelist, token freeze/unfreeze, transfer gating, sell-order management |
| `allocation_distribution` | `programs/allocation_distribution/` | `EZXJQXX2vYoDrUP6JUcqeShhqKpSRuDecLK9JUiVzkTz` | Dividend epoch creation, pro-rata USDC payouts to token holders |
| `secondary_market` | `programs/secondary_market/` | `8sQeYFf2kDEM33n3ZjnwEsMqwriR6eFNhjtAg7J5Lo6c` | Peer-to-peer sell orders, order filling, order cancellation |

Redeploying under a new wallet touches more than the IDs above — follow
[docs/DEPLOYMENT_GUIDE.md](./docs/DEPLOYMENT_GUIDE.md), which lists every file
to update.

## Backend setup

```sh
cp .env.example .env      # Supabase keys, wallet private key, program IDs
```

Run the migrations in order in the Supabase SQL editor:

```
supabase/migrations/001_… → 022_… → sync_redeploy.sql
```

After any program redeployment, sync the IDLs into the service layer:

```sh
bun run sync-idl          # programs/*/src/idl.json → lib/web3/idl/
```

The background indexer (`bun run indexer`) reconciles on-chain events into the
database. The full operational walkthrough — migrations, environment,
contract deployment, indexer — is in the deployment guide.

## Scripts

```sh
# Surfaces (Symbols)
bun start                      # every dev server
bun run start:landing          # landing only     → http://fractyco.localhost:1355
bun run start:dashboard        # investor app     → http://fractyco-app.localhost:1355
bun run start:governance       # governance       → http://fractyco-gov.localhost:1355
bun run start:brand            # brand reference  → http://fractyco-brand.localhost:1355
bun run build                  # production build per surface
bun run publish:all            # publish surfaces + brand library

# Chain / IDL
bun run sync-idl               # copy all 4 program IDLs → lib/web3/idl/
bun run patch-idl:registry     # patch project_registry IDL
bun run patch-idl:compliance   # patch compliance_transfer IDL
bun run patch-idl:distribution # patch allocation_distribution IDL

# Operations
bun run verify-user <email> <wallet>   # approve investor KYC on-chain + DB
bun run indexer                        # background on-chain → DB indexer

# Integration tests
bun run test:eligibility       # KYC / compliance suite
bun run test:subscription      # investment flow suite
bun run test:tokenization      # token minting suite
bun run test:secondary-market  # secondary market suite
bun run test:full-flow         # end-to-end simulation
```

> `scripts/*.ts` (`patch-idl`, `manual-verify`, `indexer_watcher`) stay
> untracked — `.gitignore` excludes them because they carry operator keys.
> Copy them in from your own deployment checkout before running those
> commands.

## Route map

The Symbols surfaces replace the old React routes one-to-one.

| Old (`main`) | Now | Surface |
| --- | --- | --- |
| `/`, `/projects`, `/about`, `/support` | `/`, `/how`, `/offerings`, `/compliance`, `/platform`, `/company`, `/faq` | landing |
| `/login`, `/signup` | `/signin` | dashboard |
| `/dashboard`, `/dashboard/portfolio` | `/`, `/portfolio` | dashboard |
| `/dashboard/investments` | `/transactions` | dashboard |
| `/dashboard/distributions` | `/payouts` | dashboard |
| `/dashboard/marketplace`, `/secondary-market` | `/marketplace`, `/offerings` | dashboard |
| `/dashboard/wallet`, `/kyc`, `/account` | `/wallet`, `/identity`, `/settings` | dashboard |
| `/admin/*` | `/`, `/projects`, `/compliance`, `/distributions`, `/audit`, `/reconciliation`, `/authority` | governance |

The HTTP layer that fronted these (`app/api/*` on `main`) is a Vercel construct
and stayed there — it is still live at `www.aurc.app`.
[docs/TODO_BACKEND.md](./docs/TODO_BACKEND.md) audits which of those 38 routes
the live site actually uses, which tables each one touches, and which service
on `next` already implements it.

## Branches

| Branch | Contents |
| --- | --- |
| `main` | The original source. Reference only. |
| `next` | The Symbols rebuild. Keeps the full on-chain/backend machinery from `main` — `programs/`, `lib/` (minus React hooks/wagmi), `tests/`, `supabase/`, `docs/`, Anchor + Cargo manifests. Only the React/Vercel UI layer was replaced. |

## Platform

The surfaces are Symbols projects under the `fractyco` org on production
(`api.symbols.app`): keys `landing`, `app`, `governance`, plus the `uikit`
library (`packages/brand/`). `smbls publish` inside any package pushes and
deploys it to development, staging, and production.
