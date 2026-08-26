export const identity = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Identity — Fractyco' },
  onRender: (el) =>
    el.call('openPage', '/identity', 'page.identity.title', 'page.identity.lead'),

  Column: {
    Body: {
      Split: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'A',
        alignItems: 'start',
        '@tabletL': { gridTemplateColumns: '1fr' },

        Panel: {
          state: { title: 'panel.verification.title', lead: 'panel.verification.lead' },
          DataTable: {
            state: {
              columns: ['table.field', 'table.value'],
              rows: [
                { cells: [{ text: 'cell.provider' }, { text: 'Sumsub' }] },
                { cells: [{ text: 'cell.level' }, { text: 'basic-kyc-level' }] },
                { cells: [{ text: 'cell.submitted' }, { text: '2026-07-02', mono: true }] },
                { cells: [{ text: 'cell.approved' }, { text: '2026-07-03', mono: true }] },
                { cells: [{ text: 'cell.expires' }, { text: '2027-07-03', mono: true }] }
              ]
            }
          }
        },

        Panel_1: {
          extends: 'Panel',
          state: { title: 'panel.permissions.title', lead: 'panel.permissions.lead' },
          Flags: {
            flow: 'y',
            width: '100%',
            childExtends: 'FlagRow',
            childrenAs: 'state',
            children: [
              { text: 'flag.canInvest', status: 'status.approved' },
              { text: 'flag.canWithdraw', status: 'status.approved' },
              { text: 'flag.canReceivePayouts', status: 'status.approved' },
              { text: 'flag.lockup', status: 'status.completed' }
            ]
          }
        }
      }
    }
  }
}
