import { useState, useRef } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
// CinematicShell used here because the full-bleed radial-gradient background and cinematic
// one-statement-at-a-time reveal require the screen to fill the entire viewport with no padding.
import CinematicShell from '../layout/CinematicShell.jsx'
import { TYPE } from '../../constants/typography.js'
import { BUTTONS } from '../../constants/buttons.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import { logWrongAnswer, logCorrectAnswer } from '../../unifiedWeaknessTracker.js'

function slugify(text) {
  return (text || '').toLowerCase().slice(0, 40).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

// One conceptual trap at a time — full-screen, cinematic, never a quiz card.
export default function MisconceptionCheck({ block, subject = 'Biology', onContinue }) {
  const subj   = SUBJECTS[subject] || SUBJECTS.Biology
  const accent = subj.accent
  const rgb    = subj.accentRgb

  const statements = block.statements || []
  const [index, setIndex]     = useState(0)
  const [choice, setChoice]   = useState(null)   // true | false | null
  const [pressed, setPressed] = useState(null)
  const loggedRef = useRef(new Set())

  const current  = statements[index] || {}
  const answered = choice !== null
  const correct  = answered && choice === current.answer
  const isLast   = index === statements.length - 1

  function choose(value) {
    if (answered) return
    setChoice(value)

    const qid = `misconceptionCheck-${slugify(block.id || current.statement)}-${index}`
    if (!loggedRef.current.has(qid)) {
      loggedRef.current.add(qid)
      if (value === current.answer) {
        logCorrectAnswer({ subject, topic: 'Misconception recognition', questionId: qid, source: 'module' })
      } else {
        logWrongAnswer({
          subject, topic: 'Misconception recognition', questionId: qid,
          questionText: current.statement, source: 'module', questionType: 'misconceptionCheck', marks: 1,
        })
      }
    }
  }

  function handleNext() {
    if (!answered) return
    if (isLast) {
      const fn = block.onContinue || onContinue
      if (fn) fn()
    } else {
      setIndex(i => i + 1)
      setChoice(null)
    }
  }

  return (
    <CinematicShell style={{
      background: `radial-gradient(ellipse at 50% 18%, rgba(${rgb},0.10) 0%, #0A0F0C 58%)`,
      zIndex: 1000,
      display: 'flex', flexDirection: 'column',
      WebkitTapHighlightColor: 'transparent',
    }}>
      <style>{`
        @keyframes mck-up { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes mck-fade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes mck-pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
      `}</style>

      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: `${SPACING.section}px ${SPACING.standard}px`,
        maxWidth: 560, marginInline: 'auto', width: '100%', boxSizing: 'border-box',
      }}>
        {/* The statement — dominates the screen, cinematic not card-like */}
        <p
          key={index}
          style={{
            ...TYPE.displayScreen,
            fontSize: 'clamp(26px, 7.5vw, 34px)',
            lineHeight: 1.22,
            color: '#F4FFF8',
            margin: `0 0 ${SPACING.large}px`,
            animation: `mck-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
          }}
        >{current.statement}</p>

        {/* True / false choice */}
        {!answered && (
          <div style={{ display: 'flex', gap: SPACING.compact }}>
            {[
              { label: 'True',  value: true },
              { label: 'False', value: false },
            ].map(opt => (
              <button
                key={opt.label}
                onClick={() => choose(opt.value)}
                onMouseDown={() => setPressed(opt.label)}
                onMouseUp={() => setPressed(null)}
                onMouseLeave={() => setPressed(null)}
                onTouchStart={() => setPressed(opt.label)}
                onTouchEnd={() => setPressed(null)}
                style={{
                  flex: 1,
                  height: BUTTONS.secondary.height,
                  borderRadius: BUTTONS.secondary.borderRadius,
                  background: `rgba(${rgb},0.08)`,
                  border: `1.5px solid rgba(${rgb},0.30)`,
                  cursor: 'pointer',
                  fontFamily: "'Sora', sans-serif",
                  fontSize: BUTTONS.secondary.fontSize,
                  fontWeight: 700,
                  color: '#F4FFF8',
                  letterSpacing: '-0.01em',
                  transition: `all ${MOTION.duration.fast} ${MOTION.easing.standard}`,
                  transform: pressed === opt.label ? `scale(${MOTION.scale.press})` : 'scale(1)',
                }}
              >{opt.label}</button>
            ))}
          </div>
        )}

        {/* Reveal — calm, never a bare right/wrong stamp */}
        {answered && (
          <div style={{ animation: `mck-fade ${MOTION.duration.slow} ${MOTION.easing.standard} both` }}>
            <div style={{
              display: 'inline-block',
              padding: '6px 14px',
              borderRadius: RADII.pill,
              background: `rgba(${rgb},0.12)`,
              border: `1px solid rgba(${rgb},0.28)`,
              marginBottom: SPACING.standard,
            }}>
              <span style={{ ...TYPE.metadata, color: accent, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {correct ? 'Spotted it.' : `Actually ${current.answer ? 'true' : 'false'}.`}
              </span>
            </div>

            {current.reveal && (
              <p style={{ ...TYPE.body, color: '#EAF7F0', lineHeight: 1.7, margin: `0 0 ${SPACING.standard}px` }}>
                {current.reveal}
              </p>
            )}

            {current.examTrap && (
              <div style={{ marginBottom: SPACING.large }}>
                <p style={{ ...TYPE.metadata, textTransform: 'uppercase', color: `rgba(${rgb},0.5)`, marginBottom: SPACING.micro }}>
                  Exam trap
                </p>
                <p style={{ ...TYPE.bodySmall, color: 'rgba(234,247,240,0.72)', margin: 0, whiteSpace: 'pre-line' }}>
                  {current.examTrap}
                </p>
              </div>
            )}

            <ContinueCTA onClick={handleNext} accent={accent} />
          </div>
        )}
      </div>
    </CinematicShell>
  )
}
