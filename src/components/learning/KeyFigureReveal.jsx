import { useState, useRef } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE }     from '../../constants/typography.js'
import { SPACING }  from '../../constants/spacing.js'
import { RADII }    from '../../constants/radii.js'
import { GENERAL }  from '../../constants/generalTheme.js'
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

  const isGalenPortrait = block.portrait?.includes('galen-portrait')
  const isHippocratesPortrait = block.portrait?.includes('hippocrates-portrait')

  // Some tall portrait assets crop badly inside the short profile hero on mobile.
  // Hippocrates appears immediately after a full-screen portrait reveal, so keep the
  // profile crop close to that composition while reserving enough room for the cards.
  const portraitHeight = isHippocratesPortrait
    ? `calc(60vh - ${SPACING.compact}px)`
    : '44vh'
  const portraitPosition = isGalenPortrait
    ? 'center 8%'
    : isHippocratesPortrait
      ? 'center 18%'
      : block.portraitPosition || 'center top'

  // Galen has important visual evidence on the right of the hero; keep the bottom readable without burying that detail.
  const portraitScrim = isGalenPortrait
    ? `linear-gradient(to bottom, rgba(8,9,13,0.03) 0%, rgba(8,9,13,0.06) 35%, rgba(8,9,13,0.46) 65%, rgba(8,9,13,0.94) 100%),
       linear-gradient(to right, rgba(8,9,13,0.08) 0%, rgba(8,9,13,0.00) 42%, rgba(8,9,13,0.00) 100%)`
    : 'linear-gradient(to bottom, rgba(8,9,13,0.06) 0%, rgba(8,9,13,0.10) 35%, rgba(8,9,13,0.70) 65%, rgba(8,9,13,0.98) 100%)'

  return (
    <CinematicShell style={{
      background: GENERAL.backgroundApp,
      display: 'flex',
      flexDirection: 'column',
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
        height: portraitHeight,
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <img
          src={block.portrait}
          alt={block.name}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: portraitPosition,
            display: 'block',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: portraitScrim,
          pointerEvents: 'none',
        }} />
        {/* Name + role pinned to bottom of portrait */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: `0 ${SPACING.standard}px ${SPACING.standard}px`,
        }}>
          <div style={{
            ...TYPE.displayScreen,
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

      {/* ── Insight card + bottom nav — fills remaining viewport height ── */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
        style={{
          flex: 1,
          position: 'relative',
          paddingLeft: SPACING.standard,
          paddingRight: SPACING.standard,
          paddingTop: SPACING.compact,
          paddingBottom: `calc(${SPACING.compact}px + env(safe-area-inset-bottom, 0px))`,
          cursor: 'pointer',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          gap: SPACING.micro,
          overflow: 'hidden',
        }}
      >

        {/* Insight card — grows to fill available space */}
        <div
          key={sectionIdx}
          style={{
            flex: 1,
            borderRadius: RADII.medium,
            padding: '11px 16px',
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
              marginBottom: 4,
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
                ...TYPE.bodySmall,
                fontSize: 14,
                color: titleColor,
              }}>
                {section.title}
              </div>
            </div>

            {/* Divider under header */}
            <div style={{ height: 1, background: dividerColor, marginBottom: 6 }} />

            {/* Body: evidence tile with text wrapped around it, or plain lines */}
            {section.image ? (
              <div style={{
                ...TYPE.bodySmall,
                fontSize: 13,
                color: bodyColor,
              }}>
                {/* Float lets later paragraphs use the space beside the image instead of being forced below a tall flex row. */}
                <div style={{
                  float: 'left',
                  width: '40%',
                  marginRight: 10,
                  marginBottom: 6,
                  borderRadius: 9,
                  overflow: 'hidden',
                  animation: `kfr-img-in 440ms ${MOTION.easing.standard} both`,
                }}>
                  <img
                    src={section.image}
                    alt=""
                    style={{
                      width: '100%',
                      height: 180,
                      objectFit: section.imageFit || 'cover',
                      objectPosition: section.imagePosition || 'center center',
                      display: 'block',
                      filter: 'saturate(0.88) brightness(0.96)',
                    }}
                  />
                </div>

                {lines.map((line, i) => {
                  const isAutoTakeaway = i === lines.length - 1 && !section.takeaway
                  const isLead = i === 0
                  return (
                    <p key={i} style={{
                      fontFamily: "'Sora', sans-serif",
                      fontSize: 13,
                      fontWeight: isAutoTakeaway ? 600 : isLead ? 500 : 400,
                      lineHeight: isLead ? 1.55 : 1.5,
                      color: isAutoTakeaway ? titleColor : bodyColor,
                      margin: i === 0 && lines.length > 1 ? '0 0 4px' : 0,
                    }}>
                      {line}
                    </p>
                  )
                })}

                <div style={{ clear: 'both' }} />
              </div>
            ) : (
              /* No image — continuous text flow, no gaps between lines */
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
                      margin: 0,
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
                  ...TYPE.bodySmall,
                  fontSize: 13,
                  color: titleColor,
                  margin: 0,
                }}>
                  {section.takeaway}
                </p>
              </>
            )}

          </div>
        </div>

        {/* Bottom navigation strip — always visible at bottom of viewport */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 6,
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
                ...TYPE.eyebrow,
                fontSize: 10,
                textTransform: 'uppercase',
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
