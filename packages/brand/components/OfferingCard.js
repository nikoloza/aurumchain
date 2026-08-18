// Sample offering tile. state: { name, location, status, raised, goal,
// pct, price, symbol, apr }
export const OfferingCard = {
  flow: 'y',
  gap: 'A',
  padding: 'B',
  borderRadius: 'B',
  theme: 'card',
  transition: 'transform .25s ease, border-color .25s ease',
  ':hover': { transform: 'translateY(-3px)', borderColor: 'gold.4' },

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
      background: 'gold',
      width: (el, s) => `${Math.min(100, Number(s.pct) || 0)}%`
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
      color: 'gold',
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
