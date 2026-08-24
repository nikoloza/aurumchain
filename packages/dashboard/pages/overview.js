export const overview = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Overview — Fractyco' },
  onRender: (el) =>
    el.call('openPage', '/', 'Overview', 'Your positions, payouts, and open subscriptions.'),

  Column: {
    Body: {
      StatRow: {
        state: {
          tiles: [
            { label: 'Portfolio value', value: '$48,120', delta: '+6.2% this quarter' },
            { label: 'Invested', value: '$45,300', delta: '3 positions', tone: 'flat' },
            { label: 'Payouts received', value: '$2,820', delta: '+$640 last epoch' },
            { label: 'Unclaimed', value: '$640', delta: 'ready to claim' }
          ]
        }
      },

      Split: {
        display: 'grid',
        gridTemplateColumns: '1.6fr 1fr',
        gap: 'A',
        '@tabletL': { gridTemplateColumns: '1fr' },

        Panel: {
          state: {
            title: 'Recent activity',
            lead: 'Subscriptions, payouts, and trades across all positions.'
          },
          DataTable: {
            state: {
              columns: ['Date', 'Event', 'Asset', 'Amount', 'Status'],
              rows: [
                { cells: [{ text: '2026-08-14', mono: true }, { text: 'Payout claimed' }, { text: 'RBX-001', mono: true }, { text: '+$640.00', mono: true }, { status: 'Completed' }] },
                { cells: [{ text: '2026-08-02', mono: true }, { text: 'Sell order filled' }, { text: 'SVP-003', mono: true }, { text: '+$1,250.00', mono: true }, { status: 'Filled' }] },
                { cells: [{ text: '2026-07-21', mono: true }, { text: 'Subscription' }, { text: 'KGT-002', mono: true }, { text: '−$5,000.00', mono: true }, { status: 'Completed' }] },
                { cells: [{ text: '2026-07-19', mono: true }, { text: 'Subscription' }, { text: 'RBX-001', mono: true }, { text: '−$12,500.00', mono: true }, { status: 'Pending' }] },
                { cells: [{ text: '2026-07-04', mono: true }, { text: 'Wallet verified' }, { text: '—' }, { text: '—' }, { status: 'Verified' }] }
              ]
            }
          }
        },

        Side: {
          flow: 'y',
          gap: 'A',

          Panel: {
            state: { title: 'Eligibility', lead: 'Where this account sits in the state machine.' },
            Steps: {
              flow: 'y',
              gap: 'Z',
              Registered: { flow: 'x', align: 'center space-between', K: { tag: 'span', fontSize: 'Z', color: 'paragraph', text: 'Registered' }, StatusPill: { state: { status: 'Completed' } } },
              Wallet: { flow: 'x', align: 'center space-between', K: { tag: 'span', fontSize: 'Z', color: 'paragraph', text: 'Wallet verified' }, StatusPill: { state: { status: 'Verified' } } },
              Kyc: { flow: 'x', align: 'center space-between', K: { tag: 'span', fontSize: 'Z', color: 'paragraph', text: 'Identity approved' }, StatusPill: { state: { status: 'Approved' } } },
              Invest: { flow: 'x', align: 'center space-between', K: { tag: 'span', fontSize: 'Z', color: 'paragraph', text: 'Can invest' }, StatusPill: { state: { status: 'Eligible' } } }
            }
          },

          Panel_1: {
            extends: 'Panel',
            state: { title: 'Next payout', lead: 'Epoch 5 opens on the schedule below.' },
            Body: {
              flow: 'y',
              gap: 'Y',
              Date: { tag: 'span', fontFamily: 'Mono', fontSize: 'C', color: 'accentInk', text: '2026-09-30' },
              EmptyNote: { state: { text: 'The snapshot is taken at the epoch boundary. A transfer after the snapshot does not change the entitlement.' } }
            }
          }
        }
      }
    }
  }
}
