// Network badge in the topbar. Reads the network name from root state so the
// value is declared once, in state.js.
export const NetworkPill = {
  extends: 'Chip',
  theme: 'chipAccent',
  text: (el, s) => s.root.network || ''
}
