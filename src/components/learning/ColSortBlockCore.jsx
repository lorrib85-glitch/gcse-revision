import { useEffect, useRef, useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { ScreenTitle, ScreenIntro } from '../core/ScreenText.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'

const CSS = `
  @keyframes csb-heading-in {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes csb-progress-in {
    from { opacity: 0; transform: scaleX(0.72); transform-origin: left; }
    to { opacity: 1; transform: scaleX(1); transform-origin: left; }
  }

  @keyframes csb-trays-in {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes csb-card-in {
    from { opacity: 0; transform: translateY(14px) scale(0.985); }
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

  .csb-heading { animation: csb-heading-in 360ms ease both; }
  .csb-progress { animation: csb-progress-in 420ms 160ms ease both; }
  .csb-trays { animation: csb-trays-in 420ms 260ms ease both; }
  .csb-card-stage { animation: csb-card-in 420ms 420ms ease both; }

  .csb-tray,
  .csb-current-card {
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
    touch-action: none;
    user-select: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .csb-heading,
    .csb-progress,
    .csb-trays,
    .csb-card-stage,
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
    return <svg {...shared}><path d="M12 4v16M7 6h10M6 9l-3 6h6L6 9Zm12 0-3 6h6l-3-6Z" /><path d="M8.5 20h7" /></svg>
  }
  if (name === 'continuity' || name === 'pillar') {
    return <svg {...shared}><path d="M5 8h14M6.5 8v9M10 8v9M14 8v9M17.5 8v9M4 19h16M7 5h10l2 3H5l2-3Z" /></svg>
  }
  if (name === 'marxist' || name === 'factory') {
    return <svg {...shared}><path d="M4 20V10l5 3V9l5 3V5h3v15H4Z" /><path d="M7 17h2M12 17h2M17 17h1" /></svg>
  }
  if (name === 'functionalist' || name === 'network') {
    return <svg {...shared}><circle cx="12" cy="6" r="2" /><circle cx="6" cy="17" r="2" /><circle cx="18" cy="17" r="2" /><path d="m11 8-4 7M13 8l4 7M8 17h8" /></svg>
  }
  if (name === 'value' || name === 'star') {
    return <svg {...shared}><path d="m12 3 2.6 5.3 5.9.9-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.2 5.9-.9L12 3Z" /></svg>
  }
  if (name === 'norm' || name === 'check') {
    return <svg {...shared}><path d="M5 12.5 9.2 17 19 7" /></svg>
  }
  return <svg {...shared}><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M8 9h8M8 13h5" /></svg>
}

function EvidenceIcon({ name, size = 20 }) {
  if (!name) return null

  const shared = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.65,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  if (name === 'observation' || name === 'eye') {
    return <svg {...shared}><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.6" /></svg>
  }
  if (name === 'book' || name === 'printing') {
    return <svg {...shared}><path d="M4 5.5c3.2-.8 5.8-.2 8 1.5v12c-2.2-1.7-4.8-2.3-8-1.5v-12Zm16 0c-3.2-.8-5.8-.2-8 1.5v12c2.2-1.7 4.8-2.3 8-1.5v-12Z" /></svg>
  }
  if (name === 'anatomy' || name === 'body') {
    return <svg {...shared}><circle cx="12" cy="5" r="2.2" /><path d="M8.5 10c1.1-1.4 2.2-2 3.5-2s2.4.6 3.5 2M12 8v11M8 13l4 2 4-2M9 20l3-5 3 5" /></svg>
  }
  if (name === 'treatment' || name === 'medicine') {
    return <svg {...shared}><path d="M9 3h6v5l3.5 3.5a5 5 0 0 1-7 7L5.5 12.5a5 5 0 0 1 0-7L8 3h1Z" /><path d="m8 14 8-8" /></svg>
  }
  if (name === 'humours' || name === 'drop') {
    return <svg {...shared}><path d="M12 3s5 5.4 5 10a5 5 0 0 1-10 0c0-4.6 5-10 5-10Z" /></svg>
  }
  if (name === 'argument' || name === 'idea') {
    return <svg {...shared}><path d="M9 18h6M10 21h4M8.5 14.5A6 6 0 1 1 15.5 14.5c-1.2.8-1.5 1.6-1.5 2.5h-4c0-.9-.3-1.7-1.5-2.5Z" /></svg>
  }
  return <svg {...shared}><circle cx="12" cy="12" r="8" /><path d="M8 12h8M12 8v8" /></svg>
}

export default function ColSortBlockCore({ block, subject = 'Biology', onComplete }) {
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
  const [hasMissed, setHasMissed] = useState(false)

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
  const showThinkingPrompt = Boolean(block.thinkingPrompt)
    && !done
    && (block.thinkingPromptMode === 'always' || hasMissed)

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
      setHasMissed(true)
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

      timerRef.current = setTimeout(clearIncorrectFeedback, 900)
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
      setHasMissed(false)

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
          inset: '-34px -22px 34%',
          pointerEvents: 'none',
          opacity: block.backgroundOpacity ?? 0.11,
          backgroundImage: `linear-gradient(180deg, rgba(5,6,10,0.08), rgba(5,6,10,0.72) 58%, rgba(5,6,10,1)), url(${block.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: block.backgroundPosition || 'center top',
          filter: 'saturate(0.72) contrast(1.06)',
          maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
        }} />
      )}

      <div aria-hidden="true" style={{
        position: 'absolute',
        inset: '-20px -24px auto',
        height: 300,
        pointerEvents: 'none',
        background: `radial-gradient(circle at 18% 10%, rgba(${rgb},0.10), transparent 50%), linear-gradient(180deg, rgba(4,5,8,0.06), rgba(4,5,8,0.72) 76%, transparent)`,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <header className="csb-heading" style={{ marginBottom: 18 }}>
          <ScreenTitle style={{ color: GENERAL.cinematic.textPrimary, margin: 0 }}>
            {title}
          </ScreenTitle>

          <ScreenIntro>{subtitle}</ScreenIntro>

          {!!items.length && (
            <div className="csb-progress" style={{ width: 'min(210px, 58vw)', marginTop: 16 }}>
              <SequenceProgress
                total={items.length}
                current={progressIndex}
                completed={progressCompleted}
                accent={accent}
                accentRgb={rgb}
                variant="sash"
                compact
                ariaLabel="Sorting progress"
                style={{ width: '100%' }}
              />
            </div>
          )}
        </header>

        <div
          className="csb-trays"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(Math.max(columns.length, 1), 2)}, minmax(0, 1fr))`,
            gap: 12,
            alignItems: 'start',
            marginBottom: done ? 20 : 12,
          }}
        >
          {columns.map((col, colIdx) => {
            const { title: columnTitle, detail } = splitColumnLabel(col)
            const color = col.color || accent
            const columnItems = placed[colIdx] || []
            const isCorrectTarget = feedback?.type === 'correct' && feedback.colIdx === colIdx
            const isWrongTarget = feedback?.type === 'wrong' && feedback.colIdx === colIdx
            const isDragTarget = drag.active && hoverCol === colIdx
            const isActive = isCorrectTarget || isDragTarget
            const dragOpacity = drag.active ? (isDragTarget ? 1 : 0.5) : 1

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
                  minHeight: columnItems.length ? 154 : detail ? 174 : 138,
                  padding: '13px 11px 12px',
                  borderRadius: 17,
                  border: `1px solid ${withAlpha(frameColor, isActive ? 'D0' : '78')}`,
                  background: isActive
                    ? `linear-gradient(180deg, rgba(${rgb},0.13), rgba(8,9,13,0.80))`
                    : 'linear-gradient(180deg, rgba(255,255,255,0.025), rgba(8,9,13,0.76))',
                  boxShadow: isActive
                    ? `0 0 0 1px ${withAlpha(accent, '28')}, 0 0 24px ${withAlpha(accent, '1C')}, inset 0 1px 0 rgba(255,255,255,0.07)`
                    : 'inset 0 1px 0 rgba(255,255,255,0.045), 0 8px 20px rgba(0,0,0,0.20)',
                  color: GENERAL.cinematic.textPrimary,
                  textAlign: 'left',
                  cursor: done || lockedRef.current ? 'default' : 'pointer',
                  opacity: feedback && feedback.colIdx !== colIdx ? 0.68 : dragOpacity,
                  transition: 'min-height 220ms ease, border-color 180ms ease, background 180ms ease, opacity 180ms ease, transform 160ms ease, box-shadow 180ms ease',
                  animation: isWrongTarget ? 'csb-shake 340ms ease' : 'none',
                  transform: isDragTarget ? 'translateY(-3px)' : undefined,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: detail ? 8 : 12 }}>
                  <span aria-hidden="true" style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    color,
                    border: `1px solid ${withAlpha(color, isActive ? '90' : '58')}`,
                    background: `radial-gradient(circle at 35% 30%, ${withAlpha(color, '22')}, rgba(0,0,0,0.24))`,
                    boxShadow: isActive ? `0 0 16px ${withAlpha(color, '38')}` : 'none',
                  }}>
                    <ColumnIcon name={col.icon || (colIdx === 0 ? 'change' : 'continuity')} />
                  </span>

                  <span style={{ ...TYPE.titleMedium, color, overflowWrap: 'anywhere' }}>
                    {columnTitle}
                  </span>
                </div>

                {detail && (
                  <div style={{
                    ...TYPE.caption,
                    color: GENERAL.cinematic.textMuted,
                    minHeight: 50,
                    marginBottom: 9,
                    paddingLeft: 1,
                  }}>
                    {detail}
                  </div>
                )}

                {!columnItems.length ? (
                  <div style={{
                    minHeight: 48,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: 4,
                    ...TYPE.caption,
                    color: isDragTarget ? withAlpha(frameColor, 'F0') : GENERAL.cinematic.textMuted,
                    textAlign: 'center',
                  }}>
                    <span aria-hidden="true" style={{ color: isDragTarget ? accent : GENERAL.cinematic.textSubtle, fontSize: 14 }}>↓</span>
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
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: 8,
                              padding: '10px 9px 11px',
                              borderRadius: 11,
                              border: `1px solid ${withAlpha(color, isRecent ? '58' : '30')}`,
                              background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(0,0,0,0.24))',
                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
                              animation: 'csb-tile-in 240ms ease both',
                            }}
                          >
                            {item.icon && (
                              <span aria-hidden="true" style={{ color, flexShrink: 0, marginTop: 1 }}>
                                <EvidenceIcon name={item.icon} size={16} />
                              </span>
                            )}
                            <div style={{ ...TYPE.caption, color: GENERAL.cinematic.textFact, overflowWrap: 'anywhere' }}>
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
                  <div style={{ ...TYPE.caption, color: withAlpha(frameColor, '96'), marginTop: 11, textAlign: 'center' }}>
                    {columnItems.length} {columnItems.length === 1 ? 'item' : 'items'}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {!done && cur && (
          <div className="csb-card-stage">
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
                padding: cur.icon ? '15px 48px 15px 14px' : '17px 48px 17px 18px',
                borderRadius: 15,
                border: `1px solid ${feedback?.type === 'correct' ? accent : drag.active ? withAlpha(accent, 'A8') : GENERAL.line.strong}`,
                background: feedback?.type === 'correct'
                  ? `linear-gradient(180deg, rgba(${rgb},0.14), rgba(10,10,13,0.94))`
                  : 'linear-gradient(180deg, rgba(25,25,28,0.98), rgba(10,10,13,0.99))',
                boxShadow: drag.active
                  ? `${GENERAL.shadow.overlay}, 0 0 28px rgba(${rgb},0.18), inset 0 1px 0 rgba(255,255,255,0.07)`
                  : '0 12px 30px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.05)',
                transform: cardTransform,
                opacity: snapTarget?.correct ? 0.12 : 1,
                transition: drag.active
                  ? 'box-shadow 150ms ease, border-color 150ms ease'
                  : 'transform 300ms cubic-bezier(.22,1,.36,1), opacity 260ms ease, border-color 180ms ease, background 180ms ease, box-shadow 180ms ease',
                cursor: drag.active ? 'grabbing' : 'grab',
                willChange: 'transform',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, pointerEvents: 'none' }}>
                {cur.icon && (
                  <span aria-hidden="true" style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    color: accent,
                    border: `1px solid ${withAlpha(accent, '48')}`,
                    background: `rgba(${rgb},0.07)`,
                  }}>
                    <EvidenceIcon name={cur.icon} size={20} />
                  </span>
                )}

                <div style={{
                  ...TYPE.displayCard,
                  color: feedback?.type === 'correct' ? accent : GENERAL.cinematic.textPrimary,
                  textAlign: 'left',
                }}>
                  {cur.label}
                </div>
              </div>

              <span aria-hidden="true" style={{
                position: 'absolute',
                right: 17,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 16,
                height: 22,
                color: drag.active ? accent : GENERAL.cinematic.textMuted,
                backgroundImage: 'radial-gradient(circle, currentColor 1.35px, transparent 1.55px)',
                backgroundSize: '8px 7px',
                pointerEvents: 'none',
              }} />
            </div>

            <div style={{
              ...TYPE.label,
              color: drag.active ? GENERAL.cinematic.textSecondary : GENERAL.cinematic.textMuted,
              textAlign: 'center',
              marginTop: 9,
            }}>
              {drag.active ? 'Move over a column, then release' : 'Tap a column or drag the card'}
            </div>

            <div
              aria-live="polite"
              style={{
                minHeight: 26,
                paddingTop: 7,
                ...TYPE.bodySmall,
                color: feedback?.type === 'wrong' ? GENERAL.feedbackIncorrect : GENERAL.cinematic.textSubtle,
                textAlign: 'center',
              }}
            >
              {feedback?.type === 'wrong' ? feedback.message : ''}
            </div>

            {showThinkingPrompt && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 11,
                marginTop: 7,
                padding: '12px 14px',
                borderRadius: 13,
                border: `1px solid ${GENERAL.line.soft}`,
                background: `linear-gradient(90deg, rgba(${rgb},0.055), rgba(255,255,255,0.018))`,
              }}>
                <span aria-hidden="true" style={{ color: accent, flexShrink: 0, marginTop: 1 }}>
                  <EvidenceIcon name="argument" size={19} />
                </span>
                <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textSecondary }}>
                  {block.thinkingPrompt}
                </div>
              </div>
            )}
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

            <div style={{ ...TYPE.displayCard, color: GENERAL.cinematic.textPrimary, marginBottom: block.explanation ? 8 : 0 }}>
              {block.conclusionTitle || 'Pattern complete'}
            </div>

            {block.explanation && (
              <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textSecondary, maxWidth: 520 }}>
                {block.explanation}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
