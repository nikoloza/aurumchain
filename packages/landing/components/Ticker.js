// Asset-class ticker under the hero — two slow marquee lanes running in
// opposite directions, mono voice, diamond-separated. Decorative: hidden from
// assistive tech, frozen for reduced motion, and each track holds two copies
// of its run so the -50% loop never shows a seam.
export const Ticker = {
  flow: 'y',
  width: '100%',
  overflow: 'hidden',
  borderTop: '1px solid hairline',
  borderBottom: '1px solid hairline',
  attr: { 'aria-hidden': 'true' },

  TickerLane: {},

  // Counter-lane — the guarantees, drifting the other way, a shade quieter.
  TickerLane_1: {
    borderTop: '1px dashed hairline',
    opacity: '.6',
    Track: {
      animationDirection: 'reverse',
      animationDuration: '52s',
      childExtends: 'TickerRunAlt'
    }
  }
}

// One marquee lane. The default run is the asset classes; the counter-lane
// swaps the run and reverses the drift.
export const TickerLane = {
  width: '100%',
  overflow: 'hidden',
  padding: 'Z1 0',

  Track: {
    flow: 'x',
    align: 'center flex-start',
    width: 'max-content',
    animationName: 'marquee',
    animationDuration: '38s',
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
    { label: 'Private credit' }
  ]
}

// The counter-lane's run — what the platform guarantees, not what it holds.
export const TickerRunAlt = {
  extends: 'TickerRun',
  children: [
    { label: 'Compliant fractions' },
    { label: 'On-chain payouts' },
    { label: 'Supply-capped tokens' },
    { label: 'Transfer-hook cleared' },
    { label: 'T+0 settlement' },
    { label: 'Registry enforced' }
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
