export const controlPlane = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Control plane — Fractyco Governance' },
  onRender: (el) =>
    el.call('openPage', '/', 'page.controlPlane.title', 'page.controlPlane.lead'),

  Column: {
    Body: {
      GovStatRow: {
        state: {
          tiles: [
            { label: 'stat.control.programsLive', to: 4, delta: 'devnet', tone: 'flat', revealDelay: '0s' },
            { label: 'stat.control.activePauses', to: 1, delta: 'stat.control.activePauses.delta', tone: 'down', revealDelay: '.07s' },
            { label: 'stat.control.pendingApprovals', to: 7, delta: 'stat.control.pendingApprovals.delta', tone: 'flat', revealDelay: '.14s' },
            { label: 'stat.control.auditRows24h', to: 128, delta: 'stat.control.auditRows24h.delta', revealDelay: '.21s' }
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
            title: 'panel.control.health.title',
            lead: 'panel.control.health.lead'
          },
          DataTable: {
            state: {
              columns: ['table.program', 'table.address', 'table.paused', 'table.status'],
              rows: [
                { cells: [{ text: 'project_registry', mono: true }, { text: 'DZBc…HxJN', mono: true }, { text: 'cell.no' }, { status: 'status.active' }] },
                { cells: [{ text: 'compliance_transfer', mono: true }, { text: 'BYg6…85V9', mono: true }, { text: 'cell.no' }, { status: 'status.active' }] },
                { cells: [{ text: 'allocation_distribution', mono: true }, { text: 'EZXJ…zkTz', mono: true }, { text: 'cell.no' }, { status: 'status.active' }] },
                { cells: [{ text: 'secondary_market', mono: true }, { text: '8sQe…Lo6c', mono: true }, { text: 'cell.perProject' }, { status: 'status.active' }] }
              ]
            }
          }
        },

        Panel_1: {
          extends: 'Panel',
          state: { title: 'panel.control.openItems.title', lead: 'panel.control.openItems.lead' },
          DataTable: {
            state: {
              columns: ['table.queue', 'table.waiting', 'table.oldest', 'table.owner'],
              rows: [
                { cells: [{ text: 'queue.complianceReview' }, { text: '3', mono: true }, { text: 'age.days4', mono: true }, { text: 'compliance_officer' }] },
                { cells: [{ text: 'queue.subscriptionSettlement' }, { text: '4', mono: true }, { text: 'age.days2', mono: true }, { text: 'admin' }] },
                { cells: [{ text: 'queue.epochCreation' }, { text: '1', mono: true }, { text: '—' }, { text: 'admin' }] },
                { cells: [{ text: 'queue.mintRevocation' }, { text: '1', mono: true }, { text: 'age.days9', mono: true }, { text: 'super_admin' }] }
              ]
            },
            GovEmptyState: {
              show: (el, s) => !((s.parent && s.parent.rows) || []).length,
              state: {
                title: 'empty.control.title',
                caption: 'empty.control.caption'
              }
            }
          }
        }
      }
    }
  }
}
