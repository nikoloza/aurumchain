# Secondary Market Admin Control Guide

This guide details how platform administrators can control the flow of the secondary market and adjust global settings. 
These actions require interacting directly with the Solana smart contract using an authorized admin wallet.

## 1. Global Market Pause
Administrators can halt ALL trading on the secondary market simultaneously. This is useful for emergency situations or platform-wide migrations.

**Instruction:** `update_market_config`
- **Parameter:** `is_paused: bool`
- **Action:** Set to `true` to pause, `false` to resume.
- **Effect:** When `true`, no new listings can be created, and no active listings can be purchased. Existing users can still cancel their active listings to retrieve their tokens.

## 2. Per-Project Pause
Administrators can halt trading for a specific project without affecting other projects.

**Instruction:** `set_project_pause`
- **Parameter:** `project_id: string`, `is_paused: bool`
- **Action:** Set to `true` to pause the specific project.
- **Effect:** Buy and List instructions will fail for this specific project PDA.

## 3. Adjusting Platform Fees
The platform takes a global percentage fee from the seller on every secondary market transaction.

**Instruction:** `update_market_config`
- **Parameter:** `fee_basis_points: u16`
- **Action:** Define the new fee in basis points (e.g., `150` = 1.5%, `200` = 2.0%).
- **Effect:** The new fee is applied instantly to all subsequent `buy_token` executions. The fee is deducted from the stablecoins transferred to the seller and routed to the `fee_recipient` treasury wallet.

*Note: Buyer-paid fees or split fees are technically possible by modifying the config schema in the future, but the current MVP enforces seller-paid fees.*
