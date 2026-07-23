import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { SPACING, COMPONENT_SIZE } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { RADII } from '../../constants/radii.js'
import { BUTTONS } from '../../constants/buttons.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { logExamTechnique, getExamTechniquePatterns } from '../../unifiedWeaknessTracker.js'
import BackButton from '../core/BackButton.jsx'
import ContinueCTA from '../core/ContinueCTA.jsx'
import { ScreenTitle } from '../core/ScreenText.jsx'

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

function renderFullScreen(node) {
  if (typeof document === 'undefined') return node

  // The review lab deliberately contains fixed full-screen components inside its
  // virtual mobile viewport. Portalling to document.body would escape that frame
  // and cover the lab toolbar, so render in place only inside the review preview.
  const isReviewPreview = document.querySelector('[data-review-preview-mode]')
  return isReviewPreview ? node : createPortal(node, document.body)
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)
    update()
    query.addEventListener?.('change', update)
    return () => query.removeEventListener?.('change', update)
  }, [])

  return reduced
}

function GuidedExamStyles({ accent }) {
  return (
    <style>{`
      .ger-focusable:focus-visible,
      .ger-textarea:focus-visible {
        outline: ${COMPONENT_SIZE.focusRing}px solid ${accent};
        outline-offset: ${COMPONENT_SIZE.focusOffset}px;
      }
      .ger-textarea {
        resize: vertical;
      }
      .ger-textarea::placeholder {
        color: ${GENERAL.cinematic.textSubtle};
        font-family: ${TYPE.body.fontFamily};
      }
      .ger-writing-scroll {
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .ger-writing-scroll::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
      }
      @keyframes ger-up {
        from { opacity: 0; transform: translateY(${SPACING.compact}px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @media (prefers-reduced-motion: reduce) {
        .ger-motion {
          animation: none !important;
          transition: none !important;
        }
      }
    `}</style>
  )
}

function getSupportHints(section) {
  const configured = Array.isArray(section.hints)
    ? section.hints.filter(Boolean).slice(0, 2)
    : []

  if (configured.length) return configured

  const legacyPrompt = (section.placeholder || '').trim()
  const promptLike = /^(think|what|how|which|where|when|who|name|use|decide|choose|start|compare|explain)\b/i.test(legacyPrompt)

  return [
    promptLike
      ? legacyPrompt
      : section.starter
        ? 'Build on the sentence starter with one precise fact.'
        : 'Start by naming the key factor, comparison or judgement.',
    'Then explain how that detail answers the question. Try “this meant that…” or “therefore…”.',
  ]
}

