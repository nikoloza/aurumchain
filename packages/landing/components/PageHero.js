// Compact opening band for the inner pages — the editorial voice without the
// full WebGL treatment: numbered eyebrow, condensed two-tone headline with
// the diamond full stop, lead, and an optional mono chip row.
// state: { eyebrow, titleTop, title, lead, chips: [] }
export const PageHero = {
  tag: 'section',
  flow: 'y',
  align: 'center center',
  position: 'relative',
  width: '100%',
  padding: 'G C C',
  overflow: 'hidden',
  '@tabletS': { padding: 'F A B' },

  Ghost: {
    position: 'absolute',
    top: '-16vw',
    right: '-10vw',
    pointerEvents: 'none',
    color: 'slate.06',
    '@dark': { color: 'mist.035' },
    Icon: { name: 'logo', width: '38vw', height: '38vw', display: 'block' },
    '@tabletS': { display: 'none' }
  },

  Inner: {
    flow: 'y',
    gap: 'B',
    align: 'flex-start flex-start',
    width: '100%',
    maxWidth: '1120px',
    position: 'relative',

    Eyebrow: {
      flow: 'x',
      align: 'center flex-start',
      gap: 'Z',
      width: '100%',
      animationName: 'fcReveal',
      animationDuration: 'F',
      animationFillMode: 'both',
      '@reduceMotion': { animationName: 'none' },

      Diamond: {
        tag: 'span',
        flexShrink: '0',
        width: 'X1',
        height: 'X1',
        background: 'accentInk',
        transform: 'rotate(45deg)'
      },
      Label: {
        tag: 'span',
        fontSize: 'Y1',
        fontWeight: '600',
        letterSpacing: '.18em',
        lineHeight: '1',
        textTransform: 'uppercase',
        color: 'caption',
        text: (el, s) => s.eyebrow || ''
      },
      Rule: {
        flex: '1',
        alignSelf: 'center',
        borderTop: '1px dashed',
        borderTopColor: 'hairline'
      }
    },

    H1: {
      fontFamily: 'Brand',
      fontSize: 'H',
      lineHeight: '.96',
      fontWeight: '400',
      letterSpacing: '.008em',
      textTransform: 'uppercase',
      color: 'title',
      margin: '0',
      '@tabletL': { fontSize: 'F' },
      '@mobileL': { fontSize: 'E' },

      TopMask: {
        tag: 'span',
        display: 'block',
        overflow: 'hidden',
        Top: {
          tag: 'span',
          display: 'block',
          lineHeight: '1.04',
          color: 'accentInk',
          text: (el, s) => s.titleTop || '',
          animationName: 'lineUp',
          animationDuration: 'E',
          animationDelay: 'Z',
          animationTimingFunction: 'cubic-bezier(.22,.68,.24,.98)',
          animationFillMode: 'both',
          '@reduceMotion': { animationName: 'none' }
        },
        show: (el, s) => !!s.titleTop
      },
      MainMask: {
        tag: 'span',
        display: 'block',
        overflow: 'hidden',
        Main: {
          tag: 'span',
          display: 'block',
          lineHeight: '1.04',
          text: (el, s) => s.title || '',
          animationName: 'lineUp',
          animationDuration: 'E',
          animationDelay: 'A',
          animationTimingFunction: 'cubic-bezier(.22,.68,.24,.98)',
          animationFillMode: 'both',
          '@reduceMotion': { animationName: 'none' },
          Dot: {
            tag: 'span',
            display: 'inline-block',
            width: '.11em',
            height: '.11em',
            background: 'mist',
            transform: 'rotate(45deg)',
            verticalAlign: '.07em',
            marginLeft: '.12em'
          }
        }
      }
    },

    P: {
      fontSize: 'A1',
      lineHeight: '1.55',
      color: 'paragraph',
      margin: '0',
      maxWidth: 'I',
      text: (el, s) => s.lead || '',
      show: (el, s) => !!s.lead,
      animationName: 'fcReveal',
      animationDuration: 'F',
      animationDelay: 'B',
      animationFillMode: 'both',
      '@reduceMotion': { animationName: 'none' }
    },

    Chips: {
      flow: 'x',
      align: 'center flex-start',
      gap: 'Y',
      flexWrap: 'wrap',
      show: (el, s) => !!(s.chips && s.chips.length),
      animationName: 'fcReveal',
      animationDuration: 'F',
      animationDelay: 'C',
      animationFillMode: 'both',
      '@reduceMotion': { animationName: 'none' },
      childExtends: 'Chip',
      children: (el, s) => (s.chips || []).map((c) => ({ text: c }))
    }
  }
}
