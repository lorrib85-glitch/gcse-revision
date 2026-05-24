import { useState, useEffect, useRef, useMemo } from 'react'

// ─── Ring constants ───────────────────────────────────────────────────────────
const R_SIZE   = 138
const R_STROKE = 9
const R_RADIUS = R_SIZE / 2 - R_STROKE / 2    // 64.5
const R_CIRC   = 2 * Math.PI * R_RADIUS        // ≈ 405.2

// ─── Colour utilities ─────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const v = parseInt(hex.replace('#', ''), 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}
function rgbStr(hex) { return hexToRgb(hex).join(',') }
function darken(hex, amount = 0.26) {
  const [r, g, b] = hexToRgb(hex)
  return `rgb(${Math.round(r*(1-amount))},${Math.round(g*(1-amount))},${Math.round(b*(1-amount))})`
}
function isLight(hex) {
  const [r, g, b] = hexToRgb(hex)
  return (0.299*r + 0.587*g + 0.114*b) / 255 > 0.55
}

// ─── Bottom nav (mirrors App.jsx exactly — 4-tab RISE nav) ───────────────────
function NavIcon({ id, active }) {
  const c    = active ? '#A855F7' : '#4B5563'
  const s    = { stroke: c, fill: 'none', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const glow = active ? 'drop-shadow(0 0 6px rgba(168,85,247,0.65))' : 'none'
  const p    = { width: 22, height: 22, viewBox: '0 0 22 22', style: { display: 'block', filter: glow, transition: 'filter 220ms ease' } }
  if (id === 'home')     return <svg {...p}><path d="M3 9.5L11 3l8 6.5V19a1.5 1.5 0 01-1.5 1.5h-4V14h-5v6.5H4.5A1.5 1.5 0 013 19V9.5z" {...s} /></svg>
  if (id === 'subjects') return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" {...s} /><rect x="12" y="3" width="7" height="7" rx="1.5" {...s} /><rect x="3" y="12" width="7" height="7" rx="1.5" {...s} /><rect x="12" y="12" width="7" height="7" rx="1.5" {...s} /></svg>
  if (id === 'pulse')    return <svg {...p}><polyline points="2,13 6,13 8,6 11,18 14,10 16,13 20,13" {...s} /></svg>
  if (id === 'exams')    return <svg {...p}><rect x="4" y="2" width="14" height="18" rx="2" {...s} /><line x1="8" y1="7" x2="14" y2="7" {...s} /><line x1="8" y1="11" x2="14" y2="11" {...s} /><line x1="8" y1="15" x2="11" y2="15" {...s} /></svg>
  return null
}

function BottomNav({ tab, setTab }) {
  const tabs = [
    { id: 'home',     label: 'Home'     },
    { id: 'subjects', label: 'Subjects' },
    { id: 'pulse',    label: 'Pulse'    },
    { id: 'exams',    label: 'Exams'    },
  ]
  return (
    <div style={{
      position: 'fixed', left: '50%', bottom: 14, transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)', maxWidth: 400, zIndex: 1000,
      background: 'rgba(11,16,32,0.88)',
      backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
      border: '1px solid rgba(139,92,246,0.12)',
      borderRadius: 32,
      boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 0 32px rgba(139,92,246,0.08)',
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      padding: '10px 6px calc(10px + env(safe-area-inset-bottom))',
      gap: 4,
    }}>
      {tabs.map(t => {
        const active = tab === t.id || (t.id === 'pulse' && tab === 'quickfire')
        return (
          <button key={t.id} onClick={() => setTab?.(t.id)} style={{
            border: 'none', background: active ? 'rgba(139,92,246,0.18)' : 'transparent',
            cursor: 'pointer', borderRadius: 22,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: active ? 600 : 500,
            color: active ? '#C4B5FD' : '#374151',
            padding: '6px 4px 5px', minWidth: 0,
            transition: 'background 220ms ease, color 220ms ease',
            boxShadow: active ? '0 0 16px rgba(139,92,246,0.2)' : 'none',
          }}>
            <NavIcon id={t.id} active={active} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%', letterSpacing: '0.01em' }}>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Particles ────────────────────────────────────────────────────────────────
function Particles({ accent }) {
  const items = useMemo(() => (
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: 4 + Math.random() * 92,
      y: 4 + Math.random() * 80,
      size: 1 + Math.random() * 1,
      opacity: 0.20 + Math.random() * 0.25,
      dur: 4 + Math.random() * 6,
      delay: Math.random() * 3,
      dx: (Math.random() - 0.5) * 18,
      dy: (Math.random() - 0.5) * 18,
    }))
  ), [])

  return (
    <>
      {items.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          left: `${p.x}%`,
          top: `${p.y}%`,
          width: `${p.size}px`,
          height: `${p.size}px`,
          borderRadius: '50%',
          background: accent,
          opacity: p.opacity,
          pointerEvents: 'none',
          zIndex: 0,
          '--pdx': `${p.dx}px`,
          '--pdy': `${p.dy}px`,
          animation: `ccs-drift ${p.dur}s ease-in-out ${p.delay}s infinite`,
        }} />
      ))}
    </>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ChapterCompleteScreen({
  accent          = '#9D5CFF',
  completedChapter = 'Chapter Complete',
  nextChapterNum,
  nextChapterTitle,
  nextChapterLabel = 'Chapter',
  supportingCopy  = 'Momentum matters.',
  isFinalChapter  = false,
  moduleName,
  onContinue,
  onQuiz,
  onHome,
  tab             = 'modules',
  setTab,
}) {
  const accentDark    = darken(accent, 0.26)
  const textOnAccent  = isLight(accent) ? '#06130F' : '#F5F7FF'
  const rgb           = rgbStr(accent)

  const strokeRef = useRef(null)
  const [ringDone, setRingDone] = useState(false)

  // Animate ring stroke on mount
  useEffect(() => {
    const t1 = setTimeout(() => {
      if (strokeRef.current) {
        strokeRef.current.style.transition = `stroke-dashoffset 850ms cubic-bezier(0.16,1,0.3,1)`
        strokeRef.current.style.strokeDashoffset = '0'
      }
    }, 150)
    const t2 = setTimeout(() => setRingDone(true), 150 + 850 + 300)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const navBtnStyle = {
    width: 44, height: 44,
    borderRadius: 999,
    background: 'rgba(255,255,255,0.055)',
    border: '1px solid rgba(255,255,255,0.10)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 140ms ease-out, transform 140ms ease-out',
  }

  return (
    <>
      <style>{`
        @keyframes ccs-drift {
          0%,100% { transform: translate(0,0); }
          33%      { transform: translate(var(--pdx), var(--pdy)); }
          66%      { transform: translate(calc(var(--pdx)*-.5), calc(var(--pdy)*.7)); }
        }
        @keyframes ccs-ring-pulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%     { transform: scale(1.015); opacity: .92; }
        }
        @keyframes ccs-check-in {
          from { transform: translate(-50%,-50%) scale(.72); opacity: 0; }
          to   { transform: translate(-50%,-50%) scale(1);   opacity: 1; }
        }
        @keyframes ccs-fade-up {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ccs-ring-pulse { animation: ccs-ring-pulse 3s ease-in-out infinite; }
        .ccs-check      { animation: ccs-check-in 360ms cubic-bezier(0.16,1,0.3,1) 620ms both; }
        .ccs-enter      { animation: ccs-fade-up 480ms ease both; }
        .ccs-nav-btn:active { transform: scale(.96) !important; background: rgba(255,255,255,.08) !important; }
        .ccs-primary:active { transform: scale(.985) !important; }
        .ccs-secondary:active { transform: scale(.99) !important; background: rgba(${rgb},.075) !important; }
        .ccs-tertiary:active  { transform: scale(.99) !important; background: rgba(255,255,255,.055) !important; }
        @media (max-width: 375px) {
          .ccs-ring-wrap  { width: 122px !important; height: 122px !important; }
          .ccs-heading    { font-size: 30px !important; }
          .ccs-primary    { min-height: 96px !important; }
          .ccs-ptitle     { font-size: 21px !important; }
          .ccs-secondary  { min-height: 86px !important; }
          .ccs-page       { padding-left: 20px !important; padding-right: 20px !important; }
        }
      `}</style>

      {/* Page */}
      <div className="ccs-page" style={{
        minHeight: '100vh',
        background: '#08090D',
        color: '#F5F7FF',
        padding: '24px',
        paddingBottom: '132px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Atmospheric glow */}
        <div style={{
          position: 'absolute',
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '320px',
          height: '320px',
          background: `radial-gradient(circle, rgba(${rgb},.18) 0%, rgba(${rgb},.05) 38%, transparent 72%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <Particles accent={accent} />

        {/* Top nav */}
        <div style={{
          position: 'absolute',
          top: 24, left: 24, right: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          zIndex: 10,
        }}>
          <button
            className="ccs-nav-btn"
            aria-label="Go back"
            onClick={onHome}
            style={navBtnStyle}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,.78)" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>

          <button
            className="ccs-nav-btn"
            aria-label="Open menu"
            style={navBtnStyle}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(255,255,255,.78)">
              <circle cx="5" cy="12" r="1.5"/>
              <circle cx="12" cy="12" r="1.5"/>
              <circle cx="19" cy="12" r="1.5"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '126px',
          maxWidth: '430px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1,
        }}>

          {/* Completion ring */}
          <div
            className={`ccs-ring-wrap${ringDone ? ' ccs-ring-pulse' : ''}`}
            style={{
              width: R_SIZE, height: R_SIZE,
              position: 'relative',
              marginBottom: 28,
              flexShrink: 0,
            }}
          >
            <svg
              width={R_SIZE}
              height={R_SIZE}
              viewBox={`0 0 ${R_SIZE} ${R_SIZE}`}
              style={{ transform: 'rotate(-90deg)', display: 'block' }}
            >
              {/* Track */}
              <circle
                cx={R_SIZE/2} cy={R_SIZE/2} r={R_RADIUS}
                fill="none"
                stroke="rgba(255,255,255,.10)"
                strokeWidth={R_STROKE}
              />
              {/* Progress */}
              <circle
                ref={strokeRef}
                cx={R_SIZE/2} cy={R_SIZE/2} r={R_RADIUS}
                fill="none"
                stroke={accent}
                strokeWidth={R_STROKE}
                strokeLinecap="round"
                strokeDasharray={R_CIRC}
                strokeDashoffset={R_CIRC}
                style={{ filter: `drop-shadow(0 0 18px rgba(${rgb},.55))` }}
              />
            </svg>
            {/* Checkmark */}
            <div className="ccs-check" style={{
              position: 'absolute',
              top: '50%', left: '50%',
              transform: 'translate(-50%,-50%) scale(.72)',
              opacity: 0,
            }}>
              <svg width="54" height="54" viewBox="0 0 54 54" fill="none"
                stroke="#F5F7FF" strokeWidth="5"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 27l10 10 18-18"/>
              </svg>
            </div>
          </div>

          {/* CHAPTER COMPLETE label */}
          <p className="ccs-enter" style={{
            fontFamily: "'Outfit', 'DM Sans', system-ui, sans-serif",
            fontWeight: 600,
            fontSize: 13,
            lineHeight: '18px',
            letterSpacing: '0.22em',
            color: accent,
            textTransform: 'uppercase',
            marginBottom: 12,
            textAlign: 'center',
            animationDelay: '280ms',
          }}>
            {isFinalChapter ? 'Module Complete' : 'Chapter Complete'}
          </p>

          {/* Main heading */}
          <h1 className="ccs-heading ccs-enter" style={{
            fontFamily: "'Sora', 'Syne', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(30px, 8.5vw, 34px)',
            lineHeight: 1.12,
            letterSpacing: '-0.02em',
            color: '#F5F7FF',
            textAlign: 'center',
            maxWidth: 340,
            marginBottom: 18,
            animationDelay: '330ms',
          }}>
            {isFinalChapter
              ? `${moduleName || completedChapter} Complete`
              : completedChapter}
          </h1>

          {/* Supporting copy */}
          <p className="ccs-enter" style={{
            fontFamily: "'Outfit', 'DM Sans', system-ui, sans-serif",
            fontWeight: 500,
            fontSize: 17,
            lineHeight: '25px',
            color: 'rgba(255,255,255,.72)',
            textAlign: 'center',
            maxWidth: 310,
            marginBottom: 42,
            animationDelay: '380ms',
          }}>
            {supportingCopy}
          </p>

          {/* Action stack */}
          <div className="ccs-enter" style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            animationDelay: '430ms',
          }}>

            {/* ── Primary CTA ── */}
            <button
              className="ccs-primary"
              aria-label={isFinalChapter ? 'Start exam practice' : `Continue to next ${nextChapterLabel.toLowerCase()}`}
              onClick={onContinue}
              style={{
                width: '100%',
                minHeight: 104,
                borderRadius: 24,
                padding: '22px',
                background: `linear-gradient(135deg, ${accent} 0%, ${accentDark} 100%)`,
                border: '1px solid rgba(255,255,255,.22)',
                boxShadow: `0 0 32px rgba(${rgb},.32), inset 0 1px 0 rgba(255,255,255,.20)`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'left',
                transition: 'box-shadow 140ms ease-out, transform 140ms ease-out',
              }}
            >
              {/* Icon circle */}
              <div style={{
                width: 58, height: 58,
                borderRadius: 999,
                background: 'rgba(0,0,0,.28)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                {isFinalChapter ? (
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
                    stroke={textOnAccent} strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" style={{opacity:.9}}>
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                    <path d="M2 17l10 5 10-5"/>
                    <path d="M2 12l10 5 10-5"/>
                  </svg>
                ) : (
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none"
                    stroke={textOnAccent} strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round" style={{opacity:.9}}>
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                )}
              </div>

              {/* Text */}
              <div style={{ marginLeft: 18, flex: 1, minWidth: 0 }}>
                <div className="ccs-ptitle" style={{
                  fontFamily: "'Sora', 'Syne', system-ui, sans-serif",
                  fontWeight: 800,
                  fontSize: 24,
                  lineHeight: '28px',
                  color: textOnAccent,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {isFinalChapter
                    ? 'Start Exam Practice'
                    : `Continue to ${nextChapterLabel} ${nextChapterNum}`}
                </div>
                {!isFinalChapter && nextChapterTitle && (
                  <div style={{
                    fontFamily: "'Outfit', 'DM Sans', system-ui, sans-serif",
                    fontWeight: 500,
                    fontSize: 18,
                    lineHeight: '24px',
                    color: textOnAccent,
                    opacity: .88,
                    marginTop: 4,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {nextChapterTitle}
                  </div>
                )}
              </div>

              {/* Chevron */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke={textOnAccent} strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ opacity:.85, flexShrink:0, marginLeft:8 }}>
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>

            {/* ── Secondary CTA — Quick Quiz ── */}
            <button
              className="ccs-secondary"
              aria-label="Start quick quiz"
              onClick={onQuiz}
              style={{
                width: '100%',
                minHeight: 92,
                borderRadius: 22,
                padding: '20px 22px',
                background: 'rgba(255,255,255,.045)',
                border: `1px solid rgba(${rgb},.22)`,
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,.05)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'left',
                transition: 'background 140ms ease-out, transform 140ms ease-out',
              }}
            >
              {/* Icon circle */}
              <div style={{
                width: 54, height: 54,
                borderRadius: 999,
                border: `1px solid rgba(${rgb},.34)`,
                background: `rgba(${rgb},.08)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                  stroke={accent} strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5"/>
                </svg>
              </div>

              {/* Text */}
              <div style={{ marginLeft: 18, flex: 1 }}>
                <div style={{
                  fontFamily: "'Sora', 'Syne', system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: 22,
                  lineHeight: '26px',
                  color: '#F5F7FF',
                }}>Quick Quiz</div>
                <div style={{
                  fontFamily: "'Outfit', 'DM Sans', system-ui, sans-serif",
                  fontWeight: 500,
                  fontSize: 16,
                  lineHeight: '22px',
                  color: 'rgba(255,255,255,.60)',
                  marginTop: 2,
                }}>
                  {isFinalChapter
                    ? 'Review this module with 10 quick questions'
                    : 'Lock it in with 10 quick questions'}
                </div>
              </div>

              {/* Chevron */}
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                stroke={accent} strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ flexShrink:0, marginLeft:8 }}>
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>

            {/* ── Tertiary CTA — Return Home ── */}
            <button
              className="ccs-tertiary"
              aria-label="Return home"
              onClick={onHome}
              style={{
                width: '100%',
                height: 72,
                borderRadius: 20,
                background: 'rgba(255,255,255,.035)',
                border: '1px solid rgba(255,255,255,.08)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                transition: 'background 140ms ease-out, transform 140ms ease-out',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke={accent} strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ opacity:.85 }}>
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span style={{
                fontFamily: "'Sora', 'Syne', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 20,
                color: 'rgba(255,255,255,.86)',
              }}>Return Home</span>
            </button>

          </div>
        </div>

        {/* Bottom nav — always Modules active, always purple glow */}
        <BottomNav tab={tab} setTab={setTab} />
      </div>
    </>
  )
}
