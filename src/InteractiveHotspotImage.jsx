import { useState } from 'react'

const THEMES = {
  Biology: {
    glow:          '#7EE7B7',
    glowRgb:       '126,231,183',
    text:          '#EAF7F0',
    muted:         'rgba(234,247,240,0.82)',
    factBorder:    'rgba(126,231,183,0.30)',
    labelBg:       'rgba(8,18,14,0.82)',
    infoBg:        'linear-gradient(180deg, rgba(18,30,24,0.92), rgba(10,18,14,0.96))',
    infoBorder:    'rgba(126,231,183,0.10)',
    progressColor: 'rgba(126,231,183,0.84)',
    ctaBg:         'rgba(126,231,183,0.16)',
    ctaBorder:     'rgba(126,231,183,0.18)',
    pageBg:        '#07130F',
  },
  History: {
    glow:          '#D4A84B',
    glowRgb:       '212,168,75',
    text:          '#F5EDD8',
    muted:         'rgba(245,237,216,0.82)',
    factBorder:    'rgba(212,168,75,0.30)',
    labelBg:       'rgba(14,10,4,0.82)',
    infoBg:        'linear-gradient(180deg, rgba(28,20,10,0.92), rgba(16,12,6,0.96))',
    infoBorder:    'rgba(212,168,75,0.10)',
    progressColor: 'rgba(212,168,75,0.84)',
    ctaBg:         'rgba(212,168,75,0.16)',
    ctaBorder:     'rgba(212,168,75,0.18)',
    pageBg:        '#0F0A03',
  },
  Chemistry: {
    glow:          '#5CC8FF',
    glowRgb:       '92,200,255',
    text:          '#E8F4FF',
    muted:         'rgba(232,244,255,0.82)',
    factBorder:    'rgba(92,200,255,0.30)',
    labelBg:       'rgba(4,10,20,0.82)',
    infoBg:        'linear-gradient(180deg, rgba(10,18,30,0.92), rgba(6,10,20,0.96))',
    infoBorder:    'rgba(92,200,255,0.10)',
    progressColor: 'rgba(92,200,255,0.84)',
    ctaBg:         'rgba(92,200,255,0.16)',
    ctaBorder:     'rgba(92,200,255,0.18)',
    pageBg:        '#020810',
  },
  Physics: {
    glow:          '#5DA9E9',
    glowRgb:       '93,169,233',
    text:          '#E6F0FF',
    muted:         'rgba(230,240,255,0.82)',
    factBorder:    'rgba(93,169,233,0.30)',
    labelBg:       'rgba(4,8,18,0.82)',
    infoBg:        'linear-gradient(180deg, rgba(10,16,28,0.92), rgba(6,10,18,0.96))',
    infoBorder:    'rgba(93,169,233,0.10)',
    progressColor: 'rgba(93,169,233,0.84)',
    ctaBg:         'rgba(93,169,233,0.16)',
    ctaBorder:     'rgba(93,169,233,0.18)',
    pageBg:        '#020710',
  },
  Maths: {
    glow:          '#2BBE9A',
    glowRgb:       '43,190,154',
    text:          '#E4F7F2',
    muted:         'rgba(228,247,242,0.82)',
    factBorder:    'rgba(43,190,154,0.30)',
    labelBg:       'rgba(2,12,9,0.82)',
    infoBg:        'linear-gradient(180deg, rgba(8,22,18,0.92), rgba(4,14,11,0.96))',
    infoBorder:    'rgba(43,190,154,0.10)',
    progressColor: 'rgba(43,190,154,0.84)',
    ctaBg:         'rgba(43,190,154,0.16)',
    ctaBorder:     'rgba(43,190,154,0.18)',
    pageBg:        '#020C09',
  },
  English: {
    glow:          '#C97090',
    glowRgb:       '201,112,144',
    text:          '#F5E8EE',
    muted:         'rgba(245,232,238,0.82)',
    factBorder:    'rgba(201,112,144,0.30)',
    labelBg:       'rgba(14,6,8,0.82)',
    infoBg:        'linear-gradient(180deg, rgba(24,10,14,0.92), rgba(16,6,10,0.96))',
    infoBorder:    'rgba(201,112,144,0.10)',
    progressColor: 'rgba(201,112,144,0.84)',
    ctaBg:         'rgba(201,112,144,0.16)',
    ctaBorder:     'rgba(201,112,144,0.18)',
    pageBg:        '#0A0406',
  },
  Sociology: {
    glow:          '#C9B07C',
    glowRgb:       '201,176,124',
    text:          '#F5EDD8',
    muted:         'rgba(245,237,216,0.82)',
    factBorder:    'rgba(201,176,124,0.30)',
    labelBg:       'rgba(12,10,4,0.82)',
    infoBg:        'linear-gradient(180deg, rgba(22,18,8,0.92), rgba(14,12,4,0.96))',
    infoBorder:    'rgba(201,176,124,0.10)',
    progressColor: 'rgba(201,176,124,0.84)',
    ctaBg:         'rgba(201,176,124,0.16)',
    ctaBorder:     'rgba(201,176,124,0.18)',
    pageBg:        '#080602',
  },
}

