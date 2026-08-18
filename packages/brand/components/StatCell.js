// One figure in the hero stat row. state: { value, label }
export const StatCell = {
  flow: 'y',
  gap: 'W',

  Value: {
    tag: 'span',
    fontFamily: 'Mono',
    fontSize: 'C',
    fontWeight: '700',
    letterSpacing: '-.02em',
    color: 'gold',
    text: (el, s) => s.value || ''
  },

  Label: {
    tag: 'span',
    fontSize: 'Y1',
    letterSpacing: '.06em',
    textTransform: 'uppercase',
    color: 'caption',
    text: (el, s) => s.label || ''
  }
}
