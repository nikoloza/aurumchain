// One headline figure in the app's KPI band. The figure counts up on load
// (CountUp keys off the `inView` flag the surrounding KpiRow arms), the tile
// fades in on its own `revealDelay`, and hover lifts it like the landing
// cards. A value that is not a number passes `value` and renders static.
// state: { label, to, prefix, suffix, decimals, duration, value, delta,
// tone, revealDelay }
export const KpiTile = {
  flow: 'y',
  gap: 'X',
  padding: 'A',
  position: 'relative',
  overflow: 'hidden',
  // Panel fill, no own border — the surrounding KpiRow supplies the frame and
  // its 1px gaps read as hairline seams between tiles.
  background: 'panel',
  transition: (el, s) =>
    'opacity .7s cubic-bezier(.22,.68,.24,.98) ' + (s.revealDelay || '0s') +
    ', background .3s ease',
  opacity: '0',
  isRevealed: (el, s) => el.call('inheritedInView', s),
  '.isRevealed': { opacity: '1' },
  // Hover: wash the tile and sweep the accent underline in, like the
  // landing's market figures.
  ':after': {
    content: '""',
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    height: 'W',
    background: 'accentInk',
    transform: 'scaleX(0)',
    transformOrigin: 'left center',
    transition: 'transform .4s cubic-bezier(.22,.68,.24,.98)'
  },
  // surfaceWash, not veil — the fill must stay opaque or the band's hairline
  // ground reads through the tile.
  ':hover': { background: 'surfaceWash', ':after': { transform: 'scaleX(1)' } },
  '@reduceMotion': { opacity: '1', transition: 'none' },

  Eyebrow: {
    flow: 'x',
    align: 'center flex-start',
    gap: 'Y',

    Diamond: {
      tag: 'span',
      flexShrink: '0',
      width: 'X1',
      height: 'X1',
      background: 'accentInk',
      transform: 'rotate(45deg)'
    },
    Label: {
      tag: 'span',
      fontSize: 'Y1',
      fontWeight: '600',
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'caption',
      text: (el, s) => s.label || ''
    }
  },

  CountUp: {
    show: (el, s) => s.to !== undefined,
    fontFamily: 'Mono',
    fontSize: 'E',
    fontWeight: '600',
    letterSpacing: '-.03em',
    lineHeight: '1.05',
    color: 'title',
    '@tabletS': { fontSize: 'D' }
  },

  Static: {
    tag: 'span',
    show: (el, s) => s.to === undefined,
    fontFamily: 'Mono',
    fontSize: 'E',
    fontWeight: '600',
    letterSpacing: '-.03em',
    lineHeight: '1.05',
    fontVariantNumeric: 'tabular-nums',
    color: 'title',
    '@tabletS': { fontSize: 'D' },
    text: (el, s) => s.value || ''
  },

  Delta: {
    tag: 'span',
    fontFamily: 'Mono',
    fontSize: 'Y1',
    fontVariantNumeric: 'tabular-nums',
    text: (el, s) => s.delta || '',
    color: (el, s) => (s.tone === 'down' ? 'red' : s.tone === 'flat' ? 'caption' : 'green')
  }
}
