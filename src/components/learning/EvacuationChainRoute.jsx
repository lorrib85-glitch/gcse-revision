import { useState, useRef } from 'react'
import { MOTION } from '../../constants/motion.js'
import { logWrongAnswer, logCorrectAnswer } from '../../unifiedWeaknessTracker.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
// CinematicShell: full-bleed background + vignette overlays must fill the full viewport;
// InteractionShell's 16px padding would clip them.
import CinematicShell from '../layout/CinematicShell.jsx'

const BRONZE     = '#D69B45'
const BRONZE_RGB = '214,155,69'

const STAGE_BG          = 'rgba(30,18,8,0.93)'
const STAGE_BG_SUCCESS  = 'rgba(36,24,8,0.95)'
const STAGE_BG_WRONG    = 'rgba(22,13,7,0.93)'
const STAGE_BORDER      = 'rgba(175,128,58,0.42)'
const STAGE_BORDER_SUCCESS = 'rgba(214,155,69,0.88)'
const STAGE_BORDER_WRONG   = 'rgba(72,46,22,0.35)'

const ANSWER_BG          = 'rgba(28,16,6,0.94)'
const ANSWER_BG_SELECTED = 'rgba(55,34,12,0.96)'
const ANSWER_BG_PLACED   = 'rgba(14,9,4,0.35)'
const ANSWER_BORDER          = 'rgba(158,112,46,0.38)'
const ANSWER_BORDER_SELECTED = `rgba(${BRONZE_RGB},0.82)`
const ANSWER_BORDER_PLACED   = 'rgba(62,42,16,0.22)'

const TEXT_PRIMARY = 'rgba(255,244,222,0.94)'
const TEXT_DIM     = 'rgba(240,220,185,0.60)'
const TEXT_PLACED  = 'rgba(190,155,100,0.36)'

const RIVET = {
  position: 'absolute',
  width: 5, height: 5, borderRadius: '50%',
  background: 'rgba(165,120,48,0.28)',
  border: '1px solid rgba(195,148,58,0.20)',
}

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
      display: 'grid', gridTemplateColumns: 'repeat(3, 3px)', gap: 2,
      marginBottom: 5,
    }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{
          width: 3, height: 3, borderRadius: '50%',
          background: selected
            ? `rgba(${BRONZE_RGB},0.55)`
            : 'rgba(200,165,110,0.18)',
          transition: `background ${MOTION.duration.fast} ease`,
        }} />
      ))}
    </div>
  )
}

// ── Inline SVG icons ──────────────────────────────────────────────────────────

function IconHelmet() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
      <path d="M3 13c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke={BRONZE} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M2 13h16" stroke={BRONZE} strokeWidth="1.6" strokeLinecap="round"/>
      <path d="M5 13v1.5a1 1 0 001 1h8a1 1 0 001-1V13" stroke={BRONZE} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

function IconCross() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
      <rect x="8" y="3" width="4" height="14" rx="1" fill={BRONZE} opacity="0.85"/>
      <rect x="3" y="8" width="14" height="4" rx="1" fill={BRONZE} opacity="0.85"/>
    </svg>
  )
}

function IconHut() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
      <path d="M2 10l8-7 8 7" stroke={BRONZE} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="4" y="10" width="12" height="8" rx="1" stroke={BRONZE} strokeWidth="1.5"/>
      <rect x="8" y="13" width="4" height="5" rx="0.5" stroke={BRONZE} strokeWidth="1.2"/>
    </svg>
  )
}

