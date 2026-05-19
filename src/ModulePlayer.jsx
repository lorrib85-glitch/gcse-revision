import { useState, useEffect, useRef } from 'react'
import { recordActivity, recordScore } from './progress.js'

// iOS Safari ignores window.scrollTo on fixed-position shells.
// scrollToTop() tries window first, then falls back to the document element.
function scrollToTop() {
  try {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    // Also scroll the module content container for iOS Safari
    const el = document.getElementById('module-scroll-container')
    if (el) el.scrollTop = 0
  } catch {}
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
function getModuleState(moduleId) {
  try { return JSON.parse(localStorage.getItem(`gcse_module_${moduleId}`) || '{}') } catch { return {} }
}
function saveModuleState(moduleId, state) {
  try { localStorage.setItem(`gcse_module_${moduleId}`, JSON.stringify(state)) } catch {}
}

// Confidence ratings — keyed by moduleId, stored in a shared array
// Shape: [{ moduleId, subject, title, confidence, timestamp }, ...]
export function getAllConfidenceRatings() {
  try { return JSON.parse(localStorage.getItem('gcse_confidence') || '[]') } catch { return [] }
}
function saveConfidenceRating(moduleId, subject, title, confidence) {
  try {
    const all = getAllConfidenceRatings()
    const filtered = all.filter(r => r.moduleId !== moduleId)
    filtered.push({ moduleId, subject, title, confidence, timestamp: Date.now() })
    localStorage.setItem('gcse_confidence', JSON.stringify(filtered))
  } catch {}
}

function ReadBlock({ block, isWarm = false, isBio = false, isMaths = false, isSoc = false }) {
  return (
    <div style={{
      borderLeft: `3px solid ${isWarm ? '#C47828' : isBio ? '#38D27A' : isMaths ? '#4B90FF' : isSoc ? '#D96030' : '#3B82FF'}`,
      background: isWarm ? 'rgba(196,120,40,.07)' : isBio ? 'rgba(56,210,122,.07)' : isMaths ? 'rgba(75,144,255,.07)' : isSoc ? 'rgba(217,96,48,.07)' : 'rgba(59,130,255,.07)',
      borderRadius: '0 14px 14px 0',
      padding: '16px 18px', margin: '12px 0',
    }}>
      {block.label && (
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em',
          textTransform: 'uppercase', color: isWarm ? '#C8901A' : isBio ? '#38D27A' : isMaths ? '#4B90FF' : isSoc ? '#D96030' : '#70B8FF', marginBottom: 8,
        }}>{block.label}</div>
      )}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '.95rem', lineHeight: 1.7, margin: 0, color: isWarm ? '#C8B090' : isBio ? '#A8D4B8' : isSoc ? '#D4B8A8' : '#C8D0E8',
      }} dangerouslySetInnerHTML={{ __html: block.text }} />
    </div>
  )
}

function KeypointBlock({ block, isWarm = false, isBio = false, isMaths = false, isSoc = false }) {
  return (
    <div style={{
      background: isWarm ? 'linear-gradient(135deg, #1C1205 0%, #120C03 100%)' : isBio ? 'linear-gradient(135deg, #071410 0%, #040C08 100%)' : isSoc ? 'linear-gradient(135deg, #1C0D07 0%, #120805 100%)' : 'linear-gradient(135deg, #1A2338 0%, #111828 100%)',
      border: `1px solid ${isWarm ? 'rgba(196,120,40,.3)' : isBio ? 'rgba(56,210,122,.25)' : isSoc ? 'rgba(217,96,48,.3)' : 'rgba(157,92,255,.25)'}`,
      borderRadius: 16, padding: '18px 20px', margin: '14px 0',
      boxShadow: isWarm ? '0 0 24px rgba(196,120,40,.08)' : isBio ? '0 0 24px rgba(56,210,122,.08)' : '0 0 24px rgba(157,92,255,.08)',
    }}>
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em',
        textTransform: 'uppercase', color: isWarm ? '#C8901A' : isBio ? '#38D27A' : isSoc ? '#D96030' : '#9D5CFF', marginBottom: 10,
      }}>⭐ Key Point</div>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '.95rem', lineHeight: 1.65, margin: 0, color: isWarm ? '#D4C4A0' : isBio ? '#A8D4B8' : isSoc ? '#D4B8A8' : '#E0E6F0',
      }} dangerouslySetInnerHTML={{ __html: block.text }} />
    </div>
  )
}

function FunFactBlock({ block, isWarm = false, isBio = false, isMaths = false, isSoc = false }) {
  return (
    <div style={{
      background: isWarm ? 'rgba(196,120,40,.07)' : isBio ? 'rgba(56,210,122,.07)' : 'rgba(255,200,87,.06)',
      borderLeft: `3px solid ${isWarm ? '#C47828' : isBio ? '#38D27A' : '#FFC857'}`,
      borderRadius: '0 14px 14px 0',
      padding: '14px 18px', margin: '12px 0',
    }}>
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em',
        textTransform: 'uppercase', color: isWarm ? '#C8901A' : isBio ? '#38D27A' : '#FFC857', marginBottom: 6,
      }}>{block.label || '🤯 Fun Fact'}</div>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '.92rem', margin: 0, color: isWarm ? '#C8B090' : isBio ? '#A8D4B8' : '#C8D0E8', lineHeight: 1.65,
      }}>{block.text}</p>
    </div>
  )
}

function ExamTipBlock({ block, isWarm = false }) {
  const accent = isWarm ? '#C47828' : '#F5B700'
  return (
    <div style={{
      background: isWarm ? 'linear-gradient(135deg, #130A02 0%, #0C0702 100%)' : 'linear-gradient(135deg, #0C2218 0%, #071610 100%)',
      border: `1.5px dashed ${isWarm ? 'rgba(196,120,40,.35)' : 'rgba(245,183,0,.35)'}`,
      borderRadius: 16, padding: '16px 18px', margin: '14px 0',
      boxShadow: isWarm ? '0 0 20px rgba(196,120,40,.05)' : '0 0 20px rgba(245,183,0,.05)',
    }}>
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em',
        textTransform: 'uppercase', color: accent, marginBottom: 10,
      }}>{block.label || '🗡️ Exam Assassin'}</div>
      {block.text && (
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.9rem', margin: 0, color: isWarm ? '#C8B090' : '#C8D0E8', lineHeight: 1.65,
        }} dangerouslySetInnerHTML={{ __html: block.text }} />
      )}
      {block.tip && (
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.9rem', marginBottom: block.phrases ? 10 : 0, color: isWarm ? '#C8B090' : '#C8D0E8', lineHeight: 1.65,
        }} dangerouslySetInnerHTML={{ __html: block.tip }} />
      )}
      {block.phrases && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {block.phrases.map(p => (
            <span key={p} style={{
              background: isWarm ? 'rgba(196,120,40,.12)' : 'rgba(245,183,0,.12)',
              border: `1px solid ${isWarm ? 'rgba(196,120,40,.3)' : 'rgba(245,183,0,.3)'}`,
              color: accent, borderRadius: 8, padding: '5px 11px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '.78rem', fontWeight: 600,
            }}>{p}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function TimelineBlock({ block, isWarm = false, isBio = false }) {
  const [open, setOpen] = useState(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '14px 0' }}>
      {block.events.map((e, i) => (
        <div key={i}>
          <button onClick={() => setOpen(open === i ? null : i)}
            className="lift-tap"
            style={{
              width: '100%', display: 'grid', gridTemplateColumns: '72px 1fr',
              gap: 10, border: 'none', background: 'transparent', cursor: 'pointer',
              textAlign: 'left', padding: 0,
            }}>
            <div style={{
              background: open === i ? (isWarm ? '#C47828' : isBio ? '#38D27A' : '#F5B700') : (isWarm ? '#1C1205' : isBio ? '#071410' : '#1A2338'),
              color: open === i ? (isWarm ? '#0C0500' : isBio ? '#021A0A' : '#070500') : (isWarm ? '#C47828' : isBio ? '#38D27A' : '#F5B700'),
              border: `1px solid ${open === i ? (isWarm ? '#C47828' : isBio ? '#38D27A' : '#F5B700') : (isWarm ? 'rgba(196,120,40,.4)' : isBio ? 'rgba(56,210,122,.4)' : '#2A3552')}`,
              borderRadius: 12, display: 'grid', placeItems: 'center',
              fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '.8rem', padding: '10px 6px', minHeight: 56, transition: 'all .2s',
            }}>{e.year}</div>
            <div style={{
              background: open === i ? (isWarm ? 'rgba(196,120,40,.06)' : isBio ? 'rgba(56,210,122,.06)' : 'rgba(245,183,0,.06)') : (isWarm ? '#1C1205' : isBio ? '#071410' : '#10182B'),
              border: `1px solid ${open === i ? (isWarm ? 'rgba(196,120,40,.3)' : isBio ? 'rgba(56,210,122,.3)' : 'rgba(245,183,0,.3)') : (isWarm ? 'rgba(196,120,40,.2)' : isBio ? 'rgba(56,210,122,.2)' : '#2A3552')}`,
              borderRadius: 12, padding: '12px 14px', transition: 'all .2s',
              display: 'flex', alignItems: 'center',
            }}>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '.9rem', fontWeight: 500, color: isWarm ? '#C8B090' : isBio ? '#A8D4B8' : '#C8D0E8',
              }} dangerouslySetInnerHTML={{ __html: e.text }} />
            </div>
          </button>
        </div>
      ))}
    </div>
  )
}

// ─── BossBlock — free text answer graded by Claude API ───────────────────────
const GRADE_COLOURS_BOSS = {
  strong:     { bg: 'rgba(77,255,136,.08)',  border: 'rgba(77,255,136,.35)',  text: '#4DFF88',  badge: '#38D27A',  label: 'Strong answer' },
  partial:    { bg: 'rgba(255,200,87,.07)',  border: 'rgba(255,200,87,.3)',   text: '#FFC857',  badge: '#F5B700',  label: 'Partial — keep going' },
  weak:       { bg: 'rgba(255,93,115,.08)',  border: 'rgba(255,93,115,.3)',   text: '#FF5D73',  badge: '#FF5D73',  label: 'Needs more' },
}

// Boss answers are graded via the same /api/grade endpoint used by test questions.
// This keeps the API key server-side and shares the full examiner prompt.
// The mark scheme is passed as the markScheme field; we use 3 as a proxy mark count
// so the response shape (marksAwarded/marksAvailable/grade/etc.) matches what we render.
async function gradeBossAnswer(question, markPoints, studentAnswer) {
  const response = await fetch('/api/grade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      answer: studentAnswer,
      marks: 3,
      markScheme: markPoints,
    }),
  })
  if (!response.ok) throw new Error(`Server error ${response.status}`)
  const data = await response.json()
  if (data.error) throw new Error(data.error)
  // Normalise /api/grade shape → BossBlock shape
  return {
    grade:       data.grade === 'Excellent' || data.grade === 'Good' ? 'strong'
               : data.grade === 'Developing' ? 'partial' : 'weak',
    score:       data.marksAwarded ?? 0,
    summary:     data.summary,
    achieved:    data.achieved || [],
    missed:      data.missed   || [],
    modelAnswer: null,   // not returned by /api/grade — shown via examinerTip instead
    examinerTip: data.examinerTip,
  }
}

function BossBlock({ block }) {
  const [answer, setAnswer] = useState('')
  const [grading, setGrading] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [error, setError] = useState(null)

  const TIER_COLOURS = {
    '🟢': 'rgba(77,255,136,.15)',
    '🟡': 'rgba(255,200,87,.12)',
    '🔴': 'rgba(255,93,115,.12)',
  }
  const tierEmoji = block.tier || '🟢'
  const tierBg = TIER_COLOURS[tierEmoji] || TIER_COLOURS['🟢']

  async function submit() {
    if (answer.trim().length < 10) {
      setError('Write at least a sentence — even a rough attempt is fine.')
      return
    }
    setError(null)
    setGrading(true)
    try {
      const result = await gradeBossAnswer(block.question, block.markPoints, answer)
      setFeedback(result)
    } catch (e) {
      setError('Could not reach the grading server. Check your connection and try again.')
    } finally {
      setGrading(false)
    }
  }

  function retry() {
    setAnswer('')
    setFeedback(null)
    setError(null)
  }

  const gs = feedback ? (GRADE_COLOURS_BOSS[feedback.grade] || GRADE_COLOURS_BOSS.partial) : null

  return (
    <div style={{ margin: '14px 0' }}>
      {/* Question card */}
      <div style={{
        background: `linear-gradient(145deg, #0E1A28, #0A1320)`,
        border: `1px solid ${tierBg.replace('.15', '.4').replace('.12', '.4')}`,
        borderRadius: 16, padding: '16px 18px', marginBottom: 12,
        boxShadow: `0 0 20px ${tierBg}`,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
        }}>
          <span style={{ fontSize: '1rem' }}>{tierEmoji}</span>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em',
            textTransform: 'uppercase', color: '#38D27A',
          }}>{block.label || 'Boss Challenge'}</div>
        </div>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600, fontSize: '1rem',
          color: '#F5F7FB', margin: 0, lineHeight: 1.45,
        }}>{block.question}</p>
      </div>

      {/* Answer area — hidden once feedback received */}
      {!feedback && (
        <>
          <div style={{
            background: '#10182B',
            border: `1.5px solid ${grading ? 'rgba(56,210,122,.35)' : '#2A3552'}`,
            borderRadius: 14, padding: '14px 16px', marginBottom: 10,
            transition: 'border-color .2s',
          }}>
            <div style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '.1em', color: '#4A5578', marginBottom: 8,
            }}>Your answer</div>
            <textarea
              value={answer}
              onChange={e => { setAnswer(e.target.value); setError(null) }}
              placeholder="Write your answer here. Use correct scientific terms. Minimum one full sentence."
              disabled={grading}
              style={{
                width: '100%', border: 'none', background: 'transparent',
                resize: 'none', outline: 'none',
                fontFamily: "'Inter', sans-serif",
                fontSize: '.93rem', color: '#E0E6F0',
                lineHeight: 1.7, minHeight: 100,
                opacity: grading ? .5 : 1,
              }}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(255,93,115,.08)', border: '1px solid rgba(255,93,115,.28)',
              borderRadius: 10, padding: '10px 14px', marginBottom: 10,
            }}>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.83rem', color: '#FF5D73', margin: 0 }}>{error}</p>
            </div>
          )}

          <button onClick={submit} disabled={grading} style={{
            width: '100%',
            background: grading
              ? '#10182B'
              : 'linear-gradient(135deg, #38D27A, #6BFFB0)',
            border: grading ? '1px solid #2A3552' : 'none',
            borderRadius: 13, padding: '14px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: '.95rem',
            color: grading ? '#4A5578' : '#001A0A',
            cursor: grading ? 'default' : 'pointer',
            boxShadow: grading ? 'none' : '0 4px 20px rgba(56,210,122,.35)',
            transition: 'all .2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {grading ? (
              <>
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span>
                Marking your answer…
              </>
            ) : 'Submit for marking →'}
          </button>
        </>
      )}

      {/* Feedback */}
      {feedback && gs && (
        <div className="fade-up">
          {/* Score card */}
          <div style={{
            background: gs.bg,
            border: `2px solid ${gs.border}`,
            borderRadius: 18, padding: '18px 20px', marginBottom: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800, fontSize: '1.4rem', color: gs.text,
              }}>
                {feedback.score}/3
              </div>
              <div style={{
                background: gs.badge, color: '#000',
                borderRadius: 99, padding: '4px 12px',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '.75rem',
              }}>{gs.label}</div>
            </div>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '.9rem', color: gs.text,
              margin: 0, lineHeight: 1.55, opacity: .9,
            }}>{feedback.summary}</p>
          </div>

          {/* What they got right */}
          {feedback.achieved?.length > 0 && (
            <div style={{
              background: '#10182B', border: '1px solid #1E2A40',
              borderRadius: 13, padding: '14px', marginBottom: 8,
            }}>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '.1em', color: '#4DFF88', marginBottom: 8,
              }}>✓ What you got right</div>
              {feedback.achieved.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: i < feedback.achieved.length - 1 ? 7 : 0 }}>
                  <span style={{ color: '#4DFF88', flexShrink: 0 }}>✓</span>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.87rem', color: '#C8D0E8', margin: 0, lineHeight: 1.5 }}>{a}</p>
                </div>
              ))}
            </div>
          )}

          {/* What they missed */}
          {feedback.missed?.length > 0 && (
            <div style={{
              background: '#10182B', border: '1px solid #1E2A40',
              borderRadius: 13, padding: '14px', marginBottom: 8,
            }}>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '.1em', color: '#FF5D73', marginBottom: 8,
              }}>→ Key points you missed</div>
              {feedback.missed.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: i < feedback.missed.length - 1 ? 7 : 0 }}>
                  <span style={{ color: '#FF5D73', flexShrink: 0 }}>→</span>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.87rem', color: '#C8D0E8', margin: 0, lineHeight: 1.5 }}>{m}</p>
                </div>
              ))}
            </div>
          )}

          {/* Examiner tip */}
          {feedback.examinerTip && (
            <div style={{
              background: 'rgba(245,183,0,.05)', border: '1px solid rgba(245,183,0,.18)',
              borderRadius: 13, padding: '14px', marginBottom: 10,
            }}>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '.1em', color: '#F5B700', marginBottom: 6,
              }}>🗡️ Examiner tip</div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.87rem', color: '#C8D0E8', margin: 0, lineHeight: 1.5 }}>{feedback.examinerTip}</p>
            </div>
          )}

          {/* Model answer — generated inline from what was missed */}
          {feedback.missed?.length > 0 && (
            <div style={{
              background: 'rgba(56,210,122,.05)', border: '1px solid rgba(56,210,122,.18)',
              borderRadius: 13, padding: '14px', marginBottom: 10,
            }}>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '.1em', color: '#38D27A', marginBottom: 8,
              }}>📋 To score higher, your answer needs</div>
              {feedback.missed.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: i < feedback.missed.length - 1 ? 6 : 0 }}>
                  <span style={{ color: '#38D27A', flexShrink: 0, fontSize: '.85rem' }}>+</span>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.85rem', color: '#C8D0E8', margin: 0, lineHeight: 1.5 }}>{m}</p>
                </div>
              ))}
            </div>
          )}

          {/* Retry */}
          <button onClick={retry} style={{
            width: '100%',
            background: 'linear-gradient(135deg, #38D27Acc, #38D27A)',
            border: 'none', borderRadius: 13, padding: '13px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: '.9rem', color: '#001A0A',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(56,210,122,.3)',
          }}>↩ Try again with improvements</button>
        </div>
      )}
    </div>
  )
}

function RevealBlock({ block }) {
  const [shown, setShown] = useState(false)
  return (
    <div style={{ margin: '14px 0' }}>
      {/* Prompt card */}
      <div style={{
        background: '#10182B',
        border: '1px solid #2A3552',
        borderRadius: 14, padding: '16px 18px', marginBottom: 10,
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em',
          textTransform: 'uppercase', color: '#9D5CFF', marginBottom: 8,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ⚡ {block.label || 'Rapid Fire Sort'}
        </div>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500, margin: 0,
          color: '#7C8DB0', fontSize: '.95rem', lineHeight: 1.5,
        }}>{block.prompt}</p>
      </div>

      {!shown ? (
        <button onClick={() => setShown(true)} style={{
          width: '100%',
          background: 'transparent',
          border: '1px solid #2A3552',
          borderRadius: 14, padding: '14px',
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600, fontSize: '.92rem',
          color: '#9CA8C7', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'border-color .2s, color .2s',
        }}>
          Reveal answer →
        </button>
      ) : (
        <div className="fade-up" style={{
          background: 'rgba(77,255,136,.07)',
          border: '1px solid rgba(77,255,136,.25)',
          borderRadius: 14, padding: '16px 18px',
        }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.68rem', fontWeight: 700, letterSpacing: '.1em',
            textTransform: 'uppercase', color: '#4DFF88', marginBottom: 8,
          }}>✓ Answer</div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            margin: 0, fontSize: '.92rem', color: '#C8D0E8', lineHeight: 1.6,
          }}>{block.answer}</p>
        </div>
      )}
    </div>
  )
}

