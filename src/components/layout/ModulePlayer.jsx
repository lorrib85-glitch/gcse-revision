import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { hexToRgb } from '../../constants/subjects.js'
import { recordActivity, recordScore } from '../../progress.js'
import ExamQuestionFrame from '../feedback/ExamQuestionFrame.jsx'
import ExplainReveal from '../learning/ExplainReveal.jsx'
import ChapterHookScreen from './ChapterHookScreen.jsx'
import QuickRecallScreen from '../learning/QuickRecallScreen.jsx'
import TieredQuizScreen from '../learning/TieredQuizScreen.jsx'
import CinematicRevealMoment from '../learning/CinematicRevealMoment.jsx'
import ConceptReveal from '../learning/ConceptReveal.jsx'
import LearningHeader from '../core/LearningHeader.jsx'
import FaceTheExaminer from '../learning/FaceTheExaminer.jsx'
import GuidedExamResponse from '../learning/GuidedExamResponse.jsx'
import InteractiveHotspotImage from '../learning/InteractiveHotspotImage.jsx'
import FillInTheBlanksBlock from '../learning/FillInTheBlanksBlock.jsx'
import AnswerInteraction from '../core/AnswerInteraction.jsx'
import RetrievalFrame from '../feedback/RetrievalFrame.jsx'
import WeakSpotRecovery from '../learning/WeakSpotRecovery.jsx'
import RecoveryQuizPlayer from '../learning/RecoveryQuizPlayer.jsx'
import CardContainer from '../core/CardContainer.jsx'
import GuidedChoiceCarousel from '../learning/GuidedChoiceCarousel.jsx'
import VisualNarrativeScreen from '../learning/VisualNarrativeScreen.jsx'
import TimelineChain, { TimelineChainBlock } from '../learning/TimelineChain.jsx'
import ChapterOutcomeScreen from './ChapterOutcomeScreen.jsx'
import TheoryCompareBlock from '../learning/TheoryCompareBlock.jsx'
import GraphView from '../learning/GraphView.jsx'
import ColSortBlock from '../learning/ColSortBlock.jsx'
import SpotTheError from '../learning/SpotTheError.jsx'
import MisconceptionCheck from '../learning/MisconceptionCheck.jsx'
import ExaminerExplainsScreen from '../learning/ExaminerExplainsScreen.jsx'
import SwipeSort from '../learning/SwipeSort.jsx'
import GalensDiagnostic from '../learning/GalensDiagnostic.jsx'
import TheoryLab from '../learning/TheoryLab.jsx'
import VisualLearning from '../learning/VisualLearning.jsx'
import KeyFigureReveal from '../learning/KeyFigureReveal.jsx'
import InteractiveCollectionExplorer from '../learning/InteractiveCollectionExplorer.jsx'
import MedicalTheoryPrescription from '../learning/MedicalTheoryPrescription.jsx'
import MatchingTask from '../learning/MatchingTask.jsx'
import PriorKnowledgeRecall from '../learning/PriorKnowledgeRecall.jsx'
import SymptomProgression from '../learning/SymptomProgression.jsx'

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

function ReadBlock({ block }) {
  return (
    <div>
      {block.label && (
        <div style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em',
          textTransform: 'uppercase', color: '#70B8FF', marginBottom: 12,
        }}>{block.label}</div>
      )}
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '.95rem', lineHeight: 1.7, margin: 0, color: '#C8D0E8',
      }} dangerouslySetInnerHTML={{ __html: block.text }} />
    </div>
  )
}

function KeypointBlock({ block }) {
  return (
    <div>
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em',
        textTransform: 'uppercase', color: '#9D5CFF', marginBottom: 12,
      }}>⭐ Key Point</div>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '.95rem', lineHeight: 1.65, margin: 0, color: '#E0E6F0',
      }} dangerouslySetInnerHTML={{ __html: block.text }} />
    </div>
  )
}

function FunFactBlock({ block }) {
  return (
    <div>
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em',
        textTransform: 'uppercase', color: '#FFC857', marginBottom: 10,
      }}>{block.label || '🤯 Fun Fact'}</div>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '.92rem', margin: 0, color: '#C8D0E8', lineHeight: 1.65,
      }}>{block.text}</p>
    </div>
  )
}

function ExamTipBlock({ block }) {
  return (
    <div>
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em',
        textTransform: 'uppercase', color: '#F5B700', marginBottom: 12,
      }}>{block.label || '🗡️ Exam Assassin'}</div>
      {block.text && (
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.9rem', margin: '0 0 12px 0', color: '#C8D0E8', lineHeight: 1.65,
        }} dangerouslySetInnerHTML={{ __html: block.text }} />
      )}
      {block.tip && (
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '.9rem', marginBottom: block.phrases ? 12 : 0, color: '#C8D0E8', lineHeight: 1.65,
        }} dangerouslySetInnerHTML={{ __html: block.tip }} />
      )}
      {block.phrases && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
          {block.phrases.map(p => (
            <span key={p} style={{
              background: 'rgba(245,183,0,.12)', border: '1px solid rgba(245,183,0,.3)',
              color: '#F5B700', borderRadius: 8, padding: '5px 11px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '.78rem', fontWeight: 600,
            }}>{p}</span>
          ))}
        </div>
      )}
    </div>
  )
}

