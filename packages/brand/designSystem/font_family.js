// Grotesk display for headings, system sans for body, mono for every number.
// Numeric columns must align, so the mono face is a first-class token here.
//
// `SpaceGrotesk` and `SpaceMono` are the @font-face family names generated from
// the keys in font.js — keep the two files in step.

export default {
  Default: {
    isDefault: true,
    value: [
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Inter',
      '"Segoe UI"',
      'Roboto',
      'Helvetica',
      'Arial'
    ],
    type: 'sans-serif'
  },
  Brand: {
    value: [
      'ClashDisplay',
      '"Clash Display"',
      'system-ui',
      'sans-serif'
    ],
    type: 'sans-serif'
  },
  Display: {
    value: [
      'SpaceGrotesk',
      'system-ui',
      '-apple-system',
      'BlinkMacSystemFont',
      'Inter',
      'Helvetica',
      'Arial'
    ],
    type: 'sans-serif'
  },
  Mono: {
    value: [
      'SpaceMono',
      'ui-monospace',
      'SFMono-Regular',
      'Menlo',
      'Consolas'
    ],
    type: 'monospace'
  }
}
