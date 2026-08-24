# Fractyco Brand — Design System Reference

The visual identity comes from the 2026 brandbook (`Brandbook.ai` at the repo
root — an Illustrator/PDF file, 28 pages). **The brandbook is the mandatory
source of truth for the design system**; everything in
`packages/brand/designSystem/` derives from it. External references
(prypco.com, the Dropify case study, `design.mp4`) informed layout and
composition only — never tokens.

> The brandbook was produced under the working title "AurumChain". The product
> name is **Fractyco** — the identity (palette, typography, mark geometry,
> patterns) applies unchanged under the Fractyco name.

## Palette

Defined once in `designSystem/color.js`; shades always via modifiers
(`navy.08`, `mist+10`), never extra hex values.

| Token | Value | Brandbook role |
| --- | --- | --- |
| `navy` | `#082439` | **Primary** — deep navy, the brand ink (45% usage) |
| `ivory` | `#F5F2EC` | **Neutral** — soft ivory, the page ground (35%) |
| `slate` | `#607D94` | **Secondary** — structure and emphasis (15%) |
| `mist` | `#A8C0CF` | **Accent** — highlights, meters, dark-mode accents (5%) |
| `navyDeep` / `navySoft` | `#041420` / `#0C344F` | derived navy steps for the dark scheme |
| `ivoryDim` / `line` / `muted` | `#EDE9E1` / `#E2DCD0` / `#5E7183` | derived light-scheme neutrals |

Semantic pairs (`[light, dark]` — index 0 is the light scheme): `title`,
`paragraph`, `caption`, `hairline`, `veil`, `veilStrong`, `accentInk`,
`activeWash`, `activeInk`, `meter`, `dangerInk`. Components reference pairs and
themes — never core hues directly — so both schemes stay in step.

**Light is the default scheme** (`globalTheme: 'light'` in every surface
config): ivory ground, navy ink — the brandbook's own presentation. Dark is
the same identity inverted onto the navy. No gradients anywhere — the brand
is flat by rule.

## Typography

Declared in `designSystem/font.js` + `font_family.js` (Google-hosted latin
subsets; the runner ignores `index.html`, so faces must load from the design
system).

| Role | Family token | Face | Brandbook spec |
| --- | --- | --- | --- |
| Body / UI | `Default` | **Inter** (variable) | Secondary typeface |
| Headings | `Display` | **Hanken Grotesk** (variable) | Stand-in for *Neue Haas Grotesk* (commercial); NHG sits ahead of it in the stack for licensed machines |
| Wordmark / display | `Brand` | **Anton** | The condensed uppercase voice of the wordmark |
| Figures | `Mono` | **IBM Plex Mono** 400/500/600 | Numeric columns must align |

Hierarchy follows the brandbook (H1 64 / H2 48 bold, H3 32 medium, body 18/16,
caption 14, label 12) through the typography sequence (base 16, ratio 1.25).

## Logo

- The mark (two open arcs holding the value diamond) was extracted from the
  brandbook vectors and lives in `designSystem/icons.js` as `logo`
  (24×24, `currentColor`). Render it only through `Icon`.
- The lockup is `components/Logo.js`: mark + `FRACTYCO` in Anton. It inherits
  `color` (defaults to the `title` pair) so chrome can tint it — the footer
  passes `color: 'ivory'`.
- Brandbook rules apply: no stretching, no shadows/glows, no color changes,
  no gradients, no rotation.

## Motifs

- **Two-tone headlines** — opening phrase in `accentInk`, payoff in `title`
  (`SectionHeading` with `titleTop` + `title`); the hero and the closing band
  set them in Anton.
- **Numbered eyebrows** — mono number + uppercase label + dashed rule with a
  diamond node (`SectionHeading`, hero eyebrow). Sections are numbered 01–06
  like the brandbook's chapters.
- **Diamond** — the mark's core shape, used as the hero headline's full stop
  and as eyebrow nodes.
- **Decorative geometry** — `designSystem/svg.js` holds the brandbook
  patterns (`diamondGrid`, `diamondField`) for band decoration; the ghost
  mark/wordmark (oversized, low-alpha, cropped) signs the hero and footer.
- **Radii** — `designSystem/shape.js`: `radiusControl` 10, `radiusCard` 16,
  `radiusSheet` 22, `radiusPill` — fixed px so product geometry doesn't drift
  with font size.

## Motion & interaction

- **Hero field** — `landing/components/HeroCanvas.js`: a raw-WebGL staggered
  diamond lattice (no dependency) with a cursor lens, click ripples, scroll
  parallax, and theme-aware flat color. Rides the framework's `onFrame` tick;
  reduced motion freezes the ambient wave; no WebGL → the static ghost mark
  stays.
- **Entrances** — masked headline lines (`lineUp`), staggered card fades
  (`revealDelay` state per instance), section reveals via IntersectionObserver
  state on `Section`, dashed rules that draw themselves (`SectionHeading`).
- **Pointer physics** — `brand/functions/interactions.js`: `tiltCard`/
  `magnetPull` write through `el.setNodeStyles` (the documented escape hatch)
  and respect reduced motion.
- **Route transitions** — `pageEnter` on the product shells' routed body.
- **Skeletons** — `Skeleton`/`SkeletonRow` (flat opacity breath, no gradient)
  gate the two live backend reads via `backendOfferingsLoaded` /
  `backendRegistryLoaded`.

## Gotchas found while building

- **`themeModifier` is broken in the current runner** (smbls 3.14): it emits
  `var(--theme-<name>-dark-background)` variables that the generator never
  defines, so the element renders transparent. For always-dark bands use
  `theme: 'inverted'` (navy in both schemes) plus explicit child colors
  (`ivory`, `mist`) and the `PillButton` `inverse` / `outline` tones.
- **Spacing tokens are em-relative** (Rule 34). On display-scale type they
  explode: `marginBottom: '-C'` on a 233px ghost word resolves to −609px and
  collapses the flex column. Use explicit `em` values for offsets that must
  track a large font.
- **`ThemeToggle` writes `data-theme` directly** (frank-audit criticals
  FA406/FA407). Deliberate: handlers run in a second realm where
  `changeGlobalTheme` targets the wrong document — see the comment block in
  `ThemeToggle.js`. These three criticals are accepted.

## Publishing

`packages/brand` is the platform library `fractyco/uikit` (bumped to
**2.0.0** for the rebrand). Publish it **before** the surfaces:
`bun run publish:all` does the ordering.
