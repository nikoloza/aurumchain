// /compliance — policy that executes itself: the transfer hook, the
// eligibility record, and the programs that enforce both.
export const compliance = {
  extends: 'Page',
  flow: 'y',
  width: '100%',
  minHeight: '100vh',
  theme: 'document',

  metadata: {
    title: 'Compliance — Fractyco',
    description:
      'Compliance runs inside the transfer path: the SPL Token-2022 hook validates every movement against the on-chain eligibility record before it allows the move.'
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
        eyebrow: 'Compliance',
        titleTop: 'Policy that',
        title: 'executes itself',
        lead:
          'Compliance is not a screen in front of the ledger — it runs inside the transfer path. An unverified wallet cannot receive tokens even through a direct transfer, because the token itself refuses the move.',
        chips: ['SPL Token-2022', 'Transfer hook', 'Eligibility record', 'Audit trail']
      }
    },

    ComplianceSection: {},
    ChainSection: {},
    ClosingSection: {}
  },

  SiteFooter: {}
}
