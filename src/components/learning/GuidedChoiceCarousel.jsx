import { useState, useRef, useEffect, useCallback } from 'react'

function tokenize(text) {
  const parts = text.split(/(\s+)/)
  let wi = 0
  return parts.map((part, i) => {
    if (/^\s+$/.test(part)) return { key: i, space: true, text: part }
    return { key: i, space: false, text: part, wordIdx: wi++ }
  })
}
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { SPACING } from '../../constants/spacing.js'
import { TYPE } from '../../constants/typography.js'
import { SUBJECTS } from '../../constants/subjects.js'

// Carousel geometry constants (viewport units)
const CARD_VW       = 78   // card width as % of viewport width
const SIDE_OFFSET   = 7    // left gap before first card → next card peeks ~15vw
const CARD_GAP      = 16   // px gap between cards
const SWIPE_THRESHOLD_RATIO = 0.22  // fraction of vw needed to trigger snap

export default function GuidedChoiceCarousel({
  subject,
  headline,
  question,
  helperText,
  promptVisual,
  options = [],
  onContinue,
  onBack,
}) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flippedIndex, setFlippedIndex]  = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [dragOffset, setDragOffset]      = useState(0)
  const [isDragging, setIsDragging]      = useState(false)

  // Cinematic reveal phase
  const [showReveal,    setShowReveal]    = useState(false)
  const [revealLineCnt, setRevealLineCnt] = useState(0)
  const [revealHint,    setRevealHint]    = useState(false)
  const [revealLocked,  setRevealLocked]  = useState(false)

  // Preload all card images immediately on mount
  useEffect(() => {
    options.forEach(opt => {
      if (opt.image) {
        const img = new window.Image()
        img.src = opt.image
      }
    })
  }, [options])

  // Imperative refs so carousel event handlers are always stable
  const touchRef   = useRef({ startX: 0, startY: 0, isDrag: false, moved: false })
  const stateRef   = useRef({ currentIndex: 0, length: options.length })
  const carouselEl = useRef(null)
  const choosing   = useRef(false)

  useEffect(() => {
    stateRef.current.currentIndex = currentIndex
    stateRef.current.length       = options.length
  }, [currentIndex, options.length])

  const subjectData = SUBJECTS[subject] || {}
  const accent      = subjectData.accent    || '#9D5CFF'
  const accentRgb   = subjectData.accentRgb || '157,92,255'

  const currentOption = options[currentIndex] || {}
  const isChosen      = selectedIndex !== null

  // ── Touch handlers (attached imperatively for { passive: false }) ────────────

  const onTouchStart = useCallback((e) => {
    const t = e.touches[0]
    touchRef.current = { startX: t.clientX, startY: t.clientY, isDrag: false, moved: false }
    setIsDragging(true)
    setDragOffset(0)
  }, [])

  const onTouchMove = useCallback((e) => {
    const t   = e.touches[0]
    const dx  = t.clientX - touchRef.current.startX
    const dy  = t.clientY - touchRef.current.startY

    if (!touchRef.current.moved) {
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) {
        touchRef.current.moved  = true
        touchRef.current.isDrag = true
      } else if (Math.abs(dy) > 5) {
        touchRef.current.moved  = true
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
    const dx   = endX - touchRef.current.startX

    setIsDragging(false)
    setDragOffset(0)

    if (!touchRef.current.isDrag) {
      // Tap — let the click handler fire naturally (no duplicate logic here)
      return
    }

    // Swipe: snap to neighbour if delta clears threshold
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
    el.addEventListener('touchmove',  onTouchMove,  { passive: false })
    el.addEventListener('touchend',   onTouchEnd,   { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove',  onTouchMove)
      el.removeEventListener('touchend',   onTouchEnd)
    }
  }, [onTouchStart, onTouchMove, onTouchEnd])

  // ── Card tap (via click — fires on tap after touchend, and on desktop clicks) ─

  function handleCardClick(idx) {
    // Suppress click that follows a swipe (touchmove called preventDefault)
    if (touchRef.current.isDrag) return

    if (idx !== currentIndex) {
      setCurrentIndex(idx)
      setFlippedIndex(null)
      return
    }
    setFlippedIndex(f => (f === idx ? null : idx))
  }

  // ── Selection ──────────────────────────────────────────────────────────────

  function handleChoose() {
    if (isChosen || choosing.current) return
    choosing.current = true
    setSelectedIndex(currentIndex)
    setTimeout(() => setShowReveal(true), 450)
  }

  // ── Reveal phase helpers ───────────────────────────────────────────────────
  const selectedOption = selectedIndex !== null ? options[selectedIndex] : null
  const revealLines    = selectedOption?.revealLines || []
  const titleLine      = revealLines[0] || ''
  const bodyLines      = revealLines.slice(1)
  const allRevealed    = revealLineCnt >= bodyLines.length

  useEffect(() => {
    if (!showReveal || allRevealed) return
    setRevealHint(false)
    const t = setTimeout(() => setRevealHint(true), 600)
    return () => clearTimeout(t)
  }, [showReveal, revealLineCnt, allRevealed])

  function handleRevealTap() {
    if (revealLocked || allRevealed) return
    setRevealLocked(true)
    setRevealLineCnt(c => c + 1)
    setTimeout(() => setRevealLocked(false), 200)
  }

  // ── Track translation ──────────────────────────────────────────────────────

  const liveOffset  = isDragging ? dragOffset : 0
  const trackTransX = `calc(${SIDE_OFFSET}vw - (${currentIndex} * (${CARD_VW}vw + ${CARD_GAP}px)) + ${liveOffset}px)`

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div style={{
      position:        'fixed',
      inset:           0,
      background:      '#08090D',
      display:         'flex',
      flexDirection:   'column',
      overflow:        'hidden',
      userSelect:      'none',
      WebkitUserSelect: 'none',
    }}>

      {/* ── Prompt area ─────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        padding: `calc(env(safe-area-inset-top, 0px) + 80px) ${SPACING.standard}px ${SPACING.compact}px`,
        textAlign: 'center',
      }}>
        {promptVisual?.src && (
          <div style={{
            width:         52,
            height:        52,
            borderRadius:  RADII.pill,
            overflow:      'hidden',
            margin:        '0 auto',
            marginBottom:  SPACING.compact,
            border:        '1px solid rgba(255,255,255,0.08)',
          }}>
            <img
              src={promptVisual.src}
              alt={promptVisual.alt || ''}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              draggable={false}
            />
          </div>
        )}

        {headline && (
          <div style={{
            ...TYPE.metadata,
            color:          accent,
            textTransform:  'uppercase',
            letterSpacing:  '0.12em',
            marginBottom:   SPACING.micro,
          }}>
            {headline}
          </div>
        )}

        <div style={{
          ...TYPE.cardTitle,
          color:        '#F5F7FF',
          marginBottom: helperText ? SPACING.micro : 0,
        }}>
          {question}
        </div>

        {helperText && (
          <div style={{
            ...TYPE.bodySmall,
            fontSize: 14,
            color:    '#5E5874',
          }}>
            {helperText}
          </div>
        )}
      </div>

      {/* ── Carousel ────────────────────────────────────────────────────────── */}
      <div
        ref={carouselEl}
        style={{
          flex:            '1 1 0',
          overflow:        'hidden',
          display:         'flex',
          flexDirection:   'column',
          justifyContent:  'center',
          cursor:          'grab',
        }}
      >
        {/* Sliding track */}
        <div style={{
          display:    'flex',
          gap:        CARD_GAP,
          transform:  `translateX(${trackTransX})`,
          transition: isDragging
            ? 'none'
            : `transform ${MOTION.duration.standard} ${MOTION.easing.standard}`,
          willChange: 'transform',
          alignItems: 'stretch',
        }}>
          {options.map((opt, idx) => {
            const isCurrentCard = idx === currentIndex
            const isCardFlipped = flippedIndex === idx
            const isSelected    = selectedIndex === idx
            const isFaded       = isChosen && !isSelected

            return (
              <div
                key={idx}
                onClick={() => handleCardClick(idx)}
                style={{
                  flexShrink: 0,
                  width:      `${CARD_VW}vw`,
                  height:     `min(60vh, calc(${CARD_VW}vw * 1.34))`,
                  perspective: 1200,
                  cursor:     'pointer',
                  transform:  `scale(${isSelected ? 1.02 : isFaded ? 0.96 : 1})`,
                  opacity:    isFaded ? 0.22 : 1,
                  transition: `transform ${MOTION.duration.standard} ${MOTION.easing.standard},
                               opacity   ${MOTION.duration.standard} ${MOTION.easing.standard}`,
                }}
              >
                {/* Inner flipper */}
                <div style={{
                  width:           '100%',
                  height:          '100%',
                  transformStyle:  'preserve-3d',
                  transform:       isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transition:      `transform ${MOTION.duration.slow} ${MOTION.easing.standard}`,
                  position:        'relative',
                }}>

                  {/* ─ Front ─ */}
                  <div style={{
                    position:              'absolute',
                    inset:                 0,
                    backfaceVisibility:    'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    borderRadius:          RADII.large,
                    overflow:              'hidden',
                    background:            '#101218',
                    border:                isSelected
                      ? `1.5px solid rgba(${accentRgb}, 0.55)`
                      : '1px solid rgba(255,255,255,0.06)',
                    boxShadow:             isSelected
                      ? `0 0 40px rgba(${accentRgb}, 0.18), 0 12px 48px rgba(0,0,0,0.55)`
                      : '0 12px 48px rgba(0,0,0,0.55)',
                    display:               'flex',
                    flexDirection:         'column',
                    transition:            `border-color ${MOTION.duration.standard} ${MOTION.easing.standard},
                                           box-shadow    ${MOTION.duration.standard} ${MOTION.easing.standard}`,
                  }}>

                    {/* Image — 82% of card height */}
                    <div style={{ flex: '0 0 82%', position: 'relative', overflow: 'hidden', background: '#080C18' }}>
                      {opt.image ? (
                        <img
                          src={opt.image}
                          alt={opt.title}
                          loading="eager"
                          style={{
                            width:           '100%',
                            height:          '100%',
                            objectFit:       'cover',
                            objectPosition:  'center top',
                            display:         'block',
                            filter:          'brightness(0.72) grayscale(8%) contrast(1.02)',
                          }}
                          draggable={false}
                        />
                      ) : (
                        <div style={{
                          width:       '100%',
                          height:      '100%',
                          background:  `rgba(${accentRgb}, 0.06)`,
                          display:     'flex',
                          alignItems:  'center',
                          justifyContent: 'center',
                        }}>
                          <div style={{
                            width:        40,
                            height:       40,
                            borderRadius: RADII.pill,
                            border:       `1px solid rgba(${accentRgb}, 0.2)`,
                          }} />
                        </div>
                      )}

                      {/* Bottom image gradient */}
                      <div style={{
                        position:   'absolute',
                        bottom:     0, left: 0, right: 0,
                        height:     '45%',
                        background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.72))',
                        pointerEvents: 'none',
                      }} />

                      {/* "Tap to explore" hint on active card */}
                      {isCurrentCard && !isCardFlipped && !isChosen && (
                        <div style={{
                          position:        'absolute',
                          top:             SPACING.compact,
                          right:           SPACING.compact,
                          background:      'rgba(0,0,0,0.5)',
                          backdropFilter:  'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          borderRadius:    RADII.pill,
                          padding:         '4px 10px',
                          ...TYPE.metadata,
                          fontSize:        11,
                          color:           'rgba(255,255,255,0.55)',
                          letterSpacing:   '0.04em',
                          pointerEvents:   'none',
                        }}>
                          Tap to explore
                        </div>
                      )}
                    </div>

                    {/* Title strip — 18% of card height */}
                    <div style={{
                      flex:           '0 0 18%',
                      padding:        `${SPACING.compact}px`,
                      display:        'flex',
                      flexDirection:  'column',
                      justifyContent: 'center',
                    }}>
                      <div style={{
                        ...TYPE.metadata,
                        color:          '#F5F7FF',
                        fontWeight:     700,
                        letterSpacing:  '0.07em',
                        textTransform:  'uppercase',
                        whiteSpace:     'nowrap',
                        overflow:       'hidden',
                        textOverflow:   'ellipsis',
                      }}>
                        {opt.title}
                      </div>
                      {opt.subtitle && (
                        <div style={{
                          ...TYPE.metadata,
                          fontSize:       12,
                          color:          '#5E5874',
                          marginTop:      3,
                          whiteSpace:     'nowrap',
                          overflow:       'hidden',
                          textOverflow:   'ellipsis',
                        }}>
                          {opt.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ─ Back ─ */}
                  <div style={{
                    position:              'absolute',
                    inset:                 0,
                    backfaceVisibility:    'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform:             'rotateY(180deg)',
                    borderRadius:          RADII.large,
                    overflow:              'hidden',
                    overflowY:             'auto',
                    background:            '#0D1018',
                    border:                '1px solid rgba(255,255,255,0.07)',
                    boxShadow:             '0 12px 48px rgba(0,0,0,0.55)',
                    padding:               SPACING.standard,
                    WebkitOverflowScrolling: 'touch',
                  }}>
                    {/* Option label */}
                    <div style={{
                      ...TYPE.metadata,
                      color:          accent,
                      fontWeight:     700,
                      textTransform:  'uppercase',
                      letterSpacing:  '0.1em',
                      marginBottom:   SPACING.compact,
                    }}>
                      {opt.title}
                    </div>

                    {/* Content sections — max 4 */}
                    {(opt.sections || []).slice(0, 4).map((section, sIdx) => (
                      <div key={sIdx} style={{ marginBottom: SPACING.compact }}>
                        {section.heading && (
                          <div style={{
                            ...TYPE.metadata,
                            fontSize:       11,
                            color:          '#5E5874',
                            textTransform:  'uppercase',
                            letterSpacing:  '0.12em',
                            marginBottom:   6,
                          }}>
                            {section.heading}
                          </div>
                        )}
                        {(section.items || []).slice(0, 5).map((item, iIdx) => (
                          <div key={iIdx} style={{
                            display:     'flex',
                            gap:         SPACING.micro,
                            marginBottom: 7,
                            alignItems:  'flex-start',
                          }}>
                            <div style={{
                              width:        4,
                              height:       4,
                              borderRadius: '50%',
                              background:   `rgba(${accentRgb}, 0.55)`,
                              flexShrink:   0,
                              marginTop:    8,
                            }} />
                            <div style={{
                              ...TYPE.bodySmall,
                              fontSize:    14,
                              color:       '#A89FC2',
                              lineHeight:  1.5,
                            }}>
                              {item}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}

                    {/* Reaction block — max 80 chars */}
                    {opt.reaction && (
                      <div style={{
                        marginTop:    SPACING.compact,
                        padding:      SPACING.compact,
                        background:   `rgba(${accentRgb}, 0.05)`,
                        borderRadius: RADII.medium,
                        border:       `1px solid rgba(${accentRgb}, 0.14)`,
                        ...TYPE.bodySmall,
                        fontSize:     13,
                        color:        '#A89FC2',
                        fontStyle:    'italic',
                        lineHeight:   1.5,
                      }}>
                        {opt.reaction.slice(0, 80)}
                      </div>
                    )}

                    {/* Flip-back cue */}
                    <div style={{
                      textAlign:     'center',
                      marginTop:     SPACING.compact,
                      paddingTop:    SPACING.compact,
                      borderTop:     '1px solid rgba(255,255,255,0.05)',
                      ...TYPE.metadata,
                      fontSize:      11,
                      color:         '#3A3A4A',
                    }}>
                      Tap to flip back
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Dot indicators */}
        <div style={{
          display:         'flex',
          justifyContent:  'center',
          gap:             SPACING.micro,
          marginTop:       SPACING.compact,
          paddingBottom:   SPACING.micro,
        }}>
          {options.map((_, idx) => (
            <div
              key={idx}
              style={{
                width:        idx === currentIndex ? 20 : 6,
                height:       6,
                borderRadius: RADII.pill,
                background:   idx === currentIndex
                  ? accent
                  : 'rgba(255,255,255,0.14)',
                transition: `all ${MOTION.duration.standard} ${MOTION.easing.standard}`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ── CTA area ────────────────────────────────────────────────────────── */}
      <div style={{
        flexShrink: 0,
        padding: `${SPACING.compact}px ${SPACING.standard}px calc(${SPACING.compact}px + env(safe-area-inset-bottom, 0px))`,
      }}>
        <button
          onClick={handleChoose}
          style={{
            width:          '100%',
            height:         58,
            borderRadius:   RADII.large,
            border:         'none',
            cursor:         isChosen ? 'default' : 'pointer',
            background:     isChosen
              ? `rgba(${accentRgb}, 0.12)`
              : `linear-gradient(135deg, rgba(${accentRgb}, 0.85) 0%, rgba(${accentRgb}, 1) 100%)`,
            boxShadow:      isChosen
              ? 'none'
              : `0 4px 28px rgba(${accentRgb}, 0.28)`,
            color:          isChosen ? accent : '#fff',
            ...TYPE.bodySmall,
            fontWeight:     700,
            letterSpacing:  '0.02em',
            transition:     `all ${MOTION.duration.standard} ${MOTION.easing.standard}`,
            transform:      'translateZ(0)',
          }}
        >
          {isChosen ? '✓ Selected' : (currentOption.buttonText || 'Choose this')}
        </button>
      </div>

      {/* ── Cinematic choice reveal overlay ─────────────────────────────────── */}
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
              @keyframes gcc-hint {
                0%, 100% { opacity: 0; transform: translateY(0); }
                35%, 65%  { opacity: 0.5; transform: translateY(-3px); }
              }
              @keyframes gcc-cont {
                from { opacity: 0; transform: translateY(14px); }
                to   { opacity: 1; transform: translateY(0); }
              }
            `}</style>

            <div
              onClick={!allRevealed ? handleRevealTap : undefined}
              style={{
                position: 'fixed', inset: 0, zIndex: 1100,
                background: '#08090D',
                cursor: allRevealed ? 'default' : 'pointer',
                userSelect: 'none', WebkitUserSelect: 'none',
              }}
            >
              {/* Healer background image */}
              <div style={{
                position: 'fixed', inset: 0,
                backgroundImage: `url(${selectedOption.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                opacity: 0.38,
                filter: 'grayscale(12%) brightness(0.52)',
                pointerEvents: 'none', zIndex: 1,
              }} />

              {/* Left gradient */}
              <div style={{
                position: 'fixed', inset: 0,
                background: 'linear-gradient(90deg, rgba(8,9,13,0.97) 0%, rgba(8,9,13,0.82) 42%, rgba(8,9,13,0.46) 72%, rgba(8,9,13,0.18) 100%)',
                pointerEvents: 'none', zIndex: 2,
              }} />

              {/* Overall dark overlay */}
              <div style={{
                position: 'fixed', inset: 0,
                background: 'rgba(8,9,13,0.22)',
                pointerEvents: 'none', zIndex: 3,
              }} />

              {/* Bottom fade */}
              <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, height: 260,
                background: 'linear-gradient(0deg, rgba(8,9,13,0.99) 0%, transparent 100%)',
                pointerEvents: 'none', zIndex: 4,
              }} />

              {/* Content shell */}
              <div style={{ position: 'relative', zIndex: 5, minHeight: '100dvh' }}>

                {/* Title with word stagger */}
                <div style={{
                  position: 'absolute', top: '26%', left: 28, right: 28,
                  maxHeight: 'calc(100dvh - 180px)',
                  overflowY: 'auto',
                  paddingBottom: 100,
                  WebkitOverflowScrolling: 'touch',
                }}>
                  <div style={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(28px, 9vw, 40px)',
                    lineHeight: 'clamp(33px, 10.5vw, 46px)',
                    letterSpacing: '-0.04em',
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

                  {/* Body lines revealed on tap */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {bodyLines.slice(0, revealLineCnt).map((line, i) => {
                      const isPunchline = i === bodyLines.length - 1
                      return (
                        <div key={i} style={{
                          fontFamily: isPunchline ? "'Sora', sans-serif" : "'Outfit', sans-serif",
                          fontWeight: isPunchline ? 700 : 500,
                          fontSize: isPunchline ? 'clamp(20px, 6vw, 26px)' : 17,
                          lineHeight: isPunchline ? 1.3 : 1.65,
                          letterSpacing: isPunchline ? '-0.02em' : 0,
                          color: isPunchline ? accent : 'rgba(255,255,255,0.62)',
                          animation: 'gcc-line 380ms cubic-bezier(0.16,1,0.3,1) both',
                          marginTop: isPunchline ? 8 : 0,
                        }}>
                          {line}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Tap hint */}
              {!allRevealed && revealHint && (
                <div style={{
                  position: 'fixed',
                  bottom: 'calc(38px + env(safe-area-inset-bottom, 0px))',
                  left: 0, right: 0, textAlign: 'center',
                  pointerEvents: 'none', zIndex: 6,
                  animation: 'gcc-hint 3.2s ease infinite',
                }}>
                  <span style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600, fontSize: 11,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.28)',
                  }}>
                    tap to continue
                  </span>
                </div>
              )}

              {/* Continue button — appears when all lines are revealed */}
              {allRevealed && (
                <button
                  onClick={(e) => { e.stopPropagation(); onContinue(selectedOption.nextScreenId) }}
                  style={{
                    position: 'fixed',
                    bottom: 'calc(72px + env(safe-area-inset-bottom, 0px))',
                    left: 28,
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                    zIndex: 10,
                    fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 22,
                    color: accent,
                    animation: 'gcc-cont 500ms cubic-bezier(0.16,1,0.3,1) 120ms both',
                  }}
                >
                  Continue →
                </button>
              )}
            </div>
          </>
        )
      })()}
    </div>
  )
}
