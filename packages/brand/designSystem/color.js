// ── Fractyco palette ────────────────────────────────────────────────────────
// From the 2026 brandbook: deep navy is the primary, slate blue the secondary,
// soft ivory the neutral ground, mist blue the accent. Flat color only — the
// brand forbids gradients — and every shade derives from these four with
// modifiers.

export default {
  // ── Core brand ────────────────────────────────────────────────────────────
  navy: '#082439',        // PRIMARY — deep navy, the brand ink
  navyDeep: '#041420',    // deepest canvas — page background in dark
  navySoft: '#0C344F',    // raised panel on navy
  slate: '#607D94',       // SECONDARY — slate blue, structure and emphasis
  mist: '#A8C0CF',        // ACCENT — mist blue, highlights and interface accents
  ivory: '#F5F2EC',       // NEUTRAL — soft ivory, the page ground in light

  // ── Dark-scheme grounds ───────────────────────────────────────────────────
  // Neutral graphite with a whisper of the slate hue. The dark scheme sits on
  // these; the navy family stays the brand ACCENT there (bands, buttons,
  // fills), so it reads as ink on gray rather than blue on blue.
  charcoalDeep: '#131619',   // page background in dark
  charcoal: '#1B2024',       // raised surface / rail in dark
  charcoalSoft: '#262C31',   // card face in dark

  // ── Neutrals ──────────────────────────────────────────────────────────────
  white: '#ffffff',
  black: '#000000',
  ink: '#082439',         // body ink on light surfaces (same hue as navy)
  paper: '#F5F2EC',       // page wash (light) — soft ivory
  ivoryDim: '#EDE9E1',    // subtle surface a step below ivory (light)
  line: '#E2DCD0',        // hairline on ivory
  muted: '#5E7183',       // captions on light — slate-gray

  // ── Semantic pairs — [light, dark] ────────────────────────────────────────
  // Array order is positional: index 0 is the light scheme, index 1 the dark.
  title: ['navy', 'ivory'],
  paragraph: ['navy.76', 'ivory.72'],
  caption: ['muted', 'mist.72'],
  hairline: ['line', 'ivory.09'],
  veil: ['navy.04', 'ivory.05'],       // subtle fill: hovers, tracks, inputs
  veilStrong: ['navy.08', 'ivory.1'],

  // Accent ink — slate-family emphasis that stays legible on both grounds
  accentInk: ['#41647F', 'mist'],
  // Theme-INVARIANT slate inks for surfaces that keep one ground in both
  // schemes (the hero's ivory band, the world switch)
  slateInk: '#41647F',
  slateInkDeep: '#2C4E68',
  // Section-wash fill as a single token pair (chips masking dashed rails)
  surfaceWash: ['ivoryDim', 'charcoal'],
  // Card face as a token pair — for surfaces that need the panel ground
  // without the card theme's border (joined bands, cell fills)
  panel: ['white', 'charcoalSoft'],
  // Sticky-navbar frost once the page scrolls (transparent at the very top)
  navWash: ['ivory.82', 'charcoalDeep.82'],
  // Active navigation wash + its ink
  activeWash: ['mist.32', 'mist.12'],
  activeInk: ['#2C4E68', 'mist'],
  // Funding meters and progress fills
  meter: ['navy', 'mist'],

  // Error ink pair — banner text on the light card / the navy card
  dangerInk: ['red', '#F0928C'],

  // ── Status ────────────────────────────────────────────────────────────────
  green: '#2E8464',
  red: '#C05B52',
  amber: '#C08F3F',
  blue: '#4C7FA4',
  transparent: 'rgba(0, 0, 0, 0)'
}
