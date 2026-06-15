import { useState, useRef } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE }     from '../../constants/typography.js'
import { SPACING }  from '../../constants/spacing.js'
import { RADII }    from '../../constants/radii.js'
import { MOTION }   from '../../constants/motion.js'
import ContinueCTA from '../core/ContinueCTA.jsx'

function HistoryIcon({ icon, size = 32 }) {
  if (!icon) return <div style={{ width: size, height: size }} />
  return (
    <img
      src={`/icons/history/${icon}.png`}
      alt=""
      style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, display: 'block' }}
    />
  )
}

export default function KeyFigureReveal({ block, subject, onComplete }) {
  const theme  = SUBJECTS[subject] || SUBJECTS.History
  const accent = theme.accent

  const [sectionIdx, setSectionIdx] = useState(0)
  const [dragStart, setDragStart] = useState(null)
  const touchRef = useRef(null)

  const sections = block.sections || []
  const section = sections[sectionIdx] || {}
  const isLast = sectionIdx === sections.length - 1

  function advance() {
    if (isLast) {
      onComplete?.()
    } else {
      setSectionIdx(i => i + 1)
    }
  }

  function retreat() {
    if (sectionIdx > 0) {
      setSectionIdx(i => i - 1)
    }
  }

  function handleTouchStart(e) {
    touchRef.current = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    if (touchRef.current === null) return
    const dx = e.changedTouches[0].clientX - touchRef.current
    touchRef.current = null
    if (Math.abs(dx) < 44) return
    dx > 0 ? retreat() : advance()
  }

  function handleClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    (e.clientX - rect.left) / rect.width < 0.25 ? retreat() : advance()
  }

  return (
    <div style={{
      height: '100dvh',
      background: '#08090D',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
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

      {/* ── Carousel section ─────────────────────────────────────────────── */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        style={{
          flex: 1,
          position: 'relative',
          padding: `${SPACING.standard}px ${SPACING.standard}px`,
          paddingBottom: `calc(${SPACING.standard}px + env(safe-area-inset-bottom, 0px))`,
          cursor: 'pointer',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Carousel dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          marginBottom: SPACING.standard,
        }}>
          {sections.map((_, i) => (
            <div key={i} style={{
              width: 6, height: 6,
              borderRadius: '50%',
              background: i === sectionIdx ? accent : 'rgba(255,255,255,0.2)',
              transition: `background ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
            }} />
          ))}
        </div>

        {/* Section card */}
        <div key={sectionIdx} style={{
          border: `2px solid rgba(${theme.accentRgb},0.45)`,
          borderRadius: RADII.medium,
          padding: SPACING.standard,
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(${theme.accentRgb},0.07) 0%, transparent 65%),
            linear-gradient(160deg, rgba(${theme.accentRgb},0.05) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.18) 100%),
            rgba(12,9,5,0.72)
          `,
          backdropFilter: 'blur(8px)',
          boxShadow: `
            inset 0 1px 0 rgba(${theme.accentRgb},0.18),
            inset 0 -1px 0 rgba(0,0,0,0.45),
            inset 1px 0 0 rgba(${theme.accentRgb},0.06),
            inset -1px 0 0 rgba(${theme.accentRgb},0.06),
            0 4px 24px rgba(0,0,0,0.45)
          `,
          animation: `keyRevealSlide 420ms ${MOTION.easing.standard} both`,
          marginBottom: SPACING.standard,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Vignette — behind all card content */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(0,0,0,0.28) 100%)',
            pointerEvents: 'none',
          }} />

          <style>{`
            @keyframes keyRevealSlide {
              from { opacity: 0; transform: translateX(16px); }
              to   { opacity: 1; transform: translateX(0); }
            }
          `}</style>

          {/* Content sits above vignette */}
          <div style={{ position: 'relative', zIndex: 1 }}>

            {/* Section header with icon */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: SPACING.compact,
              marginBottom: SPACING.standard,
            }}>
              <HistoryIcon icon={section.icon} size={32} />
              <div style={{
                ...TYPE.metadata,
                color: accent,
                textTransform: 'uppercase',
                fontSize: 13,
              }}>
                {section.title}
              </div>
            </div>

            {/* Section content */}
            {section.lines?.map((line, i) => (
              <p key={i} style={{
                ...TYPE.bodySmall,
                color: 'rgba(245,238,225,0.8)',
                margin: `0 0 ${i < section.lines.length - 1 ? SPACING.micro : 0}px`,
                lineHeight: 1.65,
              }}>
                {line}
              </p>
            ))}

          </div>
        </div>

        {/* Swipe hint */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: SPACING.compact,
          color: 'rgba(255,255,255,0.4)',
          ...TYPE.metadata,
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          marginBottom: SPACING.standard,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Swipe to discover
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>

        {/* Continue button — only on last section */}
        {isLast && (
          <ContinueCTA onClick={(e) => { e.stopPropagation(); onComplete?.() }} accent={accent} />
        )}
      </div>
    </div>
  )
}
