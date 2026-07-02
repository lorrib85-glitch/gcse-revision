import { useState, useRef, useEffect, useCallback } from 'react'
import InteractionShell from '../layout/InteractionShell.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'
import ContinueCTA from '../core/ContinueCTA.jsx'
import CinematicContinueCTA from '../core/CinematicContinueCTA.jsx'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { SPACING } from '../../constants/spacing.js'
import { TYPE } from '../../constants/typography.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { GENERAL } from '../../constants/generalTheme.js'

function tokenize(text) {
  const parts = String(text || '').split(/(\s+)/)
  let wi = 0
  return parts.map((part, i) => {
    if (/^\s+$/.test(part)) return { key: i, space: true, text: part }
    return { key: i, space: false, text: part, wordIdx: wi++ }
  })
}

function displayText(value) {
  const text = String(value || '').trim()
  if (!text) return ''
  const letters = text.replace(/[^A-Za-z]/g, '')
  const isShout = letters.length > 5 && letters === letters.toUpperCase()
  if (!isShout) return text
  return text.toLowerCase().replace(/(^|[.!?]\s+|[—–-]\s+)([a-z])/g, (_, lead, ch) => `${lead}${ch.toUpperCase()}`)
}

function displayHeading(value) {
  const text = displayText(value)
  if (/^thomas confidence$/i.test(text)) return 'Thomas trusts them'
  return text
}

function confidenceOutOfFive(value) {
  const text = String(value || '')
  const filled = (text.match(/⭐/g) || []).length
  const empty = (text.match(/☆/g) || []).length
  if (filled + empty === 10) return Math.round(filled / 2)
  if (filled + empty === 5) return filled
  return null
}

function costLabel(value) {
  const text = String(value || '')
  const coins = (text.match(/💰/g) || []).length
  if (!coins) return null
  if (coins === 1) return 'Low cost'
  if (coins === 2) return 'Affordable'
  if (coins === 3) return 'Mid-range'
  if (coins === 4) return 'Expensive'
  return 'Very expensive'
}

function formatItem(value) {
  const confidence = confidenceOutOfFive(value)
  if (confidence !== null) return { text: `${confidence}/5`, strong: true }

  const cost = costLabel(value)
  if (cost) return { text: cost, strong: true }

  return { text: displayText(value), strong: false }
}

const CARD_VW = 78
const SIDE_OFFSET = 7
const CARD_GAP = 16
const SWIPE_THRESHOLD_RATIO = 0.22

