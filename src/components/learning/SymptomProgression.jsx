import { useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
import { BUTTONS } from '../../constants/buttons.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'
import { TYPE } from '../../constants/typography.js'

const DEFAULT_FINAL_INSIGHT = 'Medieval doctors could describe what happened, but without germ theory they could not explain the real cause or choose effective prevention.'

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
    @keyframes sp-current-pulse {
      0%, 100% { box-shadow: 0 0 0 rgba(var(--sp-rgb), 0), inset 0 1px 0 rgba(255,255,255,0.03); }
      50% { box-shadow: 0 0 22px rgba(var(--sp-rgb), 0.18), inset 0 1px 0 rgba(255,255,255,0.08); }
    }
    .sp-continue:active { transform: scale(${MOTION.scale.press}); }
  `
  document.head.appendChild(el)
}

export default function SymptomProgression({
  subject = 'History',
  title,
  description,
  image,
  finalInsight = DEFAULT_FINAL_INSIGHT,
  stages = [],
  onContinue,
}) {
  ensureStyles()
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme

  const [revealed, setRevealed] = useState(Math.min(1, stages.length))
  const allRevealed = revealed >= stages.length
  const viewedStages = Array.from({ length: revealed }, (_, i) => i)
  const currentStage = Math.max(0, Math.min(revealed - 1, stages.length - 1))

  function handleAdvance() {
    if (!allRevealed) setRevealed(r => Math.min(stages.length, r + 1))
    else onContinue?.()
  }

  const F = { fontFamily: "'Sora', sans-serif" }

  return (
    <div style={{ minHeight: '100vh', background: '#0B0805', ...F }}>
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
        <div style={{ position: 'absolute', left: SPACING.standard, right: SPACING.standard, bottom: SPACING.standard }}>
          <h2 style={{
            ...F, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.12,
            color: 'rgba(255,255,255,0.94)', margin: 0,
          }}>
            {title}
          </h2>
          {description && (
            <p style={{ ...TYPE.body, color: 'rgba(255,255,255,0.52)', margin: `${SPACING.micro}px 0 0`, maxWidth: 480 }}>
              {description}
            </p>
          )}
        </div>
      </div>

      <div style={{ padding: `${SPACING.standard}px ${SPACING.standard}px ${SPACING.cinematic}px` }}>
        {stages.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: SPACING.standard }}>
            <SequenceProgress
              total={stages.length}
              current={currentStage}
              viewed={viewedStages}
              accent={accent}
              accentRgb={rgb}
              compact
              ariaLabel="Progression stages"
            />
          </div>
        )}

        {stages.slice(0, revealed).map((stage, i) => {
          const isLast      = i === revealed - 1
          const isCurrent   = isLast && !allRevealed
          const isNew       = isLast && revealed > 1
          const hasFollower = i < stages.length - 1
          const isCollapsed = revealed > 3 && i < revealed - 2

          return (
            <div
              key={stage.label || i}
              style={{
                display: 'flex', gap: SPACING.compact, alignItems: 'flex-start',
                opacity: isCollapsed ? 0.66 : isCurrent ? 1 : 0.86,
                transition: `opacity ${MOTION.duration.standard} ${MOTION.easing.standard}`,
                animation: isNew ? `sp-fade-up ${MOTION.duration.standard} ${MOTION.easing.standard} both` : 'none',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 64, flexShrink: 0 }}>
                <div style={{
                  minWidth: 64, padding: isCollapsed ? '7px 6px' : '8px 6px', borderRadius: RADII.small,
                  border: `1px solid rgba(${rgb},${isCurrent ? '0.46' : '0.24'})`,
                  background: `rgba(${rgb},${isCurrent ? '0.17' : '0.08'})`,
                  textAlign: 'center',
                  animation: isCurrent ? 'sp-current-pulse 2.3s ease-in-out infinite' : 'none',
                  '--sp-rgb': rgb,
                }}>
                  <div style={{ ...F, fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: `rgba(${rgb},0.62)` }}>Day</div>
                  <div style={{ ...F, fontSize: 16, fontWeight: 700, color: accent, marginTop: 2 }}>{stage.day}</div>
                </div>

                {hasFollower && (
                  <div style={{
                    width: 1, flex: 1, minHeight: isCollapsed ? 22 : 32,
                    background: `rgba(${rgb},0.18)`,
                    marginTop: SPACING.micro, marginBottom: SPACING.micro,
                  }} />
                )}
              </div>

              <div style={{ flex: 1, paddingTop: 4, paddingBottom: hasFollower ? (isCollapsed ? SPACING.compact : SPACING.standard) : 0 }}>
                <div style={{
                  ...F, fontSize: isCollapsed ? 16 : 19, fontWeight: 600, lineHeight: 1.3,
                  color: 'rgba(255,255,255,0.94)', marginBottom: isCollapsed ? 0 : SPACING.micro,
                }}>
                  {stage.label}
                </div>
                {!isCollapsed && (
                  <div style={{ ...TYPE.body, color: 'rgba(255,255,255,0.52)', maxWidth: 440 }}>
                    {stage.description}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {allRevealed && finalInsight && (
          <div style={{
            marginTop: SPACING.standard,
            padding: SPACING.standard,
            borderRadius: RADII.large,
            border: `1px solid rgba(${rgb},0.26)`,
            background: `linear-gradient(180deg, rgba(${rgb},0.10), rgba(255,255,255,0.025))`,
            boxShadow: `0 18px 44px rgba(0,0,0,0.24), 0 0 24px rgba(${rgb},0.06)`,
            animation: `sp-fade-up ${MOTION.duration.slow} ${MOTION.easing.standard} both`,
          }}>
            <div style={{ ...TYPE.eyebrow, color: accent, marginBottom: SPACING.micro }}>
              Why this mattered
            </div>
            <div style={{ ...TYPE.bodyStrong, color: 'rgba(255,255,255,0.78)', lineHeight: 1.55 }}>
              {finalInsight}
            </div>
          </div>
        )}

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
            Show what happens next ›
          </button>
        )}
      </div>
    </div>
  )
}
