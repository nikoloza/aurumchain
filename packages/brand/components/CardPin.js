// The board pin — a small diamond node that lands on a card's top edge once
// the card has revealed, pinning it to the page the way the rail nodes pin
// the state machine. Parents must be position: relative (and must not clip
// overflow). Reads the shared reveal chain: anywhere without reveal state it
// renders settled. state: { revealDelay } rides the owning card's delay.
export const CardPin = {
  tag: 'span',
  position: 'absolute',
  top: '-X',
  left: 'B',
  width: 'Y',
  height: 'Y',
  background: 'accentInk',
  pointerEvents: 'none',
  transform: 'rotate(45deg) scale(0)',
  transition: (el, s) => 'transform .5s cubic-bezier(.34,1.5,.5,1) calc(' + (s.revealDelay || '0s') + ' + .35s)',
  isRevealed: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
  '.isRevealed': { transform: 'rotate(45deg) scale(1)' },
  '@reduceMotion': { transform: 'rotate(45deg) scale(1)', transition: 'none' }
}
