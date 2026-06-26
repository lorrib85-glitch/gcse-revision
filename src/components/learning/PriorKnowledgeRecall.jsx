import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import CinematicShell from '../layout/CinematicShell.jsx'
import { TYPE } from '../../constants/typography.js'
import { logWrongAnswer } from '../../unifiedWeaknessTracker.js'
import BackButton from '../core/BackButton.jsx'

const SCORE_RECALLED = 0.7
const SCORE_PARTIAL = 0.3
const RECALL_DURATION = 3 * 60
const SUCCESS_RGB = '117,220,208'
const LOW_TIME_RGB = '201,123,99'
const DEFAULT_RECALL_PROMPTS = ['People', 'Causes', 'Changes', 'Evidence']

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function countIdeas(text) {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/[\n.,;]+/).map(s => s.trim()).filter(Boolean).length
}

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
    @keyframes prk-sheet-in {
      from { opacity: 0; transform: translateY(24px) scale(0.98); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes prk-spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
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

  if (!response.ok) {
    let detail = ''
    try {
      const errBody = await response.json()
      detail = errBody.error || JSON.stringify(errBody)
    } catch {
      try { detail = await response.text() } catch { /* ignore */ }
    }
    throw new Error(`Server error ${response.status}${detail ? `: ${detail}` : ''}`)
  }

  const data = await response.json()
  if (data.error) throw new Error(data.error)
  return data
}

function CheckIcon({ color = `rgb(${SUCCESS_RGB})` }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function FeatherIcon({ color }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.24 12.24a6 6 0 0 0-8.48-8.48L5 10.52V19h8.48z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  )
}

function PromptIcon({ label, color }) {
  const key = label.toLowerCase()
  if (key.includes('people') || key.includes('person')) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
  }
  if (key.includes('cause') || key.includes('change')) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-2.64-6.36" />
        <polyline points="21 3 21 9 15 9" />
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
    </svg>
  )
}

function ProgressRail({ rgb }) {
  return (
    <div aria-hidden="true" style={{
      width: 'min(68vw, 330px)',
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 0,
      margin: '0 auto',
    }}>
      {[0, 1, 2, 3, 4, 5].map((dot, index) => (
        <div key={dot} style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
            width: index === 0 ? 11 : 9,
            height: index === 0 ? 11 : 9,
            borderRadius: '50%',
            background: index === 0 ? `rgb(${rgb})` : 'rgba(245,247,255,0.22)',
            boxShadow: index === 0 ? `0 0 12px rgba(${rgb},0.32)` : 'none',
          }} />
          {index < 5 && (
            <span style={{
              width: 'min(9vw, 38px)',
              height: 1,
              background: index === 0 ? `linear-gradient(90deg, rgba(${rgb},0.65), rgba(245,247,255,0.16))` : 'rgba(245,247,255,0.11)',
            }} />
          )}
        </div>
      ))}
    </div>
  )
}

function PromptChip({ label, rgb }) {
  const chipColor = `rgba(${rgb},0.72)`
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: '7px 10px',
      borderRadius: 12,
      background: 'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.018))',
      border: '1px solid rgba(255,255,255,0.075)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.035)',
      fontFamily: TYPE.bodyText.fontFamily,
      fontSize: 11,
      fontWeight: 650,
      letterSpacing: '0.01em',
      color: 'rgba(245,247,255,0.50)',
    }}>
      <PromptIcon label={label} color={chipColor} />
      {label}
    </div>
  )
}

