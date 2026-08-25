// KPI band for the app pages. The product shell has no scrolling Section to
// flip `inView`, so the row arms the reveal itself (functions/armReveal.js):
// state starts hidden and a short timer settles it one beat after mount. The
// tiles' fades and CountUp figures all key off that one flag.
export const KpiRow = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 'A',
  width: '100%',
  scope: {},
  state: { inView: false },
  '@tabletL': { gridTemplateColumns: 'repeat(2, 1fr)' },
  '@mobileL': { gridTemplateColumns: '1fr' },

  onRender: (el) => el.call('armReveal')
}
