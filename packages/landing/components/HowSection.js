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

    // The state machine drawn as a rail: a rule that draws itself on reveal,
    // with a diamond node landing over each step column.
    FlowRail: {
      position: 'relative',
      width: '100%',
      height: 'Z',
      marginBottom: '-Z',
      '@tabletL': { display: 'none' },

      RailLine: {
        position: 'absolute',
        top: '50%',
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

      Nodes: {
        position: 'relative',
        flow: 'x',
        align: 'center space-between',
        width: '100%',
        height: '100%',
        // Each node sits over the center of its step column below.
        padding: '0 12.5%',

        childExtends: 'RailNode',
        childrenAs: 'state',
        children: [
          { nodeDelay: '.3s' },
          { nodeDelay: '.55s' },
          { nodeDelay: '.8s' },
          { nodeDelay: '1.05s' }
        ]
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


// One diamond node on the state-machine rail. state: { nodeDelay }
export const RailNode = {
  tag: 'span',
  width: 'X1',
  height: 'X1',
  background: 'accentInk',
  transform: 'rotate(45deg) scale(0)',
  transition: (el, s) => 'transform .5s cubic-bezier(.34,1.5,.5,1) ' + (s.nodeDelay || '.3s'),
  isInView: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
  '.isInView': { transform: 'rotate(45deg) scale(1)' },
  '@reduceMotion': { transform: 'rotate(45deg) scale(1)', transition: 'none' }
}