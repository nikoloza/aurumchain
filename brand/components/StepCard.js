// One step of the investor journey. state: { step, title, body }
export const StepCard = {
  flow: 'y',
  gap: 'Z',
  padding: 'B',
  borderRadius: 'B',
  theme: 'card',
  transition: 'transform .25s ease, border-color .25s ease',
  ':hover': { transform: 'translateY(-3px)', borderColor: 'gold.4' },

  Num: {
    tag: 'span',
    fontFamily: 'Mono',
    fontSize: 'Y1',
    fontWeight: '700',
    letterSpacing: '.1em',
    color: 'gold',
    text: (el, s) => s.step || ''
  },

  H3: {
    fontFamily: 'Display',
    fontSize: 'A1',
    fontWeight: '600',
    letterSpacing: '-.015em',
    color: 'title',
    margin: '0',
    text: (el, s) => s.title || ''
  },

  P: {
    fontSize: 'Z1',
    lineHeight: '1.62',
    color: 'paragraph',
    margin: '0',
    text: (el, s) => s.body || ''
  }
}
