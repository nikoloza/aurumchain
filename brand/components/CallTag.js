// One instruction name inside a ProgramCard.
export const CallTag = {
  tag: 'span',
  fontFamily: 'Mono',
  fontSize: 'Y',
  padding: 'W Y',
  borderRadius: 'X',
  background: 'white.05',
  color: 'caption',
  border: '1px solid white.08',
  whiteSpace: 'nowrap',
  text: (el, s) => s.text || ''
}
