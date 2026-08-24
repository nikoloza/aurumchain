// Sticky band. It stays visible for the whole page — the translucent fill and
// the hairline keep it readable over both the hero glow and the section washes.
export const Navbar = {
  tag: 'header',
  flow: 'x',
  align: 'center space-between',
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  zIndex: '50',
  padding: 'Z C',
  theme: 'nav',
  backdropFilter: 'saturate(1.5) blur(14px)',
  borderBottom: '1px solid hairline',
  '@tabletS': { padding: 'Z A' },

  Logo: {},

  NavLinks: {
    tag: 'nav',
    attr: { 'aria-label': 'Primary' },
    flow: 'x',
    align: 'center center',
    gap: 'X',
    '@tabletL': { display: 'none' },

    NavItem: { state: { anchor: 'how', target: 'HowSection', label: 'How it works' } },
    NavItem_1: { extends: 'NavItem', state: { anchor: 'offerings', target: 'OfferingsSection', label: 'Offerings' } },
    NavItem_2: { extends: 'NavItem', state: { anchor: 'compliance', target: 'ComplianceSection', label: 'Compliance' } },
    NavItem_3: { extends: 'NavItem', state: { path: '/platform', label: 'Platform' } },
    NavItem_4: { extends: 'NavItem', state: { path: '/company', label: 'Company' } },
    NavItem_5: { extends: 'NavItem', state: { anchor: 'faq', target: 'FaqSection', label: 'FAQ' } }
  },

  Actions: {
    flow: 'x',
    align: 'center center',
    gap: 'Z',

    ThemeToggle: {},
    Link: {
      href: 'https://fractyco--app.at.symbo.ls/signin',
      text: '',
      display: 'inline-flex',
      textDecoration: 'none',
      '@mobileL': { display: 'none' },
      PillButton: { state: { tone: 'secondary' }, text: 'Sign in' }
    },
    Link_1: {
      href: 'https://fractyco--app.at.symbo.ls/signin',
      text: '',
      display: 'inline-flex',
      textDecoration: 'none',
      PillButton: { state: { tone: 'primary' }, text: 'Open an account' }
    }
  }
}
