// ── Fractyco palette ────────────────────────────────────────────────────────
// Carried over from the legacy platform's identity (navy canvas + gold accent)
// and extended with the neutrals a product surface needs.

export default {
  // ── Core brand ────────────────────────────────────────────────────────────
  navy: '#0a1628',        // primary canvas
  navyDeep: '#060f1a',    // deepest canvas — page background in dark
  navySoft: '#12233c',    // raised panel on navy
  gold: '#e5b35a',        // primary accent
  goldLight: '#f5d78e',
  goldDark: '#c89b3c',

  // ── Neutrals ──────────────────────────────────────────────────────────────
  white: '#ffffff',
  black: '#000000',
  ink: '#0b1220',         // body text on light surfaces
  paper: '#fbfaf7',       // page wash (light)
  mist: '#f2f0ea',        // subtle surface (light)
  line: '#e3e0d7',        // hairline (light)
  muted: '#6b7684',       // captions on light

  // ── Semantic pairs — [light, dark] ────────────────────────────────────────
  // Array order is positional: index 0 is the light scheme, index 1 the dark.
  title: ['ink', 'white'],
  paragraph: ['ink.86', 'white.74'],
  caption: ['muted', 'white.52'],
  hairline: ['line', 'white.1'],
  veil: ['black.04', 'white.06'],      // subtle fill: hovers, tracks, inputs
  veilStrong: ['black.08', 'white.12'],

  // ── Status ────────────────────────────────────────────────────────────────
  green: '#2fa36b',
  red: '#d9534f',
  amber: '#e0a32e',
  blue: '#4b7bec',
  transparent: 'rgba(0, 0, 0, 0)'
}
