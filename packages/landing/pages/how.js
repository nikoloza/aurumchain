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
        eyebrow: 'page.how.eyebrow',
        titleTop: 'page.how.titleTop',
        title: 'page.how.title',
        lead: 'page.how.lead',
        chips: ['chip.kycApproved', 'chip.walletVerified', 'chip.cappedMint', 'chip.epochPayouts']
      }
    },

    HowSection: {},
    MarketSection: {},
    ClosingSection: {}
  },

  SiteFooter: {}
}
