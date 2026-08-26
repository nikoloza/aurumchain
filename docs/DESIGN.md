# Fractyco Design — Composition & Motion Language

Where [BRAND.md](./BRAND.md) defines the identity (palette, type, tokens),
this document defines how the surfaces USE it: the hero's ring-world, the
motion system, the section choreography, and the interaction rules every new
piece of UI must follow. Read both before designing anything.

## The hero — a spatial ring-world

`packages/landing/components/HeroCanvas.js` renders the opening band: a
full-viewport WebGL1 scene (two programs — GL_LINES hairlines under diamond
point sprites) built around the centered editorial column.

**Composition.** A dashed surface ellipse floats around the copy like a
horizon seen from just above. A compact torus web of ~210 nodes hugs the
text. On the ellipse's far arc stands a Tbilisi skyline in line-art
constellations — the Mtatsminda TV tower (tripod, ring, mast), Sameba's
stepped dome, two old-town gable rows with balcony ticks, Narikala's
crenellated wall, the Bridge of Peace canopy, a funicular dash. Beneath the
same plane hang the underground holdings: qvevri buried to their necks,
Abanotubani bath domes crowning from below, roots, two dashed strata rings,
and the ore body — a 3D diamond lattice threaded with **gold**: nugget
clusters (amber `#C08F3F`-family, the one warm accent the brand allows) and
gold-to-gold vein edges, glinting on a slow sparkle.

**The two worlds.** The world switcher (navbar, top center; root state
`heroWorld`) dives the camera below the surface plane. Above ground is the
market — the investor stack on the ivory band; underground is the asset —
the owner stack on navy. The circulation never stops: fractions extracted
off the ore crown rise through the surface, live aloft over the city, then
settle home and re-crystallize. Extracted gold rises as gold.

**Theme invariance (hard rule).** The hero's worlds keep their own light in
BOTH page schemes: the band is explicitly `ivory` above ground and `navy`
underground, every ink inside the stacks is explicit for its world
(`navy`/`slateInk`/`muted` above, `ivory`/`mist` under), and the canvas
palette ignores `data-theme`. Chrome (the navbar) carries the page theme
instead — on the home page it is frosted from the very top for that reason.
The theme-invariant slate inks live in `designSystem/color.js` as
`slateInk` / `slateInkDeep`; the PillButton tones `solid` and `paper` are
the ivory-band mirror of `inverse` and `outline` (the navy-band tones).

**Interactions.** The cursor tilts the camera a few degrees, is wind above
ground and a drill below it (screen-space projection against the ore); a
click lands a settlement ring — an expanding diamond outline — that hurries
airborne fractions home; a fading slipstream rides the pointer in both
worlds. Reduced motion renders the world frozen; no WebGL falls back to the
ghost mark (`webglOk` gate).

## Motion system

Timing tokens come from the `timing` family (`brandEase`
`cubic-bezier(.22,.68,.24,.98)` is the house curve; the bouncy pop is
`cubic-bezier(.34,1.5,.5,1)`). Keyframes live in
`packages/brand/designSystem/animation.js`.

| Move | Where | Mechanics |
| --- | --- | --- |
| Route veil | every landing page | `routeVeil` (brand functions) stages root state: a band curtain (navy in light, graphite in dark) wipes up over the old page (`clip-path` inset), the router swaps under cover, the veil peels off the new page. The stage lives on root state so the next page mounts already covered — no flash. |
| Masked line rise | hero, PageHero, SectionHeading, ClosingSection | headline lines rise out of `overflow: hidden` masks (`lineUp` on mount; state-gated transitions on scroll reveal). Masks carry a `.1em` pad so descenders never clip. |
| Section reveal | every `Section` | an IntersectionObserver flips `inView` once; the heading choreographs (diamond pop → eyebrow fade → rule draw → lines rise → lead settles) while cards fade in on per-item `revealDelay` and their board pins land after. |
| Rail glide | How section, HookFlow | a diamond glides the length of a dashed rail (`railGlide`) — once after the state-machine rail draws, on an infinite loop through the transfer hook. |
| Bar sweep | live funding meters | a hard-edged skewed strip (`barSweep`) — flat color, no gradient — sweeps the fill while an offering is open; the status chip carries a breathing dot (`pulseAccent`). |
| Ambient | closing band | the diamond lattice drifts (`floatY`) and a dashed ellipse ring — the hero's surface echoed — turns at 90s (`spin`). |

Everything honors `@reduceMotion` (the media token): animations off,
choreography pre-settled.

## Section system

- **Rhythm**: sections pad `E1 C` with `C2` inner gap; card grids gap `A1`;
  cards pad `B1` (`B` for dense cards).
- **Numbered watermarks**: `SectionHeading` renders `num` twice — in the
  eyebrow and as an oversized Anton ghost (`veilStrong` ink) behind the
  heading's top-right.
- **Board pins**: `CardPin` (brand) — a small accent diamond that lands on a
  card's top edge after its reveal. Cards using it must be
  `position: relative` and must not clip overflow.
- **Bespoke marks over borrowed chrome**: a marketing card never reuses app
  chrome for a label (the program cards carry a diamond + mono caption, not
  a `Chip`).
- **Schematics**: mechanism sections earn a drawn artifact — the compliance
  split pairs its heading with `HookFlow` (wallet → transfer hook → wallet
  on a dashed track with a gliding packet); on-chain pairs its cards with
  the settlement terminal.

## Chrome

The navbar keeps three zones: hamburger + logo (left), the world switcher
(top center, home only), account actions (right). The hamburger sheet holds
the six pages and the theme row. The active page's entry stays lit
(`s.root.route` — the router maintains it). Inner pages ride a transparent
bar that frosts on scroll; the home page is frosted from the top (see theme
invariance above).

Landing routes: `/` (the full editorial scroll) plus a dedicated page per
menu item — `/how`, `/offerings`, `/compliance`, `/platform`, `/company`,
`/faq` — each composed from the same section components under a `PageHero`.

## App shell (dashboard & governance)

Both product surfaces share one shell (`packages/brand`): a sticky left rail
that collapses to an icon strip below `tabletL` (labels return as native
tooltips), with the network pill and wallet address anchored to its bottom
edge; a slim topbar carrying only a mono breadcrumb (diamond + page name)
and the account block; and an editorial page head inside the content column —
Display-face title over a dashed hairline — set by each page through
`openPage`. The content column caps at `J` and centers. KPI figures sit in
one joined band: tiles on the `panel` fill separated by `V`-wide seams that
let the band's hairline ground read through, with the accent underline
sweeping in on hover (same gesture as the landing's market figures).

## Interaction rules (enforced by review)

- Every interactive element declares `:hover`, `:active`, `:focus-visible`
  on its primitive (Rule 65). Hover changes fill, never opacity.
- Parent-hover styling a child: use STATE (`onMouseover`/`onMouseout` →
  `.isHovered` on the child). A PascalCase key inside `':hover'` is dropped
  by the engine, and the hoisted `':hover &'` form matches ANY hovered
  ancestor — body included.
- Child keys are lookups: never name an inline child after a registered
  component (`Rail`, `Chip`, `Section`, …) unless extending it is the
  intent — the resolver walks built-ins → shared libraries → project.
- No gradients, ever. Flat fills, hairlines, and the diamond motif carry
  the depth; the only warm accent is the underground gold.
