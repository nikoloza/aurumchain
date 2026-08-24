// Guideline-page type specimen: role column beside a live sample set in the
// actual family token. state: { face, role, fam, sample, size, weight,
// caps, tracking, tone }
export const TypeSpecimen = {
  display: 'grid',
  gridTemplateColumns: 'G 1fr',
  gap: 'B',
  alignItems: 'baseline',
  padding: 'A A2',
  borderRadius: 'radiusCard',
  theme: 'card',
  '@mobileL': { gridTemplateColumns: '1fr', gap: 'Y' },

  Who: {
    flow: 'y',
    gap: 'W',
    Face: {
      tag: 'span',
      fontSize: 'Z1',
      fontWeight: '700',
      letterSpacing: '-.01em',
      color: 'title',
      text: (el, s) => s.face || ''
    },
    Role: {
      tag: 'span',
      fontSize: 'Y',
      fontWeight: '600',
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: 'caption',
      lineHeight: '1.5',
      text: (el, s) => s.role || ''
    }
  },

  Sample: {
    tag: 'span',
    overflow: 'hidden',
    minWidth: '0',
    fontFamily: (el, s) => s.fam || 'Default',
    fontSize: (el, s) => s.size || 'B',
    fontWeight: (el, s) => s.weight || '400',
    lineHeight: '1.15',
    letterSpacing: (el, s) => s.tracking || '-.01em',
    textTransform: (el, s) => (s.caps ? 'uppercase' : 'none'),
    color: (el, s) => (s.tone === 'body' ? 'paragraph' : 'title'),
    text: (el, s) => s.sample || ''
  }
}
