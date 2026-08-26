// /company — why Fractyco exists, the principles the programs encode, the
// milestones so far, and how to reach the team.
export const company = {
  extends: 'Page',
  flow: 'y',
  width: '100%',
  minHeight: '100vh',
  theme: 'document',

  metadata: {
    title: 'Company — Fractyco',
    description:
      'Fractyco builds the asset layer for real things: compliant fractions of real-world assets, settled on Solana.'
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
        eyebrow: 'page.company.eyebrow',
        titleTop: 'page.company.titleTop',
        title: 'page.company.title',
        lead: 'page.company.lead',
        chips: ['chip.founded', 'chip.devnetLive', 'chip.fourPrograms', 'chip.auditInProgress']
      }
    },

    MissionSection: {},
    ValuesSection: {},
    MilestonesSection: {},
    ContactSection: {}
  },

  SiteFooter: {}
}
