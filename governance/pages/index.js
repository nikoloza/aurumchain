import { login } from './login.js'
import { controlPlane } from './controlPlane.js'
import { authorities } from './authorities.js'
import { roles } from './roles.js'
import { emergency } from './emergency.js'
import { compliance } from './compliance.js'
import { market } from './market.js'
import { projects } from './projects.js'
import { subscriptions } from './subscriptions.js'
import { distributions } from './distributions.js'
import { reconciliation } from './reconciliation.js'
import { audit } from './audit.js'

export default {
  '/': controlPlane,
  '/authorities': authorities,
  '/roles': roles,
  '/emergency': emergency,
  '/compliance': compliance,
  '/market': market,
  '/projects': projects,
  '/subscriptions': subscriptions,
  '/distributions': distributions,
  '/reconciliation': reconciliation,
  '/audit': audit,
  // Last on purpose: the platform pre-renders the FIRST registry entry as
  // the served entry page — login first meant every visit booted on the form.
  '/signin': login
}
