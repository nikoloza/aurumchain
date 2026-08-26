// The four Anchor programs. Each one owns one authority and no program
// duplicates another one's authority.
export const ChainSection = {
  extends: 'Section',
  id: 'chain',

  Inner: {
    SectionHeading: {
      state: {
        num: '05',
        eyebrow: 'chain.eyebrow',
        titleTop: 'chain.titleTop',
        title: 'chain.title',
        lead: 'chain.lead'
      }
    },

    Grid: {
      display: 'grid',
      // Container-driven 2 → 1 (see AssetsSection).
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(430px, 100%), 1fr))',
      gap: 'A1',

      ProgramCard: {
        state: {
          revealDelay: '0s',
          name: 'project_registry',
          purpose: 'chain.registry.purpose',
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
          revealDelay: '.1s',
          name: 'compliance_transfer',
          purpose: 'chain.compliance.purpose',
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
          revealDelay: '.2s',
          name: 'allocation_distribution',
          purpose: 'chain.distribution.purpose',
          calls: ['initialize_config', 'create_epoch', 'execute_payout']
        }
      },
      ProgramCard_3: {
        extends: 'ProgramCard',
        state: {
          revealDelay: '.3s',
          name: 'secondary_market',
          purpose: 'chain.market.purpose',
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
// subscription through all four programs. A dark sheet in both schemes —
// navy on ivory, graphite in dark — mono voice, lines settling on reveal.
export const TxLog = {
  flow: 'y',
  width: '100%',
  borderRadius: 'radiusSheet',
  background: 'bandDeep',
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
      text: '{{ chain.log.title | polyglot }}'
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
        text: '{{ chain.log.live | polyglot }}'
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
      { delay: '.5s', tone: 'ok', text: 'chain.log.cleared' },
      { delay: '.8s', tone: 'ok', text: 'chain.log.minted' },
      { delay: '1.1s', tone: 'ok', text: 'chain.log.snapshot' },
      { delay: '1.4s', tone: 'dim', text: 'chain.log.payout' }
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
  text: (el, s) => el.call('polyglot', s.text, s.root.lang),

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