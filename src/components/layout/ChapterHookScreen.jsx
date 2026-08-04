import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { MOTION } from '../../constants/motion.js'
import { RADII } from '../../constants/radii.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { SPACING } from '../../constants/spacing.js'
import BackButton from '../core/BackButton.jsx'
import CinematicContinueCTA from '../core/CinematicContinueCTA.jsx'
// CinematicShell used here because all inner layers are position: fixed (they escape any
// containing block) and the screen must cover the full viewport including under system chrome;
// ContentShell's padding would not reach these fixed children and would create an unwanted gap.
import CinematicShell from './CinematicShell.jsx'
import { TYPE, HEADING_LAYOUT } from '../../constants/typography.js'

const IMAGES = {
  History: '/images/backgrounds/history-truefalse.webp',
  Biology: '/images/backgrounds/biology-truefalse.webp',
  Maths: '/images/backgrounds/maths-truefalse.webp',
  Sociology: '/images/backgrounds/sociology-truefalse.webp',
  Chemistry: '/images/backgrounds/chemistry-truefalse.webp',
  Physics: '/images/backgrounds/physics-truefalse.webp',
  English: '/images/backgrounds/english-truefalse.webp',
  Music: '/images/backgrounds/music-truefalse.webp',
}

function buildAccentSet(words, accentWords) {
  const result = new Set()
  if (!accentWords?.length) return result
  const strip = word => word.replace(/[.,!?;:'"“”‘’]/g, '').toLowerCase()

  for (const phrase of accentWords) {
    const phraseWords = phrase.split(/\s+/).map(strip)
    for (let index = 0; index <= words.length - phraseWords.length; index += 1) {
      if (phraseWords.every((word, offset) => strip(words[index + offset]) === word)) {
        for (let offset = 0; offset < phraseWords.length; offset += 1) result.add(index + offset)
      }
    }
  }

  return result
}

function BackBtn({ onClick }) {
  return (
    <BackButton
      onClick={event => {
        event.stopPropagation()
        onClick?.()
      }}
      style={{
        position: 'absolute',
        top: SPACING.standard,
        left: SPACING.compact,
        zIndex: 10,
      }}
    />
  )
}

function Glow({ rgb }) {
  return (
    <div style={{
      position: 'absolute',
      top: '35%',
      left: '30%',
      transform: 'translate(-50%, -50%)',
      width: SPACING.cinematic * 4,
      height: SPACING.cinematic * 4,
      background: `radial-gradient(circle, rgba(${rgb},0.18) 0%, transparent 70%)`,
      filter: `blur(${SPACING.section + SPACING.compact}px)`,
      pointerEvents: 'none',
    }} />
  )
}

export default function ChapterHookScreen({
  subject = 'History',
  chapterNum: _chapterNum = 1,
  chapterTitle = '',
  statement = '',
  isTrue = false,
  accentWords = [],
  explanation = '',
  revealBeats,
  backgroundImage = '',
  onBack,
  onContinue,
}) {
  const subjectImg = IMAGES[subject] || IMAGES.History
  const revealImg = backgroundImage || subjectImg
  const theme = SUBJECTS[subject] || SUBJECTS.History
  const { accent, accentRgb: rgb } = theme

  const [phase, setPhase] = useState('question')
  const [shakeTarget, setShakeTarget] = useState(null)
  const [btnsReady, setBtnsReady] = useState(false)
  const [wasCorrect, setWasCorrect] = useState(null)
  const [tappedBtn, setTappedBtn] = useState(null)

  const hasBeats = Array.isArray(revealBeats) && revealBeats.length > 0
  const [beatIdx, setBeatIdx] = useState(0)
  const isLastBeat = !hasBeats || beatIdx >= revealBeats.length - 1

  const questionInset = SPACING.standard + SPACING.micro
  const questionButtonHeight = SPACING.cinematic - SPACING.micro
  const revealTopPadding = `clamp(${SPACING.cinematic * 2}px, 30dvh, ${SPACING.cinematic * 4}px)`

  const tokens = (() => {
    const words = statement.split(/\s+/)
    const accentSet = buildAccentSet(words, accentWords)
    const parts = statement.split(/(\s+)/)
    let wordIndex = 0

    return parts.map((part, index) => {
      if (/^\s+$/.test(part)) return { key: index, space: true, text: part }
      const currentWordIndex = wordIndex
      wordIndex += 1
      return {
        key: index,
        space: false,
        text: part,
        wordIdx: currentWordIndex,
        accent: accentSet.has(currentWordIndex),
      }
    })
  })()

  const wordCount = tokens.filter(token => !token.space).length
  const btnDelayMs = 260 + (wordCount - 1) * 65 + 220 + 160

  useEffect(() => {
    const timer = setTimeout(() => setBtnsReady(true), btnDelayMs)
    return () => clearTimeout(timer)
  }, [btnDelayMs])

  function advanceBeat() {
    if (!isLastBeat) setBeatIdx(index => index + 1)
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
    if (wasCorrect) return isTrue ? 'Exactly.' : 'Good catch.'
    return isTrue ? "Nope — it's true." : "Actually, it's false."
  }

  const isExiting = phase === 'exiting'
  const isReveal = phase === 'reveal'
  const isQuestion = phase === 'question' || isExiting

  return (
    <>
      <style>{`
        @keyframes chs-word {
          from { opacity: 0; transform: translateY(9px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes chs-header-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes chs-reveal-up {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes chs-beat-in {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes chs-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(2px); }
        }
        .chs-btn:active { transform: scale(0.98); }
        .chs-reveal-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .chs-reveal-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>

      <CinematicShell style={{ background: GENERAL.backgroundApp, zIndex: 1000 }}>
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${subjectImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: isReveal ? 0 : 0.26,
          filter: 'grayscale(10%) brightness(0.65)',
          transition: `opacity 480ms ${MOTION.easing.gentle}`,
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${revealImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: isReveal ? 0.5 : 0,
          filter: 'brightness(0.70)',
          transition: `opacity 480ms ${MOTION.easing.gentle}`,
          pointerEvents: 'none',
          zIndex: 1,
        }} />

        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(8,9,13,0.94) 0%, rgba(8,9,13,0.78) 38%, rgba(8,9,13,0.42) 68%, rgba(8,9,13,0.16) 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }} />

        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: SPACING.cinematic * 3,
          background: 'linear-gradient(0deg, rgba(8,9,13,0.97) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 3,
        }} />

        {isQuestion && (
          <div style={{
            position: 'relative',
            zIndex: 4,
            minHeight: '100dvh',
            opacity: isExiting ? 0 : 1,
            transition: `opacity ${MOTION.duration.standard} ${MOTION.easing.gentle}`,
            pointerEvents: isExiting ? 'none' : 'auto',
          }}>
            <BackBtn onClick={onBack} />

            <div style={{
              position: 'absolute',
              top: SPACING.section + SPACING.micro,
              left: questionInset,
              right: questionInset,
              ...TYPE.displayCard,
              fontSize: 18,
              color: 'rgba(255,255,255,0.55)',
              animation: 'chs-header-in 320ms ease 40ms both',
            }}>
              {chapterTitle}
            </div>

            <div style={{
              position: 'absolute',
              top: `calc(50% + ${SPACING.compact}px)`,
              left: questionInset,
              right: questionInset,
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Glow rgb={rgb} />

              <div style={{
                position: 'relative',
                width: '100%',
                ...HEADING_LAYOUT.screenTitle,
                ...TYPE.displayHero,
                fontSize: 'clamp(28px, 8.6vw, 40px)',
                color: '#FFFFFF',
                textAlign: 'center',
              }}>
                {tokens.map(token => token.space ? token.text : (
                  <span
                    key={token.key}
                    style={{
                      display: 'inline-block',
                      color: token.accent ? accent : 'inherit',
                      animation: `chs-word 220ms ease ${260 + token.wordIdx * 65}ms both`,
                    }}
                  >
                    {token.text}
                  </span>
                ))}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: SPACING.standard,
                zIndex: 10,
                width: '100%',
                marginTop: SPACING.section,
                opacity: isExiting ? 0 : (btnsReady ? 1 : 0),
                transition: `opacity ${isExiting ? 240 : 400}ms ease`,
                pointerEvents: phase !== 'question' || !btnsReady ? 'none' : 'auto',
              }}>
                <button
                  className="chs-btn"
                  onClick={() => choose(true)}
                  style={{
                    flex: 1,
                    minHeight: questionButtonHeight,
                    background: tappedBtn === 'true'
                      ? `rgba(${rgb}, 0.22)`
                      : 'rgba(255,255,255,0.07)',
                    border: tappedBtn === 'true'
                      ? `1.5px solid rgba(${rgb}, 0.60)`
                      : '1.5px solid rgba(255,255,255,0.22)',
                    boxShadow: tappedBtn === 'true'
                      ? `0 0 0 1px rgba(${rgb},0.25), 0 0 32px rgba(${rgb},0.55), 0 0 64px rgba(${rgb},0.28)`
                      : 'none',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    borderRadius: RADII.pill,
                    padding: `${SPACING.compact}px ${SPACING.standard}px`,
                    cursor: 'pointer',
                    ...TYPE.displaySection,
                    fontSize: 24,
                    color: 'rgba(255,255,255,0.88)',
                    transform: tappedBtn === 'true' ? 'scale(1.10)' : 'scale(1)',
                    opacity: tappedBtn === 'false' ? 0 : 1,
                    transition: 'transform 300ms cubic-bezier(0.34,1.56,0.64,1), opacity 220ms ease, background 200ms ease, border-color 200ms ease, box-shadow 240ms ease',
                    animation: shakeTarget === 'true' ? 'chs-shake 220ms ease' : 'none',
                  }}
                >
                  True
                </button>

                <button
                  className="chs-btn"
                  onClick={() => choose(false)}
                  style={{
                    flex: 1,
                    minHeight: questionButtonHeight,
                    background: tappedBtn === 'false'
                      ? `rgba(${rgb}, 0.22)`
                      : 'rgba(255,255,255,0.07)',
                    border: tappedBtn === 'false'
                      ? `1.5px solid rgba(${rgb}, 0.60)`
                      : '1.5px solid rgba(255,255,255,0.22)',
                    boxShadow: tappedBtn === 'false'
                      ? `0 0 0 1px rgba(${rgb},0.25), 0 0 32px rgba(${rgb},0.55), 0 0 64px rgba(${rgb},0.28)`
                      : 'none',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    borderRadius: RADII.pill,
                    padding: `${SPACING.compact}px ${SPACING.standard}px`,
                    cursor: 'pointer',
                    ...TYPE.displaySection,
                    fontSize: 24,
                    color: 'rgba(255,255,255,0.88)',
                    transform: tappedBtn === 'false' ? 'scale(1.10)' : 'scale(1)',
                    opacity: tappedBtn === 'true' ? 0 : 1,
                    transition: 'transform 300ms cubic-bezier(0.34,1.56,0.64,1), opacity 220ms ease, background 200ms ease, border-color 200ms ease, box-shadow 240ms ease',
                    animation: shakeTarget === 'false' ? 'chs-shake 220ms ease' : 'none',
                  }}
                >
                  False
                </button>
              </div>
            </div>
          </div>
        )}

        {isReveal && (
          <div
            onClick={advanceBeat}
            style={{
              position: 'relative',
              zIndex: 4,
              height: '100dvh',
              display: 'flex',
              flexDirection: 'column',
              cursor: isLastBeat ? 'default' : 'pointer',
            }}
          >
            <BackBtn onClick={onBack} />

            <div
              className="chs-reveal-scroll"
              data-chapter-hook-reveal-scroll
              style={{
                flex: '1 1 auto',
                minHeight: 0,
                overflowY: 'auto',
                overscrollBehaviorY: 'contain',
                WebkitOverflowScrolling: 'touch',
                boxSizing: 'border-box',
                padding: `${revealTopPadding} ${questionInset}px ${SPACING.compact}px`,
              }}
            >
              <div style={{
                position: 'relative',
                maxWidth: 320,
                animation: 'chs-reveal-up 500ms cubic-bezier(0.16,1,0.3,1) both',
              }}>
                <Glow rgb={rgb} />

                <div style={{
                  position: 'relative',
                  ...TYPE.displayCard,
                  fontSize: 16,
                  color: accent,
                  opacity: 0.92,
                  marginBottom: SPACING.compact,
                }}>
                  {revealLabel()}
                </div>

                {hasBeats ? (
                  <div
                    key={beatIdx}
                    style={{
                      position: 'relative',
                      ...TYPE.displayScreen,
                      fontSize: 'clamp(24px, 7.5vw, 32px)',
                      color: 'rgba(255,255,255,0.92)',
                      whiteSpace: 'pre-line',
                      animation: 'chs-beat-in 380ms cubic-bezier(0.16,1,0.3,1) both',
                    }}
                  >
                    {revealBeats[beatIdx]}
                  </div>
                ) : (
                  <div style={{
                    position: 'relative',
                    ...TYPE.displaySection,
                    fontSize: 'clamp(22px, 6.5vw, 28px)',
                    color: 'rgba(255,255,255,0.92)',
                    maxWidth: 300,
                  }}>
                    {explanation}
                  </div>
                )}
              </div>
            </div>

            <div
              data-chapter-hook-cta-slot
              onClick={event => event.stopPropagation()}
              onTouchStart={event => event.stopPropagation()}
              onTouchEnd={event => event.stopPropagation()}
              style={{
                position: 'relative',
                zIndex: 10,
                flexShrink: 0,
                padding: `${SPACING.micro}px ${questionInset}px calc(${SPACING.separation}px + env(safe-area-inset-bottom, 0px))`,
              }}
            >
              <CinematicContinueCTA
                layout="inline"
                align="start"
                onClick={onContinue}
                accent={accent}
                label="Continue →"
                animation={isLastBeat
                  ? 'chs-reveal-up 480ms cubic-bezier(0.16,1,0.3,1) 180ms both'
                  : 'none'}
                style={{
                  visibility: isLastBeat ? 'visible' : 'hidden',
                  pointerEvents: isLastBeat ? 'auto' : 'none',
                }}
              />
            </div>
          </div>
        )}
      </CinematicShell>
    </>
  )
}
