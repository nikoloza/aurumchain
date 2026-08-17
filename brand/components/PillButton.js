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
  borderRadius: 'E',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'transform .2s ease, background .2s ease, box-shadow .2s ease',
  state: { tone: 'primary' },

  isPrimary: (el, s) => s.tone !== 'secondary' && s.tone !== 'ghost',
  '.isPrimary': {
    theme: 'primary',
    boxShadow: '0 1px 2px rgba(6,15,26,.3), 0 10px 26px rgba(229,179,90,.22)',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 2px 4px rgba(6,15,26,.34), 0 16px 34px rgba(229,179,90,.3)'
    }
  },

  isSecondary: (el, s) => s.tone === 'secondary',
  '.isSecondary': {
    theme: 'secondary',
    ':hover': { transform: 'translateY(-2px)', background: 'white.12' }
  },

  isGhost: (el, s) => s.tone === 'ghost',
  '.isGhost': {
    theme: 'ghost',
    ':hover': { color: 'title' }
  }
}
