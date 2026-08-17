// Page chrome only — the session gate lives on Rail (see brand/components/
// Rail.js), which renders on every dashboard page and always has a DOM node.
// State-based gating was abandoned: handler code runs across realms, and
// neither bare localStorage nor a silent state write crosses them reliably.
// The change guard keeps re-renders from looping the update.
export const openPage = function openPage (route, title, lead) {
  const root = this.state.root
  if (root.route !== route || root.pageTitle !== title) {
    root.update({ route, pageTitle: title, pageLead: lead })
  }
}
