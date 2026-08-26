export const FooterLink = {
  extends: 'Link',
  fontSize: 'Z',
  color: 'caption',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '34px',
  transition: 'color .2s ease',
  ':hover': { color: 'title' },
  href: (el, s) => s.href,
  text: (el, s) => s.text
}
