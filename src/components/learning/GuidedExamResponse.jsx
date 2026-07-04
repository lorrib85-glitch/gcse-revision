import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { RADII } from '../../constants/radii.js'
import { BUTTONS } from '../../constants/buttons.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { logExamTechnique, getExamTechniquePatterns } from '../../unifiedWeaknessTracker.js'
import BackButton from '../core/BackButton.jsx'
import ContinueCTA from '../core/ContinueCTA.jsx'

const RECURRING_PATTERN_THRESHOLD = 3


const TECHNIQUE_LABELS = {
  missingExample: 'making a claim without backing it up with a specific example',
  noNamedMechanism: 'naming a method without explaining how it actually worked',
  onlyOneIdeaDeveloped: 'developing one idea well but leaving the other underdeveloped',
  vagueLanguage: 'reaching for vague phrases instead of precise detail',
  repeatsQuestion: 'restating the question instead of answering it',
  noSpecificDetail: 'leaving out the named, specific detail examiners reward',
}

function hasWritten(text, starter) {
  const trimmed = (text || '').trim()
  return trimmed.length > 0 && trimmed !== (starter || '').trim()
}

function SourcesCard({ sources, accent, open, onToggle }) {
  if (!Array.isArray(sources) || sources.length === 0) return null
  return (
    <div style={{
      borderRadius: RADII.medium,
      border: `1px solid ${accent}40`,
      background: `${accent}0F`,
      marginBottom: SPACING.compact,
      overflow: 'hidden',
    }}>
      <button onClick={onToggle} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer',
        fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 11,
        letterSpacing: '0.14em', textTransform: 'uppercase', color: accent,
      }}>
        <span>{sources.length > 1 ? `Sources (${sources.length})` : 'Source'}</span>
        <span style={{ fontSize: 14 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: SPACING.compact }}>
          {sources.map(src => (
            <div key={src.label}>
              <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: accent, marginBottom: 4 }}>{src.label}</div>
              {src.attribution && <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 11.5, fontStyle: 'italic', color: 'rgba(245,238,225,0.5)', marginBottom: 6 }}>{src.attribution}</div>}
              <div style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 13.5, lineHeight: 1.6, color: 'rgba(245,238,225,0.85)', whiteSpace: 'pre-wrap' }}>{src.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StrategyLane({ section, value, onChange, accent, index }) {
  return (
    <section style={{
      position: 'relative',
      padding: '15px 15px 15px 17px',
      borderRadius: 20,
      background: 'linear-gradient(180deg, rgba(245,238,225,0.055), rgba(8,9,13,0.26))',
      border: '1px solid rgba(245,238,225,0.085)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 12px 36px rgba(0,0,0,0.18)',
    }}>
      <div style={{ position: 'absolute', left: 0, top: 14, bottom: 14, width: 2, borderRadius: 999, background: index === 0 ? accent : `rgba(245,238,225,${index === 1 ? 0.18 : 0.12})` }} />
      <div style={{
        ...TYPE.eyebrow,
        textTransform: 'uppercase',
        color: index === 0 ? accent : 'rgba(245,238,225,0.46)',
        marginBottom: 9,
      }}>
        {section.label}
      </div>
      <textarea
        className="ger-textarea"
        rows={4}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={section.placeholder}
        aria-label={section.label}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          border: 'none',
          background: 'rgba(0,0,0,0.10)',
          borderRadius: 14,
          padding: '12px 12px',
          fontFamily: "'Sora', sans-serif",
          fontSize: 15,
          fontWeight: 500,
          lineHeight: 1.55,
          color: 'rgba(245,238,225,0.9)',
          caretColor: accent,
          minHeight: 112,
        }}
      />
    </section>
  )
}