function QuizBlock({ block, onAnswered, subject }) {
  const [selected, setSelected]   = useState(null)
  const [shakeIdx, setShakeIdx]   = useState(null)
  const [attempts, setAttempts]   = useState(0)
  const [showHint, setShowHint]   = useState(false)
  const [locked, setLocked]       = useState(false)

  function choose(i) {
    if (locked) return
    const correct = block.options[i].correct
    setSelected(i)
    setAttempts(a => a + 1)

    if (correct) {
      setLocked(true)
      // Record a correct answer (1 mark per quiz question)
      if (subject) recordScore({ subject, earned: 1, possible: 1, source: 'module' })
      if (onAnswered) setTimeout(() => onAnswered(), 700)
    } else {
      setShakeIdx(i)
      setShowHint(true)
      // Lock after second wrong attempt — show full explanation
      if (attempts >= 1) {
        setLocked(true)
        if (subject) recordScore({ subject, earned: 0, possible: 1, source: 'module' })
      }
      // Reset shake after animation
      setTimeout(() => setShakeIdx(null), 500)
    }
  }

  function retry() {
    setSelected(null)
    setShakeIdx(null)
    // Keep showHint visible and attempts count
  }

  const answered    = selected !== null
  const wasCorrect  = answered && block.options[selected]?.correct
  const wasWrong    = answered && !wasCorrect
  const showFull    = wasCorrect || locked  // show full explanation

  return (
    <div style={{ margin: '14px 0' }}>
      {/* Question */}
      <div style={{
        background: 'linear-gradient(135deg, #12183A, #0E1330)',
        border: '1px solid rgba(157,92,255,.2)',
        borderRadius: 14, padding: '16px 18px', marginBottom: 12,
      }}>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          color: '#F5F7FB', fontWeight: 600, fontSize: '1rem', margin: 0, lineHeight: 1.45,
        }}>{block.question}</p>
      </div>

      {/* Options */}
      <div className="grid-stack">
        {block.options.map((opt, i) => {
          let cls = 'opt'
          if (answered || locked) {
            if (opt.correct && (showFull || wasCorrect)) cls += ' correct'
            else if (i === selected && wasWrong)         cls += ' wrong'
          }
          // After retry (selected cleared), show nothing highlighted yet
          return (
            <button key={i} className={`${cls}${shakeIdx === i ? ' shake' : ''}`}
              onClick={() => choose(i)}
              disabled={locked || (wasCorrect)}>
              <span style={{ marginRight: 8, opacity: .45 }}>{String.fromCharCode(65 + i)}.</span>
              {opt.text}
            </button>
          )
        })}
      </div>

      {/* Hint after first wrong attempt — before locking */}
      {showHint && !locked && wasWrong && (
        <div className="fade-up" style={{
          background: 'rgba(255,200,87,.06)',
          border: '1px solid rgba(255,200,87,.25)',
          borderRadius: 12, padding: '12px 14px', marginTop: 10,
        }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.63rem', fontWeight: 700, letterSpacing: '.1em',
            textTransform: 'uppercase', color: '#FFC857', marginBottom: 6,
          }}>💡 Hint — think about this</div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.87rem', color: '#C8D0E8', margin: '0 0 10px', lineHeight: 1.55,
          }}>{block.hint || block.explanation}</p>
          <button onClick={retry} style={{
            background: 'rgba(255,200,87,.1)',
            border: '1px solid rgba(255,200,87,.3)',
            borderRadius: 9, padding: '8px 16px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: '.82rem', color: '#FFC857',
            cursor: 'pointer',
          }}>Try again →</button>
        </div>
      )}

      {/* Full feedback after correct or locked */}
      {showFull && (
        <div className={`feedback ${wasCorrect ? 'correct' : 'wrong'} fade-up`} style={{ marginTop: 10 }}>
          <p style={{ margin: 0, fontSize: '.9rem', fontFamily: "'Inter', sans-serif" }}>
            <strong>{wasCorrect ? '✓ Correct! ' : '✗ Nope — the answer was: '}</strong>
            {wasCorrect ? block.explanation : (
              <>
                <strong style={{ color: '#4DFF88' }}>
                  {block.options.find(o => o.correct)?.text}
                </strong>
                {block.explanation ? <><br />{block.explanation}</> : null}
              </>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

function FlashcardsBlock({ block }) {
  const [flipped, setFlipped] = useState(new Set())
  function toggle(i) {
    setFlipped(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n })
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '14px 0' }}>
      {block.cards.map((c, i) => (
        <button key={i} onClick={() => toggle(i)} className="lift-tap"
          style={{
            background: flipped.has(i)
              ? 'linear-gradient(145deg, #1A1038, #120C2C)'
              : '#10182B',
            border: `1.5px solid ${flipped.has(i) ? 'rgba(157,92,255,.4)' : '#2A3552'}`,
            borderRadius: 14, padding: '16px 12px', cursor: 'pointer',
            textAlign: 'center', minHeight: 90, transition: 'all .22s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: flipped.has(i) ? '0 0 16px rgba(157,92,255,.12)' : 'none',
          }}>
          <div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '.88rem',
              color: flipped.has(i) ? '#C18CFF' : '#E0E6F0',
              marginBottom: flipped.has(i) ? 6 : 0,
            }}>{c.front}</div>
            {flipped.has(i) && (
              <div className="fade-up" style={{
                fontFamily: "'Inter', sans-serif",
                color: '#9CA8C7', fontSize: '.78rem', lineHeight: 1.5,
              }}>{c.back}</div>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}

// ─── HotspotBlock — interactive labelled diagram ──────────────────────────────
const ORGANELLE_INFO = {
  nucleus:      { icon: '🧬', color: '#9D5CFF', title: 'Nucleus',        job: 'Controls all cell activities. Contains DNA — the instructions for everything the cell does.', analogy: 'The manager\'s office.' },
  chloroplast:  { icon: '☀️', color: '#38D27A', title: 'Chloroplast',    job: 'Contains chlorophyll. Absorbs light energy for photosynthesis. This is where glucose is made.', analogy: 'Solar panels on a factory roof.' },
  cell_wall:    { icon: '🧱', color: '#F5B700', title: 'Cell Wall',      job: 'Made of cellulose. Gives the plant cell strength and a fixed shape. Animal cells don\'t have one.', analogy: 'The factory\'s outer brick walls.' },
  cell_membrane:{ icon: '🚪', color: '#3B82FF', title: 'Cell Membrane',  job: 'Controls what enters and leaves the cell. Every cell has one — plant and animal.', analogy: 'Security at the factory entrance.' },
  vacuole:      { icon: '💧', color: '#34D5FF', title: 'Large Vacuole',  job: 'Filled with cell sap. Keeps the cell firm (turgid). If it shrinks, the plant wilts.', analogy: 'The factory\'s water tank.' },
  mitochondria: { icon: '⚡', color: '#FF8A1F', title: 'Mitochondria',   job: 'Site of aerobic respiration. Releases energy from glucose for the cell to use.', analogy: 'The factory\'s power generators.' },
  cytoplasm:    { icon: '🌊', color: '#6BFFB0', title: 'Cytoplasm',      job: 'Jelly-like fluid where most chemical reactions happen. Holds organelles in place.', analogy: 'The factory floor.' },
  ribosomes:    { icon: '🔬', color: '#FF4FC3', title: 'Ribosomes',      job: 'Where proteins are made. Too small to see on a light microscope — need an electron microscope.', analogy: 'The factory\'s assembly lines.' },
}

function HotspotBlock({ block }) {
  const [active, setActive] = useState(null)
  const [discovered, setDiscovered] = useState(new Set())

  function tap(key) {
    setActive(active === key ? null : key)
    setDiscovered(s => { const n = new Set(s); n.add(key); return n })
  }

  const parts = block.parts || Object.keys(ORGANELLE_INFO)
  const info = active ? ORGANELLE_INFO[active] : null
  const allFound = parts.every(p => discovered.has(p))

  // SVG layout: approximate positions as percentages
  const POSITIONS = {
    cell_wall:    { x: 50, y: 7  },
    nucleus:      { x: 35, y: 38 },
    chloroplast:  { x: 65, y: 28 },
    cell_membrane:{ x: 18, y: 50 },
    vacuole:      { x: 52, y: 55 },
    mitochondria: { x: 30, y: 65 },
    cytoplasm:    { x: 75, y: 65 },
    ribosomes:    { x: 72, y: 42 },
  }

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'linear-gradient(145deg, #081A0F, #0B1F12)',
        border: '1px solid rgba(56,210,122,.2)',
        borderRadius: 18, padding: '16px', marginBottom: 10,
        boxShadow: '0 0 32px rgba(56,210,122,.06)',
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em',
          textTransform: 'uppercase', color: '#38D27A', marginBottom: 10,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          🔬 {block.label || 'Plant Cell — tap to explore'}
          <span style={{ marginLeft: 'auto', color: '#4A5578', fontWeight: 500 }}>
            {discovered.size}/{parts.length} found
          </span>
        </div>

        {/* SVG diagram */}
        <div style={{ position: 'relative', width: '100%', paddingBottom: '72%' }}>
          <svg viewBox="0 0 100 72" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            {/* Cell wall outline */}
            <rect x="6" y="3" width="88" height="66" rx="8" ry="8"
              fill="rgba(245,183,0,.06)" stroke="rgba(245,183,0,.35)" strokeWidth="1.2" />
            {/* Cell membrane */}
            <rect x="8.5" y="5.5" width="83" height="61" rx="6" ry="6"
              fill="rgba(59,130,255,.04)" stroke="rgba(59,130,255,.3)" strokeWidth=".8" strokeDasharray="2 1" />
            {/* Vacuole */}
            <ellipse cx="54" cy="52" rx="22" ry="14"
              fill="rgba(52,213,255,.08)" stroke="rgba(52,213,255,.3)" strokeWidth=".8" />
            {/* Nucleus */}
            <circle cx="35" cy="36" r="10"
              fill="rgba(157,92,255,.1)" stroke="rgba(157,92,255,.4)" strokeWidth=".8" />
            {/* Chloroplasts */}
            <ellipse cx="66" cy="22" rx="7" ry="4"
              fill="rgba(56,210,122,.18)" stroke="rgba(56,210,122,.5)" strokeWidth=".8" />
            <ellipse cx="72" cy="34" rx="6" ry="3.5"
              fill="rgba(56,210,122,.18)" stroke="rgba(56,210,122,.5)" strokeWidth=".8" />
            {/* Mitochondria */}
            <ellipse cx="28" cy="60" rx="8" ry="4"
              fill="rgba(255,138,31,.1)" stroke="rgba(255,138,31,.4)" strokeWidth=".7" />
            {/* Ribosomes dots */}
            {[[70,40],[73,45],[68,47]].map(([cx,cy],i) => (
              <circle key={i} cx={cx} cy={cy} r="1.2"
                fill="rgba(255,79,195,.5)" stroke="none" />
            ))}
          </svg>

          {/* Tap hotspots */}
          {parts.map(key => {
            const pos = POSITIONS[key]
            if (!pos) return null
            const info = ORGANELLE_INFO[key]
            const isActive = active === key
            const isDone = discovered.has(key)
            return (
              <button key={key}
                onClick={() => tap(key)}
                style={{
                  position: 'absolute',
                  left: `${pos.x}%`, top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: 28, height: 28,
                  borderRadius: '50%',
                  background: isActive ? info.color : isDone ? `${info.color}22` : 'rgba(255,255,255,.1)',
                  border: `2px solid ${isActive ? info.color : isDone ? `${info.color}66` : 'rgba(255,255,255,.25)'}`,
                  cursor: 'pointer',
                  fontSize: '.7rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all .2s',
                  boxShadow: isActive ? `0 0 12px ${info.color}66` : 'none',
                  zIndex: 2,
                }}>
                {isDone ? info.icon : '+'}
              </button>
            )
          })}
        </div>

        {/* Info panel */}
        {info ? (
          <div className="fade-up" style={{
            background: `${info.color}10`,
            border: `1px solid ${info.color}33`,
            borderRadius: 14, padding: '14px 16px', marginTop: 10,
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '1rem',
              color: info.color, marginBottom: 6,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {info.icon} {info.title}
            </div>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '.88rem', color: '#C8D0E8',
              margin: '0 0 6px', lineHeight: 1.55,
            }}>{info.job}</p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '.75rem', color: info.color,
              margin: 0, opacity: .8,
            }}>🏭 {info.analogy}</p>
          </div>
        ) : (
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.78rem', color: '#4A5578',
            textAlign: 'center', margin: '10px 0 0',
          }}>
            {allFound ? '✓ All parts explored!' : 'Tap the + buttons to explore each part'}
          </p>
        )}
      </div>
    </div>
  )
}

// ─── MisconceptionBlock ────────────────────────────────────────────────────────
function MisconceptionBlock({ block }) {
  const [revealed, setRevealed] = useState(new Set())
  function reveal(i) { setRevealed(s => { const n = new Set(s); n.add(i); return n }) }
  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em',
        textTransform: 'uppercase', color: '#FF5D73', marginBottom: 10,
      }}>⚠️ {block.label || 'Common Mistakes — tap to reveal why'}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {block.mistakes.map((m, i) => (
          <div key={i} style={{
            background: '#10182B',
            border: `1px solid ${revealed.has(i) ? 'rgba(77,255,136,.25)' : 'rgba(255,93,115,.2)'}`,
            borderRadius: 14, padding: '14px 16px',
            transition: 'border-color .2s',
          }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: revealed.has(i) ? 10 : 0 }}>
              <span style={{ color: '#FF5D73', fontSize: '1rem', flexShrink: 0 }}>✗</span>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '.88rem', color: '#C8D0E8',
                textDecoration: revealed.has(i) ? 'line-through' : 'none',
                opacity: revealed.has(i) ? .5 : 1,
              }}>{m.wrong}</div>
            </div>
            {!revealed.has(i) ? (
              <button onClick={() => reveal(i)} style={{
                marginLeft: 22,
                background: 'rgba(255,93,115,.1)', border: '1px solid rgba(255,93,115,.25)',
                borderRadius: 8, padding: '5px 12px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '.75rem', fontWeight: 600, color: '#FF5D73',
                cursor: 'pointer',
              }}>Why does this lose marks?</button>
            ) : (
              <div className="fade-up" style={{ marginLeft: 22 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <span style={{ color: '#4DFF88', flexShrink: 0 }}>✓</span>
                  <div style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '.88rem', color: '#4DFF88', fontWeight: 600,
                  }}>{m.right}</div>
                </div>
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '.78rem', color: '#9CA8C7', lineHeight: 1.5,
                }}>{m.reason}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── ScarfBlock — SCARF memory acronym ────────────────────────────────────────
