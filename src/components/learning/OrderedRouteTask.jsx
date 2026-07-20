import { useEffect, useRef, useState } from 'react'
import { MOTION } from '../../constants/motion.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { logWrongAnswer, logCorrectAnswer } from '../../unifiedWeaknessTracker.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import CinematicShell from '../layout/CinematicShell.jsx'
import { ScreenTitle } from '../core/ScreenText.jsx'

const TEXT_PRIMARY = 'rgba(255,251,242,0.96)'
const TEXT_DIM = 'rgba(255,248,235,0.66)'
const ROW_BG = 'linear-gradient(180deg, rgba(13,12,10,0.92) 0%, rgba(8,7,6,0.90) 100%)'
const NODE = 30
const SWEEP_STAGGER_MS = 120

function renderTitle(text, highlight, accent) {
  if (!text || !highlight) return text
  const idx = text.toLowerCase().indexOf(highlight.toLowerCase())
  if (idx === -1) return text

  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: accent }}>{text.slice(idx, idx + highlight.length)}</span>
      {text.slice(idx + highlight.length)}
    </>
  )
}

function renderStageTitle(title) {
  return title?.replace(/\s*\/\s*/g, '/')
}

function splitCompletionCopy(screen) {
  if (screen.completionSummary || screen.completionTakeaway) {
    return {
      summary: screen.completionSummary || screen.completionText || 'Route complete.',
      takeaway: screen.completionTakeaway || '',
    }
  }

  const text = screen.completionText || ''
  const sentenceBreak = text.match(/^(.+?[.!?])\s+(.+)$/)

  return sentenceBreak
    ? { summary: sentenceBreak[1], takeaway: sentenceBreak[2] }
    : { summary: text || 'Route complete.', takeaway: '' }
}

