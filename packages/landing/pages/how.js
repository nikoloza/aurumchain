// /how — the eligibility state machine on its own page: the four states an
// account moves through, and the compliance rails that advance with it.
export const how = {
  extends: 'Page',
  flow: 'y',
  width: '100%',
  minHeight: '100vh',
  theme: 'document',

  metadata: {
    title: 'How it works — Fractyco',
    description:
      'Eligibility is a state machine: verify identity, link a wallet, subscribe, hold and earn — with the on-chain compliance record advancing at every step.'
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
        eyebrow: 'How it works',
        titleTop: 'From signed up,',
        title: 'to getting paid',
        lead:
          'Eligibility is a state machine, not a checkbox. An account advances one step at a time — and the on-chain compliance record advances with it, so the application never has to trust a display tier.',
        chips: ['KYC approved', 'Wallet verified', 'Supply-capped mint', 'Epoch payouts']
      }
    },

    HowSection: {},
    MarketSection: {},
    ClosingSection: {}
  },

  SiteFooter: {}
}
