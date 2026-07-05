import { GENERAL } from '../../constants/generalTheme.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'

export default function CircularTimer({
  seconds,
  totalSeconds,
  size = 84,
  stroke = 4,
  label = 'SEC',
  color = GENERAL.teal,
  trackColor = 'rgba(255,255,255,0.08)',
  valueStyle = {},
  labelStyle = {},
  ariaLabel,
}) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.max(0, Math.min(1, totalSeconds ? seconds / totalSeconds : 0))
  const offset = circumference * (1 - pct)

  return (
    <div
      aria-label={ariaLabel || `${seconds} ${label.toLowerCase()} left`}
      style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: `stroke-dashoffset ${MOTION.duration.standard} ${MOTION.easing.linear}` }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ ...TYPE.titleMedium, fontWeight: 700, color: GENERAL.softWhite, lineHeight: 1, fontVariantNumeric: 'tabular-nums', ...valueStyle }}>{seconds}</span>
        <span style={{ ...TYPE.metadata, color: GENERAL.slate, marginTop: 3, ...labelStyle }}>{label}</span>
      </div>
    </div>
  )
}
