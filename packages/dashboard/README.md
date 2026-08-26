# Fractyco — dashboard

The investor dashboard: overview, offerings, portfolio, marketplace, payouts,
transactions, wallet, identity, settings.

**Demo:** https://fractyco--app.at.symbo.ls — sign in with the demo account
from the repo-root `.env`.

```sh
bun run start   # http://localhost:5041
```

## Data

- **Live** (Supabase `qetdqwmmnpmgrixkorqg`): sign-in, session gate,
  sign-out; the account email in the topbar and Settings; the Offerings list
  (`loadOfferings`).
- **Placeholder** — values hard-coded in `pages/*.js`, no backend call:
  Overview, Portfolio, Marketplace, Payouts, Transactions, Wallet, Identity,
  and every Settings row but Email.
- Offerings shows placeholders too while `projects` / `offerings` are empty —
  the loader falls back when the query returns no rows.

Nothing here writes to the backend yet. All components come from
[`@fractyco/brand`](../brand); this package holds only pages.
