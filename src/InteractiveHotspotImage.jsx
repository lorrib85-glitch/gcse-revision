import { useState, useEffect } from 'react'

const THEMES = {
  Biology: {
    glow:          '#7EE7B7',
    glowRgb:       '126,231,183',
    text:          '#EAF7F0',
    muted:         'rgba(234,247,240,0.82)',
    labelBg:       'rgba(6,16,12,0.88)',
    sheetBg:       'linear-gradient(180deg, rgba(7,20,15,0.97), rgba(4,13,10,0.99))',
    sheetBorder:   'rgba(126,231,183,0.10)',
    progressColor: 'rgba(126,231,183,0.84)',
    ctaBg:         'rgba(126,231,183,0.16)',
    ctaBorder:     'rgba(126,231,183,0.18)',
  },
  History: {
    glow:          '#D4A84B',
    glowRgb:       '212,168,75',
    text:          '#F5EDD8',
    muted:         'rgba(245,237,216,0.82)',
    labelBg:       'rgba(14,10,4,0.88)',
    sheetBg:       'linear-gradient(180deg, rgba(20,14,6,0.97), rgba(12,8,3,0.99))',
    sheetBorder:   'rgba(212,168,75,0.10)',
    progressColor: 'rgba(212,168,75,0.84)',
    ctaBg:         'rgba(212,168,75,0.16)',
    ctaBorder:     'rgba(212,168,75,0.18)',
  },
  Chemistry: {
    glow:          '#5CC8FF',
    glowRgb:       '92,200,255',
    text:          '#E8F4FF',
    muted:         'rgba(232,244,255,0.82)',
    labelBg:       'rgba(4,10,20,0.88)',
    sheetBg:       'linear-gradient(180deg, rgba(6,12,24,0.97), rgba(3,7,16,0.99))',
    sheetBorder:   'rgba(92,200,255,0.10)',
    progressColor: 'rgba(92,200,255,0.84)',
    ctaBg:         'rgba(92,200,255,0.16)',
    ctaBorder:     'rgba(92,200,255,0.18)',
  },
  Physics: {
    glow:          '#5DA9E9',
    glowRgb:       '93,169,233',
    text:          '#E6F0FF',
    muted:         'rgba(230,240,255,0.82)',
    labelBg:       'rgba(4,8,18,0.88)',
    sheetBg:       'linear-gradient(180deg, rgba(6,10,22,0.97), rgba(3,6,14,0.99))',
    sheetBorder:   'rgba(93,169,233,0.10)',
    progressColor: 'rgba(93,169,233,0.84)',
    ctaBg:         'rgba(93,169,233,0.16)',
    ctaBorder:     'rgba(93,169,233,0.18)',
  },
  Maths: {
    glow:          '#2BBE9A',
    glowRgb:       '43,190,154',
    text:          '#E4F7F2',
    muted:         'rgba(228,247,242,0.82)',
    labelBg:       'rgba(2,12,9,0.88)',
    sheetBg:       'linear-gradient(180deg, rgba(4,16,12,0.97), rgba(2,10,8,0.99))',
    sheetBorder:   'rgba(43,190,154,0.10)',
    progressColor: 'rgba(43,190,154,0.84)',
    ctaBg:         'rgba(43,190,154,0.16)',
    ctaBorder:     'rgba(43,190,154,0.18)',
  },
  English: {
    glow:          '#C97090',
    glowRgb:       '201,112,144',
    text:          '#F5E8EE',
    muted:         'rgba(245,232,238,0.82)',
    labelBg:       'rgba(14,6,8,0.88)',
    sheetBg:       'linear-gradient(180deg, rgba(18,8,12,0.97), rgba(12,4,7,0.99))',
    sheetBorder:   'rgba(201,112,144,0.10)',
    progressColor: 'rgba(201,112,144,0.84)',
    ctaBg:         'rgba(201,112,144,0.16)',
    ctaBorder:     'rgba(201,112,144,0.18)',
  },
  Sociology: {
    glow:          '#C9B07C',
    glowRgb:       '201,176,124',
    text:          '#F5EDD8',
    muted:         'rgba(245,237,216,0.82)',
    labelBg:       'rgba(12,10,4,0.88)',
    sheetBg:       'linear-gradient(180deg, rgba(16,14,6,0.97), rgba(10,8,3,0.99))',
    sheetBorder:   'rgba(201,176,124,0.10)',
    progressColor: 'rgba(201,176,124,0.84)',
    ctaBg:         'rgba(201,176,124,0.16)',
    ctaBorder:     'rgba(201,176,124,0.18)',
  },
}

