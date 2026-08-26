// Titled content panel. state: { title, lead }
export const Panel = {
  tag: 'section',
  flow: 'y',
  gap: 'A',
  width: '100%',
  // As a grid/flex child the panel must be allowed to shrink below its
  // content's intrinsic width — otherwise a wide DataTable inflates the
  // column and the page scrolls horizontally instead of the table.
  minWidth: '0',
  padding: 'A',
  borderRadius: 'radiusCard',
  theme: 'card',

  Head: {
    flow: 'x',
    align: 'flex-end space-between',
    gap: 'Z',
    flexWrap: 'wrap',

    Titles: {
      flow: 'y',
      gap: 'W',
      H2: {
        margin: '0',
        fontFamily: 'Display',
        fontSize: 'A1',
        fontWeight: '600',
        letterSpacing: '-.015em',
        color: 'title',
        text: (el, s) => el.call('polyglot', s.title || '', s.root.lang)
      },
      Lead: {
        tag: 'span',
        fontSize: 'Y1',
        color: 'caption',
        text: (el, s) => el.call('polyglot', s.lead || '', s.root.lang)
      }
    }
  }
}
