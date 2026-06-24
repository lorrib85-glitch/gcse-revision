import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import ContinueCTA from '../core/ContinueCTA.jsx'

function ensureStyles() {
  if (document.getElementById('qa-styles')) return
  const s = document.createElement('style')
  s.id = 'qa-styles'
  s.textContent = `
    @keyframes qa-slide-up {
      from { opacity: 0; transform: translateY(40px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes qa-card-in {
      from { opacity: 0; transform: translateX(-8px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes qa-tick-pop {
      0%   { transform: scale(0); }
      70%  { transform: scale(1.35); }
      100% { transform: scale(1); }
    }
  `
  document.head.appendChild(s)
}

// ── Inline SVG icons ─────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="12.5" y1="12.5" x2="16.5" y2="16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" opacity="0.35"/>
    </svg>
  )
}

function IconFeather() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M15 2.5C11.5 2.5 5.5 8 4 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 2.5C16 4.5 15.5 7 13.5 9S8.5 12 4 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 16.5L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconMask() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 8.5C3 6 4.8 4 7 4H13C15.2 4 17 6 17 8.5V10.5C17 13.2 15.3 15 12.5 15H7.5C4.7 15 3 13.2 3 10.5V8.5Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 8.5C7.6 8.5 8 8.1 8 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M13 8.5C12.4 8.5 12 8.1 12 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8.5 12C9 12.8 11 12.8 11.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconBulb() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3C7 3 5 5.3 5 8C5 10.2 6.3 12 8 12.8V14.5H12V12.8C13.7 12 15 10.2 15 8C15 5.3 13 3 10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M8.5 16.5H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9.5 18H10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconFlame() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 17C7 15 4 12 4 8.5C4 6 5.8 4 8 4C8 4 7 6.5 9.5 7.5C9.5 7.5 8.5 5 11 3.5C13 3.5 16 6 16 9C16 12.5 13 15 10 17Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M10 17C9 15 9.5 13 11 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.55"/>
    </svg>
  )
}

const ICON_MAP = { search: IconSearch, feather: IconFeather, mask: IconMask, bulb: IconBulb, flame: IconFlame }

// ── Ripped seam ───────────────────────────────────────────────────────────────

function RippedSeam({ bgColor, accentColor }) {
  return (
    <div style={{ position: 'relative', height: 26, marginTop: -1, flexShrink: 0 }}>
      <svg
        viewBox="0 0 420 26"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        aria-hidden="true"
      >
        {/* Fill below jagged line with bg color — masks the hero gradient */}
        <path
          d="M0,26 L0,13 L7,6 L14,15 L22,5 L30,14 L38,4 L46,15 L54,7 L62,17 L70,5 L78,15 L86,7 L94,19 L102,9 L110,17 L118,5 L126,15 L134,7 L142,19 L150,7 L158,17 L166,5 L174,15 L182,7 L190,19 L198,9 L206,17 L214,5 L222,15 L230,3 L238,15 L246,7 L254,19 L262,9 L270,17 L278,5 L286,15 L294,7 L302,17 L310,5 L318,15 L326,7 L334,19 L342,9 L350,17 L358,5 L366,15 L374,7 L382,17 L390,9 L398,19 L406,11 L414,19 L420,11 L420,26 Z"
          fill={bgColor}
        />
        {/* Accent glow along the tear line */}
        <path
          d="M0,13 L7,6 L14,15 L22,5 L30,14 L38,4 L46,15 L54,7 L62,17 L70,5 L78,15 L86,7 L94,19 L102,9 L110,17 L118,5 L126,15 L134,7 L142,19 L150,7 L158,17 L166,5 L174,15 L182,7 L190,19 L198,9 L206,17 L214,5 L222,15 L230,3 L238,15 L246,7 L254,19 L262,9 L270,17 L278,5 L286,15 L294,7 L302,17 L310,5 L318,15 L326,7 L334,19 L342,9 L350,17 L358,5 L366,15 L374,7 L382,17 L390,9 L398,19 L406,11 L414,19 L420,11"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeOpacity="0.4"
        />
      </svg>
    </div>
  )
}

// ── Analysis card ─────────────────────────────────────────────────────────────

