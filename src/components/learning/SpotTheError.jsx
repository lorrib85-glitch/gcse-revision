import { useState, useMemo, useRef, useEffect, useId } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { logWrongAnswer, logCorrectAnswer } from '../../unifiedWeaknessTracker.js'
// CinematicShell used here (not ContentShell/InteractionShell): this is a
// full-bleed diagnostic screen that owns its own 100dvh height, internal
// scroll and safe-area insets so the staged fields and the check/continue
// action stay reachable when the mobile keyboard is open.
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
  evaluateRepair,
  deriveFeedbackHeading,
} from './spotTheErrorScoring.js'

// Named foreground values — kept out of the render body so no raw colour is
// improvised inline (mirrors the TEXT_PRIMARY pattern in OrderedRouteTask).
const TEXT_PRIMARY = GENERAL.feedbackText              // #F5F7FF — body + statement
const TEXT_MUTED = 'rgba(245,247,255,0.62)'            // supporting copy
const TEXT_FAINT = 'rgba(245,247,255,0.42)'            // captions / placeholders

function slugify(text) {
  return (text || '').toLowerCase().slice(0, 40).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

// One labelled feedback block. Sentence-case label (no forced-uppercase
// metadata), calm rhythm.
function FeedbackRow({ label, children, muted = false }) {
  if (children == null || children === '') return null
  return (
    <div style={{ marginBottom: SPACING.standard }}>
      <p style={{ ...TYPE.label, color: TEXT_MUTED, margin: `0 0 ${SPACING.micro / 2}px` }}>{label}</p>
      <p style={{ ...TYPE.body, color: muted ? TEXT_MUTED : TEXT_PRIMARY, margin: 0, lineHeight: 1.6 }}>
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
  const tokens = useMemo(() => tokenise(statement), [statement])
  const target = useMemo(
    () => resolveTargetRange(tokens, statement, block.errorTarget),
    [tokens, statement, block.errorTarget],
  )

  const [selection, setSelection] = useState(null) // { start, end } | null
  const [explanation, setExplanation] = useState('')
  const [repair, setRepair] = useState('')
  const [phase, setPhase] = useState('diagnose')    // 'diagnose' | 'feedback'
  const loggedRef = useRef(false)

  const groupId = useId()
  const explainId = useId()
  const repairId = useId()
  const explainRef = useRef(null)
  const repairRef = useRef(null)

  const explanationEval = useMemo(() => evaluateExplanation(explanation, block), [explanation, block])
  const repairEval = useMemo(() => evaluateRepair(repair, block), [repair, block])

  const hasSelection = selection != null
  const showExplain = hasSelection
  const showRepair = hasSelection && explanationEval.meetsLength
  const canCheck = hasSelection && explanationEval.meetsLength && repairEval.meetsLength

  // Bring each newly revealed stage (and, with it, the check action just below)
  // into view so an open keyboard never hides the next step. Respects
  // reduced-motion by snapping instead of animating.
  useEffect(() => {
    if (!showExplain || !explainRef.current) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    explainRef.current.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' })
  }, [showExplain])

  useEffect(() => {
    if (!showRepair || !repairRef.current) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    repairRef.current.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' })
  }, [showRepair])

  const selectionCorrect = useMemo(() => scoreSelection(selection, target), [selection, target])
  const explanationPrecise = explanationEval.precise
  const repairAccurate = repairEval.accurate

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
            subject, topic, questionId: `${qid}${suffix}`,
            questionText, source: 'module', questionType: 'spotTheError', marks: 1,
          })
        }
      }
      log(selectionCorrect, 'Error identification', '', statement)
      log(explanationPrecise, 'Scientific precision', '-precision', explanation)
      log(repairAccurate, 'Error correction', '-repair', repair)
    }

    setPhase('feedback')
  }

  function handleContinue() {
    const fn = block.onContinue || onContinue
    if (fn) fn()
  }

  const heading = deriveFeedbackHeading({
    selectionCorrect,
    explanationPrecise,
    repairAccurate,
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
    resize: 'vertical',
    boxSizing: 'border-box',
  }

  return (
    <CinematicShell style={{ background: GENERAL.backgroundApp, zIndex: 1000, WebkitTapHighlightColor: 'transparent' }}>
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

      <div style={{
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
            {/* Stage 1 — Locate. Clear sentence-case instruction, not a title. */}
            <p style={{ ...TYPE.bodyStrong, color: TEXT_PRIMARY, margin: `0 0 ${SPACING.standard}px` }}>
              Tap the word or phrase that is wrong.
            </p>

            {/* Statement surface — calm, readable, no pre-reveal of the error. */}
            <div style={{
              background: GENERAL.backgroundSurface,
              border: `1px solid ${GENERAL.line.soft}`,
              borderRadius: RADII.large,
              padding: SPACING.standard,
              marginBottom: SPACING.standard,
            }}>
              <p
                role="group"
                aria-label="Tap the word or phrase that is wrong"
                aria-describedby={groupId}
                style={{ ...TYPE.body, color: TEXT_PRIMARY, margin: 0, lineHeight: 1.9 }}
              >
                {tokens.map((tok, i) => {
                  const isSelected = selection != null && i >= selection.start && i <= selection.end
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
                          cursor: 'pointer',
                          border: 'none',
                          borderRadius: RADII.small,
                          padding: '2px 4px',
                          margin: '0 -2px',
                          color: TEXT_PRIMARY,
                          background: isSelected ? `rgba(${rgb},0.22)` : 'transparent',
                          boxShadow: isSelected ? `inset 0 0 0 1px rgba(${rgb},0.5)` : 'none',
                        }}
                      >{tok.text}</button>{' '}
                    </span>
                  )
                })}
              </p>
              <span id={groupId} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                Select a single continuous word or phrase, then explain and rewrite it.
              </span>
            </div>

            {/* Stage 2 — Explain. Associated label + textarea. */}
            {showExplain && (
              <div ref={explainRef} className="ste-anim" style={{ marginBottom: SPACING.standard, animation: `ste-reveal ${MOTION.duration.standard} ${MOTION.easing.standard} both` }}>
                <label htmlFor={explainId} style={{ ...TYPE.bodyStrong, color: TEXT_PRIMARY, display: 'block', marginBottom: SPACING.micro }}>
                  Why is this incorrect?
                </label>
                <textarea
                  id={explainId}
                  className="ste-input"
                  value={explanation}
                  onChange={e => setExplanation(e.target.value)}
                  placeholder="Explain what is wrong and why…"
                  style={{ ...textAreaStyle, minHeight: 108 }}
                />
              </div>
            )}

            {/* Stage 3 — Repair (required). */}
            {showRepair && (
              <div ref={repairRef} className="ste-anim" style={{ marginBottom: SPACING.standard, animation: `ste-reveal ${MOTION.duration.standard} ${MOTION.easing.standard} both` }}>
                <label htmlFor={repairId} style={{ ...TYPE.bodyStrong, color: TEXT_PRIMARY, display: 'block', marginBottom: SPACING.micro }}>
                  Rewrite the statement correctly.
                </label>
                <textarea
                  id={repairId}
                  className="ste-input"
                  value={repair}
                  onChange={e => setRepair(e.target.value)}
                  placeholder="Write the corrected version…"
                  style={{ ...textAreaStyle, minHeight: 96 }}
                />
              </div>
            )}

            <CheckAnswerCTA onClick={handleCheck} disabled={!canCheck} accent={accent} />
          </>
        ) : (
          <div className="ste-anim" style={{ animation: `ste-reveal ${MOTION.duration.standard} ${MOTION.easing.standard} both` }}>
            {/* 1 — specific outcome heading */}
            <h2 style={{ ...TYPE.displaySection, color: accent, margin: `0 0 ${SPACING.standard}px` }}>
              {heading}
            </h2>

            {/* 2 — selection comparison. Confirm compactly when correct;
                otherwise contrast the learner's pick with the real error. */}
            {selectionCorrect ? (
              <FeedbackRow label="You spotted the error">
                “{actualErrorText || block.errorTarget}”
              </FeedbackRow>
            ) : (
              <div style={{
                display: 'flex', gap: SPACING.standard, marginBottom: SPACING.standard, flexWrap: 'wrap',
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

            {/* 3 — explanation feedback: what the reasoning still needs. */}
            <FeedbackRow label="Your explanation">
              {explanationPrecise
                ? (block.explanationPraise || 'Your reasoning names the right idea.')
                : (block.explanationHint
                    || (explanationEval.missing.length
                        ? `Your explanation needs to mention ${explanationEval.missing.join(' and ')}.`
                        : 'Your explanation needs to be more precise about the science.'))}
            </FeedbackRow>

            {/* 4 — rewrite comparison */}
            {repair.trim() && (
              <FeedbackRow label="Your rewrite" muted={!repairAccurate}>
                {repair.trim()}
              </FeedbackRow>
            )}
            <FeedbackRow label="Accurate version">
              {block.correctVersion}
            </FeedbackRow>

            {/* 5 — what was wrong (the teaching point) */}
            <FeedbackRow label="What was wrong">
              {block.whatWasWrong}
            </FeedbackRow>

            {/* 6 — examiner takeaway */}
            <FeedbackRow label="Examiner takeaway">
              {block.examinerNote}
            </FeedbackRow>

            {/* 7 — common trap, quieter supporting text */}
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
