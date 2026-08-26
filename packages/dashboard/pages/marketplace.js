export const marketplace = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Marketplace — Fractyco' },
  onRender: (el) =>
    el.call('openPage', '/marketplace', 'page.marketplace.title', 'page.marketplace.lead'),

  Column: {
    Body: {
      KpiRow: {
        state: { inView: false },
        KpiTile: {
          state: { revealDelay: '0s', label: 'kpi.openListings', to: 14, delta: 'kpi.across3Assets', tone: 'flat' }
        },
        KpiTile_1: {
          extends: 'KpiTile',
          state: { revealDelay: '.07s', label: 'kpi.bestBid', to: 26.4, decimals: 2, prefix: '$', delta: 'RBX-001' }
        },
        KpiTile_2: {
          extends: 'KpiTile',
          state: { revealDelay: '.14s', label: 'kpi.volume30d', to: 182, prefix: '$', suffix: 'K', delta: '+18%' }
        },
        KpiTile_3: {
          extends: 'KpiTile',
          state: { revealDelay: '.21s', label: 'kpi.marketFee', to: 50, suffix: ' bps', delta: 'kpi.toFeeDestination', tone: 'flat' }
        }
      },

      Panel: {
        state: { title: 'panel.orderBook.title', lead: 'panel.orderBook.lead' },
        DataTable: {
          state: {
            columns: ['table.asset', 'table.seller', 'table.amount', 'table.price', 'table.remaining', 'table.status'],
            rows: [
              { cells: [{ text: 'RBX-001', mono: true }, { text: '9fQ…4mT', mono: true }, { text: '120.0000', mono: true }, { text: '$26.40', mono: true }, { text: '120.0000', mono: true }, { status: 'status.active' }] },
              { cells: [{ text: 'RBX-001', mono: true }, { text: '3kL…8bV', mono: true }, { text: '400.0000', mono: true }, { text: '$27.10', mono: true }, { text: '260.0000', mono: true }, { status: 'status.active' }] },
              { cells: [{ text: 'KGT-002', mono: true }, { text: '7cR…1nP', mono: true }, { text: '900.0000', mono: true }, { text: '$10.85', mono: true }, { text: '900.0000', mono: true }, { status: 'status.active' }] },
              { cells: [{ text: 'SVP-003', mono: true }, { text: '2wX…6hQ', mono: true }, { text: '80.0000', mono: true }, { text: '$52.00', mono: true }, { text: '0.0000', mono: true }, { status: 'status.filled' }] }
            ]
          },
          EmptyState: {
            state: {
              title: 'empty.orders.title',
              caption: 'empty.orders.caption'
            }
          }
        }
      },

      Panel_1: {
        extends: 'Panel',
        state: { title: 'panel.yourListings.title', lead: 'panel.yourListings.lead' },
        DataTable: {
          state: {
            columns: ['table.asset', 'table.amount', 'table.price', 'table.sold', 'table.status'],
            rows: [
              { cells: [{ text: 'SVP-003', mono: true }, { text: '100.0000', mono: true }, { text: '$52.00', mono: true }, { text: '24.0000', mono: true }, { status: 'status.active' }] }
            ]
          },
          EmptyState: {
            state: {
              title: 'empty.listings.title',
              caption: 'empty.listings.caption'
            }
          }
        }
      }
    }
  }
}
