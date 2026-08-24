// Armed control-plane figure — reveals with the row's stagger, counts its
// value up in Mono, and lifts on hover. Numeric figures pass `to` (with
// prefix/suffix/decimals for CountUp); a date- or word-valued tile keeps a
// static `value` string instead.
// state: { label, to, prefix, suffix, decimals, value, delta, tone, revealDelay }
export const GovStatTile = {
  flow: 'y',
  gap: 'X',
  padding: 'A',
  borderRadius: 'radiusCard',
  theme: 'card',
  transition: (el, s) => 'opacity .8s cubic-bezier(.22,.68,.24,.98) ' + (s.revealDelay || '0s') + ', transform .25s ease, border-color .25s ease',
  opacity: '0',
  isRevealed: (el, s) => s.inView !== false,
  '.isRevealed': { opacity: '1' },
  ':hover': { transform: 'translateY(-2px)', borderColor: 'slate.45' },
  '@reduceMotion': { opacity: '1', transition: 'none' },

  Label: {
    tag: 'span',
    fontSize: 'Y1',
    letterSpacing: '.06em',
    textTransform: 'uppercase',
    color: 'caption',
    text: (el, s) => s.label || ''
  },

  Value: {
    tag: 'span',
    display: (el, s) => (s.to === undefined ? 'inline' : 'none'),
    fontFamily: 'Mono',
    fontSize: 'C',
    fontWeight: '700',
    letterSpacing: '-.02em',
    fontVariantNumeric: 'tabular-nums',
    color: 'title',
    text: (el, s) => s.value || ''
  },

  CountUp: {
    display: (el, s) => (s.to === undefined ? 'none' : 'inline'),
    fontFamily: 'Mono',
    fontSize: 'C',
    fontWeight: '700',
    letterSpacing: '-.02em',
    color: 'title'
  },

  Delta: {
    tag: 'span',
    fontFamily: 'Mono',
    fontSize: 'Y1',
    text: (el, s) => s.delta || '',
    color: (el, s) => (s.tone === 'down' ? 'red' : s.tone === 'flat' ? 'caption' : 'green')
  }
}
