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
        eyebrow: 'page.compliance.eyebrow',
        titleTop: 'page.compliance.titleTop',
        title: 'page.compliance.title',
        lead: 'page.compliance.lead',
        chips: ['SPL Token-2022', 'chip.transferHook', 'chip.eligibilityRecord', 'chip.auditTrail']
      }
    },

    ComplianceSection: {},
    ChainSection: {},
    ClosingSection: {}
  },

  SiteFooter: {}
}
