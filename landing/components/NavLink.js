// One nav anchor. `href` stays a real fragment so the link reads correctly to
// assistive tech and works as a plain link when JavaScript is unavailable.
// The scroll itself is driven by the NavItem wrapper — see NavItem.js.
export const NavLink = {
  extends: 'Link',
  fontSize: 'Z1',
  fontWeight: '500',
  color: 'caption',
  textDecoration: 'none',
  cursor: 'pointer',
  padding: 'Y Z',
  borderRadius: 'X',
  transition: 'color .2s ease, background .2s ease',
  ':hover': { color: 'title', background: 'veil' }
}
