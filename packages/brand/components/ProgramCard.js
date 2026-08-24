// One Solana program in the on-chain section.
// state: { name, purpose, calls: [String] }
export const ProgramCard = {
  flow: 'y',
  gap: 'Z',
  padding: 'B',
  borderRadius: 'radiusCard',
  theme: 'card',

  Head: {
    flow: 'x',
    align: 'center space-between',
    gap: 'Z',

    H3: {
      fontFamily: 'Mono',
      fontSize: 'Z1',
      fontWeight: '700',
      color: 'accentInk',
      margin: '0',
      text: (el, s) => s.name || ''
    },
    Chip: { text: 'Anchor' }
  },

  P: {
    fontSize: 'Z',
    lineHeight: '1.6',
    color: 'paragraph',
    margin: '0',
    text: (el, s) => s.purpose || ''
  },

  Calls: {
    flow: 'x',
    flexWrap: 'wrap',
    gap: 'W',
    childExtends: 'CallTag',
    childrenAs: 'state',
    children: (el, s) => (s.calls || []).map((text) => ({ text }))
  }
}
