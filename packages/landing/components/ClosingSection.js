export const ClosingSection = {
  extends: 'Section',
  theme: 'inverted',

  Inner: {
    align: 'center center',
    textAlign: 'center',
    gap: 'B',

    H2: {
      fontFamily: 'Display',
      fontSize: 'E',
      lineHeight: '1.1',
      fontWeight: '700',
      letterSpacing: '-.03em',
      color: 'white',
      margin: '0',
      maxWidth: 'I',
      text: 'Open an account and see the offerings.',
      '@tabletS': { fontSize: 'C' }
    },

    P: {
      margin: '0',
      fontSize: 'A',
      lineHeight: '1.6',
      color: 'white.72',
      maxWidth: 'H+C',
      text:
        'Identity approval takes minutes. Wallet verification takes one signature. Subscription opens as soon as both clear.'
    },

    Actions: {
      flow: 'x',
      align: 'center center',
      gap: 'Z',
      flexWrap: 'wrap',

      Link: {
        href: 'https://fractyco--app.at.symbo.ls/signin',
        text: '',
        textDecoration: 'none',
        display: 'inline-flex',
        PillButton: { state: { tone: 'primary' }, text: 'Open an account' }
      },
      Link_1: {
        href: 'mailto:hello@fractyco.app',
        text: '',
        textDecoration: 'none',
        display: 'inline-flex',
        PillButton: { state: { tone: 'secondary' }, text: 'Talk to us' }
      }
    }
  }
}
