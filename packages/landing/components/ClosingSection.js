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

  // An echo of the hero's surface ellipse — a dashed ring turning slowly
  // behind the call to action.
  Ring: {
    position: 'absolute',
    top: '10%',
    bottom: '12%',
    left: '9%',
    right: '9%',
    border: '1px dashed',
    borderColor: 'ivory.12',
    borderRadius: '50%',
    pointerEvents: 'none',
    attr: { 'aria-hidden': 'true' },
    animationName: 'spin',
    animationDuration: '90s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
    '@reduceMotion': { animationName: 'none' },
    '@tabletS': { display: 'none' }
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
      // the same choreography as the hero, re-run at the close — and its
      // pitch follows the world: investors above ground, owners under it.
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
          text: (el, s) => (s.root.heroWorld === 'under' ? 'Your asset stays yours,' : 'Open an account,')
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
          text: (el, s) => (s.root.heroWorld === 'under' ? 'its yield goes liquid' : 'see the offerings')
        }
      }
    },

    P: {
      margin: '0',
      fontSize: 'A',
      lineHeight: '1.6',
      color: 'ivory.72',
      maxWidth: 'H+C',
      text: (el, s) =>
        s.root.heroWorld === 'under'
          ? 'The registry caps the supply, the hook clears every holder, and payout epochs settle in USDC. You keep custody; the chain keeps the books.'
          : 'Identity approval takes minutes. Wallet verification takes one signature. Subscription opens as soon as both clear.'
    },

    ActionsAbove: {
      flow: 'x',
      align: 'center center',
      gap: 'Z',
      flexWrap: 'wrap',
      show: (el, s) => s.root.heroWorld !== 'under',

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
    },

    ActionsUnder: {
      flow: 'x',
      align: 'center center',
      gap: 'Z',
      flexWrap: 'wrap',
      show: (el, s) => s.root.heroWorld === 'under',

      Link: {
        href: 'mailto:hello@fractyco.app',
        text: '',
        textDecoration: 'none',
        display: 'inline-flex',
        PillButton: { state: { tone: 'inverse' }, text: 'Tokenize an asset' }
      },
      PlatformCta: {
        display: 'inline-flex',
        onClick: (ev, el) => {
          ev.preventDefault()
          el.call('routeVeil', '/platform')
        },
        Link: {
          href: (el) => {
            const loc = el.node && el.node.ownerDocument.location
            return loc ? `${loc.origin}/platform` : '/platform'
          },
          text: '',
          textDecoration: 'none',
          display: 'inline-flex',
          PillButton: { state: { tone: 'outline' }, text: 'Read the platform' }
        }
      }
    }
  }
}
