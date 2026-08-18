export const emergency = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Emergency — Fractyco Governance' },
  onRender: (el) =>
    el.call('openPage', '/emergency', 'Emergency', 'Stop the system. Each switch takes effect on the next transaction.'),

  Column: {
    Body: {
      Panel: {
        state: {
          title: 'Global switches',
          lead: 'The widest blast radius on the platform. Two of them need the super admin.'
        },
        List: {
          flow: 'y',
          width: '100%',
          childExtends: 'SwitchRow',
          childrenAs: 'state',
          children: [
            {
              label: 'Registry emergency pause',
              call: 'project_registry.set_emergency_pause',
              note: 'Blocks issuance and status changes across every project.',
              status: 'Off'
            },
            {
              label: 'Global transfer pause',
              call: 'compliance_transfer.set_global_transfer_pause',
              note: 'The transfer hook rejects every move while this is on.',
              status: 'Off'
            },
            {
              label: 'Market pause',
              call: 'secondary_market.update_market_config',
              note: 'Stops new sell orders and fills. Cancels stay open.',
              status: 'Off'
            }
          ]
        }
      },

      EmptyNote: {
        state: {
          text: 'A pause is not a rollback. Transactions already confirmed stay confirmed, and the audit trail keeps them.'
        }
      }
    }
  }
}