function AnalysisCard({ item, accentRgb, accent, seen, index, onClick }) {
  const IconComponent = ICON_MAP[item.icon] || IconSearch
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        background: seen
          ? `rgba(${accentRgb}, 0.07)`
          : 'rgba(255,255,255,0.025)',
        border: `1px solid ${seen
          ? `rgba(${accentRgb}, 0.22)`
          : 'rgba(255,255,255,0.07)'}`,
        borderRadius: RADII.medium,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'background 0.2s, border-color 0.2s',
        animation: `qa-card-in 0.4s ease both`,
        animationDelay: `${index * 0.08 + 0.35}s`,
      }}
    >
      {/* Icon badge */}
      <div style={{
        width: 44, height: 44, flexShrink: 0,
        background: seen
          ? `rgba(${accentRgb}, 0.14)`
          : 'rgba(255,255,255,0.04)',
        border: `1px solid ${seen
          ? `rgba(${accentRgb}, 0.28)`
          : 'rgba(255,255,255,0.09)'}`,
        borderRadius: RADII.small,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: seen ? accent : 'rgba(255,255,255,0.4)',
        transition: 'all 0.2s',
      }}>
        <IconComponent />
      </div>

      {/* Label stack */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          ...TYPE.cardTitle,
          color: seen ? accent : '#E8E2D8',
          marginBottom: 3,
          transition: 'color 0.2s',
        }}>
          {item.heading}
        </div>
        <div style={{
          ...TYPE.captionText,
          color: 'rgba(255,255,255,0.4)',
        }}>
          {item.explainer}
        </div>
      </div>

      {/* Seen tick or chevron */}
      <div style={{
        width: 28, height: 28, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: seen ? accent : 'rgba(255,255,255,0.22)',
      }}>
        {seen ? (
          <svg
            width="22" height="22" viewBox="0 0 22 22" fill="none"
            style={{ animation: 'qa-tick-pop 0.3s cubic-bezier(0.34,1.56,0.64,1) both' }}
            aria-label="Seen"
          >
            <circle cx="11" cy="11" r="10" fill={`rgba(${accentRgb},0.15)`} stroke={accent} strokeWidth="1.5"/>
            <path d="M7 11L10 14L15 8.5" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </button>
  )
}

// ── Expanded item overlay ─────────────────────────────────────────────────────