function IconTrain() {
  return (
    <svg width="17" height="17" viewBox="0 0 20 20" fill="none">
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

// Highlight "evacuation chain" in the title with amber
function renderTitle(text) {
  const phrase = 'evacuation chain'
  const lower = (text || '').toLowerCase()
  const idx = lower.indexOf(phrase)
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: BRONZE }}>{text.slice(idx, idx + phrase.length)}</span>
      {text.slice(idx + phrase.length)}
    </>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function EvacuationChainRoute({ screen, subject, onComplete }) {
  const stages  = screen.stages  || []
  const answers = screen.answers || []
  const bgImage = screen.backgroundImage || '/headers/history-medicine-trenches.png'
  const subjectKey = subject || screen.subject || 'History'

  const [slots, setSlots] = useState(() =>
    Object.fromEntries(stages.map(s => [s.id, null]))
  )
  const [selectedId, setSelectedId] = useState(null)
  const [checked,    setChecked]    = useState(false)
  const [results,    setResults]    = useState({})
  const [shakeIds,   setShakeIds]   = useState([])
  const shakeTimerRef = useRef(null)

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

  function handlePoolTap(answerId) {
    if (checked) return
    if (placedIds.has(answerId)) return
    setSelectedId(prev => prev === answerId ? null : answerId)
  }

  function handleSlotTap(stageId) {
    if (checked) return
    const inSlot = slots[stageId]
    if (selectedId) {
      setSlots(prev => {
        const next = { ...prev }
        for (const sid of Object.keys(next)) {
          if (next[sid] === selectedId) next[sid] = null
        }
        next[stageId] = selectedId
        return next
      })
      setSelectedId(null)
    } else if (inSlot) {
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

      {/* Background image — centre top to keep stretcher bearers visible */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        zIndex: 0,
      }} />

      {/* Left-side darkness */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(6,3,1,0.88) 0%, rgba(6,3,1,0.52) 42%, rgba(6,3,1,0.22) 100%)',
        zIndex: 0, pointerEvents: 'none',
      }} />

      {/* Bottom darkness — heavy fade for content legibility */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(4,2,0,0.97) 0%, rgba(4,2,0,0.82) 28%, rgba(4,2,0,0.38) 54%, transparent 72%)',
        zIndex: 0, pointerEvents: 'none',
      }} />

      {/* Top vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(3,1,0,0.55) 0%, transparent 18%)',
        zIndex: 0, pointerEvents: 'none',
      }} />

      {/* Scrollable column */}
      <div
        style={{
          position: 'relative', zIndex: 1,
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          display: 'flex', flexDirection: 'column',
          padding: `calc(62px + env(safe-area-inset-top, 0px)) 16px calc(24px + env(safe-area-inset-bottom, 0px))`,
          maxWidth: 430, width: '100%', margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {/* Title */}
        <h1 style={{
          margin: '0 0 5px',
          fontWeight: 700, fontSize: 20, lineHeight: 1.10,
          color: TEXT_PRIMARY, maxWidth: '92%',
          animation: 'ecr-in 360ms ease both',
        }}>
          {renderTitle(screen.title || 'Rebuild the evacuation chain')}
        </h1>

        {/* Subtitle */}
        <p style={{
          margin: '0 0 14px',
          fontSize: 12, lineHeight: 1.45,
          color: TEXT_DIM, maxWidth: 320,
          animation: 'ecr-in 360ms ease 55ms both',
        }}>
          {screen.subtitle || 'Tap a job, then tap the correct stage.'}
        </p>

        {/* ── Route chain ── */}
        <div style={{
          position: 'relative',
          animation: 'ecr-in 360ms ease 95ms both',
        }}>
          {/* Warm haze behind route area */}
          <div style={{
            position: 'absolute',
            inset: '0 -12px',
            background: 'radial-gradient(ellipse 90% 75% at 12% 50%, rgba(140,88,28,0.08) 0%, transparent 68%)',
            pointerEvents: 'none',
            zIndex: 0,
          }} />

          {/* Amber vertical route line — spans node 1 centre to node 4 centre */}
          <div style={{
            position: 'absolute',
            left: 19,
            top: 44, bottom: 44,
            width: 2.5,
            background: `linear-gradient(to bottom, rgba(${BRONZE_RGB},0.92) 0%, rgba(${BRONZE_RGB},0.52) 55%, rgba(${BRONZE_RGB},0.22) 100%)`,
            borderRadius: 2,
            zIndex: 0,
            boxShadow: `0 0 6px 1px rgba(${BRONZE_RGB},0.28), 0 0 1.5px rgba(${BRONZE_RGB},0.45)`,
          }} />

          {/* Stage cards — readable stacked layout for mobile */}
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
                <div key={stage.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>

                  {/* Numbered node — vertically centred on stage card */}
                  <div style={{
                    flexShrink: 0,
                    alignSelf: 'center',
                    width: 38, height: 38, borderRadius: '50%',
                    background: isSuccess
                      ? `rgba(${BRONZE_RGB},0.20)`
                      : 'rgba(22,13,5,0.96)',
                    border: `2px solid ${isSuccess ? BRONZE : `rgba(${BRONZE_RGB},0.55)`}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 700, fontSize: 14,
                    color: BRONZE,
                    zIndex: 1, position: 'relative',
                    boxShadow: isSuccess
                      ? `0 0 0 4px rgba(${BRONZE_RGB},0.16), 0 0 22px rgba(${BRONZE_RGB},0.38)`
                      : `0 0 0 3px rgba(${BRONZE_RGB},0.06), 0 0 10px rgba(${BRONZE_RGB},0.10)`,
                    transition: `box-shadow 220ms ease, background 220ms ease, border-color 220ms ease`,
                  }}>
                    {idx + 1}
                  </div>

                  {/* Stage card — title and answer are stacked so no text is crushed */}
                  <div
                    onClick={() => handleSlotTap(stage.id)}
                    style={{
                      flex: 1,
                      borderRadius: 13,
                      border: `1px solid ${
                        isSuccess ? STAGE_BORDER_SUCCESS :
                        isWrong   ? STAGE_BORDER_WRONG   :
                        STAGE_BORDER
                      }`,
                      background: isSuccess ? STAGE_BG_SUCCESS : isWrong ? STAGE_BG_WRONG : STAGE_BG,
                      boxShadow: isSuccess
                        ? `0 0 0 1px rgba(${BRONZE_RGB},0.20), 0 0 28px rgba(${BRONZE_RGB},0.30), inset 0 0 14px rgba(${BRONZE_RGB},0.08)`
                        : isWrong
                          ? 'inset 0 1px 0 rgba(0,0,0,0.30), 0 2px 6px rgba(0,0,0,0.35)'
                          : 'inset 0 1px 0 rgba(255,215,150,0.05), inset 0 -1px 0 rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.35)',
                      padding: '12px 12px',
                      minHeight: 122,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 10,
                      alignItems: 'stretch',
                      position: 'relative',
                      cursor: !checked ? 'pointer' : 'default',
                      transition: `border-color 220ms ease, box-shadow 220ms ease, background 220ms ease`,
                      animation: isShaking ? 'ecr-shake 400ms ease' : undefined,
                      opacity: isWrong ? 0.62 : 1,
                      filter: isWrong ? 'saturate(0.45)' : 'none',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    {/* Corner rivets */}
                    <div style={{ ...RIVET, top: 5, left: 5 }} />
                    <div style={{ ...RIVET, top: 5, right: 5 }} />
                    <div style={{ ...RIVET, bottom: 5, left: 5 }} />
                    <div style={{ ...RIVET, bottom: 5, right: 5 }} />

                    {/* Top row: icon badge + title + clue */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, minWidth: 0 }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: `rgba(${BRONZE_RGB},0.14)`,
                        border: `1.5px solid rgba(${BRONZE_RGB},0.38)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `inset 0 1px 0 rgba(255,215,150,0.07)`,
                      }}>
                        <IconComp />
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{
                          fontWeight: 650, fontSize: 15.5,
                          color: TEXT_PRIMARY, lineHeight: 1.16,
                          overflowWrap: 'break-word',
                        }}>
                          {stage.title}
                        </div>
                        <div style={{
                          fontSize: 12.5, color: TEXT_DIM, marginTop: 3, lineHeight: 1.28,
                          overflowWrap: 'break-word',
                        }}>
                          {stage.clue}
                        </div>
                      </div>
                    </div>

                    {/* Full-width drop zone */}
                    <div>
                      {placed ? (
                        <div style={{
                          minHeight: 48,
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          gap: 6,
                          borderRadius: 12,
                          padding: '8px 10px',
                          background: isSuccess
                            ? `rgba(${BRONZE_RGB},0.12)`
                            : `rgba(${BRONZE_RGB},0.10)`,
                          border: isSuccess
                            ? `1px solid rgba(${BRONZE_RGB},0.70)`
                            : `1px solid rgba(${BRONZE_RGB},0.28)`,
                          boxShadow: isSuccess
                            ? `0 0 0 2px rgba(${BRONZE_RGB},0.18), inset 0 0 10px rgba(${BRONZE_RGB},0.07)`
                            : 'none',
                          fontSize: 12.5, lineHeight: 1.25,
                          color: TEXT_PRIMARY,
                          transition: `all 200ms ease`,
                          overflowWrap: 'break-word',
                        }}>
                          <span>{placed.text}</span>
                          {isSuccess && (
                            <div style={{
                              flexShrink: 0,
                              width: 18, height: 18, borderRadius: '50%',
                              background: `rgba(${BRONZE_RGB},0.18)`,
                              border: `1px solid rgba(${BRONZE_RGB},0.52)`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 10, color: BRONZE,
                            }}>
                              ✓
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{
                          minHeight: 48,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          borderRadius: 12,
                          border: `1px dashed rgba(${BRONZE_RGB},0.14)`,
                          background: 'rgba(0,0,0,0.12)',
                          fontSize: 12.5, lineHeight: 1.3,
                          color: `rgba(${BRONZE_RGB},0.22)`,
                          fontStyle: 'italic',
                        }}>
                          Drop job here
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Answer card pool ── */}
        {!allCorrect && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginTop: 14,
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
                    padding: '12px 14px',
                    border: `1px solid ${
                      isSelected ? ANSWER_BORDER_SELECTED :
                      isPlaced   ? ANSWER_BORDER_PLACED   :
                      ANSWER_BORDER
                    }`,
                    background: isSelected ? ANSWER_BG_SELECTED : isPlaced ? ANSWER_BG_PLACED : ANSWER_BG,
                    boxShadow: isPlaced
                      ? 'none'
                      : isSelected
                        ? `0 4px 16px rgba(0,0,0,0.50), 0 0 18px rgba(${BRONZE_RGB},0.14), 0 0 0 1px rgba(${BRONZE_RGB},0.12)`
                        : '0 2px 8px rgba(0,0,0,0.42), 0 1px 3px rgba(0,0,0,0.32)',
                    cursor: isPlaced || checked ? 'default' : 'pointer',
                    textAlign: 'left',
                    fontFamily: "'Sora', sans-serif",
                    fontSize: 13.5, lineHeight: 1.28,
                    color: isPlaced ? TEXT_PLACED : TEXT_PRIMARY,
                    minHeight: 76,
                    display: 'flex', flexDirection: 'column',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                    transition: [
                      `border-color ${MOTION.duration.fast} ease`,
                      `box-shadow ${MOTION.duration.fast} ease`,
                      `transform ${MOTION.duration.instant} ease`,
                      `opacity ${MOTION.duration.fast} ease`,
                    ].join(', '),
                    opacity: isPlaced ? 0.34 : 1,
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

        {/* ── CTA ── */}
        {!checked ? (
          <ContinueCTA
            label="Check answers"
            onClick={handleCheck}
            accent={BRONZE}
            disabled={!allFilled}
            disabledBackground={BRONZE}
            disabledColor='#0D0F14'
            style={{ marginTop: 14, opacity: !allFilled ? 0.42 : 1 }}
          />
        ) : hasWrong ? (
          <ContinueCTA
            label="Try again"
            onClick={handleRetry}
            accent={BRONZE}
            style={{ marginTop: 14 }}
          />
        ) : null}

        <div style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 18px)' }} />
      </div>
    </CinematicShell>
  )
}
