// Lockup from the brandbook: the circular mark — two open arcs holding the
// value diamond — beside the FRACTYCO wordmark set in the condensed brand
// face. Inherits `color` from its parent chrome; defaults to the title pair
// so it flips navy/ivory with the theme on its own.
//
// The lockup is always a way home: a real anchor to `/`, routed through the
// framework. Hover widens the word's tracking a touch — the mark itself never
// rotates or distorts (brandbook rule).
export const Logo = {
  tag: 'a',
  flow: 'x',
  align: 'center center',
  gap: 'Y',
  color: 'title',
  textDecoration: 'none',
  cursor: 'pointer',
  href: '/',
  ariaLabel: (el, s) => el.call('polyglot', 'logo.home', s.root.lang),
  transition: 'opacity .25s ease, transform .2s ease',
  ':active': { transform: 'scale(.98)' },

  onClick: (ev, el) => {
    ev.preventDefault()
    el.router('/', el.getRoot())
  },

  Icon: {
    name: 'logo',
    fontSize: 'B1',
    display: 'block',
    flexShrink: '0'
  },

  Word: {
    tag: 'span',
    text: 'FRACTYCO',
    fontFamily: 'Brand',
    fontSize: 'A2',
    fontWeight: '400',
    letterSpacing: '.05em',
    lineHeight: '1',
    whiteSpace: 'nowrap',
    transform: 'translateY(1px)',
    color: 'inherit',
    transition: 'letter-spacing .4s cubic-bezier(.22,.68,.24,.98)'
  },

  ':hover': { opacity: '.92' }
}
