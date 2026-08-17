// One authority holder. state: { role, holder, scope, limit, status }
export const AuthorityCard = {
  flow: 'y',
  gap: 'Z',
  padding: 'A',
  borderRadius: 'A',
  theme: 'card',

  Head: {
    flow: 'x',
    align: 'center space-between',
    gap: 'Z',

    Role: {
      tag: 'h3',
      margin: '0',
      fontFamily: 'Display',
      fontSize: 'A',
      fontWeight: '600',
      color: 'title',
      text: (el, s) => s.role || ''
    },
    StatusPill: {}
  },

  Holder: {
    tag: 'span',
    fontFamily: 'Mono',
    fontSize: 'Z',
    color: 'gold',
    wordBreak: 'break-all',
    text: (el, s) => s.holder || ''
  },

  Meta: {
    flow: 'y',
    gap: 'W',
    paddingTop: 'Z',
    borderTop: '1px solid white.06',

    Scope: { tag: 'span', fontSize: 'Y1', color: 'caption', text: (el, s) => s.scope || '' },
    Limit: { tag: 'span', fontFamily: 'Mono', fontSize: 'Y1', color: 'paragraph', text: (el, s) => s.limit || '' }
  }
}
