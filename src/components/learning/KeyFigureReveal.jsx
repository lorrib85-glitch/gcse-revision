import { useState, useRef } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING, COMPONENT_SIZE } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { MOTION } from '../../constants/motion.js'
import CinematicShell from '../layout/CinematicShell.jsx'
import ContinueCTA from '../core/ContinueCTA.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'

const DEFAULT_PARCHMENT = '/figures/history/medicine/medieval/galen-parchment.png'
const MEDALLION_SIZE = 48
const MEDALLION_ICON_SIZE = 26
const EVIDENCE_IMAGE_HEIGHT = 180

const FIGURE_PRESETS = {
  'four-humours': {
    cardVariant: 'parchment',
    cardBackground: DEFAULT_PARCHMENT,
    portraitHeight: `calc(60vh - ${SPACING.compact}px)`,
    portraitPosition: 'center 18%',
    portraitScrim: 'strongBottom',
  },
  galen: {
    cardVariant: 'parchment',
    cardBackground: DEFAULT_PARCHMENT,
    portraitHeight: '44vh',
    portraitScrim: 'evidenceRight',
  },
}

const PORTRAIT_SCRIMS = {
  standard: 'linear-gradient(to bottom, rgba(8,9,13,0.06) 0%, rgba(8,9,13,0.10) 35%, rgba(8,9,13,0.70) 65%, rgba(8,9,13,0.98) 100%)',
  strongBottom: 'linear-gradient(to bottom, rgba(8,9,13,0.06) 0%, rgba(8,9,13,0.10) 35%, rgba(8,9,13,0.70) 65%, rgba(8,9,13,0.98) 100%)',
  evidenceRight: `linear-gradient(to bottom, rgba(8,9,13,0.03) 0%, rgba(8,9,13,0.06) 35%, rgba(8,9,13,0.46) 65%, rgba(8,9,13,0.94) 100%),
    linear-gradient(to right, rgba(8,9,13,0.08) 0%, rgba(8,9,13,0.00) 42%, rgba(8,9,13,0.00) 100%)`,
}

function FigureIcon({ icon, size = MEDALLION_ICON_SIZE }) {
  if (!icon) return <div style={{ width: size, height: size }} />

  return (
    <img
      src={`/icons/history/${icon}.png`}
      alt=""
      style={{
        width: size,
        height: size,
        borderRadius: RADII.pill,
        flexShrink: 0,
        display: 'block',
      }}
    />
  )
}

function getCardTreatment({ isParchment, parchmentSrc, accent, rgb }) {
  if (isParchment) {
    return {
      title: '#4A2508',
      body: '#2C1A06',
      quote: '#5C3820',
      divider: 'rgba(110,65,22,0.28)',
      medalBg: 'rgba(110,65,22,0.14)',
      medalBorder: 'rgba(110,65,22,0.48)',
      border: '1px solid rgba(139,90,43,0.55)',
      shadow: 'inset 0 0 60px rgba(80,40,10,0.28), 0 4px 28px rgba(80,40,10,0.22)',
      background: `url(${parchmentSrc}) center/cover`,
      vignette: 'radial-gradient(ellipse at center, transparent 45%, rgba(80,40,10,0.22) 100%)',
    }
  }

  return {
    title: accent,
    body: 'rgba(245,238,225,0.82)',
    quote: 'rgba(245,220,175,0.75)',
    divider: `rgba(${rgb},0.22)`,
    medalBg: `rgba(${rgb},0.14)`,
    medalBorder: `rgba(${rgb},0.38)`,
    border: `1px solid rgba(${rgb},0.32)`,
    shadow: GENERAL.shadow.overlay,
    background: `radial-gradient(ellipse at 50% 0%, rgba(${rgb},0.07) 0%, transparent 65%),
      linear-gradient(160deg, rgba(${rgb},0.05) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.18) 100%),
      rgba(12,9,5,0.88)`,
    vignette: null,
  }
}

