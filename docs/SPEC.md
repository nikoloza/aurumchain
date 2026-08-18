# Fractyco — Technical Specification

Version 1.0 · Status: draft · Network: Solana devnet

Written in ASD-STE100 Simplified Technical English. Sentences are short. Verbs
are active. One term always has one meaning.

---

## 1. Purpose

Fractyco divides a real-world asset into tokens. An investor buys the tokens.
The investor holds the tokens in a personal wallet. The asset produces profit.
Fractyco pays that profit to each holder on the blockchain.

This document specifies what the system does. It does not specify how to write
the code.

## 2. Scope

This document covers three user surfaces, one database, and four blockchain
programs.

This document does not cover the legal offering documents. It does not cover
the identity provider's internal process.

## 3. Terms

| Term | Meaning |
| --- | --- |
| Account | A registered user of the platform. |
| Investor | An account that can buy tokens. |
| Operator | An account that runs a queue. The operator holds the operational admin authority. |
| Compliance officer | An account that approves an identity. |
| Super admin | An account that holds the highest authority. |
| Project | One real-world asset in the registry. |
| Offering | The terms that govern the sale of a project's tokens. |
| Token | One fraction of a project. |
| Subscription | An investor's commitment to buy tokens. |
| Position | The tokens one investor holds in one project. |
| Epoch | One payout period for one project. |
| Payout | The money one investor receives for one epoch. |
| Listing | An offer to sell tokens to another investor. |
| Trade | A completed sale between two investors. |
| Eligibility | The record that says what an account can do. |
| Transfer hook | The program that approves or refuses each token transfer. |
| Registry | The program that owns the token supply. |
| Authority | The key that can call a restricted instruction. |

## 4. System overview

The system has three planes.

1. **The surface plane.** Three web applications. Each application has its own
   domain.
2. **The data plane.** One PostgreSQL database with row-level security.
3. **The chain plane.** Four Anchor programs on Solana.

The chain plane is the source of truth for the token supply and the token
balances. The data plane is the source of truth for identity, for eligibility,
and for the audit trail. The surface plane reads both planes. The surface plane
never writes to the chain plane without an authority.

### 4.1 Surfaces

| Surface | Folder | Domain | Purpose |
| --- | --- | --- | --- |
| Marketing | `landing/` | aurc.app | Explain the product. Collect sign-ups. |
| Investor application | `app/` | app.aurc.app | Subscribe, hold, trade, and claim. |
| Governance | `governance/` | gov.aurc.app | Hold the authorities. Run the queues. |

All three surfaces use one shared library, `brand/`. The library holds the
design system and every reusable component.

### 4.2 Planes and ownership

| Fact | Owner |
| --- | --- |
| Token supply | Registry program |
| Token balance | Solana token account |
| Permission to transfer | Compliance program |
| Payout entitlement | Distribution program |
| Resale order | Market program |
| Identity decision | Database |
| Eligibility flags | Database |
| Audit trail | Database |
| Aggregated position | Database, from a trigger |

---

## 5. Actors and roles

The database holds four roles in the `user_roles` table.

| Role | Can do |
| --- | --- |
| `user` | Read own records. Subscribe when eligible. |
| `admin` | Finalize a subscription. Open an epoch. Run a payout. Manage a project. |
| `compliance_officer` | Approve or reject an identity. Record or revoke a wallet. |
| `super_admin` | All of the above. Transfer an authority. Set a global pause. |

A role controls what the console can call. A role does not give a blockchain
authority. The blockchain authorities are separate keys.

The chain plane holds four authorities.

| Authority | Program | Can do |
| --- | --- | --- |
| Super admin | Registry, compliance | Transfer an authority. Set the KYC bypass. Revoke a mint. |
| Operational admin | Registry, distribution | Create a project. Issue tokens. Open an epoch. Pay a holder. |
| Compliance authority | Compliance | Record a verified wallet. Revoke a wallet. |
| Market authority | Market | Set the fee. Set the fee destination. Pause a project. |

A role revocation keeps its row. The history stays readable.

---

## 6. Data model

The database uses PostgreSQL. Row-level security is on for every table.

### 6.1 Account tables

