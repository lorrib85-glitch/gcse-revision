import { useState, useEffect, useRef, useMemo } from 'react'
import { SPACING } from '../../constants/spacing.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'

// ─── Ring ─────────────────────────────────────────────────────────────────────
const R_SIZE   = 96
const R_STROKE = 7
const R_RADIUS = R_SIZE / 2 - R_STROKE / 2   // 44.5
const R_CIRC   = 2 * Math.PI * R_RADIUS       // ≈ 279.6

// ─── Colour helpers ───────────────────────────────────────────────────────────
function hexToRgb(h) {
  const v = parseInt(h.replace('#', ''), 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}
function rgb(h) { return hexToRgb(h).join(',') }
function darken(h, a = 0.24) {
  const [r, g, b] = hexToRgb(h)
  return `rgb(${Math.round(r*(1-a))},${Math.round(g*(1-a))},${Math.round(b*(1-a))})`
}
function isLight(h) {
  const [r, g, b] = hexToRgb(h)
  return (0.299*r + 0.587*g + 0.114*b) / 255 > 0.55
}

// ─── Bottom nav — 4-tab RISE (mirrors App.jsx exactly) ───────────────────────
function NavIcon({ id, active }) {
  const c    = active ? '#A855F7' : '#4B5563'
  const s    = { stroke: c, fill: 'none', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' }
  const glow = active ? 'drop-shadow(0 0 6px rgba(168,85,247,0.65))' : 'none'
  const p    = { width: 22, height: 22, viewBox: '0 0 22 22', style: { display: 'block', filter: glow, transition: 'filter 220ms ease' } }
  if (id === 'home')     return <svg {...p}><path d="M3 9.5L11 3l8 6.5V19a1.5 1.5 0 01-1.5 1.5h-4V14h-5v6.5H4.5A1.5 1.5 0 013 19V9.5z" {...s}/></svg>
  if (id === 'subjects') return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" {...s}/><rect x="12" y="3" width="7" height="7" rx="1.5" {...s}/><rect x="3" y="12" width="7" height="7" rx="1.5" {...s}/><rect x="12" y="12" width="7" height="7" rx="1.5" {...s}/></svg>
  if (id === 'pulse')    return <svg {...p}><polyline points="2,13 6,13 8,6 11,18 14,10 16,13 20,13" {...s}/></svg>
  if (id === 'exams')    return <svg {...p}><rect x="4" y="2" width="14" height="18" rx="2" {...s}/><line x1="8" y1="7" x2="14" y2="7" {...s}/><line x1="8" y1="11" x2="14" y2="11" {...s}/><line x1="8" y1="15" x2="11" y2="15" {...s}/></svg>
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
      background: 'rgba(11,16,32,0.82)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(139,92,246,0.10)',
      borderRadius: 32,
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
      padding: '10px 6px calc(10px + env(safe-area-inset-bottom))',
      gap: 4,
    }}>
      {tabs.map(t => {
        const active = tab === t.id || (t.id === 'pulse' && tab === 'quickfire')
        return (
          <button key={t.id} onClick={() => setTab?.(t.id)} style={{
            border: 'none', background: active ? 'rgba(139,92,246,0.15)' : 'transparent',
            cursor: 'pointer', borderRadius: RADII.large,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: active ? 600 : 500,
            color: active ? '#C4B5FD' : '#374151',
            padding: '6px 4px 5px',
            transition: 'background 220ms ease, color 220ms ease',
          }}>
            <NavIcon id={t.id} active={active} />
            <span style={{ letterSpacing: '0.01em' }}>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ─── Particles — dust in air, not sparkles ────────────────────────────────────
function Particles({ accent }) {
  const pts = useMemo(() => Array.from({ length: 9 }, (_, i) => ({
    id: i,
    x: 6 + Math.random() * 88,
    y: 8 + Math.random() * 78,
    size: 1 + Math.random() * 0.9,
    op: 0.18 + Math.random() * 0.22,
    dur: 14 + Math.random() * 6,
    delay: -(Math.random() * 16),
  })), [])
  return <>
    {pts.map(p => (
      <div key={p.id} style={{
        position: 'absolute',
        left: `${p.x}%`, top: `${p.y}%`,
        width: `${p.size}px`, height: `${p.size}px`,
        borderRadius: '50%',
        background: accent,
        opacity: p.op,
        pointerEvents: 'none', zIndex: 0,
        animation: `ccs-drift ${p.dur}s ease-in-out ${p.delay}s infinite`,
      }}/>
    ))}
  </>
}

// ─── ChapterCompleteScreen ────────────────────────────────────────────────────
export default function ChapterCompleteScreen({
  accent           = '#9D5CFF',
  completedChapter = 'Chapter',
  nextChapterNum,
  nextChapterTitle,
  nextChapterLabel = 'Chapter',
  supportingCopy   = 'Momentum matters.',
  isFinalChapter   = false,
  moduleName,
  pastPaperLabel,
  onContinue, onQuiz, onPastPaper, onHome,
  tab = 'subjects', setTab,
}) {
  const ac           = rgb(accent)
  const accentDark   = darken(accent)
  const textOnAccent = isLight(accent) ? '#05120E' : '#F5F7FF'

  const strokeRef = useRef(null)
  const [ringDone, setRingDone] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => {
      if (!strokeRef.current) return
      strokeRef.current.style.transition = 'stroke-dashoffset 850ms cubic-bezier(0.16,1,0.3,1)'
      strokeRef.current.style.strokeDashoffset = '0'
    }, 150)
    const t2 = setTimeout(() => setRingDone(true), 1200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const base = { border: 'none', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }

  return (
    <>
      <style>{`
        @keyframes ccs-drift {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-22px); }
        }
        @keyframes ccs-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ccs-check {
          from { opacity: 0; transform: translate(-50%,-50%) scale(0.68); }
          to   { opacity: 1; transform: translate(-50%,-50%) scale(1); }
        }
        @keyframes ccs-pulse {
          0%,100% { transform: scale(1);     opacity: 1; }
          50%      { transform: scale(${MOTION.scale.subtle}); opacity: 0.88; }
        }
        .ccs-ring-pulse { animation: ccs-pulse 3500ms ease-in-out infinite; }
        .ccs-checkmark  { animation: ccs-check 360ms cubic-bezier(0.16,1,0.3,1) 620ms both; }
        .ccs-in         { animation: ccs-in ${MOTION.duration.slow} cubic-bezier(0.16,1,0.3,1) both; }
        .ccs-primary:active  { transform: scale(${MOTION.scale.press}); }
        .ccs-quiz:active     { background: rgba(255,255,255,0.07) !important; transform: scale(0.99); }
        .ccs-home-row:active { opacity: 0.45 !important; }
        .ccs-navbtn:active   { background: rgba(255,255,255,0.09) !important; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#08090D',
        color: '#F5F7FF',
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: 120,
      }}>

        {/* Radial glow — behind ring only */}
        <div style={{
          position: 'absolute',
          top: -40, left: '50%', transform: 'translateX(-50%)',
          width: 320, height: 320,
          background: `radial-gradient(circle, rgba(${ac},0.14) 0%, transparent 72%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none', zIndex: 0,
        }}/>

        <Particles accent={accent}/>

        {/* Nav buttons */}
        <div style={{
          position: 'absolute', top: 20, left: 20, right: 20,
          display: 'flex', justifyContent: 'space-between',
          zIndex: 10,
        }}>
          <button
            className="ccs-navbtn"
            aria-label="Go back"
            onClick={onHome}
            style={{
              ...base,
              width: 48, height: 48, borderRadius: RADII.pill,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 140ms ease',
            }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.78)" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>
          <button
            className="ccs-navbtn"
            aria-label="Menu"
            style={{
              ...base,
              width: 48, height: 48, borderRadius: RADII.pill,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 140ms ease',
            }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="rgba(255,255,255,0.78)">
              <circle cx="5" cy="12" r="1.5"/>
              <circle cx="12" cy="12" r="1.5"/>
              <circle cx="19" cy="12" r="1.5"/>
            </svg>
          </button>
        </div>

        {/* Central composition */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          paddingTop: 92,
          paddingLeft: SPACING.standard, paddingRight: SPACING.standard,
          maxWidth: 430, margin: '0 auto',
          position: 'relative', zIndex: 1,
        }}>

          {/* Completion ring */}
          <div
            className={`ccs-in${ringDone ? ' ccs-ring-pulse' : ''}`}
            style={{
              width: R_SIZE, height: R_SIZE,
              position: 'relative',
              marginBottom: 20,
              flexShrink: 0,
              animationDelay: '0ms',
            }}
          >
            <svg
              width={R_SIZE} height={R_SIZE}
              viewBox={`0 0 ${R_SIZE} ${R_SIZE}`}
              style={{ transform: 'rotate(-90deg)', display: 'block' }}
            >
              {/* Track */}
              <circle
                cx={R_SIZE/2} cy={R_SIZE/2} r={R_RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.10)"
                strokeWidth={R_STROKE}
              />
              {/* Progress — animates in via useEffect */}
              <circle
                ref={strokeRef}
                cx={R_SIZE/2} cy={R_SIZE/2} r={R_RADIUS}
                fill="none"
                stroke={accent}
                strokeWidth={R_STROKE}
                strokeLinecap="round"
                strokeDasharray={R_CIRC}
                strokeDashoffset={R_CIRC}
                style={{ filter: `drop-shadow(0 0 16px rgba(${ac},0.32))` }}
              />
            </svg>
            {/* Checkmark */}
            <div className="ccs-checkmark" style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%,-50%) scale(0.68)',
              opacity: 0,
            }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none"
                stroke="#F5F7FF" strokeWidth="4"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 18l7 7 13-13"/>
              </svg>
            </div>
          </div>

          {/* Heading — single h1, "Complete" in accent */}
          <h1
            className="ccs-in"
            style={{
              fontFamily: "'Sora', 'Syne', system-ui, sans-serif",
              fontWeight: 800,
              fontSize: 32,
              lineHeight: '36px',
              letterSpacing: '-0.02em',
              color: '#F5F7FF',
              textAlign: 'center',
              maxWidth: 300,
              margin: '0 0 10px',
              animationDelay: '40ms',
            }}
          >
            {completedChapter}{' '}
            <span style={{ color: accent }}>Complete</span>
          </h1>

          {/* Supporting text */}
          <p
            className="ccs-in"
            style={{
              fontFamily: "'Outfit', 'DM Sans', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: 16,
              lineHeight: '22px',
              color: 'rgba(245,247,255,0.68)',
              textAlign: 'center',
              margin: '0 0 26px',
              maxWidth: 280,
              animationDelay: '70ms',
            }}
          >
            {supportingCopy}
          </p>

          {/* ── Primary CTA ── */}
          <button
            className="ccs-primary ccs-in"
            aria-label={isFinalChapter ? 'Start exam practice' : nextChapterNum != null ? `Continue to ${nextChapterLabel} ${nextChapterNum}` : `Continue to ${nextChapterLabel}`}
            onClick={onContinue}
            style={{
              ...base,
              width: '100%',
              maxWidth: 360,
              minHeight: 88,
              borderRadius: 24,
              padding: '0 18px 0 16px',
              background: `linear-gradient(135deg, ${accent} 0%, ${accentDark} 100%)`,
              border: '1px solid rgba(255,255,255,0.14)',
              boxShadow: `0 0 22px rgba(${ac},0.18)`,
              display: 'flex',
              alignItems: 'center',
              textAlign: 'left',
              transition: 'transform 140ms ease-out, box-shadow 140ms ease-out',
              animationDelay: '120ms',
            }}
          >
            {/* Icon circle */}
            <div style={{
              width: 48, height: 48, borderRadius: RADII.pill,
              background: 'rgba(0,0,0,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke={textOnAccent} strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>

            {/* Text — no truncation */}
            <div style={{ marginLeft: 14, flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: "'Sora', 'Syne', system-ui, sans-serif",
                fontWeight: 800,
                fontSize: 22,
                lineHeight: '26px',
                color: textOnAccent,
              }}>
                {isFinalChapter
                  ? 'Start Exam Practice'
                  : nextChapterNum != null
                    ? `Continue to ${nextChapterLabel} ${nextChapterNum}`
                    : `Continue to ${nextChapterLabel}`}
              </div>
              {!isFinalChapter && nextChapterTitle && (
                <div style={{
                  fontFamily: "'Outfit', 'DM Sans', system-ui, sans-serif",
                  fontWeight: 500,
                  fontSize: 16,
                  lineHeight: '20px',
                  color: textOnAccent,
                  opacity: 0.84,
                  marginTop: 3,
                }}>
                  {nextChapterTitle}
                </div>
              )}
            </div>

            {/* Chevron */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke={textOnAccent} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0, marginLeft: 10, opacity: 0.85 }}>
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          {/* Gap */}
          <div style={{ height: 14 }}/>

          {/* ── Secondary CTA — Quick Quiz ── */}
          <button
            className="ccs-quiz ccs-in"
            aria-label="Start quick quiz"
            onClick={onQuiz}
            style={{
              ...base,
              width: '100%',
              maxWidth: 360,
              height: 72,
              borderRadius: 22,
              padding: '0 16px',
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid rgba(${ac},0.16)`,
              display: 'flex',
              alignItems: 'center',
              textAlign: 'left',
              transition: 'background 140ms ease, transform 140ms ease',
              animationDelay: '180ms',
            }}
          >
            {/* Icon circle */}
            <div style={{
              width: 44, height: 44, borderRadius: RADII.pill,
              border: `1px solid rgba(${ac},0.28)`,
              background: `rgba(${ac},0.06)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke={accent} strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5"/>
              </svg>
            </div>

            {/* Text */}
            <div style={{ marginLeft: 14, flex: 1 }}>
              <div style={{
                fontFamily: "'Sora', 'Syne', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: 20,
                lineHeight: '24px',
                color: '#F5F7FF',
              }}>Quick Quiz</div>
              <div style={{
                fontFamily: "'Outfit', 'DM Sans', system-ui, sans-serif",
                fontWeight: 500,
                fontSize: 15,
                lineHeight: '18px',
                color: 'rgba(245,247,255,0.60)',
                marginTop: 2,
              }}>
                {isFinalChapter
                  ? 'Review this module with 10 questions'
                  : 'Lock it in with 10 quick questions'}
              </div>
            </div>

            {/* Chevron */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke={accent} strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ flexShrink: 0, marginLeft: SPACING.micro }}>
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          {/* ── Past paper link — shown only when module has tagged questions ── */}
          {onPastPaper && (
            <>
              <div style={{ height: 10 }}/>
              <button
                className="ccs-quiz ccs-in"
                aria-label={pastPaperLabel || 'Practice past paper questions'}
                onClick={onPastPaper}
                style={{
                  ...base,
                  width: '100%',
                  maxWidth: 360,
                  height: 72,
                  borderRadius: 22,
                  padding: '0 16px',
                  background: 'rgba(200,155,109,0.06)',
                  border: '1px solid rgba(200,155,109,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'left',
                  transition: 'background 140ms ease, transform 140ms ease',
                  animationDelay: '210ms',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: RADII.pill,
                  border: '1px solid rgba(200,155,109,0.3)',
                  background: 'rgba(200,155,109,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="#C89B6D" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2"/>
                    <line x1="8" y1="7" x2="16" y2="7"/>
                    <line x1="8" y1="11" x2="16" y2="11"/>
                    <line x1="8" y1="15" x2="12" y2="15"/>
                  </svg>
                </div>
                <div style={{ marginLeft: 14, flex: 1 }}>
                  <div style={{
                    fontFamily: "'Sora', 'Syne', system-ui, sans-serif",
                    fontWeight: 700, fontSize: 18, lineHeight: '22px', color: '#F5F7FF',
                  }}>{pastPaperLabel || 'Past paper questions'}</div>
                  <div style={{
                    fontFamily: "'Outfit', 'DM Sans', system-ui, sans-serif",
                    fontWeight: 500, fontSize: 14, lineHeight: '18px',
                    color: 'rgba(200,155,109,0.72)', marginTop: 2,
                  }}>Real exam questions tagged to this module</div>
                </div>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="#C89B6D" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0, marginLeft: SPACING.micro }}>
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </>
          )}

          {/* ── Return Home — text only, no card ── */}
          <button
            className="ccs-home-row ccs-in"
            aria-label="Return home"
            onClick={onHome}
            style={{
              ...base,
              marginTop: 22,
              background: 'none',
              display: 'flex', alignItems: 'center', gap: SPACING.micro,
              opacity: 0.72,
              transition: 'opacity 140ms ease',
              animationDelay: '240ms',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="#F5F7FF" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span style={{
              fontFamily: "'Outfit', 'DM Sans', system-ui, sans-serif",
              fontWeight: 500,
              fontSize: 18,
              color: '#F5F7FF',
            }}>Return Home</span>
          </button>

        </div>

        <BottomNav tab={tab} setTab={setTab}/>
      </div>
    </>
  )
}
