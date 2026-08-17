// Left navigation rail. Groups come from root state so both surfaces share
// this component and differ only in their data.
export const Rail = {
  tag: 'aside',
  flow: 'y',
  gap: 'A',
  flexShrink: '0',
  width: 'H',
  minHeight: '100vh',
  padding: 'A Z',
  theme: 'rail',
  borderRight: '1px solid white.06',
  position: 'sticky',
  top: '0',
  '@tabletL': { display: 'none' },

  Head: { padding: 'X Z', Logo: {} },

  Groups: {
    flow: 'y',
    gap: 'A',
    width: '100%',
    childExtends: 'SideGroup',
    childrenAs: 'state',
    children: (el, s) => s.root.nav || []
  }
}
