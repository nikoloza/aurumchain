export const authorities = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Authorities — Fractyco Governance' },
  onRender: (el) =>
    el.call('openPage', '/authorities', 'page.authorities.title', 'page.authorities.lead'),

  Column: {
    Body: {
      Grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'A',
        '@tabletL': { gridTemplateColumns: 'repeat(2, 1fr)' },
        '@mobileL': { gridTemplateColumns: '1fr' },

        // Armed like GovStatRow — the flip staggers the cards' reveal.
        scope: {},
        state: { inView: false },
        onRender: (el, s) => {
          const win = el.node && el.node.ownerDocument.defaultView
          if (win && !el.scope.armed) {
            el.scope.armed = true
            win.setTimeout(() => s.update({ inView: true }, { preventFetch: true }), 180)
          }
        },

        childExtends: 'GovAuthorityCard',
        childrenAs: 'state',
        children: [
          {
            revealDelay: '0s',
            role: 'authority.superAdmin.role',
            holder: '7STXs2LXLimTiPBuvrcnE1u7vQFCw9GoCKmhs3QsuSk4',
            scope: 'authority.superAdmin.scope',
            limit: 'authority.superAdmin.limit',
            status: 'status.active'
          },
          {
            revealDelay: '.07s',
            role: 'authority.operationalAdmin.role',
            holder: '4mNq8ZaWpKcHrTvBx2GdLeYs9UjRfXo1CvPnAiKtMbQe',
            scope: 'authority.operationalAdmin.scope',
            limit: 'authority.operationalAdmin.limit',
            status: 'status.active'
          },
          {
            revealDelay: '.14s',
            role: 'authority.complianceOfficer.role',
            holder: '2wXk6HqLmRtYvB9ZcNpJdFa4SgEu7oTiKrXbAyMnQfPd',
            scope: 'authority.complianceOfficer.scope',
            limit: 'authority.complianceOfficer.limit',
            status: 'status.active'
          },
          {
            revealDelay: '.21s',
            role: 'authority.marketAuthority.role',
            holder: '9RqVyvWA4ficqK351PoYh674mP1au4NmNzVM6LQcenjm',
            scope: 'authority.marketAuthority.scope',
            limit: 'authority.marketAuthority.limit',
            status: 'status.active'
          },
          {
            revealDelay: '.28s',
            role: 'authority.mintRbx.role',
            holder: 'AJujcxZiQ1jUvSixiFLQNWFCpUtMuVsbyPCQ8ByU3jvf',
            scope: 'authority.mintRbx.scope',
            limit: 'authority.mintRbx.limit',
            status: 'status.active'
          },
          {
            revealDelay: '.35s',
            role: 'authority.mintSvp.role',
            holder: '—',
            scope: 'authority.mintSvp.scope',
            limit: 'authority.mintSvp.limit',
            status: 'status.revoked'
          }
        ]
      },

      EmptyNote: {
        state: {
          text: 'note.authorities'
        }
      }
    }
  }
}
