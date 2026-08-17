// state: { title, links: [{ text, href }] }
export const FooterCol = {
  flow: 'y',
  gap: 'Y',
  minWidth: 'E',

  Title: {
    tag: 'span',
    fontSize: 'Y1',
    fontWeight: '700',
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    color: 'title',
    text: (el, s) => s.title || ''
  },

  Links: {
    flow: 'y',
    gap: '0',
    childExtends: 'FooterLink',
    childrenAs: 'state',
    children: (el, s) => s.links || []
  }
}
