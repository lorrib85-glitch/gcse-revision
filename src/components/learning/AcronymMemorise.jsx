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
// Tap-to-reveal mnemonic block: each acronym letter expands to show its meaning
// (e.g. SCARF for the five uses of glucose).
// Content block (renders inline within a content screen's blocks array).
// Shape: { title?, label?, instruction?, items: [{ letter, word, detail }] }
export default function AcronymMemorise({ block, subject = 'Biology' }) {
  const [open, setOpen] = useState(null)
  const items = block.items || []
  const theme = SUBJECTS[subject] || SUBJECTS.Biology
  const acronym = items.map(item => item.letter).join('')
  const legacyLabelIsInstruction = /tap each letter/i.test(block.label || '')
  const heading = block.title
    || (!legacyLabelIsInstruction && block.label)
    || `${acronym || 'Mnemonic'}: five uses of glucose`
  const instruction = block.instruction || 'Tap each letter to reveal its meaning.'
  const letterSize = SPACING.standard + SPACING.compact
  const spineOffset = SPACING.micro + (letterSize / 2)

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

          {items.map((item, i) => {
            const isOpen = open === i
            const isLast = i === items.length - 1

            return (
              <button
                key={`${item.letter}-${item.word}`}
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
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
                    : GENERAL.backgroundSunken,
                  border: `1px solid ${isOpen
                    ? `rgba(${theme.accentRgb},0.42)`
                    : GENERAL.line.medium}`,
                  boxShadow: isOpen ? `0 0 16px rgba(${theme.accentRgb},0.16)` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...TYPE.titleLarge,
                  color: isOpen ? theme.accent : GENERAL.slate,
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
                      color: GENERAL.slate,
                    }}>
                      Tap to reveal
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
      </div>
    </div>
  )
}
