// Armed stat band — flips `inView` shortly after mount so the tiles reveal
// with a stagger and their CountUp figures tween from zero. Unarmed (reduced
// motion, no frame tick) everything renders settled at the final value.
// state: { tiles: [GovStatTile state] }
export const GovStatRow = {
  extends: 'StatRow',
  childExtends: 'GovStatTile',
  scope: {},
  state: { inView: false },

  onRender: (el, s) => {
    const win = el.node && el.node.ownerDocument.defaultView
    if (win && !el.scope.armed) {
      el.scope.armed = true
      win.setTimeout(() => s.update({ inView: true }, { preventFetch: true }), 180)
    }
  }
}
