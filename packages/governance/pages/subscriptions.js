export const subscriptions = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Subscriptions — Fractyco Governance' },
  onRender: (el) =>
    el.call('openPage', '/subscriptions', 'Subscriptions', 'Commitments waiting to settle. Finalizing mints tokens to the investor wallet.'),

  Column: {
    Body: {
      GovStatRow: {
        state: {
          tiles: [
            { label: 'Awaiting settlement', to: 4, delta: '$31,500', tone: 'flat', revealDelay: '0s' },
            { label: 'Settled, 30 days', to: 38, delta: '$412,000', revealDelay: '.07s' },
            { label: 'Failed settlements', to: 0, delta: 'none open', revealDelay: '.14s' },
            { label: 'Median time to settle', to: 6, suffix: 'h', delta: 'target 24h', revealDelay: '.21s' }
          ]
        }
      },

      Panel: {
        state: { title: 'Settlement queue', lead: 'finalize_subscription writes the settlement hash and the allocated amount.' },
        DataTable: {
          state: {
            columns: ['Investor', 'Asset', 'Amount', 'Tokens', 'Committed', 'Status'],
            rows: [
              { cells: [{ text: '9fQ…4mT', mono: true }, { text: 'RBX-001', mono: true }, { text: '$12,500', mono: true }, { text: '500.0000', mono: true }, { text: '2026-07-19', mono: true }, { status: 'Pending' }] },
              { cells: [{ text: '3kL…8bV', mono: true }, { text: 'RBX-001', mono: true }, { text: '$8,000', mono: true }, { text: '320.0000', mono: true }, { text: '2026-08-14', mono: true }, { status: 'Pending' }] },
              { cells: [{ text: '7cR…1nP', mono: true }, { text: 'KGT-002', mono: true }, { text: '$6,000', mono: true }, { text: '600.0000', mono: true }, { text: '2026-08-15', mono: true }, { status: 'Processing' }] },
              { cells: [{ text: '2wX…6hQ', mono: true }, { text: 'KGT-002', mono: true }, { text: '$5,000', mono: true }, { text: '500.0000', mono: true }, { text: '2026-08-16', mono: true }, { status: 'Pending' }] }
            ]
          },
          GovEmptyState: {
            show: (el, s) => !((s.parent && s.parent.rows) || []).length,
            state: {
              title: 'Nothing waiting to settle',
              caption: 'Every commitment has minted. finalize_subscription writes the next one here.'
            }
          }
        },
        Actions: {
          flow: 'x',
          gap: 'Z',
          paddingTop: 'Z',
          ActionButton: { text: 'Finalize selected' },
          ActionButton_1: { extends: 'ActionButton', state: { tone: 'secondary' }, text: 'Reject' }
        }
      }
    }
  }
}
