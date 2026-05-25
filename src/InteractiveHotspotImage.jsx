import { useState } from 'react'

// ── Subject themes ─────────────────────────────────────────────────────────────
const THEMES = {
  Biology: {
    glow:        '#7EE7B7',
    glowRgb:     '126,231,183',
    infoBg:      'transparent',
    border:      'rgba(126,231,183,0.12)',
    text:        '#EAF7F0',
    muted:       'rgba(234,247,240,0.68)',
    factBorder:  'rgba(126,231,183,0.3)',
    labelBg:     'rgba(6,14,10,0.82)',
  },
  History: {
    glow:        '#D4A84B',
    glowRgb:     '212,168,75',
    infoBg:      'transparent',
    border:      'rgba(212,168,75,0.12)',
    text:        '#F5EDD8',
    muted:       'rgba(245,237,216,0.68)',
    factBorder:  'rgba(212,168,75,0.3)',
    labelBg:     'rgba(14,10,4,0.82)',
  },
  Chemistry: {
    glow:        '#5CC8FF',
    glowRgb:     '92,200,255',
    infoBg:      'transparent',
    border:      'rgba(92,200,255,0.12)',
    text:        '#E8F4FF',
    muted:       'rgba(232,244,255,0.68)',
    factBorder:  'rgba(92,200,255,0.3)',
    labelBg:     'rgba(4,10,20,0.82)',
  },
  Physics: {
    glow:        '#5DA9E9',
    glowRgb:     '93,169,233',
    infoBg:      'transparent',
    border:      'rgba(93,169,233,0.12)',
    text:        '#E6F0FF',
    muted:       'rgba(230,240,255,0.68)',
    factBorder:  'rgba(93,169,233,0.3)',
    labelBg:     'rgba(4,8,18,0.82)',
  },
  Maths: {
    glow:        '#2BBE9A',
    glowRgb:     '43,190,154',
    infoBg:      'transparent',
    border:      'rgba(43,190,154,0.12)',
    text:        '#E4F7F2',
    muted:       'rgba(228,247,242,0.68)',
    factBorder:  'rgba(43,190,154,0.3)',
    labelBg:     'rgba(2,12,9,0.82)',
  },
  English: {
    glow:        '#C97090',
    glowRgb:     '201,112,144',
    infoBg:      'transparent',
    border:      'rgba(201,112,144,0.12)',
    text:        '#F5E8EE',
    muted:       'rgba(245,232,238,0.68)',
    factBorder:  'rgba(201,112,144,0.3)',
    labelBg:     'rgba(14,6,8,0.82)',
  },
  Sociology: {
    glow:        '#C9B07C',
    glowRgb:     '201,176,124',
    infoBg:      'transparent',
    border:      'rgba(201,176,124,0.12)',
    text:        '#F5EDD8',
    muted:       'rgba(245,237,216,0.68)',
    factBorder:  'rgba(201,176,124,0.3)',
    labelBg:     'rgba(12,10,4,0.82)',
  },
}

