import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { BUTTONS } from '../../constants/buttons.js'
import { TYPE } from '../../constants/typography.js'
import { logWrongAnswer } from '../../unifiedWeaknessTracker.js'
import BackButton from '../core/BackButton.jsx'

// Concept score thresholds
const SCORE_RECALLED = 0.7   // >= recalled (teal)
const SCORE_PARTIAL  = 0.3   // >= partial (amber), < recalled
                              // < 0.3 = missing — logged to weakness tracker

// Recall timer — gives the learner a focused window to write before checking.
// Pauses whenever the tab/screen is not visible and resumes from where it left off.
const RECALL_DURATION = 3 * 60

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

// Muted memory-nudge chips shown above the recall box. Chapters can override
// with `block.recallPrompts` (array of strings) for topic-specific nudges.
const DEFAULT_RECALL_PROMPTS = ['People', 'Events', 'Causes', 'Effects', 'Key terms', 'Dates']

// Rough "ideas captured" count — splits free text on sentence/line/list breaks.
function countIdeas(text) {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/[\n.,;]+/).map(s => s.trim()).filter(Boolean).length
}

// Recall timer ring
const RING_SIZE   = 28
const RING_STROKE = 3
const RING_RADIUS = RING_SIZE / 2 - RING_STROKE / 2
const RING_CIRC   = 2 * Math.PI * RING_RADIUS

// Warm, muted tone the timer ring gently shifts toward as time runs low —
// no red alert, stays inside the History warm-tone palette.
const LOW_TIME_RGB = '201,123,99'

function lerpColor(rgbA, rgbB, t) {
  const a = rgbA.split(',').map(Number)
  const b = rgbB.split(',').map(Number)
  return a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')
}

