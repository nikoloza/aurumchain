export const compliance = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Compliance — Fractyco Governance' },
  onCreate: (el) =>
    el.call('openPage', '/compliance', 'Compliance', 'Identity decisions, wallet records, and the rules the transfer hook reads.'),

  Column: {
    Body: {
      StatRow: {
        state: {
          tiles: [
            { label: 'Awaiting review', value: '3', delta: 'oldest 4 days', tone: 'flat' },
            { label: 'Approved, 30 days', value: '46', delta: '+12 on last month' },
            { label: 'Rejected, 30 days', value: '5', delta: '9.8% of decisions', tone: 'down' },
            { label: 'Verified wallets', value: '212', delta: 'on-chain records' }
          ]
        }
      },

      Panel: {
        state: { title: 'Review queue', lead: 'An approval writes the eligibility record and records the wallet on-chain.' },
        DataTable: {
          state: {
            columns: ['Account', 'Provider ref', 'Country', 'Submitted', 'Status'],
            rows: [
              { cells: [{ text: 'a.kovacs@example.com' }, { text: 'sms_9f31c2', mono: true }, { text: 'Hungary' }, { text: '2026-08-13', mono: true }, { status: 'Under review' }] },
              { cells: [{ text: 'm.orozco@example.com' }, { text: 'sms_7b88d1', mono: true }, { text: 'Mexico' }, { text: '2026-08-15', mono: true }, { status: 'Pending' }] },
              { cells: [{ text: 'j.tanaka@example.com' }, { text: 'sms_2ac40e', mono: true }, { text: 'Japan' }, { text: '2026-08-16', mono: true }, { status: 'Pending' }] },
              { cells: [{ text: 'l.smith@example.com' }, { text: 'sms_1de77a', mono: true }, { text: 'United States' }, { text: '2026-08-10', mono: true }, { status: 'Rejected' }] }
            ]
          }
        }
      },

      Panel_1: {
        extends: 'Panel',
        state: { title: 'Policy switches', lead: 'Each switch maps to one instruction on the compliance program.' },
        List: {
          flow: 'y',
          width: '100%',
          childExtends: 'SwitchRow',
          childrenAs: 'state',
          children: [
            {
              label: 'KYC bypass',
              call: 'compliance_transfer.set_kyc_bypass',
              note: 'Testing only. Lets an unverified wallet receive tokens. Super admin, with a nonce.',
              status: 'Revoked'
            },
            {
              label: 'Lockup bypass',
              call: 'compliance_transfer.toggle_lockup_bypass',
              note: 'Allows a transfer inside the lockup window for a named wallet.',
              status: 'Revoked'
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
