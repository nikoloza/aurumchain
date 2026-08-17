export const roles = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Roles — Fractyco Governance' },
  onCreate: (el) =>
    el.call('openPage', '/roles', 'Roles', 'Database-side access control. A grant stays on the record until it is revoked.'),

  Column: {
    Body: {
      Panel: {
        state: { title: 'Role grants', lead: 'A revoked grant keeps its row, so the history stays readable.' },
        DataTable: {
          state: {
            columns: ['Account', 'Role', 'Granted by', 'Granted', 'Status'],
            rows: [
              { cells: [{ text: 'ops@fractyco.example' }, { text: 'super_admin' }, { text: 'bootstrap' }, { text: '2026-04-01', mono: true }, { status: 'Active' }] },
              { cells: [{ text: 'admin@fractyco.example' }, { text: 'admin' }, { text: 'ops@fractyco.example' }, { text: '2026-04-02', mono: true }, { status: 'Active' }] },
              { cells: [{ text: 'kyc@fractyco.example' }, { text: 'compliance_officer' }, { text: 'ops@fractyco.example' }, { text: '2026-04-02', mono: true }, { status: 'Active' }] },
              { cells: [{ text: 'contractor@example.com' }, { text: 'admin' }, { text: 'ops@fractyco.example' }, { text: '2026-05-11', mono: true }, { status: 'Revoked' }] }
            ]
          }
        },
        Actions: {
          flow: 'x',
          gap: 'Z',
          paddingTop: 'Z',
          ActionButton: { text: 'Grant a role' },
          ActionButton_1: { extends: 'ActionButton', state: { tone: 'secondary' }, text: 'Export' }
        }
      },

      EmptyNote: {
        state: {
          text: 'A role controls what the console may call. It does not grant an on-chain authority — those live on the program accounts.'
        }
      }
    }
  }
}
