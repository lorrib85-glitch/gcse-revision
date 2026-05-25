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
  const { accent } = pal
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
          40%            { opacity: 0.48; }
        }
      `}</style>

      {/* ── Floating header capsule ── */}
      <div style={{
        position: 'fixed',
        top: 'calc(10px + env(safe-area-inset-top, 0px))',
        left: 16, right: 16,
        background: 'rgba(7,10,18,0.70)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.05)',
        borderRadius: 22,
        padding: '10px 14px 12px',
        zIndex: 1001,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-10px)',
        transition: visible
          ? 'opacity 700ms ease-out, transform 700ms ease-out'
          : 'none',
        pointerEvents: visible ? 'auto' : 'none',
      }}>

        {/* ── Row 1: back arrow + module text ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 9 }}>

          {/* Back button — bare arrow, 48×48 tap target */}
          <button
            aria-label="Go back"
            onPointerDown={() => setBackPressed(true)}
            onPointerUp={() => { setBackPressed(false); onBack?.() }}
            onPointerLeave={() => setBackPressed(false)}
            style={{
              flexShrink: 0,
              width: 48, height: 48,
              background: 'none', border: 'none', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              marginLeft: -6,
              opacity: backPressed ? 1 : 0.72,
              transform: backPressed ? 'scale(0.96)' : 'scale(1)',
              transition: 'opacity 140ms ease, transform 140ms ease',
            }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,1)" strokeWidth="1.75"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          {/* Text stack */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 11, fontWeight: 600,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: accent, lineHeight: 1,
              marginBottom: 3,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {(module?.subject || '').toUpperCase()}{module?.number != null ? ` · MODULE ${module.number}` : ''}
            </div>
            <div style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 17, fontWeight: 800,
              color: '#F5F7FF', lineHeight: 1.1,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {module?.title}
            </div>
          </div>
        </div>

        {/* ── Row 2: wide segmented progress rail ── */}
        <button
          aria-label="Jump to section"
          onClick={() => setSheetOpen(true)}
          style={{
            display: 'flex', width: '100%', gap: 5,
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '6px 0 2px',
            alignItems: 'center',
          }}>
          {beats.map((_, i) => {
            const done    = i < currentBeatIndex
            const current = i === currentBeatIndex
            const base = {
              flex: 1, height: 4, borderRadius: 999, minWidth: 0,
            }
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
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: `24px 20px calc(24px + env(safe-area-inset-bottom, 0px))`,
        transform: sheetOpen ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 300ms ease',
      }}>

        {/* Sheet header */}
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

        {/* Beat list */}
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

                {/* Number circle */}
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

                {/* Label */}
                <div style={{
                  flex: 1, textAlign: 'left',
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 15, fontWeight: 600,
                  color: isLocked ? 'rgba(255,255,255,0.28)' : '#F0ECFF',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {beat.label}
                </div>

                {/* Status */}
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
    </>
  )
}
