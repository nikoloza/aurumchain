# Fractyco

Fractyco divides a real-world asset into tokens. An investor buys the tokens,
holds them in a personal wallet, and receives the asset's profit on-chain.

Read [SPEC.md](./SPEC.md) for the full technical specification, and
[SMBLS.md](./SMBLS.md) for how to run, publish, and operate the toolchain in
this repo — including the `symbols-mcp` assistant agents should load
before writing any DOMQL.

## Live demos

| Surface | Production | Purpose |
| --- | --- | --- |
| Landing | https://fractyco--landing.at.symbo.ls | Marketing site |
| App | https://fractyco--app.at.symbo.ls | Investor dashboard |
| Governance | https://fractyco--governance.at.symbo.ls | Operator / compliance console |

Staging and development follow the pattern
`fractyco--<surface>--staging.at.symbo.ls` / `--development`. The dashboards
sign in against the live Supabase backend; the demo account lives in `.env`
(not committed).

## Layout

```
fractyco/
├── brand/          design system + component library, shared by every surface
├── landing/        marketing site                     (port 5040)
├── app/            investor application               (port 5041)
├── governance/     operator and compliance console    (port 5042)
├── supabase/       database schema and migrations — borrowed from `main`, unchanged
├── scripts/        the cross-surface runner
├── SPEC.md         technical specification
└── .legacy/        reference worktree — the pre-Symbols source, on `main`
```

## Run

```sh
npm install          # hoists smbls + parcel for every workspace
npm start            # all three dev servers in one terminal, prefixed output
npm run start:app    # or one surface at a time
npm run build        # production build per surface
npm run publish:all  # push + publish every surface, then the brand library
```

Each surface links `brand/` through its `symbols.json`
(`"fractyco/uikit": {}` on the platform, `../brand` locally). Put a reusable
component in `brand/`; a surface keeps only its pages and the sections those
pages compose.

## Branches

| Branch | Contents |
| --- | --- |
| `main` | The original Next.js and Anchor source. Reference only. |
| `next` | The Symbols rebuild. Keeps `supabase/` from `main`; everything else is new. |

## Platform

The surfaces are Symbols projects under the `fractyco` org on production
(`api.symbols.app`): keys `landing`, `app`, `governance`, plus the `uikit`
library (the `brand/` folder). `smbls publish` inside any package pushes and
deploys it to development, staging, and production.
