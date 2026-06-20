import { useState, useRef } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE }     from '../../constants/typography.js'
import { SPACING }  from '../../constants/spacing.js'
import { RADII }    from '../../constants/radii.js'
// CinematicShell used here because the portrait hero must be full-bleed with no
// horizontal padding; ContentShell's 16px inset would create unwanted margins.
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
  const lines    = section.lines || []

  // History figures always use parchment; other subjects use dark card unless block.cardBackground overrides
  const parchmentSrc = block.cardBackground
    || (subject === 'History' ? '/figures/history/medicine/medieval/galen-parchment.png' : null)
  const isParchment = !!parchmentSrc

  function advance() {
    if (isLast) onComplete?.()
    else setSectionIdx(i => i + 1)
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

  // ── Colour tokens that switch between parchment and dark-card modes ──
  const titleColor   = isParchment ? '#4A2508' : accent
  const bodyColor    = isParchment ? '#2C1A06' : 'rgba(245,238,225,0.82)'
  const quoteColor   = isParchment ? '#5C3820' : `rgba(245,220,175,0.75)`
  const dividerColor = isParchment ? 'rgba(110,65,22,0.28)' : `rgba(${rgb},0.22)`
  const medalBg      = isParchment ? 'rgba(110,65,22,0.14)' : `rgba(${rgb},0.14)`
  const medalBorder  = isParchment ? 'rgba(110,65,22,0.48)' : `rgba(${rgb},0.38)`
  const cardBorder   = isParchment ? '1px solid rgba(139,90,43,0.55)' : `1px solid rgba(${rgb},0.32)`
  const cardShadow   = isParchment
    ? 'inset 0 0 60px rgba(80,40,10,0.28), 0 4px 28px rgba(80,40,10,0.22)'
    : `inset 0 1px 0 rgba(${rgb},0.14), inset 0 -1px 0 rgba(0,0,0,0.35), 0 4px 28px rgba(0,0,0,0.5)`
  const cardBg       = isParchment
    ? `url(${parchmentSrc}) center/cover`
    : `radial-gradient(ellipse at 50% 0%, rgba(${rgb},0.07) 0%, transparent 65%),
       linear-gradient(160deg, rgba(${rgb},0.05) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.18) 100%),
       rgba(12,9,5,0.88)`

  return (
    <CinematicShell style={{
      background: '#08090D',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>

      <style>{`
        @keyframes kfr-slide-in {
          from { opacity: 0; transform: translateX(18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes kfr-img-in {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* ── Portrait hero ───────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        height: '40vh',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <img
          src={block.portrait}
          alt={block.name}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: block.portraitPosition || 'center top',
            display: 'block',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(8,9,13,0.06) 0%, rgba(8,9,13,0.10) 35%, rgba(8,9,13,0.70) 65%, rgba(8,9,13,0.98) 100%)',
          pointerEvents: 'none',
        }} />
        {/* Name + role pinned to bottom of portrait */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: `0 ${SPACING.standard}px ${SPACING.standard}px`,
        }}>
          <div style={{
            ...TYPE.hero,
            fontSize: 'clamp(34px, 9vw, 48px)',
            color: '#FFFFFF',
            marginBottom: 4,
          }}>
            {block.name}
          </div>
          <div style={{
            ...TYPE.metadata,
            color: accent,
          }}>
            {block.role}
          </div>
        </div>
      </div>

      {/* ── Insight card + bottom nav ─────────────────────────────────── */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        style={{
          position: 'relative',
          padding: `${SPACING.micro}px ${SPACING.standard}px`,
          paddingBottom: `calc(28px + env(safe-area-inset-bottom, 0px))`,
          cursor: 'pointer',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          gap: SPACING.micro,
        }}
      >

        {/* Insight card */}
        <div
          key={sectionIdx}
          style={{
            borderRadius: RADII.medium,
            padding: '12px 16px',
            background: cardBg,
            border: cardBorder,
            boxShadow: cardShadow,
            animation: `kfr-slide-in 360ms ${MOTION.easing.standard} both`,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Parchment edge vignette — only in parchment mode */}
          {isParchment && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse at center, transparent 45%, rgba(80,40,10,0.22) 100%)',
              pointerEvents: 'none',
            }} />
          )}

          {/* All card content sits above vignette */}
          <div style={{ position: 'relative' }}>

            {/* Header: medallion + title */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 8,
            }}>
              <div style={{
                width: 48, height: 48,
                borderRadius: '50%',
                background: medalBg,
                border: `1px solid ${medalBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <HistoryIcon icon={section.icon} size={26} />
              </div>
              <div style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: titleColor,
                letterSpacing: '0.02em',
                lineHeight: 1.25,
              }}>
                {section.title}
              </div>
            </div>

            {/* Divider under header */}
            <div style={{ height: 1, background: dividerColor, marginBottom: 10 }} />

            {/* Body: evidence tile (left) + flowing text, or plain lines */}
            {section.image ? (
              <>
                {/* Two-column row: vertical tile + first line */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{
                    width: '36%',
                    flexShrink: 0,
                    borderRadius: 9,
                    overflow: 'hidden',
                    animation: `kfr-img-in 440ms ${MOTION.easing.standard} both`,
                  }}>
                    <img
                      src={section.image}
                      alt=""
                      style={{
                        width: '100%',
                        height: 240,
                        objectFit: section.imageFit || 'cover',
                        objectPosition: section.imagePosition || 'center center',
                        display: 'block',
                        filter: 'saturate(0.88) brightness(0.96)',
                      }}
                    />
                  </div>
                  {lines[0] && (
                    <p style={{
                      flex: 1,
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 13,
                      fontWeight: 500,
                      lineHeight: 1.55,
                      color: bodyColor,
                      margin: 0,
                      paddingTop: 2,
                    }}>
                      {lines[0]}
                    </p>
                  )}
                </div>
                {/* Remaining lines with subtle dividers; last line auto-takeaway if no explicit one */}
                {lines.slice(1).map((line, i) => {
                  const isAutoTakeaway = i === lines.length - 2 && !section.takeaway
                  return (
                    <p key={i} style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 13,
                      fontWeight: isAutoTakeaway ? 600 : 400,
                      lineHeight: 1.5,
                      color: isAutoTakeaway ? titleColor : bodyColor,
                      margin: '6px 0 0',
                    }}>
                      {line}
                    </p>
                  )
                })}
              </>
            ) : (
              /* No image — plain lines with dividers; last line auto-takeaway if no explicit one */
              <>
                {lines.map((line, i) => {
                  const isAutoTakeaway = i === lines.length - 1 && !section.takeaway
                  const isLead = i === 0
                  return (
                    <p key={i} style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: isLead ? 15 : 14,
                      fontWeight: isAutoTakeaway ? 600 : isLead ? 500 : 400,
                      lineHeight: 1.55,
                      color: isAutoTakeaway ? titleColor : bodyColor,
                      margin: i > 0 ? '6px 0 0' : 0,
                    }}>
                      {line}
                    </p>
                  )
                })}
              </>
            )}

            {/* Pull quote */}
            {section.quote && (
              <div style={{
                borderLeft: `2px solid ${dividerColor}`,
                paddingLeft: 10,
                marginTop: 10,
                fontFamily: "'IBM Plex Serif', serif",
                fontStyle: 'italic',
                fontSize: 13,
                lineHeight: 1.55,
                color: quoteColor,
              }}>
                "{section.quote}"
              </div>
            )}

            {/* Takeaway — stronger closing line */}
            {section.takeaway && (
              <>
                <div style={{ height: 1, background: dividerColor, margin: '10px 0' }} />
                <p style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  lineHeight: 1.5,
                  color: titleColor,
                  margin: 0,
                }}>
                  {section.takeaway}
                </p>
              </>
            )}

          </div>
        </div>

        {/* Bottom navigation strip */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          paddingTop: SPACING.compact,
        }}>
          {isLast ? (
            <ContinueCTA
              onClick={(e) => { e.stopPropagation(); onComplete?.() }}
              accent={accent}
            />
          ) : (
            <>
              {/* Swipe affordance */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: 'rgba(255,255,255,0.32)',
                fontFamily: "'Sora', sans-serif",
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
                Swipe to discover
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>

              {/* Progress dots */}
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
                          ? `rgba(${rgb},0.5)`
                          : 'rgba(255,255,255,0.22)',
                      transition: `all ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                    }} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </CinematicShell>
  )
}
