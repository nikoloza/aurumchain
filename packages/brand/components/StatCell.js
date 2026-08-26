// One figure in the hero stat row. state: { value, label }
export const StatCell = {
  flow: 'y',
  gap: 'W',

  Value: {
    tag: 'span',
    fontFamily: 'Mono',
    fontSize: 'E',
    fontWeight: '600',
    letterSpacing: '-.03em',
    lineHeight: '1.05',
    color: 'title',
    text: (el, s) => s.value || ''
  },

  Label: {
    tag: 'span',
    fontSize: 'Y1',
    letterSpacing: '.06em',
    textTransform: 'uppercase',
    color: 'caption',
    text: (el, s) => el.call('polyglot', s.label || '', s.root.lang)
  }
}
