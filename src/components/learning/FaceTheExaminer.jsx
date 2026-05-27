import { useState, useEffect, useRef } from 'react'
import { SPACING } from '../../constants/spacing.js'

const PALETTES = {
  history:   { accent: '#C89B6D', bg: '#15110C' },
  biology:   { accent: '#8FD6A3', bg: '#0A1510' },
  chemistry: { accent: '#8B5CF6', bg: '#0D0A1A' },
  physics:   { accent: '#5DA9E9', bg: '#08111E' },
  maths:     { accent: '#2BBE9A', bg: '#081512' },
  english:   { accent: '#9E3D52', bg: '#150810' },
  sociology: { accent: '#C9B07C', bg: '#181410' },
}

const ANN_STYLES = {
  strong:    { borderBottom: '1.5px solid rgba(143,214,163,0.55)', color: 'inherit' },
  weak:      { borderBottom: '1.5px solid rgba(232,169,58,0.6)',   color: 'inherit' },
  irrelevant:{ borderBottom: '1.5px solid rgba(192,80,85,0.5)',    color: 'inherit', opacity: 0.65 },
}

const ANN_DOT = {
  strong:    'rgba(143,214,163,0.8)',
  weak:      'rgba(232,169,58,0.85)',
  irrelevant:'rgba(192,80,85,0.7)',
}

function buildAnnotatedSegments(text, annotations) {
  let cursor = 0
  const segments = []
  for (const ann of annotations) {
    const idx = text.indexOf(ann.target, cursor)
    if (idx === -1) {
      if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
        console.warn(`FTE: annotation "${ann.id}" target not found`)
      }
      continue
    }
    if (idx > cursor) segments.push({ type: 'plain', text: text.slice(cursor, idx) })
    segments.push({ type: 'ann', ann, text: ann.target })
    cursor = idx + ann.target.length
  }
  if (cursor < text.length) segments.push({ type: 'plain', text: text.slice(cursor) })
  return segments
}

