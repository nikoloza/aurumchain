// Opening band.
export const Hero = {
  tag: 'section',
  flow: 'y',
  align: 'center center',
  position: 'relative',
  width: '100%',
  minHeight: '92vh',
  padding: 'F C D',
  overflow: 'hidden',
  '@tabletS': { minHeight: 'auto', padding: 'E A C' },

  // Radial gold wash behind the headline. Decorative only.
  Glow: {
    position: 'absolute',
    top: '-20%',
    left: '50%',
    width: 'I',
    height: 'I',
    transform: 'translateX(-50%)',
    background:
      'radial-gradient(circle, rgba(229,179,90,.16) 0%, rgba(229,179,90,0) 62%)',
    pointerEvents: 'none'
  },

  Inner: {
    flow: 'y',
    gap: 'C',
    align: 'center center',
    width: '100%',
    maxWidth: 'J',
    position: 'relative',
    textAlign: 'center',
    attr: { 'data-reveal': 'true' },

    TopRow: {
      flow: 'x',
      align: 'center center',
      gap: 'Z',
      Logo: {},
      ChipAccent: { text: 'Solana · Devnet' }
    },

    H1: {
      fontFamily: 'Display',
      fontSize: 'G',
      lineHeight: '1.04',
      fontWeight: '700',
      letterSpacing: '-.035em',
      color: 'title',
      margin: '0',
      text: 'Real-world assets, split into compliant fractions.',
      '@tabletS': { fontSize: 'E' }
    },

    P: {
      fontSize: 'B',
      lineHeight: '1.55',
      color: 'paragraph',
      margin: '0',
      maxWidth: 'I',
      text:
        'Fractyco issues asset-backed tokens on Solana. Every transfer clears a compliance hook, every position settles against a registry, and every payout distributes on-chain.',
      '@tabletS': { fontSize: 'A' }
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
      HowCta: {
        display: 'inline-flex',
        state: { anchor: 'how' },
        // Inline, through el.node.ownerDocument — see components/NavItem.js.
        onClick: (ev, el, s) => {
          ev.preventDefault()
          const doc = el.node.ownerDocument
          const target = doc.getElementById(s.anchor)
          if (!target) return
          const root = doc.documentElement
          const header = doc.querySelector('header')
          root.scrollTop =
            root.scrollTop +
            target.getBoundingClientRect().top -
            ((header ? header.offsetHeight : 80) + 16)
        },
        Link: {
          // Same-document absolute URL — Link then leaves the click to the
          // HowCta wrapper above. See components/NavItem.js.
          href: (el) => {
            const loc = el.node && el.node.ownerDocument.location
            return loc ? `${loc.origin}${loc.pathname}#how` : '#how'
          },
          text: '',
          textDecoration: 'none',
          display: 'inline-flex',
          PillButton: { state: { tone: 'secondary' }, text: 'See how it works' }
        }
      }
    },

    Stats: {
      flow: 'x',
      align: 'center center',
      gap: 'D',
      flexWrap: 'wrap',
      marginTop: 'B',
      paddingTop: 'B',
      borderTop: '1px solid white.08',
      width: '100%',
      textAlign: 'left',

      StatCell: { state: { value: '4', label: 'Anchor programs' } },
      StatCell_1: { extends: 'StatCell', state: { value: 'SPL-2022', label: 'Token standard' } },
      StatCell_2: { extends: 'StatCell', state: { value: 'T+0', label: 'Payout settlement' } },
      StatCell_3: { extends: 'StatCell', state: { value: 'USDC', label: 'Settlement asset' } }
    }
  }
}
