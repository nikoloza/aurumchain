export const market = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Market — Fractyco Governance' },
  onCreate: (el) =>
    el.call('openPage', '/market', 'Market', 'The fee, the fee destination, and the pauses that stop resale.'),

  Column: {
    Body: {
      StatRow: {
        state: {
          tiles: [
            { label: 'Fee', value: '50 bps', delta: 'cap 200 bps', tone: 'flat' },
            { label: 'Fees collected', value: '$910', delta: '30 days' },
            { label: 'Open orders', value: '14', delta: 'across 3 assets', tone: 'flat' },
            { label: 'Paused projects', value: '1', delta: 'KGT-002', tone: 'down' }
          ]
        }
      },

      Panel: {
        state: { title: 'Market configuration', lead: 'update_market_config takes each field as an option, so a change touches one field only.' },
        DataTable: {
          state: {
            columns: ['Field', 'Value', 'Instruction'],
            rows: [
              { cells: [{ text: 'Fee basis points' }, { text: '50', mono: true }, { text: 'update_market_config', mono: true }] },
              { cells: [{ text: 'Fee destination' }, { text: '7STXs2…uSk4', mono: true }, { text: 'update_market_config', mono: true }] },
              { cells: [{ text: 'Market paused' }, { text: 'false', mono: true }, { text: 'update_market_config', mono: true }] },
              { cells: [{ text: 'Registry program' }, { text: 'DZBc…HxJN', mono: true }, { text: 'initialize_market', mono: true }] },
              { cells: [{ text: 'Compliance program' }, { text: 'BYg6…85V9', mono: true }, { text: 'initialize_market', mono: true }] }
            ]
          }
        }
      },

      Panel_1: {
        extends: 'Panel',
        state: { title: 'Per-project pause', lead: 'set_project_pause stops resale for one asset without stopping the market.' },
        DataTable: {
          state: {
            columns: ['Asset', 'Open orders', 'Reason', 'Status'],
            rows: [
              { cells: [{ text: 'RBX-001', mono: true }, { text: '2', mono: true }, { text: '—' }, { status: 'Active' }] },
              { cells: [{ text: 'KGT-002', mono: true }, { text: '1', mono: true }, { text: 'Operator review of the tailings assay' }, { status: 'Suspended' }] },
              { cells: [{ text: 'SVP-003', mono: true }, { text: '11', mono: true }, { text: '—' }, { status: 'Active' }] }
            ]
          }
        }
      }
    }
  }
}
