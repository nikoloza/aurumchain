export const marketplace = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Marketplace — Fractyco' },
  onCreate: (el) =>
    el.call('openPage', '/marketplace', 'Marketplace', 'Peer-to-peer resale. Every fill still clears the compliance hook.'),

  Column: {
    Body: {
      StatRow: {
        state: {
          tiles: [
            { label: 'Open listings', value: '14', delta: 'across 3 assets', tone: 'flat' },
            { label: 'Best bid', value: '$26.40', delta: 'RBX-001' },
            { label: 'Volume, 30 days', value: '$182K', delta: '+18%' },
            { label: 'Market fee', value: '50 bps', delta: 'to fee destination', tone: 'flat' }
          ]
        }
      },

      Panel: {
        state: { title: 'Order book', lead: 'Active sell orders. A fill may take any amount up to the remainder.' },
        DataTable: {
          state: {
            columns: ['Asset', 'Seller', 'Amount', 'Price', 'Remaining', 'Status'],
            rows: [
              { cells: [{ text: 'RBX-001', mono: true }, { text: '9fQ…4mT', mono: true }, { text: '120.0000', mono: true }, { text: '$26.40', mono: true }, { text: '120.0000', mono: true }, { status: 'Active' }] },
              { cells: [{ text: 'RBX-001', mono: true }, { text: '3kL…8bV', mono: true }, { text: '400.0000', mono: true }, { text: '$27.10', mono: true }, { text: '260.0000', mono: true }, { status: 'Active' }] },
              { cells: [{ text: 'KGT-002', mono: true }, { text: '7cR…1nP', mono: true }, { text: '900.0000', mono: true }, { text: '$10.85', mono: true }, { text: '900.0000', mono: true }, { status: 'Active' }] },
              { cells: [{ text: 'SVP-003', mono: true }, { text: '2wX…6hQ', mono: true }, { text: '80.0000', mono: true }, { text: '$52.00', mono: true }, { text: '0.0000', mono: true }, { status: 'Filled' }] }
            ]
          }
        }
      },

      Panel_1: {
        extends: 'Panel',
        state: { title: 'Your listings', lead: 'Cancel returns the escrowed tokens to your wallet.' },
        DataTable: {
          state: {
            columns: ['Asset', 'Amount', 'Price', 'Sold', 'Status'],
            rows: [
              { cells: [{ text: 'SVP-003', mono: true }, { text: '100.0000', mono: true }, { text: '$52.00', mono: true }, { text: '24.0000', mono: true }, { status: 'Active' }] }
            ]
          }
        }
      }
    }
  }
}
