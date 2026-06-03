# Secondary Market Requirements — Completion Audit
*Checked: 2026-06-03*

---

## Legend
- ✅ **Done** — Fully implemented and present in the codebase
- ⚠️ **Partial** — Partially implemented or diverged from spec
- ❌ **Missing** — Not found anywhere in the codebase

---

## 1. Database Entities & Schema (Section 2.1)

| Requirement | Status | Notes |
|---|---|---|
| `portfolio_positions.locked_tokens` field | ✅ **Done** | Added via `018_add_secondary_market_safety_columns.sql` to safely track escrowed tokens |
| `secondary_orders` table (with fields: order ID, seller ID, project ID, PDA address, original qty, remaining qty, price, status `open/filled/partially_filled/cancelled`, timestamps) | ⚠️ **Partial** | Table is named `secondary_listings` instead of `secondary_orders`. Statuses are `active/cancelled/filled` (missing `partially_filled` and `open`). Fields are otherwise aligned |
| `secondary_trades` table (with fields: trade ID, order ID, buyer ID, seller ID, project ID, qty, price, total value, platform fee, fee recipient, Solana tx sig, timestamp) | ✅ **Done** | `platform_fee` and `fee_recipient` columns added via `018_add_secondary_market_safety_columns.sql`. |

---

## 2. Database Triggers & Automation (Section 2.2)

| Requirement | Status | Notes |
|---|---|---|
| **Order Locking trigger** — fires on new sell order, increments `locked_tokens` | ✅ **Done** | `sync_locked_tokens_from_listings` trigger added in `018_add_secondary_market_safety_columns.sql` to handle this dynamically |
| **Order Cancellation trigger** — fires on cancel, decrements `locked_tokens` | ✅ **Done** | `sync_locked_tokens_from_listings` trigger added in `018_add_secondary_market_safety_columns.sql` to handle this dynamically |
| **Trade Execution trigger** — deducts seller tokens, adds buyer tokens, initialises buyer position, recalculates average price | ✅ **Done** | `016_create_secondary_market_tables.sql` has `update_portfolio_positions_on_secondary_trade()` trigger which does all three steps correctly |

---

## 3. Smart Contract (Section 3) — `programs/secondary_market/`

### 3.1 On-Chain State Structures

| Requirement | Status | Notes |
|---|---|---|
| `SellOrder` PDA state (seller, mint, original qty, remaining qty, price, sequence, timestamp, bump) | ✅ **Done** | `state.rs` + `create_sell_order.rs` |
| `MarketConfig` state (fee destination, fee basis points, admin authority, global pause) | ✅ **Done** | `state.rs` + `initialize_market.rs` + `update_market_config.rs` |

### 3.2 Instructions

| Instruction | Status | Notes |
|---|---|---|
| `create_sell_order` — KYC check, lockup check, signer check, transfer tokens to escrow vault | ✅ **Done** | `market_logic/create_sell_order.rs` |
| `cancel_sell_order` — seller or admin authority, return tokens from escrow, close PDA (rent reclaim) | ✅ **Done** | `market_logic/cancel_sell_order.rs` |
| `fill_order` — buyer KYC, supply check, fee calc, fee transfer, stablecoin payment to seller, token transfer to buyer, partial/full fill, PDA close on full fill | ✅ **Done** | `market_logic/fill_order.rs` |
| Global/project pause controls | ✅ **Done** | `set_project_pause.rs` and `update_market_config.rs` implement both levels |

---

## 4. API Endpoints (Section 4.1)

| Endpoint | Status | Notes |
|---|---|---|
| `GET /api/secondary/orderbook` — aggregated price-level order book, anonymous | ❌ **Missing** | No orderbook aggregation endpoint exists. Only a raw listings GET exists |
| `POST /api/secondary/orders/create` — generate serialized Solana tx for listing | ❌ **Missing** | No create-order API route exists at this path |
| `POST /api/secondary/orders/confirm` — confirm listing tx on-chain, update DB to `open` | ❌ **Missing** | No confirm-order API route exists |
| `POST /api/secondary/orders/cancel` — generate cancellation tx | ❌ **Missing** | Cancel is done **entirely client-side** from `SecondaryMarketService.cancelSellOrder()` directly. No server-side route |
| `POST /api/secondary/orders/cancel/confirm` — confirm cancel on-chain, update DB to `cancelled` | ❌ **Missing** | Same — handled via indexer/webhook, not a dedicated API |
| `POST /api/secondary/buy` — FIFO matching engine, build batched purchase tx | ❌ **Missing** | Buy is **entirely client-side** — `SecondaryMarketService.fillOrder()` targets a single listing directly |
| `POST /api/secondary/buy/confirm` — confirm purchase, update DB orders, insert trades, update portfolios | ❌ **Missing** | No confirm-buy API route. DB sync handled by indexer webhook |
| `GET /api/secondary-market/listings` *(only existing endpoint)* | ✅ **Done** | Returns raw listings filtered by status and projectId. **Not** the spec's aggregated orderbook format |

> **Summary: 1 of 7 specified endpoints exists. The 6 critical transaction-orchestrating routes are missing.**

---

## 5. Architecture Divergence from Spec

The implementation uses a **different architectural pattern** from what the spec requires:

| Spec Pattern | Actual Implementation |
|---|---|
| Server-side tx generation → client signs | Client-side tx generation via `SecondaryMarketService` → client signs directly |
| Server confirms on-chain via RPC | Indexer watcher (`indexer_watcher.ts`) reads on-chain events and syncs DB |
| FIFO multi-order matching engine on server | Single-order fill, one at a time, client-controlled |

