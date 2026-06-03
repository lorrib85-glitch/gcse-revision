import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'

const IMAGES = {
  History:   '/history-truefalse.webp',
  Biology:   '/biology-truefalse.webp',
  Maths:     '/maths-truefalse.webp',
  Sociology: '/sociology-truefalse.webp',
  Chemistry: '/chemistry-truefalse.webp',
  Physics:   '/physics-truefalse.webp',
  English:   '/english-truefalse.webp',
  Music:     '/music-truefalse.webp',
}

function buildAccentSet(words, accentWords) {
  const result = new Set()
  if (!accentWords?.length) return result
  const strip = w => w.replace(/[.,!?;:'""""'']/g, '').toLowerCase()
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

function BackBtn({ onClick }) {
  return (
    <button
      className="chs-back"
      onClick={onClick}
      aria-label="Go back"
      style={{
        position: 'absolute', top: 22, left: 18,
        width: 46, height: 46, borderRadius: RADII.pill,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
        backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'background 140ms ease',
      }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="rgba(255,255,255,0.58)" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 5l-7 7 7 7"/>
      </svg>
    </button>
  )
}

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

export default function ChapterHookScreen({
  subject         = 'History',
  chapterNum      = 1,
  chapterTitle    = '',
  statement       = '',
  isTrue          = false,
  accentWords     = [],
  explanation     = '',
  revealBeats,
  backgroundImage = '',
  onBack,
  onContinue,
}) {
  const subjectImg = IMAGES[subject] || IMAGES.History
  const revealImg  = backgroundImage || subjectImg
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme

  const [phase,       setPhase]       = useState('question')
  const [shakeTarget, setShakeTarget] = useState(null)
  const [btnsReady,   setBtnsReady]   = useState(false)
  const [wasCorrect,  setWasCorrect]  = useState(null)

  // Staged reveal state
  const hasBeats   = Array.isArray(revealBeats) && revealBeats.length > 0
  const [beatIdx,  setBeatIdx]  = useState(0)
  const isLastBeat = !hasBeats || beatIdx >= revealBeats.length - 1

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

  const wordCount  = tokens.filter(t => !t.space).length
  const btnDelayMs = 260 + (wordCount - 1) * 65 + 220 + 160

  useEffect(() => {
    const t = setTimeout(() => setBtnsReady(true), btnDelayMs)
    return () => clearTimeout(t)
  }, [btnDelayMs])

  // Auto-advance beats — delay proportional to reading time
  useEffect(() => {
    if (phase !== 'reveal' || !hasBeats || isLastBeat) return
    const words = (revealBeats[beatIdx] || '').split(/\s+/).filter(Boolean).length
    const delay = 1400 + words * 220
    const t = setTimeout(() => setBeatIdx(i => i + 1), delay)
    return () => clearTimeout(t)
  }, [beatIdx, phase, hasBeats, isLastBeat, revealBeats])

  function choose(tappedTrue) {
    if (phase !== 'question' || !btnsReady) return
    const correct = tappedTrue === isTrue
    setWasCorrect(correct)
    if (!correct) {
      setShakeTarget(tappedTrue ? 'true' : 'false')
      setTimeout(() => setShakeTarget(null), 300)
    }
    setTimeout(() => {
      setPhase('exiting')
      setTimeout(() => setPhase('reveal'), 320)
    }, correct ? 260 : 540)
  }

  function revealLabel() {
    if (wasCorrect === null) return isTrue ? 'True.' : 'False.'
    if (wasCorrect)  return isTrue ? 'Exactly.' : 'Good catch.'
    return isTrue ? "Nope — it's true." : "Actually, it's false."
  }

  const isExiting  = phase === 'exiting'
  const isReveal   = phase === 'reveal'
  const isQuestion = phase === 'question' || isExiting

  const BgLayers = () => (
    <>
      {/* Subject image — question phase */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `url(${subjectImg})`,
        backgroundSize: 'cover', backgroundPosition: 'center top',
        opacity: isReveal ? 0 : 0.26,
        filter: 'grayscale(10%) brightness(0.65)',
        transition: `opacity 480ms ${MOTION.easing.gentle}`,
        pointerEvents: 'none', zIndex: 1,
      }} />
      {/* Topic image — reveal phase */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `url(${revealImg})`,
        backgroundSize: 'cover', backgroundPosition: 'center top',
        opacity: isReveal ? 0.32 : 0,
        filter: 'grayscale(10%) brightness(0.65)',
        transition: `opacity 480ms ${MOTION.easing.gentle}`,
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
        @keyframes chs-beat-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes chs-shake {
          0%,100% { transform: translateX(0); }
          20%  { transform: translateX(-4px); }
          40%  { transform: translateX(4px); }
          60%  { transform: translateX(-3px); }
          80%  { transform: translateX(2px); }
        }
        .chs-back:active  { background: rgba(255,255,255,0.08) !important; }
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
            <div style={{
              position: 'relative', zIndex: 4, minHeight: '100dvh',
              opacity: isExiting ? 0 : 1,
              transition: `opacity ${MOTION.duration.standard} ${MOTION.easing.gentle}`,
              pointerEvents: isExiting ? 'none' : 'auto',
            }}>
              <BackBtn onClick={onBack} />

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

            </div>

            <div style={{
              position: 'fixed', bottom: 100, left: 0, right: 0,
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
                  background: 'rgba(255,255,255,0.07)',
                  border: '1.5px solid rgba(255,255,255,0.22)',
                  backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                  borderRadius: RADII.pill,
                  padding: '14px 36px',
                  cursor: 'pointer',
                  fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 24,
                  textTransform: 'uppercase', letterSpacing: '0.18em',
                  color: 'rgba(255,255,255,0.88)',
                  animation: shakeTarget === 'true' ? 'chs-shake 220ms ease' : 'none',
                }}>
                TRUE
              </button>

              <button
                className="chs-btn"
                onClick={() => choose(false)}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1.5px solid rgba(255,255,255,0.22)',
                  backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                  borderRadius: RADII.pill,
                  padding: '14px 36px',
                  cursor: 'pointer',
                  fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 24,
                  textTransform: 'uppercase', letterSpacing: '0.18em',
                  color: 'rgba(255,255,255,0.88)',
                  animation: shakeTarget === 'false' ? 'chs-shake 220ms ease' : 'none',
                }}>
                FALSE
              </button>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════
            SCREEN 2 — REVEAL (staged beats, tap to advance)
        ══════════════════════════════════════════════════════════════ */}
        {isReveal && (
          <>
            <div
              style={{
                position: 'relative',
                zIndex: 4,
                minHeight: '100dvh',
              }}
            >
              <BackBtn onClick={onBack} />

              <div style={{
                position: 'absolute',
                top: '30%',
                left: 28, right: 28,
                paddingBottom: 140,
                animation: 'chs-reveal-up 500ms cubic-bezier(0.16,1,0.3,1) both',
              }}>
                <Glow rgb={rgb} />
                <div style={{ position: 'relative', maxWidth: 320 }}>

                  <div style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700, fontSize: 13,
                    textTransform: 'uppercase', letterSpacing: '0.28em',
                    color: accent, opacity: 0.92,
                    marginBottom: 28,
                  }}>
                    {revealLabel()}
                  </div>

                  {hasBeats ? (
                    <div
                      key={beatIdx}
                      style={{
                        fontFamily: "'Sora', sans-serif",
                        fontWeight: 700,
                        fontSize: 'clamp(24px, 7.5vw, 32px)',
                        lineHeight: 'clamp(32px, 10vw, 42px)',
                        letterSpacing: '-0.03em',
                        color: 'rgba(255,255,255,0.92)',
                        whiteSpace: 'pre-line',
                        animation: 'chs-beat-in 380ms cubic-bezier(0.16,1,0.3,1) both',
                      }}
                    >
                      {revealBeats[beatIdx]}
                    </div>
                  ) : (
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
                  )}
                </div>
              </div>
            </div>

            {/* Continue → only after final beat */}
            {isLastBeat && (
              <button
                className="chs-cont"
                onClick={onContinue}
                style={{
                  position: 'fixed',
                  bottom: 'calc(72px + env(safe-area-inset-bottom, 0px))',
                  left: 28,
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  zIndex: 10,
                  fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 22,
                  color: accent,
                  animation: 'chs-reveal-up 480ms cubic-bezier(0.16,1,0.3,1) 180ms both',
                }}
              >
                Continue →
              </button>
            )}
          </>
        )}
      </div>
    </>
  )
}