| Table | Purpose | Key columns |
| --- | --- | --- |
| `profiles` | One row per account. | `id`, `email`, `country`, `kyc_verified` |
| `wallet_links` | One row per wallet an account links. | `wallet_address`, `chain_id`, `verified`, `verification_signature`, `is_active` |
| `kyc_profiles` | The identity record from the provider. | `provider`, `provider_applicant_id`, `status`, `expires_at` |
| `eligibility_states` | What the account can do now. | `status`, `can_invest`, `can_withdraw`, `can_receive_dividends` |
| `user_roles` | Console access control. | `role`, `granted_by`, `revoked_at` |

A trigger creates the profile and the eligibility state when the account signs
up. The eligibility state starts at `registered`.

Do not use `profiles.investor_tier` for access control. The column is for
display only. Use `eligibility_states.can_invest`.

### 6.2 Asset tables

| Table | Purpose | Key columns |
| --- | --- | --- |
| `projects` | One row per real-world asset. | `slug`, `location`, `funding_goal`, `token_price`, `total_tokens`, `status` |
| `offerings` | The sale terms for a project. | `token_symbol`, `total_tokens`, `available_tokens`, `token_price`, `offering_start_date`, `offering_end_date`, `contract_address` |

The `projects.status` column takes one of six values: `draft`, `funding`,
`funded`, `active`, `completed`, `cancelled`.

### 6.3 Investment tables

| Table | Purpose | Key columns |
| --- | --- | --- |
| `investments` | One row per subscription. | `amount`, `tokens_purchased`, `token_price_at_purchase`, `status`, `transaction_hash` |
| `portfolio_positions` | Aggregated holdings per account per project. | `total_tokens`, `total_invested`, `average_token_price`, `total_dividends_received`, `return_percentage` |
| `transactions` | Every money movement. | `type`, `amount`, `status`, `payment_method`, `blockchain_hash` |

A trigger updates `portfolio_positions` when an investment completes. The same
trigger records the average price.

### 6.4 Payout tables

| Table | Purpose | Key columns |
| --- | --- | --- |
| `payout_cycles` | One row per epoch per project. | `period_start`, `period_end`, `total_amount`, `tokens_eligible`, `amount_per_token`, `status` |
| `payout_records` | One row per investor per epoch. | `tokens_held`, `amount_due`, `is_claimed`, `tx_hash` |

The database enforces `amount_per_token = total_amount / tokens_eligible`.

A trigger raises `portfolio_positions.total_dividends_received` when a payout
record completes.

### 6.5 Market tables

| Table | Purpose | Key columns |
| --- | --- | --- |
| `secondary_listings` | One row per sell order. | `sell_order_pda`, `token_amount`, `token_listing_price`, `sold`, `remaining`, `sequence`, `status` |
| `secondary_trades` | One row per fill. | `seller_id`, `buyer_id`, `token_amount`, `paid_amount`, `trade_tx` |

The database enforces `remaining = token_amount - sold`.

A trigger moves the tokens between the two positions after a trade. The trigger
reduces the seller position at the seller's average cost. The trigger raises the
buyer position at the paid price.

### 6.6 Record tables

| Table | Purpose | Key columns |
| --- | --- | --- |
| `audit_logs` | Immutable record of a sensitive operation. | `event_type`, `user_id`, `actor_id`, `actor_role`, `previous_state`, `new_state`, `ip_address` |
| `notifications` | One row per message to an account. | `type`, `title`, `message`, `read` |

The `audit_logs` table takes inserts only. No policy permits an update or a
delete.

---

## 7. Blockchain programs

Four Anchor programs run on Solana. Each program owns one authority. No program
duplicates the authority of another program.

### 7.1 `project_registry`

The registry owns the token supply.

| Instruction | Purpose |
| --- | --- |
| `initialize_control` | Create the control account. Set the operational admin and the limits. |
| `create_project` | Add a project to the registry. |
| `set_project_mint` | Bind one mint to one project. The program refuses a second bind. |
| `issue_tokens` | Mint tokens straight to an investor wallet. |
| `reset_round` | Reset the round counter. Set a new round cap. |
| `record_tokens_issued` | Record an issuance that another program made. |
| `update_project_params` | Change the project parameters. |
| `update_project_status` | Move the project to a new status. |
| `revoke_mint_authority` | Fix the supply for good. |
| `burn_tokens` | Destroy tokens. Takes a reason code and an audit hash. |
| `transfer_authority` | Give a role to a new key. |
| `set_emergency_pause` | Stop every project. |
| `calibrate_registry` | Correct the project counter. |

