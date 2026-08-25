export const overview = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Overview — Fractyco' },
  onRender: (el) =>
    el.call('openPage', '/', 'Overview', 'Your positions, payouts, and open subscriptions.'),

  Column: {
    Body: {
      KpiRow: {
        state: { inView: false },
        KpiTile: {
          state: { revealDelay: '0s', label: 'Portfolio value', to: 48120, prefix: '$', delta: '+6.2% this quarter' }
        },
        KpiTile_1: {
          extends: 'KpiTile',
          state: { revealDelay: '.07s', label: 'Invested', to: 45300, prefix: '$', delta: '3 positions', tone: 'flat' }
        },
        KpiTile_2: {
          extends: 'KpiTile',
          state: { revealDelay: '.14s', label: 'Payouts received', to: 2820, prefix: '$', delta: '+$640 last epoch' }
        },
        KpiTile_3: {
          extends: 'KpiTile',
          state: { revealDelay: '.21s', label: 'Unclaimed', to: 640, prefix: '$', delta: 'ready to claim' }
        }
      },

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
          },
          EmptyState: {
            state: {
              title: 'No activity yet',
              caption: 'Subscriptions, payouts, and trades land here as they settle.'
            }
          }
        }
      },

      // The activity table's column floors need the full content width, so
      // the secondary panels ride below it as a two-up band instead of a
      // side column that would crush at laptop widths.
      Split: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'A',
        alignItems: 'start',
        '@mobileL': { gridTemplateColumns: '1fr' },

        Panel: {
          state: { title: 'Eligibility', lead: 'Where this account sits in the state machine.' },
          Steps: {
            flow: 'y',
            width: '100%',
            childExtends: 'FlagRow',
            childrenAs: 'state',
            children: [
              { text: 'Registered', status: 'Completed' },
              { text: 'Wallet verified', status: 'Verified' },
              { text: 'Identity approved', status: 'Approved' },
              { text: 'Can invest', status: 'Eligible' }
            ]
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
