// Animated figure — counts from zero to its value the first time the section
// around it scrolls into view (`inView` state inherited from `Section`).
// The tween drives local state (`cuVal`) with preventFetch each frame; the
// signal-backed store re-renders just this span's text, so the framework owns
// every DOM write. The `text` prop resolves to the final figure whenever the
// tween is idle (no observer, reduced motion, no JS frame).
// state: { to, prefix, suffix, decimals, duration }
export const CountUp = {
  tag: 'span',
  fontVariantNumeric: 'tabular-nums',
  scope: {},

  text: (el, s) => {
    const dec = Number(s.decimals) || 0
    const to = Number(s.to) || 0
    const val = s.cuVal === undefined ? to : s.cuVal
    return (s.prefix || '') + val.toLocaleString('en-US', {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec
    }) + (s.suffix || '')
  },

  onFrame: (el) => {
    const s = el.state
    const st = el.scope
    if (st.cuDone || !el.node) return
    const win = el.node.ownerDocument.defaultView
    if (!win) return
    if (st.cuReduced === undefined) {
      try { st.cuReduced = win.matchMedia('(prefers-reduced-motion: reduce)').matches } catch (e) { st.cuReduced = false }
    }
    if (st.cuReduced) { st.cuDone = true; return }
    // Waiting below the fold — hold at zero so the tween has somewhere to go.
    if (s.inView === false) {
      if (!st.cuArmed) {
        st.cuArmed = true
        s.update({ cuVal: 0 }, { preventFetch: true })
      }
      return
    }
    // Never saw the hidden state (no Section parent, deep link): stay static.
    if (!st.cuArmed) { st.cuDone = true; return }
    const now = win.performance ? win.performance.now() : 0
    if (!st.cuT0) st.cuT0 = now
    const dur = (Number(s.duration) || 1.6) * 1000
    const p = Math.min(1, (now - st.cuT0) / dur)
    const eased = 1 - Math.pow(1 - p, 3)
    const to = Number(s.to) || 0
    if (p >= 1) {
      st.cuDone = true
      s.update({ cuVal: to }, { preventFetch: true })
      return
    }
    s.update({ cuVal: to * eased }, { preventFetch: true })
  }
}
