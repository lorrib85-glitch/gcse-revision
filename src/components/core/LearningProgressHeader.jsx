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
// Stage-based progress rail for the learning header.
// 6 fixed stages; current stage shown as a labeled pill, completed as filled dots,
// future as tiny hollow dots. No jump sheet, no screen navigation.
// Tap rail to toggle a small tooltip showing the current stage description.
export default function LearningProgressHeader({ currentStage, accent, accentRgb }) {
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const currentIdx = Math.max(0, STAGES.indexOf(currentStage))

  function handleTap() {
    setTooltipVisible(v => !v)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        aria-label={`Learning stage: ${currentStage}`}
        onClick={handleTap}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px 6px 6px',
        }}
      >
        {STAGES.map((stage, i) => {
          const done    = i < currentIdx
          const current = i === currentIdx
          const isLast  = i === STAGES.length - 1

          return (
            <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>

              {/* Stage node */}
              {current ? (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: `rgba(${accentRgb},0.13)`,
                  border: `1px solid rgba(${accentRgb},0.32)`,
                  borderRadius: 999,
                  padding: '3px 10px 3px 7px',
                  height: 22,
                  flexShrink: 0,
                }}>
                  <div style={{
                    width: 6, height: 6,
                    borderRadius: '50%',
                    background: accent,
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 11, fontWeight: 700,
                    color: accent,
                    letterSpacing: '0.02em',
                    lineHeight: 1,
                  }}>{stage}</span>
                </div>
              ) : done ? (
                <div style={{
                  width: 6, height: 6,
                  borderRadius: '50%',
                  background: `rgba(${accentRgb},0.42)`,
                  flexShrink: 0,
                }} />
              ) : (
                <div style={{
                  width: 4, height: 4,
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.11)',
                  background: 'transparent',
                  flexShrink: 0,
                }} />
              )}

              {/* Connector line */}
              {!isLast && (
                <div style={{
                  width: current ? 6 : 8,
                  height: 1,
                  background: done ? `rgba(${accentRgb},0.22)` : 'rgba(255,255,255,0.07)',
                  margin: '0 2px',
                  flexShrink: 0,
                }} />
              )}
            </div>
          )
        })}
      </button>

      {/* Stage tooltip */}
      {tooltipVisible && (
        <div
          onClick={() => setTooltipVisible(false)}
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(8,11,20,0.97)',
            border: `1px solid rgba(${accentRgb},0.22)`,
            borderRadius: 10,
            padding: '7px 13px',
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
