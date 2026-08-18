export const FaqSection = {
  extends: 'Section',
  id: 'faq',

  Inner: {
    SectionHeading: {
      state: {
        eyebrow: 'FAQ',
        title: 'The questions we get first.'
      }
    },

    List: {
      flow: 'y',
      width: '100%',
      maxWidth: 'J',
      childExtends: 'FaqItem',
      childrenAs: 'state',
      children: [
        {
          open: false,
          q: 'Who can invest?',
          a: 'An account can subscribe after identity approval and wallet verification. The eligibility record carries the can-invest flag, and the application checks that flag before it opens the subscription form.'
        },
        {
          open: false,
          q: 'Where do the tokens live?',
          a: 'The tokens mint directly to the investor wallet on Solana. Fractyco does not custody them. The registry keeps the supply ledger and the wallet keeps the balance.'
        },
        {
          open: false,
          q: 'What stops a token from reaching an unverified wallet?',
          a: 'The transfer hook. Every transfer calls the compliance program first. The program checks the destination wallet record, the global pause flag, the project pause flag, and the lockup window. A failed check reverts the transfer.'
        },
        {
          open: false,
          q: 'How is a payout calculated?',
          a: 'An operator opens an epoch at a fixed profit per token. Each payout multiplies that rate by the holder balance snapshot for the epoch, so a transfer after the snapshot does not change the entitlement.'
        },
        {
          open: false,
          q: 'Can I sell before the project completes?',
          a: 'Yes, on the secondary market, when the project is not paused and the lockup window has passed. Listings are peer-to-peer and settle in stablecoin.'
        },
        {
          open: false,
          q: 'Which network is live today?',
          a: 'The programs run on Solana devnet. Mainnet deployment follows the audit of the four programs and the compliance review of the first offering.'
        }
      ]
    }
  }
}