let _prkStyled = false
function ensureStyles() {
  if (_prkStyled) return
  _prkStyled = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes prk-fade-in {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes prk-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes prk-breathe {
      0%, 100% { opacity: 0.7; }
      50%      { opacity: 1; }
    }
  `
  document.head.appendChild(el)
}

async function analyseRecall(answer, concepts, sourceContent) {
  const response = await fetch('/api/recall', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answer, concepts, sourceContent: sourceContent || '' }),
  })
  if (!response.ok) throw new Error(`Server error ${response.status}`)
  const data = await response.json()
  if (data.error) throw new Error(data.error)
  return data
}

// ─── ConceptChip ──────────────────────────────────────────────────────────────
function ConceptChip({ label, color }) {
  return (
    <div style={{
      background: `${color}18`,
      border: `1px solid ${color}40`,
      borderRadius: RADII.medium,
      padding: '7px 14px',
      fontFamily: "'Sora', sans-serif",
      fontSize: 14, fontWeight: 500, lineHeight: 1,
      color,
    }}>
      {label}
    </div>
  )
}

// ─── PromptChip ───────────────────────────────────────────────────────────────
// Muted, non-interactive memory nudge — visual only.
function PromptChip({ label }) {
  return (
    <div style={{
      padding: '6px 12px',
      borderRadius: RADII.small,
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      fontFamily: "'Sora', sans-serif",
      fontSize: 12, fontWeight: 500, letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: 'rgba(245,247,255,0.32)',
    }}>
      {label}
    </div>
  )
}

// ─── PriorKnowledgeRecall ─────────────────────────────────────────────────────
//
// Full-screen chapter-opening component. Student writes free-text recall of the
// previous chapter. Claude scores each concept 0.0–1.0. Missing concepts
// (score < 0.3) are logged to the weakness tracker and feed WeakSpotRecovery.
//
// Block data shape:
// {
//   type: 'priorKnowledgeRecall',
//   chapterTitle: 'Medieval medicine',
//   backgroundImage: '/headers/history-medicine-medieval-scripture.png',  // optional
//   concepts: [
//     { tag: 'miasma-theory', label: 'Miasma theory', keywords: ['miasma', 'bad air', 'smell'] },
//     { tag: 'four-humours',  label: 'Four humours',  keywords: ['humours', 'blood', 'phlegm'] },
//   ]
// }
//
// Props: block, subject, onContinue, onBack

export default function PriorKnowledgeRecall({ block, subject, onContinue, onBack }) {
  ensureStyles()

  const theme  = SUBJECTS[subject] || SUBJECTS.History
  const accent = theme.accent
  const rgb    = theme.accentRgb

  const [phase,       setPhase]       = useState('input')   // 'input' | 'analyzing' | 'results'
  const [answer,      setAnswer]      = useState('')
  const [results,     setResults]     = useState(null)
  const [error,       setError]       = useState(null)
  const [isPressed,   setIsPressed]   = useState(false)
  const [isFocused,   setIsFocused]   = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(RECALL_DURATION)

  const recallPrompts = block.recallPrompts || DEFAULT_RECALL_PROMPTS
  const ideaCount = countIdeas(answer)

  // Timer ring progress + gentle colour shift toward LOW_TIME_RGB in the final
  // 40% of the countdown — no flashing, just a slow warm drift.
  const timeFrac = secondsLeft / RECALL_DURATION
  const SHIFT_START = 0.4
  const shiftAmount = timeFrac >= SHIFT_START ? 0 : 1 - (timeFrac / SHIFT_START)
  const ringRgb = lerpColor(rgb, LOW_TIME_RGB, shiftAmount)

  // Tick once a second, but only while the learner is actually looking at the screen —
  // tabbing away pauses the countdown and it resumes from where it left off.
  useEffect(() => {
    if (phase !== 'input') return undefined
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setSecondsLeft(s => Math.max(0, s - 1))
      }
    }, 1000)
    return () => clearInterval(id)
  }, [phase])

  async function submit() {
    if (answer.trim().length < 10) {
      setError('Write at least a sentence — rough notes count.')
      return
    }
    setError(null)
    setPhase('analyzing')

    try {
      const data = await analyseRecall(answer, block.concepts || [], block.sourceContent)

      // Log concepts scoring below SCORE_PARTIAL as weak spots
      const missingConcepts = (data.concepts || []).filter(c => c.score < SCORE_PARTIAL)
      missingConcepts.forEach(c => {
        logWrongAnswer({
          subject,
          topic: c.tag,
          questionId: `prior-recall-${c.tag}`,
          questionText: c.label,
          marks: 1,
          source: 'module',
          questionType: 'prior-recall',
        })
      })

      setResults(data)
      setPhase('results')
    } catch {
      setError('Could not analyse your answer. Check your connection and try again.')
      setPhase('input')
    }
  }

  // Sort concepts: securely recalled vs. gaps to revisit (logged above to the weakness tracker).
  const recalled = results?.concepts.filter(c => c.score >= SCORE_RECALLED) || []
  const missing  = results?.concepts.filter(c => c.score < SCORE_PARTIAL) || []

  const recallRatio = results ? recalled.length / Math.max(results.concepts.length, 1) : 0
  const recallMessage =
    recalled.length === 0
      ? { title: "That's okay.", body: 'Retrieval is a skill — it gets easier with practice.' }
      : recallRatio < 0.6
      ? { title: 'Good start.', body: "You're holding onto some of this already." }
      : { title: 'Nice work.', body: 'Most of this is still with you.' }

  const pressProps = {
    onMouseDown:  () => setIsPressed(true),
    onMouseUp:    () => setIsPressed(false),
    onMouseLeave: () => setIsPressed(false),
    onTouchStart: () => setIsPressed(true),
    onTouchEnd:   () => setIsPressed(false),
  }

  const btnStyle = {
    width: '100%', height: 64,
    borderRadius: RADII.large, border: 'none',
    background: accent,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 10, cursor: 'pointer',
    boxShadow: `0 4px 20px rgba(${rgb},0.18)`,
    transform: isPressed ? `scale(${MOTION.scale.press})` : 'scale(1)',
    transition: `transform ${MOTION.duration.fast} ${MOTION.easing.standard}`,
    flexShrink: 0,
  }

  // Input-phase CTA — premium but lighter than the primary button above:
  // outlined accent fill rather than a solid block, so it stays secondary
  // to the writing task.
  const inputBtnStyle = {
    width: '100%', height: BUTTONS.secondary.height,
    borderRadius: BUTTONS.secondary.borderRadius,
    border: `1.5px solid rgba(${rgb},0.32)`,
    background: `rgba(${rgb},0.10)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    gap: 10, cursor: 'pointer',
    transform: isPressed ? `scale(${MOTION.scale.press})` : 'scale(1)',
    transition: `transform ${MOTION.duration.fast} ${MOTION.easing.standard}`,
    flexShrink: 0,
  }

  const ArrowIcon = ({ color = '#0D0F14' }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  )

  const BrainIcon = () => (
    <svg width="40" height="40" viewBox="0 0 48 48" fill="none"
      stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 8c-4 0-7 3-7 7 0 1 .2 2 .5 3-2 1-3.5 3-3.5 5.5 0 2 1 3.8 2.5 5-1 1.2-1.5 2.7-1.5 4.5 0 4 3 7 7 7h2"/>
      <path d="M29 8c4 0 7 3 7 7 0 1-.2 2-.5 3 2 1 3.5 3 3.5 5.5 0 2-1 3.8-2.5 5 1 1.2 1.5 2.7 1.5 4.5 0 4-3 7-7 7h-2"/>
      <path d="M21 8v32"/>
      <path d="M21 16c2 0 3 1.5 3 3"/>
      <path d="M21 26c2 0 3 1.5 3 3"/>
      <path d="M27 16c-2 0-3 1.5-3 3"/>
    </svg>
  )

  const CycleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>
      <path d="M21 3v5h-5"/>
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
      <path d="M3 21v-5h5"/>
    </svg>
  )

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#08090D',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      animation: 'prk-fade-in 360ms ease both',
    }}>

      {/* Atmospheric background */}
      {block.backgroundImage && (
        <div aria-hidden="true" style={{
          position: 'fixed', inset: 0,
          backgroundImage: `url(${block.backgroundImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.07,
          filter: 'brightness(0.6) grayscale(10%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      )}

      {/* Scroll container */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        height: '100%',
        padding: `calc(18px + env(safe-area-inset-top)) ${SPACING.standard}px calc(${SPACING.separation}px + env(safe-area-inset-bottom))`,
        overflow: 'auto',
      }}>

        {/* Header row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 44, marginBottom: SPACING.compact, flexShrink: 0,
        }}>
          <BackButton onClick={onBack} />

          <div style={{
            fontFamily: "'Sora', sans-serif",
            ...TYPE.metadata,
            textTransform: 'uppercase',
            color: accent, opacity: 0.8,
          }}>
            Prior knowledge
          </div>

          <div style={{ width: 22 }} />
        </div>

        {/* ── INPUT PHASE ── */}
        {phase === 'input' && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            animation: 'prk-fade-in 280ms ease both',
          }}>
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontFamily: "'Sora', sans-serif",
                ...TYPE.sectionTitle,
                color: '#F5F7FF',
                margin: 0, marginBottom: SPACING.micro,
              }}>
                Empty your brain.
              </h1>

              <p style={{
                fontFamily: "'Sora', sans-serif",
                ...TYPE.bodySmall,
                color: 'rgba(245,247,255,0.55)',
                margin: 0, marginBottom: SPACING.compact,
              }}>
                Names. Theories. Ideas. Rough notes are fine.
              </p>

              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                marginBottom: SPACING.compact,
              }}>
                <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
                  style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
                  <circle
                    cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS}
                    fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={RING_STROKE}
                  />
                  <circle
                    cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={RING_RADIUS}
                    fill="none" stroke={`rgb(${ringRgb})`} strokeWidth={RING_STROKE}
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRC}
                    strokeDashoffset={RING_CIRC * (1 - timeFrac)}
                    style={{ transition: `stroke-dashoffset ${MOTION.duration.slow} ${MOTION.easing.linear}, stroke ${MOTION.duration.slow} ${MOTION.easing.linear}` }}
                  />
                </svg>
                <span style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 14, fontWeight: 700,
                  color: `rgb(${ringRgb})`,
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '0.02em',
                  transition: `color ${MOTION.duration.slow} ${MOTION.easing.linear}`,
                }}>
                  {formatTime(secondsLeft)}
                </span>
              </div>

              {block.chapterTitle && (
                <p style={{
                  fontFamily: "'Sora', sans-serif",
                  ...TYPE.bodySmall,
                  color: 'rgba(168,159,194,0.65)',
                  margin: 0, marginBottom: SPACING.compact,
                }}>
                  {block.chapterTitle}
                </p>
              )}

              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: SPACING.micro,
                marginBottom: SPACING.compact,
              }}>
                {recallPrompts.map(p => <PromptChip key={p} label={p} />)}
              </div>

              <div style={{
                background: '#101218',
                border: isFocused ? `1.5px solid rgba(${rgb},0.32)` : '1.5px solid rgba(255,255,255,0.08)',
                borderRadius: RADII.large,
                padding: `${SPACING.compact}px ${SPACING.standard}px`,
                marginBottom: SPACING.micro,
                boxShadow: isFocused ? `0 0 0 1px rgba(${rgb},0.12), 0 0 28px rgba(${rgb},0.10)` : 'none',
                transition: `border-color ${MOTION.duration.standard} ${MOTION.easing.gentle}, box-shadow ${MOTION.duration.standard} ${MOTION.easing.gentle}`,
              }}>
                <div style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.28)',
                  marginBottom: SPACING.micro,
                }}>
                  Your recall
                </div>
                <div style={{ position: 'relative' }}>
                  {answer.length === 0 && (
                    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                      <div style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: TYPE.bodySmall.fontSize, fontWeight: TYPE.bodySmall.fontWeight,
                        lineHeight: 1.7, letterSpacing: '0.01em',
                        color: 'rgba(245,247,255,0.30)',
                      }}>
                        Write anything you remember.
                      </div>
                      <div style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: 13, fontWeight: 400, lineHeight: 1.5,
                        color: 'rgba(245,247,255,0.16)',
                        marginTop: 2,
                      }}>
                        Messy notes are fine.
                      </div>
                    </div>
                  )}
                  <textarea
                    value={answer}
                    onChange={e => { setAnswer(e.target.value); setError(null) }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    rows={7}
                    aria-label="Write anything you remember"
                    style={{
                      width: '100%', padding: 0,
                      background: 'transparent', border: 'none', outline: 'none',
                      resize: 'none',
                      fontFamily: "'Sora', sans-serif",
                      ...TYPE.bodySmall,
                      color: '#F5F7FF',
                      lineHeight: 1.7, letterSpacing: '0.01em',
                      caretColor: accent,
                    }}
                  />
                </div>
              </div>

              <div style={{
                display: 'flex', justifyContent: 'flex-end',
                fontFamily: "'Sora', sans-serif",
                fontSize: 12, fontWeight: 500, letterSpacing: '0.02em',
                color: 'rgba(245,247,255,0.25)',
                marginBottom: error ? SPACING.compact : SPACING.standard,
              }}>
                Ideas captured: {ideaCount}
              </div>

              {error && (
                <p style={{
                  fontFamily: "'Sora', sans-serif",
                  ...TYPE.bodySmall,
                  color: '#E05A52',
                  margin: `0 0 ${SPACING.standard}px`,
                }}>
                  {error}
                </p>
              )}
            </div>

            <button onClick={submit} {...pressProps} style={inputBtnStyle}>
              <span style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: BUTTONS.secondary.fontSize, fontWeight: BUTTONS.secondary.fontWeight,
                color: accent,
              }}>
                Check my recall
              </span>
              <ArrowIcon color={accent} />
            </button>
          </div>
        )}

        {/* ── ANALYZING PHASE ── */}
        {phase === 'analyzing' && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            animation: 'prk-fade-in 280ms ease both',
          }}>
            <div style={{
              width: 44, height: 44,
              border: '2px solid rgba(255,255,255,0.06)',
              borderTop: `2px solid ${accent}`,
              borderRadius: '50%',
              animation: 'prk-spin 0.85s linear infinite',
              marginBottom: SPACING.standard,
            }} />
            <p style={{
              fontFamily: "'Sora', sans-serif",
              ...TYPE.body,
              color: 'rgba(255,255,255,0.55)',
              textAlign: 'center', margin: 0,
            }}>
              Checking what you remember…
            </p>
          </div>
        )}

        {/* ── RESULTS PHASE ── */}
        {phase === 'results' && results && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            animation: 'prk-fade-in 420ms ease both',
          }}>
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontFamily: "'Sora', sans-serif",
                ...TYPE.sectionTitle,
                color: '#F5F7FF',
                margin: 0, marginBottom: SPACING.compact,
              }}>
                You remembered
              </h1>

              <div style={{
                display: 'flex', alignItems: 'baseline', gap: SPACING.micro,
                marginBottom: SPACING.separation,
              }}>
                <div style={{ display: 'inline-block' }}>
                  <span style={{
                    fontFamily: "'Sora', sans-serif",
                    ...TYPE.hero,
                    color: accent,
                  }}>
                    {recalled.length}
                  </span>
                  <div style={{
                    height: 3, width: '100%',
                    background: accent, borderRadius: RADII.pill,
                    marginTop: SPACING.micro,
                  }} />
                </div>
                <span style={{
                  fontFamily: "'Sora', sans-serif",
                  ...TYPE.bodySmall,
                  color: 'rgba(245,247,255,0.55)',
                }}>
                  {recalled.length === 1 ? 'idea recognised' : 'ideas recognised'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: SPACING.standard }}>
                <div className="prk-breathe" style={{
                  width: 96, height: 96, borderRadius: '50%',
                  background: `radial-gradient(circle, rgba(${rgb},0.18) 0%, rgba(${rgb},0.05) 55%, transparent 80%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: `prk-breathe ${MOTION.duration.atmospheric} ${MOTION.easing.linear} infinite`,
                }}>
                  <BrainIcon />
                </div>
              </div>

              <h2 style={{
                fontFamily: "'Sora', sans-serif",
                ...TYPE.cardTitle,
                color: '#F5F7FF',
                textAlign: 'center',
                margin: 0, marginBottom: SPACING.micro,
              }}>
                {recallMessage.title}
              </h2>

              <p style={{
                fontFamily: "'Sora', sans-serif",
                ...TYPE.bodySmall,
                color: 'rgba(168,159,194,0.7)',
                textAlign: 'center', lineHeight: 1.6,
                margin: 0, marginBottom: SPACING.standard,
              }}>
                {recallMessage.body}
              </p>

              <div style={{
                height: 1, background: 'rgba(255,255,255,0.08)',
                marginBottom: SPACING.standard,
              }} />

              <div style={{ display: 'flex', gap: SPACING.compact, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, marginTop: 2 }}>
                  <CycleIcon />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "'Sora', sans-serif",
                    ...TYPE.bodySmall, fontWeight: 600,
                    color: '#F5F7FF',
                    marginBottom: SPACING.micro,
                  }}>
                    {missing.length > 0 ? "We'll handle the rest" : 'All clear for now'}
                  </div>
                  <p style={{
                    fontFamily: "'Sora', sans-serif",
                    ...TYPE.bodySmall,
                    color: 'rgba(168,159,194,0.7)',
                    lineHeight: 1.6,
                    margin: 0,
                  }}>
                    {missing.length > 0
                      ? "These will come back naturally during the chapter until they stick."
                      : 'Nothing from last chapter needs extra practice yet.'}
                  </p>
                  {missing.length > 0 && (
                    <div style={{
                      display: 'flex', flexWrap: 'wrap', gap: 8,
                      marginTop: SPACING.compact,
                    }}>
                      {missing.map(c => (
                        <ConceptChip key={c.tag} label={c.label} color="#A89FC2" />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={onContinue}
              {...pressProps}
              style={{ ...btnStyle, marginTop: SPACING.standard }}
            >
              <span style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 18, fontWeight: 600, color: '#0D0F14',
              }}>
                Continue
              </span>
              <ArrowIcon />
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