`issue_tokens` checks five guards before it mints:

1. The project status is `Funding`.
2. The project is not paused.
3. The new total does not exceed the supply cap.
4. The new total does not exceed the round cap.
5. The mint authority is not revoked.

PDA seeds: `control`, `project` + project id, `mint_authority` + mint.

### 7.2 `compliance_transfer`

The compliance program owns the permission to move a token.

| Instruction | Purpose |
| --- | --- |
| `initialize_compliance` | Create the compliance control account. |
| `record_verified_wallet` | Write the eligibility record for one wallet. |
| `refresh_eligibility` | Update an existing wallet record. |
| `revoke_wallet` | Remove the permission from one wallet. |
| `transfer_validate` | Decide whether one transfer is legal. |
| `transfer_hook` | Run the decision inside the SPL transfer path. |
| `initialize_extra_account_meta_list` | Register the accounts the hook needs. |
| `subscribe_investment` | Open a subscription record on the chain. |
| `finalize_subscription` | Close the subscription. Record the settlement hash and the allocated amount. |
| `set_kyc_bypass` | Turn identity checks off. Super admin only. Takes a nonce. |
| `set_global_transfer_pause` | Stop every transfer. Takes a nonce. |
| `toggle_lockup_bypass` | Permit a transfer inside the lockup window. |
| `sync_mint_compliance` | Copy the project pause and the lockup end from the registry. |

`transfer_validate` refuses the transfer when any of these is true:

1. The destination wallet has no eligibility record.
2. The global transfer pause is on.
3. The project transfers are paused.
4. The current time is before the lockup end.

The program uses SPL Token-2022. The hook runs on every transfer. A direct
wallet-to-wallet transfer cannot avoid the hook.

PDA seeds: `compliance_control`, `eligibility` + wallet, `subscription` +
subscription id, `mint_lookup` + mint, `extra-account-metas` + mint.

### 7.3 `allocation_distribution`

The distribution program owns the payouts.

| Instruction | Purpose |
| --- | --- |
| `initialize_config` | Create the distribution control account. |
| `create_epoch` | Open a payout period. Fix the profit per token. |
| `execute_payout` | Pay one holder against a balance snapshot. |

The epoch account holds `project_id`, `epoch_id`, `profit_per_token`,
`record_date`, `total_payouts_executed`, `is_completed`, and `token_decimals`.

The caller passes the snapshot balance to `execute_payout`. A transfer after the
record date does not change the entitlement.

PDA seeds: `distribution_control`, `config`, `counter`, `escrow_vault`,
`vault_authority`.

### 7.4 `secondary_market`

The market program owns the resale.

| Instruction | Purpose |
| --- | --- |
| `initialize_market` | Create the market. Set the fee and the linked programs. |
| `update_market_config` | Change the fee, the pause flag, or the fee destination. |
| `set_project_pause` | Stop the resale of one asset. |
| `create_sell_order` | Move tokens into escrow. Publish the order. |
| `cancel_sell_order` | Return the escrowed tokens to the seller. |
| `fill_order` | Buy any amount up to the remainder. |

`create_sell_order` takes a sequence number. The sequence makes each order
address unique for one seller.

The market takes the fee in basis points. The market sends the fee to the fee
destination.

PDA seeds: `sell_order`, `project_pause`, `escrow_vault`, `vault_authority`.

---

## 8. Functional breakdown

### 8.1 Open an account

1. The person gives an email address and a password.
2. The system creates the `auth.users` row.
3. A trigger creates the `profiles` row.
4. A second trigger creates the `eligibility_states` row at `registered`.
5. The system writes an audit row of type `admin_action`.

### 8.2 Verify an identity

1. The account starts the identity check.
2. The system requests a token from the identity provider.
3. The provider collects the documents.
4. The provider sends the result to the compliance webhook.
5. The system updates `kyc_profiles.status`.
6. A compliance officer confirms the decision.
7. The system moves the eligibility state to `kyc_approved`.
8. The system writes an audit row of type `kyc_approved` or `kyc_rejected`.

