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
  attr: { 'aria-label': 'Switch color theme', type: 'button' },

  onRender: (el) => {
    try {
      const doc = el.node.ownerDocument
      const win = doc.defaultView
      const saved = win.localStorage.getItem('fractyco_theme')
      if (saved === 'light' || saved === 'dark') {
        const root = doc.documentElement
        if (root.getAttribute('data-theme') !== saved) {
          root.setAttribute('data-theme', saved)
          root.style.colorScheme = saved
        }
      }
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
        'dark'
      return mode === 'dark'
    },
    Svg: {
      viewBox: '0 0 24 24',
      width: 'A',
      height: 'A',
      html:
        '<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/>' +
        '<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
    }
  },
  MoonGlyph: {
    display: 'inline-flex',
    show: (el, s) => {
      const mode = s.root.themeMode ||
        (el.node && el.node.ownerDocument.documentElement.getAttribute('data-theme')) ||
        'dark'
      return mode !== 'dark'
    },
    Svg: {
      viewBox: '0 0 24 24',
      width: 'A',
      height: 'A',
      html:
        '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'
    }
  }
}
