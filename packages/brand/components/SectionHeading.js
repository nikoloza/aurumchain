// Section lead-in in the brandbook's editorial voice: a numbered eyebrow on a
// dashed rule with a diamond node, then a two-tone headline — the opening
// phrase in slate, the payoff in the title ink — and a supporting line.
//
// The whole block choreographs on the owning Section's reveal: the diamond
// pops, the eyebrow fades in as the rule draws itself, the headline lines
// rise out of overflow masks the way the hero's do, and the lead settles
// last. Every gate walks the state chain for `inView`, so anywhere without
// reveal state (product shells, deep links) the heading renders settled.
// state: { num, eyebrow, titleTop, title, lead }
export const SectionHeading = {
  flow: 'y',
  gap: 'A',
  width: '100%',
  maxWidth: 'I2',
  alignItems: 'flex-start',
  position: 'relative',

  // The section number as an editorial ghost — oversized, in the veil ink,
  // settling behind the heading's top-right as the section reveals.
  Watermark: {
    tag: 'span',
    position: 'absolute',
    top: '-Z',
    right: '0',
    fontFamily: 'Brand',
    fontSize: 'J',
    lineHeight: '.8',
    letterSpacing: '.02em',
    color: 'veilStrong',
    pointerEvents: 'none',
    userSelect: 'none',
    attr: { 'aria-hidden': 'true' },
    opacity: '0',
    transform: 'translate3d(0, 10px, 0)',
    transition: 'opacity .9s ease .3s, transform .9s cubic-bezier(.22,.68,.24,.98) .3s',
    isInView: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
    '.isInView': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
    '@reduceMotion': { opacity: '1', transform: 'none', transition: 'none' },
    text: (el, s) => s.num || '',
    show: (el, s) => !!s.num,
    '@tabletS': { display: 'none' }
  },

  Eyebrow: {
    order: '0',
    flow: 'x',
    align: 'center flex-start',
    gap: 'Z',
    width: '100%',

    Diamond: {
      tag: 'span',
      flexShrink: '0',
      width: 'X1',
      height: 'X1',
      background: 'accentInk',
      transform: 'rotate(45deg) scale(0)',
      transition: 'transform .5s cubic-bezier(.34,1.5,.5,1) .05s',
      isInView: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
      '.isInView': { transform: 'rotate(45deg) scale(1)' },
      '@reduceMotion': { transform: 'rotate(45deg) scale(1)', transition: 'none' }
    },
    Num: {
      tag: 'span',
      fontFamily: 'Mono',
      fontSize: 'Y1',
      fontWeight: '600',
      letterSpacing: '.14em',
      lineHeight: '1',
      color: 'accentInk',
      opacity: '0',
      transition: 'opacity .6s ease .12s',
      isInView: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
      '.isInView': { opacity: '1' },
      '@reduceMotion': { opacity: '1', transition: 'none' },
      text: (el, s) => s.num || '',
      show: (el, s) => !!s.num
    },
    Label: {
      tag: 'span',
      fontSize: 'Y1',
      fontWeight: '600',
      letterSpacing: '.16em',
      lineHeight: '1',
      textTransform: 'uppercase',
      color: 'caption',
      opacity: '0',
      transition: 'opacity .6s ease .18s',
      isInView: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
      '.isInView': { opacity: '1' },
      '@reduceMotion': { opacity: '1', transition: 'none' },
      text: (el, s) => s.eyebrow || ''
    },
    Rule: {
      flex: '1',
      alignSelf: 'center',
      borderTop: '1px dashed',
      borderTopColor: 'hairline',
      transformOrigin: 'left center',
      transform: 'scaleX(0)',
      transition: 'transform 1.1s cubic-bezier(.22,.68,.24,.98) .2s',
      // Sections flip `inView` when scrolled to. The heading's instance
      // state is its own owner, so walk the state chain; anywhere without
      // reveal state the rule stays drawn.
      isInView: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
      '.isInView': { transform: 'scaleX(1)' },
      '@reduceMotion': { transform: 'scaleX(1)', transition: 'none' }
    }
  },

  H2: {
    order: '1',
    fontFamily: 'Display',
    fontSize: 'E1',
    lineHeight: '1.06',
    fontWeight: '700',
    letterSpacing: '-.028em',
    color: 'title',
    margin: '0',
    '@tabletS': { fontSize: 'C1' },

    // Each line lives in an overflow mask and rises into place. The masks
    // carry a compensating pad so descenders never clip against the tight
    // display line-height.
    TopMask: {
      tag: 'span',
      display: 'block',
      overflow: 'hidden',
      paddingBottom: '.1em',
      marginBottom: '-.1em',
      show: (el, s) => !!s.titleTop,
      Top: {
        tag: 'span',
        display: 'block',
        color: 'accentInk',
        transform: 'translate3d(0, 112%, 0)',
        transition: 'transform .85s cubic-bezier(.22,.68,.24,.98) .1s',
        isInView: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
        '.isInView': { transform: 'translate3d(0, 0, 0)' },
        '@reduceMotion': { transform: 'none', transition: 'none' },
        text: (el, s) => s.titleTop || ''
      }
    },
    MainMask: {
      tag: 'span',
      display: 'block',
      overflow: 'hidden',
      paddingBottom: '.1em',
      marginBottom: '-.1em',
      Main: {
        tag: 'span',
        display: 'block',
        transform: 'translate3d(0, 112%, 0)',
        transition: 'transform .85s cubic-bezier(.22,.68,.24,.98) .22s',
        isInView: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
        '.isInView': { transform: 'translate3d(0, 0, 0)' },
        '@reduceMotion': { transform: 'none', transition: 'none' },
        text: (el, s) => s.title || ''
      }
    }
  },

  P: {
    order: '2',
    fontSize: 'A',
    lineHeight: '1.6',
    color: 'paragraph',
    margin: '0',
    maxWidth: 'I',
    opacity: '0',
    transform: 'translate3d(0, 12px, 0)',
    transition: 'opacity .7s ease .38s, transform .7s cubic-bezier(.22,.68,.24,.98) .38s',
    isInView: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
    '.isInView': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
    '@reduceMotion': { opacity: '1', transform: 'none', transition: 'none' },
    text: (el, s) => s.lead || '',
    show: (el, s) => !!s.lead
  }
}
