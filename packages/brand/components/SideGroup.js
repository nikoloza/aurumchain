// A titled block of rail entries. state: { title, items: [{label,icon,path}] }
export const SideGroup = {
  flow: 'y',
  gap: 'X',
  width: '100%',

  Title: {
    tag: 'span',
    padding: 'X Z',
    fontSize: 'Y',
    fontWeight: '700',
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    color: 'caption',
    text: (el, s) => s.title || '',
    // Icon-strip rail: the group is separated by spacing alone.
    '@tabletL': { display: 'none' }
  },

  Items: {
    flow: 'y',
    gap: 'W',
    width: '100%',
    childExtends: 'SideLink',
    childrenAs: 'state',
    children: (el, s) => s.items || []
  }
}
