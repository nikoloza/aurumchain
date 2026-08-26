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
        eyebrow: 'assets.eyebrow',
        titleTop: 'assets.titleTop',
        title: 'assets.title',
        lead: 'assets.lead'
      }
    },

    Grid: {
      display: 'grid',
      // Container-driven: auto-fit sizes the deck 3 → 2 → 1 with no media
      // queries — stacked max-width column rules proved cascade-fragile.
      // (px inside the compound value: letter tokens don't resolve in
      // minmax(), same precedent as the shadow values.)
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
      gap: 'A1',

      childExtends: 'AssetTile',
      childrenAs: 'state',
      children: [
        { revealDelay: '0s', icon: 'layers', name: 'assets.realEstate.name', line: 'assets.realEstate.line' },
        { revealDelay: '.07s', icon: 'coins', name: 'assets.mining.name', line: 'assets.mining.line' },
        { revealDelay: '.14s', icon: 'chart', name: 'assets.energy.name', line: 'assets.energy.line' },
        { revealDelay: '.21s', icon: 'globe', name: 'assets.infrastructure.name', line: 'assets.infrastructure.line' },
        { revealDelay: '.28s', icon: 'document', name: 'assets.agriculture.name', line: 'assets.agriculture.line' },
        { revealDelay: '.35s', icon: 'wallet', name: 'assets.credit.name', line: 'assets.credit.line' }
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
    text: (el, s) => el.call('polyglot', s.name, s.root.lang)
  },

  P: {
    fontSize: 'Z1',
    lineHeight: '1.6',
    color: 'paragraph',
    margin: '0',
    text: (el, s) => el.call('polyglot', s.line, s.root.lang)
  }
}
