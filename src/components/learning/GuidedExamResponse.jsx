import { useState, useRef, useEffect } from 'react'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { RADII } from '../../constants/radii.js'
import { logExamTechnique, getExamTechniquePatterns } from '../../unifiedWeaknessTracker.js'

// Only acknowledge a technique pattern once it has shown up more than twice —
// a single slip isn't a pattern worth naming back to the student.
const RECURRING_PATTERN_THRESHOLD = 3

const PALETTES = {
  history:   { accent: '#C89B6D', bg: '#15110C' },
  biology:   { accent: '#8FD6A3', bg: '#0A1510' },
  chemistry: { accent: '#8B5CF6', bg: '#0D0A1A' },
  physics:   { accent: '#5DA9E9', bg: '#08111E' },
  maths:     { accent: '#2BBE9A', bg: '#081512' },
  english:   { accent: '#9E3D52', bg: '#150810' },
  sociology: { accent: '#C9B07C', bg: '#181410' },
}

// Plain-language gloss for each technique-flag taxonomy key — used for the
// calm, in-story acknowledgment shown when a recurring approach pattern is flagged.
const TECHNIQUE_LABELS = {
  missingExample: 'making a claim without backing it up with a specific example',
  noNamedMechanism: 'naming a method without explaining how it actually worked',
  onlyOneIdeaDeveloped: 'developing one idea well but leaving the other underdeveloped',
  vagueLanguage: 'reaching for vague phrases instead of precise detail',
  repeatsQuestion: 'restating the question instead of answering it',
  noSpecificDetail: 'leaving out the named, specific detail examiners reward',
}

function hasWritten(text, starter) {
  return (text || '').trim().length > (starter || '').trim().length + 1
}

