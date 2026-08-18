// A cell renders a status pill when its value carries a status, and monospaced
// text when the page marks the column as numeric.
// state: { text, status, mono }
export const DataCell = {
  flow: 'x',
  align: 'center flex-start',
  flex: '1',
  minWidth: 'F',

  Value: {
    tag: 'span',
    fontSize: 'Z',
    color: 'paragraph',
    display: (el, s) => (s.status ? 'none' : 'inline'),
    fontFamily: (el, s) => (s.mono ? 'Mono' : 'Default'),
    // `session: 'email'` resolves the signed-in account's email at render
    // time — table rows are plain data, so live values are declared by name.
    text: (el, s) => {
      if (s.session === 'email') {
        try {
          const win = el.node.ownerDocument.defaultView
          const sess = JSON.parse(win.localStorage.getItem('fractyco_session') || 'null')
          if (sess && sess.user && sess.user.email) return sess.user.email
        } catch (e) {}
      }
      return s.text || ''
    }
  },

  StatusPill: {
    display: (el, s) => (s.status ? 'inline-flex' : 'none')
  }
}
