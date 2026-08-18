// Reads against the platform Supabase REST API. Same self-containment rule as
// auth.js — constants inlined per handler, no module-scope helpers.
//
// Each loader writes plain rows onto root state; the page's `children` read
// them reactively. RLS decides what the session may see: requests carry the
// user's access token when one exists, and fall back to the anonymous role
// otherwise.

export const _restFetch = async function _restFetch (pathAndQuery) {
  const SUPABASE_URL = 'https://qetdqwmmnpmgrixkorqg.supabase.co'
  const SUPABASE_KEY = 'sb_publishable_U1B0i51SLQFUZqzT0OKslw_7zf7g9GQ'
  // The session lives in page-realm localStorage only — see auth.js.
  let token = null
  try {
    const win =
      (this.node && this.node.ownerDocument.defaultView) ||
      (this.__ref && this.__ref.root && this.__ref.root.node && this.__ref.root.node.ownerDocument.defaultView) ||
      window
    token = (JSON.parse(win.localStorage.getItem('fractyco_session') || 'null') || {}).access_token
  } catch (e) {}
  const r = await fetch(`${SUPABASE_URL}/rest/v1${pathAndQuery}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${token || SUPABASE_KEY}`
    }
  })
  if (!r.ok) throw new Error('HTTP ' + r.status)
  return r.json()
}

// Offerings for the investor app — projects joined with their sale terms.
export const loadOfferings = async function loadOfferings () {
  const el = this
  const root = el.state.root
  try {
    const rows = await el.call(
      '_restFetch',
      '/projects?select=name,slug,status,location,country,funding_goal,current_funding,min_investment,token_price,offerings(token_symbol,token_price,is_active)&order=created_at.desc&limit=24'
    )
    const fmt = (n) =>
      n == null
        ? '—'
        : Number(n) >= 1e6
          ? '$' + (Number(n) / 1e6).toFixed(2) + 'M'
          : Number(n) >= 1e3
            ? '$' + Math.round(Number(n) / 1e3) + 'K'
            : '$' + Number(n)
    root.update({
      backendOfferings: rows.map((p) => {
        const goal = Number(p.funding_goal) || 0
        const cur = Number(p.current_funding) || 0
        const off = (p.offerings && p.offerings[0]) || {}
        return {
          name: p.name,
          symbol: off.token_symbol || (p.slug || '').toUpperCase(),
          status: (p.status || 'draft').replace(/^./, (c) => c.toUpperCase()),
          price: '$' + (Number(off.token_price || p.token_price) || 0).toFixed(2),
          min: fmt(p.min_investment),
          raised: fmt(cur),
          goal: fmt(goal),
          pct: goal ? Math.round((cur / goal) * 100) : 0,
          closes: [p.location, p.country].filter(Boolean).join(', ') || '—'
        }
      }),
      backendOfferingsLoaded: true
    })
  } catch (e) {
    root.update({ backendOfferingsLoaded: true, backendError: e.message })
  }
}

// Registry rows for the governance dashboard.
export const loadRegistry = async function loadRegistry () {
  const el = this
  const root = el.state.root
  try {
    const rows = await el.call(
      '_restFetch',
      '/projects?select=name,slug,status,total_tokens,available_tokens,mint_address,is_paused&order=created_at.desc&limit=50'
    )
    root.update({
      backendRegistry: rows.map((p) => ({
        cells: [
          { text: p.name || p.slug, mono: true },
          { text: p.mint_address ? p.mint_address.slice(0, 4) + '…' + p.mint_address.slice(-4) : '—', mono: true },
          { text: String((Number(p.total_tokens) || 0) - (Number(p.available_tokens) || 0)), mono: true },
          { text: String(p.total_tokens ?? '—'), mono: true },
          { text: p.is_paused ? 'paused' : '—' },
          { status: (p.status || 'draft').replace(/^./, (c) => c.toUpperCase()) }
        ]
      })),
      backendRegistryLoaded: true
    })
  } catch (e) {
    root.update({ backendRegistryLoaded: true, backendError: e.message })
  }
}
