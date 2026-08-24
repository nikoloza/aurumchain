// Two-column product shell. Every page extends this and fills Column.Body,
// then declares its own title through onCreate.
export const ShellPage = {
  extends: 'Page',
  flow: 'x',
  width: '100%',
  minHeight: '100vh',
  theme: 'document',

  Rail: {},

  Column: {
    flow: 'y',
    flex: '1',
    minWidth: '0',

    Topbar: {},

    Body: {
      tag: 'main',
      flow: 'y',
      gap: 'B',
      width: '100%',
      padding: 'B',
      animationName: 'pageEnter',
      animationDuration: 'D',
      animationTimingFunction: 'ease-out',
      animationFillMode: 'both',
      '@reduceMotion': { animationName: 'none' },
      '@tabletS': { padding: 'A Z' }
    }
  }
}
