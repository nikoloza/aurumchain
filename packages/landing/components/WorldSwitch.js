// The world switcher — aurc.app's above-ground / underground toggle reborn.
// Two equal segments over a sliding thumb; flipping it drives the Hero's
// `world` state, which pans the WebGL camera below the horizon, turns the
// band navy, and swaps the editorial column for the other audience.
export const WorldSwitch = {
  position: 'relative',
  flow: 'x',
  align: 'center center',
  borderRadius: 'radiusPill',
  border: '1px solid hairline',
  background: 'veil',
  transition: 'border-color .6s ease, background .6s ease',
  isUnder: (el, s) => s.world === 'under',
  '.isUnder': { borderColor: 'ivory.2', background: 'ivory.06' },

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
    transition: 'transform .45s cubic-bezier(.22,.68,.24,.98), background .6s ease',
    isUnder: (el, s) => s.world === 'under',
    '.isUnder': { transform: 'translateX(100%)', background: 'ivory.14' }
  },

  Above: {
    tag: 'button',
    position: 'relative',
    flex: '1',
    padding: 'Y B',
    fontSize: 'Y1',
    fontWeight: '600',
    letterSpacing: '.14em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'activeInk',
    transition: 'color .45s ease',
    text: 'Above ground',
    ariaPressed: (el, s) => String(s.world !== 'under'),
    isUnder: (el, s) => s.world === 'under',
    '.isUnder': { color: 'ivory.55' },
    onClick: (ev, el, s) => s.update({ world: 'above' }, { preventFetch: true })
  },

  Under: {
    tag: 'button',
    position: 'relative',
    flex: '1',
    padding: 'Y B',
    fontSize: 'Y1',
    fontWeight: '600',
    letterSpacing: '.14em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: 'caption',
    transition: 'color .45s ease',
    text: 'Underground',
    ariaPressed: (el, s) => String(s.world === 'under'),
    isUnder: (el, s) => s.world === 'under',
    '.isUnder': { color: 'ivory' },
    onClick: (ev, el, s) => s.update({ world: 'under' }, { preventFetch: true })
  }
}
