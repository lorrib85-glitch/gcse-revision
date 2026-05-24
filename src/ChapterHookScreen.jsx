import { useState } from 'react'

// ─── Subject → background image ──────────────────────────────────────────────
const IMAGES = {
  History:   '/history-truefalse.png',
  Biology:   '/biology-truefalse.png',
  Maths:     '/maths-truefalse.png',
  Sociology: '/sociology-truefalse.png',
  Chemistry: '/chemistry-truefalse.png',
  Physics:   '/physics-truefalse.png',
  English:   '/english-truefalse.png',
  Music:     '/music-truefalse.png',
}

// ─── Subject palette — accent + ambient glow RGB ──────────────────────────────
const PALETTES = {
  History:   { accent: '#D4A84B', rgb: '212,168,75'  },
  Biology:   { accent: '#38D27A', rgb: '56,210,122'  },
  Maths:     { accent: '#2BBE9A', rgb: '43,190,154'  },
  Sociology: { accent: '#C9B07C', rgb: '154,123,79'  },
  Chemistry: { accent: '#5CC8FF', rgb: '92,200,255'  },
  Physics:   { accent: '#5DA9E9', rgb: '93,169,233'  },
  English:   { accent: '#9E3D52', rgb: '158,61,82'   },
  Music:     { accent: '#C778DD', rgb: '199,120,221' },
}

// ─── Render statement with accent-coloured phrases ───────────────────────────
function renderWithAccent(text, accentWords, accentColor) {
  if (!accentWords?.length) return text
  const sorted  = [...accentWords].sort((a, b) => b.length - a.length)
  const escaped = sorted.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const regex   = new RegExp(`(${escaped.join('|')})`, 'gi')
  return text.split(regex).map((part, i) => {
    const hit = sorted.some(w => part.toLowerCase() === w.toLowerCase())
    return hit
      ? <span key={i} style={{ color: accentColor }}>{part}</span>
      : <span key={i}>{part}</span>
  })
}

