// What becomes a token. Six asset classes as calm tiles — icon on a mist
// wash, name, and the one-line reality of how that class settles here.
export const AssetsSection = {
  extends: 'Section',
  id: 'assets',
  theme: 'surface',

  Inner: {
    SectionHeading: {
      state: {
        num: '02',
        eyebrow: 'Asset classes',
        titleTop: 'If it produces yield,',
        title: 'it can be tokenized.',
        lead:
          'The registry holds the asset class as metadata; the mechanics stay identical. One supply cap, one compliance hook, one payout path — whatever the underlying.'
      }
    },

    Grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'A1',
      '@tabletL': { gridTemplateColumns: 'repeat(2, 1fr)' },
      '@mobileL': { gridTemplateColumns: '1fr' },

      childExtends: 'AssetTile',
      childrenAs: 'state',
      children: [
        { revealDelay: '0s', icon: 'layers', name: 'Real estate', line: 'Rental income distributes as USDC each epoch.' },
        { revealDelay: '.07s', icon: 'coins', name: 'Mining & metals', line: 'Extraction revenue settles against the registry.' },
        { revealDelay: '.14s', icon: 'chart', name: 'Energy', line: 'Generation contracts pay out on delivery.' },
        { revealDelay: '.21s', icon: 'globe', name: 'Infrastructure', line: 'Long-dated concessions, fractioned to entry size.' },
        { revealDelay: '.28s', icon: 'document', name: 'Agriculture', line: 'Harvest cycles map onto distribution epochs.' },
        { revealDelay: '.35s', icon: 'wallet', name: 'Private credit', line: 'Repayment schedules stream to token holders.' }
      ]
    }
  }
}

// One asset-class tile. state: { icon, name, line }
export const AssetTile = {
  flow: 'y',
  gap: 'Z',
  padding: 'B1',
  position: 'relative',
  borderRadius: 'radiusCard',
  theme: 'card',
  CardPin: {},
  transition: (el, s) => 'opacity .8s cubic-bezier(.22,.68,.24,.98) ' + (s.revealDelay || '0s') + ', transform .25s ease, border-color .25s ease',
  opacity: '0',
  isRevealed: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
  '.isRevealed': { opacity: '1' },
  '@reduceMotion': { opacity: '1', transition: 'none' },
  onMousemove: (ev, el) => el.call('tiltCard', ev),
  onMouseover: (ev, el, s) => { if (!s.hovered) s.update({ hovered: true }, { preventFetch: true }) },
  onMouseout: (ev, el, s) => {
    el.call('tiltReset', ev)
    if (ev.relatedTarget && el.node && el.node.contains(ev.relatedTarget)) return
    if (s.hovered) s.update({ hovered: false }, { preventFetch: true })
  },
  ':hover': { transform: 'translateY(-3px)', borderColor: 'slate.45' },

  Glyph: {
    flow: 'x',
    align: 'center center',
    width: 'C',
    height: 'C',
    borderRadius: 'radiusControl',
    background: 'activeWash',
    color: 'accentInk',
    transition: 'background .3s ease, color .3s ease, transform .35s cubic-bezier(.34,1.5,.5,1)',
    // Tile hover flips the glyph to the accent and pops it. State-driven —
    // a child key can't live inside the tile's ':hover', and the hoisted
    // ':hover &' form matches ANY hovered ancestor (body included).
    isHovered: (el, s) => !!s.hovered,
    '.isHovered': { background: 'accentInk', color: 'ivory', transform: 'scale(1.08) rotate(-4deg)' },
    Icon: { name: (el, s) => s.icon || 'layers', fontSize: 'A2' }
  },

  H3: {
    fontFamily: 'Display',
    fontSize: 'A1',
    fontWeight: '600',
    letterSpacing: '-.015em',
    color: 'title',
    margin: '0',
    text: (el, s) => s.name || ''
  },

  P: {
    fontSize: 'Z1',
    lineHeight: '1.6',
    color: 'paragraph',
    margin: '0',
    text: (el, s) => s.line || ''
  }
}
