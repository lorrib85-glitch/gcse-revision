import { useState, useMemo, useRef, useEffect, useId } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { HEADING_LAYOUT, TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { logWrongAnswer, logCorrectAnswer } from '../../unifiedWeaknessTracker.js'
// CinematicShell used here (not ContentShell/InteractionShell): this is a
// full-bleed diagnostic screen that owns its own 100dvh height, internal
// scroll and safe-area insets so the staged field and action stay reachable
// when the mobile keyboard is open.
import CinematicShell from '../layout/CinematicShell.jsx'
import ContinueCTA from '../core/ContinueCTA.jsx'
import CheckAnswerCTA from '../core/CheckAnswerCTA.jsx'
import {
  tokenise,
  resolveTargetRange,
  nextContiguousSelection,
  selectionTokenText,
  targetTokenText,
  scoreSelection,
  evaluateExplanation,
  deriveDiagnosisHeading,
} from './spotTheErrorScoring.js'

const TEXT_PRIMARY = GENERAL.feedbackText
const TEXT_MUTED = 'rgba(245,247,255,0.62)'
const TEXT_FAINT = 'rgba(245,247,255,0.42)'
const EXPLANATION_MIN_HEIGHT = 96

function slugify(text) {
  return (text || '').toLowerCase().slice(0, 40).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function FeedbackRow({ label, children, muted = false }) {
  if (children == null || children === '') return null
  return (
    <div style={{ marginBottom: SPACING.standard }}>
      <p style={{ ...TYPE.label, color: TEXT_MUTED, margin: `0 0 ${SPACING.micro / 2}px` }}>{label}</p>
      <p style={{ ...TYPE.body, color: muted ? TEXT_MUTED : TEXT_PRIMARY, margin: 0, lineHeight: 1.65 }}>
        {children}
      </p>
    </div>
  )
}

export default function SpotTheError({ block, subject = 'Biology', onContinue }) {
  const subj = SUBJECTS[subject] || SUBJECTS.Biology
  const accent = subj.accent
  const rgb = subj.accentRgb

  const statement = block.statement || ''
  const screenTitle = block.title || block.heading || 'Spot the error'
  const screenIntro = block.intro || block.introText || 'One inaccurate word can cost a mark. Find the mistake, then explain why it is wrong.'
  const backgroundImage = block.backgroundImage || (subject === 'Biology' ? '/headers/bio-energyforlife.webp' : null)
  const tokens = useMemo(() => tokenise(statement), [statement])
  const target = useMemo(
    () => resolveTargetRange(tokens, statement, block.errorTarget),
    [tokens, statement, block.errorTarget],
  )

  const [selection, setSelection] = useState(null)
  const [explanation, setExplanation] = useState('')
  const [phase, setPhase] = useState('diagnose')
  const loggedRef = useRef(false)

  const groupId = useId()
  const explainId = useId()
  const explainRef = useRef(null)
  const feedbackHeadingRef = useRef(null)

  const explanationEval = useMemo(() => evaluateExplanation(explanation, block), [explanation, block])
  const hasSelection = selection != null
  const showExplain = hasSelection
  const canCheck = hasSelection && explanationEval.meetsLength

  useEffect(() => {
    if (!showExplain || !explainRef.current) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    explainRef.current.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' })
  }, [showExplain])

  useEffect(() => {
    if (phase === 'feedback') feedbackHeadingRef.current?.focus()
  }, [phase])

  const selectionCorrect = useMemo(() => scoreSelection(selection, target), [selection, target])
  const explanationPrecise = explanationEval.precise

  function tapToken(i) {
    if (phase !== 'diagnose') return
    setSelection(prev => nextContiguousSelection(prev, i))
  }

  function handleCheck() {
    if (!canCheck || phase !== 'diagnose') return

    if (!loggedRef.current) {
      loggedRef.current = true
      const qid = `spotTheError-${slugify(block.id || statement)}`
      const log = (ok, topic, suffix, questionText) => {
        if (ok) {
          logCorrectAnswer({ subject, topic, questionId: `${qid}${suffix}`, source: 'module' })
        } else {
          logWrongAnswer({
            subject,
            topic,
            questionId: `${qid}${suffix}`,
            questionText,
            source: 'module',
            questionType: 'spotTheError',
            marks: 1,
          })
        }
      }
      log(selectionCorrect, 'Error identification', '', statement)
      log(explanationPrecise, 'Scientific precision', '-precision', explanation)
    }

    setPhase('feedback')
  }

  function handleContinue() {
    const fn = block.onContinue || onContinue
    if (fn) fn()
  }

  const heading = deriveDiagnosisHeading({
    selectionCorrect,
    explanationPrecise,
    missHeading: block.missHeading,
  })

  const selectedText = selectionTokenText(tokens, selection)
  const actualErrorText = targetTokenText(tokens, target)

  const textAreaStyle = {
    display: 'block',
    width: '100%',
    background: 'rgba(0,0,0,0.28)',
    border: `1.5px solid rgba(${rgb},0.22)`,
    borderRadius: RADII.medium,
    padding: SPACING.compact,
    ...TYPE.bodySmall,
    color: TEXT_PRIMARY,
    resize: 'none',
    boxSizing: 'border-box',
  }

  return (
    <CinematicShell style={{ background: subj.background, zIndex: 1000, WebkitTapHighlightColor: 'transparent' }}>
      <style>{`
        .ste-token {
          transition: background ${MOTION.duration.fast} ${MOTION.easing.gentle}, box-shadow ${MOTION.duration.fast} ${MOTION.easing.gentle}, color ${MOTION.duration.fast} ${MOTION.easing.gentle};
        }
        .ste-token:focus-visible { outline: 2px solid ${accent}; outline-offset: 2px; }
        .ste-input { outline: none; }
        .ste-input:focus-visible { border-color: rgba(${rgb},0.6); box-shadow: 0 0 0 3px rgba(${rgb},0.14); }
        .ste-input::placeholder { color: ${TEXT_FAINT}; }
        @keyframes ste-reveal { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) {
          .ste-anim { animation: none !important; }
          .ste-token { transition: none !important; }
        }
      `}</style>

      {backgroundImage && (
        <>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: block.backgroundPosition || 'center top',
              opacity: block.backgroundOpacity ?? 0.15,
              filter: 'saturate(0.72) contrast(0.92)',
              transform: 'scale(1.02)',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: `linear-gradient(180deg, rgba(8,10,9,0.62) 0%, rgba(8,10,9,0.84) 44%, ${subj.background} 100%)`,
            }}
          />
        </>
      )}

      <div style={{
        position: 'relative',
        zIndex: 1,
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        padding: `calc(${SPACING.separation}px + env(safe-area-inset-top, 0px)) ${SPACING.standard}px calc(${SPACING.cinematic}px + env(safe-area-inset-bottom, 0px))`,
        scrollPaddingBottom: SPACING.cinematic,
        maxWidth: 420,
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}>
        {phase === 'diagnose' ? (
          <>
            <header style={{ marginBottom: SPACING.separation }}>
              <h1 style={{
                ...TYPE.displayScreen,
                color: TEXT_PRIMARY,
                maxWidth: HEADING_LAYOUT.screenTitle.maxWidth,
                margin: 0,
              }}>
                {screenTitle}
              </h1>
              <p style={{
                ...TYPE.body,
                color: TEXT_MUTED,
                lineHeight: 1.8,
                margin: `${SPACING.standard}px 0 0`,
              }}>
                {screenIntro}
              </p>
            </header>

            <section aria-label="Spot the error task">
              <p style={{
                ...TYPE.bodyStrong,
                color: TEXT_PRIMARY,
                lineHeight: 1.6,
                margin: `0 0 ${SPACING.standard}px`,
              }}>
                Tap the word or phrase that is wrong.
              </p>

              <div style={{
                position: 'relative',
                overflow: 'hidden',
                background: `radial-gradient(circle at 14% 0%, rgba(${rgb},0.065), transparent 48%), linear-gradient(180deg, ${GENERAL.backgroundSurface} 0%, ${GENERAL.backgroundSunken} 100%)`,
                border: `1px solid ${GENERAL.line.soft}`,
                borderRadius: RADII.medium,
                padding: SPACING.standard,
                boxShadow: `inset 0 1px 0 ${GENERAL.line.soft}, ${GENERAL.shadow.raised}`,
                marginBottom: showExplain ? SPACING.separation : 0,
              }}>
                <p
                  role="group"
                  aria-label="Tap the word or phrase that is wrong"
                  aria-describedby={groupId}
                  style={{ ...TYPE.examAnswer, color: TEXT_PRIMARY, lineHeight: 1.95, margin: 0 }}
                >
                  {tokens.map((tok, i) => {
                    const isSelected = selection != null && i >= selection.start && i <= selection.end
                    const isSelectionStart = isSelected && i === selection.start
                    const isSelectionEnd = isSelected && i === selection.end
                    const selectionRadius = isSelected
                      ? `${isSelectionStart ? RADII.small : 0}px ${isSelectionEnd ? RADII.small : 0}px ${isSelectionEnd ? RADII.small : 0}px ${isSelectionStart ? RADII.small : 0}px`
                      : 0

                    return (
                      <span key={i}>
                        <button
                          type="button"
                          className="ste-token"
                          aria-pressed={isSelected}
                          aria-label={tok.text}
                          onClick={() => tapToken(i)}
                          style={{
                            display: 'inline',
                            font: 'inherit',
                            lineHeight: 'inherit',
                            verticalAlign: 'baseline',
                            cursor: 'pointer',
                            border: 'none',
                            borderRadius: selectionRadius,
                            padding: 0,
                            margin: 0,
                            color: TEXT_PRIMARY,
                            background: isSelected ? `rgba(${rgb},0.22)` : 'transparent',
                            boxShadow: isSelected ? `inset 0 0 0 1px rgba(${rgb},0.5)` : 'none',
                          }}
                        >
                          {tok.text}
                        </button>
                        {i < tokens.length - 1 ? ' ' : ''}
                      </span>
                    )
                  })}
                </p>
                <span id={groupId} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                  Select one continuous word or phrase, then explain why it is wrong.
                </span>
              </div>

              {showExplain && (
                <div
                  ref={explainRef}
                  className="ste-anim"
                  style={{
                    marginBottom: SPACING.separation,
                    animation: `ste-reveal ${MOTION.duration.standard} ${MOTION.easing.standard} both`,
                  }}
                >
                  <label htmlFor={explainId} style={{ ...TYPE.bodyStrong, color: TEXT_PRIMARY, display: 'block', marginBottom: SPACING.micro }}>
                    Why is this incorrect?
                  </label>
                  <textarea
                    id={explainId}
                    className="ste-input"
                    value={explanation}
                    onChange={e => setExplanation(e.target.value)}
                    placeholder="Explain what is wrong and why…"
                    style={{ ...textAreaStyle, minHeight: EXPLANATION_MIN_HEIGHT }}
                  />
                </div>
              )}

              {showExplain && (
                <CheckAnswerCTA onClick={handleCheck} disabled={!canCheck} accent={accent} />
              )}
            </section>
          </>
        ) : (
          <div className="ste-anim" style={{ animation: `ste-reveal ${MOTION.duration.standard} ${MOTION.easing.standard} both` }}>
            <h2
              ref={feedbackHeadingRef}
              tabIndex={-1}
              style={{ ...TYPE.displaySection, color: accent, margin: `0 0 ${SPACING.standard}px`, outline: 'none' }}
            >
              {heading}
            </h2>

            {selectionCorrect ? (
              <FeedbackRow label="You spotted the error">
                “{actualErrorText || block.errorTarget}”
              </FeedbackRow>
            ) : (
              <div style={{
                display: 'flex',
                gap: SPACING.standard,
                marginBottom: SPACING.standard,
                flexWrap: 'wrap',
              }}>
                <div style={{ flex: '1 1 45%' }}>
                  <p style={{ ...TYPE.label, color: TEXT_MUTED, margin: `0 0 ${SPACING.micro / 2}px` }}>You selected</p>
                  <p style={{ ...TYPE.body, color: TEXT_MUTED, margin: 0 }}>“{selectedText || '—'}”</p>
                </div>
                <div style={{ flex: '1 1 45%' }}>
                  <p style={{ ...TYPE.label, color: TEXT_MUTED, margin: `0 0 ${SPACING.micro / 2}px` }}>The actual error</p>
                  <p style={{ ...TYPE.body, color: accent, margin: 0 }}>“{actualErrorText || block.errorTarget}”</p>
                </div>
              </div>
            )}

            <FeedbackRow label="Your explanation">
              {explanationPrecise
                ? (block.explanationPraise || 'Your reasoning names the right idea.')
                : (block.explanationHint
                    || (explanationEval.missing.length
                        ? `Your explanation needs to mention ${explanationEval.missing.join(' and ')}.`
                        : 'Your explanation needs to be more precise.'))}
            </FeedbackRow>

            <FeedbackRow label="What was wrong">
              {block.whatWasWrong}
            </FeedbackRow>

            <FeedbackRow label="Examiner takeaway">
              {block.examinerNote}
            </FeedbackRow>

            <FeedbackRow label="Common trap" muted>
              {block.commonTrap}
            </FeedbackRow>

            <ContinueCTA onClick={handleContinue} accent={accent} style={{ marginTop: SPACING.micro }} />
          </div>
        )}
      </div>
    </CinematicShell>
  )
}
