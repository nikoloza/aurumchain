# Claude Instructions — Fractyco

Fractyco tokenizes real-world assets on Solana. The front end is three Symbols
surfaces plus a shared design system under `packages/` (Bun workspaces);
everything else is chain and backend (Anchor programs, `lib/` service layer,
Supabase schema, integration tests).

Read `README.md` first, then the docs it points to in `docs/` —
`docs/SMBLS.md` is required reading before writing any DOMQL, and
`docs/DESIGN.md` (the applied composition/motion language: the hero
ring-world, the world switch driving the page scheme, section
choreography, interaction rules) before styling or designing anything.

## Symbols MCP — MANDATORY

**ALWAYS use `symbols-mcp` tools** (configured in `.mcp.json`) when working on
anything in `packages/` — components, pages, layouts, design system, state,
routing, or project structure.

Required sequence — do NOT skip steps:

1. `mcp__symbols-mcp__get_project_context` — resolves owner/key/env from the
   surface's `symbols.json`
2. `mcp__symbols-mcp__get_project_rules` — before generating any component or page
3. `mcp__symbols-mcp__generate_component` / `generate_page` — for new code
4. `mcp__symbols-mcp__audit_component` — after each component
5. `mcp__symbols-mcp__search_symbols_docs` — for any uncertain pattern

Do NOT write Symbols/DOMQL code from memory or intuition alone.

## DOMQL v3.14 — Required Syntax

This repo runs smbls v3.14. v3 syntax is not acceptable — verify against
`get_project_rules` / `get_sdk_reference` before writing, and migrate any v3
pattern you find as part of the fix.

## Component Rules (enforced)

- Components are plain objects — never functions or classes
- No imports between project files — reference components by PascalCase key name
- `extends` and `childExtends` must be quoted strings
- Design system keys are always lowercase (`color`, `theme`, `typography`)
- ALL values use design system tokens — no raw px, no hex colors
- Navigation: `el.router(path, el.getRoot())` — never `window.location`
- Links: `extends: 'Link'` with `href` prop — never `attr: { href }`
- Collections: `children` + `childExtends` — never `$collection`
- Color shading: `'blue.7'`, `'gray+50'` modifiers — no Tailwind-style palettes
- CSS nesting: `'@dark': { ':hover': {} }` — never chained selectors like `'@dark :hover'`
- `cases.js` at root level — NOT inside `designSystem/`

## No Hacks. No Workarounds. Ever.

If something doesn't work, do not patch around it — diagnose the root cause and
fix it at the right level (design system, `packages/brand`, or the framework).
Never `!important`, selector hacks, raw DOM APIs, hardcoded values where tokens
exist, or wrapper divs to hide broken behavior.

## Workflows

- Surfaces run through portless (stable .localhost URLs, `$PORT` injected):
  `bun run start:landing` → fractyco.localhost:1355, `start:dashboard` →
  fractyco-app.localhost:1355, `start:governance` → fractyco-gov.localhost:1355,
  `start:brand` → fractyco-brand.localhost:1355; `bun run publish:all` to publish
- Shared design system and component library live in `packages/brand` — extend
  there, not per-surface
- Chain: `bun run sync-idl` after program changes; integration tests via
  `bun run test:*` scripts
- Data on the surfaces is mostly placeholder — see README "Data — live vs
  placeholder" before trusting or wiring any number

## Test Before Finishing

Every change must be verified end-to-end: run relevant tests, start the dev
server, check the change visually, and check the console for new errors. For
component/design-system changes, audit with `mcp__symbols-mcp__audit_component`.
