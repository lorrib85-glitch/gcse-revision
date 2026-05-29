import { useState } from 'react'

const STAGES = ['Discover', 'Understand', 'Investigate', 'Challenge', 'Examiner', 'Complete']

const STAGE_DESCRIPTIONS = {
  Discover:    'Setting the scene and activating prior knowledge',
  Understand:  'Building core knowledge and concepts',
  Investigate: 'Exploring evidence, causes and context',
  Challenge:   'Applying knowledge to real scenarios',
  Examiner:    'Practising exam technique',
  Complete:    'Reviewing and locking in your learning',
}

// ── LearningProgressHeader v3 ─────────────────────────────────────────────────
// Stage-based progress rail. Stretches to fill all available width.
// Current stage: labeled accent pill. Completed: filled dot. Future: hollow dot.
// Connectors are flex so they expand to fill the space between nodes.
// Tap to toggle a tooltip with the current stage description.
export default function LearningProgressHeader({ currentStage, accent, accentRgb }) {
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const currentIdx = Math.max(0, STAGES.indexOf(currentStage))

  return (
    <div style={{ position: 'relative', width: '100%' }}>
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
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: `rgba(${accentRgb},0.14)`,
                  border: `1px solid rgba(${accentRgb},0.35)`,
                  borderRadius: 999,
                  padding: '4px 11px 4px 8px',
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: 7, height: 7,
                    borderRadius: '50%',
                    background: accent,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 12, fontWeight: 700,
                    color: accent,
                    letterSpacing: '0.01em',
                    lineHeight: 1,
                  }}>{stage}</span>
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

      {/* ── Stage tooltip ── */}
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
