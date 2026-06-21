import { useState, useRef } from 'react'
import { MOTION } from '../../constants/motion.js'
import { logWrongAnswer, logCorrectAnswer } from '../../unifiedWeaknessTracker.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
// CinematicShell: full-bleed background + vignette overlays must fill the full viewport;
// InteractionShell's 16px padding would clip them.
import CinematicShell from '../layout/CinematicShell.jsx'

const BRONZE     = '#D69B45'
const BRONZE_RGB = '214,155,69'

const STAGE_BG          = 'rgba(28,18,9,0.90)'
const STAGE_BG_SUCCESS  = 'rgba(34,22,8,0.92)'
const STAGE_BG_WRONG    = 'rgba(24,14,7,0.92)'
const STAGE_BORDER      = 'rgba(160,115,55,0.30)'
const STAGE_BORDER_SUCCESS = 'rgba(214,155,69,0.72)'
const STAGE_BORDER_WRONG   = 'rgba(90,55,30,0.42)'

const ANSWER_BG          = 'rgba(22,13,6,0.92)'
const ANSWER_BG_SELECTED = 'rgba(52,32,12,0.96)'
const ANSWER_BG_PLACED   = 'rgba(14,9,4,0.60)'
const ANSWER_BORDER          = 'rgba(145,100,45,0.32)'
const ANSWER_BORDER_SELECTED = `rgba(${BRONZE_RGB},0.72)`
const ANSWER_BORDER_PLACED   = 'rgba(80,55,25,0.18)'

const TEXT_PRIMARY = 'rgba(255,244,222,0.92)'
const TEXT_DIM     = 'rgba(240,220,185,0.68)'
const TEXT_PLACED  = 'rgba(200,165,110,0.42)'

const CSS = `
  @keyframes ecr-in {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes ecr-shake {
    0%,100% { transform: translateX(0); }
    18%  { transform: translateX(-6px); }
    46%  { transform: translateX(5px); }
    68%  { transform: translateX(-3px); }
    86%  { transform: translateX(2px); }
  }
`

function GripDots({ selected }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 4px)', gap: 2.5,
      marginBottom: 5,
    }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{
          width: 4, height: 4, borderRadius: '50%',
          background: selected
            ? `rgba(${BRONZE_RGB}, 0.65)`
            : 'rgba(200,165,110,0.25)',
          transition: `background ${MOTION.duration.fast} ease`,
        }} />
      ))}
    </div>
  )
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────

function IconHelmet() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M3 13c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke={BRONZE} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M2 13h16" stroke={BRONZE} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M5 13v1.5a1 1 0 001 1h8a1 1 0 001-1V13" stroke={BRONZE} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

function IconCross() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="8" y="3" width="4" height="14" rx="1" fill={BRONZE} opacity="0.85"/>
      <rect x="3" y="8" width="14" height="4" rx="1" fill={BRONZE} opacity="0.85"/>
    </svg>
  )
}

function IconHut() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M2 10l8-7 8 7" stroke={BRONZE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="4" y="10" width="12" height="8" rx="1" stroke={BRONZE} strokeWidth="1.5"/>
      <rect x="8" y="13" width="4" height="5" rx="0.5" stroke={BRONZE} strokeWidth="1.2"/>
    </svg>
  )
}

function IconTrain() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="4" width="14" height="10" rx="2" stroke={BRONZE} strokeWidth="1.5"/>
      <path d="M3 8h14" stroke={BRONZE} strokeWidth="1.3"/>
      <circle cx="6.5" cy="17" r="1.5" stroke={BRONZE} strokeWidth="1.3"/>
      <circle cx="13.5" cy="17" r="1.5" stroke={BRONZE} strokeWidth="1.3"/>
      <path d="M6.5 15.5V14M13.5 15.5V14" stroke={BRONZE} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M7 4V3M13 4V3" stroke={BRONZE} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  )
}

