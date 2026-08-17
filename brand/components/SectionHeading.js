// Section lead-in: eyebrow chip, headline, and a supporting line.
// state: { eyebrow, title, lead }
export const SectionHeading = {
  flow: 'y',
  gap: 'Z',
  maxWidth: 'I',
  alignItems: 'flex-start',

  ChipAccent: {
    text: (el, s) => s.eyebrow || ''
  },

  H2: {
    fontFamily: 'Display',
    fontSize: 'D',
    lineHeight: '1.12',
    fontWeight: '700',
    letterSpacing: '-.025em',
    color: 'title',
    margin: '0',
    text: (el, s) => s.title || '',
    '@tabletS': { fontSize: 'C' }
  },

  P: {
    fontSize: 'A',
    lineHeight: '1.6',
    color: 'paragraph',
    margin: '0',
    text: (el, s) => s.lead || ''
  }
}
