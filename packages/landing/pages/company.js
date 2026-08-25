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
        eyebrow: 'Company',
        titleTop: 'The asset layer',
        title: 'for real things',
        lead:
          'A mine in Ashanti and a solar plant in Minas Gerais should be as easy to hold a fraction of as a public stock — without giving up the compliance that makes them real investments.',
        chips: ['Founded 2024', 'Devnet live', 'Four programs', 'Audit in progress']
      }
    },

    MissionSection: {},
    ValuesSection: {},
    MilestonesSection: {},
    ContactSection: {}
  },

  SiteFooter: {}
}
