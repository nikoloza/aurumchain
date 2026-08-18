// Web faces for the whole product. The runner builds its own HTML shell and
// ignores a project `index.html`, so a <link> to Google Fonts there never
// reaches the page — the faces must be declared here to load at all.
//
// URLs are the latin subset from fonts.googleapis.com/css2. Space Grotesk ships
// one variable file that serves every weight; Space Mono ships one file per
// weight.

export default {
  SpaceGrotesk: [
    {
      url: 'https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPbF4C_k3HqU.woff2',
      fontWeight: 400,
      fontDisplay: 'swap'
    },
    {
      url: 'https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPbF4C_k3HqU.woff2',
      fontWeight: 500,
      fontDisplay: 'swap'
    },
    {
      url: 'https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPbF4C_k3HqU.woff2',
      fontWeight: 600,
      fontDisplay: 'swap'
    },
    {
      url: 'https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPbF4C_k3HqU.woff2',
      fontWeight: 700,
      fontDisplay: 'swap'
    }
  ],

  SpaceMono: [
    {
      url: 'https://fonts.gstatic.com/s/spacemono/v17/i7dPIFZifjKcF5UAWdDRYEF8RXi4EwQ.woff2',
      fontWeight: 400,
      fontDisplay: 'swap'
    },
    {
      url: 'https://fonts.gstatic.com/s/spacemono/v17/i7dMIFZifjKcF5UAWdDRaPpZUFWaHi6WZ3Q.woff2',
      fontWeight: 700,
      fontDisplay: 'swap'
    }
  ]
}
