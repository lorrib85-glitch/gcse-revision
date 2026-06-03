import { useState, useEffect } from 'react'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'

const THEMES = {
  History: {
    glow:        '#D4A84B',
    glowRgb:     '212,168,75',
    text:        '#F5EDD8',
    muted:       'rgba(245,237,216,0.72)',
    pageBg:      '#0B0702',
    sheetBg:     'linear-gradient(180deg, rgba(20,14,6,0.98), rgba(12,8,3,0.99))',
    sheetBorder: 'rgba(212,168,75,0.12)',
  },
  Biology: {
    glow:        '#7EE7B7',
    glowRgb:     '126,231,183',
    text:        '#EAF7F0',
    muted:       'rgba(234,247,240,0.72)',
    pageBg:      '#040C09',
    sheetBg:     'linear-gradient(180deg, rgba(7,20,15,0.98), rgba(4,13,10,0.99))',
    sheetBorder: 'rgba(126,231,183,0.12)',
  },
  Chemistry: {
    glow:        '#5CC8FF',
    glowRgb:     '92,200,255',
    text:        '#E8F4FF',
    muted:       'rgba(232,244,255,0.72)',
    pageBg:      '#02060E',
    sheetBg:     'linear-gradient(180deg, rgba(6,12,24,0.98), rgba(3,7,16,0.99))',
    sheetBorder: 'rgba(92,200,255,0.12)',
  },
  English: {
    glow:        '#C97090',
    glowRgb:     '201,112,144',
    text:        '#F5E8EE',
    muted:       'rgba(245,232,238,0.72)',
    pageBg:      '#080304',
    sheetBg:     'linear-gradient(180deg, rgba(18,8,12,0.98), rgba(12,4,7,0.99))',
    sheetBorder: 'rgba(201,112,144,0.12)',
  },
  Sociology: {
    glow:        '#C9B07C',
    glowRgb:     '201,176,124',
    text:        '#F5EDD8',
    muted:       'rgba(245,237,216,0.72)',
    pageBg:      '#070501',
    sheetBg:     'linear-gradient(180deg, rgba(16,14,6,0.98), rgba(10,8,3,0.99))',
    sheetBorder: 'rgba(201,176,124,0.12)',
  },
}

const PHASE_LABELS = ['Hook', 'What is it?', 'Why does it matter?', 'Common mistake', 'Exam takeaway']

function SynthesisScreen({ synthesis, glow, glowRgb, text, muted, pageBg, sheetBg, sheetBorder, onContinue }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: pageBg,
      fontFamily: "'Sora', sans-serif",
      display: 'flex', flexDirection: 'column',
      padding: `calc(env(safe-area-inset-top, 0px) + ${SPACING.cinematic}px) ${SPACING.standard}px`,
      paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + ${SPACING.separation}px)`,
    }}>
      <style>{`
        @keyframes ice-synth-in {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          ...TYPE.metadata,
          color: `rgba(${glowRgb}, 0.55)`,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: SPACING.compact,
          opacity: visible ? 1 : 0,
          transition: `opacity 400ms ${MOTION.easing.standard}`,
        }}>
          Collection complete
        </div>

        <h2 style={{
          ...TYPE.sectionTitle,
          color: text,
          margin: `0 0 ${SPACING.separation}px`,
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(16px)',
          transition: `opacity 400ms ${MOTION.easing.standard} 80ms, transform 400ms ${MOTION.easing.standard} 80ms`,
        }}>
          {synthesis.heading}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.compact }}>
          {(synthesis.points || []).map((point, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: SPACING.compact,
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(14px)',
              transition: `opacity 400ms ${MOTION.easing.standard} ${160 + i * 80}ms, transform 400ms ${MOTION.easing.standard} ${160 + i * 80}ms`,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                marginTop: 8,
                background: glow,
                boxShadow: `0 0 8px rgba(${glowRgb}, 0.6)`,
              }} />
              <p style={{
                ...TYPE.bodySmall,
                color: muted,
                margin: 0,
                lineHeight: 1.65,
              }}>
                {point}
              </p>
            </div>
          ))}
        </div>

        {synthesis.examTakeaway && (
          <div style={{
            marginTop: SPACING.separation,
            borderLeft: `2px solid rgba(${glowRgb}, 0.35)`,
            paddingLeft: SPACING.standard,
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(14px)',
            transition: `opacity 400ms ${MOTION.easing.standard} ${160 + (synthesis.points?.length || 0) * 80 + 80}ms, transform 400ms ${MOTION.easing.standard} ${160 + (synthesis.points?.length || 0) * 80 + 80}ms`,
          }}>
            <div style={{
              ...TYPE.metadata,
              fontSize: 11,
              color: glow,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              marginBottom: SPACING.micro,
            }}>
              Exam takeaway
            </div>
            <p style={{
              ...TYPE.bodySmall,
              color: text,
              margin: 0,
              lineHeight: 1.65,
              fontWeight: 500,
            }}>
              {synthesis.examTakeaway}
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onContinue}
        style={{
          width: '100%', height: 52,
          borderRadius: RADII.medium,
          background: `rgba(${glowRgb}, 0.14)`,
          border: `1px solid rgba(${glowRgb}, 0.28)`,
          color: text,
          ...TYPE.bodySmall,
          fontWeight: 700,
          cursor: 'pointer',
          opacity: visible ? 1 : 0,
          transition: `opacity 400ms ${MOTION.easing.standard} 600ms`,
        }}
      >
        Continue →
      </button>
    </div>
  )
}

