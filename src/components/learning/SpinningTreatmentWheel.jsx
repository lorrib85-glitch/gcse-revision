import { useState, useRef, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'

let _stwStyled = false
function ensureStyles() {
  if (_stwStyled) return
  _stwStyled = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes te-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes te-panel-in {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `
  document.head.appendChild(el)
}

// Pie slice for segment i of n, with segment i centred at 12 o'clock when rotation=0
function segmentPath(i, n) {
  const segAngle = (2 * Math.PI) / n
  const center   = (i / n) * 2 * Math.PI - Math.PI / 2
  const start    = center - segAngle / 2
  const end      = center + segAngle / 2
  const x1 = Math.cos(start), y1 = Math.sin(start)
  const x2 = Math.cos(end),   y2 = Math.sin(end)
  return `M 0 0 L ${x1} ${y1} A 1 1 0 0 1 ${x2} ${y2} Z`
}

// Centre of segment i at radius r
function segmentCenter(i, n, r = 0.60) {
  const angle = (i / n) * 2 * Math.PI - Math.PI / 2
  return { x: Math.cos(angle) * r, y: Math.sin(angle) * r }
}

export default function SpinningTreatmentWheel({ block, subject, onContinue }) {
  ensureStyles()

  const theme     = SUBJECTS[subject] || SUBJECTS.History
  const accent    = theme.accent
  const accentRgb = theme.accentRgb
  const bg        = theme.background || '#0F0B07'

  const {
    introLabel          = 'Patient symptoms',
    symptoms            = [],
    diagnosisLabel      = 'Diagnosis:',
    diagnosis           = [],
    instruction         = 'Spin the wheel to find the treatment',
    wheelSegments       = [],
    prescriptionLabel   = 'Prescription:',
    correctPrescription = [],
    prescriptionItems   = [],
    explanationTitle    = 'Why?',
    explanation         = '',
    examTip             = null,
    centreLabel         = '',
  } = block

  const n      = wheelSegments.length || 4
  const segDeg = 360 / n

  // ── State ──────────────────────────────────────────────────────────────────
  const [rot,        setRot]        = useState(0)
  const [snapTarget, setSnapTarget] = useState(0)
  const [isSnapping, setIsSnapping] = useState(false)
  const [activeIdx,  setActiveIdx]  = useState(0)
  const [hasSettled, setHasSettled] = useState(false)

  // ── Refs ───────────────────────────────────────────────────────────────────
  const isDragging = useRef(false)
  const startX     = useRef(0)
  const startRot   = useRef(0)
  const vel        = useRef(0)
  const prevX      = useRef(0)
  const prevT      = useRef(0)
  const rafId      = useRef(null)
  const snapTid    = useRef(null)
  const liveRot    = useRef(0)   // always in sync with displayed rotation for rAF closures
  const svgRef     = useRef(null)

  const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => () => {
    if (rafId.current) cancelAnimationFrame(rafId.current)
    if (snapTid.current) clearTimeout(snapTid.current)
  }, [])

  // ── Helpers ────────────────────────────────────────────────────────────────
  function calcActiveIdx(r) {
    return ((Math.round(r / segDeg) % n) + n) % n
  }

  function snapTo(r) {
    if (rafId.current) { cancelAnimationFrame(rafId.current); rafId.current = null }
    if (snapTid.current) { clearTimeout(snapTid.current); snapTid.current = null }
    const snapped = Math.round(r / segDeg) * segDeg
    setSnapTarget(snapped)
    setIsSnapping(true)
    const delay = prefersReducedMotion ? 50 : 520
    snapTid.current = setTimeout(() => {
      snapTid.current = null
      setRot(snapped)
      liveRot.current = snapped
      setIsSnapping(false)
      setActiveIdx(calcActiveIdx(snapped))
      setHasSettled(true)
    }, delay)
  }

  function momentumStep(r, v) {
    v *= 0.93
    r += v
    setRot(r)
    liveRot.current = r
    if (Math.abs(v) < 0.6) { snapTo(r); return }
    rafId.current = requestAnimationFrame(() => momentumStep(r, v))
  }

  // ── Pointer events (on SVG via pointer capture) ────────────────────────────
  function onPD(e) {
    svgRef.current?.setPointerCapture(e.pointerId)
    if (rafId.current) { cancelAnimationFrame(rafId.current); rafId.current = null }
    setIsSnapping(false)
    isDragging.current = true
    startX.current = e.clientX
    startRot.current = liveRot.current
    prevX.current  = e.clientX
    prevT.current  = performance.now()
    vel.current    = 0
  }

  function onPM(e) {
    if (!isDragging.current) return
    const now = performance.now()
    const dt  = now - prevT.current
    if (dt > 0) {
      const rawVel = (e.clientX - prevX.current) * 0.7 / dt * 16
      vel.current  = vel.current * 0.65 + rawVel * 0.35
    }
    prevX.current = e.clientX
    prevT.current = now
    const newRot  = startRot.current + (e.clientX - startX.current) * 0.6
    setRot(newRot)
    liveRot.current = newRot
  }

  function onPU() {
    if (!isDragging.current) return
    isDragging.current = false
    if (prefersReducedMotion || Math.abs(vel.current) < 0.5) {
      snapTo(liveRot.current)
    } else {
      momentumStep(liveRot.current, vel.current)
    }
  }

  // ── Tap button fallback ────────────────────────────────────────────────────
  function tapRotate(dir) {
    if (isSnapping) return
    const current = Math.round(liveRot.current / segDeg) * segDeg
    snapTo(current + dir * segDeg)
  }

  // ── Display ────────────────────────────────────────────────────────────────
  const displayRot  = isSnapping ? snapTarget : rot
  const transStyle  = isSnapping && !prefersReducedMotion
    ? 'transform 500ms cubic-bezier(0.22,1,0.36,1)'
    : 'none'

  const wheelSize   = typeof window !== 'undefined'
    ? Math.min(window.innerWidth * 0.88, 400)
    : 340

  // ── Render ─────────────────────────────────────────────────────────────────
  const F = { fontFamily: "'Sora', sans-serif" }
  const O = { fontFamily: "'Outfit', sans-serif" }
  const G = { fontFamily: "'Cormorant Garamond', Georgia, serif" }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: bg,
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{
        padding: '84px 20px 64px',
        maxWidth: 480,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>

        {/* 1 ── Symptoms strip */}
        <div style={{
          width: '100%',
          background: `rgba(${accentRgb},0.05)`,
          border: `1px solid rgba(${accentRgb},0.18)`,
          borderRadius: 12,
          padding: '14px 16px',
          marginBottom: 12,
          animation: 'te-fade-up 480ms cubic-bezier(0.22,1,0.36,1) both',
        }}>
          <div style={{
            ...O, fontWeight: 600, fontSize: 10,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: `rgba(${accentRgb},0.50)`,
            marginBottom: 10,
          }}>
            {introLabel}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {symptoms.map((s, i) => (
              <span key={i} style={{
                ...O, fontWeight: 500, fontSize: 13,
                color: 'rgba(245,238,225,0.82)',
                background: 'rgba(245,238,225,0.06)',
                border: '1px solid rgba(245,238,225,0.12)',
                borderRadius: 20,
                padding: '5px 13px',
              }}>
                {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* 2 ── Diagnosis panel */}
        <div style={{
          width: '100%',
          background: 'rgba(0,0,0,0.42)',
          border: `1px solid rgba(${accentRgb},0.22)`,
          borderRadius: 12,
          padding: '14px 18px',
          marginBottom: 14,
          animation: 'te-fade-up 480ms cubic-bezier(0.22,1,0.36,1) 60ms both',
        }}>
          <div style={{
            ...O, fontWeight: 500, fontSize: 11,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'rgba(245,238,225,0.38)',
            marginBottom: 8,
          }}>
            {diagnosisLabel}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            {diagnosis.map((d, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  ...G, fontWeight: 700,
                  fontSize: 'clamp(22px,6vw,28px)',
                  color: accent,
                  letterSpacing: '-0.01em',
                }}>
                  {d}
                </span>
                {i < diagnosis.length - 1 && (
                  <span style={{ color: 'rgba(245,238,225,0.25)', fontSize: 18 }}>+</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* 3 ── Instruction */}
        <div style={{
          ...O, fontWeight: 500, fontSize: 13,
          color: 'rgba(245,238,225,0.35)',
          textAlign: 'center',
          marginBottom: 18,
          animation: 'te-fade-up 480ms cubic-bezier(0.22,1,0.36,1) 100ms both',
        }}>
          {instruction}
        </div>

        {/* 4 ── Wheel */}
        <div style={{ position: 'relative', marginBottom: 4 }}>

          {/* Fixed pointer */}
          <div style={{
            position: 'absolute',
            top: -15, left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10, pointerEvents: 'none',
          }}>
            <svg width="22" height="18" viewBox="0 0 22 18">
              <polygon points="11,16 2,2 20,2" fill={accent} opacity={0.92} />
            </svg>
          </div>

          {/* SVG wheel */}
          <svg
            ref={svgRef}
            viewBox="-1.1 -1.1 2.2 2.2"
            width={wheelSize}
            height={wheelSize}
            style={{
              display: 'block',
              transform: `rotate(${displayRot}deg)`,
              transition: transStyle,
              touchAction: 'none',
              cursor: isDragging.current ? 'grabbing' : 'grab',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              filter: 'drop-shadow(0 6px 32px rgba(0,0,0,0.80))',
            }}
            onPointerDown={onPD}
            onPointerMove={onPM}
            onPointerUp={onPU}
            onPointerCancel={onPU}
          >
            <defs>
              <linearGradient id="stw-rim" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="#D4A855" />
                <stop offset="28%"  stopColor="#8B6B30" />
                <stop offset="62%"  stopColor="#C09040" />
                <stop offset="100%" stopColor="#6A4E1A" />
              </linearGradient>
              <radialGradient id="stw-medallion" cx="45%" cy="38%" r="65%">
                <stop offset="0%"   stopColor="#5C3E1C" />
                <stop offset="100%" stopColor="#221408" />
              </radialGradient>
            </defs>

            {/* Segment fills */}
            {wheelSegments.map((seg, i) => (
              <path
                key={seg.id || i}
                d={segmentPath(i, n)}
                fill={seg.color || '#2A2218'}
              />
            ))}

            {/* Active segment highlight (after first settle) */}
            {hasSettled && (
              <path
                d={segmentPath(activeIdx, n)}
                fill={`rgba(${accentRgb},0.13)`}
              />
            )}

            {/* Radial dividers — at boundary between each pair of segments */}
            {wheelSegments.map((_, i) => {
              const angle = (i / n) * 2 * Math.PI - Math.PI / 2 + Math.PI / n
              return (
                <line key={i}
                  x1={0} y1={0}
                  x2={Math.cos(angle)} y2={Math.sin(angle)}
                  stroke="rgba(0,0,0,0.50)"
                  strokeWidth="0.014"
                />
              )
            })}

            {/* Dark inner border */}
            <circle cx={0} cy={0} r={0.92} fill="none" stroke="#1A0E04" strokeWidth="0.10" />

            {/* Bronze outer rim */}
            <circle cx={0} cy={0} r={0.97} fill="none" stroke="url(#stw-rim)" strokeWidth="0.07" />

            {/* Inner accent ring */}
            <circle cx={0} cy={0} r={0.86} fill="none" stroke="rgba(139,107,53,0.42)" strokeWidth="0.012" />

            {/* Segment icons + labels (rotate with wheel — authentic physical behaviour) */}
            {wheelSegments.map((seg, i) => {
              const lp = segmentCenter(i, n, 0.63)
              const ip = segmentCenter(i, n, 0.40)
              return (
                <g key={seg.id || i}>
                  {seg.icon && (
                    <text
                      x={ip.x} y={ip.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="0.20"
                    >
                      {seg.icon}
                    </text>
                  )}
                  <text
                    x={lp.x}
                    y={lp.y + (seg.icon ? 0.09 : 0)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="0.115"
                    fontFamily="Sora, sans-serif"
                    fontWeight="700"
                    letterSpacing="0.06"
                    fill="rgba(245,238,225,0.90)"
                  >
                    {seg.label}
                  </text>
                </g>
              )
            })}

            {/* Central medallion */}
            <circle cx={0} cy={0} r={0.23} fill="url(#stw-medallion)" />
            <circle cx={0} cy={0} r={0.23} fill="none" stroke="rgba(180,130,60,0.72)" strokeWidth="0.020" />
            {centreLabel && (
              <text
                x={0} y={0}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="0.068"
                fontFamily="Sora, sans-serif"
                fontWeight="700"
                letterSpacing="0.06"
                fill={`rgba(${accentRgb},0.72)`}
              >
                {centreLabel}
              </text>
            )}
          </svg>
        </div>

        {/* 5 ── Tap fallback + drag affordance */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginBottom: 20,
          animation: 'te-fade-up 480ms cubic-bezier(0.22,1,0.36,1) 140ms both',
        }}>
          <button
            onClick={() => tapRotate(-1)}
            style={{
              background: 'none', border: 'none',
              ...O, fontWeight: 700, fontSize: 22,
              color: 'rgba(245,238,225,0.28)',
              cursor: 'pointer', padding: '4px 8px',
              lineHeight: 1,
            }}
            aria-label="Rotate left"
          >
            ‹
          </button>
          <span style={{
            ...O, fontWeight: 600, fontSize: 10,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(245,238,225,0.22)',
          }}>
            Drag to spin
          </span>
          <button
            onClick={() => tapRotate(1)}
            style={{
              background: 'none', border: 'none',
              ...O, fontWeight: 700, fontSize: 22,
              color: 'rgba(245,238,225,0.28)',
              cursor: 'pointer', padding: '4px 8px',
              lineHeight: 1,
            }}
            aria-label="Rotate right"
          >
            ›
          </button>
        </div>

        {/* 6 ── Treatment panel (revealed after first settle) */}
        {hasSettled && (
          <div style={{
            width: '100%',
            animation: 'te-panel-in 440ms cubic-bezier(0.22,1,0.36,1) both',
          }}>
            <div style={{
              ...O, fontWeight: 600, fontSize: 10,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(245,238,225,0.35)',
              textAlign: 'center',
              marginBottom: 12,
            }}>
              {prescriptionLabel}
            </div>

            {/* Prescription tokens */}
            <div style={{
              display: 'flex', justifyContent: 'center',
              alignItems: 'center', gap: 12,
              marginBottom: 22,
            }}>
              {correctPrescription.map((p, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{
                    ...G, fontWeight: 700,
                    fontSize: 'clamp(24px,7vw,32px)',
                    color: accent,
                    letterSpacing: '-0.01em',
                  }}>
                    {p}
                  </span>
                  {i < correctPrescription.length - 1 && (
                    <span style={{ color: 'rgba(245,238,225,0.22)', fontSize: 20 }}>+</span>
                  )}
                </span>
              ))}
            </div>

            {/* Prescription items */}
            <div style={{ width: '100%', marginBottom: 22 }}>
              {prescriptionItems.map((item, i) => (
                <div key={i} style={{
                  padding: '11px 0',
                  borderBottom: i < prescriptionItems.length - 1
                    ? '1px solid rgba(245,238,225,0.06)' : 'none',
                  animation: `te-fade-up 380ms cubic-bezier(0.22,1,0.36,1) ${i * 70}ms both`,
                }}>
                  <div style={{
                    ...F, fontWeight: 600, fontSize: 14,
                    color: 'rgba(245,238,225,0.88)',
                    marginBottom: 2,
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    ...O, fontWeight: 400, fontSize: 13,
                    color: 'rgba(245,238,225,0.42)',
                    lineHeight: 1.5,
                  }}>
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7 ── Explanation strip */}
        {hasSettled && explanation && (
          <div style={{
            width: '100%',
            background: `rgba(${accentRgb},0.05)`,
            border: `1px solid rgba(${accentRgb},0.14)`,
            borderRadius: 12,
            padding: '16px',
            marginBottom: 12,
            animation: 'te-fade-up 480ms cubic-bezier(0.22,1,0.36,1) 200ms both',
          }}>
            {explanationTitle && (
              <div style={{
                ...O, fontWeight: 600, fontSize: 10,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: `rgba(${accentRgb},0.50)`,
                marginBottom: 8,
              }}>
                {explanationTitle}
              </div>
            )}
            <div style={{
              ...O, fontWeight: 500, fontSize: 14,
              lineHeight: 1.65,
              color: 'rgba(245,238,225,0.58)',
            }}>
              {explanation}
            </div>
          </div>
        )}

        {/* 8 ── Exam tip */}
        {hasSettled && examTip && (
          <div style={{
            width: '100%',
            background: `rgba(${accentRgb},0.06)`,
            border: `1px solid rgba(${accentRgb},0.20)`,
            borderRadius: 12,
            padding: '14px 16px',
            marginBottom: 12,
            animation: 'te-fade-up 480ms cubic-bezier(0.22,1,0.36,1) 300ms both',
          }}>
            <div style={{
              ...O, fontWeight: 600, fontSize: 10,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: `rgba(${accentRgb},0.50)`,
              marginBottom: 6,
            }}>
              Exam tip
            </div>
            <div style={{
              ...O, fontWeight: 500, fontSize: 13,
              lineHeight: 1.6,
              color: 'rgba(245,238,225,0.58)',
            }}>
              {examTip}
            </div>
          </div>
        )}

        {/* 9 ── Continue button */}
        {hasSettled && (
          <button
            onClick={onContinue}
            style={{
              marginTop: 8,
              background: 'none', border: 'none',
              ...F, fontWeight: 700, fontSize: 20,
              color: accent,
              cursor: 'pointer',
              padding: '12px 0',
              animation: 'te-fade-up 480ms cubic-bezier(0.22,1,0.36,1) 400ms both',
            }}
          >
            Continue →
          </button>
        )}

      </div>
    </div>
  )
}