function ScarfBlock({ block }) {
  const [open, setOpen] = useState(null)
  const items = block.items || []
  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'linear-gradient(145deg, #0E1A0E, #0A1508)',
        border: '1px solid rgba(56,210,122,.2)',
        borderRadius: 18, padding: '16px',
        boxShadow: '0 0 24px rgba(56,210,122,.05)',
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em',
          textTransform: 'uppercase', color: '#38D27A', marginBottom: 12,
        }}>🧣 {block.label || 'SCARF — uses of glucose'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {items.map((item, i) => (
            <button key={i} onClick={() => setOpen(open === i ? null : i)}
              style={{
                background: open === i ? 'rgba(56,210,122,.08)' : 'rgba(255,255,255,.02)',
                border: `1px solid ${open === i ? 'rgba(56,210,122,.3)' : '#2A3552'}`,
                borderRadius: 12, padding: '12px 14px',
                cursor: 'pointer', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 12,
                transition: 'all .2s',
              }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: 'rgba(56,210,122,.12)',
                border: '1px solid rgba(56,210,122,.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900, fontSize: '1.2rem', color: '#38D27A',
              }}>{item.letter}</div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: '.9rem', color: '#F5F7FB',
                }}>{item.word}</div>
                {open === i && (
                  <div className="fade-up" style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '.82rem', color: '#9CA8C7',
                    marginTop: 4, lineHeight: 1.5,
                  }}>{item.detail}</div>
                )}
              </div>
              <span style={{ color: open === i ? '#38D27A' : '#2A3552', fontSize: '1rem' }}>
                {open === i ? '▲' : '▼'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── BuilderBlock — equation/concept builder ──────────────────────────────────
function BuilderBlock({ block }) {
  const [slots, setSlots] = useState(block.slots.map(() => null))
  const [submitted, setSubmitted] = useState(false)
  const [available, setAvailable] = useState([...block.pieces])

  function place(slotIdx, piece) {
    const current = slots[slotIdx]
    const newSlots = [...slots]
    newSlots[slotIdx] = piece
    setSlots(newSlots)
    const newAvail = available.filter(p => p !== piece)
    if (current) newAvail.push(current)
    setAvailable(newAvail)
  }
  function remove(slotIdx) {
    const piece = slots[slotIdx]
    if (!piece) return
    const newSlots = [...slots]
    newSlots[slotIdx] = null
    setSlots(newSlots)
    setAvailable([...available, piece])
  }

  const isCorrect = slots.every((s, i) => s === block.answer[i])
  const allFilled = slots.every(s => s !== null)

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'linear-gradient(145deg, #0A1520, #0D1A28)',
        border: '1px solid rgba(56,210,122,.2)',
        borderRadius: 18, padding: '16px',
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em',
          textTransform: 'uppercase', color: '#38D27A', marginBottom: 12,
        }}>🧪 {block.label || 'Build the equation'}</div>

        {/* Equation row */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          gap: 8, marginBottom: 16, justifyContent: 'center',
        }}>
          {slots.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                onClick={() => s && remove(i)}
                style={{
                  minWidth: 80, height: 44,
                  background: s
                    ? (submitted && !isCorrect ? 'rgba(255,93,115,.12)' : submitted && isCorrect ? 'rgba(77,255,136,.12)' : 'rgba(56,210,122,.1)')
                    : 'rgba(255,255,255,.03)',
                  border: `1.5px dashed ${s
                    ? (submitted && !isCorrect ? '#FF5D73' : submitted && isCorrect ? '#4DFF88' : '#38D27A')
                    : '#2A3552'}`,
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: s ? 'pointer' : 'default',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: '.85rem',
                  color: s ? '#F5F7FB' : '#4A5578',
                  transition: 'all .2s', padding: '0 8px',
                }}>
                {s || '?'}
              </div>
              {i < slots.length - 1 && (
                <span style={{ color: '#38D27A', fontWeight: 700, fontSize: '1rem' }}>
                  {block.operators?.[i] || '+'}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Available pieces */}
        {!submitted && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 14 }}>
            {available.map(piece => (
              <button key={piece}
                onClick={() => {
                  const emptyIdx = slots.findIndex(s => s === null)
                  if (emptyIdx >= 0) place(emptyIdx, piece)
                }}
                style={{
                  background: 'rgba(56,210,122,.1)',
                  border: '1px solid rgba(56,210,122,.3)',
                  borderRadius: 10, padding: '8px 14px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600, fontSize: '.85rem', color: '#6BFFB0',
                  cursor: 'pointer', transition: 'all .15s',
                }}>
                {piece}
              </button>
            ))}
          </div>
        )}

        {allFilled && !submitted && (
          <button onClick={() => setSubmitted(true)} style={{
            width: '100%',
            background: 'linear-gradient(135deg, #38D27A, #6BFFB0)',
            border: 'none', borderRadius: 12, padding: '12px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: '.9rem', color: '#000',
            cursor: 'pointer',
          }}>Check →</button>
        )}

        {submitted && (
          <div className="fade-up">
            {isCorrect ? (
              <div style={{
                background: 'rgba(77,255,136,.08)', border: '1px solid rgba(77,255,136,.3)',
                borderRadius: 12, padding: '14px', textAlign: 'center',
              }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#4DFF88', marginBottom: 4 }}>✓ Correct!</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.85rem', color: '#C8D0E8', margin: 0 }}>{block.successText}</p>
              </div>
            ) : (
              <div style={{
                background: 'rgba(255,93,115,.08)', border: '1px solid rgba(255,93,115,.3)',
                borderRadius: 12, padding: '14px',
              }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#FF5D73', marginBottom: 6 }}>Not quite — try again</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.83rem', color: '#C8D0E8', margin: '0 0 10px' }}>
                  Hint: {block.hint}
                </p>
                <button onClick={() => { setSubmitted(false); setSlots(block.slots.map(() => null)); setAvailable([...block.pieces]) }} style={{
                  background: 'rgba(255,93,115,.12)', border: '1px solid rgba(255,93,115,.3)',
                  borderRadius: 9, padding: '8px 16px',
                  fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '.82rem',
                  color: '#FF5D73', cursor: 'pointer',
                }}>Try again</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── ScenarioBlock — decision game ────────────────────────────────────────────
function ScenarioBlock({ block }) {
  const [current, setCurrent] = useState(0)
  const [answered, setAnswered] = useState([])
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const scenario = block.scenarios[current]

  function choose(optIdx) {
    const correct = optIdx === scenario.correctIndex
    if (correct) setScore(s => s + 1)
    setAnswered([...answered, { correct, chosen: optIdx }])
    setTimeout(() => {
      if (current + 1 < block.scenarios.length) setCurrent(c => c + 1)
      else setDone(true)
    }, 1000)
  }

  if (done) return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'rgba(77,255,136,.07)', border: '1px solid rgba(77,255,136,.25)',
        borderRadius: 16, padding: '16px', textAlign: 'center',
      }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#4DFF88', marginBottom: 6 }}>
          {score}/{block.scenarios.length} — {score === block.scenarios.length ? 'Perfect! 🎉' : 'Good effort!'}
        </div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.85rem', color: '#9CA8C7', margin: 0 }}>
          {block.completionText || 'Scenarios complete.'}
        </p>
      </div>
    </div>
  )

  const lastAnswer = answered[answered.length - 1]
  const justAnswered = lastAnswer && answered.length === current

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'linear-gradient(145deg, #0A1520, #0D1A28)',
        border: '1px solid rgba(56,210,122,.2)',
        borderRadius: 18, padding: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#38D27A' }}>
            🌱 {block.label || 'Glucose Decision'}
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '.72rem', color: '#4A5578' }}>
            {current + 1}/{block.scenarios.length}
          </div>
        </div>

        <div style={{
          background: '#10182B', border: '1px solid #2A3552',
          borderRadius: 12, padding: '14px', marginBottom: 12,
        }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '.95rem', color: '#F5F7FB', margin: 0 }}>
            {scenario.situation}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {scenario.options.map((opt, i) => (
            <button key={i}
              onClick={() => !justAnswered && choose(i)}
              style={{
                background: justAnswered
                  ? i === scenario.correctIndex ? 'rgba(77,255,136,.12)' : answered[answered.length-1]?.chosen === i ? 'rgba(255,93,115,.1)' : '#10182B'
                  : '#10182B',
                border: `1.5px solid ${justAnswered
                  ? i === scenario.correctIndex ? 'rgba(77,255,136,.4)' : answered[answered.length-1]?.chosen === i ? 'rgba(255,93,115,.35)' : '#2A3552'
                  : '#2A3552'}`,
                borderRadius: 12, padding: '12px 10px',
                cursor: justAnswered ? 'default' : 'pointer',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600, fontSize: '.82rem',
                color: justAnswered
                  ? i === scenario.correctIndex ? '#4DFF88' : answered[answered.length-1]?.chosen === i ? '#FF5D73' : '#5A6480'
                  : '#C8D0E8',
                textAlign: 'center', transition: 'all .2s',
              }}>
              {opt}
            </button>
          ))}
        </div>

        {justAnswered && (
          <div className="fade-up" style={{
            marginTop: 10,
            fontFamily: "'Inter', sans-serif",
            fontSize: '.8rem', color: '#9CA8C7', lineHeight: 1.5,
          }}>
            {lastAnswer.correct ? `✓ Correct — ${scenario.explanation}` : `✗ ${scenario.explanation}`}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── NumberLineBlock ──────────────────────────────────────────────────────────
function NumberLineBlock({ block }) {
  const [position, setPosition] = useState(block.startAt ?? 0)
  const [result, setResult] = useState(null)
  const [hintIdx, setHintIdx] = useState(-1)
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [quizChoice, setQuizChoice] = useState(null)
  const [quizShake, setQuizShake] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)

  const MIN = -10, MAX = 10
  const pct = (pos) => ((pos - MIN) / (MAX - MIN)) * 100

  function applyOp(op) {
    const newPos = Math.max(MIN, Math.min(MAX, position + op.delta))
    const label = op.delta >= 0
      ? `${position} + ${op.delta} = ${newPos}`
      : `${position} − ${Math.abs(op.delta)} = ${newPos}`
    setPosition(newPos)
    setResult(label)
    setTimeout(() => setShowQuiz(true), 600)
  }

  function reset() {
    setPosition(block.startAt ?? 0)
    setResult(null)
    setShowQuiz(false)
    setQuizAnswered(false)
    setQuizChoice(null)
    setHintIdx(-1)
  }

  function pickQuiz(i) {
    if (quizAnswered) return
    setQuizChoice(i)
    if (i === block.quiz?.correct) {
      setQuizAnswered(true)
    } else {
      setQuizShake(i)
      setTimeout(() => setQuizShake(null), 500)
    }
  }

  const ticks = []
  for (let t = MIN; t <= MAX; t++) ticks.push(t)

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'linear-gradient(145deg, #0A1020, #0D1428)',
        border: '1px solid rgba(75,144,255,.2)',
        borderRadius: 18, padding: '16px',
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em',
          textTransform: 'uppercase', color: '#4B90FF', marginBottom: 14,
        }}>📏 Number Line</div>

        {/* SVG Number Line */}
        <div style={{ position: 'relative', width: '100%', margin: '0 0 12px' }}>
          <svg viewBox="0 0 320 60" style={{ width: '100%', display: 'block', overflow: 'visible' }}>
            {/* Line */}
            <line x1="16" y1="38" x2="304" y2="38" stroke="#2A3A5A" strokeWidth="2" strokeLinecap="round" />
            {/* Ticks + labels */}
            {ticks.map(t => {
              const x = 16 + ((t - MIN) / (MAX - MIN)) * 288
              const isMajor = t % 5 === 0
              return (
                <g key={t}>
                  <line x1={x} y1={isMajor ? 28 : 32} x2={x} y2={44} stroke={isMajor ? '#4A6090' : '#2A3A5A'} strokeWidth={isMajor ? 1.5 : 1} />
                  {isMajor && (
                    <text x={x} y={54} textAnchor="middle" fill="#4A6090" fontSize="8" fontFamily="monospace">{t}</text>
                  )}
                </g>
              )
            })}
            {/* Animated marker — uses transform so CSS transition works */}
            <g style={{ transition: 'transform .5s ease' }}
               transform={`translate(${16 + ((position - MIN) / (MAX - MIN)) * 288}, 0)`}>
              <circle cx={0} cy={38} r={8}
                fill="#F5B700" stroke="#FFD940" strokeWidth="2"
                style={{ filter: 'drop-shadow(0 0 6px #F5B70088)' }}
              />
              <text x={0} y={42} textAnchor="middle"
                fill="#0A0A0A" fontSize="7" fontWeight="bold"
                style={{ pointerEvents: 'none' }}
              >{position}</text>
            </g>
          </svg>
        </div>

        {/* Result card */}
        {result && (
          <div className="fade-up" style={{
            background: 'rgba(245,183,0,.08)', border: '1px solid rgba(245,183,0,.3)',
            borderRadius: 12, padding: '10px 14px', marginBottom: 12, textAlign: 'center',
          }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '1rem', color: '#F5B700',
            }}>{result}</span>
          </div>
        )}

        {/* Operation buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
          {block.operations?.map((op, i) => (
            <button key={i} onClick={() => applyOp(op)} style={{
              background: 'rgba(75,144,255,.12)', border: '1px solid rgba(75,144,255,.3)',
              borderRadius: 10, padding: '8px 14px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600, fontSize: '.85rem', color: '#70A8FF',
              cursor: 'pointer',
            }}>{op.label}</button>
          ))}
          <button onClick={reset} style={{
            background: 'rgba(255,255,255,.04)', border: '1px solid #2A3A5A',
            borderRadius: 10, padding: '8px 14px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600, fontSize: '.85rem', color: '#5A6480',
            cursor: 'pointer',
          }}>Reset</button>
        </div>

        {/* Hint toggle */}
        {block.hints?.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <button onClick={() => setHintIdx(h => Math.min(h + 1, block.hints.length - 1))}
              style={{
                background: 'rgba(255,200,87,.06)', border: '1px solid rgba(255,200,87,.2)',
                borderRadius: 8, padding: '6px 12px',
                fontFamily: "'Inter', sans-serif", fontSize: '.75rem', fontWeight: 600,
                color: '#FFC857', cursor: 'pointer',
              }}>💡 Need a Hint? ›</button>
            {hintIdx >= 0 && (
              <div className="fade-up" style={{
                marginTop: 6, padding: '8px 12px',
                background: 'rgba(255,200,87,.05)', border: '1px solid rgba(255,200,87,.15)',
                borderRadius: 8,
              }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.82rem', color: '#C8B870', margin: 0 }}>
                  {block.hints[hintIdx]}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Quiz */}
        {showQuiz && block.quiz && (
          <div className="fade-up" style={{
            background: '#0A1020', border: '1px solid rgba(75,144,255,.2)',
            borderRadius: 14, padding: '14px',
          }}>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600, fontSize: '.93rem', color: '#E0E6F0', margin: '0 0 10px',
            }}>{block.quiz.q}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {block.quiz.options?.map((opt, i) => {
                const isCorrect = i === block.quiz.correct
                const isPicked = quizChoice === i
                let bg = '#10182B', border = '#2A3A5A', color = '#C8D0E8'
                if (quizAnswered) {
                  if (isCorrect) { bg = 'rgba(77,255,136,.08)'; border = 'rgba(77,255,136,.4)'; color = '#4DFF88' }
                  else if (isPicked) { bg = 'rgba(255,93,115,.08)'; border = 'rgba(255,93,115,.35)'; color = '#FF5D73' }
                }
                return (
                  <button key={i} onClick={() => pickQuiz(i)} disabled={quizAnswered}
                    style={{
                      background: bg, border: '1.5px solid ' + border,
                      borderRadius: 10, padding: '10px 14px',
                      fontFamily: "'Inter', sans-serif", fontSize: '.87rem', color,
                      cursor: quizAnswered ? 'default' : 'pointer',
                      textAlign: 'left', transition: 'all .2s',
                      animation: quizShake === i ? 'shake .35s ease' : 'none',
                    }}>{opt}</button>
                )
              })}
            </div>
            {quizAnswered && (
              <div className="fade-up" style={{
                marginTop: 10, padding: '10px 12px',
                background: 'rgba(77,255,136,.06)', border: '1px solid rgba(77,255,136,.25)',
                borderRadius: 10,
              }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.84rem', color: '#6BFFB0', margin: 0 }}>
                  ✓ {block.quiz.explanation}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── FillBlanksBlock ──────────────────────────────────────────────────────────
// Tap a chip to select it, tap a slot to place it. Check answer button validates all.
// Supports both word blanks { before, answer, after } and equation parts arrays.
function FillBlanksBlock({ block, isWarm, isBio, isMaths, isSoc }) {
  const accent = isWarm ? '#C47828' : isBio ? '#38D27A' : isMaths ? '#4B90FF' : isSoc ? '#D96030' : '#9D5CFF'
  const cardBg  = isWarm ? '#130C04' : isBio ? '#071410' : isMaths ? '#07101E' : isSoc ? '#180E06' : '#0D1424'
  const pageBg  = isWarm ? '#1A1007' : isBio ? '#0A1A12' : isMaths ? '#0A1428' : isSoc ? '#1E1008' : '#111828'
  const textCol = isWarm ? '#D4C4A0' : isBio ? '#A8D8B8' : isSoc ? '#D4B898' : '#C8D0E8'

  const sentences = block.sentences || []
  const wordBank  = block.wordBank  || []

  // slots[i] = word string placed in sentence i, or null
  const [slots,    setSlots]    = useState(Array(sentences.length).fill(null))
  const [selected, setSelected] = useState(null) // word string currently held
  const [statuses, setStatuses] = useState(Array(sentences.length).fill('idle')) // idle|correct|wrong
  const [checked,  setChecked]  = useState(false)
  const [done,     setDone]     = useState(false)
  const [shakeSet, setShakeSet] = useState(new Set())

  // Chips still in the bank = wordBank minus those placed in a slot
  const bankVisible = wordBank.filter(w => !slots.includes(w))

  function tapChip(w) {
    if (selected === w) { setSelected(null); return }
    setSelected(w)
  }

  function tapSlot(i) {
    if (statuses[i] === 'correct') return
    if (selected !== null) {
      const next = [...slots]
      // If this word already sits in another slot, vacate it first
      const prev = next.indexOf(selected)
      if (prev !== -1) next[prev] = null
      // If slot already has a word, it goes back to bank (just null it)
      next[i] = selected
      setSlots(next)
      setSelected(null)
      const st = [...statuses]; st[i] = 'idle'; setStatuses(st)
    } else if (slots[i] !== null) {
      // Pick up word from a filled slot
      setSelected(slots[i])
      const next = [...slots]; next[i] = null; setSlots(next)
      const st = [...statuses]; st[i] = 'idle'; setStatuses(st)
    }
  }

  function checkAnswers() {
    const newSt = slots.map((w, i) =>
      w === null ? 'idle' : w.toLowerCase() === sentences[i].answer.toLowerCase() ? 'correct' : 'wrong'
    )
    setStatuses(newSt)
    setChecked(true)
    const wrong = new Set(newSt.map((s, i) => s === 'wrong' ? i : -1).filter(x => x >= 0))
    if (wrong.size > 0) {
      setShakeSet(wrong)
      setTimeout(() => {
        setShakeSet(new Set())
        setSlots(prev => prev.map((w, i) => newSt[i] === 'wrong' ? null : w))
        setStatuses(prev => prev.map(s => s === 'wrong' ? 'idle' : s))
      }, 700)
    }
    if (newSt.every(s => s === 'correct')) setDone(true)
  }

  const allFilled = slots.every(s => s !== null)

  return (
    <div style={{ margin: '14px 0' }}>
      {/* Outer card */}
      <div style={{
        background: cardBg,
        border: `1px solid ${accent}28`,
        borderRadius: 20, overflow: 'hidden',
      }}>

        {/* Header row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px 10px',
          borderBottom: `1px solid ${accent}18`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1rem' }}>✏️</span>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '.7rem', fontWeight: 800, letterSpacing: '.1em',
              textTransform: 'uppercase', color: accent,
            }}>Fill the Gaps</span>
          </div>
          {selected && (
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '.72rem', color: accent + 'BB',
            }}>tap a gap to place "{selected}"</span>
          )}
        </div>

        {/* Sentences area */}
        <div style={{ padding: '16px 16px 8px' }}>
          {sentences.map((s, i) => {
            const isCorrect = statuses[i] === 'correct'
            const isWrong   = statuses[i] === 'wrong'
            const hasWord   = slots[i] !== null
            const isShaking = shakeSet.has(i)

            let slotBorder = `1.5px dashed ${accent}35`
            if (isCorrect) slotBorder = `1.5px solid rgba(77,255,136,.6)`
            else if (selected && !isCorrect) slotBorder = `1.5px solid ${accent}80`
            else if (hasWord) slotBorder = `1.5px solid ${accent}50`

            let slotBg = `${accent}0A`
            if (isCorrect) slotBg = 'rgba(77,255,136,.1)'
            else if (hasWord) slotBg = `${accent}18`

            return (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{
                  display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6,
                  lineHeight: 1.8,
                }}>
                  {s.before && (
                    <span style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '.95rem', color: textCol,
                    }}>{s.before}</span>
                  )}

                  {/* The blank slot */}
                  <div
                    onClick={() => tapSlot(i)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      minWidth: 72, height: 36, borderRadius: 10,
                      border: slotBorder, background: slotBg,
                      cursor: isCorrect ? 'default' : 'pointer',
                      padding: '0 10px',
                      transition: 'all .2s',
                      animation: isShaking ? 'shake .5s ease' : 'none',
                    }}
                  >
                    {isCorrect ? (
                      <span style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700, fontSize: '.9rem',
                        color: '#4DFF88',
                      }}>✓ {slots[i]}</span>
                    ) : hasWord ? (
                      <span style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700, fontSize: '.9rem',
                        color: accent,
                      }}>{slots[i]}</span>
                    ) : (
                      <span style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700, fontSize: '1rem',
                        color: `${accent}50`,
                      }}>?</span>
                    )}
                  </div>

                  {s.after && (
                    <span style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '.95rem', color: textCol,
                    }}>{s.after}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Word bank */}
        <div style={{
          margin: '4px 16px 16px',
          background: pageBg,
          border: `1px solid ${accent}18`,
          borderRadius: 14, padding: '12px',
        }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.62rem', fontWeight: 700, letterSpacing: '.1em',
            textTransform: 'uppercase', color: `${accent}80`,
            marginBottom: 10,
          }}>Word Bank</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {wordBank.map(w => {
              const placed   = slots.includes(w)
              const isSelected = selected === w
              return (
                <button
                  key={w}
                  onClick={() => !placed && tapChip(w)}
                  disabled={placed}
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700, fontSize: '.88rem',
                    padding: '8px 14px', borderRadius: 10,
                    border: isSelected
                      ? `2px solid ${accent}`
                      : placed
                        ? `1.5px solid ${accent}15`
                        : `1.5px solid ${accent}35`,
                    background: isSelected
                      ? `${accent}25`
                      : placed
                        ? `${accent}06`
                        : `${accent}10`,
                    color: placed ? `${accent}30` : isSelected ? accent : `${accent}CC`,
                    cursor: placed ? 'default' : 'pointer',
                    transition: 'all .15s',
                    transform: isSelected ? 'scale(1.06)' : 'scale(1)',
                    boxShadow: isSelected ? `0 2px 12px ${accent}40` : 'none',
                    textDecoration: placed ? 'line-through' : 'none',
                  }}
                >{w}</button>
              )
            })}
          </div>
        </div>

        {/* Check answer / done state */}
        {done ? (
          <div style={{
            margin: '0 16px 16px',
            background: 'rgba(77,255,136,.08)', border: '1px solid rgba(77,255,136,.3)',
            borderRadius: 14, padding: '14px 16px', textAlign: 'center',
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: '1rem', color: '#4DFF88', marginBottom: 4,
            }}>All answers correct ✓</div>
            {block.correctMsg && (
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.85rem', color: '#9CA8C7', margin: 0 }}>
                {block.correctMsg}
              </p>
            )}
          </div>
        ) : (
          <div style={{ padding: '0 16px 16px' }}>
            <button
              onClick={checkAnswers}
              disabled={!allFilled}
              style={{
                width: '100%', padding: '14px',
                background: allFilled ? accent : `${accent}30`,
                border: 'none', borderRadius: 14,
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800, fontSize: '.95rem',
                color: allFilled ? '#000' : `${accent}60`,
                cursor: allFilled ? 'pointer' : 'default',
                transition: 'all .2s',
                boxShadow: allFilled ? `0 4px 20px ${accent}50` : 'none',
              }}
            >Check answer ✓</button>
            {checked && !done && (
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '.8rem', color: '#FF8DA1',
                textAlign: 'center', margin: '10px 0 0',
              }}>Wrong answers returned — try again.</p>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
      `}</style>
    </div>
  )
}

// ─── BidmasBlock ──────────────────────────────────────────────────────────────
function BidmasBlock({ block }) {
  const [selected, setSelected] = useState(null)
  const [stepIdx, setStepIdx] = useState(0)
  const [done, setDone] = useState(false)
  const [shakeIdx, setShakeIdx] = useState(null)
  const [currentExpr, setCurrentExpr] = useState(block.expression)
  const [stepping, setStepping] = useState(false)

  function choose(i) {
    if (selected !== null) return
    setSelected(i)
    if (i === block.correct) {
      setStepping(true)
      // Step through with delays
      let s = 0
      const steps = block.steps || []
      function nextStep() {
        if (s < steps.length) {
          setStepIdx(s)
          setCurrentExpr(steps[s].newExpr)
          s++
          if (s < steps.length) {
            setTimeout(nextStep, 1100)
          } else {
            setTimeout(() => setDone(true), 1100)
          }
        }
      }
      setTimeout(nextStep, 600)
    } else {
      setShakeIdx(i)
      setTimeout(() => {
        setShakeIdx(null)
        setSelected(null)
      }, 500)
    }
  }

  const steps = block.steps || []

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'linear-gradient(145deg, #0A1020, #0D1428)',
        border: '1px solid rgba(75,144,255,.2)',
        borderRadius: 18, padding: '16px',
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em',
          textTransform: 'uppercase', color: '#4B90FF', marginBottom: 14,
        }}>🔢 BIDMAS</div>

        {/* Expression display */}
        <div style={{
          background: '#070E1C', border: '1px solid #1E2A40',
          borderRadius: 14, padding: '18px', textAlign: 'center', marginBottom: 14,
        }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800, fontSize: 'clamp(1.4rem, 5vw, 2rem)',
            color: '#F5F7FB', letterSpacing: '.03em',
            transition: 'all .4s ease',
          }}>{currentExpr}</div>
        </div>

        {/* Question + options — shown until correct selection */}
        {selected === null && (
          <>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600, fontSize: '.95rem', color: '#E0E6F0',
              margin: '0 0 12px',
            }}>{block.question}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {block.options?.map((opt, i) => (
                <button key={i} onClick={() => choose(i)}
                  style={{
                    background: '#10182B', border: '1.5px solid #2A3A5A',
                    borderRadius: 12, padding: '12px 16px',
                    fontFamily: "'Inter', sans-serif", fontSize: '.9rem', color: '#C8D0E8',
                    cursor: 'pointer', textAlign: 'left', transition: 'all .2s',
                    animation: shakeIdx === i ? 'shake .35s ease' : 'none',
                  }}>{opt}</button>
              ))}
            </div>
            {shakeIdx !== null && (
              <div className="fade-up" style={{
                marginTop: 10, padding: '9px 12px',
                background: 'rgba(255,93,115,.07)', border: '1px solid rgba(255,93,115,.25)',
                borderRadius: 10,
              }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.84rem', color: '#FF8DA1', margin: 0 }}>
                  Try again — which operation has priority?
                </p>
              </div>
            )}
          </>
        )}

        {/* Step-through */}
        {stepping && steps.length > 0 && (
          <div className="fade-up" style={{ marginTop: 14 }}>
            {steps.slice(0, stepIdx + 1).map((step, i) => (
              <div key={i} className="fade-up" style={{
                background: 'rgba(75,144,255,.07)', border: '1px solid rgba(75,144,255,.2)',
                borderRadius: 10, padding: '10px 14px', marginBottom: 8,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, color: '#70A8FF', fontSize: '.9rem',
                }}>{step.highlight}</span>
                <span style={{ color: '#5A6480' }}>→</span>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, color: '#4DFF88', fontSize: '.9rem',
                }}>{step.becomes}</span>
              </div>
            ))}
          </div>
        )}

        {/* Done: side-by-side paths + exam tip */}
        {done && (
          <div className="fade-up">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
              <div style={{
                background: 'rgba(255,93,115,.07)', border: '1px solid rgba(255,93,115,.25)',
                borderRadius: 12, padding: '12px',
              }}>
                <div style={{
                  fontFamily: "'Inter', sans-serif", fontSize: '.63rem', fontWeight: 700,
                  color: '#FF5D73', marginBottom: 8, letterSpacing: '.1em', textTransform: 'uppercase',
                }}>Wrong Path</div>
                {block.wrongPath?.map((line, i) => (
                  <p key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: '.8rem', color: '#C8D0E8', margin: '0 0 4px' }}>{line}</p>
                ))}
              </div>
              <div style={{
                background: 'rgba(77,255,136,.07)', border: '1px solid rgba(77,255,136,.25)',
                borderRadius: 12, padding: '12px',
              }}>
                <div style={{
                  fontFamily: "'Inter', sans-serif", fontSize: '.63rem', fontWeight: 700,
                  color: '#4DFF88', marginBottom: 8, letterSpacing: '.1em', textTransform: 'uppercase',
                }}>Correct Path</div>
                {block.correctPath?.map((line, i) => (
                  <p key={i} style={{ fontFamily: "'Inter', sans-serif", fontSize: '.8rem', color: '#C8D0E8', margin: '0 0 4px' }}>{line}</p>
                ))}
              </div>
            </div>
            {block.examTip && (
              <div style={{
                background: 'rgba(245,183,0,.06)', border: '1px dashed rgba(245,183,0,.3)',
                borderRadius: 12, padding: '12px 14px',
              }}>
                <div style={{
                  fontFamily: "'Inter', sans-serif", fontSize: '.63rem', fontWeight: 700,
                  color: '#F5B700', marginBottom: 6, letterSpacing: '.1em', textTransform: 'uppercase',
                }}>🗡️ Exam Tip</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.86rem', color: '#C8D0E8', margin: 0 }}>{block.examTip}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── TieredQuizBlock ──────────────────────────────────────────────────────────
function TieredQuizBlock({ block }) {
  const tiers = block.tiers || []
  const [activeTier, setActiveTier] = useState(0)
  const [qIdx, setQIdx] = useState(Array(tiers.length).fill(0))
  const [answers, setAnswers] = useState(tiers.map(t => Array(t.questions.length).fill(null)))
  const [hintShown, setHintShown] = useState(tiers.map(t => Array(t.questions.length).fill(false)))
  const [shakeOpt, setShakeOpt] = useState(null)

  const tier = tiers[activeTier]
  const curQ = tier?.questions[qIdx[activeTier]]
  const curAnswer = answers[activeTier][qIdx[activeTier]]
  const isAnswered = curAnswer !== null
  const wasCorrect = isAnswered && curAnswer === curQ?.correct

  function pickAnswer(i) {
    if (isAnswered) return
    const newAnswers = answers.map(r => [...r])
    newAnswers[activeTier][qIdx[activeTier]] = i
    setAnswers(newAnswers)
    if (i !== curQ?.correct) {
      setShakeOpt(i)
      setTimeout(() => setShakeOpt(null), 500)
    }
  }

  function nextQ() {
    const max = tier.questions.length - 1
    if (qIdx[activeTier] < max) {
      const nq = [...qIdx]; nq[activeTier]++; setQIdx(nq)
    }
  }

  function toggleHint() {
    const nh = hintShown.map(r => [...r])
    nh[activeTier][qIdx[activeTier]] = true
    setHintShown(nh)
  }

  const isBoss = activeTier === tiers.length - 1
  const tierDone = qIdx[activeTier] >= (tier?.questions.length || 1) - 1 && isAnswered

  return (
    <div style={{ margin: '14px 0' }}>
      {/* Tier tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {tiers.map((t, i) => (
          <button key={i} onClick={() => setActiveTier(i)} style={{
            flex: 1,
            background: activeTier === i
              ? (i === 2 ? 'rgba(255,93,115,.18)' : i === 1 ? 'rgba(255,200,87,.15)' : 'rgba(77,255,136,.15)')
              : '#10182B',
            border: `1.5px solid ${activeTier === i
              ? (i === 2 ? 'rgba(255,93,115,.5)' : i === 1 ? 'rgba(255,200,87,.45)' : 'rgba(77,255,136,.45)')
              : '#2A3552'}`,
            borderRadius: 12, padding: '9px 8px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: '.78rem',
            color: activeTier === i
              ? (i === 2 ? '#FF5D73' : i === 1 ? '#FFC857' : '#4DFF88')
              : '#4A5578',
            cursor: 'pointer', transition: 'all .2s',
            boxShadow: activeTier === i && i === 2 ? '0 0 16px rgba(255,93,115,.25)' : 'none',
          }}>{t.emoji} {t.label}</button>
        ))}
      </div>

      {/* Boss mode header */}
      {isBoss && (
        <div style={{
          background: 'rgba(255,93,115,.06)', border: '1px solid rgba(255,93,115,.25)',
          borderRadius: 12, padding: '10px 14px', marginBottom: 12,
          boxShadow: '0 0 20px rgba(255,93,115,.08)',
        }}>
          <div style={{
            fontFamily: "'Inter', sans-serif", fontSize: '.63rem', fontWeight: 700,
            letterSpacing: '.14em', textTransform: 'uppercase', color: '#FF5D73',
          }}>🔴 Exam Assassin — Boss Mode</div>
        </div>
      )}

      {/* Question card */}
      {curQ && (
        <div style={{
          background: isBoss
            ? 'linear-gradient(145deg, #1A0808, #120505)'
            : 'linear-gradient(145deg, #0E1428, #0A1020)',
          border: `1.5px solid ${isBoss ? 'rgba(255,93,115,.4)' : 'rgba(75,144,255,.2)'}`,
          borderRadius: 16, padding: '16px',
          boxShadow: isBoss ? '0 0 24px rgba(255,93,115,.1)' : 'none',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{
              fontFamily: "'Inter', sans-serif", fontSize: '.63rem', fontWeight: 700,
              color: isBoss ? '#FF5D73' : '#4B90FF',
              letterSpacing: '.1em', textTransform: 'uppercase',
            }}>{tier.emoji} {tier.label} · Q{qIdx[activeTier] + 1}/{tier.questions.length}</div>
          </div>

          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600, fontSize: '.95rem', color: '#F5F7FB',
            margin: '0 0 12px', lineHeight: 1.45,
          }}>{curQ.q}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {curQ.options?.map((opt, i) => {
              const isCorrectOpt = i === curQ.correct
              const isPicked = curAnswer === i
              let bg = '#10182B', border = '#2A3A5A', color = '#C8D0E8'
              if (isAnswered) {
                if (isCorrectOpt) { bg = 'rgba(77,255,136,.08)'; border = 'rgba(77,255,136,.4)'; color = '#4DFF88' }
                else if (isPicked) { bg = 'rgba(255,93,115,.08)'; border = 'rgba(255,93,115,.35)'; color = '#FF5D73' }
              }
              return (
                <button key={i} onClick={() => pickAnswer(i)} disabled={isAnswered}
                  style={{
                    background: bg, border: '1.5px solid ' + border,
                    borderRadius: 11, padding: '11px 14px',
                    fontFamily: "'Inter', sans-serif", fontSize: '.88rem', color,
                    cursor: isAnswered ? 'default' : 'pointer',
                    textAlign: 'left', transition: 'all .2s',
                    animation: shakeOpt === i ? 'shake .35s ease' : 'none',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                  <span style={{ opacity: .45, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '.78rem' }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>

          {/* Hint */}
          {!isAnswered && curQ.hint && (
            <div style={{ marginTop: 10 }}>
              <button onClick={toggleHint} style={{
                background: 'rgba(255,200,87,.06)', border: '1px solid rgba(255,200,87,.2)',
                borderRadius: 8, padding: '5px 12px',
                fontFamily: "'Inter', sans-serif", fontSize: '.75rem', fontWeight: 600,
                color: '#FFC857', cursor: 'pointer',
              }}>💡 Need a Hint? ›</button>
              {hintShown[activeTier][qIdx[activeTier]] && (
                <div className="fade-up" style={{
                  marginTop: 6, padding: '8px 11px',
                  background: 'rgba(255,200,87,.05)', border: '1px solid rgba(255,200,87,.15)',
                  borderRadius: 8,
                }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.8rem', color: '#C8B870', margin: 0 }}>{curQ.hint}</p>
                </div>
              )}
            </div>
          )}

          {/* Feedback */}
          {isAnswered && (
            <div className="fade-up" style={{
              marginTop: 10,
              background: wasCorrect ? 'rgba(77,255,136,.07)' : 'rgba(255,93,115,.07)',
              border: '1px solid ' + (wasCorrect ? 'rgba(77,255,136,.3)' : 'rgba(255,93,115,.3)'),
              borderRadius: 11, padding: '10px 14px',
            }}>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: '.87rem',
                color: wasCorrect ? '#4DFF88' : '#FF8DA1', margin: 0, lineHeight: 1.5,
              }}>
                <strong>{wasCorrect ? '✓ ' : '✗ '}</strong>
                {curQ.feedback}
              </p>
            </div>
          )}

          {isAnswered && !tierDone && (
            <button onClick={nextQ} style={{
              marginTop: 12, width: '100%',
              background: 'rgba(75,144,255,.12)', border: '1px solid rgba(75,144,255,.3)',
              borderRadius: 12, padding: '11px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '.9rem', color: '#70A8FF',
              cursor: 'pointer',
            }}>Next question →</button>
          )}

          {tierDone && (
            <div className="fade-up" style={{
              marginTop: 12,
              background: 'rgba(75,144,255,.07)', border: '1px solid rgba(75,144,255,.2)',
              borderRadius: 12, padding: '12px', textAlign: 'center',
            }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '.92rem', color: '#70A8FF',
              }}>
                {tier.label} complete ✓
              </div>
              {activeTier < tiers.length - 1 && (
                <button onClick={() => setActiveTier(a => a + 1)} style={{
                  marginTop: 8,
                  background: 'rgba(75,144,255,.15)', border: '1px solid rgba(75,144,255,.35)',
                  borderRadius: 10, padding: '8px 16px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: '.85rem', color: '#70A8FF',
                  cursor: 'pointer',
                }}>Try {tiers[activeTier + 1]?.label} →</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── TFCheckpointBlock ────────────────────────────────────────────────────────
function TFCheckpointBlock({ block }) {
  const [answered, setAnswered] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(false)

  function answer(choseTrue) {
    setAnswered(true)
    setWasCorrect(choseTrue === block.isTrue)
  }

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'linear-gradient(145deg, #0A1020, #0D1428)',
        border: '1px solid rgba(75,144,255,.2)',
        borderRadius: 18, padding: '18px',
      }}>
        {/* Label */}
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.6rem', fontWeight: 700, letterSpacing: '.22em',
          textTransform: 'uppercase', color: '#4B90FF', marginBottom: 12, textAlign: 'center',
        }}>TRUE OR FALSE?</div>

        {/* Statement */}
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700, fontSize: 'clamp(1rem, 3.5vw, 1.15rem)',
          color: '#F5F7FB', margin: '0 0 18px', lineHeight: 1.4, textAlign: 'center',
        }}>{block.statement}</p>

        {/* Buttons */}
        {!answered && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button onClick={() => answer(true)} style={{
              background: 'linear-gradient(160deg, #1C2E1E, #141E16)',
              border: '1.5px solid rgba(56,180,100,.32)',
              borderRadius: 14, padding: '14px 18px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: '1rem', letterSpacing: '.07em', color: '#72BE88',
              transition: 'all .15s',
            }}>
              <span style={{ fontSize: '.9rem' }}>✓</span> TRUE
            </button>
            <button onClick={() => answer(false)} style={{
              background: 'linear-gradient(160deg, #2E1C1C, #1E1414)',
              border: '1.5px solid rgba(200,80,80,.32)',
              borderRadius: 14, padding: '14px 18px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: '1rem', letterSpacing: '.07em', color: '#BE7272',
              transition: 'all .15s',
            }}>
              <span style={{ fontSize: '.9rem' }}>✗</span> FALSE
            </button>
          </div>
        )}

        {/* Reveal */}
        {answered && (
          <div className="fade-up">
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900, fontSize: '1.5rem',
                color: block.isTrue ? '#4DFF88' : '#FF5D73',
                textShadow: block.isTrue ? '0 0 30px rgba(77,255,136,.4)' : '0 0 30px rgba(255,93,115,.5)',
                marginBottom: 6,
              }}>{block.revealHeader}</div>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '.9rem', color: '#C8D0E8', margin: '0 0 12px', lineHeight: 1.5,
              }}>{block.revealSub}</p>
              <div style={{
                display: 'inline-block',
                background: wasCorrect ? 'rgba(77,255,136,.08)' : 'rgba(255,93,115,.08)',
                border: '1px solid ' + (wasCorrect ? 'rgba(77,255,136,.3)' : 'rgba(255,93,115,.3)'),
                borderRadius: 99, padding: '4px 14px',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '.8rem',
                color: wasCorrect ? '#4DFF88' : '#FF5D73',
              }}>{wasCorrect ? '✓ Correct' : '✗ Wrong'}</div>
            </div>

            {/* Breakdown */}
            {block.breakdown?.length > 0 && (
              <div style={{
                background: '#0A1020', border: '1px solid #1E2A40',
                borderRadius: 12, padding: '12px 14px', marginBottom: 12,
              }}>
                {block.breakdown.map((line, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: i < block.breakdown.length - 1 ? 7 : 0 }}>
                    <span style={{ color: '#4B90FF', flexShrink: 0, fontSize: '.8rem' }}>→</span>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.86rem', color: '#C8D0E8', margin: 0 }}>{line}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Calculator visual */}
            {block.wrongDisplay && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{
                  background: '#070E1C', border: '2px solid rgba(255,93,115,.4)',
                  borderRadius: 12, padding: '14px', textAlign: 'center',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    fontFamily: "'Inter', sans-serif", fontSize: '.6rem', fontWeight: 700,
                    letterSpacing: '.1em', color: '#FF5D73', marginBottom: 8, textTransform: 'uppercase',
                  }}>Calculator says</div>
                  <div style={{
                    fontFamily: 'monospace', fontSize: '1.4rem', fontWeight: 700, color: '#FF5D73',
                  }}>{block.wrongDisplay}</div>
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '.65rem', fontWeight: 700, color: '#FF5D73',
                    background: 'rgba(255,93,115,.12)', borderRadius: 6, padding: '2px 6px',
                  }}>IMPOSSIBLE ✗</div>
                </div>
                <div style={{
                  background: '#070E1C', border: '2px solid rgba(77,255,136,.4)',
                  borderRadius: 12, padding: '14px', textAlign: 'center',
                }}>
                  <div style={{
                    fontFamily: "'Inter', sans-serif", fontSize: '.6rem', fontWeight: 700,
                    letterSpacing: '.1em', color: '#4DFF88', marginBottom: 8, textTransform: 'uppercase',
                  }}>Correct</div>
                  <div style={{
                    fontFamily: 'monospace', fontSize: '1.4rem', fontWeight: 700, color: '#4DFF88',
                  }}>{block.rightDisplay}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── SimulatorBlock ───────────────────────────────────────────────────────────
function SimulatorBlock({ block }) {
  const scenarios = block.scenarios || []
  const n = scenarios.length
  const [idx, setIdx] = useState(0)
  const [answered, setAnswered] = useState(Array(n).fill(false))
  const [choice, setChoice] = useState(Array(n).fill(null))
  const [hintIdx, setHintIdx] = useState(Array(n).fill(-1))

  const scenario = scenarios[idx]
  const isAnswered = answered[idx]
  const myChoice = choice[idx]
  const isPossible = scenario?.answer === 'possible'

  function answer(chosePossible) {
    if (isAnswered) return
    const na = [...answered]; na[idx] = true; setAnswered(na)
    const nc = [...choice]; nc[idx] = chosePossible ? 'possible' : 'impossible'; setChoice(nc)
  }

  function showHint() {
    const nh = [...hintIdx]
    const hints = scenario?.hints || []
    nh[idx] = Math.min(nh[idx] + 1, hints.length - 1)
    setHintIdx(nh)
  }

  function next() {
    if (idx < n - 1) setIdx(i => i + 1)
  }

  const wasCorrect = isAnswered && myChoice === scenario?.answer

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'linear-gradient(145deg, #0A1020, #0D1428)',
        border: '1px solid rgba(75,144,255,.2)',
        borderRadius: 18, padding: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em',
            textTransform: 'uppercase', color: '#4B90FF',
          }}>🖩 Calculator Sense</div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.72rem', color: '#4A5578',
          }}>{idx + 1}/{n}</div>
        </div>

        {/* Scenario text */}
        <div style={{
          background: '#0A1020', border: '1px solid #1E2A40',
          borderRadius: 12, padding: '14px', marginBottom: 12,
        }}>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600, fontSize: '.93rem', color: '#F5F7FB', margin: 0, lineHeight: 1.45,
          }}>{scenario?.scenario}</p>
        </div>

        {/* Calculator display */}
        <div style={{
          background: '#050A10', border: '2px solid #1A2840',
          borderRadius: 10, padding: '16px 20px', textAlign: 'center',
          marginBottom: 14,
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,.5)',
        }}>
          <div style={{
            fontFamily: 'monospace', fontSize: '2rem', fontWeight: 700,
            color: isAnswered
              ? (wasCorrect ? '#4DFF88' : isPossible ? '#4DFF88' : '#FF5D73')
              : '#00FF88',
            textShadow: '0 0 12px currentColor',
            letterSpacing: '.05em',
          }}>{scenario?.display}</div>
        </div>

        {/* Answer buttons */}
        {!isAnswered && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <button onClick={() => answer(true)} style={{
              background: 'rgba(77,255,136,.08)', border: '1.5px solid rgba(77,255,136,.3)',
              borderRadius: 12, padding: '12px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '.9rem', color: '#4DFF88',
              cursor: 'pointer',
            }}>Possible ✓</button>
            <button onClick={() => answer(false)} style={{
              background: 'rgba(255,93,115,.08)', border: '1.5px solid rgba(255,93,115,.3)',
              borderRadius: 12, padding: '12px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '.9rem', color: '#FF5D73',
              cursor: 'pointer',
            }}>Impossible ✗</button>
          </div>
        )}

        {/* Hint button */}
        {!isAnswered && scenario?.hints?.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <button onClick={showHint} style={{
              background: 'rgba(255,200,87,.06)', border: '1px solid rgba(255,200,87,.2)',
              borderRadius: 8, padding: '6px 12px',
              fontFamily: "'Inter', sans-serif", fontSize: '.75rem', fontWeight: 600,
              color: '#FFC857', cursor: 'pointer',
            }}>💡 Need a Hint? ›</button>
            {hintIdx[idx] >= 0 && (
              <div className="fade-up" style={{
                marginTop: 6, padding: '8px 11px',
                background: 'rgba(255,200,87,.05)', border: '1px solid rgba(255,200,87,.15)',
                borderRadius: 8,
              }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.82rem', color: '#C8B870', margin: 0 }}>
                  {scenario.hints[hintIdx[idx]]}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Feedback */}
        {isAnswered && (
          <div className="fade-up">
            <div style={{
              background: wasCorrect ? 'rgba(77,255,136,.07)' : 'rgba(255,93,115,.07)',
              border: '1px solid ' + (wasCorrect ? 'rgba(77,255,136,.3)' : 'rgba(255,93,115,.3)'),
              borderRadius: 12, padding: '12px 14px', marginBottom: 10,
              boxShadow: wasCorrect ? '0 0 20px rgba(77,255,136,.08)' : '0 0 20px rgba(255,93,115,.1)',
            }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '.85rem',
                color: wasCorrect ? '#4DFF88' : '#FF5D73', marginBottom: 8,
              }}>{wasCorrect ? '✓ Correct!' : '✗ Not quite.'}</div>
              {scenario?.breakdown?.map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: i < scenario.breakdown.length - 1 ? 5 : 0 }}>
                  <span style={{ color: '#4B90FF', flexShrink: 0, fontSize: '.8rem' }}>→</span>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.84rem', color: '#C8D0E8', margin: 0 }}>{line}</p>
                </div>
              ))}
            </div>
            {idx < n - 1 && (
              <button onClick={next} style={{
                width: '100%',
                background: 'rgba(75,144,255,.12)', border: '1px solid rgba(75,144,255,.3)',
                borderRadius: 12, padding: '11px',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '.9rem', color: '#70A8FF',
                cursor: 'pointer',
              }}>Next scenario →</button>
            )}
            {idx >= n - 1 && (
              <div style={{
                background: 'rgba(75,144,255,.07)', border: '1px solid rgba(75,144,255,.2)',
                borderRadius: 12, padding: '12px', textAlign: 'center',
              }}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: '.9rem', color: '#70A8FF',
                }}>All scenarios complete ✓</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── TopicPickerBlock ─────────────────────────────────────────────────────────
function TopicPickerBlock({ block }) {
  const [selected, setSelected] = useState([])
  const [submitted, setSubmitted] = useState(false)

  const items = block.items || []
  const correctCount = items.filter(it => it.correct).length

  function toggle(i) {
    if (submitted) return
    setSelected(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i])
  }

  function submit() {
    if (selected.length === 0) return
    setSubmitted(true)
  }

  const correctSelected = submitted && selected.filter(i => items[i]?.correct).length
  const allCorrectGot   = submitted && correctSelected === correctCount && selected.length === correctCount

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'linear-gradient(145deg, #140A05, #0E0703)',
        border: '1px solid rgba(217,96,48,.2)', borderRadius: 18, padding: '16px',
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: '.65rem', fontWeight: 700,
          letterSpacing: '.12em', textTransform: 'uppercase',
          color: '#D96030', marginBottom: 12,
        }}>🔍 Topic Picker</div>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600,
          fontSize: '.93rem', color: '#E0D8D0', margin: '0 0 14px',
        }}>{block.question}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {items.map((it, i) => {
            const isSel = selected.includes(i)
            let bg = '#1A1008', border = 'rgba(217,96,48,.2)', color = '#9A8A7A'
            if (submitted) {
              if (it.correct) { bg = 'rgba(77,255,136,.08)'; border = 'rgba(77,255,136,.4)'; color = '#4DFF88' }
              else if (isSel) { bg = 'rgba(255,93,115,.08)'; border = 'rgba(255,93,115,.4)'; color = '#FF5D73' }
            } else if (isSel) {
              bg = 'rgba(217,96,48,.15)'; border = 'rgba(217,96,48,.5)'; color = '#E87040'
            }
            return (
              <button key={i} onClick={() => toggle(i)} disabled={submitted}
                style={{
                  background: bg, border: '1.5px solid ' + border, borderRadius: 10,
                  padding: '9px 14px', fontFamily: "'Inter', sans-serif",
                  fontSize: '.87rem', color, cursor: submitted ? 'default' : 'pointer',
                  transition: 'all .2s',
                }}>
                {submitted && it.correct && '✓ '}{submitted && isSel && !it.correct && '✗ '}{it.label}
              </button>
            )
          })}
        </div>
        {!submitted && (
          <button onClick={submit} disabled={selected.length === 0}
            style={{
              width: '100%',
              background: selected.length > 0 ? 'rgba(217,96,48,.15)' : '#100800',
              border: `1.5px solid ${selected.length > 0 ? 'rgba(217,96,48,.4)' : '#2A1A08'}`,
              borderRadius: 12, padding: '11px',
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
              fontSize: '.9rem', color: selected.length > 0 ? '#D96030' : '#4A3020',
              cursor: selected.length > 0 ? 'pointer' : 'default', transition: 'all .2s',
            }}>Check my picks →</button>
        )}
        {submitted && (
          <div className="fade-up" style={{
            background: allCorrectGot ? 'rgba(77,255,136,.07)' : 'rgba(217,96,48,.07)',
            border: '1px solid ' + (allCorrectGot ? 'rgba(77,255,136,.3)' : 'rgba(217,96,48,.3)'),
            borderRadius: 12, padding: '12px 14px',
          }}>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: '.87rem',
              color: allCorrectGot ? '#4DFF88' : '#D9A080', margin: 0, lineHeight: 1.5,
            }}>{block.explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── ColSortBlock ─────────────────────────────────────────────────────────────
function ColSortBlock({ block }) {
  // columns: [{ label, color, bg }]
  // items: [{ label, col }]  — col is index into columns
  const cols = block.columns || []
  const items = block.items || []
  const [placements, setPlacements] = useState({}) // itemIdx → colIdx
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState({})

  function place(itemIdx, colIdx) {
    if (checked) return
    setPlacements(p => ({ ...p, [itemIdx]: colIdx }))
  }

  function checkAnswers() {
    if (Object.keys(placements).length === 0) return
    const res = {}
    items.forEach((it, i) => {
      res[i] = placements[i] === it.col
    })
    setResults(res)
    setChecked(true)
  }

  const allPlaced = items.every((_, i) => placements[i] !== undefined)
  const pending = items.filter((_, i) => placements[i] === undefined)

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'linear-gradient(145deg, #140A05, #0E0703)',
        border: '1px solid rgba(217,96,48,.2)', borderRadius: 18, padding: '16px',
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: '.65rem', fontWeight: 700,
          letterSpacing: '.12em', textTransform: 'uppercase',
          color: '#D96030', marginBottom: 12,
        }}>🗂 Sort It Out</div>
        {block.question && (
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600,
            fontSize: '.9rem', color: '#E0D8D0', margin: '0 0 14px',
          }}>{block.question}</p>
        )}

        {/* Unplaced items */}
        {pending.length > 0 && !checked && (
          <div style={{
            background: '#1A1008', border: '1px dashed rgba(217,96,48,.2)',
            borderRadius: 12, padding: '12px', marginBottom: 14,
          }}>
            <div style={{
              fontFamily: "'Inter', sans-serif", fontSize: '.63rem', color: '#7A6050',
              fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8,
            }}>Tap an item, then a column</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {items.map((it, i) => {
                if (placements[i] !== undefined) return null
                return (
                  <button key={i} style={{
                    background: '#251508', border: '1px solid rgba(217,96,48,.3)',
                    borderRadius: 8, padding: '7px 12px',
                    fontFamily: "'Inter', sans-serif", fontSize: '.85rem',
                    color: '#C09070', cursor: 'default',
                  }}>{it.label}</button>
                )
              })}
            </div>
          </div>
        )}

        {/* Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols.length}, 1fr)`, gap: 10, marginBottom: 14 }}>
          {cols.map((col, ci) => (
            <div key={ci} style={{
              background: col.bg || 'rgba(217,96,48,.06)',
              border: `1.5px solid ${col.color || 'rgba(217,96,48,.3)'}`,
              borderRadius: 14, padding: '12px 10px', minHeight: 90,
            }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                fontSize: '.78rem', color: col.color || '#D96030',
                marginBottom: 10, textAlign: 'center',
              }}>{col.label}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {items.map((it, ii) => {
                  if (placements[ii] !== ci) return null
                  const res = checked ? results[ii] : null
                  return (
                    <div key={ii} style={{
                      background: res === true ? 'rgba(77,255,136,.1)' : res === false ? 'rgba(255,93,115,.08)' : '#1E1208',
                      border: '1px solid ' + (res === true ? 'rgba(77,255,136,.4)' : res === false ? 'rgba(255,93,115,.3)' : 'rgba(217,96,48,.2)'),
                      borderRadius: 7, padding: '6px 9px',
                      fontFamily: "'Inter', sans-serif", fontSize: '.82rem',
                      color: res === true ? '#4DFF88' : res === false ? '#FF8DA1' : '#C09070',
                      cursor: checked ? 'default' : 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }} onClick={() => !checked && setPlacements(p => { const n={...p}; delete n[ii]; return n })}>
                      <span>{it.label}</span>
                      {res !== null && <span style={{ fontSize: '.75rem' }}>{res ? '✓' : '✗'}</span>}
                    </div>
                  )
                })}
              </div>
              {/* Drop zone buttons */}
              {!checked && pending.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 4 }}>
                  {items.map((it, ii) => {
                    if (placements[ii] !== undefined) return null
                    return (
                      <button key={ii} onClick={() => place(ii, ci)} style={{
                        background: 'rgba(217,96,48,.06)', border: '1px dashed rgba(217,96,48,.2)',
                        borderRadius: 6, padding: '5px 8px',
                        fontFamily: "'Inter', sans-serif", fontSize: '.78rem',
                        color: '#7A5040', cursor: 'pointer', textAlign: 'left',
                        transition: 'all .15s',
                      }}>+ {it.label}</button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Feedback for wrong items */}
        {checked && items.some((_, i) => results[i] === false) && (
          <div className="fade-up" style={{ marginBottom: 10 }}>
            {items.map((it, i) => {
              if (!checked || results[i] !== false) return null
              const correctCol = cols[it.col]
              return (
                <div key={i} style={{
                  background: 'rgba(255,93,115,.06)', border: '1px solid rgba(255,93,115,.2)',
                  borderRadius: 9, padding: '8px 11px', marginBottom: 6,
                  fontFamily: "'Inter', sans-serif", fontSize: '.82rem', color: '#FF8DA1',
                }}>
                  "{it.label}" → {it.explanation || `belongs in ${correctCol?.label}`}
                </div>
              )
            })}
          </div>
        )}

        {!checked && (
          <button onClick={checkAnswers} disabled={!allPlaced}
            style={{
              width: '100%',
              background: allPlaced ? 'rgba(217,96,48,.15)' : '#100800',
              border: `1.5px solid ${allPlaced ? 'rgba(217,96,48,.4)' : '#2A1A08'}`,
              borderRadius: 12, padding: '11px',
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
              fontSize: '.9rem', color: allPlaced ? '#D96030' : '#4A3020',
              cursor: allPlaced ? 'pointer' : 'default', transition: 'all .2s',
            }}>Check answers →</button>
        )}
        {checked && (
          <div className="fade-up" style={{
            background: 'rgba(217,96,48,.07)', border: '1px solid rgba(217,96,48,.25)',
            borderRadius: 12, padding: '11px 14px',
          }}>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: '.86rem',
              color: '#D9A080', margin: 0,
            }}>{block.explanation || 'Sort complete.'}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── AgencyWheelBlock ─────────────────────────────────────────────────────────
function AgencyWheelBlock({ block }) {
  const agencies = block.agencies || []
  const [active, setActive] = useState(null)

  const agency = active !== null ? agencies[active] : null

  const angleStep = 360 / agencies.length
  const radius = 36 // % from center, for CSS positioning

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'linear-gradient(145deg, #140A05, #0E0703)',
        border: '1px solid rgba(217,96,48,.2)', borderRadius: 18, padding: '16px',
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif", fontSize: '.65rem', fontWeight: 700,
          letterSpacing: '.12em', textTransform: 'uppercase',
          color: '#D96030', marginBottom: 14,
        }}>👥 Agencies of Socialisation</div>

        {/* Wheel */}
        <div style={{ position: 'relative', width: '100%', paddingBottom: '100%', maxWidth: 280, margin: '0 auto 14px' }}>
          <div style={{ position: 'absolute', inset: 0 }}>
            {/* Center */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%)',
              width: 60, height: 60, borderRadius: '50%',
              background: 'linear-gradient(135deg, #D96030, #B84A1A)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
              fontSize: '.75rem', color: '#FFF8F5',
              zIndex: 2, boxShadow: '0 0 20px rgba(217,96,48,.4)',
            }}>YOU</div>

            {/* Connecting lines */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              {agencies.map((_, i) => {
                const angle = (angleStep * i - 90) * (Math.PI / 180)
                const cx = 50, cy = 50
                const px = cx + radius * Math.cos(angle)
                const py = cy + radius * Math.sin(angle)
                return (
                  <line key={i}
                    x1="50%" y1="50%"
                    x2={`${px}%`} y2={`${py}%`}
                    stroke={active === i ? 'rgba(217,96,48,.6)' : 'rgba(217,96,48,.15)'}
                    strokeWidth={active === i ? 2 : 1}
                    strokeDasharray={active === i ? 'none' : '4 3'}
                  />
                )
              })}
            </svg>

            {/* Agency nodes */}
            {agencies.map((ag, i) => {
              const angle = (angleStep * i - 90) * (Math.PI / 180)
              const cx = 50 + radius * Math.cos(angle)
              const cy = 50 + radius * Math.sin(angle)
              const isAct = active === i
              return (
                <button key={i} onClick={() => setActive(isAct ? null : i)} style={{
                  position: 'absolute',
                  left: `${cx}%`, top: `${cy}%`,
                  transform: 'translate(-50%,-50%)',
                  width: 56, height: 56, borderRadius: '50%',
                  background: isAct
                    ? 'linear-gradient(135deg, rgba(217,96,48,.3), rgba(217,96,48,.15))'
                    : '#1A1008',
                  border: `2px solid ${isAct ? '#D96030' : 'rgba(217,96,48,.3)'}`,
                  cursor: 'pointer', transition: 'all .2s',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 2,
                  boxShadow: isAct ? '0 0 16px rgba(217,96,48,.3)' : 'none',
                  zIndex: 1,
                }}>
                  <span style={{ fontSize: '1.2rem' }}>{ag.icon}</span>
                  <span style={{
                    fontFamily: "'Inter', sans-serif", fontSize: '.52rem',
                    fontWeight: 700, color: isAct ? '#D96030' : '#7A5040',
                    textAlign: 'center', lineHeight: 1.1,
                  }}>{ag.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Reveal panel */}
        {agency && (
          <div className="fade-up" style={{
            background: 'rgba(217,96,48,.08)', border: '1px solid rgba(217,96,48,.3)',
            borderRadius: 14, padding: '14px',
          }}>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
              fontSize: '.95rem', color: '#E87040', marginBottom: 10,
            }}>{agency.icon} {agency.label}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {agency.reveals?.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 8 }}>
                  <span style={{ color: '#D96030', flexShrink: 0, fontSize: '.8rem' }}>→</span>
                  <p style={{
                    fontFamily: "'Inter', sans-serif", fontSize: '.85rem',
                    color: '#C0A890', margin: 0, lineHeight: 1.5,
                  }}>{r}</p>
                </div>
              ))}
            </div>
            {agency.examNote && (
              <div style={{
                marginTop: 10, padding: '8px 10px',
                background: 'rgba(217,96,48,.06)', border: '1px dashed rgba(217,96,48,.25)',
                borderRadius: 8,
              }}>
                <p style={{
                  fontFamily: "'Inter', sans-serif", fontSize: '.78rem',
                  color: '#A07050', margin: 0, fontStyle: 'italic',
                }}>📌 {agency.examNote}</p>
              </div>
            )}
          </div>
        )}
        {!agency && (
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: '.82rem',
            color: '#5A4030', textAlign: 'center', margin: 0,
          }}>Tap any agency to see how it shapes behaviour →</p>
        )}
      </div>
    </div>
  )
}

