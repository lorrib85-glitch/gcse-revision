import { useState } from 'react'
import { createPortal } from 'react-dom'

function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

function CheckIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

// ── LearningProgressHeader v2 — LOCKED COMPONENT ──────────────────────────────
// Phase/beat progression layer extracted from LearningHeader.
// Owns the progress rail + "jump to a section" sheet and its open state.
// Forward navigation stays locked (future beats disabled); subject accent is
// passed in from the orchestrator. Behaviour, navigation logic and inline
// styling preserved exactly — architectural separation only, no visual redesign.
//
// The jump sheet renders through a portal to document.body: the parent header
// capsule uses `transform`, which would otherwise become the containing block
// for the sheet's `position: fixed`. The original kept the sheet as a sibling
// of the capsule for the same reason; the portal preserves that behaviour while
// letting this component own the sheet.
export default function LearningProgressHeader({
  beats = [],
  currentBeatIndex = 0,
  accent,
  accentRgb,
  onJump,
}) {
  const [sheetOpen, setSheetOpen] = useState(false)

  function handleJump(beat, i) {
    onJump?.(beat, i)
    setSheetOpen(false)
  }

  return (
    <>
      <style>{`
        @keyframes lh-shimmer {
          0%, 80%, 100% { opacity: 1; }
          40%            { opacity: 0.48; }
        }
      `}</style>

      {/* ── Segmented progress rail ── */}
      <button
        aria-label="Jump to section"
        onClick={() => setSheetOpen(true)}
        style={{
          width: '100%',
          display: 'flex', gap: 5, alignItems: 'center',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '2px 6px 2px',
        }}>
        {beats.map((_, i) => {
          const done    = i < currentBeatIndex
          const current = i === currentBeatIndex
          const base = { flex: 1, height: 4, borderRadius: 999, minWidth: 0 }
          if (done) return (
            <div key={i} style={{
              ...base,
              background: accent,
              boxShadow: `0 0 5px rgba(${accentRgb},0.45)`,
            }} />
          )
          if (current) return (
            <div key={i} style={{
              ...base,
              background: accent,
              boxShadow: `0 0 8px rgba(${accentRgb},0.65)`,
              animation: 'lh-shimmer 4s ease-in-out infinite',
            }} />
          )
          return (
            <div key={i} style={{
              ...base,
              background: 'rgba(255,255,255,0.10)',
            }} />
          )
        })}
      </button>

      {createPortal(
        <>
          {/* ── Bottom sheet backdrop ── */}
          <div
            onClick={() => setSheetOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 199,
              background: 'rgba(0,0,0,0.5)',
              opacity: sheetOpen ? 1 : 0,
              pointerEvents: sheetOpen ? 'auto' : 'none',
              transition: 'opacity 300ms ease',
            }}
          />

          {/* ── Bottom sheet panel ── */}
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 200,
            background: 'rgba(10,12,20,0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px 24px 0 0',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            padding: `24px 20px calc(24px + env(safe-area-inset-bottom, 0px))`,
            transform: sheetOpen ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 300ms ease',
          }}>

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 18,
            }}>
              <span style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: 17, fontWeight: 700, color: '#F5F7FF',
              }}>Jump to a section</span>
              <button
                onClick={() => setSheetOpen(false)}
                style={{
                  width: 34, height: 34, borderRadius: 999,
                  background: 'rgba(255,255,255,0.07)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 17, color: 'rgba(255,255,255,0.65)',
                }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {beats.map((beat, i) => {
                const isDone    = i < currentBeatIndex
                const isCurrent = i === currentBeatIndex
                const isLocked  = i > currentBeatIndex
                return (
                  <button
                    key={i}
                    disabled={isLocked}
                    onClick={isLocked ? undefined : () => handleJump(beat, i)}
                    style={{
                      width: '100%',
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '11px 12px',
                      borderRadius: 14,
                      background: isCurrent ? `rgba(${accentRgb},0.08)` : 'transparent',
                      border: isCurrent ? `1px solid rgba(${accentRgb},0.20)` : '1px solid transparent',
                      cursor: isLocked ? 'default' : 'pointer',
                      opacity: isLocked ? 0.32 : 1,
                      transition: 'background 140ms ease',
                    }}>

                    <div style={{
                      width: 26, height: 26, borderRadius: 999, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isDone
                        ? accent
                        : isCurrent
                          ? `rgba(${accentRgb},0.16)`
                          : 'rgba(255,255,255,0.05)',
                      border: isCurrent ? `1px solid rgba(${accentRgb},0.5)` : '1px solid transparent',
                    }}>
                      {isDone ? (
                        <CheckIcon color='#08090D' />
                      ) : (
                        <span style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 11, fontWeight: 700,
                          color: isCurrent ? accent : 'rgba(255,255,255,0.28)',
                        }}>{i + 1}</span>
                      )}
                    </div>

                    <div style={{
                      flex: 1, textAlign: 'left',
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 15, fontWeight: 600,
                      color: isLocked ? 'rgba(255,255,255,0.28)' : '#F0ECFF',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {beat.label}
                    </div>

                    <div style={{
                      flexShrink: 0,
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 12, fontWeight: 600,
                      color: isDone ? accent : isCurrent ? accent : 'rgba(255,255,255,0.22)',
                      display: 'flex', alignItems: 'center',
                    }}>
                      {isDone && 'Completed'}
                      {isCurrent && (
                        <span style={{
                          display: 'inline-block',
                          background: `rgba(${accentRgb},0.16)`,
                          border: `1px solid rgba(${accentRgb},0.38)`,
                          borderRadius: 999, padding: '2px 8px',
                          color: accent,
                        }}>Current</span>
                      )}
                      {isLocked && <LockIcon />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </>,
        document.body,
      )}
    </>
  )
}
