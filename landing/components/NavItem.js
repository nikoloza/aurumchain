// Click target for one nav anchor. state: { anchor, label }
//
// Three constraints shape this component:
//
//   * The handler lives HERE, not on NavLink — NavLink extends 'Link', and
//     Link binds its own click handling, so a component-level `onClick` on a
//     Link never fires. The click bubbles from the anchor to this wrapper.
//
//   * Everything reaches the page through `el.node.ownerDocument`, never the
//     `document`/`window` globals. The runner rehydrates handlers in another
//     realm, where those globals point at a document that is not the page —
//     the handler "works", scrolls nothing, and raises no error.
//
//   * The scroll is written frame by frame. The native paths — `#hash` jump,
//     `scrollIntoView`, `behavior: 'smooth'` — go through the browser's
//     smooth-scroll machinery, which this document drops.
export const NavItem = {
  display: 'inline-flex',

  onClick: (ev, el, s) => {
    if (!s.anchor) return
    ev.preventDefault()

    const doc = el.node.ownerDocument
    const win = doc.defaultView
    const target = doc.getElementById(s.anchor)
    if (!target) return

    const root = doc.documentElement
    const header = doc.querySelector('header')
    const offset = (header ? header.offsetHeight : 80) + 16

    const from = root.scrollTop
    const to = Math.max(
      0,
      Math.min(
        root.scrollHeight - win.innerHeight,
        from + target.getBoundingClientRect().top - offset
      )
    )
    if (Math.abs(to - from) < 2) return

    if (win.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.scrollTop = to
      return
    }

    // Take the start time from the FIRST FRAME's own timestamp, never from
    // performance.now(): the handler runs in another realm whose clock has a
    // different time origin, so mixing the two makes `t` negative and the
    // loop writes scrollTop 0 forever.
    // One animation at a time — a second click cancels the one in flight,
    // otherwise both keep writing scrollTop and fight to the end.
    if (win.__fcScrollAnim) win.cancelAnimationFrame(win.__fcScrollAnim)

    const duration = 520
    let start = null
    const step = (now) => {
      if (start === null) start = now
      const t = Math.min(1, (now - start) / duration)
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      root.scrollTop = from + (to - from) * eased
      if (t < 1) win.__fcScrollAnim = win.requestAnimationFrame(step)
      else win.__fcScrollAnim = null
    }
    win.__fcScrollAnim = win.requestAnimationFrame(step)
  },

  NavLink: {
    // Fully qualified same-document URL. Link's own click handler routes any
    // relative href through the SPA router — with `scrollToTop: true`, which
    // resets the page to 0 and cancels the wrapper's animation. An http(s)
    // href takes Link's external path, where it does nothing, and the wrapper
    // above owns the click.
    href: (el) => {
      const loc = el.node && el.node.ownerDocument.location
      const anchor = (el.state && el.state.anchor) || ''
      return loc ? `${loc.origin}${loc.pathname}#${anchor}` : `#${anchor}`
    },
    text: (el, s) => s.label || ''
  }
}
