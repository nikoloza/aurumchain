# <span style="color: #0b57d0; font-family: sans-serif; font-weight: 700;">AURUMCHAIN: Secondary Market Extension</span>
## <span style="color: #0070c0; font-family: sans-serif; font-weight: 600;">Technical Specification & Requirements Pack</span>
*Last Updated: May 21, 2026*

---

<div style="background-color: #f0f4f9; border-left: 5px solid #0b57d0; padding: 15px; border-radius: 4px; margin: 20px 0; font-family: sans-serif;">
  <strong style="color: #0b57d0; font-size: 1.1em;">Implementation Note:</strong><br/>
  <span style="color: #1f1f1f; font-size: 0.95em;">The architecture, technical specifications, and flows outlined in this document represent the intended system design for the MVP. However, they are subject to refinement and change during the active development stage based on technical feasibility, security considerations, and implementation discoveries.</span>
</div>

---

## <span style="color: #0b57d0; font-family: sans-serif; border-bottom: 2px solid #0b57d0; padding-bottom: 5px; display: block; margin-top: 30px;">1. Executive Summary</span>

The platform is expanding its Solana-based tokenized investment framework to include a compliant, controlled, internal secondary marketplace. In alignment with compliance requirements and platform oversight, this secondary market does not use a decentralized Automated Market Maker (AMM) or public liquidity pools. Instead, it employs a **controlled, peer-to-peer, internal order-book style marketplace**.

The core architecture aggregates individual sell orders by price level to present a clean, unified order book. Seller identities remain strictly anonymous to users. All orders are subject to price-time priority matching (FIFO) and support partial fills. All trades are fully restricted to KYC-approved, allow-listed wallets to maintain strict compliance, and are subject to platform transaction fee rules.

This pack provides a concrete technical design package ready for production-base deployment, establishing the specifications for Next.js API routes, Supabase entity interactions, Solana Anchor programs, administrative configurations, and security protocols.

### <span style="color: #0070c0; font-family: sans-serif; margin-top: 20px; display: block;">1.1 Scope & Phase Alignment</span>

#### Second Phase of the MVP (Secondary Market Rollout)
This document outlines the requirements and technical specifications for the **Second Phase of the MVP**, which introduces the compliant internal secondary trading market. The following capabilities are covered:
*   **Sell Orders**: Investors can list their holdings for resale on the platform.
*   **Aggregated Price Levels**: Individual listings are grouped by price level to maintain seller anonymity and a clean interface.
*   **Lowest-Price-First Matching**: Purchases are automatically matched with the cheapest available listed tokens first.
*   **FIFO (First-In, First-Out) Priority**: Matching follows time priority for listings at the same price point.
*   **Partial Fills**: Support for partial purchase fulfillment of single listings.
*   **Cancellation**: Sellers can withdraw their listed tokens at any time, instantly unlocking them.
*   **Fee Support**: Platform transactions support configurable fees (seller-paid, buyer-paid, or split).
*   **KYC-Restricted Trading**: All secondary actions (listing, buying, cancelling) require real-time KYC validation.
*   **Dummy Frontend Integration**: Integrating a dummy frontend with the backend APIs and smart contracts for UAT and end-to-end testing.

#### Excluded from MVP / Future Roadmap
*   Open-market bids/buy orders (buyer bids)
*   Decentralized Automated Liquidity Pools (AMM)
*   External, uncontrolled token transfers
*   Real-time order book webhooks (polling model used instead)

---

## <span style="color: #0b57d0; font-family: sans-serif; border-bottom: 2px solid #0b57d0; padding-bottom: 5px; display: block; margin-top: 30px;">2. Functional Features & System Design</span>

The secondary market integration is designed as a modular addition to the current Next.js and Supabase backend. It preserves all core tables (`profiles`, `projects`, `wallets`) while introducing specific tracking tables for orders and trades, along with balance safeguards on user portfolios.

### <span style="color: #0070c0; font-family: sans-serif; margin-top: 20px; display: block;">2.1 Database Entities & Logical Structure</span>

To support the secondary market, the backend introduces two new entities and extends the user portfolio tracking model:

> **Implementation Note:** During actual development, the table name `secondary_listings` and status `active` were chosen over `secondary_orders` and `open` because they better reflect the data's lifecycle, avoid disrupting live system configurations, and align better with the existing frontend schemas. This document retains the original proposed terminology for historical tracking.


1.  **Portfolio Balance Extension (`portfolio_positions`)**:
    *   Adds a new balance field: `locked_tokens`. This tracks the portion of user-held project tokens currently listed in active sell orders on the secondary market.
    *   **Balance Safety Constraint**: The total number of `locked_tokens` is programmatically prevented from exceeding the user's `total_tokens` balance. The user's available token balance for transfers or new listings is calculated as: `total_tokens - locked_tokens`.
2.  **Secondary Orders (`secondary_orders`)**:
    *   Tracks individual sell orders.
    *   Fields include: unique Order ID, Seller User ID reference, Project ID reference, Solana on-chain Order Account address (PDA), original listed quantity, remaining unsold quantity, price per token, order status (`open`, `filled`, `partially_filled`, `cancelled`), creation timestamp, and update timestamp.
3.  **Secondary Trades (`secondary_trades`)**:
    *   Tracks successfully executed trade segments when a buyer purchases listed tokens.
    *   Fields include: Trade ID, associated Sell Order ID, Buyer User ID reference, Seller User ID reference, Project ID reference, executed token quantity, executed price per token, total trade value, platform fee charged, platform fee recipient address, Solana transaction signature, and execution timestamp.

### <span style="color: #0070c0; font-family: sans-serif; margin-top: 20px; display: block;">2.2 Database Integrity Rules & Automation</span>

To ensure complete balance consistency and eliminate race conditions, the backend implements the following automated triggers:

*   **Order Locking trigger**: Fires automatically when a new sell order is recorded. It increments `locked_tokens` in the seller's portfolio position for that project, ensuring those tokens cannot be spent, transferred, or relisted.
*   **Order Cancellation trigger**: Fires automatically when a sell order status changes to `cancelled`. It decreases the user's `locked_tokens` by the remaining unsold quantity, returning them to the user's spendable balance.
*   **Trade Execution trigger**: Fires automatically when a trade is logged in the system:
    *   Deducts the traded quantity from the seller's `total_tokens` and `locked_tokens`.
    *   Adds the traded quantity to the buyer's `total_tokens`. If the buyer does not yet have a position in the project, it initializes a new portfolio record.
    *   Calculates and updates the buyer's new `average_token_price` based on the purchase cost.

---

## <span style="color: #0b57d0; font-family: sans-serif; border-bottom: 2px solid #0b57d0; padding-bottom: 5px; display: block; margin-top: 30px;">3. Smart Contract Specification (Solana Anchor)</span>

To enforce on-chain trust and prevent compliance bypasses, a new program `secondary_market` is introduced. This program works in tandem with the existing `compliance_transfer` and `project_registry` programs.

### <span style="color: #0070c0; font-family: sans-serif; margin-top: 20px; display: block;">3.1 On-Chain Custody & State Structures</span>

Sell orders are stored on-chain using unique Program Derived Addresses (PDAs) derived from the seller's wallet and a unique order sequence ID. The tokens are escrowed in a PDA-owned Token Account (Escrow Vault) associated with the project mint.

1.  **On-Chain Order State**:
    *   Stores: Seller wallet address, project mint address, original listed quantity, remaining unsold quantity, price per token in stablecoin, order sequence counter, creation timestamp, and PDA derivation bump.
2.  **Marketplace Configuration**:
    *   Stores: Platform fee destination wallet, platform fee percentage (expressed in basis points, e.g. 150 = 1.50%), administrative authority key, and global operational pause switch.

### <span style="color: #0070c0; font-family: sans-serif; margin-top: 20px; display: block;">3.2 Instructions & Verification Rules</span>

Every on-chain instruction verifies the participant's eligibility by querying the `compliance_transfer` program's transfer verification endpoint.

#### 1. `create_sell_order`
*   **Purpose**: Locks project tokens in the program's escrow vault and registers the order on-chain.
*   **Verification Guards**: 
    *   *KYC Compliance*: Seller's wallet must be verified and allow-listed by the compliance program.
    *   *Lifecycle check*: The project's mandatory lock-up period must have ended.
    *   *Signer check*: The seller must sign the transaction.
