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

  .csb-tray:focus-visible {
    outline: 2px solid var(--csb-focus);
    outline-offset: 3px;
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

  const timerRef = useRef(null)
  const lockedRef = useRef(false)
  const completedRef = useRef(false)

  const cur = items[cursor] ?? null
  const sortedCount = placed.reduce((total, columnItems) => total + columnItems.length, 0)

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  function finish(nextPlaced) {
    setPlaced(nextPlaced)
    setDone(true)
    setFeedback(null)
    lockedRef.current = false

    if (!completedRef.current) {
      completedRef.current = true
      onComplete?.({ placed: nextPlaced, total: items.length })
    }
  }

  function pick(colIdx) {
    if (!cur || lockedRef.current || done) return

    const correct = colIdx === cur.col

    if (!correct) {
      lockedRef.current = true
      setFeedback({
        type: 'wrong',
        colIdx,
        message: cur.wrongFeedback || 'Not quite — compare the column definitions and try again.',
      })

      timerRef.current = setTimeout(() => {
        setFeedback(null)
        lockedRef.current = false
      }, 650)
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

      if (nextCursor >= items.length) {
        finish(nextPlaced)
        return
      }

      setPlaced(nextPlaced)
      setCursor(nextCursor)
      setFeedback(null)
      lockedRef.current = false
    }, 760)
  }

  if (!columns.length) return null

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
          const borderColor = isCorrectTarget
            ? withAlpha(color, 'CC')
            : withAlpha(color, columnItems.length ? '70' : '42')

          return (
            <button
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
                background: isCorrectTarget
                  ? (col.bg || `rgba(${rgb},0.10)`)
                  : (col.bg || GENERAL.backgroundSunken),
                boxShadow: isCorrectTarget
                  ? `inset 0 0 0 1px ${withAlpha(color, '38')}, ${GENERAL.shadow.raised}`
                  : `inset 0 1px 0 ${GENERAL.line.faint}`,
                color: GENERAL.cinematic.textPrimary,
                textAlign: 'left',
                cursor: done || lockedRef.current ? 'default' : 'pointer',
                opacity: feedback && feedback.colIdx !== colIdx ? 0.62 : 1,
                transition: 'border-color 180ms ease, background 180ms ease, opacity 180ms ease, transform 120ms ease',
                animation: isWrongTarget ? 'csb-shake 340ms ease' : 'none',
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
                  boxShadow: isCorrectTarget ? `0 0 14px ${withAlpha(color, '80')}` : 'none',
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
                  border: `1px dashed ${withAlpha(color, '34')}`,
                  ...TYPE.caption,
                  color: GENERAL.cinematic.textSubtle,
                  textAlign: 'center',
                }}>
                  {col.emptyLabel || 'Place evidence here'}
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
            color: accent,
            textAlign: 'center',
            marginBottom: 10,
          }}>
            Tap a column to sort
          </div>

          <div
            key={`${cursor}-${cur.label}`}
            className="csb-current-card"
            style={{
              padding: '17px 18px',
              borderRadius: 14,
              border: `1px solid ${feedback?.type === 'correct' ? accent : GENERAL.line.strong}`,
              background: feedback?.type === 'correct'
                ? `rgba(${rgb},0.09)`
                : GENERAL.backgroundSurface,
              boxShadow: GENERAL.shadow.raised,
              animation: 'csb-card-in 260ms ease both',
              transition: 'border-color 180ms ease, background 180ms ease',
            }}
          >
            <div style={{
              ...TYPE.displayCard,
              color: feedback?.type === 'correct' ? accent : GENERAL.cinematic.textPrimary,
              textAlign: 'center',
            }}>
              {cur.label}
            </div>
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
