// ── Fractyco themes ─────────────────────────────────────────────────────────
// Light is the brand's presentation ground (soft ivory, deep navy ink); dark
// sits on neutral graphite so the navy family stays the accent there. Surfaces stay flat — weight
// comes from the navy, air from the ivory.

export default {
  document: {
    '@light': { background: 'ivory', color: 'ink' },
    '@dark': { background: 'charcoalDeep', color: 'ivory.92' }
  },

  // Page wash used to separate stacked sections
  surface: {
    '@light': { background: 'ivoryDim', color: 'ink' },
    '@dark': { background: 'charcoal', color: 'ivory.86' }
  },

  // Standard panel
  card: {
    '@light': { background: 'white', color: 'ink', border: '1px solid line' },
    '@dark': { background: 'charcoalSoft', color: 'ivory.9', border: '1px solid ivory.08' }
  },

  // Focus panel — the one card in a row that carries the brand's weight
  accentCard: {
    '@light': { background: 'navy', color: 'ivory', border: '1px solid navy' },
    '@dark': { background: 'navy', color: 'ivory', border: '1px solid mist.32' }
  },

  // Primary action — navy on ivory; inverts to ivory on navy in dark
  primary: {
    '@light': { background: 'navy', color: 'ivory' },
    '@dark': { background: 'ivory', color: 'navy' }
  },

  // Outlined action
  secondary: {
    '@light': { background: 'white', color: 'ink', border: '1px solid line' },
    '@dark': { background: 'ivory.06', color: 'ivory.92', border: '1px solid ivory.16' }
  },

  // Quiet action — text only
  ghost: {
    '@light': { background: 'transparent', color: 'muted' },
    '@dark': { background: 'transparent', color: 'ivory.6' }
  },

  // Small label
  chip: {
    '@light': { background: 'white', color: 'muted', border: '1px solid line' },
    '@dark': { background: 'ivory.05', color: 'ivory.66', border: '1px solid ivory.1' }
  },

  chipAccent: {
    '@light': { background: 'mist.4', color: '#2C4E68' },
    '@dark': { background: 'mist.14', color: 'mist' }
  },

  // Status chips
  chipPositive: {
    '@light': { background: 'green.12', color: 'green' },
    '@dark': { background: 'green.16', color: '#5FC69B' }
  },
  chipNegative: {
    '@light': { background: 'red.12', color: 'red' },
    '@dark': { background: 'red.18', color: '#F0928C' }
  },
  chipPending: {
    '@light': { background: 'amber.16', color: '#8A6420' },
    '@dark': { background: 'amber.16', color: '#E4BE72' }
  },

  // Application chrome
  nav: {
    '@light': { background: 'ivory.82', color: 'ink' },
    '@dark': { background: 'charcoalDeep.82', color: 'ivory.92' }
  },

  rail: {
    '@light': { background: 'white', color: 'ink', border: '1px solid line' },
    '@dark': { background: 'charcoal', color: 'ivory.86', border: '1px solid ivory.06' }
  },

  divider: {
    '@light': { borderColor: 'line' },
    '@dark': { borderColor: 'ivory.08' }
  },

  // Stays navy in both modes — the brand's dark band
  inverted: {
    '@light': { background: 'navy', color: 'ivory' },
    '@dark': { background: 'navy', color: 'ivory' }
  },

  none: { color: 'none', background: 'none' },
  transparent: { color: 'currentColor', background: 'transparent' }
}
