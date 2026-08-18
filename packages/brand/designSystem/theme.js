// ── Fractyco themes ─────────────────────────────────────────────────────────
// Dark is the product default (a navy trading surface). Light stays available
// for the marketing site and for print-style exports.

export default {
  document: {
    '@light': { background: 'paper', color: 'ink' },
    '@dark': { background: 'navyDeep', color: 'white.92' }
  },

  // Page wash used to separate stacked sections
  surface: {
    '@light': { background: 'mist', color: 'ink' },
    '@dark': { background: 'navy', color: 'white.86' }
  },

  // Standard panel
  card: {
    '@light': { background: 'white', color: 'ink', border: '1px solid line' },
    '@dark': { background: 'navySoft', color: 'white.9', border: '1px solid white.08' }
  },

  // Focus panel — the one card in a row that carries the accent
  accentCard: {
    '@light': { background: 'navy', color: 'white', border: '1px solid navy' },
    '@dark': { background: 'navySoft', color: 'white', border: '1px solid gold.32' }
  },

  // Primary action
  primary: {
    '@light': { background: 'gold', color: 'navyDeep' },
    '@dark': { background: 'gold', color: 'navyDeep' }
  },

  // Outlined action
  secondary: {
    '@light': { background: 'white', color: 'ink', border: '1px solid line' },
    '@dark': { background: 'white.06', color: 'white.92', border: '1px solid white.16' }
  },

  // Quiet action — text only
  ghost: {
    '@light': { background: 'transparent', color: 'muted' },
    '@dark': { background: 'transparent', color: 'white.6' }
  },

  // Small label
  chip: {
    '@light': { background: 'white', color: 'muted', border: '1px solid line' },
    '@dark': { background: 'white.05', color: 'white.66', border: '1px solid white.1' }
  },

  chipAccent: {
    '@light': { background: 'gold.16', color: 'goldDark' },
    '@dark': { background: 'gold.14', color: 'goldLight' }
  },

  // Status chips
  chipPositive: {
    '@light': { background: 'green.12', color: 'green' },
    '@dark': { background: 'green.16', color: '#66d3a0' }
  },
  chipNegative: {
    '@light': { background: 'red.12', color: 'red' },
    '@dark': { background: 'red.18', color: '#ff8a86' }
  },
  chipPending: {
    '@light': { background: 'amber.14', color: '#9a6f10' },
    '@dark': { background: 'amber.16', color: '#f0c463' }
  },

  // Application chrome
  nav: {
    '@light': { background: 'white.86', color: 'ink' },
    '@dark': { background: 'navyDeep.82', color: 'white.92' }
  },

  rail: {
    '@light': { background: 'white', color: 'ink', border: '1px solid line' },
    '@dark': { background: 'navy', color: 'white.86', border: '1px solid white.06' }
  },

  divider: {
    '@light': { borderColor: 'line' },
    '@dark': { borderColor: 'white.08' }
  },

  // Stays dark in both modes
  inverted: {
    '@light': { background: 'navyDeep', color: 'white' },
    '@dark': { background: 'black', color: 'white' }
  },

  none: { color: 'none', background: 'none' },
  transparent: { color: 'currentColor', background: 'transparent' }
}
