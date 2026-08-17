// A cell renders a status pill when its value carries a status, and monospaced
// text when the page marks the column as numeric.
// state: { text, status, mono }
export const DataCell = {
  flow: 'x',
  align: 'center flex-start',
  flex: '1',
  minWidth: 'F',

  Value: {
    tag: 'span',
    fontSize: 'Z',
    color: 'paragraph',
    display: (el, s) => (s.status ? 'none' : 'inline'),
    fontFamily: (el, s) => (s.mono ? 'Mono' : 'Default'),
    text: (el, s) => s.text || ''
  },

  StatusPill: {
    display: (el, s) => (s.status ? 'inline-flex' : 'none')
  }
}
