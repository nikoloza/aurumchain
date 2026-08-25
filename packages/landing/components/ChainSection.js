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
    },

    TxLog: {}
  }
}

// The settlement path as it actually looks — a devnet log replaying one
// subscription through all four programs. Always navy (explicit fills, like
// every dark band here), mono voice, lines settling in sequence on reveal.
export const TxLog = {
  flow: 'y',
  width: '100%',
  borderRadius: 'radiusSheet',
  background: 'navyDeep',
  border: '1px solid',
  borderColor: 'mist.14',
  overflow: 'hidden',
  boxShadow: '0 24px 60px rgba(4,20,32,.28)',

  Head: {
    flow: 'x',
    align: 'center space-between',
    padding: 'Z A',
    borderBottom: '1px solid',
    borderBottomColor: 'ivory.08',

    Dots: {
      flow: 'x',
      gap: 'Y',
      childExtends: 'TermDot',
      children: [{}, {}, {}]
    },
    Title: {
      tag: 'span',
      fontFamily: 'Mono',
      fontSize: 'Y1',
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: 'mist.6',
      text: 'settlement — devnet'
    },
    Live: {
      flow: 'x',
      align: 'center center',
      gap: 'Y',
      Dot: {
        tag: 'span',
        width: 'X',
        height: 'X',
        borderRadius: 'E',
        background: 'green+20',
        animationName: 'pulseAccent',
        animationDuration: '2.4s',
        animationIterationCount: 'infinite',
        '@reduceMotion': { animationName: 'none' }
      },
      Label: {
        tag: 'span',
        fontFamily: 'Mono',
        fontSize: 'Y1',
        letterSpacing: '.12em',
        textTransform: 'uppercase',
        color: 'green+20',
        text: 'live'
      }
    }
  },

  Body: {
    flow: 'y',
    gap: 'Y',
    padding: 'A B',
    fontFamily: 'Mono',
    fontSize: 'Z',
    lineHeight: '1.7',
    '@mobileL': { fontSize: 'Y1', padding: 'Z A' },

    childExtends: 'TxLogLine',
    childrenAs: 'state',
    children: [
      { delay: '.2s', tone: 'cmd', text: '$ fractyco settle --offering RBX-001 --epoch 14' },
      { delay: '.5s', tone: 'ok', text: 'compliance_transfer ▸ destination wallet verified · hook cleared' },
      { delay: '.8s', tone: 'ok', text: 'project_registry ▸ 12,400 RBX-001 minted → 7xKt…9fQ2' },
      { delay: '1.1s', tone: 'ok', text: 'allocation_distribution ▸ epoch 14 snapshot sealed · 312 holders' },
      { delay: '1.4s', tone: 'dim', text: 'payout 0.42 USDC / token · settlement T+0 · slot 289,441,102' }
    ]
  }
}

// One log line. state: { text, tone: 'cmd' | 'ok' | 'dim', delay }
export const TxLogLine = {
  tag: 'span',
  display: 'block',
  whiteSpace: 'pre-wrap',
  opacity: '0',
  transform: 'translate3d(0, 6px, 0)',
  transition: (el, s) =>
    'opacity .5s ease ' + (s.delay || '0s') + ', transform .5s cubic-bezier(.22,.68,.24,.98) ' + (s.delay || '0s'),
  isInView: (el, s) => { let st = s; while (st) { if (st.inView !== undefined) return st.inView !== false; st = st.parent } return true },
  '.isInView': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
  '@reduceMotion': { opacity: '1', transform: 'none', transition: 'none' },
  text: (el, s) => s.text || '',

  isCmd: (el, s) => s.tone === 'cmd',
  '.isCmd': { color: 'ivory' },
  isOk: (el, s) => s.tone === 'ok',
  '.isOk': { color: 'mist' },
  isDim: (el, s) => s.tone === 'dim',
  '.isDim': { color: 'ivory.45' },

  // The caret rides the last line.
  Caret: {
    tag: 'span',
    display: 'inline-block',
    width: '.55em',
    height: '1em',
    verticalAlign: '-.15em',
    marginLeft: '.25em',
    background: 'mist',
    animationName: 'blink',
    animationDuration: '1.1s',
    animationIterationCount: 'infinite',
    '@reduceMotion': { animationName: 'none' },
    show: (el, s) => s.tone === 'dim'
  }
}


// One dot in the terminal chrome.
export const TermDot = {
  tag: 'span',
  width: 'X1',
  height: 'X1',
  borderRadius: 'E',
  background: 'ivory.16'
}