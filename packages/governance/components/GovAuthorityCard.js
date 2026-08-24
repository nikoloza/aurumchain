// AuthorityCard tuned for the console grid — staggered reveal on mount, and
// the tile lift with a slate border tint on hover.
// state: AuthorityCard's contract plus `revealDelay`.
export const GovAuthorityCard = {
  extends: 'AuthorityCard',
  transition: (el, s) => 'opacity .8s cubic-bezier(.22,.68,.24,.98) ' + (s.revealDelay || '0s') + ', transform .25s ease, border-color .25s ease',
  opacity: '0',
  isRevealed: (el, s) => s.inView !== false,
  '.isRevealed': { opacity: '1' },
  ':hover': { transform: 'translateY(-2px)', borderColor: 'slate.45' },
  '@reduceMotion': { opacity: '1', transition: 'none' }
}
