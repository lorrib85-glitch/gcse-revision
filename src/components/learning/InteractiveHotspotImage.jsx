import { useState, useEffect } from 'react'
import ContinueCTA from '../core/ContinueCTA.jsx'
import BackButton from '../core/BackButton.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'
// CinematicShell used here because full-bleed imagery and floating hotspot overlays need
// the full viewport; InteractionShell's inset padding would clip hotspot positions.
import CinematicShell from '../layout/CinematicShell.jsx'

const THEMES = {
  Biology: {
    glow: '#7EE7B7',
    glowRgb: '126,231,183',
    text: '#EAF7F0',
    muted: 'rgba(234,247,240,0.82)',
    labelBg: 'rgba(6,16,12,0.88)',
    sheetBg: 'linear-gradient(180deg, rgba(7,20,15,0.97), rgba(4,13,10,0.99))',
    sheetBorder: 'rgba(126,231,183,0.10)',
    ctaBg: 'rgba(126,231,183,0.16)',
    ctaBorder: 'rgba(126,231,183,0.18)',
    pageBg: '#040C09',
    imageFilter: 'brightness(0.88) saturate(1.04)',
    selectedImageFilter: 'brightness(0.62) saturate(0.92)',
    cardBg: 'linear-gradient(180deg, rgba(7,20,15,0.98), rgba(4,13,10,0.99))',
    cardText: '#EAF7F0',
    cardMuted: 'rgba(234,247,240,0.78)',
    cardRule: 'rgba(126,231,183,0.18)',
  },
  History: {
    glow: '#D4A84B',
    glowRgb: '212,168,75',
    text: '#F5EDD8',
    muted: 'rgba(245,237,216,0.82)',
    labelBg: 'rgba(14,10,4,0.88)',
    sheetBg: 'linear-gradient(180deg, rgba(20,14,6,0.97), rgba(12,8,3,0.99))',
    sheetBorder: 'rgba(212,168,75,0.10)',
    ctaBg: 'rgba(212,168,75,0.16)',
    ctaBorder: 'rgba(212,168,75,0.18)',
    pageBg: '#0B0702',
    imageFilter: 'brightness(0.80) saturate(0.86) sepia(0.18) contrast(1.08)',
    selectedImageFilter: 'brightness(0.60) saturate(0.78) sepia(0.24) contrast(1.10)',
    cardBg: 'linear-gradient(180deg, rgba(244,238,222,0.98), rgba(229,218,196,0.98))',
    cardText: '#17130D',
    cardMuted: 'rgba(23,19,13,0.70)',
    cardRule: 'rgba(108,78,32,0.22)',
  },
  Chemistry: {
    glow: '#5CC8FF',
    glowRgb: '92,200,255',
    text: '#E8F4FF',
    muted: 'rgba(232,244,255,0.82)',
    labelBg: 'rgba(4,10,20,0.88)',
    sheetBg: 'linear-gradient(180deg, rgba(6,12,24,0.97), rgba(3,7,16,0.99))',
    sheetBorder: 'rgba(92,200,255,0.10)',
    ctaBg: 'rgba(92,200,255,0.16)',
    ctaBorder: 'rgba(92,200,255,0.18)',
    pageBg: '#02060E',
    imageFilter: 'brightness(0.88) saturate(1.04)',
    selectedImageFilter: 'brightness(0.62) saturate(0.92)',
    cardBg: 'linear-gradient(180deg, rgba(6,12,24,0.97), rgba(3,7,16,0.99))',
    cardText: '#E8F4FF',
    cardMuted: 'rgba(232,244,255,0.78)',
    cardRule: 'rgba(92,200,255,0.18)',
  },
  Physics: {
    glow: '#5DA9E9',
    glowRgb: '93,169,233',
    text: '#E6F0FF',
    muted: 'rgba(230,240,255,0.82)',
    labelBg: 'rgba(4,8,18,0.88)',
    sheetBg: 'linear-gradient(180deg, rgba(6,10,22,0.97), rgba(3,6,14,0.99))',
    sheetBorder: 'rgba(93,169,233,0.10)',
    ctaBg: 'rgba(93,169,233,0.16)',
    ctaBorder: 'rgba(93,169,233,0.18)',
    pageBg: '#02050C',
    imageFilter: 'brightness(0.88) saturate(1.04)',
    selectedImageFilter: 'brightness(0.62) saturate(0.92)',
    cardBg: 'linear-gradient(180deg, rgba(6,10,22,0.97), rgba(3,6,14,0.99))',
    cardText: '#E6F0FF',
    cardMuted: 'rgba(230,240,255,0.78)',
    cardRule: 'rgba(93,169,233,0.18)',
  },
  Maths: {
    glow: '#2BBE9A',
    glowRgb: '43,190,154',
    text: '#E4F7F2',
    muted: 'rgba(228,247,242,0.82)',
    labelBg: 'rgba(2,12,9,0.88)',
    sheetBg: 'linear-gradient(180deg, rgba(4,16,12,0.97), rgba(2,10,8,0.99))',
    sheetBorder: 'rgba(43,190,154,0.10)',
    ctaBg: 'rgba(43,190,154,0.16)',
    ctaBorder: 'rgba(43,190,154,0.18)',
    pageBg: '#020A07',
    imageFilter: 'brightness(0.88) saturate(1.04)',
    selectedImageFilter: 'brightness(0.62) saturate(0.92)',
    cardBg: 'linear-gradient(180deg, rgba(4,16,12,0.97), rgba(2,10,8,0.99))',
    cardText: '#E4F7F2',
    cardMuted: 'rgba(228,247,242,0.78)',
    cardRule: 'rgba(43,190,154,0.18)',
  },
  English: {
    glow: '#C97090',
    glowRgb: '201,112,144',
    text: '#F5E8EE',
    muted: 'rgba(245,232,238,0.82)',
    labelBg: 'rgba(14,6,8,0.88)',
    sheetBg: 'linear-gradient(180deg, rgba(18,8,12,0.97), rgba(12,4,7,0.99))',
    sheetBorder: 'rgba(201,112,144,0.10)',
    ctaBg: 'rgba(201,112,144,0.16)',
    ctaBorder: 'rgba(201,112,144,0.18)',
    pageBg: '#080304',
    imageFilter: 'brightness(0.88) saturate(1.04)',
    selectedImageFilter: 'brightness(0.62) saturate(0.92)',
    cardBg: 'linear-gradient(180deg, rgba(18,8,12,0.97), rgba(12,4,7,0.99))',
    cardText: '#F5E8EE',
    cardMuted: 'rgba(245,232,238,0.78)',
    cardRule: 'rgba(201,112,144,0.18)',
  },
  Sociology: {
    glow: '#C9B07C',
    glowRgb: '201,176,124',
    text: '#F5EDD8',
    muted: 'rgba(245,237,216,0.82)',
    labelBg: 'rgba(12,10,4,0.88)',
    sheetBg: 'linear-gradient(180deg, rgba(16,14,6,0.97), rgba(10,8,3,0.99))',
    sheetBorder: 'rgba(201,176,124,0.10)',
    ctaBg: 'rgba(201,176,124,0.16)',
    ctaBorder: 'rgba(201,176,124,0.18)',
    pageBg: '#070501',
    imageFilter: 'brightness(0.88) saturate(1.04)',
    selectedImageFilter: 'brightness(0.62) saturate(0.92)',
    cardBg: 'linear-gradient(180deg, rgba(16,14,6,0.97), rgba(10,8,3,0.99))',
    cardText: '#F5EDD8',
    cardMuted: 'rgba(245,237,216,0.78)',
    cardRule: 'rgba(201,176,124,0.18)',
  },
}

