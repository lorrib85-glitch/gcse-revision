import { useEffect, useRef, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'

const CSS = `
  @keyframes csb-card-in {
    from { opacity: 0; transform: translateY(12px) scale(0.985); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes csb-tile-in {
    from { opacity: 0; transform: translateY(7px); }
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
    transform: scale(0.985);
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
    .csb-sorted-tile {
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

export default function ColSortBlock({ block, subject = 'Biology', onComplete }) {
  const subj = SUBJECTS[subject] || SUBJECTS.Biology
  const accent = subj.accent
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

  const timerRef = useRef(null)
  const settleTimerRef = useRef(null)
  const lockedRef = useRef(false)
  const completedRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const cardStartRectRef = useRef(null)
  const cardRef = useRef(null)
  const trayRefs = useRef([])

  const cur = items[cursor] ?? null
  const sortedCount = placed.reduce((total, columnItems) => total + columnItems.length, 0)

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current)
  }, [])

  function finish(nextPlaced) {
    setPlaced(nextPlaced)
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

    const correct = colIdx === cur.col

    if (!correct) {
      lockedRef.current = true
      setFeedback({
        type: 'wrong',
        colIdx,
        message: cur.wrongFeedback || 'Not quite — compare the column definitions and try again.',
      })

      if (dragged) {
        settleTimerRef.current = setTimeout(() => {
          setSnapTarget(null)
          setDrag({ active: false, x: 0, y: 0 })
        }, 220)
      }

      timerRef.current = setTimeout(clearIncorrectFeedback, 720)
      return
    }

    lockedRef.current = true
    setFeedback({
      type: 'correct',
      colIdx,
      message: cur.explanation || 'That evidence belongs in this group.',
    })

    timerRef.current = setTimeout(() => {
      const nextPlaced = placed.map((columnItems, index) => (
        index === colIdx ? [...columnItems, cur] : columnItems
      ))
      const nextCursor = cursor + 1

      setSnapTarget(null)
      setHoverCol(null)
      setDrag({ active: false, x: 0, y: 0 })

      if (nextCursor >= items.length) {
        finish(nextPlaced)
        return
      }

      setPlaced(nextPlaced)
      setCursor(nextCursor)
      setFeedback(null)
      lockedRef.current = false
    }, dragged ? 620 : 760)
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
        y: trayRect.top + Math.min(trayRect.height * 0.62, 150) - (cardRect.top + cardRect.height / 2),
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
    ? `translate3d(${snapTarget.x}px, ${snapTarget.y}px, 0) scale(${snapTarget.correct ? 0.84 : 0.94})`
    : `translate3d(${drag.x}px, ${drag.y}px, 0) rotate(${drag.active ? drag.x * 0.018 : 0}deg)`

  return (
    <section style={{ margin: '16px 0 18px' }} aria-label={block.question || 'Sort the evidence'}>
      <style>{CSS}</style>

      <div style={{ marginBottom: 18 }}>
        <div style={{
          ...TYPE.label,
          color: done ? accent : GENERAL.cinematic.textMuted,
          marginBottom: 10,
        }}>
          {done ? `${items.length} of ${items.length}` : `${cursor + 1} of ${items.length}`}
        </div>

        {block.question && (
          <h3 style={{
            ...TYPE.displayCard,
            color: GENERAL.cinematic.textPrimary,
            margin: 0,
          }}>
            {block.question}
          </h3>
        )}

        <p style={{
          ...TYPE.bodySmall,
          color: GENERAL.cinematic.textMuted,
          margin: block.question ? '8px 0 0' : 0,
        }}>
          {block.instruction || 'Build the groups one statement at a time.'}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(Math.max(columns.length, 1), 2)}, minmax(0, 1fr))`,
        gap: 10,
        alignItems: 'stretch',
        marginBottom: done ? 16 : 20,
      }}>
        {columns.map((col, colIdx) => {
          const { title, detail } = splitColumnLabel(col)
          const color = col.color || accent
          const columnItems = placed[colIdx] || []
          const isCorrectTarget = feedback?.type === 'correct' && feedback.colIdx === colIdx
          const isWrongTarget = feedback?.type === 'wrong' && feedback.colIdx === colIdx
          const isDragTarget = drag.active && hoverCol === colIdx
          const borderColor = isCorrectTarget || isDragTarget
            ? withAlpha(color, 'CC')
            : withAlpha(color, columnItems.length ? '70' : '42')

          return (
            <button
              ref={node => { trayRefs.current[colIdx] = node }}
              className="csb-tray"
              key={`${title}-${colIdx}`}
              type="button"
              onClick={() => pick(colIdx)}
              disabled={done || lockedRef.current}
              aria-label={done ? title : `Sort ${cur?.label || 'this evidence'} into ${title}`}
              style={{
                '--csb-focus': color,
                minWidth: 0,
                minHeight: 214,
                padding: '14px 12px 12px',
                borderRadius: 16,
                border: `1px solid ${borderColor}`,
                background: isCorrectTarget || isDragTarget
                  ? (col.bg || `rgba(${rgb},0.10)`)
                  : (col.bg || GENERAL.backgroundSunken),
                boxShadow: isCorrectTarget || isDragTarget
                  ? `inset 0 0 0 1px ${withAlpha(color, '38')}, ${GENERAL.shadow.raised}`
                  : `inset 0 1px 0 ${GENERAL.line.faint}`,
                color: GENERAL.cinematic.textPrimary,
                textAlign: 'left',
                cursor: done || lockedRef.current ? 'default' : 'pointer',
                opacity: feedback && feedback.colIdx !== colIdx ? 0.62 : 1,
                transition: 'border-color 180ms ease, background 180ms ease, opacity 180ms ease, transform 120ms ease, box-shadow 180ms ease',
                animation: isWrongTarget ? 'csb-shake 340ms ease' : 'none',
                transform: isDragTarget ? 'translateY(-2px)' : undefined,
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: detail ? 7 : 13,
              }}>
                <span aria-hidden="true" style={{
                  width: 9,
                  height: 9,
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: color,
                  boxShadow: isCorrectTarget || isDragTarget ? `0 0 14px ${withAlpha(color, '80')}` : 'none',
                }} />
                <span style={{
                  ...TYPE.titleMedium,
                  color,
                  overflowWrap: 'anywhere',
                }}>
                  {title}
                </span>
              </div>

              {detail && (
                <div style={{
                  ...TYPE.caption,
                  color: GENERAL.cinematic.textMuted,
                  minHeight: 34,
                  marginBottom: 12,
                }}>
                  {detail}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {columnItems.map((item, itemIdx) => (
                  <div
                    className="csb-sorted-tile"
                    key={`${item.label}-${itemIdx}`}
                    style={{
                      padding: '9px 9px 10px',
                      borderRadius: 10,
                      border: `1px solid ${withAlpha(color, '30')}`,
                      background: 'rgba(0,0,0,0.20)',
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
                ))}
              </div>

              {!columnItems.length && (
                <div style={{
                  minHeight: 70,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 10,
                  borderRadius: 11,
                  border: `1px dashed ${withAlpha(color, isDragTarget ? '80' : '34')}`,
                  ...TYPE.caption,
                  color: isDragTarget ? withAlpha(color, 'D8') : GENERAL.cinematic.textSubtle,
                  textAlign: 'center',
                  transition: 'border-color 180ms ease, color 180ms ease',
                }}>
                  {isDragTarget ? 'Release to place' : (col.emptyLabel || 'Place evidence here')}
                </div>
              )}

              <div style={{
                ...TYPE.metadata,
                color: withAlpha(color, 'A8'),
                marginTop: 13,
                textAlign: 'center',
                letterSpacing: '0.04em',
              }}>
                {columnItems.length} {columnItems.length === 1 ? 'item' : 'items'}
              </div>
            </button>
          )
        })}
      </div>

      {!done && cur && (
        <div>
          <div style={{
            ...TYPE.label,
            color: drag.active ? GENERAL.cinematic.textSecondary : accent,
            textAlign: 'center',
            marginBottom: 10,
          }}>
            {drag.active ? 'Move over a column, then release' : 'Drag into a column or tap a column'}
          </div>

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
              padding: '17px 42px 17px 18px',
              borderRadius: 14,
              border: `1px solid ${feedback?.type === 'correct' ? accent : drag.active ? withAlpha(accent, '90') : GENERAL.line.strong}`,
              background: feedback?.type === 'correct'
                ? `rgba(${rgb},0.09)`
                : GENERAL.backgroundSurface,
              boxShadow: drag.active
                ? `${GENERAL.shadow.overlay}, 0 0 0 1px ${withAlpha(accent, '28')}`
                : GENERAL.shadow.raised,
              animation: drag.active || snapTarget ? 'none' : 'csb-card-in 260ms ease both',
              transform: cardTransform,
              opacity: snapTarget?.correct ? 0.18 : 1,
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
              textAlign: 'center',
              pointerEvents: 'none',
            }}>
              {cur.label}
            </div>

            <span aria-hidden="true" style={{
              position: 'absolute',
              right: 15,
              top: '50%',
              transform: 'translateY(-50%)',
              ...TYPE.label,
              color: drag.active ? accent : GENERAL.cinematic.textSubtle,
              letterSpacing: '-0.18em',
              pointerEvents: 'none',
            }}>
              ⋮⋮
            </span>
          </div>

          <div
            aria-live="polite"
            style={{
              minHeight: 48,
              paddingTop: 10,
              ...TYPE.bodySmall,
              color: feedback?.type === 'wrong'
                ? GENERAL.feedbackIncorrect
                : feedback?.type === 'correct'
                  ? GENERAL.feedbackCorrect
                  : GENERAL.cinematic.textSubtle,
              textAlign: 'center',
            }}
          >
            {feedback?.message || `${sortedCount} sorted so far`}
          </div>
        </div>
      )}

      {done && (
        <div aria-live="polite" style={{
          padding: '15px 16px',
          borderRadius: 14,
          border: `1px solid ${withAlpha(accent, '42')}`,
          background: `rgba(${rgb},0.06)`,
          animation: 'csb-card-in 320ms ease both',
        }}>
          <div style={{
            ...TYPE.titleMedium,
            color: accent,
            marginBottom: block.explanation ? 7 : 0,
          }}>
            All evidence sorted.
          </div>

          {block.explanation && (
            <div style={{
              ...TYPE.bodySmall,
              color: GENERAL.cinematic.textSecondary,
            }}>
              {block.explanation}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