// ─── ChapterHookScreen ────────────────────────────────────────────────────────
export default function ChapterHookScreen({
  subject      = 'History',
  chapterNum   = 1,
  chapterTitle = '',
  statement    = '',
  isTrue       = false,
  accentWords  = [],
  explanation  = '',
  onBack,
  onContinue,
}) {
  const img     = IMAGES[subject]   || IMAGES.History
  const palette = PALETTES[subject] || PALETTES.History
  const { accent, rgb } = palette

  const [chosen,      setChosen]      = useState(null)   // null | 'true' | 'false'
  const [shakeTarget, setShakeTarget] = useState(null)   // 'true' | 'false' | null
  const [revealed,    setRevealed]    = useState(false)

  function choose(tappedTrue) {
    if (chosen !== null) return
    const key     = tappedTrue ? 'true' : 'false'
    const correct = tappedTrue === isTrue
    setChosen(key)
    if (!correct) {
      setShakeTarget(key)
      setTimeout(() => setShakeTarget(null), 300)
    }
    setTimeout(() => setRevealed(true), correct ? 280 : 460)
  }

  const answered       = chosen !== null
  const trueIsCorrect  = isTrue
  const falseIsCorrect = !isTrue

  function trueOpacity()  { return !answered ? 1    : trueIsCorrect  ? 1    : 0.26 }
  function falseOpacity() { return !answered ? 0.74 : falseIsCorrect ? 1    : 0.26 }
  function falseColor()   { return answered && falseIsCorrect ? accent : 'rgba(255,255,255,0.74)' }
  function trueGlow()     { return !answered || trueIsCorrect  ? `0 0 18px rgba(${rgb},${answered && trueIsCorrect  ? 0.55 : 0.28})` : 'none' }
  function falseGlow()    { return answered  && falseIsCorrect ? `0 0 18px rgba(${rgb},0.55)` : 'none' }

  return (
    <>
      <style>{`
        @keyframes chs-entry {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0px); }
        }
        @keyframes chs-btns {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes chs-explain {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0px); }
        }
        @keyframes chs-continue {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0px); }
        }
        @keyframes chs-shake {
          0%,100% { transform: translateX(0); }
          20%  { transform: translateX(-4px); }
          40%  { transform: translateX(4px); }
          60%  { transform: translateX(-3px); }
          80%  { transform: translateX(2px); }
        }
        .chs-back:active   { background: rgba(255,255,255,0.10) !important; }
        .chs-btn:active    { transform: scale(0.98); }
        .chs-cont:active   { opacity: 0.6 !important; }
      `}</style>

      {/* ── Root ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: '#08090D',
        overflow: 'auto',
      }}>

        {/* Background image — felt, not seen */}
        <div style={{
          position: 'fixed', inset: 0,
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          opacity: 0.21,
          filter: 'grayscale(10%) brightness(0.65)',
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        {/* Left-side darkening gradient — mandatory */}
        <div style={{
          position: 'fixed', inset: 0,
          background: 'linear-gradient(90deg, rgba(8,9,13,0.94) 0%, rgba(8,9,13,0.78) 38%, rgba(8,9,13,0.42) 68%, rgba(8,9,13,0.16) 100%)',
          pointerEvents: 'none', zIndex: 2,
        }} />

        {/* Bottom fade — button legibility */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, height: 220,
          background: 'linear-gradient(0deg, rgba(8,9,13,0.97) 0%, transparent 100%)',
          pointerEvents: 'none', zIndex: 3,
        }} />

        {/* ── All visible content — above overlays ── */}
        <div style={{ position: 'relative', zIndex: 4, minHeight: '100dvh' }}>

          {/* Back button */}
          <button
            className="chs-back"
            onClick={onBack}
            aria-label="Go back"
            style={{
              position: 'absolute', top: 22, left: 18,
              width: 46, height: 46, borderRadius: 999,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 140ms ease',
            }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.78)" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>

          {/* Chapter label */}
          <div style={{
            position: 'absolute', top: 106, left: 28,
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 600, fontSize: 12,
            textTransform: 'uppercase', letterSpacing: '0.28em',
            color: accent, opacity: 0.92,
          }}>
            Chapter {chapterNum}
          </div>

          {/* Chapter title */}
          <div style={{
            position: 'absolute', top: 130, left: 28, right: 36,
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800, fontSize: 34,
            lineHeight: '38px', letterSpacing: '-0.03em',
            color: '#FFFFFF',
          }}>
            {chapterTitle}
          </div>

          {/* ── Statement block — the hero ── */}
          <div style={{
            position: 'absolute',
            top: '38%', left: 28, right: 28,
            transition: 'transform 420ms cubic-bezier(0.16,1,0.3,1)',
            transform: revealed ? 'translateY(-18px)' : 'translateY(0px)',
            animation: 'chs-entry 520ms cubic-bezier(0.16,1,0.3,1) both',
          }}>
            {/* Ambient glow — one only */}
            <div style={{
              position: 'absolute',
              top: '30%', left: '25%',
              transform: 'translate(-50%, -50%)',
              width: 280, height: 280,
              background: `radial-gradient(circle, rgba(${rgb},0.18) 0%, transparent 70%)`,
              filter: 'blur(110px)',
              pointerEvents: 'none',
            }} />

            {/* Statement */}
            <div style={{
              position: 'relative',
              maxWidth: 320,
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: 'clamp(34px, 11vw, 46px)',
              lineHeight: 'clamp(38px, 12.4vw, 50px)',
              letterSpacing: '-0.05em',
              color: '#FFFFFF',
              marginBottom: revealed ? 26 : 0,
            }}>
              {renderWithAccent(statement, accentWords, accent)}
            </div>

            {/* Explanation — fades in after answer, no card, no box */}
            {revealed && (
              <div style={{
                maxWidth: 300,
                animation: 'chs-explain 380ms cubic-bezier(0.16,1,0.3,1) 80ms both',
              }}>
                <div style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 500, fontSize: 18,
                  lineHeight: '29px',
                  color: 'rgba(255,255,255,0.84)',
                }}>
                  <span style={{ fontWeight: 700, color: '#FFFFFF' }}>
                    {isTrue ? 'TRUE.' : 'FALSE.'}
                  </span>
                  {' '}{explanation}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── What do you think? / Continue CTA ── */}
        <div style={{
          position: 'fixed', bottom: 128, left: 28,
          zIndex: 10,
          height: 30, display: 'flex', alignItems: 'center',
        }}>
          {!revealed ? (
            <div style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 500, fontSize: 15,
              color: 'rgba(255,255,255,0.28)',
              letterSpacing: '0.03em',
              transition: 'opacity 200ms ease',
              opacity: answered ? 0 : 1,
            }}>
              What do you think?
            </div>
          ) : (
            <button
              className="chs-cont"
              onClick={onContinue}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700, fontSize: 22,
                color: accent,
                transition: 'opacity 140ms ease',
                animation: 'chs-continue 280ms cubic-bezier(0.16,1,0.3,1) 200ms both',
              }}>
              Continue →
            </button>
          )}
        </div>

        {/* ── TRUE / FALSE controls ── */}
        <div style={{
          position: 'fixed', bottom: 72, left: 0, right: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 20, zIndex: 10,
          animation: 'chs-btns 400ms ease 180ms both',
        }}>

          {/* TRUE */}
          <button
            className="chs-btn"
            onClick={() => choose(true)}
            disabled={answered}
            style={{
              background: 'none', border: 'none',
              cursor: answered ? 'default' : 'pointer',
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700, fontSize: 24,
              textTransform: 'uppercase', letterSpacing: '0.18em',
              color: accent,
              opacity: trueOpacity(),
              textShadow: trueGlow(),
              borderBottom: `1.5px solid ${answered && trueIsCorrect ? accent : 'rgba(255,255,255,0.18)'}`,
              paddingBottom: 2,
              transition: 'opacity 300ms ease, border-color 300ms ease, text-shadow 300ms ease',
              animation: shakeTarget === 'true' ? 'chs-shake 220ms ease' : 'none',
            }}>
            TRUE
          </button>

          {/* Divider */}
          <div style={{
            width: 1, height: 28, flexShrink: 0,
            background: 'rgba(255,255,255,0.14)',
          }} />

          {/* FALSE */}
          <button
            className="chs-btn"
            onClick={() => choose(false)}
            disabled={answered}
            style={{
              background: 'none', border: 'none',
              cursor: answered ? 'default' : 'pointer',
              fontFamily: "'Sora', sans-serif",
              fontWeight: 700, fontSize: 24,
              textTransform: 'uppercase', letterSpacing: '0.18em',
              color: falseColor(),
              opacity: falseOpacity(),
              textShadow: falseGlow(),
              borderBottom: `1.5px solid ${answered && falseIsCorrect ? accent : 'rgba(255,255,255,0.09)'}`,
              paddingBottom: 2,
              transition: 'opacity 300ms ease, color 300ms ease, border-color 300ms ease, text-shadow 300ms ease',
              animation: shakeTarget === 'false' ? 'chs-shake 220ms ease' : 'none',
            }}>
            FALSE
          </button>
        </div>
      </div>
    </>
  )
}
