// One top-nav entry. state: { anchor, label } scrolls to a landing section;
// state: { path, label } routes to another page through the navy veil.
//
// Anchor entries work cross-page: when the target section is not in the
// current document, the click routes home behind the veil and finishes the
// scroll — instantly, while still covered — once the landing page has
// rendered. Timers run through the element's own window
// (ownerDocument.defaultView) — bare globals belong to another realm here.
export const NavItem = {
  display: 'inline-flex',

  onClick: (ev, el, s) => {
    if (s.path) {
      ev.preventDefault()
      el.call('routeVeil', s.path)
      return
    }
    if (!s.anchor) return
    ev.preventDefault()
    if (el.call('scrollToSection', s.anchor)) return
    // Section lives on the landing page — route home behind the veil, then
    // settle the scroll (instant, under cover) once the page has rendered.
    // The nav item itself is disposed by the route swap, so the retries run
    // through the app root, which persists across pages.
    const win = el.node.ownerDocument.defaultView
    const root = el.getRoot()
    el.call('routeVeil', '/')
    if (win) {
      let tries = 0
      const retry = () => {
        if (root.call('scrollToSection', s.anchor, true) || tries++ > 10) return
        win.setTimeout(retry, 120)
      }
      win.setTimeout(retry, 540)
    }
  },

  NavLink: {
    // Fully qualified same-origin URL for BOTH entry kinds: Link's click
    // handler routes any relative href through the SPA router immediately
    // (the anchor's own handler fires before this wrapper's), which would
    // skip the veil. An http(s) href takes Link's external path, where it
    // does nothing and the wrapper above owns the click.
    href: (el, s) => {
      const loc = el.node && el.node.ownerDocument.location
      if (s.path) return loc ? `${loc.origin}${s.path}` : s.path
      const anchor = s.anchor || ''
      return loc ? `${loc.origin}${loc.pathname}#${anchor}` : `#${anchor}`
    },
    text: (el, s) => s.label || '',
    // The current page's entry stays lit — the router writes `route` onto
    // root state on every navigation.
    isActive: (el, s) => !!s.path && s.root.route === s.path,
    '.isActive': { color: 'title', background: 'veil' }
  }
}
