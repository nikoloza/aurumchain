// Centered blank slate for any list with nothing to show — the brand's value
// diamond drifting over one title line and one caption line. The keyframe
// rides a wrapper so the float never overwrites the diamond's rotation.
// state: { title, caption }
export const EmptyState = {
  flow: 'y',
  align: 'center center',
  gap: 'Z',
  width: '100%',
  padding: 'D B',
  textAlign: 'center',

  Glyph: {
    flow: 'x',
    align: 'center center',
    animationName: 'floatY',
    animationDuration: '5s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
    '@reduceMotion': { animationName: 'none' },

    Diamond: {
      tag: 'span',
      flexShrink: '0',
      width: 'Z',
      height: 'Z',
      background: 'accentInk',
      transform: 'rotate(45deg)'
    }
  },

  Title: {
    tag: 'span',
    fontFamily: 'Display',
    fontSize: 'A1',
    fontWeight: '600',
    color: 'title',
    marginTop: 'Y',
    text: (el, s) => s.title || ''
  },

  Caption: {
    tag: 'span',
    fontSize: 'Y1',
    color: 'caption',
    maxWidth: '30em',
    text: (el, s) => s.caption || ''
  }
}
