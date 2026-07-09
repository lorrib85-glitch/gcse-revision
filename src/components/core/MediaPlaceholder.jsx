import { useEffect, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { RADII } from '../../constants/radii.js'
import { SPACING } from '../../constants/spacing.js'
import { TYPE } from '../../constants/typography.js'
import { MOTION } from '../../constants/motion.js'

// ─── MediaPlaceholder / Image reveal ─────────────────────────────────────────
// Standard reserved slot for an image or diagram the author has NOT yet supplied.
// When `kind="imageReveal"`, the same governed media slot becomes a slow,
// progressive image reveal rather than requiring a one-off screen component.
//
// Image reveal config is supplied through `caption` so existing ModulePlayer
// wiring stays backwards compatible:
// {
//   intro?: string,
//   interval?: number,
//   images: [{ src, alt }]
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

function ImageReveal({ config, aspect, accent, rgb }) {
  const images = config?.images || []
  const interval = config?.interval || 1800
  const [index, setIndex] = useState(0)
  const [finished, setFinished] = useState(images.length <= 1)
  const [w, h] = String(aspect).split(':')

  useEffect(() => {
    setIndex(0)
    setFinished(images.length <= 1)
  }, [images.length])

  useEffect(() => {
    if (images.length <= 1) return undefined

    if (index >= images.length - 1) {
      const finishTimer = window.setTimeout(() => setFinished(true), interval)
      return () => window.clearTimeout(finishTimer)
    }

    const timer = window.setTimeout(() => setIndex(current => current + 1), interval)
    return () => window.clearTimeout(timer)
  }, [images.length, index, interval])

  const image = images[index]

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

      <div style={{
        width: '100%',
        aspectRatio: `${w || 4} / ${h || 3}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: RADII.medium,
        border: `1px solid rgba(${rgb}, 0.28)`,
        background: `radial-gradient(120% 120% at 50% 0%, rgba(${rgb},0.07), rgba(255,255,255,0.015))`,
      }}>
        {image?.src && (
          <img
            key={image.src}
            src={image.src}
            alt={image.alt || ''}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              animation: `mediaImageReveal 900ms ${MOTION.easing.standard} both`,
            }}
          />
        )}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: SPACING.micro,
        marginTop: SPACING.compact,
      }}>
        {images.map((item, itemIndex) => (
          <span
            key={item.src || itemIndex}
            aria-hidden="true"
            style={{
              width: itemIndex === index ? 18 : 6,
              height: 6,
              borderRadius: 99,
              background: itemIndex <= index ? accent : `rgba(${rgb},0.2)`,
              boxShadow: itemIndex === index ? `0 0 12px rgba(${rgb},0.45)` : 'none',
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
        {finished ? 'The four humours formed one system.' : 'Building the theory…'}
      </div>

      <style>{`
        @keyframes mediaImageReveal {
          from { opacity: 0; transform: scale(.94); filter: blur(3px); }
          to { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          img { animation-duration: 1ms !important; }
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
