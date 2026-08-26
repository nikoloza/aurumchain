export const main = {
  extends: 'Page',
  flow: 'y',
  width: '100%',
  minHeight: '100vh',
  theme: 'document',

  metadata: {
    title: 'Fractyco — Tokenized real-world assets',
    description:
      'Fractyco tokenizes real-world assets. Investors buy compliant fractions, hold them on Solana, and receive on-chain payouts.'
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

    Hero: {},
    Ticker: {},
    HowSection: {},
    AssetsSection: {},
    OfferingsSection: {},
    ComplianceSection: {},
    ChainSection: {},
    MarketSection: {},
    FaqSection: {},
    ClosingSection: {}
  },

  SiteFooter: {}
}
