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
  borderBottom: '1px solid white.08',
  '@tabletS': { padding: 'Z A' },

  Link: {
    href: '/',
    text: '',
    display: 'inline-flex',
    alignItems: 'center',
    textDecoration: 'none',
    Logo: {}
  },

  NavLinks: {
    tag: 'nav',
    attr: { 'aria-label': 'Primary' },
    flow: 'x',
    align: 'center center',
    gap: 'X',
    '@tabletL': { display: 'none' },

    NavLink: { href: '#how', state: { target: 'HowSection' }, text: 'How it works' },
    NavLink_1: { extends: 'NavLink', href: '#offerings', state: { target: 'OfferingsSection' }, text: 'Offerings' },
    NavLink_2: { extends: 'NavLink', href: '#compliance', state: { target: 'ComplianceSection' }, text: 'Compliance' },
    NavLink_3: { extends: 'NavLink', href: '#chain', state: { target: 'ChainSection' }, text: 'On-chain' },
    NavLink_4: { extends: 'NavLink', href: '#faq', state: { target: 'FaqSection' }, text: 'FAQ' }
  },

  Actions: {
    flow: 'x',
    align: 'center center',
    gap: 'Z',

    Link: {
      href: '/login',
      text: '',
      display: 'inline-flex',
      textDecoration: 'none',
      '@mobileL': { display: 'none' },
      PillButton: { state: { tone: 'secondary' }, text: 'Sign in' }
    },
    Link_1: {
      href: '/signup',
      text: '',
      display: 'inline-flex',
      textDecoration: 'none',
      PillButton: { state: { tone: 'primary' }, text: 'Open an account' }
    }
  }
}
