// Resolves the nearest `inView` flag up the state chain — the reveal flag an
// armed wrapper (KpiRow, a List) settles after mount. Returns true when no
// ancestor carries the flag, so components render visible outside an armed
// wrapper (deep links, reduced-motion paths).
export const inheritedInView = function inheritedInView (s) {
  let st = s
  while (st) {
    if (st.inView !== undefined) return st.inView !== false
    st = st.parent
  }
  return true
}
