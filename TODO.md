# TODO

## Product
- [ ] Point `aurc.app`, `app.aurc.app`, `gov.aurc.app` DNS at the platform
      (surfaces currently serve at `fractyco--<surface>.at.symbo.ls`).
- [ ] Seed the backend: insert rows into `projects` / `offerings` — the live
      reads on App → Offerings and Governance → Projects light up with no code
      change.
- [ ] Wire the remaining read paths in `brand/functions/backend.js`
      (portfolio, payouts, transactions, wallet, audit log — every page that
      has a backing table). Pattern: `_restFetch` + one mapper per page.
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
- [ ] Remove `investments.status_legacy` after confirming no reader uses it
      (SPEC.md §12).
- [ ] Wallet-address constraint accepts EVM format only — correct before any
      Solana-address writes (SPEC.md §12).
