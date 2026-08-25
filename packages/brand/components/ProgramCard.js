// One Solana program in the on-chain section. Reveals with the section — the
// card fades in on its own delay while a slate edge draws down its left side.
// state: { name, purpose, calls: [String], revealDelay }
export const ProgramCard = {
  flow: 'y',
  gap: 'Z',
  padding: 'B1',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: 'radiusCard',
  theme: 'card',
  opacity: '0',
  transition: (el, s) => 'opacity .8s cubic-bezier(.22,.68,.24,.98) ' + (s.revealDelay || '0s') + ', border-color .25s ease',
  isRevealed: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
  '.isRevealed': { opacity: '1' },
  ':hover': { borderColor: 'slate.45' },
  '@reduceMotion': { opacity: '1', transition: 'none' },

  Edge: {
    tag: 'span',
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '0',
    width: 'W',
    background: 'accentInk',
    transformOrigin: 'top center',
    transform: 'scaleY(0)',
    transition: (el, s) => 'transform .9s cubic-bezier(.22,.68,.24,.98) calc(' + (s.revealDelay || '0s') + ' + .2s)',
    isRevealed: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
    '.isRevealed': { transform: 'scaleY(1)' },
    '@reduceMotion': { transform: 'scaleY(1)', transition: 'none' }
  },

  Head: {
    flow: 'x',
    align: 'center space-between',
    gap: 'Z',

    H3: {
      fontFamily: 'Mono',
      fontSize: 'Z1',
      fontWeight: '700',
      color: 'accentInk',
      margin: '0',
      text: (el, s) => s.name || ''
    },
    // Bespoke program mark — a diamond node and a mono caption, no borrowed
    // chip chrome.
    Badge: {
      flow: 'x',
      align: 'center center',
      gap: 'Y',
      flexShrink: '0',
      Diamond: {
        tag: 'span',
        width: 'X',
        height: 'X',
        background: 'accentInk',
        transform: 'rotate(45deg)'
      },
      Label: {
        tag: 'span',
        fontFamily: 'Mono',
        fontSize: 'Y',
        letterSpacing: '.16em',
        textTransform: 'uppercase',
        color: 'caption',
        whiteSpace: 'nowrap',
        text: 'Anchor program'
      }
    }
  },

  P: {
    fontSize: 'Z',
    lineHeight: '1.6',
    color: 'paragraph',
    margin: '0',
    text: (el, s) => s.purpose || ''
  },

  Calls: {
    flow: 'x',
    flexWrap: 'wrap',
    gap: 'W',
    childExtends: 'CallTag',
    childrenAs: 'state',
    children: (el, s) => (s.calls || []).map((text) => ({ text }))
  }
}
