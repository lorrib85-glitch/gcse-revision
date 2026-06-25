import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import BackButton from '../core/BackButton.jsx'
// CinematicShell used here because all inner layers are position: fixed (they escape any
// containing block) and the screen must cover the full viewport including under system chrome;
// ContentShell's padding would not reach these fixed children and would create an unwanted gap.
import CinematicShell from './CinematicShell.jsx'
import { TYPE } from '../../constants/typography.js'

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
    <BackButton
      onClick={e => { e.stopPropagation(); onClick() }}
      style={{ position: 'absolute', top: 22, left: 18, zIndex: 10 }}
    />
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
  const [tappedBtn,   setTappedBtn]   = useState(null) // 'true' | 'false' | null

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

  function advanceBeat() {
    if (!isLastBeat) setBeatIdx(i => i + 1)
  }

  function choose(tappedTrue) {
    if (phase !== 'question' || !btnsReady) return
    const correct = tappedTrue === isTrue
    setWasCorrect(correct)
    setTappedBtn(tappedTrue ? 'true' : 'false')
    if (!correct) {
      setShakeTarget(tappedTrue ? 'true' : 'false')
      setTimeout(() => setShakeTarget(null), 300)
    }
    setTimeout(() => {
      setPhase('exiting')
      setTimeout(() => setPhase('reveal'), 320)
    }, correct ? 340 : 580)
  }

  function revealLabel() {
    if (wasCorrect === null) return isTrue ? 'True.' : 'False.'
    if (wasCorrect)  return isTrue ? 'Exactly.' : 'Good catch.'
    return isTrue ? "Nope — it's true." : "Actually, it's false."
  }

  const isExiting  = phase === 'exiting'
  const isReveal   = phase === 'reveal'
  const isQuestion = phase === 'question' || isExiting

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
        .chs-btn:active   { transform: scale(0.98); }
        .chs-cont:active  { opacity: 0.6 !important; }
      `}</style>

      <CinematicShell style={{ background: '#08090D', zIndex: 1000 }}>
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
          opacity: isReveal ? 0.50 : 0,
          filter: 'brightness(0.70)',
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
                position: 'absolute', top: 106, left: 28, right: 36,
                fontFamily: TYPE.bodyText.fontFamily,
                fontWeight: 700, fontSize: 18,
                lineHeight: '24px', letterSpacing: '-0.01em',
                color: 'rgba(255,255,255,0.55)',
                animation: 'chs-header-in 320ms ease 40ms both',
              }}>
                {chapterTitle}
              </div>

              <div style={{ position: 'absolute', top: '34%', left: 28, right: 28 }}>
                <Glow rgb={rgb} />
                <div style={{
                  position: 'relative',
                  maxWidth: 320,
                  fontFamily: TYPE.bodyText.fontFamily,
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
              position: 'fixed', bottom: 56, left: 0, right: 0,
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
                  background: tappedBtn === 'true'
                    ? `rgba(${rgb}, 0.22)`
                    : 'rgba(255,255,255,0.07)',
                  border: tappedBtn === 'true'
                    ? `1.5px solid rgba(${rgb}, 0.60)`
                    : '1.5px solid rgba(255,255,255,0.22)',
                  boxShadow: tappedBtn === 'true'
                    ? `0 0 0 1px rgba(${rgb},0.25), 0 0 32px rgba(${rgb},0.55), 0 0 64px rgba(${rgb},0.28)`
                    : 'none',
                  backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                  borderRadius: RADII.pill,
                  padding: '14px 36px',
                  cursor: 'pointer',
                  fontFamily: TYPE.bodyText.fontFamily, fontWeight: 700, fontSize: 24,
                  letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.88)',
                  transform: tappedBtn === 'true' ? 'scale(1.10)' : 'scale(1)',
                  opacity: tappedBtn === 'false' ? 0 : 1,
                  transition: 'transform 300ms cubic-bezier(0.34,1.56,0.64,1), opacity 220ms ease, background 200ms ease, border-color 200ms ease, box-shadow 240ms ease',
                  animation: shakeTarget === 'true' ? 'chs-shake 220ms ease' : 'none',
                }}>
                True
              </button>

              <button
                className="chs-btn"
                onClick={() => choose(false)}
                style={{
                  background: tappedBtn === 'false'
                    ? `rgba(${rgb}, 0.22)`
                    : 'rgba(255,255,255,0.07)',
                  border: tappedBtn === 'false'
                    ? `1.5px solid rgba(${rgb}, 0.60)`
                    : '1.5px solid rgba(255,255,255,0.22)',
                  boxShadow: tappedBtn === 'false'
                    ? `0 0 0 1px rgba(${rgb},0.25), 0 0 32px rgba(${rgb},0.55), 0 0 64px rgba(${rgb},0.28)`
                    : 'none',
                  backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                  borderRadius: RADII.pill,
                  padding: '14px 36px',
                  cursor: 'pointer',
                  fontFamily: TYPE.bodyText.fontFamily, fontWeight: 700, fontSize: 24,
                  letterSpacing: '0.08em',
                  color: 'rgba(255,255,255,0.88)',
                  transform: tappedBtn === 'false' ? 'scale(1.10)' : 'scale(1)',
                  opacity: tappedBtn === 'true' ? 0 : 1,
                  transition: 'transform 300ms cubic-bezier(0.34,1.56,0.64,1), opacity 220ms ease, background 200ms ease, border-color 200ms ease, box-shadow 240ms ease',
                  animation: shakeTarget === 'false' ? 'chs-shake 220ms ease' : 'none',
                }}>
                False
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
              onClick={advanceBeat}
              style={{
                position: 'relative',
                zIndex: 4,
                minHeight: '100dvh',
                cursor: isLastBeat ? 'default' : 'pointer',
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
                    fontFamily: TYPE.bodyText.fontFamily,
                    fontWeight: 700, fontSize: 16,
                    letterSpacing: '-0.01em',
                    color: accent, opacity: 0.92,
                    marginBottom: 16,
                  }}>
                    {revealLabel()}
                  </div>

                  {hasBeats ? (
                    <div
                      key={beatIdx}
                      style={{
                        fontFamily: TYPE.bodyText.fontFamily,
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
                      fontFamily: TYPE.bodyText.fontFamily,
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
                  fontFamily: TYPE.bodyText.fontFamily, fontWeight: 700, fontSize: 22,
                  color: accent,
                  animation: 'chs-reveal-up 480ms cubic-bezier(0.16,1,0.3,1) 180ms both',
                }}
              >
                Continue →
              </button>
            )}
          </>
        )}
      </CinematicShell>
    </>
  )
}