// ── Smart label placement — 4 directions ──────────────────────────────────────
function getLabelPos(h) {
  const toLeft   = h.x > 55
  const nearTop  = h.y < 18
  const nearBot  = h.y > 78

  const horiz = toLeft
    ? { right: `calc(${100 - h.x}% + 18px)` }
    : { left:  `calc(${h.x}%  + 18px)` }

  const vert = nearBot
    ? { bottom: `calc(${100 - h.y}% + 10px)` }
    : nearTop
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
  onBack,
  onContinue,
}) {
  const theme = THEMES[subject] || THEMES.Biology
  const {
    glow, glowRgb, text, muted, labelBg,
    sheetBg, sheetBorder, progressColor, ctaBg, ctaBorder,
  } = theme

  const [viewMode,   setViewMode]   = useState('intro')   // 'intro' | 'explore'
  const [selectedId, setSelectedId] = useState(null)
  const [visited,    setVisited]    = useState(new Set())
  const [ctaReady,   setCtaReady]   = useState(false)

  const isExplore    = viewMode === 'explore'
  const introVisible = !isExplore
  const selected     = hotspots.find(h => h.id === selectedId) || null
  const allDone      = visited.size === hotspots.length && hotspots.length > 0

  // Title lines and staggered reveal timing
  const titleLines = title.split('\n')
  const ctaDelay   = 200 + titleLines.length * 420 + 240 + 460 + 400

  useEffect(() => {
    const t = setTimeout(() => setCtaReady(true), ctaDelay)
    return () => clearTimeout(t)
  }, [ctaDelay])

  function handleTap(id) {
    if (!isExplore) return
    setSelectedId(id)
    setVisited(prev => { const n = new Set(prev); n.add(id); return n })
  }

  function enterExplore() {
    setViewMode('explore')
    setSelectedId(null)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#040C09',
      fontFamily: "'Sora', sans-serif",
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes ihi-line-in {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ihi-pulse {
          0%,100% {
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
        @keyframes ihi-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .ihi-back:active  { background: rgba(255,255,255,0.12) !important; }
        .ihi-cta:hover    { background: rgba(${glowRgb},0.22) !important; }
        .ihi-cta:active   { opacity: 0.80; }
        .ihi-dot          { transition: transform 200ms ease; }
        .ihi-dot:active   { transform: translate(-50%,-50%) scale(0.88); }
      `}</style>

      {/* ── Full-screen image ─────────────────────────────────────────────── */}
      <img
        src={image}
        alt={imageAlt}
        draggable={false}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          filter: isExplore
            ? 'brightness(0.88) saturate(1.04)'
            : 'brightness(0.38) saturate(0.85) blur(1px)',
          transform: isExplore ? 'scale(1)' : 'scale(1.03)',
          transition: 'filter 500ms cubic-bezier(0.22,1,0.36,1), transform 500ms cubic-bezier(0.22,1,0.36,1)',
          userSelect: 'none',
        }}
      />

      {/* Atmospheric gradient — always present */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(3,7,5,0.12) 0%, rgba(3,7,5,0.18) 28%, rgba(3,7,5,0.55) 68%, rgba(3,7,5,0.94) 100%)',
      }} />

      {/* ── Back button ───────────────────────────────────────────────────── */}
      {onBack && (
        <button
          className="ihi-back"
          onClick={onBack}
          aria-label="Go back"
          style={{
            position: 'absolute',
            top: 'max(18px, calc(env(safe-area-inset-top, 0px) + 14px))',
            left: '16px',
            width: '44px', height: '44px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 20,
            transition: 'background 120ms ease',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="rgba(255,255,255,0.78)" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
      )}

      {/* ── INTRO content — anchored bottom-left, fades/slides out ──────── */}
      <div style={{
        position: 'absolute',
        left: '28px', right: '28px',
        bottom: 'max(72px, calc(env(safe-area-inset-bottom, 0px) + 72px))',
        zIndex: 15,
        opacity:   introVisible ? 1 : 0,
        transform: introVisible ? 'translateY(0)' : 'translateY(22px)',
        transition: 'opacity 400ms cubic-bezier(0.22,1,0.36,1), transform 400ms cubic-bezier(0.22,1,0.36,1)',
        pointerEvents: introVisible ? 'auto' : 'none',
      }}>

        {/* Title — line by line */}
        <div style={{
          fontSize: 'clamp(44px, 8vw, 66px)',
          fontWeight: 700,
          lineHeight: 0.94,
          letterSpacing: '-0.04em',
          color: '#F3FFF7',
        }}>
          {titleLines.map((line, i) => (
            <div key={i} style={{
              animation: `ihi-line-in 400ms cubic-bezier(0.22,1,0.36,1) ${200 + i * 420}ms both`,
            }}>
              {line}
            </div>
          ))}
        </div>

        {/* Paragraph */}
        <p style={{
          margin: '20px 0 0',
          fontSize: '18px',
          lineHeight: 1.65,
          fontWeight: 400,
          color: 'rgba(234,247,240,0.82)',
          maxWidth: '28ch',
          animation: `ihi-line-in 400ms cubic-bezier(0.22,1,0.36,1) ${200 + titleLines.length * 420 + 240}ms both`,
        }}>
          {introText}
        </p>

        {/* CTA — appears after text finishes */}
        <div style={{
          marginTop: '28px',
          opacity: ctaReady ? 1 : 0,
          transition: 'opacity 440ms ease',
          pointerEvents: ctaReady ? 'auto' : 'none',
        }}>
          <button
            type="button"
            className="ihi-cta"
            onClick={enterExplore}
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '54px',
              padding: '0 26px',
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
      </div>

      {/* ── Explore progress counter — top right ─────────────────────────── */}
      <div style={{
        position: 'absolute',
        top: 'max(18px, calc(env(safe-area-inset-top, 0px) + 14px))',
        right: '18px',
        fontSize: '13px', fontWeight: 600, letterSpacing: '0.16em',
        color: progressColor,
        pointerEvents: 'none', zIndex: 20,
        opacity: isExplore ? 1 : 0,
        transition: 'opacity 500ms cubic-bezier(0.22,1,0.36,1)',
      }}>
        EXPLORE {visited.size}/{hotspots.length}
      </div>

      {/* ── Hotspot dots ─────────────────────────────────────────────────── */}
      {hotspots.map(h => {
        const isSelected = selectedId === h.id
        const isVisited  = visited.has(h.id)

        return (
          <div key={h.id}>
            <button
              type="button"
              className="ihi-dot"
              aria-label={`Explore ${h.title}`}
              aria-pressed={isSelected}
              onClick={() => handleTap(h.id)}
              style={{
                position: 'absolute',
                left: `${h.x}%`, top: `${h.y}%`,
                transform: 'translate(-50%, -50%)',
                width: '28px', height: '28px',
                borderRadius: '50%',
                border: 'none', padding: 0,
                cursor: isExplore ? 'pointer' : 'default',
                background: isVisited
                  ? `rgba(${glowRgb},0.16)`
                  : 'rgba(255,255,255,0.04)',
                boxShadow: isSelected
                  ? `0 0 0 1px rgba(${glowRgb},0.55), 0 0 16px rgba(${glowRgb},0.75), 0 0 48px rgba(${glowRgb},0.32)`
                  : isVisited
                    ? `0 0 0 1px rgba(${glowRgb},0.32), 0 0 12px rgba(${glowRgb},0.46), 0 0 32px rgba(${glowRgb},0.18)`
                    : `0 0 0 1px rgba(${glowRgb},0.25), 0 0 20px rgba(${glowRgb},0.45), 0 0 50px rgba(${glowRgb},0.18)`,
                opacity: isExplore ? 1 : 0.18,
                pointerEvents: isExplore ? 'auto' : 'none',
                animation: (!isVisited && isExplore) ? 'ihi-pulse 2.8s ease-in-out infinite' : 'none',
                transition: 'opacity 500ms cubic-bezier(0.22,1,0.36,1), box-shadow 280ms cubic-bezier(0.22,1,0.36,1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: isSelected ? 12 : 10,
              }}
            >
              <div style={{
                width:  isSelected ? '10px' : isVisited ? '8px'  : '6px',
                height: isSelected ? '10px' : isVisited ? '8px'  : '6px',
                borderRadius: '50%',
                background: isVisited ? glow : 'rgba(255,255,255,0.85)',
                boxShadow: isVisited ? `0 0 8px ${glow}` : 'none',
                transition: 'all 280ms cubic-bezier(0.22,1,0.36,1)',
              }} />
            </button>

            {/* Label — selected hotspot only */}
            {isSelected && isExplore && (
              <div style={{
                position: 'absolute',
                ...getLabelPos(h),
                background: labelBg,
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: `1px solid rgba(${glowRgb},0.14)`,
                borderRadius: '16px',
                padding: '10px 14px',
                fontSize: '15px', fontWeight: 500,
                color: text, whiteSpace: 'nowrap',
                pointerEvents: 'none', zIndex: 13,
                animation: 'ihi-label-in 220ms ease both',
              }}>
                {h.shortLabel || h.title}
              </div>
            )}
          </div>
        )
      })}

      {/* ── Tap-to-dismiss overlay — behind sheet ────────────────────────── */}
      {selected && isExplore && (
        <div
          onClick={() => setSelectedId(null)}
          style={{ position: 'absolute', inset: 0, zIndex: 25 }}
        />
      )}

      {/* ── Bottom info sheet ─────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        background: sheetBg,
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        border: `1px solid ${sheetBorder}`,
        borderBottom: 'none',
        borderRadius: '22px 22px 0 0',
        padding: `24px 24px calc(max(24px, env(safe-area-inset-bottom, 0px)) + 24px)`,
        transform: (selected && isExplore) ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 380ms cubic-bezier(0.22,1,0.36,1)',
        zIndex: 30,
        maxHeight: '62vh',
        overflowY: 'auto',
      }}>
        {selected && (
          <>
            {/* Pull handle */}
            <div style={{
              width: '36px', height: '4px', borderRadius: '2px',
              background: `rgba(${glowRgb},0.22)`,
              margin: '-6px auto 22px',
            }} />

            {/* Icon + title */}
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

            {/* Description */}
            <p style={{
              fontSize: '15px', lineHeight: 1.75, fontWeight: 400,
              color: muted, margin: '0 0 18px',
            }}>
              {selected.description}
            </p>

            {/* Why it matters */}
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
          </>
        )}
      </div>

      {/* ── Continue button — fades in when all explored and sheet closed ── */}
      <div style={{
        position: 'absolute',
        bottom: 'max(28px, calc(env(safe-area-inset-bottom, 0px) + 28px))',
        left: '24px', right: '24px',
        zIndex: 22,
        opacity:   (allDone && isExplore && !selected) ? 1 : 0,
        transform: (allDone && isExplore && !selected) ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 500ms cubic-bezier(0.22,1,0.36,1), transform 500ms cubic-bezier(0.22,1,0.36,1)',
        pointerEvents: (allDone && isExplore && !selected) ? 'auto' : 'none',
      }}>
        <button
          type="button"
          onClick={onContinue}
          style={{
            width: '100%', height: '56px',
            borderRadius: '14px',
            background: `rgba(${glowRgb},0.18)`,
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid rgba(${glowRgb},0.26)`,
            color: text, fontSize: '18px', fontWeight: 700,
            cursor: 'pointer', letterSpacing: '0.01em',
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