function ItemExpanded({ item, accent, accentRgb, parchment, palette, onClose }) {
  const IconComponent = ICON_MAP[item.icon] || IconSearch

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.heading}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: palette.backgroundSecondary || palette.background,
        display: 'flex', flexDirection: 'column',
        animation: 'qa-slide-up 0.32s cubic-bezier(0.16,1,0.3,1) both',
      }}
    >
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        maxWidth: 420, width: '100%', margin: '0 auto',
      }}>
        {/* Header row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '52px 20px 18px',
          borderBottom: `1px solid rgba(${accentRgb}, 0.14)`,
          flexShrink: 0,
        }}>
          <div style={{
            width: 52, height: 52, flexShrink: 0,
            background: `rgba(${accentRgb}, 0.12)`,
            border: `1px solid rgba(${accentRgb}, 0.28)`,
            borderRadius: RADII.medium,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: accent,
          }}>
            <IconComponent />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...TYPE.sectionHeading, color: parchment }}>
              {item.heading}
            </div>
            <div style={{ ...TYPE.captionText, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>
              {item.explainer}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 36, height: 36, flexShrink: 0,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: RADII.pill,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'rgba(255,255,255,0.55)',
              fontSize: '0.9rem', fontFamily: "'Sora', sans-serif",
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '22px 20px 28px',
          WebkitOverflowScrolling: 'touch',
        }}>
          {item.content.title && (
            <div style={{
              ...TYPE.metadataText,
              color: accent,
              textTransform: 'uppercase',
              marginBottom: 14,
            }}>
              {item.content.title}
            </div>
          )}

          <p style={{
            ...TYPE.bodyLarge,
            color: parchment,
            margin: 0,
            opacity: 0.88,
          }}>
            {item.content.body}
          </p>

          {/* Key words chips — only when content provides them */}
          {item.content.keyWords?.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{
                ...TYPE.metadataText,
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}>
                Key words
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {item.content.keyWords.map(word => (
                  <span key={word} style={{
                    background: `rgba(${accentRgb}, 0.12)`,
                    border: `1px solid rgba(${accentRgb}, 0.28)`,
                    color: accent,
                    borderRadius: RADII.small,
                    padding: '5px 12px',
                    ...TYPE.captionText,
                    fontWeight: 600,
                  }}>
                    {word}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Done CTA */}
        <div style={{
          padding: '12px 16px calc(12px + env(safe-area-inset-bottom))',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <ContinueCTA
            onClick={onClose}
            label="Done ✓"
            accent={accent}
            textColor={parchment}
          />
        </div>
      </div>
    </div>
  )
}

// ── QuoteAnalyser ─────────────────────────────────────────────────────────────
//
// Full-screen quote analysis screen. Hero quote section (top ~30%) with
// background image and word-by-word text reveal, ripped seam divider, then
// 5 analysis item cards. Each card expands to full screen; Continue gates on
// all items being seen.
//
// Props:
//   block    — { type, quote, location, backgroundImage?, items: [...] }
//   subject  — subject key (defaults to 'English')
//   onContinue — called when learner taps Continue

export default function QuoteAnalyser({ block, subject = 'English', onContinue }) {
  useEffect(() => { ensureStyles() }, [])

  const palette = SUBJECTS[subject] || SUBJECTS.English
  const accent = palette.accent
  const accentRgb = palette.accentRgb
  const parchment = palette.palette?.parchment || '#E9E1D3'

  const [seen, setSeen] = useState(new Set())
  const [activeItem, setActiveItem] = useState(null)
  const allSeen = seen.size >= (block.items?.length || 0)

  // Word-by-word quote reveal
  const quoteWords = (block.quote || '').split(' ')
  const [visibleWords, setVisibleWords] = useState(0)

  useEffect(() => {
    setVisibleWords(0)
    let i = 0
    const iv = setInterval(() => {
      i++
      setVisibleWords(i)
      if (i >= quoteWords.length) clearInterval(iv)
    }, 110)
    return () => clearInterval(iv)
  }, [block.quote]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleClose() {
    setSeen(s => new Set([...s, activeItem.id]))
    setActiveItem(null)
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: palette.background,
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── Quote hero ───────────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        height: '32vh',
        minHeight: 210,
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {block.backgroundImage && (
          <img
            src={block.backgroundImage}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.28) saturate(0.65)',
            }}
          />
        )}

        {/* Gradient: transparent top → bg color at bottom */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(
            to bottom,
            rgba(0,0,0,0) 0%,
            ${palette.background}88 60%,
            ${palette.background} 100%
          )`,
          pointerEvents: 'none',
        }} />

        {/* Quote text + attribution */}
        <div style={{
          position: 'relative', zIndex: 1,
          height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '0 22px 18px',
        }}>
          <blockquote style={{ margin: 0 }}>
            <p style={{
              margin: 0,
              fontFamily: "'Manrope', sans-serif",
              fontSize: 'clamp(1.2rem, 5vw, 1.55rem)',
              fontWeight: 700,
              lineHeight: 1.38,
              letterSpacing: '-0.02em',
              color: parchment,
            }}>
              {quoteWords.map((word, i) => (
                <span
                  key={i}
                  style={{
                    display: 'inline',
                    opacity: i < visibleWords ? 1 : 0,
                    transition: 'opacity 0.28s ease',
                  }}
                >
                  {word}{' '}
                </span>
              ))}
            </p>
          </blockquote>

          {block.location && (
            <p style={{
              margin: '10px 0 0',
              ...TYPE.captionText,
              color: accent,
              opacity: visibleWords >= quoteWords.length ? 1 : 0,
              transition: 'opacity 0.5s ease 0.3s',
              letterSpacing: '0.03em',
            }}>
              {block.location}
            </p>
          )}
        </div>
      </div>

      {/* ── Ripped seam ──────────────────────────────────────────────── */}
      <RippedSeam bgColor={palette.background} accentColor={accent} />

      {/* ── Section eyebrow ──────────────────────────────────────────── */}
      <div style={{ padding: '4px 22px 14px', textAlign: 'center', flexShrink: 0 }}>
        <div style={{
          ...TYPE.metadataText,
          color: `rgba(${accentRgb}, 0.65)`,
          textTransform: 'uppercase',
        }}>
          Quote microscope
        </div>
      </div>

      {/* ── Analysis item cards ───────────────────────────────────────── */}
      <div style={{
        flex: 1,
        padding: '0 14px',
        display: 'flex', flexDirection: 'column', gap: 10,
        paddingBottom: allSeen ? 110 : 36,
      }}>
        {(block.items || []).map((item, i) => (
          <AnalysisCard
            key={item.id}
            item={item}
            accent={accent}
            accentRgb={accentRgb}
            seen={seen.has(item.id)}
            index={i}
            onClick={() => setActiveItem(item)}
          />
        ))}
      </div>

      {/* ── Continue — gated until all items seen ─────────────────────── */}
      {allSeen && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          padding: '16px 16px calc(16px + env(safe-area-inset-bottom))',
          background: `linear-gradient(to top, ${palette.background} 55%, transparent)`,
          zIndex: 10,
          animation: 'qa-slide-up 0.4s ease both',
        }}>
          <div style={{ maxWidth: 420, margin: '0 auto' }}>
            <ContinueCTA
              onClick={onContinue}
              accent={accent}
              textColor={parchment}
            />
          </div>
        </div>
      )}

      {/* ── Expanded item overlay ─────────────────────────────────────── */}
      {activeItem && (
        <ItemExpanded
          item={activeItem}
          accent={accent}
          accentRgb={accentRgb}
          parchment={parchment}
          palette={palette}
          onClose={handleClose}
        />
      )}
    </div>
  )
}
