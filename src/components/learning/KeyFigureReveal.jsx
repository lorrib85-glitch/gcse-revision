import { useState, useRef } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE }     from '../../constants/typography.js'
import { SPACING }  from '../../constants/spacing.js'
import { RADII }    from '../../constants/radii.js'
import { MOTION }   from '../../constants/motion.js'

function SectionIcon({ icon, accent }) {
  if (icon === 'head') return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  )
  if (icon === 'droplet') return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={accent}>
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.32 0z" />
    </svg>
  )
  if (icon === 'eye') return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
  if (icon === 'network') return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke={accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="18" r="3" />
      <line x1="12" y1="8" x2="6" y2="15" />
      <line x1="12" y1="8" x2="18" y2="15" />
    </svg>
  )
  return null
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
    const rect = e.currentTarget.getBoundingClientRect()
    (e.clientX - rect.left) / rect.width < 0.25 ? retreat() : advance()
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#08090D',
      paddingBottom: `calc(${SPACING.cinematic}px + env(safe-area-inset-bottom, 0px))`,
    }}>

      {/* ── Portrait hero ───────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        height: '52vh',
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
          position: 'relative',
          padding: `${SPACING.standard}px ${SPACING.standard}px`,
          cursor: 'pointer',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
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
          border: `1.5px solid rgba(${theme.accentRgb},0.28)`,
          borderRadius: RADII.panel,
          padding: SPACING.standard,
          background: 'rgba(255,255,255,0.02)',
          backdropFilter: 'blur(8px)',
          animation: `keyRevealSlide 420ms ${MOTION.easing.standard} both`,
          marginBottom: SPACING.standard,
        }}>
          <style>{`
            @keyframes keyRevealSlide {
              from { opacity: 0; transform: translateX(16px); }
              to   { opacity: 1; transform: translateX(0); }
            }
          `}</style>

          {/* Section header with icon */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: SPACING.compact,
            marginBottom: SPACING.standard,
          }}>
            <div style={{
              width: 28, height: 28,
              borderRadius: '50%',
              background: `rgba(${theme.accentRgb},0.12)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <SectionIcon icon={section.icon} accent={accent} />
            </div>
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
          <button
            onClick={(e) => { e.stopPropagation(); onComplete?.() }}
            style={{
              display: 'block',
              width: '100%',
              height: 52,
              background: accent,
              color: '#08090D',
              border: 'none',
              borderRadius: RADII.medium,
              fontFamily: "'Sora', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              transition: `transform ${MOTION.duration.fast} ${MOTION.easing.standard}`,
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = `scale(${MOTION.scale.press})`}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  )
}
