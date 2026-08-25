// Slim chrome above the content column: a mono breadcrumb (the page title
// itself lives in the body's PageHead) and the account block. The network
// pill moved to the rail's foot.
export const Topbar = {
  tag: 'header',
  flow: 'x',
  align: 'center space-between',
  gap: 'A',
  width: '100%',
  padding: 'Y B',
  theme: 'nav',
  borderBottom: '1px solid hairline',
  position: 'sticky',
  top: '0',
  zIndex: '20',
  backdropFilter: 'saturate(1.4) blur(12px)',

  Crumb: {
    flow: 'x',
    align: 'center flex-start',
    gap: 'Y',

    Diamond: {
      tag: 'span',
      flexShrink: '0',
      width: 'X',
      height: 'X',
      background: 'accentInk',
      transform: 'rotate(45deg)'
    },
    Path: {
      tag: 'span',
      fontFamily: 'Mono',
      fontSize: 'Y1',
      fontWeight: '600',
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'caption',
      text: (el, s) => s.root.pageTitle || ''
    }
  },

  Right: {
    flow: 'x',
    align: 'center center',
    gap: 'Z',

    ThemeToggle: {},

    Account: {
      flow: 'x',
      align: 'center center',
      gap: 'Y',
      padding: 'X Z',
      borderRadius: 'E',
      theme: 'secondary',
      // Phones: the email pill is the one thing the slim bar can spare.
      '@mobileL': { display: 'none' },

      Dot: {
        width: 'Y',
        height: 'Y',
        borderRadius: 'E',
        background: 'green',
        flexShrink: '0'
      },
      Name: {
        tag: 'span',
        fontSize: 'Y1',
        fontFamily: 'Mono',
        color: 'title',
        text: (el, s) => {
          try {
            const win = el.node.ownerDocument.defaultView
            const sess = JSON.parse(win.localStorage.getItem('fractyco_session') || 'null')
            if (sess && sess.user && sess.user.email) return sess.user.email
          } catch (e) {}
          return s.root.userEmail || s.root.wallet || ''
        }
      }
    },

    SignOutBtn: {
      extends: 'ActionButton',
      state: { tone: 'ghost' },
      text: 'Sign out',
      onClick: (ev, el) => el.call('signout')
    }
  }
}
