# Fractyco — governance

The operator and compliance console, grouped by what an action changes:
Control (authorities, roles, emergency), Policy (compliance, market,
projects), Operations (subscriptions, distributions, reconciliation), and
Record (audit log).

**Demo:** https://fractyco--governance.at.symbo.ls — sign in with the demo
account from the repo-root `.env`.

```sh
bun run start   # http://localhost:5042
```

## Data

- **Live** (Supabase `qetdqwmmnpmgrixkorqg`): sign-in, session gate,
  sign-out; the account email in the topbar; the Projects registry
  (`loadRegistry` → the `projects` table).
- **Placeholder** — values hard-coded in `pages/*.js`, no backend call:
  Overview, Compliance, Subscriptions, Distributions, Market,
  Reconciliation, Audit, Roles, Authorities, Control plane, Emergency.
- Projects shows placeholders too while `projects` is empty — the loader
  falls back when the query returns no rows.

No operator action writes to the backend yet; the switches and queues are
inert. All components come from [`@fractyco/brand`](../brand); this package
holds only pages.
