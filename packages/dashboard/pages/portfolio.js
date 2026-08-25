export const portfolio = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Portfolio — Fractyco' },
  onRender: (el) =>
    el.call('openPage', '/portfolio', 'Portfolio', 'Aggregated holdings per project, updated by trigger on every settlement.'),

  Column: {
    Body: {
      KpiRow: {
        state: { inView: false },
        KpiTile: {
          state: { revealDelay: '0s', label: 'Total value', to: 48120, prefix: '$', delta: '+6.2%' }
        },
        KpiTile_1: {
          extends: 'KpiTile',
          state: { revealDelay: '.07s', label: 'Total invested', to: 45300, prefix: '$', delta: '3 positions', tone: 'flat' }
        },
        KpiTile_2: {
          extends: 'KpiTile',
          state: { revealDelay: '.14s', label: 'Payouts received', to: 2820, prefix: '$', delta: '+$640' }
        },
        KpiTile_3: {
          extends: 'KpiTile',
          state: { revealDelay: '.21s', label: 'Unrealized', to: 0, prefix: '$', delta: 'no mark yet', tone: 'flat' }
        }
      },

      List: {
        flow: 'y',
        gap: 'A',
        scope: {},
        // Holdings live on state so the blank slate below is real wiring —
        // the Supabase read that replaces the demo set lands on `positions`.
        state: {
          inView: false,
          positions: [
            { revealDelay: '0s', name: 'Riverbend Extraction', symbol: 'RBX-001', tokens: '500.0000', invested: '$12,500', avg: '$25.00', ret: '+8.1%' },
            { revealDelay: '.08s', name: 'Kalgoorlie Tailings', symbol: 'KGT-002', tokens: '500.0000', invested: '$5,000', avg: '$10.00', ret: '+2.4%' },
            { revealDelay: '.16s', name: 'Serra Verde Plant', symbol: 'SVP-003', tokens: '556.0000', invested: '$27,800', avg: '$50.00', ret: '+6.9%' }
          ]
        },
        onRender: (el, s) => {
          const win = el.node && el.node.ownerDocument.defaultView
          if (win && !el.scope.armed) {
            el.scope.armed = true
            win.setTimeout(() => s.update({ inView: true }, { preventFetch: true }), 180)
          }
        },

        Items: {
          flow: 'y',
          gap: 'A',
          childExtends: 'PositionItem',
          childrenAs: 'state',
          children: (el, s) => s.positions || []
        },

        EmptyState: {
          show: (el, s) => { let st = s; while (st) { if (st.positions !== undefined) return !(st.positions && st.positions.length); st = st.parent } return false },
          state: {
            title: 'No positions yet',
            caption: 'Subscribe to an open offering and the holding settles here on finalization.'
          }
        }
      }
    }
  }
}
