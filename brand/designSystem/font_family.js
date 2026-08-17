// Grotesk display for headings, system sans for body, mono for every number.
// Numeric columns must align, so the mono face is a first-class token here.

export default {
  Default: {
    isDefault: true,
    value: [
      '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, Helvetica, Arial'
    ],
    type: 'sans-serif'
  },
  Display: {
    value: [
      '"Space Grotesk", -apple-system, BlinkMacSystemFont, "Inter", Helvetica, Arial'
    ],
    type: 'sans-serif'
  },
  Mono: {
    value: ['"Space Mono", ui-monospace, SFMono-Regular, Menlo, Consolas'],
    type: 'monospace'
  }
}
