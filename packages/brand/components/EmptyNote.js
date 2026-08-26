// Placeholder line under a panel that has no live data yet.
export const EmptyNote = {
  tag: 'p',
  margin: '0',
  fontSize: 'Y1',
  color: 'caption',
  text: (el, s) => el.call('polyglot', s.text || '', s.root.lang)
}
