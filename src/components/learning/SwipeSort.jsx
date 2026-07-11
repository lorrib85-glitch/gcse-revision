import { useState, useRef, useCallback } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
// CinematicShell used here because the split full-bleed background images and swipe gesture
// zone must reach all four viewport edges; InteractionShell's padding would clip the
// image split and break gesture hit areas near the screen edges.
import CinematicShell from '../layout/CinematicShell.jsx'
import ContinueCTA from '../core/ContinueCTA.jsx'
import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'

const SWIPE_THRESHOLD = 72
const BACKGROUND_BRIGHTNESS = {
  intro: 0.94,
  gameLeft: 0.96,
  gameRight: 0.98,
}

const CSS = `
@keyframes ss-glow-correct {
  0%   { opacity: 0; }
  12%  { opacity: 1; }
  75%  { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes ss-glow-wrong {
  0%   { opacity: 0; }
  10%  { opacity: 1; }
  78%  { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes ss-shake {
  0%,100% { transform: translateX(0) rotate(0deg); }
  18%     { transform: translateX(-13px) rotate(-2deg); }
  36%     { transform: translateX(12px) rotate(1.8deg); }
  54%     { transform: translateX(-9px) rotate(-1.2deg); }
  72%     { transform: translateX(6px) rotate(0.7deg); }
}
@keyframes ss-card-in {
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes ss-game-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes ss-done-in {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes ss-intro-in {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes ss-intro-left {
  from { opacity: 0; transform: translateX(-18px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes ss-intro-right {
  from { opacity: 0; transform: translateX(18px); }
  to   { opacity: 1; transform: translateX(0); }
}
`

function injectStyles() {
  if (document.getElementById('swipesort-css')) return
  const s = document.createElement('style')
  s.id = 'swipesort-css'
  s.textContent = CSS
  document.head.appendChild(s)
}

function splitLabel(column) {
  const [title = '', detail = ''] = String(column?.label ?? '').split('\n')
  return { title, detail }
}

function backgroundLayer(leftCol, rightCol, { focusSide = null, intro = false } = {}) {
  const leftActive = focusSide === 0
  const rightActive = focusSide === 1
  const baseOpacity = intro ? 0.78 : 0.88
  const leftBrightness = intro ? BACKGROUND_BRIGHTNESS.intro : BACKGROUND_BRIGHTNESS.gameLeft
  const rightBrightness = intro ? BACKGROUND_BRIGHTNESS.intro : BACKGROUND_BRIGHTNESS.gameRight

  return (
    <>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', zIndex: 0 }}>
        <div style={{
          flex: 1,
          backgroundImage: `url(${leftCol.image ?? '/swipe-supernatural.webp'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: leftActive ? 0.94 : baseOpacity,
          filter: `saturate(0.96) brightness(${leftBrightness})`,
          transition: 'opacity 0.26s ease, filter 0.26s ease',
        }} />
        <div style={{
          flex: 1,
          backgroundImage: `url(${rightCol.image ?? '/swipe-natural.webp'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          opacity: rightActive ? 0.94 : baseOpacity,
          filter: `saturate(0.96) brightness(${rightBrightness})`,
          transition: 'opacity 0.26s ease, filter 0.26s ease',
        }} />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: intro ? 'rgba(5,6,10,0.38)' : 'rgba(5,6,10,0.20)', zIndex: 1 }} />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: intro
          ? 'radial-gradient(ellipse 86% 70% at 50% 48%, transparent 32%, rgba(5,6,10,0.58) 100%)'
          : 'linear-gradient(180deg, rgba(5,6,10,0.46) 0%, rgba(5,6,10,0.08) 35%, rgba(5,6,10,0.14) 66%, rgba(5,6,10,0.52) 100%)',
      }} />
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: '50%',
        width: 1, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(180deg, transparent 0%, rgba(245,238,225,0.10) 25%, rgba(245,238,225,0.18) 50%, rgba(245,238,225,0.10) 75%, transparent 100%)',
      }} />
    </>
  )
}

