import { useState } from 'react'

const STAGES = ['Intro', 'Hippocrates', 'Galen', 'Medieval treatments', 'Rational vs supernatural', 'Exam prep']

const STAGE_DESCRIPTIONS = {
  'Intro':                    'Setting the scene and activating prior knowledge',
  'Hippocrates':              'The origins of ancient medical theory',
  'Galen':                    'How Galen shaped medicine for 1,400 years',
  'Medieval treatments':      'How illness was explained and treated',
  'Rational vs supernatural': 'Sorting natural from religious explanations',
  'Exam prep':                'Applying knowledge under exam conditions',
}

// ── LearningProgressHeader v3 ─────────────────────────────────────────────────
// Stage rail — fills all available width between nav buttons.
// Current stage: solid dot + outer ring with gap + pulse glow; no label until tapped.
// Completed: filled accent dot. Future: small hollow dot.
// Tap to show stage name + description tooltip.
export default function LearningProgressHeader({ currentStage, accent, accentRgb }) {
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const currentIdx = Math.max(0, STAGES.indexOf(currentStage))

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <style>{`
        @keyframes stage-glow {
          0%, 100% { box-shadow: 0 0 5px 1px rgba(${accentRgb},0.45); }
          50%       { box-shadow: 0 0 11px 3px rgba(${accentRgb},0.70); }
        }
      `}</style>

      <button
        aria-label={`Learning stage: ${currentStage}`}
        onClick={() => setTooltipVisible(v => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '10px 4px',
        }}
      >
        {STAGES.map((stage, i) => {
          const done    = i < currentIdx
          const current = i === currentIdx
          const isLast  = i === STAGES.length - 1

          return (
            <div
              key={stage}
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: isLast ? '0 0 auto' : 1,
                minWidth: 0,
              }}
            >
              {/* ── Stage node ── */}
              {current ? (
                /* Active: inner dot + outer ring with gap, pulse glow */
                <div style={{
                  position: 'relative',
                  width: 20, height: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {/* Outer ring */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: `1.5px solid rgba(${accentRgb},0.65)`,
                  }} />
                  {/* Inner dot with pulse glow */}
                  <div style={{
                    width: 8, height: 8,
                    borderRadius: '50%',
                    background: accent,
                    animation: 'stage-glow 2.8s ease-in-out infinite',
                  }} />
                </div>
              ) : done ? (
                <div style={{
                  width: 8, height: 8,
                  borderRadius: '50%',
                  background: `rgba(${accentRgb},0.45)`,
                  flexShrink: 0,
                }} />
              ) : (
                <div style={{
                  width: 6, height: 6,
                  borderRadius: '50%',
                  border: '1.5px solid rgba(255,255,255,0.13)',
                  background: 'transparent',
                  flexShrink: 0,
                }} />
              )}

              {/* ── Connector — stretches to fill remaining space ── */}
              {!isLast && (
                <div style={{
                  flex: 1,
                  height: 1,
                  background: done
                    ? `rgba(${accentRgb},0.25)`
                    : 'rgba(255,255,255,0.08)',
                  margin: '0 5px',
                  minWidth: 6,
                }} />
              )}
            </div>
          )
        })}
      </button>

      {/* ── Stage tooltip — shown on tap ── */}
      {tooltipVisible && (
        <div
          onClick={() => setTooltipVisible(false)}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(8,11,20,0.97)',
            border: `1px solid rgba(${accentRgb},0.24)`,
            borderRadius: 10,
            padding: '7px 14px',
            zIndex: 10,
            whiteSpace: 'nowrap',
            pointerEvents: 'auto',
            cursor: 'pointer',
          }}
        >
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 11, fontWeight: 700,
            color: accent,
            marginBottom: 2,
          }}>{currentStage}</div>
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 10,
            color: 'rgba(255,255,255,0.48)',
          }}>{STAGE_DESCRIPTIONS[currentStage] || ''}</div>
        </div>
      )}
    </div>
  )
}
