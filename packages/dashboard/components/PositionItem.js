// Portfolio holding — the brand PositionCard with a staggered fade on load
// and a hover lift, keyed off the List wrapper's armed `inView` flag.
// state: PositionCard's, plus { revealDelay }
export const PositionItem = {
  extends: 'PositionCard',
  transition: (el, s) =>
    'opacity .7s cubic-bezier(.22,.68,.24,.98) ' + (s.revealDelay || '0s') +
    ', transform .25s ease, border-color .25s ease',
  opacity: '0',
  isRevealed: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
  '.isRevealed': { opacity: '1' },
  ':hover': { transform: 'translateY(-2px)', borderColor: 'slate.45' },
  '@reduceMotion': { opacity: '1', transition: 'none', ':hover': { transform: 'none' } }
}
