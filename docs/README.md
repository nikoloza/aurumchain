# Fractyco documentation

Everything below is a Markdown document in this folder. The repo-root
[README.md](../README.md) is the entry point.

## Start here

| Document | Covers |
| --- | --- |
| [SPEC.md](./SPEC.md) | The technical specification — planes, data model, programs, flows, route contract. |
| [SMBLS.md](./SMBLS.md) | The Symbols toolchain: how it runs, how to publish, workspace and channel traps, `symbols-mcp`. Read before writing DOMQL. |
| [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) | Full deployment: four Solana programs, program IDs, IDLs, environment, database, indexer, CLI, publishing the surfaces. |

## Work in flight

| Document | Covers |
| --- | --- |
| [TODO.md](./TODO.md) | Product and frontend work. |
| [TODO_BACKEND.md](./TODO_BACKEND.md) | An audit of what the live `aurc.app` backend actually uses, and the tasks to carry it onto the rebuild. |

## Reference

| Document | Covers |
| --- | --- |
| [api.md](./api.md) | Every `app/api/*` route and what it handles. **Served by `main`, not by `next`.** |
| [deployment.md](./deployment.md) | The short program-deployment and IDL-sync procedure. |
| [investor_purchase.md](./investor_purchase.md) | The purchase and distribution lifecycle, on-chain and off. |
| [secondary_market_admin_guide.md](./secondary_market_admin_guide.md) | Operator controls for the secondary market — direct program calls. |
| [secondary_market_api_integration.md](./secondary_market_api_integration.md) | The secondary-market endpoints and their on-chain confirmation steps. |

## Reading these after the Symbols migration

The front end moved from Next.js to three Symbols surfaces under `packages/`,
and the package manager is Bun. What that means per document:

- **Unaffected** — the programs, IDLs, PDAs, database schema, CLI scripts and
  integration tests. `deployment.md`, `secondary_market_admin_guide.md` and
  the chain half of `investor_purchase.md` apply as written, with `npm`
  replaced by `bun`.
- **Contract to reimplement** — `api.md` and
  `secondary_market_api_integration.md` describe routes that stayed on `main`.
  The services behind them are on `next`; only the HTTP shell is missing.
- **Annotated** — `DEPLOYMENT_GUIDE.md` carries a status note on every phase
  that describes UI or API behaviour, plus a route map from the old React
  paths to the new surfaces.