The identity record expires. The system reads `kyc_profiles.expires_at`. An
expired record removes the permission to invest.

### 8.3 Link a wallet

1. The account connects a wallet in the browser.
2. The system issues a nonce.
3. The wallet signs the nonce.
4. The system verifies the signature.
5. The system writes `wallet_links` with `verified = true`.
6. The compliance officer calls `record_verified_wallet`.
7. The program writes the eligibility PDA for that wallet.
8. The system writes an audit row of type `wallet_verified`.

Connection and verification are separate states. A connected wallet cannot
receive tokens. A verified wallet can.

### 8.4 Advance the eligibility state

The eligibility state machine has ten states.

```
registered
  → wallet_connected → wallet_verified
  → kyc_pending → kyc_under_review → kyc_approved
  → investment_eligible
  → restricted | suspended | kyc_rejected
```

The record caches three flags: `can_invest`, `can_withdraw`, and
`can_receive_dividends`. The application reads the flags. The application does
not compute the state again.

The system writes an audit row of type `eligibility_changed` on each change.
The row carries the previous state and the new state.

### 8.5 Publish an offering

1. The operator creates the project in the database.
2. The operator calls `create_project` on the registry.
3. The operator creates the mint.
4. The operator calls `set_project_mint`.
5. The operator calls `initialize_extra_account_meta_list` for the mint.
6. The operator sets the project status to `funding`.
7. The offering appears in the investor application.

### 8.6 Subscribe to an offering

1. The investor selects an offering.
2. The application checks `can_invest`. The application stops here if the flag
   is false.
3. The investor enters an amount.
4. The application checks the amount against `min_investment`.
5. The investor approves the stablecoin transfer.
6. The application calls `subscribe_investment`.
7. The application writes the `investments` row at status `pending`.
8. The system writes an audit row of type `investment_created`.

### 8.7 Settle a subscription

1. The operator opens the settlement queue.
2. The operator selects a pending subscription.
3. The system calls `finalize_subscription` with the settlement hash and the
   allocated amount.
4. The system calls `issue_tokens` on the registry.
5. The registry mints the tokens to the investor wallet.
6. The system sets `investments.status` to `approved`.
7. A trigger updates `portfolio_positions`.
8. The system writes an audit row of type `investment_completed`.

The blockchain call can fail after the database write succeeds. The system logs
the failure. The reconciliation sweep finds the difference later. See 8.13.

### 8.8 Control a transfer

Every token movement calls the hook. The hook applies the rules in 7.2.

The rules apply to all of these:

- A mint to an investor wallet.
- A wallet-to-wallet transfer.
- A move into a market escrow.
- A move out of a market escrow.

### 8.9 Read a portfolio

The `portfolio_positions` table holds one row per account per project. Triggers
keep the row correct.

| Field | Source |
| --- | --- |
| `total_tokens` | Investments, plus buys, minus sells. |
| `total_invested` | Investment amounts, plus buy amounts, minus sells at average cost. |
| `average_token_price` | `total_invested / total_tokens` |
| `total_dividends_received` | Completed payout records. |
| `return_percentage` | `total_return / total_invested × 100` |

The position closes when `total_tokens` reaches zero. The system sets
`is_active` to false and stamps `closed_at`.

### 8.10 Distribute a payout

1. The operator measures the profit for the period.
2. The operator divides the profit by the eligible token count.
3. The operator calls `create_epoch` with that rate.
4. The system reads each holder balance at the record date.
5. The system writes one `payout_records` row per holder.
6. The operator runs the batch.
7. The system calls `execute_payout` for each holder.
8. A trigger raises the position's dividend total.
9. The system writes an audit row of type `payout_completed`.

An investor claims an unclaimed payout from the investor application. The claim
sends the stablecoin to the linked wallet.

### 8.11 Sell on the secondary market

**To list.**

1. The holder selects a position.
2. The holder enters an amount and a unit price.
3. The application calls `create_sell_order`.
4. The program moves the tokens into escrow.
5. The application writes the `secondary_listings` row.

**To buy.**

