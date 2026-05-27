import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'

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

// ─── Map which word indices belong to accent phrases ──────────────────────────
function buildAccentSet(words, accentWords) {
  const result = new Set()
  if (!accentWords?.length) return result
  const strip = w => w.replace(/[.,!?;:'""“”‘’]/g, '').toLowerCase()
  for (const phrase of accentWords) {
    const pw = phrase.split(/\s+/).map(strip)
    for (let i = 0; i <= words.length - pw.length; i++) {
      if (pw.every((p, j) => strip(words[i + j]) === p)) {
        for (let j = 0; j < pw.length; j++) result.add(i + j)
      }
    }
  }
  return result
}

// ─── Shared back-button SVG ───────────────────────────────────────────────────
function BackBtn({ onClick }) {
  return (
    <button
      className="chs-back"
      onClick={onClick}
      aria-label="Go back"
      style={{
        position: 'absolute', top: 22, left: 18,
        width: 46, height: 46, borderRadius: RADII.pill,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'background 140ms ease',
      }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="rgba(255,255,255,0.78)" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 5l-7 7 7 7"/>
      </svg>
    </button>
  )
}

// ─── Shared ambient glow ──────────────────────────────────────────────────────
function Glow({ rgb }) {
  return (
    <div style={{
      position: 'absolute', top: '35%', left: '30%',
      transform: 'translate(-50%, -50%)',
      width: 280, height: 280,
      background: `radial-gradient(circle, rgba(${rgb},0.18) 0%, transparent 70%)`,
      filter: 'blur(110px)', pointerEvents: 'none',
    }} />
  )
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
  const img   = IMAGES[subject] || IMAGES.History
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme

  // ── Phase: 'question' → 'exiting' → 'reveal' ────────────────────────────────
  const [phase,       setPhase]       = useState('question')
  const [shakeTarget, setShakeTarget] = useState(null)
  const [btnsReady,   setBtnsReady]   = useState(false)

  // Pre-tokenise statement into words + spaces with accent info
  const tokens = (() => {
    const words     = statement.split(/\s+/)
    const accentSet = buildAccentSet(words, accentWords)
    const parts     = statement.split(/(\s+)/)
    let wi = 0
    return parts.map((part, i) => {
      if (/^\s+$/.test(part)) return { key: i, space: true, text: part }
      const idx = wi++
      return { key: i, space: false, text: part, wordIdx: idx, accent: accentSet.has(idx) }
    })
  })()

  const wordCount = tokens.filter(t => !t.space).length
  // Buttons appear 160ms after last word finishes fading in
  const btnDelayMs = 260 + (wordCount - 1) * 65 + 220 + 160

  useEffect(() => {
    const t = setTimeout(() => setBtnsReady(true), btnDelayMs)
    return () => clearTimeout(t)
  }, [btnDelayMs])

  function choose(tappedTrue) {
    if (phase !== 'question' || !btnsReady) return
    const correct = tappedTrue === isTrue
    if (!correct) {
      setShakeTarget(tappedTrue ? 'true' : 'false')
      setTimeout(() => setShakeTarget(null), 300)
    }
    // Wait for shake (wrong) or brief beat (correct), then cross-fade to reveal
    setTimeout(() => {
      setPhase('exiting')
      setTimeout(() => setPhase('reveal'), 320)
    }, correct ? 260 : 540)
  }

  const isExiting  = phase === 'exiting'
  const isReveal   = phase === 'reveal'
  const isQuestion = phase === 'question' || isExiting

  // ── Shared background layers (always visible through both screens) ─────────
  const BgLayers = () => (
    <>
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover', backgroundPosition: 'center top',
        opacity: 0.21, filter: 'grayscale(10%) brightness(0.65)',
        pointerEvents: 'none', zIndex: 1,
      }} />
      <div style={{
        position: 'fixed', inset: 0,
        background: 'linear-gradient(90deg, rgba(8,9,13,0.94) 0%, rgba(8,9,13,0.78) 38%, rgba(8,9,13,0.42) 68%, rgba(8,9,13,0.16) 100%)',
        pointerEvents: 'none', zIndex: 2,
      }} />
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: 220,
        background: 'linear-gradient(0deg, rgba(8,9,13,0.97) 0%, transparent 100%)',
        pointerEvents: 'none', zIndex: 3,
      }} />
    </>
  )

  return (
    <>
      <style>{`
        @keyframes chs-word {
          from { opacity: 0; transform: translateY(9px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes chs-header-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes chs-reveal-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes chs-shake {
          0%,100% { transform: translateX(0); }
          20%  { transform: translateX(-4px); }
          40%  { transform: translateX(4px); }
          60%  { transform: translateX(-3px); }
          80%  { transform: translateX(2px); }
        }
        .chs-back:active  { background: rgba(255,255,255,0.10) !important; }
        .chs-btn:active   { transform: scale(0.98); }
        .chs-cont:active  { opacity: 0.6 !important; }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: '#08090D' }}>
        <BgLayers />

        {/* ══════════════════════════════════════════════════════════════
            SCREEN 1 — QUESTION
        ══════════════════════════════════════════════════════════════ */}
        {isQuestion && (
          <>
            {/* Content layer */}
            <div style={{
              position: 'relative', zIndex: 4, minHeight: '100dvh',
              opacity: isExiting ? 0 : 1,
              transition: `opacity ${MOTION.duration.standard} ${MOTION.easing.gentle}`,
              pointerEvents: isExiting ? 'none' : 'auto',
            }}>
              <BackBtn onClick={onBack} />

              {/* Chapter label */}
              <div style={{
                position: 'absolute', top: 106, left: 28,
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 600, fontSize: 12,
                textTransform: 'uppercase', letterSpacing: '0.28em',
                color: accent, opacity: 0.92,
                animation: 'chs-header-in 320ms ease 40ms both',
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
                animation: 'chs-header-in 320ms ease 120ms both',
              }}>
                {chapterTitle}
              </div>

              {/* Statement — word by word */}
              <div style={{ position: 'absolute', top: '34%', left: 28, right: 28 }}>
                <Glow rgb={rgb} />
                <div style={{
                  position: 'relative',
                  maxWidth: 320,
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 800,
                  fontSize: 'clamp(28px, 9vw, 40px)',
                  lineHeight: 'clamp(33px, 10.5vw, 46px)',
                  letterSpacing: '-0.05em',
                  color: '#FFFFFF',
                }}>
                  {tokens.map(tok =>
                    tok.space ? tok.text : (
                      <span
                        key={tok.key}
                        style={{
                          display: 'inline-block',
                          color: tok.accent ? accent : 'inherit',
                          animation: `chs-word 220ms ease ${260 + tok.wordIdx * 65}ms both`,
                        }}
                      >
                        {tok.text}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* What do you think? — appears with buttons */}
              <div style={{
                position: 'fixed', bottom: 130, left: 28,
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 500, fontSize: 15,
                color: 'rgba(255,255,255,0.28)',
                letterSpacing: '0.03em',
                zIndex: 5,
                opacity: btnsReady ? 1 : 0,
                transition: 'opacity 400ms ease',
                pointerEvents: 'none',
              }}>
                What do you think?
              </div>
            </div>

            {/* TRUE / FALSE — separate fixed layer so it fades cleanly */}
            <div style={{
              position: 'fixed', bottom: 72, left: 0, right: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 20, zIndex: 10,
              opacity: isExiting ? 0 : (btnsReady ? 1 : 0),
              transition: `opacity ${isExiting ? 240 : 400}ms ease`,
              pointerEvents: (phase !== 'question' || !btnsReady) ? 'none' : 'auto',
            }}>
              <button
                className="chs-btn"
                onClick={() => choose(true)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 24,
                  textTransform: 'uppercase', letterSpacing: '0.18em',
                  color: accent,
                  textShadow: `0 0 18px rgba(${rgb},0.28)`,
                  borderBottom: '1.5px solid rgba(255,255,255,0.18)', paddingBottom: 2,
                  animation: shakeTarget === 'true' ? 'chs-shake 220ms ease' : 'none',
                }}>
                TRUE
              </button>

              <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.14)', flexShrink: 0 }} />

              <button
                className="chs-btn"
                onClick={() => choose(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 24,
                  textTransform: 'uppercase', letterSpacing: '0.18em',
                  color: 'rgba(255,255,255,0.74)',
                  borderBottom: '1.5px solid rgba(255,255,255,0.09)', paddingBottom: 2,
                  animation: shakeTarget === 'false' ? 'chs-shake 220ms ease' : 'none',
                }}>
                FALSE
              </button>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════
            SCREEN 2 — REVEAL
        ══════════════════════════════════════════════════════════════ */}
        {isReveal && (
          <>
            <div style={{ position: 'relative', zIndex: 4, minHeight: '100dvh' }}>
              <BackBtn onClick={onBack} />

              {/* Reveal content — slides up */}
              <div style={{
                position: 'absolute', top: '38%', left: 28, right: 28,
                animation: 'chs-reveal-up 500ms cubic-bezier(0.16,1,0.3,1) both',
              }}>
                <Glow rgb={rgb} />

                <div style={{ position: 'relative', maxWidth: 320 }}>
                  {/* Verdict label — mirrors chapter label style */}
                  <div style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700, fontSize: 13,
                    textTransform: 'uppercase', letterSpacing: '0.28em',
                    color: accent, opacity: 0.92,
                    marginBottom: 24,
                  }}>
                    {isTrue ? 'True.' : 'False.'}
                  </div>

                  {/* Explanation — the new hero */}
                  <div style={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 700,
                    fontSize: 'clamp(22px, 6.5vw, 28px)',
                    lineHeight: 'clamp(30px, 8.8vw, 38px)',
                    letterSpacing: '-0.03em',
                    color: 'rgba(255,255,255,0.92)',
                    maxWidth: 300,
                  }}>
                    {explanation}
                  </div>
                </div>
              </div>
            </div>

            {/* Continue → */}
            <button
              className="chs-cont"
              onClick={onContinue}
              style={{
                position: 'fixed', bottom: 72, left: 28,
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                zIndex: 10,
                fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 22,
                color: accent,
                transition: 'opacity 140ms ease',
                animation: 'chs-reveal-up 480ms cubic-bezier(0.16,1,0.3,1) 180ms both',
              }}>
              Continue →
            </button>
          </>
        )}
      </div>
    </>
  )
}
