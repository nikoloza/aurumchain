// KPI band for the app pages — one joined plate, tiles separated by hairline
// seams (the 1px gap shows the band's hairline ground through the tiles'
// panel fill, so the seams survive any wrap count). The product shell has no
// scrolling Section to flip `inView`, so the row arms the reveal itself
// (functions/armReveal.js): state starts hidden and a short timer settles it
// one beat after mount. The tiles' fades and CountUp figures key off that flag.
export const KpiRow = {
  display: 'grid',
  // Container-driven 4 → 2 → 1, same technique as the landing decks.
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
  // V is the scale's hairline step (~1.4px) — the thinnest token, used as the
  // seam width between tiles.
  gap: 'V',
  width: '100%',
  background: 'hairline',
  border: '1px solid hairline',
  borderRadius: 'radiusCard',
  overflow: 'hidden',
  scope: {},
  state: { inView: false },

  onRender: (el) => el.call('armReveal')
}