export default function OrderedRouteTask({ screen, subject, onComplete }) {
  const stages = screen.stages || []
  const answers = screen.answers || []
  const subjectKey = subject || screen.subject || 'History'
  const theme = SUBJECTS[subjectKey] || SUBJECTS.History
  const accent = theme.accent
  const rgb = theme.accentRgb
  const idPrefix = screen.tag || 'ordered-route'
  const weakGroup = screen.weakGroup || screen.label || screen.title || 'Ordered route'
  const prompt = screen.prompt || 'Which stage does this belong to?'
  const { summary: completionSummary, takeaway: completionTakeaway } = splitCompletionCopy(screen)

  const scrollRef = useRef(null)
  const missedRef = useRef(new Set())

  const [jobs] = useState(() => {
    const copy = [...answers]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    return copy
  })

  const [jobIndex, setJobIndex] = useState(0)
  const [locked, setLocked] = useState({})
  const [wrongStageId, setWrongStageId] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [recentCorrectStageId, setRecentCorrectStageId] = useState(null)

  const currentJob = jobs[jobIndex] || null
  const complete = jobs.length > 0 && !currentJob
  const finalNodeDelay = Math.max(0, stages.length - 1) * SWEEP_STAGGER_MS + 180

  useEffect(() => {
    if (!recentCorrectStageId) return undefined

    const timeout = window.setTimeout(() => setRecentCorrectStageId(null), 760)
    return () => window.clearTimeout(timeout)
  }, [recentCorrectStageId])

  useEffect(() => {
    if (!complete || !scrollRef.current) return undefined

    const frame = window.requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: reduceMotion ? 'auto' : 'smooth',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [complete])

  function handleStageTap(stage) {
    if (!currentJob || locked[stage.id]) return

    if (stage.answerId === currentJob.id) {
      setLocked(previous => ({ ...previous, [stage.id]: currentJob.id }))
      setRecentCorrectStageId(stage.id)

      if (!missedRef.current.has(currentJob.id)) {
        logCorrectAnswer({
          subject: subjectKey,
          topic: stage.title,
          questionId: `${idPrefix}-${stage.id}`,
          source: 'module',
        })
      }

      setJobIndex(index => index + 1)
      setFeedback(null)
      setWrongStageId(null)
      return
    }

    const target = stages.find(stageItem => stageItem.answerId === currentJob.id)

    if (!missedRef.current.has(currentJob.id)) {
      missedRef.current.add(currentJob.id)
      logWrongAnswer({
        subject: subjectKey,
        topic: target?.title || stage.title,
        questionId: `${idPrefix}-${target?.id || stage.id}`,
        questionText: currentJob.text,
        source: 'module',
        questionType: 'connection',
        marks: 1,
        weakGroup,
      })
    }

    const clue = target?.clue
      ? target.clue.charAt(0).toLowerCase() + target.clue.slice(1)
      : ''

    setFeedback(clue ? `Not here — look for the stage ${clue}.` : 'Not here — try another stage.')
    setWrongStageId(stage.id)
  }

  const entrance = `ort-in ${MOTION.duration.standard} ${MOTION.easing.gentle} both`

  return (
    <CinematicShell style={{ zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes ort-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes ort-stage-confirm {
          0% { transform: translateX(0); }
          45% { transform: translateX(4px); }
          100% { transform: translateX(0); }
        }

        @keyframes ort-node-confirm {
          0% { transform: scale(0.92); }
          55% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }

        .ort-stage {
          appearance: none;
          -webkit-appearance: none;
        }

        .ort-stage:not(:disabled):active {
          transform: translateX(3px) scale(0.995);
          border-color: rgba(${rgb},0.56) !important;
          box-shadow: inset 2px 0 0 rgba(${rgb},0.38), 0 8px 20px rgba(0,0,0,0.20) !important;
        }

        .ort-stage--confirmed {
          animation: ort-stage-confirm ${MOTION.duration.standard} ${MOTION.easing.gentle} both;
        }

        .ort-node--confirmed {
          animation: ort-node-confirm ${MOTION.duration.standard} ${MOTION.easing.gentle} both;
        }

        .ort-stage:focus-visible {
          outline: 2px solid ${accent};
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          .ort-anim,
          .ort-stage--confirmed,
          .ort-node--confirmed {
            animation: none !important;
          }

          .ort-stage,
          .ort-route-fill {
            transition: none !important;
          }
        }
      `}</style>

      {screen.backgroundImage && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${screen.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: '68% top',
            zIndex: 0,
          }}
        />
      )}

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: [
            'linear-gradient(to bottom, rgba(5,4,2,0.48) 0%, rgba(5,4,2,0.68) 48%, rgba(5,4,2,0.95) 100%)',
            'linear-gradient(to right, rgba(5,4,2,0.34) 0%, rgba(5,4,2,0.12) 68%, rgba(5,4,2,0.08) 100%)',
          ].join(', '),
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div
        ref={scrollRef}
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: `calc(${SPACING.cinematic}px + env(safe-area-inset-top, 0px)) ${SPACING.compact}px ${SPACING.standard}px`,
          maxWidth: 430,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
          scrollPaddingBottom: `calc(${SPACING.section}px + env(safe-area-inset-bottom, 0px))`,
        }}
      >
        <ScreenTitle
          className="ort-anim"
          style={{
            margin: `0 0 ${SPACING.micro}px`,
            color: TEXT_PRIMARY,
            animation: entrance,
          }}
        >
          {renderTitle(screen.title, screen.titleHighlight, accent)}
        </ScreenTitle>

        <p
          className="ort-anim"
          style={{
            ...TYPE.bodySmall,
            margin: `0 0 ${SPACING.compact}px`,
            color: TEXT_DIM,
            animation: entrance,
            animationDelay: MOTION.duration.instant,
          }}
        >
          {screen.subtitle || 'Tap a job, then choose its stage.'}
        </p>

        <div
          className="ort-anim"
          aria-live="polite"
          style={{
            position: 'relative',
            padding: `${SPACING.micro}px ${SPACING.compact}px ${SPACING.compact}px`,
            marginBottom: SPACING.compact,
            borderLeft: `2px solid rgba(${rgb},${complete ? 0.82 : 0.62})`,
            background: 'linear-gradient(90deg, rgba(7,6,5,0.96) 0%, rgba(7,6,5,0.92) 72%, rgba(7,6,5,0.84) 100%)',
            boxShadow: '0 12px 26px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.035)',
            animation: entrance,
            animationDelay: MOTION.duration.fast,
          }}
        >
          {complete ? (
            <>
              <div style={{ ...TYPE.label, color: accent }}>Chain rebuilt</div>
              <div
                style={{
                  ...TYPE.bodySmall,
                  color: TEXT_PRIMARY,
                  marginTop: SPACING.micro / 2,
                }}
              >
                {completionSummary}
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: SPACING.micro,
                }}
              >
                <span style={{ ...TYPE.label, color: accent }}>{prompt}</span>
                <span style={{ ...TYPE.caption, color: TEXT_DIM, flexShrink: 0 }}>
                  {jobIndex}/{jobs.length} placed
                </span>
              </div>

              <div
                style={{
                  ...TYPE.bodyStrong,
                  color: TEXT_PRIMARY,
                  marginTop: SPACING.micro,
                  maxWidth: '34ch',
                }}
              >
                {currentJob?.text}
              </div>

              {feedback && (
                <div style={{ ...TYPE.caption, color: 'var(--error)', marginTop: SPACING.micro }}>
                  {feedback}
                </div>
              )}
            </>
          )}
        </div>

        <div
          className="ort-anim"
          style={{ animation: entrance, animationDelay: MOTION.duration.standard }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.micro }}>
            {stages.map((stage, idx) => {
              const lockedJob = locked[stage.id]
                ? answers.find(answer => answer.id === locked[stage.id])
                : null
              const isWrongTap = wrongStageId === stage.id
              const isRecentCorrect = recentCorrectStageId === stage.id
              const isFinalStage = idx === stages.length - 1
              const shortConnectorActive = Boolean(lockedJob) || complete

              return (
                <div key={stage.id} style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
                  <div
                    aria-hidden="true"
                    style={{
                      width: NODE,
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      className={isRecentCorrect ? 'ort-node--confirmed' : undefined}
                      style={{
                        width: NODE,
                        height: NODE,
                        borderRadius: '50%',
                        flexShrink: 0,
                        background: lockedJob ? `rgba(${rgb},0.22)` : 'rgba(8,7,6,0.84)',
                        border: `2px solid ${lockedJob ? accent : `rgba(${rgb},0.36)`}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...TYPE.label,
                        color: lockedJob ? accent : `rgba(${rgb},0.76)`,
                        boxShadow: complete && isFinalStage
                          ? `0 0 0 4px rgba(${rgb},0.14), 0 0 13px rgba(${rgb},0.20)`
                          : lockedJob
                            ? `0 0 0 2px rgba(${rgb},0.07)`
                            : 'none',
                        transform: complete && isFinalStage ? 'scale(1.06)' : 'scale(1)',
                        transition: [
                          `background ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                          `border-color ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                          `box-shadow ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                          `transform ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                        ].join(', '),
                        transitionDelay: complete && isFinalStage ? `${finalNodeDelay}ms` : '0ms',
                      }}
                    >
                      {idx + 1}
                    </div>

                    {idx < stages.length - 1 && (
                      <div
                        style={{
                          position: 'relative',
                          width: 2,
                          flex: 1,
                          minHeight: SPACING.compact,
                          marginBottom: -SPACING.micro,
                          overflow: 'hidden',
                          background: `rgba(${rgb},0.18)`,
                        }}
                      >
                        <div
                          className="ort-route-fill"
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: `rgba(${rgb},0.70)`,
                            transform: `scaleY(${complete ? 1 : 0})`,
                            transformOrigin: 'top',
                            transition: `transform ${MOTION.duration.standard} ${MOTION.easing.gentle}`,
                            transitionDelay: complete ? `${idx * SWEEP_STAGGER_MS}ms` : '0ms',
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div
                    aria-hidden="true"
                    style={{
                      position: 'relative',
                      width: SPACING.micro,
                      height: 2,
                      marginTop: NODE / 2 - 1,
                      flexShrink: 0,
                      overflow: 'hidden',
                      background: `rgba(${rgb},0.18)`,
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `rgba(${rgb},0.68)`,
                        transform: `scaleX(${shortConnectorActive ? 1 : 0})`,
                        transformOrigin: 'left',
                        transition: `transform ${MOTION.duration.standard} ${MOTION.easing.gentle}`,
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    className={`ort-stage${isRecentCorrect ? ' ort-stage--confirmed' : ''}`}
                    onClick={() => handleStageTap(stage)}
                    disabled={Boolean(lockedJob) || complete}
                    aria-label={
                      lockedJob
                        ? `Stage ${idx + 1}: ${stage.title} — placed: ${lockedJob.text}`
                        : `Stage ${idx + 1}: ${stage.title} — ${stage.clue}. Tap to place the current job here.`
                    }
                    style={{
                      flex: 1,
                      minWidth: 0,
                      textAlign: 'left',
                      borderRadius: RADII.medium,
                      border: isWrongTap
                        ? '1px solid var(--error)'
                        : '1px solid rgba(255,248,235,0.10)',
                      background: isWrongTap
                        ? 'rgba(92,20,20,0.72)'
                        : lockedJob
                          ? 'linear-gradient(180deg, rgba(16,13,9,0.96) 0%, rgba(9,8,7,0.94) 100%)'
                          : ROW_BG,
                      boxShadow: lockedJob
                        ? `inset 2px 0 0 rgba(${rgb},0.34), 0 10px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.05)`
                        : '0 8px 18px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.04)',
                      padding: `${SPACING.micro}px ${SPACING.compact}px`,
                      opacity: lockedJob ? 0.99 : 1,
                      cursor: lockedJob || complete ? 'default' : 'pointer',
                      transform: 'translateX(0)',
                      transition: [
                        `border-color ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                        `background ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                        `box-shadow ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                        `opacity ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                        `transform ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                      ].join(', '),
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          ...TYPE.titleMedium,
                          color: TEXT_PRIMARY,
                          overflowWrap: 'break-word',
                        }}
                      >
                        {renderStageTitle(stage.title)}
                      </div>
                      <div
                        style={{
                          ...TYPE.caption,
                          color: TEXT_DIM,
                          overflowWrap: 'break-word',
                        }}
                      >
                        {stage.clue}
                      </div>
                    </div>

                    {lockedJob && (
                      <div
                        style={{
                          marginTop: SPACING.micro,
                          paddingTop: SPACING.micro,
                          borderTop: '1px solid rgba(255,248,235,0.09)',
                          display: 'flex',
                          gap: SPACING.micro,
                          alignItems: 'flex-start',
                          ...TYPE.caption,
                          color: TEXT_PRIMARY,
                        }}
                      >
                        <span aria-hidden="true" style={{ color: accent, flexShrink: 0 }}>
                          ✓
                        </span>
                        <span>{lockedJob.text}</span>
                      </div>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {complete && completionTakeaway && (
          <div
            className="ort-anim"
            style={{
              marginTop: SPACING.compact,
              paddingTop: SPACING.compact,
              borderTop: `1px solid rgba(${rgb},0.26)`,
              ...TYPE.bodySmall,
              color: TEXT_PRIMARY,
              animation: `ort-in ${MOTION.duration.standard} ${MOTION.easing.gentle} both`,
            }}
          >
            <span style={{ ...TYPE.label, color: accent }}>Exam takeaway: </span>
            {completionTakeaway}
          </div>
        )}

        {complete && (
          <div
            style={{
              position: 'sticky',
              bottom: 0,
              zIndex: 2,
              marginTop: SPACING.compact,
              paddingTop: SPACING.standard,
              paddingBottom: `calc(${SPACING.micro}px + env(safe-area-inset-bottom, 0px))`,
              background: 'linear-gradient(to top, rgba(5,4,2,0.98) 0%, rgba(5,4,2,0.92) 72%, transparent 100%)',
            }}
          >
            <ContinueCTA
              onClick={onComplete}
              accent={accent}
              style={{
                animation: `ort-in ${MOTION.duration.standard} ${MOTION.easing.gentle} ${MOTION.duration.cinematic} both`,
              }}
            />
          </div>
        )}

        {!complete && (
          <div
            aria-hidden="true"
            style={{ height: `calc(env(safe-area-inset-bottom, 0px) + ${SPACING.compact}px)` }}
          />
        )}
      </div>
    </CinematicShell>
  )
}
