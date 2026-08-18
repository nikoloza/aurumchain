// Table driven entirely by state, so a page declares data and nothing else.
// state: { columns: [String], rows: [{ cells: [{ text, tone, status }] }] }
export const DataTable = {
  flow: 'y',
  width: '100%',
  overflowX: 'auto',

  Head: {
    flow: 'x',
    gap: 'Z',
    width: '100%',
    padding: 'Y 0',
    borderBottom: '1px solid hairline',
    childExtends: 'HeadCell',
    childrenAs: 'state',
    children: (el, s) => (s.columns || []).map((text) => ({ text }))
  },

  Rows: {
    flow: 'y',
    width: '100%',
    childExtends: 'DataRow',
    childrenAs: 'state',
    children: (el, s) => s.rows || []
  }
}