const FOUR_HUMOUR_DETAILS = {
  blood: {
    qualities: 'warm + wet',
    meaning: 'Linked with warmth, energy and cheerfulness.',
    believedEffect: 'Fever, flushed skin or a red face.',
    treatmentLogic: 'Remove excess blood to restore balance.',
    examLink: 'Shows why bloodletting seemed logical to medieval doctors.',
  },
  phlegm: {
    qualities: 'cold + wet',
    meaning: 'Linked with coldness and calmness.',
    believedEffect: 'Coughs, colds and sluggishness.',
    treatmentLogic: 'Use opposite qualities: heat or dryness.',
    examLink: 'Shows belief that illness was caused by imbalance in the body.',
  },
  yellow_bile: {
    qualities: 'hot + dry',
    meaning: 'Linked with heat, anger and irritability.',
    believedEffect: 'Fever, vomiting or hot sickness.',
    treatmentLogic: 'Use cooler or wetter remedies to rebalance the body.',
    examLink: 'Shows Galen’s idea of treating illness with opposites.',
  },
  black_bile: {
    qualities: 'cold + dry',
    meaning: 'Linked with sadness and melancholy.',
    believedEffect: 'Low mood or wasting illness.',
    treatmentLogic: 'Use warmth or moisture to restore balance.',
    examLink: 'Shows how emotional illness could be explained through the humours.',
  },
}

