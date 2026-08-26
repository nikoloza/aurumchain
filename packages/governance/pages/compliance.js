export const compliance = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Compliance — Fractyco Governance' },
  onRender: (el) =>
    el.call('openPage', '/compliance', 'page.compliance.title', 'page.compliance.lead'),

  Column: {
    Body: {
      GovStatRow: {
        state: {
          tiles: [
            { label: 'stat.compliance.awaitingReview', to: 3, delta: 'stat.compliance.awaitingReview.delta', tone: 'flat', revealDelay: '0s' },
            { label: 'stat.compliance.approved30', to: 46, delta: 'stat.compliance.approved30.delta', revealDelay: '.07s' },
            { label: 'stat.compliance.rejected30', to: 5, delta: 'stat.compliance.rejected30.delta', tone: 'down', revealDelay: '.14s' },
            { label: 'stat.compliance.verifiedWallets', to: 212, delta: 'stat.compliance.verifiedWallets.delta', revealDelay: '.21s' }
          ]
        }
      },

      Panel: {
        state: { title: 'panel.compliance.queue.title', lead: 'panel.compliance.queue.lead' },
        DataTable: {
          state: {
            columns: ['table.account', 'table.providerRef', 'table.country', 'table.submitted', 'table.status'],
            rows: [
              { cells: [{ text: 'p.novak@example.com' }, { text: 'sms_9f31c2', mono: true }, { text: 'country.czechia' }, { text: '2026-08-13', mono: true }, { status: 'status.underReview' }] },
              { cells: [{ text: 'm.orozco@example.com' }, { text: 'sms_7b88d1', mono: true }, { text: 'country.mexico' }, { text: '2026-08-15', mono: true }, { status: 'status.pending' }] },
              { cells: [{ text: 'j.tanaka@example.com' }, { text: 'sms_2ac40e', mono: true }, { text: 'country.japan' }, { text: '2026-08-16', mono: true }, { status: 'status.pending' }] },
              { cells: [{ text: 'l.smith@example.com' }, { text: 'sms_1de77a', mono: true }, { text: 'country.unitedStates' }, { text: '2026-08-10', mono: true }, { status: 'status.rejected' }] }
            ]
          },
          GovEmptyState: {
            show: (el, s) => !((s.parent && s.parent.rows) || []).length,
            state: {
              title: 'empty.compliance.title',
              caption: 'empty.compliance.caption'
            }
          }
        }
      },

      Panel_1: {
        extends: 'Panel',
        state: { title: 'panel.compliance.switches.title', lead: 'panel.compliance.switches.lead' },
        List: {
          flow: 'y',
          width: '100%',
          childExtends: 'GovSwitchRow',
          childrenAs: 'state',
          children: [
            {
              label: 'switch.kycBypass.label',
              call: 'compliance_transfer.set_kyc_bypass',
              note: 'switch.kycBypass.note',
              status: 'common.off'
            },
            {
              label: 'switch.lockupBypass.label',
              call: 'compliance_transfer.toggle_lockup_bypass',
              note: 'switch.lockupBypass.note',
              status: 'common.off'
            },
            {
              label: 'switch.mintComplianceSync.label',
              call: 'compliance_transfer.sync_mint_compliance',
              note: 'switch.mintComplianceSync.note',
              status: 'status.active'
            }
          ]
        }
      }
    }
  }
}
