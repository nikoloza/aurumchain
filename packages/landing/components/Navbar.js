// Sticky band. It rides the page transparently over the hero, then picks up
// the frosted wash, the hairline, and a tighter stance as soon as the page
// scrolls — the fill and hairline keep it readable over both the hero glow
// and the section washes. Scroll state is local and guarded, so the passive
// listener writes at most one update per crossing.
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
  state: { scrolled: false },
  background: (el, s) => (s.scrolled ? 'navWash' : 'transparent'),
  borderBottom: '1px solid',
  borderBottomColor: (el, s) => (s.scrolled ? 'hairline' : 'transparent'),
  transition: 'background .45s ease, border-color .45s ease',
  isScrolled: (el, s) => !!s.scrolled,
  '.isScrolled': { backdropFilter: 'saturate(1.5) blur(14px)' },
  '@tabletS': { padding: 'Z A' },

  onRender: (el, s) => {
    if (!el.node) return
    const doc = el.node.ownerDocument
    const sc = (doc.documentElement.scrollTop || 0) > 8
    if (sc !== !!s.scrolled) s.update({ scrolled: sc }, { preventFetch: true })
  },
  onWindowScroll: {
    passive: true,
    handler: (e, el, s) => {
      if (!el.node) return
      const doc = el.node.ownerDocument
      const sc = (doc.documentElement.scrollTop || 0) > 8
      if (sc !== !!s.scrolled) s.update({ scrolled: sc }, { preventFetch: true })
    }
  },

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
