// state: { cells: [{ text, status, tone }] }
export const DataRow = {
  flow: 'x',
  gap: 'Z',
  width: '100%',
  padding: 'Z 0',
  alignItems: 'center',
  borderBottom: '1px solid white.06',
  transition: 'background .18s ease',
  ':hover': { background: 'white.03' },

  Cells: {
    display: 'contents',
    childExtends: 'DataCell',
    childrenAs: 'state',
    children: (el, s) => s.cells || []
  }
}
