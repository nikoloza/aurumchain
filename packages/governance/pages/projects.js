export const projects = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Projects — Fractyco Governance' },
  onRender: (el) => {
    el.call('openPage', '/projects', 'page.projects.title', 'page.projects.lead')
    el.call('loadRegistry')
  },

  Column: {
    Body: {
      Panel: {
        state: { title: 'panel.projects.registry.title', lead: 'panel.projects.registry.lead' },
        DataTable: {
          state: {
            columns: ['table.asset', 'table.mint', 'table.issued', 'table.cap', 'table.paused', 'table.status']
          },
          // Live registry rows; the illustrative set only renders while the
          // backend has no visible projects.
          SkeletonRows: {
            flow: 'y',
            gap: 'Y',
            padding: 'Z 0',
            show: (el, s) => !s.root.backendRegistryLoaded,
            childExtends: 'Skeleton',
            childrenAs: 'state',
            children: [{ h: 'B' }, { h: 'B' }, { h: 'B' }]
          },
          Rows: {
            show: (el, s) => !!s.root.backendRegistryLoaded,
            children: (el, s) =>
              (s.root.backendRegistry && s.root.backendRegistry.length)
                ? s.root.backendRegistry
                : [
                    { cells: [{ text: 'RBX-001', mono: true }, { text: 'AJuj…3jvf', mono: true }, { text: '73,600', mono: true }, { text: '96,000', mono: true }, { text: '—' }, { status: 'status.funding' }] },
                    { cells: [{ text: 'KGT-002', mono: true }, { text: 'Es9v…nNYB', mono: true }, { text: '62,000', mono: true }, { text: '150,000', mono: true }, { text: '—' }, { status: 'status.funding' }] },
                    { cells: [{ text: 'SVP-003', mono: true }, { text: '9RqV…enjm', mono: true }, { text: '62,000', mono: true }, { text: '62,000', mono: true }, { text: '—' }, { status: 'status.completed' }] }
                  ]
          }
        }
      },

      Panel_1: {
        extends: 'Panel',
        state: { title: 'panel.projects.supply.title', lead: 'panel.projects.supply.lead' },
        List: {
          flow: 'y',
          width: '100%',
          childExtends: 'GovSwitchRow',
          childrenAs: 'state',
          children: [
            {
              label: 'switch.resetRound.label',
              call: 'project_registry.reset_round',
              note: 'switch.resetRound.note',
              status: 'status.active'
            },
            {
              label: 'switch.revokeMint.label',
              call: 'project_registry.revoke_mint_authority',
              note: 'switch.revokeMint.note',
              status: 'status.pending'
            },
            {
              label: 'switch.burnTokens.label',
              call: 'project_registry.burn_tokens',
              note: 'switch.burnTokens.note',
              status: 'status.active'
            }
          ]
        }
      }
    }
  }
}