// ─── AppliedScenarioBlock ─────────────────────────────────────────────────────
function AppliedScenarioBlock({ block }) {
  const scenarios = block.scenarios || []
  const [idx, setIdx] = useState(0)
  const [choice, setChoice] = useState(Array(scenarios.length).fill(null))
  const [answered, setAnswered] = useState(Array(scenarios.length).fill(false))
  const [showFollow, setShowFollow] = useState(Array(scenarios.length).fill(false))

  const sc = scenarios[idx]
  const myChoice = choice[idx]
  const isAnswered = answered[idx]

  function pick(i) {
    if (isAnswered) return
    const nc = [...choice]; nc[idx] = i; setChoice(nc)
    const na = [...answered]; na[idx] = true; setAnswered(na)
  }

  const wasCorrect = isAnswered && myChoice === sc?.correct

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'linear-gradient(145deg, #140A05, #0E0703)',
        border: '1px solid rgba(217,96,48,.2)', borderRadius: 18, padding: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{
            fontFamily: "'Inter', sans-serif", fontSize: '.65rem', fontWeight: 700,
            letterSpacing: '.12em', textTransform: 'uppercase', color: '#D96030',
          }}>🔬 Applied Sociology</div>
          <div style={{
            fontFamily: "'Inter', sans-serif", fontSize: '.72rem', color: '#5A4030',
          }}>{idx + 1}/{scenarios.length}</div>
        </div>

        {/* Scenario */}
        <div style={{
          background: '#1A1008', border: '1px solid rgba(217,96,48,.2)',
          borderRadius: 12, padding: '14px', marginBottom: 14,
        }}>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600,
            fontSize: '.93rem', color: '#E8D8C8', margin: 0, lineHeight: 1.55,
          }}>{sc?.scenario}</p>
        </div>

        {/* Question */}
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600,
          fontSize: '.9rem', color: '#D9B090', margin: '0 0 12px',
        }}>{sc?.question}</p>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {sc?.options?.map((opt, i) => {
            const isCorrectOpt = i === sc.correct
            const isPicked = myChoice === i
            let bg = '#1A1008', border = 'rgba(217,96,48,.2)', color = '#C09070'
            if (isAnswered) {
              if (isCorrectOpt) { bg = 'rgba(77,255,136,.08)'; border = 'rgba(77,255,136,.4)'; color = '#4DFF88' }
              else if (isPicked) { bg = 'rgba(255,93,115,.08)'; border = 'rgba(255,93,115,.35)'; color = '#FF5D73' }
            }
            return (
              <button key={i} onClick={() => pick(i)} disabled={isAnswered}
                style={{
                  background: bg, border: '1.5px solid ' + border, borderRadius: 11,
                  padding: '11px 14px',
                  fontFamily: "'Inter', sans-serif", fontSize: '.88rem', color,
                  cursor: isAnswered ? 'default' : 'pointer', textAlign: 'left',
                  transition: 'all .2s',
                }}>{opt}</button>
            )
          })}
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div className="fade-up">
            <div style={{
              background: wasCorrect ? 'rgba(77,255,136,.07)' : 'rgba(255,93,115,.07)',
              border: '1px solid ' + (wasCorrect ? 'rgba(77,255,136,.3)' : 'rgba(255,93,115,.3)'),
              borderRadius: 12, padding: '12px 14px', marginBottom: 10,
            }}>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: '.87rem',
                color: wasCorrect ? '#4DFF88' : '#FF8DA1', margin: 0, lineHeight: 1.5,
              }}>{sc.feedback}</p>
            </div>

            {/* Follow-up */}
            {sc.followUp && (
              <div style={{ marginBottom: 10 }}>
                {!showFollow[idx] ? (
                  <button onClick={() => { const n=[...showFollow]; n[idx]=true; setShowFollow(n) }} style={{
                    background: 'rgba(217,96,48,.08)', border: '1px solid rgba(217,96,48,.25)',
                    borderRadius: 8, padding: '7px 14px',
                    fontFamily: "'Inter', sans-serif", fontSize: '.78rem', fontWeight: 600,
                    color: '#D96030', cursor: 'pointer',
                  }}>Dig deeper: {sc.followUp.q}</button>
                ) : (
                  <div className="fade-up" style={{
                    background: 'rgba(217,96,48,.06)', border: '1px solid rgba(217,96,48,.2)',
                    borderRadius: 10, padding: '11px 13px',
                  }}>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600,
                      fontSize: '.84rem', color: '#D97040', marginBottom: 6,
                    }}>{sc.followUp.q}</div>
                    <p style={{
                      fontFamily: "'Inter', sans-serif", fontSize: '.84rem',
                      color: '#C0A880', margin: 0, lineHeight: 1.5,
                    }}>{sc.followUp.answer}</p>
                  </div>
                )}
              </div>
            )}

            {idx < scenarios.length - 1 && (
              <button onClick={() => setIdx(i => i + 1)} style={{
                width: '100%',
                background: 'rgba(217,96,48,.12)', border: '1px solid rgba(217,96,48,.3)',
                borderRadius: 12, padding: '11px',
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                fontSize: '.9rem', color: '#D96030', cursor: 'pointer',
              }}>Next scenario →</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── FlipCardsBlock ───────────────────────────────────────────────────────────
function FlipCardsBlock({ block }) {
  const [open, setOpen] = useState(Array(block.cards?.length || 0).fill(false))
  const [allDone, setAllDone] = useState(false)

  function toggle(i) {
    const next = [...open]
    next[i] = !next[i]
    setOpen(next)
    if (next.every(Boolean)) setAllDone(true)
  }

  const colorMap = ['#4B90FF', '#38D27A', '#F5B700', '#FF6B6B']

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {block.cards?.map((card, i) => {
          const col = card.color || colorMap[i % colorMap.length]
          const isOpen = open[i]
          return (
            <button key={i} onClick={() => toggle(i)} className="lift-tap" style={{
              background: isOpen
                ? `linear-gradient(145deg, ${col}12, ${col}08)`
                : 'linear-gradient(145deg, #0A1020, #0D1428)',
              border: `1.5px solid ${isOpen ? col + '55' : 'rgba(75,144,255,.18)'}`,
              borderRadius: 16, padding: '14px 18px',
              textAlign: 'left', cursor: 'pointer',
              transition: 'all .25s ease', outline: 'none', width: '100%',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{
                  fontSize: '1.5rem', flexShrink: 0,
                  filter: isOpen ? 'none' : 'grayscale(.6)',
                  transition: 'filter .2s',
                }}>{card.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700, fontSize: '.93rem',
                    color: isOpen ? '#F5F7FB' : '#8A94B0',
                    transition: 'color .2s',
                  }}>{card.front}</div>
                  {isOpen && (
                    <div className="fade-up" style={{
                      marginTop: 7,
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '.87rem', color: col, lineHeight: 1.55,
                      borderTop: `1px solid ${col}30`, paddingTop: 8,
                    }}>{card.back}</div>
                  )}
                </div>
                <span style={{
                  fontSize: '.9rem', color: isOpen ? col : '#3A4560',
                  transition: 'transform .2s, color .2s',
                  transform: isOpen ? 'rotate(90deg)' : 'none',
                  display: 'inline-block', flexShrink: 0,
                }}>›</span>
              </div>
            </button>
          )
        })}
      </div>
      {allDone && (
        <div className="fade-up" style={{
          marginTop: 12,
          background: 'rgba(75,144,255,.06)', border: '1px solid rgba(75,144,255,.25)',
          borderRadius: 12, padding: '11px 14px', textAlign: 'center',
        }}>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '.87rem', color: '#70A8FF' }}>
            All unlocked. Tap Next when you're ready. →
          </span>
        </div>
      )}
    </div>
  )
}

