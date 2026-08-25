// Offerings-list row — the brand OfferingRow with the app's motion on top:
// a staggered fade on load, a hover lift, and a funding meter that draws
// itself once the list's `inView` flag settles (armed by the List wrapper).
// state: OfferingRow's, plus { revealDelay }
export const OfferingItem = {
  extends: 'OfferingRow',
  transition: (el, s) =>
    'opacity .7s cubic-bezier(.22,.68,.24,.98) ' + (s.revealDelay || '0s') +
    ', transform .25s ease, border-color .25s ease',
  opacity: '0',
  isRevealed: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
  '.isRevealed': { opacity: '1' },
  ':hover': { transform: 'translateY(-2px)', borderColor: 'slate.45' },
  '@reduceMotion': { opacity: '1', transition: 'none', ':hover': { transform: 'none' } },

  Bar: {
    Fill: {
      width: (el, s) => {
        let st = s
        while (st) {
          if (st.inView !== undefined) {
            return st.inView === false ? '0%' : `${Math.min(100, Number(s.pct) || 0)}%`
          }
          st = st.parent
        }
        return `${Math.min(100, Number(s.pct) || 0)}%`
      },
      transition: 'width 1.3s cubic-bezier(.22,.68,.24,.98) .35s',
      '@reduceMotion': { transition: 'none' }
    }
  }
}
