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
  borderRadius: 'Z',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'transform .18s ease, background .18s ease',
  state: { tone: 'primary' },

  isPrimary: (el, s) => s.tone !== 'secondary' && s.tone !== 'ghost',
  '.isPrimary': { theme: 'primary', ':hover': { transform: 'translateY(-1px)' } },

  isSecondary: (el, s) => s.tone === 'secondary',
  '.isSecondary': { theme: 'secondary', ':hover': { background: 'white.12' } },

  isGhost: (el, s) => s.tone === 'ghost',
  '.isGhost': { theme: 'ghost', ':hover': { color: 'title' } }
}