const ICON_MAP = {
  helmet: IconHelmet,
  cross:  IconCross,
  hut:    IconHut,
  train:  IconTrain,
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function EvacuationChainRoute({ screen, subject, onComplete }) {
  const stages  = screen.stages  || []
  const answers = screen.answers || []
  const bgImage = screen.backgroundImage || ''
  const subjectKey = subject || screen.subject || 'History'

  // slots: stageId → answerId | null
  const [slots, setSlots] = useState(() =>
    Object.fromEntries(stages.map(s => [s.id, null]))
  )
  const [selectedId, setSelectedId] = useState(null) // id of selected answer card
  const [checked,    setChecked]    = useState(false)
  const [results,    setResults]    = useState({})   // stageId → 'correct' | 'wrong'
  const [shakeIds,   setShakeIds]   = useState([])
  const shakeTimerRef = useRef(null)

  // Shuffle answers once on mount
  const [shuffled] = useState(() => {
    const a = [...answers]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]]
    }
    return a
  })

  const placedIds  = new Set(Object.values(slots).filter(Boolean))
  const allFilled  = stages.every(s => slots[s.id] !== null)
  const allCorrect = checked && stages.every(s => results[s.id] === 'correct')
  const hasWrong   = checked && stages.some(s => results[s.id] === 'wrong')

  // ── Interaction ─────────────────────────────────────────────────────────────

  function handlePoolTap(answerId) {
    if (checked) return
    if (placedIds.has(answerId)) return // can't select from pool when placed; tap slot instead
    setSelectedId(prev => prev === answerId ? null : answerId)
  }

  function handleSlotTap(stageId) {
    if (checked) return
    const inSlot = slots[stageId]

    if (selectedId) {
      // Place selected card — swap if slot occupied
      setSlots(prev => {
        const next = { ...prev }
        // Remove selected from any slot it currently occupies
        for (const sid of Object.keys(next)) {
          if (next[sid] === selectedId) next[sid] = null
        }
        next[stageId] = selectedId
        return next
      })
      setSelectedId(null)
    } else if (inSlot) {
      // No selection — tap filled slot to unplace
      setSlots(prev => ({ ...prev, [stageId]: null }))
    }
  }

  function handleCheck() {
    if (!allFilled) return
    const res = {}
    for (const stage of stages) {
      res[stage.id] = slots[stage.id] === stage.answerId ? 'correct' : 'wrong'
    }
    setResults(res)
    setChecked(true)

    const wrongIds = stages.filter(s => res[s.id] === 'wrong').map(s => s.id)
    if (wrongIds.length > 0) {
      setShakeIds(wrongIds)
      clearTimeout(shakeTimerRef.current)
      shakeTimerRef.current = setTimeout(() => setShakeIds([]), 420)
    }

    for (const stage of stages) {
      if (res[stage.id] === 'wrong') {
        logWrongAnswer({
          subject: subjectKey,
          topic: stage.title,
          questionId: `evacuation-chain-${stage.id}`,
          questionText: stage.title,
          source: 'module',
          questionType: 'connection',
          marks: 1,
          weakGroup: 'Evacuation chain',
        })
      } else {
        logCorrectAnswer({
          subject: subjectKey,
          topic: stage.title,
          questionId: `evacuation-chain-${stage.id}`,
          source: 'module',
        })
      }
    }

    if (stages.every(s => res[s.id] === 'correct')) {
      setTimeout(() => onComplete?.(), 900)
    }
  }

  function handleRetry() {
    clearTimeout(shakeTimerRef.current)
    setSlots(prev => {
      const next = { ...prev }
      for (const stage of stages) {
        if (results[stage.id] === 'wrong') next[stage.id] = null
      }
      return next
    })
    setResults({})
    setChecked(false)
    setSelectedId(null)
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <CinematicShell style={{
      zIndex: 1000,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Sora', sans-serif",
    }}>
      <style>{CSS}</style>

      {/* Background image */}
      {bgImage && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          zIndex: 0,
        }} />
      )}

      {/* Dark overlay — leaves soldiers visible in upper portion */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(10,6,2,0.70)',
        zIndex: 0,
      }} />

      {/* Vignette — heavier at bottom for CTA legibility */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, transparent 22%, transparent 55%, rgba(0,0,0,0.62) 100%)',
        zIndex: 0, pointerEvents: 'none',
      }} />

      {/* Scrollable column */}
      <div
        style={{
          position: 'relative', zIndex: 1,
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          display: 'flex', flexDirection: 'column',
          padding: `calc(66px + env(safe-area-inset-top, 0px)) 16px calc(24px + env(safe-area-inset-bottom, 0px))`,
          maxWidth: 430, width: '100%', margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Title */}
        <h1 style={{
          margin: '0 0 6px',
          fontWeight: 700, fontSize: 25, lineHeight: 1.08,
          color: TEXT_PRIMARY, maxWidth: '92%',
          animation: 'ecr-in 360ms ease both',
        }}>
          {screen.title || 'Rebuild the evacuation chain'}
        </h1>

        {/* Subtitle */}
        <p style={{
          margin: '0 0 20px',
          fontSize: 13, lineHeight: 1.45,
          color: TEXT_DIM, maxWidth: 340,
          animation: 'ecr-in 360ms ease 55ms both',
        }}>
          {screen.subtitle || 'Tap a job, then tap the correct stage.'}
        </p>

        {/* ── Route chain ── */}
        <div style={{
          position: 'relative',
          animation: 'ecr-in 360ms ease 95ms both',
        }}>
          {/* Amber vertical route line */}
          <div style={{
            position: 'absolute',
            left: 19,
            top: 19,
            bottom: 19,
            width: 2,
            background: `linear-gradient(to bottom, ${BRONZE} 0%, rgba(${BRONZE_RGB},0.28) 100%)`,
            borderRadius: 1,
            zIndex: 0,
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {stages.map((stage, idx) => {
              const placedId  = slots[stage.id]
              const placed    = placedId ? answers.find(a => a.id === placedId) : null
              const result    = results[stage.id]
              const isSuccess = result === 'correct'
              const isWrong   = result === 'wrong'
              const isShaking = shakeIds.includes(stage.id)

              const IconComp = ICON_MAP[stage.icon] || IconCross

              return (
                <div
                  key={stage.id}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}
                >
                  {/* Numbered node */}
                  <div style={{
                    flexShrink: 0,
                    width: 38, height: 38, borderRadius: '50%',
                    background: isSuccess
                      ? `rgba(${BRONZE_RGB}, 0.18)`
                      : 'rgba(30,18,8,0.95)',
                    border: `2px solid ${isSuccess ? BRONZE : `rgba(${BRONZE_RGB},0.48)`}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 700, fontSize: 14,
                    color: BRONZE,
                    zIndex: 1, position: 'relative',
                    boxShadow: isSuccess
                      ? `0 0 0 3px rgba(${BRONZE_RGB},0.12), 0 0 16px rgba(${BRONZE_RGB},0.20)`
                      : 'none',
                    transition: `box-shadow ${MOTION.duration.standard} ease, background ${MOTION.duration.standard} ease`,
                  }}>
                    {idx + 1}
                  </div>

                  {/* Stage card */}
                  <div
                    onClick={() => handleSlotTap(stage.id)}
                    style={{
                      flex: 1,
                      borderRadius: 14,
                      border: `1px solid ${
                        isSuccess ? STAGE_BORDER_SUCCESS :
                        isWrong   ? STAGE_BORDER_WRONG   :
                        STAGE_BORDER
                      }`,
                      background: isSuccess ? STAGE_BG_SUCCESS : isWrong ? STAGE_BG_WRONG : STAGE_BG,
                      boxShadow: isSuccess
                        ? `0 0 0 1px rgba(${BRONZE_RGB},0.14), 0 0 18px rgba(${BRONZE_RGB},0.16), inset 0 0 10px rgba(${BRONZE_RGB},0.06)`
                        : 'none',
                      padding: '9px 12px 10px',
                      cursor: !checked ? 'pointer' : 'default',
                      transition: `border-color ${MOTION.duration.standard} ease, box-shadow ${MOTION.duration.standard} ease, background ${MOTION.duration.standard} ease`,
                      animation: isShaking ? 'ecr-shake 400ms ease' : undefined,
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    {/* Stage header */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      marginBottom: 7,
                    }}>
                      {/* Icon in a small circle */}
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: `rgba(${BRONZE_RGB},0.10)`,
                        border: `1px solid rgba(${BRONZE_RGB},0.22)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <IconComp />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: 600, fontSize: 12.5,
                          color: TEXT_PRIMARY, lineHeight: 1.2,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                          {stage.title}
                        </div>
                        <div style={{
                          fontSize: 10.5, color: TEXT_DIM, marginTop: 1,
                        }}>
                          {stage.clue}
                        </div>
                      </div>

                      {isSuccess && (
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%',
                          background: `rgba(${BRONZE_RGB},0.18)`,
                          border: `1px solid rgba(${BRONZE_RGB},0.48)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, color: BRONZE, flexShrink: 0,
                        }}>
                          ✓
                        </div>
                      )}
                    </div>

                    {/* Drop zone */}
                    {placed ? (
                      <div style={{
                        borderRadius: 8,
                        padding: '6px 10px',
                        background: isWrong
                          ? 'rgba(16,9,4,0.55)'
                          : `rgba(${BRONZE_RGB},0.08)`,
                        border: `1px solid ${
                          isWrong
                            ? 'rgba(90,55,28,0.35)'
                            : `rgba(${BRONZE_RGB},0.22)`
                        }`,
                        fontSize: 11.5, lineHeight: 1.35,
                        color: isWrong
                          ? 'rgba(190,148,90,0.48)'
                          : TEXT_PRIMARY,
                        transition: `color ${MOTION.duration.standard} ease, background ${MOTION.duration.standard} ease`,
                      }}>
                        {placed.text}
                      </div>
                    ) : (
                      <div style={{
                        borderRadius: 8,
                        padding: '6px 10px',
                        border: `1.5px dashed rgba(${BRONZE_RGB},0.22)`,
                        fontSize: 11.5, lineHeight: 1.35,
                        color: `rgba(${BRONZE_RGB},0.32)`,
                        fontStyle: 'italic',
                      }}>
                        Drop job here
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ height: 20 }} />

        {/* ── Answer card pool ── */}
        {!allCorrect && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 8,
            animation: 'ecr-in 360ms ease 130ms both',
          }}>
            {shuffled.map(answer => {
              const isPlaced   = placedIds.has(answer.id)
              const isSelected = selectedId === answer.id

              return (
                <button
                  key={answer.id}
                  onClick={() => handlePoolTap(answer.id)}
                  disabled={checked}
                  style={{
                    borderRadius: 12,
                    padding: '10px 10px 9px',
                    border: `1px solid ${
                      isSelected ? ANSWER_BORDER_SELECTED :
                      isPlaced   ? ANSWER_BORDER_PLACED   :
                      ANSWER_BORDER
                    }`,
                    background: isSelected ? ANSWER_BG_SELECTED : isPlaced ? ANSWER_BG_PLACED : ANSWER_BG,
                    boxShadow: isSelected
                      ? `0 0 0 1px rgba(${BRONZE_RGB},0.16), 0 0 16px rgba(${BRONZE_RGB},0.14)`
                      : 'none',
                    cursor: isPlaced || checked ? 'default' : 'pointer',
                    textAlign: 'left',
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 11.5, lineHeight: 1.38,
                    color: isPlaced ? TEXT_PLACED : TEXT_PRIMARY,
                    minHeight: 74,
                    display: 'flex', flexDirection: 'column',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                    transition: [
                      `border-color ${MOTION.duration.fast} ease`,
                      `box-shadow ${MOTION.duration.fast} ease`,
                      `transform ${MOTION.duration.instant} ease`,
                      `opacity ${MOTION.duration.fast} ease`,
                    ].join(', '),
                    opacity: isPlaced ? 0.38 : 1,
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <GripDots selected={isSelected} />
                  {answer.text}
                </button>
              )
            })}
          </div>
        )}

        <div style={{ height: 16 }} />

        {/* ── CTA ── */}
        {!checked ? (
          <ContinueCTA
            label="Check answers"
            onClick={handleCheck}
            accent={BRONZE}
            disabled={!allFilled}
          />
        ) : hasWrong ? (
          <ContinueCTA
            label="Try again"
            onClick={handleRetry}
            accent={BRONZE}
          />
        ) : null}

        <div style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 6px)' }} />
      </div>
    </CinematicShell>
  )
}
