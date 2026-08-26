// Product button. state: { tone: 'primary' | 'secondary' | 'ghost' }.
export const ActionButton = {
  tag: 'button',
  flow: 'x',
  align: 'center center',
  gap: 'Y',
  fontSize: 'Z',
  fontWeight: '600',
  padding: 'Y A',
  minHeight: 'B1',
  borderRadius: 'radiusControl',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'transform .18s ease, background .18s ease, box-shadow .18s ease, color .18s ease',
  state: { tone: 'primary' },

  isPrimary: (el, s) => s.tone !== 'secondary' && s.tone !== 'ghost',
  '.isPrimary': {
    theme: 'primary',
    boxShadow: '0 1px 2px rgba(8,36,57,.14)',
    ':hover': { transform: 'translateY(-1px)', boxShadow: '0 2px 4px rgba(8,36,57,.16), 0 8px 20px rgba(8,36,57,.16)' },
    ':active': { transform: 'translateY(0) scale(.985)', boxShadow: '0 1px 2px rgba(8,36,57,.14)' }
  },

  isSecondary: (el, s) => s.tone === 'secondary',
  '.isSecondary': {
    theme: 'secondary',
    ':hover': { background: 'veilStrong' },
    ':active': { transform: 'scale(.985)' }
  },

  isGhost: (el, s) => s.tone === 'ghost',
  '.isGhost': {
    theme: 'ghost',
    ':hover': { color: 'title', background: 'veil' },
    ':active': { transform: 'scale(.985)', background: 'veilStrong' }
  }
}