export default function KeyFigureReveal({ block, subject, onComplete }) {
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const accent = theme.accent
  const rgb = theme.accentRgb

  const [sectionIdx, setSectionIdx] = useState(0)
  const [viewedIndices, setViewedIndices] = useState([0])
  const touchRef = useRef(null)

  const sections = block.sections || []
  const section = sections[sectionIdx] || {}
  const lines = section.lines || []
  const hasSections = sections.length > 0
  const isLast = hasSections && sectionIdx === sections.length - 1

  const preset = FIGURE_PRESETS[block.profilePreset || block.tag] || {}
  const cardVariant = block.cardVariant
    || preset.cardVariant
    || (block.cardBackground ? 'parchment' : 'dark')
  const parchmentSrc = block.cardBackground || preset.cardBackground
  const isParchment = cardVariant === 'parchment' && Boolean(parchmentSrc)
  const card = getCardTreatment({ isParchment, parchmentSrc, accent, rgb })

  const portraitHeight = block.portraitHeight || preset.portraitHeight || '44vh'
  const portraitPosition = block.portraitPosition || preset.portraitPosition || 'center top'
  const requestedScrim = block.portraitScrim || preset.portraitScrim || 'standard'
  const portraitScrim = PORTRAIT_SCRIMS[requestedScrim] || requestedScrim

  function goToSection(nextIndex) {
    if (!hasSections) return

    const safeIndex = Math.min(Math.max(nextIndex, 0), sections.length - 1)
    setSectionIdx(safeIndex)
    setViewedIndices(previous => previous.includes(safeIndex)
      ? previous
      : [...previous, safeIndex])
  }

  function advance() {
    if (!isLast) goToSection(sectionIdx + 1)
  }

  function retreat() {
    if (sectionIdx > 0) goToSection(sectionIdx - 1)
  }

  function handleTouchStart(event) {
    const touch = event.touches[0]
    touchRef.current = { x: touch.clientX, y: touch.clientY }
  }

  function handleTouchEnd(event) {
    if (!touchRef.current) return

    const touch = event.changedTouches[0]
    const dx = touch.clientX - touchRef.current.x
    const dy = touch.clientY - touchRef.current.y
    touchRef.current = null

    if (Math.abs(dx) < COMPONENT_SIZE.touchTarget || Math.abs(dx) <= Math.abs(dy)) return
    dx > 0 ? retreat() : advance()
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      retreat()
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      advance()
    }
  }

  const navButtonStyle = {
    width: COMPONENT_SIZE.touchTarget,
    height: COMPONENT_SIZE.touchTarget,
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
    border: 'none',
    borderRadius: RADII.pill,
    background: 'transparent',
    padding: 0,
  }

  return (
    <CinematicShell style={{
      background: theme.background,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <style>{`
        @keyframes kfr-slide-in {
          from { opacity: 0; transform: translateX(18px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes kfr-img-in {
          from { opacity: 0; transform: scale(1.04); }
          to { opacity: 1; transform: scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .kfr-card,
          .kfr-evidence {
            animation: none !important;
          }

          .kfr-progress * {
            transition: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>

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
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: portraitPosition,
            display: 'block',
          }}
        />

        <div style={{
          position: 'absolute',
          inset: 0,
          background: portraitScrim,
          pointerEvents: 'none',
        }} />

        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: `0 ${SPACING.standard}px ${SPACING.standard}px`,
        }}>
          <div style={{
            ...TYPE.displayHero,
            color: GENERAL.feedbackText,
            marginBottom: SPACING.micro / 2,
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

      <div
        role="region"
        aria-label={`${block.name || 'Key figure'} reveal`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={() => { touchRef.current = null }}
        style={{
          flex: 1,
          minHeight: 0,
          position: 'relative',
          paddingLeft: SPACING.standard,
          paddingRight: SPACING.standard,
          paddingTop: SPACING.compact,
          paddingBottom: `calc(${SPACING.compact}px + env(safe-area-inset-bottom, 0px))`,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'pan-y',
          display: 'flex',
          flexDirection: 'column',
          gap: SPACING.micro,
          overflow: 'hidden',
          outline: 'none',
        }}
      >
        <div
          key={sectionIdx}
          className="kfr-card"
          aria-live="polite"
          style={{
            flex: 1,
            minHeight: 0,
            borderRadius: RADII.medium,
            padding: SPACING.compact,
            background: card.background,
            border: card.border,
            boxShadow: card.shadow,
            animation: `kfr-slide-in ${MOTION.duration.standard} ${MOTION.easing.standard} both`,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {card.vignette && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: card.vignette,
              pointerEvents: 'none',
            }} />
          )}

          <div style={{
            position: 'relative',
            height: '100%',
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: SPACING.micro,
              marginBottom: SPACING.micro / 2,
            }}>
              <div style={{
                width: MEDALLION_SIZE,
                height: MEDALLION_SIZE,
                borderRadius: RADII.pill,
                background: card.medalBg,
                border: `1px solid ${card.medalBorder}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <FigureIcon icon={section.icon} />
              </div>

              <div style={{
                ...TYPE.label,
                color: card.title,
              }}>
                {section.title}
              </div>
            </div>

            <div style={{
              height: COMPONENT_SIZE.hairline,
              background: card.divider,
              marginBottom: SPACING.micro,
            }} />

            {section.image ? (
              <div style={{
                ...TYPE.bodySmall,
                color: card.body,
              }}>
                <div
                  className="kfr-evidence"
                  style={{
                    float: 'left',
                    width: '40%',
                    marginRight: SPACING.micro,
                    marginBottom: SPACING.micro,
                    borderRadius: RADII.small,
                    overflow: 'hidden',
                    animation: `kfr-img-in ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
                  }}
                >
                  <img
                    src={section.image}
                    alt={section.imageAlt || ''}
                    style={{
                      width: '100%',
                      height: EVIDENCE_IMAGE_HEIGHT,
                      objectFit: section.imageFit || 'cover',
                      objectPosition: section.imagePosition || 'center center',
                      display: 'block',
                      filter: 'saturate(0.88) brightness(0.96)',
                    }}
                  />
                </div>

                {lines.map((line, index) => {
                  const isAutoTakeaway = index === lines.length - 1 && !section.takeaway
                  const isLead = index === 0

                  return (
                    <p key={index} style={{
                      ...TYPE.bodySmall,
                      fontWeight: isAutoTakeaway ? 600 : isLead ? 500 : TYPE.bodySmall.fontWeight,
                      lineHeight: isLead ? 1.55 : TYPE.bodySmall.lineHeight,
                      color: isAutoTakeaway ? card.title : card.body,
                      margin: index < lines.length - 1 ? `0 0 ${SPACING.micro / 2}px` : 0,
                    }}>
                      {line}
                    </p>
                  )
                })}

                <div style={{ clear: 'both' }} />
              </div>
            ) : (
              <>
                {lines.map((line, index) => {
                  const isAutoTakeaway = index === lines.length - 1 && !section.takeaway
                  const textToken = index === 0 ? TYPE.bodyStrong : TYPE.bodySmall

                  return (
                    <p key={index} style={{
                      ...textToken,
                      fontWeight: isAutoTakeaway ? 600 : textToken.fontWeight,
                      color: isAutoTakeaway ? card.title : card.body,
                      margin: index < lines.length - 1 ? `0 0 ${SPACING.micro / 2}px` : 0,
                    }}>
                      {line}
                    </p>
                  )
                })}
              </>
            )}

            {section.quote && (
              <div style={{
                ...TYPE.bodySmall,
                borderLeft: `${COMPONENT_SIZE.focusRing}px solid ${card.divider}`,
                paddingLeft: SPACING.micro,
                marginTop: SPACING.micro,
                fontFamily: "'IBM Plex Serif', serif",
                fontStyle: 'italic',
                color: card.quote,
              }}>
                “{section.quote}”
              </div>
            )}

            {section.takeaway && (
              <>
                <div style={{
                  height: COMPONENT_SIZE.hairline,
                  background: card.divider,
                  margin: `${SPACING.micro}px 0`,
                }} />

                <p style={{
                  ...TYPE.bodySmall,
                  fontWeight: 600,
                  color: card.title,
                  margin: 0,
                }}>
                  {section.takeaway}
                </p>
              </>
            )}
          </div>
        </div>

        <div style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: SPACING.micro,
        }}>
          {!isLast && sections.length > 1 && (
            <div style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <button
                type="button"
                aria-label="Previous section"
                disabled={sectionIdx === 0}
                onClick={retreat}
                style={{
                  ...navButtonStyle,
                  color: sectionIdx === 0 ? GENERAL.line.strong : GENERAL.ring.pulse,
                  cursor: sectionIdx === 0 ? 'default' : 'pointer',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <div style={{
                ...TYPE.caption,
                color: GENERAL.ring.pulse,
                textAlign: 'center',
              }}>
                Swipe to discover
              </div>

              <button
                type="button"
                aria-label="Next section"
                onClick={advance}
                style={{
                  ...navButtonStyle,
                  color: GENERAL.ring.pulse,
                  cursor: 'pointer',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}

          {sections.length > 1 && (
            <div className="kfr-progress">
              <SequenceProgress
                total={sections.length}
                current={sectionIdx}
                viewed={viewedIndices}
                accent={accent}
                accentRgb={rgb}
                variant="dots"
                compact
                ariaLabel={`${block.name || 'Key figure'} section progress`}
              />
            </div>
          )}

          {isLast && (
            <ContinueCTA
              onClick={onComplete}
              accent={accent}
            />
          )}
        </div>
      </div>
    </CinematicShell>
  )
}
