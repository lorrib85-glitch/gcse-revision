import { useState } from 'react'
import { GENERAL } from '../../constants/generalTheme.js'
import { TYPE } from '../../constants/typography.js'

// ─── FlashcardsBlock — unscored prompt/answer reveal grid ─────────────────────
//
// Extracted from ChapterPlayer so the existing runtime pattern can be reviewed in
// the Component Lab without maintaining a second implementation.
//
// block shape: {
//   cards: [{ id?, front, back }]
// }
export default function FlashcardsBlock({ block = {} }) {
  const cards = Array.isArray(block.cards) ? block.cards : []
  const [flipped, setFlipped] = useState(() => new Set())

  function toggle(index) {
    setFlipped(previous => {
      const next = new Set(previous)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 10,
        margin: '14px 0',
      }}
    >
      {cards.map((card, index) => {
        const isFlipped = flipped.has(index)
        const key = card.id || `${card.front}-${index}`

        return (
          <button
            key={key}
            type="button"
            onClick={() => toggle(index)}
            aria-expanded={isFlipped}
            aria-label={`${card.front}: ${isFlipped ? 'hide answer' : 'reveal answer'}`}
            style={{
              background: isFlipped
                ? `linear-gradient(145deg, ${GENERAL.neutral[1]}, ${GENERAL.neutral[0]})`
                : '#10182B',
              border: `1.5px solid ${isFlipped ? `rgba(${GENERAL.tealRgb},.4)` : '#2A3552'}`,
              borderRadius: 14,
              padding: '16px 12px',
              cursor: 'pointer',
              textAlign: 'center',
              minHeight: 90,
              transition: 'all .22s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isFlipped ? `0 0 16px rgba(${GENERAL.tealRgb},.12)` : 'none',
            }}
          >
            <div>
              <div
                style={{
                  ...TYPE.titleMedium,
                  fontSize: '.88rem',
                  color: isFlipped ? GENERAL.teal : '#E0E6F0',
                  marginBottom: isFlipped ? 6 : 0,
                }}
              >
                {card.front}
              </div>

              {isFlipped && (
                <div
                  className="fade-up"
                  style={{
                    ...TYPE.caption,
                    color: '#9CA8C7',
                  }}
                >
                  {card.back}
                </div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
