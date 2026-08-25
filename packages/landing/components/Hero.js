// Opening band — one full-viewport section, two worlds. The editorial column
// sits dead-center inside the WebGL ring-world (see HeroCanvas): a compact
// torus web hugs the copy, Tbilisi's skyline stands on the far arc of the
// surface ellipse, and the underground holdings hang beneath the same plane.
// The switcher dives the camera below the surface, turns the band navy, and
// swaps the editorial column for the other audience. Each stack remounts on
// the flip, so the masked headline and staggered reveals re-choreograph
// every time the world changes.
export const Hero = {
  tag: 'section',
  flow: 'y',
  align: 'center center',
  position: 'relative',
  width: '100%',
  minHeight: '100vh',
  padding: 'E C',
  overflow: 'hidden',
  scope: {},
  state: { webglOk: false },
  // The worlds keep their own light regardless of the page scheme: the band
  // is ivory above ground and navy underground in BOTH themes, and every
  // ink inside the stacks is explicit for its world. The world itself lives
  // on ROOT state — the navbar's WorldSwitch drives it.
  background: 'ivory',
  transition: 'background .9s cubic-bezier(.22,.68,.24,.98)',
  isUnder: (el, s) => s.root.heroWorld === 'under',
  '.isUnder': { background: 'navy' },
  '@tabletS': { minHeight: 'auto', padding: 'E A C' },

  // Pointer feed for the ring-world — raw client coords on scope (the canvas
  // derives screen and world space from them); no state churn per mouse move.
  onMousemove: (ev, el) => {
    el.scope.cxr = ev.clientX
    el.scope.cyr = ev.clientY
  },

  // A click drops a settlement ring that hurries the airborne home.
  onClick: (ev, el) => {
    if (!el.node) return
    el.scope.cxr = ev.clientX
    el.scope.cyr = ev.clientY
    const win = el.node.ownerDocument.defaultView
    el.scope.clickStart = win && win.performance ? win.performance.now() : 0
  },

  HeroCanvas: {},

  // The static ghost mark carries the composition only when WebGL is
  // unavailable — the canvas flips `webglOk` once the ring-world runs.
  Ghost: {
    position: 'absolute',
    top: '-10vw',
    right: '-9vw',
    pointerEvents: 'none',
    color: 'slate.1',
    show: (el, s) => !s.webglOk,
    Icon: { name: 'logo', width: '46vw', height: '46vw', display: 'block' },
    '@tabletS': { display: 'none' }
  },

  Inner: {
    flow: 'y',
    gap: 'B2',
    align: 'center center',
    textAlign: 'center',
    width: '100%',
    maxWidth: 'I2',
    position: 'relative',

    // On phones the navbar has no room for the switcher, so it rides the
    // top of the column instead — same root state, either instance works.
    WorldSwitch: {
      display: 'none',
      '@tabletS': { display: 'flex' },
      animationName: 'fcReveal',
      animationDuration: 'F',
      animationFillMode: 'both',
      '@reduceMotion': { animationName: 'none' }
    },

    // ── the investor story, above ground ──
    ContentAbove: {
      flow: 'y',
      gap: 'B2',
      align: 'center center',
      width: '100%',
      show: (el, s) => s.root.heroWorld !== 'under',

      Eyebrow: {
        flow: 'x',
        align: 'center center',
        gap: 'Z',
        width: '100%',
        animationName: 'fcReveal',
        animationDuration: 'F',
        animationFillMode: 'both',
        '@reduceMotion': { animationName: 'none' },

        RuleL: {
          flex: '1',
          maxWidth: 'D',
          alignSelf: 'center',
          borderTop: '1px dashed',
          borderTopColor: 'line'
        },
        Diamond: {
          tag: 'span',
          flexShrink: '0',
          width: 'X1',
          height: 'X1',
          background: 'slateInk',
          transform: 'rotate(45deg)'
        },
        Label: {
          tag: 'span',
          fontSize: 'Y1',
          fontWeight: '600',
          letterSpacing: '.18em',
          lineHeight: '1',
          textTransform: 'uppercase',
          color: 'muted',
          text: 'For investors'
        },
        RuleR: {
          flex: '1',
          maxWidth: 'D',
          alignSelf: 'center',
          borderTop: '1px dashed',
          borderTopColor: 'line'
        }
      },

      H1: {
        fontFamily: 'Brand',
        fontSize: 'K',
        lineHeight: '.95',
        fontWeight: '400',
        letterSpacing: '.008em',
        textTransform: 'uppercase',
        color: 'navy',
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
            color: 'slateInk',
            text: 'Real assets,',
            animationName: 'lineUp',
            animationDuration: 'E',
            animationDelay: 'Z',
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
        fontSize: 'B',
        lineHeight: '1.55',
        color: 'navy.76',
        margin: '0',
        maxWidth: 'I',
        animationName: 'fcReveal',
        animationDuration: 'F',
        animationDelay: 'B',
        animationFillMode: 'both',
        '@reduceMotion': { animationName: 'none' },
        text:
          'Buy compliant fractions of real-world assets on Solana. The registry caps every supply, the transfer hook clears every move, and payouts settle back to your wallet.',
        '@tabletS': { fontSize: 'A' }
      },

      Actions: {
        flow: 'x',
        align: 'center center',
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
          PillButton: { state: { tone: 'solid' }, text: 'Open an account' }
        },
        HowCta: {
          display: 'inline-flex',
          state: { anchor: 'how' },
          onClick: (ev, el, s) => {
            ev.preventDefault()
            el.call('scrollToSection', s.anchor)
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
            PillButton: { state: { tone: 'paper' }, text: 'See how it works' }
          }
        }
      },

      Stats: {
        flow: 'x',
        align: 'flex-start center',
        gap: 'D',
        flexWrap: 'wrap',
        marginTop: 'Z',
        paddingTop: 'B1',
        borderTop: '1px solid line',
        width: '100%',
        textAlign: 'center',
        animationName: 'fcReveal',
        animationDuration: 'F',
        animationDelay: 'C1',
        animationFillMode: 'both',
        '@reduceMotion': { animationName: 'none' },
        '@tabletS': { gap: 'B' },

        childProps: {
          Value: { color: 'navy' },
          Label: { color: 'muted' }
        },
        StatCell: { align: 'center center', state: { value: '$326T', label: 'Real assets worldwide' } },
        StatCell_1: { extends: 'StatCell', align: 'center center', state: { value: '$250', label: 'Minimum subscription' } },
        StatCell_2: { extends: 'StatCell', align: 'center center', state: { value: '6–9%', label: 'Target annual yield' } },
        StatCell_3: { extends: 'StatCell', align: 'center center', state: { value: 'T+0', label: 'On-chain settlement' } }
      }
    },

    // ── the asset-owner story, underground (navy band; explicit inks) ──
    ContentUnder: {
      flow: 'y',
      gap: 'B2',
      align: 'center center',
      width: '100%',
      show: (el, s) => s.root.heroWorld === 'under',

      Eyebrow: {
        flow: 'x',
        align: 'center center',
        gap: 'Z',
        width: '100%',
        animationName: 'fcReveal',
        animationDuration: 'F',
        animationFillMode: 'both',
        '@reduceMotion': { animationName: 'none' },

        RuleL: {
          flex: '1',
          maxWidth: 'D',
          alignSelf: 'center',
          borderTop: '1px dashed',
          borderTopColor: 'ivory.2'
        },
        Diamond: {
          tag: 'span',
          flexShrink: '0',
          width: 'X1',
          height: 'X1',
          background: 'mist',
          transform: 'rotate(45deg)'
        },
        Label: {
          tag: 'span',
          fontSize: 'Y1',
          fontWeight: '600',
          letterSpacing: '.18em',
          lineHeight: '1',
          textTransform: 'uppercase',
          color: 'ivory.6',
          text: 'For asset owners'
        },
        RuleR: {
          flex: '1',
          maxWidth: 'D',
          alignSelf: 'center',
          borderTop: '1px dashed',
          borderTopColor: 'ivory.2'
        }
      },

      H1: {
        fontFamily: 'Brand',
        fontSize: 'K',
        lineHeight: '.95',
        fontWeight: '400',
        letterSpacing: '.008em',
        textTransform: 'uppercase',
        color: 'ivory',
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
            color: 'mist',
            text: 'Solid value,',
            animationName: 'lineUp',
            animationDuration: 'E',
            animationDelay: 'Z',
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
            text: 'made divisible',
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
        fontSize: 'B',
        lineHeight: '1.55',
        color: 'ivory.72',
        margin: '0',
        maxWidth: 'I',
        animationName: 'fcReveal',
        animationDuration: 'F',
        animationDelay: 'B',
        animationFillMode: 'both',
        '@reduceMotion': { animationName: 'none' },
        text:
          'A mine in Ashanti, a plant in Minas Gerais, a grain belt in the Mallee — if it produces yield, the registry can cap it, split it, and pay its holders. You keep the asset; the chain keeps the books.',
        '@tabletS': { fontSize: 'A' }
      },

      Actions: {
        flow: 'x',
        align: 'center center',
        gap: 'Z',
        flexWrap: 'wrap',
        animationName: 'fcReveal',
        animationDuration: 'F',
        animationDelay: 'C',
        animationFillMode: 'both',
        '@reduceMotion': { animationName: 'none' },

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
            // Fully qualified so RouterLink leaves the click to the wrapper —
            // a relative href would route instantly and skip the veil.
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
      },

      Stats: {
        flow: 'x',
        align: 'flex-start center',
        gap: 'D',
        flexWrap: 'wrap',
        marginTop: 'Z',
        paddingTop: 'B1',
        borderTop: '1px solid',
        borderTopColor: 'ivory.16',
        width: '100%',
        textAlign: 'center',
        animationName: 'fcReveal',
        animationDuration: 'F',
        animationDelay: 'C1',
        animationFillMode: 'both',
        '@reduceMotion': { animationName: 'none' },
        '@tabletS': { gap: 'B' },

        StatCell: {
          align: 'center center',
          state: { value: '6', label: 'Asset classes live' },
          Value: { color: 'ivory' },
          Label: { color: 'ivory.55' }
        },
        StatCell_1: {
          extends: 'StatCell',
          align: 'center center',
          state: { value: '100%', label: 'Supply-capped issues' },
          Value: { color: 'ivory' },
          Label: { color: 'ivory.55' }
        },
        StatCell_2: {
          extends: 'StatCell',
          align: 'center center',
          state: { value: '75 bps', label: 'Secondary-market fee' },
          Value: { color: 'ivory' },
          Label: { color: 'ivory.55' }
        },
        StatCell_3: {
          extends: 'StatCell',
          align: 'center center',
          state: { value: '4', label: 'Anchor programs' },
          Value: { color: 'ivory' },
          Label: { color: 'ivory.55' }
        }
      }
    }
  },

  ScrollCue: {
    flow: 'x',
    align: 'center center',
    gap: 'Z',
    position: 'absolute',
    bottom: 'B',
    left: '0',
    right: '0',
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
      borderLeft: '1px solid line',

      Line: {
        position: 'absolute',
        top: '0',
        left: '0',
        height: '100%',
        borderLeft: '1px solid slateInk',
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
      color: 'muted',
      transition: 'color .9s ease',
      isUnder: (el, s) => s.root.heroWorld === 'under',
      '.isUnder': { color: 'ivory.5' },
      text: 'Scroll'
    }
  }
}
