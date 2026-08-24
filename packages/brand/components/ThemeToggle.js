// Light/dark switch. Lives in the landing navbar and both dashboard topbars.
//
// Mechanics, per this codebase's hard-won constraints:
//   * All DOM access goes through el.node.ownerDocument — bare document/window
//     belong to another realm in both the dev runner and the published
//     runtime.
//   * The choice persists as `fractyco_theme` and onRender re-applies it,
//     idempotently and with no state writes, so it survives reloads on every
//     surface without any risk of a render loop.
//   * `themeMode` on root state exists only so the two glyphs swap reactively;
//     the update happens in a click handler, which is a safe update site.
//   * Both scheme selectors are always emitted by the design system, so
//     setting `data-theme` on <html> is the entire switch.
export const ThemeToggle = {
  tag: 'button',
  flow: 'x',
  align: 'center center',
  flexShrink: '0',
  width: 'B1',
  height: 'B1',
  padding: '0',
  borderRadius: 'E',
  border: '1px solid hairline',
  background: 'transparent',
  color: 'caption',
  cursor: 'pointer',
  transition: 'color .18s ease, background .18s ease',
  ':hover': { color: 'title', background: 'veil' },
  type: 'button',
  ariaLabel: 'Switch color theme',

  onRender: (el, s) => {
    try {
      const doc = el.node.ownerDocument
      const win = doc.defaultView
      const saved = win.localStorage.getItem('fractyco_theme')
      // The brand is light-first: with no stored choice, assert the light
      // scheme (the dev runner and the published shell both resolve the OS
      // preference before project config, so the default must be enforced
      // here, at the one place that owns the attribute).
      const want = (saved === 'light' || saved === 'dark') ? saved : 'light'
      const root = doc.documentElement
      if (root.getAttribute('data-theme') !== want) {
        root.setAttribute('data-theme', want)
        root.style.colorScheme = want
      }
      if ((s.root.themeMode || '') !== want) s.root.update({ themeMode: want }, { preventFetch: true })
    } catch (e) {}
  },

  onClick: (ev, el, s) => {
    try {
      const doc = el.node.ownerDocument
      const win = doc.defaultView
      const root = doc.documentElement
      const current = root.getAttribute('data-theme') ||
        (win.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      const next = current === 'dark' ? 'light' : 'dark'
      root.setAttribute('data-theme', next)
      root.style.colorScheme = next
      win.localStorage.setItem('fractyco_theme', next)
      s.root.update({ themeMode: next })
    } catch (e) {}
  },

  // Sun shows in dark mode ("switch to light"), moon in light mode.
  SunGlyph: {
    display: 'inline-flex',
    show: (el, s) => {
      const mode = s.root.themeMode ||
        (el.node && el.node.ownerDocument.documentElement.getAttribute('data-theme')) ||
        'light'
      return mode === 'dark'
    },
    Icon: { name: 'sun', fontSize: 'A' }
  },
  MoonGlyph: {
    display: 'inline-flex',
    show: (el, s) => {
      const mode = s.root.themeMode ||
        (el.node && el.node.ownerDocument.documentElement.getAttribute('data-theme')) ||
        'light'
      return mode !== 'dark'
    },
    Icon: { name: 'moon', fontSize: 'A' }
  }
}
