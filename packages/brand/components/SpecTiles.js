// Guideline-page spec tiles — each one renders from the live design system,
// so the sheet can never drift from the tokens it documents.

// One rung of the spacing ladder. state: { token }
export const ScaleBar = {
  flow: 'x',
  align: 'center flex-start',
  gap: 'Z',

  Label: {
    tag: 'span',
    flexShrink: '0',
    width: 'B',
    fontFamily: 'Mono',
    fontSize: 'Y1',
    fontWeight: '600',
    letterSpacing: '.08em',
    color: 'accentInk',
    text: (el, s) => s.token || ''
  },
  Bar: {
    tag: 'span',
    height: 'Y',
    borderRadius: 'E',
    background: 'meter',
    width: (el, s) => s.token || 'A'
  }
}

// One step of the type scale. state: { size, sample }
export const TypeRamp = {
  flow: 'x',
  align: 'baseline flex-start',
  gap: 'A',
  paddingBottom: 'Z',
  borderBottom: '1px dashed hairline',

  Label: {
    tag: 'span',
    flexShrink: '0',
    width: 'C',
    fontFamily: 'Mono',
    fontSize: 'Y1',
    fontWeight: '600',
    letterSpacing: '.08em',
    color: 'accentInk',
    text: (el, s) => s.size || ''
  },
  Sample: {
    tag: 'span',
    fontFamily: 'Display',
    fontWeight: '600',
    letterSpacing: '-.02em',
    lineHeight: '1.1',
    color: 'title',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: (el, s) => s.size || 'A',
    text: (el, s) => s.sample || 'Assets, made liquid'
  }
}

// One radius token. state: { radius, label }
export const RadiusTile = {
  flow: 'y',
  align: 'center center',
  gap: 'Y',

  Box: {
    width: 'E',
    height: 'D',
    border: '1px solid hairline',
    background: 'veil',
    borderRadius: (el, s) => s.radius || 'radiusCard'
  },
  Name: {
    tag: 'span',
    fontFamily: 'Mono',
    fontSize: 'Y1',
    color: 'caption',
    text: (el, s) => s.label || ''
  }
}

// One keyframe, looping live. The animation rides the wrapper so it never
// overwrites the diamond's rotation. state: { anim, dur, alt }
export const MotionTile = {
  flow: 'y',
  align: 'center center',
  gap: 'Z',
  padding: 'B Z',
  borderRadius: 'radiusCard',
  theme: 'card',
  transition: 'transform .25s ease, border-color .25s ease',
  ':hover': { transform: 'translateY(-2px)', borderColor: 'slate.45' },

  Stage: {
    flow: 'x',
    align: 'center center',
    height: 'D',

    Demo: {
      display: 'inline-flex',
      animationName: (el, s) => s.anim || 'skeletonPulse',
      animationDuration: (el, s) => s.dur || '2s',
      animationTimingFunction: 'ease-in-out',
      animationIterationCount: 'infinite',
      animationDirection: (el, s) => (s.alt ? 'alternate' : 'normal'),
      '@reduceMotion': { animationName: 'none' },

      Shape: {
        tag: 'span',
        width: 'A',
        height: 'A',
        background: 'accentInk',
        transform: 'rotate(45deg)'
      }
    }
  },

  Name: {
    tag: 'span',
    fontFamily: 'Mono',
    fontSize: 'Y1',
    letterSpacing: '.06em',
    color: 'caption',
    text: (el, s) => s.anim || ''
  }
}

// One icon from the set. state: { name }
export const IconCell = {
  flow: 'y',
  align: 'center center',
  gap: 'Y',
  padding: 'Z Y',
  borderRadius: 'radiusControl',
  transition: 'background .2s ease, color .2s ease',
  color: 'paragraph',
  ':hover': { background: 'veil', color: 'title' },

  Icon: { name: (el, s) => s.name || 'chart', fontSize: 'B' },
  Label: {
    tag: 'span',
    fontFamily: 'Mono',
    fontSize: 'Y',
    color: 'caption',
    text: (el, s) => s.name || ''
  }
}
