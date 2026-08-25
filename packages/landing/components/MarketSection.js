// Peer-to-peer resale before the asset completes.
export const MarketSection = {
  extends: 'Section',
  id: 'market',
  theme: 'surface',

  Inner: {
    SectionHeading: {
      state: {
        num: '06',
        eyebrow: 'Secondary market',
        titleTop: 'Exit before',
        title: 'the asset completes.',
        lead:
          'A holder lists part of a position at a chosen price. A buyer fills it in whole or in part. The escrow releases the tokens, the seller receives stablecoin, and both portfolios update from the trade.'
      }
    },

    // The market in three figures — they count up as the band reveals.
    Figures: {
      flow: 'x',
      align: 'stretch flex-start',
      gap: '0',
      width: '100%',
      border: '1px solid hairline',
      borderRadius: 'radiusCard',
      overflow: 'hidden',
      '@mobileL': { flow: 'y' },

      childExtends: 'MarketFigure',
      childrenAs: 'state',
      children: [
        { to: 75, suffix: ' bps', label: 'Taker fee, sent on-chain' },
        { to: 100, suffix: '%', label: 'Of listed tokens held in escrow' },
        { to: 24, suffix: '/7', label: 'Order book, no market hours' }
      ]
    },

    Row: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'A1',
      '@mobileL': { gridTemplateColumns: '1fr' },

      StepCard: {
        state: {
          step: 'LIST',
          title: 'Create a sell order',
          body:
            'The tokens move into a program escrow. The order records the amount, the unit price, and a sequence seed that makes the order address unique.'
        }
      },
      StepCard_1: {
        extends: 'StepCard',
        state: {
          step: 'FILL',
          title: 'Fill in part or in full',
          body:
            'A buyer takes any amount up to the remainder. The fee is taken in basis points and sent to the fee destination.'
        }
      },
      StepCard_2: {
        extends: 'StepCard',
        state: {
          step: 'SETTLE',
          title: 'Positions rebalance',
          body:
            'A database trigger reduces the seller position at its average cost and raises the buyer position at the paid price.'
        }
      }
    }
  }
}


// One figure cell in the market band — an accent underline sweeps in under
// the figure on hover. state: { to, prefix, suffix, label }
export const MarketFigure = {
  flow: 'y',
  gap: 'Y',
  flex: '1',
  padding: 'B',
  position: 'relative',
  overflow: 'hidden',
  borderRight: '1px solid hairline',
  transition: 'background .3s ease',
  ':after': {
    content: '""',
    position: 'absolute',
    bottom: '0',
    left: '0',
    width: '100%',
    height: 'W',
    background: 'accentInk',
    transform: 'scaleX(0)',
    transformOrigin: 'left center',
    transition: 'transform .4s cubic-bezier(.22,.68,.24,.98)'
  },
  ':hover': { background: 'veil', ':after': { transform: 'scaleX(1)' } },
  ':last-child': { borderRight: 'none' },
  '@mobileL': { borderRight: 'none', borderBottom: '1px solid hairline' },

  CountUp: {
    fontFamily: 'Mono',
    fontSize: 'E',
    fontWeight: '600',
    letterSpacing: '-.03em',
    lineHeight: '1.05',
    color: 'title',
    '@tabletS': { fontSize: 'D' }
  },

  Label: {
    tag: 'span',
    fontSize: 'Z',
    letterSpacing: '.04em',
    color: 'caption',
    text: (el, s) => s.label || ''
  }
}