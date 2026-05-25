import { useState } from 'react'

const PALETTES = {
  history:   { accent: '#C89B6D', glow: 'rgba(200,155,109,0.35)' },
  biology:   { accent: '#8FD6A3', glow: 'rgba(143,214,163,0.32)' },
  chemistry: { accent: '#8B5CF6', glow: 'rgba(139,92,246,0.34)'  },
  physics:   { accent: '#5DA9E9', glow: 'rgba(93,169,233,0.35)'  },
  maths:     { accent: '#2BBE9A', glow: 'rgba(43,190,154,0.35)'  },
  english:   { accent: '#9E3D52', glow: 'rgba(158,61,82,0.35)'   },
  sociology: { accent: '#C9B07C', glow: 'rgba(201,176,124,0.32)' },
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}

// Padlock SVG
function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

// Checkmark SVG
function CheckIcon({ color }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

export default function LearningHeader({
  module,
  beats = [],
  currentBeatIndex = 0,
  onBack,
  onJump,
  visible = true,
}) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [backPressed, setBackPressed] = useState(false)

  const subject = (module?.subject || '').toLowerCase()
  const pal = PALETTES[subject] || PALETTES.history
  const { accent, glow } = pal
  const accentRgb = hexToRgb(accent)

  function handleJump(beat, i) {
    onJump?.(beat, i)
    setSheetOpen(false)
  }

  return (
    <>
      <style>{`
        @keyframes lh-shimmer {
          0%, 80%, 100% { opacity: 1; }
          40%            { opacity: 0.52; }
        }
      `}</style>

      {/* ── Floating header capsule ── */}
      <div style={{
        position: 'fixed',
        top: 'calc(12px + env(safe-area-inset-top, 0px))',
        left: 16, right: 16,
        height: 88,
        background: 'rgba(7,10,18,0.72)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 24,
        padding: '0 8px',
        display: 'flex', alignItems: 'center', gap: 10,
        zIndex: 1001,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-10px)',
        transition: visible
          ? 'opacity 700ms ease-out, transform 700ms ease-out'
          : 'none',
        pointerEvents: visible ? 'auto' : 'none',
      }}>

        {/* Back button */}
        <button
          aria-label="Go back"
          onPointerDown={() => setBackPressed(true)}
          onPointerUp={() => { setBackPressed(false); onBack?.() }}
          onPointerLeave={() => setBackPressed(false)}
          style={{
            flexShrink: 0,
            width: 56, height: 56, borderRadius: 999,
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid rgba(${accentRgb},${backPressed ? '0.55' : '0.28'})`,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            transform: backPressed ? 'scale(0.96)' : 'scale(1)',
            transition: 'transform 140ms ease, border-color 140ms ease',
          }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.85)" strokeWidth="1.75"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>

        {/* Icon + text stack */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, maxWidth: 135 }}>
          {/* Subject icon box */}
          {module?.icon && (
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: `rgba(${accentRgb},0.12)`,
              border: `1px solid rgba(${accentRgb},0.22)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>{module.icon}</div>
          )}
          {/* Text stack */}
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 11, fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: accent, lineHeight: 1,
              marginBottom: 4,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {(module?.subject || '').toUpperCase()}{module?.number != null ? ` · MODULE ${module.number}` : ''}
            </div>
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 18, fontWeight: 800,
              color: '#F5F7FF', lineHeight: 1.05,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {module?.title}
            </div>
          </div>
        </div>

        {/* Segmented progress rail */}
        <button
          aria-label="Jump to section"
          onClick={() => setSheetOpen(true)}
          style={{
            flex: 1, minWidth: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0',
          }}>
          {beats.map((_, i) => {
            const done    = i < currentBeatIndex
            const current = i === currentBeatIndex
            const baseStyle = {
              flex: '1 1 0', maxWidth: 40, minWidth: 8, height: 6, borderRadius: 999,
            }
            if (done) return (
              <div key={i} style={{
                ...baseStyle,
                background: accent,
                boxShadow: `0 0 6px rgba(${accentRgb},0.5)`,
              }} />
            )
            if (current) return (
              <div key={i} style={{
                ...baseStyle,
                background: accent,
                boxShadow: `0 0 10px rgba(${accentRgb},0.75)`,
                animation: 'lh-shimmer 4s ease-in-out infinite',
              }} />
            )
            return (
              <div key={i} style={{
                ...baseStyle,
                background: 'rgba(255,255,255,0.12)',
              }} />
            )
          })}
        </button>

        {/* Step counter */}
        <div style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 14, fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'rgba(245,238,225,0.92)',
          flexShrink: 0, whiteSpace: 'nowrap',
        }}>
          {currentBeatIndex + 1} OF {beats.length}
        </div>
      </div>

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
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: `24px 20px calc(24px + env(safe-area-inset-bottom, 0px))`,
        transform: sheetOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 300ms ease',
      }}>
        {/* Sheet header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 20,
        }}>
          <span style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: 18, fontWeight: 700, color: '#F5F7FF',
          }}>Jump to a section</span>
          <button
            onClick={() => setSheetOpen(false)}
            style={{
              width: 36, height: 36, borderRadius: 999,
              background: 'rgba(255,255,255,0.08)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Sora', sans-serif",
              fontSize: 18, color: 'rgba(255,255,255,0.7)',
            }}>×</button>
        </div>

        {/* Beat list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '13px 14px',
                  borderRadius: 14,
                  background: isCurrent ? `rgba(${accentRgb},0.08)` : 'transparent',
                  border: isCurrent ? `1px solid rgba(${accentRgb},0.22)` : '1px solid transparent',
                  cursor: isLocked ? 'default' : 'pointer',
                  opacity: isLocked ? 0.35 : 1,
                  transition: 'background 140ms ease',
                }}>
                {/* Number circle */}
                <div style={{
                  width: 28, height: 28, borderRadius: 999, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isDone
                    ? accent
                    : isCurrent
                      ? `rgba(${accentRgb},0.18)`
                      : 'rgba(255,255,255,0.06)',
                  border: isCurrent ? `1px solid ${accent}` : '1px solid transparent',
                }}>
                  {isDone ? (
                    <CheckIcon color={subject === 'history' ? '#241815' : '#081010'} />
                  ) : (
                    <span style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 12, fontWeight: 700,
                      color: isCurrent ? accent : 'rgba(255,255,255,0.3)',
                    }}>{i + 1}</span>
                  )}
                </div>

                {/* Label */}
                <div style={{
                  flex: 1, textAlign: 'left',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 15, fontWeight: 600,
                  color: isLocked ? 'rgba(255,255,255,0.3)' : '#F5F7FF',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {beat.label}
                </div>

                {/* Status */}
                <div style={{
                  flexShrink: 0,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 12, fontWeight: 600,
                  color: isDone
                    ? accent
                    : isCurrent
                      ? accent
                      : 'rgba(255,255,255,0.25)',
                }}>
                  {isDone && 'Completed'}
                  {isCurrent && (
                    <span style={{
                      display: 'inline-block',
                      background: `rgba(${accentRgb},0.18)`,
                      border: `1px solid rgba(${accentRgb},0.4)`,
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
    </>
  )
}