function TimelineBlock({ block }) {
  const [open, setOpen] = useState(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '14px 0' }}>
      {block.events.map((e, i) => (
        <div key={i}>
          <button onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', display: 'grid', gridTemplateColumns: '72px 1fr',
              gap: 10, border: 'none', background: 'transparent', cursor: 'pointer',
              textAlign: 'left', padding: 0,
            }}>
            <div style={{
              background: open === i ? '#F5B700' : '#1A2338',
              color: open === i ? '#070500' : '#F5B700',
              border: `1px solid ${open === i ? '#F5B700' : '#2A3552'}`,
              borderRadius: 12, display: 'grid', placeItems: 'center',
              fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '.8rem', padding: '10px 6px', minHeight: 56, transition: 'all .2s',
            }}>{e.year}</div>
            <div style={{
              background: open === i ? 'rgba(245,183,0,.06)' : '#10182B',
              border: `1px solid ${open === i ? 'rgba(245,183,0,.3)' : '#2A3552'}`,
              borderRadius: 12, padding: '12px 14px', transition: 'all .2s',
              display: 'flex', alignItems: 'center',
            }}>
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '.9rem', fontWeight: 500, color: '#C8D0E8',
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

function FlashcardsBlock({ block }) {
  const [flipped, setFlipped] = useState(new Set())
  function toggle(i) {
    setFlipped(s => { const n = new Set(s); n.has(i) ? n.delete(i) : n.add(i); return n })
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '14px 0' }}>
      {block.cards.map((c, i) => (
        <button key={i} onClick={() => toggle(i)}
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

// ─── Single screen renderer ───────────────────────────────────────────────────

function Screen({ screen, subject, onScreenComplete }) {
  const [completedQuizzes, setCompletedQuizzes] = useState(new Set())

  function handleQuizComplete(blockIndex) {
    setCompletedQuizzes(prev => new Set([...prev, blockIndex]))
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{
          display: 'inline-flex',
          background: 'rgba(157,92,255,.12)',
          border: '1px solid rgba(157,92,255,.25)',
          color: '#C18CFF',
          borderRadius: 99, padding: '4px 12px',
          fontFamily: "'Inter', sans-serif",
          fontSize: '.68rem', fontWeight: 700,
          letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12,
        }}>{screen.kicker}</div>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(1.3rem, 4vw, 1.75rem)',
          marginBottom: 8, color: '#F5F7FB',
          fontWeight: 700, letterSpacing: '-.01em', lineHeight: 1.2,
        }}>{screen.heading}</h2>
        {screen.sub && (
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '.9rem', color: '#5A6480', lineHeight: 1.6, margin: 0,
          }}>{screen.sub}</p>
        )}
      </div>

      {(screen.blocks || []).map((block, i) => (
        <div key={i}>
          {block.type === 'read'          && <CardContainer variant="contained" subject={subject} padding={24}><ReadBlock block={block} /></CardContainer>}
          {block.type === 'keypoint'      && <CardContainer variant="contained" subject={subject} padding={24}><KeypointBlock block={block} /></CardContainer>}
          {block.type === 'funfact'       && <CardContainer variant="contained" subject={subject} padding={20}><FunFactBlock block={block} /></CardContainer>}
          {block.type === 'examtip'       && <CardContainer variant="contained" subject={subject} padding={24}><ExamTipBlock block={block} /></CardContainer>}
          {block.type === 'timeline'      && <TimelineBlock block={block} />}
          {block.type === 'reveal'        && <RevealBlock block={block} />}
          {block.type === 'quiz'          && <AnswerInteraction block={{...block, explanation: undefined}} subject={subject} onComplete={() => handleQuizComplete(i)} />}
          {block.type === 'flashcards'    && <FlashcardsBlock block={block} />}
          {block.type === 'hotspot'       && <HotspotBlock block={block} />}
          {block.type === 'misconception' && <MisconceptionBlock block={block} />}
          {block.type === 'scarf'         && <ScarfBlock block={block} />}
          {block.type === 'builder'       && <BuilderBlock block={block} />}
          {block.type === 'scenario'      && <ScenarioBlock block={block} />}
          {block.type === 'boss'          && <ExamQuestionFrame block={block} subject={subject} mode="practice" onSkip={onScreenComplete} />}
          {block.type === 'explainReveal' && <ExplainReveal block={block} subject={subject} onComplete={onScreenComplete} />}
          {block.type === 'fillblanks'    && <FillInTheBlanksBlock block={block} subject={subject} />}
          {block.type === 'theoryCompare' && <TheoryCompareBlock block={block} subject={subject} />}
          {block.type === 'graphView'     && <GraphView block={block} subject={subject} />}
          {block.type === 'timelineChain' && <TimelineChainBlock block={block} subject={subject} />}
          {block.type === 'colsort'       && <ColSortBlock block={block} subject={subject} />}
          {block.type === 'spotTheError'  && <SpotTheError block={block} subject={subject} onContinue={onScreenComplete} />}
          {block.type === 'misconceptionCheck' && <MisconceptionCheck block={block} subject={subject} onContinue={onScreenComplete} />}
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
  // phases: 'question' | 'feedback' | 'grow' | 'reveal'
  const [phase, setPhase]         = useState('question')
  const [chosenTrue, setChosenTrue] = useState(null)
  const [growStep, setGrowStep]   = useState(0)
  const [revealIdx, setRevealIdx] = useState(-1)

  function choose(tappedTrue) {
    setChosenTrue(tappedTrue)
    setPhase('feedback')
    // After 1.4s flash, auto-advance to grow and begin stepping
    setTimeout(() => {
      setPhase('grow')
      let step = 0
      // Step every 900ms so each stage is clearly visible
      const iv = setInterval(() => {
        step++
        setGrowStep(step)
        if (step >= 3) clearInterval(iv)
        // No auto-advance to reveal — user controls that via Next button
      }, 900)
    }, 1400)
  }

  function nextFromGrow()   { setPhase('reveal') }
  function nextRevealItem() { setRevealIdx(i => i + 1) }

  const wasCorrect   = chosenTrue === hook?.isTrue
  const allRevealed  = revealIdx >= (hook?.revealItems?.length || 0) - 1
  const canAdvance   = phase === 'grow'    // Next button advances grow → reveal
  const revealDone   = phase === 'reveal' && allRevealed

  return { phase, chosenTrue, wasCorrect, growStep, revealIdx, allRevealed,
           canAdvance, revealDone, choose, nextFromGrow, nextRevealItem }
}

function HookContent({ module, hook, hookState, subjectColor }) {
  const { phase, wasCorrect, growStep, revealIdx, allRevealed, choose, nextRevealItem } = hookState

  // Support both storyLines (new format) and scenario (legacy format)
  const storyLines = hook.storyLines || (() => {
    if (!hook.scenario) return []
    const s = hook.scenario
    const lines = []
    if (s.location) lines.push(s.location + '.')
    if (s.hint) lines.push(s.hint)
    if (s.items) s.items.forEach(item => lines.push('— ' + item))
    return lines
  })()

  return (
    <div style={{ paddingBottom: 20 }}>

      {/* ── Phase: QUESTION ── */}
      {phase === 'question' && (
        <div style={{ animation: 'hFadeIn .4s ease' }}>
          {/* Story context */}
          <div style={{ marginBottom: 20 }}>
            {storyLines.map((line, i) => (
              <p key={i} style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '.88rem', color: i === storyLines.length - 1 ? '#C8D0E8' : '#5A6480',
                margin: '0 0 5px', lineHeight: 1.65,
                fontWeight: i === storyLines.length - 1 ? 500 : 400,
              }}>{line}</p>
            ))}
          </div>

          {/* Statement card */}
          <div style={{
            background: 'linear-gradient(145deg, #10182B, #0D1424)',
            border: '1px solid #2A3552',
            borderRadius: 18, padding: '22px 22px',
            marginBottom: 24, textAlign: 'center',
            boxShadow: '0 8px 40px rgba(0,0,0,.4)',
          }}>
            <div style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '.6rem', fontWeight: 700, letterSpacing: '.14em',
              textTransform: 'uppercase', color: '#4A5578', marginBottom: 12,
            }}>True or False?</div>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(1.05rem, 3.5vw, 1.3rem)',
              fontWeight: 700, color: '#F5F7FB',
              margin: 0, lineHeight: 1.35, letterSpacing: '-.01em',
            }}>{hook.statement}</p>
          </div>

          {/* Big TRUE / FALSE buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button onClick={() => choose(true)} style={{
              background: 'linear-gradient(145deg, #0D2B1A, #0A2015)',
              border: '2px solid rgba(77,255,136,.4)',
              borderRadius: 18, padding: '20px 10px',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 8, transition: 'transform .12s',
              boxShadow: '0 4px 24px rgba(77,255,136,.1)',
            }}>
              <span style={{ fontSize: '2rem' }}>✅</span>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900, fontSize: '1.25rem',
                color: '#4DFF88', letterSpacing: '.04em',
              }}>TRUE</span>
            </button>
            <button onClick={() => choose(false)} style={{
              background: 'linear-gradient(145deg, #2B0D0D, #200A0A)',
              border: '2px solid rgba(255,93,115,.4)',
              borderRadius: 18, padding: '20px 10px',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 8, transition: 'transform .12s',
              boxShadow: '0 4px 24px rgba(255,93,115,.1)',
            }}>
              <span style={{ fontSize: '2rem' }}>❌</span>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 900, fontSize: '1.25rem',
                color: '#FF5D73', letterSpacing: '.04em',
              }}>FALSE</span>
            </button>
          </div>
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
            Loading the experiment...
          </div>
        </div>
      )}

      {/* ── Phase: GROW ── */}
      {phase === 'grow' && (
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
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '.7rem', color: '#5A6480', margin: '0 0 8px',
              letterSpacing: '.08em', textTransform: 'uppercase',
            }}>If not the soil... then:</p>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 800, fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
              color: '#F5F7FB', margin: 0, letterSpacing: '-.01em',
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
            <div style={{
              background: 'linear-gradient(145deg, #0A1F12, #061008)',
              border: '1px solid rgba(56,210,122,.3)',
              borderRadius: 14, padding: '16px 18px', textAlign: 'center',
              boxShadow: '0 0 32px rgba(56,210,122,.07)',
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
          ) : null}
        </div>
      )}

      <style>{`
        @keyframes hFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes hLeafPop { from{opacity:0;transform:scale(.4)} to{opacity:1;transform:scale(1)} }
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
  const [retrievalComplete, setRetrievalComplete] = useState(false)

  const hasRetrieval = !!intro.retrieval

  // When there's no retrieval question, show goals immediately
  const showGoals = !hasRetrieval || retrievalComplete

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
            }}>{hasRetrieval ? '⚡ Retrieval Starter' : '🎯 Module Overview'}</span>
          </div>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800, fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
            color: '#F5F7FB', margin: '0 0 6px', letterSpacing: '-.01em',
          }}>{hasRetrieval ? 'What do you already know?' : "You'll be able to…"}</h2>
          {hasRetrieval && (
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '.85rem', color: '#5A6480', margin: 0,
            }}>No notes. No pressure. Just activate your brain.</p>
          )}
        </div>

        {/* RetrievalFrame v1 — wraps retrieval question and AnswerInteraction */}
        {hasRetrieval && (
          <RetrievalFrame
            retrieval={intro.retrieval}
            variant="contained"
            subject={module.subject}
            topic={module.title}
            beatId="intro"
            label="Quick check"
            mode="learning"
            onInteractionComplete={(result) => setRetrievalComplete(true)}
          />
        )}

        {/* Learning goals — shown immediately when no retrieval, or after answering */}
        {showGoals && (
          <div style={{ animation: 'fadeIn .3s ease' }}>
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

// ─── What You Will Learn screen ──────────────────────────────────────────────

function WYLScreen({ module, onDone, subjectColor }) {
  const bullets = (module.screens || []).map(s => s.label).filter(Boolean)
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    if (visibleCount >= bullets.length) return
    const t = setTimeout(() => setVisibleCount(c => c + 1), 380)
    return () => clearTimeout(t)
  }, [visibleCount, bullets.length])

  return (
    <div style={{ padding: '8px 4px' }}>
      <style>{`@keyframes bulletIn { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }`}</style>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: subjectColor, marginBottom: 10 }}>{module.subject}</div>
      <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 26, fontWeight: 800, color: '#F5F7FF', lineHeight: '30px', marginBottom: 6, letterSpacing: '-0.01em' }}>What You&rsquo;ll Learn</div>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.42)', marginBottom: 30 }}>{module.title}</div>
      <div>
        {bullets.map((label, i) => i < visibleCount ? (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16, animation: 'bulletIn 0.38s ease both' }}>
            <div style={{ width: 30, height: 30, borderRadius: 10, background: `${subjectColor}18`, border: `1px solid ${subjectColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: subjectColor }}>{i + 1}</span>
            </div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 600, color: '#E8ECF2', lineHeight: '26px', paddingTop: 3 }}>{label}</div>
          </div>
        ) : null)}
      </div>
      {visibleCount >= bullets.length && (
        <button onClick={onDone} style={{ marginTop: 24, width: '100%', height: 52, borderRadius: 16, background: `linear-gradient(135deg, ${subjectColor}cc, ${subjectColor})`, border: 'none', cursor: 'pointer', fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 16, color: '#fff', boxShadow: `0 8px 24px ${subjectColor}44`, animation: 'bulletIn 0.38s ease both' }}>
          Let&rsquo;s start →
        </button>
      )}
    </div>
  )
}