1. The buyer selects a listing.
2. The buyer enters an amount up to the remainder.
3. The application calls `fill_order`.
4. The program checks the compliance hook for the buyer wallet.
5. The program sends the tokens to the buyer.
6. The program sends the stablecoin to the seller.
7. The program sends the fee to the fee destination.
8. The application writes the `secondary_trades` row.
9. A trigger rebalances both positions.

**To cancel.** The seller calls `cancel_sell_order`. The program returns the
escrowed tokens.

### 8.12 Govern the system

The governance surface groups the actions by what each action changes.

| Group | Page | Action |
| --- | --- | --- |
| Control | Control plane | Read the authority health and the open queues. |
| Control | Authorities | Transfer an authority. Read the limits. |
| Control | Roles | Grant or revoke a console role. |
| Control | Emergency | Set a global pause. |
| Policy | Compliance | Review an identity. Set the KYC bypass and the lockup bypass. |
| Policy | Market | Set the fee, the fee destination, and the project pause. |
| Policy | Projects | Change the status, the round cap, and the mint authority. |
| Operations | Subscriptions | Finalize or reject a subscription. |
| Operations | Distributions | Open an epoch. Run a batch payout. |
| Operations | Reconciliation | Compare the database against the chain. |
| Record | Audit log | Read the trail. |

Every action on this surface writes an audit row.

### 8.13 Reconcile the two planes

The chain is the source of truth for the balances. The sweep compares each
database row against the chain.

1. The sweep reads the token accounts for one project.
2. The sweep reads `portfolio_positions` for the same project.
3. The sweep reports each row that differs.
4. The operator adopts the chain value or opens an investigation.
5. The adoption writes an audit row with both states.

Run the sweep after each batch payout. Run the sweep daily at 02:00 UTC.

### 8.14 Read the audit trail

The trail records these event types:

`wallet_linked`, `wallet_unlinked`, `wallet_verified`, `kyc_submitted`,
`kyc_approved`, `kyc_rejected`, `eligibility_changed`, `investment_created`,
`investment_completed`, `payout_created`, `payout_completed`, `admin_action`,
`account_suspended`, `account_restricted`.

Each row carries the actor, the actor's role, the IP address, and the request
id. Each row carries the previous state and the new state for a critical change.

---

## 9. Interfaces

The old system exposed these server routes. The new system keeps the same
contract. The route names map one to one.

| Group | Route | Method | Purpose |
| --- | --- | --- | --- |
| Identity | `/api/kyc/token` | POST | Get a provider session token. |
| Identity | `/api/kyc/complete` | POST | Record the provider result. |
| Identity | `/api/compliance/webhook` | POST | Receive the provider callback. |
| Wallet | `/api/wallet/connect` | POST | Record a connection. |
| Wallet | `/api/wallet/verify` | POST | Verify a signature. |
| Wallet | `/api/wallet/active` | GET | Read the active wallet. |
| Wallet | `/api/wallet/sync` | POST | Refresh the on-chain record. |
| Projects | `/api/projects` | GET | List the projects. |
| Projects | `/api/projects/{slug}/details` | GET | Read one project. |
| Investments | `/api/investments/create` | POST | Open a subscription. |
| Investments | `/api/investments/{id}/complete` | POST | Settle a subscription. Admin only. |
| Portfolio | `/api/portfolio/summary` | GET | Read the totals. |
| Portfolio | `/api/portfolio/assets` | GET | Read the positions. |
| Portfolio | `/api/portfolio/performance` | GET | Read the returns. |
| Payouts | `/api/payouts/claim/{id}` | POST | Claim a payout. |
| Market | `/api/secondary-market/listings` | GET | List the active orders. |
| Market | `/api/secondary-market/orderbook` | GET | Read the book for one asset. |
| Market | `/api/secondary-market/orders/create` | POST | Create a sell order. |
| Market | `/api/secondary-market/orders/confirm` | POST | Confirm a created order. |
| Market | `/api/secondary-market/orders/cancel` | POST | Cancel a sell order. |
| Market | `/api/secondary-market/buy` | POST | Fill an order. |
| Market | `/api/secondary-market/buy/confirm` | POST | Confirm a fill. |
| Governance | `/api/admin/projects` | GET, POST | Manage the projects. |
| Governance | `/api/admin/investments` | GET | Read the settlement queue. |
| Governance | `/api/admin/investments/finalize` | POST | Settle a subscription. |
| Governance | `/api/admin/compliance` | GET | Read the review queue. |
| Governance | `/api/admin/distributions/investors` | GET | Read the holders for an epoch. |
| Governance | `/api/admin/distributions/sync-batch` | POST | Record a batch result. |
| Governance | `/api/admin/audit-logs` | GET | Read the trail. |
| Governance | `/api/admin/audit-logs/sync-onchain` | POST | Import chain events. |
| Governance | `/api/admin/reconciliation` | GET, POST | Run and read the sweep. |
| Indexer | `/api/indexer/sync-epoch` | POST | Import epoch data from the chain. |
| Indexer | `/api/webhooks/solana` | POST | Receive a chain event. |

