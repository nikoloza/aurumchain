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
        eyebrow: 'Offerings',
        titleTop: 'Every asset,',
        title: 'a capped issue',
        lead:
          'One offering, four fixed terms: the token symbol, the supply cap, the unit price, and the subscription window. The mint authority is revoked at close, so the cap stops being a promise and becomes a property of the chain.',
        chips: ['RBX-001', 'KGT-002', 'SVP-003', 'Devnet data']
      }
    },

    OfferingsSection: {},
    AssetsSection: {},
    ClosingSection: {}
  },

  SiteFooter: {}
}
