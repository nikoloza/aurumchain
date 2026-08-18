export const portfolio = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Portfolio — Fractyco' },
  onRender: (el) =>
    el.call('openPage', '/portfolio', 'Portfolio', 'Aggregated holdings per project, updated by trigger on every settlement.'),

  Column: {
    Body: {
      StatRow: {
        state: {
          tiles: [
            { label: 'Total value', value: '$48,120', delta: '+6.2%' },
            { label: 'Total invested', value: '$45,300', delta: '3 positions', tone: 'flat' },
            { label: 'Payouts received', value: '$2,820', delta: '+$640' },
            { label: 'Unrealized', value: '$0', delta: 'no mark yet', tone: 'flat' }
          ]
        }
      },

      List: {
        flow: 'y',
        gap: 'A',
        childExtends: 'PositionCard',
        childrenAs: 'state',
        children: [
          { name: 'Riverbend Extraction', symbol: 'RBX-001', tokens: '500.0000', invested: '$12,500', avg: '$25.00', ret: '+8.1%' },
          { name: 'Kalgoorlie Tailings', symbol: 'KGT-002', tokens: '500.0000', invested: '$5,000', avg: '$10.00', ret: '+2.4%' },
          { name: 'Serra Verde Plant', symbol: 'SVP-003', tokens: '556.0000', invested: '$27,800', avg: '$50.00', ret: '+6.9%' }
        ]
      }
    }
  }
}