function getLabelPos(h) {
  const toLeft  = h.x > 55
  const nearTop = h.y < 18
  const nearBot = h.y > 80

  const horiz = toLeft
    ? { right: `calc(${100 - h.x}% + 16px)` }
    : { left:  `calc(${h.x}%  + 16px)` }

  const vert = nearBot
    ? { bottom: `calc(${100 - h.y}% + 8px)` }
    : nearTop
      ? { top: `calc(${h.y}% + 8px)` }
      : { top: `calc(${h.y}% - 14px)` }

  return { ...horiz, ...vert }
}

function firstSentence(text = '') {
  const [sentence] = text.split(/\.\s+/)
  return sentence ? sentence.replace(/\.$/, '') + '.' : ''
}

function secondSentence(text = '') {
  const [, ...rest] = text.split(/\.\s+/)
  return rest.length ? rest.join('. ').replace(/\.$/, '') + '.' : ''
}

function getDetailRows(selected) {
  const humourDetail = FOUR_HUMOUR_DETAILS[selected?.id]
  const meaning = selected?.meaning || humourDetail?.meaning || firstSentence(selected?.description)
  const believedEffect = selected?.believedEffect || humourDetail?.believedEffect || secondSentence(selected?.description)
  const treatmentLogic = selected?.treatmentLogic || humourDetail?.treatmentLogic || selected?.extraFact
  const examLink = selected?.examLink || humourDetail?.examLink

  return [
    { label: 'Meaning', body: meaning },
    { label: 'Believed effect', body: believedEffect },
    { label: 'Treatment logic', body: treatmentLogic },
    { label: 'Exam link', body: examLink },
  ].filter(row => row.body)
}

