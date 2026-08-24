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
        eyebrow: 'Platform · Solana devnet',
        titleTop: 'One asset,',
        title: 'four authorities',
        lead:
          'No single key can mint, move, pay, and pause. Each power lives with a different program authority, and every use of it lands in the audit trail.',
        chips: ['Anchor × 4', 'SPL Token-2022', 'Transfer hook', 'USDC settlement']
      }
    },

    AuthoritySection: {},
    SettleSection: {},
    SafetySection: {},
    ClosingSection: {}
  },

  SiteFooter: {}
}