// ─── FracBarBlock ─────────────────────────────────────────────────────────────
function FracBarBlock({ block }) {
  const { num, den } = block.fraction || { num: 3, den: 5 }
  const quiz = block.quiz
  const [step, setStep] = useState(0) // 0=idle, 1=whole, 2=split, 3=denGlow, 4=numGlow, 5=quiz
  const [running, setRunning] = useState(false)
  const [hintIdx, setHintIdx] = useState(-1)
  const [quizChoice, setQuizChoice] = useState(null)
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [shakeIdx, setShakeIdx] = useState(null)

  function startAnim() {
    if (running) return
    setRunning(true)
    setStep(1)
    setTimeout(() => setStep(2), 700)
    setTimeout(() => setStep(3), 1500)
    setTimeout(() => setStep(4), 2400)
    setTimeout(() => setStep(5), 3500)
  }

  function pickQuiz(i) {
    if (quizAnswered) return
    setQuizChoice(i)
    if (i === quiz?.correct) {
      setQuizAnswered(true)
    } else {
      setShakeIdx(i)
      setTimeout(() => { setShakeIdx(null); setQuizChoice(null) }, 500)
    }
  }

  const pieces = Array.from({ length: den }, (_, i) => i)

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'linear-gradient(145deg, #0A1020, #0D1428)',
        border: '1px solid rgba(75,144,255,.2)',
        borderRadius: 18, padding: '16px',
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em',
          textTransform: 'uppercase', color: '#4B90FF', marginBottom: 14,
        }}>🍫 Fraction Bar</div>

        {/* Fraction label */}
        {step >= 2 && (
          <div className="fade-up" style={{ textAlign: 'center', marginBottom: 10 }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 900,
              fontSize: 'clamp(1.6rem, 6vw, 2.2rem)',
              color: '#F5F7FB', letterSpacing: '.02em',
            }}>
              <span style={{
                color: step >= 4 ? '#4DFF88' : '#F5F7FB',
                transition: 'color .4s',
                textShadow: step >= 4 ? '0 0 20px rgba(77,255,136,.5)' : 'none',
              }}>{num}</span>
              <span style={{ color: '#3A4560', margin: '0 2px' }}>/</span>
              <span style={{
                color: step >= 3 ? '#4B90FF' : '#F5F7FB',
                transition: 'color .4s',
                textShadow: step >= 3 ? '0 0 20px rgba(75,144,255,.5)' : 'none',
              }}>{den}</span>
            </span>
          </div>
        )}

        {/* The bar */}
        <div style={{
          position: 'relative', height: 52, borderRadius: 12,
          overflow: 'hidden', marginBottom: 12,
          background: step >= 1 ? '#1A2540' : 'transparent',
          border: step >= 1 ? '2px solid #2A3A5A' : '2px dashed #1E2A40',
          transition: 'background .4s, border .4s',
        }}>
          {step >= 2 && pieces.map(i => {
            const isSelected = i < num
            const pct = (1 / den) * 100
            return (
              <div key={i} style={{
                position: 'absolute', top: 0, bottom: 0,
                left: `${pct * i}%`, width: `${pct}%`,
                background: isSelected
                  ? (step >= 4 ? 'rgba(77,255,136,.55)' : 'rgba(77,255,136,.22)')
                  : 'transparent',
                borderRight: i < den - 1 ? '2px solid #2A3A5A' : 'none',
                transition: 'background .4s ease',
                boxShadow: (isSelected && step >= 4) ? 'inset 0 0 12px rgba(77,255,136,.3)' : 'none',
              }} />
            )
          })}
          {step === 1 && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, rgba(75,144,255,.15), rgba(75,144,255,.08))',
              borderRadius: 10,
            }} />
          )}
        </div>

        {/* Step labels */}
        {step >= 3 && step < 5 && (
          <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
            {step >= 3 && (
              <div style={{
                background: 'rgba(75,144,255,.08)', border: '1px solid rgba(75,144,255,.3)',
                borderRadius: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.1rem', color: '#4B90FF' }}>{den}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '.84rem', color: '#8090B0' }}>equal parts (denominator)</span>
              </div>
            )}
            {step >= 4 && (
              <div className="fade-up" style={{
                background: 'rgba(77,255,136,.08)', border: '1px solid rgba(77,255,136,.3)',
                borderRadius: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 900, fontSize: '1.1rem', color: '#4DFF88' }}>{num}</span>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '.84rem', color: '#8090B0' }}>selected parts (numerator)</span>
              </div>
            )}
          </div>
        )}

        {/* Start button */}
        {step === 0 && (
          <button onClick={startAnim} className="lift-tap" style={{
            width: '100%',
            background: 'rgba(75,144,255,.12)', border: '1.5px solid rgba(75,144,255,.35)',
            borderRadius: 12, padding: '12px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: '.9rem', color: '#70A8FF',
            cursor: 'pointer',
          }}>▶ Watch the animation</button>
        )}

        {/* Quiz */}
        {step >= 5 && quiz && (
          <div className="fade-up" style={{
            background: '#070E1C', border: '1px solid rgba(75,144,255,.2)',
            borderRadius: 14, padding: '14px', marginTop: 4,
          }}>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600, fontSize: '.93rem', color: '#E0E6F0', margin: '0 0 12px',
            }}>{quiz.q}</p>

            {/* Hints */}
            {quiz.hints?.length > 0 && !quizAnswered && (
              <div style={{ marginBottom: 10 }}>
                <button onClick={() => setHintIdx(h => Math.min(h + 1, quiz.hints.length - 1))}
                  style={{
                    background: 'rgba(255,200,87,.06)', border: '1px solid rgba(255,200,87,.2)',
                    borderRadius: 8, padding: '5px 12px',
                    fontFamily: "'Inter', sans-serif", fontSize: '.75rem', fontWeight: 600,
                    color: '#FFC857', cursor: 'pointer',
                  }}>💡 Need a Hint? ›</button>
                {hintIdx >= 0 && (
                  <div className="fade-up" style={{
                    marginTop: 6, padding: '7px 10px',
                    background: 'rgba(255,200,87,.05)', border: '1px solid rgba(255,200,87,.15)',
                    borderRadius: 8,
                  }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.8rem', color: '#C8B870', margin: 0 }}>
                      {quiz.hints[hintIdx]}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {quiz.options?.map((opt, i) => {
                const isCorrect = i === quiz.correct
                const isPicked = quizChoice === i
                let bg = '#10182B', border = '#2A3A5A', color = '#C8D0E8'
                if (quizAnswered) {
                  if (isCorrect) { bg = 'rgba(77,255,136,.08)'; border = 'rgba(77,255,136,.4)'; color = '#4DFF88' }
                  else if (isPicked) { bg = 'rgba(255,93,115,.08)'; border = 'rgba(255,93,115,.35)'; color = '#FF5D73' }
                }
                return (
                  <button key={i} onClick={() => pickQuiz(i)} disabled={quizAnswered}
                    style={{
                      background: bg, border: '1.5px solid ' + border,
                      borderRadius: 10, padding: '10px 14px',
                      fontFamily: "'Inter', sans-serif", fontSize: '.87rem', color,
                      cursor: quizAnswered ? 'default' : 'pointer',
                      textAlign: 'left', transition: 'all .2s',
                      animation: shakeIdx === i ? 'shake .35s ease' : 'none',
                    }}>{opt}</button>
                )
              })}
            </div>
            {quizAnswered && (
              <div className="fade-up" style={{
                marginTop: 10, padding: '10px 12px',
                background: 'rgba(77,255,136,.06)', border: '1px solid rgba(77,255,136,.25)',
                borderRadius: 10,
              }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.84rem', color: '#6BFFB0', margin: 0 }}>
                  ✓ {quiz.explanation}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── FractionSplitterBlock ────────────────────────────────────────────────────
function FractionSplitterBlock({ block }) {
  const levels = block.levels || [
    { num: 1, den: 2 },
    { num: 2, den: 4 },
    { num: 4, den: 8 },
  ]
  const [levelIdx, setLevelIdx] = useState(0)
  const [predicted, setPredicted] = useState(false)
  const [showReveal, setShowReveal] = useState(false)

  const current = levels[levelIdx]
  const isMax = levelIdx >= levels.length - 1

  function split() {
    if (isMax) return
    setLevelIdx(l => l + 1)
    setShowReveal(true)
  }

  function FractionBar({ num, den, highlight = false }) {
    const pieces = Array.from({ length: den }, (_, i) => i)
    return (
      <div style={{
        position: 'relative', height: 44, borderRadius: 10,
        overflow: 'hidden',
        background: '#1A2540',
        border: `2px solid ${highlight ? 'rgba(75,144,255,.5)' : '#2A3A5A'}`,
        boxShadow: highlight ? '0 0 16px rgba(75,144,255,.15)' : 'none',
        transition: 'all .3s',
      }}>
        {pieces.map(i => (
          <div key={i} style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${(100 / den) * i}%`,
            width: `${100 / den}%`,
            background: i < num ? 'rgba(77,255,136,.45)' : 'transparent',
            borderRight: i < den - 1 ? '2px solid #2A3A5A' : 'none',
            transition: 'width .5s ease, left .5s ease, background .4s',
          }} />
        ))}
      </div>
    )
  }

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'linear-gradient(145deg, #0A1020, #0D1428)',
        border: '1px solid rgba(75,144,255,.2)',
        borderRadius: 18, padding: '16px',
      }}>
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em',
          textTransform: 'uppercase', color: '#4B90FF', marginBottom: 14,
        }}>🔄 Equivalent Fractions</div>

        {/* Prediction prompt */}
        {!predicted && levelIdx === 0 && (
          <div style={{
            background: 'rgba(245,183,0,.06)', border: '1px dashed rgba(245,183,0,.3)',
            borderRadius: 12, padding: '12px 14px', marginBottom: 14,
          }}>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '.88rem', color: '#C8B870', margin: '0 0 10px', lineHeight: 1.5,
            }}>{block.predictionPrompt || 'What do you think will happen if we split every piece again?'}</p>
            <button onClick={() => setPredicted(true)} style={{
              background: 'rgba(245,183,0,.12)', border: '1px solid rgba(245,183,0,.3)',
              borderRadius: 8, padding: '7px 14px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '.82rem', color: '#F5B700',
              cursor: 'pointer',
            }}>Find out →</button>
          </div>
        )}

        {/* Current bar with label */}
        {predicted && (
          <div className="fade-up">
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 8,
            }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800, fontSize: '1.5rem', color: '#F5F7FB', letterSpacing: '.02em',
              }}>
                {current.num}<span style={{ color: '#3A4560', margin: '0 1px' }}>/</span>{current.den}
              </span>
              <div style={{
                background: 'rgba(77,255,136,.08)', border: '1px solid rgba(77,255,136,.25)',
                borderRadius: 8, padding: '4px 10px',
                fontFamily: "'Inter', sans-serif", fontSize: '.72rem', fontWeight: 700,
                color: '#4DFF88',
              }}>
                {Math.round((current.num / current.den) * 100)}% shaded
              </div>
            </div>

            <FractionBar num={current.num} den={current.den} highlight={showReveal} />

            {/* History of splits */}
            {levelIdx > 0 && (
              <div className="fade-up" style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {levels.slice(0, levelIdx).map((lv, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    opacity: .55,
                  }}>
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700, fontSize: '.9rem', color: '#4A5578',
                      minWidth: 40,
                    }}>{lv.num}/{lv.den}</span>
                    <div style={{ flex: 1 }}>
                      <FractionBar num={lv.num} den={lv.den} />
                    </div>
                    <span style={{ fontSize: '.72rem', color: '#3A4560' }}>= {Math.round((lv.num / lv.den) * 100)}%</span>
                  </div>
                ))}
              </div>
            )}

            {/* Reveal text */}
            {showReveal && levelIdx > 0 && (
              <div className="fade-up" style={{
                marginTop: 12,
                background: 'rgba(75,144,255,.07)', border: '1px solid rgba(75,144,255,.25)',
                borderRadius: 12, padding: '12px 14px',
              }}>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '.88rem', color: '#A0B0D0', margin: 0, lineHeight: 1.55,
                }}>
                  The pieces changed size. <strong style={{ color: '#4DFF88' }}>The amount stayed the same.</strong>
                </p>
              </div>
            )}

            {/* Split button or exam tip */}
            {!isMax ? (
              <button onClick={split} className="lift-tap" style={{
                marginTop: 12, width: '100%',
                background: 'rgba(75,144,255,.12)', border: '1.5px solid rgba(75,144,255,.35)',
                borderRadius: 12, padding: '11px',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '.9rem', color: '#70A8FF',
                cursor: 'pointer',
              }}>✂ Split every piece again →</button>
            ) : block.examTip && (
              <div className="fade-up" style={{
                marginTop: 12,
                background: 'rgba(245,183,0,.06)', border: '1px dashed rgba(245,183,0,.3)',
                borderRadius: 12, padding: '12px 14px',
              }}>
                <div style={{
                  fontFamily: "'Inter', sans-serif", fontSize: '.6rem', fontWeight: 700,
                  color: '#F5B700', marginBottom: 5, letterSpacing: '.1em', textTransform: 'uppercase',
                }}>🧠 Exam Master</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.86rem', color: '#C8D0E8', margin: 0 }}>
                  {block.examTip}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── FractionLabBlock ─────────────────────────────────────────────────────────
function FractionLabBlock({ block }) {
  const tasks = block.tasks || []
  const [taskIdx, setTaskIdx] = useState(0)
  const [multiplier, setMultiplier] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [shake, setShake] = useState(false)
  const [hintIdx, setHintIdx] = useState(-1)
  const [tasksDone, setTasksDone] = useState([])

  const task = tasks[taskIdx]
  const multipliers = [2, 3, 4]

  function check() {
    if (multiplier === null) return
    const { from, to } = task
    const isCorrect = to
      ? (from.num * multiplier === to.num && from.den * multiplier === to.den)
      : (from.num * multiplier === task.equivalents?.[0]?.num && from.den * multiplier === task.equivalents?.[0]?.den)

    if (isCorrect || (task.equivalents && task.equivalents.some(eq => from.num * multiplier === eq.num && from.den * multiplier === eq.den))) {
      setCorrect(true)
      setConfirmed(true)
    } else {
      setShake(true)
      setTimeout(() => setShake(false), 400)
    }
  }

  function nextTask() {
    setTasksDone(d => [...d, taskIdx])
    setTaskIdx(t => Math.min(t + 1, tasks.length - 1))
    setMultiplier(null)
    setConfirmed(false)
    setCorrect(false)
    setHintIdx(-1)
  }

  function FractionBar({ num, den, glow = false }) {
    const pieces = Array.from({ length: den }, (_, i) => i)
    return (
      <div style={{
        height: 38, borderRadius: 8, overflow: 'hidden',
        background: '#1A2540', border: `2px solid ${glow ? 'rgba(77,255,136,.5)' : '#2A3A5A'}`,
        display: 'flex',
        boxShadow: glow ? '0 0 16px rgba(77,255,136,.2)' : 'none',
        transition: 'box-shadow .3s',
      }}>
        {pieces.map(i => (
          <div key={i} style={{
            flex: 1,
            background: i < num ? 'rgba(77,255,136,.5)' : 'transparent',
            borderRight: i < den - 1 ? '2px solid #2A3A5A' : 'none',
          }} />
        ))}
      </div>
    )
  }

  const allDone = tasksDone.length >= tasks.length

  if (allDone) {
    return (
      <div style={{ margin: '14px 0' }}>
        <div style={{
          background: 'rgba(77,255,136,.08)', border: '1.5px solid rgba(77,255,136,.3)',
          borderRadius: 18, padding: '20px', textAlign: 'center',
          boxShadow: '0 0 32px rgba(77,255,136,.08)',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>✓</div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: '1rem', color: '#4DFF88',
          }}>Fraction Lab complete.</div>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: '.85rem',
            color: '#5A8A6A', margin: '6px 0 0',
          }}>You can build equivalent fractions. That skill powers simplifying, adding fractions, and percentages.</p>
        </div>
      </div>
    )
  }

  const builtNum = task?.from?.num ? task.from.num * (multiplier || 1) : null
  const builtDen = task?.from?.den ? task.from.den * (multiplier || 1) : null

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'linear-gradient(145deg, #0A1020, #0D1428)',
        border: '1px solid rgba(75,144,255,.2)',
        borderRadius: 18, padding: '16px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em',
            textTransform: 'uppercase', color: '#4B90FF',
          }}>🧩 Fraction Lab</div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.72rem', color: '#4A5578',
          }}>Task {taskIdx + 1}/{tasks.length}</div>
        </div>

        {/* Task label */}
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600, fontSize: '.93rem', color: '#E0E6F0', margin: '0 0 14px',
        }}>{task?.label}</p>

        {/* From fraction */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '.75rem', color: '#5A6480' }}>Start</span>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '.9rem', color: '#C8D0E8' }}>
              {task?.from?.num}/{task?.from?.den}
            </span>
          </div>
          <FractionBar num={task?.from?.num} den={task?.from?.den} />
        </div>

        {/* Built fraction */}
        {multiplier !== null && (
          <div className="fade-up" style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '.75rem', color: '#5A6480' }}>Your answer</span>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '.9rem',
                color: correct ? '#4DFF88' : '#C8D0E8',
                animation: shake ? 'shake .35s ease' : 'none',
              }}>
                {builtNum}/{builtDen}
              </span>
            </div>
            <FractionBar num={builtNum} den={builtDen} glow={correct} />
          </div>
        )}

        {/* Multiplier buttons */}
        {!confirmed && (
          <>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: '.8rem', color: '#6A7490',
              margin: '12px 0 8px',
            }}>Multiply top and bottom by:</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
              {multipliers.map(m => (
                <button key={m} onClick={() => setMultiplier(m)} style={{
                  background: multiplier === m ? 'rgba(75,144,255,.2)' : '#10182B',
                  border: `1.5px solid ${multiplier === m ? 'rgba(75,144,255,.6)' : '#2A3A5A'}`,
                  borderRadius: 10, padding: '10px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: '.9rem',
                  color: multiplier === m ? '#70A8FF' : '#4A5578',
                  cursor: 'pointer', transition: 'all .15s',
                }}>×{m}</button>
              ))}
            </div>
            <button onClick={check} disabled={multiplier === null} style={{
              width: '100%',
              background: multiplier !== null ? 'rgba(75,144,255,.15)' : '#0A1020',
              border: `1.5px solid ${multiplier !== null ? 'rgba(75,144,255,.4)' : '#1E2A40'}`,
              borderRadius: 12, padding: '11px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '.9rem',
              color: multiplier !== null ? '#70A8FF' : '#3A4560',
              cursor: multiplier !== null ? 'pointer' : 'default',
              transition: 'all .2s',
            }}>Check →</button>
          </>
        )}

        {/* Hint */}
        {!confirmed && block.hints?.length > 0 && (
          <div style={{ marginTop: 10 }}>
            <button onClick={() => setHintIdx(h => Math.min(h + 1, block.hints.length - 1))}
              style={{
                background: 'rgba(255,200,87,.06)', border: '1px solid rgba(255,200,87,.2)',
                borderRadius: 8, padding: '6px 12px',
                fontFamily: "'Inter', sans-serif", fontSize: '.75rem', fontWeight: 600,
                color: '#FFC857', cursor: 'pointer',
              }}>💡 Need a Hint? ›</button>
            {hintIdx >= 0 && (
              <div className="fade-up" style={{
                marginTop: 6, padding: '7px 10px',
                background: 'rgba(255,200,87,.05)', border: '1px solid rgba(255,200,87,.15)',
                borderRadius: 8,
              }}>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.8rem', color: '#C8B870', margin: 0 }}>
                  {block.hints[hintIdx]}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Correct state */}
        {confirmed && (
          <div className="fade-up" style={{ marginTop: 12 }}>
            <div style={{
              background: 'rgba(77,255,136,.08)', border: '1px solid rgba(77,255,136,.3)',
              borderRadius: 12, padding: '12px 14px', marginBottom: 10,
              boxShadow: '0 0 16px rgba(77,255,136,.1)',
            }}>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '.9rem', color: '#4DFF88', margin: 0,
              }}>✓ Same amount confirmed</p>
            </div>
            {taskIdx < tasks.length - 1 ? (
              <button onClick={nextTask} style={{
                width: '100%',
                background: 'rgba(75,144,255,.12)', border: '1px solid rgba(75,144,255,.3)',
                borderRadius: 12, padding: '11px',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '.9rem', color: '#70A8FF',
                cursor: 'pointer',
              }}>Next task →</button>
            ) : (
              <button onClick={() => setTasksDone(d => [...d, taskIdx])} style={{
                width: '100%',
                background: 'rgba(77,255,136,.12)', border: '1px solid rgba(77,255,136,.3)',
                borderRadius: 12, padding: '11px',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '.9rem', color: '#4DFF88',
                cursor: 'pointer',
              }}>Complete Lab ✓</button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── ExamScoredBlock ──────────────────────────────────────────────────────────
function ExamScoredBlock({ block }) {
  const questions = block.questions || []
  const [qIdx, setQIdx] = useState(0)
  const [choices, setChoices] = useState(Array(questions.length).fill(null))
  const [revealed, setRevealed] = useState(Array(questions.length).fill(false))
  const [showModel, setShowModel] = useState(Array(questions.length).fill(false))
  const [shakeIdx, setShakeIdx] = useState(null)
  const [allDone, setAllDone] = useState(false)

  const q = questions[qIdx]
  const myChoice = choices[qIdx]
  const isAnswered = revealed[qIdx]

  function pick(i) {
    if (isAnswered) return
    const nc = [...choices]; nc[qIdx] = i; setChoices(nc)
    const nr = [...revealed]; nr[qIdx] = true; setRevealed(nr)
    if (qIdx >= questions.length - 1) {
      setTimeout(() => setAllDone(true), 1200)
    }
  }

  function nextQ() {
    if (qIdx < questions.length - 1) setQIdx(q => q + 1)
  }

  function toggleModel(i) {
    const ns = [...showModel]; ns[i] = !ns[i]; setShowModel(ns)
  }

  const wasCorrect = isAnswered && myChoice === q?.correct
  const totalMarks = questions.reduce((acc, q) => acc + (q.marks || 1), 0)
  const earnedMarks = revealed.reduce((acc, done, i) => {
    if (!done) return acc
    return acc + (choices[i] === questions[i]?.correct ? (questions[i]?.marks || 1) : 0)
  }, 0)

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'linear-gradient(145deg, #0A1020, #0D1428)',
        border: '1px solid rgba(75,144,255,.2)',
        borderRadius: 18, padding: '16px',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.65rem', fontWeight: 700, letterSpacing: '.12em',
            textTransform: 'uppercase', color: '#4B90FF',
          }}>📝 Exam Questions</div>
          <div style={{
            background: 'rgba(75,144,255,.08)', border: '1px solid rgba(75,144,255,.2)',
            borderRadius: 99, padding: '3px 10px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '.75rem', fontWeight: 700, color: '#4B90FF',
          }}>{earnedMarks}/{totalMarks} marks</div>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
          {questions.map((_, i) => (
            <div key={i} style={{
              height: 4, flex: 1, borderRadius: 99,
              background: revealed[i]
                ? (choices[i] === questions[i].correct ? 'rgba(77,255,136,.6)' : 'rgba(255,93,115,.5)')
                : (i === qIdx ? 'rgba(75,144,255,.5)' : '#1E2A40'),
              transition: 'background .3s',
            }} />
          ))}
        </div>

        {/* Question */}
        {!allDone && q && (
          <div>
            <div style={{
              display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 12,
            }}>
              <div style={{
                background: 'rgba(75,144,255,.12)', border: '1px solid rgba(75,144,255,.25)',
                borderRadius: 99, padding: '2px 8px',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '.7rem', fontWeight: 700, color: '#4B90FF', flexShrink: 0,
              }}>Q{qIdx + 1} · {q.marks || 1} mark{(q.marks || 1) > 1 ? 's' : ''}</div>
            </div>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600, fontSize: '.95rem', color: '#F5F7FB',
              margin: '0 0 14px', lineHeight: 1.45,
            }}>{q.q}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.options?.map((opt, i) => {
                const isCorrectOpt = i === q.correct
                const isPicked = myChoice === i
                let bg = '#10182B', border = '#2A3A5A', color = '#C8D0E8'
                if (isAnswered) {
                  if (isCorrectOpt) { bg = 'rgba(77,255,136,.08)'; border = 'rgba(77,255,136,.4)'; color = '#4DFF88' }
                  else if (isPicked) { bg = 'rgba(255,93,115,.08)'; border = 'rgba(255,93,115,.35)'; color = '#FF5D73' }
                }
                return (
                  <button key={i} onClick={() => pick(i)} disabled={isAnswered}
                    style={{
                      background: bg, border: '1.5px solid ' + border,
                      borderRadius: 11, padding: '11px 14px',
                      fontFamily: "'Inter', sans-serif", fontSize: '.88rem', color,
                      cursor: isAnswered ? 'default' : 'pointer',
                      textAlign: 'left', transition: 'all .2s',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                    <span style={{ opacity: .4, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '.75rem' }}>
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>

            {/* Per-question feedback */}
            {isAnswered && q.feedback?.[myChoice] && (
              <div className="fade-up" style={{
                marginTop: 10,
                background: wasCorrect ? 'rgba(77,255,136,.07)' : 'rgba(255,93,115,.07)',
                border: '1px solid ' + (wasCorrect ? 'rgba(77,255,136,.3)' : 'rgba(255,93,115,.3)'),
                borderRadius: 12, padding: '12px 14px',
              }}>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '.86rem', color: wasCorrect ? '#4DFF88' : '#FF8DA1',
                  margin: 0, lineHeight: 1.5,
                }}>{q.feedback[myChoice]}</p>
              </div>
            )}

            {/* Model answer toggle */}
            {isAnswered && q.modelAnswer && (
              <div style={{ marginTop: 8 }}>
                <button onClick={() => toggleModel(qIdx)} style={{
                  background: 'rgba(245,183,0,.06)', border: '1px solid rgba(245,183,0,.2)',
                  borderRadius: 8, padding: '5px 12px',
                  fontFamily: "'Inter', sans-serif", fontSize: '.75rem', fontWeight: 600,
                  color: '#FFC857', cursor: 'pointer',
                }}>📋 {showModel[qIdx] ? 'Hide' : 'Show'} model answer</button>
                {showModel[qIdx] && (
                  <div className="fade-up" style={{
                    marginTop: 6, padding: '10px 12px',
                    background: 'rgba(245,183,0,.05)', border: '1px solid rgba(245,183,0,.18)',
                    borderRadius: 10,
                  }}>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.84rem', color: '#C8B870', margin: 0, lineHeight: 1.5 }}>
                      {q.modelAnswer}
                    </p>
                  </div>
                )}
              </div>
            )}

            {isAnswered && qIdx < questions.length - 1 && (
              <button onClick={nextQ} style={{
                marginTop: 12, width: '100%',
                background: 'rgba(75,144,255,.12)', border: '1px solid rgba(75,144,255,.3)',
                borderRadius: 12, padding: '11px',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '.9rem', color: '#70A8FF',
                cursor: 'pointer',
              }}>Next question →</button>
            )}
          </div>
        )}

        {/* All done summary */}
        {allDone && (
          <div className="fade-up">
            <div style={{
              background: earnedMarks >= Math.floor(totalMarks * .67)
                ? 'rgba(77,255,136,.07)' : 'rgba(245,183,0,.07)',
              border: '1px solid ' + (earnedMarks >= Math.floor(totalMarks * .67)
                ? 'rgba(77,255,136,.3)' : 'rgba(245,183,0,.3)'),
              borderRadius: 14, padding: '16px', textAlign: 'center', marginBottom: 12,
            }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900, fontSize: '2rem',
                color: earnedMarks >= Math.floor(totalMarks * .67) ? '#4DFF88' : '#F5B700',
              }}>{earnedMarks}/{totalMarks}</div>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '.88rem', color: '#9CA8C7', margin: '4px 0 0',
              }}>
                {earnedMarks === totalMarks
                  ? 'Full marks. Solid understanding.'
                  : earnedMarks >= Math.floor(totalMarks * .67)
                    ? 'Good. Review any red feedback above.'
                    : 'Review the fraction bar pages before moving on.'}
              </p>
            </div>
            {block.examTip && (
              <div style={{
                background: 'rgba(245,183,0,.06)', border: '1px dashed rgba(245,183,0,.3)',
                borderRadius: 12, padding: '12px 14px',
              }}>
                <div style={{
                  fontFamily: "'Inter', sans-serif", fontSize: '.6rem', fontWeight: 700,
                  color: '#F5B700', marginBottom: 5, letterSpacing: '.1em', textTransform: 'uppercase',
                }}>🎯 Exam Master</div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '.86rem', color: '#C8D0E8', margin: 0 }}>
                  {block.examTip}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── ComicBlock (History only) ────────────────────────────────────────────────
function ComicBlock({ block }) {
  const panels = block.panels || []
  const [idx, setIdx] = useState(0)
  const startXRef = useRef(0)
  const panel = panels[idx] || {}

  function goTo(i) { if (i >= 0 && i < panels.length) setIdx(i) }

  function onTouchStart(e) { startXRef.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    const dx = e.changedTouches[0].clientX - startXRef.current
    if (dx < -44) goTo(idx + 1)
    else if (dx > 44) goTo(idx - 1)
  }

  return (
    <div style={{ margin: '14px 0' }}>
      {/* Panel image — swipeable */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', userSelect: 'none', cursor: panels.length > 1 ? 'grab' : 'default' }}
      >
        <img
          src={panel.image}
          alt={`Panel ${idx + 1}`}
          draggable={false}
          style={{ width: '100%', display: 'block', borderRadius: 14 }}
        />
        {/* prev / next tap zones on wider screens */}
        {idx > 0 && (
          <button onClick={() => goTo(idx - 1)} style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: '22%',
            background: 'transparent', border: 'none', cursor: 'pointer',
          }} aria-label="Previous panel" />
        )}
        {idx < panels.length - 1 && (
          <button onClick={() => goTo(idx + 1)} style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: '22%',
            background: 'transparent', border: 'none', cursor: 'pointer',
          }} aria-label="Next panel" />
        )}
      </div>

      {/* Dot navigation */}
      {panels.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 7, margin: '12px 0 4px' }}>
          {panels.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === idx ? 22 : 8, height: 8,
                borderRadius: 4, border: 'none', padding: 0, cursor: 'pointer',
                background: i === idx ? '#C47828' : 'rgba(196,120,40,.28)',
                transition: 'width .18s, background .18s',
              }}
            />
          ))}
        </div>
      )}

      {/* Swipe hint */}
      {idx < panels.length - 1 && (
        <p style={{
          textAlign: 'center', fontSize: '.72rem', fontFamily: "'Inter', sans-serif",
          color: 'rgba(200,176,144,.45)', margin: '4px 0 10px', letterSpacing: '.04em',
        }}>
          📖 Swipe to see more
        </p>
      )}

      {/* GCSE Takeaway */}
      {panel.takeaway && (
        <div style={{
          background: 'rgba(196,120,40,.07)',
          border: '1px solid rgba(196,120,40,.22)',
          borderRadius: 12, padding: '14px 16px', marginTop: 10,
        }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.64rem', fontWeight: 700, letterSpacing: '.12em',
            textTransform: 'uppercase', color: '#C47828', marginBottom: 7,
          }}>
            📚 GCSE Takeaway
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.9rem', lineHeight: 1.65, margin: 0, color: '#C8B090',
          }}>
            {panel.takeaway}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Single screen renderer ───────────────────────────────────────────────────

function Screen({ screen, subject }) {
  const isWarm  = subject === 'History'
  const isBio   = subject === 'Biology'
  const isMaths = subject === 'Maths'
  const isSoc   = subject === 'Sociology'
  return (
    <div>
      {screen.headerImage && (
        <div style={{
          margin: '0 -4px 20px',
          borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,.5)',
          maxHeight: 200,
        }}>
          <img
            src={screen.headerImage}
            alt=""
            style={{
              width: '100%', height: 200,
              objectFit: 'cover', objectPosition: 'center 30%',
              display: 'block',
            }}
          />
        </div>
      )}
      <div style={{ marginBottom: 20 }}>
        {!screen.headerImage && (
          <div style={{
            display: 'inline-flex',
            background: isWarm ? 'rgba(196,120,40,.12)' : isBio ? 'rgba(56,210,122,.12)' : isMaths ? 'rgba(75,144,255,.12)' : isSoc ? 'rgba(217,96,48,.12)' : 'rgba(157,92,255,.12)',
            border: `1px solid ${isWarm ? 'rgba(196,120,40,.25)' : isBio ? 'rgba(56,210,122,.25)' : isMaths ? 'rgba(75,144,255,.25)' : isSoc ? 'rgba(217,96,48,.25)' : 'rgba(157,92,255,.25)'}`,
            color: isWarm ? '#C8901A' : isBio ? '#38D27A' : isMaths ? '#4B90FF' : isSoc ? '#D96030' : '#C18CFF',
            borderRadius: 99, padding: '4px 12px',
            fontFamily: "'Inter', sans-serif",
            fontSize: '.68rem', fontWeight: 700,
            letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12,
          }}>{screen.kicker}</div>
        )}
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(1.3rem, 4vw, 1.75rem)',
          marginBottom: 8, color: isWarm ? '#F0E8D8' : isBio ? '#E8F5EE' : isMaths ? '#EEF2FF' : '#F5F7FB',
          fontWeight: 700, letterSpacing: '-.01em', lineHeight: 1.2,
        }}>{screen.heading}</h2>
        {screen.sub && (
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.9rem', color: isWarm ? '#8A7055' : isBio ? '#5A8A6A' : isMaths ? '#5A6A90' : '#5A6480', lineHeight: 1.6, margin: 0,
          }}>{screen.sub}</p>
        )}
      </div>

      {screen.blocks.map((block, i) => (
        <div key={i}>
          {block.type === 'read'          && <ReadBlock block={block} isWarm={isWarm} isBio={isBio} isMaths={isMaths} isSoc={isSoc} />}
          {block.type === 'keypoint'      && <KeypointBlock block={block} isWarm={isWarm} isBio={isBio} isMaths={isMaths} isSoc={isSoc} />}
          {block.type === 'funfact'       && <FunFactBlock block={block} isWarm={isWarm} isBio={isBio} isMaths={isMaths} isSoc={isSoc} />}
          {block.type === 'examtip'       && <ExamTipBlock block={block} isWarm={isWarm} />}
          {block.type === 'timeline'      && <TimelineBlock block={block} isWarm={isWarm} isBio={isBio} isMaths={isMaths} />}
          {block.type === 'reveal'        && <RevealBlock block={block} />}
          {block.type === 'quiz'          && <QuizBlock block={block} subject={subject} />}
          {block.type === 'flashcards'    && <FlashcardsBlock block={block} />}
          {block.type === 'hotspot'       && <HotspotBlock block={block} />}
          {block.type === 'misconception' && <MisconceptionBlock block={block} />}
          {block.type === 'scarf'         && <ScarfBlock block={block} />}
          {block.type === 'builder'       && <BuilderBlock block={block} />}
          {block.type === 'scenario'      && <ScenarioBlock block={block} />}
          {block.type === 'boss'          && <BossBlock block={block} />}
          {block.type === 'numberline'       && <NumberLineBlock block={block} />}
          {block.type === 'fillblanks'       && <FillBlanksBlock block={block} isWarm={isWarm} isBio={isBio} isMaths={isMaths} isSoc={isSoc} />}
          {block.type === 'bidmas'           && <BidmasBlock block={block} />}
          {block.type === 'tieredquiz'       && <TieredQuizBlock block={block} />}
          {block.type === 'tfcheckpoint'     && <TFCheckpointBlock block={block} />}
          {block.type === 'simulator'        && <SimulatorBlock block={block} />}
          {block.type === 'flipcards'        && <FlipCardsBlock block={block} />}
          {block.type === 'fracbar'          && <FracBarBlock block={block} />}
          {block.type === 'fractionsplitter' && <FractionSplitterBlock block={block} />}
          {block.type === 'fractionlab'      && <FractionLabBlock block={block} />}
          {block.type === 'examscored'       && <ExamScoredBlock block={block} />}
          {block.type === 'topicpicker'      && <TopicPickerBlock block={block} />}
          {block.type === 'colsort'          && <ColSortBlock block={block} />}
          {block.type === 'agencywheel'      && <AgencyWheelBlock block={block} />}
          {block.type === 'appliedscenario'  && <AppliedScenarioBlock block={block} />}
          {block.type === 'comic'            && <ComicBlock block={block} />}
        </div>
      ))}
    </div>
  )
}


// ─── HookScreen ──────────────────────────────────────────────────────────────
// Renders inside the normal ModulePlayer nav shell.
// Phases: question → feedback → grow → reveal
// The grow and reveal phases stay put until the user taps the bottom-nav Next button.

function useHookPhase(hook) {
  // phases: 'atmospheric' (optional) | 'question' | 'feedback' | 'grow' | 'reveal'
  const [phase, setPhase]         = useState(hook?.atmosphericOpener ? 'atmospheric' : 'question')
  const [chosenTrue, setChosenTrue] = useState(null)
  const [growStep, setGrowStep]   = useState(0)
  const [revealIdx, setRevealIdx] = useState(-1)

  function startInvestigating() { setPhase('question') }

  function choose(tappedTrue) {
    setChosenTrue(tappedTrue)
    setPhase('feedback')
    if (hook?.showGrow) {
      // After 1.4s flash, auto-advance to grow and begin stepping
      setTimeout(() => {
        setPhase('grow')
        let step = 0
        const iv = setInterval(() => {
          step++
          setGrowStep(step)
          if (step >= 3) clearInterval(iv)
        }, 900)
      }, 1400)
    } else {
      // No grow phase — go straight to reveal after the flash
      setTimeout(() => setPhase('reveal'), 1400)
    }
  }

  function nextFromGrow()   { setPhase('reveal') }
  function nextRevealItem() { setRevealIdx(i => i + 1) }

  const wasCorrect   = chosenTrue === hook?.isTrue
  const allRevealed  = revealIdx >= (hook?.revealItems?.length || 0) - 1
  const canAdvance   = phase === 'grow'
  const revealDone   = phase === 'reveal' && allRevealed

  return { phase, chosenTrue, wasCorrect, growStep, revealIdx, allRevealed,
           canAdvance, revealDone, choose, nextFromGrow, nextRevealItem, startInvestigating }
}

function HookContent({ module, hook, hookState, subjectColor }) {
  const { phase, wasCorrect, growStep, revealIdx, allRevealed, choose, nextRevealItem } = hookState
  const [pending, setPending] = useState(null) // null | true | false — pre-submit selection

  const isWarm     = module.subject === 'History'
  const isBio      = module.subject === 'Biology'
  const isSoc      = module.subject === 'Sociology'
  const hookBg     = isWarm ? '#0C0905' : isBio ? '#04090A' : isSoc ? '#0C0804' : '#080C1A'
  const hookCard   = isWarm ? '#191208' : isBio ? '#071410' : isSoc ? '#1A0E07' : '#10182B'
  const hookBorder = (isWarm || isBio || isSoc) ? `${subjectColor}28` : '#2A3552'

  return (
    <div style={{ paddingBottom: 20 }}>

      {/* ── Phase: ATMOSPHERIC ── */}
      {phase === 'atmospheric' && hook.atmosphericOpener && (
        hook.atmosphericOpener.bgImage ? (
          /* ── Full-bleed photo atmospheric opener ── */
          <div
            onClick={hookState.startInvestigating}
            style={{
              position: 'fixed', inset: 0, zIndex: 10,
              backgroundImage: `url(${hook.atmosphericOpener.bgImage})`,
              backgroundSize: 'cover', backgroundPosition: 'center top',
              display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              cursor: 'pointer',
              animation: 'hFadeIn .6s ease',
            }}
          >
            {/* Dark gradient scrim from bottom */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, rgba(0,0,0,.15) 0%, rgba(0,0,0,.55) 55%, rgba(0,0,0,.82) 100%)',
            }} />

            {/* Button block */}
            <div style={{ position: 'relative', zIndex: 2, padding: '0 28px 44px' }}>
              <button onClick={e => { e.stopPropagation(); hookState.startInvestigating() }} style={{
                background: subjectColor,
                border: 'none', borderRadius: 14, padding: '16px 0',
                width: '100%', maxWidth: 400,
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800, fontSize: '1rem', letterSpacing: '.07em',
                color: '#FFF', cursor: 'pointer',
                boxShadow: `0 8px 32px rgba(0,0,0,.4)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}>
                {hook.atmosphericOpener.cta || 'START INVESTIGATING'} →
              </button>
            </div>
          </div>
        ) : (
          /* ── Fallback card atmospheric opener ── */
          <div style={{ animation: 'hFadeIn .5s ease', textAlign: 'center', padding: '20px 0 10px' }}>
            <div style={{
              position: 'relative', height: 160, borderRadius: 18, overflow: 'hidden',
              background: 'linear-gradient(180deg, #1A0E06 0%, #0A0502 60%, #050200 100%)',
              border: `1px solid ${subjectColor}20`,
              marginBottom: 24, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            }}>
              <svg viewBox="0 0 320 120" style={{ width: '100%', position: 'absolute', bottom: 0 }}>
                <ellipse cx="160" cy="80" rx="140" ry="60" fill={subjectColor} opacity="0.06" />
                {[20,45,65,88,108,132,155,178,200,222,248,272,295].map((x, i) => {
                  const h = 35 + (i % 4) * 8; const w = 8 + (i % 3) * 2
                  return (
                    <g key={i} opacity={0.4 + (i % 3) * 0.15}>
                      <circle cx={x} cy={120 - h - 6} r={w * 0.6} fill="#2A1A10" />
                      <rect x={x - w/2} y={120 - h} width={w} height={h * 0.5} rx={2} fill="#1E1208" />
                    </g>
                  )
                })}
                <rect x="0" y="118" width="320" height="2" fill="#2A1A10" />
              </svg>
              <div style={{
                position: 'relative', zIndex: 2, paddingBottom: 18,
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900, fontSize: 'clamp(1.3rem, 5vw, 1.7rem)',
                color: '#F5F0EB', letterSpacing: '-.01em', lineHeight: 1.2,
                textShadow: `0 0 40px ${subjectColor}60`,
              }}>{hook.atmosphericOpener.heading}</div>
            </div>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '.95rem', color: '#8A7A70',
              margin: '0 0 28px', letterSpacing: '.02em',
            }}>{hook.atmosphericOpener.sub}</p>
            <button onClick={hookState.startInvestigating} style={{
              background: `linear-gradient(135deg, ${subjectColor} 0%, #B84A1A 100%)`,
              border: 'none', borderRadius: 14, padding: '15px 32px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: '1rem', letterSpacing: '.08em',
              color: '#FFF8F5', cursor: 'pointer',
              boxShadow: `0 8px 32px ${subjectColor}40`,
            }}>{hook.atmosphericOpener.cta || 'START INVESTIGATING'}</button>
          </div>
        )
      )}

      {/* ── Phase: QUESTION ── */}
      {phase === 'question' && (
        <div style={{ animation: 'hFadeIn .4s ease' }}>

          {/* ══ Main TF card ══ */}
          <div style={{
            background: 'linear-gradient(160deg, #1E1409 0%, #130E05 100%)',
            border: `1px solid ${subjectColor}30`,
            borderRadius: 18, padding: '28px 20px 0',
            marginBottom: 16,
            boxShadow: `0 16px 64px rgba(0,0,0,.75), 0 0 80px ${subjectColor}06`,
          }}>
            {/* Ornamental double-ring TF badge */}
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 66, height: 66, borderRadius: '50%',
                border: `2px solid ${subjectColor}`,
                boxShadow: `0 0 0 6px ${subjectColor}15, 0 0 0 11px ${subjectColor}07`,
                background: `${subjectColor}0E`,
              }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 48, height: 48, borderRadius: '50%',
                  border: `1.5px solid ${subjectColor}45`,
                }}>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 900, fontSize: '.95rem',
                    color: subjectColor, letterSpacing: '.04em',
                  }}>TF</span>
                </div>
              </div>
            </div>

            {/* TRUE OR FALSE? label */}
            <div style={{
              textAlign: 'center',
              fontFamily: "'Inter', sans-serif",
              fontSize: '.6rem', fontWeight: 700, letterSpacing: '.24em',
              textTransform: 'uppercase', color: subjectColor,
              marginBottom: 14,
            }}>True or False?</div>

            {/* Statement */}
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1.05rem, 3.8vw, 1.25rem)',
              fontWeight: 700, color: '#F0EAE0',
              margin: '0 0 20px', lineHeight: 1.4,
              letterSpacing: '-.01em', textAlign: 'center',
            }}>{hook.statement}</p>

            {/* Thin separator */}
            <div style={{
              height: 1,
              background: `linear-gradient(90deg, transparent, ${subjectColor}28, transparent)`,
              marginBottom: 14,
            }} />

            {/* Context hint row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '0 0 18px',
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: `${subjectColor}12`,
                border: `1px solid ${subjectColor}28`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '.85rem',
              }}>{module.icon}</div>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '.78rem', fontStyle: 'italic', lineHeight: 1.45,
                color: '#8A7055',
              }}>
                {hook.scenario?.hint || hook.scenario?.location || hook.contextHint || ''}
              </span>
            </div>
          </div>

          {/* ── CHOOSE AN ANSWER divider ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
          }}>
            <div style={{ flex: 1, height: 1, background: `${subjectColor}18` }} />
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '.55rem', fontWeight: 700, letterSpacing: '.22em',
              textTransform: 'uppercase', color: `${subjectColor}65`,
              whiteSpace: 'nowrap',
            }}>Choose an answer</span>
            <div style={{ flex: 1, height: 1, background: `${subjectColor}18` }} />
          </div>

          {/* ── Stacked TRUE / FALSE buttons ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 10 }}>

            {/* TRUE */}
            <button onClick={() => setPending(true)} className="lift-tap" style={{
              width: '100%',
              background: pending === true
                ? 'linear-gradient(135deg, #1B4028, #123020)'
                : 'linear-gradient(160deg, #1C2E1E, #141E16)',
              border: `1.5px solid ${pending === true ? 'rgba(56,210,122,.6)' : 'rgba(56,180,100,.32)'}`,
              borderRadius: 14, padding: '15px 18px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
              transition: 'all .15s ease',
              boxShadow: pending === true ? '0 0 24px rgba(56,210,122,.15)' : 'none',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: pending === true ? 'rgba(56,210,122,.22)' : 'rgba(56,180,100,.12)',
                border: `1.5px solid ${pending === true ? 'rgba(56,210,122,.7)' : 'rgba(56,180,100,.5)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .15s ease',
              }}>
                <span style={{ fontSize: '.9rem', color: pending === true ? '#4DFF88' : '#56C87A', lineHeight: 1 }}>✓</span>
              </div>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800, fontSize: '1rem', letterSpacing: '.07em',
                color: pending === true ? '#4DFF88' : '#72BE88',
                transition: 'color .15s',
              }}>TRUE</span>
            </button>

            {/* FALSE */}
            <button onClick={() => setPending(false)} className="lift-tap" style={{
              width: '100%',
              background: pending === false
                ? 'linear-gradient(135deg, #3A1A1A, #281212)'
                : 'linear-gradient(160deg, #2E1C1C, #1E1414)',
              border: `1.5px solid ${pending === false ? 'rgba(255,93,115,.6)' : 'rgba(200,80,80,.32)'}`,
              borderRadius: 14, padding: '15px 18px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
              transition: 'all .15s ease',
              boxShadow: pending === false ? '0 0 24px rgba(255,93,115,.15)' : 'none',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: pending === false ? 'rgba(255,93,115,.22)' : 'rgba(200,80,80,.12)',
                border: `1.5px solid ${pending === false ? 'rgba(255,93,115,.7)' : 'rgba(200,80,80,.5)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .15s ease',
              }}>
                <span style={{ fontSize: '.9rem', color: pending === false ? '#FF5D73' : '#C85060', lineHeight: 1 }}>✗</span>
              </div>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800, fontSize: '1rem', letterSpacing: '.07em',
                color: pending === false ? '#FF5D73' : '#BE7272',
                transition: 'color .15s',
              }}>FALSE</span>
            </button>
          </div>

          {/* ── Not sure? row ── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 4px 14px', cursor: 'default',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, flexShrink: 0,
              background: `${subjectColor}10`,
              border: `1px solid ${subjectColor}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '.8rem',
            }}>🛡️</div>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '.76rem', color: '#6A5535',
              flex: 1, lineHeight: 1.4,
            }}>Not sure? Review the lesson before answering.</span>
            <span style={{ color: '#5A4828', fontSize: '.85rem' }}>›</span>
          </div>

          {/* ── CHECK ANSWER button ── */}
          <button
            disabled={pending === null}
            onClick={() => choose(pending)}
            style={{
              width: '100%',
              background: pending !== null
                ? 'linear-gradient(135deg, #C8900A 0%, #9A6508 100%)'
                : '#1A1005',
              border: pending !== null ? 'none' : `1px solid ${subjectColor}18`,
              borderRadius: 14, padding: '18px',
              cursor: pending !== null ? 'pointer' : 'default',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 900, fontSize: '1rem', letterSpacing: '.16em',
              textTransform: 'uppercase',
              color: pending !== null ? '#1A0A00' : `${subjectColor}28`,
              transition: 'all .2s ease',
              boxShadow: pending !== null ? '0 6px 32px rgba(180,130,10,.5)' : 'none',
            }}
          >
            Check Answer
          </button>
        </div>
      )}

      {/* ── Phase: FEEDBACK flash ── */}
      {phase === 'feedback' && (
        <div style={{
          textAlign: 'center', padding: '24px 0',
          animation: 'hFadeIn .2s ease',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 14 }}>
            {wasCorrect ? '🎯' : '💥'}
          </div>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 900, fontSize: '2rem', marginBottom: 14,
            color: wasCorrect ? '#4DFF88' : '#FF5D73',
            textShadow: wasCorrect ? '0 0 40px rgba(77,255,136,.5)' : '0 0 40px rgba(255,93,115,.6)',
          }}>
            {wasCorrect ? 'CORRECT' : 'NOPE'}
          </div>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.95rem', lineHeight: 1.6,
            color: wasCorrect ? '#6BFFB0' : '#FF8DA1',
            maxWidth: 300, margin: '0 auto',
          }}>
            {wasCorrect
              ? (hook.correctFeedback || "Right. Now find out why...")
              : (hook.wrongFeedback   || "That's what most people think. The numbers tell a different story...")}
          </p>
          <div style={{ marginTop: 20, color: '#4A5578', fontSize: '.78rem', fontFamily: "'Inter', sans-serif" }}>
            {hook.loadingText || 'Loading the experiment...'}
          </div>
        </div>
      )}

      {/* ── Phase: GROW (Biology willow experiment only) ── */}
      {hook.showGrow && phase === 'grow' && (
        <div style={{ animation: 'hFadeIn .4s ease' }}>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.65rem', fontWeight: 700, letterSpacing: '.14em',
            textTransform: 'uppercase', color: '#5A6480', marginBottom: 16, textAlign: 'center',
          }}>1648 — Somewhere in Belgium</div>

          {/* Willow container */}
          <div style={{
            background: 'linear-gradient(180deg, #0A1F12 0%, #061008 100%)',
            border: '1px solid rgba(56,210,122,.2)',
            borderRadius: 20, padding: '20px 16px 0',
            position: 'relative', overflow: 'hidden', marginBottom: 16,
            boxShadow: '0 8px 40px rgba(0,0,0,.5), 0 0 60px rgba(56,210,122,.05)',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 60,
              background: 'linear-gradient(180deg, rgba(56,210,122,.06) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />
            <svg viewBox="0 0 200 160" style={{ width: '100%', display: 'block' }}>
              <rect x="0" y="130" width="200" height="30" fill="#1A0E05" />
              <line x1="10" y1="130" x2="190" y2="130" stroke="rgba(139,90,43,.4)" strokeWidth="1" strokeDasharray="4 3" />
              <path d="M60 130 L55 160 L145 160 L140 130 Z" fill="#2A1A0A" stroke="rgba(139,90,43,.3)" strokeWidth="1" />

              {growStep >= 1 && (
                <rect x="97" y={130 - (growStep >= 2 ? 60 : 30)}
                  width="6" height={growStep >= 2 ? 60 : 30}
                  fill="#5C3D1A" rx="2" style={{ transition: 'all .7s ease' }}
                />
              )}
              {growStep >= 2 && (<>
                <line x1="100" y1="90" x2="70" y2="70" stroke="#5C3D1A" strokeWidth="3" strokeLinecap="round" />
                <line x1="100" y1="90" x2="130" y2="70" stroke="#5C3D1A" strokeWidth="3" strokeLinecap="round" />
                <line x1="100" y1="100" x2="75" y2="85" stroke="#5C3D1A" strokeWidth="2" strokeLinecap="round" />
                <line x1="100" y1="100" x2="125" y2="85" stroke="#5C3D1A" strokeWidth="2" strokeLinecap="round" />
              </>)}
              {growStep >= 3 && (<>
                {[[70,68],[130,68],[75,83],[125,83],[85,55],[115,55],[100,48]].map(([cx,cy],i) => (
                  <ellipse key={i} cx={cx} cy={cy} rx="10" ry="6"
                    fill="rgba(56,210,122,.75)"
                    transform={"rotate(" + (i*25-50) + " " + cx + " " + cy + ")"}
                    style={{ opacity:0, animation:"hLeafPop .35s ease " + (i*0.07) + "s forwards" }}
                  />
                ))}
                {[72,80,88,96,104,112,120,128].map((x, i) => (
                  <path key={i}
                    d={"M" + x + " " + (65+(i%3)*4) + " Q" + (x-4+i%3*2) + " " + (80+i%2*6) + " " + (x-6+i%4) + " " + (95+i%3*5)}
                    fill="none" stroke="rgba(107,255,176,.55)" strokeWidth="1.3" strokeLinecap="round"
                    style={{ opacity:0, animation:"hLeafPop .4s ease " + (0.3+i*0.06) + "s forwards" }}
                  />
                ))}
                <text x="100" y="44" textAnchor="middle" fill="#4DFF88" fontSize="9" fontWeight="bold"
                  style={{ opacity:0, animation:'hLeafPop .4s ease .85s forwards' }}>+74 kg</text>
              </>)}
              {growStep >= 2 && (
                <text x="100" y="148" textAnchor="middle" fill="rgba(139,90,43,.7)" fontSize="7">soil: −57g</text>
              )}
            </svg>

            {/* Year label inside card */}
            <div style={{
              textAlign: 'center', padding: '10px 0 14px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '.82rem', color: '#5A6480',
            }}>
              {growStep === 0 && 'Planting the sapling...'}
              {growStep === 1 && "Year 2 — it's growing"}
              {growStep === 2 && 'Year 4 — branches forming...'}
              {growStep === 3 && <span style={{ color: '#4DFF88' }}>Year 5 — 74 kg of tree. Soil lost 57g. 🤯</span>}
            </div>
          </div>

          {/* The question */}
          <div style={{
            background: '#10182B', border: '1px solid #2A3552',
            borderRadius: 14, padding: '14px 16px', textAlign: 'center',
          }}>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '1rem', color: '#F5F7FB', margin: 0,
            }}>{hook.bigQuestion || 'So where did 74 kg of tree come from?'}</p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '.78rem', color: '#5A6480', margin: '6px 0 0',
            }}>Tap Next to find out →</p>
          </div>
        </div>
      )}

      {/* ── Phase: REVEAL ── */}
      {phase === 'reveal' && (
        <div style={{ animation: 'hFadeIn .4s ease' }}>
          <div style={{ marginBottom: 18, textAlign: 'center' }}>
            {hook.revealHeader && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,93,115,.08)', border: '1px solid rgba(255,93,115,.25)',
                borderRadius: 99, padding: '5px 14px', marginBottom: 12,
              }}>
                <span style={{ fontSize: '.85rem' }}>❌</span>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '.82rem', fontWeight: 700, color: '#FF8DA1',
                }}>{hook.revealHeader}</span>
              </div>
            )}
            {!hook.revealHeader && (
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '.7rem', color: '#5A6480', margin: '0 0 8px',
                letterSpacing: '.08em', textTransform: 'uppercase',
              }}>If not the soil... then:</p>
            )}
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
              color: '#F5F7FB', margin: hook.revealHeader ? '8px 0 0' : 0, letterSpacing: '-.01em',
            }}>{hook.bigQuestion || 'Where did 74 kg come from?'}</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            {hook.revealItems?.map((item, i) => {
              const visible = i <= revealIdx
              return (
                <div key={i} style={{
                  background: visible ? (item.bg || 'rgba(56,210,122,.08)') : 'rgba(255,255,255,.02)',
                  border: '1.5px solid ' + (visible ? (item.color || 'rgba(56,210,122,.35)') : '#1E2A40'),
                  borderRadius: 16, padding: '14px 18px',
                  transition: 'all .35s ease',
                  transform: visible ? 'translateY(0)' : 'translateY(8px)',
                  opacity: visible ? 1 : 0.12,
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.emoji}</span>
                  <div>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700, fontSize: '.95rem',
                      color: visible ? (item.color || '#4DFF88') : '#2A3552',
                    }}>{item.label}</div>
                    {visible && item.detail && (
                      <div style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '.78rem', color: '#9CA8C7',
                        marginTop: 3, lineHeight: 1.5, animation: 'hFadeIn .3s ease',
                      }}>{item.detail}</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {!allRevealed ? (
            <button onClick={nextRevealItem} style={{
              width: '100%',
              background: 'rgba(56,210,122,.08)',
              border: '1.5px solid rgba(56,210,122,.3)',
              borderRadius: 14, padding: '14px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '.92rem', color: '#6BFFB0',
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              Reveal next → ({revealIdx + 2}/{hook.revealItems?.length})
            </button>
          ) : hook.punchline ? (
            <div>
              <div style={{
                background: 'linear-gradient(145deg, #0A1F12, #061008)',
                border: '1px solid rgba(56,210,122,.3)',
                borderRadius: 14, padding: '16px 18px', textAlign: 'center',
                boxShadow: '0 0 32px rgba(56,210,122,.07)',
                marginBottom: hook.revealVisual ? 14 : 0,
              }}>
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: '.95rem',
                  color: '#4DFF88', margin: 0, lineHeight: 1.5,
                }}>{hook.punchline}</p>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '.75rem', color: '#5A6480',
                  margin: '8px 0 0',
                }}>Tap Next to start learning →</p>
              </div>
              {hook.revealVisual === 'denominatorBars' && (
                <div className="fade-up" style={{
                  background: 'linear-gradient(145deg, #070E1C, #050A14)',
                  border: '1px solid rgba(75,144,255,.2)',
                  borderRadius: 14, padding: '14px',
                }}>
                  <div style={{
                    fontFamily: "'Inter', sans-serif", fontSize: '.63rem', fontWeight: 700,
                    letterSpacing: '.12em', textTransform: 'uppercase', color: '#4B90FF',
                    marginBottom: 12, textAlign: 'center',
                  }}>Bigger denominator = smaller pieces</div>
                  {[
                    { label: '1/2', num: 1, den: 2, color: '#4DFF88' },
                    { label: '1/4', num: 1, den: 4, color: '#70A8FF' },
                    { label: '1/10', num: 1, den: 10, color: '#FF8DA1' },
                  ].map(({ label, num, den, color }) => (
                    <div key={den} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <span style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700, fontSize: '.85rem', color, minWidth: 32, flexShrink: 0,
                      }}>{label}</span>
                      <div style={{
                        flex: 1, height: 28, borderRadius: 7,
                        background: '#1A2540', border: '1.5px solid #2A3A5A',
                        overflow: 'hidden', display: 'flex',
                      }}>
                        {Array.from({ length: den }, (_, i) => (
                          <div key={i} style={{
                            flex: 1,
                            background: i < num ? color + '70' : 'transparent',
                            borderRight: i < den - 1 ? '1.5px solid #2A3A5A' : 'none',
                          }} />
                        ))}
                      </div>
                      <span style={{
                        fontFamily: "'Inter', sans-serif", fontSize: '.72rem',
                        color: '#5A6480', minWidth: 50, flexShrink: 0, textAlign: 'right',
                      }}>{Math.round((num / den) * 100)}% of bar</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      <style>{`
        @keyframes hFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hLeafPop { from{opacity:0;transform:scale(.4)} to{opacity:1;transform:scale(1)} }

        /* Card lift on tap */
        .lift-tap:active { transform: translateY(-2px) scale(.995); transition: transform .1s ease; }

        /* Next button ready pulse — only when class is present */
        @keyframes nextReady {
          0%, 100% { box-shadow: 0 4px 16px var(--btn-glow, rgba(196,120,40,.4)); }
          50%       { box-shadow: 0 4px 24px var(--btn-glow, rgba(196,120,40,.6)); }
        }
        .next-ready { animation: nextReady 2s ease-in-out infinite; }

        /* Active chip soft glow pulse */
        @keyframes chipGlow {
          0%, 100% { opacity: 1; }
          50%       { opacity: .88; }
        }
        .chip-active { animation: chipGlow 3s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

// ─── IntroScreen ──────────────────────────────────────────────────────────────
// Universal second screen: retrieval starter + "this module you'll learn" list
// Reads from module.intro: { retrieval: { question, options[], correctIndex, explanation }, learningGoals[] }

function IntroScreen({ module, onDone }) {
  const intro = module.intro
  const subjectColor = module.color || '#38D27A'
  const [answered, setAnswered] = useState(null)
  const [shakeIdx, setShakeIdx] = useState(null)

  function choose(i) {
    if (answered !== null) return
    setAnswered(i)
    if (i !== intro.retrieval.correctIndex) setShakeIdx(i)
  }

  const correct = answered === intro.retrieval.correctIndex

  return (
    <div style={{
      minHeight: '100vh', background: '#080C1A',
      padding: '28px 22px 120px',
      animation: 'fadeIn .4s ease',
    }}>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: subjectColor + '15',
            border: '1px solid ' + subjectColor + '30',
            borderRadius: 99, padding: '4px 12px', marginBottom: 14,
          }}>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '.63rem', fontWeight: 700,
              letterSpacing: '.12em', textTransform: 'uppercase',
              color: subjectColor,
            }}>⚡ Retrieval Starter</span>
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800, fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
            color: '#F5F7FB', margin: '0 0 6px', letterSpacing: '-.01em',
          }}>What do you already know?</h2>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.85rem', color: '#5A6480', margin: 0,
          }}>No notes. No pressure. Just activate your brain.</p>
        </div>

        {/* Retrieval question */}
        <div style={{
          background: 'linear-gradient(145deg, #10182B, #0D1424)',
          border: '1px solid #1E2A40',
          borderRadius: 16, padding: '18px', marginBottom: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,.3)',
        }}>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600, fontSize: '1rem',
            color: '#F5F7FB', margin: 0, lineHeight: 1.45,
          }}>{intro.retrieval.question}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {intro.retrieval.options.map((opt, i) => {
            let bg = '#10182B', border = '#1E2A40', color = '#C8D0E8'
            if (answered !== null) {
              if (i === intro.retrieval.correctIndex) { bg = 'rgba(77,255,136,.08)'; border = 'rgba(77,255,136,.4)'; color = '#4DFF88' }
              else if (i === answered) { bg = 'rgba(255,93,115,.08)'; border = 'rgba(255,93,115,.35)'; color = '#FF5D73' }
            }
            return (
              <button key={i} onClick={() => choose(i)}
                disabled={answered !== null}
                style={{
                  background: bg, border: '1.5px solid ' + border,
                  borderRadius: 13, padding: '14px 16px',
                  cursor: answered !== null ? 'default' : 'pointer',
                  textAlign: 'left', fontFamily: "'Inter', sans-serif",
                  fontWeight: 500, fontSize: '.93rem', color,
                  transition: 'all .2s',
                  display: 'flex', alignItems: 'center', gap: 10,
                  animation: shakeIdx === i ? 'shake .35s ease' : 'none',
                }}>
                <span style={{ opacity: .4, flexShrink: 0, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '.8rem' }}>
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {answered !== null && (
          <div style={{ animation: 'fadeIn .3s ease', marginBottom: 24 }}>
            <div style={{
              background: correct ? 'rgba(77,255,136,.07)' : 'rgba(255,93,115,.07)',
              border: '1px solid ' + (correct ? 'rgba(77,255,136,.3)' : 'rgba(255,93,115,.3)'),
              borderRadius: 13, padding: '14px 16px', marginBottom: 20,
            }}>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '.88rem', color: correct ? '#4DFF88' : '#FF8DA1',
                margin: 0, lineHeight: 1.55,
              }}>
                <strong>{correct ? '✓ Correct. ' : '✗ Nope — '}</strong>
                {intro.retrieval.explanation}
              </p>
            </div>

            {/* Learning goals */}
            <div style={{
              background: 'linear-gradient(145deg, #10182B, #0D1424)',
              border: '1px solid #1E2A40',
              borderRadius: 18, padding: '18px 20px', marginBottom: 20,
            }}>
              <div style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '.63rem', fontWeight: 700,
                letterSpacing: '.12em', textTransform: 'uppercase',
                color: subjectColor, marginBottom: 14,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>🎯 This module — you'll be able to</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {intro.learningGoals?.map((goal, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    animation: 'fadeIn .3s ease ' + (i * 0.1) + 's both',
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                      background: subjectColor + '20',
                      border: '1px solid ' + subjectColor + '40',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '.7rem', color: subjectColor, fontWeight: 700,
                      marginTop: 1,
                    }}>{i + 1}</div>
                    <p style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '.88rem', color: '#C8D0E8',
                      margin: 0, lineHeight: 1.5,
                    }}>{goal}</p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={onDone} style={{
              width: '100%',
              background: 'linear-gradient(135deg, ' + subjectColor + 'cc, ' + subjectColor + ')',
              border: 'none', borderRadius: 16, padding: '16px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: '1rem', color: '#001A0A',
              cursor: 'pointer',
              boxShadow: '0 6px 24px ' + subjectColor + '44',
            }}>Start learning →</button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-7px)} 40%{transform:translateX(7px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
      `}</style>
    </div>
  )
}

// ─── GoalsScreen — "In this module you'll be able to…" ───────────────────────
const GOAL_ICONS = ['✏️', '💡', '🔍', '📊', '🧠', '📝', '⚡', '🎯']

function GoalsScreen({ module }) {
  const subjectColor = module.color || '#9D5CFF'
  const goals = module.intro?.learningGoals || module.learningGoals || []
  const isWarm = module.subject === 'History'
  const isSocGs = module.subject === 'Sociology'

  // Derive dark page/card palette from subject
  const pageBgGs   = isWarm ? '#0C0905' : isSocGs ? '#0C0804' : '#080C1A'
  const cardBgGs   = isWarm ? '#1A1208' : isSocGs ? '#180E06' : '#0E1628'
  const cardBorder = `1px solid ${subjectColor}22`
  const mutedText  = isWarm ? `${subjectColor}80` : isSocGs ? `${subjectColor}80` : '#4A5470'

  // Progressive reveal: one goal every 3 s
  const [visibleCount, setVisibleCount] = useState(0)
  useEffect(() => {
    if (visibleCount >= goals.length) return
    const delay = visibleCount === 0 ? 400 : 3000
    const t = setTimeout(() => setVisibleCount(c => c + 1), delay)
    return () => clearTimeout(t)
  }, [visibleCount, goals.length])

  return (
    <div style={{
      minHeight: '100vh', background: pageBgGs,
      padding: '32px 22px 120px',
      animation: 'fadeIn .4s ease',
    }}>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>

        {/* Header chip */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: subjectColor + '18', border: '1px solid ' + subjectColor + '35',
          borderRadius: 99, padding: '5px 14px', marginBottom: 18,
        }}>
          <span style={{ fontSize: '.78rem' }}>{module.icon || '🎯'}</span>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.62rem', fontWeight: 700,
            letterSpacing: '.13em', textTransform: 'uppercase',
            color: subjectColor,
          }}>Module Objectives</span>
        </div>

        {/* Heading */}
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800, fontSize: 'clamp(1.35rem, 4.5vw, 1.65rem)',
          color: '#F5F7FB', margin: '0 0 8px', letterSpacing: '-.02em', lineHeight: 1.15,
        }}>You'll be able to:</h2>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.84rem', color: mutedText,
          margin: '0 0 28px', lineHeight: 1.5,
        }}>Keep these in mind as you work through each section.</p>

        {/* Goals list — revealed one by one */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {goals.map((goal, i) => {
            const visible = i < visibleCount
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                background: cardBgGs,
                border: cardBorder,
                borderRadius: 16, padding: '14px 16px',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(14px)',
                transition: 'opacity .45s ease, transform .45s ease',
                pointerEvents: visible ? 'auto' : 'none',
              }}>
                {/* Numbered circle */}
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: subjectColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '.8rem', fontWeight: 800, color: '#000',
                  boxShadow: `0 2px 10px ${subjectColor}55`,
                }}>{i + 1}</div>

                {/* Goal text */}
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '.9rem', color: isWarm ? '#D4C4A0' : isSocGs ? '#D4B898' : '#C8D0E8',
                  margin: 0, lineHeight: 1.5, flex: 1,
                }}>{goal}</p>

                {/* Icon */}
                <span style={{
                  fontSize: '1.1rem', flexShrink: 0, opacity: .75,
                  filter: 'saturate(0) brightness(1.4)',
                }}>{GOAL_ICONS[i % GOAL_ICONS.length]}</span>
              </div>
            )
          })}
        </div>

      </div>
      <style>{`@keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  )
}

// ─── Main ModulePlayer ────────────────────────────────────────────────────────

export default function ModulePlayer({ module, onBack, initialVirtualIdx }) {
  const saved = getModuleState(module.id)

  // Build unified virtual screen list: [hook?] [goals?] [content...].
  const allVirtual = []
  if (module.hook) allVirtual.push({ kind: 'hook' })
  const goals = module.intro?.learningGoals || module.learningGoals || []
  if (goals.length > 0) allVirtual.push({ kind: 'goals' })
  module.screens.forEach((s, i) => allVirtual.push({ kind: 'content', idx: i, data: s }))
  const totalVirtual = allVirtual.length

  const [virtualIdx, setVirtualIdx] = useState(() => {
    // External deep-link takes priority; otherwise restore saved position
    if (initialVirtualIdx !== undefined && initialVirtualIdx > 0) return Math.min(initialVirtualIdx, totalVirtual - 1)
    if (saved.virtualIdx !== undefined) return saved.virtualIdx
    // Old-style screen save (pre-virtualIdx era) — only migrate if explicitly saved
    if (saved.screen !== undefined) {
      const preCount = (module.hook ? 1 : 0) + (goals.length > 0 ? 1 : 0)
      return preCount + saved.screen
    }
    return 0
  })
  const [showConfidence, setShowConfidence] = useState(false)
  const [chosenConfidence, setChosenConfidence] = useState(null)
  const [animKey, setAnimKey] = useState(0)

  const currentVirtual = allVirtual[Math.min(virtualIdx, totalVirtual - 1)] || allVirtual[0]
  const pct = Math.round(((virtualIdx + 1) / totalVirtual) * 100)
  const isLastContent = currentVirtual.kind === 'content' && currentVirtual.idx === module.screens.length - 1

  useEffect(() => {
    saveModuleState(module.id, { virtualIdx })
  }, [virtualIdx, module.id])

  function go(delta) {
    const next = Math.max(0, Math.min(totalVirtual - 1, virtualIdx + delta))
    if (next === virtualIdx) return
    setVirtualIdx(next)
    setAnimKey(k => k + 1)
    scrollToTop()
    recordActivity()
  }

  function handleFinish() {
    setShowConfidence(true)
    scrollToTop()
  }

  function handleConfidencePick(level) {
    setChosenConfidence(level)
    saveConfidenceRating(module.id, module.subject, module.title, level)
    recordActivity()
    setTimeout(() => onBack(), 650)
  }

  // Hook state — always called at top level regardless of current screen
  const hookState = useHookPhase(module.hook || {})
  const { phase: hookPhase, revealDone: hookRevealDone } = hookState

  function handleNext() {
    if (currentVirtual.kind === 'hook') {
      if (hookPhase === 'grow')   { hookState.nextFromGrow(); return }
      if (hookPhase === 'reveal') { hookRevealDone ? go(1) : hookState.nextRevealItem(); return }
      return // question/feedback: button hidden
    }
    if (currentVirtual.kind === 'goals') { go(1); return }
    isLastContent ? handleFinish() : go(1)
  }

  function nextLabel() {
    if (currentVirtual.kind === 'hook') {
      if (hookPhase === 'question' || hookPhase === 'feedback') return null
      if (hookPhase === 'grow')   return 'Next →'
      if (hookPhase === 'reveal') return hookRevealDone ? 'Next →' : null
    }
    if (currentVirtual.kind === 'goals') return "Let's go →"
    return isLastContent ? 'Finish ✓' : 'Next →'
  }

  const showNextBtn  = nextLabel() !== null
  const nextBtnLabel = nextLabel()
  const isFinishBtn  = isLastContent

  const cur = currentVirtual.kind === 'content' ? currentVirtual.data : null
  const subjectColor = module.color || '#9D5CFF'
  const isWarm     = module.subject === 'History'
  const isBio      = module.subject === 'Biology'
  const isMaths    = module.subject === 'Maths'
  const isSoc      = module.subject === 'Sociology'
  const pageBg     = isWarm ? '#0C0905' : isBio ? '#04090A' : isMaths ? '#03060E' : isSoc ? '#0C0804' : '#080C1A'
  const hdrBg      = isWarm ? 'rgba(12,9,5,.97)' : isBio ? 'rgba(4,9,10,.97)' : isMaths ? 'rgba(3,6,14,.97)' : isSoc ? 'rgba(12,8,4,.97)' : 'rgba(8,12,26,.96)'
  const cardBg     = isWarm ? '#1C1408' : isBio ? '#081410' : isMaths ? '#07101E' : isSoc ? '#1A0E07' : '#10182B'
  const borderBase = (isWarm || isBio || isMaths || isSoc) ? `${subjectColor}28` : '#1E2A40'

  // ── Confidence overlay — neutral, no colour judgement ──────────────────
  const CONFIDENCE_LEVELS = [
    {
      id: 'confused',
      emoji: '🤔',
      label: "Still figuring it out",
      sub: "That's fine — it takes more than one pass",
    },
    {
      id: 'clicking',
      emoji: '💭',
      label: "Starting to get it",
      sub: "Some bits are landing, some aren't yet",
    },
    {
      id: 'confident',
      emoji: '💡',
      label: "Got it — could explain it",
      sub: "Feels solid for now",
    },
  ]

  if (showConfidence) {
    return (
      <div style={{
        background: '#080C1A', minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 20px',
      }}>
        <div style={{ maxWidth: 400, width: '100%' }}>
          {/* Module completed banner */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18, margin: '0 auto 16px',
              background: subjectColor + '22',
              border: '1px solid ' + subjectColor + '44',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem',
              boxShadow: '0 0 32px ' + subjectColor + '22',
            }}>{module.icon}</div>
            <div style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '.65rem', fontWeight: 700, letterSpacing: '.14em',
              textTransform: 'uppercase', color: subjectColor, marginBottom: 8,
            }}>{module.subject} · Module {module.number} complete</div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: '1.5rem',
              color: '#F5F7FB', margin: '0 0 8px',
              letterSpacing: '-.02em',
            }}>How do you feel about this?</h2>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '.88rem', color: '#5A6480',
              margin: 0, lineHeight: 1.5,
            }}>
              Be honest — this shapes what you see next.
            </p>
          </div>

          {/* Confidence buttons — neutral, no colour hierarchy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CONFIDENCE_LEVELS.map(level => {
              const picked = chosenConfidence === level.id
              const dimmed = chosenConfidence !== null && !picked
              return (
                <button
                  key={level.id}
                  onClick={() => handleConfidencePick(level.id)}
                  disabled={chosenConfidence !== null}
                  style={{
                    background: picked
                      ? 'rgba(255,255,255,.07)'
                      : 'rgba(255,255,255,.02)',
                    border: '1.5px solid ' + (picked ? 'rgba(255,255,255,.25)' : '#2A3552'),
                    borderRadius: 16, padding: '18px 20px',
                    cursor: chosenConfidence ? 'default' : 'pointer',
                    textAlign: 'left',
                    display: 'flex', alignItems: 'center', gap: 14,
                    transition: 'all .2s',
                    opacity: dimmed ? 0.35 : 1,
                    transform: picked ? 'scale(1.02)' : 'scale(1)',
                    width: '100%',
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                    background: '#10182B',
                    border: '1px solid #2A3552',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.3rem',
                  }}>{level.emoji}</div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 700, fontSize: '1rem',
                      color: '#E0E6F0',
                      marginBottom: 3,
                    }}>{level.label}</div>
                    <div style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '.78rem', color: '#4A5578',
                    }}>{level.sub}</div>
                  </div>
                </button>
              )
            })}
          </div>

          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.73rem', color: '#2A3552',
            textAlign: 'center', marginTop: 20, margin: '20px 0 0',
          }}>
            Saved — used to prioritise what you revise next
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: pageBg, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Sticky top header ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: hdrBg,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${borderBase}`,
        padding: '12px 16px 0',
      }}>
        {/* Row 1: subject label + counter + exit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          {/* Module icon */}
          <div style={{
            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
            background: `${subjectColor}22`,
            border: `1px solid ${subjectColor}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '.9rem',
          }}>{module.icon}</div>

          {/* Subject + title — truncated cleanly */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '.65rem', fontWeight: 700,
              letterSpacing: '.1em', textTransform: 'uppercase',
              color: subjectColor, marginBottom: 1,
            }}>{module.subject} · Module {module.number}</div>
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '.88rem', color: '#E0E6F0',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{module.title}</div>
          </div>

          {/* Counter */}
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '.78rem', fontWeight: 700,
            color: '#4A5578', flexShrink: 0,
          }}>{virtualIdx + 1}<span style={{ color: '#2A3552' }}>/{totalVirtual}</span></div>

          {/* Exit button */}
          <button onClick={onBack} style={{
            background: 'rgba(255,255,255,.05)',
            border: '1px solid #2A3552',
            borderRadius: 8, padding: '5px 10px',
            fontFamily: "'Inter', sans-serif",
            fontSize: '.72rem', fontWeight: 600,
            color: '#4A5578', cursor: 'pointer',
            flexShrink: 0, letterSpacing: '.02em',
          }}>✕ exit</button>
        </div>

        {/* Progress bar */}
        <div style={{
          height: 3, background: '#1E2A40', borderRadius: 99,
          overflow: 'hidden', marginBottom: 10,
        }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${subjectColor}aa, ${subjectColor})`,
            borderRadius: 99,
            boxShadow: `0 0 8px ${subjectColor}66`,
            transition: 'width .5s ease',
          }} />
        </div>

        {/* Section chips — hook/goals + content sections */}
        <div style={{
          display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 10,
          scrollbarWidth: 'none', msOverflowStyle: 'none',
        }}>
          {allVirtual.map((v, vi) => {
            const isActive = vi === virtualIdx
            const isDone   = vi < virtualIdx
            const label    = v.kind === 'hook' ? 'T/F' : v.kind === 'goals' ? 'Goals' : v.data.label
            return (
              <button key={vi}
                className={isActive ? 'chip-active' : ''}
                onClick={() => {
                  setVirtualIdx(vi)
                  setAnimKey(k => k + 1)
                  scrollToTop()
                }}
                style={{
                  flexShrink: 0,
                  background: isActive
                    ? subjectColor
                    : isDone
                    ? (isWarm ? 'rgba(196,120,40,.15)' : isBio ? `${subjectColor}18` : isMaths ? `${subjectColor}18` : isSoc ? `${subjectColor}18` : 'rgba(77,255,136,.1)')
                    : (isWarm ? '#1C1205' : isBio ? '#081410' : isMaths ? '#07101E' : isSoc ? '#1A0E07' : '#10182B'),
                  border: `1px solid ${isActive ? subjectColor : isDone ? (isWarm ? 'rgba(196,120,40,.35)' : isBio ? `${subjectColor}35` : isMaths ? `${subjectColor}35` : isSoc ? `${subjectColor}35` : 'rgba(77,255,136,.3)') : (isWarm ? 'rgba(196,120,40,.15)' : isBio ? `${subjectColor}18` : isMaths ? `${subjectColor}18` : isSoc ? `${subjectColor}18` : '#2A3552')}`,
                  borderRadius: 99,
                  padding: '5px 12px',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '.7rem', fontWeight: 600,
                  color: isActive ? '#fff' : isDone ? (isWarm ? `${subjectColor}CC` : isBio ? `${subjectColor}CC` : isMaths ? `${subjectColor}CC` : isSoc ? `${subjectColor}CC` : '#4DFF88') : '#4A5578',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  letterSpacing: '.01em',
                  boxShadow: isActive ? `0 0 14px ${subjectColor}70` : 'none',
                  transition: 'all .2s',
                }}>
                {isDone ? '✓ ' : ''}{label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Screen content ── */}
      <div id="module-scroll-container" style={{ flex: 1, padding: '20px 18px 120px', maxWidth: 660, margin: '0 auto', width: '100%' }}>
        {currentVirtual.kind === 'hook' && (
          <HookContent module={module} hook={module.hook} hookState={hookState} subjectColor={subjectColor} />
        )}
        {currentVirtual.kind === 'goals' && (
          <GoalsScreen module={module} />
        )}
        {currentVirtual.kind === 'content' && (
          <div key={animKey} className="anim-pop">
            <Screen screen={cur} subject={module.subject} />
          </div>
        )}
      </div>

      {/* ── Bottom navigation ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
        background: isWarm ? 'rgba(12,9,5,.97)' : isBio ? 'rgba(4,9,10,.97)' : isMaths ? 'rgba(3,6,14,.97)' : isSoc ? 'rgba(12,8,4,.97)' : 'rgba(8,12,26,.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: isWarm ? '1px solid rgba(196,120,40,.2)' : isBio ? '1px solid rgba(56,210,122,.2)' : isMaths ? '1px solid rgba(75,144,255,.2)' : isSoc ? '1px solid rgba(217,96,48,.2)' : '1px solid #1E2A40',
        padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        boxShadow: '0 -8px 32px rgba(0,0,0,.4)',
      }}>
        <div style={{
          maxWidth: 660, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, alignItems: 'center',
        }}>
          {/* Back — disabled on first screen and during hook question/feedback */}
          {(() => {
            const backDisabled = virtualIdx === 0 || (currentVirtual.kind === 'hook' && (hookPhase === 'question' || hookPhase === 'feedback' || hookPhase === 'atmospheric'))
            return (
              <button
                onClick={() => go(-1)}
                disabled={backDisabled}
                style={{
                  background: isWarm ? 'rgba(255,255,255,.03)' : isBio ? 'rgba(255,255,255,.03)' : isMaths ? 'rgba(255,255,255,.03)' : '#10182B',
                  border: isWarm ? '1px solid rgba(196,120,40,.18)' : isBio ? '1px solid rgba(56,210,122,.18)' : isMaths ? '1px solid rgba(75,144,255,.18)' : '1px solid #2A3552',
                  borderRadius: 14, padding: '13px 10px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: '.9rem',
                  color: isWarm ? (backDisabled ? '#3A2810' : '#8A7055') : isBio ? (backDisabled ? '#1A3825' : '#4A7A58') : isMaths ? (backDisabled ? '#0D1A38' : '#4A78A8') : (backDisabled ? '#2A3552' : '#9CA8C7'),
                  cursor: backDisabled ? 'default' : 'pointer',
                  transition: 'all .15s',
                }}>← Back</button>
            )
          })()}

          {/* Save + Exit */}
          <button onClick={onBack} style={{
            background: isBio ? 'transparent' : isWarm ? 'transparent' : isMaths ? 'transparent' : '#10182B',
            border: isBio ? '1px solid rgba(56,210,122,.15)' : isWarm ? '1px solid rgba(196,120,40,.15)' : isMaths ? '1px solid rgba(75,144,255,.15)' : '1px solid #2A3552',
            borderRadius: 14, padding: '13px 10px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: '.82rem',
            color: isBio ? '#2A5A38' : isWarm ? '#5A4020' : isMaths ? '#1A3A6A' : '#5A6480', cursor: 'pointer',
            lineHeight: 1.3, textAlign: 'center',
          }}>Save +{'\n'}Exit</button>

          {/* Next / Finish — dynamic based on hook/intro phase */}
          {showNextBtn ? (
            <button
              onClick={handleNext}
              className={!isFinishBtn && showNextBtn && virtualIdx > 0 ? 'next-ready' : ''}
              style={{
                '--btn-glow': isWarm ? 'rgba(196,120,40,.4)' : `${subjectColor}66`,
                background: isFinishBtn
                  ? 'linear-gradient(135deg, #1A4D2E, #38D27A)'
                  : isWarm
                  ? 'linear-gradient(135deg, #C47828, #9A6010)'
                  : `linear-gradient(135deg, ${subjectColor}cc, ${subjectColor})`,
                border: 'none',
                borderRadius: 14, padding: '13px 10px',
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '.9rem',
                color: '#fff',
                cursor: 'pointer',
                boxShadow: isFinishBtn
                  ? '0 4px 16px rgba(56,210,122,.35)'
                  : isWarm
                  ? '0 4px 16px rgba(196,120,40,.4)'
                  : `0 4px 16px ${subjectColor}44`,
                transition: 'all .15s',
              }}>{nextBtnLabel}</button>
          ) : (
            <div style={{ background: isBio ? 'transparent' : isWarm ? 'transparent' : isMaths ? 'transparent' : '#10182B', border: isBio ? '1px solid rgba(56,210,122,.1)' : isWarm ? '1px solid rgba(196,120,40,.1)' : isMaths ? '1px solid rgba(75,144,255,.1)' : '1px solid #1E2A40', borderRadius: 14, padding: '13px 10px' }} />
          )}
        </div>
      </div>
    </div>
  )
}