function SourcesCard({ sources, accent, open, onToggle }) {
  const regionId = useId()
  if (!Array.isArray(sources) || sources.length === 0) return null

  return (
    <div style={{
      borderRadius: RADII.medium,
      border: `1px solid ${GENERAL.line.soft}`,
      background: GENERAL.surfaceTint,
      marginBottom: SPACING.compact,
      overflow: 'hidden',
    }}>
      <button
        type="button"
        className="ger-focusable"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={regionId}
        style={{
          ...TYPE.label,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          minHeight: BUTTONS.compact.height,
          padding: `0 ${SPACING.compact}px`,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: accent,
        }}
      >
        <span>{sources.length > 1 ? 'View sources' : 'View source'}</span>
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div id={regionId} style={{ padding: `0 ${SPACING.compact}px ${SPACING.compact}px` }}>
          {sources.map((src, index) => (
            <div
              key={src.label}
              style={{
                paddingTop: index === 0 ? 0 : SPACING.compact,
                marginTop: index === 0 ? 0 : SPACING.compact,
                borderTop: index === 0 ? 'none' : `1px solid ${GENERAL.line.faint}`,
              }}
            >
              <div style={{ ...TYPE.label, color: accent, marginBottom: SPACING.micro }}>{src.label}</div>
              {src.attribution && (
                <div style={{ ...TYPE.caption, fontStyle: 'italic', color: GENERAL.cinematic.textMuted, marginBottom: SPACING.micro }}>
                  {src.attribution}
                </div>
              )}
              <div style={{ ...TYPE.examAnswer, color: GENERAL.cinematic.textFact, whiteSpace: 'pre-wrap' }}>{src.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StrategyLane({ section, value, onChange, accent }) {
  const [hintLevel, setHintLevel] = useState(0)
  const hintRegionId = useId()
  const hints = getSupportHints(section)
  const revealedHint = hintLevel > 0 ? hints[hintLevel - 1] : null
  const canRevealMore = hintLevel < hints.length

  function handleHintAction() {
    if (hintLevel === 0 || canRevealMore) {
      setHintLevel(level => level + 1)
      return
    }
    setHintLevel(0)
  }

  return (
    <section style={{
      position: 'relative',
      padding: SPACING.compact,
      borderRadius: RADII.large,
      background: GENERAL.surfaceTint,
      border: `1px solid ${GENERAL.line.soft}`,
      boxShadow: GENERAL.shadow.raised,
    }}>
      <div style={{
        position: 'absolute',
        left: 0,
        top: SPACING.compact,
        bottom: SPACING.compact,
        width: COMPONENT_SIZE.accentRail,
        borderRadius: RADII.pill,
        background: accent,
      }} />
      <div style={{ ...TYPE.label, color: accent, marginBottom: SPACING.micro }}>
        {section.label}
      </div>
      <textarea
        className="ger-textarea"
        rows={4}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={section.inputPlaceholder || 'Write your response here…'}
        aria-label={section.label}
        style={{
          ...TYPE.examAnswer,
          width: '100%',
          boxSizing: 'border-box',
          minHeight: SPACING.section,
          border: `1px solid ${GENERAL.line.soft}`,
          background: GENERAL.backgroundSunken,
          borderRadius: RADII.medium,
          padding: SPACING.compact,
          color: GENERAL.cinematic.textPrimary,
          caretColor: accent,
        }}
      />

      <button
        type="button"
        className="ger-focusable"
        onClick={handleHintAction}
        aria-expanded={hintLevel > 0}
        aria-controls={hintRegionId}
        style={{
          ...TYPE.label,
          minHeight: BUTTONS.compact.height,
          padding: `${SPACING.micro}px 0 0`,
          background: 'transparent',
          border: 'none',
          color: accent,
          cursor: 'pointer',
        }}
      >
        {hintLevel === 0 ? 'Need a hint?' : canRevealMore ? 'Show another hint' : 'Hide hints'}
      </button>

      {revealedHint && (
        <div
          id={hintRegionId}
          role="status"
          aria-live="polite"
          style={{
            ...TYPE.bodySmall,
            padding: SPACING.compact,
            borderRadius: RADII.medium,
            background: GENERAL.backgroundSunken,
            borderLeft: `${COMPONENT_SIZE.accentRail}px solid ${accent}`,
            color: GENERAL.cinematic.textSecondary,
          }}
        >
          {revealedHint}
        </div>
      )}
    </section>
  )
}

// `embedded` — set by ModulePlayer when this screen runs inside a module,
// where the floating LearningHeader capsule already owns back/exit and the
// top strip: the component's own header band is suppressed and content
// clears the capsule instead. Standalone hosts (GuidedAnswerCoach in Exam
// Mode) omit it and keep the self-contained header.
export default function GuidedExamResponse({ module, exam, onExit, onContinue, theme, embedded = false }) {
  const rawSubject = exam.subject || module.subject || 'history'
  const capitalised = rawSubject.charAt(0).toUpperCase() + rawSubject.slice(1).toLowerCase()
  const subjectTheme = SUBJECTS[capitalised] || SUBJECTS.History
  const isGeneral = theme === 'general'
  const accent = isGeneral ? GENERAL.teal : subjectTheme.accent
  const bg = isGeneral ? GENERAL.backgroundApp : subjectTheme.background
  const beatText = exam.beatText?.trim() || ''
  const reducedMotion = useReducedMotion()

  const [phase, setPhase] = useState(beatText ? 'darkBeat' : 'intro')
  const [beatVisible, setBeatVisible] = useState(false)
  const [sectionTexts, setSectionTexts] = useState(() => exam.sections.map(section => section.starter || ''))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [recurringPattern, setRecurringPattern] = useState(null)
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const loggedRef = useRef(false)

  useEffect(() => {
    if (!beatText || reducedMotion) {
      setBeatVisible(true)
      return undefined
    }
    const id = setTimeout(() => setBeatVisible(true), 140)
    return () => clearTimeout(id)
  }, [beatText, reducedMotion])

  const allFilled = exam.sections.every((section, index) => hasWritten(sectionTexts[index], section.starter))

  async function handleSubmit() {
    if (!allFilled || submitting) return
    setSubmitting(true)
    setError(null)
    setPhase('marking')
    try {
      const response = await fetch('/api/guidedExamResponse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: exam.question,
          marks: exam.marks,
          markScheme: exam.markScheme,
          sections: exam.sections.map((section, index) => ({
            label: section.label,
            studentText: sectionTexts[index],
          })),
          subject: exam.subject || module.subject,
          board: exam.board || 'edexcel',
          topic: exam.topic,
        }),
      })
      if (!response.ok) throw new Error('Marking request failed')
      const data = await response.json()
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
        const flaggedTypes = new Set(data.techniqueFlags.map(flag => flag.type))
        const recurring = getExamTechniquePatterns(RECURRING_PATTERN_THRESHOLD)
          .find(pattern => flaggedTypes.has(pattern.type))
        if (recurring) setRecurringPattern(recurring)
      }

      setPhase('result')
    } catch {
      setError("Marking failed — your answer hasn't been lost. Give it another go.")
      setPhase('writing')
    } finally {
      setSubmitting(false)
    }
  }

  function advance() {
    onContinue?.({ marksAwarded: result?.marksAwarded ?? 0, marksAvailable: exam.marks })
  }

  const headerStyle = {
    position: 'sticky',
    top: 0,
    zIndex: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.micro,
    flexShrink: 0,
    minHeight: BUTTONS.compact.height,
    padding: `${SPACING.micro}px ${SPACING.compact}px`,
    background: bg,
    borderBottom: `1px solid ${GENERAL.line.faint}`,
  }
  const capsuleClearance = `calc(${SPACING.cinematic}px + env(safe-area-inset-top, 0px))`
  const headerLabelStyle = {
    ...TYPE.label,
    flex: 1,
    minWidth: 0,
    textAlign: 'center',
    color: GENERAL.cinematic.textMuted,
  }
  const marksLabelStyle = {
    ...TYPE.label,
    color: accent,
    whiteSpace: 'nowrap',
  }
  const sectionHeadingStyle = {
    ...TYPE.label,
    color: GENERAL.cinematic.textSubtle,
    marginBottom: SPACING.compact,
  }
  const errorStyle = {
    ...TYPE.bodySmall,
    padding: SPACING.compact,
    borderRadius: RADII.medium,
    background: GENERAL.surfaceTint,
    border: `1px solid ${GENERAL.error}`,
    color: GENERAL.errorSoft,
  }
  const ctaProps = {
    accent,
    textColor: GENERAL.textOnAccent,
    disabledBackground: GENERAL.line.soft,
    disabledColor: GENERAL.cinematic.textSubtle,
  }

  if (phase === 'darkBeat') {
    return renderFullScreen(
      <>
        <GuidedExamStyles accent={accent} />
        <button
          type="button"
          className="ger-focusable ger-motion"
          onClick={() => setPhase('intro')}
          aria-label={`${beatText}. Continue to the exam question.`}
          style={{
            ...TYPE.displayScreen,
            position: 'fixed',
            inset: 0,
            width: '100%',
            height: '100dvh',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: SPACING.section,
            border: 'none',
            background: GENERAL.backgroundApp,
            color: GENERAL.cinematic.textPrimary,
            textAlign: 'center',
            cursor: 'pointer',
            opacity: beatVisible ? 1 : 0,
            transition: reducedMotion ? 'none' : `opacity ${MOTION.duration.cinematic} ${MOTION.easing.standard}`,
          }}
        >
          {beatText}
        </button>
      </>
    )
  }

  if (phase === 'intro') {
    return renderFullScreen(
      <>
        <GuidedExamStyles accent={accent} />
        <div style={{
          position: 'fixed',
          inset: 0,
          height: '100dvh',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: bg,
        }}>
          {!embedded && (
            <div style={headerStyle}>
              <BackButton onClick={onExit} />
              <div style={headerLabelStyle}>Exam practice · {capitalised}</div>
              <div style={marksLabelStyle}>{exam.marks} marks</div>
            </div>
          )}

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{
              maxWidth: 430,
              margin: '0 auto',
              padding: embedded
                ? `${capsuleClearance} ${SPACING.standard}px ${SPACING.standard}px`
                : `${SPACING.separation}px ${SPACING.standard}px ${SPACING.standard}px`,
            }}>
              <div
                className="ger-motion"
                style={{
                  ...TYPE.label,
                  color: accent,
                  marginBottom: SPACING.compact,
                  animation: reducedMotion ? 'none' : `ger-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
                }}
              >
                Your turn
              </div>
              <SourcesCard
                sources={exam.sources}
                accent={accent}
                open={sourcesOpen}
                onToggle={() => setSourcesOpen(open => !open)}
              />
              <ScreenTitle
                className="ger-motion"
                style={{
                  color: GENERAL.cinematic.textPrimary,
                  marginBottom: SPACING.compact,
                  animation: reducedMotion ? 'none' : `ger-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
                }}
              >
                {exam.question}
              </ScreenTitle>
              <p
                className="ger-motion"
                style={{
                  ...TYPE.body,
                  maxWidth: '34ch',
                  margin: 0,
                  color: GENERAL.cinematic.textMuted,
                  animation: reducedMotion ? 'none' : `ger-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
                }}
              >
                Build your answer section by section. You’ll get an estimated mark and clear feedback.
              </p>
            </div>
          </div>

          <div style={{
            flexShrink: 0,
            padding: `0 ${SPACING.standard}px calc(${SPACING.standard}px + env(safe-area-inset-bottom, 0px))`,
            background: bg,
          }}>
            <ContinueCTA
              {...ctaProps}
              onClick={() => setPhase('writing')}
              label="Start my answer"
            />
          </div>
        </div>
      </>
    )
  }

  if (phase === 'writing') {
    return renderFullScreen(
      <>
        <GuidedExamStyles accent={accent} />
        <div style={{
          position: 'fixed',
          inset: 0,
          height: '100dvh',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: bg,
        }}>
          {!embedded && (
            <div style={headerStyle}>
              <BackButton onClick={onExit} />
              <div style={headerLabelStyle}>Write for the examiner · {capitalised}</div>
              <div style={marksLabelStyle}>{exam.marks} marks</div>
            </div>
          )}

          <div style={{
            flexShrink: 0,
            padding: embedded
              ? `${capsuleClearance} ${SPACING.standard}px 0`
              : `${SPACING.compact}px ${SPACING.standard}px 0`,
          }}>
            <SourcesCard
              sources={exam.sources}
              accent={accent}
              open={sourcesOpen}
              onToggle={() => setSourcesOpen(open => !open)}
            />
            <div style={{ ...TYPE.examQuestion, color: GENERAL.cinematic.textSecondary }}>
              {exam.question}
            </div>
          </div>

          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div
              className="ger-writing-scroll"
              style={{
                position: 'relative',
                flex: 1,
                overflowY: 'auto',
                padding: `${SPACING.standard}px ${SPACING.standard}px ${SPACING.separation}px`,
                display: 'flex',
                flexDirection: 'column',
                gap: SPACING.compact,
              }}
            >
              {exam.sections.map((section, index) => (
                <StrategyLane
                  key={section.label}
                  section={section}
                  value={sectionTexts[index]}
                  accent={accent}
                  onChange={value => setSectionTexts(previous => previous.map((text, textIndex) => (
                    textIndex === index ? value : text
                  )))}
                />
              ))}

              {error && <div role="alert" style={errorStyle}>{error}</div>}

              <ContinueCTA
                {...ctaProps}
                onClick={handleSubmit}
                disabled={!allFilled || submitting}
                label={submitting ? 'Submitting…' : 'Submit my answer'}
                style={{ marginTop: SPACING.micro }}
              />
            </div>
          </div>
        </div>
      </>
    )
  }

  if (phase === 'marking') {
    return renderFullScreen(
      <>
        <GuidedExamStyles accent={accent} />
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            inset: 0,
            height: '100dvh',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: bg,
          }}
        >
          <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted }}>Marking your answer…</div>
        </div>
      </>
    )
  }

  if (phase === 'result' && result) {
    return renderFullScreen(
      <>
        <GuidedExamStyles accent={accent} />
        <div style={{
          position: 'fixed',
          inset: 0,
          height: '100dvh',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: bg,
        }}>
          {!embedded && (
            <div style={headerStyle}>
              <BackButton onClick={onExit} />
              <div style={headerLabelStyle}>Your feedback · {capitalised}</div>
              <div style={marksLabelStyle}>Estimated</div>
            </div>
          )}

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: embedded
              ? `${capsuleClearance} ${SPACING.standard}px ${SPACING.separation}px`
              : `${SPACING.standard}px ${SPACING.standard}px ${SPACING.separation}px`,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: SPACING.micro, marginBottom: SPACING.micro }}>
              <div style={{ ...TYPE.displaySection, color: accent }}>
                {result.marksAwarded}/{result.marksAvailable ?? exam.marks}
              </div>
              <div style={{ ...TYPE.label, color: GENERAL.cinematic.textSubtle }}>Estimated mark</div>
            </div>
            <p style={{ ...TYPE.body, color: GENERAL.cinematic.textSecondary, margin: `0 0 ${SPACING.standard}px` }}>
              {result.verdict}
            </p>

            {Array.isArray(result.sectionFeedback) && result.sectionFeedback.length > 0 && (
              <div style={{ marginBottom: SPACING.standard }}>
                <div style={sectionHeadingStyle}>Section by section</div>
                {result.sectionFeedback.map((feedback, index) => (
                  <div key={index} style={{ marginBottom: SPACING.compact }}>
                    <div style={{ ...TYPE.label, color: accent, marginBottom: SPACING.micro }}>{feedback.label}</div>
                    <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted }}>{feedback.comment}</div>
                  </div>
                ))}
              </div>
            )}

            {Array.isArray(result.improvementSuggestions) && result.improvementSuggestions.length > 0 && (
              <div style={{ marginBottom: SPACING.standard }}>
                <div style={sectionHeadingStyle}>Do this to gain more marks</div>
                {result.improvementSuggestions.map((suggestion, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: SPACING.micro, marginBottom: SPACING.micro }}>
                    <div style={{
                      width: SPACING.micro,
                      height: SPACING.micro,
                      borderRadius: RADII.pill,
                      marginTop: SPACING.micro,
                      flexShrink: 0,
                      background: accent,
                    }} />
                    <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textSecondary }}>{suggestion}</div>
                  </div>
                ))}
              </div>
            )}

            {result.rewrittenSentence && (
              <div style={{ marginBottom: SPACING.standard }}>
                <div style={sectionHeadingStyle}>Try it like this</div>
                <div style={{
                  padding: SPACING.compact,
                  borderRadius: RADII.medium,
                  background: GENERAL.surfaceTint,
                  borderLeft: `${COMPONENT_SIZE.accentRail}px solid ${accent}`,
                  marginBottom: SPACING.micro,
                }}>
                  <div style={{ ...TYPE.examAnswer, color: GENERAL.cinematic.textPrimary }}>
                    {result.rewrittenSentence.improvedSentence}
                  </div>
                </div>
                <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted }}>
                  {result.rewrittenSentence.whyItScoresBetter}
                </div>
              </div>
            )}

            {recurringPattern && (
              <div style={{
                padding: SPACING.compact,
                borderRadius: RADII.medium,
                background: GENERAL.surfaceTint,
                border: `1px solid ${GENERAL.line.soft}`,
              }}>
                <div style={sectionHeadingStyle}>Noticed</div>
                <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted }}>
                  We've noticed you tend towards {TECHNIQUE_LABELS[recurringPattern.type] || 'the same kind of slip'} — we'll bring this back up.
                </div>
              </div>
            )}
          </div>

          <div style={{
            flexShrink: 0,
            padding: `${SPACING.compact}px ${SPACING.standard}px calc(${SPACING.compact}px + env(safe-area-inset-bottom, 0px))`,
            background: bg,
            borderTop: `1px solid ${GENERAL.line.faint}`,
          }}>
            <ContinueCTA {...ctaProps} onClick={advance} />
          </div>
        </div>
      </>
    )
  }

  return null
}
