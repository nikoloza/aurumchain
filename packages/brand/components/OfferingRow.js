// One open offering in the offerings list.
// state: { name, symbol, status, price, min, raised, goal, pct, closes }
export const OfferingRow = {
  flow: 'y',
  gap: 'Z',
  padding: 'A',
  borderRadius: 'radiusCard',
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
        text: (el, s) => el.call('polyglot', s.name || '', s.root.lang)
      },
      Symbol: {
        tag: 'span',
        fontFamily: 'Mono',
        fontSize: 'Y1',
        color: 'caption',
        // The figures stay put; only the connective words resolve through
        // polyglot, so neither language has to fight the other's word order.
        text: (el, s) =>
          `${s.symbol || ''} · ${s.price || ''} ${el.call('polyglot', 'offering.perToken', s.root.lang)}` +
          ` · ${el.call('polyglot', 'offering.min', s.root.lang)} ${s.min || ''}`
      }
    },

    Right: {
      flow: 'x',
      align: 'center center',
      gap: 'Z',
      StatusPill: {},
      ActionButton: { text: '{{ offering.subscribe | polyglot }}' }
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

    Raised: {
      tag: 'span',
      text: (el, s) =>
        `${s.raised || ''} / ${s.goal || ''} ${el.call('polyglot', 'offering.raised', s.root.lang)}`
    },
    Closes: {
      tag: 'span',
      text: (el, s) => `${el.call('polyglot', 'offering.closes', s.root.lang)} ${s.closes || ''}`
    }
  }
}
