// Pill call-to-action. state: { tone: 'primary' | 'secondary' | 'ghost' }.
export const PillButton = {
  tag: 'button',
  flow: 'x',
  align: 'center center',
  gap: 'Y',
  fontSize: 'Z1',
  fontWeight: '600',
  letterSpacing: '-.005em',
  padding: 'Z A',
  minHeight: '44px',
  borderRadius: 'radiusPill',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'transform .2s ease, background .2s ease, box-shadow .2s ease',
  state: { tone: 'primary' },

  onMousemove: (ev, el) => el.call('magnetPull', ev),
  onMouseout: (ev, el) => el.call('magnetReset', ev),

  isPrimary: (el, s) => !s.tone || s.tone === 'primary',
  '.isPrimary': {
    theme: 'primary',
    boxShadow: '0 1px 2px rgba(8,36,57,.16), 0 10px 26px rgba(8,36,57,.14)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 2px 4px rgba(8,36,57,.2), 0 16px 34px rgba(8,36,57,.2)'
    }
  },

  isSecondary: (el, s) => s.tone === 'secondary',
  '.isSecondary': {
    theme: 'secondary',
    ':hover': { transform: 'translateY(-2px)', background: 'veilStrong' }
  },

  isGhost: (el, s) => s.tone === 'ghost',
  '.isGhost': {
    theme: 'ghost',
    ':hover': { color: 'title' }
  },

  // For the navy bands — explicit fills, independent of the page scheme.
  isInverse: (el, s) => s.tone === 'inverse',
  '.isInverse': {
    background: 'ivory',
    color: 'navy',
    boxShadow: '0 1px 2px rgba(4,20,32,.35)',
    ':hover': { transform: 'translateY(-2px)', background: 'white' }
  },

  isOutline: (el, s) => s.tone === 'outline',
  '.isOutline': {
    background: 'transparent',
    color: 'ivory',
    border: '1px solid ivory.3',
    ':hover': { transform: 'translateY(-2px)', background: 'ivory.08', borderColor: 'ivory.5' }
  }
}
