// Footer link wrapper. state: { label, anchor } for an in-page section, or
// state: { label, url } for an external destination. Same mechanics as
// NavItem — see that file for why the wrapper owns the click and why the
// scroll is a single direct write.
export const FooterItem = {
  display: 'inline-flex',

  onClick: (ev, el, s) => {
    if (!s.anchor) return
    ev.preventDefault()
    const doc = el.node.ownerDocument
    const target = doc.getElementById(s.anchor)
    if (!target) return
    const root = doc.documentElement
    const header = doc.querySelector('header')
    root.scrollTop =
      root.scrollTop +
      target.getBoundingClientRect().top -
      ((header ? header.offsetHeight : 80) + 16)
  },

  FooterLink: {
    href: (el) => {
      const st = el.state || {}
      if (st.url) return st.url
      const loc = el.node && el.node.ownerDocument.location
      const anchor = st.anchor || ''
      return loc ? `${loc.origin}${loc.pathname}#${anchor}` : `#${anchor}`
    },
    text: (el, s) => el.call('polyglot', s.label || '', s.root.lang)
  }
}
