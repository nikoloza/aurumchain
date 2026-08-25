export const payouts = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Payouts — Fractyco' },
  onRender: (el) =>
    el.call('openPage', '/payouts', 'Payouts', 'One record per epoch per position. Claim sends stablecoin to the linked wallet.'),

  Column: {
    Body: {
      KpiRow: {
        state: { inView: false },
        KpiTile: {
          state: { revealDelay: '0s', label: 'Received to date', to: 2820, prefix: '$', delta: '4 epochs' }
        },
        KpiTile_1: {
          extends: 'KpiTile',
          state: { revealDelay: '.07s', label: 'Unclaimed', to: 640, prefix: '$', delta: 'ready now' }
        },
        KpiTile_2: {
          extends: 'KpiTile',
          state: { revealDelay: '.14s', label: 'Next epoch', value: 'Sep 30', delta: 'epoch 5', tone: 'flat' }
        },
        KpiTile_3: {
          extends: 'KpiTile',
          state: { revealDelay: '.21s', label: 'Average yield', to: 10.6, decimals: 1, suffix: '%', delta: 'annualized' }
        }
      },

      Panel: {
        state: { title: 'Payout records', lead: 'Entitlement is the epoch rate multiplied by your snapshot balance.' },
        DataTable: {
          state: {
            columns: ['Epoch', 'Asset', 'Snapshot', 'Rate', 'Amount', 'Status'],
            rows: [
              { cells: [{ text: 'Epoch 4', mono: true }, { text: 'RBX-001', mono: true }, { text: '500.0000', mono: true }, { text: '$1.28', mono: true }, { text: '$640.00', mono: true }, { status: 'Unclaimed' }] },
              { cells: [{ text: 'Epoch 3', mono: true }, { text: 'RBX-001', mono: true }, { text: '500.0000', mono: true }, { text: '$1.14', mono: true }, { text: '$570.00', mono: true }, { status: 'Paid' }] },
              { cells: [{ text: 'Epoch 3', mono: true }, { text: 'SVP-003', mono: true }, { text: '556.0000', mono: true }, { text: '$1.60', mono: true }, { text: '$889.60', mono: true }, { status: 'Paid' }] },
              { cells: [{ text: 'Epoch 2', mono: true }, { text: 'SVP-003', mono: true }, { text: '556.0000', mono: true }, { text: '$1.30', mono: true }, { text: '$722.80', mono: true }, { status: 'Paid' }] }
            ]
          },
          EmptyState: {
            state: {
              title: 'No payouts yet',
              caption: 'Records appear after the first epoch closes with you on the snapshot.'
            }
          }
        }
      }
    }
  }
}
