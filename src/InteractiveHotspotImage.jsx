import { useState } from 'react'

// ── Subject themes ─────────────────────────────────────────────────────────────
const THEMES = {
  Biology: {
    glow:         '#7EE7B7',
    glowRgb:      '126,231,183',
    cardBg:       'linear-gradient(180deg, rgba(18,30,24,0.88), rgba(10,18,14,0.94))',
    border:       'rgba(170,255,210,0.12)',
    text:         '#EAF7F0',
    muted:        'rgba(234,247,240,0.72)',
    factBg:       'rgba(126,231,183,0.06)',
    factBorder:   'rgba(126,231,183,0.12)',
    labelBg:      'rgba(10,20,16,0.84)',
    instructionColor: 'rgba(200,255,227,0.85)',
  },
  History: {
    glow:         '#D4A84B',
    glowRgb:      '212,168,75',
    cardBg:       'linear-gradient(180deg, rgba(28,20,10,0.88), rgba(16,12,6,0.94))',
    border:       'rgba(212,168,75,0.12)',
    text:         '#F5EDD8',
    muted:        'rgba(245,237,216,0.72)',
    factBg:       'rgba(212,168,75,0.06)',
    factBorder:   'rgba(212,168,75,0.12)',
    labelBg:      'rgba(16,10,4,0.84)',
    instructionColor: 'rgba(245,220,160,0.85)',
  },
  Chemistry: {
    glow:         '#5CC8FF',
    glowRgb:      '92,200,255',
    cardBg:       'linear-gradient(180deg, rgba(10,18,30,0.88), rgba(6,10,20,0.94))',
    border:       'rgba(92,200,255,0.12)',
    text:         '#E8F4FF',
    muted:        'rgba(232,244,255,0.72)',
    factBg:       'rgba(92,200,255,0.06)',
    factBorder:   'rgba(92,200,255,0.12)',
    labelBg:      'rgba(4,10,20,0.84)',
    instructionColor: 'rgba(180,220,255,0.85)',
  },
  Physics: {
    glow:         '#5DA9E9',
    glowRgb:      '93,169,233',
    cardBg:       'linear-gradient(180deg, rgba(10,16,28,0.88), rgba(6,10,18,0.94))',
    border:       'rgba(93,169,233,0.12)',
    text:         '#E6F0FF',
    muted:        'rgba(230,240,255,0.72)',
    factBg:       'rgba(93,169,233,0.06)',
    factBorder:   'rgba(93,169,233,0.12)',
    labelBg:      'rgba(4,8,18,0.84)',
    instructionColor: 'rgba(180,210,255,0.85)',
  },
  Maths: {
    glow:         '#2BBE9A',
    glowRgb:      '43,190,154',
    cardBg:       'linear-gradient(180deg, rgba(8,22,18,0.88), rgba(4,14,11,0.94))',
    border:       'rgba(43,190,154,0.12)',
    text:         '#E4F7F2',
    muted:        'rgba(228,247,242,0.72)',
    factBg:       'rgba(43,190,154,0.06)',
    factBorder:   'rgba(43,190,154,0.12)',
    labelBg:      'rgba(2,12,9,0.84)',
    instructionColor: 'rgba(160,240,210,0.85)',
  },
  English: {
    glow:         '#C97090',
    glowRgb:      '201,112,144',
    cardBg:       'linear-gradient(180deg, rgba(24,12,16,0.88), rgba(16,8,10,0.94))',
    border:       'rgba(201,112,144,0.12)',
    text:         '#F5E8EE',
    muted:        'rgba(245,232,238,0.72)',
    factBg:       'rgba(201,112,144,0.06)',
    factBorder:   'rgba(201,112,144,0.12)',
    labelBg:      'rgba(14,6,8,0.84)',
    instructionColor: 'rgba(240,190,210,0.85)',
  },
  Sociology: {
    glow:         '#C9B07C',
    glowRgb:      '201,176,124',
    cardBg:       'linear-gradient(180deg, rgba(22,18,10,0.88), rgba(14,12,6,0.94))',
    border:       'rgba(201,176,124,0.12)',
    text:         '#F5EDD8',
    muted:        'rgba(245,237,216,0.72)',
    factBg:       'rgba(201,176,124,0.06)',
    factBorder:   'rgba(201,176,124,0.12)',
    labelBg:      'rgba(12,10,4,0.84)',
    instructionColor: 'rgba(240,220,160,0.85)',
  },
}

