// Lockup from the brandbook: the circular mark — two open arcs holding the
// value diamond — beside the FRACTYCO wordmark set in the condensed brand
// face. Inherits `color` from its parent chrome; defaults to the title pair
// so it flips navy/ivory with the theme on its own.
export const Logo = {
  flow: 'x',
  align: 'center center',
  gap: 'Y',
  color: 'title',

  Icon: {
    name: 'logo',
    fontSize: 'B1',
    display: 'block',
    flexShrink: '0'
  },

  Word: {
    tag: 'span',
    text: 'FRACTYCO',
    fontFamily: 'Brand',
    fontSize: 'A2',
    fontWeight: '400',
    letterSpacing: '.05em',
    lineHeight: '1',
    whiteSpace: 'nowrap',
    transform: 'translateY(1px)',
    color: 'inherit'
  }
}
