export const overview = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Overview — Fractyco' },
  onRender: (el) =>
    el.call('openPage', '/', 'page.overview.title', 'page.overview.lead'),

  Column: {
    Body: {
      KpiRow: {
        state: { inView: false },
        KpiTile: {
          state: { revealDelay: '0s', label: 'kpi.portfolioValue', to: 48120, prefix: '$', delta: 'kpi.deltaThisQuarter' }
        },
        KpiTile_1: {
          extends: 'KpiTile',
          state: { revealDelay: '.07s', label: 'kpi.invested', to: 45300, prefix: '$', delta: 'kpi.delta3Positions', tone: 'flat' }
        },
        KpiTile_2: {
          extends: 'KpiTile',
          state: { revealDelay: '.14s', label: 'kpi.payoutsReceived', to: 2820, prefix: '$', delta: 'kpi.deltaLastEpoch' }
        },
        KpiTile_3: {
          extends: 'KpiTile',
          state: { revealDelay: '.21s', label: 'kpi.unclaimed', to: 640, prefix: '$', delta: 'kpi.readyToClaim' }
        }
      },

      Panel: {
        state: {
          title: 'panel.recentActivity.title',
          lead: 'panel.recentActivity.lead'
        },
        DataTable: {
          state: {
            columns: ['table.date', 'table.event', 'table.asset', 'table.amount', 'table.status'],
            rows: [
              { cells: [{ text: '2026-08-14', mono: true }, { text: 'event.payoutClaimed' }, { text: 'RBX-001', mono: true }, { text: '+$640.00', mono: true }, { status: 'status.completed' }] },
              { cells: [{ text: '2026-08-02', mono: true }, { text: 'event.sellOrderFilled' }, { text: 'SVP-003', mono: true }, { text: '+$1,250.00', mono: true }, { status: 'status.filled' }] },
              { cells: [{ text: '2026-07-21', mono: true }, { text: 'event.subscription' }, { text: 'KGT-002', mono: true }, { text: '−$5,000.00', mono: true }, { status: 'status.completed' }] },
              { cells: [{ text: '2026-07-19', mono: true }, { text: 'event.subscription' }, { text: 'RBX-001', mono: true }, { text: '−$12,500.00', mono: true }, { status: 'status.pending' }] },
              { cells: [{ text: '2026-07-04', mono: true }, { text: 'event.walletVerified' }, { text: '—' }, { text: '—' }, { status: 'status.verified' }] }
            ]
          },
          EmptyState: {
            state: {
              title: 'empty.activity.title',
              caption: 'empty.activity.caption'
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
          state: { title: 'panel.eligibility.title', lead: 'panel.eligibility.lead' },
          Steps: {
            flow: 'y',
            width: '100%',
            childExtends: 'FlagRow',
            childrenAs: 'state',
            children: [
              { text: 'flag.registered', status: 'status.completed' },
              { text: 'flag.walletVerified', status: 'status.verified' },
              { text: 'flag.identityApproved', status: 'status.approved' },
              { text: 'flag.canInvest', status: 'status.eligible' }
            ]
          }
        },

        Panel_1: {
          extends: 'Panel',
          state: { title: 'panel.nextPayout.title', lead: 'panel.nextPayout.lead' },
          Body: {
            flow: 'y',
            gap: 'Y',
            Date: { tag: 'span', fontFamily: 'Mono', fontSize: 'C', color: 'accentInk', text: '2026-09-30' },
            EmptyNote: { state: { text: 'note.snapshot' } }
          }
        }
      }
    }
  }
}
