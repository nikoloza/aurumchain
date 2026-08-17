export const payouts = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Payouts — Fractyco' },
  onRender: (el) =>
    el.call('openPage', '/payouts', 'Payouts', 'One record per epoch per position. Claim sends stablecoin to the linked wallet.'),

  Column: {
    Body: {
      StatRow: {
        state: {
          tiles: [
            { label: 'Received to date', value: '$2,820', delta: '4 epochs' },
            { label: 'Unclaimed', value: '$640', delta: 'ready now' },
            { label: 'Next epoch', value: 'Sep 30', delta: 'epoch 5', tone: 'flat' },
            { label: 'Average yield', value: '10.6%', delta: 'annualized' }
          ]
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
          }
        }
      }
    }
  }
}
