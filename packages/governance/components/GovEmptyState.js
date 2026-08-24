// What an exhausted queue looks like — the brand diamond, one line naming the
// state, one caption saying why that is fine. state: { title, caption }
export const GovEmptyState = {
  flow: 'y',
  align: 'center center',
  gap: 'Z',
  width: '100%',
  padding: 'C B',
  textAlign: 'center',

  Diamond: {
    width: 'Z',
    height: 'Z',
    flexShrink: '0',
    background: 'accentInk',
    transform: 'rotate(45deg)',
    marginBottom: 'X'
  },

  Title: {
    tag: 'span',
    fontFamily: 'Display',
    fontSize: 'Z1',
    fontWeight: '600',
    color: 'title',
    text: (el, s) => s.title || ''
  },

  Caption: {
    tag: 'span',
    fontSize: 'Y1',
    color: 'caption',
    text: (el, s) => s.caption || ''
  }
}
