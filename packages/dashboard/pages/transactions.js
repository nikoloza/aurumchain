export const transactions = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Transactions — Fractyco' },
  onRender: (el) =>
    el.call('openPage', '/transactions', 'page.transactions.title', 'page.transactions.lead'),

  Column: {
    Body: {
      Panel: {
        state: { title: 'panel.allTransactions.title', lead: 'panel.allTransactions.lead' },
        DataTable: {
          state: {
            columns: ['table.date', 'table.type', 'table.amount', 'table.method', 'table.signature', 'table.status'],
            rows: [
              { cells: [{ text: '2026-08-14', mono: true }, { text: 'txType.payout' }, { text: '+$640.00', mono: true }, { text: 'common.wallet' }, { text: '5xQm…9Tb', mono: true }, { status: 'status.completed' }] },
              { cells: [{ text: '2026-08-02', mono: true }, { text: 'txType.trade' }, { text: '+$1,250.00', mono: true }, { text: 'USDC', mono: true }, { text: '2fRk…4Nv', mono: true }, { status: 'status.completed' }] },
              { cells: [{ text: '2026-07-21', mono: true }, { text: 'txType.investment' }, { text: '−$5,000.00', mono: true }, { text: 'USDC', mono: true }, { text: '8hLp…1Ws', mono: true }, { status: 'status.completed' }] },
              { cells: [{ text: '2026-07-19', mono: true }, { text: 'txType.investment' }, { text: '−$12,500.00', mono: true }, { text: 'USDC', mono: true }, { text: '—' }, { status: 'status.pending' }] }
            ]
          },
          EmptyState: {
            state: {
              title: 'empty.transactions.title',
              caption: 'empty.transactions.caption'
            }
          }
        }
      }
    }
  }
}
