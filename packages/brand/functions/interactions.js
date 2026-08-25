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

// Scrolls the document to a section anchor, keeping the sticky header out of
// the way. Smooth by default; pass `instant` (or prefer reduced motion) for a
// jump. Returns whether the anchor exists in the current document, so callers
// can fall back to routing first.
export const scrollToSection = function scrollToSection (anchor, instant) {
  const el = this
  if (!el.node) return false
  const doc = el.node.ownerDocument
  const win = doc && doc.defaultView
  if (!win) return false
  const target = doc.getElementById(anchor)
  if (!target) return false
  let reduced = false
  try { reduced = win.matchMedia('(prefers-reduced-motion: reduce)').matches } catch (e) {}
  const header = doc.querySelector('header')
  const top =
    (doc.documentElement.scrollTop || 0) +
    target.getBoundingClientRect().top -
    ((header ? header.offsetHeight : 80) + 16)
  win.scrollTo({ top, behavior: instant || reduced ? 'auto' : 'smooth' })
  return true
}

// Routes through the navy curtain: root state stages the veil over the old
// page, the router swaps content while it is covered, and the veil peels off
// the new page. The stage lives on root state so the veil in the NEXT page
// mounts already covered — no flash between documents. Surfaces without a
// RouteVeil in the tree still navigate; the stage writes are just inert.
export const routeVeil = function routeVeil (path) {
  const el = this
  const root = el.getRoot()
  const rs = el.getRootState()
  const doc = el.node && el.node.ownerDocument
  const win = doc && doc.defaultView
  const go = () => el.router(path, root, {}, { scrollToTop: true, scrollToOptions: { behavior: 'instant' } })
  if (!win) { go(); return }
  if (doc.location && doc.location.pathname === path) return
  if (rs.veilStage === 'cover') return
  let reduced = false
  try { reduced = win.matchMedia('(prefers-reduced-motion: reduce)').matches } catch (e) {}
  if (reduced) { go(); return }
  rs.update({ veilStage: 'cover' }, { preventFetch: true })
  win.setTimeout(() => {
    go()
    win.setTimeout(() => rs.update({ veilStage: 'reveal' }, { preventFetch: true }), 90)
    win.setTimeout(() => rs.update({ veilStage: '' }, { preventFetch: true }), 760)
  }, 460)
}
