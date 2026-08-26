// The page-switch curtain. `routeVeil` (brand functions) stages it through
// root state: '' → 'cover' wipes the navy panel up over the old page, the
// router swaps content underneath, 'reveal' peels the panel off the top of
// the new page, and back to '' resets it below the fold with no transition.
// Because the stage lives on root state, the veil in the NEXT page mounts
// already covered — the swap never flashes.
export const RouteVeil = {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  zIndex: '90',
  flow: 'x',
  align: 'center center',
  background: 'band',
  pointerEvents: 'none',
  clipPath: 'inset(100% 0 0 0)',
  attr: { 'aria-hidden': 'true' },
  '@reduceMotion': { display: 'none' },

  isCover: (el, s) => s.root.veilStage === 'cover',
  '.isCover': {
    clipPath: 'inset(0 0 0 0)',
    pointerEvents: 'all',
    transition: 'clip-path .46s cubic-bezier(.22,.68,.24,.98)'
  },
  isReveal: (el, s) => s.root.veilStage === 'reveal',
  '.isReveal': {
    clipPath: 'inset(0 0 100% 0)',
    transition: 'clip-path .52s cubic-bezier(.22,.68,.24,.98)'
  },

  Mark: {
    tag: 'span',
    width: 'Z1',
    height: 'Z1',
    background: 'mist',
    transform: 'rotate(45deg) scale(.5)',
    opacity: '0',
    transition: 'transform .4s cubic-bezier(.34,1.5,.5,1) .12s, opacity .3s ease .12s',
    isCover: (el, s) => s.root.veilStage === 'cover',
    '.isCover': { transform: 'rotate(45deg) scale(1)', opacity: '1' }
  }
}