*   **On-Chain Action**: Transfers project tokens from the seller's token account to the program's project-specific escrow vault PDA, and initializes the order account state.

#### 2. `cancel_sell_order`
*   **Purpose**: Unlocks remaining tokens and returns them to the seller, closing the order.
*   **Verification Guards**:
    *   *Authority check*: Must be signed by the order's seller or by the platform administrator (under emergency intervention).
*   **On-Chain Action**: Transfers remaining project tokens from the escrow vault PDA back to the seller's wallet and closes the order state account, returning Solana rent to the seller.

#### 3. `fill_order`
*   **Purpose**: Atomically executes a peer-to-peer trade with compliance gating.
*   **Verification Guards**:
    *   *KYC Compliance*: Buyer's wallet must be verified and allow-listed by the compliance program.
    *   *Supply check*: The requested buy amount must not exceed the remaining listed quantity of the order.
*   **On-Chain Action**:
    *   Calculates the platform fee based on the config percentage.
    *   Transfers the platform fee from the buyer to the platform treasury wallet in stablecoin.
    *   Transfers the remaining purchase amount from the buyer directly to the seller in stablecoin.
    *   Transfers the purchased quantity of project tokens from the escrow vault PDA to the buyer's token account.
    *   Deducts the purchased quantity from the remaining quantity. If fully filled, closes the order state account and returns Solana rent to the seller.

---

## <span style="color: #0b57d0; font-family: sans-serif; border-bottom: 2px solid #0b57d0; padding-bottom: 5px; display: block; margin-top: 30px;">4. Next.js API & Supabase Integration</span>

The API layer is implemented inside Next.js API Routes using server-side client helpers (`createClient`) to interface with Supabase.

### <span style="color: #0070c0; font-family: sans-serif; margin-top: 20px; display: block;">4.1 Endpoints Specification</span>

#### 1. Fetch Aggregated Order Book
*   **Method & Endpoint**: `GET /api/secondary/orderbook`
*   **Query Parameters**: 
    *   `projectId` (string)
*   **Behavior**: Fetches all active orders (`open` or `partially_filled`) for the project, aggregates the remaining quantities by price level, and sorts them from lowest price to highest.
*   **Anonymity Guard**: All individual seller user profiles, wallet addresses, and creation timestamps are redacted. The response only returns the `projectId` and the list of price levels (each level containing: `pricePerToken`, `totalQuantity`).

#### 2. Create Sell Order (Generate Transaction)
*   **Method & Endpoint**: `POST /api/secondary/orders/create`
*   **Request Body**:
    *   `projectId` (string), `amount` (number), `pricePerToken` (number)
*   **Behavior**:
    1.  Verifies user authentication and checks that `kyc_verified` is true.
    2.  Verifies that the project's lockup period has expired.
    3.  Validates that the user has sufficient available tokens (`total_tokens - locked_tokens >= amount`).
    4.  Creates a pending order entry in the database.
    5.  Builds and returns the serialized Solana transaction for the client's wallet to sign.

#### 3. Confirm Sell Order Settlement
*   **Method & Endpoint**: `POST /api/secondary/orders/confirm`
*   **Request Body**:
    *   `orderId` (string), `blockchainSignature` (string)
*   **Behavior**: Confirms the transaction on-chain via Solana RPC, updates the database order status to `open` (making it active in the order book), and sets the final on-chain PDA address.

#### 4. Cancel Sell Order (Generate Transaction)
*   **Method & Endpoint**: `POST /api/secondary/orders/cancel`
*   **Request Body**:
    *   `orderId` (string)
*   **Behavior**: Verifies that the authenticated user owns the order, verifies the remaining balance, and generates the serialized Solana cancellation transaction for the seller's signature.

#### 5. Confirm Order Cancellation
*   **Method & Endpoint**: `POST /api/secondary/orders/cancel/confirm`
*   **Request Body**:
    *   `orderId` (string), `blockchainSignature` (string)
*   **Behavior**: Confirms the cancellation transaction on-chain via Solana RPC, updates the database order status to `cancelled`, and triggers the release of the remaining tokens back to the seller's portfolio.

