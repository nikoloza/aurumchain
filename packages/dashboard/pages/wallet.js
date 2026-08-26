export const wallet = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Wallet — Fractyco' },
  onRender: (el) =>
    el.call('openPage', '/wallet', 'page.wallet.title', 'page.wallet.lead'),

  Column: {
    Body: {
      Panel: {
        state: { title: 'panel.linkedWallets.title', lead: 'panel.linkedWallets.lead' },
        DataTable: {
          state: {
            columns: ['table.address', 'table.chain', 'table.type', 'table.linked', 'table.status'],
            rows: [
              { cells: [{ text: '7STXs2…uSk4', mono: true }, { text: 'Solana devnet' }, { text: 'Phantom' }, { text: '2026-07-04', mono: true }, { status: 'status.verified' }] }
            ]
          },
          EmptyState: {
            state: {
              title: 'empty.wallets.title',
              caption: 'empty.wallets.caption'
            }
          }
        },
        Actions: {
          flow: 'x',
          gap: 'Z',
          paddingTop: 'Z',
          // Both labels are longer in Georgian than a phone row can hold.
          flexWrap: 'wrap',
          // Linking signs a server-issued nonce through the wallet adapter —
          // not wired on the preview, so both actions acknowledge instead.
          ActionButton: { text: '{{ wallet.linkAnother | polyglot }}', onClick: (e, el) => el.call('appNotify') },
          ActionButton_1: {
            extends: 'ActionButton',
            state: { tone: 'secondary' },
            text: '{{ wallet.reverify | polyglot }}',
            onClick: (e, el) => el.call('appNotify')
          }
        }
      },

      Panel_1: {
        extends: 'Panel',
        state: { title: 'panel.tokenBalances.title', lead: 'panel.tokenBalances.lead' },
        DataTable: {
          state: {
            columns: ['table.token', 'table.balance', 'table.mint', 'table.transferHook'],
            rows: [
              { cells: [{ text: 'RBX-001', mono: true }, { text: '500.0000', mono: true }, { text: 'AJuj…3jvf', mono: true }, { status: 'status.active' }] },
              { cells: [{ text: 'KGT-002', mono: true }, { text: '500.0000', mono: true }, { text: 'Es9v…nNYB', mono: true }, { status: 'status.active' }] },
              { cells: [{ text: 'SVP-003', mono: true }, { text: '556.0000', mono: true }, { text: '9RqV…enjm', mono: true }, { status: 'status.active' }] }
            ]
          },
          EmptyState: {
            state: {
              title: 'empty.balances.title',
              caption: 'empty.balances.caption'
            }
          }
        }
      },

      AppToast: {}
    }
  }
}