export default function GuidedChoiceCarousel({
  subject,
  headline,
  question,
  helperText,
  options = [],
  onContinue,
  onBack: _onBack,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flippedIndex, setFlippedIndex] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showReveal, setShowReveal] = useState(false)

  useEffect(() => {
    options.forEach(opt => {
      if (opt.image) {
        const img = new window.Image()
        img.src = opt.image
      }
    })
  }, [options])

  const touchRef = useRef({ startX: 0, startY: 0, isDrag: false, moved: false })
  const stateRef = useRef({ currentIndex: 0, length: options.length })
  const carouselEl = useRef(null)
  const choosing = useRef(false)

  useEffect(() => {
    stateRef.current.currentIndex = currentIndex
    stateRef.current.length = options.length
  }, [currentIndex, options.length])

  const subjectData = SUBJECTS[subject] || {}
  const accent = subjectData.accent || '#D9A441'
  const accentRgb = subjectData.accentRgb || '217,164,65'
  const backgroundImage = options[currentIndex]?.image || null

  const currentOption = options[currentIndex] || {}
  const isChosen = selectedIndex !== null
  const selectedOption = selectedIndex !== null ? options[selectedIndex] : null
  const revealLines = selectedOption?.revealLines || []
  const titleLine = displayText(revealLines[0] || '')
  const bodyLines = revealLines.slice(1).map(displayText)

  const onTouchStart = useCallback((e) => {
    const t = e.touches[0]
    touchRef.current = { startX: t.clientX, startY: t.clientY, isDrag: false, moved: false }
    setIsDragging(true)
    setDragOffset(0)
  }, [])

  const onTouchMove = useCallback((e) => {
    const t = e.touches[0]
    const dx = t.clientX - touchRef.current.startX
    const dy = t.clientY - touchRef.current.startY

    if (!touchRef.current.moved) {
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) {
        touchRef.current.moved = true
        touchRef.current.isDrag = true
      } else if (Math.abs(dy) > 5) {
        touchRef.current.moved = true
        touchRef.current.isDrag = false
      }
    }

    if (touchRef.current.isDrag) {
      e.preventDefault()
      setDragOffset(dx)
    }
  }, [])

  const onTouchEnd = useCallback((e) => {
    const endX = e.changedTouches[0]?.clientX ?? touchRef.current.startX
    const dx = endX - touchRef.current.startX

    setIsDragging(false)
    setDragOffset(0)

    if (!touchRef.current.isDrag) return

    const threshold = window.innerWidth * SWIPE_THRESHOLD_RATIO
    const { currentIndex: ci, length } = stateRef.current

    if (dx < -threshold && ci < length - 1) {
      setCurrentIndex(i => i + 1)
      setFlippedIndex(null)
    } else if (dx > threshold && ci > 0) {
      setCurrentIndex(i => i - 1)
      setFlippedIndex(null)
    }
  }, [])

  useEffect(() => {
    const el = carouselEl.current
    if (!el) return
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [onTouchStart, onTouchMove, onTouchEnd])

  function handleCardClick(idx) {
    if (touchRef.current.isDrag) return
    if (idx !== currentIndex) {
      setCurrentIndex(idx)
      setFlippedIndex(null)
      return
    }
    setFlippedIndex(f => (f === idx ? null : idx))
  }

  function handleChoose() {
    if (isChosen || choosing.current) return
    choosing.current = true
    setSelectedIndex(currentIndex)
    setTimeout(() => setShowReveal(true), 450)
  }

  const liveOffset = isDragging ? dragOffset : 0
  const trackTransX = `calc(${SIDE_OFFSET}vw - (${currentIndex} * (${CARD_VW}vw + ${CARD_GAP}px)) + ${liveOffset}px)`
  const currentLabel = displayText(currentOption.title || 'this option')

  return (
    <InteractionShell
      subject={subject}
      backgroundImage={backgroundImage}
      backgroundOpacity={0.08}
      backgroundPosition="center top"
    >
      <style>{`
        .gcc-card-back-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .gcc-card-back-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>

      <div style={{
        flexShrink: 0,
        textAlign: 'center',
        padding: `0 0 ${SPACING.compact}px`,
      }}>
        {headline && (
          <div style={{
            ...TYPE.bodySmall,
            color: `rgba(${accentRgb},0.86)`,
            fontWeight: 700,
            letterSpacing: '0.035em',
            marginBottom: SPACING.micro,
          }}>
            {displayText(headline)}
          </div>
        )}

        <div style={{
          ...TYPE.displayCard,
          color: '#F5F1E8',
          marginBottom: helperText ? SPACING.micro : 0,
        }}>
          {displayText(question)}
        </div>

        {helperText && (
          <div style={{
            ...TYPE.bodySmall,
            fontSize: 14,
            color: 'rgba(245,238,225,0.46)',
          }}>
            {displayText(helperText).replace('Swipe to explore your options.', 'Swipe through the healers, then choose one.')}
          </div>
        )}
      </div>

      <div
        ref={carouselEl}
        style={{
          flex: '1 1 0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          cursor: 'grab',
          marginLeft: -SPACING.compact,
          marginRight: -SPACING.compact,
        }}
      >
        <div style={{
          display: 'flex',
          gap: CARD_GAP,
          transform: `translateX(${trackTransX})`,
          transition: isDragging ? 'none' : `transform ${MOTION.duration.standard} ${MOTION.easing.standard}`,
          willChange: 'transform',
          alignItems: 'stretch',
        }}>
          {options.map((opt, idx) => {
            const isCurrentCard = idx === currentIndex
            const isCardFlipped = flippedIndex === idx
            const isSelected = selectedIndex === idx
            const isFaded = isChosen && !isSelected

            if (isChosen && !isSelected) return null

            return (
              <div
                key={idx}
                onClick={() => handleCardClick(idx)}
                style={{
                  flexShrink: 0,
                  width: `${CARD_VW}vw`,
                  height: `min(60vh, calc(${CARD_VW}vw * 1.34))`,
                  cursor: 'pointer',
                  transform: `scale(${isSelected ? 1.02 : isFaded ? 0.96 : 1})`,
                  opacity: isFaded ? 0.22 : 1,
                  transition: `transform ${MOTION.duration.standard} ${MOTION.easing.standard}, opacity ${MOTION.duration.standard} ${MOTION.easing.standard}`,
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: RADII.large,
                  overflow: 'hidden',
                  background: 'rgba(10,11,15,0.96)',
                  border: isSelected ? `1.5px solid rgba(${accentRgb}, 0.55)` : '1px solid rgba(255,255,255,0.07)',
                  boxShadow: isSelected ? `0 0 40px rgba(${accentRgb}, 0.18), 0 12px 48px rgba(0,0,0,0.55)` : '0 12px 48px rgba(0,0,0,0.55)',
                }}
              >
                <div style={{
                  flex: '1 1 0',
                  minHeight: 0,
                  perspective: 1200,
                  position: 'relative',
                }}>
                  <div style={{
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transition: `transform ${MOTION.duration.slow} ${MOTION.easing.standard}`,
                    position: 'relative',
                  }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      overflow: 'hidden',
                      background: '#101218',
                    }}>
                      {opt.image ? (
                        <img
                          src={opt.image}
                          alt={opt.title}
                          loading="eager"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center top',
                            display: 'block',
                            filter: 'brightness(0.74) grayscale(6%) contrast(1.03)',
                          }}
                          draggable={false}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          background: `rgba(${accentRgb}, 0.06)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: RADII.pill,
                            border: `1px solid rgba(${accentRgb}, 0.2)`,
                          }} />
                        </div>
                      )}

                      <div style={{
                        position: 'absolute',
                        bottom: 0, left: 0, right: 0,
                        height: '46%',
                        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.72))',
                        pointerEvents: 'none',
                      }} />

                      {isCurrentCard && !isCardFlipped && !isChosen && (
                        <div style={{
                          position: 'absolute',
                          top: SPACING.compact,
                          right: SPACING.compact,
                          background: 'rgba(0,0,0,0.42)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          borderRadius: RADII.pill,
                          border: '1px solid rgba(255,255,255,0.07)',
                          padding: '4px 10px',
                          ...TYPE.bodySmall,
                          fontSize: 11,
                          color: 'rgba(245,238,225,0.58)',
                          pointerEvents: 'none',
                        }}>
                          Explore
                        </div>
                      )}
                    </div>

                    <div
                      className="gcc-card-back-scroll"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        overflow: 'hidden',
                        overflowY: 'auto',
                        background: `radial-gradient(circle at top left, rgba(${accentRgb},0.10), transparent 42%), linear-gradient(180deg, rgba(15,17,24,0.98), rgba(8,9,13,0.98))`,
                        padding: 16,
                        WebkitOverflowScrolling: 'touch',
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                      }}>
                        {(opt.sections || []).slice(0, 4).map((section, sIdx) => {
                          const values = (section.items || []).slice(0, 5).map(formatItem)
                          return (
                            <div
                              key={sIdx}
                              style={{
                                padding: '12px 13px',
                                borderRadius: RADII.medium,
                                background: 'rgba(255,255,255,0.035)',
                                border: '1px solid rgba(255,255,255,0.065)',
                              }}
                            >
                              {section.heading && (
                                <div style={{
                                  ...TYPE.bodySmall,
                                  fontSize: 12,
                                  fontWeight: 800,
                                  color: `rgba(${accentRgb},0.82)`,
                                  marginBottom: 6,
                                }}>
                                  {displayHeading(section.heading)}
                                </div>
                              )}
                              <div style={{
                                ...TYPE.bodySmall,
                                fontSize: 14,
                                color: 'rgba(245,238,225,0.72)',
                                lineHeight: 1.45,
                                fontWeight: values.some(value => value.strong) ? 700 : 500,
                              }}>
                                {values.map(value => value.text).join(' · ')}
                              </div>
                            </div>
                          )
                        })}

                        {opt.reaction && (
                          <div style={{
                            marginTop: 2,
                            padding: '12px 13px',
                            background: `rgba(${accentRgb}, 0.055)`,
                            borderRadius: RADII.medium,
                            border: `1px solid rgba(${accentRgb}, 0.13)`,
                            ...TYPE.bodySmall,
                            fontSize: 13,
                            color: 'rgba(245,238,225,0.62)',
                            fontStyle: 'italic',
                            lineHeight: 1.45,
                          }}>
                            {displayText(opt.reaction).slice(0, 80)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{
                  flex: '0 0 68px',
                  padding: `${SPACING.compact}px`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(8,9,13,0.88)',
                }}>
                  <div style={{
                    ...TYPE.bodySmall,
                    color: '#F5F1E8',
                    fontWeight: 800,
                    fontSize: 15,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {displayText(opt.title)}
                  </div>
                  {opt.subtitle && (
                    <div style={{
                      ...TYPE.bodySmall,
                      fontSize: 12,
                      color: 'rgba(245,238,225,0.42)',
                      marginTop: 3,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {displayText(opt.subtitle)}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: SPACING.compact, paddingBottom: SPACING.micro }}>
          <SequenceProgress
            total={options.length}
            current={currentIndex}
            accent={accent}
            accentRgb={accentRgb}
            compact={true}
            ariaLabel="Option progress"
          />
        </div>
      </div>

      <div style={{
        flexShrink: 0,
        padding: `${SPACING.compact}px 0 calc(${SPACING.compact}px + env(safe-area-inset-bottom, 0px))`,
      }}>
        <ContinueCTA
          onClick={handleChoose}
          label={isChosen ? 'Selected' : `Choose ${currentLabel}`}
          accent={accent}
          disabled={isChosen}
          style={{
            width: '100%',
            boxShadow: isChosen ? 'none' : `0 4px 28px rgba(${accentRgb}, 0.22)`,
          }}
        />
      </div>

      {showReveal && selectedOption && (() => {
        const titleToks = tokenize(titleLine)
        return (
          <>
            <style>{`
              @keyframes gcc-word {
                from { opacity: 0; transform: translateY(9px); }
                to   { opacity: 1; transform: translateY(0); }
              }
              @keyframes gcc-line {
                from { opacity: 0; transform: translateY(14px); }
                to   { opacity: 1; transform: translateY(0); }
              }
            `}</style>

            <div style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1100,
              background: GENERAL.backgroundApp,
              overflow: 'hidden',
              cursor: 'default',
              userSelect: 'none',
              WebkitUserSelect: 'none',
            }}>
              {selectedOption.image && (
                <img
                  src={selectedOption.image}
                  alt=""
                  aria-hidden="true"
                  draggable={false}
                  style={{
                    position: 'absolute', right: 0, top: 0,
                    height: '100%', width: '60%',
                    objectFit: 'cover', objectPosition: 'center top',
                    opacity: 0.58,
                    filter: 'grayscale(15%) brightness(0.72)',
                    pointerEvents: 'none',
                  }}
                />
              )}

              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, rgba(8,9,13,1) 0%, rgba(8,9,13,0.92) 38%, rgba(8,9,13,0.55) 65%, rgba(8,9,13,0.10) 100%)',
                pointerEvents: 'none',
              }} />

              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 260,
                background: 'linear-gradient(0deg, rgba(8,9,13,0.99) 0%, transparent 100%)',
                pointerEvents: 'none',
              }} />

              <div style={{ position: 'relative', zIndex: 5, minHeight: '100dvh' }}>
                <div style={{
                  position: 'absolute',
                  top: '26%',
                  left: 28,
                  right: 28,
                  maxHeight: 'calc(100dvh - 180px)',
                  overflowY: 'auto',
                  paddingBottom: 112,
                  WebkitOverflowScrolling: 'touch',
                }}>
                  <div style={{
                    ...TYPE.displayScreen,
                    fontSize: 'clamp(28px, 9vw, 40px)',
                    color: '#FFFFFF',
                    maxWidth: 340,
                    marginBottom: 28,
                  }}>
                    {titleToks.map(tok =>
                      tok.space ? tok.text : (
                        <span key={tok.key} style={{
                          display: 'inline-block',
                          animation: `gcc-word 220ms ease ${260 + tok.wordIdx * 65}ms both`,
                        }}>
                          {tok.text}
                        </span>
                      )
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {bodyLines.map((line, i) => {
                      const isPunchline = i === bodyLines.length - 1
                      return (
                        <div key={i} style={{
                          fontFamily: "'Sora', sans-serif",
                          fontWeight: isPunchline ? 700 : 500,
                          fontSize: isPunchline ? 'clamp(20px, 6vw, 26px)' : 17,
                          lineHeight: isPunchline ? 1.3 : 1.65,
                          letterSpacing: isPunchline ? '-0.02em' : 0,
                          color: isPunchline ? accent : 'rgba(255,255,255,0.62)',
                          animation: `gcc-line 380ms cubic-bezier(0.16,1,0.3,1) ${520 + i * 120}ms both`,
                          marginTop: isPunchline ? 8 : 0,
                        }}>
                          {line}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <CinematicContinueCTA
                onClick={() => onContinue(selectedOption.nextScreenId, selectedOption)}
                accent={accent}
                animation="crm-fade 700ms ease 900ms both, crm-pulse 2.8s ease-in-out 1600ms infinite"
              />
            </div>
          </>
        )
      })()}
    </InteractionShell>
  )
}
