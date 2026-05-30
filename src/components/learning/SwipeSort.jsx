import { useState, useRef, useEffect, useCallback } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'

const SWIPE_THRESHOLD = 72  // px drag to commit

// Keyframes injected once
const CSS = `
@keyframes ss-correct-flash {
  0%   { opacity: 0; transform: scale(0.85); }
  18%  { opacity: 1; transform: scale(1.06); }
  70%  { opacity: 1; transform: scale(1.0); }
  100% { opacity: 0; transform: scale(1.0); }
}
@keyframes ss-wrong-pulse {
  0%,100% { transform: translateX(0); }
  18%      { transform: translateX(-11px); }
  36%      { transform: translateX(10px); }
  54%      { transform: translateX(-8px); }
  72%      { transform: translateX(6px); }
}
@keyframes ss-card-in {
  from { opacity: 0; transform: translateY(18px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes ss-done-in {
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes ss-col-pulse {
  0%,100% { opacity: 0.55; }
  50%      { opacity: 1; }
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

  const { columns = [], items = [], explanation = '' } = block

  const [cardIdx,    setCardIdx]    = useState(0)
  const [dragX,      setDragX]      = useState(0)
  const [dragging,   setDragging]   = useState(false)
  const [flashCol,   setFlashCol]   = useState(null)   // 'correct' | 'wrong'
  const [flashSide,  setFlashSide]  = useState(null)   // 0 | 1 (which column flashed)
  const [shaking,    setShaking]    = useState(false)
  const [animKey,    setAnimKey]    = useState(0)
  const [done,       setDone]       = useState(false)
  const [lastExpl,   setLastExpl]   = useState('')

  const locked    = useRef(false)
  const startX    = useRef(0)
  const cardRef   = useRef(null)

  const totalCards = items.length
  const remaining  = totalCards - cardIdx
  const cur        = items[cardIdx] ?? null

  const leftCol  = columns[0] ?? { label: 'Left',  color: accent }
  const rightCol = columns[1] ?? { label: 'Right', color: '#9D5CFF' }

  // Drag side: negative = left (supernatural), positive = right (natural)
  const dragSide = dragX < -SWIPE_THRESHOLD ? 0 : dragX > SWIPE_THRESHOLD ? 1 : null

  // Touch/mouse handlers
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

  // Also support mouse for desktop
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

    const correct = cur.col === chosenCol

    if (correct) {
      setFlashCol('correct')
      setFlashSide(chosenCol)
      setLastExpl(cur.explanation ?? '')
      setTimeout(() => {
        setFlashCol(null)
        setFlashSide(null)
        setDragX(0)
        if (cardIdx + 1 >= totalCards) {
          setDone(true)
        } else {
          setCardIdx(i => i + 1)
          setAnimKey(k => k + 1)
        }
        locked.current = false
      }, 900)
    } else {
      setFlashCol('wrong')
      setShaking(true)
      setTimeout(() => {
        setFlashCol(null)
        setShaking(false)
        setDragX(0)
        locked.current = false
      }, 560)
    }
  }

  // Column button tap (alternative to swipe)
  function tapColumn(colIdx) {
    if (locked.current || done) return
    commitChoice(colIdx)
  }

  const cardRotate  = dragging ? dragX * 0.045 : 0
  const cardOpacity = Math.max(0.4, 1 - Math.abs(dragX) / 380)

  if (done) {
    return (
      <div style={{
        position: 'fixed', inset: 0,
        background: '#08090D',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '32px 28px',
        animation: 'ss-done-in 520ms cubic-bezier(.22,1,.36,1) both',
      }}>
        {/* Split background */}
        <div style={{ position: 'fixed', inset: 0, display: 'flex', zIndex: 0 }}>
          <div style={{
            flex: 1,
            backgroundImage: `url(/swipe-supernatural.png)`,
            backgroundSize: 'cover', backgroundPosition: 'center top',
            opacity: 0.18, filter: 'grayscale(30%) brightness(0.6)',
          }} />
          <div style={{
            flex: 1,
            backgroundImage: `url(/swipe-natural.png)`,
            backgroundSize: 'cover', backgroundPosition: 'center top',
            opacity: 0.18, filter: 'grayscale(30%) brightness(0.6)',
          }} />
        </div>
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(8,9,13,0.72)', zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 400 }}>
          <div style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: 800,
            fontSize: 'clamp(26px, 7vw, 34px)',
            color: accent,
            marginBottom: 20,
            lineHeight: 1.2,
          }}>
            All sorted.
          </div>

          {lastExpl && (
            <div style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 500,
              fontSize: 15,
              color: 'rgba(245,245,245,0.60)',
              lineHeight: 1.65,
              marginBottom: 28,
              padding: '14px 18px',
              background: `rgba(${accentRgb},0.07)`,
              borderRadius: 14,
              border: `1px solid rgba(${accentRgb},0.16)`,
            }}>
              {lastExpl}
            </div>
          )}

          {explanation && (
            <div style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 500,
              fontSize: 16,
              color: 'rgba(245,245,245,0.80)',
              lineHeight: 1.65,
              marginBottom: 40,
            }}>
              {explanation}
            </div>
          )}

          <div style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: 700,
            fontSize: 16,
            color: accent,
            padding: '14px 32px',
            background: `rgba(${accentRgb},0.12)`,
            borderRadius: 50,
            border: `1px solid rgba(${accentRgb},0.30)`,
            display: 'inline-block',
            cursor: 'pointer',
          }}
            onClick={onComplete}
          >
            Continue →
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#08090D',
      overflow: 'hidden',
      userSelect: 'none', WebkitUserSelect: 'none',
    }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Split background: left=supernatural, right=natural */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', zIndex: 0 }}>
        <div style={{
          flex: 1,
          backgroundImage: `url(/swipe-supernatural.png)`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          opacity: dragX < -20 ? 0.42 : 0.22,
          filter: 'grayscale(20%) brightness(0.55)',
          transition: dragging ? 'none' : 'opacity 0.4s ease',
        }} />
        <div style={{
          flex: 1,
          backgroundImage: `url(/swipe-natural.png)`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          opacity: dragX > 20 ? 0.42 : 0.22,
          filter: 'grayscale(20%) brightness(0.55)',
          transition: dragging ? 'none' : 'opacity 0.4s ease',
        }} />
      </div>

      {/* Dark overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,9,13,0.66)', zIndex: 1 }} />

      {/* Column labels — fixed sides */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', zIndex: 3,
      }}>
        {/* Left label */}
        <div style={{
          flex: 1,
          padding: '52px 18px 18px',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          opacity: dragX < -20 ? 1 : 0.48,
          transition: dragging ? 'none' : 'opacity 0.3s',
        }}>
          {leftCol.label.split('\n').map((line, i) => (
            <div key={i} style={{
              fontFamily: i === 0 ? 'Sora, sans-serif' : 'Outfit, sans-serif',
              fontWeight: i === 0 ? 700 : 500,
              fontSize: i === 0 ? 13 : 11,
              color: i === 0 ? leftCol.color ?? '#9D5CFF' : 'rgba(245,245,245,0.55)',
              letterSpacing: i === 0 ? '0.08em' : '0.06em',
              textTransform: 'uppercase',
              lineHeight: 1.3,
            }}>{line}</div>
          ))}
        </div>
        {/* Divider */}
        <div style={{ width: 1, background: 'rgba(255,255,255,0.08)', marginTop: 52 }} />
        {/* Right label */}
        <div style={{
          flex: 1,
          padding: '52px 18px 18px',
          display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right',
          opacity: dragX > 20 ? 1 : 0.48,
          transition: dragging ? 'none' : 'opacity 0.3s',
        }}>
          {rightCol.label.split('\n').map((line, i) => (
            <div key={i} style={{
              fontFamily: i === 0 ? 'Sora, sans-serif' : 'Outfit, sans-serif',
              fontWeight: i === 0 ? 700 : 500,
              fontSize: i === 0 ? 13 : 11,
              color: i === 0 ? rightCol.color ?? accent : 'rgba(245,245,245,0.55)',
              letterSpacing: i === 0 ? '0.08em' : '0.06em',
              textTransform: 'uppercase',
              lineHeight: 1.3,
            }}>{line}</div>
          ))}
        </div>
      </div>

      {/* Card stack — ghost cards behind */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 4,
        paddingTop: 140,
        paddingBottom: 200,
      }}>
        {/* Ghost card 2 (deepest) */}
        {remaining > 2 && (
          <div style={{
            position: 'absolute',
            width: 'min(84vw, 340px)',
            height: 'min(48vw, 190px)',
            background: 'rgba(255,255,255,0.04)',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.07)',
            transform: 'translateY(20px) scale(0.90)',
          }} />
        )}
        {/* Ghost card 1 */}
        {remaining > 1 && (
          <div style={{
            position: 'absolute',
            width: 'min(84vw, 340px)',
            height: 'min(48vw, 190px)',
            background: 'rgba(255,255,255,0.06)',
            borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.10)',
            transform: 'translateY(10px) scale(0.95)',
          }} />
        )}

        {/* Active card */}
        {cur && (
          <div
            key={animKey}
            ref={cardRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            style={{
              position: 'relative',
              width: 'min(84vw, 340px)',
              background: 'rgba(20,21,28,0.92)',
              borderRadius: 20,
              border: `1px solid rgba(255,255,255,${Math.abs(dragX) > 20 ? 0.18 : 0.12})`,
              padding: '28px 24px',
              cursor: dragging ? 'grabbing' : 'grab',
              transform: `translateX(${dragX}px) rotate(${cardRotate}deg)`,
              opacity: cardOpacity,
              animation: shaking
                ? 'ss-wrong-pulse 480ms ease both'
                : `ss-card-in 400ms cubic-bezier(.22,1,.36,1) both`,
              transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(.22,1,.36,1), opacity 0.3s',
              boxShadow: dragX < -SWIPE_THRESHOLD
                ? `0 0 40px rgba(157,92,255,0.35), 0 8px 32px rgba(0,0,0,0.6)`
                : dragX > SWIPE_THRESHOLD
                  ? `0 0 40px rgba(${accentRgb},0.35), 0 8px 32px rgba(0,0,0,0.6)`
                  : `0 8px 32px rgba(0,0,0,0.5)`,
            }}
          >
            <div style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(16px, 4.5vw, 19px)',
              color: 'rgba(245,245,245,0.94)',
              lineHeight: 1.4,
              textAlign: 'center',
            }}>
              {cur.label}
            </div>
          </div>
        )}
      </div>

      {/* Correct flash overlay */}
      {flashCol === 'correct' && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          background: flashSide === 1
            ? `rgba(${accentRgb},0.22)`
            : 'rgba(157,92,255,0.22)',
          animation: 'ss-correct-flash 820ms ease both',
          pointerEvents: 'none',
        }} />
      )}

      {/* Wrong flash overlay */}
      {flashCol === 'wrong' && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          background: 'rgba(220,60,60,0.14)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Progress counter */}
      <div style={{
        position: 'absolute', top: 52, left: '50%', transform: 'translateX(-50%)',
        zIndex: 5,
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 600,
        fontSize: 12,
        color: 'rgba(245,245,245,0.38)',
        letterSpacing: '0.10em',
      }}>
        {cardIdx + 1} / {totalCards}
      </div>

      {/* Bottom column tap buttons */}
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
            background: dragX < -SWIPE_THRESHOLD
              ? `rgba(157,92,255,0.22)`
              : 'rgba(255,255,255,0.03)',
            border: 'none',
            borderTop: `1px solid rgba(255,255,255,0.08)`,
            borderRight: `1px solid rgba(255,255,255,0.06)`,
            color: leftCol.color ?? '#9D5CFF',
            fontFamily: 'Sora, sans-serif',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            letterSpacing: '0.06em',
            transition: 'background 0.2s',
          }}
        >
          ← SUPERNATURAL
        </button>
        <button
          onClick={() => tapColumn(1)}
          style={{
            flex: 1,
            padding: '18px 16px',
            background: dragX > SWIPE_THRESHOLD
              ? `rgba(${accentRgb},0.22)`
              : 'rgba(255,255,255,0.03)',
            border: 'none',
            borderTop: `1px solid rgba(255,255,255,0.08)`,
            color: rightCol.color ?? accent,
            fontFamily: 'Sora, sans-serif',
            fontWeight: 700,
            fontSize: 13,
            cursor: 'pointer',
            letterSpacing: '0.06em',
            transition: 'background 0.2s',
          }}
        >
          RATIONAL →
        </button>
      </div>

      {/* Swipe hint text */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        left: '50%', transform: 'translateX(-50%)',
        zIndex: 5,
        fontFamily: 'Outfit, sans-serif',
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
  )
}
