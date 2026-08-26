// Top-nav text link — quiet at rest, pill wash on hover, settled press.
export const NavLink = {
  extends: 'Link',
  fontSize: 'Z1',
  fontWeight: '500',
  color: 'caption',
  textDecoration: 'none',
  cursor: 'pointer',
  padding: 'Y Z',
  borderRadius: 'radiusPill',
  transition: 'color .2s ease, background .2s ease, transform .12s ease',
  ':hover': { color: 'title', background: 'veil' },
  ':active': { transform: 'scale(.96)' }
}
