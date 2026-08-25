// The navy band — the brand's dark tile at page scale. The band is navy in
// both page schemes, so every child color is explicit (ivory, mist) and the
// buttons use the inverse/outline tones.
export const ClosingSection = {
  extends: 'Section',
  theme: 'inverted',
  position: 'relative',
  overflow: 'hidden',

  Lattice: {
    position: 'absolute',
    top: '-C',
    right: '-D',
    pointerEvents: 'none',
    color: 'mist.14',
    animationName: 'floatY',
    animationDuration: '9s',
    animationTimingFunction: 'ease-in-out',
    animationIterationCount: 'infinite',
    '@reduceMotion': { animationName: 'none' },
    Svg: {
      src: (el) => el.context.designSystem.svg.diamondGrid,
      display: 'block'
    }
  },

  Inner: {
    align: 'center center',
    textAlign: 'center',
    gap: 'B',
    position: 'relative',

    H2: {
      fontFamily: 'Brand',
      fontSize: 'G',
      lineHeight: '.98',
      fontWeight: '400',
      letterSpacing: '.01em',
      textTransform: 'uppercase',
      color: 'ivory',
      margin: '0',
      maxWidth: 'I2',
      '@tabletS': { fontSize: 'E' },

      // The band's headline rises out of masks when the section reveals —
      // the same choreography as the hero, re-run at the close.
      TopMask: {
        tag: 'span',
        display: 'block',
        overflow: 'hidden',
        Top: {
          tag: 'span',
          display: 'block',
          color: 'mist',
          transform: 'translate3d(0, 112%, 0)',
          transition: 'transform .85s cubic-bezier(.22,.68,.24,.98) .1s',
          isInView: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
          '.isInView': { transform: 'translate3d(0, 0, 0)' },
          '@reduceMotion': { transform: 'none', transition: 'none' },
          text: 'Open an account,'
        }
      },
      MainMask: {
        tag: 'span',
        display: 'block',
        overflow: 'hidden',
        Main: {
          tag: 'span',
          display: 'block',
          transform: 'translate3d(0, 112%, 0)',
          transition: 'transform .85s cubic-bezier(.22,.68,.24,.98) .22s',
          isInView: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
          '.isInView': { transform: 'translate3d(0, 0, 0)' },
          '@reduceMotion': { transform: 'none', transition: 'none' },
          text: 'see the offerings'
        }
      }
    },

    P: {
      margin: '0',
      fontSize: 'A',
      lineHeight: '1.6',
      color: 'ivory.72',
      maxWidth: 'H+C',
      text:
        'Identity approval takes minutes. Wallet verification takes one signature. Subscription opens as soon as both clear.'
    },

    Actions: {
      flow: 'x',
      align: 'center center',
      gap: 'Z',
      flexWrap: 'wrap',

      Link: {
        href: 'https://fractyco--app.at.symbo.ls/signin',
        text: '',
        textDecoration: 'none',
        display: 'inline-flex',
        PillButton: { state: { tone: 'inverse' }, text: 'Open an account' }
      },
      Link_1: {
        href: 'mailto:hello@fractyco.app',
        text: '',
        textDecoration: 'none',
        display: 'inline-flex',
        PillButton: { state: { tone: 'outline' }, text: 'Talk to us' }
      }
    }
  }
}
