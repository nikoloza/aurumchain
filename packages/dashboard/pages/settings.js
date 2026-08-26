export const settings = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Settings — Fractyco' },
  onRender: (el) =>
    el.call('openPage', '/settings', 'page.settings.title', 'page.settings.lead'),

  Column: {
    Body: {
      Panel: {
        state: { title: 'panel.profile.title', lead: 'panel.profile.lead' },
        DataTable: {
          state: {
            columns: ['table.field', 'table.value'],
            rows: [
              { cells: [{ text: 'auth.email' }, { session: 'email' }] },
              { cells: [{ text: 'cell.country' }, { text: 'cell.georgia' }] },
              { cells: [{ text: 'cell.timezone' }, { text: 'Asia/Tbilisi' }] },
              { cells: [{ text: 'cell.memberSince' }, { text: '2026-07-02', mono: true }] }
            ]
          }
        }
      },

      Panel_1: {
        extends: 'Panel',
        state: { title: 'common.network', lead: 'panel.network.lead' },
        DataTable: {
          state: {
            columns: ['table.field', 'table.value'],
            rows: [
              { cells: [{ text: 'cell.cluster' }, { text: 'devnet' }] },
              { cells: [{ text: 'cell.settlementAsset' }, { text: 'USDC', mono: true }] },
              { cells: [{ text: 'cell.registryProgram' }, { text: 'DZBc…HxJN', mono: true }] },
              { cells: [{ text: 'cell.complianceProgram' }, { text: 'BYg6…85V9', mono: true }] }
            ]
          }
        }
      }
    }
  }
}
