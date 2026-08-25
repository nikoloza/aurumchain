export const distributions = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Distributions — Fractyco Governance' },
  onRender: (el) =>
    el.call('openPage', '/distributions', 'Distributions', 'Open an epoch at a fixed rate, then pay each holder against the snapshot.'),

  Column: {
    Body: {
      GovStatRow: {
        state: {
          tiles: [
            { label: 'Epochs closed', to: 3, delta: 'RBX-001, SVP-003', tone: 'flat', revealDelay: '0s' },
            { label: 'Distributed', to: 256.7, prefix: '$', suffix: 'K', decimals: 1, delta: 'claimed by 212 holders', revealDelay: '.07s' },
            { label: 'Unclaimed', to: 14.2, prefix: '$', suffix: 'K', decimals: 1, delta: '38 records — totals $270.9K with claimed', tone: 'flat', revealDelay: '.14s' },
            { label: 'Next epoch', value: 'Sep 30', delta: 'epoch 5', tone: 'flat', revealDelay: '.21s' }
          ]
        }
      },

      Panel: {
        state: { title: 'Epochs', lead: 'create_epoch fixes the profit per token. execute_payout pays one holder per call.' },
        DataTable: {
          state: {
            columns: ['Epoch', 'Asset', 'Rate', 'Eligible tokens', 'Total', 'Status'],
            rows: [
              { cells: [{ text: 'Epoch 4', mono: true }, { text: 'RBX-001', mono: true }, { text: '$1.28', mono: true }, { text: '73,600', mono: true }, { text: '$94,208', mono: true }, { status: 'Completed' }] },
              { cells: [{ text: 'Epoch 3', mono: true }, { text: 'RBX-001', mono: true }, { text: '$1.14', mono: true }, { text: '68,000', mono: true }, { text: '$77,520', mono: true }, { status: 'Completed' }] },
              { cells: [{ text: 'Epoch 3', mono: true }, { text: 'SVP-003', mono: true }, { text: '$1.60', mono: true }, { text: '62,000', mono: true }, { text: '$99,200', mono: true }, { status: 'Completed' }] },
              { cells: [{ text: 'Epoch 5', mono: true }, { text: 'RBX-001', mono: true }, { text: '—' }, { text: '—' }, { text: '—' }, { status: 'Scheduled' }] }
            ]
          },
          GovEmptyState: {
            show: (el, s) => !((s.parent && s.parent.rows) || []).length,
            state: {
              title: 'No epochs yet',
              caption: 'create_epoch opens the first one and fixes its rate against the holder snapshot.'
            }
          }
        },
        Actions: {
          flow: 'x',
          gap: 'Z',
          paddingTop: 'Z',
          ActionButton: { text: 'Create epoch' },
          ActionButton_1: { extends: 'ActionButton', state: { tone: 'secondary' }, text: 'Run batch payout' }
        }
      }
    }
  }
}
