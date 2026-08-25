// Compliance runs inside the transfer path, not in front of it. The left
// column pairs the heading with the HookFlow schematic — the transfer path
// drawn as a dashed rail with a packet gliding through the hook — while the
// right column lists the guarantees.
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

      Lead: {
        flow: 'y',
        gap: 'C',

        SectionHeading: {
          state: {
            num: '04',
            eyebrow: 'Compliance',
            titleTop: 'The token itself refuses',
            title: 'a non-compliant transfer.',
            lead:
              'Compliance is not a screen in front of the ledger. It runs inside the transfer path, so an unverified wallet cannot receive tokens even through a direct transfer.'
          }
        },

        HookFlow: {}
      },

      List: {
        tag: 'ul',
        flow: 'y',
        gap: 'A',
        margin: '0',
        padding: '0',

        FeatureItem: {
          state: {
            revealDelay: '.1s',
            title: 'A transfer hook on every movement',
            body:
              'The token uses the SPL Token-2022 transfer hook. Each transfer calls the compliance program, which validates the wallet, the pause flags, and the lockup window before it allows the move.'
          }
        },
        FeatureItem_1: {
          extends: 'FeatureItem',
          state: {
            revealDelay: '.22s',
            title: 'Eligibility as the single source of truth',
            body:
              'One eligibility record per account holds the can-invest, can-withdraw, and can-receive-payout flags. The application reads that record, never a display tier.'
          }
        },
        FeatureItem_2: {
          extends: 'FeatureItem',
          state: {
            revealDelay: '.34s',
            title: 'Wallet ownership proven by signature',
            body:
              'A wallet links only after the holder signs a server-issued nonce. The signature and its timestamp stay on the wallet-link record.'
          }
        },
        FeatureItem_3: {
          extends: 'FeatureItem',
          state: {
            revealDelay: '.46s',
            title: 'An append-only audit trail',
            body:
              'Identity decisions, eligibility changes, subscriptions, and payouts write an immutable audit row that carries the actor, the role, and the before and after state.'
          }
        }
      }
    }
  }
}

// The transfer path as a schematic: sender and receiver wallets on a dashed
// rail, the hook node between them, and a packet diamond gliding the whole
// run on a loop — every movement passes through the hook.
export const HookFlow = {
  flow: 'y',
  gap: 'Z',
  width: '100%',
  padding: 'A B',
  borderRadius: 'radiusCard',
  border: '1px dashed',
  borderColor: 'hairline',
  opacity: '0',
  transform: 'translate3d(0, 12px, 0)',
  transition: 'opacity .7s ease .55s, transform .7s cubic-bezier(.22,.68,.24,.98) .55s',
  isRevealed: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
  '.isRevealed': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
  '@reduceMotion': { opacity: '1', transform: 'none', transition: 'none' },

  Row: {
    position: 'relative',
    flow: 'x',
    align: 'center space-between',
    gap: 'Z',
    width: '100%',

    // NB: named Track, not Rail — `Rail` is a registered brand component
    // (the dashboard sidebar) and a bare `Rail:` key would auto-extend it.
    Track: {
      position: 'absolute',
      left: '0',
      right: '0',
      top: '50%',
      borderTop: '1px dashed',
      borderTopColor: 'hairline'
    },

    // The packet — one clearance every few seconds.
    Glide: {
      tag: 'span',
      position: 'absolute',
      top: '50%',
      left: '0%',
      width: 'X1',
      height: 'X1',
      background: 'accentInk',
      transform: 'translate(-50%, -50%) rotate(45deg)',
      opacity: '0',
      isRevealed: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
      '.isRevealed': {
        animationName: 'railGlide',
        animationDuration: '3.6s',
        animationDelay: '1.2s',
        animationTimingFunction: 'cubic-bezier(.45,.05,.35,.95)',
        animationIterationCount: 'infinite'
      },
      '@reduceMotion': { animationName: 'none' }
    },

    EndA: {
      position: 'relative',
      flow: 'x',
      align: 'center center',
      gap: 'Y',
      padding: 'W Z',
      borderRadius: 'radiusPill',
      border: '1px solid hairline',
      background: 'surfaceWash',
      Dot: { tag: 'span', width: 'X', height: 'X', background: 'caption', transform: 'rotate(45deg)' },
      Label: { tag: 'span', fontFamily: 'Mono', fontSize: 'Y1', letterSpacing: '.1em', color: 'caption', text: 'WALLET A' }
    },

    HookNode: {
      position: 'relative',
      flow: 'x',
      align: 'center center',
      gap: 'Y',
      padding: 'W Z',
      borderRadius: 'radiusPill',
      border: '1px solid',
      borderColor: 'slate.45',
      background: 'surfaceWash',
      Diamond: { tag: 'span', width: 'X1', height: 'X1', background: 'accentInk', transform: 'rotate(45deg)' },
      Label: { tag: 'span', fontFamily: 'Mono', fontSize: 'Y1', fontWeight: '600', letterSpacing: '.1em', color: 'accentInk', text: 'TRANSFER HOOK' }
    },

    EndB: {
      position: 'relative',
      flow: 'x',
      align: 'center center',
      gap: 'Y',
      padding: 'W Z',
      borderRadius: 'radiusPill',
      border: '1px solid hairline',
      background: 'surfaceWash',
      Dot: { tag: 'span', width: 'X', height: 'X', background: 'caption', transform: 'rotate(45deg)' },
      Label: { tag: 'span', fontFamily: 'Mono', fontSize: 'Y1', letterSpacing: '.1em', color: 'caption', text: 'WALLET B' }
    }
  },

  Caption: {
    tag: 'span',
    fontFamily: 'Mono',
    fontSize: 'Y1',
    letterSpacing: '.04em',
    lineHeight: '1.6',
    color: 'caption',
    text: 'compliance_transfer validates the wallet, the pause flags, and the lockup — a failed check reverts the move.'
  }
}
