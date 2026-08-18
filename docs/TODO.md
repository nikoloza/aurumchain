# TODO — product and frontend

Backend and API work is tracked separately in
[TODO_BACKEND.md](./TODO_BACKEND.md).

## Product
- [ ] Point `aurc.app`, `app.aurc.app`, `gov.aurc.app` DNS at the platform
      (surfaces currently serve at `fractyco--<surface>.at.symbo.ls`).
- [ ] **Seed the backend.** `projects` and `offerings` are empty, so the only
      two live pages (Dashboard → Offerings, Governance → Projects) fall back
      to placeholder rows. Insert rows and both go real with no code change.
- [ ] **Replace placeholder content with live reads.** Everything except
      sign-in/session, Dashboard → Offerings and Governance → Projects is
      hard-coded in `pages/*.js` — see the data table in
      [README.md](../README.md#data--live-vs-placeholder). Still placeholder:
      - Dashboard: Overview, Portfolio, Marketplace, Payouts, Transactions,
        Wallet, Identity, Settings (all rows but Email)
      - Governance: Overview, Compliance, Subscriptions, Distributions,
        Market, Reconciliation, Audit, Roles, Authorities, Control plane,
        Emergency

      Pattern: one loader per page in `packages/brand/functions/backend.js`
      (`_restFetch` + mapper), page reads `s.root.<key>`, placeholder stays as
      the empty-state fallback.
- [ ] Write paths: subscribe flow (app) and the governance queues
      (finalize / reject, epoch creation, reconciliation adopt) — each action
      must also write an `audit_logs` row.
- [ ] Add the theme toggle to the sign-in page (it renders before the topbar,
      so it currently follows the last saved choice only).

## From QA (operator persona, opinions)
- [ ] Audit log: search, filters, date range, pagination, export.
- [ ] Compliance queue: open a case, view documents, approve/reject from the
      row; rejection reason codes.
- [ ] Emergency: mark which switches need the super admin; show last-changed
      provenance per switch.

## Platform (tracked elsewhere)
- [ ] Analytics ingest 502s on prod served apps — filed as
      `INGEST-PROD-502-1` on the platform analytics board.
- [ ] my.symbols.app studio shows no project cards for `/w/fractyco/default`
      — known platform bug (`ownerSlugFromUrl` predates `/w/…` URLs); fix is
      in the pending platform release. Re-verify after it deploys.

## Housekeeping
- [ ] Re-point `app/api/*` functionality — tracked in detail in
      [TODO_BACKEND.md](./TODO_BACKEND.md), which audits what the live site
      actually uses.
- [ ] Remove `investments.status_legacy` after confirming no reader uses it
      ([SPEC.md](./SPEC.md) §12).
- [ ] Wallet-address constraint accepts EVM format only — correct before any
      Solana-address writes ([SPEC.md](./SPEC.md) §12).
- [ ] **Publish the new logo.** The aurc.app wordmark (Clash Display, bronze)
      landed in `packages/brand` (commit `1883517`) but only in git — run
      `bun run publish:all` so the brand library and the three surfaces pick
      it up on `fractyco--*.at.symbo.ls`.
- [ ] A stale dev server is holding port 5040 on the iMac, so `bun start`
      shifts the landing surface to 5043 — `lsof -ti :5040 | xargs kill`.
