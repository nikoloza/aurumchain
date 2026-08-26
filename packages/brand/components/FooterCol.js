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
    text: (el, s) => el.call('polyglot', s.title || '', s.root.lang)
  },

  Links: {
    flow: 'y',
    gap: '0',
    childExtends: 'FooterItem',
    childrenAs: 'state',
    children: (el, s) => s.links || []
  }
}
