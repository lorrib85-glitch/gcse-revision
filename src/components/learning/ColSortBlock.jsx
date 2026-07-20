import { useEffect, useRef, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { HEADING_LAYOUT, TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'

const CSS = `
  @keyframes csb-card-in {
    from { opacity: 0; transform: translateY(14px) scale(0.985); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes csb-tile-in {
    from { opacity: 0; transform: translateY(8px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes csb-complete-in {
    from { opacity: 0; transform: translateY(10px); }
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
    width: 22,
    height: 22,
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
        <circle cx="12" cy="6" r="2" /><circle cx="6" cy="17" r="2" /><circle cx="18" cy="17" r="2" />
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
  const title = block.title || block.question || 'Sort the evidence'
  const subtitle = block.subtitle || block.instruction || 'Sort each piece of evidence.'

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
    ? `translate3d(${snapTarget.x}px, ${snapTarget.y}px, 0) scale(${snapTarget.correct ? 0.82 : 0.94})`
    : `translate3d(${drag.x}px, ${drag.y}px, 0) rotate(${drag.active ? drag.x * 0.018 : 0}deg)`

  const backgroundStyle = block.backgroundImage
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(5,6,10,0.36) 0%, rgba(5,6,10,0.82) 30%, rgba(5,6,10,0.96) 100%), url(${block.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: block.backgroundPosition || 'center top',
      }
    : {
        background: `radial-gradient(circle at 14% 0%, rgba(${rgb},0.12), transparent 34%), linear-gradient(180deg, ${subj.backgroundSecondary}, ${subj.background})`,
      }

  return (
    <section
      aria-label={title}
      style={{
        ...backgroundStyle,
        position: 'relative',
        overflow: 'hidden',
        margin: '16px 0 18px',
        padding: '22px 16px 18px',
        borderRadius: 22,
        border: `1px solid ${withAlpha(accent, '24')}`,
        boxShadow: `${GENERAL.shadow.overlay}, inset 0 1px 0 ${GENERAL.line.faint}`,
      }}
    >
      <style>{CSS}</style>

      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: `radial-gradient(circle at 20% 12%, rgba(${rgb},0.10), transparent 30%), linear-gradient(90deg, rgba(255,255,255,0.025), transparent 35%, rgba(255,255,255,0.018))`,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <header style={{ marginBottom: 24 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 14,
          }}>
            <div style={{
              ...TYPE.label,
              color: accent,
              whiteSpace: 'nowrap',
            }}>
              {done ? `${items.length} of ${items.length}` : `${cursor + 1} of ${items.length}`}
            </div>
            <div style={{
              height: 1,
              flex: 1,
              background: GENERAL.line.soft,
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${items.length ? ((done ? items.length : cursor + 1) / items.length) * 100 : 100}%`,
                height: '100%',
                background: `linear-gradient(90deg, ${accent}, ${withAlpha(accent, '66')})`,
                transition: 'width 300ms ease',
              }} />
            </div>
          </div>

          <h2 style={{
            ...TYPE.displayScreen,
            ...HEADING_LAYOUT.screenTitle,
            color: GENERAL.cinematic.textPrimary,
            margin: 0,
          }}>
            {title}
          </h2>

          <div style={{ marginTop: 10, maxWidth: 'min(360px, 100%)' }}>
            <p style={{
              ...TYPE.bodyLarge,
              color: GENERAL.cinematic.textSecondary,
              margin: 0,
            }}>
              {subtitle}
            </p>
          </div>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(Math.max(columns.length, 1), 2)}, minmax(0, 1fr))`,
          gap: 10,
          alignItems: 'stretch',
          marginBottom: done ? 18 : 22,
        }}>
          {columns.map((col, colIdx) => {
            const { title: columnTitle, detail } = splitColumnLabel(col)
            const color = col.color || accent
            const columnItems = placed[colIdx] || []
            const isCorrectTarget = feedback?.type === 'correct' && feedback.colIdx === colIdx
            const isWrongTarget = feedback?.type === 'wrong' && feedback.colIdx === colIdx
            const isDragTarget = drag.active && hoverCol === colIdx
            const isActive = isCorrectTarget || isDragTarget
            const trayFrame = isActive ? accent : frameColor

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
                  minHeight: 248,
                  padding: '14px 11px 12px',
                  borderRadius: 18,
                  border: `1px solid ${withAlpha(trayFrame, isActive ? 'C2' : '72')}`,
                  background: isActive
                    ? `linear-gradient(180deg, ${withAlpha(color, '18')}, rgba(8,9,13,0.80))`
                    : 'linear-gradient(180deg, rgba(255,255,255,0.035), rgba(8,9,13,0.78))',
                  boxShadow: isActive
                    ? `0 0 0 1px ${withAlpha(accent, '22')}, 0 0 24px ${withAlpha(accent, '18')}, 0 10px 30px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.07)`
                    : `0 0 0 1px ${withAlpha(frameColor, '10')}, inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 24px rgba(0,0,0,0.22)`,
                  color: GENERAL.cinematic.textPrimary,
                  textAlign: 'left',
                  cursor: done || lockedRef.current ? 'default' : 'pointer',
                  opacity: feedback && feedback.colIdx !== colIdx ? 0.68 : 1,
                  transition: 'border-color 180ms ease, background 180ms ease, opacity 180ms ease, transform 160ms ease, box-shadow 180ms ease',
                  animation: isWrongTarget ? 'csb-shake 340ms ease' : 'none',
                  transform: isDragTarget ? 'translateY(-3px)' : undefined,
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 9,
                  marginBottom: detail ? 9 : 14,
                }}>
                  <span aria-hidden="true" style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    color,
                    border: `1px solid ${withAlpha(color, isActive ? '88' : '48')}`,
                    background: `radial-gradient(circle at 35% 30%, ${withAlpha(color, '24')}, rgba(0,0,0,0.26))`,
                    boxShadow: isActive ? `0 0 18px ${withAlpha(color, '38')}` : 'none',
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
                    minHeight: 46,
                    marginBottom: 12,
                    paddingLeft: 2,
                  }}>
                    {detail}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {columnItems.map((item, itemIdx) => (
                    <div
                      className="csb-sorted-tile"
                      key={`${item.label}-${itemIdx}`}
                      style={{
                        padding: '10px 10px 11px',
                        borderRadius: 12,
                        border: `1px solid ${withAlpha(color, '32')}`,
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(0,0,0,0.26))',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.035)',
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
                    minHeight: 82,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 7,
                    padding: 10,
                    borderRadius: 13,
                    border: `1px dashed ${withAlpha(color, isDragTarget ? '88' : '30')}`,
                    ...TYPE.caption,
                    color: isDragTarget ? withAlpha(color, 'E0') : GENERAL.cinematic.textSubtle,
                    textAlign: 'center',
                    transition: 'border-color 180ms ease, color 180ms ease',
                  }}>
                    <span aria-hidden="true" style={{
                      width: 22,
                      height: 12,
                      border: `1px solid ${withAlpha(color, isDragTarget ? 'A0' : '38')}`,
                      borderTop: 0,
                      borderRadius: '0 0 5px 5px',
                    }} />
                    {isDragTarget ? 'Release to place' : (col.emptyLabel || 'Drop evidence here')}
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 13,
                  color: withAlpha(color, 'A0'),
                }}>
                  <span style={{ height: 1, flex: 1, background: withAlpha(color, '25') }} />
                  <span style={{ ...TYPE.caption, whiteSpace: 'nowrap' }}>
                    {columnItems.length} {columnItems.length === 1 ? 'item' : 'items'}
                  </span>
                  <span style={{ height: 1, flex: 1, background: withAlpha(color, '25') }} />
                </div>
              </button>
            )
          })}
        </div>

        {!done && cur && (
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 11,
              ...TYPE.label,
              color: drag.active ? GENERAL.cinematic.textSecondary : accent,
              textAlign: 'center',
            }}>
              <span aria-hidden="true" style={{ fontSize: 17 }}>↕</span>
              {drag.active ? 'Move over a column, then release' : 'Drag the evidence into a column'}
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
                width: 'min(100%, 510px)',
                margin: '0 auto',
                padding: '18px 48px 18px 18px',
                borderRadius: 16,
                border: `1px solid ${feedback?.type === 'correct' ? accent : drag.active ? withAlpha(accent, '98') : withAlpha(accent, '48')}`,
                background: feedback?.type === 'correct'
                  ? `linear-gradient(180deg, rgba(${rgb},0.16), rgba(10,10,13,0.92))`
                  : 'linear-gradient(180deg, rgba(30,27,23,0.97), rgba(10,10,13,0.98))',
                boxShadow: drag.active
                  ? `${GENERAL.shadow.overlay}, 0 0 30px rgba(${rgb},0.20), inset 0 1px 0 rgba(255,255,255,0.08)`
                  : `0 12px 34px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.06)`,
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

            <div
              aria-live="polite"
              style={{
                minHeight: 52,
                padding: '11px 10px 0',
                ...TYPE.bodySmall,
                color: feedback?.type === 'wrong'
                  ? GENERAL.feedbackIncorrect
                  : feedback?.type === 'correct'
                    ? GENERAL.feedbackCorrect
                    : GENERAL.cinematic.textSubtle,
                textAlign: 'center',
              }}
            >
              {feedback?.message || `${sortedCount} sorted so far · Tap a column also works`}
            </div>
          </div>
        )}

        {done && (
          <div
            className="csb-completion"
            aria-live="polite"
            style={{
              position: 'relative',
              padding: '17px 18px 17px 20px',
              borderRadius: 16,
              border: `1px solid ${withAlpha(accent, '38')}`,
              background: 'linear-gradient(90deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015))',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
              animation: 'csb-complete-in 320ms ease both',
              overflow: 'hidden',
            }}
          >
            <span aria-hidden="true" style={{
              position: 'absolute',
              inset: '0 auto 0 0',
              width: 3,
              background: accent,
              boxShadow: `0 0 18px rgba(${rgb},0.45)`,
            }} />

            <div style={{
              ...TYPE.titleMedium,
              color: GENERAL.cinematic.textPrimary,
              marginBottom: block.explanation ? 7 : 0,
            }}>
              Pattern complete
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
      </div>
    </section>
  )
}
