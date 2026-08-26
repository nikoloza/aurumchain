// Status label whose colour follows the value.
// state: { status } — one of the statuses used across the product.
export const StatusPill = {
  extends: 'Chip',

  // The value may arrive as a translation key (`status.approved`) or as a raw
  // backend word (`Approved`) — the label resolves through polyglot either way,
  // and the tone matchers key off the last dotted segment so both forms tone alike.
  text: (el, s) => el.call('polyglot', s.status || '', s.root.lang),

  isPositive: (el, s) =>
    ['approved', 'completed', 'active', 'verified', 'filled', 'paid', 'eligible'].includes(
      String(s.status || '').split('.').pop().toLowerCase().replace(/[^a-z]/g, '')
    ),
  '.isPositive': { theme: 'chipPositive' },

  isNegative: (el, s) =>
    ['rejected', 'failed', 'cancelled', 'restricted', 'suspended', 'revoked'].includes(
      String(s.status || '').split('.').pop().toLowerCase().replace(/[^a-z]/g, '')
    ),
  '.isNegative': { theme: 'chipNegative' },

  isPending: (el, s) =>
    ['pending', 'processing', 'underreview', 'scheduled', 'funding', 'unclaimed'].includes(
      String(s.status || '').split('.').pop().toLowerCase().replace(/[^a-z]/g, '')
    ),
  '.isPending': { theme: 'chipPending' }
}