export default function InteractiveCollectionExplorer({
  subject       = 'History',
  title         = '',
  description   = '',
  backgroundImage = '',
  items         = [],
  synthesis     = null,
  onContinue,
}) {
  const theme = THEMES[subject] || THEMES.History
  const { glow, glowRgb, text, muted, pageBg, sheetBg, sheetBorder } = theme

  const [selectedId,   setSelectedId]   = useState(null)
  const [revealStep,   setRevealStep]   = useState(0)
  const [explored,     setExplored]     = useState(new Set())
  const [showSynthesis, setShowSynthesis] = useState(false)
  const [revealKey,    setRevealKey]    = useState(0)

  const selected    = items.find(i => i.id === selectedId) || null
  const allExplored = explored.size === items.length && items.length > 0

  useEffect(() => {
    if (allExplored && !selectedId && !showSynthesis) {
      const t = setTimeout(() => setShowSynthesis(true), 500)
      return () => clearTimeout(t)
    }
  }, [allExplored, selectedId, showSynthesis])

  function handleTap(id) {
    setSelectedId(id)
    setRevealStep(0)
    setRevealKey(k => k + 1)
  }

  function handleNext() {
    if (!selected) return
    if (revealStep < selected.reveals.length - 1) {
      setRevealStep(s => s + 1)
      setRevealKey(k => k + 1)
    } else {
      setExplored(prev => { const n = new Set(prev); n.add(selectedId); return n })
      setSelectedId(null)
      setRevealStep(0)
    }
  }

  function handleDismiss() {
    setSelectedId(null)
    setRevealStep(0)
  }

  const isLastReveal   = selected && revealStep === selected.reveals.length - 1
  const currentReveal  = selected?.reveals[revealStep]

  if (showSynthesis && synthesis) {
    return (
      <SynthesisScreen
        synthesis={synthesis}
        glow={glow} glowRgb={glowRgb} text={text} muted={muted}
        pageBg={pageBg} sheetBg={sheetBg} sheetBorder={sheetBorder}
        onContinue={onContinue}
      />
    )
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: pageBg,
      fontFamily: "'Sora', sans-serif",
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes ice-pulse {
          0%,100% {
            box-shadow:
              0 0 0 2px rgba(${glowRgb},0.55),
              0 0 22px rgba(${glowRgb},0.70),
              0 0 52px rgba(${glowRgb},0.35);
          }
          50% {
            box-shadow:
              0 0 0 3px rgba(${glowRgb},0.75),
              0 0 36px rgba(${glowRgb},0.90),
              0 0 72px rgba(${glowRgb},0.50);
          }
        }
        @keyframes ice-reveal-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ice-dot:active  { transform: translate(-50%,-50%) scale(0.86) !important; }
        .ice-next:active { opacity: 0.78; }
      `}</style>

      {/* ── Background image ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '60%',
        transition: `filter ${MOTION.duration.slow} ${MOTION.easing.gentle}`,
        filter: selected
          ? 'blur(4px) brightness(0.40) saturate(0.7)'
          : 'brightness(0.78) saturate(0.88)',
      }}>
        <img
          src={backgroundImage}
          alt=""
          draggable={false}
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center top',
            userSelect: 'none',
          }}
        />
        {/* Bottom fade */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
          background: `linear-gradient(180deg, transparent, ${pageBg})`,
          pointerEvents: 'none',
        }} />
      </div>

      {/* ── Dot targets on image ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '60%',
        zIndex: 6,
      }}>
        {items.map(item => {
          const isSel      = selectedId === item.id
          const isExplored = explored.has(item.id)

          return (
            <button
              key={item.id}
              className="ice-dot"
              aria-label={`Explore ${item.label}`}
              aria-pressed={isSel}
              onClick={() => handleTap(item.id)}
              style={{
                position: 'absolute',
                left: `${item.x}%`, top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
                width: 32, height: 32,
                borderRadius: '50%',
                border: 'none', padding: 0,
                cursor: 'pointer',
                background: isSel
                  ? `rgba(${glowRgb}, 0.22)`
                  : isExplored
                    ? `rgba(${glowRgb}, 0.14)`
                    : 'rgba(255,255,255,0.06)',
                boxShadow: isSel
                  ? `0 0 0 2.5px rgba(${glowRgb},0.9), 0 0 28px rgba(${glowRgb},1.0), 0 0 64px rgba(${glowRgb},0.55)`
                  : isExplored
                    ? `0 0 0 1.5px rgba(${glowRgb},0.45), 0 0 14px rgba(${glowRgb},0.50), 0 0 32px rgba(${glowRgb},0.20)`
                    : undefined,
                animation: !isExplored && !isSel ? 'ice-pulse 2.8s ease-in-out infinite' : 'none',
                transition: `box-shadow 280ms ${MOTION.easing.standard}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: isSel ? 8 : 6,
              }}
            >
              {isExplored ? (
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7.5l3.5 3.5 6.5-7" stroke={glow} strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: isSel ? glow : 'rgba(255,255,255,0.88)',
                  boxShadow: isSel ? `0 0 8px ${glow}` : 'none',
                  transition: `all 280ms ${MOTION.easing.standard}`,
                }} />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Collection info — below image ─────────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: '57%', left: 0, right: 0, bottom: 0,
        padding: `0 ${SPACING.standard}px`,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + ${SPACING.standard}px)`,
        opacity: selected ? 0 : 1,
        transition: `opacity 220ms ${MOTION.easing.gentle}`,
        pointerEvents: selected ? 'none' : 'auto',
        zIndex: 5,
      }}>
        <p style={{
          ...TYPE.bodySmall,
          color: muted,
          margin: `0 0 ${SPACING.standard}px`,
          maxWidth: '32ch',
        }}>
          {description}
        </p>

        {/* Progress dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro, marginBottom: SPACING.compact }}>
          {items.map(item => (
            <div key={item.id} style={{
              width: explored.has(item.id) ? 14 : 6,
              height: 6, borderRadius: 3,
              background: explored.has(item.id) ? glow : `rgba(${glowRgb}, 0.22)`,
              transition: `all 380ms ${MOTION.easing.standard}`,
            }} />
          ))}
        </div>

        <div style={{
          ...TYPE.metadata,
          fontSize: 12,
          color: `rgba(${glowRgb}, 0.65)`,
          letterSpacing: '0.16em',
        }}>
          {explored.size} of {items.length} explored
        </div>
      </div>

      {/* ── Tap-behind dismiss — closes sheet without advancing reveal ─── */}
      {selected && (
        <div
          onClick={handleDismiss}
          style={{ position: 'absolute', inset: 0, zIndex: 20 }}
        />
      )}

      {/* ── Item reveal sheet ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        background: sheetBg,
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderTop: `1px solid ${sheetBorder}`,
        borderRadius: `${RADII.panel}px ${RADII.panel}px 0 0`,
        padding: `${SPACING.compact}px ${SPACING.standard}px`,
        paddingBottom: `calc(max(${SPACING.compact}px, env(safe-area-inset-bottom, 0px)) + ${SPACING.compact}px)`,
        transform: selected ? 'translateY(0)' : 'translateY(100%)',
        transition: `transform 420ms ${MOTION.easing.standard}`,
        zIndex: 30,
        maxHeight: '52vh',
      }}>
        {selected && (
          <>
            {/* Pull handle */}
            <div style={{
              width: 32, height: 3, borderRadius: 2,
              background: `rgba(${glowRgb}, 0.18)`,
              margin: `-4px auto ${SPACING.standard}px`,
            }} />

            {/* Phase label + step progress */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: SPACING.micro,
            }}>
              <div style={{
                ...TYPE.metadata,
                fontSize: 11,
                color: `rgba(${glowRgb}, 0.55)`,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}>
                {PHASE_LABELS[revealStep]}
              </div>
              <div style={{
                ...TYPE.metadata,
                fontSize: 11,
                color: `rgba(${glowRgb}, 0.35)`,
                letterSpacing: '0.12em',
              }}>
                {revealStep + 1} / {selected.reveals.length}
              </div>
            </div>

            {/* Step track */}
            <div style={{
              display: 'flex', gap: 4,
              marginBottom: SPACING.standard,
            }}>
              {selected.reveals.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 2, borderRadius: 2,
                  background: i <= revealStep ? glow : `rgba(${glowRgb}, 0.16)`,
                  transition: `background 300ms ${MOTION.easing.gentle}`,
                }} />
              ))}
            </div>

            {/* Item name */}
            <div style={{
              ...TYPE.cardTitle,
              color: text,
              marginBottom: SPACING.compact,
            }}>
              {selected.label}
            </div>

            {/* Reveal text — re-keyed to re-animate on step change */}
            <p key={revealKey} style={{
              ...TYPE.bodySmall,
              color: muted,
              margin: `0 0 ${SPACING.standard}px`,
              lineHeight: 1.72,
              animation: `ice-reveal-in 320ms ${MOTION.easing.standard} both`,
            }}>
              {currentReveal?.text}
            </p>

            {/* Next / mark explored button */}
            <button
              className="ice-next"
              onClick={e => { e.stopPropagation(); handleNext() }}
              style={{
                width: '100%', height: 52,
                borderRadius: RADII.medium,
                background: isLastReveal
                  ? `rgba(${glowRgb}, 0.20)`
                  : `rgba(${glowRgb}, 0.10)`,
                border: `1px solid rgba(${glowRgb}, ${isLastReveal ? 0.38 : 0.20})`,
                color: text,
                ...TYPE.bodySmall,
                fontWeight: 700,
                cursor: 'pointer',
                transition: `background 200ms ${MOTION.easing.gentle}, border-color 200ms ${MOTION.easing.gentle}`,
              }}
            >
              {isLastReveal ? 'Mark explored →' : 'Next →'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
