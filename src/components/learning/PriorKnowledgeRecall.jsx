import { useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import { logWrongAnswer } from '../../unifiedWeaknessTracker.js'

// Concept score thresholds
const SCORE_RECALLED = 0.7   // >= recalled (teal)
const SCORE_PARTIAL  = 0.3   // >= partial (amber), < recalled
                              // < 0.3 = missing — logged to weakness tracker

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

// ─── ConceptGroup ─────────────────────────────────────────────────────────────
function ConceptGroup({ label, concepts, color }) {
  return (
    <div style={{ marginBottom: SPACING.standard }}>
      <div style={{
        fontFamily: "'Sora', sans-serif",
        fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color, opacity: 0.8,
        marginBottom: SPACING.micro,
      }}>
        {label}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {concepts.map(c => (
          <ConceptChip key={c.tag} label={c.label} color={color} />
        ))}
      </div>
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
//   prompt: 'What do you remember from the last chapter?',  // optional
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

  const [phase,     setPhase]     = useState('input')   // 'input' | 'analyzing' | 'results'
  const [answer,    setAnswer]    = useState('')
  const [results,   setResults]   = useState(null)
  const [error,     setError]     = useState(null)
  const [isPressed, setIsPressed] = useState(false)

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

  // Sort concepts into three groups
  const recalled = results?.concepts.filter(c => c.score >= SCORE_RECALLED) || []
  const partial   = results?.concepts.filter(c => c.score >= SCORE_PARTIAL && c.score < SCORE_RECALLED) || []
  const missing   = results?.concepts.filter(c => c.score < SCORE_PARTIAL) || []

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

  const ArrowIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="#0D0F14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
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
          <button
            onClick={onBack}
            style={{
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 22, height: 22,
            }}
            aria-label="Back"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

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
                {block.prompt || 'What do you remember from last time?'}
              </h1>

              {block.chapterTitle && (
                <p style={{
                  fontFamily: "'Sora', sans-serif",
                  ...TYPE.bodySmall,
                  color: 'rgba(168,159,194,0.65)',
                  margin: 0, marginBottom: SPACING.separation,
                }}>
                  {block.chapterTitle}
                </p>
              )}

              <div style={{
                background: '#101218',
                border: '1.5px solid rgba(255,255,255,0.08)',
                borderRadius: RADII.large,
                padding: `${SPACING.compact}px ${SPACING.standard}px`,
                marginBottom: error ? SPACING.compact : SPACING.standard,
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
                <textarea
                  value={answer}
                  onChange={e => { setAnswer(e.target.value); setError(null) }}
                  placeholder="Write what you remember — concepts, names, theories. Rough notes are fine."
                  rows={7}
                  style={{
                    width: '100%',
                    background: 'transparent', border: 'none', outline: 'none',
                    resize: 'none',
                    fontFamily: "'Sora', sans-serif",
                    ...TYPE.bodySmall,
                    color: '#F5F7FF',
                    lineHeight: 1.65,
                    caretColor: accent,
                  }}
                />
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

            <button onClick={submit} {...pressProps} style={btnStyle}>
              <span style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 18, fontWeight: 600, color: '#0D0F14',
              }}>
                Check my recall
              </span>
              <ArrowIcon />
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
                Recall check
              </h1>

              {results.summary && (
                <p style={{
                  fontFamily: "'Sora', sans-serif",
                  ...TYPE.bodySmall,
                  color: 'rgba(168,159,194,0.8)',
                  margin: 0, marginBottom: SPACING.separation,
                  lineHeight: 1.6,
                }}>
                  {results.summary}
                </p>
              )}

              {recalled.length > 0 && (
                <ConceptGroup
                  label={`Recalled — ${recalled.length}`}
                  concepts={recalled}
                  color="#4CAF7D"
                />
              )}

              {partial.length > 0 && (
                <ConceptGroup
                  label={`Partial — ${partial.length}`}
                  concepts={partial}
                  color="#E0A84F"
                />
              )}

              {missing.length > 0 && (
                <ConceptGroup
                  label={`Gaps to revisit — ${missing.length}`}
                  concepts={missing}
                  color="#5E5874"
                />
              )}

              {missing.length > 0 && (
                <p style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 13, fontWeight: 400, lineHeight: 1.55,
                  color: 'rgba(94,88,116,0.75)',
                  margin: `${SPACING.micro}px 0 0`,
                }}>
                  These gaps have been added to your weak spots and will come up in future sessions.
                </p>
              )}

              {missing.length === 0 && recalled.length > 0 && (
                <p style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 13, fontWeight: 400, lineHeight: 1.55,
                  color: 'rgba(76,175,125,0.7)',
                  margin: `${SPACING.micro}px 0 0`,
                }}>
                  No gaps found. Strong recall going into this chapter.
                </p>
              )}
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
