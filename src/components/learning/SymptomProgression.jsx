import { useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import { BUTTONS } from '../../constants/buttons.js'
import ContinueCTA from '../core/ContinueCTA.jsx'

let _spStyled = false
function ensureStyles() {
  if (_spStyled) return
  _spStyled = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes sp-fade-up {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .sp-continue:active { transform: scale(${MOTION.scale.press}); }
  `
  document.head.appendChild(el)
}

// ─── SymptomProgression ───────────────────────────────────────────────────────
//
// A case-file framed walkthrough of how an illness develops in the body,
// stage by stage. Reuses the explain-the-chain mechanic (tap to reveal the
// next stage) so the learner actively builds the timeline rather than
// reading a wall of text.
//
// Screen data shape:
// {
//   type: 'progressionTimeline',
//   title: 'How the plague killed',
//   description: 'Follow the progression of bubonic plague through the body.',
//   image: '/figures/.../symptom-case-file.png',
//   stages: [
//     { day: '1–2', label: 'Flea bite', description: '...' },
//     ...
//   ],
// }

export default function SymptomProgression({
  subject = 'History',
  title,
  description,
  image,
  stages = [],
  onContinue,
}) {
  ensureStyles()
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme

  const [revealed, setRevealed] = useState(Math.min(1, stages.length))
  const allRevealed = revealed >= stages.length

  function handleAdvance() {
    if (!allRevealed) setRevealed(r => Math.min(stages.length, r + 1))
    else onContinue?.()
  }

  const F = { fontFamily: "'Sora', sans-serif" }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0805', ...F }}>

      {/* Case file image — atmospheric reveal at top of screen */}
      <div style={{ position: 'relative', height: '46vh', minHeight: 320, overflow: 'hidden' }}>
        {image && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover', backgroundPosition: 'center top',
            }}
          />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(11,8,5,0.05) 0%, rgba(11,8,5,0.55) 62%, #0B0805 100%)',
        }} />
        <div style={{
          position: 'absolute', left: SPACING.standard, right: SPACING.standard, bottom: SPACING.standard,
        }}>
          <div style={{
            ...F, fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: `rgba(${rgb},0.78)`, marginBottom: SPACING.micro,
          }}>
            Case file
          </div>
          <h2 style={{
            ...F, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.12,
            color: 'rgba(255,255,255,0.94)', margin: 0,
          }}>
            {title}
          </h2>
          {description && (
            <p style={{
              ...F, fontSize: 15, fontWeight: 400, lineHeight: 1.5,
              color: 'rgba(255,255,255,0.52)', margin: `${SPACING.micro}px 0 0`, maxWidth: 480,
            }}>
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Stage chain — tap to reveal each stage of the progression */}
      <div style={{ padding: `${SPACING.standard}px ${SPACING.standard}px ${SPACING.cinematic}px` }}>
        {stages.slice(0, revealed).map((stage, i) => {
          const isLast      = i === revealed - 1
          const isCurrent   = isLast && !allRevealed
          const isNew       = isLast && revealed > 1
          const hasFollower = i < stages.length - 1

          return (
            <div
              key={stage.label || i}
              style={{
                display: 'flex', gap: SPACING.compact, alignItems: 'flex-start',
                opacity: isCurrent ? 1 : 0.90,
                transition: `opacity ${MOTION.duration.standard} ${MOTION.easing.standard}`,
                animation: isNew ? `sp-fade-up ${MOTION.duration.standard} ${MOTION.easing.standard} both` : 'none',
              }}
            >
              {/* Day marker + connector */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                width: 64, flexShrink: 0,
              }}>
                <div style={{
                  minWidth: 64, padding: '8px 6px', borderRadius: RADII.small,
                  border: `1px solid rgba(${rgb},${isCurrent ? '0.42' : '0.24'})`,
                  background: `rgba(${rgb},${isCurrent ? '0.16' : '0.08'})`,
                  textAlign: 'center',
                }}>
                  <div style={{ ...F, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: `rgba(${rgb},0.62)` }}>Day</div>
                  <div style={{ ...F, fontSize: 16, fontWeight: 700, color: accent, marginTop: 2 }}>{stage.day}</div>
                </div>

                {hasFollower && (
                  <div style={{
                    width: 1, flex: 1, minHeight: 32,
                    background: `rgba(${rgb},0.18)`,
                    marginTop: SPACING.micro, marginBottom: SPACING.micro,
                  }} />
                )}
              </div>

              {/* Stage description */}
              <div style={{ flex: 1, paddingTop: 4, paddingBottom: hasFollower ? SPACING.standard : 0 }}>
                <div style={{
                  ...F, fontSize: 19, fontWeight: 600, lineHeight: 1.3,
                  color: 'rgba(255,255,255,0.94)', marginBottom: SPACING.micro,
                }}>
                  {stage.label}
                </div>
                <div style={{
                  ...F, fontSize: 15, fontWeight: 400, lineHeight: 1.55,
                  color: 'rgba(255,255,255,0.52)', maxWidth: 440,
                }}>
                  {stage.description}
                </div>
              </div>
            </div>
          )
        })}

        {/* Advance control */}
        {allRevealed ? (
          <ContinueCTA onClick={handleAdvance} accent={accent} style={{ marginTop: SPACING.standard }} />
        ) : (
          <button
            className="sp-continue"
            onClick={handleAdvance}
            style={{
              marginTop: SPACING.standard, width: '100%',
              height: BUTTONS.continue.height,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: `rgba(${rgb},0.12)`,
              border: `1px solid rgba(${rgb},0.28)`,
              borderRadius: BUTTONS.continue.borderRadius,
              ...F, fontWeight: BUTTONS.continue.fontWeight, fontSize: BUTTONS.continue.fontSize,
              color: accent,
              cursor: 'pointer',
              transition: `transform ${BUTTONS.continue.transition}`,
            }}
          >
            Reveal next stage ›
          </button>
        )}
      </div>
    </div>
  )
}
