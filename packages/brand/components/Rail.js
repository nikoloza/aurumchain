// Left navigation rail. Groups come from root state so both surfaces share
// this component and differ only in their data.
export const Rail = {
  // Session gate. Rail renders on every dashboard page and, as a component,
  // always has a real DOM node — the only reliable bridge to page-realm
  // localStorage from handler code. No state involved: the check reads the
  // stored session directly, and the one-shot window flag keeps a re-render
  // during the route transition from looping the redirect.
  onRender: (el) => {
    try {
      const win = el.node.ownerDocument.defaultView
      const sess = JSON.parse(win.localStorage.getItem('fractyco_session') || 'null')
      const live = sess && sess.expires_at &&
        (Date.now() / 1000) < (Number(sess.expires_at) - 30)
      if (live) return
      if (sess) win.localStorage.removeItem('fractyco_session')
      if (win.__fcGateRedirect) return
      win.__fcGateRedirect = true
      el.router('/signin', el.__ref.root)
    } catch (e) {}
  },

  tag: 'aside',
  flow: 'y',
  gap: 'A',
  flexShrink: '0',
  width: 'F2',
  height: '100vh',
  padding: 'A Z',
  theme: 'rail',
  borderRight: '1px solid hairline',
  position: 'sticky',
  top: '0',
  overflowY: 'auto',
  // Below tabletL the rail collapses to an icon strip instead of vanishing —
  // SideGroup titles and SideLink labels hide themselves at the same break.
  // On phones the strip narrows one more step; 100vh keeps it full height.
  '@tabletL': { width: 'D', padding: 'A Y', alignItems: 'center' },
  '@mobileL': { width: 'C1', padding: 'A W' },

  Head: {
    padding: 'X Z',
    '@tabletL': { padding: 'X 0' },
    // Icon strip keeps only the circular mark; the wordmark needs the width.
    Logo: { Word: { '@tabletL': { display: 'none' } } }
  },

  Groups: {
    flow: 'y',
    gap: 'A',
    width: '100%',
    childExtends: 'SideGroup',
    childrenAs: 'state',
    children: (el, s) => s.root.nav || []
  },

  // Session context anchored to the bottom edge: which chain, which wallet.
  Foot: {
    marginTop: 'auto',
    flow: 'y',
    gap: 'Z',
    width: '100%',
    paddingTop: 'A',
    borderTop: '1px dashed',
    borderTopColor: 'hairline',
    '@tabletL': { display: 'none' },

    NetworkPill: { alignSelf: 'flex-start' },

    Wallet: {
      flow: 'x',
      align: 'center flex-start',
      gap: 'Y',
      padding: '0 Z',
      Dot: {
        tag: 'span',
        flexShrink: '0',
        width: 'X',
        height: 'X',
        background: 'green',
        transform: 'rotate(45deg)'
      },
      Addr: {
        tag: 'span',
        fontFamily: 'Mono',
        fontSize: 'Y1',
        letterSpacing: '.04em',
        color: 'caption',
        text: (el, s) => s.root.wallet || ''
      }
    }
  }
}
