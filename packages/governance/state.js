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
  // Active locale. The polyglot plugin re-reads the stored choice on boot and
  // `setLang` (the LangSwitch) writes it — declared here so it is reactive.
  lang: 'en',

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
  // routeSoft (brand) raises this while the old page dips out.
  pageLeave: false,
  pageTitle: 'page.controlPlane.title',
  pageLead: 'page.controlPlane.lead',

  nav: [
    {
      title: 'nav.group.control',
      items: [
        { label: 'nav.controlPlane', icon: 'shield', path: '/' },
        { label: 'nav.authorities', icon: 'lock', path: '/authorities' },
        { label: 'nav.roles', icon: 'users', path: '/roles' },
        { label: 'nav.emergency', icon: 'alert', path: '/emergency' }
      ]
    },
    {
      title: 'nav.group.policy',
      items: [
        { label: 'nav.compliance', icon: 'shield', path: '/compliance' },
        { label: 'nav.market', icon: 'exchange', path: '/market' },
        { label: 'nav.projects', icon: 'layers', path: '/projects' }
      ]
    },
    {
      title: 'nav.group.operations',
      items: [
        { label: 'nav.subscriptions', icon: 'coins', path: '/subscriptions' },
        { label: 'nav.distributions', icon: 'receipt', path: '/distributions' },
        { label: 'nav.reconciliation', icon: 'chart', path: '/reconciliation' }
      ]
    },
    {
      title: 'nav.group.record',
      items: [{ label: 'nav.auditLog', icon: 'audit', path: '/audit' }]
    }
  ]
}
