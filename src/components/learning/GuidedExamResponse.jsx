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
import ExamPrompt from '../core/ExamPrompt.jsx'

const RECURRING_PATTERN_THRESHOLD = 3
const SUPPORTED_SUPPORT_MODES = new Set(['guided', 'light', 'none'])

const DEFAULT_LABELS = {
  practiceHeader: 'Exam practice',
  writingHeader: 'Write your response',
  feedbackHeader: 'Your feedback',
  introKicker: 'Your turn',
  introBody: 'Build your response section by section. You’ll get an estimated mark and clear feedback.',
  start: 'Start my response',
  submit: 'Submit my response',
  marking: 'Marking your response…',
  estimatedMark: 'Estimated mark',
  priority: 'Biggest improvement',
  sectionFeedback: 'Section feedback',
  improvements: 'How to improve it',
  rewrite: 'See an improved version',
  noticed: 'Noticed',
  hint: 'Need a hint?',
  anotherHint: 'Show another hint',
  hideHints: 'Hide hints',
  continue: 'Continue',
}

const TECHNIQUE_LABELS = {
  missingExample: 'making a claim without supporting it with evidence',
  noNamedMechanism: 'naming a process or factor without explaining how it works',
  onlyOneIdeaDeveloped: 'developing one required point but leaving another underdeveloped',
  vagueLanguage: 'using vague wording instead of precise subject vocabulary',
  repeatsQuestion: 'restating the question instead of answering it',
  noSpecificDetail: 'leaving out the precise detail the mark scheme rewards',
  methodNotShown: 'jumping to an answer without showing enough method',
  calculationSlip: 'making a calculation, substitution, unit or rounding slip',
  weakAnalysisLink: 'using evidence without explaining what it shows',
  missingEvaluation: 'giving an argument without weighing it up or reaching a judgement',
}

function hasWritten(text, starter) {
  const trimmed = (text || '').trim()
  return trimmed.length > 0 && trimmed !== (starter || '').trim()
}

