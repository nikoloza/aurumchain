// Root state for the governance dashboard.
//
// The rail is grouped by what an action changes, not by which screen it lives
// on: Control changes who holds an authority, Policy changes what the programs
// allow, Operations runs the queues, and Record is the append-only trail.
//
// The figures below stand in for the reads that replace them: the registry
// control account, the compliance config, the market config, user_roles, and
// audit_logs.
export default {
  // '' = follow the document default; the ThemeToggle writes 'light'/'dark'.
  themeMode: '',

  // ── Auth/session — driven by brand/functions/auth.js ─────────────────────
  signedIn: false,
  userEmail: '',
  userName: '',
  authLoading: false,
  authError: null,
  signinEmail: '',
  signinPassword: '',

  network: 'Devnet',
  wallet: 'gov · 7STXs2…uSk4',

  route: '/',
  pageTitle: 'Control plane',
  pageLead: 'Who holds which authority, and what is currently paused.',

  nav: [
    {
      title: 'Control',
      items: [
        { label: 'Control plane', icon: 'shield', path: '/' },
        { label: 'Authorities', icon: 'lock', path: '/authorities' },
        { label: 'Roles', icon: 'users', path: '/roles' },
        { label: 'Emergency', icon: 'alert', path: '/emergency' }
      ]
    },
    {
      title: 'Policy',
      items: [
        { label: 'Compliance', icon: 'shield', path: '/compliance' },
        { label: 'Market', icon: 'exchange', path: '/market' },
        { label: 'Projects', icon: 'layers', path: '/projects' }
      ]
    },
    {
      title: 'Operations',
      items: [
        { label: 'Subscriptions', icon: 'coins', path: '/subscriptions' },
        { label: 'Distributions', icon: 'receipt', path: '/distributions' },
        { label: 'Reconciliation', icon: 'chart', path: '/reconciliation' }
      ]
    },
    {
      title: 'Record',
      items: [{ label: 'Audit log', icon: 'audit', path: '/audit' }]
    }
  ]
}
