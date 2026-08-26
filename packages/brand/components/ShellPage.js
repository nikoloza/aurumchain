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
      animationTimingFunction: 'cubic-bezier(.22,.68,.24,.98)',
      animationFillMode: 'both',
      // routeSoft stages the exit: the old page dips out before the router
      // swaps content under it. The leave animation re-declares animationName
      // so the enter animation's fill releases the properties.
      isLeaving: (el, s) => !!s.root.pageLeave,
      '.isLeaving': {
        animationName: 'pageLeave',
        animationDuration: 'B',
        animationTimingFunction: 'cubic-bezier(.55,0,.85,.4)',
        animationFillMode: 'both'
      },
      '@reduceMotion': { animationName: 'none' },
      '@screenS': { padding: 'B' },
      '@tabletS': { padding: 'A Z' },

      // Editorial page header — the topbar stays a slim breadcrumb, the page
      // announces itself in the content column instead. On entry the title
      // rises out of its mask, the lead settles after it, and the dashed rule
      // draws across — the same choreography grammar as the landing sections.
      PageHead: {
        flow: 'y',
        gap: 'Y',
        width: '100%',

        H1: {
          margin: '0',
          overflow: 'hidden',
          fontFamily: 'Display',
          fontSize: 'D',
          fontWeight: '700',
          letterSpacing: '-.03em',
          lineHeight: '1.05',
          color: 'title',
          '@tabletS': { fontSize: 'C1' },

          Line: {
            tag: 'span',
            display: 'block',
            // Descender room inside the mask, taken back outside it.
            paddingBottom: '.26em',
            marginBottom: '-.26em',
            transform: 'translate3d(0, 130%, 0)',
            animationName: 'lineUp',
            animationDuration: 'E',
            animationTimingFunction: 'cubic-bezier(.22,.68,.24,.98)',
            animationFillMode: 'both',
            animationDelay: '.06s',
            '@reduceMotion': { animationName: 'none', transform: 'none' },
            text: (el, s) => el.call('polyglot', s.root.pageTitle || '', s.root.lang)
          }
        },
        Lead: {
          tag: 'span',
          fontSize: 'Z',
          lineHeight: '1.5',
          color: 'caption',
          maxWidth: 'I2',
          opacity: '0',
          animationName: 'fadeInUp',
          animationDuration: 'E',
          animationTimingFunction: 'cubic-bezier(.22,.68,.24,.98)',
          animationFillMode: 'both',
          animationDelay: '.2s',
          '@reduceMotion': { animationName: 'none', opacity: '1' },
          text: (el, s) => el.call('polyglot', s.root.pageLead || '', s.root.lang)
        },
        Rule: {
          width: '100%',
          marginTop: 'Z',
          borderTop: '1px dashed',
          borderTopColor: 'hairline',
          transform: 'scaleX(0)',
          transformOrigin: 'left center',
          animationName: 'ruleDraw',
          animationDuration: 'F',
          animationTimingFunction: 'cubic-bezier(.22,.68,.24,.98)',
          animationFillMode: 'both',
          animationDelay: '.28s',
          '@reduceMotion': { animationName: 'none', transform: 'none' }
        }
      }
    }
  }
}