export default function SwipeSort({ block, subject, onComplete }) {
  injectStyles()

  const accent    = SUBJECTS[subject]?.accent    ?? '#D69B45'
  const accentRgb = SUBJECTS[subject]?.accentRgb ?? '214,155,69'

  const {
    columns = [],
    items: rawItems = [],
    explanation = '',
    introTitle = 'Two worlds. One cause.',
    introText  = 'Decide whether each explanation is based on belief or observation.',
    gameTitle  = 'Sort the cause',
    gamePrompt = 'Is this belief-based or observation-based?',
    startLabel = "Let's go →",
  } = block

  const [items] = useState(() => {
    const arr = [...rawItems]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  })

  const [phase,    setPhase]    = useState('intro')
  const [cardIdx,  setCardIdx]  = useState(0)
  const [dragX,    setDragX]    = useState(0)
  const [dragging, setDragging] = useState(false)
  const [flashCol, setFlashCol] = useState(null)
  const [shaking,  setShaking]  = useState(false)
  const [flyDir,   setFlyDir]   = useState(null)
  const [animKey,  setAnimKey]  = useState(0)
  const [done,     setDone]     = useState(false)
  const [lastExpl, setLastExpl] = useState('')

  const locked = useRef(false)
  const startX = useRef(0)
  const cardRef = useRef(null)

  const totalCards = items.length
  const remaining  = totalCards - cardIdx
  const cur        = items[cardIdx] ?? null

  const leftCol  = columns[0] ?? { label: 'Supernatural\nReligion or belief', color: '#A89070', colorRgb: '168,144,112', bg: 'rgba(168,144,112,.07)' }
  const rightCol = columns[1] ?? { label: 'Rational\nObservation or logic', color: accent, colorRgb: accentRgb, bg: `rgba(${accentRgb},.07)` }

  const leftText = splitLabel(leftCol)
  const rightText = splitLabel(rightCol)
  const dragSide = dragX < -SWIPE_THRESHOLD ? 0 : dragX > SWIPE_THRESHOLD ? 1 : null

  const onTouchStart = useCallback(e => {
    if (locked.current) return
    startX.current = e.touches[0].clientX
    setDragging(true)
    setDragX(0)
  }, [])

  const onTouchMove = useCallback(e => {
    if (!dragging || locked.current) return
    e.preventDefault()
    setDragX(e.touches[0].clientX - startX.current)
  }, [dragging])

  const onTouchEnd = useCallback(() => {
    if (!dragging || locked.current) return
    setDragging(false)
    if (dragSide !== null) commitChoice(dragSide)
    else setDragX(0)
  }, [dragging, dragSide, commitChoice])

  const onMouseDown = e => {
    if (locked.current) return
    startX.current = e.clientX
    setDragging(true)
    setDragX(0)
  }
  const onMouseMove = e => {
    if (!dragging || locked.current) return
    setDragX(e.clientX - startX.current)
  }
  const onMouseUp = () => {
    if (!dragging || locked.current) return
    setDragging(false)
    if (dragSide !== null) commitChoice(dragSide)
    else setDragX(0)
  }

  function commitChoice(chosenCol) {
    if (!cur || locked.current) return
    locked.current = true
    setDragging(false)

    const correct = cur.col === chosenCol

    if (correct) {
      setLastExpl(cur.explanation ?? '')
      setFlashCol('correct')
      setFlyDir(chosenCol === 0 ? 'left' : 'right')
      setDragX(0)
      setTimeout(() => {
        setFlashCol(null)
        setFlyDir(null)
        if (cardIdx + 1 >= totalCards) {
          setDone(true)
        } else {
          setCardIdx(i => i + 1)
          setAnimKey(k => k + 1)
        }
        locked.current = false
      }, 520)
    } else {
      setFlashCol('wrong')
      setShaking(true)
      setDragX(0)
      setTimeout(() => {
        setFlashCol(null)
        setShaking(false)
        locked.current = false
      }, 560)
    }
  }

  function tapColumn(colIdx) {
    if (locked.current || done) return
    commitChoice(colIdx)
  }

  const cardRotate = dragging ? dragX * 0.035 : 0
  const cardTransform = flyDir === 'left'
    ? 'translateX(-115vw) rotate(-16deg)'
    : flyDir === 'right'
    ? 'translateX(115vw) rotate(16deg)'
    : `translateX(${dragX}px) rotate(${cardRotate}deg)`

  const cardTransition = flyDir
    ? 'transform 0.44s cubic-bezier(.4,0,.2,1), opacity 0.44s'
    : dragging
    ? 'box-shadow 0.12s'
    : 'transform 0.32s cubic-bezier(.22,1,.36,1), opacity 0.28s, box-shadow 0.2s'

  const cardOpacity = flyDir ? 0 : Math.max(0.42, 1 - Math.abs(dragX) / 420)

  const cardGlow = flashCol === 'correct'
    ? `0 0 44px rgba(${accentRgb},0.55), 0 0 92px rgba(${accentRgb},0.18), 0 14px 48px rgba(0,0,0,0.70)`
    : flashCol === 'wrong'
    ? '0 0 44px rgba(160,85,15,0.58), 0 0 80px rgba(160,85,15,0.18), 0 14px 48px rgba(0,0,0,0.70)'
    : dragX < -SWIPE_THRESHOLD
    ? `0 0 42px rgba(${leftCol.colorRgb ?? '168,144,112'},0.38), 0 14px 48px rgba(0,0,0,0.62)`
    : dragX > SWIPE_THRESHOLD
    ? `0 0 42px rgba(${rightCol.colorRgb ?? accentRgb},0.38), 0 14px 48px rgba(0,0,0,0.62)`
    : '0 14px 48px rgba(0,0,0,0.58)'

  if (phase === 'intro') {
    return (
      <CinematicShell style={{
        background: '#05060A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {backgroundLayer(leftCol, rightCol, { intro: true })}

        <div style={{
          position: 'relative', zIndex: 3,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '30px 24px', maxWidth: 420, width: '100%',
        }}>
          <div style={{
            ...TYPE.displayScreen,
            color: 'rgba(245,238,225,0.94)',
            textShadow: '0 2px 28px rgba(0,0,0,0.66)',
            textAlign: 'center',
            marginBottom: 10,
            animation: 'ss-intro-in 560ms cubic-bezier(.22,1,.36,1) both',
          }}>{introTitle}</div>

          <div style={{
            ...TYPE.body,
            color: 'rgba(245,245,245,0.66)',
            textAlign: 'center',
            maxWidth: 330,
            marginBottom: 28,
            animation: 'ss-intro-in 500ms cubic-bezier(.22,1,.36,1) 90ms both',
          }}>
            {introText}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', marginBottom: 34 }}>
            <div style={{
              background: 'rgba(10,12,18,0.54)',
              border: `1px solid rgba(${leftCol.colorRgb ?? '168,144,112'},0.34)`,
              borderRadius: 18,
              padding: '18px 14px',
              textAlign: 'center',
              backdropFilter: 'blur(8px)',
              animation: 'ss-intro-left 480ms cubic-bezier(.22,1,.36,1) 90ms both',
            }}>
              <div style={{ ...TYPE.metadata, color: leftCol.color ?? '#A89070', marginBottom: 8 }}>{leftText.title}</div>
              <div style={{ ...TYPE.caption, color: 'rgba(245,245,245,0.60)' }}>{leftText.detail}</div>
            </div>
            <div style={{
              background: 'rgba(10,12,18,0.54)',
              border: `1px solid rgba(${rightCol.colorRgb ?? accentRgb},0.36)`,
              borderRadius: 18,
              padding: '18px 14px',
              textAlign: 'center',
              backdropFilter: 'blur(8px)',
              animation: 'ss-intro-right 480ms cubic-bezier(.22,1,.36,1) 130ms both',
            }}>
              <div style={{ ...TYPE.metadata, color: rightCol.color ?? accent, marginBottom: 8 }}>{rightText.title}</div>
              <div style={{ ...TYPE.caption, color: 'rgba(245,245,245,0.60)' }}>{rightText.detail}</div>
            </div>
          </div>

          <ContinueCTA
            label={startLabel}
            accent={accent}
            onClick={() => setPhase('game')}
            style={{
              maxWidth: 260,
              boxShadow: `0 0 34px rgba(${accentRgb},0.36)`,
              animation: 'ss-intro-in 500ms cubic-bezier(.22,1,.36,1) 220ms both',
            }}
          />
        </div>
      </CinematicShell>
    )
  }

  if (done) {
    return (
      <CinematicShell style={{
        background: GENERAL.backgroundApp,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 24px',
        animation: 'ss-done-in 520ms cubic-bezier(.22,1,.36,1) both',
      }}>
        {backgroundLayer(leftCol, rightCol, { intro: true })}

        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', maxWidth: 400, width: '100%' }}>
          <div style={{
            ...TYPE.displayScreen,
            color: 'rgba(245,238,225,0.95)',
            textShadow: '0 2px 28px rgba(0,0,0,0.58)',
            marginBottom: 20,
            animation: 'ss-done-in 520ms cubic-bezier(.22,1,.36,1) 0ms both',
          }}>All sorted.</div>

          {lastExpl && (
            <div style={{
              ...TYPE.bodySmall,
              color: 'rgba(245,245,245,0.68)',
              marginBottom: 14,
              padding: '14px 16px',
              background: `rgba(${accentRgb},0.08)`,
              borderRadius: 16,
              border: `1px solid rgba(${accentRgb},0.20)`,
              animation: 'ss-done-in 520ms cubic-bezier(.22,1,.36,1) 150ms both',
            }}>
              {lastExpl}
            </div>
          )}

          {explanation && (
            <div style={{
              ...TYPE.body,
              color: 'rgba(245,245,245,0.78)',
              marginBottom: 30,
              animation: 'ss-done-in 520ms cubic-bezier(.22,1,.36,1) 250ms both',
            }}>
              {explanation}
            </div>
          )}

          <ContinueCTA
            accent={accent}
            onClick={onComplete}
            style={{
              maxWidth: 260,
              margin: '0 auto',
              animation: 'ss-done-in 520ms cubic-bezier(.22,1,.36,1) 360ms both',
            }}
          />
        </div>
      </CinematicShell>
    )
  }

  return (
    <CinematicShell style={{
      background: GENERAL.backgroundApp,
      animation: 'ss-game-in 360ms ease both',
    }}>
      <div style={{ position: 'absolute', inset: 0, userSelect: 'none', WebkitUserSelect: 'none' }}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {backgroundLayer(leftCol, rightCol, { focusSide: dragSide })}

        <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', left: 22, right: 22, top: 'calc(env(safe-area-inset-top, 0px) + 74px)',
            textAlign: 'center',
          }}>
            <div style={{
              ...TYPE.displaySection,
              color: 'rgba(245,238,225,0.94)',
              textShadow: '0 2px 24px rgba(0,0,0,0.70)',
              marginBottom: 6,
            }}>{gameTitle}</div>
            <div style={{
              ...TYPE.bodySmall,
              color: 'rgba(245,245,245,0.62)',
            }}>{gamePrompt}</div>
          </div>
        </div>

        <button
          onClick={() => tapColumn(0)}
          style={{
            position: 'absolute', left: 18, bottom: 'calc(env(safe-area-inset-bottom, 0px) + 30px)',
            width: 'calc(50% - 28px)', minHeight: 82, zIndex: 5,
            background: dragSide === 0 ? `rgba(${leftCol.colorRgb ?? '168,144,112'},0.18)` : 'rgba(8,10,16,0.54)',
            border: `1px solid rgba(${leftCol.colorRgb ?? '168,144,112'},${dragSide === 0 ? 0.50 : 0.26})`,
            borderRadius: 20,
            color: leftCol.color ?? '#A89070',
            cursor: 'pointer',
            boxShadow: dragSide === 0 ? `0 0 30px rgba(${leftCol.colorRgb ?? '168,144,112'},0.20)` : '0 12px 30px rgba(0,0,0,0.28)',
            backdropFilter: 'blur(10px)',
            transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
            textAlign: 'center',
            padding: '14px 10px',
          }}
        >
          <div style={{ ...TYPE.button, marginBottom: 5 }}>← {leftText.title}</div>
          <div style={{ ...TYPE.caption, color: 'rgba(245,245,245,0.46)' }}>{leftText.detail}</div>
        </button>

        <button
          onClick={() => tapColumn(1)}
          style={{
            position: 'absolute', right: 18, bottom: 'calc(env(safe-area-inset-bottom, 0px) + 30px)',
            width: 'calc(50% - 28px)', minHeight: 82, zIndex: 5,
            background: dragSide === 1 ? `rgba(${rightCol.colorRgb ?? accentRgb},0.18)` : 'rgba(8,10,16,0.54)',
            border: `1px solid rgba(${rightCol.colorRgb ?? accentRgb},${dragSide === 1 ? 0.50 : 0.26})`,
            borderRadius: 20,
            color: rightCol.color ?? accent,
            cursor: 'pointer',
            boxShadow: dragSide === 1 ? `0 0 30px rgba(${rightCol.colorRgb ?? accentRgb},0.20)` : '0 12px 30px rgba(0,0,0,0.28)',
            backdropFilter: 'blur(10px)',
            transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
            textAlign: 'center',
            padding: '14px 10px',
          }}
        >
          <div style={{ ...TYPE.button, marginBottom: 5 }}>{rightText.title} →</div>
          <div style={{ ...TYPE.caption, color: 'rgba(245,245,245,0.46)' }}>{rightText.detail}</div>
        </button>

        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 4,
          padding: '158px 24px 160px',
          pointerEvents: 'none',
        }}>
          {cur && (
            <div key={animKey} style={{ position: 'relative', pointerEvents: 'auto' }}>
              <div
                ref={cardRef}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onMouseDown={onMouseDown}
                style={{
                  position: 'relative',
                  width: 'min(78vw, 320px)',
                  minHeight: 156,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(180deg, rgba(23,25,36,0.98), rgba(14,16,25,0.98))',
                  borderRadius: 24,
                  border: `1px solid rgba(245,238,225,${Math.abs(dragX) > 20 ? 0.25 : 0.14})`,
                  padding: '26px 24px',
                  cursor: dragging ? 'grabbing' : 'grab',
                  transform: cardTransform,
                  opacity: cardOpacity,
                  animation: shaking
                    ? 'ss-shake 520ms ease both'
                    : 'ss-card-in 360ms cubic-bezier(.22,1,.36,1) both',
                  transition: shaking ? 'none' : cardTransition,
                  boxShadow: cardGlow,
                }}
              >
                <div style={{
                  ...TYPE.displayHero,
                  fontSize: 'clamp(24px, 6.8vw, 34px)',
                  color: 'rgba(245,238,225,0.96)',
                  textAlign: 'center',
                  textShadow: '0 2px 20px rgba(0,0,0,0.35)',
                }}>
                  {cur.label}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{
          position: 'absolute',
          left: 0, right: 0,
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 126px)',
          zIndex: 5,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            ...TYPE.caption,
            color: 'rgba(245,245,245,0.42)',
            background: 'rgba(8,10,16,0.42)',
            border: '1px solid rgba(245,238,225,0.08)',
            borderRadius: 999,
            padding: '8px 12px',
            backdropFilter: 'blur(8px)',
          }}>
            {remaining} left · Swipe the card or tap a side
          </div>
        </div>

        {flashCol === 'correct' && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: `radial-gradient(ellipse at center, rgba(${accentRgb},0.26), rgba(${accentRgb},0.04) 55%, transparent 75%)`,
            animation: 'ss-glow-correct 480ms ease both',
            pointerEvents: 'none',
          }} />
        )}

        {flashCol === 'wrong' && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: 'rgba(160,85,15,0.22)',
            animation: 'ss-glow-wrong 540ms ease both',
            pointerEvents: 'none',
          }} />
        )}
      </div>
    </CinematicShell>
  )
}
