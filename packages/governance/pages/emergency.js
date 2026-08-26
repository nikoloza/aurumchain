export const emergency = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Emergency — Fractyco Governance' },
  onRender: (el) =>
    el.call('openPage', '/emergency', 'page.emergency.title', 'page.emergency.lead'),

  Column: {
    Body: {
      Panel: {
        state: {
          title: 'panel.emergency.global.title',
          lead: 'panel.emergency.global.lead'
        },
        List: {
          flow: 'y',
          width: '100%',
          childExtends: 'GovSwitchRow',
          childrenAs: 'state',
          children: [
            {
              label: 'switch.registryPause.label',
              call: 'project_registry.set_emergency_pause',
              note: 'switch.registryPause.note',
              status: 'common.off'
            },
            {
              label: 'switch.globalTransferPause.label',
              call: 'compliance_transfer.set_global_transfer_pause',
              note: 'switch.globalTransferPause.note',
              status: 'common.off'
            },
            {
              label: 'switch.marketPause.label',
              call: 'secondary_market.update_market_config',
              note: 'switch.marketPause.note',
              status: 'common.off'
            }
          ]
        }
      },

      EmptyNote: {
        state: {
          text: 'note.emergency'
        }
      }
    }
  }
}
