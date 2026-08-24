// Guideline-page swatch card. state: { token, role, name, hex, light }
// The fill paints with the live token, so the sheet can never drift from the
// design system it documents. (The key is `Fill`, not `Chip` — a `Chip` key
// would auto-extend the pill component.)
export const BrandSwatch = {
  flow: 'y',
  borderRadius: 'radiusCard',
  overflow: 'hidden',
  theme: 'card',

  Fill: {
    display: 'block',
    width: '100%',
    height: 'E',
    background: (el, s) => s.token || 'navy',
    isLight: (el, s) => !!s.light,
    '.isLight': { borderBottom: '1px solid hairline' }
  },

  Info: {
    flow: 'y',
    gap: 'X',
    padding: 'Z A A',

    Role: {
      tag: 'span',
      fontSize: 'Y',
      fontWeight: '600',
      letterSpacing: '.12em',
      textTransform: 'uppercase',
      color: 'caption',
      text: (el, s) => s.role || ''
    },
    NameRow: {
      flow: 'x',
      align: 'baseline space-between',
      gap: 'Z',
      Name: {
        tag: 'span',
        fontFamily: 'Display',
        fontSize: 'A1',
        fontWeight: '700',
        letterSpacing: '-.015em',
        color: 'title',
        text: (el, s) => s.name || ''
      },
      Hex: {
        tag: 'span',
        fontFamily: 'Mono',
        fontSize: 'Y1',
        color: 'caption',
        text: (el, s) => s.hex || ''
      }
    }
  }
}

// One semantic pair: a dot painted with the live pair token plus its name.
// state: { token, label }
export const BrandPair = {
  flow: 'x',
  align: 'center flex-start',
  gap: 'Y',
  padding: 'X Z',
  borderRadius: 'radiusPill',
  theme: 'chip',

  Dot: {
    tag: 'span',
    flexShrink: '0',
    width: 'Z',
    height: 'Z',
    borderRadius: 'radiusPill',
    border: '1px solid hairline',
    background: (el, s) => s.token || 'title'
  },
  Label: {
    tag: 'span',
    fontFamily: 'Mono',
    fontSize: 'Y1',
    color: 'paragraph',
    textTransform: 'none',
    letterSpacing: '0',
    text: (el, s) => s.label || ''
  }
}
