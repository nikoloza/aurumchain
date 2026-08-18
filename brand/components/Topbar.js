// Page chrome above the content column: page title, and the account block.
export const Topbar = {
  tag: 'header',
  flow: 'x',
  align: 'center space-between',
  gap: 'A',
  width: '100%',
  padding: 'Z B',
  theme: 'nav',
  borderBottom: '1px solid hairline',
  position: 'sticky',
  top: '0',
  zIndex: '20',
  backdropFilter: 'saturate(1.4) blur(12px)',

  Titles: {
    flow: 'y',
    gap: '0',

    H1: {
      margin: '0',
      fontFamily: 'Display',
      fontSize: 'B',
      fontWeight: '700',
      letterSpacing: '-.02em',
      color: 'title',
      text: (el, s) => s.root.pageTitle || ''
    },
    Sub: {
      tag: 'span',
      fontSize: 'Y1',
      color: 'caption',
      text: (el, s) => s.root.pageLead || ''
    }
  },

  Right: {
    flow: 'x',
    align: 'center center',
    gap: 'Z',

    ThemeToggle: {},
    NetworkPill: {},

    Account: {
      flow: 'x',
      align: 'center center',
      gap: 'Y',
      padding: 'X Z',
      borderRadius: 'E',
      theme: 'secondary',

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
