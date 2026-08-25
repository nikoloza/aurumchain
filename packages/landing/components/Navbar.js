// Sticky band. The page links and the theme switch live in a hamburger menu
// next to the logo; the world switcher sits top-center (home only — it
// drives the hero through root state); sign-in actions keep the right edge.
// On the home page the bar is frosted from the very top — the hero band
// beneath keeps its own light in both schemes, so the chrome must carry the
// page theme itself. On inner pages it rides transparently over the page
// hero and frosts once the page scrolls. Scroll and menu state are local;
// the passive scroll listener writes at most one update per crossing.
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
  state: { scrolled: false, menuOpen: false },
  background: (el, s) => (s.scrolled || (s.root.route || '/') === '/' ? 'navWash' : 'transparent'),
  borderBottom: '1px solid',
  borderBottomColor: (el, s) => (s.scrolled || (s.root.route || '/') === '/' ? 'hairline' : 'transparent'),
  transition: 'background .45s ease, border-color .45s ease',
  isFrosted: (el, s) => !!s.scrolled || (s.root.route || '/') === '/',
  '.isFrosted': { backdropFilter: 'saturate(1.5) blur(14px)' },
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
  // The menu closes on an outside click or Escape — document-level listeners
  // are framework-owned via the flat onDocumentXxx props.
  onDocumentClick: (e, el, s) => {
    if (!s.menuOpen) return
    if (el.node && el.node.contains(e.target)) return
    s.update({ menuOpen: false }, { preventFetch: true })
  },
  onDocumentKeydown: (e, el, s) => {
    if (e.key === 'Escape' && s.menuOpen) s.update({ menuOpen: false }, { preventFetch: true })
  },

  Left: {
    flow: 'x',
    align: 'center flex-start',
    gap: 'Z',

    Burger: {
      tag: 'button',
      flow: 'x',
      align: 'center center',
      flexShrink: '0',
      width: 'B1',
      height: 'B1',
      padding: '0',
      borderRadius: 'E',
      border: '1px solid hairline',
      background: 'transparent',
      color: 'caption',
      cursor: 'pointer',
      transition: 'color .18s ease, background .18s ease',
      ':hover': { color: 'title', background: 'veil' },
      ':active': { transform: 'scale(.94)' },
      type: 'button',
      ariaLabel: 'Menu',
      ariaExpanded: (el, s) => String(!!s.menuOpen),
      onClick: (ev, el, s) => s.update({ menuOpen: !s.menuOpen }, { preventFetch: true }),

      OpenGlyph: {
        display: 'inline-flex',
        show: (el, s) => !s.menuOpen,
        Icon: { name: 'menu', fontSize: 'A' }
      },
      CloseGlyph: {
        display: 'inline-flex',
        show: (el, s) => !!s.menuOpen,
        Icon: { name: 'close', fontSize: 'A' }
      }
    },

    Logo: {}
  },

  // Top-center, home only — chrome placement, root-state wiring.
  WorldSwitch: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    show: (el, s) => (s.root.route || '/') === '/',
    '@tabletS': { display: 'none' }
  },

  Actions: {
    flow: 'x',
    align: 'center center',
    gap: 'Z',

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
  },

  // The hamburger's sheet: the six pages, then the theme row.
  Menu: {
    position: 'absolute',
    top: '100%',
    left: 'C',
    marginTop: 'Y',
    minWidth: 'G',
    flow: 'y',
    padding: 'Z',
    borderRadius: 'radiusCard',
    theme: 'card',
    boxShadow: '0 24px 60px rgba(4,20,32,.18)',
    opacity: '0',
    visibility: 'hidden',
    pointerEvents: 'none',
    transform: 'translate3d(0, -6px, 0)',
    transition: 'opacity .25s ease, transform .25s cubic-bezier(.22,.68,.24,.98), visibility .25s',
    isOpen: (el, s) => !!s.menuOpen,
    '.isOpen': { opacity: '1', visibility: 'visible', pointerEvents: 'auto', transform: 'translate3d(0, 0, 0)' },
    '@tabletS': { left: 'A' },
    // Any link click closes the sheet (the veil covers the route swap).
    onClick: (ev, el, s) => s.update({ menuOpen: false }, { preventFetch: true }),

    Links: {
      flow: 'y',
      childProps: {
        width: '100%',
        NavLink: { width: '100%' }
      },
      NavItem: { state: { path: '/how', label: 'How it works' } },
      NavItem_1: { extends: 'NavItem', state: { path: '/offerings', label: 'Offerings' } },
      NavItem_2: { extends: 'NavItem', state: { path: '/compliance', label: 'Compliance' } },
      NavItem_3: { extends: 'NavItem', state: { path: '/platform', label: 'Platform' } },
      NavItem_4: { extends: 'NavItem', state: { path: '/company', label: 'Company' } },
      NavItem_5: { extends: 'NavItem', state: { path: '/faq', label: 'FAQ' } }
    },

    ThemeRow: {
      flow: 'x',
      align: 'center space-between',
      gap: 'Z',
      marginTop: 'Y',
      borderTop: '1px solid hairline',
      padding: 'Z Z Y',
      // Toggling the theme should not close the sheet.
      onClick: (ev) => ev.stopPropagation(),

      Label: {
        tag: 'span',
        fontSize: 'Z1',
        fontWeight: '500',
        color: 'caption',
        text: 'Theme'
      },
      ThemeToggle: {}
    }
  }
}
