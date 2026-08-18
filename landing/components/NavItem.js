// Click target for one nav anchor. state: { anchor, label }
//
// Constraints that shape this component (all verified against the published
// runtime):
//   * The handler lives HERE, not on NavLink — NavLink extends 'Link', and
//     Link binds its own click handling, so onClick on a Link never fires.
//   * All DOM access goes through el.node.ownerDocument — bare document/window
//     belong to another realm.
//   * The scroll is ONE direct scrollTop write. requestAnimationFrame
//     callbacks never fire in the published runtime's handler realm, so an
//     animated loop silently scrolls nothing.
export const NavItem = {
  display: 'inline-flex',

  onClick: (ev, el, s) => {
    if (!s.anchor) return
    ev.preventDefault()

    const doc = el.node.ownerDocument
    const target = doc.getElementById(s.anchor)
    if (!target) return

    const root = doc.documentElement
    const header = doc.querySelector('header')
    root.scrollTop =
      root.scrollTop +
      target.getBoundingClientRect().top -
      ((header ? header.offsetHeight : 80) + 16)
  },

  NavLink: {
    // Fully qualified same-document URL: Link's click handler routes any
    // relative href through the SPA router (which swallows it); an http(s)
    // href takes Link's external path, where it does nothing and the wrapper
    // above owns the click.
    href: (el) => {
      const loc = el.node && el.node.ownerDocument.location
      const anchor = (el.state && el.state.anchor) || ''
      return loc ? `${loc.origin}${loc.pathname}#${anchor}` : `#${anchor}`
    },
    text: (el, s) => s.label || ''
  }
}