#### 6. Match & Build Purchase Transaction
*   **Method & Endpoint**: `POST /api/secondary/buy`
*   **Request Body**:
    *   `projectId` (string), `quantity` (number)
*   **Behavior**:
    1.  Verifies the buyer's authentication and KYC status.
    2.  Fetches active orders for the project, sorted by price (cheapest first) and creation date (oldest first) to enforce price-time priority.
    3.  Iterates through orders to match the requested quantity.
    4.  Builds a single Solana transaction containing instructions to fill the matched orders (handling partial fills for the final matched order).
    5.  Returns the serialized transaction, total cost breakdown, and calculated platform fees to the buyer for signing.

#### 7. Confirm Purchase Settlement
*   **Method & Endpoint**: `POST /api/secondary/buy/confirm`
*   **Request Body**:
    *   `projectId` (string), `blockchainSignature` (string), `matchedOrders` (array of matched order segments with filled quantities)
*   **Behavior**: Verifies transaction settlement on-chain, updates the matched database orders, inserts trade logs, and updates portfolio positions.

---

## <span style="color: #0b57d0; font-family: sans-serif; border-bottom: 2px solid #0b57d0; padding-bottom: 5px; display: block; margin-top: 30px;">5. Detailed Exit & Ownership Rules</span>

To prevent economic disputes, the secondary market rules define specific boundaries around token lockups and economic rights during the listing lifecycle.

### <span style="color: #0070c0; font-family: sans-serif; margin-top: 20px; display: block;">5.1 Economic Ownership during Active Listings</span>

Per platform logic, tokens escrowed in the secondary market vault are not yet transferred to a buyer. The seller remains the legal and economic owner of those tokens until the trade transaction executes on-chain.

<div style="background-color: #f0f4f9; border-left: 5px solid #0b57d0; padding: 15px; border-radius: 4px; margin: 20px 0; font-family: sans-serif;">
  <strong style="color: #0b57d0; font-size: 1.05em;">Dividend Snapshot Rule:</strong><br/>
  <span style="color: #1f1f1f; font-size: 0.95em;">When an admin declares a dividend payout snapshot, the system queries the <code>portfolio_positions.total_tokens</code> column. Since tokens listed in <code>secondary_orders</code> remain inside the seller's total balance (only <code>locked_tokens</code> is incremented), the seller continues to receive 100% of their proportional dividend entitlement.</span>
</div>

### <span style="color: #0070c0; font-family: sans-serif; margin-top: 20px; display: block;">5.2 Order Cancellation Flow</span>

If an order is cancelled or remains unfilled:
*   The seller initiates a cancellation request.
*   The backend generates a Solana cancellation transaction calling the `cancel_sell_order` instruction.
*   Once executed on-chain, the backend marks the order `status = 'cancelled'`.
*   The trigger `on_sell_order_cancelled` releases the `amount_remaining` from `locked_tokens`, making the remaining tokens immediately transferable or listable again by the seller.
*   Any portion of the order that was already filled before the cancellation remains final and unaffected.

---

## <span style="color: #0b57d0; font-family: sans-serif; border-bottom: 2px solid #0b57d0; padding-bottom: 5px; display: block; margin-top: 30px;">6. Platform Fees, Governance & Pausing</span>

### <span style="color: #0070c0; font-family: sans-serif; margin-top: 20px; display: block;">6.1 Trade Fee Configurations</span>

The system supports a configurable trade fee. The platform fee can be configured to charge:
1.  **Seller-Paid Fee**: Deducted from the payment before it settles in the seller's wallet.
2.  **Buyer-Paid Fee**: Added to the total transaction cost during the buy flow.
3.  **Split Fee**: Proportioned between the buyer and the seller.

During the MVP launch, the default structure is a **Seller-Paid Fee** (e.g. 1.0%), where the buyer pays the full listing price, the platform receives 1.0% in the treasury wallet, and the seller receives 99.0% of the stablecoin payout.

### <span style="color: #0070c0; font-family: sans-serif; margin-top: 20px; display: block;">6.2 Administrative Pause Controls</span>

Admins retain the ability to pause trading at two levels:
*   **Global Halt**: Pauses all secondary trading across the platform via the `MarketConfig` state.
*   **Project Halt**: Pauses trading for a specific project mint if compliance issues, asset restructurings, or security reviews arise. This is checked inside the `create_sell_order` and `fill_order` instructions.

