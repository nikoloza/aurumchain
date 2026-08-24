// Guideline-page link card to one live surface.
// state: { name, purpose, url, host }
export const SurfaceCard = {
  extends: 'Link',
  tag: 'a',
  flow: 'y',
  gap: 'Z',
  padding: 'B',
  borderRadius: 'radiusCard',
  theme: 'card',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: (el, s) => 'opacity .8s cubic-bezier(.22,.68,.24,.98) ' + (s.revealDelay || '0s') + ', transform .25s ease, border-color .25s ease',
  opacity: '0',
  isRevealed: (el, s) => s.inView !== false,
  '.isRevealed': { opacity: '1' },
  '@reduceMotion': { opacity: '1', transition: 'none' },
  onMousemove: (ev, el) => el.call('tiltCard', ev),
  onMouseout: (ev, el) => el.call('tiltReset', ev),
  ':hover': { transform: 'translateY(-3px)', borderColor: 'slate.45' },

  href: (el, s) => s.url,
  target: '_blank',
  rel: 'noreferrer',

  Head: {
    flow: 'x',
    align: 'center space-between',
    gap: 'Z',
    H3: {
      fontFamily: 'Display',
      fontSize: 'A1',
      fontWeight: '600',
      letterSpacing: '-.015em',
      color: 'title',
      margin: '0',
      text: (el, s) => s.name || ''
    },
    Arrow: {
      color: 'accentInk',
      Icon: { name: 'arrowRight', fontSize: 'A1' }
    }
  },

  P: {
    fontSize: 'Z1',
    lineHeight: '1.6',
    color: 'paragraph',
    margin: '0',
    text: (el, s) => s.purpose || ''
  },

  Host: {
    tag: 'span',
    fontFamily: 'Mono',
    fontSize: 'Y1',
    color: 'caption',
    text: (el, s) => s.host || ''
  }
}
