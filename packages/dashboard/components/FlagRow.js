// One eligibility / permission line: a label on the left, its StatusPill on
// the right, separated by the same hairline the data tables use. Drives the
// Overview eligibility card and the Identity permissions card.
// state: { text, status }
export const FlagRow = {
  flow: 'x',
  align: 'center space-between',
  gap: 'Z',
  width: '100%',
  padding: 'Y 0',
  ':not(:last-child)': { borderBottom: '1px solid hairline' },

  Label: {
    tag: 'span',
    fontSize: 'Z',
    color: 'paragraph',
    whiteSpace: 'nowrap',
    text: (el, s) => s.text || ''
  },

  StatusPill: { flexShrink: '0' }
}