---

## <span style="color: #0b57d0; font-family: sans-serif; border-bottom: 2px solid #0b57d0; padding-bottom: 5px; display: block; margin-top: 30px;">7. Security & Risk Mitigation Plan</span>

### <span style="color: #0070c0; font-family: sans-serif; margin-top: 20px; display: block;">7.1 Double Spend & Race Condition Prevention</span>

<div style="background-color: #fcf0f0; border-left: 5px solid #d93025; padding: 15px; border-radius: 4px; margin: 20px 0; font-family: sans-serif;">
  <strong style="color: #d93025; font-size: 1.05em;">Double-Spend Prevention:</strong><br/>
  <span style="color: #1f1f1f; font-size: 0.95em;">On-chain escrow locking occurs instantly upon listing creation. Listed project tokens are physically transferred to the program's vault PDA, preventing a seller from transferring, spending, or relisting the same assets during active listings.</span>
</div>

### <span style="color: #0070c0; font-family: sans-serif; margin-top: 20px; display: block;">7.2 Test Cases & UAT Scenarios</span>

| Area | Test Scenario | Expected Result |
| :--- | :--- | :--- |
| **Order Creation** | List 100 tokens at $1.00 when available balance is 50 | Fails (Insufficient available) |
| **Order Creation** | List 100 tokens at $1.00 when available balance is 100 | Succeeds, locked_tokens = 100 |
| **Order Book view** | Three sellers list at $1.00 | UI shows sum of listed tokens |
| **Time Priority** | Seller A lists at $1.00 before Seller B | Seller A fills first on purchase |
| **Price Priority** | Seller A lists at $1.00, Seller B lists at $0.90 | Seller B fills first on purchase |
| **Partial Fills** | Buy 30 tokens from a 100-token order | 30 sold, 70 remain listed |
| **Cancellation** | Cancel order with 70 tokens remaining | 70 tokens return to balance |
| **KYC Enforcement** | Non-verified buyer attempts secondary purchase | Transaction reverts on-chain |
| **Dividend Entitlement** | Snapshot is taken while 50 tokens are listed as locked | Seller receives dividends |

---

## <span style="color: #0b57d0; font-family: sans-serif; border-bottom: 2px solid #0b57d0; padding-bottom: 5px; display: block; margin-top: 30px;">8. Technical Implementation Scope & Deliverables</span>

### <span style="color: #0070c0; font-family: sans-serif; margin-top: 20px; display: block;">8.1 Final Deliverables</span>

1.  **Solana Smart Contract**:
    *   Anchor-based `secondary_market` Rust source code developed locally in the workspace.
2.  **Database Migration & Triggers**:
    *   Supabase SQL migration script creating secondary market tables, altering portfolios, and establishing automated trigger constraints to prevent double-spends.
3.  **Backend APIs & Matching Engine**:
    *   API routes for aggregated order book retrieval, transaction generation, signature verification, and the FIFO matching system.
4.  **Frontend Client Integrations & Testing Interface**:
    *   React hook (`useSecondaryMarket.ts`) containing the integration logic and Solana wallet calls (strictly code-only, no design or styling).
    *   Dummy frontend interface integrated with the backend APIs and smart contracts to facilitate testing and validation.
5.  **Testing Suite**:
    *   TypeScript mocha tests for the Anchor smart contract and an end-to-end integration simulation script.

### <span style="color: #0070c0; font-family: sans-serif; margin-top: 20px; display: block;">8.2 Backend/Frontend Scope</span>

*   **Backend & Blockchain Logic**:
    *   Full implementation of DB tables, indexes, triggers, zod schemas, API routers, and administrative blockchain logs/records.
*   **Frontend Integration**:
    *   Integration-only hook. Exposes functions like `fetchOrderBook`, `listTokens`, `buyTokens`, and `cancelOrder` using the browser wallet adapter. Layouts, pages, and styling are excluded from this MVP phase.
    *   Dummy frontend integration: Connecting the dummy frontend directly to the backend APIs and Solana smart contracts to serve as a functional testing environment.

