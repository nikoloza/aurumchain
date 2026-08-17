// Session + sign-in against the platform Supabase (project qetdqwmmnpmgrixkorqg).
//
// Every exported handler is SELF-CONTAINED: the URL and the publishable key are
// inlined in each body, and no handler references a module-scope helper. The
// platform serializer keeps exported handler bodies as bare strings, so a
// module-scope `const HELPER = …` resolves to undefined at runtime. Shared
// steps are exported and reached through `el.call('name', …)` instead.
//
// The publishable key is browser-safe by design — row access is governed by
// RLS on the backend.

// ─── exported low-level helpers (call via el.call) ──────────────────────────

export const _authFetch = async function _authFetch (path, opts) {
  const SUPABASE_URL = 'https://qetdqwmmnpmgrixkorqg.supabase.co'
  const SUPABASE_KEY = 'sb_publishable_U1B0i51SLQFUZqzT0OKslw_7zf7g9GQ'
  const o = opts || {}
  const r = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    method: o.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      ...(o.headers || {})
    },
    body: o.body ? JSON.stringify(o.body) : undefined
  })
  const text = await r.text()
  let body = null
  try { body = text ? JSON.parse(text) : null } catch (e) { body = { message: text } }
  if (!r.ok) {
    const msg = body?.error_description || body?.msg || body?.message || 'HTTP ' + r.status
    const err = new Error(msg)
    err.status = r.status
    throw err
  }
  return body
}

export const _readSession = function _readSession () {
  // Storage access goes through the element's own document — handler code
  // runs in a second realm whose bare `localStorage` is a DIFFERENT store,
  // and a session written there is invisible to the page (and vice versa).
  const el = this
  const win =
    (el && el.node && el.node.ownerDocument.defaultView) ||
    (el && el.__ref && el.__ref.root && el.__ref.root.node && el.__ref.root.node.ownerDocument.defaultView) ||
    (typeof window !== 'undefined' ? window : null)
  if (!win || !win.localStorage) return null
  try { return JSON.parse(win.localStorage.getItem('fractyco_session') || 'null') }
  catch (e) { return null }
}

export const _writeSession = function _writeSession (s) {
  // Same page-realm resolution as _readSession — see the note there.
  const el = this
  const win =
    (el && el.node && el.node.ownerDocument.defaultView) ||
    (el && el.__ref && el.__ref.root && el.__ref.root.node && el.__ref.root.node.ownerDocument.defaultView) ||
    (typeof window !== 'undefined' ? window : null)
  if (!win || !win.localStorage) return
  try {
    if (s) win.localStorage.setItem('fractyco_session', JSON.stringify(s))
    else win.localStorage.removeItem('fractyco_session')
  } catch (e) {}
}

export const _isExpired = function _isExpired (s) {
  if (!s || !s.expires_at) return true
  return (Date.now() / 1000) >= (Number(s.expires_at) - 30)
}

export const _userFromSession = function _userFromSession (s) {
  if (!s?.user) return null
  const email = s.user.email || ''
  const meta = s.user.user_metadata || {}
  const name = (meta.full_name || meta.name || email.split('@')[0])
    .split(/[._\s-]/).filter(Boolean)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ') || 'Investor'
  return { id: s.user.id, email, name }
}

// ─── public auth handlers ───────────────────────────────────────────────────

export const signin = async function signin () {
  const el = this
  const root = el.state.root
  const email = (root.signinEmail || '').trim()
  const password = root.signinPassword || ''

  if (!email || !password) {
    root.update({ authError: 'Email and password are required.', authLoading: false })
    return
  }

  root.update({ authLoading: true, authError: null }, { preventFetch: true })

  try {
    const session = await el.call('_authFetch', '/token?grant_type=password', {
      method: 'POST',
      body: { email, password }
    })
    el.call('_writeSession', session)
    const user = el.call('_userFromSession', session)
    // The raw session stays OUT of root state — localStorage is the session
    // store. State carries flat scalars only: a nested object in an update
    // sends the renderer into unbounded recursion.
    // HARD navigation, not the SPA router. A route transition away from the
    // login page re-renders the still-mounted LoginCard mid-create and the
    // renderer recurses to death. A reload boots '/' cleanly, and openPage's
    // silent pickup reads the session that was just written.
    const win =
      (el.node && el.node.ownerDocument.defaultView) ||
      (el.__ref && el.__ref.root && el.__ref.root.node && el.__ref.root.node.ownerDocument.defaultView) ||
      window
    win.location.href = '/'
  } catch (e) {
    root.update({
      authLoading: false,
      authError: e.message === 'Invalid login credentials'
        ? 'Wrong email or password.'
        : (e.message || 'Sign-in failed.')
    })
  }
}

export const signout = function signout () {
  const el = this
  el.call('_writeSession', null)
  // Hard navigation for the same reason as signin — see the note there.
  const win =
    (el.node && el.node.ownerDocument.defaultView) ||
    (el.__ref && el.__ref.root && el.__ref.root.node && el.__ref.root.node.ownerDocument.defaultView) ||
    window
  win.location.href = '/login'
}

// Idempotent — safe to call from every page's onRender. It writes state at
// most ONCE per boot (the signedIn early-return), and a miss writes nothing,
// so it can never feed a render loop.
export const restoreSession = function restoreSession () {
  const el = this
  const root = el.state.root
  if (root.signedIn) return true
  const session = el.call('_readSession')
  if (!session || el.call('_isExpired', session)) {
    if (session) el.call('_writeSession', null)
    return false
  }
  const user = el.call('_userFromSession', session)
  root.update({
    signedIn: true,
    userEmail: user ? user.email : '',
    userName: user ? user.name : ''
  }, { preventFetch: true })
  return true
}
