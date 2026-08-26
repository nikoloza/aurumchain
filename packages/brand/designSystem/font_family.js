// Brandbook roles: Inter for body and interface copy, Neue Haas Grotesk for
// headings (Hanken Grotesk is the licensed-webfont stand-in and loads first
// so metrics stay consistent everywhere), Anton for the condensed wordmark
// and display moments, IBM Plex Mono for every figure — numeric columns must
// align.
//
// The keys in font.js generate the @font-face family names referenced here —
// keep the two files in step.
//
// 'TBCContractica' carries Georgian and sits DIRECTLY BEHIND the Latin brand
// face in every stack — never at the end. Fallback resolves per glyph and
// first match wins, so `system-ui`/`Helvetica`/`Arial` (which all ship
// Georgian) would otherwise claim the ka locale before Contractica was ever
// reached. In this order Latin keeps the brand face, Georgian gets Contractica,
// and one run of text can hold both scripts. It is also what makes a bold
// Georgian headline real rather than synthesised: Contractica ships to 900.

export default {
  Default: {
    isDefault: true,
    value: [
      'Inter',
      'TBCContractica',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Helvetica',
      'Arial'
    ],
    type: 'sans-serif'
  },
  Display: {
    value: [
      'HankenGrotesk',
      '"Neue Haas Grotesk Display Pro"',
      'TBCContractica',
      '"Helvetica Neue"',
      'Helvetica',
      'Inter',
      'Arial'
    ],
    type: 'sans-serif'
  },
  Brand: {
    value: [
      'Anton',
      'TBCContractica',
      '"Arial Narrow"',
      'Impact',
      'sans-serif'
    ],
    type: 'sans-serif'
  },
  Mono: {
    value: [
      'IBMPlexMono',
      'TBCContractica',
      'ui-monospace',
      'SFMono-Regular',
      'Menlo',
      'Consolas'
    ],
    type: 'monospace'
  }
}
