// The four Anchor programs. Each one owns one authority and no program
// duplicates another one's authority.
export const ChainSection = {
  extends: 'Section',
  id: 'chain',

  Inner: {
    SectionHeading: {
      state: {
        num: '05',
        eyebrow: 'On-chain',
        titleTop: 'Four programs,',
        title: 'one settlement path.',
        lead:
          'The registry owns supply. Compliance owns permission. Distribution owns payouts. The market owns resale.'
      }
    },

    Grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'A',
      '@tabletS': { gridTemplateColumns: '1fr' },

      ProgramCard: {
        state: {
          name: 'project_registry',
          purpose:
            'Creates projects, binds the mint, caps supply per round, issues tokens directly to an investor wallet, and revokes the mint authority when the raise closes.',
          calls: [
            'create_project',
            'set_project_mint',
            'issue_tokens',
            'reset_round',
            'revoke_mint_authority',
            'burn_tokens'
          ]
        }
      },
      ProgramCard_1: {
        extends: 'ProgramCard',
        state: {
          name: 'compliance_transfer',
          purpose:
            'Records verified wallets, validates every transfer through the SPL transfer hook, and holds the subscription record from commitment to settlement.',
          calls: [
            'record_verified_wallet',
            'transfer_validate',
            'transfer_hook',
            'subscribe_investment',
            'finalize_subscription',
            'revoke_wallet'
          ]
        }
      },
      ProgramCard_2: {
        extends: 'ProgramCard',
        state: {
          name: 'allocation_distribution',
          purpose:
            'Opens a payout epoch at a fixed profit per token, then pays each holder against a balance snapshot taken at the epoch boundary.',
          calls: ['initialize_config', 'create_epoch', 'execute_payout']
        }
      },
      ProgramCard_3: {
        extends: 'ProgramCard',
        state: {
          name: 'secondary_market',
          purpose:
            'Escrows a seller position behind a sell order, fills orders against stablecoin, and takes a fee in basis points. Trades still clear the compliance hook.',
          calls: [
            'initialize_market',
            'create_sell_order',
            'fill_order',
            'cancel_sell_order',
            'set_project_pause'
          ]
        }
      }
    }
  }
}
