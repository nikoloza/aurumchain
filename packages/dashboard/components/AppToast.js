// Transient app notice — a navy pill that rises from the bottom edge when
// `appNotify` raises root state. Mounted (hidden) on every page that can
// raise it, so the live region exists before its content changes and nothing
// in the layout ever moves (it overlays; it never enters the flow).
export const AppToast = {
  position: 'fixed',
  bottom: 'B',
  left: '50%',
  zIndex: '999',
  flow: 'x',
  align: 'center center',
  gap: 'Z',
  padding: 'Z A',
  maxWidth: '80%',
  borderRadius: 'radiusPill',
  theme: 'primary',
  boxShadow: '0 8px 24px rgba(8,36,57,.28)',
  fontSize: 'Z',
  pointerEvents: 'none',
  role: 'status',
  aria: { live: 'polite' },

  opacity: '0',
  visibility: 'hidden',
  transform: 'translate(-50%, 6px)',
  transition: 'opacity .25s ease, transform .25s ease, visibility .25s',
  isOn: (el, s) => !!s.root.appNoticeOn,
  '.isOn': { opacity: '1', visibility: 'visible', transform: 'translate(-50%, 0)' },
  '@reduceMotion': { transition: 'none', transform: 'translate(-50%, 0)' },

  Diamond: {
    tag: 'span',
    flexShrink: '0',
    width: 'X',
    height: 'X',
    background: 'currentColor',
    transform: 'rotate(45deg)'
  },
  Msg: {
    tag: 'span',
    // `appNotice` holds a translation key — appNotify raises the key, the
    // toast renders it in the active locale.
    text: (el, s) => el.call('polyglot', s.root.appNotice || '', s.root.lang)
  }
}
