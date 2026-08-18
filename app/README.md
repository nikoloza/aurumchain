# Fractyco — app

The investor dashboard: overview, offerings, portfolio, marketplace, payouts,
transactions, wallet, identity, settings.

**Demo:** https://fractyco--app.at.symbo.ls — sign in with the demo account
from the repo-root `.env`.

```sh
npm run start   # http://localhost:5041
```

Auth and data run against the live Supabase project
(`qetdqwmmnpmgrixkorqg`): real sign-in/sessions and a live Offerings read;
the remaining pages carry labeled demo data until the tables are seeded. All
components come from [`../brand`](../brand) — this package holds only pages.
