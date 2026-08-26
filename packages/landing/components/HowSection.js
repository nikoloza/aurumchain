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
        eyebrow: 'how.eyebrow',
        titleTop: 'how.titleTop',
        title: 'how.title',
        lead: 'how.lead'
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
          title: 'how.step1.title',
          body: 'how.step1.body'
        }
      },
      StepCard_1: {
        extends: 'StepCard',
        state: {
          revealDelay: '.09s',
          step: '02',
          title: 'how.step2.title',
          body: 'how.step2.body'
        }
      },
      StepCard_2: {
        extends: 'StepCard',
        state: {
          revealDelay: '.18s',
          step: '03',
          title: 'how.step3.title',
          body: 'how.step3.body'
        }
      },
      StepCard_3: {
        extends: 'StepCard',
        state: {
          revealDelay: '.27s',
          step: '04',
          title: 'how.step4.title',
          body: 'how.step4.body'
        }
      }
    }
  }
}