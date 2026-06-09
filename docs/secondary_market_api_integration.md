# Secondary Market API Integration Guide

This document outlines the API endpoints used to power the secondary market frontend and synchronize off-chain database state with on-chain Solana transactions.

## Base Path
All routes are prefixed with `/api/secondary-market`

## 1. Creating a Listing (Sell Order)

### `POST /orders/create`
Initializes a new listing in the database with a `pending` status. This locks the `locked_tokens` in the user's portfolio so they cannot double-spend them.
- **Body:** `{ projectId: string, sellerId: string, amount: number, pricePerToken: number, pdaAddress: string }`
- **Response:** `{ success: true, orderId: number }`

### `POST /orders/confirm`
Webhook called after the `list_token` Solana transaction succeeds. Transitions the order status from `pending` to `active`.
- **Body:** `{ pdaAddress: string, signature: string }`
- **Response:** `{ success: true }`

## 2. Canceling a Listing

### `POST /orders/cancel`
Called when the user initiates a cancellation flow.
- **Body:** `{ pdaAddress: string }`

### `POST /orders/cancel/confirm`
Webhook called after the `cancel_listing` Solana transaction succeeds. Transitions the order status to `cancelled` and unlocks the tokens in the user's portfolio.
- **Body:** `{ pdaAddress: string, signature: string }`
- **Response:** `{ success: true }`

## 3. Buying a Listing

### `POST /buy`
Can be used to validate the buyer's balance or eligibility before signing the transaction on the client.

### `POST /buy/confirm`
Webhook called after the `buy_token` Solana transaction succeeds.
- Deducts the `amount_purchased` from the seller's active listing.
- If the listing remaining amount hits `0`, updates the status to `filled`.
- A database trigger automatically transfers the tokens from the seller's portfolio to the buyer's portfolio.
- **Body:** `{ pdaAddress: string, buyerId: string, amountPurchased: number, signature: string }`
- **Response:** `{ success: true }`

## 4. Reading Data

### `GET /listings?projectId=<id>`
Fetches all `active` listings for a given project.
- **Response:** Array of active listing objects.

### `GET /orderbook?projectId=<id>`
Fetches an aggregated view of the orderbook (depth chart).
- **Response:** Array of aggregated volume at specific price points.
