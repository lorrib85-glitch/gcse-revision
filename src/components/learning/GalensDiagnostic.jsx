import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import { TYPE } from '../../constants/typography.js'

const SUBJECT_BACKING_IMAGES = {
  History:   '/headers/history-medicine-through-time.webp',
  Biology:   '/headers/bio-main.webp',
  Chemistry: '/headers/chem-reactions.webp',
  English:   '/headers/english-main.webp',
  Maths:     '/headers/maths-main.webp',
  Physics:   '/headers/physics-main.webp',
  Sociology: '/headers/sociology-main.webp',
}

let _gdStyled = false
function ensureStyles() {
  if (_gdStyled) return
  _gdStyled = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes gd-fade-up {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes gd-scale-in {
      from { opacity: 0; transform: scale(0.88); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes gd-spin {
      to { transform: rotate(360deg); }
    }
    @keyframes gd-item-in {
      from { opacity: 0; transform: translateX(-10px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes gd-pill-rise {
      0%   { opacity: 1; transform: translateY(0) scale(1); }
      65%  { opacity: 0.6; transform: translateY(-36px) scale(0.88); }
      100% { opacity: 0; transform: translateY(-64px) scale(0.6); }
    }
    @keyframes gd-pulse-glow {
      0%, 100% { filter: drop-shadow(0 0 8px rgba(212,168,85,0.35)); }
      50%       { filter: drop-shadow(0 0 22px rgba(212,168,85,0.72)); }
    }
    @keyframes gd-word-in {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes gd-text-reveal {
      from { opacity: 0; transform: scale(0.93) translateY(8px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
  `
  document.head.appendChild(el)
}

function computeDiagnosis(selectedIds, allSymptoms) {
  const totals = { hot: 0, cold: 0, wet: 0, dry: 0 }
  selectedIds.forEach(id => {
    const sym = allSymptoms.find(s => s.id === id)
    if (!sym) return
    Object.entries(sym.qualities || {}).forEach(([q, v]) => { totals[q] += v })
  })
  const tempQ  = totals.hot  >= totals.cold ? 'hot'  : 'cold'
  const moistQ = totals.wet  >= totals.dry  ? 'wet'  : 'dry'
  return { dominant: [tempQ, moistQ], key: `${tempQ}-${moistQ}` }
}

const NEEDLE_ANGLES = { 'hot-dry': 315, 'hot-wet': 45, 'cold-wet': 135, 'cold-dry': 225 }
const OPPOSITE      = { hot: 'cold', cold: 'hot', wet: 'dry', dry: 'wet' }

const CARDINALS = [
  { q: 'hot',  icon: '☀',  px: 0,      py: -0.672, anchor: 'middle', iy: -0.070, ty: 0.072 },
  { q: 'wet',  icon: '〜', px: 0.672,  py:  0,     anchor: 'start',  iy: -0.072, ty: 0.072 },
  { q: 'cold', icon: '❄',  px: 0,      py:  0.672, anchor: 'middle', iy: -0.072, ty: 0.072 },
  { q: 'dry',  icon: '✦',  px: -0.672, py:  0,     anchor: 'end',    iy: -0.072, ty: 0.072 },
]

function AstrolabeInstrument({ spinning, needleDeg }) {
  return (
    <svg
      viewBox="-1.1 -1.1 2.2 2.2"
      style={{
        width: 'min(72vw, 288px)',
        height: 'min(72vw, 288px)',
        display: 'block',
        overflow: 'visible',
        animation: 'gd-pulse-glow 3s ease-in-out infinite',
      }}
    >
      <defs>
        <linearGradient id="gd-rim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#D4A855" />
          <stop offset="28%"  stopColor="#8B6B30" />
          <stop offset="62%"  stopColor="#C09040" />
          <stop offset="100%" stopColor="#6A4E1A" />
        </linearGradient>
        <radialGradient id="gd-medallion" cx="45%" cy="38%" r="65%">
          <stop offset="0%"   stopColor="#5C3E1C" />
          <stop offset="100%" stopColor="#221408" />
        </radialGradient>
        <radialGradient id="gd-bg" cx="50%" cy="50%" r="55%">
          <stop offset="0%"   stopColor="#261608" />
          <stop offset="100%" stopColor="#1A0E04" />
        </radialGradient>
      </defs>

      {/* Background */}
      <circle cx={0} cy={0} r={1.02} fill="url(#gd-bg)" />

      {/* Bronze outer rim */}
      <circle cx={0} cy={0} r={0.97} fill="none" stroke="url(#gd-rim)" strokeWidth="0.07" />

      {/* Outer tick marks */}
      {Array.from({ length: 32 }, (_, i) => {
        const angle      = (i / 32) * 2 * Math.PI - Math.PI / 2
        const isCardinal = i % 8 === 0
        const r0 = isCardinal ? 0.84 : 0.87
        const cos = Math.cos(angle), sin = Math.sin(angle)
        return (
          <line key={i}
            x1={cos * r0}   y1={sin * r0}
            x2={cos * 0.92} y2={sin * 0.92}
            stroke={isCardinal ? 'rgba(212,168,85,0.58)' : 'rgba(212,168,85,0.26)'}
            strokeWidth={isCardinal ? 0.013 : 0.007}
          />
        )
      })}

      {/* Middle ring */}
      <circle cx={0} cy={0} r={0.82} fill="none" stroke="rgba(139,107,53,0.30)" strokeWidth="0.013" />

      {/* Cardinal quality labels — text only, no fills */}
      {CARDINALS.map(({ q, icon, px, py, anchor, iy, ty }) => (
        <g key={q}>
          <text
            x={px} y={py + iy}
            textAnchor={anchor} dominantBaseline="middle"
            fontSize="0.090" fontFamily="Sora, sans-serif"
            fill="rgba(245,238,225,0.50)"
          >
            {icon}
          </text>
          <text
            x={px} y={py + ty}
            textAnchor={anchor} dominantBaseline="middle"
            fontSize="0.078" fontFamily="Sora, sans-serif" fontWeight="700"
            letterSpacing="0.055"
            fill="rgba(245,238,225,0.40)"
          >
            {q.toUpperCase()}
          </text>
        </g>
      ))}

      {/* Inner rotating ring */}
      <g style={spinning ? {
        animation: 'gd-spin 5s linear infinite',
        transformBox: 'view-box',
        transformOrigin: 'center',
      } : {}}>
        <circle cx={0} cy={0} r={0.56} fill="none" stroke="rgba(212,168,85,0.18)" strokeWidth="0.018" />
        {[0, 90, 180, 270].map(deg => {
          const rad = (deg - 90) * Math.PI / 180
          return (
            <circle
              key={deg}
              cx={Math.cos(rad) * 0.56}
              cy={Math.sin(rad) * 0.56}
              r={0.027}
              fill="rgba(212,168,85,0.50)"
            />
          )
        })}
      </g>

      {/* Inner accent ring */}
      <circle cx={0} cy={0} r={0.44} fill="none" stroke="rgba(139,107,53,0.24)" strokeWidth="0.010" />

      {/* Needle — transitions to diagnosis angle on beat 3 */}
      <g style={{
        transform: `rotate(${needleDeg}deg)`,
        transformBox: 'view-box',
        transformOrigin: 'center',
        transition: 'transform 900ms cubic-bezier(0.22,1,0.36,1)',
      }}>
        <polygon
          points="0,-0.475 0.028,0.095 -0.028,0.095"
          fill="#D4A855"
          opacity="0.90"
        />
        <circle cy={0.145} r={0.046} fill="#3A2510" stroke="rgba(180,130,60,0.60)" strokeWidth="0.014" />
      </g>

      {/* Central medallion */}
      <circle cx={0} cy={0} r={0.175} fill="url(#gd-medallion)" />
      <circle cx={0} cy={0} r={0.175} fill="none" stroke="rgba(180,130,60,0.70)" strokeWidth="0.020" />
      <text
        x={0} y={0.006}
        textAnchor="middle" dominantBaseline="middle"
        fontSize="0.076" fontFamily="Sora, sans-serif" fontWeight="700"
        letterSpacing="0.04"
        fill="rgba(212,168,85,0.70)"
      >
        G
      </text>
    </svg>
  )
}

export default function GalensDiagnostic({ block, subject, onContinue }) {
  ensureStyles()

  const theme     = SUBJECTS[subject] || SUBJECTS.History
  const accent    = theme.accent
  const accentRgb = theme.accentRgb
  const bg        = theme.background || SUBJECTS.History.background

  const {
    symptomsLabel   = "Choose the patient's symptoms",
    symptoms        = [],
    qualityMeta     = {},
    treatments      = {},
    theoryPrinciple = 'Restore balance — treat with the opposite quality.',
    explanation     = '',
    examTip         = null,
  } = block

  const [beat,      setBeat]      = useState(0)
  const [selected,  setSelected]  = useState(new Set())
  const [diagnosis, setDiagnosis] = useState(null)
  const [needleDeg, setNeedleDeg] = useState(0)
  const [spinning,  setSpinning]  = useState(false)

  function advance() { setBeat(b => b + 1) }

  // Beat 1 → auto-advance after pills dissolve
  useEffect(() => {
    if (beat !== 1) return
    const delay = Math.max(selected.size * 180 + 480, 900)
    const tid = setTimeout(advance, delay)
    return () => clearTimeout(tid)
  }, [beat])

  // Beat 2 → spin then auto-advance
  useEffect(() => {
    if (beat !== 2) return
    setSpinning(true)
    const tid = setTimeout(() => { setSpinning(false); advance() }, 2800)
    return () => clearTimeout(tid)
  }, [beat])

  // Beat 3 → delay needle swing so viewer reads the diagnosis text first
  useEffect(() => {
    if (beat !== 3 || !diagnosis) return
    const tid = setTimeout(() => {
      setNeedleDeg(NEEDLE_ANGLES[diagnosis.key] ?? 0)
    }, 500)
    return () => clearTimeout(tid)
  }, [beat, diagnosis])

  function toggleSymptom(id) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleSymptomContinue() {
    const d = computeDiagnosis([...selected], symptoms)
    setDiagnosis(d)
    advance()
  }

  const selectedArr   = symptoms.filter(s => selected.has(s.id))
  const treatmentData = diagnosis ? (treatments[diagnosis.key] ?? null) : null
  const prescription  = diagnosis ? diagnosis.dominant.map(q => OPPOSITE[q]) : []

  const O    = { fontFamily: "'Sora', sans-serif" }
  const F    = { fontFamily: "'Sora', sans-serif" }
  const CG   = { fontFamily: "'IBM Plex Serif', Georgia, serif" }
  const ease = 'cubic-bezier(0.22,1,0.36,1)'

  // ── Beat 0: Symptom checklist ───────────────────────────────────────────────
  if (beat === 0) return (
    <div style={{ position: 'fixed', inset: 0, background: bg, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0,
        backgroundImage: `url(${SUBJECT_BACKING_IMAGES[subject] || SUBJECT_BACKING_IMAGES.History})`,
        backgroundSize: 'cover', backgroundPosition: 'center top',
        opacity: 0.18, filter: 'saturate(0.4) brightness(0.7)',
      }} />
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0,
        background: 'linear-gradient(to bottom, rgba(15,11,7,0.65) 0%, rgba(15,11,7,0.50) 100%)',
      }} />
      <div style={{ padding: '96px 24px 80px', maxWidth: 440, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <div style={{
          ...O, fontWeight: 600, fontSize: 10,
          letterSpacing: '0.20em', textTransform: 'uppercase',
          color: `rgba(${accentRgb},0.50)`,
          marginBottom: 22,
          animation: `gd-fade-up 360ms ${ease} both`,
        }}>
          {symptomsLabel}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 10px', marginBottom: 36 }}>
          {symptoms.map((sym, i) => {
            const on = selected.has(sym.id)
            return (
              <button
                key={sym.id}
                onClick={() => toggleSymptom(sym.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: on ? `rgba(${accentRgb},0.10)` : 'rgba(245,238,225,0.04)',
                  border: `1px solid ${on ? `rgba(${accentRgb},0.45)` : 'rgba(245,238,225,0.09)'}`,
                  borderRadius: 10,
                  padding: '12px 16px',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                  animation: `gd-item-in 320ms ${ease} ${i * 65}ms both`,
                  transition: 'background 160ms, border-color 160ms',
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${on ? accent : 'rgba(245,238,225,0.20)'}`,
                  background: on ? accent : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 150ms',
                }}>
                  {on && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.8 7L9 1" stroke={SUBJECTS.History.background} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{
                  ...O, fontWeight: on ? 600 : 500, fontSize: 15,
                  color: on ? 'rgba(245,238,225,0.95)' : 'rgba(245,238,225,0.62)',
                  transition: 'color 150ms',
                }}>
                  {sym.label}
                </span>
              </button>
            )
          })}
        </div>

        <button
          onClick={handleSymptomContinue}
          disabled={selected.size === 0}
          style={{
            ...F, fontWeight: 700, fontSize: 17,
            color: selected.size > 0 ? accent : 'rgba(245,238,225,0.20)',
            background: 'none', border: 'none', padding: '10px 0',
            cursor: selected.size > 0 ? 'pointer' : 'default',
            transition: 'color 220ms',
            animation: `gd-fade-up 360ms ${ease} 380ms both`,
          }}
        >
          Analyse symptoms →
        </button>
      </div>
    </div>
  )

  // ── Beat 1: Tokens enter the instrument ────────────────────────────────────
  if (beat === 1) return (
    <div style={{
      position: 'fixed', inset: 0, background: bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 20,
    }}>
      <div style={{ animation: `gd-scale-in 480ms ${ease} both` }}>
        <AstrolabeInstrument spinning={false} needleDeg={0} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, maxWidth: 300 }}>
        {selectedArr.map((sym, i) => (
          <span key={sym.id} style={{
            ...O, fontWeight: 600, fontSize: 13,
            color: `rgba(${accentRgb},0.88)`,
            background: `rgba(${accentRgb},0.10)`,
            border: `1px solid rgba(${accentRgb},0.28)`,
            borderRadius: 20, padding: '5px 14px',
            animation: `gd-pill-rise 760ms ${ease} ${i * 155}ms both`,
            display: 'inline-block',
          }}>
            {sym.label}
          </span>
        ))}
      </div>
    </div>
  )

  // ── Beat 2: Analysing ───────────────────────────────────────────────────────
  if (beat === 2) {
    const words = 'Analysing the balance of hot, cold, dry and wet…'.split(' ')
    return (
      <div style={{
        position: 'fixed', inset: 0, background: bg,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 26,
      }}>
        <AstrolabeInstrument spinning={spinning} needleDeg={0} />
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 6px', maxWidth: 270 }}>
          {words.map((word, i) => (
            <span key={i} style={{
              ...O, fontWeight: 500, fontSize: 14,
              color: 'rgba(245,238,225,0.44)',
              animation: `gd-word-in 320ms ${ease} ${260 + i * 55}ms both`,
              display: 'inline-block',
            }}>
              {word}
            </span>
          ))}
        </div>
      </div>
    )
  }

  // ── Beat 3: Diagnosis revealed ──────────────────────────────────────────────
  if (beat === 3 && diagnosis) return (
    <div style={{ position: 'fixed', inset: 0, background: bg, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ padding: '64px 24px 72px', maxWidth: 440, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        <div style={{ animation: `gd-scale-in 380ms ${ease} both` }}>
          <AstrolabeInstrument spinning={false} needleDeg={needleDeg} />
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, marginTop: 26,
          animation: `gd-text-reveal 480ms ${ease} 560ms both`,
        }}>
          {diagnosis.dominant.map((q, i) => (
            <span key={q} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{
                ...CG, fontWeight: 700,
                fontSize: 'clamp(30px,9vw,44px)',
                color: accent, letterSpacing: '-0.01em',
              }}>
                {qualityMeta[q]?.label || q.toUpperCase()}
              </span>
              {i < diagnosis.dominant.length - 1 && (
                <span style={{ color: 'rgba(245,238,225,0.24)', fontSize: 22 }}>+</span>
              )}
            </span>
          ))}
        </div>

        <div style={{
          ...O, fontWeight: 500, fontSize: 14,
          color: 'rgba(245,238,225,0.44)',
          textAlign: 'center', marginTop: 11, lineHeight: 1.55,
          animation: `gd-fade-up 380ms ${ease} 880ms both`,
        }}>
          The patient's illness is caused by an excess of{' '}
          {diagnosis.dominant.map(q => qualityMeta[q]?.label || q.toUpperCase()).join(' and ')}.
        </div>

        <button
          onClick={advance}
          style={{
            marginTop: 30, ...F, fontWeight: 700, fontSize: 17,
            color: accent, background: 'none', border: 'none',
            cursor: 'pointer', padding: '10px 0',
            animation: `gd-fade-up 360ms ${ease} 1150ms both`,
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  )

  // ── Beat 4: Theory of Opposites ─────────────────────────────────────────────
  if (beat === 4 && diagnosis) return (
    <div style={{ position: 'fixed', inset: 0, background: bg, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ padding: '88px 24px 72px', maxWidth: 440, margin: '0 auto' }}>

        <div style={{
          ...O, fontWeight: 600, fontSize: 10,
          letterSpacing: '0.20em', textTransform: 'uppercase',
          color: `rgba(${accentRgb},0.50)`,
          marginBottom: 30,
          animation: `gd-fade-up 360ms ${ease} both`,
        }}>
          Galen's Theory of Opposites
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center', gap: '0 12px', marginBottom: 28,
          animation: `gd-scale-in 460ms ${ease} 80ms both`,
        }}>
          <div>
            <div style={{
              ...O, fontWeight: 600, fontSize: 10,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgba(245,238,225,0.30)', marginBottom: 10,
            }}>
              The body has
            </div>
            {diagnosis.dominant.map(q => (
              <div key={q} style={{
                ...CG, fontWeight: 700,
                fontSize: 'clamp(20px,6.5vw,28px)',
                color: 'rgba(245,238,225,0.70)',
                letterSpacing: '-0.01em', lineHeight: 1.25, marginBottom: 3,
              }}>
                {qualityMeta[q]?.icon || ''} {qualityMeta[q]?.label || q.toUpperCase()}
              </div>
            ))}
          </div>

          <div style={{ ...F, fontSize: 20, color: `rgba(${accentRgb},0.48)` }}>→</div>

          <div>
            <div style={{
              ...O, fontWeight: 600, fontSize: 10,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgba(245,238,225,0.30)', marginBottom: 10,
            }}>
              Treat with
            </div>
            {prescription.map(q => (
              <div key={q} style={{
                ...CG, fontWeight: 700,
                fontSize: 'clamp(20px,6.5vw,28px)',
                color: accent,
                letterSpacing: '-0.01em', lineHeight: 1.25, marginBottom: 3,
              }}>
                {qualityMeta[q]?.icon || ''} {qualityMeta[q]?.label || q.toUpperCase()}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          ...O, fontWeight: 500, fontSize: 14, fontStyle: 'italic',
          color: 'rgba(245,238,225,0.44)', lineHeight: 1.65, marginBottom: 36,
          animation: `gd-fade-up 360ms ${ease} 200ms both`,
        }}>
          {theoryPrinciple}
        </div>

        <button
          onClick={advance}
          style={{
            ...F, fontWeight: 700, fontSize: 17,
            color: accent, background: 'none', border: 'none',
            cursor: 'pointer', padding: '10px 0',
            animation: `gd-fade-up 360ms ${ease} 300ms both`,
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  )

  // ── Beat 5: Treatment plan ──────────────────────────────────────────────────
  if (beat === 5 && treatmentData) return (
    <>
    <img
      src="/figures/history/medicine/medieval/ancient-authorities-back-to-back.webp"
      alt="" aria-hidden="true"
      style={{
        position: 'fixed', right: 0, bottom: 0,
        height: '55%', width: 'auto',
        opacity: 0.13, filter: 'grayscale(1)',
        pointerEvents: 'none', userSelect: 'none', zIndex: 0,
      }}
    />
    <div style={{ position: 'fixed', inset: 0, background: bg, overflowY: 'auto', WebkitOverflowScrolling: 'touch', zIndex: 1 }}>
      <div style={{ padding: '88px 24px 80px', maxWidth: 440, margin: '0 auto', position: 'relative', zIndex: 1 }}>

        <div style={{
          ...O, fontWeight: 600, fontSize: 10,
          letterSpacing: '0.20em', textTransform: 'uppercase',
          color: `rgba(${accentRgb},0.50)`, marginBottom: 14,
          animation: `gd-fade-up 360ms ${ease} both`,
        }}>
          Galen prescribes
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24,
          animation: `gd-scale-in 400ms ${ease} 60ms both`,
        }}>
          {prescription.map((q, i) => (
            <span key={q} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{
                ...CG, fontWeight: 700,
                fontSize: 'clamp(24px,7.5vw,32px)',
                color: accent, letterSpacing: '-0.01em',
              }}>
                {qualityMeta[q]?.icon || ''} {qualityMeta[q]?.label || q.toUpperCase()}
              </span>
              {i < prescription.length - 1 && (
                <span style={{ color: 'rgba(245,238,225,0.22)', fontSize: 20 }}>+</span>
              )}
            </span>
          ))}
        </div>

        <div style={{ width: '100%', marginBottom: 24 }}>
          {treatmentData.items.map((item, i) => (
            <div key={i} style={{
              padding: '12px 0',
              borderBottom: i < treatmentData.items.length - 1
                ? '1px solid rgba(245,238,225,0.06)' : 'none',
              animation: `gd-fade-up 320ms ${ease} ${110 + i * 65}ms both`,
            }}>
              <div style={{ ...F, fontWeight: 600, fontSize: 14, color: 'rgba(245,238,225,0.88)', marginBottom: 2 }}>
                {item.title}
              </div>
              <div style={{ ...O, fontWeight: 400, fontSize: 13, color: 'rgba(245,238,225,0.42)', lineHeight: 1.55 }}>
                {item.detail}
              </div>
            </div>
          ))}
        </div>

        {explanation && (
          <div style={{
            background: `rgba(${accentRgb},0.05)`,
            border: `1px solid rgba(${accentRgb},0.14)`,
            borderRadius: 12, padding: '15px 16px', marginBottom: 12,
            animation: `gd-fade-up 360ms ${ease} 300ms both`,
          }}>
            <div style={{
              ...O, fontWeight: 600, fontSize: 10,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: `rgba(${accentRgb},0.50)`, marginBottom: 7,
            }}>
              Why?
            </div>
            <div style={{ ...O, fontWeight: 500, fontSize: 14, lineHeight: 1.65, color: 'rgba(245,238,225,0.58)' }}>
              {explanation}
            </div>
          </div>
        )}

        {examTip && (
          <div style={{
            background: `rgba(${accentRgb},0.06)`,
            border: `1px solid rgba(${accentRgb},0.22)`,
            borderRadius: 12, padding: '14px 16px', marginBottom: 12,
            animation: `gd-fade-up 360ms ${ease} 380ms both`,
          }}>
            <div style={{
              ...O, fontWeight: 600, fontSize: 10,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: `rgba(${accentRgb},0.50)`, marginBottom: 6,
            }}>
              Exam tip
            </div>
            <div style={{ ...O, fontWeight: 500, fontSize: 13, lineHeight: 1.6, color: 'rgba(245,238,225,0.58)' }}>
              {examTip}
            </div>
          </div>
        )}

        <ContinueCTA
          onClick={onContinue}
          accent={accent}
          style={{ marginTop: 12, animation: `gd-fade-up 360ms ${ease} 460ms both` }}
        />
      </div>
    </div>
    </>
  )

  return null
}
