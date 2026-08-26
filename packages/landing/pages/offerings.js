// /offerings — what an offering fixes, what becomes a token, and the sample
// devnet issues.
export const offerings = {
  extends: 'Page',
  flow: 'y',
  width: '100%',
  minHeight: '100vh',
  theme: 'document',

  metadata: {
    title: 'Offerings — Fractyco',
    description:
      'An offering fixes the token symbol, the supply cap, the unit price, and the subscription window. The registry enforces every one of them.'
  },

  RouteVeil: {},
  Navbar: {},

  Main: {
    tag: 'main',
    flow: 'y',
    width: '100%',
    animationName: 'pageEnter',
    animationDuration: 'D',
    animationFillMode: 'both',
    '@reduceMotion': { animationName: 'none' },

    PageHero: {
      state: {
        eyebrow: 'page.offerings.eyebrow',
        titleTop: 'page.offerings.titleTop',
        title: 'page.offerings.title',
        lead: 'page.offerings.lead',
        chips: ['RBX-001', 'KGT-002', 'SVP-003', 'chip.devnetData']
      }
    },

    OfferingsSection: {},
    AssetsSection: {},
    ClosingSection: {}
  },

  SiteFooter: {}
}
