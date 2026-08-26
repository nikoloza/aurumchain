export const portfolio = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Portfolio — Fractyco' },
  onRender: (el) =>
    el.call('openPage', '/portfolio', 'page.portfolio.title', 'page.portfolio.lead'),

  Column: {
    Body: {
      KpiRow: {
        state: { inView: false },
        KpiTile: {
          state: { revealDelay: '0s', label: 'kpi.totalValue', to: 48120, prefix: '$', delta: '+6.2%' }
        },
        KpiTile_1: {
          extends: 'KpiTile',
          state: { revealDelay: '.07s', label: 'kpi.totalInvested', to: 45300, prefix: '$', delta: 'kpi.delta3Positions', tone: 'flat' }
        },
        KpiTile_2: {
          extends: 'KpiTile',
          state: { revealDelay: '.14s', label: 'kpi.payoutsReceived', to: 2820, prefix: '$', delta: '+$640' }
        },
        KpiTile_3: {
          extends: 'KpiTile',
          state: { revealDelay: '.21s', label: 'kpi.unrealized', to: 0, prefix: '$', delta: 'kpi.noMarkYet', tone: 'flat' }
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
        onRender: (el) => el.call('armReveal'),

        Items: {
          flow: 'y',
          gap: 'A',
          childExtends: 'PositionItem',
          childrenAs: 'state',
          children: (el, s) => s.positions || []
        },

        EmptyState: {
          state: {
            watch: 'positions',
            title: 'empty.positions.title',
            caption: 'empty.positions.caption'
          }
        }
      }
    }
  }
}
