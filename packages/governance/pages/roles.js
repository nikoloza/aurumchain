export const roles = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Roles — Fractyco Governance' },
  onRender: (el) =>
    el.call('openPage', '/roles', 'page.roles.title', 'page.roles.lead'),

  Column: {
    Body: {
      Panel: {
        state: { title: 'panel.roles.grants.title', lead: 'panel.roles.grants.lead' },
        DataTable: {
          state: {
            columns: ['table.account', 'table.role', 'table.grantedBy', 'table.granted', 'table.status'],
            rows: [
              { cells: [{ text: 'ops@fractyco.example' }, { text: 'super_admin' }, { text: 'bootstrap' }, { text: '2026-04-01', mono: true }, { status: 'status.active' }] },
              { cells: [{ text: 'admin@fractyco.example' }, { text: 'admin' }, { text: 'ops@fractyco.example' }, { text: '2026-04-02', mono: true }, { status: 'status.active' }] },
              { cells: [{ text: 'kyc@fractyco.example' }, { text: 'compliance_officer' }, { text: 'ops@fractyco.example' }, { text: '2026-04-02', mono: true }, { status: 'status.active' }] },
              { cells: [{ text: 'contractor@example.com' }, { text: 'admin' }, { text: 'ops@fractyco.example' }, { text: '2026-05-11', mono: true }, { status: 'status.revoked' }] }
            ]
          }
        },
        Actions: {
          flow: 'x',
          gap: 'Z',
          paddingTop: 'Z',
          ActionButton: { text: '{{ action.grantRole | polyglot }}' },
          ActionButton_1: { extends: 'ActionButton', state: { tone: 'secondary' }, text: '{{ action.export | polyglot }}' }
        }
      },

      EmptyNote: {
        state: {
          text: 'note.roles'
        }
      }
    }
  }
}
