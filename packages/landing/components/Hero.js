// Opening band — the brandbook's editorial voice at full size. Left-aligned
// condensed display headline in the two-tone treatment (slate phrase, navy
// payoff, mist diamond full stop), the compliance story underneath, and a
// figure strip on a hairline. The logo's circular geometry sits behind the
// right edge as a ghost.
export const Hero = {
  tag: 'section',
  flow: 'y',
  align: 'center center',
  position: 'relative',
  width: '100%',
  minHeight: '92vh',
  padding: 'F C D',
  overflow: 'hidden',
  scope: {},
  state: { webglOk: false },
  '@tabletS': { minHeight: 'auto', padding: 'E A C' },

  // Pointer feed for the crystal — raw client coords on scope (the canvas
  // derives its own space from them); no state churn per mouse move.
  onMousemove: (ev, el) => {
    el.scope.cxr = ev.clientX
    el.scope.cyr = ev.clientY
  },

  // A click drops a settlement ring that freezes the melt where it passes.
  onClick: (ev, el) => {
    if (!el.node) return
    el.scope.cxr = ev.clientX
    el.scope.cyr = ev.clientY
    const win = el.node.ownerDocument.defaultView
    el.scope.clickStart = win && win.performance ? win.performance.now() : 0
  },

  HeroCanvas: {},

  // The boundary the canvas circulates through — dashed rule + mono labels
  // naming the two worlds (after the product's first life at aurc.app).
  Horizon: {
    position: 'absolute',
    top: '60%',
    left: '0',
    right: '0',
    pointerEvents: 'none',
    attr: { 'aria-hidden': 'true' },
    '@tabletS': { display: 'none' },
    animationName: 'fcReveal',
    animationDuration: 'F',
    animationDelay: 'D',
    animationFillMode: 'both',
    '@reduceMotion': { animationName: 'none' },

    Rule: {
      borderTop: '1px dashed',
      borderTopColor: 'hairline',
      width: '100%'
    },
    Above: {
      tag: 'span',
      position: 'absolute',
      right: 'C',
      bottom: 'Y',
      fontFamily: 'Mono',
      fontSize: 'Y',
      letterSpacing: '.22em',
      textTransform: 'uppercase',
      color: 'caption',
      text: 'Above ground — the market'
    },
    Below: {
      tag: 'span',
      position: 'absolute',
      right: 'C',
      top: 'Y',
      fontFamily: 'Mono',
      fontSize: 'Y',
      letterSpacing: '.22em',
      textTransform: 'uppercase',
      color: 'accentInk',
      text: 'Underground — the asset'
    }
  },

  // The static ghost mark carries the composition only when WebGL is
  // unavailable — the canvas flips `webglOk` once its crystal is running.
  Ghost: {
    position: 'absolute',
    top: '-10vw',
    right: '-9vw',
    pointerEvents: 'none',
    color: 'slate.1',
    '@dark': { color: 'mist.05' },
    show: (el, s) => !s.webglOk,
    Icon: { name: 'logo', width: '46vw', height: '46vw', display: 'block' },
    '@tabletS': { display: 'none' }
  },

  Inner: {
    flow: 'y',
    gap: 'C',
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
        text: 'From underground to on-chain · Solana'
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
      fontSize: 'K',
      lineHeight: '.95',
      fontWeight: '400',
      letterSpacing: '.008em',
      textTransform: 'uppercase',
      color: 'title',
      margin: '0',
      '@screenS': { fontSize: 'J' },
      '@tabletL': { fontSize: 'G' },
      '@mobileL': { fontSize: 'F' },

      TopMask: {
        tag: 'span',
        display: 'block',
        overflow: 'hidden',
        Top: {
          tag: 'span',
          display: 'block',
          lineHeight: '1.02',
          color: 'accentInk',
          text: 'Real assets,',
          animationName: 'lineUp',
          animationDuration: 'E',
          animationDelay: 'A',
          animationTimingFunction: 'cubic-bezier(.22,.68,.24,.98)',
          animationFillMode: 'both',
          '@reduceMotion': { animationName: 'none' }
        }
      },
      MainMask: {
        tag: 'span',
        display: 'block',
        overflow: 'hidden',
        Main: {
          tag: 'span',
          display: 'block',
          lineHeight: '1.02',
          text: 'made liquid',
          animationName: 'lineUp',
          animationDuration: 'E',
          animationDelay: 'B',
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
      fontSize: 'B',
      lineHeight: '1.55',
      color: 'paragraph',
      margin: '0',
      maxWidth: 'I',
      animationName: 'fcReveal',
      animationDuration: 'F',
      animationDelay: 'B',
      animationFillMode: 'both',
      '@reduceMotion': { animationName: 'none' },
      text:
        'Value starts underground — a mine, a plant, a field. Fractyco brings it above ground: compliant fractions on Solana, a registry that caps every supply, and payouts that settle back to your wallet.',
      '@tabletS': { fontSize: 'A' }
    },

    Actions: {
      flow: 'x',
      align: 'center flex-start',
      gap: 'Z',
      flexWrap: 'wrap',
      animationName: 'fcReveal',
      animationDuration: 'F',
      animationDelay: 'C',
      animationFillMode: 'both',
      '@reduceMotion': { animationName: 'none' },

      Link: {
        href: 'https://fractyco--app.at.symbo.ls/signin',
        text: '',
        textDecoration: 'none',
        display: 'inline-flex',
        PillButton: { state: { tone: 'primary' }, text: 'Open an account' }
      },
      HowCta: {
        display: 'inline-flex',
        state: { anchor: 'how' },
        // Inline, through el.node.ownerDocument — see components/NavItem.js.
        onClick: (ev, el, s) => {
          ev.preventDefault()
          const doc = el.node.ownerDocument
          const target = doc.getElementById(s.anchor)
          if (!target) return
          const root = doc.documentElement
          const header = doc.querySelector('header')
          root.scrollTop =
            root.scrollTop +
            target.getBoundingClientRect().top -
            ((header ? header.offsetHeight : 80) + 16)
        },
        Link: {
          // Same-document absolute URL — Link then leaves the click to the
          // HowCta wrapper above. See components/NavItem.js.
          href: (el) => {
            const loc = el.node && el.node.ownerDocument.location
            return loc ? `${loc.origin}${loc.pathname}#how` : '#how'
          },
          text: '',
          textDecoration: 'none',
          display: 'inline-flex',
          PillButton: { state: { tone: 'secondary' }, text: 'See how it works' }
        }
      }
    },

    Stats: {
      flow: 'x',
      align: 'flex-start flex-start',
      gap: 'E',
      flexWrap: 'wrap',
      marginTop: 'B',
      paddingTop: 'B1',
      borderTop: '1px solid hairline',
      width: '100%',
      textAlign: 'left',
      animationName: 'fcReveal',
      animationDuration: 'F',
      animationDelay: 'C1',
      animationFillMode: 'both',
      '@reduceMotion': { animationName: 'none' },
      '@tabletS': { gap: 'B' },

      StatCell: { state: { value: '$326T', label: 'Real assets worldwide' } },
      StatCell_1: { extends: 'StatCell', state: { value: '$250', label: 'Minimum subscription' } },
      StatCell_2: { extends: 'StatCell', state: { value: '6–9%', label: 'Target annual yield' } },
      StatCell_3: { extends: 'StatCell', state: { value: 'T+0', label: 'On-chain settlement' } }
    },

    ScrollCue: {
      flow: 'x',
      align: 'center flex-start',
      gap: 'Z',
      marginTop: 'C',
      animationName: 'fcReveal',
      animationDuration: 'F',
      animationDelay: 'D',
      animationFillMode: 'both',
      '@reduceMotion': { animationName: 'none' },
      '@tabletS': { display: 'none' },

      Mask: {
        position: 'relative',
        width: 'X',
        height: 'C',
        overflow: 'hidden',
        borderLeft: '1px solid hairline',

        Line: {
          position: 'absolute',
          top: '0',
          left: '0',
          height: '100%',
          borderLeft: '1px solid accentInk',
          animationName: 'cueDrop',
          animationDuration: '2.2s',
          animationTimingFunction: 'cubic-bezier(.6,.05,.3,.95)',
          animationIterationCount: 'infinite',
          '@reduceMotion': { animationName: 'none' }
        }
      },
      Label: {
        tag: 'span',
        fontFamily: 'Mono',
        fontSize: 'Y1',
        letterSpacing: '.2em',
        textTransform: 'uppercase',
        color: 'caption',
        text: 'Scroll'
      }
    }
  }
}
