// One open offering in the offerings list.
// state: { name, symbol, status, price, min, raised, goal, pct, closes }
export const OfferingRow = {
  flow: 'y',
  gap: 'Z',
  padding: 'A',
  borderRadius: 'A',
  theme: 'card',

  Head: {
    flow: 'x',
    align: 'flex-start space-between',
    gap: 'Z',
    flexWrap: 'wrap',

    Titles: {
      flow: 'y',
      gap: 'W',
      Name: {
        tag: 'h3',
        margin: '0',
        fontFamily: 'Display',
        fontSize: 'A1',
        fontWeight: '600',
        color: 'title',
        text: (el, s) => s.name || ''
      },
      Symbol: {
        tag: 'span',
        fontFamily: 'Mono',
        fontSize: 'Y1',
        color: 'caption',
        text: (el, s) => `${s.symbol || ''} · ${s.price || ''} per token · min ${s.min || ''}`
      }
    },

    Right: {
      flow: 'x',
      align: 'center center',
      gap: 'Z',
      StatusPill: {},
      ActionButton: { text: 'Subscribe' }
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
    fontSize: 'Y1',
    color: 'caption',

    Raised: { tag: 'span', text: (el, s) => `${s.raised || ''} of ${s.goal || ''} raised` },
    Closes: { tag: 'span', text: (el, s) => `closes ${s.closes || ''}` }
  }
}
