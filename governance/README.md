# Fractyco — governance

The operator and compliance console, grouped by what an action changes:
Control (authorities, roles, emergency), Policy (compliance, market,
projects), Operations (subscriptions, distributions, reconciliation), and
Record (audit log).

**Demo:** https://fractyco--governance.at.symbo.ls — sign in with the demo
account from the repo-root `.env`.

```sh
npm run start   # http://localhost:5042
```

The Projects registry reads the live Supabase `projects` table; every other
page carries labeled demo data. All components come from
[`../brand`](../brand) — this package holds only pages.
