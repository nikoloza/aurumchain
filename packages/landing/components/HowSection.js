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
      position: 'relative',
      // Container-driven 4 → 2 → 1 — stacked max-width column rules proved
      // cascade-fragile; px in minmax() since letter tokens don't resolve
      // inside it.
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
      gap: 'A1',

      // The state machine drawn as a rail a step ('C') above the card tops —
      // each card's stem (height 'C', in StepCard) rises from its pin to meet
      // it exactly, and a diamond glides the full track once: the account
      // moving through the states.
      RailTrack: {
        position: 'absolute',
        top: '-C',
        left: '0',
        right: '0',
        height: '0',
        pointerEvents: 'none',
        '@tabletL': { display: 'none' },

        RailLine: {
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          borderTop: '1px dashed',
          borderTopColor: 'hairline',
          transformOrigin: 'left center',
          transform: 'scaleX(0)',
          transition: 'transform 1.4s cubic-bezier(.22,.68,.24,.98) .15s',
          isInView: (el, s) => s.inView !== false,
          '.isInView': { transform: 'scaleX(1)' },
          '@reduceMotion': { transform: 'scaleX(1)', transition: 'none' }
        },

        RailGlide: {
          tag: 'span',
          position: 'absolute',
          top: '0',
          left: '0%',
          width: 'X1',
          height: 'X1',
          background: 'accentInk',
          transform: 'translate(-50%, -50%) rotate(45deg)',
          opacity: '0',
          isInView: (el, s) => s.inView !== false,
          '.isInView': {
            animationName: 'railGlide',
            animationDuration: '2.8s',
            animationDelay: '1.5s',
            animationTimingFunction: 'cubic-bezier(.45,.05,.35,.95)',
            animationFillMode: 'both'
          },
          '@reduceMotion': { animationName: 'none' }
        }
      },

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