// ── Label positioning: 4 directions based on hotspot location ─────────────────
function getLabelPos(h) {
  const onLeft  = h.x > 55
  const nearTop = h.y < 18

  const horiz = onLeft
    ? { right: `calc(${100 - h.x}% + 18px)` }
    : { left:  `calc(${h.x}%  + 18px)` }

  const vert = nearTop
    ? { top: `calc(${h.y}% + 10px)` }
    : { top: `calc(${h.y}% - 16px)` }

  return { ...horiz, ...vert }
}

export default function InteractiveHotspotImage({
  subject    = 'Biology',
  title      = '',
  introText  = '',
  image      = '',
  imageAlt   = '',
  hotspots   = [],
  ctaLabel   = 'Explore',
  onContinue,
}) {
  const theme = THEMES[subject] || THEMES.Biology
  const {
    glow, glowRgb, text, muted, factBorder, labelBg,
    infoBg, infoBorder, progressColor, ctaBg, ctaBorder, pageBg,
  } = theme

  const [viewMode,   setViewMode]   = useState('intro')
  const [selectedId, setSelectedId] = useState(null)
  const [visited,    setVisited]    = useState(new Set())

  const isExplore    = viewMode === 'explore'
  const introVisible = !isExplore
  const selected     = hotspots.find(h => h.id === selectedId) || null
  const allDone      = visited.size === hotspots.length && hotspots.length > 0

  function handleTap(id) {
    if (!isExplore) return
    setSelectedId(id)
    setVisited(prev => { const n = new Set(prev); n.add(id); return n })
  }

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", position: 'relative', width: '100%', background: pageBg }}>
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
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes ihi-info-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ihi-cta:hover  { background: rgba(${glowRgb},0.22) !important; }
        .ihi-cta:active { opacity: 0.8; }
      `}</style>

      {/* ── IMAGE CONTAINER — full natural dimensions, no cropping ─────────── */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>

        {/* Image — width 100%, height auto preserves full aspect ratio */}
        <img
          src={image}
          alt={imageAlt}
          draggable={false}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            filter: isExplore
              ? 'brightness(0.92) blur(0px) saturate(1.02)'
              : 'brightness(0.42) blur(1.2px) saturate(0.92)',
            transform: isExplore ? 'scale(1)' : 'scale(1.02)',
            transition: 'filter 420ms cubic-bezier(0.22, 1, 0.36, 1), transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
            userSelect: 'none',
          }}
        />

        {/* Cinematic gradient overlay — always visible */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(3,7,6,0.12) 0%, rgba(3,7,6,0.22) 24%, rgba(3,7,6,0.52) 62%, rgba(3,7,6,0.88) 100%)',
        }} />

        {/* ── INTRO OVERLAY — slides/fades out when entering explore ─────── */}
        <div style={{
          position: 'absolute', left: '28px', right: '28px', bottom: '72px',
          zIndex: 5,
          opacity:   introVisible ? 1 : 0,
          transform: introVisible ? 'translateY(0)' : 'translateY(18px)',
          transition: 'opacity 420ms cubic-bezier(0.22, 1, 0.36, 1), transform 420ms cubic-bezier(0.22, 1, 0.36, 1)',
          pointerEvents: introVisible ? 'auto' : 'none',
        }}>
          <div style={{
            fontSize: 'clamp(42px, 7vw, 64px)',
            fontWeight: 700,
            lineHeight: 0.96,
            letterSpacing: '-0.04em',
            color: '#F3FFF7',
            maxWidth: '9ch',
            whiteSpace: 'pre-line',
          }}>
            {title}
          </div>

          <p style={{
            margin: '18px 0 0',
            fontSize: '18px',
            lineHeight: 1.65,
            fontWeight: 400,
            color: 'rgba(234,247,240,0.82)',
            maxWidth: '28ch',
          }}>
            {introText}
          </p>

          <button
            type="button"
            className="ihi-cta"
            onClick={() => setViewMode('explore')}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '28px',
              height: '54px',
              padding: '0 24px',
              borderRadius: '999px',
              background: ctaBg,
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: `1px solid ${ctaBorder}`,
              color: '#EAF7F0',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              transition: 'background 160ms ease',
            }}
          >
            {ctaLabel}
          </button>
        </div>

        {/* ── HOTSPOT DOTS ─────────────────────────────────────────────────── */}
        {hotspots.map(h => {
          const isSelected = selectedId === h.id
          const isVisited  = visited.has(h.id)

          return (
            <div key={h.id}>
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
                  border: 'none', padding: 0,
                  cursor: isExplore ? 'pointer' : 'default',
                  background: isVisited
                    ? `rgba(${glowRgb}, 0.16)`
                    : 'rgba(255,255,255,0.04)',
                  boxShadow: isSelected
                    ? `0 0 0 1px rgba(${glowRgb},0.55), 0 0 16px rgba(${glowRgb},0.75), 0 0 44px rgba(${glowRgb},0.32)`
                    : isVisited
                      ? `0 0 0 1px rgba(${glowRgb},0.32), 0 0 12px rgba(${glowRgb},0.46), 0 0 32px rgba(${glowRgb},0.18)`
                      : `0 0 0 1px rgba(${glowRgb},0.25), 0 0 20px rgba(${glowRgb},0.45), 0 0 50px rgba(${glowRgb},0.18)`,
                  opacity: isExplore ? 1 : 0.22,
                  pointerEvents: isExplore ? 'auto' : 'none',
                  animation: (!isVisited && isExplore) ? 'ihi-pulse 2.8s ease-in-out infinite' : 'none',
                  transition: 'opacity 420ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 280ms cubic-bezier(0.22, 1, 0.36, 1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: isSelected ? 5 : 4,
                }}
              >
                <div style={{
                  width:  isSelected ? '9px'  : isVisited ? '7px'  : '5px',
                  height: isSelected ? '9px'  : isVisited ? '7px'  : '5px',
                  borderRadius: '50%',
                  background: isVisited ? glow : 'rgba(255,255,255,0.85)',
                  boxShadow: isVisited ? `0 0 8px ${glow}` : 'none',
                  transition: 'all 280ms cubic-bezier(0.22, 1, 0.36, 1)',
                }} />
              </button>

              {/* Label — selected hotspot only, explore mode only */}
              {isSelected && isExplore && (
                <div style={{
                  position: 'absolute',
                  ...getLabelPos(h),
                  background: labelBg,
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: `1px solid rgba(${glowRgb},0.12)`,
                  borderRadius: '16px',
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

        {/* ── EXPLORE PROGRESS — top left ───────────────────────────────────── */}
        <div style={{
          position: 'absolute', top: '22px', left: '22px', zIndex: 6,
          fontSize: '13px', fontWeight: 600, letterSpacing: '0.16em',
          color: progressColor,
          pointerEvents: 'none',
          opacity: isExplore ? 1 : 0,
          transition: 'opacity 420ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}>
          EXPLORE {visited.size}/{hotspots.length}
        </div>
      </div>

      {/* ── INFO PANEL — below image, card style ─────────────────────────────── */}
      {selected && isExplore && (
        <div
          key={selected.id}
          style={{
            marginTop: '24px',
            padding: '28px',
            background: infoBg,
            border: `1px solid ${infoBorder}`,
            borderRadius: '28px',
            animation: 'ihi-info-in 280ms cubic-bezier(0.22, 1, 0.36, 1) both',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '12px' }}>
            <div style={{ fontSize: '28px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>
              {selected.icon}
            </div>
            <div style={{
              fontSize: '22px', fontWeight: 700, lineHeight: 1.1,
              letterSpacing: '-0.02em', color: text,
            }}>
              {selected.title}
            </div>
          </div>

          <p style={{
            fontSize: '15px', lineHeight: 1.75, fontWeight: 400,
            color: muted, margin: '0 0 16px',
          }}>
            {selected.description}
          </p>

          {selected.extraFact && (
            <div style={{
              borderLeft: `2px solid rgba(${glowRgb},0.30)`,
              paddingLeft: '14px',
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

      {/* ── CONTINUE — fades in only when all hotspots visited ───────────────── */}
      {isExplore && onContinue && (
        <div style={{
          marginTop: '32px',
          paddingBottom: '8px',
          display: 'flex',
          justifyContent: 'flex-end',
          opacity:   allDone ? 1 : 0,
          transform: allDone ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 480ms cubic-bezier(0.22, 1, 0.36, 1), transform 480ms cubic-bezier(0.22, 1, 0.36, 1)',
          pointerEvents: allDone ? 'auto' : 'none',
        }}>
          <button
            type="button"
            onClick={onContinue}
            style={{
              height: '52px', padding: '0 28px', borderRadius: '999px',
              background: `rgba(${glowRgb}, 0.16)`,
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: `1px solid rgba(${glowRgb}, 0.22)`,
              color: text, fontSize: '16px', fontWeight: 600,
              cursor: 'pointer', letterSpacing: '0.01em',
            }}
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}
