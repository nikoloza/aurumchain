// Root state for the investor application.
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
  pageTitle: 'Overview',
  pageLead: 'Your positions, payouts, and open subscriptions.',

  nav: [
    {
      title: 'Invest',
      items: [
        { label: 'Overview', icon: 'chart', path: '/' },
        { label: 'Offerings', icon: 'layers', path: '/offerings' },
        { label: 'Portfolio', icon: 'coins', path: '/portfolio' },
        { label: 'Marketplace', icon: 'exchange', path: '/marketplace' }
      ]
    },
    {
      title: 'Money',
      items: [
        { label: 'Payouts', icon: 'receipt', path: '/payouts' },
        { label: 'Transactions', icon: 'document', path: '/transactions' },
        { label: 'Wallet', icon: 'wallet', path: '/wallet' }
      ]
    },
    {
      title: 'Account',
      items: [
        { label: 'Identity', icon: 'shield', path: '/identity' },
        { label: 'Settings', icon: 'cog', path: '/settings' }
      ]
    }
  ]
}
