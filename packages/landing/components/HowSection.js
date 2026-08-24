// The four states an account moves through. They mirror the eligibility state
// machine in the database: registered → wallet verified → KYC approved →
// investment eligible.
export const HowSection = {
  extends: 'Section',
  id: 'how',
  theme: 'surface',

  Inner: {
    SectionHeading: {
      state: {
        num: '01',
        eyebrow: 'How it works',
        titleTop: 'Four states between',
        title: 'signing up and getting paid.',
        lead:
          'Eligibility is a state machine, not a checkbox. An account advances one step at a time, and the on-chain compliance record advances with it.'
      }
    },

    Grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 'A',
      '@tabletL': { gridTemplateColumns: 'repeat(2, 1fr)' },
      '@mobileL': { gridTemplateColumns: '1fr' },

      StepCard: {
        state: {
          revealDelay: '0s',
          step: '01',
          title: 'Verify identity',
          body:
            'Complete the identity checks through the KYC provider. Approval writes an eligibility record and unlocks subscription.'
        }
      },
      StepCard_1: {
        extends: 'StepCard',
        state: {
          revealDelay: '.09s',
          step: '02',
          title: 'Link a wallet',
          body:
            'Sign a server-issued nonce to prove wallet ownership. The compliance program then records the verified wallet on-chain.'
        }
      },
      StepCard_2: {
        extends: 'StepCard',
        state: {
          revealDelay: '.18s',
          step: '03',
          title: 'Subscribe',
          body:
            'Commit stablecoin to an open offering. The operator finalizes the subscription and the registry mints tokens to the wallet.'
        }
      },
      StepCard_3: {
        extends: 'StepCard',
        state: {
          revealDelay: '.27s',
          step: '04',
          title: 'Hold and earn',
          body:
            'Positions accrue a payout each distribution epoch. Claim to the linked wallet, or list the position on the secondary market.'
        }
      }
    }
  }
}
