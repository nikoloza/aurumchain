// Compliance runs inside the transfer path, not in front of it.
export const ComplianceSection = {
  extends: 'Section',
  id: 'compliance',
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
          eyebrow: 'Compliance',
          title: 'The token itself refuses a non-compliant transfer.',
          lead:
            'Compliance is not a screen in front of the ledger. It runs inside the transfer path, so an unverified wallet cannot receive tokens even through a direct transfer.'
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
            title: 'A transfer hook on every movement',
            body:
              'The token uses the SPL Token-2022 transfer hook. Each transfer calls the compliance program, which validates the wallet, the pause flags, and the lockup window before it allows the move.'
          }
        },
        FeatureItem_1: {
          extends: 'FeatureItem',
          state: {
            title: 'Eligibility as the single source of truth',
            body:
              'One eligibility record per account holds the can-invest, can-withdraw, and can-receive-payout flags. The application reads that record, never a display tier.'
          }
        },
        FeatureItem_2: {
          extends: 'FeatureItem',
          state: {
            title: 'Wallet ownership proven by signature',
            body:
              'A wallet links only after the holder signs a server-issued nonce. The signature and its timestamp stay on the wallet-link record.'
          }
        },
        FeatureItem_3: {
          extends: 'FeatureItem',
          state: {
            title: 'An append-only audit trail',
            body:
              'Identity decisions, eligibility changes, subscriptions, and payouts write an immutable audit row that carries the actor, the role, and the before and after state.'
          }
        }
      }
    }
  }
}
