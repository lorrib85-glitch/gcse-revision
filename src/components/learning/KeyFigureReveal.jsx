import { useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE }     from '../../constants/typography.js'
import { SPACING }  from '../../constants/spacing.js'
import { RADII }    from '../../constants/radii.js'
import { BUTTONS }  from '../../constants/buttons.js'
import { MOTION }   from '../../constants/motion.js'

export default function KeyFigureReveal({ block, subject, onComplete }) {
  const theme  = SUBJECTS[subject] || SUBJECTS.History
  const accent = theme.accent

  const [pressed, setPressed] = useState(false)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#08090D',
      paddingBottom: `calc(${SPACING.cinematic}px + env(safe-area-inset-bottom, 0px))`,
    }}>

      {/* ── Portrait hero ───────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        height: '56vh',
        overflow: 'hidden',
      }}>
        <img
          src={block.portrait}
          alt={block.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            display: 'block',
          }}
        />

        {/* Gradient — heavy at bottom so name reads cleanly */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(8,9,13,0.08) 0%, rgba(8,9,13,0.12) 38%, rgba(8,9,13,0.72) 68%, rgba(8,9,13,0.98) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Name pinned to bottom of portrait */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: `0 ${SPACING.standard}px ${SPACING.standard}px`,
        }}>
          <div style={{
            ...TYPE.hero,
            fontSize: 'clamp(34px, 9vw, 48px)',
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            marginBottom: 6,
          }}>
            {block.name}
          </div>

          <div style={{
            ...TYPE.metadata,
            color: accent,
            textTransform: 'uppercase',
          }}>
            {block.role}
          </div>
        </div>
      </div>

      {/* ── Significance + knowledge sections ──────────────────────────── */}
      <div style={{ padding: `${SPACING.standard}px ${SPACING.standard}px 0` }}>

        {/* Significance — one sentence, the key takeaway */}
        <p style={{
          ...TYPE.body,
          color: 'rgba(245,238,225,0.88)',
          margin: `0 0 ${SPACING.standard}px`,
        }}>
          {block.significance}
        </p>

        {/* Sections */}
        {block.sections?.map((section, i) => (
          <div key={i}>
            <div style={{
              height: 1,
              background: 'rgba(255,255,255,0.1)',
              margin: `0 0 ${SPACING.standard}px`,
            }} />

            <div style={{
              ...TYPE.metadata,
              color: accent,
              textTransform: 'uppercase',
              marginBottom: SPACING.compact,
            }}>
              {section.title}
            </div>

            {section.lines?.map((line, j) => (
              <p key={j} style={{
                ...TYPE.bodySmall,
                color: 'rgba(245,238,225,0.7)',
                margin: `0 0 ${j < section.lines.length - 1 ? SPACING.micro : SPACING.standard}px`,
              }}>
                {line}
              </p>
            ))}
          </div>
        ))}

        {/* Final divider */}
        <div style={{
          height: 1,
          background: 'rgba(255,255,255,0.1)',
          margin: `0 0 ${SPACING.separation}px`,
        }} />

        {/* Continue button */}
        <button
          onPointerDown={() => setPressed(true)}
          onPointerUp={() => { setPressed(false); onComplete?.() }}
          onPointerLeave={() => setPressed(false)}
          style={{
            display: 'block',
            width: '100%',
            height: BUTTONS.primary.height,
            background: accent,
            color: '#08090D',
            border: 'none',
            borderRadius: BUTTONS.primary.borderRadius,
            fontFamily: "'Sora', sans-serif",
            fontSize: BUTTONS.primary.fontSize,
            fontWeight: BUTTONS.primary.fontWeight,
            cursor: 'pointer',
            transform: pressed ? `scale(${MOTION.scale.press})` : 'scale(1)',
            transition: BUTTONS.primary.transition,
          }}
        >
          Continue →
        </button>

      </div>
    </div>
  )
}
