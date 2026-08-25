export default {
  // Mount reveal for marketing sections. Used through `animationName` rather
  // than a `[data-reveal]` attribute — the runner's HTML shell carries no
  // stylesheet of ours to define one.
  fcReveal: {
    from: { opacity: '0', transform: 'translate3d(0, 20px, 0)' },
    to: { opacity: '1', transform: 'translate3d(0, 0, 0)' }
  },

  fadeInUp: {
    from: { opacity: '0', transform: 'translate3d(0, 24px, 0)' },
    to: { opacity: '1', transform: 'translate3d(0, 0, 0)' }
  },

  // Slate pulse for live indicators (open offering, pending settlement)
  pulseAccent: {
    '0%': { boxShadow: '0 0 0 0 rgba(96,125,148,0.45)' },
    '70%': { boxShadow: '0 0 0 12px rgba(96,125,148,0)' },
    '100%': { boxShadow: '0 0 0 0 rgba(96,125,148,0)' }
  },

  // Sweep used on funding bars while a subscription settles
  shimmer: {
    from: { backgroundPosition: '0% 50%' },
    to: { backgroundPosition: '200% 50%' }
  },

  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' }
  },

  // Seamless ticker loop — the track holds two copies of its run
  marquee: {
    from: { transform: 'translate3d(0, 0, 0)' },
    to: { transform: 'translate3d(-50%, 0, 0)' }
  },

  // Loading-wash breath for Skeleton placeholders
  skeletonPulse: {
    '0%': { opacity: '.45' },
    '50%': { opacity: '1' },
    '100%': { opacity: '.45' }
  },

  // Masked headline lines — the span rises out of an overflow-hidden mask
  lineUp: {
    from: { transform: 'translate3d(0, 112%, 0)' },
    to: { transform: 'translate3d(0, 0, 0)' }
  },

  // Route-entry settle for the product shells
  pageEnter: {
    from: { opacity: '0', transform: 'translate3d(0, 10px, 0)' },
    to: { opacity: '1', transform: 'translate3d(0, 0, 0)' }
  },

  // Terminal caret in the settlement log
  blink: {
    '0%': { opacity: '1' },
    '49%': { opacity: '1' },
    '50%': { opacity: '0' },
    '100%': { opacity: '0' }
  },

  // Slow ambient drift for decorative lattices on the navy bands
  floatY: {
    '0%': { transform: 'translate3d(0, 0, 0)' },
    '50%': { transform: 'translate3d(0, -14px, 0)' },
    '100%': { transform: 'translate3d(0, 0, 0)' }
  },

  // Scroll-cue line dropping through its mask
  cueDrop: {
    from: { transform: 'translateY(-110%)' },
    to: { transform: 'translateY(110%)' }
  },

  // A diamond gliding once along the state-machine rail after it draws
  railGlide: {
    '0%': { left: '0%', opacity: '0' },
    '10%': { opacity: '1' },
    '88%': { opacity: '1' },
    '100%': { left: '100%', opacity: '0' }
  },

  // Hard-edged scan strip sweeping a live funding bar — flat color, no gradient
  barSweep: {
    from: { left: '-16%' },
    to: { left: '112%' }
  }
}
