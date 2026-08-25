// The world switcher — above ground / underground, living in the navbar
// chrome (and at the top of the hero column on phones). It drives ROOT
// state (`heroWorld`), which dives the hero's WebGL camera below the
// surface, turns the band navy, and swaps the editorial column for the
// other audience.
//
// Colors are three-mode: while the naked bar floats over the hero the pill
// follows the WORLD (ink set on the ivory band, ivory set on the navy one —
// the band keeps its own light in both schemes); once the bar frosts on
// scroll it returns to the theme pairs. `scrolled` is read off the owning
// navbar's state; the hero-column instance has none, which correctly reads
// as floating.
export const WorldSwitch = {
  position: 'relative',
  flow: 'x',
  align: 'center center',
  borderRadius: 'radiusPill',
  border: '1px solid',
  borderColor: (el, s) =>
    s.scrolled ? 'hairline' : s.root.heroWorld === 'under' ? 'ivory.2' : 'line',
  background: (el, s) =>
    s.scrolled ? 'veil' : s.root.heroWorld === 'under' ? 'ivory.06' : 'navy.04',
  transition: 'border-color .45s ease, background .45s ease',

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
    background: (el, s) =>
      s.scrolled ? 'activeWash' : s.root.heroWorld === 'under' ? 'ivory.14' : 'mist.32',
    transition: 'transform .45s cubic-bezier(.22,.68,.24,.98), background .45s ease',
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
    color: (el, s) =>
      s.root.heroWorld === 'under'
        ? (s.scrolled ? 'caption' : 'ivory.55')
        : (s.scrolled ? 'activeInk' : 'slateInkDeep'),
    transition: 'color .45s ease',
    text: 'Above ground',
    ariaPressed: (el, s) => String(s.root.heroWorld !== 'under'),
    onClick: (ev, el) => el.call('setWorld', 'above')
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
    color: (el, s) =>
      s.root.heroWorld === 'under'
        ? (s.scrolled ? 'activeInk' : 'ivory')
        : (s.scrolled ? 'caption' : 'muted'),
    transition: 'color .45s ease',
    text: 'Underground',
    ariaPressed: (el, s) => String(s.root.heroWorld === 'under'),
    onClick: (ev, el) => el.call('setWorld', 'under')
  }
}
