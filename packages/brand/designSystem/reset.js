// Document-level CSS. The runner builds its own HTML shell and ignores a
// project `index.html`, so anything a surface needs at the document level has
// to live here.
//
// The runtime's app-shell reset sets `html { position: absolute; height: 100% }`
// — right for a fixed dashboard shell, wrong for a scrolling page: it clamps
// the document to one viewport, which leaves the scroll root in a state where
// Chrome mis-paints a `position: fixed` header during a smooth scroll.
// Keeping `position: absolute` but freeing the height restores a normal
// scrolling document.

export default {
  // The runtime's app-shell reset makes the root an absolutely positioned,
  // viewport-height box. That suits a fixed dashboard shell but leaves a
  // scrolling page with no real scroll root: `#hash` navigation, `scrollTop`,
  // `window.scrollTo`, and `scrollIntoView` all become no-ops while the wheel
  // still scrolls. Restoring the normal document model gives every one of them
  // back, which is what the marketing anchors rely on.
  html: {
    position: 'static',
    width: 'auto',
    height: 'auto',
    minHeight: '100dvh',
    margin: '0',
    // Must stay `auto`. The runtime sets `smooth` here, and Chrome then drops
    // the fragment jump entirely in this document — the URL gains the hash and
    // the page never moves. `auto` restores it.
    scrollBehavior: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: 'rgba(96, 125, 148, 0.4) transparent',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale'
  },

  // No `overflow-x` here. Setting one axis to `hidden` computes the other to
  // `auto`, which turns body into a second scroll container and steals the
  // scroll from the document.
  body: {
    height: 'auto',
    minHeight: '100dvh',
    margin: '0',
    boxSizing: 'border-box'
  },

  // In-page anchor targets clear the fixed header instead of hiding under it.
  'section[id]': {
    scrollMarginTop: '96px'
  },

  // Visible keyboard focus on every interactive element (WCAG 2.4.7).
  // Slate blue reads on both the ivory and the navy ground.
  ':focus-visible': {
    outline: '2px solid #607D94',
    outlineOffset: '2px',
    borderRadius: '3px'
  },

  '::selection': {
    background: 'rgba(168, 192, 207, 0.45)'
  },

  // No grey flash on touch taps — the components carry their own press states.
  '*': {
    WebkitTapHighlightColor: 'transparent'
  },

  // Brand-tinted scrollbars (slate thumb, transparent track).
  '::-webkit-scrollbar': { width: '10px', height: '10px' },
  '::-webkit-scrollbar-track': { background: 'transparent' },
  '::-webkit-scrollbar-thumb': {
    background: 'rgba(96, 125, 148, 0.35)',
    borderRadius: '5px'
  }
}
