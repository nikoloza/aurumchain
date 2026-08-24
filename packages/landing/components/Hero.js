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
  '@tabletS': { minHeight: 'auto', padding: 'E A C' },

  // Pointer feed for the field's lens — canvas uv space (0..1, y down),
  // stored on scope so no state churn happens per mouse move.
  onMousemove: (ev, el) => {
    if (!el.node) return
    const r = el.node.getBoundingClientRect()
    el.scope.mx = (ev.clientX - r.left) / Math.max(1, r.width)
    el.scope.my = (ev.clientY - r.top) / Math.max(1, r.height)
    el.scope.cxr = ev.clientX
    el.scope.cyr = ev.clientY
  },

  // A click drops a ripple into the field at the pointer.
  onClick: (ev, el) => {
    if (!el.node) return
    const r = el.node.getBoundingClientRect()
    el.scope.cx = (ev.clientX - r.left) / Math.max(1, r.width)
    el.scope.cy = (ev.clientY - r.top) / Math.max(1, r.height)
    const win = el.node.ownerDocument.defaultView
    el.scope.clickStart = win && win.performance ? win.performance.now() : 0
  },

  HeroCanvas: {},

  // Faint echo of the mark, aligned exactly under the particle canvas — the
  // fractions above it read as the mark condensing out of the field. It is
  // also the whole composition when WebGL is unavailable.
  Ghost: {
    position: 'absolute',
    top: '4vh',
    right: '-5vw',
    pointerEvents: 'none',
    color: 'slate.07',
    '@dark': { color: 'mist.04' },
    Icon: { name: 'logo', width: '46vw', height: '46vw', display: 'block' },
    '@tabletS': { display: 'none' }
  },

  // The mark, assembled from ~1k spring-loaded fractions (WebGL).
  HeroMark: {},

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
        text: 'Real-world asset platform · Solana'
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
        'Fractyco issues asset-backed tokens on Solana. Every transfer clears a compliance hook, every position settles against a registry, and every payout distributes on-chain.',
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

      StatCell: { state: { value: '4', label: 'Anchor programs' } },
      StatCell_1: { extends: 'StatCell', state: { value: 'SPL-2022', label: 'Token standard' } },
      StatCell_2: { extends: 'StatCell', state: { value: 'T+0', label: 'Payout settlement' } },
      StatCell_3: { extends: 'StatCell', state: { value: 'USDC', label: 'Settlement asset' } }
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