// ── Reusable component ─────────────────────────────────────────────────────────
export default function InteractiveHotspotImage({
  subject    = 'Biology',
  title      = '',
  introText  = '',
  image      = '',
  imageAlt   = '',
  hotspots   = [],
}) {
  const theme = THEMES[subject] || THEMES.Biology
  const { glow, glowRgb, cardBg, border, text, muted,
          factBg, factBorder, labelBg, instructionColor } = theme

  const [selectedId, setSelectedId] = useState(null)
  const [visited,    setVisited]    = useState(new Set())

  const selected = hotspots.find(h => h.id === selectedId) || null
  const allDone  = visited.size === hotspots.length && hotspots.length > 0

  function handleTap(id) {
    // Always select — never toggle closed by re-tapping
    setSelectedId(id)
    setVisited(prev => { const n = new Set(prev); n.add(id); return n })
  }

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", maxWidth: '430px', margin: '0 auto' }}>
      <style>{`
        @keyframes ihi-pulse {
          0%, 100% { box-shadow:
            0 0 0 1px rgba(${glowRgb},0.25),
            0 0 20px rgba(${glowRgb},0.45),
            0 0 50px rgba(${glowRgb},0.18); }
          50%       { box-shadow:
            0 0 0 2px rgba(${glowRgb},0.35),
            0 0 28px rgba(${glowRgb},0.60),
            0 0 64px rgba(${glowRgb},0.24); }
        }
        @keyframes ihi-orb {
          0%, 100% { opacity: 0.7; transform: scale(1);   }
          50%       { opacity: 1;   transform: scale(1.25); }
        }
        @keyframes ihi-label-in {
          from { opacity: 0; transform: translateX(-5px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes ihi-card-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>

      {/* Title */}
      <div style={{
        fontSize: '40px', fontWeight: 700, lineHeight: 1,
        letterSpacing: '-0.03em', color: text,
        marginTop: '20px', marginBottom: '14px',
      }}>
        {title}
      </div>

      {/* Intro paragraph */}
      {introText && introText.split('\n\n').map((para, i) => (
        <p key={i} style={{
          fontSize: '18px', lineHeight: 1.7, fontWeight: 400,
          color: muted, margin: '0 0 14px',
        }}>
          {para}
        </p>
      ))}

      {/* Instruction row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        fontSize: '15px', color: instructionColor,
        marginTop: '6px', marginBottom: '18px',
      }}>
        {/* Pulsing orb */}
        <div style={{
          flexShrink: 0, width: '10px', height: '10px', borderRadius: '50%',
          background: `rgba(${glowRgb}, 0.85)`,
          boxShadow: `0 0 6px rgba(${glowRgb},0.6), 0 0 14px rgba(${glowRgb},0.3)`,
          animation: 'ihi-orb 2.4s ease-in-out infinite',
        }} />
        <span>
          Tap each hotspot to explore.{' '}
          <span style={{ color: muted }}>Visited hotspots stay illuminated.</span>
        </span>
      </div>

      {/* ── Image container ── */}
      <div style={{
        position: 'relative', borderRadius: '28px', overflow: 'hidden',
        aspectRatio: '4 / 5', background: '#111',
      }}>
        {/* Photo */}
        <img
          src={image}
          alt={imageAlt}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.88) contrast(1.05) saturate(1.02)',
          }}
        />

        {/* Edge vignette */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `
            radial-gradient(ellipse at center, transparent 42%, rgba(4,8,6,0.55) 100%),
            linear-gradient(0deg, rgba(4,8,6,0.48) 0%, transparent 28%)
          `,
        }} />

        {/* Hotspot dots */}
        {hotspots.map(h => {
          const isSelected = selectedId === h.id
          const isVisited  = visited.has(h.id)
          const labelOnLeft = h.x > 55

          return (
            <div key={h.id}>
              {/* Dot */}
              <button
                type="button"
                aria-label={`Explore ${h.title}`}
                aria-pressed={isSelected}
                onClick={() => handleTap(h.id)}
                style={{
                  position: 'absolute',
                  left: `${h.x}%`, top: `${h.y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '32px', height: '32px',
                  borderRadius: '50%',
                  border: 'none', padding: 0, cursor: 'pointer',
                  background: isVisited
                    ? `rgba(${glowRgb}, 0.22)`
                    : 'rgba(255,255,255,0.07)',
                  boxShadow: isSelected
                    ? `0 0 0 1px rgba(${glowRgb},0.6), 0 0 22px rgba(${glowRgb},0.75), 0 0 54px rgba(${glowRgb},0.28)`
                    : isVisited
                      ? `0 0 0 1px rgba(${glowRgb},0.40), 0 0 18px rgba(${glowRgb},0.45), 0 0 40px rgba(${glowRgb},0.18)`
                      : undefined,
                  animation: isVisited ? 'none' : 'ihi-pulse 2.8s ease-in-out infinite',
                  transition: 'all 280ms cubic-bezier(0.22, 1, 0.36, 1)',
                  zIndex: isSelected ? 3 : 2,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {/* Centre dot */}
                <div style={{
                  width: isSelected ? '10px' : isVisited ? '8px' : '6px',
                  height: isSelected ? '10px' : isVisited ? '8px' : '6px',
                  borderRadius: '50%',
                  background: isVisited ? glow : 'rgba(255,255,255,0.88)',
                  boxShadow: isVisited ? `0 0 10px ${glow}` : 'none',
                  transition: 'all 280ms cubic-bezier(0.22, 1, 0.36, 1)',
                }} />
              </button>

              {/* Label — only visible when selected */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: `calc(${h.y}% - 14px)`,
                  ...(labelOnLeft
                    ? { right: `calc(${100 - h.x}% + 22px)` }
                    : { left:  `calc(${h.x}% + 22px)` }
                  ),
                  background: labelBg,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: `1px solid rgba(${glowRgb},0.16)`,
                  borderRadius: '14px',
                  padding: '10px 14px',
                  fontSize: '16px', fontWeight: 500,
                  color: text,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  zIndex: 4,
                  animation: 'ihi-label-in 260ms ease both',
                }}>
                  {h.shortLabel || h.title}
                </div>
              )}
            </div>
          )
        })}

        {/* Completion badge */}
        {allDone && (
          <div style={{
            position: 'absolute', top: '14px', right: '14px',
            background: `rgba(${glowRgb}, 0.10)`,
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: `1px solid rgba(${glowRgb}, 0.28)`,
            borderRadius: '20px', padding: '8px 16px',
            fontSize: '13px', fontWeight: 600,
            letterSpacing: '0.06em', color: glow,
            animation: 'ihi-label-in 400ms ease both',
          }}>
            All explored ✓
          </div>
        )}
      </div>

      {/* ── Info card ── */}
      {selected ? (
        <div
          key={selected.id}
          style={{
            background: cardBg,
            borderRadius: '28px',
            border: `1px solid ${border}`,
            padding: '24px',
            marginTop: '18px',
            animation: 'ihi-card-in 260ms cubic-bezier(0.22, 1, 0.36, 1) both',
          }}
        >
          {/* Icon + title */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
            <div style={{ fontSize: '28px', lineHeight: 1, flexShrink: 0, marginTop: '3px' }}>
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
            fontSize: '15px', lineHeight: 1.7, fontWeight: 400,
            color: muted, margin: '0 0 16px',
          }}>
            {selected.description}
          </p>

          {/* Extra fact box */}
          {selected.extraFact && (
            <div style={{
              background: factBg,
              border: `1px solid ${factBorder}`,
              borderRadius: '18px', padding: '18px',
              marginBottom: '18px',
            }}>
              <div style={{
                fontSize: '11px', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: glow, marginBottom: '8px',
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

          {/* Progress */}
          <div style={{
            fontSize: '13px', fontWeight: 600,
            color: `rgba(${glowRgb}, 0.65)`,
            letterSpacing: '0.06em',
          }}>
            {visited.size} / {hotspots.length} explored
          </div>
        </div>
      ) : (
        /* Default placeholder when nothing selected */
        <div style={{
          background: cardBg,
          borderRadius: '28px',
          border: `1px solid ${border}`,
          padding: '22px 24px',
          marginTop: '18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '14px', color: muted }}>
            Tap a glowing point to explore.
          </span>
          <span style={{
            fontSize: '13px', fontWeight: 600,
            color: `rgba(${glowRgb}, 0.65)`, letterSpacing: '0.06em',
          }}>
            {visited.size} / {hotspots.length}
          </span>
        </div>
      )}
    </div>
  )
}
