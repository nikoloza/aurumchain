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
  minHeight: '100vh',
  padding: 'A Z',
  theme: 'rail',
  borderRight: '1px solid hairline',
  position: 'sticky',
  top: '0',
  '@tabletL': { display: 'none' },

  Head: { padding: 'X Z', Logo: {} },

  Groups: {
    flow: 'y',
    gap: 'A',
    width: '100%',
    childExtends: 'SideGroup',
    childrenAs: 'state',
    children: (el, s) => s.root.nav || []
  }
}
