// Loading placeholders — flat brand washes pulsing gently while a backend
// read is in flight. No gradients (the brand forbids them); the shimmer is
// an opacity breath. state: { w, h }
export const Skeleton = {
  borderRadius: 'radiusControl',
  background: 'veilStrong',
  width: (el, s) => s.w || '100%',
  height: (el, s) => s.h || 'A',
  animationName: 'skeletonPulse',
  animationDuration: '1.6s',
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 'infinite',
  '@reduceMotion': { animationName: 'none', opacity: '.6' }
}

// A row-shaped loading card matching OfferingRow / table-row proportions.
export const SkeletonRow = {
  flow: 'y',
  gap: 'Z',
  padding: 'A',
  borderRadius: 'radiusCard',
  theme: 'card',
  attr: { 'aria-hidden': 'true' },

  TopLine: {
    flow: 'x',
    align: 'center space-between',
    gap: 'Z',
    Skeleton: { state: { w: '28%', h: 'A1' } },
    Skeleton_1: { state: { w: '12%', h: 'A1' } }
  },
  Skeleton_2: { state: { w: '46%', h: 'Z' } },
  Skeleton_3: { state: { w: '100%', h: 'Y' } }
}
