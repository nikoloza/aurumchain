export const marketplace = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Marketplace — Fractyco' },
  onRender: (el) =>
    el.call('openPage', '/marketplace', 'Marketplace', 'Peer-to-peer resale. Every fill still clears the compliance hook.'),

  Column: {
    Body: {
      KpiRow: {
        state: { inView: false },
        KpiTile: {
          state: { revealDelay: '0s', label: 'Open listings', to: 14, delta: 'across 3 assets', tone: 'flat' }
        },
        KpiTile_1: {
          extends: 'KpiTile',
          state: { revealDelay: '.07s', label: 'Best bid', to: 26.4, decimals: 2, prefix: '$', delta: 'RBX-001' }
        },
        KpiTile_2: {
          extends: 'KpiTile',
          state: { revealDelay: '.14s', label: 'Volume, 30 days', to: 182, prefix: '$', suffix: 'K', delta: '+18%' }
        },
        KpiTile_3: {
          extends: 'KpiTile',
          state: { revealDelay: '.21s', label: 'Market fee', to: 50, suffix: ' bps', delta: 'to fee destination', tone: 'flat' }
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
          },
          EmptyState: {
            show: (el, s) => { let st = s; while (st) { if (st.rows !== undefined) return !(st.rows && st.rows.length); st = st.parent } return false },
            state: {
              title: 'No open orders',
              caption: 'Sell orders across every asset appear here the moment escrow accepts them.'
            }
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
          },
          EmptyState: {
            show: (el, s) => { let st = s; while (st) { if (st.rows !== undefined) return !(st.rows && st.rows.length); st = st.parent } return false },
            state: {
              title: 'No listings yet',
              caption: 'List a position and it shows here while escrow holds the tokens.'
            }
          }
        }
      }
    }
  }
}
