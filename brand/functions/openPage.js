// Session gate + page chrome, in ONE hook: the page's onRender.
//
// Everything here is shaped by three hard-won constraints:
//
//   * onRender is the FIRST hook with a DOM node, and the node is the only
//     bridge to page-realm localStorage. Handler code runs in a second realm
//     whose bare `localStorage` is a different store — a session read there
//     misses the one signin wrote.
//
//   * The signedIn flip is assigned SILENTLY (no update). The one update below
//     is guarded by a change check, so re-renders converge instead of looping:
//     onRender fires again after the update, sees equal values, writes nothing.
//
//   * The signed-out path only routes. Routing away unmounts this page, so the
//     redirect cannot re-fire.
export const openPage = function openPage (route, title, lead) {
  const root = this.state.root

  if (!root.signedIn) {
    let live = false
    try {
      const win = this.node
        ? this.node.ownerDocument.defaultView
        : (typeof window !== 'undefined' ? window : null)
      const sess = win && JSON.parse(win.localStorage.getItem('fractyco_session') || 'null')
      live = !!(sess && sess.expires_at &&
        (Date.now() / 1000) < (Number(sess.expires_at) - 30))
      if (live) {
        const u = sess.user || {}
        const email = u.email || ''
        const meta = u.user_metadata || {}
        root.signedIn = true
        root.userEmail = email
        root.userName = (meta.full_name || meta.name || email.split('@')[0] || '')
          .split(/[._\s-]/).filter(Boolean)
          .map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ') || 'Investor'
      } else if (sess && win) {
        win.localStorage.removeItem('fractyco_session')
      }
    } catch (e) {}

    if (!live) {
      this.router('/login', this.__ref.root)
      return
    }
  }

  if (root.route !== route || root.pageTitle !== title) {
    root.update({ route, pageTitle: title, pageLead: lead })
  }
}
