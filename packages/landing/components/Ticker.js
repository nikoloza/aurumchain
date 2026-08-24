// Asset-class ticker under the hero — a slow seamless marquee in the mono
// voice, diamond-separated. Decorative: hidden from assistive tech, frozen
// for reduced motion, and the track holds two copies of the run so the -50%
// loop never shows a seam.
export const Ticker = {
  width: '100%',
  overflow: 'hidden',
  borderTop: '1px solid hairline',
  borderBottom: '1px solid hairline',
  padding: 'Z1 0',
  attr: { 'aria-hidden': 'true' },

  Track: {
    flow: 'x',
    align: 'center flex-start',
    width: 'max-content',
    animationName: 'marquee',
    animationDuration: '36s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    ':hover': { animationPlayState: 'paused' },
    '@reduceMotion': { animationName: 'none' },

    childExtends: 'TickerRun',
    children: [{}, {}]
  }
}

// One copy of the ticker's run. Two render back-to-back for the loop.
export const TickerRun = {
  flow: 'x',
  align: 'center flex-start',
  flexShrink: '0',

  childExtends: 'TickerItem',
  childrenAs: 'state',
  children: [
    { label: 'Real estate' },
    { label: 'Mining & metals' },
    { label: 'Energy' },
    { label: 'Infrastructure' },
    { label: 'Agriculture' },
    { label: 'Private credit' },
    { label: 'Compliant fractions' },
    { label: 'On-chain payouts' }
  ]
}

// One entry: diamond node + mono uppercase label.
export const TickerItem = {
  flow: 'x',
  align: 'center flex-start',
  gap: 'A',
  paddingRight: 'C',

  Diamond: {
    tag: 'span',
    flexShrink: '0',
    width: 'X',
    height: 'X',
    background: 'mist',
    transform: 'rotate(45deg)'
  },
  Label: {
    tag: 'span',
    fontFamily: 'Mono',
    fontSize: 'Z',
    fontWeight: '500',
    letterSpacing: '.14em',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    color: 'caption',
    text: (el, s) => s.label || ''
  }
}
