// Wordmark. The mark is a stack of three bars of decreasing width — a whole
// divided into parts, which is the product in one glyph.
export const Logo = {
  flow: 'x',
  align: 'center center',
  gap: 'Y',

  Mark: {
    flow: 'x',
    align: 'center center',
    flexShrink: '0',
    width: 'B',
    height: 'B',
    borderRadius: 'Y',
    theme: 'primary',

    Svg: {
      viewBox: '0 0 24 24',
      width: 'A',
      height: 'A',
      html:
        '<rect x="5" y="7" width="14" height="2" rx="1" fill="currentColor"/>' +
        '<rect x="5" y="11" width="10" height="2" rx="1" fill="currentColor" opacity=".72"/>' +
        '<rect x="5" y="15" width="6" height="2" rx="1" fill="currentColor" opacity=".44"/>'
    }
  },

  Word: {
    tag: 'span',
    text: 'Fractyco',
    fontFamily: 'Display',
    fontSize: 'B',
    fontWeight: '700',
    letterSpacing: '-.02em',
    color: 'title'
  }
}
