// Sections for /platform — referenced from pages/platform.js by key.

// 01 — who holds which power.
export const AuthoritySection = {
  extends: 'Section',
  theme: 'surface',

  Inner: {
    SectionHeading: {
      state: {
        num: '01',
        eyebrow: 'Authority model',
        titleTop: 'Separate keys',
        title: 'for separate powers.',
        lead:
          'The mint authority issues. The compliance authority permits. The distribution authority pays. The market authority pauses. None of them can do another one’s job.'
      }
    },

    Grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 'A',
      '@tabletS': { gridTemplateColumns: '1fr' },

      AuthorityCard: {
        state: {
          role: 'Mint authority',
          holder: 'project_registry · PDA ["project", mint]',
          scope: 'Issues tokens against an open round, revoked at close',
          limit: 'Hard cap: the round supply. After revoke: none, forever.',
          status: 'active'
        }
      },
      AuthorityCard_1: {
        extends: 'AuthorityCard',
        state: {
          role: 'Compliance authority',
          holder: 'compliance_transfer · PDA ["config"]',
          scope: 'Records verified wallets, validates every transfer',
          limit: 'Cannot mint, cannot move funds — permission only.',
          status: 'active'
        }
      },
      AuthorityCard_2: {
        extends: 'AuthorityCard',
        state: {
          role: 'Distribution authority',
          holder: 'allocation_distribution · PDA ["config"]',
          scope: 'Opens payout epochs at a fixed profit per token',
          limit: 'Pays only against the sealed balance snapshot.',
          status: 'active'
        }
      },
      AuthorityCard_3: {
        extends: 'AuthorityCard',
        state: {
          role: 'Market authority',
          holder: 'secondary_market · PDA ["market", mint]',
          scope: 'Sets the fee destination and the per-project pause',
          limit: 'Pause stops listings — it cannot touch escrowed funds.',
          status: 'active'
        }
      }
    }
  }
}

// 02 — one subscription, end to end.
export const SettleSection = {
  extends: 'Section',

  Inner: {
    SectionHeading: {
      state: {
        num: '02',
        eyebrow: 'Settlement path',
        titleTop: 'One subscription,',
        title: 'end to end.',
        lead:
          'From the stablecoin commitment to the tokens in the wallet, every hop is a program instruction — nothing settles by spreadsheet.'
      }
    },

    Grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 'A',
      '@tabletL': { gridTemplateColumns: 'repeat(2, 1fr)' },
      '@mobileL': { gridTemplateColumns: '1fr' },

      StepCard: {
        state: {
          revealDelay: '0s',
          step: 'COMMIT',
          title: 'subscribe_investment',
          body: 'USDC moves to the offering vault. The subscription record opens with the amount and the wallet.'
        }
      },
      StepCard_1: {
        extends: 'StepCard',
        state: {
          revealDelay: '.09s',
          step: 'CLEAR',
          title: 'transfer_validate',
          body: 'The hook checks the destination record, both pause flags, and the lockup window before anything moves.'
        }
      },
      StepCard_2: {
        extends: 'StepCard',
        state: {
          revealDelay: '.18s',
          step: 'MINT',
          title: 'issue_tokens',
          body: 'The registry mints against the round cap, straight to the investor wallet. Supply can never exceed the cap.'
        }
      },
      StepCard_3: {
        extends: 'StepCard',
        state: {
          revealDelay: '.27s',
          step: 'PAY',
          title: 'execute_payout',
          body: 'Each epoch pays profit-per-token against the sealed snapshot. Claims settle to the linked wallet, T+0.'
        }
      }
    }
  }
}

// 03 — the controls that stop the machine.
export const SafetySection = {
  extends: 'Section',
  theme: 'surface',

  Inner: {
    Split: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'D',
      alignItems: 'start',
      '@tabletL': { gridTemplateColumns: '1fr' },

      SectionHeading: {
        state: {
          num: '03',
          eyebrow: 'Safety',
          titleTop: 'Built to stop',
          title: 'as well as to run.',
          lead:
            'Every moving part has a brake: a global pause, a per-project pause, lockup windows, and a mint that can be revoked outright.'
        }
      },

      List: {
        tag: 'ul',
        flow: 'y',
        gap: 'A',
        margin: '0',
        padding: '0',

        FeatureItem: {
          state: {
            title: 'Two pause switches',
            body: 'A global flag halts every transfer on the platform; a per-project flag halts one asset. Both are checked inside the hook, so a paused token simply refuses to move.'
          }
        },
        FeatureItem_1: {
          extends: 'FeatureItem',
          state: {
            title: 'Lockups enforced on-chain',
            body: 'A subscription can carry a lockup window. Until it passes, the transfer hook rejects any move out of the wallet — including to the secondary market.'
          }
        },
        FeatureItem_2: {
          extends: 'FeatureItem',
          state: {
            title: 'Mint revocation is final',
            body: 'When a raise closes, revoke_mint_authority burns the power to issue. The supply cap stops being a promise and becomes a property of the chain.'
          }
        },
        FeatureItem_3: {
          extends: 'FeatureItem',
          state: {
            title: 'Everything lands in the audit trail',
            body: 'Every authority action is a transaction with a signer, a slot, and an account trail. The governance console reads the same records you can read on any explorer.'
          }
        }
      }
    }
  }
}
