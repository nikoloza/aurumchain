// /faq — the questions we get first, on their own page.
export const faq = {
  extends: 'Page',
  flow: 'y',
  width: '100%',
  minHeight: '100vh',
  theme: 'document',

  metadata: {
    title: 'FAQ — Fractyco',
    description:
      'Who can invest, where the tokens live, what stops a non-compliant transfer, how payouts are calculated, and which network is live today.'
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
        eyebrow: 'FAQ',
        titleTop: 'Asked first,',
        title: 'answered straight',
        lead:
          'The short version of everything the longer pages explain — eligibility, custody, transfers, payouts, and what is live on devnet today.'
      }
    },

    FaqSection: {},
    ClosingSection: {}
  },

  SiteFooter: {}
}
