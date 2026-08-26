// Investor application root. The rail, the topbar, and the page title all read
// from root state, so a page only declares its own data.
export default {
  scope: { __local: true },

  metadata: {
    siteName: 'Fractyco',
    type: 'website',
    locale: 'en_US'
  }
}
