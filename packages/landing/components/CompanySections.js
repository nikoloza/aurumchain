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
        text:
          'Most of the world’s value sits in assets that never trade: land, plants, concessions, credit. We give each one a supply-capped token, a compliance hook, and a payout path — and leave custody with the owner.',
        '@tabletS': { fontSize: 'B1' }
      },
      Cite: {
        tag: 'span',
        fontFamily: 'Mono',
        fontSize: 'Z',
        letterSpacing: '.12em',
        textTransform: 'uppercase',
        color: 'caption',
        text: '— The reason the four programs exist'
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
        eyebrow: 'Principles',
        titleTop: 'Rules we wrote',
        title: 'into the programs.',
        lead: 'A principle you can’t enforce is a slogan. Each of ours is a constraint the chain checks on every transaction.'
      }
    },

    Grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'A',
      '@mobileL': { gridTemplateColumns: '1fr' },

      childExtends: 'AssetTile',
      childrenAs: 'state',
      children: [
        { revealDelay: '0s', icon: 'shield', name: 'Compliance is physics', line: 'The token itself refuses a non-compliant transfer — policy lives in the transfer path, not in a terms page.' },
        { revealDelay: '.08s', icon: 'lock', name: 'Custody stays with you', line: 'Tokens mint to the investor wallet. We keep the ledger honest; we never hold the asset.' },
        { revealDelay: '.16s', icon: 'audit', name: 'Auditable by anyone', line: 'Every authority action is a public transaction. Our console reads the same records an explorer does.' },
        { revealDelay: '.24s', icon: 'coins', name: 'Yield settles on-chain', line: 'Payouts distribute in USDC against sealed snapshots — no cheques, no quarters, no trust required.' }
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
        eyebrow: 'Milestones',
        titleTop: 'Shipping order,',
        title: 'not press-release order.'
      }
    },

    Rail: {
      flow: 'y',
      width: '100%',
      maxWidth: 'J',

      childExtends: 'Milestone',
      childrenAs: 'state',
      children: [
        { revealDelay: '0s', when: '2024 Q4', what: 'First registry program on devnet — supply caps enforced on mint', done: true },
        { revealDelay: '.08s', when: '2025 Q2', what: 'Transfer hook clears its first compliant transfer end-to-end', done: true },
        { revealDelay: '.16s', when: '2025 Q4', what: 'Distribution epochs pay 312 devnet holders from one snapshot', done: true },
        { revealDelay: '.24s', when: '2026 Q1', what: 'Secondary market escrow fills its first partial order', done: true },
        { revealDelay: '.32s', when: '2026 Q3', what: 'Program audit of all four programs', done: false },
        { revealDelay: '.4s', when: '2026 Q4', what: 'Mainnet — first regulated offering opens', done: false }
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
    text: (el, s) => s.what || ''
  },
  Mark: {
    tag: 'span',
    flexShrink: '0',
    fontFamily: 'Mono',
    fontSize: 'Z',
    color: (el, s) => (s.done ? 'green' : 'caption'),
    text: (el, s) => (s.done ? '✓ shipped' : '— ahead')
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
      Top: { tag: 'span', display: 'block', color: 'mist', text: 'Building the rails?' },
      Main: { tag: 'span', display: 'block', text: 'Come build them here' },
      '@tabletS': { fontSize: 'D' }
    },

    P: {
      margin: '0',
      fontSize: 'A',
      lineHeight: '1.6',
      color: 'ivory.72',
      maxWidth: 'H+C',
      text: 'We are a small team across Tbilisi and Lisbon: Rust on-chain, TypeScript off it, and one shared standard — if the chain can enforce it, don’t ask a human to.'
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
