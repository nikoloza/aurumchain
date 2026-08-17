# Fractyco

Fractyco divides a real-world asset into tokens. An investor buys the tokens,
holds them in a personal wallet, and receives the asset's profit on-chain.

Read [SPEC.md](./SPEC.md) for the full technical specification.

## Layout

```
fractyco/
├── brand/          shared design system and component library
├── landing/        marketing site        → aurc.app       (port 5040)
├── app/            investor application  → app.aurc.app   (port 5041)
├── governance/     control plane         → gov.aurc.app   (port 5042)
├── supabase/       database schema and migrations
├── SPEC.md         technical specification
└── .legacy/        reference worktree — the pre-Symbols source, on `main`
```

## Branches

| Branch | Contents |
| --- | --- |
| `main` | The original Next.js and Anchor source. Reference only. |
| `next` | The Symbols rebuild. Keeps `supabase/` from `main`; everything else is new. |

The old source stays available as a git worktree:

```sh
git worktree add .legacy main    # already set up; `.legacy/` is gitignored
```

## Run a surface

```sh
cd landing        # or app, or governance
smbls start       # http://localhost:5040 / 5041 / 5042
```

Each surface links the `brand/` library through its `symbols.json`. Put a
reusable component in `brand/`. Put a page section in its own surface.

## Platform

The three surfaces are Symbols projects under the `fractyco` organization on
production (`api.symbols.app`):

| Surface | Project key |
| --- | --- |
| `landing/` | `fractyco-landing` |
| `app/` | `fractyco-app` |
| `governance/` | `fractyco-governance` |

```sh
smbls push        # push the source
smbls publish     # push, publish the version, deploy the environments
```

Environment deploys need workspace credits. Version publishing does not.
