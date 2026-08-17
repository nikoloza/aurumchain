export const login = {
  extends: 'Page',
  flow: 'y',
  align: 'center center',
  width: '100%',
  minHeight: '100vh',
  padding: 'B',
  theme: 'document',

  metadata: { title: 'Sign in — Fractyco' },

  LoginCard: {
    state: {
      title: 'Investor sign in',
      lead: 'Your positions, payouts, and subscriptions.'
    }
  }
}