export default function InteractiveHotspotImage({
  subject    = 'Biology',
  title      = '',
  introText  = '',
  image      = '',
  imageAlt   = '',
  hotspots   = [],
}) {
  const theme = THEMES[subject] || THEMES.Biology
  const { glow, glowRgb, border, text, muted, factBorder, labelBg } = theme

  const [selectedId, setSelectedId] = useState(null)
  const [visited,    setVisited]    = useState(new Set())

  const selected = hotspots.find(h => h.id === selectedId) || null
  const allDone  = visited.size === hotspots.length && hotspots.length > 0

  function handleTap(id) {
    setSelectedId(id)
    setVisited(prev => { const n = new Set(prev); n.add(id); return n })
  }

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @keyframes ihi-pulse {
          0%, 100% {
            box-shadow:
              0 0 0 1px rgba(${glowRgb},0.22),
              0 0 18px rgba(${glowRgb},0.42),
              0 0 44px rgba(${glowRgb},0.16);
          }
          50% {
            box-shadow:
              0 0 0 2px rgba(${glowRgb},0.30),
              0 0 28px rgba(${glowRgb},0.58),
              0 0 60px rgba(${glowRgb},0.22);
          }
        }
        @keyframes ihi-label-in {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes ihi-info-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0);   }
        }
        @keyframes ihi-done-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* ── Full-bleed image scene ──────────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        height: 'clamp(480px, 62vh, 760px)',
        overflow: 'hidden',
        // No border-radius, no border, no card — pure full-bleed
      }}>

        {/* Photo */}
        <img
          src={image}
          alt={imageAlt}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            filter: 'brightness(0.88) contrast(1.05) saturate(1.02)',
          }}
        />

        {/* Atmospheric edge vignette */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 50% 38%, transparent 36%, rgba(0,0,0,0.46) 100%)',
        }} />

        {/* Bottom readability gradient for overlaid text */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 22%, transparent 48%)',
        }} />

        {/* Bottom fade to page background — masks the image edge */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: '#080C1A',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 6%, rgba(0,0,0,0.2) 12%, rgba(0,0,0,0) 20%)',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.75) 6%, rgba(0,0,0,0.2) 12%, rgba(0,0,0,0) 20%)',
        }} />

        {/* Hotspot dots */}
        {hotspots.map(h => {
          const isSelected = selectedId === h.id
          const isVisited  = visited.has(h.id)
          const labelOnLeft = h.x > 55

          return (
            <div key={h.id}>
              {/* Dot — no visible border, pure atmospheric glow */}
              <button
                type="button"
                aria-label={`Explore ${h.title}`}
                aria-pressed={isSelected}
                onClick={() => handleTap(h.id)}
                style={{
                  position: 'absolute',
                  left: `${h.x}%`, top: `${h.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '24px', height: '24px',
                  borderRadius: '50%',
                  border: 'none', padding: 0, cursor: 'pointer',
                  background: isVisited
                    ? `rgba(${glowRgb}, 0.16)`
                    : 'rgba(255,255,255,0.04)',
                  boxShadow: isSelected
                    ? `0 0 0 1px rgba(${glowRgb},0.55), 0 0 16px rgba(${glowRgb},0.75), 0 0 44px rgba(${glowRgb},0.32)`
                    : isVisited
                      ? `0 0 0 1px rgba(${glowRgb},0.32), 0 0 12px rgba(${glowRgb},0.46), 0 0 32px rgba(${glowRgb},0.18)`
                      : undefined,
                  animation: isVisited ? 'none' : 'ihi-pulse 2.8s ease-in-out infinite',
                  transition: 'box-shadow 280ms cubic-bezier(0.22, 1, 0.36, 1)',
                  zIndex: isSelected ? 5 : 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <div style={{
                  width: isSelected ? '9px' : isVisited ? '7px' : '5px',
                  height: isSelected ? '9px' : isVisited ? '7px' : '5px',
                  borderRadius: '50%',
                  background: isVisited ? glow : 'rgba(255,255,255,0.85)',
                  boxShadow: isVisited ? `0 0 8px ${glow}` : 'none',
                  transition: 'all 280ms cubic-bezier(0.22, 1, 0.36, 1)',
                }} />
              </button>

              {/* Label — only visible when selected */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: `calc(${h.y}% - 12px)`,
                  ...(labelOnLeft
                    ? { right: `calc(${100 - h.x}% + 18px)` }
                    : { left:  `calc(${h.x}%  + 18px)` }
                  ),
                  background: labelBg,
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  border: `1px solid rgba(${glowRgb},0.16)`,
                  borderRadius: '14px',
                  padding: '10px 14px',
                  fontSize: '16px', fontWeight: 500,
                  color: text, whiteSpace: 'nowrap',
                  pointerEvents: 'none', zIndex: 6,
                  animation: 'ihi-label-in 240ms ease both',
                }}>
                  {h.shortLabel || h.title}
                </div>
              )}
            </div>
          )
        })}

        {/* Title + intro — overlaid at bottom of image */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '0 22px 28px',
          zIndex: 3,
        }}>
          {/* Kicker / explore prompt */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '10px',
          }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: `rgba(${glowRgb}, 0.9)`,
              boxShadow: `0 0 6px rgba(${glowRgb}, 0.6)`,
              animation: 'ihi-pulse 2.4s ease-in-out infinite',
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: '13px', letterSpacing: '0.14em', textTransform: 'uppercase',
              color: `rgba(${glowRgb}, 0.75)`, fontWeight: 600,
            }}>
              Explore
            </span>
            <span style={{
              fontSize: '13px', color: 'rgba(255,255,255,0.28)',
              letterSpacing: '0.06em',
            }}>
              {visited.size} / {hotspots.length}
            </span>
          </div>

          {/* Title */}
          <div style={{
            fontSize: '40px', fontWeight: 700, lineHeight: 1,
            letterSpacing: '-0.03em', color: '#FFFFFF',
            marginBottom: '10px',
          }}>
            {title}
          </div>

          {/* Short intro */}
          {introText && (
            <p style={{
              fontSize: '16px', lineHeight: 1.65, fontWeight: 400,
              color: 'rgba(255,255,255,0.72)', margin: 0,
              maxWidth: '340px',
            }}>
              {introText}
            </p>
          )}
        </div>

        {/* All-explored badge — top right */}
        {allDone && (
          <div style={{
            position: 'absolute', top: '16px', right: '16px', zIndex: 6,
            background: `rgba(${glowRgb}, 0.08)`,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid rgba(${glowRgb}, 0.22)`,
            borderRadius: '20px', padding: '8px 16px',
            fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em',
            color: glow,
            animation: 'ihi-done-in 500ms ease both',
          }}>
            All explored ✓
          </div>
        )}
      </div>

      {/* ── Info section — below image, no card ────────────────────────────── */}
      {selected && (
        <div
          key={selected.id}
          style={{
            padding: '20px 22px 32px',
            animation: 'ihi-info-in 280ms cubic-bezier(0.22, 1, 0.36, 1) both',
          }}
        >
          {/* Thin accent rule */}
          <div style={{
            height: '1px',
            background: `linear-gradient(to right, rgba(${glowRgb},0.28), transparent)`,
            marginBottom: '20px',
          }} />

          {/* Icon + title */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px' }}>
            <div style={{ fontSize: '26px', lineHeight: 1, flexShrink: 0, marginTop: '4px' }}>
              {selected.icon}
            </div>
            <div style={{
              fontSize: '22px', fontWeight: 700, lineHeight: 1.1,
              letterSpacing: '-0.02em', color: text,
            }}>
              {selected.title}
            </div>
          </div>

          {/* Description */}
          <p style={{
            fontSize: '15px', lineHeight: 1.75, fontWeight: 400,
            color: muted, margin: '0 0 16px',
          }}>
            {selected.description}
          </p>

          {/* Why it matters */}
          {selected.extraFact && (
            <div style={{
              borderLeft: `2px solid ${factBorder}`,
              paddingLeft: '14px',
              marginBottom: '16px',
            }}>
              <div style={{
                fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: glow, marginBottom: '6px',
              }}>
                Why it matters:
              </div>
              <p style={{
                fontSize: '14px', lineHeight: 1.65,
                color: muted, margin: 0,
              }}>
                {selected.extraFact}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
