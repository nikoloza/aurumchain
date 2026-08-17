export const authorities = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Authorities — Fractyco Governance' },
  onCreate: (el) =>
    el.call('openPage', '/authorities', 'Authorities', 'Transfer an authority through the program. A key change is never a database edit.'),

  Column: {
    Body: {
      Grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'A',
        '@tabletL': { gridTemplateColumns: 'repeat(2, 1fr)' },
        '@mobileL': { gridTemplateColumns: '1fr' },

        childExtends: 'AuthorityCard',
        childrenAs: 'state',
        children: [
          {
            role: 'Super admin',
            holder: '7STXs2LXLimTiPBuvrcnE1u7vQFCw9GoCKmhs3QsuSk4',
            scope: 'Sets the KYC bypass, transfers any authority, revokes the mint.',
            limit: 'no operational limit',
            status: 'Active'
          },
          {
            role: 'Operational admin',
            holder: '4mNq8ZaWpKcHrTvBx2GdLeYs9UjRfXo1CvPnAiKtMbQe',
            scope: 'Creates projects, issues tokens, opens epochs, runs payouts.',
            limit: 'limit 250,000 tokens per action',
            status: 'Active'
          },
          {
            role: 'Compliance officer',
            holder: '2wXk6HqLmRtYvB9ZcNpJdFa4SgEu7oTiKrXbAyMnQfPd',
            scope: 'Approves identity, records verified wallets, revokes a wallet.',
            limit: 'no issuance rights',
            status: 'Active'
          },
          {
            role: 'Market authority',
            holder: '9RqVyvWA4ficqK351PoYh674mP1au4NmNzVM6LQcenjm',
            scope: 'Sets the market fee, the fee destination, and the project pause.',
            limit: 'fee capped at 200 bps',
            status: 'Active'
          },
          {
            role: 'Mint authority · RBX-001',
            holder: 'AJujcxZiQ1jUvSixiFLQNWFCpUtMuVsbyPCQ8ByU3jvf',
            scope: 'Issues tokens for this project only.',
            limit: 'revoke when the raise closes',
            status: 'Active'
          },
          {
            role: 'Mint authority · SVP-003',
            holder: '—',
            scope: 'Raise closed. Supply is now fixed.',
            limit: 'revoked 2026-06-30',
            status: 'Revoked'
          }
        ]
      },

      EmptyNote: {
        state: {
          text: 'transfer_authority takes a role flag and an optional new limit. The registry rejects a transfer from a caller that does not already hold the role.'
        }
      }
    }
  }
}
