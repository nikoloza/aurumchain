// Web faces for the whole product. The runner builds its own HTML shell and
// ignores a project `index.html`, so a <link> to Google Fonts there never
// reaches the page — the faces must be declared here to load at all.
//
// The brandbook sets Neue Haas Grotesk for headings and Inter for body copy.
// NHG is a commercial face, so the guaranteed webfont for the heading role is
// Hanken Grotesk — the closest open equivalent — with NHG ahead of it in the
// family stack for machines that carry a license. Anton carries the condensed
// display voice of the wordmark. IBM Plex Mono sets every figure.
//
// TBC Contractica carries GEORGIAN. None of the Latin brand faces has Georgian
// glyphs, so without it the ka locale fell back to whatever the OS happened to
// ship. It sits last in every stack in font_family.js — the browser resolves
// per glyph, so Latin keeps the brand face and Georgian gets a designed one.
//
// EVERY entry uses the ARRAY form on purpose. The object form with
// `isVariable: true` and a gstatic URL makes the design system emit
// `@import url('….woff2')` — not valid CSS for a font file — and that one bad
// entry took the whole injected block down with it, so NO face loaded on any
// surface and everything silently rendered in system-ui. The array form emits
// real `@font-face` rules; a weight range still works as a `fontWeight` string.

export default {
  Inter: [
    {
      url: 'https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2',
      fontWeight: '100 900',
      fontDisplay: 'swap'
    }
  ],

  HankenGrotesk: [
    {
      url: 'https://fonts.gstatic.com/s/hankengrotesk/v12/ieVn2YZDLWuGJpnzaiwFXS9tYtpd59CxCis4.woff2',
      fontWeight: '100 900',
      fontDisplay: 'swap'
    }
  ],

  Anton: [
    {
      url: 'https://fonts.gstatic.com/s/anton/v27/1Ptgg87LROyAm3Kz-C8CSKlv.woff2',
      fontWeight: 400,
      fontDisplay: 'swap'
    }
  ],

  IBMPlexMono: [
    {
      url: 'https://fonts.gstatic.com/s/ibmplexmono/v20/-F63fjptAgt5VM-kVkqdyU8n1i8q131nj-o.woff2',
      fontWeight: 400,
      fontDisplay: 'swap'
    },
    {
      url: 'https://fonts.gstatic.com/s/ibmplexmono/v20/-F6qfjptAgt5VM-kVkqdyU8n3twJwlBFgsAXHNk.woff2',
      fontWeight: 500,
      fontDisplay: 'swap'
    },
    {
      url: 'https://fonts.gstatic.com/s/ibmplexmono/v20/-F6qfjptAgt5VM-kVkqdyU8n3vAOwlBFgsAXHNk.woff2',
      fontWeight: 600,
      fontDisplay: 'swap'
    }
  ],

  // Georgian, across the same weight range the Latin faces cover, so a bold
  // Georgian headline is genuinely bold rather than a synthesised smear.
  TBCContractica: [
    { url: 'https://assets.symbo.ls/fonts/Contractica/TBCContractica-Book.woff2', fontWeight: 100, fontDisplay: 'swap' },
    { url: 'https://assets.symbo.ls/fonts/Contractica/TBCContractica-Light.woff2', fontWeight: 300, fontDisplay: 'swap' },
    { url: 'https://assets.symbo.ls/fonts/Contractica/TBCContractica-Regular.woff2', fontWeight: 400, fontDisplay: 'swap' },
    { url: 'https://assets.symbo.ls/fonts/Contractica/TBCContractica-Medium.woff2', fontWeight: 500, fontDisplay: 'swap' },
    { url: 'https://assets.symbo.ls/fonts/Contractica/TBCContractica-Bold.woff2', fontWeight: 700, fontDisplay: 'swap' },
    { url: 'https://assets.symbo.ls/fonts/Contractica/TBCContractica-Black.woff2', fontWeight: 900, fontDisplay: 'swap' }
  ]
}
