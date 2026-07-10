import { useEffect, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { RADII } from '../../constants/radii.js'
import { SPACING } from '../../constants/spacing.js'
import { TYPE } from '../../constants/typography.js'
import { MOTION } from '../../constants/motion.js'

// ─── MediaPlaceholder / Image reveal ─────────────────────────────────────────
// Standard reserved slot for an image or diagram the author has NOT yet supplied.
// When `kind="imageReveal"`, the same governed media slot becomes a slow,
// progressive reveal inside one fixed frame: one image per quadrant, revealed
// in turn, then optional animated arrows linking opposite quadrants.
//
// Image reveal config:
// {
//   intro?: string,
//   interval?: number,
//   images: { topLeft: src, topRight: src, bottomLeft: src, bottomRight: src },
//   alt?: string,
//   parts?: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],  // reveal order
//   opposites?: [['topLeft', 'bottomRight'], ['topRight', 'bottomLeft']],
//   finished?: string,  // caption shown once every quadrant is revealed
// }

function Glyph({ kind, accent }) {
  const stroke = { fill: 'none', stroke: accent, strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', opacity: 0.7 }
  if (kind === 'diagram') {
    return (
      <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
        <circle cx="8" cy="8" r="3.5" {...stroke} />
        <circle cx="26" cy="8" r="3.5" {...stroke} />
        <circle cx="8" cy="26" r="3.5" {...stroke} />
        <circle cx="26" cy="26" r="3.5" {...stroke} />
        <line x1="8" y1="26" x2="26" y2="8" {...stroke} />
      </svg>
    )
  }
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
      <rect x="4" y="6" width="26" height="22" rx="3" {...stroke} />
      <circle cx="12" cy="14" r="2.5" {...stroke} />
      <path d="M6 26 L14 18 L20 24 L24 20 L28 24" {...stroke} />
    </svg>
  )
}

// Each quadrant image is a separate asset anchored to its own corner of the frame.
const QUADRANT_POSITIONS = {
  topLeft: { top: 0, left: 0 },
  topRight: { top: 0, right: 0 },
  bottomLeft: { bottom: 0, left: 0 },
  bottomRight: { bottom: 0, right: 0 },
}

// Quadrant centres in the 0–100 viewBox of the arrow overlay.
const QUADRANT_CENTRES = {
  topLeft: [25, 25],
  topRight: [75, 25],
  bottomLeft: [25, 75],
  bottomRight: [75, 75],
}

// Trim an opposite-pair line evenly at both ends so it bridges the centre —
// each arrowhead reaches into its quadrant without covering that humour's title.
function oppositeArrowLine(from, to, trimStart = 0.24, trimEnd = 0.24) {
  const [ax, ay] = QUADRANT_CENTRES[from]
  const [bx, by] = QUADRANT_CENTRES[to]
  return {
    x1: ax + (bx - ax) * trimStart,
    y1: ay + (by - ay) * trimStart,
    x2: bx - (bx - ax) * trimEnd,
    y2: by - (by - ay) * trimEnd,
    angle: (Math.atan2(by - ay, bx - ax) * 180) / Math.PI,
  }
}

function ImageReveal({ config, aspect, accent, rgb }) {
  const parts = (config?.parts || ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'])
    .filter(part => config?.images?.[part])
  const interval = config?.interval || 1500
  const opposites = config?.opposites || []
  const [revealedCount, setRevealedCount] = useState(0)
  const [showOpposites, setShowOpposites] = useState(false)
  const [w, h] = String(aspect).split(':')
  const finished = parts.length > 0 && revealedCount >= parts.length

  useEffect(() => {
    setRevealedCount(0)
    setShowOpposites(false)
  }, [config?.images, parts.length])

  useEffect(() => {
    if (parts.length === 0 || finished) return undefined
    const timer = window.setTimeout(
      () => setRevealedCount(current => Math.min(current + 1, parts.length)),
      interval
    )
    return () => window.clearTimeout(timer)
  }, [finished, interval, parts.length, revealedCount])

  // Let the last quadrant settle before the opposite arrows draw in.
  useEffect(() => {
    if (!finished || opposites.length === 0) return undefined
    const timer = window.setTimeout(() => setShowOpposites(true), 900)
    return () => window.clearTimeout(timer)
  }, [finished, opposites.length])

  const tileStyle = part => ({
    position: 'absolute',
    width: 'calc(50% - 2px)',
    height: 'calc(50% - 2px)',
    objectFit: 'contain',
    display: 'block',
    ...QUADRANT_POSITIONS[part],
  })

  return (
    <div style={{ width: '100%' }}>
      {config?.intro && (
        <p style={{
          ...TYPE.caption,
          color: 'rgba(245,245,245,0.56)',
          textAlign: 'center',
          margin: `0 0 ${SPACING.compact}px`,
        }}>
          {config.intro}
        </p>
      )}

      <div
        role="img"
        aria-label={config?.alt || 'Image revealed in four parts'}
        style={{
          width: '100%',
          aspectRatio: `${w || 1} / ${h || 1}`,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: RADII.medium,
          border: `1px solid rgba(${rgb}, 0.28)`,
          background: `radial-gradient(120% 120% at 50% 0%, rgba(${rgb},0.07), rgba(255,255,255,0.015))`,
        }}
      >
        {parts.length > 0 && (
          <>
            {/* The whole diagram is already present as a faint guide. */}
            {parts.map(part => (
              <img
                key={`guide-${part}`}
                src={config.images[part]}
                alt=""
                aria-hidden="true"
                style={{ ...tileStyle(part), opacity: 0.14, filter: 'saturate(.7)' }}
              />
            ))}

            {/* Each quadrant's own artwork fades in, one at a time. */}
            {parts.map((part, index) => (
              <img
                key={part}
                src={config.images[part]}
                alt=""
                aria-hidden="true"
                style={{
                  ...tileStyle(part),
                  opacity: index < revealedCount ? 1 : 0,
                  transform: index < revealedCount ? 'scale(1)' : 'scale(.96)',
                  filter: index < revealedCount ? 'blur(0)' : 'blur(3px)',
                  transition: `opacity 900ms ${MOTION.easing.standard}, transform 900ms ${MOTION.easing.standard}, filter 900ms ${MOTION.easing.standard}`,
                }}
              />
            ))}

            {/* Once complete, arrows draw in between opposite quadrants. */}
            {opposites.length > 0 && (
              <svg
                viewBox="0 0 100 100"
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  filter: `drop-shadow(0 0 6px rgba(${rgb},0.45))`,
                }}
              >
                {opposites.map(([from, to], pairIndex) => {
                  const line = oppositeArrowLine(from, to)
                  const drawDelay = pairIndex * 500
                  const headStyle = {
                    fill: 'none',
                    stroke: accent,
                    strokeWidth: 2,
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    opacity: showOpposites ? 1 : 0,
                    transition: `opacity 400ms ${MOTION.easing.standard} ${drawDelay + 500}ms`,
                  }
                  return (
                    <g key={`${from}-${to}`} data-reveal-anim="true">
                      <line
                        x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                        stroke="rgba(8,9,13,0.38)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        style={{
                          opacity: showOpposites ? 1 : 0,
                          transition: `opacity 400ms ${MOTION.easing.standard} ${drawDelay}ms`,
                        }}
                      />
                      <line
                        x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                        stroke={accent}
                        strokeWidth="2"
                        strokeLinecap="round"
                        pathLength="1"
                        strokeDasharray="1"
                        style={{
                          strokeDashoffset: showOpposites ? 0 : 1,
                          transition: `stroke-dashoffset 700ms ${MOTION.easing.standard} ${drawDelay}ms`,
                        }}
                      />
                      {/* Chevron heads at both ends, pointing outward at each quadrant. */}
                      <path
                        d="M -3 4 L 0 0 L 3 4"
                        transform={`translate(${line.x1} ${line.y1}) rotate(${line.angle - 90})`}
                        style={headStyle}
                      />
                      <path
                        d="M -3 4 L 0 0 L 3 4"
                        transform={`translate(${line.x2} ${line.y2}) rotate(${line.angle + 90})`}
                        style={headStyle}
                      />
                    </g>
                  )
                })}
              </svg>
            )}
          </>
        )}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: SPACING.micro,
        marginTop: SPACING.compact,
      }}>
        {parts.map((part, index) => (
          <span
            key={part}
            aria-hidden="true"
            style={{
              width: index === Math.min(revealedCount, parts.length - 1) && !finished ? 18 : 6,
              height: 6,
              borderRadius: 99,
              background: index < revealedCount ? accent : `rgba(${rgb},0.2)`,
              boxShadow: index === revealedCount - 1 && !finished ? `0 0 12px rgba(${rgb},0.45)` : 'none',
              transition: `all ${MOTION.duration.slow} ${MOTION.easing.standard}`,
            }}
          />
        ))}
      </div>

      <div aria-live="polite" style={{
        ...TYPE.caption,
        minHeight: 20,
        textAlign: 'center',
        color: finished ? `rgba(${rgb},0.88)` : 'rgba(245,245,245,0.4)',
        marginTop: SPACING.micro,
      }}>
        {finished ? (config?.finished || 'The complete four-humours system.') : 'Building the theory…'}
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          img, [data-reveal-anim] line, [data-reveal-anim] path {
            transition-duration: 1ms !important;
            transition-delay: 0ms !important;
          }
        }
      `}</style>
    </div>
  )
}

export default function MediaPlaceholder({ kind = 'image', aspect = '16:9', caption, subject = 'History' }) {
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const accent = theme.accent
  const rgb = theme.accentRgb

  if (kind === 'imageReveal') {
    return <ImageReveal config={caption} aspect={aspect} accent={accent} rgb={rgb} />
  }

  const [w, h] = String(aspect).split(':')
  const label = kind === 'diagram' ? 'Diagram coming soon' : 'Image coming soon'

  return (
    <div
      role="img"
      aria-label={`${label}${caption ? `: ${caption}` : ''}`}
      style={{
        width: '100%',
        aspectRatio: `${w || 16} / ${h || 9}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.compact,
        textAlign: 'center',
        padding: SPACING.standard,
        boxSizing: 'border-box',
        borderRadius: RADII.medium,
        border: `1px dashed rgba(${rgb}, 0.35)`,
        background: `radial-gradient(120% 120% at 50% 0%, rgba(${rgb},0.05), rgba(255,255,255,0.015))`,
      }}
    >
      <Glyph kind={kind} accent={accent} />
      <div style={{ ...TYPE.label, fontWeight: 600, color: `rgba(${rgb}, 0.9)` }}>
        {label}
      </div>
      {caption && (
        <div style={{ ...TYPE.caption, color: 'rgba(245,245,245,0.5)', maxWidth: 280 }}>
          {caption}
        </div>
      )}
    </div>
  )
}
