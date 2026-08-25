export const reconciliation = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Reconciliation — Fractyco Governance' },
  onRender: (el) =>
    el.call('openPage', '/reconciliation', 'Reconciliation', 'The chain is the source of truth. This page finds every row that disagrees with it.'),

  Column: {
    Body: {
      GovStatRow: {
        state: {
          tiles: [
            { label: 'Rows checked', to: 4812, delta: 'last run 12 min ago', tone: 'flat', revealDelay: '0s' },
            { label: 'In agreement', to: 4809, delta: '99.94%', revealDelay: '.07s' },
            { label: 'Drifted', to: 3, delta: 'needs a decision', tone: 'down', revealDelay: '.14s' },
            { label: 'Last full sweep', value: '2026-08-17', delta: '02:00 UTC', tone: 'flat', revealDelay: '.21s' }
          ]
        }
      },

      Panel: {
        state: { title: 'Drift', lead: 'A drifted row means the database and the chain report different numbers.' },
        DataTable: {
          state: {
            columns: ['Record', 'Field', 'Database', 'Chain', 'Status'],
            rows: [
              { cells: [{ text: 'investment 8a1f…', mono: true }, { text: 'tokens_purchased' }, { text: '500.0000', mono: true }, { text: '499.0000', mono: true }, { status: 'Pending' }] },
              { cells: [{ text: 'position 2c77…', mono: true }, { text: 'total_tokens' }, { text: '556.0000', mono: true }, { text: '532.0000', mono: true }, { status: 'Pending' }] },
              { cells: [{ text: 'listing 91be…', mono: true }, { text: 'remaining' }, { text: '80.0000', mono: true }, { text: '56.0000', mono: true }, { status: 'Processing' }] }
            ]
          },
          GovEmptyState: {
            show: (el, s) => !((s.parent && s.parent.rows) || []).length,
            state: {
              title: 'No drift',
              caption: 'Every database row agrees with the chain as of the last sweep.'
            }
          }
        },
        Actions: {
          flow: 'x',
          gap: 'Z',
          paddingTop: 'Z',
          ActionButton: { text: 'Adopt chain values' },
          ActionButton_1: { extends: 'ActionButton', state: { tone: 'secondary' }, text: 'Run sweep' }
        }
      },

      EmptyNote: {
        state: {
          text: 'Adopting a chain value rewrites the database row and writes an audit entry that carries both the previous and the new state.'
        }
      }
    }
  }
}
