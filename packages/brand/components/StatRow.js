// A row of headline figures. state: { tiles: [{ label, value, delta, tone }] }
export const StatRow = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: 'A',
  width: '100%',
  '@tabletL': { gridTemplateColumns: 'repeat(2, 1fr)' },
  '@mobileL': { gridTemplateColumns: '1fr' },

  childExtends: 'StatTile',
  childrenAs: 'state',
  children: (el, s) => s.tiles || []
}
