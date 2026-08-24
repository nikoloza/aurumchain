export const offerings = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Offerings — Fractyco' },
  onRender: (el) => {
    el.call('openPage', '/offerings', 'Offerings', 'Open subscriptions. The registry enforces the supply cap and the window.')
    el.call('loadOfferings')
  },

  Column: {
    Body: {
      SkeletonList: {
        flow: 'y',
        gap: 'A',
        show: (el, s) => !s.root.backendOfferingsLoaded,
        childExtends: 'SkeletonRow',
        children: [{}, {}, {}]
      },

      List: {
        flow: 'y',
        gap: 'A',
        show: (el, s) => !!s.root.backendOfferingsLoaded,
        childExtends: 'OfferingRow',
        childrenAs: 'state',
        // Live rows from the platform Supabase; the illustrative set only
        // renders while the backend has no visible projects.
        children: (el, s) =>
          (s.root.backendOfferings && s.root.backendOfferings.length)
            ? s.root.backendOfferings
            : [
          {
            name: 'Riverbend Extraction',
            symbol: 'RBX-001',
            status: 'Funding',
            price: '$25.00',
            min: '$500',
            raised: '$1.84M',
            goal: '$2.40M',
            pct: 77,
            closes: '2026-09-15'
          },
          {
            name: 'Kalgoorlie Tailings',
            symbol: 'KGT-002',
            status: 'Funding',
            price: '$10.00',
            min: '$250',
            raised: '$620K',
            goal: '$1.50M',
            pct: 41,
            closes: '2026-10-01'
          },
          {
            name: 'Serra Verde Plant',
            symbol: 'SVP-003',
            status: 'Completed',
            price: '$50.00',
            min: '$1,000',
            raised: '$3.10M',
            goal: '$3.10M',
            pct: 100,
            closes: 'closed'
          }
        ]
      },

      EmptyNote: {
        state: {
          text: 'Subscription commits stablecoin and opens a subscription record. An operator finalizes it, and the registry then mints the tokens to your verified wallet.'
        }
      }
    }
  }
}
