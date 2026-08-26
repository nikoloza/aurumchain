// One instruction name inside a ProgramCard.
export const CallTag = {
  tag: 'span',
  fontFamily: 'Mono',
  fontSize: 'Y',
  padding: 'W Y',
  borderRadius: 'X',
  background: 'veil',
  color: 'caption',
  border: '1px solid hairline',
  whiteSpace: 'nowrap',
  transition: 'color .2s ease, border-color .2s ease, background .2s ease',
  ':hover': { color: 'title', borderColor: 'slate.45', background: 'veilStrong' },
  text: (el, s) => s.text || ''
}
