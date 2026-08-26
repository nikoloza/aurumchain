// One step of the investor journey. state: { step, title, body, revealDelay }
// The pin lands on the top edge, then a dashed stem rises from it to the
// section's state-machine rail — HowSection draws that rail at 'C' above the
// grid, so the stem height must stay 'C' to meet it.
export const StepCard = {
  flow: 'y',
  gap: 'Z',
  padding: 'B1',
  position: 'relative',
  borderRadius: 'radiusCard',
  theme: 'card',
  CardPin: {},
  transition: (el, s) => 'opacity .8s cubic-bezier(.22,.68,.24,.98) ' + (s.revealDelay || '0s') + ', transform .25s ease, border-color .25s ease',
  opacity: '0',
  isRevealed: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
  '.isRevealed': { opacity: '1' },
  '@reduceMotion': { opacity: '1', transition: 'none' },
  onMousemove: (ev, el) => el.call('tiltCard', ev),
  onMouseout: (ev, el) => el.call('tiltReset', ev),
  // Accent underline sweeping in on hover — the same grammar as the app's KPI
  // tiles. Inset by the card radius so it never pokes past the rounded corner.
  ':before': {
    content: '""',
    position: 'absolute',
    bottom: '0',
    left: 'Z',
    right: 'Z',
    height: 'W',
    borderRadius: 'radiusPill',
    background: 'accentInk',
    transform: 'scaleX(0)',
    transformOrigin: 'left center',
    transition: 'transform .5s cubic-bezier(.22,.68,.24,.98)'
  },
  ':hover': {
    transform: 'translateY(-3px)',
    borderColor: 'slate.45',
    ':before': { transform: 'scaleX(1)' }
  },

  // Dashed stem from the pin up to the section rail — rises once the pin has
  // landed. Width matches the pin so the flex centring lines them up exactly.
  Stem: {
    tag: 'span',
    position: 'absolute',
    bottom: '100%',
    left: 'B',
    width: 'Y',
    height: 'C',
    flow: 'x',
    align: 'flex-start center',
    pointerEvents: 'none',
    transformOrigin: 'bottom center',
    transform: 'scaleY(0)',
    transition: (el, s) => 'transform .6s cubic-bezier(.22,.68,.24,.98) calc(' + (s.revealDelay || '0s') + ' + .55s)',
    isRevealed: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
    '.isRevealed': { transform: 'scaleY(1)' },
    '@tabletL': { display: 'none' },
    '@reduceMotion': { transform: 'scaleY(1)', transition: 'none' },

    Line: {
      tag: 'span',
      height: '100%',
      borderLeft: '1px dashed',
      borderLeftColor: 'hairline'
    }
  },

  // `step` arrives either as a numeral ('01') or as a word ('LIST'). Both
  // resolve through polyglot — a numeral simply passes back out — but they
  // cannot share one treatment: a numeral reads as a watermark behind the
  // card, while a word at that size runs straight through the title. So the
  // numeral takes the ghost and the word takes an inline mono marker, chosen
  // on the RESOLVED length so Georgian (longer than English) picks correctly.
  Ghost: {
    tag: 'span',
    position: 'absolute',
    top: 'Z1',
    right: 'B1',
    fontFamily: 'Display',
    fontSize: 'D',
    fontWeight: '700',
    letterSpacing: '-.04em',
    lineHeight: '.8',
    color: 'hairline',
    pointerEvents: 'none',
    userSelect: 'none',
    // Behind the copy: an absolute box paints above in-flow siblings by
    // default, and a long Georgian title is one unbreakable token that can
    // outrun the padding below — so the watermark must sit under the text.
    zIndex: '0',
    show: (el, s) => el.call('polyglot', s.step || '', s.root.lang).length <= 3,
    text: (el, s) => el.call('polyglot', s.step || '', s.root.lang)
  },

  Marker: {
    tag: 'span',
    fontFamily: 'Mono',
    fontSize: 'Y1',
    fontWeight: '700',
    letterSpacing: '.14em',
    textTransform: 'uppercase',
    color: 'accentInk',
    show: (el, s) => el.call('polyglot', s.step || '', s.root.lang).length > 3,
    text: (el, s) => el.call('polyglot', s.step || '', s.root.lang)
  },

  H3: {
    fontFamily: 'Display',
    fontSize: 'A1',
    fontWeight: '600',
    letterSpacing: '-.015em',
    color: 'title',
    margin: '0',
    position: 'relative',
    zIndex: '1',
    // Keep the title clear of the ghost numeral in the corner — a long
    // title (Georgian runs longer than English) would otherwise wrap under it.
    isGhosted: (el, s) => el.call('polyglot', s.step || '', s.root.lang).length <= 3,
    '.isGhosted': { paddingRight: 'C' },
    text: (el, s) => el.call('polyglot', s.title || '', s.root.lang)
  },

  // Dashed rule between the head and the body, drawing after the card lands.
  Rule: {
    width: '100%',
    borderTop: '1px dashed',
    borderTopColor: 'hairline',
    transform: 'scaleX(0)',
    transformOrigin: 'left center',
    transition: (el, s) => 'transform .6s cubic-bezier(.22,.68,.24,.98) calc(' + (s.revealDelay || '0s') + ' + .35s)',
    isRevealed: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
    '.isRevealed': { transform: 'scaleX(1)' },
    '@reduceMotion': { transform: 'scaleX(1)', transition: 'none' }
  },

  P: {
    fontSize: 'Z1',
    lineHeight: '1.62',
    color: 'paragraph',
    margin: '0',
    text: (el, s) => el.call('polyglot', s.body || '', s.root.lang)
  }
}
