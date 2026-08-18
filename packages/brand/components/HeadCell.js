export const HeadCell = {
  tag: 'span',
  flex: '1',
  minWidth: 'F',
  fontSize: 'Y',
  fontWeight: '700',
  letterSpacing: '.1em',
  textTransform: 'uppercase',
  color: 'caption',
  text: (el, s) => s.text || ''
}
