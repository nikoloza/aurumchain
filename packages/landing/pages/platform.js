// /platform — the engineering deep-dive: who holds which authority, how one
// subscription settles through the four programs, and the controls that stop
// the machine.
export const platform = {
  extends: 'Page',
  flow: 'y',
  width: '100%',
  minHeight: '100vh',
  theme: 'document',

  metadata: {
    title: 'Platform — Fractyco',
    description:
      'The authority model, the settlement path, and the safety controls behind Fractyco tokenized assets on Solana.'
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
        eyebrow: 'page.platform.eyebrow',
        titleTop: 'page.platform.titleTop',
        title: 'page.platform.title',
        lead: 'page.platform.lead',
        chips: ['Anchor × 4', 'SPL Token-2022', 'chip.transferHook', 'chip.usdcSettlement']
      }
    },

    AuthoritySection: {},
    SettleSection: {},
    SafetySection: {},
    ClosingSection: {}
  },

  SiteFooter: {}
}
