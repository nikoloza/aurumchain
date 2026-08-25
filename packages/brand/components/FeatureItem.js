// Check-marked bullet used by the compliance list. Reveals with the section:
// the row fades in from the left on its own delay and the tick pops after.
// state: { title, body, revealDelay }
export const FeatureItem = {
  tag: 'li',
  flow: 'x',
  gap: 'Z',
  alignItems: 'flex-start',
  listStyle: 'none',
  padding: 'Z',
  margin: '0 -Z',
  borderRadius: 'radiusCard',
  opacity: '0',
  transform: 'translate3d(-10px, 0, 0)',
  transition: (el, s) =>
    'opacity .7s ease ' + (s.revealDelay || '0s') +
    ', transform .7s cubic-bezier(.22,.68,.24,.98) ' + (s.revealDelay || '0s') +
    ', background .25s ease',
  isRevealed: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
  '.isRevealed': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
  ':hover': { background: 'veil', transform: 'translate3d(4px, 0, 0)' },
  '@reduceMotion': { opacity: '1', transform: 'none', transition: 'none', ':hover': { transform: 'none' } },

  Tick: {
    flow: 'x',
    align: 'center center',
    flexShrink: '0',
    width: 'B',
    height: 'B',
    borderRadius: 'E',
    theme: 'chipAccent',
    marginTop: 'W',
    transform: 'scale(0)',
    transition: (el, s) => 'transform .5s cubic-bezier(.34,1.5,.5,1) calc(' + (s.revealDelay || '0s') + ' + .15s)',
    isRevealed: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
    '.isRevealed': { transform: 'scale(1)' },
    '@reduceMotion': { transform: 'scale(1)', transition: 'none' },
    Svg: {
      viewBox: '0 0 24 24',
      width: 'Z1',
      height: 'Z1',
      html: '<polyline points="4 12 10 18 20 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>'
    }
  },

  Body: {
    flow: 'y',
    gap: 'W',

    H3: {
      fontSize: 'Z1',
      fontWeight: '600',
      color: 'title',
      margin: '0',
      text: (el, s) => s.title || ''
    },
    P: {
      fontSize: 'Z',
      lineHeight: '1.6',
      color: 'paragraph',
      margin: '0',
      text: (el, s) => s.body || ''
    }
  }
}