function renderFullScreen(node) {
  if (typeof document === 'undefined') return node

  // The review lab deliberately contains fixed full-screen components inside its
  // virtual mobile viewport. Portalling to document.body would escape that frame.
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

function titleCase(value) {
  return String(value || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

function resolveSubject(rawSubject, suppliedLabel) {
  const value = String(rawSubject || '').trim()
  const key = Object.keys(SUBJECTS).find(subject => subject.toLowerCase() === value.toLowerCase()) || null

  return {
    label: suppliedLabel || key || titleCase(value) || null,
    theme: key ? SUBJECTS[key] : null,
  }
}

function resolveSupportMode(exam) {
  if (SUPPORTED_SUPPORT_MODES.has(exam.supportMode)) return exam.supportMode

  // Backwards compatibility for the existing GuidedAnswerCoach data. New content
  // should provide supportMode explicitly rather than encode it in display copy.
  const beat = String(exam.beatText || '').toLowerCase()
  if (beat.includes('no support') || beat.includes('independent')) return 'none'
  if (beat.includes('light support')) return 'light'
  return 'guided'
}

function getConciseRewrite(value, maxWords = 52) {
  const clean = String(value || '').replace(/\s+/g, ' ').trim()
  const words = clean.split(' ').filter(Boolean)
  if (words.length <= maxWords) return clean

  const candidate = words.slice(0, maxWords).join(' ')
  const punctuation = Math.max(
    candidate.lastIndexOf('. '),
    candidate.lastIndexOf('? '),
    candidate.lastIndexOf('! '),
    candidate.lastIndexOf('; '),
  )

  if (punctuation > candidate.length * 0.55) {
    return candidate.slice(0, punctuation + 1).trim()
  }

  return `${candidate.replace(/[,:;–—-]+$/, '')}…`
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

function getSupportHints(section, supportMode) {
  if (supportMode === 'none') return []

  const configured = Array.isArray(section.hints)
    ? section.hints.filter(Boolean)
    : []

  const generic = [
    'Add the next step in your response.',
    'Check that each step directly answers the question.',
  ]

  const hints = configured.length ? configured : generic
  return hints.slice(0, supportMode === 'light' ? 1 : 2)
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
          {sources.map((source, index) => (
            <div
              key={source.label}
              style={{
                paddingTop: index === 0 ? 0 : SPACING.compact,
                marginTop: index === 0 ? 0 : SPACING.compact,
                borderTop: index === 0 ? 'none' : `1px solid ${GENERAL.line.faint}`,
              }}
            >
              <div style={{ ...TYPE.label, color: accent, marginBottom: SPACING.micro }}>{source.label}</div>
              {source.attribution && (
                <div style={{
                  ...TYPE.caption,
                  fontStyle: 'italic',
                  color: GENERAL.cinematic.textMuted,
                  marginBottom: SPACING.micro,
                }}>
                  {source.attribution}
                </div>
              )}
              <div style={{ ...TYPE.examAnswer, color: GENERAL.cinematic.textFact, whiteSpace: 'pre-wrap' }}>
                {source.text}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StrategyLane({ section, value, onChange, accent, supportMode, labels }) {
  const [hintLevel, setHintLevel] = useState(0)
  const hintRegionId = useId()
  const hints = getSupportHints(section, supportMode)
  const revealedHint = hintLevel > 0 ? hints[hintLevel - 1] : null
  const canRevealMore = hintLevel < hints.length

  function handleHintAction() {
    if (canRevealMore) {
      setHintLevel(level => level + 1)
      return
    }
    setHintLevel(0)
  }

  return (
    <section style={{
      position: 'relative',
      paddingLeft: SPACING.compact,
    }}>
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: hints.length ? BUTTONS.compact.height : 0,
        width: COMPONENT_SIZE.accentRail,
        borderRadius: RADII.pill,
        background: accent,
      }} />

      <div style={{ ...TYPE.label, color: accent, marginBottom: SPACING.micro }}>
        {section.label}
      </div>

      <textarea
        className="ger-textarea"
        rows={3}
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={section.inputPlaceholder || 'Write your response here…'}
        aria-label={section.label}
        inputMode={section.inputMode || 'text'}
        spellCheck={section.spellCheck ?? true}
        style={{
          ...TYPE.examAnswer,
          width: '100%',
          boxSizing: 'border-box',
          minHeight: SPACING.cinematic + SPACING.micro,
          border: `1px solid ${GENERAL.line.soft}`,
          background: GENERAL.backgroundSunken,
          borderRadius: RADII.medium,
          padding: SPACING.compact,
          color: GENERAL.cinematic.textPrimary,
          caretColor: accent,
        }}
      />

      {hints.length > 0 && (
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
          {hintLevel === 0
            ? labels.hint
            : canRevealMore
              ? labels.anotherHint
              : labels.hideHints}
        </button>
      )}

      {revealedHint && (
        <div
          id={hintRegionId}
          role="status"
          aria-live="polite"
          style={{
            ...TYPE.bodySmall,
            padding: `0 0 ${SPACING.micro}px ${SPACING.compact}px`,
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

function FeedbackAccordion({ id, title, open, onToggle, accent, children }) {
  const regionId = useId()

  return (
    <section style={{ borderTop: `1px solid ${GENERAL.line.faint}` }}>
      <button
        type="button"
        className="ger-focusable"
        onClick={() => onToggle(id)}
        aria-expanded={open}
        aria-controls={regionId}
        style={{
          ...TYPE.bodyStrong,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: SPACING.compact,
          width: '100%',
          minHeight: BUTTONS.compact.height,
          padding: `${SPACING.compact}px 0`,
          border: 'none',
          background: 'transparent',
          color: open ? accent : GENERAL.cinematic.textSecondary,
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        <span>{title}</span>
        <span aria-hidden="true" style={{ ...TYPE.label, color: open ? accent : GENERAL.cinematic.textSubtle }}>
          {open ? '−' : '+'}
        </span>
      </button>

      {open && (
        <div
          id={regionId}
          style={{
            padding: `0 0 ${SPACING.standard}px ${SPACING.compact}px`,
            borderLeft: `${COMPONENT_SIZE.accentRail}px solid ${accent}`,
          }}
        >
          {children}
        </div>
      )}
    </section>
  )
}

// `embedded` — set by ModulePlayer when this screen runs inside a module,
// where the floating LearningHeader capsule already owns back/exit and the
// top strip. Standalone hosts keep this component's self-contained header.
export default function GuidedExamResponse({ module = {}, exam = {}, onExit, onContinue, theme, embedded = false }) {
  const sections = Array.isArray(exam.sections) ? exam.sections : []
  const rawSubject = exam.subject || module?.subject || ''
  const resolvedSubject = resolveSubject(rawSubject, exam.subjectLabel)
  const isGeneral = theme === 'general' || !resolvedSubject.theme
  const accent = isGeneral ? GENERAL.teal : resolvedSubject.theme.accent
  const bg = isGeneral ? GENERAL.backgroundApp : resolvedSubject.theme.background
  const beatText = exam.beatText?.trim() || ''
  const supportMode = resolveSupportMode(exam)
  const labels = { ...DEFAULT_LABELS, ...(exam.labels || {}) }
  const reducedMotion = useReducedMotion()

  const [phase, setPhase] = useState(beatText ? 'darkBeat' : 'intro')
  const [beatVisible, setBeatVisible] = useState(false)
  const [sectionTexts, setSectionTexts] = useState(() => sections.map(section => section.starter || ''))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [recurringPattern, setRecurringPattern] = useState(null)
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const [openFeedbackId, setOpenFeedbackId] = useState(null)
  const loggedRef = useRef(false)

  useEffect(() => {
    if (!beatText || reducedMotion) {
      setBeatVisible(true)
      return undefined
    }
    const id = setTimeout(() => setBeatVisible(true), 140)
    return () => clearTimeout(id)
  }, [beatText, reducedMotion])

  const allFilled = sections.length > 0
    && sections.every((section, index) => hasWritten(sectionTexts[index], section.starter))

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
          questionType: exam.questionType || null,
          marks: exam.marks,
          markScheme: exam.markScheme,
          sections: sections.map((section, index) => ({
            label: section.label,
            starter: section.starter || '',
            studentText: sectionTexts[index],
          })),
          subject: rawSubject || null,
          board: exam.board || null,
          topic: exam.topic || null,
        }),
      })

      if (!response.ok) throw new Error('Marking request failed')
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
      setOpenFeedbackId(null)

      if (!loggedRef.current && Array.isArray(data.techniqueFlags) && data.techniqueFlags.length) {
        loggedRef.current = true
        const trackedSubject = resolvedSubject.label || 'General'

        data.techniqueFlags.forEach(flag => {
          logExamTechnique({
            subject: trackedSubject,
            type: flag.type,
            evidence: flag.evidence,
            suggestion: flag.suggestion,
            questionId: `${module?.id || 'module'}-${exam.topic || exam.questionType || 'exam'}-${exam.marks}`,
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
      setError("Marking failed — your response hasn't been lost. Give it another go.")
      setPhase('writing')
    } finally {
      setSubmitting(false)
    }
  }

  function advance() {
    onContinue?.({
      marksAwarded: result?.marksAwarded ?? 0,
      marksAvailable: exam.marks,
    })
  }

  function headerText(base) {
    return resolvedSubject.label ? `${base} · ${resolvedSubject.label}` : base
  }

  function toggleFeedback(id) {
    setOpenFeedbackId(current => current === id ? null : id)
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
  const headerSpacerStyle = {
    width: BUTTONS.compact.height,
    flexShrink: 0,
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
          aria-label={`${beatText}. Continue to the question.`}
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
            background: bg,
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
              <div style={headerLabelStyle}>{headerText(labels.practiceHeader)}</div>
              <div style={marksLabelStyle}>{exam.marks} marks</div>
            </div>
          )}

          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{
              maxWidth: 430,
              margin: '0 auto',
              padding: embedded
                ? `${capsuleClearance} ${SPACING.standard}px ${SPACING.standard}px`
                : `${SPACING.standard}px ${SPACING.standard}px ${SPACING.standard}px`,
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
                {labels.introKicker}
              </div>

              <SourcesCard
                sources={exam.sources}
                accent={accent}
                open={sourcesOpen}
                onToggle={() => setSourcesOpen(open => !open)}
              />

              <ExamPrompt
                question={exam.displayQuestion || exam.question}
                marks={exam.marks}
                accent={accent}
                variant="hero"
                showMarks={embedded}
                style={{
                  marginBottom: SPACING.compact,
                  animation: reducedMotion ? 'none' : `ger-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
                }}
              />

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
                {exam.introText || labels.introBody}
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
              label={labels.start}
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
              <div style={headerLabelStyle}>{headerText(labels.writingHeader)}</div>
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
            <ExamPrompt
              question={exam.displayQuestion || exam.question}
              marks={exam.marks}
              accent={accent}
              variant="compact"
              showMarks={embedded}
            />
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
                gap: SPACING.standard,
              }}
            >
              {sections.map((section, index) => (
                <StrategyLane
                  key={section.id || section.label}
                  section={section}
                  value={sectionTexts[index]}
                  accent={accent}
                  supportMode={supportMode}
                  labels={labels}
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
                label={submitting ? labels.marking : labels.submit}
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
          <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted }}>{labels.marking}</div>
        </div>
      </>
    )
  }

  if (phase === 'result' && result) {
    const feedbackSections = Array.isArray(result.sectionFeedback) ? result.sectionFeedback : []
    const suggestions = Array.isArray(result.improvementSuggestions)
      ? result.improvementSuggestions.filter(Boolean)
      : []
    const primarySuggestion = suggestions[0] || null
    const furtherSuggestions = suggestions.slice(1)
    const conciseRewrite = getConciseRewrite(result.rewrittenSentence?.improvedSentence)

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
              <div style={headerLabelStyle}>{headerText(labels.feedbackHeader)}</div>
              <div aria-hidden="true" style={headerSpacerStyle} />
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
              <div style={{ ...TYPE.label, color: GENERAL.cinematic.textSubtle }}>{labels.estimatedMark}</div>
            </div>

            <p style={{ ...TYPE.body, color: GENERAL.cinematic.textSecondary, margin: `0 0 ${SPACING.standard}px` }}>
              {result.verdict}
            </p>

            {primarySuggestion && (
              <div style={{
                paddingLeft: SPACING.compact,
                borderLeft: `${COMPONENT_SIZE.accentRail}px solid ${accent}`,
                marginBottom: SPACING.standard,
              }}>
                <div style={{ ...TYPE.label, color: accent, marginBottom: SPACING.micro }}>
                  {labels.priority}
                </div>
                <div style={{ ...TYPE.bodyStrong, color: GENERAL.cinematic.textPrimary }}>
                  {primarySuggestion}
                </div>
              </div>
            )}

            <div style={{ borderBottom: `1px solid ${GENERAL.line.faint}` }}>
              {feedbackSections.length > 0 && (
                <FeedbackAccordion
                  id="sections"
                  title={labels.sectionFeedback}
                  open={openFeedbackId === 'sections'}
                  onToggle={toggleFeedback}
                  accent={accent}
                >
                  {feedbackSections.map((feedback, index) => (
                    <div key={feedback.label || index} style={{ marginBottom: index === feedbackSections.length - 1 ? 0 : SPACING.compact }}>
                      <div style={{ ...TYPE.label, color: GENERAL.cinematic.textSecondary, marginBottom: SPACING.micro }}>
                        {feedback.label}
                      </div>
                      <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted }}>
                        {feedback.comment}
                      </div>
                    </div>
                  ))}

                  {recurringPattern && (
                    <div style={{
                      marginTop: SPACING.compact,
                      paddingTop: SPACING.compact,
                      borderTop: `1px solid ${GENERAL.line.faint}`,
                    }}>
                      <div style={{ ...TYPE.label, color: GENERAL.cinematic.textSecondary, marginBottom: SPACING.micro }}>
                        {labels.noticed}
                      </div>
                      <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted }}>
                        We've noticed you tend towards {TECHNIQUE_LABELS[recurringPattern.type] || 'the same kind of slip'} — we'll bring this back up.
                      </div>
                    </div>
                  )}
                </FeedbackAccordion>
              )}

              {furtherSuggestions.length > 0 && (
                <FeedbackAccordion
                  id="improvements"
                  title={labels.improvements}
                  open={openFeedbackId === 'improvements'}
                  onToggle={toggleFeedback}
                  accent={accent}
                >
                  {furtherSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      style={{
                        ...TYPE.bodySmall,
                        color: GENERAL.cinematic.textMuted,
                        marginBottom: index === furtherSuggestions.length - 1 ? 0 : SPACING.compact,
                      }}
                    >
                      {suggestion}
                    </div>
                  ))}
                </FeedbackAccordion>
              )}

              {result.rewrittenSentence && conciseRewrite && (
                <FeedbackAccordion
                  id="rewrite"
                  title={labels.rewrite}
                  open={openFeedbackId === 'rewrite'}
                  onToggle={toggleFeedback}
                  accent={accent}
                >
                  <div style={{ ...TYPE.examAnswer, color: GENERAL.cinematic.textPrimary, marginBottom: SPACING.micro }}>
                    {conciseRewrite}
                  </div>
                  <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted }}>
                    {result.rewrittenSentence.whyItScoresBetter}
                  </div>
                </FeedbackAccordion>
              )}
            </div>
          </div>

          <div style={{
            flexShrink: 0,
            padding: `${SPACING.compact}px ${SPACING.standard}px calc(${SPACING.compact}px + env(safe-area-inset-bottom, 0px))`,
            background: bg,
            borderTop: `1px solid ${GENERAL.line.faint}`,
          }}>
            <ContinueCTA {...ctaProps} onClick={advance} label={labels.continue} />
          </div>
        </div>
      </>
    )
  }

  return null
}