export default function InteractiveHotspotImage({
  subject      = 'Biology',
  title        = '',
  introText    = '',
  image        = '',
  imageAlt     = '',
  hotspots     = [],
  ctaLabel     = 'Explore',
  onBack,
  onEnterExplore,
  onContinue,
}) {
  const theme = THEMES[subject] || THEMES.Biology
  const {
    glow, glowRgb, text, muted, labelBg,
    ctaBg, ctaBorder, pageBg, imageFilter, selectedImageFilter,
    cardBg, cardText, cardMuted, cardRule,
  } = theme

  const [viewMode,   setViewMode]   = useState('intro')
  const [selectedId, setSelectedId] = useState(null)
  const [visited,    setVisited]    = useState(new Set())
  const [ctaReady,   setCtaReady]   = useState(false)

  const isExplore    = viewMode === 'explore'
  const introVisible = !isExplore
  const selected     = hotspots.find(h => h.id === selectedId) || null
  const allDone      = visited.size === hotspots.length && hotspots.length > 0
  const titleLines   = title.split('\n')
  const ctaDelay     = 200 + titleLines.length * 420 + 260 + 460 + 300
  const selectedDetails = selected ? (FOUR_HUMOUR_DETAILS[selected.id] || {}) : {}
  const selectedRows = selected ? getDetailRows(selected) : []
  const selectedSubtitle = selected?.qualities || selected?.subtitle || selectedDetails.qualities

  useEffect(() => {
    const t = setTimeout(() => setCtaReady(true), ctaDelay)
    return () => clearTimeout(t)
  }, [ctaDelay])

  function handleTap(id) {
    setSelectedId(id)
    setVisited(prev => { const n = new Set(prev); n.add(id); return n })
  }

  function enterExplore() {
    setViewMode('explore')
    setSelectedId(null)
    onEnterExplore?.()
  }

  return (
    <CinematicShell style={{ background: pageBg, zIndex: 1000 }}>
      <style>{`
        @keyframes ihi-line-in {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ihi-pulse {
          0%,100% {
            box-shadow:
              0 0 0 2px rgba(${glowRgb},0.55),
              0 0 22px rgba(${glowRgb},0.72),
              0 0 52px rgba(${glowRgb},0.36);
          }
          50% {
            box-shadow:
              0 0 0 3px rgba(${glowRgb},0.75),
              0 0 36px rgba(${glowRgb},0.92),
              0 0 72px rgba(${glowRgb},0.52);
          }
        }
        @keyframes ihi-label-in {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .ihi-cta:hover { background: rgba(${glowRgb},0.22) !important; }
        .ihi-cta:active { opacity: 0.80; }
        .ihi-dot:active { transform: translate(-50%,-50%) scale(0.88) !important; }
      `}</style>

      <div style={{
        position: 'absolute', inset: 0,
        opacity: introVisible ? 1 : 0,
        transition: 'opacity 500ms cubic-bezier(0.22,1,0.36,1)',
        pointerEvents: introVisible ? 'auto' : 'none',
      }}>
        <img
          src={image}
          alt={imageAlt}
          draggable={false}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'brightness(0.65) saturate(0.85)',
            transform: 'scale(1.03)',
            userSelect: 'none',
          }}
        />

        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(3,7,5,0.10) 0%, rgba(3,7,5,0.18) 30%, rgba(3,7,5,0.58) 68%, rgba(3,7,5,0.95) 100%)',
        }} />

        {onBack && (
          <BackButton
            onClick={onBack}
            style={{
              position: 'absolute',
              top: 'max(18px, calc(env(safe-area-inset-top, 0px) + 14px))',
              left: '16px',
              zIndex: 5,
            }}
          />
        )}

        <div style={{
          position: 'absolute',
          left: '28px', right: '28px',
          bottom: 'max(72px, calc(env(safe-area-inset-bottom, 0px) + 72px))',
          zIndex: 5,
        }}>
          <div style={{
            fontSize: 'clamp(44px, 8vw, 66px)',
            fontWeight: 700,
            lineHeight: 0.94,
            letterSpacing: '-0.04em',
            color: text,
          }}>
            {titleLines.map((line, i) => (
              <div key={i} style={{
                animation: `ihi-line-in 400ms cubic-bezier(0.22,1,0.36,1) ${200 + i * 420}ms both`,
              }}>
                {line}
              </div>
            ))}
          </div>

          <p style={{
            margin: '20px 0 0',
            fontSize: '18px',
            lineHeight: 1.65,
            fontWeight: 400,
            color: muted,
            maxWidth: '28ch',
            animation: `ihi-line-in 400ms cubic-bezier(0.22,1,0.36,1) ${200 + titleLines.length * 420 + 260}ms both`,
          }}>
            {introText}
          </p>

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
                display: 'flex', alignItems: 'center',
                height: '54px', padding: '0 26px',
                borderRadius: '999px',
                background: ctaBg,
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                border: `1px solid ${ctaBorder}`,
                color: text,
                fontSize: '16px', fontWeight: 600,
                cursor: 'pointer', letterSpacing: '-0.01em',
                transition: 'background 160ms ease',
              }}
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute', inset: 0,
        overflowY: 'auto',
        opacity: isExplore ? 1 : 0,
        transition: 'opacity 500ms cubic-bezier(0.22,1,0.36,1)',
        pointerEvents: isExplore ? 'auto' : 'none',
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          marginTop: 'calc(env(safe-area-inset-top, 0px) + 80px)',
        }}>
          <img
            src={image}
            alt={imageAlt}
            draggable={false}
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              filter: selected ? selectedImageFilter : imageFilter,
              transition: 'filter 300ms cubic-bezier(0.22,1,0.36,1)',
              userSelect: 'none',
            }}
          />

          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: selected
              ? 'radial-gradient(circle at 70% 22%, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.08) 24%, rgba(0,0,0,0.42) 100%)'
              : 'linear-gradient(180deg, transparent 55%, rgba(3,7,5,0.45) 100%)',
            transition: 'background 300ms cubic-bezier(0.22,1,0.36,1)',
          }} />

          <div style={{ position: 'absolute', top: '16px', right: '14px', pointerEvents: 'none', zIndex: 6 }}>
            <SequenceProgress
              total={hotspots.length}
              current={-1}
              viewed={hotspots.map((h, i) => visited.has(h.id) ? i : -1).filter(i => i >= 0)}
              accent={glow}
              accentRgb={glowRgb}
              compact={true}
              ariaLabel="Hotspot progress"
            />
          </div>

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
                    transform: 'translate(-50%,-50%)',
                    width: '28px', height: '28px',
                    borderRadius: '50%',
                    border: 'none', padding: 0,
                    cursor: 'pointer',
                    background: isVisited
                      ? `rgba(${glowRgb},0.16)`
                      : 'rgba(255,255,255,0.04)',
                    boxShadow: isSelected
                      ? `0 0 0 2px rgba(${glowRgb},0.75), 0 0 22px rgba(${glowRgb},0.92), 0 0 56px rgba(${glowRgb},0.45)`
                      : isVisited
                        ? `0 0 0 1px rgba(${glowRgb},0.38), 0 0 14px rgba(${glowRgb},0.52), 0 0 36px rgba(${glowRgb},0.22)`
                        : `0 0 0 2px rgba(${glowRgb},0.55), 0 0 22px rgba(${glowRgb},0.72), 0 0 52px rgba(${glowRgb},0.36)`,
                    animation: !isVisited ? 'ihi-pulse 2.8s ease-in-out infinite' : 'none',
                    transition: 'box-shadow 280ms cubic-bezier(0.22,1,0.36,1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: isSelected ? 8 : 6,
                  }}
                >
                  <div style={{
                    width:  isSelected ? '10px' : isVisited ? '8px' : '8px',
                    height: isSelected ? '10px' : isVisited ? '8px' : '8px',
                    borderRadius: '50%',
                    background: isVisited ? glow : 'rgba(255,255,255,0.85)',
                    boxShadow: isVisited ? `0 0 8px ${glow}` : 'none',
                    transition: 'all 280ms cubic-bezier(0.22,1,0.36,1)',
                  }} />
                </button>

                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    ...getLabelPos(h),
                    background: labelBg,
                    backdropFilter: 'blur(18px)',
                    WebkitBackdropFilter: 'blur(18px)',
                    border: `1px solid rgba(${glowRgb},0.14)`,
                    borderRadius: '14px',
                    padding: '9px 13px',
                    fontSize: '14px', fontWeight: 600,
                    color: text, whiteSpace: 'nowrap',
                    pointerEvents: 'none', zIndex: 9,
                    animation: 'ihi-label-in 220ms ease both',
                  }}>
                    {h.shortLabel || h.title}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ height: '120px' }} />
      </div>

      {selected && isExplore && (
        <div
          onClick={() => setSelectedId(null)}
          style={{ position: 'absolute', inset: 0, zIndex: 25 }}
        />
      )}

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '0 22px max(18px, env(safe-area-inset-bottom, 0px))',
        transform: (selected && isExplore) ? 'translateY(0)' : 'translateY(calc(100% + 28px))',
        transition: 'transform 380ms cubic-bezier(0.22,1,0.36,1)',
        zIndex: 30,
        pointerEvents: selected ? 'auto' : 'none',
      }}>
        {selected && (
          <article style={{
            background: cardBg,
            color: cardText,
            border: `1px solid ${cardRule}`,
            borderRadius: '22px',
            padding: '22px 22px 20px',
            boxShadow: `0 22px 70px rgba(0,0,0,0.44), 0 0 0 1px rgba(${glowRgb},0.08)`,
            maxHeight: '47vh',
            overflowY: 'auto',
          }}>
            <header style={{
              borderLeft: `3px solid rgba(${glowRgb},0.62)`,
              paddingLeft: '16px',
              marginBottom: '18px',
            }}>
              <h2 style={{
                margin: 0,
                fontSize: 'clamp(34px, 10vw, 52px)',
                lineHeight: 0.92,
                letterSpacing: '-0.055em',
                fontWeight: 760,
                color: cardText,
              }}>
                {selected.title}
              </h2>
              {selectedSubtitle && (
                <div style={{
                  marginTop: '8px',
                  color: `rgba(${glowRgb},0.92)`,
                  fontSize: '20px',
                  lineHeight: 1.1,
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                }}>
                  {selectedSubtitle}
                </div>
              )}
            </header>

            <div style={{ height: '1px', background: cardRule, marginBottom: '2px' }} />

            {selectedRows.map((row, index) => (
              <section key={row.label} style={{
                display: 'grid',
                gridTemplateColumns: '10px 1fr',
                columnGap: '14px',
                padding: '16px 0',
                borderBottom: index === selectedRows.length - 1 ? 'none' : `1px solid ${cardRule}`,
              }}>
                <div style={{
                  width: '1px',
                  minHeight: '42px',
                  background: `rgba(${glowRgb},0.48)`,
                  margin: '2px auto 0',
                }} />
                <div>
                  <h3 style={{
                    margin: '0 0 5px',
                    fontSize: '14px',
                    lineHeight: 1.2,
                    fontWeight: 760,
                    letterSpacing: '-0.01em',
                    color: cardText,
                  }}>
                    {row.label}
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: '15px',
                    lineHeight: 1.45,
                    fontWeight: 430,
                    color: cardMuted,
                  }}>
                    {row.body}
                  </p>
                </div>
              </section>
            ))}
          </article>
        )}
      </div>

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
        <ContinueCTA onClick={onContinue} accent={glow} />
      </div>
    </CinematicShell>
  )
}
