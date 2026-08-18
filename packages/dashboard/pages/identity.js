export const identity = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Identity — Fractyco' },
  onRender: (el) =>
    el.call('openPage', '/identity', 'Identity', 'The eligibility record is the single source of truth for what this account may do.'),

  Column: {
    Body: {
      Split: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'A',
        '@tabletL': { gridTemplateColumns: '1fr' },

        Panel: {
          state: { title: 'Verification', lead: 'Handled by the identity provider, mirrored into the KYC profile.' },
          DataTable: {
            state: {
              columns: ['Field', 'Value'],
              rows: [
                { cells: [{ text: 'Provider' }, { text: 'Sumsub' }] },
                { cells: [{ text: 'Level' }, { text: 'basic-kyc-level' }] },
                { cells: [{ text: 'Submitted' }, { text: '2026-07-02', mono: true }] },
                { cells: [{ text: 'Approved' }, { text: '2026-07-03', mono: true }] },
                { cells: [{ text: 'Expires' }, { text: '2027-07-03', mono: true }] }
              ]
            }
          }
        },

        Panel_1: {
          extends: 'Panel',
          state: { title: 'Permissions', lead: 'Derived from the eligibility state and cached as flags.' },
          Flags: {
            flow: 'y',
            gap: 'Z',
            Invest: { flow: 'x', align: 'center space-between', K: { tag: 'span', fontSize: 'Z', color: 'paragraph', text: 'Can invest' }, StatusPill: { state: { status: 'Approved' } } },
            Withdraw: { flow: 'x', align: 'center space-between', K: { tag: 'span', fontSize: 'Z', color: 'paragraph', text: 'Can withdraw' }, StatusPill: { state: { status: 'Approved' } } },
            Payout: { flow: 'x', align: 'center space-between', K: { tag: 'span', fontSize: 'Z', color: 'paragraph', text: 'Can receive payouts' }, StatusPill: { state: { status: 'Approved' } } },
            Transfer: { flow: 'x', align: 'center space-between', K: { tag: 'span', fontSize: 'Z', color: 'paragraph', text: 'Lockup' }, StatusPill: { state: { status: 'Completed' } } }
          }
        }
      }
    }
  }
}
