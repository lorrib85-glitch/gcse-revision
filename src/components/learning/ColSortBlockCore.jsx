import { useEffect, useRef, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { ScreenTitle } from '../core/ScreenText.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'

const CSS = `
  @keyframes csb-card-in {
    from { opacity: 0; transform: translateY(12px) scale(0.985); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes csb-tile-in {
    from { opacity: 0; transform: translateY(7px) scale(0.985); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes csb-explanation-in {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes csb-complete-in {
    from { opacity: 0; transform: translateY(9px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes csb-shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-5px); }
    40% { transform: translateX(5px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(3px); }
  }

  .csb-tray {
    -webkit-tap-highlight-color: transparent;
  }

  .csb-tray:not(:disabled):active {
    transform: translateY(1px) scale(0.99);
  }

  .csb-tray:focus-visible,
  .csb-current-card:focus-visible {
    outline: 2px solid var(--csb-focus);
    outline-offset: 3px;
  }

  .csb-current-card {
    -webkit-tap-highlight-color: transparent;
    touch-action: none;
    user-select: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .csb-tray,
    .csb-current-card,
    .csb-sorted-tile,
    .csb-recent-explanation,
    .csb-completion {
      animation: none !important;
      transition: none !important;
    }
  }
`

function splitColumnLabel(column) {
  const [title = '', ...detailLines] = String(column?.label ?? '').split('\n')
  return {
    title,
    detail: column?.description ?? detailLines.join(' '),
  }
}

function withAlpha(color, alpha) {
  return /^#[0-9a-f]{6}$/i.test(color ?? '') ? `${color}${alpha}` : color
}

function ColumnIcon({ name = 'group' }) {
  const shared = {
    width: 21,
    height: 21,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.65,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  if (name === 'change' || name === 'scales') {
    return (
      <svg {...shared}>
        <path d="M12 4v16M7 6h10M6 9l-3 6h6L6 9Zm12 0-3 6h6l-3-6Z" />
        <path d="M8.5 20h7" />
      </svg>
    )
  }

  if (name === 'continuity' || name === 'pillar') {
    return (
      <svg {...shared}>
        <path d="M5 8h14M6.5 8v9M10 8v9M14 8v9M17.5 8v9M4 19h16M7 5h10l2 3H5l2-3Z" />
      </svg>
    )
  }

  if (name === 'marxist' || name === 'factory') {
    return (
      <svg {...shared}>
        <path d="M4 20V10l5 3V9l5 3V5h3v15H4Z" />
        <path d="M7 17h2M12 17h2M17 17h1" />
      </svg>
    )
  }

  if (name === 'functionalist' || name === 'network') {
    return (
      <svg {...shared}>
        <circle cx="12" cy="6" r="2" />
        <circle cx="6" cy="17" r="2" />
        <circle cx="18" cy="17" r="2" />
        <path d="m11 8-4 7M13 8l4 7M8 17h8" />
      </svg>
    )
  }

  if (name === 'value' || name === 'star') {
    return (
      <svg {...shared}>
        <path d="m12 3 2.6 5.3 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.9L12 3Z" />
      </svg>
    )
  }

  if (name === 'norm' || name === 'check') {
    return (
      <svg {...shared}>
        <path d="M5 12.5 9.2 17 19 7" />
      </svg>
    )
  }

  return (
    <svg {...shared}>
      <rect x="4" y="5" width="16" height="14" rx="2" />
      <path d="M8 9h8M8 13h5" />
    </svg>
  )
}

export default function ColSortBlock({ block, subject = 'Biology', onComplete }) {
  const subj = SUBJECTS[subject] || SUBJECTS.Biology
  const accent = subj.accent
  const frameColor = subj.accentSecondary || accent
  const rgb = subj.accentRgb

  const items = block.items || []
  const columns = block.columns || []

  const [cursor, setCursor] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [placed, setPlaced] = useState(() => columns.map(() => []))
  const [done, setDone] = useState(items.length === 0)
  const [drag, setDrag] = useState({ active: false, x: 0, y: 0 })
  const [hoverCol, setHoverCol] = useState(null)
  const [snapTarget, setSnapTarget] = useState(null)
  const [recentItem, setRecentItem] = useState(null)

  const timerRef = useRef(null)
  const settleTimerRef = useRef(null)
  const lockedRef = useRef(false)
  const completedRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const cardStartRectRef = useRef(null)
  const cardRef = useRef(null)
  const trayRefs = useRef([])

  const cur = items[cursor] ?? null
  const title = block.title || block.question || 'Sort the evidence'
  const subtitle = block.subtitle || block.instruction || 'Sort each statement into the right group.'
  const progressIndex = done ? Math.max(items.length - 1, 0) : cursor
  const progressCompleted = done ? Math.max(items.length - 1, 0) : cursor

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current)
  }, [])

  function finish(nextPlaced, finalItem, colIdx) {
    setPlaced(nextPlaced)
    setRecentItem({ item: finalItem, colIdx })
    setDone(true)
    setFeedback(null)
    setSnapTarget(null)
    setHoverCol(null)
    setDrag({ active: false, x: 0, y: 0 })
    lockedRef.current = false

    if (!completedRef.current) {
      completedRef.current = true
      onComplete?.({ placed: nextPlaced, total: items.length })
    }
  }

  function clearIncorrectFeedback() {
    setFeedback(null)
    setSnapTarget(null)
    setHoverCol(null)
    setDrag({ active: false, x: 0, y: 0 })
    lockedRef.current = false
  }

  function pick(colIdx, { dragged = false } = {}) {
    if (!cur || lockedRef.current || done) return

    setRecentItem(null)
    const correct = colIdx === cur.col

    if (!correct) {
      lockedRef.current = true
      setFeedback({
        type: 'wrong',
        colIdx,
        message: cur.wrongFeedback || 'Not quite — compare the two ideas and try again.',
      })

      if (dragged) {
        settleTimerRef.current = setTimeout(() => {
          setSnapTarget(null)
          setDrag({ active: false, x: 0, y: 0 })
        }, 220)
      }

      timerRef.current = setTimeout(clearIncorrectFeedback, 760)
      return
    }

    lockedRef.current = true
    setFeedback({ type: 'correct', colIdx })

    timerRef.current = setTimeout(() => {
      const placedItem = cur
      const nextPlaced = placed.map((columnItems, index) => (
        index === colIdx ? [...columnItems, placedItem] : columnItems
      ))
      const nextCursor = cursor + 1

      setSnapTarget(null)
      setHoverCol(null)
      setDrag({ active: false, x: 0, y: 0 })

      if (nextCursor >= items.length) {
        finish(nextPlaced, placedItem, colIdx)
        return
      }

      setPlaced(nextPlaced)
      setRecentItem({ item: placedItem, colIdx })
      setCursor(nextCursor)
      setFeedback(null)
      lockedRef.current = false
    }, dragged ? 600 : 720)
  }

  function columnAtPoint(clientX, clientY) {
    return trayRefs.current.findIndex(tray => {
      if (!tray) return false
      const rect = tray.getBoundingClientRect()
      return clientX >= rect.left && clientX <= rect.right
        && clientY >= rect.top && clientY <= rect.bottom
    })
  }

  function startDrag(event) {
    if (!cur || lockedRef.current || done) return
    if (event.pointerType === 'mouse' && event.button !== 0) return

    event.preventDefault()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    dragStartRef.current = { x: event.clientX, y: event.clientY }
    cardStartRectRef.current = cardRef.current?.getBoundingClientRect() ?? null
    setSnapTarget(null)
    setHoverCol(null)
    setDrag({ active: true, x: 0, y: 0 })
  }

  function moveDrag(event) {
    if (!drag.active || lockedRef.current) return

    event.preventDefault()
    const x = event.clientX - dragStartRef.current.x
    const y = event.clientY - dragStartRef.current.y
    setDrag({ active: true, x, y })

    const nextHover = columnAtPoint(event.clientX, event.clientY)
    setHoverCol(nextHover >= 0 ? nextHover : null)
  }

  function endDrag(event) {
    if (!drag.active || lockedRef.current) return

    event.preventDefault()
    event.currentTarget.releasePointerCapture?.(event.pointerId)

    const targetCol = columnAtPoint(event.clientX, event.clientY)
    setDrag(current => ({ ...current, active: false }))
    setHoverCol(null)

    if (targetCol < 0) {
      setDrag({ active: false, x: 0, y: 0 })
      return
    }

    const trayRect = trayRefs.current[targetCol]?.getBoundingClientRect()
    const cardRect = cardStartRectRef.current

    if (trayRect && cardRect) {
      setSnapTarget({
        x: trayRect.left + trayRect.width / 2 - (cardRect.left + cardRect.width / 2),
        y: trayRect.top + Math.min(trayRect.height * 0.58, 118) - (cardRect.top + cardRect.height / 2),
        correct: targetCol === cur.col,
      })
    }

    pick(targetCol, { dragged: true })
  }

  function cancelDrag(event) {
    event.currentTarget.releasePointerCapture?.(event.pointerId)
    setDrag({ active: false, x: 0, y: 0 })
    setHoverCol(null)
    setSnapTarget(null)
  }

  if (!columns.length) return null

  const cardTransform = snapTarget
    ? `translate3d(${snapTarget.x}px, ${snapTarget.y}px, 0) scale(${snapTarget.correct ? 0.82 : 0.94})`
    : `translate3d(${drag.x}px, ${drag.y}px, 0) rotate(${drag.active ? drag.x * 0.018 : 0}deg)`

  return (
    <section
      aria-label={title}
      style={{
        position: 'relative',
        overflow: 'hidden',
        margin: '10px 0 18px',
        padding: '20px 0 12px',
      }}
    >
      <style>{CSS}</style>

      {block.backgroundImage && (
        <div aria-hidden="true" style={{
          position: 'absolute',
          inset: '-30px -18px 0',
          pointerEvents: 'none',
          opacity: 0.18,
          backgroundImage: `linear-gradient(180deg, rgba(5,6,10,0.35), rgba(5,6,10,0.94) 72%, rgba(5,6,10,1)), url(${block.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: block.backgroundPosition || 'center top',
          maskImage: 'linear-gradient(to bottom, black 0%, black 54%, transparent 100%)',
        }} />
      )}

      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: '-20px -24px auto',
        height: 250,
        pointerEvents: 'none',
        background: `radial-gradient(circle at 18% 12%, rgba(${rgb},0.10), transparent 52%)`,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <header style={{ marginBottom: 22 }}>
          <ScreenTitle style={{
            color: GENERAL.cinematic.textPrimary,
            margin: 0,
          }}>
            {title}
          </ScreenTitle>

          <p style={{
            ...TYPE.bodyLarge,
            color: GENERAL.cinematic.textSecondary,
            margin: '10px 0 0',
            maxWidth: 'min(360px, 100%)',
          }}>
            {subtitle}
          </p>

          {!!items.length && (
            <SequenceProgress
              total={items.length}
              current={progressIndex}
              completed={progressCompleted}
              accent={accent}
              accentRgb={rgb}
              variant="sash"
              compact
              stretch
              ariaLabel="Sorting progress"
              style={{ width: '100%', marginTop: 20 }}
            />
          )}
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(Math.max(columns.length, 1), 2)}, minmax(0, 1fr))`,
          gap: 12,
          alignItems: 'start',
          marginBottom: done ? 20 : 18,
        }}>
          {columns.map((col, colIdx) => {
            const { title: columnTitle, detail } = splitColumnLabel(col)
            const color = col.color || accent
            const columnItems = placed[colIdx] || []
            const isCorrectTarget = feedback?.type === 'correct' && feedback.colIdx === colIdx
            const isWrongTarget = feedback?.type === 'wrong' && feedback.colIdx === colIdx
            const isDragTarget = drag.active && hoverCol === colIdx
            const isActive = isCorrectTarget || isDragTarget

            return (
              <button
                ref={node => { trayRefs.current[colIdx] = node }}
                className="csb-tray"
                key={`${columnTitle}-${colIdx}`}
                type="button"
                onClick={() => pick(colIdx)}
                disabled={done || lockedRef.current}
                aria-label={done ? columnTitle : `Sort ${cur?.label || 'this evidence'} into ${columnTitle}`}
                style={{
                  '--csb-focus': accent,
                  minWidth: 0,
                  minHeight: columnItems.length ? 164 : 150,
                  padding: '13px 11px 12px',
                  borderRadius: 17,
                  border: `1px solid ${withAlpha(frameColor, isActive ? 'C8' : '78')}`,
                  background: isActive
                    ? `linear-gradient(180deg, rgba(${rgb},0.11), rgba(8,9,13,0.78))`
                    : 'linear-gradient(180deg, rgba(255,255,255,0.025), rgba(8,9,13,0.74))',
                  boxShadow: isActive
                    ? `0 0 0 1px ${withAlpha(accent, '24')}, 0 0 22px ${withAlpha(accent, '18')}, inset 0 1px 0 rgba(255,255,255,0.06)`
                    : 'inset 0 1px 0 rgba(255,255,255,0.045), 0 8px 20px rgba(0,0,0,0.20)',
                  color: GENERAL.cinematic.textPrimary,
                  textAlign: 'left',
                  cursor: done || lockedRef.current ? 'default' : 'pointer',
                  opacity: feedback && feedback.colIdx !== colIdx ? 0.68 : 1,
                  transition: 'min-height 220ms ease, border-color 180ms ease, background 180ms ease, opacity 180ms ease, transform 160ms ease, box-shadow 180ms ease',
                  animation: isWrongTarget ? 'csb-shake 340ms ease' : 'none',
                  transform: isDragTarget ? 'translateY(-3px)' : undefined,
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  marginBottom: detail ? 8 : 12,
                }}>
                  <span aria-hidden="true" style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    color,
                    border: `1px solid ${withAlpha(color, isActive ? '88' : '48')}`,
                    background: `radial-gradient(circle at 35% 30%, ${withAlpha(color, '20')}, rgba(0,0,0,0.24))`,
                    boxShadow: isActive ? `0 0 16px ${withAlpha(color, '34')}` : 'none',
                  }}>
                    <ColumnIcon name={col.icon || (colIdx === 0 ? 'change' : 'continuity')} />
                  </span>

                  <span style={{
                    ...TYPE.titleMedium,
                    color,
                    overflowWrap: 'anywhere',
                  }}>
                    {columnTitle}
                  </span>
                </div>

                {detail && (
                  <div style={{
                    ...TYPE.caption,
                    color: GENERAL.cinematic.textMuted,
                    marginBottom: 10,
                    paddingLeft: 1,
                  }}>
                    {detail}
                  </div>
                )}

                {!columnItems.length ? (
                  <div style={{
                    minHeight: 62,
                    display: 'grid',
                    placeItems: 'center',
                    padding: 8,
                    borderRadius: 12,
                    border: `1px dashed ${withAlpha(frameColor, isDragTarget ? 'A0' : '38')}`,
                    ...TYPE.caption,
                    color: isDragTarget ? withAlpha(frameColor, 'E0') : GENERAL.cinematic.textSubtle,
                    textAlign: 'center',
                    transition: 'border-color 180ms ease, color 180ms ease',
                  }}>
                    {isDragTarget ? 'Release to place' : (col.emptyLabel || 'Drop here')}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {columnItems.map((item, itemIdx) => {
                      const isRecent = recentItem?.item === item && recentItem.colIdx === colIdx
                      return (
                        <div key={`${item.label}-${itemIdx}`}>
                          <div
                            className="csb-sorted-tile"
                            style={{
                              padding: '10px 10px 11px',
                              borderRadius: 11,
                              border: `1px solid ${withAlpha(color, isRecent ? '52' : '2E')}`,
                              background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.24))',
                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
                              animation: 'csb-tile-in 240ms ease both',
                            }}
                          >
                            <div style={{
                              ...TYPE.caption,
                              color: GENERAL.cinematic.textFact,
                              overflowWrap: 'anywhere',
                            }}>
                              {item.label}
                            </div>
                          </div>

                          {isRecent && item.explanation && (
                            <div
                              className="csb-recent-explanation"
                              style={{
                                ...TYPE.caption,
                                color: withAlpha(color, 'D8'),
                                padding: '7px 3px 1px',
                                animation: 'csb-explanation-in 220ms ease both',
                              }}
                            >
                              {item.explanation}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {!!columnItems.length && (
                  <div style={{
                    ...TYPE.caption,
                    color: withAlpha(frameColor, '96'),
                    marginTop: 11,
                    textAlign: 'center',
                  }}>
                    {columnItems.length} {columnItems.length === 1 ? 'item' : 'items'}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {!done && cur && (
          <div>
            <div
              ref={cardRef}
              key={`${cursor}-${cur.label}`}
              className="csb-current-card"
              role="group"
              aria-label={`Evidence to sort: ${cur.label}`}
              tabIndex={0}
              onPointerDown={startDrag}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={cancelDrag}
              style={{
                '--csb-focus': accent,
                position: 'relative',
                zIndex: drag.active || snapTarget ? 5 : 1,
                width: 'min(100%, 510px)',
                margin: '0 auto',
                padding: '17px 48px 17px 18px',
                borderRadius: 15,
                border: `1px solid ${feedback?.type === 'correct' ? accent : drag.active ? withAlpha(accent, '98') : GENERAL.line.strong}`,
                background: feedback?.type === 'correct'
                  ? `linear-gradient(180deg, rgba(${rgb},0.14), rgba(10,10,13,0.94))`
                  : 'linear-gradient(180deg, rgba(25,25,28,0.98), rgba(10,10,13,0.99))',
                boxShadow: drag.active
                  ? `${GENERAL.shadow.overlay}, 0 0 28px rgba(${rgb},0.18), inset 0 1px 0 rgba(255,255,255,0.07)`
                  : '0 11px 28px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.05)',
                animation: drag.active || snapTarget ? 'none' : 'csb-card-in 260ms ease both',
                transform: cardTransform,
                opacity: snapTarget?.correct ? 0.12 : 1,
                transition: drag.active
                  ? 'box-shadow 150ms ease, border-color 150ms ease'
                  : 'transform 300ms cubic-bezier(.22,1,.36,1), opacity 260ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease',
                cursor: drag.active ? 'grabbing' : 'grab',
                willChange: 'transform',
              }}
            >
              <div style={{
                ...TYPE.displayCard,
                color: feedback?.type === 'correct' ? accent : GENERAL.cinematic.textPrimary,
                textAlign: 'left',
                pointerEvents: 'none',
              }}>
                {cur.label}
              </div>

              <span aria-hidden="true" style={{
                position: 'absolute',
                right: 17,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 24,
                display: 'grid',
                gap: 4,
                pointerEvents: 'none',
              }}>
                {[0, 1, 2].map(line => (
                  <span key={line} style={{
                    display: 'block',
                    height: 1,
                    borderRadius: 2,
                    background: drag.active ? accent : GENERAL.cinematic.textMuted,
                  }} />
                ))}
              </span>
            </div>

            <div style={{
              ...TYPE.label,
              color: drag.active ? GENERAL.cinematic.textSecondary : accent,
              textAlign: 'center',
              marginTop: 10,
            }}>
              {drag.active ? 'Move over a column, then release' : 'Drag or tap to place'}
            </div>

            <div
              aria-live="polite"
              style={{
                minHeight: 26,
                paddingTop: 7,
                ...TYPE.bodySmall,
                color: feedback?.type === 'wrong'
                  ? GENERAL.feedbackIncorrect
                  : GENERAL.cinematic.textSubtle,
                textAlign: 'center',
              }}
            >
              {feedback?.type === 'wrong' ? feedback.message : ''}
            </div>
          </div>
        )}

        {done && (
          <div
            className="csb-completion"
            aria-live="polite"
            style={{
              position: 'relative',
              marginTop: 4,
              padding: '17px 18px 17px 20px',
              borderTop: `1px solid ${withAlpha(accent, '36')}`,
              borderBottom: `1px solid ${withAlpha(accent, '1F')}`,
              background: `linear-gradient(90deg, rgba(${rgb},0.07), transparent 72%)`,
              animation: 'csb-complete-in 320ms ease both',
            }}
          >
            <span aria-hidden="true" style={{
              position: 'absolute',
              inset: '0 auto 0 0',
              width: 2,
              background: accent,
              boxShadow: `0 0 16px rgba(${rgb},0.38)`,
            }} />

            <div style={{
              ...TYPE.displayCard,
              color: GENERAL.cinematic.textPrimary,
              marginBottom: block.explanation ? 8 : 0,
            }}>
              {block.conclusionTitle || 'Pattern complete'}
            </div>

            {block.explanation && (
              <div style={{
                ...TYPE.bodySmall,
                color: GENERAL.cinematic.textSecondary,
                maxWidth: 520,
              }}>
                {block.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
