# Fractyco brand library

One design system and one component set for all three surfaces.

| Surface      | Package                 | Port | Domain       |
| ------------ | ----------------------- | ---- | ------------ |
| Marketing    | `packages/landing/`     | 5040 | aurc.app     |
| Investor app | `packages/dashboard/`   | 5041 | app.aurc.app |
| Governance   | `packages/governance/`  | 5042 | gov.aurc.app |

Each surface declares this package as a Bun workspace dependency:

```json
"dependencies": { "@fractyco/brand": "workspace:*" }
```

imports the context in its `sharedLibraries.js`:

```js
import brand from '@fractyco/brand/context.js'
export default [brand]
```

and resolves the same library on the platform through its `symbols.json`:

```json
"sharedLibraries": { "fractyco/uikit": {} }
```

## What belongs here

- `designSystem/` — colour, theme, spacing, typography, icons, animation. The
  single source of truth. Never copy a token into a surface.
- `components/` — every primitive, layout shell, data-display block, and domain
  component. A surface should be able to render a whole page without defining a
  component of its own.
- `functions/` — helpers more than one surface calls, such as `openPage`.

> **A surface has no `designSystem/` folder.** `smbls init` scaffolds one, but
> a surface's `context.js` never imports it, so it is dead weight that invites
> token drift. Delete it after scaffolding; every token belongs here.

## What stays in a surface

- `pages/` — the route registry and one file per route.
- `components/` — only the sections a page composes, and chrome that hardcodes
  that surface's own navigation. The landing `Navbar` and `Hero` are the
  examples; `dashboard/` and `governance/` currently define nothing.