Every route limits the caller to 30 requests each minute for each IP address.
Raise the limit only for a named service account.

Move the rate-limit store to a shared cache before the production release. The
old store keeps the counters in process memory. That store fails behind more
than one server.

---

## 10. Configuration

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | The database endpoint. |
| `SUPABASE_ANON_KEY` | The browser key. |
| `SUPABASE_SERVICE_ROLE_KEY` | The server key. Never send this key to a browser. |
| `SOLANA_RPC_URL` | The cluster endpoint. |
| `SOLANA_CLUSTER` | `devnet` or `mainnet`. |
| `PROJECT_REGISTRY_PROGRAM_ID` | The registry address. |
| `COMPLIANCE_PROGRAM_ID` | The compliance address. |
| `ALLOCATION_DISTRIBUTION_PROGRAM_ID` | The distribution address. |
| `SECONDARY_MARKET_PROGRAM_ID` | The market address. |
| `ADMIN_WALLET` | The operational admin key. |
| `TREASURY_WALLET` | The fee destination. |
| `USDC_MINT` | The settlement asset. |
| `KYC_APP_TOKEN` | The identity provider token. |
| `KYC_SECRET_KEY` | The identity provider secret. |
| `KYC_LEVEL_NAME` | The identity check level. |

Keep every secret out of the repository. Load each secret from the secret
store.

---

## 11. Constraints

1. The system runs on devnet. Do not describe the system as a live offering.
2. The registry caps the supply per project and per round. The program refuses
   an issuance above either cap.
3. A revoked mint authority is final. No instruction restores it.
4. A completed project and a cancelled project are terminal. The program refuses
   a transition out of either status.
5. The market fee has a cap. The current cap is 200 basis points.
6. A payout uses the balance at the record date. A later transfer does not
   change the entitlement.
7. The audit table takes inserts only.

## 12. Known gaps

| Gap | Risk | Action |
| --- | --- | --- |
| The rate-limit store is in process memory. | The limit fails behind more than one server. | Move the store to a shared cache. |
| The settlement writes the database before the chain. | A failed chain call leaves a wrong row. | Keep the reconciliation sweep. Add an automatic retry. |
| The four programs have no external audit. | An unknown defect can reach mainnet. | Complete an audit before the mainnet deployment. |
| The identity documents sit in one region. | A data-residency rule can forbid this. | Confirm the rule for each market. |
| The `investments` table holds two status columns. | A reader can use the wrong column. | Remove `status_legacy` after the migration. |
| The wallet address check accepts an EVM format. | A Solana address fails the check. | Correct the constraint before the Solana-only release. |

## 13. Migration notes

The old system used React and server routes in one application. The new system
uses three Symbols projects and one shared library.

| Old | New |
| --- | --- |
| One application, all pages | Three surfaces, one purpose each |
| Utility CSS classes | Design-system tokens in `brand/designSystem` |
| React components per page | Objects in `brand/components` |
| Client state in hooks | Root state and page `onCreate` |
| Route files under `app/` | One file per route under `<surface>/pages/` |
| Admin pages inside the investor application | A separate governance surface |

Rules for the new code:

1. Use a design-system token. Never write a raw pixel value or a hexadecimal
   colour.
2. Reference a component by its key name. Never import one project file into
   another.
3. Put a reusable component in `brand/`. Put a page section in its surface.
4. Read the eligibility flags. Never read the display tier.
5. Write an audit row for each authority action.
