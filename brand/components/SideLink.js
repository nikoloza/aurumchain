// One rail entry. state: { label, icon, path }
// The active entry is the one whose path matches the current route.
export const SideLink = {
  extends: 'Link',
  tag: 'a',
  flow: 'x',
  align: 'center flex-start',
  gap: 'Z',
  width: '100%',
  padding: 'Y Z',
  borderRadius: 'Z',
  fontSize: 'Z',
  fontWeight: '500',
  color: 'caption',
  textDecoration: 'none',
  cursor: 'pointer',
  transition: 'background .18s ease, color .18s ease',
  ':hover': { background: 'white.06', color: 'title' },

  href: (el, s) => s.path,

  isActive: (el, s) => s.root.route === s.path,
  '.isActive': { background: 'gold.14', color: 'gold' },

  onClick: (ev, el, s) => {
    ev.preventDefault()
    el.router(s.path, el.getRoot())
  },

  Glyph: {
    flow: 'x',
    align: 'center center',
    flexShrink: '0',
    width: 'A1',
    height: 'A1',
    Icon: { name: (el, s) => s.icon || 'chart' }
  },

  Label: { tag: 'span', text: (el, s) => s.label || '' }
}
