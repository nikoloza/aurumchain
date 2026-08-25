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
  // Sticky-navbar frost once the page scrolls (transparent at the very top)
  navWash: ['ivory.82', 'navyDeep.82'],
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
