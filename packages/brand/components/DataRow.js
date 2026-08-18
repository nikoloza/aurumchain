// state: { cells: [{ text, status, tone }] }
export const DataRow = {
  flow: 'x',
  gap: 'Z',
  width: '100%',
  padding: 'Z 0',
  alignItems: 'center',
  borderBottom: '1px solid hairline',
  transition: 'background .18s ease',
  ':hover': { background: 'veil' },

  Cells: {
    display: 'contents',
    childExtends: 'DataCell',
    childrenAs: 'state',
    children: (el, s) => s.cells || []
  }
}
