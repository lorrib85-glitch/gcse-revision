import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import BackButton from '../core/BackButton.jsx'
import SequenceProgress from '../core/SequenceProgress.jsx'
import CinematicShell from '../layout/CinematicShell.jsx'

const HOTSPOT_HIT_SIZE = 44
const HOTSPOT_VISUAL_SIZE = 28
const HOTSPOT_CORE_SIZE = 8
const HOTSPOT_CORE_SELECTED_SIZE = 10

function getTheme(subject) {
  const base = SUBJECTS[subject] || SUBJECTS.History
  const accent = base.accent || GENERAL.teal
  const accentRgb = base.accentRgb || GENERAL.tealRgb
  const isHistory = subject === 'History'

  return {
    accent,
    accentRgb,
    pageBg: base.background || GENERAL.backgroundApp,
    imageFilter: isHistory
      ? 'brightness(0.80) saturate(0.86) sepia(0.18) contrast(1.08)'
      : 'brightness(0.88) saturate(1.04)',
    selectedImageFilter: isHistory
      ? 'brightness(0.60) saturate(0.78) sepia(0.24) contrast(1.10)'
      : 'brightness(0.62) saturate(0.92)',
    labelBg: isHistory ? 'rgba(14,10,4,0.88)' : 'rgba(4,10,12,0.88)',
    imageText: isHistory ? '#F5EDD8' : GENERAL.softWhite,
    imageMuted: isHistory ? 'rgba(245,237,216,0.82)' : GENERAL.slate,
    cardBg: isHistory
      ? 'linear-gradient(180deg, rgba(244,238,222,0.98), rgba(229,218,196,0.98))'
      : GENERAL.neutral[800],
    cardText: isHistory ? '#17130D' : GENERAL.softWhite,
    cardMuted: isHistory ? 'rgba(23,19,13,0.70)' : GENERAL.slate,
    cardRule: isHistory ? 'rgba(108,78,32,0.22)' : 'rgba(255,255,255,0.10)',
  }
}

function getLabelPos(h) {
  const toLeft  = h.x > 55
  const nearTop = h.y < 18
  const nearBot = h.y > 80

  const horiz = toLeft
    ? { right: `calc(${100 - h.x}% + ${SPACING.compact}px)` }
    : { left:  `calc(${h.x}% + ${SPACING.compact}px)` }

  const vert = nearBot
    ? { bottom: `calc(${100 - h.y}% + ${SPACING.micro}px)` }
    : nearTop
      ? { top: `calc(${h.y}% + ${SPACING.micro}px)` }
      : { top: `calc(${h.y}% - ${SPACING.compact}px)` }

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
  const meaning = selected?.meaning || firstSentence(selected?.description)
  const believedEffect = selected?.believedEffect || secondSentence(selected?.description)
  const treatmentLogic = selected?.treatmentLogic || selected?.extraFact
  const examLink = selected?.examLink

  return [
    { label: 'Meaning', body: meaning },
    { label: 'Believed effect', body: believedEffect },
    { label: 'Treatment logic', body: treatmentLogic },
    { label: 'Exam link', body: examLink },
  ].filter(row => row.body)
}

