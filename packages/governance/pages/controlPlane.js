export const controlPlane = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Control plane — Fractyco Governance' },
  onRender: (el) =>
    el.call('openPage', '/', 'Control plane', 'Who holds which authority, and what is currently paused.'),

  Column: {
    Body: {
      GovStatRow: {
        state: {
          tiles: [
            { label: 'Programs live', to: 4, delta: 'devnet', tone: 'flat', revealDelay: '0s' },
            { label: 'Active pauses', to: 1, delta: 'KGT-002 transfers', tone: 'down', revealDelay: '.07s' },
            { label: 'Pending approvals', to: 7, delta: '3 compliance, 4 subscriptions', tone: 'flat', revealDelay: '.14s' },
            { label: 'Audit rows, 24h', to: 128, delta: 'append-only', revealDelay: '.21s' }
          ]
        }
      },

      Split: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'A',
        '@tabletL': { gridTemplateColumns: '1fr' },

        Panel: {
          state: {
            title: 'Program health',
            lead: 'Each program owns one authority. No program duplicates another one’s.'
          },
          DataTable: {
            state: {
              columns: ['Program', 'Address', 'Paused', 'Status'],
              rows: [
                { cells: [{ text: 'project_registry', mono: true }, { text: 'DZBc…HxJN', mono: true }, { text: 'no' }, { status: 'Active' }] },
                { cells: [{ text: 'compliance_transfer', mono: true }, { text: 'BYg6…85V9', mono: true }, { text: 'no' }, { status: 'Active' }] },
                { cells: [{ text: 'allocation_distribution', mono: true }, { text: 'EZXJ…zkTz', mono: true }, { text: 'no' }, { status: 'Active' }] },
                { cells: [{ text: 'secondary_market', mono: true }, { text: '8sQe…Lo6c', mono: true }, { text: 'per project' }, { status: 'Active' }] }
              ]
            }
          }
        },

        Panel_1: {
          extends: 'Panel',
          state: { title: 'Open items', lead: 'Actions waiting on an authority holder.' },
          DataTable: {
            state: {
              columns: ['Queue', 'Waiting', 'Oldest', 'Owner'],
              rows: [
                { cells: [{ text: 'Compliance review' }, { text: '3', mono: true }, { text: '4 days', mono: true }, { text: 'compliance_officer' }] },
                { cells: [{ text: 'Subscription settlement' }, { text: '4', mono: true }, { text: '2 days', mono: true }, { text: 'admin' }] },
                { cells: [{ text: 'Epoch 5 creation' }, { text: '1', mono: true }, { text: '—' }, { text: 'admin' }] },
                { cells: [{ text: 'Mint authority revocation' }, { text: '1', mono: true }, { text: '9 days', mono: true }, { text: 'super_admin' }] }
              ]
            },
            GovEmptyState: {
              show: (el, s) => !(s.rows || []).length,
              state: {
                title: 'Nothing waiting',
                caption: 'Every queue is drained. New items land here the moment an action needs an authority holder.'
              }
            }
          }
        }
      }
    }
  }
}
