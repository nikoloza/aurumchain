export const audit = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Audit log — Fractyco Governance' },
  onCreate: (el) =>
    el.call('openPage', '/audit', 'Audit log', 'Append-only. No page in this console can update or delete a row here.'),

  Column: {
    Body: {
      Panel: {
        state: { title: 'Recent events', lead: 'Every row carries the actor, the role, and the before and after state.' },
        DataTable: {
          state: {
            columns: ['Time', 'Event', 'Subject', 'Actor', 'Role'],
            rows: [
              { cells: [{ text: '2026-08-17 09:41', mono: true }, { text: 'payout_completed' }, { text: 'epoch 4 · RBX-001', mono: true }, { text: 'admin@fractyco.example' }, { text: 'admin' }] },
              { cells: [{ text: '2026-08-17 08:12', mono: true }, { text: 'kyc_approved' }, { text: 'a.kovacs@example.com' }, { text: 'kyc@fractyco.example' }, { text: 'compliance_officer' }] },
              { cells: [{ text: '2026-08-16 17:55', mono: true }, { text: 'eligibility_changed' }, { text: 'registered → investment_eligible', mono: true }, { text: 'system' }, { text: 'user' }] },
              { cells: [{ text: '2026-08-16 11:03', mono: true }, { text: 'wallet_verified' }, { text: '7cR…1nP', mono: true }, { text: 'kyc@fractyco.example' }, { text: 'compliance_officer' }] },
              { cells: [{ text: '2026-08-15 14:20', mono: true }, { text: 'admin_action' }, { text: 'set_project_pause · KGT-002', mono: true }, { text: 'ops@fractyco.example' }, { text: 'super_admin' }] },
              { cells: [{ text: '2026-08-14 10:08', mono: true }, { text: 'investment_completed' }, { text: 'sub 4471 · $8,000', mono: true }, { text: 'admin@fractyco.example' }, { text: 'admin' }] }
            ]
          }
        }
      },

      EmptyNote: {
        state: {
          text: 'The table takes inserts only. Read access is limited to the account itself, and to the admin and super-admin roles.'
        }
      }
    }
  }
}