export default function GuidedExamResponse({ module, exam, onExit, onContinue }) {
  const key    = (exam.subject || module.subject || 'history').toLowerCase()
  const pal    = PALETTES[key] || PALETTES.history
  const accent = pal.accent
  const bg     = pal.bg

  const [phase, setPhase]               = useState('darkBeat')
  const [beatVisible, setBeatVisible]   = useState(false)
  const [sectionTexts, setSectionTexts] = useState(() => exam.sections.map(s => s.starter || ''))
  const [submitting, setSubmitting]     = useState(false)
  const [error, setError]               = useState(null)
  const [result, setResult]             = useState(null)
  const [recurringPattern, setRecurringPattern] = useState(null)
  const loggedRef = useRef(false)

  useEffect(() => {
    const id = setTimeout(() => setBeatVisible(true), 140)
    return () => clearTimeout(id)
  }, [])

  const allFilled = exam.sections.every((s, i) => hasWritten(sectionTexts[i], s.starter))

  async function handleSubmit() {
    setSubmitting(true)
    setError(null)
    setPhase('marking')
    try {
      const res = await fetch('/api/guidedExamResponse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: exam.question,
          marks: exam.marks,
          markScheme: exam.markScheme,
          sections: exam.sections.map((s, i) => ({ label: s.label, studentText: sectionTexts[i] })),
          subject: exam.subject || module.subject,
          board: exam.board || 'edexcel',
          topic: exam.topic,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)

      if (!loggedRef.current && Array.isArray(data.techniqueFlags) && data.techniqueFlags.length) {
        loggedRef.current = true
        const flagSubject = module.subject || exam.subject
        data.techniqueFlags.forEach(flag => {
          logExamTechnique({
            subject: flagSubject,
            type: flag.type,
            evidence: flag.evidence,
            suggestion: flag.suggestion,
            questionId: `${module.id || 'module'}-${exam.topic || 'exam'}-${exam.marks}`,
            source: 'module',
          })
        })

        // Only acknowledge a pattern on screen once it's recurred more than twice —
        // a single slip isn't worth naming back to the student as a standing trait.
        const flaggedTypes = new Set(data.techniqueFlags.map(f => f.type))
        const recurring = getExamTechniquePatterns(RECURRING_PATTERN_THRESHOLD)
          .find(p => flaggedTypes.has(p.type))
        if (recurring) setRecurringPattern(recurring)
      }

      setPhase('result')
    } catch (err) {
      setError(err.message || 'Failed to mark your answer — try again.')
      setPhase('writing')
    } finally {
      setSubmitting(false)
    }
  }

  function advance() {
    onContinue?.({ marksAwarded: result?.marksAwarded ?? 0, marksAvailable: exam.marks })
  }

  // ── Shared styles ─────────────────────────────────────────────────────────
  const headerStyle = {
    position: 'sticky', top: 0, zIndex: 20,
    background: bg,
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 16px',
    height: 52, flexShrink: 0,
  }
  const backBtnStyle = {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'rgba(255,255,255,0.45)', fontSize: 20, lineHeight: 1,
    padding: '8px 8px 8px 0',
  }
  const labelStyle = {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700, fontSize: 11,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.55)',
  }
  const marksBadgeStyle = {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700, fontSize: 11,
    letterSpacing: '0.1em',
  }
  const sectionHeadingStyle = {
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700, fontSize: 9,
    letterSpacing: '0.16em', textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.3)',
    marginBottom: 12,
  }
  const ctaStyle = (enabled) => ({
    display: 'block', width: '100%',
    height: 54, borderRadius: RADII.medium,
    border: `1.5px solid ${enabled ? accent : 'rgba(255,255,255,0.12)'}`,
    background: enabled ? `${accent}1A` : 'rgba(255,255,255,0.03)',
    color: enabled ? accent : 'rgba(255,255,255,0.3)',
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700, fontSize: 14,
    letterSpacing: '0.02em',
    cursor: enabled ? 'pointer' : 'default',
    transition: `all ${MOTION.duration.fast} ${MOTION.easing.standard}`,
  })
  // Parchment-surface CTA — warm gradient + dark text, readable against the light scroll
  const parchmentCtaStyle = (enabled) => ({
    display: 'block', width: '100%',
    height: 54, borderRadius: RADII.medium,
    border: enabled ? 'none' : `1px solid rgba(58,32,8,0.18)`,
    background: enabled
      ? `linear-gradient(135deg, ${accent}, ${accent}B8)`
      : 'rgba(58,32,8,0.07)',
    color: enabled ? '#2A1404' : 'rgba(58,32,8,0.4)',
    fontFamily: "'Sora', sans-serif",
    fontWeight: 700, fontSize: 14,
    letterSpacing: '0.02em',
    cursor: enabled ? 'pointer' : 'default',
    boxShadow: enabled ? `0 4px 24px ${accent}40` : 'none',
    transition: `all ${MOTION.duration.fast} ${MOTION.easing.standard}`,
  })
  const errorStyle = {
    padding: '10px 14px', borderRadius: RADII.small,
    background: 'rgba(192,80,85,0.12)',
    border: '1px solid rgba(192,80,85,0.3)',
    fontFamily: "'Sora', sans-serif",
    fontSize: 12.5, color: '#E8746A',
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE: darkBeat — a single, wordless breath before the test
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === 'darkBeat') {
    return (
      <div
        onClick={() => setPhase('intro')}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: '#050505',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <div style={{
          ...TYPE.hero,
          color: 'rgba(245,238,225,0.92)',
          textAlign: 'center',
          padding: `0 ${SPACING.section}px`,
          opacity: beatVisible ? 1 : 0,
          transition: `opacity ${MOTION.duration.cinematic} ${MOTION.easing.standard}`,
        }}>
          Last task — give it a go yourself
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE: intro — the real question, framed
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === 'intro') {
    return (
      <>
        <style>{`
          @keyframes ger-up {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: bg,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={headerStyle}>
            <button onClick={onExit} style={backBtnStyle}>←</button>
            <div style={labelStyle}>
              Exam practice
              <span style={{ color: accent, marginLeft: 6 }}>· {(module.subject || '').toUpperCase()}</span>
            </div>
            <div style={{ ...marksBadgeStyle, color: accent }}>{exam.marks} MARKS</div>
          </div>

          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
            padding: `0 ${SPACING.standard}px`,
          }}>
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700, fontSize: 11,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: accent,
              marginBottom: SPACING.compact,
              animation: `ger-up 500ms ${MOTION.easing.standard} both`,
            }}>
              Your turn — no sample answer this time
            </div>

            <div style={{
              fontFamily: "'IBM Plex Serif', Georgia, serif",
              fontSize: 24, lineHeight: 1.4,
              color: 'rgba(245,238,225,0.92)',
              marginBottom: SPACING.standard,
              animation: `ger-up 550ms ${MOTION.easing.standard} 90ms both`,
            }}>
              {exam.question}
            </div>

            <p style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 400, fontSize: 15,
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.6,
              margin: 0,
              animation: `ger-up 550ms ${MOTION.easing.standard} 180ms both`,
            }}>
              Time to write your own answer. Build it up section by section, then we'll mark it properly and show you exactly how to gain more marks.
            </p>
          </div>

          <div style={{
            flexShrink: 0,
            padding: `0 ${SPACING.standard}px calc(${SPACING.standard}px + env(safe-area-inset-bottom, 0px))`,
          }}>
            <button onClick={() => setPhase('writing')} style={ctaStyle(true)}>
              Start writing →
            </button>
          </div>
        </div>
      </>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE: writing — guided, scaffolded answer on a parchment surface
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === 'writing') {
    return (
      <>
        <style>{`
          .ger-textarea { outline: none; background: transparent; resize: none; }
          .ger-textarea::placeholder { color: rgba(60,35,8,0.35); font-style: italic; font-family: 'Caveat', cursive; font-size: 18px; }
        `}</style>
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: bg,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={headerStyle}>
            <button onClick={onExit} style={backBtnStyle}>←</button>
            <div style={labelStyle}>
              Write for the examiner
              <span style={{ color: accent, marginLeft: 6 }}>· {(module.subject || '').toUpperCase()}</span>
            </div>
            <div style={{ ...marksBadgeStyle, color: accent }}>{exam.marks} MARKS</div>
          </div>

          {/* Dark prompt above the parchment */}
          <div style={{
            flexShrink: 0,
            padding: `${SPACING.compact}px ${SPACING.standard}px`,
          }}>
            <div style={{
              fontFamily: "'IBM Plex Serif', Georgia, serif",
              fontSize: 15.5, lineHeight: 1.5,
              color: 'rgba(245,238,225,0.85)',
            }}>
              {exam.question}
            </div>
          </div>

          {/* Parchment surface */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'url(/figures/history/medicine/medieval/parchment-scroll.png)',
              backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(240,215,150,0.30)' }} />

            <div style={{
              position: 'relative', flex: 1, overflowY: 'auto',
              padding: `${SPACING.standard}px ${SPACING.standard}px ${SPACING.separation}px`,
              display: 'flex', flexDirection: 'column', gap: SPACING.standard,
            }}>
              {exam.sections.map((section, i) => (
                <div key={section.label}>
                  <div style={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 700, fontSize: 11,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    color: 'rgba(58,32,8,0.55)',
                    marginBottom: 8,
                  }}>
                    {section.label}
                  </div>
                  <textarea
                    className="ger-textarea"
                    rows={4}
                    value={sectionTexts[i]}
                    onChange={e => setSectionTexts(prev => prev.map((t, j) => (j === i ? e.target.value : t)))}
                    placeholder={section.placeholder}
                    aria-label={section.label}
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      border: 'none', borderBottom: '1.5px solid rgba(58,32,8,0.30)',
                      padding: '4px 4px 8px',
                      fontFamily: "'Caveat', cursive",
                      fontSize: 20, fontWeight: 500, lineHeight: 1.5,
                      color: '#2A1404',
                      caretColor: '#8B4A10',
                    }}
                  />
                </div>
              ))}

              {error && <div style={errorStyle}>{error}</div>}

              <button onClick={handleSubmit} disabled={!allFilled || submitting} style={parchmentCtaStyle(allFilled && !submitting)}>
                Submit my answer →
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE: marking — brief, calm loading state while Claude marks the answer
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === 'marking') {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: "'Sora', sans-serif",
          fontWeight: 500, fontSize: 13,
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.4)',
        }}>
          Marking your answer…
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE: result — mark, section feedback, verdict, and how to gain more marks
  // ═══════════════════════════════════════════════════════════════════════════
  if (phase === 'result' && result) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: bg,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <div style={headerStyle}>
          <button onClick={onExit} style={backBtnStyle}>←</button>
          <div style={labelStyle}>
            Examiner's verdict
            <span style={{ color: accent, marginLeft: 6 }}>· {(module.subject || '').toUpperCase()}</span>
          </div>
          <div style={{ width: 24 }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: `${SPACING.standard}px ${SPACING.standard}px ${SPACING.separation}px` }}>
          <div style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 900, fontSize: 38,
            color: accent, letterSpacing: '-0.03em',
            marginBottom: 6,
          }}>
            {result.marksAwarded}/{result.marksAvailable ?? exam.marks}
            <span style={{
              fontWeight: 400, fontSize: 13,
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              marginLeft: 10,
            }}>
              examiner's mark
            </span>
          </div>

          <p style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 400, fontSize: 14,
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.6,
            margin: '0 0 24px',
          }}>
            {result.verdict}
          </p>

          {Array.isArray(result.sectionFeedback) && result.sectionFeedback.length > 0 && (
            <div style={{ marginBottom: 26 }}>
              <div style={sectionHeadingStyle}>Section by section</div>
              {result.sectionFeedback.map((sf, i) => (
                <div key={i} style={{ marginBottom: SPACING.compact }}>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 12.5, color: accent, marginBottom: 3 }}>
                    {sf.label}
                  </div>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.55)' }}>
                    {sf.comment}
                  </div>
                </div>
              ))}
            </div>
          )}

          {Array.isArray(result.improvementSuggestions) && result.improvementSuggestions.length > 0 && (
            <div style={{ marginBottom: 26 }}>
              <div style={sectionHeadingStyle}>Do this to gain more marks</div>
              {result.improvementSuggestions.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: SPACING.micro, marginBottom: SPACING.micro }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0, background: `${accent}CC` }} />
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.7)' }}>
                    {s}
                  </div>
                </div>
              ))}
            </div>
          )}

          {recurringPattern && (
            <div style={{
              padding: SPACING.compact,
              borderRadius: RADII.medium,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={sectionHeadingStyle}>Noticed</div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)' }}>
                We've noticed you tend towards {TECHNIQUE_LABELS[recurringPattern.type] || 'the same kind of slip'} — we'll bring this back up.
              </div>
            </div>
          )}
        </div>

        <div style={{
          flexShrink: 0,
          padding: `${SPACING.compact}px ${SPACING.standard}px calc(${SPACING.compact}px + env(safe-area-inset-bottom, 0px))`,
          background: bg,
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <button onClick={advance} style={ctaStyle(true)}>Continue →</button>
        </div>
      </div>
    )
  }

  return null
}
