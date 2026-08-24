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

  Navbar: {},

  Main: {
    tag: 'main',
    flow: 'y',
    width: '100%',

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
