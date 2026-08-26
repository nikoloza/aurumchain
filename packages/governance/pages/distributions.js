export const distributions = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Distributions — Fractyco Governance' },
  onRender: (el) =>
    el.call('openPage', '/distributions', 'page.distributions.title', 'page.distributions.lead'),

  Column: {
    Body: {
      GovStatRow: {
        state: {
          tiles: [
            { label: 'stat.dist.epochsClosed', to: 3, delta: 'RBX-001, SVP-003', tone: 'flat', revealDelay: '0s' },
            { label: 'stat.dist.distributed', to: 256.7, prefix: '$', suffix: 'K', decimals: 1, delta: 'stat.dist.distributed.delta', revealDelay: '.07s' },
            { label: 'stat.dist.unclaimed', to: 14.2, prefix: '$', suffix: 'K', decimals: 1, delta: 'stat.dist.unclaimed.delta', tone: 'flat', revealDelay: '.14s' },
            { label: 'stat.dist.nextEpoch', value: 'stat.dist.nextEpoch.value', delta: 'stat.dist.nextEpoch.delta', tone: 'flat', revealDelay: '.21s' }
          ]
        }
      },

      Panel: {
        state: { title: 'panel.dist.epochs.title', lead: 'panel.dist.epochs.lead' },
        DataTable: {
          state: {
            columns: ['table.epoch', 'table.asset', 'table.rate', 'table.eligibleTokens', 'table.total', 'table.status'],
            rows: [
              { cells: [{ text: 'epoch.n4', mono: true }, { text: 'RBX-001', mono: true }, { text: '$1.28', mono: true }, { text: '73,600', mono: true }, { text: '$94,208', mono: true }, { status: 'status.completed' }] },
              { cells: [{ text: 'epoch.n3', mono: true }, { text: 'RBX-001', mono: true }, { text: '$1.14', mono: true }, { text: '68,000', mono: true }, { text: '$77,520', mono: true }, { status: 'status.completed' }] },
              { cells: [{ text: 'epoch.n3', mono: true }, { text: 'SVP-003', mono: true }, { text: '$1.60', mono: true }, { text: '62,000', mono: true }, { text: '$99,200', mono: true }, { status: 'status.completed' }] },
              { cells: [{ text: 'epoch.n5', mono: true }, { text: 'RBX-001', mono: true }, { text: '—' }, { text: '—' }, { text: '—' }, { status: 'status.scheduled' }] }
            ]
          },
          GovEmptyState: {
            show: (el, s) => !((s.parent && s.parent.rows) || []).length,
            state: {
              title: 'empty.dist.title',
              caption: 'empty.dist.caption'
            }
          }
        },
        Actions: {
          flow: 'x',
          gap: 'Z',
          paddingTop: 'Z',
          // Georgian labels are longer than a phone row can hold.
          flexWrap: 'wrap',
          ActionButton: { text: '{{ action.createEpoch | polyglot }}' },
          ActionButton_1: { extends: 'ActionButton', state: { tone: 'secondary' }, text: '{{ action.runBatchPayout | polyglot }}' }
        }
      }
    }
  }
}
