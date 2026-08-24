// Small neutral label. Use ChipAccent for the mist-accent variant — a tone flag on
// the chip would collide with the state a parent passes down for its text.
export const Chip = {
  tag: 'span',
  flow: 'x',
  align: 'center center',
  gap: 'W',
  fontSize: 'Y1',
  fontWeight: '600',
  letterSpacing: '.02em',
  textTransform: 'uppercase',
  padding: 'W Z',
  borderRadius: 'radiusPill',
  whiteSpace: 'nowrap',
  theme: 'chip'
}
