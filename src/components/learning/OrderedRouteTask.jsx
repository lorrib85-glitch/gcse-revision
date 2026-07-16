import { useRef, useState } from 'react'
import { MOTION } from '../../constants/motion.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { logWrongAnswer, logCorrectAnswer } from '../../unifiedWeaknessTracker.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import CinematicShell from '../layout/CinematicShell.jsx'

const TEXT_PRIMARY = 'rgba(255,251,242,0.96)'
const TEXT_DIM = 'rgba(255,248,235,0.62)'
const ROW_BG = 'rgba(12,11,9,0.86)'
const NODE = 30

function IconHelmet({ accent }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 13c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M2 13h16" stroke={accent} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M5 13v1.5a1 1 0 001 1h8a1 1 0 001-1V13" stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function IconCross({ accent }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="8" y="3" width="4" height="14" rx="1" fill={accent} opacity="0.85" />
      <rect x="3" y="8" width="14" height="4" rx="1" fill={accent} opacity="0.85" />
    </svg>
  )
}

function IconHut({ accent }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M2 10l8-7 8 7" stroke={accent} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="10" width="12" height="8" rx="1" stroke={accent} strokeWidth="1.5" />
      <rect x="8" y="13" width="4" height="5" rx="0.5" stroke={accent} strokeWidth="1.2" />
    </svg>
  )
}

