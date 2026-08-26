// EN / KA language switch. Lives in the landing navbar and both dashboard
// topbars, next to the theme toggle.
//
// The framework's polyglot plugin owns everything behind it: `setLang` writes
// the choice to localStorage, sets `lang` on root state, and re-resolves every
// `{{ key | polyglot }}` literal already on the page — so the switch itself
// holds no state and needs no reload.
//
// The active side is read straight off `s.root.lang` rather than through
// `getActiveLang`, so the signal is tracked and the thumb slides reactively.
export const LangSwitch = {
  position: 'relative',
  flow: 'x',
  align: 'center center',
  flexShrink: '0',
  borderRadius: 'radiusPill',
  border: '1px solid hairline',
  background: 'veil',
  role: 'group',
  ariaLabel: (el, s) => el.call('polyglot', 'lang.choose', s.root.lang),

  Thumb: {
    tag: 'span',
    position: 'absolute',
    top: '0',
    bottom: '0',
    left: '0',
    width: '50%',
    borderRadius: 'radiusPill',
    background: 'activeWash',
    transition: 'transform .35s cubic-bezier(.22,.68,.24,.98)',
    isKa: (el, s) => (s.root.lang || 'en') === 'ka',
    '.isKa': { transform: 'translateX(100%)' },
    '@reduceMotion': { transition: 'none' }
  },

  // Bare-key + _N: the key name IS the component, so no `extends` is needed.
  LangOption: { state: { lang: 'en', label: 'EN' } },
  LangOption_1: { state: { lang: 'ka', label: 'KA' } }
}

// One side of the switch. state: { lang, label }
export const LangOption = {
  tag: 'button',
  type: 'button',
  position: 'relative',
  flex: '1',
  padding: 'W Z',
  fontFamily: 'Mono',
  fontSize: 'Y1',
  fontWeight: '600',
  letterSpacing: '.1em',
  whiteSpace: 'nowrap',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  transition: 'color .35s ease',
  color: 'caption',
  isActive: (el, s) => (s.root.lang || 'en') === s.lang,
  '.isActive': { color: 'activeInk' },
  text: (el, s) => s.label || '',
  ariaPressed: (el, s) => String((s.root.lang || 'en') === s.lang),
  onClick: (ev, el, s) => el.call('setLang', s.lang)
}
