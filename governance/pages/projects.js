export const projects = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Projects — Fractyco Governance' },
  onRender: (el) => {
    el.call('openPage', '/projects', 'Projects', 'Supply, status, and the mint authority for each asset in the registry.')
    el.call('loadRegistry')
  },

  Column: {
    Body: {
      Panel: {
        state: { title: 'Registry', lead: 'A status transition out of Completed or Canceled is rejected by the program.' },
        DataTable: {
          state: {
            columns: ['Asset', 'Mint', 'Issued', 'Cap', 'Paused', 'Status']
          },
          // Live registry rows; the illustrative set only renders while the
          // backend has no visible projects.
          Rows: {
            children: (el, s) =>
              (s.root.backendRegistry && s.root.backendRegistry.length)
                ? s.root.backendRegistry
                : [
                    { cells: [{ text: 'RBX-001', mono: true }, { text: 'AJuj…3jvf', mono: true }, { text: '73,600', mono: true }, { text: '96,000', mono: true }, { text: '—' }, { status: 'Funding' }] },
                    { cells: [{ text: 'KGT-002', mono: true }, { text: 'Es9v…nNYB', mono: true }, { text: '62,000', mono: true }, { text: '150,000', mono: true }, { text: '—' }, { status: 'Funding' }] },
                    { cells: [{ text: 'SVP-003', mono: true }, { text: '9RqV…enjm', mono: true }, { text: '62,000', mono: true }, { text: '62,000', mono: true }, { text: '—' }, { status: 'Completed' }] }
                  ]
          }
        }
      },

      Panel_1: {
        extends: 'Panel',
        state: { title: 'Supply actions', lead: 'Each action is one registry instruction and one audit row.' },
        List: {
          flow: 'y',
          width: '100%',
          childExtends: 'SwitchRow',
          childrenAs: 'state',
          children: [
            {
              label: 'Open the next round',
              call: 'project_registry.reset_round',
              note: 'Resets the round counter and optionally sets a new round cap.',
              status: 'Active'
            },
            {
              label: 'Revoke the mint authority',
              call: 'project_registry.revoke_mint_authority',
              note: 'Fixes supply for good. Irreversible, and it needs the super admin.',
              status: 'Pending'
            },
            {
              label: 'Burn tokens',
              call: 'project_registry.burn_tokens',
              note: 'Takes a reason code and an audit hash, so the burn is explainable later.',
              status: 'Active'
            }
          ]
        }
      }
    }
  }
}
