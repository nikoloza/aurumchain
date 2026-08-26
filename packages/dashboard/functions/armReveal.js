// Arms a wrapper's `inView` flag one beat after mount. The product shell has
// no scrolling Section to flip it, so KPI bands and lists call this from
// onRender: the tiles' fades, CountUp figures, and funding meters all key
// off the single flag. `el.scope.armed` makes it idempotent across
// re-renders; the timer runs in the page realm via the element's own window.
export const armReveal = function armReveal () {
  const el = this
  const s = el.state
  const win = el.node && el.node.ownerDocument.defaultView
  if (win && !el.scope.armed) {
    el.scope.armed = true
    win.setTimeout(() => s.update({ inView: true }, { preventFetch: true }), 180)
  }
}
