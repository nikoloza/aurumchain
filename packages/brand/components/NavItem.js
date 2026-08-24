// One top-nav entry. state: { anchor, label } scrolls to a landing section;
// state: { path, label } routes to another page.
//
// Anchor entries work cross-page: when the target section is not in the
// current document, the click routes home first and finishes the scroll once
// the landing page has rendered. Timers run through the element's own window
// (ownerDocument.defaultView) — bare globals belong to another realm here.
export const NavItem = {
  display: 'inline-flex',

  onClick: (ev, el, s) => {
    if (s.path) {
      ev.preventDefault()
      el.router(s.path, el.getRoot())
      return
    }
    if (!s.anchor) return
    ev.preventDefault()

    const doc = el.node.ownerDocument
    const win = doc.defaultView
    const scrollToAnchor = () => {
      const target = doc.getElementById(s.anchor)
      if (!target) return false
      const root = doc.documentElement
      const header = doc.querySelector('header')
      root.scrollTop =
        root.scrollTop +
        target.getBoundingClientRect().top -
        ((header ? header.offsetHeight : 80) + 16)
      return true
    }
    if (scrollToAnchor()) return
    // Section lives on the landing page — route home, then settle the scroll
    // once the page has rendered.
    el.router('/', el.getRoot())
    if (win) {
      let tries = 0
      const retry = () => {
        if (scrollToAnchor() || tries++ > 8) return
        win.setTimeout(retry, 120)
      }
      win.setTimeout(retry, 120)
    }
  },

  NavLink: {
    // Fully qualified same-document URL: Link's click handler routes any
    // relative href through the SPA router (which swallows it); an http(s)
    // href takes Link's external path, where it does nothing and the wrapper
    // above owns the click.
    href: (el, s) => {
      const loc = el.node && el.node.ownerDocument.location
      if (s.path) return s.path
      const anchor = s.anchor || ''
      return loc ? `${loc.origin}${loc.pathname}#${anchor}` : `#${anchor}`
    },
    text: (el, s) => s.label || ''
  }
}
