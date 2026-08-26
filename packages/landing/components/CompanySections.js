// Sections for /company — referenced from pages/company.js by key.

// The mission, set as an editorial pull-quote against the rule.
export const MissionSection = {
  extends: 'Section',

  Inner: {
    Quote: {
      flow: 'y',
      gap: 'B',
      paddingLeft: 'C',
      borderLeft: '2px solid',
      borderLeftColor: 'accentInk',
      maxWidth: 'J',
      '@tabletS': { paddingLeft: 'A' },

      P: {
        fontFamily: 'Display',
        fontSize: 'C1',
        lineHeight: '1.28',
        fontWeight: '600',
        letterSpacing: '-.025em',
        color: 'title',
        margin: '0',
        text: '{{ company.mission.quote | polyglot }}',
        '@tabletS': { fontSize: 'B1' }
      },
      Cite: {
        tag: 'span',
        fontFamily: 'Mono',
        fontSize: 'Z',
        letterSpacing: '.12em',
        textTransform: 'uppercase',
        color: 'caption',
        text: '{{ company.mission.cite | polyglot }}'
      }
    }
  }
}

// 01 — the principles, stated as constraints the code enforces.
export const ValuesSection = {
  extends: 'Section',
  theme: 'surface',

  Inner: {
    SectionHeading: {
      state: {
        num: '01',
        eyebrow: 'company.values.eyebrow',
        titleTop: 'company.values.titleTop',
        title: 'company.values.title',
        lead: 'company.values.lead'
      }
    },

    Grid: {
      display: 'grid',
      // Container-driven 2 → 1 (see AssetsSection).
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))',
      gap: 'A1',

      childExtends: 'AssetTile',
      childrenAs: 'state',
      children: [
        { revealDelay: '0s', icon: 'shield', name: 'company.values.physics.name', line: 'company.values.physics.line' },
        { revealDelay: '.08s', icon: 'lock', name: 'company.values.custody.name', line: 'company.values.custody.line' },
        { revealDelay: '.16s', icon: 'audit', name: 'company.values.audit.name', line: 'company.values.audit.line' },
        { revealDelay: '.24s', icon: 'coins', name: 'company.values.yield.name', line: 'company.values.yield.line' }
      ]
    }
  }
}

// 02 — the road so far, on the dashed rail.
export const MilestonesSection = {
  extends: 'Section',

  Inner: {
    SectionHeading: {
      state: {
        num: '02',
        eyebrow: 'company.milestones.eyebrow',
        titleTop: 'company.milestones.titleTop',
        title: 'company.milestones.title'
      }
    },

    Rail: {
      flow: 'y',
      width: '100%',
      maxWidth: 'J',

      childExtends: 'Milestone',
      childrenAs: 'state',
      children: [
        { revealDelay: '0s', when: '2024 Q4', what: 'company.milestones.m1', done: true },
        { revealDelay: '.08s', when: '2025 Q2', what: 'company.milestones.m2', done: true },
        { revealDelay: '.16s', when: '2025 Q4', what: 'company.milestones.m3', done: true },
        { revealDelay: '.24s', when: '2026 Q1', what: 'company.milestones.m4', done: true },
        { revealDelay: '.32s', when: '2026 Q3', what: 'company.milestones.m5', done: false },
        { revealDelay: '.4s', when: '2026 Q4', what: 'company.milestones.m6', done: false }
      ]
    }
  }
}

// One milestone row. state: { when, what, done, revealDelay }
export const Milestone = {
  flow: 'x',
  align: 'baseline flex-start',
  gap: 'B',
  padding: 'A 0',
  borderBottom: '1px dashed hairline',
  opacity: '0',
  transform: 'translate3d(-10px, 0, 0)',
  transition: (el, s) =>
    'opacity .7s ease ' + (s.revealDelay || '0s') +
    ', transform .7s cubic-bezier(.22,.68,.24,.98) ' + (s.revealDelay || '0s') +
    ', background .25s ease, padding .3s ease',
  isRevealed: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
  '.isRevealed': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
  ':hover': { background: 'veil', paddingLeft: 'Z' },
  '@reduceMotion': { opacity: '1', transform: 'none', transition: 'none' },
  '@mobileL': { gap: 'Z' },

  When: {
    tag: 'span',
    flexShrink: '0',
    width: 'F',
    '@mobileL': { width: 'D' },
    fontFamily: 'Mono',
    fontSize: 'Z',
    fontWeight: '600',
    letterSpacing: '.06em',
    color: 'accentInk',
    text: (el, s) => s.when || ''
  },
  What: {
    tag: 'span',
    flex: '1',
    fontSize: 'A',
    lineHeight: '1.5',
    color: (el, s) => (s.done ? 'title' : 'caption'),
    text: (el, s) => el.call('polyglot', s.what, s.root.lang)
  },
  Mark: {
    tag: 'span',
    flexShrink: '0',
    fontFamily: 'Mono',
    fontSize: 'Z',
    color: (el, s) => (s.done ? 'green' : 'caption'),
    text: (el, s) =>
      el.call('polyglot', s.done ? 'company.milestones.shipped' : 'company.milestones.ahead', s.root.lang)
  }
}

// 03 — the navy contact band.
export const ContactSection = {
  extends: 'Section',
  theme: 'inverted',
  position: 'relative',
  overflow: 'hidden',

  Lattice: {
    position: 'absolute',
    bottom: '-D',
    left: '-D',
    pointerEvents: 'none',
    color: 'mist.12',
    animationName: 'floatY',
    animationDuration: '11s',
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
      fontSize: 'F',
      lineHeight: '.98',
      fontWeight: '400',
      letterSpacing: '.01em',
      textTransform: 'uppercase',
      color: 'ivory',
      margin: '0',
      Top: { tag: 'span', display: 'block', color: 'mist', text: '{{ company.contact.titleTop | polyglot }}' },
      Main: { tag: 'span', display: 'block', text: '{{ company.contact.title | polyglot }}' },
      '@tabletS': { fontSize: 'D' }
    },

    P: {
      margin: '0',
      fontSize: 'A',
      lineHeight: '1.6',
      color: 'ivory.72',
      maxWidth: 'H+C',
      text: '{{ company.contact.lead | polyglot }}'
    },

    Actions: {
      flow: 'x',
      align: 'center center',
      gap: 'Z',
      flexWrap: 'wrap',

      Link: {
        href: 'mailto:careers@fractyco.app',
        text: '',
        textDecoration: 'none',
        display: 'inline-flex',
        PillButton: { state: { tone: 'inverse' }, text: 'careers@fractyco.app' }
      },
      Link_1: {
        href: 'mailto:hello@fractyco.app',
        text: '',
        textDecoration: 'none',
        display: 'inline-flex',
        PillButton: { state: { tone: 'outline' }, text: 'hello@fractyco.app' }
      }
    }
  }
}
