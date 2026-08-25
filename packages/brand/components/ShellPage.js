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
      maxWidth: 'J',
      margin: '0 auto',
      padding: 'B C',
      animationName: 'pageEnter',
      animationDuration: 'D',
      animationTimingFunction: 'ease-out',
      animationFillMode: 'both',
      '@reduceMotion': { animationName: 'none' },
      '@screenS': { padding: 'B' },
      '@tabletS': { padding: 'A Z' },

      // Editorial page header — the topbar stays a slim breadcrumb, the page
      // announces itself in the content column instead.
      PageHead: {
        flow: 'y',
        gap: 'Y',
        width: '100%',
        paddingBottom: 'A',
        borderBottom: '1px dashed',
        borderBottomColor: 'hairline',

        H1: {
          margin: '0',
          fontFamily: 'Display',
          fontSize: 'D',
          fontWeight: '700',
          letterSpacing: '-.03em',
          lineHeight: '1.05',
          color: 'title',
          text: (el, s) => s.root.pageTitle || '',
          '@tabletS': { fontSize: 'C1' }
        },
        Lead: {
          tag: 'span',
          fontSize: 'Z',
          lineHeight: '1.5',
          color: 'caption',
          maxWidth: 'I2',
          text: (el, s) => s.root.pageLead || ''
        }
      }
    }
  }
}