// ─── Chapter jump sheet ───────────────────────────────────────────────────────

function JumpSheet({ screens, currentScreen, accent, accentRgb, onJumpTo, onClose }) {
  const labeled = screens.filter(s => s.label)

  return (
    <>
      <style>{`
        @keyframes js-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .js-row:hover { background: rgba(${accentRgb},0.07) !important; }
        .js-row:active { background: rgba(${accentRgb},0.14) !important; }
        .js-close:hover { background: rgba(255,255,255,0.10) !important; }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(0,0,0,0.54)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
        }}
      />

      {/* Dropdown sheet */}
      <div style={{
        position: 'fixed',
        top: 'calc(66px + env(safe-area-inset-top, 0px))',
        left: 12, right: 12,
        maxHeight: 'min(72vh, 540px)',
        background: 'rgba(9,12,22,0.97)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: `1px solid rgba(${accentRgb},0.16)`,
        borderRadius: 20,
        zIndex: 2001,
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        boxShadow: `0 8px 48px rgba(0,0,0,0.64), 0 0 0 1px rgba(${accentRgb},0.06)`,
        animation: 'js-in 200ms cubic-bezier(.16,1,.3,1) both',
      }}>

        {/* Header */}
        <div style={{
          padding: '14px 18px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{
              fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700,
              color: 'rgba(255,255,255,0.84)', letterSpacing: '-0.01em',
            }}>Chapter contents</span>
            <span style={{
              fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 500,
              color: `rgba(${accentRgb},0.56)`,
            }}>{labeled.length} sections</span>
          </div>
          <button
            className="js-close"
            onClick={onClose}
            aria-label="Close contents"
            style={{
              width: 28, height: 28, borderRadius: 14,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(255,255,255,0.42)', fontSize: 13,
              fontFamily: 'sans-serif', lineHeight: 1,
            }}
          >✕</button>
        </div>

        {/* Screen list */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '4px 0 8px' }}>
          {screens.map((s, i) => {
            if (!s.label) return null
            const isCurrent = i === currentScreen
            return (
              <button
                key={i}
                className="js-row"
                onClick={() => onJumpTo(i)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '9px 18px',
                  background: isCurrent ? `rgba(${accentRgb},0.09)` : 'none',
                  border: 'none',
                  borderLeft: isCurrent ? `3px solid ${accent}` : '3px solid transparent',
                  cursor: 'pointer', textAlign: 'left',
                  transition: 'background 100ms ease',
                }}
              >
                <span style={{
                  fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 700,
                  color: `rgba(${accentRgb},${isCurrent ? '0.90' : '0.36'})`,
                  letterSpacing: '0.06em', minWidth: 22, flexShrink: 0,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{
                  fontFamily: "'Sora', sans-serif", fontSize: 14,
                  fontWeight: isCurrent ? 600 : 400,
                  color: isCurrent ? '#EAF7F0' : 'rgba(255,255,255,0.56)',
                  flex: 1,
                }}>
                  {s.label}
                </span>
                {s.stage && (
                  <span style={{
                    fontFamily: "'Sora', sans-serif", fontSize: 9, fontWeight: 600,
                    color: `rgba(${accentRgb},0.50)`,
                    letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0,
                  }}>
                    {s.stage}
                  </span>
                )}
                {isCurrent && (
                  <span style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: accent, flexShrink: 0,
                    boxShadow: `0 0 6px ${accent}`,
                  }} />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}

// ─── Main ModulePlayer ────────────────────────────────────────────────────────

export default function ModulePlayer({ module, onBack, onChapterComplete }) {
  const saved   = getModuleState(module.id)

  // hookDone / wylDone / introDone track whether the universal openers have been seen
  // We persist these inside the module state so resuming skips them correctly
  const [hookDone,   setHookDone]   = useState(() => saved.hookDone   || !module.hook)
  const [wylDone,    setWylDone]    = useState(() => saved.wylDone ?? !module.outcomes)
  // If user already has hookDone+wylDone saved (i.e. they've been to content before),
  // treat recallDone as true to avoid forcing recall on existing progress.
  const [recallDone, setRecallDone] = useState(() =>
    saved.recallDone || !module.recall || !!(saved.hookDone && saved.wylDone)
  )
  const [introDone,  setIntroDone]  = useState(true)
  // navTo — in-memory only, drives navigation back to hook/wyl/recall without changing "done" flags
  // null | 'hook' | 'wyl' | 'recall'
  const [navTo, setNavTo] = useState(null)
  const [screen, setScreen] = useState(() => {
    const s = saved.screen || 0
    // Guard against stale saved index (e.g. after a module restructure)
    return s < module.screens.length ? s : 0
  })
  const [showWeakSpotRecovery, setShowWeakSpotRecovery] = useState(false)
  const [detectedWeakSpot, setDetectedWeakSpot] = useState(null)
  const [recoveryQuizId, setRecoveryQuizId] = useState(null)
  const [showExaminer,         setShowExaminer]         = useState(false)
  const [showExaminerExplains, setShowExaminerExplains] = useState(false)
  const [examinerAttempts, setExaminerAttempts] = useState(() => saved.examinerAttempts || [])
  // Sticks once a module has been finished — re-entering to review never un-completes it
  const [completed, setCompleted] = useState(() => saved.completed || false)
  const total   = module.screens.length
  const pct     = Math.round(((screen + 1) / total) * 100)
  const isLast  = screen === total - 1
  const [animKey, setAnimKey] = useState(0)
  const [cinematicHeaderVisible, setCinematicHeaderVisible] = useState(false)
  const [ihmExploreScreen, setIhmExploreScreen] = useState(null)
  const [jumpOpen, setJumpOpen] = useState(false)
  const [selectedHealer, setSelectedHealer] = useState(null)

  useEffect(() => {
    saveModuleState(module.id, { screen, hookDone, wylDone, recallDone, introDone, examinerAttempts, completed })
  }, [screen, module.id, hookDone, wylDone, recallDone, introDone, examinerAttempts, completed])

  // Reset cinematic header visibility whenever we navigate to a different screen
  useEffect(() => { setCinematicHeaderVisible(false) }, [screen])

  function go(delta) {
    const next = Math.max(0, Math.min(total - 1, screen + delta))
    setScreen(next)
    setAnimKey(k => k + 1)
    scrollToTop()
    recordActivity()
    setJumpOpen(false)
  }

  function goTo(idx) {
    const next = Math.max(0, Math.min(total - 1, idx))
    setScreen(next)
    setAnimKey(k => k + 1)
    scrollToTop()
    recordActivity()
    setJumpOpen(false)
  }

  function handleFinish() {
    if (module.examinerExplains && !showExaminerExplains) {
      setShowExaminerExplains(true)
      scrollToTop()
      return
    }
    if (module.examiner) {
      setShowExaminer(true)
    } else {
      detectWeakSpot()
    }
    scrollToTop()
  }

  function detectWeakSpot() {
    // V1: Simple heuristic-based weak spot detection
    // For now, no actual weak spot — just proceed to completion
    // This is where we'd integrate actual score analysis in future versions
    completeModule()
  }

  function completeModule() {
    recordActivity()
    setCompleted(true)
    // Persist full completion with a sticky `completed` flag so SubjectBrowser always reads this
    // module as 'completed' — even while reviewing it afterwards moves `screen` back down. Keep
    // the intro flags true so re-opening reviews the content straight away rather than replaying
    // the hook/recall/outcomes screens.
    saveModuleState(module.id, { screen: total, hookDone: true, wylDone: true, recallDone: true, introDone: true, examinerAttempts, completed: true })
    setTimeout(() => {
      if (onChapterComplete) onChapterComplete(module)
      else onBack()
    }, 400)
  }

  // Hook state — always called (hook is undefined when module has no hook)
  const hookState = useHookPhase(module.hook || {})
  const { phase: hookPhase, canAdvance: hookCanAdvance, revealDone: hookRevealDone } = hookState

  // Determine what the "Next" button does at each stage
  function handleNext() {
    if (!hookDone && module.hook) {
      if (hookPhase === 'grow')   { hookState.nextFromGrow(); return }
      if (hookPhase === 'reveal') { if (hookRevealDone) { setHookDone(true); scrollToTop() } else { hookState.nextRevealItem(); } return }
      return // question / feedback: Next does nothing — user must tap TRUE/FALSE
    }
    if (!introDone && module.intro) return // IntroScreen has its own button
    isLast ? handleFinish() : go(1)
  }

  // Label + disabled state for the Next/Finish button
  function nextLabel() {
    if (!hookDone && module.hook) {
      if (hookPhase === 'question' || hookPhase === 'feedback') return null // hidden
      if (hookPhase === 'grow')   return 'Next →'
      if (hookPhase === 'reveal') return hookRevealDone ? 'Start module →' : null // hidden until all revealed
    }
    if (!introDone && module.intro) return null // IntroScreen has its own button
    if ((module.screens[screen]?.blocks || []).some(b => b.type === 'spotTheError' || b.type === 'misconceptionCheck')) return null // these gate their own continue button
    return isLast ? 'Finish ✓' : 'Next →'
  }

  const showNextBtn  = nextLabel() !== null
  const nextBtnLabel = nextLabel()
  const isFinishBtn  = !(!hookDone && module.hook) && wylDone && recallDone && navTo === null && (!module.intro || introDone) && isLast

  const cur = module.screens[screen]
  const subjectColor = module.color || '#9D5CFF'

  // ── Stage-based learning header ───────────────────────────────────────────
  const STAGE_NAMES = ['Intro', 'Hippocrates', 'Galen', 'Medieval treatments', 'Rational vs supernatural', 'Exam prep']
  const currentStage = (() => {
    if (navTo === 'recall' || (!recallDone && module.recall)) return 'Discover'
    if (cur?.stage) return cur.stage
    // Proportional fallback for legacy modules without explicit stage properties
    const idx = Math.min(
      Math.floor((screen / Math.max(total - 1, 1)) * STAGE_NAMES.length),
      STAGE_NAMES.length - 1
    )
    return STAGE_NAMES[idx]
  })()

  const headerVisible =
    !showWeakSpotRecovery &&
    !recoveryQuizId &&
    !showExaminer &&
    hookDone && wylDone &&
    ((cur?.type === 'cinematic' || cur?.type === 'conceptReveal' || cur?.type === 'visualNarrative') ? cinematicHeaderVisible : true)

  function headerOnBack() {
    if (screen > 0) { go(-1); return }
    if (navTo === 'recall' || (!recallDone && module.recall)) {
      if (module.hook?.statement) { setNavTo('hook'); return }
      onBack(); return
    }
    if (module.recall) { setNavTo('recall'); scrollToTop(); return }
    if (module.hook?.statement) { setNavTo('hook'); scrollToTop(); return }
    onBack()
  }

  const subjectRgb = hexToRgb(subjectColor) || '157,92,255'
  const H = {
    module,
    currentStage,
    onBack:       headerOnBack,
    onExit:       onBack,
    onJumpOpen:   () => setJumpOpen(true),
    screenPos:    null,
  }
  const jumpSheetPortal = jumpOpen ? createPortal(
    <JumpSheet
      screens={module.screens}
      currentScreen={screen}
      accent={subjectColor}
      accentRgb={subjectRgb}
      onJumpTo={goTo}
      onClose={() => setJumpOpen(false)}
    />,
    document.body
  ) : null
  // ──────────────────────────────────────────────────────────────────────────

  // ── Confidence overlay — neutral, no colour judgement ──────────────────
  // ── Full-screen hook screen — renders before the player shell ──────────────
  if ((!hookDone && module.hook?.statement) || navTo === 'hook') {
    return (
      <ChapterHookScreen
        subject={module.subject}
        chapterNum={module.number}
        chapterTitle={module.title}
        statement={module.hook.statement}
        isTrue={module.hook.isTrue}
        accentWords={module.hook.accentWords || []}
        explanation={module.hook.explanation || module.hook.correctFeedback || ''}
        revealBeats={module.hook.revealBeats}
        backgroundImage={module.hook.backgroundImage || ''}
        onBack={onBack}
        onContinue={() => { setHookDone(true); setNavTo(null); scrollToTop() }}
      />
    )
  }

  // ── Chapter outcomes screen — appears after hook, before recall ──────────────
  if (hookDone && !wylDone && module.outcomes) {
    return (
      <ChapterOutcomeScreen
        subject={module.subject}
        chapterNum={module.number}
        chapterTitle={module.title}
        outcomes={module.outcomes.bullets || module.outcomes}
        onBack={() => setHookDone(false)}
        onContinue={() => { setWylDone(true); scrollToTop() }}
      />
    )
  }

  // ── Full-screen recall screen — appears after outcomes, before content ────────
  if ((!recallDone || navTo === 'recall') && module.recall) {
    return (
      <>
        <QuickRecallScreen
          subject={module.subject}
          chapterNum={module.number}
          chapterTitle={module.title}
          questions={module.recall.questions}
          onBack={() => {
            if (navTo === 'recall') setNavTo(null)
            else if (module.hook?.statement) setNavTo('hook')
            else onBack()
          }}
          onContinue={() => { setRecallDone(true); setNavTo(null); scrollToTop() }}
          renderHeader={() => (
            <LearningHeader {...H} currentStage="Discover" visible={true} />
          )}
        />
        {jumpSheetPortal}
      </>
    )
  }

  if (showExaminerExplains) {
    return (
      <ExaminerExplainsScreen
        subject={module.subject}
        examinerExplains={module.examinerExplains}
        onBack={() => { setShowExaminerExplains(false); go(-1) }}
        onContinue={() => {
          setShowExaminerExplains(false)
          // Navigate to the faceExaminer screen if one exists in this module
          const faceExamIdx = module.screens.findIndex(s => s.type === 'faceExaminer')
          if (faceExamIdx >= 0) {
            setScreen(faceExamIdx)
            setAnimKey(k => k + 1)
            scrollToTop()
            return
          }
          if (module.examiner) {
            setShowExaminer(true)
          } else {
            detectWeakSpot()
          }
          scrollToTop()
        }}
      />
    )
  }

  if (showExaminer) {
    return (
      <FaceTheExaminer
        module={module}
        examiner={module.examiner}
        onExit={onBack}
        onContinue={({ originalMark, finalMark, guessedMark }) => {
          const attempt = {
            moduleId: module.id,
            questionId: `${module.id}-q1`,
            guessedMark,
            examinerMark: module.examiner.mark,
            finalMark,
            timestamp: Date.now(),
          }
          const updated = [...examinerAttempts, attempt]
          setExaminerAttempts(updated)
          saveModuleState(module.id, { screen, hookDone, wylDone, recallDone, introDone, examinerAttempts: updated })
          setShowExaminer(false)
          completeModule()
          scrollToTop()
        }}
      />
    )
  }

  // Recovery quiz player
  if (recoveryQuizId) {
    return (
      <RecoveryQuizPlayer
        recoveryQuizId={recoveryQuizId}
        onComplete={() => {
          setRecoveryQuizId(null)
          completeModule()
        }}
        onBack={() => setRecoveryQuizId(null)}
      />
    )
  }

  // Weak spot recovery screen
  if (showWeakSpotRecovery && detectedWeakSpot) {
    return (
      <WeakSpotRecovery
        block={detectedWeakSpot}
        subject={module.subject}
        progress={{ current: screen + 1, total: total }}
        onBack={() => setShowWeakSpotRecovery(false)}
        onFixWeakSpot={(quizId) => {
          setShowWeakSpotRecovery(false)
          setRecoveryQuizId(quizId)
        }}
        onSkip={() => {
          setShowWeakSpotRecovery(false)
          completeModule()
        }}
      />
    )
  }

  // ── Choice-reveal interstitial — brief narrative after carousel selection ─
  if (cur?.type === 'choiceReveal') {
    const goToNext = () => {
      if (cur.nextId) {
        const targetIdx = module.screens.findIndex(s => s.id === cur.nextId)
        if (targetIdx >= 0) { setScreen(targetIdx); setAnimKey(k => k + 1); scrollToTop(); return }
      }
      isLast ? handleFinish() : go(1)
    }
    return (
      <>
      <div style={{ position: 'fixed', inset: 0, background: '#080C1A', display: 'flex', flexDirection: 'column', zIndex: 60 }}>
        <LearningHeader {...H} visible={true} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 24px 48px' }}>
          <div style={{ maxWidth: 480, margin: '0 auto', width: '100%' }}>
            {(cur.paragraphs || []).map((p, i) => (
              <p key={i} style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: i === 0 ? 'clamp(1.2rem, 4.5vw, 1.5rem)' : 'clamp(.88rem, 3vw, 1rem)',
                fontWeight: i === 0 ? 700 : 400,
                color: i === 0 ? '#F5F7FB' : 'rgba(245,237,216,.62)',
                lineHeight: 1.5,
                margin: i === 0 ? '0 0 16px' : '0 0 10px',
                animation: `crSlideIn 380ms cubic-bezier(.16,1,.3,1) ${i * 80}ms both`,
              }}>{p}</p>
            ))}
            <button
              onClick={goToNext}
              style={{
                marginTop: 28,
                width: '100%',
                background: `${subjectColor}22`,
                border: `1.5px solid ${subjectColor}44`,
                borderRadius: 16, padding: '16px',
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700, fontSize: '.95rem',
                color: subjectColor, cursor: 'pointer',
                transition: 'all .15s',
              }}
            >Continue →</button>
          </div>
        </div>
        <style>{`@keyframes crSlideIn { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }`}</style>
      </div>
      {jumpSheetPortal}
      </>
    )
  }

  // ── Full-screen QuickRecallScreen as in-content screen ────────────────────
  if (cur?.type === 'quickRecall') {
    return (
      <>
        <QuickRecallScreen
          subject={module.subject}
          chapterNum={module.number}
          chapterTitle={module.title}
          questions={cur.questions || []}
          onBack={headerOnBack}
          onContinue={isLast ? handleFinish : () => go(1)}
          renderHeader={() => (
            <LearningHeader {...H} visible={true} />
          )}
        />
        {jumpSheetPortal}
      </>
    )
  }

  // ── Full-screen TieredQuizScreen as in-content screen ─────────────────────
  if (cur?.type === 'tieredquiz') {
    return (
      <>
        <TieredQuizScreen
          subject={module.subject}
          backgroundImage={cur.backgroundImage}
          tiers={cur.tiers || []}
          renderHeader={() => (
            <LearningHeader {...H} visible={true} />
          )}
          onContinue={isLast ? handleFinish : () => go(1)}
        />
        {jumpSheetPortal}
      </>
    )
  }

  // ── FaceTheExaminer as a mid-module content screen ─────────────────────────
  if (cur?.type === 'faceExaminer') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <FaceTheExaminer
          module={module}
          examiner={cur.examiner}
          onExit={headerOnBack}
          onContinue={isLast ? handleFinish : () => go(1)}
        />
        {jumpSheetPortal}
      </>
    )
  }

  // ── GuidedExamResponse as a mid-module content screen ───────────────────────
  if (cur?.type === 'guidedExamResponse') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <GuidedExamResponse
          module={module}
          exam={cur.exam}
          onExit={headerOnBack}
          onContinue={isLast ? handleFinish : () => go(1)}
        />
        {jumpSheetPortal}
      </>
    )
  }

  // ── SwipeSort — supernatural vs natural card sort ─────────────────────────
  if (cur?.type === 'naturalSupernaturalSwipe') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <SwipeSort
          block={cur}
          subject={module.subject}
          onComplete={() => { isLast ? handleFinish() : go(1) }}
        />
        {jumpSheetPortal}
      </>
    )
  }

  // ── Matching task — term-to-description connection activity ─────────────
  if (cur?.type === 'matchingTask') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <MatchingTask
          screen={cur}
          subject={module.subject}
          onComplete={isLast ? handleFinish : () => go(1)}
        />
        {jumpSheetPortal}
      </>
    )
  }

  // ── Visual learning — click-through cinematic scene sequence ─────────────
  if (cur?.type === 'visualLearning') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <VisualLearning
          block={cur}
          subject={module.subject}
          onComplete={() => { isLast ? handleFinish() : go(1) }}
        />
        {jumpSheetPortal}
      </>
    )
  }

  // ── Key figure reveal — scrollable portrait + knowledge sections ─────────
  if (cur?.type === 'keyFigureReveal') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <KeyFigureReveal
          block={cur}
          subject={module.subject}
          onComplete={() => { isLast ? handleFinish() : go(1) }}
        />
        {jumpSheetPortal}
      </>
    )
  }

  // ── Full-screen guided choice carousel ────────────────────────────────────
  if (cur?.type === 'guidedChoiceCarousel') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <GuidedChoiceCarousel
          subject={module.subject}
          headline={cur.headline}
          question={cur.question}
          helperText={cur.helperText}
          promptVisual={cur.promptVisual}
          options={cur.options || []}
          onBack={headerOnBack}
          onContinue={(nextScreenId, option) => {
            if (option) setSelectedHealer(option)
            // Try to navigate to a named screen; fall back to linear progression
            if (nextScreenId) {
              const targetIdx = module.screens.findIndex(
                s => s.id === nextScreenId || s.label === nextScreenId
              )
              if (targetIdx >= 0 && targetIdx !== screen) {
                setScreen(targetIdx)
                setAnimKey(k => k + 1)
                scrollToTop()
                return
              }
            }
            isLast ? handleFinish() : go(1)
          }}
        />
        {jumpSheetPortal}
      </>
    )
  }

  // ── Full-screen interactive image — intro hides header, explore shows it ────
  if (cur?.type === 'interactiveImage') {
    const ihmExplore = ihmExploreScreen === screen
    return (
      <>
        <LearningHeader {...H} visible={ihmExplore} />
        <InteractiveHotspotImage
          key={screen}
          subject={module.subject}
          title={cur.title}
          introText={cur.introText}
          image={cur.image}
          imageAlt={cur.imageAlt || cur.title}
          hotspots={cur.hotspots || []}
          ctaLabel={cur.ctaLabel}
          onBack={headerOnBack}
          onEnterExplore={() => setIhmExploreScreen(screen)}
          onContinue={isLast ? handleFinish : () => go(1)}
        />
        {jumpSheetPortal}
      </>
    )
  }

  // ── Interactive collection explorer — tappable object discovery ─────────────
  if (cur?.type === 'collectionExplorer') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <InteractiveCollectionExplorer
          subject={module.subject}
          title={cur.title}
          description={cur.description}
          backgroundImage={cur.backgroundImage}
          items={cur.items || []}
          synthesis={cur.synthesis || null}
          onContinue={isLast ? handleFinish : () => go(1)}
        />
        {jumpSheetPortal}
      </>
    )
  }

  // ── Medical theory prescription — cause → prescription → reveal ──────────────
  if (cur?.type === 'medicalTheoryPrescription') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <MedicalTheoryPrescription
          screen={cur}
          selectedHealer={selectedHealer}
          onComplete={isLast ? handleFinish : () => go(1)}
        />
        {jumpSheetPortal}
      </>
    )
  }

  // ── Visual narrative — tap-through image + fact sequence ────────────────────
  if (cur?.type === 'visualNarrative') {
    return (
      <>
        <LearningHeader {...H} visible={cinematicHeaderVisible} />
        <VisualNarrativeScreen
          subject={module.subject}
          beats={cur.beats || []}
          onRevealStart={() => setCinematicHeaderVisible(true)}
          onContinue={() => isLast ? handleFinish() : go(1)}
        />
        {jumpSheetPortal}
      </>
    )
  }

  if (cur?.type === 'timelineChain') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <TimelineChain
          block={cur}
          subject={module.subject}
          onContinue={() => isLast ? handleFinish() : go(1)}
        />
        {jumpSheetPortal}
      </>
    )
  }

  if (cur?.type === 'galensDiagnostic') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <GalensDiagnostic
          block={cur}
          subject={module.subject}
          onContinue={() => isLast ? handleFinish() : go(1)}
        />
        {jumpSheetPortal}
      </>
    )
  }

  if (cur?.type === 'theoryLab') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <TheoryLab
          block={cur}
          subject={module.subject}
          onContinue={() => isLast ? handleFinish() : go(1)}
        />
        {jumpSheetPortal}
      </>
    )
  }

  // ── Examiner explains — inline screen using the module-level or screen-level data ──
  if (cur?.type === 'examinerExplains') {
    const explainData = cur.examinerExplains || module.examinerExplains
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <ExaminerExplainsScreen
          subject={module.subject}
          examinerExplains={explainData}
          onBack={headerOnBack}
          onContinue={isLast ? handleFinish : () => go(1)}
        />
        {jumpSheetPortal}
      </>
    )
  }

  // ── Prior knowledge recall — AI-analysed free-text recall at chapter start ──
  if (cur?.type === 'priorKnowledgeRecall') {
    return (
      <>
        <PriorKnowledgeRecall
          block={cur}
          subject={module.subject}
          onBack={headerOnBack}
          onContinue={isLast ? handleFinish : () => go(1)}
        />
        {jumpSheetPortal}
      </>
    )
  }

  // ── Full-screen concept reveal — tap-through atmospheric sequence ──────────
  if (cur?.type === 'conceptReveal') {
    return (
      <>
        <LearningHeader {...H} visible={cinematicHeaderVisible} />
        <ConceptReveal
          subject={module.subject}
          steps={cur.steps || []}
          onRevealStart={() => setCinematicHeaderVisible(true)}
          onContinue={() => isLast ? handleFinish() : go(1)}
        />
        {jumpSheetPortal}
      </>
    )
  }

  // ── Symptom progression — case-file walkthrough of disease stages ───────────
  if (cur?.type === 'progressionTimeline') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <SymptomProgression
          subject={module.subject}
          title={cur.title}
          description={cur.description}
          image={cur.image}
          stages={cur.stages || []}
          onContinue={isLast ? handleFinish : () => go(1)}
        />
        {jumpSheetPortal}
      </>
    )
  }

  // ── Full-screen cinematic screen — takes over for type:'cinematic' screens ──
  if (cur?.type === 'cinematic') {
    return (
      <>
        <LearningHeader {...H} visible={cinematicHeaderVisible} />
        <CinematicRevealMoment
          subject={module.subject}
          videoSrc={cur.videoSrc}
          fallbackImage={cur.fallbackImage}
          year={cur.year}
          label={cur.label}
          headline={cur.headline}
          body={cur.body}
          paragraphs={cur.paragraphs}
          onContinue={() => isLast ? handleFinish() : go(1)}
          onTextRevealStart={() => setCinematicHeaderVisible(true)}
        />
        {jumpSheetPortal}
      </>
    )
  }

  return (
    <div style={{ background: '#080C1A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Universal floating learning header ── */}
      <LearningHeader {...H} visible={headerVisible} />

      {/* ── Screen content — hook, intro, or normal screen ── */}
      <div id="module-scroll-container" style={{ flex: 1, padding: 'calc(env(safe-area-inset-top, 0px) + 112px) 18px 120px', maxWidth: 660, margin: '0 auto', width: '100%' }}>
        {(!hookDone && module.hook && !module.hook.statement)
          ? <HookContent module={module} hook={module.hook} hookState={hookState} subjectColor={subjectColor} />
          : !introDone && module.intro
            ? <IntroScreen module={module} onDone={() => { setIntroDone(true); scrollToTop() }} />
              : (
                <div key={animKey} className="anim-pop">
                  <Screen screen={cur} subject={module.subject} onScreenComplete={isLast ? handleFinish : () => go(1)} />
                </div>
              )
        }
      </div>

      {/* ── Bottom navigation — Next only ── */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 20,
        background: 'rgba(8,12,26,.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid #1E2A40',
        padding: '10px 16px calc(10px + env(safe-area-inset-bottom))',
        boxShadow: '0 -8px 32px rgba(0,0,0,.4)',
      }}>
        <div style={{ maxWidth: 660, margin: '0 auto' }}>
          {showNextBtn ? (
            <button onClick={handleNext} style={{
              width: '100%',
              background: isFinishBtn
                ? 'linear-gradient(135deg, #1A4D2E, #38D27A)'
                : `linear-gradient(135deg, ${subjectColor}cc, ${subjectColor})`,
              border: 'none',
              borderRadius: 14, padding: '15px 10px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '.9rem',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: isFinishBtn
                ? '0 4px 16px rgba(56,210,122,.35)'
                : `0 4px 16px ${subjectColor}44`,
              transition: 'all .15s',
            }}>{nextBtnLabel}</button>
          ) : (
            <div style={{ height: 50 }} />
          )}
        </div>
      </div>
      {jumpSheetPortal}
    </div>
  )
}
