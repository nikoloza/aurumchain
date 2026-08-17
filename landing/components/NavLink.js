// In-page anchor. `href` stays a real fragment so the link works without
// JavaScript; the click is intercepted so the scroll can offset the sticky
// header. state: { target } is the section's component key on the page.
export const NavLink = {
  extends: 'Link',
  tag: 'a',
  fontSize: 'Z1',
  fontWeight: '500',
  color: 'caption',
  textDecoration: 'none',
  cursor: 'pointer',
  padding: 'Y Z',
  borderRadius: 'X',
  transition: 'color .2s ease, background .2s ease',
  ':hover': { color: 'title', background: 'white.06' },

  onClick: (ev, el, s) => {
    if (!s.target) return
    ev.preventDefault()
    el.call('scrollToSection', s.target)
  }
}
