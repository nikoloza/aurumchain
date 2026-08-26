// Root state for the investor application.
//
// Copy on this state is stored as TRANSLATION KEYS, not English — the rail,
// the topbar, and the page head all resolve them through polyglot.
//
// `nav` drives the left rail. `route`, `pageTitle`, and `pageLead` are set by
// each page in its onCreate, so the topbar and the active rail entry follow the
// router without a second source of truth.
//
// The demo figures below stand in for the Supabase reads that replace them:
// portfolio_positions, investments, payout_records, and secondary_listings.
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
  wallet: '7STXs2…uSk4',

  // ── Transient app notice — raised by appNotify, rendered by AppToast ─────
  appNotice: '',
  appNoticeOn: false,
  appNoticeSeq: 0,

  route: '/',
  // routeSoft (brand) raises this while the old page dips out.
  pageLeave: false,
  pageTitle: 'page.overview.title',
  pageLead: 'page.overview.lead',

  nav: [
    {
      title: 'nav.group.invest',
      items: [
        { label: 'nav.overview', icon: 'chart', path: '/' },
        { label: 'nav.offerings', icon: 'layers', path: '/offerings' },
        { label: 'nav.portfolio', icon: 'coins', path: '/portfolio' },
        { label: 'nav.marketplace', icon: 'exchange', path: '/marketplace' }
      ]
    },
    {
      title: 'nav.group.money',
      items: [
        { label: 'nav.payouts', icon: 'receipt', path: '/payouts' },
        { label: 'nav.transactions', icon: 'document', path: '/transactions' },
        { label: 'nav.wallet', icon: 'wallet', path: '/wallet' }
      ]
    },
    {
      title: 'nav.group.account',
      items: [
        { label: 'nav.identity', icon: 'shield', path: '/identity' },
        { label: 'nav.settings', icon: 'cog', path: '/settings' }
      ]
    }
  ]
}
