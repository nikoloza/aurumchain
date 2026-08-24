// One expandable question. state: { q, a, open }
// `open` is local to the row, so rows expand independently — the same idiom
// the shared-library Accordion uses.
export const FaqItem = {
  tag: 'article',
  flow: 'y',
  width: '100%',
  borderBottom: '1px solid hairline',

  Trigger: {
    tag: 'button',
    flow: 'x',
    align: 'center space-between',
    gap: 'Z',
    width: '100%',
    padding: 'A 0',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
    color: 'title',
    attr: { 'aria-expanded': (el, s) => String(!!s.open) },
    onClick: (ev, el, s) => s.update({ open: !s.open }),

    Q: {
      tag: 'span',
      fontFamily: 'Display',
      fontSize: 'A',
      fontWeight: '600',
      letterSpacing: '-.015em',
      text: (el, s) => s.q || ''
    },

    Caret: {
      flexShrink: '0',
      display: 'inline-flex',
      width: 'A',
      height: 'A',
      color: 'accentInk',
      transition: 'transform .3s ease',
      '.open': { transform: 'rotate(180deg)' },
      Icon: { name: 'chevronDown', fontSize: 'A' }
    }
  },

  Answer: {
    tag: 'p',
    margin: '0',
    maxWidth: '720px',
    fontSize: 'Z1',
    lineHeight: '1.65',
    color: 'paragraph',
    overflow: 'hidden',
    transition: 'max-height .3s ease, opacity .25s ease, padding .25s ease',
    '.open': { maxHeight: '20em', opacity: '1', paddingBottom: 'A' },
    '!open': { maxHeight: '0', opacity: '0', paddingBottom: '0' },
    text: (el, s) => s.a || ''
  }
}
