# 🚀 FRACTYCO Deployment Guide

This guide is a **complete, step-by-step reference** for deploying the entire FRACTYCO ecosystem under a **new wallet / new Program IDs**. It covers the four Solana programs, every single file that must be updated with new addresses, IDL synchronisation, database migrations, environment variables, publishing the three Symbols surfaces, and the full operational walkthrough for both operators and investors.

> [!IMPORTANT]
> **Read this first — the front end moved.** The React/Next.js UI this guide
> was originally written for now lives on the `main` branch only. On `next`
> the front end is three **Symbols** projects under `packages/`
> (`landing`, `dashboard`, `governance`), the package manager is **Bun**, and
> the Next.js API routes (`app/api/*`) have **not** been ported yet — see
> [TODO_BACKEND.md](./TODO_BACKEND.md). Phases 1–7 (chain, IDLs, database,
> CLI) are unchanged and authoritative. Phases 8–10 describe UI flows and API
> endpoints that exist on `main`; each is annotated with its status on `next`.

---

## 📋 Prerequisites

1. **Solana Wallet (Phantom)**
   - Install [Phantom](https://phantom.app/).
   - Open Phantom → Settings → Developer Settings → enable **"Testnet Mode"**.
   - Switch the network to **Solana Devnet**.

2. **Solana Playground** — [beta.solpg.io](https://beta.solpg.io/)
   - Click the "Disconnected" badge in the bottom-left → select **"Phantom"** (do **not** use the burner wallet). Your Phantom wallet will become the permanent **upgrade authority** and **super-admin** for all four programs.

3. **Test SOL**
   - Visit [faucet.solana.com](https://faucet.solana.com/).
   - Connect GitHub for up to **10 SOL per 8 hours** (you need at least 5–8 SOL for four deployments + transactions).

4. **Supabase Account** — [supabase.com](https://supabase.com/). Create a new project.

5. **Bun ≥ 1.2** — the package manager and script runner for the whole repo
   ([bun.sh](https://bun.sh/)). Install with
   `curl -fsSL https://bun.sh/install | bash`. A Node.js ≥ 18 runtime is still
   required by the Anchor and Solana tooling Bun shells out to.

6. **Solana CLI** (required to create/manage SPL token mints and send funds)
   - **Linux / macOS**:
     ```bash
     sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
     ```
   - **Windows (PowerShell)**:
     ```powershell
     cmd /c "curl https://release.solana.com/v1.18.15/solana-install-init-x86_64-pc-windows-msvc.exe --output C:\solana-install-init.exe --remote-name"
     C:\solana-install-init.exe v1.18.15
     ```

---

## 🛠️ Phase 1: Deploy All Four Solana Programs

FRACTYCO has exactly **four Anchor programs**. Each must be deployed separately in Solana Playground. You will receive a unique **Program ID** for every deployment; keep them in a text editor as you go.

| # | Program Name | Folder in codebase |
|---|---|---|
| 1 | `project_registry` | `programs/project_registry/src/` |
| 2 | `compliance_transfer` | `programs/compliance_transfer/src/` |
| 3 | `allocation_distribution` | `programs/allocation_distribution/src/` |
| 4 | `secondary_market` | `programs/secondary_market/src/` |

> [!IMPORTANT]
> The Phantom wallet you are connected to in Solana Playground becomes the **upgrade authority** for all programs and the **Super Admin** for the smart contracts. Back up this wallet's private key immediately.

### Steps — Repeat for Each of the 4 Programs

#### Step 1 — Load source files into Playground

1. Open [Solana Playground](https://beta.solpg.io/) → create a new **Anchor** project.
2. Copy the entire contents of `programs/<program_name>/src/lib.rs` into the Playground's `lib.rs`.
3. For programs that have additional files (`state/`, `*_logic/`, `errors.rs`), use the Playground's file-manager panel (left sidebar) to create matching folders and paste each file's contents.
   - `project_registry` needs: `lib.rs`, `state/` files, `registry_logic/` files
   - `compliance_transfer` needs: `lib.rs`, `state/` files, `compliance_logic/` files
   - `allocation_distribution` needs: `lib.rs`, `errors.rs`, `logic/` files, `state/` files
   - `secondary_market` needs: `lib.rs`, `errors.rs`, `state.rs`, `market_logic/` files

#### Step 2 — Build and note the Program ID

1. Click the **Build** button (hammer icon) in the left sidebar.
2. Open the **Deploy** tab. Solana Playground generates a keypair for this program and shows its **Program ID**.
3. **Copy and save this Program ID.**

#### Step 3 — Synchronise `declare_id!` and re-deploy

1. In `lib.rs`, find the line at the very top:
   ```rust
   declare_id!("...");
   ```
2. Replace the old placeholder with your **new Program ID**.
3. Click **Build** again (to embed the correct ID into the binary).
4. Click **Deploy**. Confirm the Phantom transaction.

#### Step 4 — Export the IDL

After each successful deployment, in the Deploy tab click **"Export IDL (JSON)"**. Save each file locally:

| Program | Save the IDL as |
|---|---|
| `project_registry` | `programs/project_registry/src/idl.json` |
| `compliance_transfer` | `programs/compliance_transfer/src/idl.json` |
| `allocation_distribution` | `programs/allocation_distribution/src/idl.json` |
| `secondary_market` | `programs/secondary_market/src/idl.json` |

---

## 🔄 Phase 2: Update All Program IDs in the Codebase

After deploying all four programs you will have four new Program IDs. You must update **every file listed below** before the frontend will work.

### 2.1 — `Anchor.toml`  
**Path**: `Anchor.toml` (project root)

```toml
[programs.devnet]
project_registry          = "YOUR_NEW_PROJECT_REGISTRY_ID"
compliance_transfer       = "YOUR_NEW_COMPLIANCE_TRANSFER_ID"
allocation_distribution   = "YOUR_NEW_ALLOCATION_DISTRIBUTION_ID"
secondary_market          = "YOUR_NEW_SECONDARY_MARKET_ID"
```

### 2.2 — Rust source files (`declare_id!` macros)

You already updated these in Step 3 above during deployment. Verify they match:

| File | Line to update |
|---|---|
| `programs/project_registry/src/lib.rs` | `declare_id!("YOUR_NEW_PROJECT_REGISTRY_ID");` |
| `programs/compliance_transfer/src/lib.rs` | `declare_id!("YOUR_NEW_COMPLIANCE_TRANSFER_ID");` |
| `programs/allocation_distribution/src/lib.rs` | `declare_id!("YOUR_NEW_ALLOCATION_DISTRIBUTION_ID");` |
| `programs/secondary_market/src/lib.rs` | `declare_id!("YOUR_NEW_SECONDARY_MARKET_ID");` |

### 2.3 — TypeScript programs config  
**Path**: `lib/web3/config/programs.ts`

This file is read by the **service layer, the CLI scripts and the integration
tests** (`lib/`, `scripts/`, `tests/`). The `NEXT_PUBLIC_` prefix is a leftover
from the Next.js build — keep the names as they are, because `lib/` reads them
verbatim. The Symbols surfaces do **not** read these variables: they talk to
Supabase REST directly from `packages/brand/functions/backend.js`. Update the
fallback strings:

```typescript
export const PROJECT_REGISTRY_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROJECT_REGISTRY_PROGRAM_ID ||
  'YOUR_NEW_PROJECT_REGISTRY_ID'   // ← update this
);

export const COMPLIANCE_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_COMPLIANCE_PROGRAM_ID ||
  'YOUR_NEW_COMPLIANCE_TRANSFER_ID'   // ← update this
);

export const ALLOCATION_DISTRIBUTION_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_ALLOCATION_DISTRIBUTION_PROGRAM_ID ||
  'YOUR_NEW_ALLOCATION_DISTRIBUTION_ID'   // ← update this
);

export const SECONDARY_MARKET_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_SECONDARY_MARKET_PROGRAM_ID ||
  'YOUR_NEW_SECONDARY_MARKET_ID'   // ← update this
);
```

> [!NOTE]
> `METAPLEX_METADATA_PROGRAM_ID` (`metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`) is a fixed, public constant — **do not change it**.

---

## 📄 Phase 3: Synchronise IDL Files

The Anchor clients read compiled JSON IDL files from `lib/web3/idl/`. After replacing the four `programs/*/src/idl.json` files with the freshly exported ones, run:

```bash
bun run sync-idl
```

This command (defined in the root `package.json`) copies all four IDLs into the service layer in one step:

```
programs/project_registry/src/idl.json         → lib/web3/idl/project_registry.json
programs/compliance_transfer/src/idl.json       → lib/web3/idl/compliance_transfer.json
programs/allocation_distribution/src/idl.json   → lib/web3/idl/allocation_distribution.json
programs/secondary_market/src/idl.json          → lib/web3/idl/secondary_market.json
```

Verify the four destination files now exist and are non-empty:

```
lib/web3/idl/
├── project_registry.json
├── compliance_transfer.json
├── allocation_distribution.json
└── secondary_market.json
```

---

## ⚙️ Phase 4: Environment Variables

Create a `.env` file in the **repo root** (copy `.env.example` as a starting point). It configures `lib/`, `scripts/` and `tests/`:

```env
# =============================================
# ADMIN / PRIVATE KEY
# =============================================
# Base58-encoded private key of your deployer Phantom wallet.
# This wallet is the Super Admin for all smart contracts.
WALLET_PRIVATE_KEY=your_base58_private_key_here

# =============================================
# SUPABASE
# =============================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # Required for CLI scripts

# =============================================
# SOLANA NETWORK
# =============================================
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_BLOCKCHAIN_NETWORK=solana-devnet
NEXT_PUBLIC_SOLANA_CLUSTER=devnet

# =============================================
# PROGRAM IDs  ← paste your 4 new IDs here
# =============================================
NEXT_PUBLIC_PROJECT_REGISTRY_PROGRAM_ID=YOUR_NEW_PROJECT_REGISTRY_ID
NEXT_PUBLIC_COMPLIANCE_PROGRAM_ID=YOUR_NEW_COMPLIANCE_TRANSFER_ID
NEXT_PUBLIC_ALLOCATION_DISTRIBUTION_PROGRAM_ID=YOUR_NEW_ALLOCATION_DISTRIBUTION_ID
NEXT_PUBLIC_SECONDARY_MARKET_PROGRAM_ID=YOUR_NEW_SECONDARY_MARKET_ID

# =============================================
# STABLECOIN MINT (Mock USDC on Devnet)
# =============================================
NEXT_PUBLIC_USDC_MINT=AJujcxZiQ1jUvSixiFLQNWFCpUtMuVsbyPCQ8ByU3jvf

# =============================================
# ADMIN WALLET  (your Phantom public key)
# =============================================
NEXT_PUBLIC_ADMIN_WALLET=YOUR_PHANTOM_PUBLIC_KEY
NEXT_PUBLIC_TREASURY_WALLET=YOUR_PHANTOM_PUBLIC_KEY

# =============================================
# OPTIONAL / KYC
# =============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
SUMSUB_APP_TOKEN=your_sumsub_token
SUMSUB_SECRET_KEY=your_sumsub_secret
NEXT_PUBLIC_SUMSUB_LEVEL_NAME=basic-kyc-level

# =============================================
# SYMBOLS SURFACES (dev + demo account)
# =============================================
# The surfaces read Supabase over REST with the browser-safe publishable key.
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
FRACTYCO_DEMO_EMAIL=demo@fractyco.app
FRACTYCO_DEMO_PASSWORD=...
```

> [!NOTE]
> The surface code does not read `.env` at runtime — Symbols projects ship as
> static bundles, so the Supabase URL and the **publishable** key are inlined
> in `packages/brand/functions/backend.js`. That key is browser-safe by
> design; RLS decides what a session may read. Change the project and you must
> edit that file, not an environment variable. Never inline the service-role
> key there.

### Handling Mock USDC

- **Option A (Default)**: Use the pre-minted devnet USDC: `AJujcxZiQ1jUvSixiFLQNWFCpUtMuVsbyPCQ8ByU3jvf`
  > [!TIP]
  > Share your Phantom public key with the FRACTYCO team — we will airdrop test SOL and Mock USDC directly to your wallet so testing can begin immediately.

- **Option B (Custom mint)**: Create your own Mock USDC using the Solana CLI:
  ```bash
  solana config set --url https://api.devnet.solana.com
  spl-token create-token --decimals 6          # note the Mint Address
  spl-token create-account <MINT_ADDRESS>
  spl-token mint <MINT_ADDRESS> 10000000       # 10 million tokens
  ```
  Set `NEXT_PUBLIC_USDC_MINT=<MINT_ADDRESS>` in `.env`.

---

## 🗄️ Phase 5: Supabase Database Setup

### Step 1 — Run Migrations in Order

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**.
2. Open each migration file in `supabase/migrations/` in **ascending numeric order** and run them one by one by pasting the SQL and clicking **"Run"**.

Run them in this exact order:

| File | Purpose |
|---|---|
| `001_add_crypto_wallet_fields.sql` | Adds wallet columns to `profiles` |
| `002_create_wallet_links.sql` | Creates `wallet_links` table |
| `003_create_kyc_compliance.sql` | Creates `kyc_profiles` and compliance tables |
| `004_create_offerings.sql` | Creates `projects` and `subscriptions` tables |
| `005_create_portfolio_positions.sql` | Creates `portfolio_positions` |
| `006_create_payout_tables.sql` | Creates distribution / payout epoch tables |
| `007_create_audit_admin_tables.sql` | Creates audit logs and `user_roles` |
| `008_add_blockchain_to_projects.sql` | Adds `blockchain_project_id` to `projects` |
| `009_add_mint_fields_to_projects.sql` | Adds `mint_address`, `token_decimals` |
| `010_update_wallet_address_constraint.sql` | Unique constraint on wallet addresses |
| `011_add_project_metadata_columns.sql` | Adds `images`, `documents` columns |
| `011_align_wallet_links_with_onchain.sql` | Aligns wallet table schema with on-chain |
| `012_normalize_investment_status.sql` | Investment status normalization |
| `013_update_payout_tables_onchain.sql` | Payout table on-chain fields |
| `014_fix_investment_trigger_status.sql` | Bug fix on investment status trigger |
| `015_fix_subscription_decimal_types.sql` | Fix decimal precision issues |
| `016_create_secondary_market_tables.sql` | Creates `secondary_listings`, `secondary_trades` |
| `017_fix_portfolio_trigger.sql` | Portfolio position trigger fix |
| `018_add_secondary_market_safety_columns.sql` | Adds `remaining`, `sequence` columns |
| `019_update_secondary_listings_status_constraint.sql` | Status enum constraint |
| `020_fix_secondary_market_bugs.sql` | Secondary market trigger fix |
| `20260610025452_021_fix_primary_portfolio_trigger.sql` | Portfolio trigger update |
| `20260611030000_022_update_secondary_portfolio_trigger.sql` | Secondary portfolio trigger |
| `sync_redeploy.sql` | **Run this last** — resets on-chain sync state for fresh deployment |

### Step 2 — Assign Super Admin

After the first user registers (Phase 8), grant them the super admin role:

```sql
-- Find the user's ID
SELECT id, email FROM auth.users;

-- Grant the super_admin role
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_USER_UUID', 'super_admin');
```

---

## 📦 Phase 6: Install Dependencies and Start the Surfaces

One install at the repo root covers every workspace — the chain/backend
dependencies and all four Symbols packages share a single `bun.lock`:

```bash
bun install
bun start
```

`bun start` runs the three dev servers together with prefixed output:

| Surface | Package | URL |
|---|---|---|
| Marketing site | `packages/landing` | http://localhost:5040 |
| Investor dashboard | `packages/dashboard` | http://localhost:5041 |
| Governance console | `packages/governance` | http://localhost:5042 |

Start one at a time with `bun run start:landing`, `bun run start:dashboard`,
or `bun run start:governance`.

> [!NOTE]
> On `main` this phase was `npm install && npm run dev`, serving the Next.js
> app on `http://localhost:3000`. That app is no longer part of `next`.

---

## 🔭 Phase 6.5: Start the Background Indexer (Required)

The **indexer watcher** is a long-running background process that listens to Solana program events in real time and keeps the Supabase database in sync with the blockchain. Without it, on-chain state changes (token transfers, order fills, distribution payouts) will **not be automatically reflected** in the database.

**Why it is required:**

| Reason | Detail |
|---|---|
| **Real-time sync** | Detects on-chain events (investments finalised, tokens transferred, sell orders filled) and writes them to Supabase immediately. |
| **Audit log integrity** | Populates `audit_logs` with on-chain events that the frontend cannot self-report (e.g., direct wallet transfers). |
| **Portfolio accuracy** | Keeps `portfolio_positions` up to date when tokens change hands on the secondary market. |
| **Distribution reliability** | Ensures holder snapshots are accurate before a payout epoch is created. |
| **Reconciliation baseline** | Provides the on-chain data that the governance Reconciliation page compares against. |

**Open a new terminal** (keep `bun start` running in another window) and run:

```bash
bun run indexer          # → bunx tsx scripts/indexer_watcher.ts
```

> [!WARNING]
> `scripts/*.ts` is excluded by `.gitignore` (line 59), so
> `indexer_watcher.ts` is **not in this repository**. Copy it in from your
> deployment checkout before running the command.

> [!IMPORTANT]
> This process must stay running for as long as the platform is active. In production, run it as a managed background service (e.g., `pm2`, a systemd service, or a dedicated worker dyno on your hosting provider).

> [!TIP]
> `tsx` is installed as a dev dependency, so `bunx tsx scripts/<script>.ts`
> works for any script in that folder.

---

## 👤 Phase 7: User Management & KYC (CLI-Based)

All user creation and KYC verification is done via the Supabase Dashboard and CLI scripts.

### Step 1 — Create a User

1. **Supabase Dashboard** → **Authentication** → **Users** → **"Add user"** → **"Create new user"**.
2. Enter an email and a password.

### Step 2 — Verify an Investor (On-Chain + Database KYC)

Any investor who wants to invest or trade must be approved:

1. Ask the investor for their **Solana Devnet wallet address**.
2. Run:
   ```bash
   bun run verify-user <user_email> <solana_wallet_address>
   ```
   This script:
   - Links the wallet address to the user's profile in Supabase.
   - Sets `kyc_profiles.status = 'approved'`.
   - Calls the `compliance_transfer` smart contract to register the wallet as KYC-eligible on-chain.

3. **Fund the investor wallet**:
   - At least **1 SOL** for gas fees.
   - At least **50,000 Mock USDC** for investment testing.
   ```bash
   spl-token transfer <USDC_MINT> 50000 <INVESTOR_WALLET> --fund-recipient
   ```

### Step 3 — Promote a User to Super Admin

```sql
-- In Supabase SQL Editor
SELECT id, email FROM profiles WHERE email = 'admin@example.com';
INSERT INTO public.user_roles (user_id, role) VALUES ('YOUR_USER_ID', 'super_admin');
```

---

## 🚀 Phase 8: Platform Walkthrough & Lifecycle

> [!IMPORTANT]
> **Status on `next`.** The pages below are the React app on `main`, still
> deployed at `www.aurc.app`. The Symbols rebuild reproduces the same
> information architecture across two surfaces — the old `/admin/*` pages are
> the **governance** surface, the old `/dashboard/*` pages are the
> **dashboard** surface — but only sign-in, the dashboard Offerings list and
> the governance Projects registry read the backend today. Every other screen
> shows placeholder content, and no surface writes. Treat this walkthrough as
> the behaviour to restore, and see [TODO_BACKEND.md](./TODO_BACKEND.md) for
> the endpoint-by-endpoint plan.
>
> Route equivalents:
>
> | This guide (`main`) | Symbols surface (`next`) |
> |---|---|
> | `/admin` | governance `/` |
> | `/admin/projects` | governance `/projects` |
> | `/admin/compliance` | governance `/compliance` |
> | `/admin/investments` | governance `/subscriptions` |
> | `/admin/distributions` | governance `/distributions` |
> | `/admin/audit-logs` | governance `/audit` |
> | `/admin/reconciliation` | governance `/reconciliation` |
> | `/admin/authority` | governance `/authorities` |
> | `/login`, `/signup` | dashboard `/signin` |
> | `/dashboard` | dashboard `/` |
> | `/dashboard/portfolio` | dashboard `/portfolio` |
> | `/dashboard/investments` | dashboard `/transactions` |
> | `/dashboard/distributions` | dashboard `/payouts` |
> | `/dashboard/marketplace`, `/secondary-market` | dashboard `/marketplace`, `/offerings` |
> | `/dashboard/wallet` | dashboard `/wallet` |
> | `/kyc` | dashboard `/identity` |
> | `/account` | dashboard `/settings` |
> | `/`, `/projects`, `/about`, `/support` | landing `/` and its sections |

### 🛡️ Admin Workflow

#### A. Dashboard Overview
- **Page**: `http://localhost:3000/admin`
- Summary of projects, pending KYC, investment totals.

#### B. Project Creation
- **Page**: `http://localhost:3000/admin/projects`
- Click **"Create New Project"**.
- When the admin submits the form, the backend atomically:
  1. Creates a new **SPL Token Mint** on Solana.
  2. Registers **Metaplex metadata** (name, symbol, logo).
  3. Calls the `project_registry` program to register the project on-chain.
  4. **Revokes Mint Authority** — transfers it to the smart contract PDA (Zero-Trust minting).
- The project is saved to `projects` in Supabase with `status = 'draft'`.

#### C. Project Lifecycle Management
- **Page**: `http://localhost:3000/admin/projects`
- Edit any project to transition its status:

  | Status | Meaning |
  |---|---|
  | `draft` | Initial setup, not visible to investors |
  | `funding` | Open for investor subscriptions |
  | `active` | Funding goal met; tokens minted; lock-up starts |
  | `completed` | Project finished; final distributions made |

#### D. Investor KYC Compliance
- **Page**: `http://localhost:3000/admin/compliance`
- Review pending KYC applications.
- Approve or Reject investors. Approved status is synced on-chain via the `compliance_transfer` program.

#### E. Investment Management
- **Page**: `http://localhost:3000/admin/investments`
- View all subscriptions across all projects.
- **Finalize Investments**: moves investments from `pending`/`settled` → `allocated`, triggers token minting and delivery to investor wallets.
  - API: `POST /api/admin/investments/finalize`

#### F. Payout / Distribution Execution
- **Page**: `http://localhost:3000/admin/distributions`
- Create a new **Epoch** for a project and execute dividend distributions.
- The system reads all current on-chain token holders and calculates USDC payouts proportionally.
- **Sync-Batch API**: `POST /api/admin/distributions/sync-batch` — scans blockchain holders and prepares the epoch.
- **Investors API**: `GET /api/admin/distributions/investors` — returns holder list for review.

#### G. Audit Logs
- **Page**: `http://localhost:3000/admin/audit-logs`
- Full tamper-evident log of all on-chain and database actions.
- **Sync on-chain**: `POST /api/admin/audit-logs/sync-onchain`

#### H. Reconciliation
- **Page**: `http://localhost:3000/admin/reconciliation`
- Cross-checks on-chain token balances against Supabase `portfolio_positions`.
- API: `POST /api/admin/reconciliation`

#### I. Authority Management
- **Page**: `http://localhost:3000/admin/authority`
- Manage upgrade and program authorities.

---

### 💰 Investor Workflow

#### A. Sign Up & KYC
- **Page**: `http://localhost:3000/signup`
- After registering, the investor completes the KYC flow.
- **Page**: `http://localhost:3000/kyc`
- Investors cannot invest until their KYC is approved by an admin.

#### B. Onboarding
- **Page**: `http://localhost:3000/onboarding`
- Guided setup after first login.

#### C. Connect Wallet
- Investor connects their **Phantom** wallet on any protected page.
- The wallet is linked to their Supabase profile via `POST /api/wallet/connect`.

#### D. Browse & Invest in Projects
- **Page**: `http://localhost:3000/projects`
- Browse projects in `funding` status.
- Click into a project to see details: `http://localhost:3000/projects/<slug>`
- Click **"Invest"** → enter USDC amount → approve Phantom transaction.
- Investment flow:
  1. `POST /api/investments/create` — creates subscription record (`pending`).
  2. On-chain USDC transfer executes.
  3. `POST /api/investments/<id>/complete` — marks as `settled`.
  4. Admin finalizes → tokens are minted and delivered → status becomes `allocated`.

#### E. Portfolio & Dashboard
- **Page**: `http://localhost:3000/dashboard`
- View total investment value, token balances, and received dividends.
- **Portfolio details**: `http://localhost:3000/dashboard/portfolio`
- **Investment history**: `http://localhost:3000/dashboard/investments`
- **Distribution history**: `http://localhost:3000/dashboard/distributions`
- **Transaction history**: `http://localhost:3000/dashboard/transactions`

#### F. Direct-to-Wallet Token Delivery
- Tokens are minted directly into the investor's **Phantom wallet** (no custodian).
- Tokens are **Frozen** on-chain until `lockup_end_date` passes.

#### G. Claim Payouts
- **Page**: `http://localhost:3000/dashboard/distributions`
- When a distribution epoch is ready, investors see a "Claim" button.
- API: `POST /api/payouts/claim/<id>`

---

## 🔄 Phase 9: Secondary Market (Peer-to-Peer Trading)

> [!NOTE]
> On `next` the dashboard Marketplace page renders the same layout with
> placeholder rows; the order flows below run only on `main`. The
> `secondary_market` program and `lib/web3/services/secondaryMarketService.ts`
> are both present on `next` — only the HTTP layer is missing.

### Prerequisites

Before any secondary market activity, ensure:

1. ✅ **Lock-up period expired** — `lockup_end_date` must be in the past. The `compliance_transfer` smart contract enforces this; tokens are frozen until then.
2. ✅ **Both buyer and seller KYC approved** — `kyc_profiles.status = 'approved'` and wallet registered on-chain.
3. ✅ **Seller has SOL** — approximately 0.01–0.05 SOL for listing transaction fees.

---

### 🏷️ Seller Workflow

#### A. Access the Marketplace
- **Page (authenticated)**: `http://localhost:3000/dashboard/marketplace`
- Wallet must be connected.

#### B. List Tokens for Sale

1. Click **"List Token"** (top-right button).
2. The platform queries `portfolio_positions` to find **eligible positions**:
   - Project must be `active`.
   - `lockup_end_date` must be in the past.
   - `total_tokens > 0`.
3. Select a position → the **List Token Modal** opens.
4. Enter:
   - **Amount** to sell (≤ on-chain balance).
   - **Price per Token** in USDC.
5. Click **"List for Sale"**.
6. The frontend calls `POST /api/secondary-market/orders/create` which builds an unsigned `list_sell_order` transaction.
7. **Sign and approve** the Phantom transaction. This creates a **Sell Order PDA** on-chain via the `secondary_market` program.
8. The frontend calls `POST /api/secondary-market/orders/confirm` with the confirmed transaction signature → the listing is recorded in `secondary_listings` (status: `active`).

> [!NOTE]
> Each sell order gets a `sequence` number derived from the seller's on-chain `UserState` account. This is used to derive the Sell Order PDA address.

#### C. Cancel a Listing

1. On the marketplace page, find your listing — it shows **"You"** and a **"Cancel"** button.
2. Click **"Cancel"** → approve Phantom.
3. Frontend calls `POST /api/secondary-market/orders/cancel` → builds `cancel_sell_order` transaction.
4. On successful confirmation, `POST /api/secondary-market/orders/cancel/confirm` updates the DB record to `status: 'cancelled'`.

---

### 🛒 Buyer Workflow

#### A. Browse the Orderbook

| Page | Auth Required | Notes |
|---|---|---|
| `http://localhost:3000/secondary-market` | No | Public-facing marketplace |
| `http://localhost:3000/dashboard/marketplace` | Yes | Full dashboard with sell + buy |

The orderbook is **aggregated by project + price level** — multiple sellers at the same price are pooled. Each card shows:
- Project name, location, token symbol.
- Price per Token (USDC).
- Total Available tokens at that price.
- Scrollable list of individual sellers and their amounts.

Data is served by `GET /api/secondary-market/orderbook` (rate-limited to 60 req/min per IP).

#### B. Purchase Tokens

1. Click **"Buy Tokens"** on a listing card.
   - Unauthenticated users on the public page are redirected to `/login?redirectTo=/secondary-market`.
2. In the **Buy Listing Modal**, enter the number of tokens to buy.
3. Frontend calls `POST /api/secondary-market/buy`:
   - Verifies buyer KYC.
   - Matches against `secondary_listings` ordered by price ascending, then `created_at` ascending (**price-time priority / FIFO**).
   - Handles **partial fills** and **multi-seller fills** in a single atomic transaction.
   - Builds and returns a serialized, unsigned Solana `Transaction` with:
     - One `ComputeBudgetProgram.setComputeUnitPrice` (priority fee) instruction.
     - One `fill_order` instruction per matched seller chunk.
     - `createAssociatedTokenAccount` instructions for any ATAs that don't yet exist.
4. Buyer **signs and sends** the transaction via Phantom.
5. Each `fill_order` instruction on-chain:
   - Transfers USDC from buyer to each seller (fillAmount × pricePerToken).
   - Transfers project tokens from the Sell Order PDA escrow to the buyer's ATA.
   - Enforces compliance for the buyer's wallet via the `compliance_transfer` program.
6. Frontend calls `POST /api/secondary-market/buy/confirm` with the signature → DB updated:
   - `secondary_listings.remaining` decremented per matched chunk.
   - Listing `status` set to `filled` when `remaining = 0`.
   - Buyer's `portfolio_positions` record upserted.

> [!IMPORTANT]
> The `fill_order` instruction enforces the buyer's on-chain compliance check. If the buyer wallet is not KYC-verified on-chain, the Solana transaction will fail with an `AccountNotFound` or custom program error. Run `manual-verify.ts` for the buyer's wallet before they attempt a purchase.

---

### 🗄️ Secondary Market Database Schema

**Table: `secondary_listings`**

| Column | Type | Description |
|---|---|---|
| `id` | `uuid` | Primary key |
| `project_id` | `uuid` | FK → `projects.id` |
| `investor_id` | `uuid` | FK → `profiles.id` (seller) |
| `token_amount` | `numeric` | Original amount listed |
| `remaining` | `numeric` | Tokens still available |
| `token_listing_price` | `numeric` | Price per token in USDC |
| `sell_order_pda` | `text` | On-chain Sell Order PDA address |
| `sequence` | `integer` | Seller's listing sequence (used for PDA derivation) |
| `status` | `text` | `active` / `filled` / `cancelled` |
| `created_at` | `timestamptz` | Listing timestamp |

**Useful admin SQL:**

```sql
-- All active listings across all projects
SELECT sl.id, p.name AS project, pr.email AS seller,
       sl.remaining, sl.token_listing_price, sl.status
FROM secondary_listings sl
JOIN projects p ON sl.project_id = p.id
JOIN profiles pr ON sl.investor_id = pr.id
WHERE sl.status = 'active'
ORDER BY sl.token_listing_price ASC;

-- Manually cancel a stale listing (run on-chain cancel first)
UPDATE secondary_listings SET status = 'cancelled' WHERE id = 'YOUR_LISTING_UUID';
```

---

## 🔑 Phase 10: Complete API Reference

> [!WARNING]
> **None of these endpoints are served by `next`.** They are Next.js route
> handlers under `app/api/`, which stayed on `main` because they are Vercel
> constructs. The services behind them (`lib/domains/*`, `lib/web3/services/*`)
> **are** on `next` and unchanged. [TODO_BACKEND.md](./TODO_BACKEND.md) maps
> every route to its tables, its service, and whether the legacy client
> actually calls it.

### Public / Investor APIs

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/projects` | No | List all published projects |
| `GET` | `/api/projects/[slug]/details` | No | Project details by slug |
| `POST` | `/api/investments/create` | Yes | Create an investment subscription |
| `POST` | `/api/investments/[id]/complete` | Yes | Mark investment as settled after on-chain payment |
| `GET` | `/api/portfolio/summary` | Yes | Investor's portfolio summary |
| `GET` | `/api/portfolio/assets` | Yes | Individual token positions |
| `GET` | `/api/portfolio/performance` | Yes | Portfolio performance metrics |
| `POST` | `/api/payouts/claim/[id]` | Yes | Claim a dividend payout |
| `GET` | `/api/secondary-market/orderbook` | No | Aggregated orderbook (by project + price) |
| `GET` | `/api/secondary-market/listings` | No | Raw secondary listings (`?projectId=&status=`) |
| `POST` | `/api/secondary-market/orders/create` | Yes (KYC) | Build unsigned `list_sell_order` transaction |
| `POST` | `/api/secondary-market/orders/confirm` | Yes | Record listing after on-chain confirmation |
| `POST` | `/api/secondary-market/orders/cancel` | Yes | Build unsigned `cancel_sell_order` transaction |
| `POST` | `/api/secondary-market/orders/cancel/confirm` | Yes | Mark listing cancelled after on-chain cancel |
| `POST` | `/api/secondary-market/buy` | Yes (KYC) | Match order + build unsigned multi-fill transaction |
| `POST` | `/api/secondary-market/buy/confirm` | Yes | Update DB after confirmed purchase |

### Wallet APIs

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/wallet/connect` | Yes | Link a Solana wallet to user profile |
| `GET` | `/api/wallet/active` | Yes | Get the user's active linked wallet |
| `POST` | `/api/wallet/sync` | Yes | Sync wallet state from chain to DB |
| `POST` | `/api/wallet/verify` | Yes | Verify wallet signature |

### KYC APIs

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/kyc/token` | Yes | Generate a Sumsub SDK token for the KYC widget |
| `POST` | `/api/kyc/complete` | Yes | Called after Sumsub verification completes |
| `POST` | `/api/compliance/webhook` | No (webhook) | Sumsub webhook receiver |

### Auth APIs

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/log-signup` | No | Log signup event |
| `POST` | `/api/auth/log-login` | No | Log login event |
| `POST` | `/api/auth/log-logout` | Yes | Log logout event |

### Indexer APIs

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/indexer/sync-epoch` | Admin | Trigger on-chain holder sync for a distribution epoch |

### Admin APIs (Super Admin only)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/projects` | Admin | List all projects |
| `POST` | `/api/admin/projects` | Admin | Create a project (deploys token mint + metadata on-chain) |
| `GET/PATCH` | `/api/admin/projects/[id]` | Admin | Get or update a specific project |
| `GET` | `/api/admin/investments` | Admin | List all investments |
| `POST` | `/api/admin/investments/finalize` | Admin | Finalize investments → mint and distribute tokens |
| `GET` | `/api/admin/distributions/investors` | Admin | Get holder list for a distribution epoch |
| `POST` | `/api/admin/distributions/sync-batch` | Admin | Sync on-chain balances to prepare a payout epoch |
| `GET` | `/api/admin/audit-logs` | Admin | Retrieve audit log entries |
| `POST` | `/api/admin/audit-logs/sync-onchain` | Admin | Sync on-chain events to audit log |
| `POST` | `/api/admin/reconciliation` | Admin | Reconcile on-chain vs DB token balances |

### Webhook

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/webhooks/solana` | HMAC sig | Receives on-chain event notifications from the Solana indexer |

---

## 🔍 Phase 11: Monitoring & Debugging Scripts

All scripts live in `scripts/` and are run with `bunx tsx scripts/<script>.ts`.

> [!WARNING]
> `.gitignore` excludes `scripts/*.ts` (line 59), so **none of these files are
> in this repository** — they carry operator keys. Copy them in from your
> deployment checkout. The only script tracked here is `scripts/run.mjs`, the
> cross-surface dev/build/publish runner.

| Script | Command | Description |
|---|---|---|
| `check-project.ts` | `bunx tsx scripts/check-project.ts <on_chain_project_id>` | Reads a project's on-chain state (registry PDA, mint, etc.) |
| `verify-wallet.ts` | `bunx tsx scripts/verify-wallet.ts <wallet_address>` | Checks if a wallet is KYC-registered on-chain |
| `check-mint.ts` | `bunx tsx scripts/check-mint.ts <mint_address>` | Checks mint authority, supply, and decimals |
| `check-balances.ts` | `bunx tsx scripts/check-balances.ts` | Checks SOL + token balances for all test wallets |
| `check-onchain-balances.ts` | `bunx tsx scripts/check-onchain-balances.ts` | Checks holder balances directly from Solana |
| `check-epochs.ts` | `bunx tsx scripts/check-epochs.ts` | Lists all distribution epochs and their status |
| `check-subscriptions.ts` | `bunx tsx scripts/check-subscriptions.ts` | Lists all investment subscriptions and their status |
| `manual-verify.ts` | `bun run verify-user <email> <wallet>` | Approves a user's KYC on-chain and in Supabase |
| `recover_payouts.ts` | `bunx tsx scripts/recover_payouts.ts` | Attempts to recover/retry failed payout transactions |
| `recalculate-portfolios.ts` | `bunx tsx scripts/recalculate-portfolios.ts` | Recomputes all `portfolio_positions` from raw investment data |
| `sync-onchain-balances.ts` | `bunx tsx scripts/sync-onchain-balances.ts` | Pulls on-chain token balances into Supabase |
| `sync-all-compliance.ts` | `bunx tsx scripts/sync-all-compliance.ts` | Re-syncs compliance state for all registered wallets |
| `audit-connectivity.ts` | `bunx tsx scripts/audit-connectivity.ts` | Tests RPC, Supabase, and program connectivity |
| `indexer_watcher.ts` | `bunx tsx scripts/indexer_watcher.ts` | Runs the background Solana event indexer (long-running) |

---

## 🌐 Phase 12: Publish the Symbols Surfaces

The three front ends are Symbols projects under the `fractyco` organisation on
production (`api.symbols.app`), sharing one library — `fractyco/uikit`, which
is `packages/brand/`.

**Publish the library first.** The server embeds library content into the
served pages at publish time, so a component change reaches production only
after `brand` is published and the surfaces are republished on top of it:

```bash
bun run publish:all      # brand, then every surface, in order
```

Or one at a time:

```bash
cd packages/brand      && bunx smbls publish --yes --non-interactive
cd packages/dashboard  && bunx smbls publish --yes --non-interactive
```

Each publish deploys to development, staging and production:

| Surface | Production URL |
|---|---|
| `packages/landing` | https://fractyco--landing.at.symbo.ls |
| `packages/dashboard` | https://fractyco--app.at.symbo.ls |
| `packages/governance` | https://fractyco--governance.at.symbo.ls |

Custom domains (`aurc.app`, `app.aurc.app`, `gov.aurc.app`) are not pointed at
the platform yet — `aurc.app` still serves the legacy Vercel deployment.

> [!WARNING]
> Verify the CLI channel before publishing: `bunx smbls channels` must report
> `https://api.symbols.app`. A dev-pinned `.symbols_local/config.json` pushes
> to a different server and the work silently never appears in production.

Full toolchain reference: [SMBLS.md](./SMBLS.md).

---

## ✅ Deployment Checklist

Use this checklist to verify a clean deployment:

- [ ] All 4 programs deployed in Solana Playground with new Program IDs
- [ ] `declare_id!` updated in all 4 `programs/*/src/lib.rs` files
- [ ] `Anchor.toml` updated with all 4 new Program IDs
- [ ] `lib/web3/config/programs.ts` fallback strings updated
- [ ] All 4 `programs/*/src/idl.json` replaced with newly exported IDLs
- [ ] `bun run sync-idl` executed — all 4 `lib/web3/idl/*.json` files updated
- [ ] `.env` created with all required variables
- [ ] All Supabase migrations run in order (001 → 022 → sync_redeploy.sql)
- [ ] Super Admin user created and role assigned
- [ ] At least one investor created, KYC-verified, and funded
- [ ] `bun install` completes and `bun start` brings up all three surfaces (5040 / 5041 / 5042)
- [ ] `bun run indexer` started in a separate terminal (background indexer running)
- [ ] `bunx smbls channels` reports `https://api.symbols.app`
- [ ] `bun run publish:all` completed — brand published before the surfaces
- [ ] Test project created successfully (confirms program IDs are correct)
- [ ] Test investment made (confirms USDC mint and compliance program work)

---

**Congratulations!** Your FRACTYCO instance is now fully operational.

Next: [TODO_BACKEND.md](./TODO_BACKEND.md) tracks what the live site still
depends on and what the Symbols rebuild has to take over. Other references
live alongside this file in `docs/`.
