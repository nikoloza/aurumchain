// One policy switch. A switch here maps to a single program instruction, so the
// row names that instruction rather than describing the effect twice.
// state: { label, call, note, status }
export const SwitchRow = {
  flow: 'x',
  align: 'center space-between',
  gap: 'A',
  width: '100%',
  padding: 'Z 0',
  borderBottom: '1px solid hairline',
  flexWrap: 'wrap',

  Left: {
    flow: 'y',
    gap: 'W',
    minWidth: 'H',

    Label: {
      tag: 'span',
      fontSize: 'Z1',
      fontWeight: '600',
      color: 'title',
      text: (el, s) => s.label || ''
    },
    Call: {
      tag: 'span',
      fontFamily: 'Mono',
      fontSize: 'Y',
      color: 'gold',
      text: (el, s) => s.call || ''
    },
    Note: {
      tag: 'span',
      fontSize: 'Y1',
      color: 'caption',
      text: (el, s) => s.note || ''
    }
  },

  Right: {
    flow: 'x',
    align: 'center center',
    gap: 'Z',
    StatusPill: {},
    ActionButton: { state: { tone: 'secondary' }, text: 'Change' }
  }
}
