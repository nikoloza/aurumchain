# Working with smbls in this repo

A field guide to the Symbols toolchain as this repo actually uses it. The
generic reference lives in the framework docs; everything below is specific,
and every non-obvious rule here was learned the hard way (see the in-code
comments it points to).

## How it works

Each surface is a Symbols/DOMQL project: plain-object components, no imports
between project files (components reference each other by PascalCase key),
pages under `pages/` with `pages/index.js` as the only import-based registry.
`index.js` calls `create(app, {...})` for the dev bundler; `context.js`
exports the same shape for frank, the serializer that turns the project into
the JSON snapshot the platform stores and serves.

The shared library: `packages/brand/` is both a local folder and the platform library
`fractyco/uikit`. Locally each surface imports `@fractyco/brand/context.js` from its
`sharedLibraries.js`; on the platform the library is registered in each
project's `useLibraries`, and the serve pipeline embeds its components and
design system into the published page. **Both halves must stay in step** — a
component moved into `packages/brand/` reaches production only after the library is
republished.

Two runtime facts that shape all handler code here:

- **Handlers run in a second realm.** Bare `document`, `window`, and
  `localStorage` are the wrong objects in the dev runner AND the published
  runtime, and `requestAnimationFrame` callbacks never fire there. Reach the
  page through `el.node.ownerDocument` (and its `defaultView`), and scroll
  with single direct `scrollTop` writes. See `packages/brand/components/NavItem.js`
  and `packages/brand/functions/auth.js`.
- **The platform boots the first key of the server-side pages map**, and an
  unchanged page produces no push diff, so key order can only be changed by
  renaming a route. That is why the sign-in route is `/signin` and registered
  last in `pages/index.js`.

## Run

```sh
bun install            # once, from the repo root
bun start              # all three dev servers (5040/5041/5042), prefixed logs
bun run start:dashboard      # a single surface
```

Dev servers are the smbls runner with livesync. Framework-level changes need
a cache clear: `rm -rf .parcel-cache .symbols_local/symbols-runner-cache` in
the surface, then restart. `bunx smbls frank-audit` inside a surface lints the
project against framework rules — keep criticals at zero.

## Publishing

```sh
bun run publish:all    # every surface, then the brand library
# or per package:
cd packages/dashboard && bunx smbls publish --yes --non-interactive
```

`publish` = push (extract + upload the snapshot as a new version) + mark the
version published + deploy it to the development, staging, and production
environment slots. Direct URLs: `fractyco--<key>.at.symbo.ls` (production),
`fractyco--<key>--staging.at.symbo.ls`, `--development`.

Order matters when `packages/brand/` changed: **publish `packages/brand` first, then the
surfaces** — the surfaces' served pages embed the library at their own
publish time.

Two guards you will meet:

- The zero-push guard refuses a push that would empty a section the server
  still has (usually a broken extract). When the emptying is intentional,
  re-run with `SMBLS_ALLOW_ZERO_PUSH=1`.
- Environment deploys spend workspace credits; version publishing does not.
  A credits failure leaves the version pushed — deploys can be retried later.

## Workspace, org, and channels

The projects live under org **`fractyco`**, workspace **`default`**, on the
production API. Keys: `landing`, `app`, `governance`, and the library
`uikit`. Useful commands: `smbls org list`, `smbls workspace list`,
`smbls project list --search fractyco`, `smbls libs status`.

**Always check the channel before create/push/publish/upload:**
`bunx smbls channels` — the ● must be on `https://api.symbols.app`.
my.symbols.app talks to production; the CLI can be silently pinned to the dev
API by a stale `.symbols_local/config.json` (`channel`/`apiBaseUrl`), and
everything pushed there simply never appears in the UI. Switch with
`bunx smbls channels --server https://api.symbols.app`.

Per-surface local state lives in `.symbols_local/` (gitignored):
`config.json` pins the channel and project id, `lock.json` the branch.
`smbls project link . --id <id>` rewrites them when a folder needs to be
re-attached to its platform project.

## Docs and files on the platform

- `bunx smbls docs push` (from a folder with `docs/*.md`) syncs Markdown docs
  to the workspace — they appear under **Notes** at
  my.symbols.app/w/fractyco/default/notes. Frontmatter carries
  title/folderPath/tags; `_serverHash` handles conflict detection. The
  landing package's `docs/` holds the mirrored SPEC.md.
- `bunx smbls files upload <path> --key <key> --visibility public` uploads a
  file and records it in the project's `files` map
  (`packages/landing/files/spec.js` is such a record). Private files are only
  readable through the authenticated `/core/files/<id>/download` endpoint.

## symbols-mcp — the framework assistant for AI agents

[`symbols-mcp`](https://github.com/symbo-ls/symbols-mcp) is the MCP server
for the Symbols stack: documentation search, the mandatory framework
ruleset, code generation/conversion, auditing, and platform project
management — usable from Claude Code, Cursor, claude.ai, or any MCP client.
Documentation tools need no account; project-management tools log in to the
platform.

Hook it up (Claude Code):

```sh
claude mcp add symbols-mcp -- uvx symbols-mcp      # recommended, auto-updates
# or: claude mcp add symbols-mcp -- bunx -y @symbo.ls/mcp
```

How this repo expects agents to use it:

- **Before writing any DOMQL**, call `get_project_context` (resolves
  owner/key/env from the nearest `symbols.json`) and `get_project_rules`
  (the mandatory ruleset — v3 syntax, plain-object components, no
  cross-file imports, token-only styling). Do not write Symbols code from
  memory.
- **When unsure of a pattern**, `search_symbols_docs` /
  `get_sdk_reference` / `get_cli_reference` instead of guessing.
- **While generating**, `audit_component` validates a single component
  inline; `bunx -y @symbo.ls/mcp symbols-audit <dir>` (frank-audit
  underneath, the same engine as `bunx smbls frank-audit`) sweeps a whole
  package — this repo keeps criticals at zero.
- The generation/conversion tools (`generate_component`, `generate_page`,
  `convert_react`, `convert_html`, `convert_to_json`) and the platform
  tools (`login`, `list_projects`, `save_to_project`, `publish`, `push`)
  cover the full loop from prompt to deployed project without the CLI —
  in this repo the CLI flow above is the primary path, and the MCP is the
  reference and validation layer.
