// One step of the investor journey. state: { step, title, body }
export const StepCard = {
  flow: 'y',
  gap: 'Z',
  padding: 'B',
  borderRadius: 'radiusCard',
  theme: 'card',
  transition: (el, s) => 'opacity .8s cubic-bezier(.22,.68,.24,.98) ' + (s.revealDelay || '0s') + ', transform .25s ease, border-color .25s ease',
  opacity: '0',
  isRevealed: (el, s) => s.inView !== false,
  '.isRevealed': { opacity: '1' },
  '@reduceMotion': { opacity: '1', transition: 'none' },
  onMousemove: (ev, el) => el.call('tiltCard', ev),
  onMouseout: (ev, el) => el.call('tiltReset', ev),
  ':hover': { transform: 'translateY(-3px)', borderColor: 'slate.45' },

  Num: {
    tag: 'span',
    fontFamily: 'Mono',
    fontSize: 'Y1',
    fontWeight: '700',
    letterSpacing: '.1em',
    color: 'accentInk',
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
