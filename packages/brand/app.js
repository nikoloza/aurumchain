// Brand project root — the guidelines sheet boots standalone; the same
// folder doubles as the fractyco/uikit shared library for the surfaces.
export default {
  // An explicit non-empty scope stops the frank serializer from producing a
  // cyclic __proto__ when the root carries no scope of its own. Required for
  // server-side publish.
  scope: { __local: true },

  metadata: {
    siteName: 'Fractyco',
    type: 'website',
    locale: 'en_US'
  }
}
