import { useState } from 'react'
import { GENERAL } from '../../constants/generalTheme.js'
import { SPACING } from '../../constants/spacing.js'
import { SUBJECTS } from '../../constants/subjects.js'
import { TYPE } from '../../constants/typography.js'

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

  return (
    <div style={{ margin: `${SPACING.compact}px 0` }}>
      <div style={{
        background: GENERAL.backgroundSurface,
        border: `1px solid ${GENERAL.line.soft}`,
        borderRadius: 18,
        padding: SPACING.compact,
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.micro }}>
          {items.map((item, i) => {
            const isOpen = open === i

            return (
              <button
                key={`${item.letter}-${item.word}`}
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                style={{
                  width: '100%',
                  background: isOpen
                    ? `rgba(${theme.accentRgb},0.08)`
                    : GENERAL.surfaceTint,
                  border: `1px solid ${isOpen
                    ? `rgba(${theme.accentRgb},0.30)`
                    : GENERAL.line.soft}`,
                  borderRadius: 12,
                  padding: SPACING.compact,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: SPACING.compact,
                  transition: 'background 200ms ease, border-color 200ms ease',
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  flexShrink: 0,
                  background: isOpen
                    ? `rgba(${theme.accentRgb},0.14)`
                    : GENERAL.backgroundSunken,
                  border: `1px solid ${isOpen
                    ? `rgba(${theme.accentRgb},0.34)`
                    : GENERAL.line.medium}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...TYPE.titleLarge,
                  color: isOpen ? theme.accent : GENERAL.slate,
                  transition: 'background 200ms ease, border-color 200ms ease, color 200ms ease',
                }}>
                  {item.letter}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
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

                <span
                  aria-hidden="true"
                  style={{
                    color: isOpen ? theme.accent : GENERAL.neutral[300],
                    fontSize: '1rem',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'color 200ms ease, transform 200ms ease',
                  }}
                >
                  ▾
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
