// Landing root — a static marketing surface. No auth and no session: the
// investor product lives in the `app` project, the operator console in `admin`.
export default {
  // An explicit non-empty scope stops the frank serializer from producing a
  // cyclic __proto__ when the root carries no scope of its own. Required for
  // server-side publish.
  scope: { __local: true },

  // App-level SEO base. Per-page metadata overrides these. STATIC scalars
  // only — a function or array here makes helmet drop the per-page <title>.
  metadata: {
    siteName: 'Fractyco',
    type: 'website',
    locale: 'en_US'
  }
}
