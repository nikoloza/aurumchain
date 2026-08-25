// One rail entry. state: { label, icon, path }
// The active entry is the one whose path matches the current route — it gets
// the wash, the ink, a diamond marker, and aria-current for assistive tech.
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
  position: 'relative',
  transition: 'background .18s ease, color .18s ease, transform .12s ease',
  ':hover': { background: 'veil', color: 'title' },
  ':active': { transform: 'scale(.985)' },
  // Icon-strip rail below tabletL: square hit target, glyph centred, the
  // native tooltip carries the hidden label.
  '@tabletL': { align: 'center center', padding: 'Y' },
  title: (el, s) => s.label || '',

  href: (el, s) => s.path,
  ariaCurrent: (el, s) => (s.root.route === s.path ? 'page' : null),

  isActive: (el, s) => s.root.route === s.path,
  '.isActive': { background: 'activeWash', color: 'activeInk' },

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
    transition: 'transform .18s ease',
    Icon: { name: (el, s) => s.icon || 'chart' }
  },

  Label: { tag: 'span', text: (el, s) => s.label || '', '@tabletL': { display: 'none' } },

  // Diamond marker — the brand's node shape, lit only on the active route.
  Marker: {
    tag: 'span',
    position: 'absolute',
    right: 'Z',
    width: 'X',
    height: 'X',
    background: 'activeInk',
    transform: 'rotate(45deg)',
    opacity: '0',
    transition: 'opacity .25s ease',
    '@tabletL': { display: 'none' },
    isActive: (el, s) => s.root.route === s.path,
    '.isActive': { opacity: '1' }
  }
}