function IconTrain({ accent }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="14" height="10" rx="2" stroke={accent} strokeWidth="1.5" />
      <path d="M3 8h14" stroke={accent} strokeWidth="1.3" />
      <circle cx="6.5" cy="17" r="1.5" stroke={accent} strokeWidth="1.3" />
      <circle cx="13.5" cy="17" r="1.5" stroke={accent} strokeWidth="1.3" />
      <path d="M6.5 15.5V14M13.5 15.5V14" stroke={accent} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7 4V3M13 4V3" stroke={accent} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function IconShip({ accent }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 12l1.6 4.5h10.8L17 12" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12h14" stroke={accent} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 3.5V12" stroke={accent} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M10 4.5h4.2L12.6 8H10" stroke={accent} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const ICON_MAP = {
  helmet: IconHelmet,
  cross: IconCross,
  hut: IconHut,
  train: IconTrain,
  ship: IconShip,
}

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
  const missedRef = useRef(new Set())

  const currentJob = jobs[jobIndex] || null
  const complete = jobs.length > 0 && !currentJob

  function handleStageTap(stage) {
    if (!currentJob || locked[stage.id]) return

    if (stage.answerId === currentJob.id) {
      setLocked(prev => ({ ...prev, [stage.id]: currentJob.id }))
      if (!missedRef.current.has(currentJob.id)) {
        logCorrectAnswer({
          subject: subjectKey,
          topic: stage.title,
          questionId: `${idPrefix}-${stage.id}`,
          source: 'module',
        })
      }
      setJobIndex(i => i + 1)
      setFeedback(null)
      setWrongStageId(null)
      return
    }

    const target = stages.find(s => s.answerId === currentJob.id)
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
    const clue = target?.clue ? target.clue.charAt(0).toLowerCase() + target.clue.slice(1) : ''
    setFeedback(clue ? `Not here — look for the stage ${clue}.` : 'Not here — try another stage.')
    setWrongStageId(stage.id)
  }

  const entrance = `ort-in ${MOTION.duration.standard} ${MOTION.easing.gentle} both`

  return (
    // CinematicShell (not ContentShell/InteractionShell): this task owns a
    // full-bleed background scene with the route composition laid over it.
    <CinematicShell style={{ zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes ort-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ort-stage:focus-visible {
          outline: 2px solid ${accent};
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .ort-anim { animation: none !important; }
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
          background: 'linear-gradient(to bottom, rgba(5,4,2,0.78) 0%, rgba(5,4,2,0.62) 40%, rgba(5,4,2,0.82) 100%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: `calc(${SPACING.cinematic}px + env(safe-area-inset-top, 0px)) ${SPACING.compact}px calc(${SPACING.standard}px + env(safe-area-inset-bottom, 0px))`,
          maxWidth: 430,
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        <h1
          className="ort-anim"
          style={{
            ...TYPE.displayScreen,
            margin: `0 0 ${SPACING.micro}px`,
            color: TEXT_PRIMARY,
            animation: entrance,
          }}
        >
          {renderTitle(screen.title, screen.titleHighlight, accent)}
        </h1>

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
            background: ROW_BG,
            border: `1px solid rgba(${rgb},0.45)`,
            borderRadius: RADII.medium,
            padding: SPACING.compact,
            marginBottom: SPACING.compact,
            animation: entrance,
            animationDelay: MOTION.duration.fast,
          }}
        >
          {complete ? (
            <>
              <div style={{ ...TYPE.label, color: accent }}>Chain rebuilt</div>
              {screen.completionText && (
                <div style={{ ...TYPE.bodySmall, color: TEXT_PRIMARY, marginTop: SPACING.micro }}>
                  {screen.completionText}
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: SPACING.micro }}>
                <span style={{ ...TYPE.label, color: accent }}>{prompt}</span>
                <span style={{ ...TYPE.caption, color: TEXT_DIM, flexShrink: 0 }}>
                  {jobIndex}/{jobs.length} placed
                </span>
              </div>
              <div style={{ ...TYPE.bodyStrong, color: TEXT_PRIMARY, marginTop: SPACING.micro }}>
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

        <div className="ort-anim" style={{ animation: entrance, animationDelay: MOTION.duration.standard }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.micro }}>
            {stages.map((stage, idx) => {
              const lockedJob = locked[stage.id] ? answers.find(a => a.id === locked[stage.id]) : null
              const isWrongTap = wrongStageId === stage.id
              const IconComp = ICON_MAP[stage.icon] || IconCross

              return (
                <div key={stage.id} style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
                  <div
                    aria-hidden="true"
                    style={{ width: NODE, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                  >
                    <div
                      style={{
                        width: NODE,
                        height: NODE,
                        borderRadius: '50%',
                        flexShrink: 0,
                        background: lockedJob ? `rgba(${rgb},0.22)` : ROW_BG,
                        border: `2px solid ${lockedJob ? accent : `rgba(${rgb},0.55)`}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...TYPE.label,
                        color: accent,
                        boxShadow: lockedJob ? `0 0 12px rgba(${rgb},0.35)` : 'none',
                        transition: `background ${MOTION.duration.fast} ${MOTION.easing.gentle}, border-color ${MOTION.duration.fast} ${MOTION.easing.gentle}, box-shadow ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                      }}
                    >
                      {idx + 1}
                    </div>
                    {idx < stages.length - 1 && (
                      <div
                        style={{
                          width: 2,
                          flex: 1,
                          marginBottom: -SPACING.micro,
                          background: `rgba(${rgb},0.40)`,
                          boxShadow: `0 0 6px rgba(${rgb},0.22)`,
                        }}
                      />
                    )}
                  </div>

                  <div
                    aria-hidden="true"
                    style={{
                      width: SPACING.micro,
                      height: 2,
                      marginTop: NODE / 2 - 1,
                      flexShrink: 0,
                      background: `rgba(${rgb},${lockedJob ? 0.62 : 0.38})`,
                      boxShadow: lockedJob ? `0 0 6px rgba(${rgb},0.25)` : 'none',
                      transition: `background ${MOTION.duration.fast} ${MOTION.easing.gentle}, box-shadow ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                    }}
                  />

                  <button
                    type="button"
                    className="ort-stage"
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
                        : `1px solid rgba(${rgb},${lockedJob ? 0.55 : 0.30})`,
                      background: lockedJob ? `rgba(${rgb},0.10)` : ROW_BG,
                      padding: `${SPACING.micro}px ${SPACING.compact}px`,
                      cursor: lockedJob || complete ? 'default' : 'pointer',
                      transition: `border-color ${MOTION.duration.fast} ${MOTION.easing.gentle}, background ${MOTION.duration.fast} ${MOTION.easing.gentle}`,
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro }}>
                      <IconComp accent={accent} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ ...TYPE.titleMedium, color: TEXT_PRIMARY, overflowWrap: 'break-word' }}>
                          {renderStageTitle(stage.title)}
                        </div>
                        <div style={{ ...TYPE.caption, color: TEXT_DIM, overflowWrap: 'break-word' }}>
                          {stage.clue}
                        </div>
                      </div>
                    </div>

                    {lockedJob && (
                      <div
                        style={{
                          marginTop: SPACING.micro,
                          marginLeft: SPACING.standard,
                          paddingTop: SPACING.micro,
                          borderTop: `1px solid rgba(${rgb},0.22)`,
                          display: 'flex',
                          gap: SPACING.micro,
                          alignItems: 'flex-start',
                          ...TYPE.caption,
                          color: TEXT_PRIMARY,
                        }}
                      >
                        <span aria-hidden="true" style={{ color: accent, flexShrink: 0 }}>✓</span>
                        <span>{lockedJob.text}</span>
                      </div>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        {complete && (
          <ContinueCTA
            onClick={onComplete}
            accent={accent}
            style={{
              marginTop: SPACING.standard,
              animation: `ort-in ${MOTION.duration.standard} ${MOTION.easing.gentle} ${MOTION.duration.cinematic} both`,
            }}
          />
        )}

        <div style={{ height: `calc(env(safe-area-inset-bottom, 0px) + ${SPACING.compact}px)` }} />
      </div>
    </CinematicShell>
  )
}
