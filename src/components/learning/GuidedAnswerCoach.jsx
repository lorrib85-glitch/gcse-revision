import { useState } from 'react'
import { createPortal } from 'react-dom'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { TYPE } from '../../constants/typography.js'
import { RADII } from '../../constants/radii.js'
import { BUTTONS } from '../../constants/buttons.js'
import { GENERAL } from '../../constants/generalTheme.js'
import GuidedExamResponse from './GuidedExamResponse.jsx'
import ContinueCTA from '../core/ContinueCTA.jsx'
import { logCoachTypeResult } from '../../unifiedWeaknessTracker.js'

const BRONZE = '#C89B6D'

// Splits `question` around the first occurrence of `commandWord` so the
// command word can be highlighted in bronze — History metadata accent only.
function renderQuestion(question, commandWord) {
  if (!commandWord) return question
  const idx = question.indexOf(commandWord)
  if (idx === -1) return question
  return (
    <>
      {question.slice(0, idx)}
      <span style={{ color: BRONZE, fontWeight: 700 }}>{commandWord}</span>
      {question.slice(idx + commandWord.length)}
    </>
  )
}

const sectionHeadingStyle = {
  fontFamily: "'Sora', sans-serif",
  fontWeight: 700, fontSize: 9,
  letterSpacing: '0.16em', textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.3)',
  marginBottom: 12,
}

const kickerStyle = {
  fontFamily: "'Sora', sans-serif",
  fontWeight: 700, fontSize: 11,
  letterSpacing: '0.18em', textTransform: 'uppercase',
  color: GENERAL.teal,
  marginBottom: SPACING.compact,
}

const bulletRowStyle = { display: 'flex', alignItems: 'flex-start', gap: SPACING.micro, marginBottom: SPACING.micro }
const bulletTextStyle = { fontFamily: "'Sora', sans-serif", fontSize: 13.5, lineHeight: 1.55, color: 'rgba(255,255,255,0.7)' }
const bulletDotStyle = (color) => ({ width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0, background: color })

// Primary Progression CTA — accent-filled, in GENERAL teal (or bronze, for the
// stage-4 "Your turn" handoff) rather than a subject accent, since this coach
// has no single subject context.
const ctaStyle = (enabled, accent = GENERAL.teal) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  width: '100%',
  height: BUTTONS.continue.height, borderRadius: BUTTONS.continue.borderRadius,
  border: 'none',
  background: enabled ? accent : 'rgba(255,255,255,0.08)',
  color: enabled ? '#0D0F14' : 'rgba(255,255,255,0.3)',
  fontFamily: "'Sora', sans-serif",
  fontWeight: BUTTONS.continue.fontWeight, fontSize: BUTTONS.continue.fontSize,
  cursor: enabled ? 'pointer' : 'default',
  transition: `transform ${BUTTONS.continue.transition}`,
})

const textBtnStyle = {
  display: 'block', width: '100%', textAlign: 'center',
  background: 'none', border: 'none', cursor: 'pointer',
  fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 13,
  color: GENERAL.slate, padding: '10px 0',
}

