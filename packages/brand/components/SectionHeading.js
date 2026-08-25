// Section lead-in in the brandbook's editorial voice: a numbered eyebrow on a
// dashed rule with a diamond node, then a two-tone headline — the opening
// phrase in slate, the payoff in the title ink — and a supporting line.
// state: { num, eyebrow, titleTop, title, lead }
export const SectionHeading = {
  flow: 'y',
  gap: 'A',
  width: '100%',
  maxWidth: 'I2',
  alignItems: 'flex-start',

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
      transform: 'rotate(45deg)'
    },
    Num: {
      tag: 'span',
      fontFamily: 'Mono',
      fontSize: 'Y1',
      fontWeight: '600',
      letterSpacing: '.14em',
      lineHeight: '1',
      color: 'accentInk',
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
    fontSize: 'E',
    lineHeight: '1.06',
    fontWeight: '700',
    letterSpacing: '-.028em',
    color: 'title',
    margin: '0',
    '@tabletS': { fontSize: 'C1' },

    Top: {
      tag: 'span',
      display: 'block',
      color: 'accentInk',
      text: (el, s) => s.titleTop || '',
      show: (el, s) => !!s.titleTop
    },
    Main: {
      tag: 'span',
      display: 'block',
      text: (el, s) => s.title || ''
    }
  },

  P: {
    order: '2',
    fontSize: 'A',
    lineHeight: '1.6',
    color: 'paragraph',
    margin: '0',
    maxWidth: 'I',
    text: (el, s) => s.lead || '',
    show: (el, s) => !!s.lead
  }
}
