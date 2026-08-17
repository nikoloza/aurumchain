// Scrolls a named section into view and offsets the sticky navbar band, so the
// heading clears the header instead of hiding under it. The section is found
// through the DOMQL tree — `key` is the component key on the page, for example
// 'HowSection'. The runtime's app-shell reset disables CSS smooth scrolling,
// so the scroll runs here.
export const scrollToSection = function scrollToSection (key) {
  const target = this.getRoot().lookdown(key)
  if (!target || !target.node) return

  const nav = this.getRoot().lookdown('Navbar')
  const offset = (nav && nav.node ? nav.node.offsetHeight : 80) + 16
  const top = target.node.getBoundingClientRect().top + window.pageYOffset - offset

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
}
