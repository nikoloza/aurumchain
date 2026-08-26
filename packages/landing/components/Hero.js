// Opening band — one full-viewport section, two worlds. The editorial column
// sits dead-center inside the WebGL ring-world (see HeroCanvas) and carries
// ONLY the eyebrow, the headline, and the lead — the calls to action and the
// figure strip live on the band's bottom edge, so the center keeps its air.
// The switcher dives the camera below the surface, turns the band navy, and
// swaps both the column and the bottom edge for the other audience. Each
// stack remounts on the flip, so the masked headline and staggered reveals
// re-choreograph every time the world changes.
export const Hero = {
  tag: 'section',
  flow: 'y',
  align: 'center center',
  position: 'relative',
  width: '100%',
  minHeight: '100vh',
  // The deep bottom inset reserves the edge band's box, so the centered
  // column can never collide with it on short viewports.
  padding: 'E C F2',
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

  // ── the centered column: eyebrow, headline, lead — nothing else ──
  Inner: {
    flow: 'y',
    gap: 'C',
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

    ContentAbove: {
      flow: 'y',
      gap: 'C',
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
          text: '{{ hero.above.eyebrow | polyglot }}'
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
        // Anton is a single-weight condensed face and has no Georgian, so the
        // ka locale falls through to Contractica — whose Regular reads far
        // lighter next to Anton's mass. Its Black restores the display voice.
        isKa: (el, s) => (s.root.lang || 'en') === 'ka',
        '.isKa': { fontWeight: '900', letterSpacing: '-.01em' },
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
          // Georgian descenders drop far below the baseline — the mask needs
          // real room or it shears the tails off. Taken back outside the mask.
          paddingBottom: '.26em',
          marginBottom: '-.26em',
          Top: {
            tag: 'span',
            display: 'block',
            lineHeight: '1.02',
            color: 'slateInk',
            text: '{{ hero.above.titleTop | polyglot }}',
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
          // Georgian descenders drop far below the baseline — the mask needs
          // real room or it shears the tails off. Taken back outside the mask.
          paddingBottom: '.26em',
          marginBottom: '-.26em',
          Main: {
            tag: 'span',
            display: 'block',
            lineHeight: '1.02',
            text: '{{ hero.above.title | polyglot }}',
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
        text: '{{ hero.above.lead | polyglot }}',
        '@tabletS': { fontSize: 'A' }
      }
    },

    ContentUnder: {
      flow: 'y',
      gap: 'C',
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
          text: '{{ hero.under.eyebrow | polyglot }}'
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
        // Anton is a single-weight condensed face and has no Georgian, so the
        // ka locale falls through to Contractica — whose Regular reads far
        // lighter next to Anton's mass. Its Black restores the display voice.
        isKa: (el, s) => (s.root.lang || 'en') === 'ka',
        '.isKa': { fontWeight: '900', letterSpacing: '-.01em' },
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
          // Georgian descenders drop far below the baseline — the mask needs
          // real room or it shears the tails off. Taken back outside the mask.
          paddingBottom: '.26em',
          marginBottom: '-.26em',
          Top: {
            tag: 'span',
            display: 'block',
            lineHeight: '1.02',
            color: 'mist',
            text: '{{ hero.under.titleTop | polyglot }}',
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
          // Georgian descenders drop far below the baseline — the mask needs
          // real room or it shears the tails off. Taken back outside the mask.
          paddingBottom: '.26em',
          marginBottom: '-.26em',
          Main: {
            tag: 'span',
            display: 'block',
            lineHeight: '1.02',
            text: '{{ hero.under.title | polyglot }}',
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
        text: '{{ hero.under.lead | polyglot }}',
        '@tabletS': { fontSize: 'A' }
      }
    }
  },

  // ── the bottom edge: the calls to action over the figure strip ──
  EdgeBand: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    flow: 'y',
    align: 'center center',
    gap: 'B',
    padding: '0 C C',
    '@tabletS': { position: 'static', padding: 'C 0 0' },

    EdgeAbove: {
      flow: 'y',
      align: 'center center',
      gap: 'B',
      width: '100%',
      show: (el, s) => s.root.heroWorld !== 'under',

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
          PillButton: { state: { tone: 'solid' }, text: '{{ common.openAccount | polyglot }}' }
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
            PillButton: { state: { tone: 'paper' }, text: '{{ cta.seeHow | polyglot }}' }
          }
        }
      },

      Stats: {
        flow: 'x',
        align: 'flex-start center',
        gap: 'D',
        flexWrap: 'wrap',
        paddingTop: 'B',
        borderTop: '1px solid line',
        width: '100%',
        maxWidth: 'I2',
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
        StatCell: { align: 'center center', state: { value: '$326T', label: 'hero.stat.assets' } },
        StatCell_1: { extends: 'StatCell', align: 'center center', state: { value: '$250', label: 'hero.stat.minimum' } },
        StatCell_2: { extends: 'StatCell', align: 'center center', state: { value: '6–9%', label: 'hero.stat.yield' } },
        StatCell_3: { extends: 'StatCell', align: 'center center', state: { value: 'T+0', label: 'hero.stat.settlement' } }
      }
    },

    EdgeUnder: {
      flow: 'y',
      align: 'center center',
      gap: 'B',
      width: '100%',
      show: (el, s) => s.root.heroWorld === 'under',

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
          PillButton: { state: { tone: 'inverse' }, text: '{{ cta.tokenize | polyglot }}' }
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
            PillButton: { state: { tone: 'outline' }, text: '{{ cta.platform | polyglot }}' }
          }
        }
      },

      Stats: {
        flow: 'x',
        align: 'flex-start center',
        gap: 'D',
        flexWrap: 'wrap',
        paddingTop: 'B',
        borderTop: '1px solid',
        borderTopColor: 'ivory.16',
        width: '100%',
        maxWidth: 'I2',
        textAlign: 'center',
        animationName: 'fcReveal',
        animationDuration: 'F',
        animationDelay: 'C1',
        animationFillMode: 'both',
        '@reduceMotion': { animationName: 'none' },
        '@tabletS': { gap: 'B' },

        childProps: {
          Value: { color: 'ivory' },
          Label: { color: 'ivory.55' }
        },
        StatCell: { align: 'center center', state: { value: '6', label: 'hero.stat.classes' } },
        StatCell_1: { extends: 'StatCell', align: 'center center', state: { value: '100%', label: 'hero.stat.capped' } },
        StatCell_2: { extends: 'StatCell', align: 'center center', state: { value: '75 bps', label: 'hero.stat.fee' } },
        StatCell_3: { extends: 'StatCell', align: 'center center', state: { value: '4', label: 'hero.stat.programs' } }
      }
    }
  }
}
