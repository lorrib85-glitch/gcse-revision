import { useState, useRef } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE }     from '../../constants/typography.js'
import { SPACING }  from '../../constants/spacing.js'
import { RADII }    from '../../constants/radii.js'
// CinematicShell used here because the portrait hero must be full-bleed with no
// horizontal padding; ContentShell's 16px inset would create unwanted margins around the
// hero and disrupt the name/role overlay anchored to the hero's edges.
import CinematicShell from '../layout/CinematicShell.jsx'
import { MOTION }   from '../../constants/motion.js'
import ContinueCTA from '../core/ContinueCTA.jsx'

function HistoryIcon({ icon, size = 28 }) {
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
  const rgb    = theme.accentRgb

  const [sectionIdx, setSectionIdx] = useState(0)
  const touchRef = useRef(null)

  const sections = block.sections || []
  const section  = sections[sectionIdx] || {}
  const isLast   = sectionIdx === sections.length - 1

  function advance() {
    if (isLast) {
      onComplete?.()
    } else {
      setSectionIdx(i => i + 1)
    }
  }

  function retreat() {
    if (sectionIdx > 0) setSectionIdx(i => i - 1)
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
    ;(e.clientX - rect.left) / rect.width < 0.25 ? retreat() : advance()
  }

  // Card background: parchment texture with dark warm overlay if provided, else flat dark
  const cardBg = block.cardBackground
    ? `linear-gradient(rgba(18,12,6,0.82), rgba(18,12,6,0.86)), url(${block.cardBackground}) center/cover`
    : `radial-gradient(ellipse at 50% 0%, rgba(${rgb},0.07) 0%, transparent 65%),
       linear-gradient(160deg, rgba(${rgb},0.05) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.18) 100%),
       rgba(12,9,5,0.88)`

  return (
    <CinematicShell style={{
      background: '#08090D',
      display: 'flex',
      flexDirection: 'column',
    }}>

      <style>{`
        @keyframes kfr-slide-in {
          from { opacity: 0; transform: translateX(18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes kfr-img-in {
          from { opacity: 0; transform: scale(1.03); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* ── Portrait hero ───────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        height: '50vh',
        overflow: 'hidden',
        flexShrink: 0,
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
          background: 'linear-gradient(to bottom, rgba(8,9,13,0.06) 0%, rgba(8,9,13,0.10) 35%, rgba(8,9,13,0.70) 65%, rgba(8,9,13,0.98) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Name + role + progress dots — pinned to bottom of portrait */}
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
            marginBottom: 4,
          }}>
            {block.name}
          </div>

          <div style={{
            ...TYPE.metadata,
            color: accent,
            textTransform: 'uppercase',
            marginBottom: 10,
          }}>
            {block.role}
          </div>

          {/* Progress dots — live in the hero overlay */}
          {sections.length > 1 && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {sections.map((_, i) => (
                <div key={i} style={{
                  width: i === sectionIdx ? 18 : 6,
                  height: 6,
                  borderRadius: 99,
                  background: i === sectionIdx
                    ? accent
                    : i < sectionIdx
                      ? `rgba(${rgb},0.55)`
                      : 'rgba(255,255,255,0.28)',
                  transition: `all ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                }} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Insight card carousel ─────────────────────────────────────── */}
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

        {/* Insight card */}
        <div
          key={sectionIdx}
          style={{
            borderRadius: RADII.medium,
            padding: SPACING.standard,
            background: cardBg,
            border: `1px solid rgba(${rgb},0.32)`,
            boxShadow: `
              inset 0 1px 0 rgba(${rgb},0.14),
              inset 0 -1px 0 rgba(0,0,0,0.35),
              0 4px 28px rgba(0,0,0,0.5)
            `,
            animation: `kfr-slide-in 380ms ${MOTION.easing.standard} both`,
            overflow: 'hidden',
            position: 'relative',
            marginBottom: isLast ? SPACING.standard : 0,
          }}
        >

          {/* Card header: medallion + title */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: SPACING.compact,
            marginBottom: SPACING.compact,
          }}>
            {/* Icon medallion */}
            <div style={{
              width: 52, height: 52,
              borderRadius: '50%',
              background: `rgba(${rgb},0.14)`,
              border: `1px solid rgba(${rgb},0.38)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <HistoryIcon icon={section.icon} size={28} />
            </div>

            {/* Section title */}
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 15,
              fontWeight: 700,
              color: accent,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              lineHeight: 1.25,
            }}>
              {section.title}
            </div>
          </div>

          {/* Section image */}
          {section.sectionImage && (
            <div style={{
              borderRadius: RADII.small,
              overflow: 'hidden',
              marginBottom: SPACING.compact,
              animation: `kfr-img-in 480ms ${MOTION.easing.standard} both`,
            }}>
              <img
                src={section.sectionImage}
                alt=""
                style={{
                  width: '100%',
                  height: 150,
                  objectFit: 'cover',
                  objectPosition: 'center top',
                  display: 'block',
                }}
              />
            </div>
          )}

          {/* Body text */}
          {section.lines?.map((line, i) => (
            <p key={i} style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 15,
              lineHeight: 1.65,
              color: 'rgba(245,238,225,0.82)',
              margin: `0 0 ${i < section.lines.length - 1 ? 10 : 0}px`,
            }}>
              {line}
            </p>
          ))}

          {/* Pull quote */}
          {section.quote && (
            <div style={{
              borderLeft: `2px solid rgba(${rgb},0.55)`,
              paddingLeft: 12,
              marginTop: 14,
              fontFamily: "'IBM Plex Serif', serif",
              fontStyle: 'italic',
              fontSize: 14,
              lineHeight: 1.6,
              color: `rgba(${245},${220},${175},0.75)`,
            }}>
              "{section.quote}"
            </div>
          )}

        </div>

        {/* Swipe affordance — hidden on final insight */}
        {!isLast && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: SPACING.compact,
            color: 'rgba(255,255,255,0.35)',
            fontFamily: "'Sora', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            marginTop: SPACING.compact,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Swipe to discover
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        )}

        {/* Continue — final insight only */}
        {isLast && (
          <ContinueCTA onClick={(e) => { e.stopPropagation(); onComplete?.() }} accent={accent} />
        )}

      </div>
    </CinematicShell>
  )
}