function HotspotButton({ hotspot, isSelected, isVisited, accent, accentRgb, onSelect }) {
  const dotShadow = isSelected
    ? `0 0 0 2px rgba(${accentRgb},0.75), 0 0 22px rgba(${accentRgb},0.92), 0 0 56px rgba(${accentRgb},0.45)`
    : isVisited
      ? `0 0 0 1px rgba(${accentRgb},0.38), 0 0 14px rgba(${accentRgb},0.52), 0 0 36px rgba(${accentRgb},0.22)`
      : `0 0 0 2px rgba(${accentRgb},0.55), 0 0 22px rgba(${accentRgb},0.72), 0 0 52px rgba(${accentRgb},0.36)`

  return (
    <button
      type="button"
      className="ihi-dot"
      aria-label={`Explore ${hotspot.title}`}
      aria-pressed={isSelected}
      onClick={() => onSelect(hotspot.id)}
      style={{
        position: 'absolute',
        left: `${hotspot.x}%`,
        top: `${hotspot.y}%`,
        transform: 'translate(-50%,-50%)',
        width: HOTSPOT_HIT_SIZE,
        height: HOTSPOT_HIT_SIZE,
        borderRadius: RADII.pill,
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: isSelected ? 8 : 6,
        touchAction: 'manipulation',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: HOTSPOT_VISUAL_SIZE,
          height: HOTSPOT_VISUAL_SIZE,
          borderRadius: RADII.pill,
          background: isVisited ? `rgba(${accentRgb},0.16)` : 'rgba(255,255,255,0.04)',
          boxShadow: dotShadow,
          animation: !isVisited ? 'ihi-pulse 2.8s ease-in-out infinite' : 'none',
          transition: 'box-shadow 280ms cubic-bezier(0.22,1,0.36,1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            width: isSelected ? HOTSPOT_CORE_SELECTED_SIZE : HOTSPOT_CORE_SIZE,
            height: isSelected ? HOTSPOT_CORE_SELECTED_SIZE : HOTSPOT_CORE_SIZE,
            borderRadius: RADII.pill,
            background: isVisited ? accent : 'rgba(255,255,255,0.85)',
            boxShadow: isVisited ? `0 0 8px ${accent}` : 'none',
            transition: 'all 280ms cubic-bezier(0.22,1,0.36,1)',
          }}
        />
      </span>
    </button>
  )
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
  const theme = getTheme(subject)
  const { accent, accentRgb, pageBg, imageFilter, selectedImageFilter, labelBg, imageText, imageMuted, cardBg, cardText, cardMuted, cardRule } = theme

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
  const selectedRows = selected ? getDetailRows(selected) : []
  const selectedSubtitle = selected?.qualities || selected?.subtitle

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
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.07); }
        }
        @keyframes ihi-label-in {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .ihi-cta:hover { background: rgba(${accentRgb},0.22) !important; }
        .ihi-cta:active { opacity: 0.80; }
        .ihi-dot:active > span { transform: scale(0.88) !important; }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, opacity: introVisible ? 1 : 0, transition: 'opacity 500ms cubic-bezier(0.22,1,0.36,1)', pointerEvents: introVisible ? 'auto' : 'none' }}>
        <img src={image} alt={imageAlt} draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', filter: 'brightness(0.65) saturate(0.85)', transform: 'scale(1.03)', userSelect: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(3,7,5,0.10) 0%, rgba(3,7,5,0.18) 30%, rgba(3,7,5,0.58) 68%, rgba(3,7,5,0.95) 100%)' }} />
        {onBack && <BackButton onClick={onBack} style={{ position: 'absolute', top: 'max(18px, calc(env(safe-area-inset-top, 0px) + 14px))', left: '16px', zIndex: 5 }} />}
        <div style={{ position: 'absolute', left: '28px', right: '28px', bottom: 'max(72px, calc(env(safe-area-inset-bottom, 0px) + 72px))', zIndex: 5 }}>
          <div style={{ ...TYPE.displayHero, color: imageText }}>{titleLines.map((line, i) => <div key={i} style={{ animation: `ihi-line-in 400ms cubic-bezier(0.22,1,0.36,1) ${200 + i * 420}ms both` }}>{line}</div>)}</div>
          <p style={{ ...TYPE.bodyStrong, margin: '20px 0 0', color: imageMuted, maxWidth: '28ch', animation: `ihi-line-in 400ms cubic-bezier(0.22,1,0.36,1) ${200 + titleLines.length * 420 + 260}ms both` }}>{introText}</p>
          <div style={{ marginTop: '28px', opacity: ctaReady ? 1 : 0, transition: 'opacity 440ms ease', pointerEvents: ctaReady ? 'auto' : 'none' }}>
            <button type="button" className="ihi-cta" onClick={enterExplore} style={{ display: 'flex', alignItems: 'center', height: '54px', padding: '0 26px', borderRadius: RADII.pill, background: `rgba(${accentRgb},0.16)`, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: `1px solid rgba(${accentRgb},0.18)`, color: imageText, ...TYPE.buttonLarge, cursor: 'pointer', transition: 'background 160ms ease' }}>{ctaLabel}</button>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', opacity: isExplore ? 1 : 0, transition: 'opacity 500ms cubic-bezier(0.22,1,0.36,1)', pointerEvents: isExplore ? 'auto' : 'none' }}>
        <div style={{ position: 'relative', width: '100%', marginTop: 'calc(env(safe-area-inset-top, 0px) + 80px)' }}>
          <img src={image} alt={imageAlt} draggable={false} style={{ display: 'block', width: '100%', height: 'auto', filter: selected ? selectedImageFilter : imageFilter, transition: 'filter 300ms cubic-bezier(0.22,1,0.36,1)', userSelect: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: selected ? 'radial-gradient(circle at 70% 22%, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.08) 24%, rgba(0,0,0,0.42) 100%)' : 'linear-gradient(180deg, transparent 55%, rgba(3,7,5,0.45) 100%)', transition: 'background 300ms cubic-bezier(0.22,1,0.36,1)' }} />
          <div style={{ position: 'absolute', top: '16px', right: '14px', pointerEvents: 'none', zIndex: 6 }}><SequenceProgress total={hotspots.length} current={-1} viewed={hotspots.map((h, i) => visited.has(h.id) ? i : -1).filter(i => i >= 0)} accent={accent} accentRgb={accentRgb} compact={true} ariaLabel="Hotspot progress" /></div>

          {hotspots.map(h => {
            const isSelected = selectedId === h.id
            const isVisited  = visited.has(h.id)
            return (
              <div key={h.id}>
                <HotspotButton hotspot={h} isSelected={isSelected} isVisited={isVisited} accent={accent} accentRgb={accentRgb} onSelect={handleTap} />
                {isSelected && <div style={{ position: 'absolute', ...getLabelPos(h), background: labelBg, backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', border: `1px solid rgba(${accentRgb},0.14)`, borderRadius: RADII.medium, padding: '9px 13px', ...TYPE.button, color: imageText, whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 9, animation: 'ihi-label-in 220ms ease both' }}>{h.shortLabel || h.title}</div>}
              </div>
            )
          })}
        </div>
        <div style={{ height: '120px' }} />
      </div>

      {selected && isExplore && <div onClick={() => setSelectedId(null)} style={{ position: 'absolute', inset: 0, zIndex: 25 }} />}

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 22px max(18px, env(safe-area-inset-bottom, 0px))', transform: (selected && isExplore) ? 'translateY(0)' : 'translateY(calc(100% + 28px))', transition: 'transform 380ms cubic-bezier(0.22,1,0.36,1)', zIndex: 30, pointerEvents: selected ? 'auto' : 'none' }}>
        {selected && <article style={{ background: cardBg, color: cardText, border: `1px solid ${cardRule}`, borderRadius: RADII.panel, padding: '22px 22px 20px', boxShadow: `0 22px 70px rgba(0,0,0,0.44), 0 0 0 1px rgba(${accentRgb},0.08)`, maxHeight: '47vh', overflowY: 'auto' }}>
          <header style={{ borderLeft: `3px solid rgba(${accentRgb},0.62)`, paddingLeft: SPACING.compact, marginBottom: SPACING.compact }}>
            <h2 style={{ ...TYPE.displaySection, margin: 0, color: cardText }}>{selected.title}</h2>
            {selectedSubtitle && <div style={{ ...TYPE.bodyStrong, marginTop: SPACING.micro, color: `rgba(${accentRgb},0.92)` }}>{selectedSubtitle}</div>}
          </header>
          <div style={{ height: '1px', background: cardRule, marginBottom: '2px' }} />
          {selectedRows.map((row, index) => <section key={row.label} style={{ display: 'grid', gridTemplateColumns: '10px 1fr', columnGap: '14px', padding: '16px 0', borderBottom: index === selectedRows.length - 1 ? 'none' : `1px solid ${cardRule}` }}>
            <div style={{ width: '1px', minHeight: '42px', background: `rgba(${accentRgb},0.48)`, margin: '2px auto 0' }} />
            <div><h3 style={{ ...TYPE.label, margin: '0 0 5px', color: cardText }}>{row.label}</h3><p style={{ ...TYPE.bodySmall, margin: 0, color: cardMuted }}>{row.body}</p></div>
          </section>)}
        </article>}
      </div>
      <div style={{ position: 'absolute', bottom: 'max(28px, calc(env(safe-area-inset-bottom, 0px) + 28px))', left: '24px', right: '24px', zIndex: 22, opacity: (allDone && isExplore && !selected) ? 1 : 0, transform: (allDone && isExplore && !selected) ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 500ms cubic-bezier(0.22,1,0.36,1), transform 500ms cubic-bezier(0.22,1,0.36,1)', pointerEvents: (allDone && isExplore && !selected) ? 'auto' : 'none' }}>
        <ContinueCTA onClick={onContinue} accent={accent} />
      </div>
    </CinematicShell>
  )
}
