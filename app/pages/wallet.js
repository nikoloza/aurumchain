export const wallet = {
  extends: ['Page', 'ShellPage'],
  metadata: { title: 'Wallet — Fractyco' },
  onRender: (el) =>
    el.call('openPage', '/wallet', 'Wallet', 'A wallet links only after you sign a server-issued nonce.'),

  Column: {
    Body: {
      Panel: {
        state: { title: 'Linked wallets', lead: 'Connection and verification are separate states.' },
        DataTable: {
          state: {
            columns: ['Address', 'Chain', 'Type', 'Linked', 'Status'],
            rows: [
              { cells: [{ text: '7STXs2LXLimTiPBuvrcnE1u7vQFCw9GoCKmhs3QsuSk4', mono: true }, { text: 'Solana devnet' }, { text: 'Phantom' }, { text: '2026-07-04', mono: true }, { status: 'Verified' }] }
            ]
          }
        },
        Actions: {
          flow: 'x',
          gap: 'Z',
          paddingTop: 'Z',
          ActionButton: { text: 'Link another wallet' },
          ActionButton_1: { extends: 'ActionButton', state: { tone: 'secondary' }, text: 'Re-verify' }
        }
      },

      Panel_1: {
        extends: 'Panel',
        state: { title: 'Token balances', lead: 'Held directly in your wallet. Fractyco does not custody them.' },
        DataTable: {
          state: {
            columns: ['Token', 'Balance', 'Mint', 'Transfer hook'],
            rows: [
              { cells: [{ text: 'RBX-001', mono: true }, { text: '500.0000', mono: true }, { text: 'AJuj…3jvf', mono: true }, { status: 'Active' }] },
              { cells: [{ text: 'KGT-002', mono: true }, { text: '500.0000', mono: true }, { text: 'Es9v…nNYB', mono: true }, { status: 'Active' }] },
              { cells: [{ text: 'SVP-003', mono: true }, { text: '556.0000', mono: true }, { text: '9RqV…enjm', mono: true }, { status: 'Active' }] }
            ]
          }
        }
      }
    }
  }
}