export default function GuidedExamResponse({ module, exam, onExit, onContinue, theme }) {
  const rawSubject = exam.subject || module.subject || 'history'
  const capitalised = rawSubject.charAt(0).toUpperCase() + rawSubject.slice(1).toLowerCase()
  const subjectTheme = SUBJECTS[capitalised] || SUBJECTS.History
  const isGeneral = theme === 'general'
  const accent = isGeneral ? GENERAL.teal : subjectTheme.accent
  const bg = isGeneral ? GENERAL.neutral[0] : subjectTheme.background

  const [phase, setPhase] = useState('darkBeat')
  const [beatVisible, setBeatVisible] = useState(false)
  const [sectionTexts, setSectionTexts] = useState(() => exam.sections.map(s => s.starter || ''))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [recurringPattern, setRecurringPattern] = useState(null)
  const [sourcesOpen, setSourcesOpen] = useState(false)
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
        const flaggedTypes = new Set(data.techniqueFlags.map(f => f.type))
        const recurring = getExamTechniquePatterns(RECURRING_PATTERN_THRESHOLD).find(p => flaggedTypes.has(p.type))
        if (recurring) setRecurringPattern(recurring)
      }

      setPhase('result')
    } catch {
      setError("Marking failed — your answer hasn't been lost, just give it another go.")
      setPhase('writing')
    } finally {
      setSubmitting(false)
    }
  }

  function advance() {
    onContinue?.({ marksAwarded: result?.marksAwarded ?? 0, marksAvailable: exam.marks })
  }

  const headerStyle = {
    position: 'sticky', top: 0, zIndex: 20,
    background: 'rgba(8,9,13,0.82)',
    backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 16px', height: 52, flexShrink: 0,
  }
  const labelStyle = {
    ...TYPE.eyebrow,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.55)',
  }
  const marksBadgeStyle = {
    ...TYPE.eyebrow,
  }
  const sectionHeadingStyle = {
    ...TYPE.eyebrow,
    fontSize: 9,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.3)',
    marginBottom: 12,
  }
  const ctaStyle = enabled => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',
    height: BUTTONS.continue.height, borderRadius: BUTTONS.continue.borderRadius,
    border: 'none',
    background: enabled ? accent : 'rgba(255,255,255,0.08)',
    color: enabled ? '#0D0F14' : 'rgba(255,255,255,0.3)',
    fontFamily: BUTTONS.continue.fontFamily,
    fontSize: BUTTONS.continue.fontSize, fontWeight: BUTTONS.continue.fontWeight,
    cursor: enabled ? 'pointer' : 'default',
    transition: `transform ${BUTTONS.continue.transition}`,
  })
  const errorStyle = {
    padding: '10px 14px', borderRadius: RADII.small,
    background: 'rgba(192,80,85,0.12)',
    border: '1px solid rgba(192,80,85,0.3)',
    fontFamily: "'Sora', sans-serif",
    fontSize: 12.5, color: '#E8746A',
  }

  if (phase === 'darkBeat') {
    return createPortal(
      <div onClick={() => setPhase('intro')} style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '100dvh', zIndex: 1000, background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <div style={{ ...TYPE.displayScreen, color: 'rgba(245,238,225,0.92)', textAlign: 'center', padding: `0 ${SPACING.section}px`, opacity: beatVisible ? 1 : 0, transition: `opacity ${MOTION.duration.cinematic} ${MOTION.easing.standard}` }}>
          {exam.beatText || 'Last task — give it a go yourself'}
        </div>
      </div>,
      document.body
    )
  }

  if (phase === 'intro') {
    return createPortal(
      <>
        <style>{`@keyframes ger-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '100dvh', zIndex: 1000, background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={headerStyle}>
            <BackButton onClick={onExit} />
            <div style={labelStyle}>Exam practice<span style={{ color: accent, marginLeft: 6 }}>· {(module.subject || '').toUpperCase()}</span></div>
            <div style={{ ...marksBadgeStyle, color: accent }}>{exam.marks} MARKS</div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: `0 ${SPACING.standard}px` }}>
            <div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: accent, marginBottom: SPACING.compact, animation: `ger-up 500ms ${MOTION.easing.standard} both` }}>Your turn — no sample answer this time</div>
            <SourcesCard sources={exam.sources} accent={accent} open={sourcesOpen} onToggle={() => setSourcesOpen(o => !o)} />
            <div style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 24, lineHeight: 1.4, color: 'rgba(245,238,225,0.92)', marginBottom: SPACING.standard, animation: `ger-up 550ms ${MOTION.easing.standard} 90ms both` }}>{exam.question}</div>
            <p style={{ ...TYPE.body, fontSize: 15, color: 'rgba(255,255,255,0.5)', margin: 0, animation: `ger-up 550ms ${MOTION.easing.standard} 180ms both` }}>Time to write your own answer. Build it up section by section, then we'll mark it properly and show you exactly how to gain more marks.</p>
          </div>
          <div style={{ flexShrink: 0, padding: `0 ${SPACING.standard}px calc(${SPACING.standard}px + env(safe-area-inset-bottom, 0px))` }}>
            <button onClick={() => setPhase('writing')} style={ctaStyle(true)}>Start writing →</button>
          </div>
        </div>
      </>,
      document.body
    )
  }

  if (phase === 'writing') {
    return createPortal(
      <>
        <style>{`
          .ger-textarea { outline: none; resize: none; }
          .ger-textarea::placeholder { color: rgba(245,238,225,0.28); font-family: ${TYPE.body.fontFamily}; font-size: 14px; }
          .ger-writing-scroll { scrollbar-width: none; -ms-overflow-style: none; }
          .ger-writing-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
        `}</style>
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '100dvh', zIndex: 1000, background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={headerStyle}>
            <BackButton onClick={onExit} />
            <div style={labelStyle}>Write for the examiner<span style={{ color: accent, marginLeft: 6 }}>· {(module.subject || '').toUpperCase()}</span></div>
            <div style={{ ...marksBadgeStyle, color: accent }}>{exam.marks} MARKS</div>
          </div>
          <div style={{ flexShrink: 0, padding: `${SPACING.compact}px ${SPACING.standard}px 0` }}>
            <SourcesCard sources={exam.sources} accent={accent} open={sourcesOpen} onToggle={() => setSourcesOpen(o => !o)} />
            <div style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 15.5, lineHeight: 1.5, color: 'rgba(245,238,225,0.78)' }}>{exam.question}</div>
          </div>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div className="ger-writing-scroll" style={{ position: 'relative', flex: 1, overflowY: 'auto', padding: `${SPACING.standard}px ${SPACING.standard}px ${SPACING.separation}px`, display: 'flex', flexDirection: 'column', gap: SPACING.compact }}>
              {exam.sections.map((section, i) => (
                <StrategyLane
                  key={section.label}
                  section={section}
                  value={sectionTexts[i]}
                  accent={accent}
                  index={i}
                  onChange={value => setSectionTexts(prev => prev.map((t, j) => (j === i ? value : t)))}
                />
              ))}
              {error && <div style={errorStyle}>{error}</div>}
              <button onClick={handleSubmit} disabled={!allFilled || submitting} style={ctaStyle(allFilled && !submitting)}>Submit my answer →</button>
            </div>
          </div>
        </div>
      </>,
      document.body
    )
  }

  if (phase === 'marking') {
    return createPortal(
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '100dvh', zIndex: 1000, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ ...TYPE.metadata, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Marking your answer…</div>
      </div>,
      document.body
    )
  }

  if (phase === 'result' && result) {
    return createPortal(
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '100dvh', zIndex: 1000, background: bg, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={headerStyle}>
          <BackButton onClick={onExit} />
          <div style={labelStyle}>Examiner's verdict<span style={{ color: accent, marginLeft: 6 }}>· {(module.subject || '').toUpperCase()}</span></div>
          <div style={{ width: 24 }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: `${SPACING.standard}px ${SPACING.standard}px ${SPACING.separation}px` }}>
          <div style={{ ...TYPE.displaySection, fontSize: 38, color: accent, marginBottom: 6 }}>
            {result.marksAwarded}/{result.marksAvailable ?? exam.marks}
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 400, fontSize: 13, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', textTransform: 'uppercase', marginLeft: 10 }}>examiner's mark</span>
          </div>
          <p style={{ ...TYPE.body, fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: '0 0 24px' }}>{result.verdict}</p>

          {Array.isArray(result.sectionFeedback) && result.sectionFeedback.length > 0 && (
            <div style={{ marginBottom: 26 }}>
              <div style={sectionHeadingStyle}>Section by section</div>
              {result.sectionFeedback.map((sf, i) => (
                <div key={i} style={{ marginBottom: SPACING.compact }}>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 12.5, color: accent, marginBottom: 3 }}>{sf.label}</div>
                  <div style={{ ...TYPE.bodySmall, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{sf.comment}</div>
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
                  <div style={{ ...TYPE.bodySmall, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{s}</div>
                </div>
              ))}
            </div>
          )}

          {result.rewrittenSentence && (
            <div style={{ marginBottom: 26 }}>
              <div style={sectionHeadingStyle}>Try it like this</div>
              <div style={{ padding: SPACING.compact, borderRadius: RADII.medium, background: `${accent}14`, border: `1px solid ${accent}40`, marginBottom: SPACING.micro }}>
                <div style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 14.5, lineHeight: 1.6, color: 'rgba(245,238,225,0.92)' }}>{result.rewrittenSentence.improvedSentence}</div>
              </div>
              <div style={{ ...TYPE.bodySmall, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{result.rewrittenSentence.whyItScoresBetter}</div>
            </div>
          )}

          {recurringPattern && (
            <div style={{ padding: SPACING.compact, borderRadius: RADII.medium, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={sectionHeadingStyle}>Noticed</div>
              <div style={{ ...TYPE.bodySmall, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>We've noticed you tend towards {TECHNIQUE_LABELS[recurringPattern.type] || 'the same kind of slip'} — we'll bring this back up.</div>
            </div>
          )}
        </div>
        <div style={{ flexShrink: 0, padding: `${SPACING.compact}px ${SPACING.standard}px calc(${SPACING.compact}px + env(safe-area-inset-bottom, 0px))`, background: bg, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <ContinueCTA onClick={advance} accent={accent} />
        </div>
      </div>,
      document.body
    )
  }

  return null
}
