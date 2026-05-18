# 🪙 AURUMCHAIN Postman Integration & API Testing Guide

A comprehensive, production-grade Postman collection has been generated and saved directly to the root of your project at [postman.json](file:///c:/Rupom/Projects/AURUMCHAIN/postman.json). 

This guide details the structure of the collection, how to import it, how to manage variables, and how to execute end-to-end tests for both **Investor** and **Admin** personas.

---

## 🚀 1. Getting Started

### Step 1: Import the Collection into Postman
1. Open **Postman**.
2. Click the **Import** button in the top left corner (or use `Ctrl + O`).
3. Select **Files** and upload the generated `postman.json` from the root of your project:
   `c:\Rupom\Projects\AURUMCHAIN\postman.json`
4. Confirm the import. You will see a new collection named **`AURUMCHAIN API`** in your sidebar containing **26 distinct requests** organized into 9 logical folders.

---

## 🎛️ 2. Collection Variables

The collection comes pre-configured with **Collection Variables** to eliminate hardcoding. To view or edit these:
1. Click on the **AURUMCHAIN API** collection name in Postman.
2. Select the **Variables** tab.
3. Configure the following keys:

| Variable Name | Default Value / Placeholder | Description |
| :--- | :--- | :--- |
| `base_url` | `http://localhost:3000` | The Next.js serverless backend local URL. |
| `supabase_jwt_token` | `your-supabase-jwt-token-here` | The active session JWT for authorization. |
| `project_slug` | `golden-gate-realty` | Slug of the project being tested (e.g. in Catalog APIs). |
| `project_id` | `a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6` | Database UUID of the target project. |
| `investment_id` | `f4e3d2c1-b0a9-8f7e-6d5c-4b3a2a1f0e9d` | Database UUID of the target investment. |
| `payout_id` | `payout-uuid-placeholder` | Database UUID of the target payout record. |
| `user_id` | `user-uuid-placeholder` | Database UUID of the investor/user. |
| `wallet_address` | `SolanaWalletAddress1111111111111111111111` | Mock or real Solana wallet address. |
| `wallet_link_id` | `wallet-link-uuid-placeholder` | Database UUID of the wallet link record. |

---

## 📁 3. Collection Structure

The collection is organized to match the modular structure of the backend serverless endpoints:

### Folder 1: `🔐 Auth & Identity`
Handles tracking of authorization events for security auditing and public table profiles initialization.
* **Log Login Event** (`POST /api/auth/log-login`)
* **Log Logout Event** (`POST /api/auth/log-logout`)
* **Log Signup Event** (`POST /api/auth/log-signup`)

### Folder 2: `🛂 Compliance & KYC`
Integrations with Sumsub KYC provider widget and status triggers.
* **Get KYC SDK Token** (`GET /api/kyc/token`)
* **Complete KYC (Client Trigger)** (`POST /api/kyc/complete`)
* **Sumsub Automated Webhook Listener** (`POST /api/compliance/webhook`)

### Folder 3: `💼 Wallet Management`
Handles linking and cryptographically verifying Solana wallets.
* **Link/Connect Wallet** (`POST /api/wallet/connect`)
* **Cryptographically Verify Wallet** (`POST /api/wallet/verify`)
* **Get Active Wallet** (`GET /api/wallet/active`)
* **Sync Wallet / Add Ledger Transaction** (`POST /api/wallet/sync`)

### Folder 4: `🏢 Project Catalog`
Public APIs fetching projects from both Supabase and live Solana smart contracts (using Helius/RPC node batch fetching).
* **Get All Projects** (`GET /api/projects`)
* **Get Project Details** (`GET /api/projects/:slug/details`)

### Folder 5: `💸 Investment Workflow`
Investor token subscriptions.
* **Create Pending Investment Record** (`POST /api/investments/create`) — *Stage 1 Verification*
* **Complete / Settle Investment (Admin Only)** (`POST /api/investments/:id/complete`)

### Folder 6: `📊 Portfolio & Dashboard`
User metrics aggregation, charts, and holdings lists.
* **Get Portfolio Summary Metrics** (`GET /api/portfolio/summary`)
* **Get Allocated Project Assets** (`GET /api/portfolio/assets`)
* **Get Historical Performance Stats** (`GET /api/portfolio/performance`)

### Folder 7: `💰 Distribution & Payouts`
Processes manual dividend/yield claim transactions.
* **Claim Yield Payout** (`POST /api/payouts/claim/:id`)

### Folder 8: `⚙️ Admin & Reporting`
Privileged administrative actions (bypass Postgres RLS via admin clients for strict role separation).
* **Create Investment Project** (`POST /api/admin/projects`)
* **Get Detailed Project (Admin View)** (`GET /api/admin/projects/:id`)
* **Update Project Parameters** (`PUT /api/admin/projects/:id`)
* **Delete Project (Draft Only)** (`DELETE /api/admin/projects/:id`)
* **Finalize On-Chain Settlement** (`POST /api/admin/investments/finalize`) — *Stage 3 Verification*
* **Run Reconciliation Scan** (`GET /api/admin/reconciliation`)
* **Ledger Reconstruction / Repair Tool** (`POST /api/admin/reconciliation`)
* **Delete Discrepant Ledger Entry** (`DELETE /api/admin/reconciliation`)
* **Create Audit Log Entry** (`POST /api/admin/audit-logs`)
* **Sync On-Chain Subscriptions to Audit Logs** (`POST /api/admin/audit-logs/sync-onchain`)

### Folder 9: `🔗 Infrastructure & Webhooks`
Automated watchers, indexer epochs synchronization, and global Solana synchronizations.
* **Sync Payout Epoch** (`POST /api/indexer/sync-epoch`)
* **Solana Node Listener (Global Watcher)** (`POST /api/webhooks/solana`)
* **Repair Corrupted Profile** (`POST /api/profile/repair`)

---

## 🛠️ 4. How to Authenticate Requests

All private routes (investor and admin) securely retrieve active users using Supabase JWT verification.

1. Log into the **AURUMCHAIN Web Application** in your browser.
2. Open Developer Tools (`F12`), go to the **Application** (or **Storage**) tab, select **Local Storage**, and copy the token matching `sb-*-auth-token`.
3. Extract the `access_token` string.
4. Paste it as the value of the `supabase_jwt_token` variable inside the **AURUMCHAIN API** Postman collection variables.
5. All authorized requests will automatically inherit and inject this token via the header:
   `Authorization: Bearer {{supabase_jwt_token}}`

---

## 🔄 5. End-to-End Testing Flows

### 🧑‍💼 Flow A: Investor Purchase E2E
1. **Connect & Verify Wallet**:
   * Trigger `Link/Connect Wallet` with your Solana address.
   * Cryptographically verify with `Cryptographically Verify Wallet` (takes signature).
2. **Review Catalog**:
   * Fetch active projects with `Get All Projects`.
3. **Commit Funds (Stage 1)**:
   * Run `Create Pending Investment Record` to subscribe to tokens.
4. **View Portfolio**:
   * Request `Get Portfolio Summary Metrics` to see your pending allocations increase.

### 👑 Flow B: Admin Settlement E2E
1. **Verify Payment & Allocate (Stage 3)**:
   * Trigger `Complete / Settle Investment` on the user's investment UUID. This initiates the Cross-Program Invocation to mint SPL tokens on Solana.
   * Run `Finalize On-Chain Settlement` to update both database states and activity feeds with the transaction hash.
2. **Reconciliation & Audit**:
   * Call `Run Reconciliation Scan` with the project ID to verify if Supabase totals match the Solana blockchain mint supply cap.
   * If any on-chain discrepancy is found, run the `Ledger Reconstruction / Repair Tool` to patch the discrepancy.
   * Force audit log sync with `Sync On-Chain Subscriptions to Audit Logs` to generate real-time event tables.
