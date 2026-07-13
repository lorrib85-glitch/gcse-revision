import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'

// Local sequence progress — carousels, swipe cards, image sets, mini-steps.
// NOT for the top module rail (that is LearningProgressHeader).
// Hard rule: never renders numbers, labels, counters, or percentages.

export default function SequenceProgress({
  total,
  current = 0,
  completed = 0,
  viewed = [],
  accent = '#C89B3C',
  accentRgb = '200,155,60',
  variant = 'dots',
  compact = false,
  stretch = false,
  ariaLabel = 'Sequence progress',
  style,
}) {
  const viewedSet = new Set(viewed)
  const useViewed = viewed.length > 0

  function getState(i) {
    if (i === current) return 'current'
    return (useViewed ? viewedSet.has(i) : i < completed) ? 'done' : 'future'
  }

  const states = Array.from({ length: total }, (_, i) => getState(i))
  const pillW = compact ? 16 : 20
  const dotD  = compact ? 6  : 8
  const segH  = compact ? 2  : 3
  const progressA11y = {
    role: 'progressbar',
    'aria-label': ariaLabel,
    'aria-valuemin': 1,
    'aria-valuemax': Math.max(total, 1),
    'aria-valuenow': Math.min(Math.max(current + 1, 1), Math.max(total, 1)),
  }

  if (variant === 'sash') {
    return (
      <div
        {...progressA11y}
        style={{ display: 'flex', gap: 6, alignItems: 'center', ...style }}
      >
        {states.map((state, i) => (
          <div key={i} style={{
            flex: 1,
            maxWidth: stretch ? 'none' : 28,
            height: segH,
            borderRadius: RADII.pill,
            background: state === 'current'
              ? accent
              : state === 'done'
              ? `rgba(${accentRgb},0.45)`
              : 'rgba(255,255,255,0.18)',
            transition: `background ${MOTION.duration.standard} ${MOTION.easing.standard}`,
          }} />
        ))}
      </div>
    )
  }

  return (
    <div
      {...progressA11y}
      style={{ display: 'flex', gap: 6, alignItems: 'center', ...style }}
    >
      {states.map((state, i) => (
        <div key={i} style={{
          width:  state === 'current' ? pillW : dotD,
          height: dotD,
          borderRadius: RADII.pill,
          background: state === 'current'
            ? accent
            : state === 'done'
            ? `rgba(${accentRgb},0.55)`
            : 'rgba(255,255,255,0.18)',
          boxShadow: state === 'current'
            ? `0 0 10px rgba(${accentRgb},0.55)`
            : state === 'done'
            ? `0 0 6px rgba(${accentRgb},0.3)`
            : 'none',
          transition: `all ${MOTION.duration.standard} ${MOTION.easing.standard}`,
        }} />
      ))}
    </div>
  )
}