function StageShell({ stageNum, onExit, children, footer }) {
  return createPortal(
    <>
      <style>{`
        @keyframes gac-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '100dvh', zIndex: 1000,
        background: GENERAL.neutral[0],
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{
          position: 'sticky', top: 0, zIndex: 20,
          background: GENERAL.neutral[0],
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', height: 52, flexShrink: 0,
        }}>
          <div style={{
            fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 11,
            letterSpacing: '0.14em', textTransform: 'uppercase', color: GENERAL.slate,
          }}>
            Stage {stageNum} of 8
          </div>
          <button onClick={() => onExit()} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.45)', fontSize: 22, lineHeight: 1, padding: 8,
          }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{
            maxWidth: 430, margin: '0 auto',
            padding: `${SPACING.standard}px ${SPACING.compact}px ${SPACING.separation}px`,
          }}>
            {children}
          </div>
        </div>

        {footer && (
          <div style={{
            flexShrink: 0,
            padding: `${SPACING.compact}px ${SPACING.compact}px calc(${SPACING.compact}px + env(safe-area-inset-bottom, 0px))`,
            background: GENERAL.neutral[0],
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ maxWidth: 430, margin: '0 auto' }}>{footer}</div>
          </div>
        )}
      </div>
    </>,
    document.body
  )
}

export default function GuidedAnswerCoach({ coachType, onExit }) {
  const { worked, attempts } = coachType

  const [stage, setStage] = useState('q')
  const [results, setResults] = useState({ supported: null, light: null, independent: null })

  // Stage 3 — examiner thinking
  const [thinkingStep, setThinkingStep] = useState(0)
  const [weakRevealed, setWeakRevealed] = useState(false)
  const [strongRevealed, setStrongRevealed] = useState(false)

  // Stage 4 — model answer annotations
  const [openNoteIdx, setOpenNoteIdx] = useState(null)

  // ═══════════════════════════════════════════════════════════════════════
  // STAGE 1 — the question
  // ═══════════════════════════════════════════════════════════════════════
  if (stage === 'q') {
    return (
      <StageShell stageNum={1} onExit={onExit} footer={
        <ContinueCTA onClick={() => setStage('focus')} accent={GENERAL.teal} />
      }>
        <div style={kickerStyle}>1 · The question</div>
        <div style={{ ...TYPE.cinematic, fontSize: 30, color: GENERAL.softWhite, marginBottom: SPACING.compact, animation: 'gac-up 500ms cubic-bezier(0.22,1,0.36,1) both' }}>
          Read it. Don't rush<span style={{ color: GENERAL.teal }}>.</span>
        </div>
        <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, color: GENERAL.slate, lineHeight: 1.6, marginBottom: SPACING.standard }}>
          This is the exact question you'll be working with today. Read it carefully — every word changes what the examiner is looking for.
        </p>
        <div style={{
          background: GENERAL.neutral[1], borderRadius: RADII.large,
          border: '1px solid rgba(255,255,255,0.06)', padding: SPACING.standard,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: SPACING.compact, marginBottom: SPACING.compact }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: BRONZE }}>
              Edexcel · History
            </div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 12, letterSpacing: '0.04em', color: BRONZE, whiteSpace: 'nowrap' }}>
              {coachType.marksLabel}
            </div>
          </div>
          <div style={{
            fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 17, lineHeight: 1.6,
            color: 'rgba(245,238,225,0.92)', whiteSpace: 'pre-wrap',
          }}>
            {renderQuestion(worked.question, coachType.commandWord)}
          </div>
        </div>
      </StageShell>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STAGE 2 — what the examiner is looking for
  // ═══════════════════════════════════════════════════════════════════════
  if (stage === 'focus') {
    const { examFocus } = worked
    return (
      <StageShell stageNum={2} onExit={onExit} footer={
        <ContinueCTA onClick={() => setStage('thinking')} accent={GENERAL.teal} />
      }>
        <div style={kickerStyle}>2 · What earns marks</div>
        <div style={{ ...TYPE.cinematic, fontSize: 28, color: GENERAL.softWhite, marginBottom: SPACING.compact, animation: 'gac-up 500ms cubic-bezier(0.22,1,0.36,1) both' }}>
          What's the examiner looking for<span style={{ color: GENERAL.teal }}>?</span>
        </div>
        <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 14.5, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, marginBottom: SPACING.standard }}>
          {examFocus.whatItsAsking}
        </p>

        <div style={{ marginBottom: SPACING.standard }}>
          <div style={sectionHeadingStyle}>This earns marks</div>
          {examFocus.rewards.map((r, i) => (
            <div key={i} style={bulletRowStyle}>
              <div style={bulletDotStyle(`${GENERAL.teal}CC`)} />
              <div style={bulletTextStyle}>{r}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: SPACING.standard }}>
          <div style={sectionHeadingStyle}>Common mistakes</div>
          {examFocus.commonMistakes.map((m, i) => (
            <div key={i} style={bulletRowStyle}>
              <div style={bulletDotStyle('rgba(255,255,255,0.25)')} />
              <div style={bulletTextStyle}>{m}</div>
            </div>
          ))}
        </div>

        <div style={{
          padding: SPACING.compact, borderRadius: RADII.medium,
          background: `rgba(${GENERAL.coralRgb},0.08)`, border: `1px solid rgba(${GENERAL.coralRgb},0.3)`,
        }}>
          <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: GENERAL.coral, marginBottom: 6 }}>
            The biggest trap
          </div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 13.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)' }}>
            {examFocus.biggestTrap}
          </div>
        </div>
      </StageShell>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STAGE 3 — watch an examiner think
  // ═══════════════════════════════════════════════════════════════════════
  if (stage === 'thinking') {
    const beats = worked.examinerThinking
    const beat = beats[thinkingStep]
    const isLast = thinkingStep === beats.length - 1

    function nextBeat() {
      if (isLast) { setStage('model'); return }
      setThinkingStep(s => s + 1)
      setWeakRevealed(false)
      setStrongRevealed(false)
    }

    return (
      <StageShell stageNum={3} onExit={onExit} footer={
        strongRevealed ? (
          <ContinueCTA onClick={nextBeat} accent={GENERAL.teal} />
        ) : null
      }>
        <div style={kickerStyle}>3 · Examiner thinking</div>
        <div style={{ ...TYPE.cinematic, fontSize: 28, color: GENERAL.softWhite, marginBottom: 6, animation: 'gac-up 500ms cubic-bezier(0.22,1,0.36,1) both' }}>
          Watch an examiner think<span style={{ color: GENERAL.teal }}>.</span>
        </div>
        <div style={{
          fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 600,
          letterSpacing: '0.16em', textTransform: 'uppercase', color: GENERAL.slate,
          marginBottom: SPACING.standard,
        }}>
          Example {thinkingStep + 1} of {beats.length}
        </div>

        <div
          onClick={() => setWeakRevealed(true)}
          style={{
            padding: SPACING.compact, borderRadius: RADII.medium,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
            marginBottom: SPACING.compact, cursor: weakRevealed ? 'default' : 'pointer',
          }}
        >
          <div style={sectionHeadingStyle}>A student writes</div>
          <div style={{
            fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 15, lineHeight: 1.6,
            color: 'rgba(255,255,255,0.4)',
            textDecoration: weakRevealed ? 'line-through' : 'none',
          }}>
            {beat.weakIdea}
          </div>
          {weakRevealed ? (
            <div style={{ marginTop: SPACING.compact, fontFamily: "'Sora', sans-serif", fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)' }}>
              {beat.whyNot}
            </div>
          ) : (
            <div style={{ marginTop: SPACING.compact, fontFamily: "'Sora', sans-serif", fontSize: 11.5, fontWeight: 600, color: GENERAL.teal }}>
              Tap to see why this falls short →
            </div>
          )}
        </div>

        {weakRevealed && (
          <div
            onClick={() => setStrongRevealed(true)}
            style={{
              padding: SPACING.compact, borderRadius: RADII.medium,
              background: `${BRONZE}14`, border: `1.5px solid ${BRONZE}`,
              cursor: strongRevealed ? 'default' : 'pointer',
            }}
          >
            <div style={{ ...sectionHeadingStyle, color: BRONZE }}>A stronger answer</div>
            <div style={{
              fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 15, lineHeight: 1.6,
              color: 'rgba(245,238,225,0.92)',
            }}>
              {beat.strongerIdea}
            </div>
            {strongRevealed ? (
              <div style={{ marginTop: SPACING.compact, fontFamily: "'Sora', sans-serif", fontSize: 13, lineHeight: 1.6, color: BRONZE }}>
                {beat.whyBetter}
              </div>
            ) : (
              <div style={{ marginTop: SPACING.compact, fontFamily: "'Sora', sans-serif", fontSize: 11.5, fontWeight: 600, color: BRONZE }}>
                Tap to see what makes this better →
              </div>
            )}
          </div>
        )}
      </StageShell>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STAGE 4 — annotated model answer (bronze inner card)
  // ═══════════════════════════════════════════════════════════════════════
  if (stage === 'model') {
    return (
      <StageShell stageNum={4} onExit={onExit} footer={
        <ContinueCTA onClick={() => setStage('supported')} accent={BRONZE} />
      }>
        <div style={kickerStyle}>4 · Model answer</div>
        <div style={{ ...TYPE.cinematic, fontSize: 28, color: GENERAL.softWhite, marginBottom: 6, animation: 'gac-up 500ms cubic-bezier(0.22,1,0.36,1) both' }}>
          A model answer<span style={{ color: GENERAL.teal }}>.</span>
        </div>
        <p style={{ fontFamily: "'Sora', sans-serif", fontSize: 13.5, color: GENERAL.slate, lineHeight: 1.6, marginBottom: SPACING.standard }}>
          Tap any sentence to see exactly why it earns marks.
        </p>

        <div style={{
          background: `linear-gradient(160deg, ${BRONZE}1A, ${BRONZE}08)`,
          border: `1px solid ${BRONZE}40`, borderRadius: RADII.large,
          padding: SPACING.standard,
        }}>
          {worked.sources?.length > 0 && (
            <div style={{ marginBottom: SPACING.standard, display: 'flex', flexDirection: 'column', gap: SPACING.compact }}>
              {worked.sources.map(src => (
                <div key={src.label} style={{
                  padding: SPACING.compact, borderRadius: RADII.medium,
                  background: 'rgba(0,0,0,0.18)', border: `1px solid ${BRONZE}30`,
                }}>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: BRONZE, marginBottom: 6 }}>
                    {src.label}
                  </div>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontStyle: 'italic', color: 'rgba(245,238,225,0.55)', marginBottom: SPACING.micro }}>
                    {src.attribution}
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 14, lineHeight: 1.65, color: 'rgba(245,238,225,0.85)', whiteSpace: 'pre-wrap' }}>
                    {src.text}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: BRONZE, marginBottom: SPACING.compact }}>
            Model answer
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.compact }}>
            {worked.modelAnswer.sentences.map((s, i) => (
              <div key={i}>
                <div
                  onClick={() => setOpenNoteIdx(prev => (prev === i ? null : i))}
                  style={{
                    fontFamily: "'IBM Plex Serif', Georgia, serif", fontSize: 16, lineHeight: 1.65,
                    color: 'rgba(245,238,225,0.92)', cursor: 'pointer',
                    padding: '2px 4px', borderRadius: RADII.small,
                    background: openNoteIdx === i ? `${BRONZE}1F` : 'transparent',
                    transition: `background ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                  }}
                >
                  {s.text}
                </div>
                {openNoteIdx === i && (
                  <div style={{
                    marginTop: 6, padding: '8px 10px', borderRadius: RADII.small,
                    background: 'rgba(0,0,0,0.2)', borderLeft: `2px solid ${BRONZE}`,
                    fontFamily: "'Sora', sans-serif", fontSize: 12.5, lineHeight: 1.55, color: BRONZE,
                  }}>
                    {s.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </StageShell>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STAGES 5–7 — write with support, light support, independently
  // ═══════════════════════════════════════════════════════════════════════
  if (stage === 'supported' || stage === 'light' || stage === 'independent') {
    const next = { supported: 'light', light: 'independent', independent: 'debrief' }[stage]
    return (
      <GuidedExamResponse
        key={stage}
        theme="general"
        module={{ id: 'examCoach', subject: 'history' }}
        exam={attempts[stage]}
        onExit={onExit}
        onContinue={(res) => {
          logCoachTypeResult({
            typeId: coachType.id,
            subject: 'History',
            marksAwarded: res.marksAwarded,
            marksAvailable: res.marksAvailable,
          })
          setResults(prev => ({ ...prev, [stage]: res }))
          setStage(next)
        }}
      />
    )
  }

  // ═══════════════════════════════════════════════════════════════════════
  // STAGE 8 — progress debrief
  // ═══════════════════════════════════════════════════════════════════════
  if (stage === 'debrief') {
    const rows = [
      { key: 'supported', label: 'Supported' },
      { key: 'light', label: 'Light support' },
      { key: 'independent', label: 'Independent' },
    ]

    const trendLine = (() => {
      const sup = results.supported
      const ind = results.independent
      if (!sup || !ind || !sup.marksAvailable || !ind.marksAvailable) {
        return "Nice work — you've worked through all three stages. Come back to this question type again soon to build on it."
      }
      const supPct = sup.marksAwarded / sup.marksAvailable
      const indPct = ind.marksAwarded / ind.marksAvailable
      if (indPct >= supPct) {
        return 'You held onto your technique even without support — that’s exactly what the exam needs.'
      }
      if (supPct - indPct > 0.25) {
        return 'Your technique dropped once the scaffolding came away. Go back over the model answer in stage 4 before your next attempt at this question type.'
      }
      return 'The gap is closing. A little more practice without support and this technique will stick.'
    })()

    return (
      <StageShell stageNum={8} onExit={onExit} footer={
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button onClick={() => onExit('chooser')} style={ctaStyle(true)}>Practise another type →</button>
          <button onClick={() => onExit()} style={textBtnStyle}>Back to exams</button>
        </div>
      }>
        <div style={kickerStyle}>8 · Your progress</div>
        <div style={{ ...TYPE.cinematic, fontSize: 28, color: GENERAL.softWhite, marginBottom: SPACING.standard, animation: 'gac-up 500ms cubic-bezier(0.22,1,0.36,1) both' }}>
          Your progress<span style={{ color: GENERAL.teal }}>.</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.standard, marginBottom: SPACING.standard }}>
          {rows.map(row => {
            const r = results[row.key]
            const pct = r && r.marksAvailable ? Math.round((r.marksAwarded / r.marksAvailable) * 100) : 0
            return (
              <div key={row.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, color: GENERAL.softWhite }}>{row.label}</div>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700, color: GENERAL.teal }}>
                    {r ? `${r.marksAwarded}/${r.marksAvailable}` : '—'}
                  </div>
                </div>
                <div style={{ height: 8, borderRadius: RADII.pill, background: GENERAL.neutral[2], overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${pct}%`, borderRadius: RADII.pill,
                    background: GENERAL.teal,
                    transition: `width ${MOTION.duration.slow} ${MOTION.easing.standard}`,
                  }} />
                </div>
              </div>
            )
          })}
        </div>

        <div style={{
          padding: SPACING.compact, borderRadius: RADII.medium,
          background: GENERAL.neutral[1], border: '1px solid rgba(255,255,255,0.06)',
          fontFamily: "'Sora', sans-serif", fontSize: 13.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.75)',
        }}>
          {trendLine}
        </div>
      </StageShell>
    )
  }

  return null
}
