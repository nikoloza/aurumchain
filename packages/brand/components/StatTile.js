// One headline figure. state: { label, value, delta, tone }
export const StatTile = {
  flow: 'y',
  gap: 'X',
  padding: 'A',
  borderRadius: 'radiusCard',
  theme: 'card',

  Label: {
    tag: 'span',
    fontSize: 'Y1',
    letterSpacing: '.06em',
    textTransform: 'uppercase',
    color: 'caption',
    text: (el, s) => el.call('polyglot', s.label || '', s.root.lang)
  },

  Value: {
    tag: 'span',
    fontFamily: 'Mono',
    fontSize: 'C',
    fontWeight: '700',
    letterSpacing: '-.02em',
    color: 'title',
    text: (el, s) => s.value || ''
  },

  Delta: {
    tag: 'span',
    fontFamily: 'Mono',
    fontSize: 'Y1',
    text: (el, s) => el.call('polyglot', s.delta || '', s.root.lang),
    color: (el, s) => (s.tone === 'down' ? 'red' : s.tone === 'flat' ? 'caption' : 'green')
  }
}
