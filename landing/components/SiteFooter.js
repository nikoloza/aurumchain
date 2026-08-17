export const SiteFooter = {
  tag: 'footer',
  flow: 'y',
  align: 'center center',
  width: '100%',
  padding: 'D C B',
  theme: 'surface',
  borderTop: '1px solid white.08',
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
              { text: 'How it works', href: '#how' },
              { text: 'Offerings', href: '#offerings' },
              { text: 'Secondary market', href: '#market' },
              { text: 'On-chain', href: '#chain' }
            ]
          },
          {
            title: 'Investors',
            links: [
              { text: 'Open an account', href: 'https://fractyco--app.at.symbo.ls/signin' },
              { text: 'Sign in', href: 'https://fractyco--app.at.symbo.ls/signin' },
              { text: 'Verify identity', href: 'https://fractyco--app.at.symbo.ls/identity' },
              { text: 'Support', href: 'mailto:hello@fractyco.app' }
            ]
          },
          {
            title: 'Company',
            links: [
              { text: 'About', href: '/about' },
              { text: 'Compliance', href: '#compliance' },
              { text: 'Terms', href: '/terms' },
              { text: 'Privacy', href: '/privacy' }
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
      borderTop: '1px solid white.08',

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
