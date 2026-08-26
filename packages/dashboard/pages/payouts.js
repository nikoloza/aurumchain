export const payouts = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Payouts — Fractyco' },
  onRender: (el) =>
    el.call('openPage', '/payouts', 'page.payouts.title', 'page.payouts.lead'),

  Column: {
    Body: {
      KpiRow: {
        state: { inView: false },
        KpiTile: {
          state: { revealDelay: '0s', label: 'kpi.receivedToDate', to: 2820, prefix: '$', delta: 'kpi.delta4Epochs' }
        },
        KpiTile_1: {
          extends: 'KpiTile',
          state: { revealDelay: '.07s', label: 'kpi.unclaimed', to: 640, prefix: '$', delta: 'kpi.readyNow' }
        },
        KpiTile_2: {
          extends: 'KpiTile',
          state: { revealDelay: '.14s', label: 'kpi.nextEpoch', value: 'Sep 30', delta: 'kpi.epoch5', tone: 'flat' }
        },
        KpiTile_3: {
          extends: 'KpiTile',
          state: { revealDelay: '.21s', label: 'kpi.averageYield', to: 10.6, decimals: 1, suffix: '%', delta: 'kpi.annualized' }
        }
      },

      Panel: {
        state: { title: 'panel.payoutRecords.title', lead: 'panel.payoutRecords.lead' },
        DataTable: {
          state: {
            columns: ['table.epoch', 'table.asset', 'table.snapshot', 'table.rate', 'table.amount', 'table.status'],
            rows: [
              { cells: [{ text: 'epoch.4', mono: true }, { text: 'RBX-001', mono: true }, { text: '500.0000', mono: true }, { text: '$1.28', mono: true }, { text: '$640.00', mono: true }, { status: 'status.unclaimed' }] },
              { cells: [{ text: 'epoch.3', mono: true }, { text: 'RBX-001', mono: true }, { text: '500.0000', mono: true }, { text: '$1.14', mono: true }, { text: '$570.00', mono: true }, { status: 'status.paid' }] },
              { cells: [{ text: 'epoch.3', mono: true }, { text: 'SVP-003', mono: true }, { text: '556.0000', mono: true }, { text: '$1.60', mono: true }, { text: '$889.60', mono: true }, { status: 'status.paid' }] },
              { cells: [{ text: 'epoch.2', mono: true }, { text: 'SVP-003', mono: true }, { text: '556.0000', mono: true }, { text: '$1.30', mono: true }, { text: '$722.80', mono: true }, { status: 'status.paid' }] }
            ]
          },
          EmptyState: {
            state: {
              title: 'empty.payouts.title',
              caption: 'empty.payouts.caption'
            }
          }
        }
      }
    }
  }
}
