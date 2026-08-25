// Offerings-list row — the brand OfferingRow with the app's motion on top
// (a staggered fade on load, a hover lift, and a funding meter that draws
// itself once the list's `inView` flag settles), plus the app's wiring:
// Subscribe acknowledges through the AppToast while subscription writes are
// not on the backend yet, and disables itself once the sale has completed.
// state: OfferingRow's, plus { revealDelay }
export const OfferingItem = {
  extends: 'OfferingRow',
  transition: (el, s) =>
    'opacity .7s cubic-bezier(.22,.68,.24,.98) ' + (s.revealDelay || '0s') +
    ', transform .25s ease, border-color .25s ease',
  opacity: '0',
  isRevealed: (el, s) => el.call('inheritedInView', s),
  '.isRevealed': { opacity: '1' },
  ':hover': { transform: 'translateY(-2px)', borderColor: 'slate.45' },
  '@reduceMotion': { opacity: '1', transition: 'none', ':hover': { transform: 'none' } },

  Head: {
    Right: {
      ActionButton: {
        // ActionButton carries its own { tone } state — the offering row's
        // fields live one level up the state chain.
        disabled: (el, s) =>
          String((s.parent && s.parent.status) || '').toLowerCase() === 'completed'
            ? true
            : null,
        ':disabled': { opacity: '.4', boxShadow: 'none', pointerEvents: 'none' },
        onClick: (e, el) => el.call('appNotify')
      }
    }
  },

  Bar: {
    Fill: {
      width: (el, s) =>
        el.call('inheritedInView', s) ? `${Math.min(100, Number(s.pct) || 0)}%` : '0%',
      transition: 'width 1.3s cubic-bezier(.22,.68,.24,.98) .35s',
      '@reduceMotion': { transition: 'none' }
    }
  },

  Meta: {
    // A completed sale reads "closed", never "closes closed".
    Closes: {
      text: (el, s) => {
        const when = String(s.closes || '')
        if (!when || when === '—') return ''
        return when.toLowerCase() === 'closed' ? 'closed' : `closes ${when}`
      }
    }
  }
}