function ResultsOverlay({ results, recalled, missing, accent, rgb, onClose }) {
  const rememberedList = (recalled.length ? recalled : (results.concepts || []).slice(0, 3)).slice(0, 3)
  const missingList = (missing.length ? missing : (results.concepts || []).filter(c => c.score < SCORE_RECALLED)).slice(0, 3)

  return (
    <div style={{
      position: 'fixed',
      left: SPACING.standard,
      right: SPACING.standard,
      bottom: `calc(${SPACING.standard}px + env(safe-area-inset-bottom))`,
      zIndex: 6,
      maxHeight: '58vh',
      overflow: 'auto',
      padding: `${SPACING.standard}px ${SPACING.standard}px ${SPACING.compact}px`,
      borderRadius: 30,
      background: 'linear-gradient(180deg, rgba(17,19,24,0.985), rgba(8,10,15,0.99))',
      border: '1px solid rgba(255,255,255,0.11)',
      boxShadow: `0 26px 70px rgba(0,0,0,0.58), 0 0 0 1px rgba(${rgb},0.06), inset 0 1px 0 rgba(255,255,255,0.055)`,
      animation: 'prk-sheet-in 360ms cubic-bezier(0.2,0.8,0.2,1) both',
    }}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close recall results"
        style={{
          position: 'absolute', top: 14, right: 14,
          width: 38, height: 38, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.035)',
          color: 'rgba(245,247,255,0.64)',
          fontSize: 24, lineHeight: '34px',
          cursor: 'pointer',
        }}
      >
        ×
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: SPACING.compact, paddingRight: 42 }}>
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          display: 'grid', placeItems: 'center',
          background: `rgba(${SUCCESS_RGB},0.14)`,
          border: `1px solid rgba(${SUCCESS_RGB},0.34)`,
          boxShadow: `0 0 18px rgba(${SUCCESS_RGB},0.10)`,
        }}>
          <CheckIcon />
        </div>
        <h2 style={{ fontFamily: TYPE.bodyText.fontFamily, ...TYPE.cardTitle, color: '#F5F7FF', margin: 0 }}>
          You remembered
        </h2>
      </div>

      <div style={{ display: 'grid', gap: 10, marginBottom: SPACING.standard }}>
        {rememberedList.map(concept => (
          <div key={concept.tag || concept.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 24, height: 24, borderRadius: '50%',
              display: 'grid', placeItems: 'center', flexShrink: 0,
              border: `1px solid rgba(${SUCCESS_RGB},0.36)`,
              background: `rgba(${SUCCESS_RGB},0.08)`,
            }}>
              <CheckIcon />
            </span>
            <span style={{ fontFamily: TYPE.bodyText.fontFamily, ...TYPE.bodySmall, color: 'rgba(245,247,255,0.74)', lineHeight: 1.45 }}>
              {concept.label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: `${SPACING.compact}px 0` }} aria-hidden="true">
        <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, transparent, rgba(${rgb},0.24))` }} />
        <div style={{ color: `rgba(${rgb},0.56)`, fontSize: 18 }}>✦</div>
        <div style={{ height: 1, flex: 1, background: `linear-gradient(90deg, rgba(${rgb},0.24), transparent)` }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: SPACING.compact }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          display: 'grid', placeItems: 'center',
          background: `rgba(${rgb},0.13)`,
          border: `1px solid rgba(${rgb},0.40)`,
          color: accent,
          fontSize: 18,
        }}>
          ✚
        </div>
        <h2 style={{ fontFamily: TYPE.bodyText.fontFamily, ...TYPE.cardTitle, color: accent, margin: 0 }}>
          Missing pieces to revisit
        </h2>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {missingList.map(concept => (
          <button
            type="button"
            key={concept.tag || concept.label}
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
              width: '100%',
              padding: '11px 10px 11px 13px',
              borderRadius: 13,
              border: `1px solid rgba(${rgb},0.30)`,
              background: `linear-gradient(180deg, rgba(${rgb},0.10), rgba(255,255,255,0.025))`,
              color: accent,
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontFamily: TYPE.bodyText.fontFamily, fontSize: 13, fontWeight: 650, lineHeight: 1.35 }}>
              {concept.label}
            </span>
            <span style={{
              flexShrink: 0,
              padding: '6px 9px',
              borderRadius: 10,
              border: `1px solid rgba(${rgb},0.62)`,
              background: 'rgba(0,0,0,0.15)',
              fontFamily: TYPE.bodyText.fontFamily,
              fontSize: 12,
              fontWeight: 700,
              color: accent,
            }}>
              Revise this
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function PriorKnowledgeRecall({ block, subject, onContinue, onBack }) {
  ensureStyles()

  const theme = SUBJECTS[subject] || SUBJECTS.History
  const accent = theme.accent
  const rgb = theme.accentRgb

  const [phase, setPhase] = useState('input')
  const [answer, setAnswer] = useState('')
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [isPressed, setIsPressed] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(RECALL_DURATION)

  const recallPrompts = block.recallPrompts || DEFAULT_RECALL_PROMPTS
  const ideaCount = countIdeas(answer)
  const timeFrac = secondsLeft / RECALL_DURATION
  const shiftAmount = timeFrac >= 0.4 ? 0 : 1 - (timeFrac / 0.4)
  const ringRgb = lerpColor(rgb, LOW_TIME_RGB, shiftAmount)

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

    if (!block.concepts?.length) {
      if (import.meta.env.DEV) {
        console.warn('[PriorKnowledgeRecall] block.concepts missing or empty for block:', block.title ?? block.type)
      }
      setError('Could not analyse your answer. Check your connection and try again.')
      return
    }

    setError(null)
    setPhase('analyzing')

    try {
      const data = await analyseRecall(answer, block.concepts, block.sourceContent)
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
    } catch (err) {
      if (import.meta.env.DEV) console.error('[PriorKnowledgeRecall] analyseRecall failed:', err)
      setError('Could not analyse your answer. Check your connection and try again.')
      setPhase('input')
    }
  }

  const recalled = results?.concepts.filter(c => c.score >= SCORE_RECALLED) || []
  const missing = results?.concepts.filter(c => c.score < SCORE_RECALLED) || []
  const hasResults = phase === 'results' && results

  const pressProps = {
    onMouseDown: () => setIsPressed(true),
    onMouseUp: () => setIsPressed(false),
    onMouseLeave: () => setIsPressed(false),
    onTouchStart: () => setIsPressed(true),
    onTouchEnd: () => setIsPressed(false),
  }

  return (
    <CinematicShell style={{
      background: '#08090D',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      animation: 'prk-fade-in 360ms ease both',
    }}>
      {block.backgroundImage && (
        <div aria-hidden="true" style={{
          position: 'fixed', inset: 0,
          backgroundImage: `linear-gradient(180deg, rgba(8,9,13,0.36), rgba(8,9,13,0.90)), url(${block.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.24,
          filter: 'brightness(0.95) grayscale(8%)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      )}

      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0,
        background: `radial-gradient(circle at 50% 18%, rgba(${rgb},0.09), transparent 31%), linear-gradient(180deg, rgba(8,9,13,0.16), rgba(8,9,13,0.96) 82%)`,
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: `calc(14px + env(safe-area-inset-top)) ${SPACING.standard}px calc(${SPACING.separation}px + env(safe-area-inset-bottom))`,
        overflow: 'auto',
        filter: hasResults ? 'brightness(0.70)' : 'none',
        transition: `filter ${MOTION.duration.standard} ${MOTION.easing.gentle}`,
      }}>
        <div style={{ position: 'relative', minHeight: 48, marginBottom: SPACING.section, flexShrink: 0 }}>
          <div style={{ position: 'absolute', left: 0, top: 0 }}>
            <BackButton onClick={onBack} />
          </div>
          <ProgressRail rgb={rgb} />
        </div>

        {(phase === 'input' || phase === 'results') && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', animation: 'prk-fade-in 280ms ease both' }}>
            <div style={{ flex: 1 }}>
              <h1 style={{
                fontFamily: TYPE.bodyText.fontFamily,
                ...TYPE.sectionTitle,
                color: '#F5F7FF',
                margin: 0,
                marginBottom: SPACING.micro,
                textWrap: 'balance',
              }}>
                What can you remember?
              </h1>

              <p style={{
                fontFamily: TYPE.bodyText.fontFamily,
                ...TYPE.bodySmall,
                color: 'rgba(245,247,255,0.58)',
                margin: 0,
                marginBottom: SPACING.compact,
                lineHeight: 1.45,
              }}>
                Write anything you know before we reveal the gaps.
              </p>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 11px',
                borderRadius: RADII.pill,
                background: `rgba(${ringRgb},0.10)`,
                border: `1px solid rgba(${ringRgb},0.28)`,
                boxShadow: `0 0 16px rgba(${ringRgb},0.08)`,
                marginBottom: SPACING.standard,
              }}>
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: `rgb(${ringRgb})`,
                  boxShadow: `0 0 8px rgba(${ringRgb},0.40)`,
                }} />
                <span style={{
                  fontFamily: TYPE.bodyText.fontFamily,
                  fontSize: 12,
                  fontWeight: 750,
                  color: `rgb(${ringRgb})`,
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '0.02em',
                }}>
                  {formatTime(secondsLeft)}
                </span>
              </div>

              <div style={{
                position: 'relative',
                background: 'linear-gradient(180deg, rgba(20,23,29,0.93), rgba(11,13,18,0.96))',
                border: isFocused ? `1.5px solid rgba(${SUCCESS_RGB},0.58)` : `1.5px solid rgba(${rgb},0.28)`,
                borderRadius: 24,
                padding: `${SPACING.compact}px ${SPACING.standard}px`,
                marginBottom: SPACING.compact,
                boxShadow: isFocused
                  ? `0 0 0 1px rgba(${SUCCESS_RGB},0.13), 0 0 36px rgba(${SUCCESS_RGB},0.14), inset 0 1px 0 rgba(255,255,255,0.05)`
                  : `0 0 28px rgba(${rgb},0.09), inset 0 1px 0 rgba(255,255,255,0.04)`,
                transition: `border-color ${MOTION.duration.standard} ${MOTION.easing.gentle}, box-shadow ${MOTION.duration.standard} ${MOTION.easing.gentle}`,
              }}>
                <div style={{
                  fontFamily: TYPE.bodyText.fontFamily,
                  fontSize: 11,
                  fontWeight: 750,
                  letterSpacing: '0.13em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.36)',
                  marginBottom: SPACING.micro,
                }}>
                  Your recall
                </div>

                <div style={{ position: 'relative' }}>
                  {answer.length === 0 && (
                    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                      <div style={{
                        fontFamily: TYPE.bodyText.fontFamily,
                        fontSize: 16,
                        fontWeight: 500,
                        lineHeight: 1.7,
                        letterSpacing: '0.01em',
                        color: 'rgba(245,247,255,0.42)',
                      }}>
                        Type your answer here…
                      </div>
                      <div style={{
                        fontFamily: TYPE.bodyText.fontFamily,
                        fontSize: 13,
                        fontWeight: 400,
                        lineHeight: 1.5,
                        color: 'rgba(245,247,255,0.18)',
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
                    rows={8}
                    disabled={phase === 'results'}
                    aria-label="Write anything you remember"
                    style={{
                      width: '100%',
                      padding: 0,
                      minHeight: 'clamp(250px, 39vh, 340px)',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      resize: 'none',
                      fontFamily: TYPE.bodyText.fontFamily,
                      ...TYPE.bodySmall,
                      color: '#F5F7FF',
                      lineHeight: 1.7,
                      letterSpacing: '0.01em',
                      caretColor: `rgb(${SUCCESS_RGB})`,
                      opacity: phase === 'results' ? 0.72 : 1,
                    }}
                  />
                </div>

                <div aria-hidden="true" style={{
                  position: 'absolute',
                  right: 18,
                  bottom: 16,
                  color: `rgba(${SUCCESS_RGB},0.33)`,
                  opacity: 0.9,
                }}>
                  <FeatherIcon color="currentColor" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: SPACING.micro }}>
                <span style={{
                  fontFamily: TYPE.bodyText.fontFamily,
                  fontSize: 12,
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  color: 'rgba(245,247,255,0.32)',
                }}>
                  Ideas captured: {ideaCount}
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: error ? SPACING.compact : SPACING.standard }}>
                {recallPrompts.slice(0, 4).map(p => <PromptChip key={p} label={p} rgb={rgb} />)}
              </div>

              {error && (
                <p style={{ fontFamily: TYPE.bodyText.fontFamily, ...TYPE.bodySmall, color: '#E05A52', margin: `0 0 ${SPACING.standard}px` }}>
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={submit}
              disabled={phase === 'results'}
              {...pressProps}
              style={{
                width: '100%',
                minHeight: 60,
                borderRadius: 18,
                border: `1.5px solid rgba(${rgb},0.62)`,
                background: `linear-gradient(180deg, rgba(${rgb},0.42), rgba(${rgb},0.18))`,
                boxShadow: `0 0 34px rgba(${rgb},0.14), inset 0 1px 0 rgba(255,255,255,0.11)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transform: isPressed ? `scale(${MOTION.scale.press})` : 'scale(1)',
                transition: `transform ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                flexShrink: 0,
                opacity: phase === 'results' ? 0.58 : 1,
              }}
            >
              <span style={{
                fontFamily: TYPE.bodyText.fontFamily,
                fontSize: 17,
                fontWeight: 800,
                color: accent,
              }}>
                Check my recall
              </span>
            </button>
          </div>
        )}

        {phase === 'analyzing' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', animation: 'prk-fade-in 280ms ease both' }}>
            <div style={{
              width: 44,
              height: 44,
              border: '2px solid rgba(255,255,255,0.06)',
              borderTop: `2px solid ${accent}`,
              borderRadius: '50%',
              animation: 'prk-spin 0.85s linear infinite',
              marginBottom: SPACING.standard,
            }} />
            <p style={{ fontFamily: TYPE.bodyText.fontFamily, ...TYPE.body, color: 'rgba(255,255,255,0.55)', textAlign: 'center', margin: 0 }}>
              Checking what you remember…
            </p>
          </div>
        )}
      </div>

      {hasResults && (
        <ResultsOverlay
          results={results}
          recalled={recalled}
          missing={missing}
          accent={accent}
          rgb={rgb}
          onClose={onContinue}
        />
      )}
    </CinematicShell>
  )
}
