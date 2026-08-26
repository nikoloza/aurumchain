// Peer-to-peer resale before the asset completes.
export const MarketSection = {
  extends: 'Section',
  id: 'market',
  theme: 'surface',

  Inner: {
    SectionHeading: {
      state: {
        num: '06',
        eyebrow: 'market.eyebrow',
        titleTop: 'market.titleTop',
        title: 'market.title',
        lead: 'market.lead'
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
        { to: 75, suffix: ' bps', label: 'market.fig1.label' },
        { to: 100, suffix: '%', label: 'market.fig2.label' },
        { to: 24, suffix: '/7', label: 'market.fig3.label' }
      ]
    },

    Row: {
      display: 'grid',
      // Container-driven 3 → 2 → 1 (see AssetsSection).
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
      gap: 'A1',

      StepCard: {
        state: {
          step: 'market.step1.step',
          title: 'market.step1.title',
          body: 'market.step1.body'
        }
      },
      StepCard_1: {
        extends: 'StepCard',
        state: {
          step: 'market.step2.step',
          title: 'market.step2.title',
          body: 'market.step2.body'
        }
      },
      StepCard_2: {
        extends: 'StepCard',
        state: {
          step: 'market.step3.step',
          title: 'market.step3.title',
          body: 'market.step3.body'
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
    text: (el, s) => el.call('polyglot', s.label, s.root.lang)
  }
}