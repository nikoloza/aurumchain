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
// URLs are the latin subsets from fonts.gstatic.com; the variable files serve
// every weight from one request.

export default {
  Inter: {
    url: 'https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7W0Q5nw.woff2',
    isVariable: true,
    fontWeight: '100 900',
    fontDisplay: 'swap'
  },

  HankenGrotesk: {
    url: 'https://fonts.gstatic.com/s/hankengrotesk/v12/ieVn2YZDLWuGJpnzaiwFXS9tYtpd59CxCis4.woff2',
    isVariable: true,
    fontWeight: '100 900',
    fontDisplay: 'swap'
  },

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
  ]
}
