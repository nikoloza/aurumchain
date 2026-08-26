export const reconciliation = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Reconciliation — Fractyco Governance' },
  onRender: (el) =>
    el.call('openPage', '/reconciliation', 'page.reconciliation.title', 'page.reconciliation.lead'),

  Column: {
    Body: {
      GovStatRow: {
        state: {
          tiles: [
            { label: 'stat.recon.rowsChecked', to: 4812, delta: 'stat.recon.rowsChecked.delta', tone: 'flat', revealDelay: '0s' },
            { label: 'stat.recon.inAgreement', to: 4809, delta: '99.94%', revealDelay: '.07s' },
            { label: 'stat.recon.drifted', to: 3, delta: 'stat.recon.drifted.delta', tone: 'down', revealDelay: '.14s' },
            { label: 'stat.recon.lastSweep', value: '2026-08-17', delta: '02:00 UTC', tone: 'flat', revealDelay: '.21s' }
          ]
        }
      },

      Panel: {
        state: { title: 'panel.recon.drift.title', lead: 'panel.recon.drift.lead' },
        DataTable: {
          state: {
            columns: ['table.record', 'table.field', 'table.database', 'table.chain', 'table.status'],
            rows: [
              { cells: [{ text: 'investment 8a1f…', mono: true }, { text: 'tokens_purchased' }, { text: '500.0000', mono: true }, { text: '499.0000', mono: true }, { status: 'status.pending' }] },
              { cells: [{ text: 'position 2c77…', mono: true }, { text: 'total_tokens' }, { text: '556.0000', mono: true }, { text: '532.0000', mono: true }, { status: 'status.pending' }] },
              { cells: [{ text: 'listing 91be…', mono: true }, { text: 'remaining' }, { text: '80.0000', mono: true }, { text: '56.0000', mono: true }, { status: 'status.processing' }] }
            ]
          },
          GovEmptyState: {
            show: (el, s) => !((s.parent && s.parent.rows) || []).length,
            state: {
              title: 'empty.recon.title',
              caption: 'empty.recon.caption'
            }
          }
        },
        Actions: {
          flow: 'x',
          gap: 'Z',
          paddingTop: 'Z',
          // Georgian labels are longer than a phone row can hold.
          flexWrap: 'wrap',
          ActionButton: { text: '{{ action.adoptChainValues | polyglot }}' },
          ActionButton_1: { extends: 'ActionButton', state: { tone: 'secondary' }, text: '{{ action.runSweep | polyglot }}' }
        }
      },

      EmptyNote: {
        state: {
          text: 'note.reconciliation'
        }
      }
    }
  }
}