### <span style="color: #0070c0; font-family: sans-serif; margin-top: 20px; display: block;">8.3 Smart Contract Scope (Solana Playground Model)</span>

*   The contract's Rust code is maintained in `programs/secondary_market/` for repository code-completeness.
*   Compilation, deployment, and upgrades are managed via **Solana Playground (Solpg)**. 
*   Anchor client IDL and TypeScript client scripts are generated to allow direct interface with the Solpg-deployed endpoint.

### <span style="color: #0070c0; font-family: sans-serif; margin-top: 20px; display: block;">8.4 Testing & UAT Scope</span>

*   **Smart Contract Unit Tests**: Verifies core actions (escrow lock, fill, cancel, KYC checks, fees) on a local Anchor validator.
*   **Next.js API Tests**: Verifies P2P matching order routing and database state transitions.
*   **End-to-End Simulation**: Run-through script simulating two sellers listing at different price levels, a buyer executing a partial fill, and the cancellation of remaining amounts.

### <span style="color: #0070c0; font-family: sans-serif; margin-top: 20px; display: block;">8.5 Phased Milestone & Deliverables</span>

<table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-family: sans-serif; border: 1px solid #1f1f1f;">
  <thead>
    <tr style="background-color: #3accd6; border-bottom: 2px solid #1f1f1f;">
      <th style="padding: 12px; border: 1px solid #1f1f1f; text-align: center; color: #1f1f1f; font-weight: bold; width: 15%;">Milestones</th>
      <th style="padding: 12px; border: 1px solid #1f1f1f; text-align: left; color: #1f1f1f; font-weight: bold; width: 30%;">Description</th>
      <th style="padding: 12px; border: 1px solid #1f1f1f; text-align: left; color: #1f1f1f; font-weight: bold; width: 35%;">Deliverable</th>
      <th style="padding: 12px; border: 1px solid #1f1f1f; text-align: center; color: #1f1f1f; font-weight: bold; width: 10%;">Timeline</th>
      <th style="padding: 12px; border: 1px solid #1f1f1f; text-align: center; color: #1f1f1f; font-weight: bold; width: 10%;">Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 15px; border: 1px solid #1f1f1f; text-align: center; font-weight: bold; vertical-align: middle;">
        3rd Milestone
      </td>
      <td style="padding: 15px; border: 1px solid #1f1f1f; vertical-align: top; font-size: 0.9em; line-height: 1.4;">
        Include exact contracts/programs/APIs such as:<br/>
        • Solana Escrow program (<code>secondary_market</code>)<br/>
        • Escrow vault custody &amp; on-chain PDA locking<br/>
        • Aggregated Order Book price levels<br/>
        • P2P Matching Engine (FIFO &amp; lowest-price priority)<br/>
        • KYC/Compliance gate integration<br/>
        • Order cancellation &amp; token release logic<br/>
        • Trade fee logic (seller-paid / split)<br/>
        • Global &amp; project pause controls<br/>
        • Dummy frontend integration with backend for testing
      </td>
      <td style="padding: 15px; border: 1px solid #1f1f1f; vertical-align: top; font-size: 0.9em; line-height: 1.4;">
        • Rust Solana escrow contract<br/>
        • Supabase DB migrations &amp; triggers<br/>
        • Next.js API matching engine routes<br/>
        • Integration hook (<code>useSecondaryMarket.ts</code>)<br/>
        • Integrated dummy frontend connected to backend for testing<br/>
        • Test coverage for matching/escrow flows<br/>
        • Contract &amp; API integration documentation<br/>
        • Admin control guide (pausing, fees)<br/>
        <strong>Acceptance criteria:</strong><br/>
        • Escrow locks and releases tokens correctly<br/>
        • FIFO matching executes correct partial fills<br/>
        • Non-KYC wallets are blocked on-chain &amp; API<br/>
        • Dummy frontend successfully performs trades via backend
      </td>
      <td style="padding: 15px; border: 1px solid #1f1f1f; text-align: center; font-weight: bold; vertical-align: middle;">
        40 Days
      </td>
      <td style="padding: 15px; border: 1px solid #1f1f1f; text-align: center; font-weight: bold; vertical-align: middle;">
        $3,000<br/>USD
      </td>
    </tr>
  </tbody>
</table>

