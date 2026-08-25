// Shared section shell — vertical rhythm and a max-width content column, so
// every band on the page lines up on the same gutters.
//
// Sections reveal on first scroll into view: an IntersectionObserver flips
// local state once and the Inner block settles up. The observer alone makes
// the call — its first callback runs after layout, so a section already in
// the viewport (deep link, short page) settles on that tick, while anything
// below the fold waits for the scroll. Never decide from a synchronous
// getBoundingClientRect here: onRender fires before layout and every rect
// reads top 0, which silently pre-fires all the choreography. State-driven
// (no class mutation), disconnects after the first hit, and falls back to
// visible when the observer is unavailable or the visitor prefers reduced
// motion. All window access goes through el.node.ownerDocument — bare
// globals belong to another realm in this runtime.
export const Section = {
  tag: 'section',
  flow: 'y',
  align: 'center center',
  width: '100%',
  padding: 'E1 C',
  scope: {},
  state: { inView: false },
  '@tabletS': { padding: 'D A' },

  onRender: (el, s) => {
    if (!el.node || el.scope.revealObs !== undefined) return
    const doc = el.node.ownerDocument
    const win = doc && doc.defaultView
    if (!win) return
    let reduced = false
    try { reduced = win.matchMedia('(prefers-reduced-motion: reduce)').matches } catch (e) {}
    if (reduced || !win.IntersectionObserver) {
      el.scope.revealObs = null
      s.update({ inView: true }, { preventFetch: true })
      return
    }
    const obs = new win.IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          obs.disconnect()
          el.scope.revealObs = null
          s.update({ inView: true }, { preventFetch: true })
        }
      }
    }, { threshold: 0.08 })
    obs.observe(el.node)
    el.scope.revealObs = obs
  },

  onRemove: (el) => {
    try { if (el.scope.revealObs) el.scope.revealObs.disconnect() } catch (e) {}
  },

  Inner: {
    flow: 'y',
    gap: 'C2',
    width: '100%',
    maxWidth: '1120px',
    opacity: '0',
    transform: 'translate3d(0, 20px, 0)',
    transition: 'opacity .7s cubic-bezier(.22,.68,.24,.98), transform .7s cubic-bezier(.22,.68,.24,.98)',
    isInView: (el, s) => s.inView,
    '.isInView': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
    '@reduceMotion': { opacity: '1', transform: 'none', transition: 'none' }
  }
}
