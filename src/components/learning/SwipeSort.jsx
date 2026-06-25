import { useState, useRef, useCallback } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
// CinematicShell used here because the split full-bleed background images and swipe gesture
// zone must reach all four viewport edges; InteractionShell's padding would clip the
// image split and break gesture hit areas near the screen edges.
import CinematicShell from '../layout/CinematicShell.jsx'
import { TYPE } from '../../constants/typography.js'

const SWIPE_THRESHOLD = 72

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
  from { opacity: 0; transform: translateY(20px) scale(0.96); }
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
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes ss-intro-right {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes ss-float {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-6px); }
}
`

function injectStyles() {
  if (document.getElementById('swipesort-css')) return
  const s = document.createElement('style')
  s.id = 'swipesort-css'
  s.textContent = CSS
  document.head.appendChild(s)
}

export default function SwipeSort({ block, subject, onComplete }) {
  injectStyles()

  const accent    = SUBJECTS[subject]?.accent    ?? '#D69B45'
  const accentRgb = SUBJECTS[subject]?.accentRgb ?? '214,155,69'

  const { columns = [], items: rawItems = [], explanation = '' } = block

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
  const [flashCol, setFlashCol] = useState(null)   // 'correct' | 'wrong'
  const [shaking,  setShaking]  = useState(false)
  const [flyDir,   setFlyDir]   = useState(null)   // null | 'left' | 'right'
  const [animKey,  setAnimKey]  = useState(0)
  const [done,     setDone]     = useState(false)
  const [lastExpl, setLastExpl] = useState('')

  const locked  = useRef(false)
  const startX  = useRef(0)
  const cardRef = useRef(null)

  const totalCards = items.length
  const remaining  = totalCards - cardIdx
  const cur        = items[cardIdx] ?? null

  const leftCol  = columns[0] ?? { label: 'Left',  color: '#A89070', colorRgb: '168,144,112', bg: 'rgba(168,144,112,.07)' }
  const rightCol = columns[1] ?? { label: 'Right', color: accent }

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
  }, [dragging, dragSide])

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

  const cardRotate    = dragging ? dragX * 0.045 : 0
  const cardTransform = flyDir === 'left'
    ? 'translateX(-115vw) rotate(-22deg)'
    : flyDir === 'right'
    ? 'translateX(115vw) rotate(22deg)'
    : `translateX(${dragX}px) rotate(${cardRotate}deg)`

  const cardTransition = flyDir
    ? 'transform 0.44s cubic-bezier(.4,0,.2,1), opacity 0.44s'
    : dragging
    ? 'box-shadow 0.12s'
    : 'transform 0.32s cubic-bezier(.22,1,.36,1), opacity 0.28s, box-shadow 0.2s'

  const cardOpacity = flyDir ? 0 : Math.max(0.4, 1 - Math.abs(dragX) / 380)

  const cardGlow = flashCol === 'correct'
    ? '0 0 52px rgba(34,197,94,0.65), 0 0 100px rgba(34,197,94,0.20), 0 8px 32px rgba(0,0,0,0.7)'
    : flashCol === 'wrong'
    ? '0 0 44px rgba(160,85,15,0.60), 0 0 80px rgba(160,85,15,0.20), 0 8px 32px rgba(0,0,0,0.7)'
    : dragX < -SWIPE_THRESHOLD
    ? `0 0 40px rgba(${leftCol.colorRgb ?? '168,144,112'},0.40), 0 8px 32px rgba(0,0,0,0.6)`
    : dragX > SWIPE_THRESHOLD
    ? `0 0 40px rgba(${accentRgb},0.40), 0 8px 32px rgba(0,0,0,0.6)`
    : 'none'

  // ─── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <CinematicShell style={{
        background: '#05060A',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', zIndex: 0 }}>
          <div style={{
            flex: 1,
            backgroundImage: `url(${leftCol.image ?? '/swipe-supernatural.webp'})`,
            backgroundSize: 'cover', backgroundPosition: 'center top',
            opacity: 0.65, filter: 'grayscale(10%) brightness(0.75)',
          }} />
          <div style={{
            flex: 1,
            backgroundImage: `url(${rightCol.image ?? '/swipe-natural.webp'})`,
            backgroundSize: 'cover', backgroundPosition: 'center top',
            opacity: 0.65, filter: 'grayscale(10%) brightness(0.75)',
          }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,6,10,0.55)', zIndex: 1 }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(5,6,10,0.75) 100%)',
        }} />

        <div style={{
          position: 'relative', zIndex: 2,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '32px 28px', maxWidth: 420, width: '100%',
        }}>
          <div style={{
            fontFamily: "'IBM Plex Serif', Georgia, serif",
            fontWeight: 600,
            fontSize: 'clamp(36px, 9vw, 44px)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'rgba(245,238,225,0.92)',
            textShadow: '0 2px 28px rgba(0,0,0,0.6)',
            textAlign: 'center',
            marginBottom: 0,
            animation: 'ss-intro-in 600ms cubic-bezier(.22,1,.36,1) both',
          }}>Two worlds.<br />One cause.</div>
          <div style={{ width: 44, height: 1, background: 'rgba(255,255,255,0.12)', margin: '16px auto 24px' }} />

          <div style={{
            display: 'flex', gap: 12, width: '100%',
            marginBottom: 28,
          }}>
            <div style={{
              flex: 1,
              background: leftCol.bg ?? 'rgba(168,144,112,0.10)',
              border: `1.5px solid rgba(${leftCol.colorRgb ?? '168,144,112'},0.30)`,
              borderRadius: 16,
              padding: '20px 14px',
              textAlign: 'center',
              animation: 'ss-intro-left 520ms cubic-bezier(.22,1,.36,1) 60ms both',
            }}>
              {leftCol.label.split('\n').map((line, i) => (
                <div key={i} style={{
                  fontFamily: TYPE.bodyText.fontFamily,
                  fontWeight: i === 0 ? 700 : 500,
                  fontSize: i === 0 ? 14 : 11,
                  color: i === 0 ? (leftCol.color ?? '#A89070') : 'rgba(245,245,245,0.50)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  lineHeight: 1.4,
                }}>{i === 0 ? '← ' : ''}{line}</div>
              ))}
            </div>

            <div style={{
              flex: 1,
              background: `rgba(${accentRgb},0.10)`,
              border: `1.5px solid rgba(${accentRgb},0.30)`,
              borderRadius: 16,
              padding: '20px 14px',
              textAlign: 'center',
              animation: 'ss-intro-right 520ms cubic-bezier(.22,1,.36,1) 120ms both',
            }}>
              {rightCol.label.split('\n').map((line, i) => (
                <div key={i} style={{
                  fontFamily: TYPE.bodyText.fontFamily,
                  fontWeight: i === 0 ? 700 : 500,
                  fontSize: i === 0 ? 14 : 11,
                  color: i === 0 ? (rightCol.color ?? accent) : 'rgba(245,245,245,0.50)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  lineHeight: 1.4,
                }}>{line}{i === 0 ? ' →' : ''}</div>
              ))}
            </div>
          </div>

          <div style={{
            fontFamily: TYPE.bodyText.fontFamily,
            fontWeight: 500,
            fontSize: 15,
            color: 'rgba(245,245,245,0.60)',
            lineHeight: 1.65,
            textAlign: 'center',
            marginBottom: 36,
            animation: 'ss-intro-in 500ms cubic-bezier(.22,1,.36,1) 200ms both',
          }}>
            Each card shows a cause of disease. Swipe it — or tap the buttons below — to place it in the right column.
          </div>

          <button
            onClick={() => setPhase('game')}
            style={{
              fontFamily: TYPE.bodyText.fontFamily,
              fontWeight: 700,
              fontSize: 16,
              color: '#08090D',
              background: accent,
              border: 'none',
              borderRadius: 50,
              padding: '16px 44px',
              cursor: 'pointer',
              letterSpacing: '0.04em',
              boxShadow: `0 0 36px rgba(${accentRgb},0.45)`,
              animation: 'ss-intro-in 500ms cubic-bezier(.22,1,.36,1) 300ms both',
            }}
          >
            Let's go →
          </button>
        </div>
      </CinematicShell>
    )
  }

  // ─── DONE ───────────────────────────────────────────────────────────────────
  if (done) {
    return (
      <CinematicShell style={{
        background: '#08090D',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 28px',
        animation: 'ss-done-in 520ms cubic-bezier(.22,1,.36,1) both',
      }}>
        <div style={{ position: 'fixed', inset: 0, display: 'flex', zIndex: 0 }}>
          <div style={{
            flex: 1,
            backgroundImage: `url(${leftCol.image ?? '/swipe-supernatural.webp'})`,
            backgroundSize: 'cover', backgroundPosition: 'center top',
            opacity: 0.45, filter: 'grayscale(15%) brightness(0.78)',
          }} />
          <div style={{
            flex: 1,
            backgroundImage: `url(${rightCol.image ?? '/swipe-natural.webp'})`,
            backgroundSize: 'cover', backgroundPosition: 'center top',
            opacity: 0.45, filter: 'grayscale(15%) brightness(0.78)',
          }} />
        </div>
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,9,13,0.52)', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 400 }}>
          <div style={{
            fontFamily: "'IBM Plex Serif', Georgia, serif",
            fontWeight: 600,
            fontStyle: 'italic',
            fontSize: 'clamp(42px, 11vw, 54px)',
            color: 'rgba(245,238,225,0.94)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            textShadow: '0 2px 28px rgba(0,0,0,0.55)',
            marginBottom: 20,
            animation: 'ss-done-in 520ms cubic-bezier(.22,1,.36,1) 0ms both',
          }}>All sorted.</div>

          {lastExpl && (
            <div style={{
              fontFamily: TYPE.bodyText.fontFamily,
              fontWeight: 500,
              fontSize: 15,
              color: 'rgba(245,245,245,0.60)',
              lineHeight: 1.65,
              marginBottom: 28,
              padding: '14px 18px',
              background: `rgba(${accentRgb},0.07)`,
              borderRadius: 14,
              border: `1px solid rgba(${accentRgb},0.16)`,
              animation: 'ss-done-in 520ms cubic-bezier(.22,1,.36,1) 180ms both',
            }}>
              {lastExpl}
            </div>
          )}

          {explanation && (
            <div style={{
              fontFamily: TYPE.bodyText.fontFamily,
              fontWeight: 500,
              fontSize: 16,
              color: 'rgba(245,245,245,0.80)',
              lineHeight: 1.65,
              marginBottom: 40,
              animation: 'ss-done-in 520ms cubic-bezier(.22,1,.36,1) 280ms both',
            }}>
              {explanation}
            </div>
          )}

          <div
            onClick={onComplete}
            style={{
              fontFamily: TYPE.bodyText.fontFamily,
              fontWeight: 700,
              fontSize: 16,
              color: accent,
              padding: '14px 32px',
              background: `rgba(${accentRgb},0.12)`,
              borderRadius: 50,
              border: `1px solid rgba(${accentRgb},0.30)`,
              display: 'inline-block',
              cursor: 'pointer',
              animation: 'ss-done-in 520ms cubic-bezier(.22,1,.36,1) 420ms both',
            }}
          >
            Continue →
          </div>
        </div>
      </CinematicShell>
    )
  }

  // ─── GAME ───────────────────────────────────────────────────────────────────
  return (
    <CinematicShell style={{
      background: '#08090D',
      animation: 'ss-game-in 380ms ease both',
    }}>
      <div style={{ position: 'absolute', inset: 0, userSelect: 'none', WebkitUserSelect: 'none' }}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
      {/* Split background */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', zIndex: 0 }}>
        <div style={{
          flex: 1,
          backgroundImage: `url(${leftCol.image ?? '/swipe-supernatural.webp'})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          opacity: dragX < -20 ? 0.90 : 0.72,
          filter: 'grayscale(5%) brightness(0.88)',
          transition: dragging ? 'none' : 'opacity 0.4s ease',
        }} />
        <div style={{
          flex: 1,
          backgroundImage: `url(${rightCol.image ?? '/swipe-natural.webp'})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          opacity: dragX > 20 ? 0.90 : 0.72,
          filter: 'grayscale(5%) brightness(0.88)',
          transition: dragging ? 'none' : 'opacity 0.4s ease',
        }} />
      </div>

      <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,9,13,0.22)', zIndex: 1 }} />

      {/* Centre divider line */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: '50%',
        width: 1, zIndex: 2, pointerEvents: 'none',
        background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.15) 25%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.15) 75%, transparent 100%)',
      }} />

      {/* Vignette overlay — draws eye to centre card */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 85% 70% at 50% 50%, transparent 35%, rgba(5,6,10,0.50) 100%)',
      }} />

      {/* Card stack */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 4,
        paddingTop: 60,
        paddingBottom: 200,
      }}>
        {cur && (
          <div
            key={animKey}
            style={{
              position: 'relative',
              animation: (!dragging && !shaking && !flyDir)
                ? 'ss-float 3.2s ease-in-out infinite'
                : 'none',
            }}
          >
            <div
              ref={cardRef}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              style={{
                position: 'relative',
                width: 'min(64vw, 252px)',
                background: 'rgba(22,24,34,0.97)',
                borderRadius: 22,
                border: `1px solid rgba(255,255,255,${Math.abs(dragX) > 20 ? 0.22 : 0.14})`,
                padding: '0',
                cursor: dragging ? 'grabbing' : 'grab',
                transform: cardTransform,
                opacity: cardOpacity,
                animation: shaking
                  ? 'ss-shake 520ms ease both'
                  : `ss-card-in 400ms cubic-bezier(.22,1,.36,1) both`,
                transition: shaking ? 'none' : cardTransition,
                boxShadow: cardGlow,
              }}
            >
              <div style={{
                fontFamily: TYPE.bodyText.fontFamily,
                fontWeight: 700,
                fontSize: 'clamp(16px, 4.5vw, 20px)',
                color: 'rgba(245,238,225,0.95)',
                lineHeight: 1.3,
                textAlign: 'center',
                padding: '28px 20px',
              }}>
                {cur.label}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Green correct flash */}
      {flashCol === 'correct' && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          background: 'rgba(34,197,94,0.22)',
          animation: 'ss-glow-correct 480ms ease both',
          pointerEvents: 'none',
        }} />
      )}

      {/* Brown wrong flash */}
      {flashCol === 'wrong' && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          background: 'rgba(160,85,15,0.24)',
          animation: 'ss-glow-wrong 540ms ease both',
          pointerEvents: 'none',
        }} />
      )}

      {/* Bottom tap buttons */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', zIndex: 5,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>
        <button
          onClick={() => tapColumn(0)}
          style={{
            flex: 1,
            padding: '18px 16px',
            background: dragX < -SWIPE_THRESHOLD ? `rgba(${leftCol.colorRgb ?? '168,144,112'},0.22)` : 'rgba(255,255,255,0.03)',
            border: 'none',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            borderRight: '1px solid rgba(255,255,255,0.06)',
            color: leftCol.color ?? '#A89070',
            fontFamily: TYPE.bodyText.fontFamily,
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            letterSpacing: '0.06em',
            transition: 'background 0.2s',
          }}
        >
          ← {leftCol.label.split('\n')[0]}
        </button>
        <button
          onClick={() => tapColumn(1)}
          style={{
            flex: 1,
            padding: '18px 16px',
            background: dragX > SWIPE_THRESHOLD ? `rgba(${accentRgb},0.22)` : 'rgba(255,255,255,0.03)',
            border: 'none',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            color: rightCol.color ?? accent,
            fontFamily: TYPE.bodyText.fontFamily,
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            letterSpacing: '0.06em',
            transition: 'background 0.2s',
          }}
        >
          {rightCol.label.split('\n')[0]} →
        </button>
      </div>

      <div style={{
        position: 'absolute',
        bottom: 80,
        left: '50%', transform: 'translateX(-50%)',
        zIndex: 5,
        fontFamily: TYPE.bodyText.fontFamily,
        fontWeight: 500,
        fontSize: 11,
        color: 'rgba(245,245,245,0.28)',
        letterSpacing: '0.09em',
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
      }}>
        swipe or tap to sort
      </div>
      </div>
    </CinematicShell>
  )
}
