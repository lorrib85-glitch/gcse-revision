import { useEffect, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { RADII } from '../../constants/radii.js'
import { SPACING } from '../../constants/spacing.js'
import { TYPE } from '../../constants/typography.js'
import { MOTION } from '../../constants/motion.js'

// ─── MediaPlaceholder / Image reveal ─────────────────────────────────────────
// Standard reserved slot for an image or diagram the author has NOT yet supplied.
// When `kind="imageReveal"`, the same governed media slot becomes a slow,
// progressive reveal inside one fixed frame.
//
// Image reveal config:
// {
//   intro?: string,
//   interval?: number,
//   src: string,
//   alt?: string,
//   parts?: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']
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

const QUADRANT_CLIPS = {
  topLeft: 'polygon(0 0, 50% 0, 50% 50%, 0 50%)',
  topRight: 'polygon(50% 0, 100% 0, 100% 50%, 50% 50%)',
  bottomLeft: 'polygon(0 50%, 50% 50%, 50% 100%, 0 100%)',
  bottomRight: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)',
}

function ImageReveal({ config, aspect, accent, rgb }) {
  const parts = config?.parts || ['topLeft', 'topRight', 'bottomLeft', 'bottomRight']
  const interval = config?.interval || 1500
  const [revealedCount, setRevealedCount] = useState(0)
  const [w, h] = String(aspect).split(':')
  const finished = revealedCount >= parts.length

  useEffect(() => {
    setRevealedCount(0)
  }, [config?.src, parts.length])

  useEffect(() => {
    if (!config?.src || finished) return undefined
    const timer = window.setTimeout(
      () => setRevealedCount(current => Math.min(current + 1, parts.length)),
      interval
    )
    return () => window.clearTimeout(timer)
  }, [config?.src, finished, interval, parts.length, revealedCount])

  const imageStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
  }

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
        {config?.src && (
          <>
            {/* The whole diagram is already present as a faint guide. */}
            <img
              src={config.src}
              alt=""
              aria-hidden="true"
              style={{ ...imageStyle, opacity: 0.14, filter: 'saturate(.7)' }}
            />

            {/* The same generated image is clipped into four perfectly aligned quadrants. */}
            {parts.map((part, index) => (
              <img
                key={part}
                src={config.src}
                alt=""
                aria-hidden="true"
                style={{
                  ...imageStyle,
                  clipPath: QUADRANT_CLIPS[part],
                  opacity: index < revealedCount ? 1 : 0,
                  transform: index < revealedCount ? 'scale(1)' : 'scale(.96)',
                  filter: index < revealedCount ? 'blur(0)' : 'blur(3px)',
                  transition: `opacity 900ms ${MOTION.easing.standard}, transform 900ms ${MOTION.easing.standard}, filter 900ms ${MOTION.easing.standard}`,
                }}
              />
            ))}

            {/* Final clean layer removes any visible joins once all four are revealed. */}
            <img
              src={config.src}
              alt=""
              aria-hidden="true"
              style={{
                ...imageStyle,
                opacity: finished ? 1 : 0,
                transition: `opacity 700ms ${MOTION.easing.standard}`,
              }}
            />
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
        {finished ? 'The complete four-humours system.' : 'Building the theory…'}
      </div>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          img { transition-duration: 1ms !important; }
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
