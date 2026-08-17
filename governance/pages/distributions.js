export const distributions = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Distributions — Fractyco Governance' },
  onRender: (el) =>
    el.call('openPage', '/distributions', 'Distributions', 'Open an epoch at a fixed rate, then pay each holder against the snapshot.'),

  Column: {
    Body: {
      StatRow: {
        state: {
          tiles: [
            { label: 'Epochs closed', value: '4', delta: 'RBX-001, SVP-003', tone: 'flat' },
            { label: 'Distributed', value: '$186K', delta: 'to 212 holders' },
            { label: 'Unclaimed', value: '$14.2K', delta: '38 records', tone: 'flat' },
            { label: 'Next epoch', value: 'Sep 30', delta: 'epoch 5', tone: 'flat' }
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
