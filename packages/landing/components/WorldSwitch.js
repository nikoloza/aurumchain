// The world switcher — above ground / underground, now living in the navbar
// chrome. It drives ROOT state (`heroWorld`), which dives the hero's WebGL
// camera below the surface, turns the band navy, and swaps the editorial
// column for the other audience. As chrome it follows the page theme (the
// hero band below keeps its own invariant light); the active segment carries
// the wash, the idle one stays quiet.
export const WorldSwitch = {
  position: 'relative',
  flow: 'x',
  align: 'center center',
  borderRadius: 'radiusPill',
  border: '1px solid hairline',
  background: 'veil',

  role: 'group',
  ariaLabel: 'Choose a world',

  Thumb: {
    tag: 'span',
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '0',
    width: '50%',
    borderRadius: 'radiusPill',
    background: 'activeWash',
    transition: 'transform .45s cubic-bezier(.22,.68,.24,.98)',
    isUnder: (el, s) => s.root.heroWorld === 'under',
    '.isUnder': { transform: 'translateX(100%)' }
  },

  Above: {
    tag: 'button',
    position: 'relative',
    flex: '1',
    padding: 'Y A',
    fontSize: 'Y1',
    fontWeight: '600',
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'activeInk',
    transition: 'color .45s ease',
    text: 'Above ground',
    ariaPressed: (el, s) => String(s.root.heroWorld !== 'under'),
    isUnder: (el, s) => s.root.heroWorld === 'under',
    '.isUnder': { color: 'caption' },
    onClick: (ev, el, s) => s.rootUpdate({ heroWorld: 'above' }, { preventFetch: true })
  },

  Under: {
    tag: 'button',
    position: 'relative',
    flex: '1',
    padding: 'Y A',
    fontSize: 'Y1',
    fontWeight: '600',
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'caption',
    transition: 'color .45s ease',
    text: 'Underground',
    ariaPressed: (el, s) => String(s.root.heroWorld === 'under'),
    isUnder: (el, s) => s.root.heroWorld === 'under',
    '.isUnder': { color: 'activeInk' },
    onClick: (ev, el, s) => s.rootUpdate({ heroWorld: 'under' }, { preventFetch: true })
  }
}
