export const settings = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Settings — Fractyco' },
  onRender: (el) =>
    el.call('openPage', '/settings', 'Settings', 'Profile and network.'),

  Column: {
    Body: {
      Panel: {
        state: { title: 'Profile', lead: 'Stored on the profile record.' },
        DataTable: {
          state: {
            columns: ['Field', 'Value'],
            rows: [
              { cells: [{ text: 'Email' }, { session: 'email' }] },
              { cells: [{ text: 'Country' }, { text: 'Georgia' }] },
              { cells: [{ text: 'Timezone' }, { text: 'Asia/Tbilisi' }] },
              { cells: [{ text: 'Member since' }, { text: '2026-07-02', mono: true }] }
            ]
          }
        }
      },

      Panel_1: {
        extends: 'Panel',
        state: { title: 'Network', lead: 'The cluster this session reads and writes.' },
        DataTable: {
          state: {
            columns: ['Field', 'Value'],
            rows: [
              { cells: [{ text: 'Cluster' }, { text: 'devnet' }] },
              { cells: [{ text: 'Settlement asset' }, { text: 'USDC', mono: true }] },
              { cells: [{ text: 'Registry program' }, { text: 'DZBc…HxJN', mono: true }] },
              { cells: [{ text: 'Compliance program' }, { text: 'BYg6…85V9', mono: true }] }
            ]
          }
        }
      }
    }
  }
}
