// Footer continues the navy band: link columns over the hairline, then the
// wordmark as a ghost across the full width — the brand signing its own page.
export const SiteFooter = {
  tag: 'footer',
  flow: 'y',
  align: 'center center',
  width: '100%',
  padding: 'D C 0',
  theme: 'inverted',
  position: 'relative',
  overflow: 'hidden',
  borderTop: '1px solid',
  borderTopColor: 'ivory.08',
  '@tabletS': { padding: 'C A 0' },

  Inner: {
    flow: 'y',
    gap: 'C',
    width: '100%',
    maxWidth: '1120px',
    position: 'relative',

    Top: {
      flow: 'x',
      align: 'flex-start space-between',
      gap: 'C',
      flexWrap: 'wrap',

      Brand: {
        flow: 'y',
        gap: 'Z',
        maxWidth: 'H1',
        Logo: { color: 'ivory' },
        P: {
          margin: '0',
          fontSize: 'Z',
          lineHeight: '1.6',
          color: 'ivory.52',
          text:
            'Fractyco issues asset-backed tokens on Solana and settles investor payouts on-chain.'
        }
      },

      Cols: {
        flow: 'x',
        gap: 'D',
        flexWrap: 'wrap',
        childExtends: 'FooterCol',
        childProps: {
          Title: { color: 'ivory.92' },
          Links: {
            childProps: {
              FooterLink: { color: 'ivory.52', ':hover': { color: 'ivory' } }
            }
          }
        },
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
      borderTop: '1px solid',
      borderTopColor: 'ivory.08',

      Copy: {
        tag: 'span',
        fontSize: 'Y1',
        color: 'ivory.45',
        text: 'Fractyco. Tokenized real-world assets.'
      },
      Note: {
        tag: 'span',
        fontFamily: 'Mono',
        fontSize: 'Y1',
        color: 'ivory.45',
        text: 'Devnet build — not an offer to sell securities.'
      }
    },

    GhostWord: {
      tag: 'span',
      display: 'block',
      width: '100%',
      textAlign: 'center',
      fontFamily: 'Brand',
      fontSize: 'M',
      lineHeight: '.72',
      letterSpacing: '.01em',
      textTransform: 'uppercase',
      color: 'ivory.05',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      userSelect: 'none',
      marginBottom: '-.32em',
      attr: { 'aria-hidden': 'true' },
      text: 'FRACTYCO',
      '@tabletS': { fontSize: 'H' }
    }
  }
}
