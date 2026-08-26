export const subscriptions = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Subscriptions — Fractyco Governance' },
  onRender: (el) =>
    el.call('openPage', '/subscriptions', 'page.subscriptions.title', 'page.subscriptions.lead'),

  Column: {
    Body: {
      GovStatRow: {
        state: {
          tiles: [
            { label: 'stat.subs.awaitingSettlement', to: 4, delta: '$31,500', tone: 'flat', revealDelay: '0s' },
            { label: 'stat.subs.settled30', to: 38, delta: '$412,000', revealDelay: '.07s' },
            { label: 'stat.subs.failed', to: 0, delta: 'stat.subs.failed.delta', revealDelay: '.14s' },
            { label: 'stat.subs.medianSettle', to: 6, suffix: 'h', delta: 'stat.subs.medianSettle.delta', revealDelay: '.21s' }
          ]
        }
      },

      Panel: {
        state: { title: 'panel.subs.queue.title', lead: 'panel.subs.queue.lead' },
        DataTable: {
          state: {
            columns: ['table.investor', 'table.asset', 'table.amount', 'table.tokens', 'table.committed', 'table.status'],
            rows: [
              { cells: [{ text: '9fQ…4mT', mono: true }, { text: 'RBX-001', mono: true }, { text: '$12,500', mono: true }, { text: '500.0000', mono: true }, { text: '2026-07-19', mono: true }, { status: 'status.pending' }] },
              { cells: [{ text: '3kL…8bV', mono: true }, { text: 'RBX-001', mono: true }, { text: '$8,000', mono: true }, { text: '320.0000', mono: true }, { text: '2026-08-14', mono: true }, { status: 'status.pending' }] },
              { cells: [{ text: '7cR…1nP', mono: true }, { text: 'KGT-002', mono: true }, { text: '$6,000', mono: true }, { text: '600.0000', mono: true }, { text: '2026-08-15', mono: true }, { status: 'status.processing' }] },
              { cells: [{ text: '2wX…6hQ', mono: true }, { text: 'KGT-002', mono: true }, { text: '$5,000', mono: true }, { text: '500.0000', mono: true }, { text: '2026-08-16', mono: true }, { status: 'status.pending' }] }
            ]
          },
          GovEmptyState: {
            show: (el, s) => !((s.parent && s.parent.rows) || []).length,
            state: {
              title: 'empty.subs.title',
              caption: 'empty.subs.caption'
            }
          }
        },
        Actions: {
          flow: 'x',
          gap: 'Z',
          paddingTop: 'Z',
          ActionButton: { text: '{{ action.finalizeSelected | polyglot }}' },
          ActionButton_1: { extends: 'ActionButton', state: { tone: 'secondary' }, text: '{{ action.reject | polyglot }}' }
        }
      }
    }
  }
}
