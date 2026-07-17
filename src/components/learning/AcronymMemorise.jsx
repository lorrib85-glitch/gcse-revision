import { useState } from 'react'
import { GENERAL } from '../../constants/generalTheme.js'
import { SPACING } from '../../constants/spacing.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE } from '../../constants/typography.js'

function ChevronDownIcon({ open, color }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
      style={{
        display: 'block',
        color,
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'color 200ms ease, transform 200ms ease',
      }}
    >
      <path
        d="m7 10 5 5 5-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── AcronymMemorise — mnemonic acronym reveal ────────────────────────────────
// Content-driven mnemonic block. The component owns the interaction and layout;
// the acronym, words, explanations and optional memory hook all come from data.
// Shape: {
//   title?, label?, instruction?, memoryHookLabel?, memoryHook?,
//   items: [{ id?, letter, word, detail }]
// }
export default function AcronymMemorise({ block, subject = 'Biology' }) {
  const [open, setOpen] = useState(null)
  const [viewed, setViewed] = useState(() => new Set())
  const items = block.items || []
  const theme = SUBJECTS[subject] || SUBJECTS.Biology
  const acronym = items.map(item => item.letter).join('')
  const legacyLabelIsInstruction = /tap each letter/i.test(block.label || '')
  const heading = block.title
    || (!legacyLabelIsInstruction && block.label)
    || acronym
    || 'Acronym'
  const instruction = block.instruction || 'Tap a letter to reveal its meaning.'
  const allViewed = items.length > 0 && viewed.size === items.length
  const memoryHook = block.memoryHook
    || block.summary
    || `${acronym}: ${items.map(item => item.word).join(' · ')}`
  const memoryHookLabel = block.memoryHookLabel || 'Make it stick'
  const letterSize = SPACING.standard + SPACING.compact
  const spineOffset = SPACING.micro + (letterSize / 2)

  function toggleItem(index) {
    setViewed(previous => {
      const next = new Set(previous)
      next.add(index)
      return next
    })
    setOpen(current => current === index ? null : index)
  }

  return (
    <div style={{ margin: `${SPACING.compact}px 0` }}>
      <div style={{
        background: GENERAL.backgroundSurface,
        border: `1px solid ${GENERAL.line.soft}`,
        borderRadius: 18,
        padding: SPACING.compact,
        overflow: 'hidden',
      }}>
        <div style={{ marginBottom: SPACING.compact }}>
          <div style={{
            ...TYPE.label,
            color: GENERAL.softWhite,
          }}>
            {heading}
          </div>
          <p style={{
            ...TYPE.bodySmall,
            color: GENERAL.slate,
            margin: `${SPACING.micro}px 0 0`,
          }}>
            {instruction}
          </p>
        </div>

        <div style={{
          background: GENERAL.backgroundSunken,
          border: `1px solid ${GENERAL.line.soft}`,
          borderRadius: 14,
          padding: SPACING.compact,
          marginBottom: SPACING.compact,
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.max(items.length, 1)}, minmax(0, 1fr))`,
            gap: SPACING.micro,
          }}>
            {items.map((item, index) => {
              const isOpen = open === index
              const hasViewed = viewed.has(index)

              return (
                <button
                  key={`hero-${item.id || `${item.letter}-${item.word}`}`}
                  type="button"
                  onClick={() => toggleItem(index)}
                  aria-label={`${item.letter}: ${hasViewed ? item.word : 'reveal meaning'}`}
                  aria-pressed={isOpen}
                  style={{
                    minWidth: 0,
                    height: letterSize,
                    borderRadius: 10,
                    border: `1px solid ${isOpen
                      ? `rgba(${theme.accentRgb},0.52)`
                      : hasViewed
                        ? `rgba(${theme.accentRgb},0.26)`
                        : GENERAL.line.medium}`,
                    background: isOpen
                      ? `rgba(${theme.accentRgb},0.18)`
                      : hasViewed
                        ? `rgba(${theme.accentRgb},0.08)`
                        : GENERAL.surfaceTint,
                    color: isOpen || hasViewed ? theme.accent : GENERAL.slate,
                    cursor: 'pointer',
                    display: 'grid',
                    placeItems: 'center',
                    ...TYPE.titleLarge,
                    boxShadow: isOpen ? `0 0 14px rgba(${theme.accentRgb},0.14)` : 'none',
                    transition: 'background 200ms ease, border-color 200ms ease, box-shadow 200ms ease, color 200ms ease',
                  }}
                >
                  {item.letter}
                </button>
              )
            })}
          </div>

          <div
            aria-live="polite"
            style={{
              ...TYPE.bodySmall,
              color: GENERAL.slate,
              textAlign: 'center',
              marginTop: SPACING.compact,
              lineHeight: 1.65,
            }}
          >
            {items.map((item, index) => (
              <span key={`word-${item.id || `${item.letter}-${item.word}`}`}>
                <span style={{
                  color: viewed.has(index) ? GENERAL.softWhite : GENERAL.neutral[300],
                  transition: 'color 200ms ease',
                }}>
                  {viewed.has(index) ? item.word : item.letter}
                </span>
                {index < items.length - 1 && (
                  <span aria-hidden="true" style={{ color: GENERAL.neutral[300] }}> · </span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          {items.length > 1 && (
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                zIndex: 1,
                top: spineOffset,
                bottom: spineOffset,
                left: spineOffset,
                width: 1,
                background: GENERAL.line.medium,
                pointerEvents: 'none',
              }}
            />
          )}

          {items.map((item, index) => {
            const isOpen = open === index
            const hasViewed = viewed.has(index)
            const isLast = index === items.length - 1

            return (
              <button
                key={item.id || `${item.letter}-${item.word}`}
                type="button"
                onClick={() => toggleItem(index)}
                aria-expanded={isOpen}
                style={{
                  position: 'relative',
                  width: '100%',
                  minHeight: letterSize + (SPACING.micro * 2),
                  background: isOpen
                    ? `linear-gradient(90deg, rgba(${theme.accentRgb},0.11), rgba(${theme.accentRgb},0.035) 68%, transparent)`
                    : 'transparent',
                  border: 'none',
                  borderBottom: isLast ? 'none' : `1px solid ${GENERAL.line.faint}`,
                  padding: `${isOpen ? SPACING.compact : SPACING.micro}px ${SPACING.micro}px`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: SPACING.compact,
                  transition: 'background 200ms ease, padding 200ms ease',
                }}
              >
                <div style={{
                  position: 'relative',
                  zIndex: 2,
                  width: letterSize,
                  height: letterSize,
                  borderRadius: 10,
                  flexShrink: 0,
                  background: isOpen
                    ? `rgba(${theme.accentRgb},0.16)`
                    : hasViewed
                      ? `rgba(${theme.accentRgb},0.07)`
                      : GENERAL.backgroundSunken,
                  border: `1px solid ${isOpen
                    ? `rgba(${theme.accentRgb},0.42)`
                    : hasViewed
                      ? `rgba(${theme.accentRgb},0.22)`
                      : GENERAL.line.medium}`,
                  boxShadow: isOpen ? `0 0 16px rgba(${theme.accentRgb},0.16)` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...TYPE.titleLarge,
                  color: isOpen || hasViewed ? theme.accent : GENERAL.slate,
                  transition: 'background 200ms ease, border-color 200ms ease, box-shadow 200ms ease, color 200ms ease',
                }}>
                  {item.letter}
                </div>

                <div style={{
                  position: 'relative',
                  zIndex: 2,
                  flex: 1,
                  minWidth: 0,
                }}>
                  {isOpen ? (
                    <>
                      <div style={{
                        ...TYPE.titleMedium,
                        color: GENERAL.softWhite,
                      }}>
                        {item.word}
                      </div>
                      <div className="fade-up" style={{
                        ...TYPE.bodySmall,
                        color: GENERAL.neutral[200],
                        marginTop: SPACING.micro,
                        maxWidth: '34ch',
                      }}>
                        {item.detail}
                      </div>
                    </>
                  ) : (
                    <div style={{
                      ...TYPE.bodySmall,
                      color: hasViewed ? GENERAL.neutral[200] : GENERAL.slate,
                    }}>
                      {hasViewed ? item.word : 'Tap to reveal'}
                    </div>
                  )}
                </div>

                <span style={{ position: 'relative', zIndex: 2, flexShrink: 0 }}>
                  <ChevronDownIcon
                    open={isOpen}
                    color={isOpen ? theme.accent : GENERAL.neutral[300]}
                  />
                </span>
              </button>
            )
          })}
        </div>

        {allViewed && (
          <div className="fade-up" style={{
            marginTop: SPACING.compact,
            padding: SPACING.compact,
            borderRadius: 14,
            background: `rgba(${theme.accentRgb},0.07)`,
            border: `1px solid rgba(${theme.accentRgb},0.20)`,
          }}>
            <div style={{
              ...TYPE.label,
              color: theme.accent,
              marginBottom: SPACING.micro,
            }}>
              {memoryHookLabel}
            </div>
            <div style={{
              ...TYPE.bodySmall,
              color: GENERAL.neutral[200],
            }}>
              {memoryHook}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