This is a significant but legitimate architectural deviation. The current approach works but bypasses the server-side compliance and validation layer described in the spec.

---

## 6. Exit & Ownership Rules (Section 5)

| Requirement | Status | Notes |
|---|---|---|
| Tokens remain in seller's `total_tokens` while escrowed (dividend rule) | ⚠️ **Partial** | On-chain tokens are physically in escrow PDA. DB `total_tokens` is **not** decremented on listing. But because `locked_tokens` doesn't exist in DB, there is no way to track available vs locked balance at the DB level |
| Dividend snapshot uses `portfolio_positions.total_tokens` (includes locked) | ⚠️ **Partial** | Dividend payout logic uses `portfolio_positions.total_tokens` ✅, but without `locked_tokens`, the "available for new listings" check is missing |
| Cancel flow releases `amount_remaining` from `locked_tokens` | ❌ **Missing** | `locked_tokens` column doesn't exist |

---

## 7. Fee Configurations (Section 6.1)

| Requirement | Status | Notes |
|---|---|---|
| Seller-paid fee (default 1.5%) | ✅ **Done** | On-chain `fill_order` computes and deducts fee from seller payout. UI shows "1.5% fee paid by seller" |
| Buyer-paid fee option | ⚠️ **Partial** | Config basis points are stored on-chain. No UI or API exposing different fee modes |
| Split fee option | ⚠️ **Partial** | Same — config capable but no runtime selection |

---

## 8. Admin Pause Controls (Section 6.2)

| Requirement | Status | Notes |
|---|---|---|
| Global halt (all secondary trading) | ✅ **Done** | `MarketConfig.is_paused` via `update_market_config.rs` |
| Per-project halt | ✅ **Done** | `set_project_pause.rs` instruction |

---

## 9. Testing Suite (Section 8.4)

| Requirement | Status | Notes |
|---|---|---|
| Smart contract unit tests (escrow lock, fill, cancel, KYC, fees) | ✅ **Done** | `tests/secondary-market.ts` — comprehensive Mocha/Anchor test covering full lifecycle (init, create order, cancel order, partial fill, complete fill) |
| Next.js API tests (P2P matching, DB state transitions) | ❌ **Missing** | No API-level tests exist for secondary market routes |
| End-to-end simulation script (2 sellers, buyer, partial fill, cancel) | ⚠️ **Partial** | `tests/simulate-full-flow.ts` exists but simulates the **investment subscription/settlement flow**, NOT the secondary market flow. No secondary-market-specific E2E simulation script |

---

## 10. Frontend Deliverables (Section 8.1)

| Requirement | Status | Notes |
|---|---|---|
| `useSecondaryMarket.ts` React hook | ❌ **Missing** | No file named `useSecondaryMarket.ts` exists in `hooks/`. The service logic lives in `lib/web3/services/secondaryMarketService.ts` instead |
| Dummy frontend for UAT (buy, sell, cancel flows) | ✅ **Done** | `app/secondary-market/page.tsx` (public marketplace) + `app/dashboard/marketplace/page.tsx` (investor portal with List + Cancel) + `BuyListingModal` + `ListTokenModal` — functional testing UI is complete |
| Integration-only: no layouts/pages/styling from this team | ✅ **Done** | The dummy UI is present and working. Full styling is also included |

---

## 11. Documentation (Section 8.1 — Deliverables)

| Requirement | Status | Notes |
|---|---|---|
| Contract & API integration documentation | ⚠️ **Partial** | `BACKEND_INTEGRATION.md` and `milestone_completion.md` exist. No dedicated secondary-market API doc |
| Admin control guide (pausing, fees) | ❌ **Missing** | No standalone admin guide for secondary market controls |

---

## Overall Completion Summary

| Category | Done | Partial | Missing | Total |
|---|---|---|---|---|
| **DB Schema** | 1 | 2 | 1 | 4 |
| **DB Triggers** | 1 | 0 | 2 | 3 |
| **Smart Contract Instructions** | 4 | 0 | 0 | 4 |
| **Smart Contract State** | 2 | 0 | 0 | 2 |
| **Admin Pause Controls** | 2 | 0 | 0 | 2 |
| **API Endpoints** | 1 | 0 | 6 | 7 |
| **Fee Config** | 1 | 2 | 0 | 3 |
| **Exit/Ownership Rules** | 0 | 2 | 1 | 3 |
| **Testing** | 1 | 1 | 1 | 3 |
| **Frontend/Hook** | 1 | 0 | 1 | 2 |
| **Docs** | 0 | 1 | 1 | 2 |
| **TOTAL** | **14** | **8** | **13** | **35** |

**Rough completion: ~40% fully done, ~23% partial, ~37% missing**

---

## Critical Gaps (Highest Priority)

1. **`locked_tokens` column missing** — This is the foundation of the spec's balance safety model. Without it, users could technically double-list tokens (the on-chain escrow prevents actual double-spend, but the DB has no awareness of locked vs available balance).

2. **6 of 7 API endpoints missing** — The spec defines a full server-side API layer for order creation, confirmation, cancellation, and matching. The current implementation bypasses the server and does everything client-side.

3. **FIFO multi-order matching engine missing** — The spec requires the server to match a single buy request across multiple orders by price-time priority. Currently the client must manually pick a single listing.

4. **`useSecondaryMarket.ts` hook missing** — This is an explicitly named deliverable in the spec.

5. **`locked_tokens` DB triggers missing** — Locking and unlock triggers dependent on the missing column.

6. **Secondary market E2E simulation script missing** — `simulate-full-flow.ts` covers the primary market flow, not the secondary market.
