// Status label whose colour follows the value.
// state: { status } — one of the statuses used across the product.
export const StatusPill = {
  extends: 'Chip',

  text: (el, s) => s.status || '',

  isPositive: (el, s) =>
    ['approved', 'completed', 'active', 'verified', 'filled', 'paid', 'eligible'].includes(
      String(s.status || '').toLowerCase()
    ),
  '.isPositive': { theme: 'chipPositive' },

  isNegative: (el, s) =>
    ['rejected', 'failed', 'cancelled', 'restricted', 'suspended', 'revoked'].includes(
      String(s.status || '').toLowerCase()
    ),
  '.isNegative': { theme: 'chipNegative' },

  isPending: (el, s) =>
    ['pending', 'processing', 'under review', 'scheduled', 'funding', 'unclaimed'].includes(
      String(s.status || '').toLowerCase()
    ),
  '.isPending': { theme: 'chipPending' }
}
