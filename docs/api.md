# FRACTYCO API Documentation final

Below is the complete list of all Next.js Serverless API routes found in the `app/api` directory, grouped by their core modules, along with a description of what each handles.

## 🔐 Auth & Identity APIs (`/api/auth`)

- **`POST /api/auth/log-login`**
  - **Handles:** Logs user login events into the database for security tracking and audit trails.
- **`POST /api/auth/log-logout`**
  - **Handles:** Records user logout events to close active session tracking.
- **`POST /api/auth/log-signup`**
  - **Handles:** Synchronizes newly created Supabase Auth users into the public `users` table, initializing their profile.

## 🛂 Compliance & KYC APIs (`/api/compliance` & `/api/kyc`)

- **`GET /api/kyc/token`**
  - **Handles:** Generates a secure, temporary SDK access token required to initialize the Sumsub KYC verification widget on the frontend.
- **`POST /api/kyc/complete`**
  - **Handles:** Manual or client-side trigger to confirm the user has finished the KYC flow, prompting the system to check status.
- **`POST /api/compliance/webhook`**
  - **Handles:** The secure listener for Sumsub's automated webhooks. Automatically updates a user's KYC/AML status (Approved, Rejected, Pending) in the database in real-time.

## 💼 Wallet Management APIs (`/api/wallet`)

- **`POST /api/wallet/connect`**
  - **Handles:** Initiates the wallet linking process for a logged-in user.
- **`POST /api/wallet/verify`**
  - **Handles:** Cryptographically verifies a signed message from the investor's Solana wallet to securely prove ownership and link the wallet to their identity.
- **`GET /api/wallet/active`**
  - **Handles:** Retrieves the currently active and verified wallet linked to the user's account for investment routing.
- **`POST /api/wallet/sync`**
  - **Handles:** Synchronizes the user's wallet state and allow-list eligibility with the blockchain.

## 🏢 Project Catalog APIs (`/api/projects`)

- **`GET /api/projects`**
  - **Handles:** Fetches the public catalog of all active, funded, or upcoming investment projects.
- **`GET /api/projects/[slug]/details`**
  - **Handles:** Retrieves deep details, tokenomics, lock-up periods, and metadata for a specific project.

## 💸 Investment Workflow APIs (`/api/investments`)

- **`POST /api/investments/create`**
  - **Handles:** Validates investment thresholds and creates a new `Pending` subscription ledger entry when an investor commits funds.
- **`POST /api/investments/[id]/complete`**
  - **Handles:** Confirms the on-chain USDC transfer from the investor, marking the subscription ready for Admin finalization.

## 📊 Portfolio & Dashboard APIs (`/api/portfolio`)

- **`GET /api/portfolio/summary`**
  - **Handles:** Aggregates top-level dashboard metrics: Total Invested, Total Value, and Pending Allocations.
- **`GET /api/portfolio/assets`**
  - **Handles:** Fetches the granular list of allocated project tokens (SPL tokens) held by the user and their current values.
- **`GET /api/portfolio/performance`**
  - **Handles:** Retrieves historical performance data, total lifetime earnings, and ROI statistics for the investor's charts.

## 💰 Distribution & Payout APIs (`/api/payouts`)

- **`POST /api/payouts/claim/[id]`**
  - **Handles:** Processes an investor's request to claim pending profit distributions (if the distribution model allows manual claiming).

## ⚙️ Admin & Reporting APIs (`/api/admin`)

- **`POST /api/admin/projects`**
  - **Handles:** Admin endpoint to create new investment projects, deploying the smart contract logic and linking the SPL mint.
- **`POST /api/admin/projects/[id]`**
  - **Handles:** Updates project parameters, changes lifecycle status (e.g., Draft to Funding), or triggers the Emergency Pause flag.
- **`POST /api/admin/investments/finalize`**
  - **Handles:** The critical settlement trigger. Admin verifies the USDC payment and fires the Cross-Program Invocation to mint the SPL tokens to the investor's wallet.
- **`POST /api/admin/reconciliation`**
  - **Handles:** Auditing endpoint that cross-references the internal Supabase ledger with the immutable Solana blockchain to detect any missing records.

## 🔗 Infrastructure & Webhooks (`/api/indexer` & `/api/webhooks`)

- **`POST /api/indexer/sync-epoch`**
  - **Handles:** Forces the backend to synchronize on-chain payout epochs and distribution events with the off-chain database.
- **`POST /api/webhooks/solana`**
  - **Handles:** A general listener for on-chain events (e.g., token transfers, mints) routed from RPC nodes (like Helius) to keep the app instantly up-to-date.
- **`POST /api/profile/repair`**
  - **Handles:** Utility endpoint to fix corrupted profile states or re-sync authentication IDs with public tables.
