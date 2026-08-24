// Brandbook roles: Inter for body and interface copy, Neue Haas Grotesk for
// headings (Hanken Grotesk is the licensed-webfont stand-in and loads first
// so metrics stay consistent everywhere), Anton for the condensed wordmark
// and display moments, IBM Plex Mono for every figure — numeric columns must
// align.
//
// The keys in font.js generate the @font-face family names referenced here —
// keep the two files in step.

export default {
  Default: {
    isDefault: true,
    value: [
      'Inter',
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
      '"Arial Narrow"',
      'Impact',
      'sans-serif'
    ],
    type: 'sans-serif'
  },
  Mono: {
    value: [
      'IBMPlexMono',
      'ui-monospace',
      'SFMono-Regular',
      'Menlo',
      'Consolas'
    ],
    type: 'monospace'
  }
}
