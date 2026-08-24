// Pointer physics for the marketing surfaces. All of these run as registered
// functions (el.call) so they survive frank serialization; `this` is the
// element. They write through el.setNodeStyles — the documented escape hatch
// for per-frame inline styles — and respect reduced motion by doing nothing.

// Cards lean toward the pointer. Composes the hover lift into the inline
// transform so the two never fight; tiltReset clears the inline value and the
// component's own :hover class takes back over.
export const tiltCard = function tiltCard (ev) {
  const el = this
  if (!el.node) return
  if (el.scope.tiltOff === undefined) {
    try {
      const win = el.node.ownerDocument.defaultView
      el.scope.tiltOff = win.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch (e) { el.scope.tiltOff = false }
  }
  if (el.scope.tiltOff) return
  const r = el.node.getBoundingClientRect()
  const px = (ev.clientX - r.left) / Math.max(1, r.width) - 0.5
  const py = (ev.clientY - r.top) / Math.max(1, r.height) - 0.5
  el.setNodeStyles({
    transform:
      'translateY(-3px) perspective(700px) rotateX(' + (-py * 3.6).toFixed(2) +
      'deg) rotateY(' + (px * 4.6).toFixed(2) + 'deg)'
  })
}

export const tiltReset = function tiltReset (ev) {
  const el = this
  if (!el.node) return
  // onMouseout fires for child boundaries too — only reset on a true leave.
  if (ev && ev.relatedTarget && el.node.contains(ev.relatedTarget)) return
  el.setNodeStyles({ transform: '' })
}

// Buttons drift a few pixels toward the pointer — weight without theatrics.
export const magnetPull = function magnetPull (ev) {
  const el = this
  if (!el.node) return
  if (el.scope.tiltOff === undefined) {
    try {
      const win = el.node.ownerDocument.defaultView
      el.scope.tiltOff = win.matchMedia('(prefers-reduced-motion: reduce)').matches
    } catch (e) { el.scope.tiltOff = false }
  }
  if (el.scope.tiltOff) return
  const r = el.node.getBoundingClientRect()
  const dx = (ev.clientX - (r.left + r.width / 2)) * 0.16
  const dy = (ev.clientY - (r.top + r.height / 2)) * 0.22
  const cx = Math.max(-7, Math.min(7, dx))
  const cy = Math.max(-5, Math.min(5, dy)) - 2
  el.setNodeStyles({ transform: 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)' })
}

export const magnetReset = function magnetReset (ev) {
  const el = this
  if (!el.node) return
  if (ev && ev.relatedTarget && el.node.contains(ev.relatedTarget)) return
  el.setNodeStyles({ transform: '' })
}
