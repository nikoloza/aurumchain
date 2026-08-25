// Pill call-to-action. state: { tone: 'primary' | 'secondary' | 'ghost' |
// 'inverse' | 'outline' }. Every tone has a full interaction arc — rest,
// hover lift, pressed settle — and the magnet pull runs under all of them.
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
  transition: 'transform .2s ease, background .2s ease, box-shadow .2s ease, border-color .2s ease, color .2s ease',
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
    },
    ':active': {
      transform: 'translateY(0) scale(.98)',
      boxShadow: '0 1px 2px rgba(8,36,57,.18), 0 4px 12px rgba(8,36,57,.14)'
    }
  },

  isSecondary: (el, s) => s.tone === 'secondary',
  '.isSecondary': {
    theme: 'secondary',
    ':hover': { transform: 'translateY(-2px)', background: 'veilStrong' },
    ':active': { transform: 'translateY(0) scale(.98)' }
  },

  isGhost: (el, s) => s.tone === 'ghost',
  '.isGhost': {
    theme: 'ghost',
    ':hover': { color: 'title', background: 'veil' },
    ':active': { transform: 'scale(.98)', background: 'veilStrong' }
  },

  // For the ivory band — explicit fills, independent of the page scheme
  // (the mirror of inverse/outline, which serve the navy bands).
  isSolid: (el, s) => s.tone === 'solid',
  '.isSolid': {
    background: 'navy',
    color: 'ivory',
    boxShadow: '0 1px 2px rgba(8,36,57,.16), 0 10px 26px rgba(8,36,57,.14)',
    ':hover': {
      transform: 'translateY(-2px)',
      background: 'navySoft',
      boxShadow: '0 2px 4px rgba(8,36,57,.2), 0 16px 34px rgba(8,36,57,.2)'
    },
    ':active': { transform: 'translateY(0) scale(.98)', background: 'navy' }
  },

  isPaper: (el, s) => s.tone === 'paper',
  '.isPaper': {
    background: 'white',
    color: 'navy',
    border: '1px solid line',
    ':hover': { transform: 'translateY(-2px)', background: 'ivory' },
    ':active': { transform: 'translateY(0) scale(.98)' }
  },

  // For the navy bands — explicit fills, independent of the page scheme.
  isInverse: (el, s) => s.tone === 'inverse',
  '.isInverse': {
    background: 'ivory',
    color: 'navy',
    boxShadow: '0 1px 2px rgba(4,20,32,.35)',
    ':hover': { transform: 'translateY(-2px)', background: 'white', boxShadow: '0 2px 4px rgba(4,20,32,.4), 0 14px 30px rgba(4,20,32,.35)' },
    ':active': { transform: 'translateY(0) scale(.98)', background: 'ivory' }
  },

  isOutline: (el, s) => s.tone === 'outline',
  '.isOutline': {
    background: 'transparent',
    color: 'ivory',
    border: '1px solid ivory.3',
    ':hover': { transform: 'translateY(-2px)', background: 'ivory.08', borderColor: 'ivory.5' },
    ':active': { transform: 'translateY(0) scale(.98)', background: 'ivory.12' }
  }
}
