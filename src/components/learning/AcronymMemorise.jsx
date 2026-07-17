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
// the acronym, words, explanations and optional instructional copy come from data.
// Shape: {
//   title?, label?, instruction?, readyText?, testInstruction?, testPrompt?,
//   testCompleteText?, testCtaLabel?, learnCtaLabel?, testRowPrompt?,
//   items: [{ id?, letter, word, detail }]
// }
export default function AcronymMemorise({ block, subject = 'Biology' }) {
  const [mode, setMode] = useState('learn')
  const [open, setOpen] = useState(null)
  const [viewed, setViewed] = useState(() => new Set())
  const [checked, setChecked] = useState(() => new Set())

  const items = block.items || []
  const theme = SUBJECTS[subject] || SUBJECTS.Biology
  const acronym = items.map(item => item.letter).join('')
  const legacyLabelIsInstruction = /tap each letter/i.test(block.label || '')
  const heading = block.title
    || (!legacyLabelIsInstruction && block.label)
    || acronym
    || 'Acronym'
  const isTestMode = mode === 'test'
  const allViewed = items.length > 0 && viewed.size === items.length
  const allChecked = items.length > 0 && checked.size === items.length
  const instruction = isTestMode
    ? (block.testInstruction || 'Say each meaning before you tap to check.')
    : (block.instruction || 'Tap a letter to reveal its meaning.')
  const heroStatus = isTestMode
    ? (allChecked
        ? (block.testCompleteText || 'Every letter checked. Say the full acronym once more.')
        : (block.testPrompt || 'Answers are hidden. Recall first, then tap.'))
    : (block.readyText || 'You have revealed every meaning. Ready to test yourself?')
  const testRowPrompt = block.testRowPrompt || 'Say it, then tap to check'
  const letterSize = SPACING.standard + SPACING.compact
  const spineOffset = SPACING.micro + (letterSize / 2)

  function toggleItem(index) {
    if (isTestMode) {
      setChecked(previous => {
        const next = new Set(previous)
        next.add(index)
        return next
      })
    } else {
      setViewed(previous => {
        const next = new Set(previous)
        next.add(index)
        return next
      })
    }

    setOpen(current => current === index ? null : index)
  }

  function startTest() {
    setMode('test')
    setOpen(null)
    setChecked(new Set())
  }

  function returnToLearning() {
    setMode('learn')
    setOpen(null)
  }

  return (
    <div style={{
      margin: `${SPACING.compact}px 0 ${SPACING.standard}px`,
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
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
              const hasProgress = isTestMode ? checked.has(index) : viewed.has(index)

              return (
                <button
                  key={`hero-${item.id || `${item.letter}-${item.word}`}`}
                  type="button"
                  onClick={() => toggleItem(index)}
                  aria-label={`${item.letter}: ${hasProgress ? item.word : 'reveal meaning'}`}
                  aria-pressed={isOpen}
                  style={{
                    minWidth: 0,
                    height: letterSize,
                    borderRadius: 10,
                    border: `1px solid ${isOpen
                      ? theme.accent
                      : hasProgress
                        ? `rgba(${theme.accentRgb},0.26)`
                        : GENERAL.line.medium}`,
                    background: isOpen
                      ? theme.accent
                      : hasProgress
                        ? GENERAL.backgroundSunken
                        : GENERAL.surfaceTint,
                    color: isOpen
                      ? GENERAL.textOnAccent
                      : hasProgress
                        ? theme.accent
                        : GENERAL.slate,
                    cursor: 'pointer',
                    display: 'grid',
                    placeItems: 'center',
                    ...TYPE.titleLarge,
                    boxShadow: isOpen ? `0 0 16px rgba(${theme.accentRgb},0.18)` : 'none',
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
            {!isTestMode && !allViewed ? (
              items.map((item, index) => (
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
              ))
            ) : heroStatus}
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
            const hasProgress = isTestMode ? checked.has(index) : viewed.has(index)
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
                    ? `rgba(${theme.accentRgb},0.09)`
                    : 'transparent',
                  border: 'none',
                  borderBottom: isLast ? 'none' : `1px solid ${GENERAL.line.faint}`,
                  padding: `${SPACING.micro}px`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: SPACING.compact,
                  transition: 'background 200ms ease',
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
                    ? theme.accent
                    : GENERAL.backgroundSunken,
                  border: `1px solid ${isOpen
                    ? theme.accent
                    : hasProgress
                      ? `rgba(${theme.accentRgb},0.24)`
                      : GENERAL.line.medium}`,
                  boxShadow: isOpen ? `0 0 16px rgba(${theme.accentRgb},0.16)` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...TYPE.titleLarge,
                  color: isOpen
                    ? GENERAL.textOnAccent
                    : hasProgress
                      ? theme.accent
                      : GENERAL.slate,
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
                      {!isTestMode && (
                        <div className="fade-up" style={{
                          ...TYPE.bodySmall,
                          color: GENERAL.neutral[200],
                          marginTop: SPACING.micro,
                          maxWidth: '34ch',
                        }}>
                          {item.detail}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{
                      ...TYPE.bodySmall,
                      color: hasProgress ? GENERAL.neutral[200] : GENERAL.slate,
                    }}>
                      {isTestMode
                        ? (hasProgress ? item.word : testRowPrompt)
                        : (hasProgress ? item.word : 'Tap to reveal')}
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
          <button
            type="button"
            onClick={isTestMode ? returnToLearning : startTest}
            style={{
              width: '100%',
              marginTop: SPACING.compact,
              padding: SPACING.compact,
              borderRadius: 12,
              border: `1px solid rgba(${theme.accentRgb},${isTestMode ? '0.20' : '0.34'})`,
              background: isTestMode
                ? 'transparent'
                : `rgba(${theme.accentRgb},0.10)`,
              color: isTestMode ? GENERAL.slate : theme.accent,
              cursor: 'pointer',
              ...TYPE.button,
              transition: 'background 200ms ease, border-color 200ms ease, color 200ms ease',
            }}
          >
            {isTestMode
              ? (block.learnCtaLabel || 'Back to learning')
              : (block.testCtaLabel || 'Hide and test myself')}
          </button>
        )}
      </div>
    </div>
  )
}
