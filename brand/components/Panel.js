// Titled content panel. state: { title, lead }
export const Panel = {
  tag: 'section',
  flow: 'y',
  gap: 'A',
  width: '100%',
  padding: 'A',
  borderRadius: 'A',
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
        text: (el, s) => s.title || ''
      },
      Lead: {
        tag: 'span',
        fontSize: 'Y1',
        color: 'caption',
        text: (el, s) => s.lead || ''
      }
    }
  }
}
