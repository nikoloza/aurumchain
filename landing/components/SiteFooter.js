export const SiteFooter = {
  tag: 'footer',
  flow: 'y',
  align: 'center center',
  width: '100%',
  padding: 'D C B',
  theme: 'surface',
  borderTop: '1px solid hairline',
  '@tabletS': { padding: 'C A B' },

  Inner: {
    flow: 'y',
    gap: 'C',
    width: '100%',
    maxWidth: '1120px',

    Top: {
      flow: 'x',
      align: 'flex-start space-between',
      gap: 'C',
      flexWrap: 'wrap',

      Brand: {
        flow: 'y',
        gap: 'Z',
        maxWidth: '320px',
        Logo: {},
        P: {
          margin: '0',
          fontSize: 'Z',
          lineHeight: '1.6',
          color: 'caption',
          text:
            'Fractyco issues asset-backed tokens on Solana and settles investor payouts on-chain.'
        }
      },

      Cols: {
        flow: 'x',
        gap: 'D',
        flexWrap: 'wrap',
        childExtends: 'FooterCol',
        childrenAs: 'state',
        children: [
          {
            title: 'Product',
            links: [
              { label: 'How it works', anchor: 'how' },
              { label: 'Offerings', anchor: 'offerings' },
              { label: 'Secondary market', anchor: 'market' },
              { label: 'On-chain', anchor: 'chain' }
            ]
          },
          {
            title: 'Investors',
            links: [
              { label: 'Open an account', url: 'https://fractyco--app.at.symbo.ls/signin' },
              { label: 'Sign in', url: 'https://fractyco--app.at.symbo.ls/signin' },
              { label: 'Verify identity', url: 'https://fractyco--app.at.symbo.ls/identity' },
              { label: 'Support', url: 'mailto:hello@fractyco.app' }
            ]
          },
          {
            title: 'Company',
            links: [
              { label: 'About', anchor: 'how' },
              { label: 'Compliance', anchor: 'compliance' },
              { label: 'Contact', url: 'mailto:hello@fractyco.app' }
            ]
          }
        ]
      }
    },

    Bottom: {
      flow: 'x',
      align: 'center space-between',
      gap: 'Z',
      flexWrap: 'wrap',
      paddingTop: 'A',
      borderTop: '1px solid hairline',

      Copy: {
        tag: 'span',
        fontSize: 'Y1',
        color: 'caption',
        text: 'Fractyco. Tokenized real-world assets.'
      },
      Note: {
        tag: 'span',
        fontFamily: 'Mono',
        fontSize: 'Y1',
        color: 'caption',
        text: 'Devnet build — not an offer to sell securities.'
      }
    }
  }
}
