import { useState } from 'react'
import { SUBJECT_ACCENTS, hexToRgb } from '../../constants/subjects.js'
import { SPACING } from '../../constants/spacing.js'

let _erStyled = false
function ensureStyles() {
  if (_erStyled) return
  _erStyled = true
  const el = document.createElement('style')
  el.textContent = `
    @keyframes er-fade {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes er-pulse {
      0%, 100% { opacity: 1; }
      50%      { opacity: 0.70; }
    }
  `
  document.head.appendChild(el)
}

// ─── ExplainReveal v1 ─────────────────────────────────────────────────────────
//
// Block data shape:
// {
//   type: 'explainReveal',
//   title: 'Why medieval treatments failed',
//   intro: 'Let's build the chain of reasoning step by step.',
//   steps: [
//     {
//       id: 'miasma-belief',
//       statement: 'People believed disease spread through',
//       emphasis: 'bad air.',
//       detail: 'This was called miasma theory.',  // optional
//       icon: '⚕',                                 // optional — replaces step number in circle
//     },
//     ...
//   ],
//   reflectionPrompt: 'Can you explain why these treatments failed?', // optional
//   atmosphereImage: '/headers/history-medicine-through-time.png',    // optional
// }

export default function ExplainReveal({ block, subject, onComplete }) {
  ensureStyles()

  const accent    = SUBJECT_ACCENTS[subject] || '#B38B63'
  const rgb       = hexToRgb(accent)
  const steps     = block.steps || []

  const [revealed, setRevealed] = useState(Math.min(1, steps.length))
  const allRevealed = revealed >= steps.length

  function revealNext() {
    if (!allRevealed) setRevealed(r => r + 1)
    else if (onComplete) onComplete()
  }

  const F = { fontFamily: "'Sora', sans-serif" }

  return (
    <div style={{ position: 'relative', ...F }}>

      {/* Optional atmospheric background */}
      {block.atmosphereImage && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
            backgroundImage: `url(${block.atmosphereImage})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.14,
          }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* Section label */}
        <div style={{
          ...F, fontSize: 11, fontWeight: 600,
          letterSpacing: '0.18em', textTransform: 'uppercase',
          color: `rgba(${rgb},0.82)`, marginBottom: 20,
        }}>
          ExplainReveal
        </div>

        {/* Main title */}
        <h2 style={{
          ...F, fontSize: 42, fontWeight: 600,
          lineHeight: 1.08, letterSpacing: '-0.03em',
          color: 'rgba(245,245,245,0.96)',
          maxWidth: '92%', margin: '0 0 24px',
        }}>
          {block.title}
        </h2>

        {/* Intro paragraph */}
        {block.intro && (
          <p style={{
            ...F, fontSize: 19, lineHeight: 1.55, fontWeight: 400,
            color: 'rgba(245,245,245,0.68)',
            maxWidth: '95%', margin: '0 0 40px',
          }}>
            {block.intro}
          </p>
        )}

        {/* Reasoning chain */}
        {steps.slice(0, revealed).map((step, i) => {
          const isLast      = i === revealed - 1
          const isCurrent   = isLast && !allRevealed
          const isNew       = isLast && revealed > 1
          // Show the connector line below this step when something follows
          const hasFollower = !isLast || (allRevealed && !!block.reflectionPrompt)

          return (
            <div
              key={step.id || i}
              style={{
                display: 'flex', gap: SPACING.compact, alignItems: 'flex-start',
                opacity: isCurrent ? 1 : 0.92,
                transition: 'opacity 320ms ease',
                animation: isNew ? 'er-fade 320ms ease both' : 'none',
              }}
            >
              {/* Left: numbered circle + connector line */}
              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', width: 42, flexShrink: 0,
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%',
                  border: `1px solid rgba(${rgb},${isCurrent ? '0.40' : '0.28'})`,
                  background: `rgba(${rgb},${isCurrent ? '0.14' : '0.08'})`,
                  boxShadow: isCurrent ? `0 0 14px rgba(${rgb},0.10)` : 'none',
                  color: accent, fontSize: 18, fontWeight: 600, ...F,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: '320ms ease',
                  animation: isCurrent ? 'er-pulse 4.8s ease-in-out infinite' : 'none',
                }}>
                  {step.icon || i + 1}
                </div>

                {hasFollower && (
                  <div style={{
                    width: 1, flex: 1, minHeight: 28,
                    background: `rgba(${rgb},0.18)`,
                    marginTop: 4, marginBottom: 4,
                  }} />
                )}
              </div>

              {/* Right: statement + emphasis + optional detail */}
              <div style={{
                flex: 1, paddingTop: 10,
                paddingBottom: hasFollower ? 28 : 0,
              }}>
                <div style={{
                  ...F, fontSize: 20, fontWeight: 500,
                  lineHeight: 1.5, color: 'rgba(245,245,245,0.92)',
                  maxWidth: '88%',
                }}>
                  {step.statement}
                  {step.statement && step.emphasis ? ' ' : ''}
                  {step.emphasis && (
                    <span style={{ color: accent, fontWeight: 600 }}>
                      {step.emphasis}
                    </span>
                  )}
                </div>
                {step.detail && (
                  <div style={{
                    ...F, fontSize: 15, lineHeight: 1.55,
                    color: 'rgba(245,245,245,0.48)', marginTop: SPACING.micro,
                  }}>
                    {step.detail}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Reflection prompt — appears after all steps revealed */}
        {allRevealed && block.reflectionPrompt && (
          <div
            style={{
              display: 'flex', gap: SPACING.compact, alignItems: 'flex-start',
              animation: 'er-fade 320ms ease both',
            }}
          >
            {/* ? indicator circle */}
            <div style={{ width: 42, flexShrink: 0 }}>
              <div style={{
                width: 42, height: 42, borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(245,245,245,0.42)',
                fontSize: 20, fontWeight: 600, ...F,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                ?
              </div>
            </div>

            {/* Prompt text + optional continue button */}
            <div style={{ flex: 1, paddingTop: 10 }}>
              <div style={{
                ...F, fontSize: 18, fontWeight: 500,
                lineHeight: 1.5, color: 'rgba(245,245,245,0.82)',
                marginBottom: 12,
              }}>
                {block.reflectionPrompt}
              </div>

              <div style={{
                display: 'flex', alignItems: 'flex-start',
                justifyContent: 'space-between', gap: 12,
              }}>
                <div style={{
                  ...F, fontSize: 14, lineHeight: 1.5,
                  color: 'rgba(245,245,245,0.38)',
                }}>
                  Try explaining the chain in your own words.
                </div>

                {onComplete && (
                  <button
                    onClick={onComplete}
                    style={{
                      background: accent, border: 'none',
                      borderRadius: 14, padding: '11px 20px',
                      color: '#0D0F14', fontSize: 15, fontWeight: 600, ...F,
                      cursor: 'pointer', flexShrink: 0,
                      boxShadow: `0 4px 14px rgba(${rgb},0.20)`,
                    }}
                  >
                    Continue ›
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Reveal next button — while steps remain */}
        {!allRevealed && (
          <button
            onClick={revealNext}
            style={{
              background: `rgba(${rgb},0.10)`,
              border: `1px solid rgba(${rgb},0.22)`,
              borderRadius: 14, padding: '13px 22px',
              color: accent, fontSize: 15, fontWeight: 600, ...F,
              cursor: 'pointer', marginTop: SPACING.compact,
              transition: '220ms ease',
              display: 'inline-flex', alignItems: 'center', gap: SPACING.micro,
            }}
          >
            Reveal next ›
          </button>
        )}

      </div>
    </div>
  )
}
