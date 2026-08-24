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

    Row: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'A',
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
