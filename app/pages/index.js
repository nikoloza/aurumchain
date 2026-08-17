import { overview } from './overview.js'
import { offerings } from './offerings.js'
import { portfolio } from './portfolio.js'
import { marketplace } from './marketplace.js'
import { payouts } from './payouts.js'
import { transactions } from './transactions.js'
import { wallet } from './wallet.js'
import { identity } from './identity.js'
import { settings } from './settings.js'

export default {
  '/': overview,
  '/offerings': offerings,
  '/portfolio': portfolio,
  '/marketplace': marketplace,
  '/payouts': payouts,
  '/transactions': transactions,
  '/wallet': wallet,
  '/identity': identity,
  '/settings': settings
}
