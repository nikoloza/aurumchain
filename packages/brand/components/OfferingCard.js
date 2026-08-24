// Sample offering tile. state: { name, location, status, raised, goal,
// pct, price, symbol, apr }
export const OfferingCard = {
  flow: 'y',
  gap: 'A',
  padding: 'B',
  borderRadius: 'radiusCard',
  theme: 'card',
  transition: (el, s) => 'opacity .8s cubic-bezier(.22,.68,.24,.98) ' + (s.revealDelay || '0s') + ', transform .25s ease, border-color .25s ease',
  opacity: '0',
  isRevealed: (el, s) => s.inView !== false,
  '.isRevealed': { opacity: '1' },
  '@reduceMotion': { opacity: '1', transition: 'none' },
  onMousemove: (ev, el) => el.call('tiltCard', ev),
  onMouseout: (ev, el) => el.call('tiltReset', ev),
  ':hover': { transform: 'translateY(-3px)', borderColor: 'slate.45' },

  Head: {
    flow: 'x',
    align: 'flex-start space-between',
    gap: 'Z',

    Titles: {
      flow: 'y',
      gap: 'W',
      H3: {
        fontFamily: 'Display',
        fontSize: 'A1',
        fontWeight: '600',
        letterSpacing: '-.015em',
        color: 'title',
        margin: '0',
        text: (el, s) => s.name || ''
      },
      Loc: {
        tag: 'span',
        fontSize: 'Z',
        color: 'caption',
        text: (el, s) => s.location || ''
      }
    },

    ChipAccent: {
      text: (el, s) => s.status || ''
    }
  },

  Bar: {
    position: 'relative',
    width: '100%',
    height: 'Y',
    borderRadius: 'E',
    background: 'veil',
    overflow: 'hidden',

    Fill: {
      position: 'absolute',
      top: '0',
      left: '0',
      height: '100%',
      borderRadius: 'E',
      background: 'meter',
      // The meter draws itself once the section is revealed; anywhere
      // without reveal state (the product shells) it renders settled.
      width: (el, s) => (s.inView === false ? '0%' : `${Math.min(100, Number(s.pct) || 0)}%`),
      transition: 'width 1.3s cubic-bezier(.22,.68,.24,.98) .35s',
      '@reduceMotion': { transition: 'none' }
    }
  },

  Meta: {
    flow: 'x',
    align: 'center space-between',
    gap: 'Z',
    fontFamily: 'Mono',
    fontSize: 'Z',

    Raised: {
      tag: 'span',
      color: 'title',
      text: (el, s) => `${s.raised || ''} / ${s.goal || ''}`
    },
    Pct: {
      tag: 'span',
      color: 'accentInk',
      text: (el, s) => `${s.pct || 0}%`
    }
  },

  Footer: {
    flow: 'x',
    align: 'center space-between',
    gap: 'Z',
    paddingTop: 'Z',
    borderTop: '1px solid hairline',

    Token: {
      tag: 'span',
      fontFamily: 'Mono',
      fontSize: 'Y1',
      letterSpacing: '.06em',
      color: 'caption',
      text: (el, s) => `${s.symbol || ''} · ${s.price || ''}`
    },
    Apr: {
      tag: 'span',
      fontFamily: 'Mono',
      fontSize: 'Z',
      fontWeight: '700',
      color: 'green',
      text: (el, s) => s.apr || ''
    }
  }
}
