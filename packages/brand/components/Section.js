// Shared section shell — vertical rhythm and a max-width content column, so
// every band on the page lines up on the same gutters.
export const Section = {
  tag: 'section',
  flow: 'y',
  align: 'center center',
  width: '100%',
  padding: 'F C',
  '@tabletS': { padding: 'D A' },

  Inner: {
    flow: 'y',
    gap: 'D',
    width: '100%',
    maxWidth: '1120px'
  }
}
