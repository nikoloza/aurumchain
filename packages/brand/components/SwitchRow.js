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
    // Below tabletS the fixed label column alone exceeds the viewport —
    // it has to yield and let the text wrap instead.
    '@tabletS': { minWidth: '0' },

    Label: {
      tag: 'span',
      fontSize: 'Z1',
      fontWeight: '600',
      color: 'title',
      text: (el, s) => el.call('polyglot', s.label || '', s.root.lang)
    },
    Call: {
      tag: 'span',
      fontFamily: 'Mono',
      fontSize: 'Y',
      color: 'accentInk',
      // Instruction names are single unbreakable tokens — allow a break
      // anywhere so they can never force the row past the viewport.
      overflowWrap: 'anywhere',
      text: (el, s) => s.call || ''
    },
    Note: {
      tag: 'span',
      fontSize: 'Y1',
      color: 'caption',
      text: (el, s) => el.call('polyglot', s.note || '', s.root.lang)
    }
  },

  Right: {
    flow: 'x',
    align: 'center center',
    gap: 'Z',
    StatusPill: {},
    ActionButton: { state: { tone: 'secondary' }, text: '{{ common.change | polyglot }}' }
  }
}
