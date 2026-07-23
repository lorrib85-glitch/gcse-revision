import { useState, useRef } from 'react'
import { SUBJECTS, hexToRgb } from '../../constants/subjects.js'
// CinematicShell used here because the split full-bleed background and swipe gesture
// zone must reach all four viewport edges; InteractionShell's padding would clip the
// split surface and break gesture hit areas near the screen edges.
import CinematicShell from '../layout/CinematicShell.jsx'
import ContinueCTA from '../core/ContinueCTA.jsx'
import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { MOTION } from '../../constants/motion.js'
import { ScreenTitle } from '../core/ScreenText.jsx'

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
@media (prefers-reduced-motion: reduce) {
  [data-swipe-sort],
  [data-swipe-sort] *,
  [data-swipe-sort] *::before,
  [data-swipe-sort] *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
`

function injectStyles() {
  if (document.getElementById('swipesort-css')) return
  const style = document.createElement('style')
  style.id = 'swipesort-css'
  style.textContent = CSS
  document.head.appendChild(style)
}

function splitLabel(column) {
  if (column?.title || column?.detail) {
    return {
      title: String(column.title || column.label || ''),
      detail: String(column.detail || ''),
    }
  }

  const [title = '', ...detailLines] = String(column?.label || '').split('\n')
  return { title, detail: detailLines.join(' ') }
}

function resolveColumn(column, index, subjectData) {
  const fallbackColor = index === 0
    ? (subjectData.accentSecondary || GENERAL.slate)
    : subjectData.accent
  const color = column?.color || fallbackColor
  const colorRgb = column?.colorRgb || hexToRgb(color)

  return {
    ...column,
    label: column?.label || (index === 0 ? 'Category one' : 'Category two'),
    color,
    colorRgb,
    bg: column?.bg || `rgba(${colorRgb},0.10)`,
    image: column?.image || null,
  }
}

function columnBackdrop(column, subjectData, side, brightness) {
  if (column.image) {
    return {
      backgroundImage: `url(${column.image})`,
      backgroundSize: column.backgroundSize || 'cover',
      backgroundPosition: column.backgroundPosition || 'center top',
      filter: `saturate(0.96) brightness(${brightness})`,
    }
  }

  const focalPoint = side === 0 ? '28% 26%' : '72% 26%'
  return {
    background: `radial-gradient(circle at ${focalPoint}, rgba(${column.colorRgb},0.24), transparent 42%), linear-gradient(180deg, ${subjectData.backgroundSecondary}, ${subjectData.background})`,
  }
}

function BackgroundLayer({ leftCol, rightCol, subjectData, focusSide = null, intro = false }) {
  const leftActive = focusSide === 0
  const rightActive = focusSide === 1
  const baseOpacity = intro ? 0.78 : 0.88
  const leftBrightness = intro ? BACKGROUND_BRIGHTNESS.intro : BACKGROUND_BRIGHTNESS.gameLeft
  const rightBrightness = intro ? BACKGROUND_BRIGHTNESS.intro : BACKGROUND_BRIGHTNESS.gameRight
  const backgroundRgb = hexToRgb(subjectData.background)

  return (
    <>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', zIndex: 0 }}>
        <div style={{
          flex: 1,
          ...columnBackdrop(leftCol, subjectData, 0, leftBrightness),
          opacity: leftActive ? 0.94 : baseOpacity,
          transition: 'opacity 0.26s ease, filter 0.26s ease',
        }} />
        <div style={{
          flex: 1,
          ...columnBackdrop(rightCol, subjectData, 1, rightBrightness),
          opacity: rightActive ? 0.94 : baseOpacity,
          transition: 'opacity 0.26s ease, filter 0.26s ease',
        }} />
      </div>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: intro ? `rgba(${backgroundRgb},0.38)` : `rgba(${backgroundRgb},0.20)`,
        zIndex: 1,
      }} />
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        background: intro
          ? `radial-gradient(ellipse 86% 70% at 50% 48%, transparent 32%, rgba(${backgroundRgb},0.58) 100%)`
          : `linear-gradient(180deg, rgba(${backgroundRgb},0.46) 0%, rgba(${backgroundRgb},0.08) 35%, rgba(${backgroundRgb},0.14) 66%, rgba(${backgroundRgb},0.52) 100%)`,
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: '50%',
        width: 1,
        zIndex: 2,
        pointerEvents: 'none',
        background: `linear-gradient(180deg, transparent 0%, ${GENERAL.line.soft} 25%, ${GENERAL.line.strong} 50%, ${GENERAL.line.soft} 75%, transparent 100%)`,
      }} />
    </>
  )
}

export default function SwipeSort({ block = {}, subject = 'History', onComplete }) {
  injectStyles()

  const subjectData = SUBJECTS[subject] || SUBJECTS.History
  const {
    accent,
    accentRgb,
    background = GENERAL.backgroundApp,
    backgroundSecondary = GENERAL.backgroundSurface,
  } = subjectData
  const backgroundRgb = hexToRgb(background)
  const backgroundSecondaryRgb = hexToRgb(backgroundSecondary)
  const incorrectRgb = GENERAL.feedbackIncorrectRgb

  const {
    columns = [],
    items: rawItems = [],
    explanation = '',
    introTitle = 'Sort the ideas',
    introText = 'Decide which category each item belongs to.',
    gameTitle = 'Choose the category',
    gamePrompt = 'Where does this item belong?',
    startLabel = 'Start sorting',
    completionTitle = 'All sorted.',
    interactionHint = 'Swipe the card or tap a side',
    reducedMotionHint = 'Tap a side to sort',
  } = block

  const [items] = useState(() => {
    const shuffled = [...rawItems]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  })

  const [reduceMotion] = useState(() =>
    typeof window !== 'undefined'
      && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
  const [phase, setPhase] = useState('intro')
  const [cardIdx, setCardIdx] = useState(0)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [flashCol, setFlashCol] = useState(null)
  const [shaking, setShaking] = useState(false)
  const [flyDir, setFlyDir] = useState(null)
  const [animKey, setAnimKey] = useState(0)
  const [done, setDone] = useState(false)
  const [lastExpl, setLastExpl] = useState('')

  const locked = useRef(false)
  const startX = useRef(0)
  const cardRef = useRef(null)

  const totalCards = items.length
  const remaining = totalCards - cardIdx
  const cur = items[cardIdx] || null

  const leftCol = resolveColumn(columns[0], 0, subjectData)
  const rightCol = resolveColumn(columns[1], 1, subjectData)
  const resolvedColumns = [leftCol, rightCol]
  const leftText = splitLabel(leftCol)
  const rightText = splitLabel(rightCol)
  const dragSide = dragX < -SWIPE_THRESHOLD ? 0 : dragX > SWIPE_THRESHOLD ? 1 : null

  function onTouchStart(event) {
    if (reduceMotion || locked.current) return
    startX.current = event.touches[0].clientX
    setDragging(true)
    setDragX(0)
  }

  function onTouchMove(event) {
    if (reduceMotion || !dragging || locked.current) return
    event.preventDefault()
    setDragX(event.touches[0].clientX - startX.current)
  }

  function onTouchEnd() {
    if (reduceMotion || !dragging || locked.current) return
    setDragging(false)
    if (dragSide !== null) commitChoice(dragSide)
    else setDragX(0)
  }

  function onMouseDown(event) {
    if (reduceMotion || locked.current) return
    startX.current = event.clientX
    setDragging(true)
    setDragX(0)
  }

  function onMouseMove(event) {
    if (reduceMotion || !dragging || locked.current) return
    setDragX(event.clientX - startX.current)
  }

  function onMouseUp() {
    if (reduceMotion || !dragging || locked.current) return
    setDragging(false)
    if (dragSide !== null) commitChoice(dragSide)
    else setDragX(0)
  }

  function advanceCard() {
    setFlashCol(null)
    setFlyDir(null)
    if (cardIdx + 1 >= totalCards) {
      setDone(true)
    } else {
      setCardIdx(index => index + 1)
      setAnimKey(key => key + 1)
    }
    locked.current = false
  }

  function commitChoice(chosenCol) {
    if (!cur || locked.current) return
    locked.current = true
    setDragging(false)

    const correct = cur.col === chosenCol

    if (correct) {
      setLastExpl(cur.explanation || '')
      setFlashCol(chosenCol)
      setDragX(0)

      if (reduceMotion) {
        setTimeout(advanceCard, MOTION.stagger.standardMs)
        return
      }

      setFlyDir(chosenCol === 0 ? 'left' : 'right')
      setTimeout(advanceCard, 520)
      return
    }

    setFlashCol('wrong')
    setDragX(0)

    if (reduceMotion) {
      setTimeout(() => {
        setFlashCol(null)
        locked.current = false
      }, MOTION.stagger.standardMs)
      return
    }

    setShaking(true)
    setTimeout(() => {
      setFlashCol(null)
      setShaking(false)
      locked.current = false
    }, 560)
  }

  function tapColumn(columnIndex) {
    if (locked.current || done) return
    commitChoice(columnIndex)
  }

  const cardRotate = reduceMotion ? 0 : dragging ? dragX * 0.035 : 0
  const cardTransform = reduceMotion
    ? 'translateX(0)'
    : flyDir === 'left'
      ? 'translateX(-115vw) rotate(-16deg)'
      : flyDir === 'right'
        ? 'translateX(115vw) rotate(16deg)'
        : `translateX(${dragX}px) rotate(${cardRotate}deg)`

  const cardTransition = reduceMotion
    ? 'none'
    : flyDir
      ? 'transform 0.44s cubic-bezier(.4,0,.2,1), opacity 0.44s'
      : dragging
        ? 'box-shadow 0.12s'
        : 'transform 0.32s cubic-bezier(.22,1,.36,1), opacity 0.28s, box-shadow 0.2s'

  const cardOpacity = reduceMotion ? 1 : flyDir ? 0 : Math.max(0.42, 1 - Math.abs(dragX) / 420)
  const correctColumn = typeof flashCol === 'number' ? resolvedColumns[flashCol] : null

  const cardGlow = correctColumn
    ? `0 0 44px rgba(${correctColumn.colorRgb},0.55), 0 0 92px rgba(${correctColumn.colorRgb},0.18), 0 14px 48px rgba(0,0,0,0.70)`
    : flashCol === 'wrong'
      ? `0 0 44px rgba(${incorrectRgb},0.52), 0 0 80px rgba(${incorrectRgb},0.16), 0 14px 48px rgba(0,0,0,0.70)`
      : dragX < -SWIPE_THRESHOLD
        ? `0 0 42px rgba(${leftCol.colorRgb},0.38), 0 14px 48px rgba(0,0,0,0.62)`
        : dragX > SWIPE_THRESHOLD
          ? `0 0 42px rgba(${rightCol.colorRgb},0.38), 0 14px 48px rgba(0,0,0,0.62)`
          : '0 14px 48px rgba(0,0,0,0.58)'

  if (phase === 'intro') {
    return (
      <CinematicShell
        data-swipe-sort="true"
        style={{
          background,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <BackgroundLayer leftCol={leftCol} rightCol={rightCol} subjectData={subjectData} intro />

        <div style={{
          position: 'relative',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '30px 24px',
          maxWidth: 420,
          width: '100%',
        }}>
          <ScreenTitle style={{
            color: GENERAL.cinematic.textPrimary,
            textShadow: GENERAL.cinematic.actionShadow,
            textAlign: 'center',
            animation: 'ss-intro-in 560ms cubic-bezier(.22,1,.36,1) both',
          }}>
            {introTitle}
          </ScreenTitle>

          <div style={{
            ...TYPE.body,
            color: GENERAL.cinematic.textSecondary,
            textAlign: 'center',
            maxWidth: 330,
            marginBottom: 28,
            animation: 'ss-intro-in 500ms cubic-bezier(.22,1,.36,1) 90ms both',
          }}>
            {introText}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%', marginBottom: 34 }}>
            <div style={{
              background: `rgba(${backgroundSecondaryRgb},0.72)`,
              border: `1px solid rgba(${leftCol.colorRgb},0.34)`,
              borderRadius: 18,
              padding: '18px 14px',
              textAlign: 'center',
              backdropFilter: 'blur(8px)',
              animation: 'ss-intro-left 480ms cubic-bezier(.22,1,.36,1) 90ms both',
            }}>
              <div style={{ ...TYPE.metadata, color: leftCol.color, marginBottom: leftText.detail ? 8 : 0 }}>{leftText.title}</div>
              {leftText.detail && <div style={{ ...TYPE.caption, color: GENERAL.cinematic.textMuted }}>{leftText.detail}</div>}
            </div>
            <div style={{
              background: `rgba(${backgroundSecondaryRgb},0.72)`,
              border: `1px solid rgba(${rightCol.colorRgb},0.36)`,
              borderRadius: 18,
              padding: '18px 14px',
              textAlign: 'center',
              backdropFilter: 'blur(8px)',
              animation: 'ss-intro-right 480ms cubic-bezier(.22,1,.36,1) 130ms both',
            }}>
              <div style={{ ...TYPE.metadata, color: rightCol.color, marginBottom: rightText.detail ? 8 : 0 }}>{rightText.title}</div>
              {rightText.detail && <div style={{ ...TYPE.caption, color: GENERAL.cinematic.textMuted }}>{rightText.detail}</div>}
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
      <CinematicShell
        data-swipe-sort="true"
        style={{
          background,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          animation: 'ss-done-in 520ms cubic-bezier(.22,1,.36,1) both',
        }}
      >
        <BackgroundLayer leftCol={leftCol} rightCol={rightCol} subjectData={subjectData} intro />

        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', maxWidth: 400, width: '100%' }}>
          <ScreenTitle style={{
            color: GENERAL.cinematic.textPrimary,
            textShadow: GENERAL.cinematic.actionShadow,
            margin: '0 auto 20px',
            animation: 'ss-done-in 520ms cubic-bezier(.22,1,.36,1) 0ms both',
          }}>
            {completionTitle}
          </ScreenTitle>

          {lastExpl && (
            <div style={{
              ...TYPE.bodySmall,
              color: GENERAL.cinematic.textSecondary,
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
              color: GENERAL.cinematic.textSecondary,
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
    <CinematicShell
      data-swipe-sort="true"
      style={{
        background,
        animation: 'ss-game-in 360ms ease both',
      }}
    >
      <div
        style={{ position: 'absolute', inset: 0, userSelect: 'none', WebkitUserSelect: 'none' }}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <BackgroundLayer
          leftCol={leftCol}
          rightCol={rightCol}
          subjectData={subjectData}
          focusSide={dragSide}
        />

        <div style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute',
            left: 22,
            right: 22,
            top: 'calc(env(safe-area-inset-top, 0px) + 74px)',
            textAlign: 'center',
          }}>
            <div style={{
              ...TYPE.displaySection,
              color: GENERAL.cinematic.textPrimary,
              textShadow: GENERAL.cinematic.actionShadow,
              marginBottom: 6,
            }}>
              {gameTitle}
            </div>
            <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted }}>
              {gamePrompt}
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label={`Sort into ${leftText.title}`}
          onClick={() => tapColumn(0)}
          style={{
            position: 'absolute',
            left: 18,
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 30px)',
            width: 'calc(50% - 28px)',
            minHeight: 82,
            zIndex: 5,
            background: dragSide === 0 ? leftCol.bg : `rgba(${backgroundSecondaryRgb},0.76)`,
            border: `1px solid rgba(${leftCol.colorRgb},${dragSide === 0 ? 0.50 : 0.26})`,
            borderRadius: 20,
            color: leftCol.color,
            cursor: 'pointer',
            boxShadow: dragSide === 0 ? `0 0 30px rgba(${leftCol.colorRgb},0.20)` : '0 12px 30px rgba(0,0,0,0.28)',
            backdropFilter: 'blur(10px)',
            transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
            textAlign: 'center',
            padding: '14px 10px',
          }}
        >
          <div style={{ ...TYPE.button, marginBottom: leftText.detail ? 5 : 0 }}>← {leftText.title}</div>
          {leftText.detail && <div style={{ ...TYPE.caption, color: GENERAL.cinematic.textMuted }}>{leftText.detail}</div>}
        </button>

        <button
          type="button"
          aria-label={`Sort into ${rightText.title}`}
          onClick={() => tapColumn(1)}
          style={{
            position: 'absolute',
            right: 18,
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 30px)',
            width: 'calc(50% - 28px)',
            minHeight: 82,
            zIndex: 5,
            background: dragSide === 1 ? rightCol.bg : `rgba(${backgroundSecondaryRgb},0.76)`,
            border: `1px solid rgba(${rightCol.colorRgb},${dragSide === 1 ? 0.50 : 0.26})`,
            borderRadius: 20,
            color: rightCol.color,
            cursor: 'pointer',
            boxShadow: dragSide === 1 ? `0 0 30px rgba(${rightCol.colorRgb},0.20)` : '0 12px 30px rgba(0,0,0,0.28)',
            backdropFilter: 'blur(10px)',
            transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
            textAlign: 'center',
            padding: '14px 10px',
          }}
        >
          <div style={{ ...TYPE.button, marginBottom: rightText.detail ? 5 : 0 }}>{rightText.title} →</div>
          {rightText.detail && <div style={{ ...TYPE.caption, color: GENERAL.cinematic.textMuted }}>{rightText.detail}</div>}
        </button>

        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `linear-gradient(180deg, ${backgroundSecondary}, ${background})`,
                  borderRadius: 24,
                  border: `1px solid ${Math.abs(dragX) > 20 ? GENERAL.line.strong : GENERAL.line.medium}`,
                  padding: '26px 24px',
                  cursor: reduceMotion ? 'default' : dragging ? 'grabbing' : 'grab',
                  transform: cardTransform,
                  opacity: cardOpacity,
                  animation: reduceMotion
                    ? 'none'
                    : shaking
                      ? 'ss-shake 520ms ease both'
                      : 'ss-card-in 360ms cubic-bezier(.22,1,.36,1) both',
                  transition: shaking ? 'none' : cardTransition,
                  boxShadow: cardGlow,
                }}
              >
                <div style={{
                  ...TYPE.displayHero,
                  fontSize: 'clamp(24px, 6.8vw, 34px)',
                  color: GENERAL.cinematic.textPrimary,
                  textAlign: 'center',
                  textShadow: GENERAL.cinematic.actionShadow,
                }}>
                  {cur.label}
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 126px)',
          zIndex: 5,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            ...TYPE.caption,
            color: GENERAL.cinematic.textMuted,
            background: `rgba(${backgroundRgb},0.64)`,
            border: `1px solid ${GENERAL.line.soft}`,
            borderRadius: 999,
            padding: '8px 12px',
            backdropFilter: 'blur(8px)',
          }}>
            {remaining} left · {reduceMotion ? reducedMotionHint : interactionHint}
          </div>
        </div>

        {correctColumn && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            background: `radial-gradient(ellipse at center, rgba(${correctColumn.colorRgb},0.26), rgba(${correctColumn.colorRgb},0.04) 55%, transparent 75%)`,
            animation: 'ss-glow-correct 480ms ease both',
            pointerEvents: 'none',
          }} />
        )}

        {flashCol === 'wrong' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            background: `rgba(${incorrectRgb},0.18)`,
            animation: 'ss-glow-wrong 540ms ease both',
            pointerEvents: 'none',
          }} />
        )}
      </div>
    </CinematicShell>
  )
}
