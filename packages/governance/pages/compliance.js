export const compliance = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Compliance — Fractyco Governance' },
  onRender: (el) =>
    el.call('openPage', '/compliance', 'Compliance', 'Identity decisions, wallet records, and the rules the transfer hook reads.'),

  Column: {
    Body: {
      GovStatRow: {
        state: {
          tiles: [
            { label: 'Awaiting review', to: 3, delta: 'oldest 4 days', tone: 'flat', revealDelay: '0s' },
            { label: 'Approved, 30 days', to: 46, delta: '+12 on last month', revealDelay: '.07s' },
            { label: 'Rejected, 30 days', to: 5, delta: '9.8% of decisions', tone: 'down', revealDelay: '.14s' },
            { label: 'Verified wallets', to: 212, delta: 'on-chain records', revealDelay: '.21s' }
          ]
        }
      },

      Panel: {
        state: { title: 'Review queue', lead: 'An approval writes the eligibility record and records the wallet on-chain.' },
        DataTable: {
          state: {
            columns: ['Account', 'Provider ref', 'Country', 'Submitted', 'Status'],
            rows: [
              { cells: [{ text: 'p.novak@example.com' }, { text: 'sms_9f31c2', mono: true }, { text: 'Czechia' }, { text: '2026-08-13', mono: true }, { status: 'Under review' }] },
              { cells: [{ text: 'm.orozco@example.com' }, { text: 'sms_7b88d1', mono: true }, { text: 'Mexico' }, { text: '2026-08-15', mono: true }, { status: 'Pending' }] },
              { cells: [{ text: 'j.tanaka@example.com' }, { text: 'sms_2ac40e', mono: true }, { text: 'Japan' }, { text: '2026-08-16', mono: true }, { status: 'Pending' }] },
              { cells: [{ text: 'l.smith@example.com' }, { text: 'sms_1de77a', mono: true }, { text: 'United States' }, { text: '2026-08-10', mono: true }, { status: 'Rejected' }] }
            ]
          },
          GovEmptyState: {
            show: (el, s) => !((s.parent && s.parent.rows) || []).length,
            state: {
              title: 'Queue is clear',
              caption: 'Every submitted identity has a decision. New submissions land here first.'
            }
          }
        }
      },

      Panel_1: {
        extends: 'Panel',
        state: { title: 'Policy switches', lead: 'Each switch maps to one instruction on the compliance program.' },
        List: {
          flow: 'y',
          width: '100%',
          childExtends: 'GovSwitchRow',
          childrenAs: 'state',
          children: [
            {
              label: 'KYC bypass',
              call: 'compliance_transfer.set_kyc_bypass',
              note: 'Testing only. Lets an unverified wallet receive tokens. Super admin, with a nonce.',
              status: 'Off'
            },
            {
              label: 'Lockup bypass',
              call: 'compliance_transfer.toggle_lockup_bypass',
              note: 'Allows a transfer inside the lockup window for a named wallet.',
              status: 'Off'
            },
            {
              label: 'Mint compliance sync',
              call: 'compliance_transfer.sync_mint_compliance',
              note: 'Pulls the project pause and the lockup end from the registry into the mint record.',
              status: 'Active'
            }
          ]
        }
      }
    }
  }
}
