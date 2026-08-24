// Check-marked bullet used by the compliance list. state: { title, body }
export const FeatureItem = {
  tag: 'li',
  flow: 'x',
  gap: 'Z',
  alignItems: 'flex-start',
  listStyle: 'none',
  padding: 'Z',
  margin: '0 -Z',
  borderRadius: 'radiusCard',
  transition: 'background .25s ease, transform .25s ease',
  ':hover': { background: 'veil', transform: 'translateX(4px)' },
  '@reduceMotion': { ':hover': { transform: 'none' } },

  Tick: {
    flow: 'x',
    align: 'center center',
    flexShrink: '0',
    width: 'B',
    height: 'B',
    borderRadius: 'E',
    theme: 'chipAccent',
    marginTop: 'W',
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
