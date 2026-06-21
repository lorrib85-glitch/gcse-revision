import { useState, useEffect } from 'react'

// ── LearningProgressHeader v4 ─────────────────────────────────────────────────
// Stage rail — six dots representing the module's 6 navigation stages.
// Active dot: filled inner + outer ring + pulse glow. Completed: filled accent.
// Future: small hollow dot. Labels hidden by default; tap a dot to see name + description.
// Each dot is its own button. Tapping calls onStageJump(screenIndex) for that stage.
// Header appears on all learning pages.
// Hidden only for full-screen cinematic/video moments where overlay UI would reduce immersion.

const INTERNAL_FALLBACK = [
  { id: 'f1', title: 'Intro',     description: '' },
  { id: 'f2', title: 'Learn 1',   description: '' },
  { id: 'f3', title: 'Learn 2',   description: '' },
  { id: 'f4', title: 'Learn 3',   description: '' },
  { id: 'f5', title: 'Review',    description: '' },
  { id: 'f6', title: 'Exam prep', description: 'Exam practice and final application.' },
]

export default function LearningProgressHeader({
  currentStage,
  stageNavigation = [],
  currentScreen = 0,
  onStageJump = null,
  accent,
  accentRgb,
}) {
  const [openTooltip, setOpenTooltip] = useState(null)

  // Close tooltip when screen changes (navigation occurred)
  useEffect(() => { setOpenTooltip(null) }, [currentScreen])

  const stages = stageNavigation.length === 6 ? stageNavigation : INTERNAL_FALLBACK

  // Active = last stage whose screenIndex is a number and ≤ currentScreen
  const activeIdx = (() => {
    let ai = 0
    for (let i = 0; i < stages.length; i++) {
      const si = stages[i].screenIndex
      if (typeof si === 'number' && si <= currentScreen) ai = i
    }
    return ai
  })()

  function handleDotClick(stage, idx) {
    const isActive = idx === activeIdx
    // Toggle tooltip; jump if not the current stage
    setOpenTooltip(prev => prev === idx ? null : idx)
    if (!isActive && onStageJump && typeof stage.screenIndex === 'number') {
      onStageJump(stage.screenIndex)
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <style>{`
        @keyframes stage-glow {
          0%, 100% { box-shadow: 0 0 5px 1px rgba(${accentRgb},0.45); }
          50%       { box-shadow: 0 0 11px 3px rgba(${accentRgb},0.70); }
        }
      `}</style>

      {/* ── Dot rail ── */}
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '10px 4px',
      }}>
        {stages.map((stage, i) => {
          const done    = i < activeIdx
          const current = i === activeIdx
          const isLast  = i === stages.length - 1

          return (
            <div
              key={stage.id || i}
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: isLast ? '0 0 auto' : 1,
                minWidth: 0,
              }}
            >
              {/* ── Stage dot button ── */}
              <button
                aria-label={`Jump to ${stage.title}`}
                onClick={() => handleDotClick(stage, i)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: current ? 20 : 12,
                  height: current ? 20 : 12,
                  flexShrink: 0,
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {current ? (
                  <div style={{
                    position: 'relative',
                    width: 20, height: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {/* Outer ring */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      borderRadius: '50%',
                      border: `1.5px solid rgba(${accentRgb},0.65)`,
                    }} />
                    {/* Inner dot with pulse */}
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
                  }} />
                ) : (
                  <div style={{
                    width: 6, height: 6,
                    borderRadius: '50%',
                    border: '1.5px solid rgba(255,255,255,0.13)',
                    background: 'transparent',
                  }} />
                )}
              </button>

              {/* ── Connector — stretches to fill remaining space ── */}
              {!isLast && (
                <div style={{
                  flex: 1,
                  height: 1,
                  background: (done || current)
                    ? `rgba(${accentRgb},0.25)`
                    : 'rgba(255,255,255,0.08)',
                  margin: '0 5px',
                  minWidth: 6,
                }} />
              )}
            </div>
          )
        })}
      </div>

      {/* ── Per-dot tooltip — shown on tap ── */}
      {openTooltip !== null && stages[openTooltip] && (
        <div
          onClick={() => setOpenTooltip(null)}
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
            maxWidth: 180,
            whiteSpace: 'normal',
            pointerEvents: 'auto',
            cursor: 'pointer',
          }}
        >
          <div style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 11, fontWeight: 700,
            color: accent,
            marginBottom: 2,
          }}>{stages[openTooltip].title}</div>
          {stages[openTooltip].description ? (
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 10,
              color: 'rgba(255,255,255,0.48)',
            }}>{stages[openTooltip].description}</div>
          ) : null}
        </div>
      )}
    </div>
  )
}
