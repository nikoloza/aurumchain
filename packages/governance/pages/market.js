export const market = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Market — Fractyco Governance' },
  onRender: (el) =>
    el.call('openPage', '/market', 'page.market.title', 'page.market.lead'),

  Column: {
    Body: {
      GovStatRow: {
        state: {
          tiles: [
            { label: 'stat.market.fee', to: 50, suffix: ' bps', delta: 'stat.market.fee.delta', tone: 'flat', revealDelay: '0s' },
            { label: 'stat.market.feesCollected', to: 910, prefix: '$', delta: 'stat.market.feesCollected.delta', revealDelay: '.07s' },
            { label: 'stat.market.openOrders', to: 14, delta: 'stat.market.openOrders.delta', tone: 'flat', revealDelay: '.14s' },
            { label: 'stat.market.pausedProjects', to: 1, delta: 'KGT-002', tone: 'down', revealDelay: '.21s' }
          ]
        }
      },

      Panel: {
        state: { title: 'panel.market.config.title', lead: 'panel.market.config.lead' },
        DataTable: {
          state: {
            columns: ['table.field', 'table.value', 'table.instruction'],
            rows: [
              { cells: [{ text: 'field.feeBps' }, { text: '50', mono: true }, { text: 'update_market_config', mono: true }] },
              { cells: [{ text: 'field.feeDestination' }, { text: '7STXs2…uSk4', mono: true }, { text: 'update_market_config', mono: true }] },
              { cells: [{ text: 'field.marketPaused' }, { text: 'false', mono: true }, { text: 'update_market_config', mono: true }] },
              { cells: [{ text: 'field.registryProgram' }, { text: 'DZBc…HxJN', mono: true }, { text: 'initialize_market', mono: true }] },
              { cells: [{ text: 'field.complianceProgram' }, { text: 'BYg6…85V9', mono: true }, { text: 'initialize_market', mono: true }] }
            ]
          }
        }
      },

      Panel_1: {
        extends: 'Panel',
        state: { title: 'panel.market.projectPause.title', lead: 'panel.market.projectPause.lead' },
        DataTable: {
          state: {
            columns: ['table.asset', 'table.openOrders', 'table.reason', 'table.status'],
            rows: [
              { cells: [{ text: 'RBX-001', mono: true }, { text: '2', mono: true }, { text: '—' }, { status: 'status.active' }] },
              { cells: [{ text: 'KGT-002', mono: true }, { text: '1', mono: true }, { text: 'cell.kgtPauseReason' }, { status: 'status.suspended' }] },
              { cells: [{ text: 'SVP-003', mono: true }, { text: '11', mono: true }, { text: '—' }, { status: 'status.active' }] }
            ]
          }
        }
      }
    }
  }
}
