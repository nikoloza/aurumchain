// Governance root. This surface holds the authorities and the policy switches
// that the on-chain programs read. Everything it changes is an authority
// action, so every page writes an audit row.
export default {
  scope: { __local: true },

  metadata: {
    siteName: 'Fractyco Governance',
    type: 'website',
    locale: 'en_US'
  }
}
