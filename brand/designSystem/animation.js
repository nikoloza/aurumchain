export default {
  fadeInUp: {
    from: { opacity: '0', transform: 'translate3d(0, 24px, 0)' },
    to: { opacity: '1', transform: 'translate3d(0, 0, 0)' }
  },

  // Gold pulse for live indicators (open offering, pending settlement)
  pulseGold: {
    '0%': { boxShadow: '0 0 0 0 rgba(229,179,90,0.5)' },
    '70%': { boxShadow: '0 0 0 12px rgba(229,179,90,0)' },
    '100%': { boxShadow: '0 0 0 0 rgba(229,179,90,0)' }
  },

  // Sweep used on funding bars while a subscription settles
  shimmer: {
    from: { backgroundPosition: '0% 50%' },
    to: { backgroundPosition: '200% 50%' }
  },

  spin: {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' }
  }
}
