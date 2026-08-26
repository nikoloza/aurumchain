// One eligibility / permission line: a label on the left, its StatusPill on
// the right, separated by the same hairline the data tables use. Drives the
// Overview eligibility card and the Identity permissions card.
// `text` is a translation key, resolved through polyglot.
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
    // Must be allowed to wrap and to shrink: a Georgian label is longer than
    // its English source and would otherwise push the pill off a phone.
    minWidth: '0',
    text: (el, s) => el.call('polyglot', s.text || '', s.root.lang)
  },

  StatusPill: { flexShrink: '0' }
}
