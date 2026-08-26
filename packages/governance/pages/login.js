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
      title: 'auth.gov.title',
      lead: 'auth.gov.lead'
    }
  }
}
