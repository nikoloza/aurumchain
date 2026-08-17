// One holding in the portfolio.
// state: { name, symbol, tokens, invested, avg, value, ret, tone }
export const PositionCard = {
  flow: 'y',
  gap: 'Z',
  padding: 'A',
  borderRadius: 'A',
  theme: 'card',

  Head: {
    flow: 'x',
    align: 'center space-between',
    gap: 'Z',

    Name: {
      tag: 'h3',
      margin: '0',
      fontFamily: 'Display',
      fontSize: 'A',
      fontWeight: '600',
      color: 'title',
      text: (el, s) => s.name || ''
    },
    Chip: { text: (el, s) => s.symbol || '' }
  },

  Grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 'Z',
    '@mobileL': { gridTemplateColumns: 'repeat(2, 1fr)' },

    Tokens: {
      flow: 'y',
      gap: 'W',
      K: { tag: 'span', fontSize: 'Y', letterSpacing: '.08em', textTransform: 'uppercase', color: 'caption', text: 'Tokens' },
      V: { tag: 'span', fontFamily: 'Mono', fontSize: 'A', color: 'title', text: (el, s) => s.tokens || '' }
    },
    Invested: {
      flow: 'y',
      gap: 'W',
      K: { tag: 'span', fontSize: 'Y', letterSpacing: '.08em', textTransform: 'uppercase', color: 'caption', text: 'Invested' },
      V: { tag: 'span', fontFamily: 'Mono', fontSize: 'A', color: 'title', text: (el, s) => s.invested || '' }
    },
    Avg: {
      flow: 'y',
      gap: 'W',
      K: { tag: 'span', fontSize: 'Y', letterSpacing: '.08em', textTransform: 'uppercase', color: 'caption', text: 'Avg price' },
      V: { tag: 'span', fontFamily: 'Mono', fontSize: 'A', color: 'title', text: (el, s) => s.avg || '' }
    },
    Return: {
      flow: 'y',
      gap: 'W',
      K: { tag: 'span', fontSize: 'Y', letterSpacing: '.08em', textTransform: 'uppercase', color: 'caption', text: 'Return' },
      V: {
        tag: 'span',
        fontFamily: 'Mono',
        fontSize: 'A',
        text: (el, s) => s.ret || '',
        color: (el, s) => (s.tone === 'down' ? 'red' : 'green')
      }
    }
  },

  Actions: {
    flow: 'x',
    gap: 'Z',
    paddingTop: 'Z',
    borderTop: '1px solid white.06',

    ActionButton: { state: { tone: 'secondary' }, text: 'List on marketplace' },
    ActionButton_1: { extends: 'ActionButton', state: { tone: 'ghost' }, text: 'View payouts' }
  }
}
