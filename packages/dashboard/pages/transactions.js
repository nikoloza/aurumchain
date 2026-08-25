export const transactions = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Transactions — Fractyco' },
  onRender: (el) =>
    el.call('openPage', '/transactions', 'Transactions', 'Every money movement, with its on-chain signature where one exists.'),

  Column: {
    Body: {
      Panel: {
        state: { title: 'All transactions', lead: 'Deposits, subscriptions, payouts, trades, and refunds.' },
        DataTable: {
          state: {
            columns: ['Date', 'Type', 'Amount', 'Method', 'Signature', 'Status'],
            rows: [
              { cells: [{ text: '2026-08-14', mono: true }, { text: 'Payout' }, { text: '+$640.00', mono: true }, { text: 'Wallet' }, { text: '5xQm…9Tb', mono: true }, { status: 'Completed' }] },
              { cells: [{ text: '2026-08-02', mono: true }, { text: 'Trade' }, { text: '+$1,250.00', mono: true }, { text: 'USDC', mono: true }, { text: '2fRk…4Nv', mono: true }, { status: 'Completed' }] },
              { cells: [{ text: '2026-07-21', mono: true }, { text: 'Investment' }, { text: '−$5,000.00', mono: true }, { text: 'USDC', mono: true }, { text: '8hLp…1Ws', mono: true }, { status: 'Completed' }] },
              { cells: [{ text: '2026-07-19', mono: true }, { text: 'Investment' }, { text: '−$12,500.00', mono: true }, { text: 'USDC', mono: true }, { text: '—' }, { status: 'Pending' }] }
            ]
          },
          EmptyState: {
            state: {
              title: 'No transactions yet',
              caption: 'Every deposit, subscription, payout, trade, and refund is recorded here.'
            }
          }
        }
      }
    }
  }
}