export default function FaceTheExaminer({ module, examiner, onExit, onContinue }) {
  const key    = (module.subject || 'history').toLowerCase()
  const pal    = PALETTES[key] || PALETTES.history
  const accent = pal.accent
  const bg     = pal.bg

  // ── Phase state ───────────────────────────────────────────────────────────
  const [phase, setPhase] = useState('intro')

  // ── Intro phase ───────────────────────────────────────────────────────────
  const [overlayDark,    setOverlayDark]    = useState(false)
  const [titleVisible,   setTitleVisible]   = useState(false)
  const [sub1Visible,    setSub1Visible]    = useState(false)
  const [sub2Visible,    setSub2Visible]    = useState(false)
  const [videoError,     setVideoError]     = useState(false)
  const textStarted = useRef(false)
  const videoRef    = useRef(null)
  const timers      = useRef([])

  // ── Reading / judging ─────────────────────────────────────────────────────
  const [activeTab,       setActiveTab]       = useState('answer')
  const [guessedMark,     setGuessedMark]     = useState(null)
  const [selectedCriteria,setSelectedCriteria]= useState([])

  // ── Reveal ────────────────────────────────────────────────────────────────
  const [revealPanelVisible, setRevealPanelVisible] = useState(false)

  // ── Improving ────────────────────────────────────────────────────────────
  const [studentEdits,  setStudentEdits]  = useState({})
  const [expandedEdit,  setExpandedEdit]  = useState(null)

  // ── Re-marking ───────────────────────────────────────────────────────────
  const [remarkResult,  setRemarkResult]  = useState(null)
  const [remarkLoading, setRemarkLoading] = useState(false)
  const [remarkError,   setRemarkError]   = useState(null)

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // Auto-advance from done screen after 2.2s
  useEffect(() => {
    if (phase !== 'done') return
    const id = setTimeout(() => {
      onContinue({ originalMark: examiner.mark, finalMark: remarkResult?.marksAwarded ?? examiner.mark, guessedMark })
    }, 2200)
    return () => clearTimeout(id)
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  function schedule(fn, delay) {
    const id = setTimeout(fn, delay)
    timers.current.push(id)
  }

  // Show the reveal panel shortly after entering reveal phase
  useEffect(() => {
    if (phase === 'reveal') {
      const id = setTimeout(() => setRevealPanelVisible(true), 500)
      return () => clearTimeout(id)
    }
    setRevealPanelVisible(false)
  }, [phase])

  // ── Intro: start title fade ~1s before video ends ─────────────────────────
  function startTitleFade() {
    if (textStarted.current) return
    textStarted.current = true
    setOverlayDark(true)
    schedule(() => setTitleVisible(true),  200)
    schedule(() => setSub1Visible(true),   600)
    schedule(() => setSub2Visible(true),   950)
    schedule(() => setPhase('reading'),   2300)
  }

  function handleTimeUpdate() {
    const vid = videoRef.current
    if (!vid || textStarted.current) return
    if (vid.duration && vid.currentTime >= vid.duration - 1.0) startTitleFade()
  }
  function handleVideoEnd()  { startTitleFade() }
  function handleVideoError(){ setVideoError(true); startTitleFade() }

  // ── Mark comparison ───────────────────────────────────────────────────────
  function markComparisonText() {
    if (guessedMark === null) return ''
    const diff = guessedMark - examiner.mark
    if (diff === 0)          return 'You matched the examiner.'
    if (Math.abs(diff) === 1)return 'You were close.'
    if (diff < 0)            return 'You were harsher than the examiner.'
    return 'You were more generous than the examiner.'
  }

  // ── Compose edited answer ─────────────────────────────────────────────────
  function composeEditedAnswer() {
    let text = examiner.sampleAnswer
    // Insert student additions after each matched annotation target, right-to-left to preserve offsets
    const toInsert = examiner.annotations
      .filter(a => studentEdits[a.id]?.trim())
      .map(ann => {
        const idx = text.indexOf(ann.target)
        return idx !== -1 ? { end: idx + ann.target.length, addition: ` ${studentEdits[ann.id].trim()}` } : null
      })
      .filter(Boolean)
      .sort((a, b) => b.end - a.end) // right-to-left so earlier indices stay valid

    for (const { end, addition } of toInsert) {
      text = text.slice(0, end) + addition + text.slice(end)
    }
    return text
  }

  // ── Re-mark ───────────────────────────────────────────────────────────────
  async function handleRemark() {
    setRemarkLoading(true)
    setRemarkError(null)
    try {
      const editedAnswer = composeEditedAnswer()
      const res = await fetch('/api/examiner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'remark',
          question: examiner.question,
          originalAnswer: examiner.sampleAnswer,
          editedAnswer,
          marks: examiner.marks,
          markScheme: examiner.markScheme,
          subject: examiner.subject || module.subject,
          board: examiner.board || 'edexcel',
          type: examiner.type,
          originalMark: examiner.mark,
          studentEdits,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setRemarkResult(data)
      setPhase('done')
    } catch (err) {
      setRemarkError(err.message || 'Failed to re-mark. Try again.')
    } finally {
      setRemarkLoading(false)
    }
  }

  function handleSkip() {
    setPhase('done')
  }

  const hasAnyEdit = Object.values(studentEdits).some(v => v?.trim())
  const finalMark  = remarkResult?.marksAwarded ?? examiner.mark
  const segments   = ['reveal','improving','remarking'].includes(phase)
    ? buildAnnotatedSegments(examiner.sampleAnswer, examiner.annotations)
    : []

  // ── Shared styles ─────────────────────────────────────────────────────────
  const headerStyle = {
    position: 'sticky', top: 0, zIndex: 20,
    background: bg,
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 16px',
    height: 52, flexShrink: 0,
  }
  const ctaBtnStyle = (enabled) => ({
    display: 'block', width: '100%',
    height: 54, borderRadius: 12,
    border: `1.5px solid ${enabled ? accent : 'rgba(255,255,255,0.12)'}`,
    background: enabled ? accent + '18' : 'rgba(255,255,255,0.04)',
    color: enabled ? accent : 'rgba(255,255,255,0.3)',
    fontFamily: "'Sora', sans-serif",
    fontWeight: 800, fontSize: 13,
    letterSpacing: '0.15em', textTransform: 'uppercase',
    cursor: enabled ? 'pointer' : 'not-allowed',
    transition: 'all 0.2s ease',
  })

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE: intro
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === 'intro') {
    const videoSrc = examiner.videoSrc || '/videos/face-the-examiner-intro.mp4'
    return (
      <>
        <style>{`
          @keyframes fte-up {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: '#080C10', overflow: 'hidden',
        }}>
          {!videoError && (
            <video
              ref={videoRef}
              src={videoSrc}
              autoPlay muted playsInline preload="auto"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnd}
              onError={handleVideoError}
            />
          )}

          {/* Base gradient */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.82) 80%, rgba(0,0,0,0.96) 100%)',
          }} />

          {/* Darkening overlay — increases as title fades in */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'rgba(0,0,0,0.42)',
            opacity: overlayDark ? 1 : 0,
            transition: 'opacity 1000ms ease',
          }} />

          {/* Text — lower portion */}
          <div style={{
            position: 'absolute',
            left: 28, right: 28, bottom: 80,
          }}>
            {titleVisible && (
              <div style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 900, fontSize: 48,
                letterSpacing: '-0.03em', lineHeight: 0.95,
                color: accent,
                marginBottom: 20,
                animation: 'fte-up 700ms ease both',
              }}>
                FACE THE<br />EXAMINER
              </div>
            )}
            {sub1Visible && (
              <p style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 400, fontSize: 17,
                color: 'rgba(245,238,225,0.88)',
                margin: '0 0 4px',
                animation: 'fte-up 600ms ease both',
              }}>
                This answer sounds convincing.
              </p>
            )}
            {sub2Visible && (
              <p style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 400, fontSize: 17,
                color: 'rgba(245,238,225,0.88)',
                margin: 0,
                animation: 'fte-up 600ms ease both',
              }}>
                But would it get top marks?
              </p>
            )}
          </div>
        </div>
      </>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE: done
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === 'done') {
    const improved = (remarkResult?.marksAwarded ?? examiner.mark) > examiner.mark
    const finalMarkForDisplay = remarkResult?.marksAwarded ?? examiner.mark
    return (
      <>
        <style>{`
          @keyframes fte-done-in {
            from { opacity: 0; transform: scale(0.94); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
          padding: '0 32px',
          animation: 'fte-done-in 600ms ease both',
        }}>
          <div style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 400, fontSize: 15,
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            {improved ? 'You pushed this answer' : 'You reviewed this answer'}
          </div>

          {improved ? (
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 900, fontSize: 52,
              color: accent,
              letterSpacing: '-0.03em',
            }}>
              {examiner.mark}/{examiner.marks}
              <span style={{ color: 'rgba(255,255,255,0.25)', margin: '0 12px', fontWeight: 300 }}>→</span>
              {finalMarkForDisplay}/{examiner.marks}
            </div>
          ) : (
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 900, fontSize: 60,
              color: accent,
              letterSpacing: '-0.03em',
            }}>
              {examiner.mark}/{examiner.marks}
            </div>
          )}

          {remarkResult?.delta === 0 && (
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 14, color: 'rgba(255,255,255,0.4)',
              marginTop: SPACING.compact, textAlign: 'center',
            }}>
              {remarkResult.verdict}
            </div>
          )}
        </div>
      </>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASES: reading → judging → reveal → improving → remarking
  // ═══════════════════════════════════════════════════════════════════════════

  const showTabs    = phase === 'reading' || phase === 'judging'
  const showAnswer  = activeTab === 'answer' || !showTabs
  const showMarking = activeTab === 'marking' && showTabs
  const isImproving = phase === 'improving'
  const isReveal    = phase === 'reveal'
  const isRemarking = phase === 'remarking'

  // Determine the content of the bottom panel
  const bottomPanelHeight = revealPanelVisible && isReveal ? 220 : 0

  return (
    <>
      <style>{`
        @keyframes fte-panel-up {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes fte-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .fte-chip {
          display: inline-flex; align-items: center;
          padding: 7px 13px; border-radius: 20px; margin: 4px;
          font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600;
          cursor: pointer; border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.55);
          transition: all 0.15s ease; user-select: none;
        }
        .fte-chip.selected {
          background: ${accent}18; border-color: ${accent}55;
          color: ${accent};
        }
        .fte-improve-btn {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 8px; border-radius: 10px; margin-left: 5px;
          font-family: 'Sora', sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer; vertical-align: middle;
          background: rgba(232,169,58,0.12); border: 1px solid rgba(232,169,58,0.35);
          color: rgba(232,169,58,0.85); transition: all 0.15s ease;
        }
        .fte-improve-btn.edited {
          background: rgba(143,214,163,0.12); border-color: rgba(143,214,163,0.35);
          color: rgba(143,214,163,0.85);
        }
        .fte-textarea {
          width: 100%; box-sizing: border-box;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px; padding: 10px 12px;
          color: rgba(245,238,225,0.9);
          font-family: 'IBM Plex Serif', Georgia, serif;
          font-size: 14px; line-height: 1.6; resize: vertical;
          outline: none; margin-top: 8px;
        }
        .fte-textarea:focus { border-color: rgba(232,169,58,0.45); }
      `}</style>

      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: bg,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* ── Compact header ─────────────────────────────────────────────── */}
        <div style={headerStyle}>
          <button
            onClick={onExit}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.45)', fontSize: 20, lineHeight: 1,
              padding: '8px 8px 8px 0',
            }}
          >←</button>

          <div style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700, fontSize: 11,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
          }}>
            Face the Examiner
            <span style={{ color: accent, marginLeft: 6 }}>
              · {(module.subject || '').toUpperCase()}
            </span>
          </div>

          <div style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 700, fontSize: 11,
            letterSpacing: '0.1em',
            color: accent,
          }}>
            {examiner.marks} MARKS
          </div>
        </div>

        {/* ── Question bar ───────────────────────────────────────────────── */}
        <div style={{
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.025)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 400, fontSize: 13.5,
            color: 'rgba(245,238,225,0.85)',
            lineHeight: 1.5,
          }}>
            {examiner.question}
          </div>
        </div>

        {/* ── Tabs (reading / judging only) ─────────────────────────────── */}
        {showTabs && (
          <div style={{
            display: 'flex',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            flexShrink: 0,
          }}>
            {['answer','marking'].map(tab => {
              const active = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1, height: 42,
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: active ? 700 : 500,
                    fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: active ? accent : 'rgba(255,255,255,0.35)',
                    borderBottom: active ? `2px solid ${accent}` : '2px solid transparent',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab === 'answer' ? 'Answer' : 'Marking'}
                </button>
              )
            })}
          </div>
        )}

        {/* ── Scrollable content area ────────────────────────────────────── */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '16px 16px',
          paddingBottom: bottomPanelHeight > 0 ? bottomPanelHeight + 16 : 80,
          WebkitOverflowScrolling: 'touch',
        }}>

          {/* ── ANSWER tab content ─────────────────────────────────────── */}
          {showAnswer && (
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 12,
              padding: '16px 16px',
            }}>
              {/* Phase label in reveal/improving */}
              {(isReveal || isImproving) && (
                <div style={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 700, fontSize: 9,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                  marginBottom: 12,
                }}>
                  Examiner's annotations
                </div>
              )}

              {/* Answer text */}
              <div style={{
                fontFamily: "'IBM Plex Serif', Georgia, serif",
                fontSize: 15.5, lineHeight: 1.85,
                color: 'rgba(245,238,225,0.9)',
              }}>
                {segments.length === 0
                  ? examiner.sampleAnswer
                  : segments.map((seg, i) => {
                    if (seg.type === 'plain') return <span key={i}>{seg.text}</span>
                    const { ann } = seg
                    const annStyle = ANN_STYLES[ann.type] || {}
                    const isWeak = ann.type === 'weak'
                    const isExpanded = expandedEdit === ann.id
                    const hasEdit = studentEdits[ann.id]?.trim()
                    return (
                      <span key={i}>
                        <span style={annStyle}>{seg.text}</span>
                        {isImproving && isWeak && (
                          <>
                            {' '}
                            <button
                              className={`fte-improve-btn${hasEdit ? ' edited' : ''}`}
                              onClick={() => setExpandedEdit(isExpanded ? null : ann.id)}
                            >
                              {hasEdit ? '✓ edited' : (examiner.improvementPrompts?.[ann.id]?.prompt || '+ improve')}
                            </button>
                            {isExpanded && (
                              <span style={{ display: 'block' }}>
                                <textarea
                                  className="fte-textarea"
                                  rows={3}
                                  placeholder={examiner.improvementPrompts?.[ann.id]?.placeholder || 'Add your improvement here...'}
                                  value={studentEdits[ann.id] || ''}
                                  onChange={e => setStudentEdits(prev => ({ ...prev, [ann.id]: e.target.value }))}
                                  autoFocus
                                />
                              </span>
                            )}
                          </>
                        )}
                      </span>
                    )
                  })
                }
              </div>

              {/* Annotation notes — shown in reveal / improving */}
              {(isReveal || isImproving) && (
                <div style={{ marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
                  <div style={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 700, fontSize: 9,
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)',
                    marginBottom: 10,
                  }}>
                    Examiner notes
                  </div>
                  {examiner.annotations.map(ann => (
                    <div key={ann.id} style={{
                      display: 'flex', alignItems: 'flex-start', gap: SPACING.micro,
                      marginBottom: SPACING.micro,
                    }}>
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0,
                        background: ANN_DOT[ann.type] || 'rgba(255,255,255,0.3)',
                      }} />
                      <div style={{
                        fontFamily: "'Sora', sans-serif",
                        fontSize: 12.5, lineHeight: 1.5,
                        color: 'rgba(255,255,255,0.5)',
                      }}>
                        {ann.comment}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* "PUSH IT UP A GRADE" heading in improving */}
              {isImproving && (
                <div style={{
                  marginTop: 20,
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 800, fontSize: 11,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: accent,
                }}>
                  Push it up a grade
                </div>
              )}
            </div>
          )}

          {/* ── MARKING tab content ────────────────────────────────────── */}
          {showMarking && (
            <div>
              <div style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 500, fontSize: 13,
                color: 'rgba(255,255,255,0.45)',
                marginBottom: 14,
              }}>
                What mark would you give this answer?
              </div>

              {/* Mark selector */}
              <div style={{
                display: 'flex', flexWrap: 'wrap', gap: SPACING.micro, marginBottom: SPACING.standard,
              }}>
                {Array.from({ length: examiner.marks + 1 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setGuessedMark(i)}
                    style={{
                      width: 44, height: 44, borderRadius: 10,
                      border: `1.5px solid ${guessedMark === i ? accent : 'rgba(255,255,255,0.14)'}`,
                      background: guessedMark === i ? accent + '20' : 'rgba(255,255,255,0.04)',
                      color: guessedMark === i ? accent : 'rgba(255,255,255,0.55)',
                      fontFamily: "'Sora', sans-serif",
                      fontWeight: guessedMark === i ? 800 : 500,
                      fontSize: 15,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {i}
                  </button>
                ))}
              </div>

              <div style={{
                height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 20,
              }} />

              <div style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 500, fontSize: 13,
                color: 'rgba(255,255,255,0.45)',
                marginBottom: 12,
              }}>
                What do you notice?
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-4px' }}>
                {examiner.criteriaOptions.map(opt => {
                  const sel = selectedCriteria.includes(opt)
                  return (
                    <button
                      key={opt}
                      className={`fte-chip${sel ? ' selected' : ''}`}
                      onClick={() => setSelectedCriteria(prev =>
                        sel ? prev.filter(x => x !== opt) : [...prev, opt]
                      )}
                    >
                      {sel ? '✓ ' : ''}{opt}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Re-mark error ─────────────────────────────────────────── */}
          {remarkError && (
            <div style={{
              marginTop: 12,
              padding: '10px 14px', borderRadius: 8,
              background: 'rgba(192,80,85,0.12)',
              border: '1px solid rgba(192,80,85,0.3)',
              fontFamily: "'Sora', sans-serif",
              fontSize: 12.5, color: '#E8746A',
            }}>
              {remarkError}
            </div>
          )}
        </div>

        {/* ── Sticky bottom CTA ──────────────────────────────────────────── */}
        {!isReveal && (
          <div style={{
            flexShrink: 0,
            padding: '12px 16px calc(12px + env(safe-area-inset-bottom, 0px))',
            background: bg,
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            {/* Reading phase */}
            {phase === 'reading' && activeTab === 'answer' && (
              <button
                style={ctaBtnStyle(true)}
                onClick={() => { setActiveTab('marking'); setPhase('judging') }}
              >
                I've read the answer →
              </button>
            )}

            {/* Judging phase */}
            {phase === 'judging' && (
              <button
                style={ctaBtnStyle(guessedMark !== null)}
                disabled={guessedMark === null}
                onClick={() => { setActiveTab('answer'); setPhase('reveal') }}
              >
                Submit examiner report
              </button>
            )}

            {/* Improving phase */}
            {isImproving && (
              <div>
                <button
                  style={ctaBtnStyle(hasAnyEdit && !remarkLoading)}
                  disabled={!hasAnyEdit || remarkLoading}
                  onClick={handleRemark}
                >
                  {remarkLoading ? 'Re-marking…' : 'Re-mark my answer →'}
                </button>
                <button
                  onClick={handleSkip}
                  style={{
                    display: 'block', width: '100%',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 500, fontSize: 12,
                    color: 'rgba(255,255,255,0.25)',
                    padding: '10px 0 0',
                    textAlign: 'center',
                    letterSpacing: '0.06em',
                  }}
                >
                  Continue without improving →
                </button>
              </div>
            )}

            {/* Remarking phase — no button, loading */}
            {isRemarking && (
              <div style={{
                height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Sora', sans-serif",
                fontSize: 13, color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.08em',
              }}>
                Reviewing your changes…
              </div>
            )}
          </div>
        )}

        {/* ── Mark reveal panel (reveal phase) ──────────────────────────── */}
        {isReveal && revealPanelVisible && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: `linear-gradient(180deg, ${bg}00 0%, ${bg} 18%)`,
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            padding: '28px 16px calc(20px + env(safe-area-inset-bottom, 0px))',
            animation: 'fte-panel-up 500ms cubic-bezier(0.22, 1, 0.36, 1) both',
            zIndex: 10,
          }}>
            {/* Mark */}
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 900, fontSize: 38,
              color: accent, letterSpacing: '-0.03em',
              marginBottom: 4,
            }}>
              {examiner.mark}/{examiner.marks}
              <span style={{
                fontWeight: 400, fontSize: 13,
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                marginLeft: 10,
              }}>
                examiner's mark
              </span>
            </div>

            {/* Summary */}
            <p style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 400, fontSize: 13,
              color: 'rgba(255,255,255,0.5)',
              margin: '0 0 6px', lineHeight: 1.5,
            }}>
              {examiner.summary}
            </p>

            {/* Comparison */}
            {guessedMark !== null && (
              <p style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 600, fontSize: 12.5,
                color: 'rgba(255,255,255,0.35)',
                margin: '0 0 16px',
              }}>
                You said {guessedMark}/{examiner.marks} · {markComparisonText()}
              </p>
            )}

            {/* CTA */}
            <button
              style={ctaBtnStyle(true)}
              onClick={() => { setRevealPanelVisible(false); setPhase('improving') }}
            >
              Push it up a grade →
            </button>
          </div>
        )}

      </div>
    </>
  )
}
