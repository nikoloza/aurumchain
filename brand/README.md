# Fractyco brand library

One design system and one component set for all three surfaces.

| Surface      | Folder        | Port | Domain       |
| ------------ | ------------- | ---- | ------------ |
| Marketing    | `landing/`    | 5040 | aurc.app     |
| Investor app | `app/`        | 5041 | app.aurc.app |
| Governance   | `governance/` | 5042 | gov.aurc.app |

Each surface links this folder in its `symbols.json`:

```json
"sharedLibraries": { "fractyco/brand": { "link": "../brand" } }
```

and imports the context in its `sharedLibraries.js`:

```js
import brand from '../brand/context.js'
export default [brand]
```

## What belongs here

- `designSystem/` — colour, theme, spacing, typography, icons, animation. The
  single source of truth. Never copy a token into a surface.
- `components/` — every primitive, layout shell, data-display block, and domain
  component. A surface should be able to render a whole page without defining a
  component of its own.
- `functions/` — helpers more than one surface calls, such as `openPage`.

## What stays in a surface

- `pages/` — the route registry and one file per route.
- `components/` — only the sections a page composes, and chrome that hardcodes
  that surface's own navigation. The landing `Navbar` and `Hero` are the
  examples; `app/` and `governance/` currently define nothing.
