# Hotspot reveal variant Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fold `InteractiveCollectionExplorer`'s multi-page-per-hotspot reveal and synthesis behaviour into `InteractiveHotspotImage` as a `reveal` variant, then delete the standalone component and migrate the two content blocks that used it.

**Architecture:** `InteractiveHotspotImage` gains a `variant` prop (`'detail'` default = today's labelled-row card; `'reveal'` = pages through a hotspot's `reveals[]`) and an optional `synthesis` prop (a "Collection complete" summary screen shown after all hotspots are explored). Both variants share the existing intro→explore flow, `SUBJECTS` theming, BackButton and SequenceProgress. The `collectionExplorer` screen type and its component are removed; episode 01 and 14 content becomes `interactiveImage` + `variant: 'reveal'`.

**Tech Stack:** React 18 + Vite, plain-object screen content, project constant tokens (`SPACING`, `RADII`, `MOTION`, `TYPE`, `SUBJECTS`).

## Global Constraints

- Commit directly to `main` (CLAUDE.md overrides any branch instruction). Committer `Claude <noreply@anthropic.com>`.
- Visual React components are verified by `vite build` + a 390px browser render pass, NOT vitest unit tests (CLAUDE.md: TDD applies only to pure logic units).
- Titles/headings/labels in sentence case.
- Never hardcode subject colours — theme only from `SUBJECTS` via the component's existing `getTheme()`.
- Reuse existing constant tokens; no magic spacing/radii/motion numbers.
- Build command: `./node_modules/.bin/vite build`. Architecture tests: `./node_modules/.bin/vitest run tests/architecture`.
- Spec: `docs/superpowers/specs/2026-07-23-hotspot-reveal-variant-design.md`.

---

### Task 1: Add `reveal` variant + optional `synthesis` to InteractiveHotspotImage

**Files:**
- Modify (full rewrite): `src/components/learning/InteractiveHotspotImage.jsx`

**Interfaces:**
- Produces: `InteractiveHotspotImage` now also accepts `variant: 'detail' | 'reveal'` (default `'detail'`) and `synthesis: { heading: string, points: string[], examTakeaway?: string } | null` (default `null`). In `reveal` mode each hotspot is `{ id, x, y, title, shortLabel?, reveals: [{ text: string }] }` and is marked visited only when its final reveal is reached. When `synthesis` is supplied, the summary screen shows after `visited.size === hotspots.length` instead of the bare Continue CTA. `detail` behaviour and its hotspot shape are unchanged.

- [ ] **Step 1: Replace the file contents**

Write `src/components/learning/InteractiveHotspotImage.jsx` with exactly:

```jsx
import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { MOTION } from '../../constants/motion.js'
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

function SynthesisScreen({ synthesis, accent, accentRgb, pageBg, text, muted, onContinue }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const pointsLen = synthesis.points?.length || 0

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: pageBg,
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      padding: `calc(env(safe-area-inset-top, 0px) + ${SPACING.standard}px) ${SPACING.standard}px`,
      paddingBottom: `calc(env(safe-area-inset-bottom, 0px) + ${SPACING.standard}px)`,
      overflow: 'hidden',
    }}>
      <div style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        paddingBottom: SPACING.compact,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}>
        <div style={{
          ...TYPE.metadata,
          color: `rgba(${accentRgb}, 0.55)`,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          marginBottom: SPACING.compact,
          opacity: visible ? 1 : 0,
          transition: `opacity 400ms ${MOTION.easing.standard}`,
        }}>
          Collection complete
        </div>

        <h2 style={{
          ...TYPE.displaySection,
          color: text,
          margin: `0 0 ${SPACING.separation}px`,
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(16px)',
          transition: `opacity 400ms ${MOTION.easing.standard} 80ms, transform 400ms ${MOTION.easing.standard} 80ms`,
        }}>
          {synthesis.heading}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.compact }}>
          {(synthesis.points || []).map((point, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: SPACING.compact,
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(14px)',
              transition: `opacity 400ms ${MOTION.easing.standard} ${160 + i * 80}ms, transform 400ms ${MOTION.easing.standard} ${160 + i * 80}ms`,
            }}>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                flexShrink: 0,
                marginTop: 8,
                background: accent,
                boxShadow: `0 0 8px rgba(${accentRgb}, 0.6)`,
              }} />
              <p style={{
                ...TYPE.bodySmall,
                color: muted,
                margin: 0,
                lineHeight: 1.65,
              }}>
                {point}
              </p>
            </div>
          ))}
        </div>

        {synthesis.examTakeaway && (
          <div style={{
            marginTop: SPACING.separation,
            borderLeft: `2px solid rgba(${accentRgb}, 0.35)`,
            paddingLeft: SPACING.standard,
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(14px)',
            transition: `opacity 400ms ${MOTION.easing.standard} ${160 + pointsLen * 80 + 80}ms, transform 400ms ${MOTION.easing.standard} ${160 + pointsLen * 80 + 80}ms`,
          }}>
            <div style={{
              ...TYPE.metadata,
              fontSize: 11,
              color: accent,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              marginBottom: SPACING.micro,
            }}>
              Exam takeaway
            </div>
            <p style={{
              ...TYPE.bodySmall,
              color: text,
              margin: 0,
              lineHeight: 1.65,
              fontWeight: 500,
            }}>
              {synthesis.examTakeaway}
            </p>
          </div>
        )}
      </div>

      <div style={{ flexShrink: 0, paddingTop: SPACING.compact }}>
        <ContinueCTA onClick={onContinue} accent={accent} />
      </div>
    </div>
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
  variant      = 'detail',
  synthesis    = null,
  onBack,
  onEnterExplore,
  onContinue,
}) {
  const theme = getTheme(subject)
  const { accent, accentRgb, pageBg, imageFilter, selectedImageFilter, labelBg, imageText, imageMuted, cardBg, cardText, cardMuted, cardRule } = theme

  const isReveal = variant === 'reveal'

  const [viewMode,     setViewMode]     = useState('intro')
  const [selectedId,   setSelectedId]   = useState(null)
  const [visited,      setVisited]      = useState(new Set())
  const [ctaReady,     setCtaReady]     = useState(false)
  const [revealStep,   setRevealStep]   = useState(0)
  const [showSynthesis, setShowSynthesis] = useState(false)

  const isExplore    = viewMode === 'explore'
  const introVisible = !isExplore
  const selected     = hotspots.find(h => h.id === selectedId) || null
  const allDone      = visited.size === hotspots.length && hotspots.length > 0
  const titleLines   = title.split('\n')
  const ctaDelay     = 200 + titleLines.length * 420 + 260 + 460 + 300
  const selectedRows = selected ? getDetailRows(selected) : []
  const selectedSubtitle = selected?.qualities || selected?.subtitle
  const revealCount  = selected?.reveals?.length || 0
  const isLastReveal = isReveal && selected && revealStep >= revealCount - 1
  const showContinue = allDone && isExplore && !selected && !synthesis

  useEffect(() => {
    const t = setTimeout(() => setCtaReady(true), ctaDelay)
    return () => clearTimeout(t)
  }, [ctaDelay])

  useEffect(() => {
    if (synthesis && allDone && !selected && !showSynthesis) {
      const t = setTimeout(() => setShowSynthesis(true), 500)
      return () => clearTimeout(t)
    }
  }, [synthesis, allDone, selected, showSynthesis])

  function handleTap(id) {
    setSelectedId(id)
    if (isReveal) {
      setRevealStep(0)
    } else {
      setVisited(prev => { const n = new Set(prev); n.add(id); return n })
    }
  }

  function handleRevealNext() {
    if (!selected) return
    if (revealStep < revealCount - 1) {
      setRevealStep(s => s + 1)
      return
    }
    setVisited(prev => { const n = new Set(prev); n.add(selectedId); return n })
    setSelectedId(null)
    setRevealStep(0)
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
        @keyframes ihi-reveal-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ihi-cta:hover { background: rgba(${accentRgb},0.22) !important; }
        .ihi-cta:active { opacity: 0.80; }
        .ihi-dot:active > span { transform: scale(0.88) !important; }
        .ihi-next:active { opacity: 0.80; }
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

      {selected && isExplore && <div onClick={() => { setSelectedId(null); setRevealStep(0) }} style={{ position: 'absolute', inset: 0, zIndex: 25 }} />}

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 22px max(18px, env(safe-area-inset-bottom, 0px))', transform: (selected && isExplore) ? 'translateY(0)' : 'translateY(calc(100% + 28px))', transition: 'transform 380ms cubic-bezier(0.22,1,0.36,1)', zIndex: 30, pointerEvents: selected ? 'auto' : 'none' }}>
        {selected && isReveal && <article style={{ background: cardBg, color: cardText, border: `1px solid ${cardRule}`, borderRadius: RADII.panel, padding: '22px 22px 20px', boxShadow: `0 22px 70px rgba(0,0,0,0.44), 0 0 0 1px rgba(${accentRgb},0.08)`, maxHeight: '47vh', overflowY: 'auto' }}>
          <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.compact }}>
            <h2 style={{ ...TYPE.displaySection, margin: 0, color: cardText, borderLeft: `3px solid rgba(${accentRgb},0.62)`, paddingLeft: SPACING.compact }}>{selected.title}</h2>
            <div style={{ ...TYPE.metadata, fontSize: 11, color: `rgba(${accentRgb},0.75)`, letterSpacing: '0.12em', flexShrink: 0, marginLeft: SPACING.compact }}>{revealStep + 1} / {revealCount}</div>
          </header>
          <div style={{ display: 'flex', gap: 4, marginBottom: SPACING.standard }}>
            {selected.reveals.map((_, i) => <div key={i} style={{ flex: 1, height: 2, borderRadius: 2, background: i <= revealStep ? accent : `rgba(${accentRgb},0.16)`, transition: `background 300ms ${MOTION.easing.gentle}` }} />)}
          </div>
          <p key={revealStep} style={{ ...TYPE.bodySmall, color: cardMuted, margin: `0 0 ${SPACING.standard}px`, lineHeight: 1.72, animation: `ihi-reveal-in 320ms ${MOTION.easing.standard} both` }}>{selected.reveals[revealStep]?.text}</p>
          <button type="button" className="ihi-next" onClick={e => { e.stopPropagation(); handleRevealNext() }} style={{ width: '100%', height: 52, borderRadius: RADII.medium, background: isLastReveal ? `rgba(${accentRgb},0.20)` : `rgba(${accentRgb},0.10)`, border: `1px solid rgba(${accentRgb},${isLastReveal ? 0.38 : 0.20})`, color: cardText, ...TYPE.bodySmall, fontWeight: 700, cursor: 'pointer', transition: `background 200ms ${MOTION.easing.gentle}, border-color 200ms ${MOTION.easing.gentle}` }}>{isLastReveal ? 'Mark explored →' : 'Next →'}</button>
        </article>}
        {selected && !isReveal && <article style={{ background: cardBg, color: cardText, border: `1px solid ${cardRule}`, borderRadius: RADII.panel, padding: '22px 22px 20px', boxShadow: `0 22px 70px rgba(0,0,0,0.44), 0 0 0 1px rgba(${accentRgb},0.08)`, maxHeight: '47vh', overflowY: 'auto' }}>
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
      <div style={{ position: 'absolute', bottom: 'max(28px, calc(env(safe-area-inset-bottom, 0px) + 28px))', left: '24px', right: '24px', zIndex: 22, opacity: showContinue ? 1 : 0, transform: showContinue ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 500ms cubic-bezier(0.22,1,0.36,1), transform 500ms cubic-bezier(0.22,1,0.36,1)', pointerEvents: showContinue ? 'auto' : 'none' }}>
        <ContinueCTA onClick={onContinue} accent={accent} />
      </div>

      {showSynthesis && synthesis && <SynthesisScreen synthesis={synthesis} accent={accent} accentRgb={accentRgb} pageBg={pageBg} text={imageText} muted={imageMuted} onContinue={onContinue} />}
    </CinematicShell>
  )
}
```

- [ ] **Step 2: Build**

Run: `./node_modules/.bin/vite build`
Expected: build succeeds with no errors referencing `InteractiveHotspotImage.jsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/learning/InteractiveHotspotImage.jsx
git commit -m "feat: add reveal variant and optional synthesis to InteractiveHotspotImage"
```

---

### Task 2: Migrate episode 01 content block to `interactiveImage` reveal

**Files:**
- Modify: `src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js` (the block currently at ~L760, `type: 'collectionExplorer'`, `id: 'staying-well-1400'`)

**Interfaces:**
- Consumes: `variant`/`synthesis`/`image`/`introText`/`hotspots` from Task 1.

- [ ] **Step 1: Rewrite the block header keys**

In that block, apply exactly these key changes, leaving every `reveals`, `x`, `y`, and item `id` untouched:
- `type: 'collectionExplorer'` → `type: 'interactiveImage'`
- add a new line directly under `type`: `variant: 'reveal',`
- keep `stage`, `id`, `label`, `title` as-is
- `description: 'Tap each object to find out how people tried to stay healthy — before anyone knew about germs.'` → rename the key to `introText:` (same value)
- `backgroundImage: '/figures/history/medicine/medieval/medieval-street.webp'` → rename the key to `image:` (same value)
- add directly under `image`: `imageAlt: 'A medieval street scene in 1400',` and `ctaLabel: 'Explore',`
- `items: [` → `hotspots: [`

- [ ] **Step 2: Rename each hotspot's `label` to `title`**

For all four items (`regimen-sanitatis`, `stewes`, `purifying-air`, `clean-water`), change the property `label:` to `title:` on the item object (NOT inside `reveals`). Example — the first item becomes:

```js
        {
          id: 'regimen-sanitatis',
          x: 22, y: 38,
          title: "A physician's lifestyle chart",
          reveals: [
            { text: "A wealthy merchant keeps a written chart pinned to his wall — instructions for exactly how to eat, sleep and bathe." },
            { text: "This is a Regimen Sanitatis: a physician's personal guide to diet, exercise, sleep and bathing, written to keep a patient's humours in balance." },
            { text: "Prevention followed the same logic as treatment. If the Four Humours explained illness, keeping them balanced through daily habits should stop illness before it started." },
            { text: "A personalised Regimen Sanitatis came from a physician — which meant it cost money. Only the wealthy could afford this kind of tailored advice. Prevention, like treatment, depended on wealth." },
            { text: "The Regimen Sanitatis shows the Four Humours shaped how people lived, not just how doctors treated illness. Diet, sleep and bathing were all part of the same theory." },
          ],
        },
```

Leave the `synthesis: { ... }` object exactly as it is (it stays the last key in the block).

- [ ] **Step 2: Build**

Run: `./node_modules/.bin/vite build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js
git commit -m "content: migrate episode 01 'staying well in 1400' to interactiveImage reveal"
```

---

### Task 3: Migrate episode 14 content block to `interactiveImage` reveal

**Files:**
- Modify: `src/content/history/medicine/episodes/episode-14-western-front.js` (the block at ~L123, `type: 'collectionExplorer'`, `id: 'trench-conditions-explorer'`)

**Interfaces:**
- Consumes: same props as Task 2.

- [ ] **Step 1: Rewrite the block header keys**

Apply exactly, leaving `reveals`, `x`, `y`, item `id`, `tag`, `stage`, `synthesis` untouched:
- `type: 'collectionExplorer'` → `type: 'interactiveImage'`
- add under `type`: `variant: 'reveal',`
- keep `tag`, `stage`, `id`, `title`, `label`
- `description: 'The trenches did not just create wounds. They created disease, infection and mental trauma. Tap each to find out more.'` → rename key to `introText:` (same value)
- `backgroundImage: '/figures/history/medicine/western-front/trench-soldiers.png'` → rename key to `image:` (same value)
- add under `image`: `imageAlt: 'Soldiers in a First World War trench',` and `ctaLabel: 'Explore',`
- `items: [` → `hotspots: [`

Note the `synthesis` object appears BEFORE `items` in this block — leave it where it is; key order does not matter.

- [ ] **Step 2: Rename each hotspot's `label` to `title`**

For all six items (`trench-foot`, `trench-fever`, `shell-shock`, `gas-attacks`, `shrapnel`, `head-injuries`), change the item-level `label:` to `title:`, leaving `reveals` untouched. Example:

```js
        {
          id: 'trench-foot',
          x: 18, y: 28,
          title: 'Trench foot',
          reveals: [
            { text: 'Standing for days in cold, wet mud could damage soldiers\' feet.' },
            { text: 'Severe cases developed gangrene and sometimes needed amputation.' },
            { text: 'Prevention included rubbing whale oil on feet and regular foot inspections by medical officers.' },
          ],
        },
```

- [ ] **Step 3: Build**

Run: `./node_modules/.bin/vite build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/content/history/medicine/episodes/episode-14-western-front.js
git commit -m "content: migrate episode 14 'trench conditions' to interactiveImage reveal"
```

---

### Task 4: Wire ModulePlayer, delete component, drop componentFunctions entry

**Files:**
- Modify: `src/components/layout/ModulePlayer.jsx` (import ~L51; `interactiveImage` branch ~L1862; `collectionExplorer` branch ~L1886)
- Delete: `src/components/learning/InteractiveCollectionExplorer.jsx`
- Modify: `src/data/componentFunctions.js` (L58)

**Interfaces:**
- Consumes: `variant`/`synthesis` props from Task 1; migrated content from Tasks 2–3 (nothing now emits `type: 'collectionExplorer'`).

- [ ] **Step 1: Pass `variant` + `synthesis` in the interactiveImage branch**

In `ModulePlayer.jsx`, inside the `if (cur?.type === 'interactiveImage')` block, add two props to `<InteractiveHotspotImage …>` (after `ctaLabel={cur.ctaLabel}`):

```jsx
          variant={cur.variant}
          synthesis={cur.synthesis || null}
```

- [ ] **Step 2: Delete the collectionExplorer branch**

Remove the entire block (comment + `if`):

```jsx
  // ── Interactive collection explorer — tappable object discovery ─────────────
  if (cur?.type === 'collectionExplorer') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <InteractiveCollectionExplorer
          subject={module.subject}
          title={cur.title}
          description={cur.description}
          backgroundImage={cur.backgroundImage}
          items={cur.items || []}
          synthesis={cur.synthesis || null}
          onContinue={isLast ? handleFinish : () => go(1)}
        />
        {jumpSheetPortal}
      </>
    )
  }
```

- [ ] **Step 3: Delete the import**

Remove line: `import InteractiveCollectionExplorer from '../learning/InteractiveCollectionExplorer.jsx'`

- [ ] **Step 4: Delete the component file**

```bash
git rm src/components/learning/InteractiveCollectionExplorer.jsx
```

- [ ] **Step 5: Remove the componentFunctions entry**

In `src/data/componentFunctions.js`, delete the line:

```js
  collectionExplorer: { functions: ['teach-mechanism'], interaction: 'reveal' },
```

(`interactiveImage` already carries `teach-mechanism`, so mechanism coverage is retained.)

- [ ] **Step 6: Build**

Run: `./node_modules/.bin/vite build`
Expected: build succeeds; no unresolved import of `InteractiveCollectionExplorer`.

- [ ] **Step 7: Commit**

```bash
git add src/components/layout/ModulePlayer.jsx src/data/componentFunctions.js
git commit -m "refactor: route interactiveImage reveal variant, remove collectionExplorer"
```

---

### Task 5: Update dev component-review manifest + fixtures

**Files:**
- Modify: `src/dev/componentReview/reviewManifest.jsx` (import L40; `alternative` strings L105, L307, L316, L376; explorer entry ~L596)
- Modify: `src/dev/componentReview/fixtures.base.js` (fixture ~L700)

- [ ] **Step 1: Repurpose the fixture**

In `fixtures.base.js`, replace the `collectionExplorer` fixture (the comment block + `export const collectionExplorer = { … }`) with a reveal fixture shaped for `InteractiveHotspotImage`:

```js
// InteractiveHotspotImage — reveal variant (History): paged reveals per hotspot + synthesis.
// Shape: { title, introText, image, imageAlt, hotspots:[{id,x,y,title,reveals:[{text}]}], synthesis }.
export const interactiveHotspotReveal = {
  title: 'Staying well in 1400',
  introText: 'Tap each object to find out how people tried to stay healthy — before anyone knew about germs.',
  image: '/figures/history/medicine/medieval/medieval-street.webp',
  imageAlt: 'A medieval street scene in 1400',
  hotspots: [
    {
      id: 'regimen-sanitatis', x: 30, y: 42, title: "A physician's lifestyle chart",
      reveals: [
        { text: "A wealthy merchant keeps a written chart pinned to his wall — instructions for exactly how to eat, sleep and bathe." },
        { text: "This is a Regimen Sanitatis: a physician's guide to diet, exercise, sleep and bathing, written to keep a patient's humours in balance." },
        { text: "Prevention followed the same logic as treatment. If the Four Humours explained illness, keeping them balanced through daily habits should stop illness before it started." },
      ],
    },
    {
      id: 'purifying-air', x: 68, y: 60, title: 'A bunch of dried herbs',
      reveals: [
        { text: "A woman walking through town presses a small bunch of dried flowers to her nose." },
        { text: 'This is "purifying the air" — carrying sweet-smelling herbs and ringing bells to keep the air moving, both believed to protect against miasma.' },
        { text: "If bad-smelling air carried disease, then good smells and moving air should push it away. A direct application of miasma theory to daily life." },
      ],
    },
  ],
  synthesis: {
    heading: 'Prevention followed belief',
    points: [
      'A Regimen Sanitatis followed the Four Humours — diet, sleep and bathing kept the body in balance.',
      'Sweet herbs and ringing bells followed miasma theory — pushing away the bad air believed to carry disease.',
    ],
    examTakeaway: 'Every prevention method connects back to a belief about the cause of disease. The belief determined the prevention.',
  },
}
```

- [ ] **Step 2: Remove the manifest import and explorer entry**

In `reviewManifest.jsx`:
- Delete line L40: `import InteractiveCollectionExplorer from '../../components/learning/InteractiveCollectionExplorer.jsx'`
- Delete the whole manifest object beginning `id: 'interactive-collection-explorer', name: 'InteractiveCollectionExplorer'` (through its closing `},`).

- [ ] **Step 3: Add a reveal review entry for InteractiveHotspotImage**

Immediately after the existing `id: 'interactive-hotspot-image'` entry's closing `},`, insert:

```jsx
  {
    id: 'interactive-hotspot-image-reveal', name: 'InteractiveHotspotImage (reveal)', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Reveal variant: tap a hotspot to page through multiple pieces of information (reveals), then a synthesis "collection complete" screen once all are explored.',
    usage: 'Used in Episode 1 (staying well in 1400) and Episode 14 (trench conditions), type: interactiveImage + variant: reveal.',
    alternative: 'InteractiveHotspotImage (detail variant) for single-card hotspots.',
    render: (fx, { onDone }) => (
      <InteractiveHotspotImage
        subject="History" variant="reveal" title={fx.title} introText={fx.introText}
        image={fx.image} imageAlt={fx.imageAlt} hotspots={fx.hotspots} synthesis={fx.synthesis}
        onContinue={onDone}
      />
    ),
    fixture: FIX.interactiveHotspotReveal,
  },
```

- [ ] **Step 4: Fix the stale `alternative` strings**

In `reviewManifest.jsx`, update these three `alternative:` values that name the removed component:
- L105 (cinematicCarousel entry): `'InteractiveCollectionExplorer; CinematicRevealMoment (imageReveal mode).'` → `'InteractiveHotspotImage (reveal variant); CinematicRevealMoment (imageReveal mode).'`
- L307 (visualLearning entry): `'InteractiveCollectionExplorer; CinematicRevealMoment; ConceptReveal; TimelineChain (reveal variant).'` → `'InteractiveHotspotImage (reveal variant); CinematicRevealMoment; ConceptReveal; TimelineChain (reveal variant).'`
- L316 (guidedChoiceCarousel entry): `'InteractiveCollectionExplorer; CinematicCarousel.'` → `'InteractiveHotspotImage (reveal variant); CinematicCarousel.'`
- L376 (interactive-hotspot-image entry): `'InteractiveCollectionExplorer (themed sheets, no image anchoring); CinematicCarousel.'` → `'InteractiveHotspotImage reveal variant; CinematicCarousel.'`

- [ ] **Step 5: Build**

Run: `./node_modules/.bin/vite build`
Expected: build succeeds; no reference to `FIX.collectionExplorer` or the removed import remains.

- [ ] **Step 6: Commit**

```bash
git add src/dev/componentReview/reviewManifest.jsx src/dev/componentReview/fixtures.base.js
git commit -m "chore: dev review manifest covers hotspot reveal variant, drops explorer"
```

---

### Task 6: Update documentation

**Files:**
- Modify: `docs/components/COMPONENT_REGISTRY.md` (hotspot entry L242; explorer entry L329)
- Modify: `CLAUDE.md` (learning-components list)
- Modify: `docs/system/HISTORY_MODULE_ARCHITECTURE.md` (L74, L99, L415)
- Modify: `docs/system/GOLD_SCREEN_REGISTER.md` (table L531; section L608–L614; L681)
- Modify: `docs/system/component-contracts/interactive-hotspot-image.md`

- [ ] **Step 1: COMPONENT_REGISTRY.md**

Replace the `InteractiveHotspotImage` entry's Purpose/Props lines (L245–L246) with:

```markdown
**Purpose:** Full-screen image with tappable hotspots. Two-phase: intro reveal → explore hotspots. Two variants: `detail` (default — one card of labelled rows per hotspot) and `reveal` (pages through multiple pieces of information per hotspot, `reveals[]`). Optional `synthesis` shows a "collection complete" summary once all hotspots are explored.
**Props:** `subject`, `title`, `introText`, `image`, `imageAlt`, `hotspots`, `ctaLabel`, `variant`, `synthesis`, `onBack`, `onEnterExplore`, `onContinue`
```

Delete the entire `### InteractiveCollectionExplorer` entry (L329 heading through its trailing `---` at L336).

- [ ] **Step 2: CLAUDE.md**

In the `src/components/learning/` list, delete the `InteractiveCollectionExplorer.jsx` bullet and extend the `InteractiveHotspotImage.jsx` bullet to:

```markdown
- `InteractiveHotspotImage.jsx` — Full-screen image with tappable hotspots (two-phase intro→explore). Two variants: `detail` (default) shows one card of labelled rows per hotspot; `reveal` pages through multiple pieces of information per hotspot (`reveals[]`) and supports an optional `synthesis` "collection complete" summary screen. (Absorbed the former `InteractiveCollectionExplorer`.)
```

- [ ] **Step 3: HISTORY_MODULE_ARCHITECTURE.md**

At L74, L99, and L415 the list item `` - `InteractiveCollectionExplorer` `` appears. Replace each with `` - `InteractiveHotspotImage` (`variant: 'reveal'`) `` — but if the line immediately above already reads `` - `InteractiveHotspotImage` ``, delete the `InteractiveCollectionExplorer` line instead of duplicating (check L73→L74 and L414→L415, which do list `InteractiveHotspotImage` directly above; at L98→L99 the line above is `TimelineChain`, so there replace with `` - `InteractiveHotspotImage` (`variant: 'reveal'`) ``).

- [ ] **Step 4: GOLD_SCREEN_REGISTER.md**

- Table row L531 `| \`collectionExplorer\` | 2 | …` → change the type label to `` `interactiveImage` (reveal) `` and update the note to drop "phase-label mismatch" (now fixed): `✓ Ep1 s18 (rest + sheet + synthesis) | re-review after migration to reveal variant`.
- Section heading L608 `### \`collectionExplorer\`` → `### \`interactiveImage\` (reveal variant)`, and in its body (L612–L614) delete the sentence describing the hardcoded five-beat `Hook · What is it? · …` phase labels (the reveal variant uses a neutral step counter now); note it was absorbed into `InteractiveHotspotImage`.
- L681 recurring-patterns note: change `collectionExplorer` to `interactiveImage (reveal)`.

- [ ] **Step 5: interactive-hotspot-image.md contract**

Append a new section after "Known failure modes":

```markdown
## Variants

- `variant="detail"` (default) — the bar above: one reveal card of labelled
  rows per hotspot (`description` → Meaning/Believed effect, `extraFact` →
  Treatment logic).
- `variant="reveal"` — each hotspot carries a `reveals: [{ text }]` array; the
  card pages through them (Next → … → "Mark explored →"), showing an
  `n / total` step counter and a segmented progress bar. A hotspot is only
  marked visited when its final reveal is reached. Absorbed from the former
  `InteractiveCollectionExplorer`; the old hardcoded five-beat phase labels
  are deliberately dropped.
- Optional `synthesis={ heading, points[], examTakeaway? }` — when supplied,
  a "collection complete" summary screen replaces the bare Continue once all
  hotspots are explored. Works with either variant.

Reveal-variant copy standard: each `reveals[i].text` is one self-contained
beat; order them narrative → explanation → exam relevance. Keep each beat to
1–3 sentences so the card (capped `47vh`) never buries the point.
```

- [ ] **Step 6: Commit**

```bash
git add docs/components/COMPONENT_REGISTRY.md CLAUDE.md docs/system/HISTORY_MODULE_ARCHITECTURE.md docs/system/GOLD_SCREEN_REGISTER.md docs/system/component-contracts/interactive-hotspot-image.md
git commit -m "docs: document hotspot reveal variant, remove InteractiveCollectionExplorer"
```

---

### Task 7: Final verification & cleanup

**Files:** none (verification only)

- [ ] **Step 1: No dangling source references**

Run: `git grep -n "InteractiveCollectionExplorer\|collectionExplorer" -- src`
Expected: no output (zero matches in `src/`). Docs/.planning references outside `src/` are acceptable historical mentions, but the ones edited in Task 6 should be updated.

- [ ] **Step 2: Build**

Run: `./node_modules/.bin/vite build`
Expected: PASS.

- [ ] **Step 3: Architecture tests**

Run: `./node_modules/.bin/vitest run tests/architecture`
Expected: PASS (no new failures vs. baseline).

- [ ] **Step 4: 390px render pass**

Start the dev server (`./node_modules/.bin/vite`) at 390px width and walk both migrated screens:
- Episode 01 "staying well in 1400": intro → Explore → tap each of the 4 hotspots, page through its reveals to "Mark explored →", confirm dot positions sit on sensible objects (nudge `x`/`y` in the content file if any dot lands off-subject), confirm the synthesis "collection complete" screen fires after the 4th, and Continue advances.
- Episode 14 "trench conditions": same walk with 6 hotspots × 3 reveals + synthesis.
Record the result in the requesting-code-review / verification step. Any coordinate nudges get their own follow-up commit:

```bash
git add src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js src/content/history/medicine/episodes/episode-14-western-front.js
git commit -m "content: nudge reveal-variant hotspot coordinates after render pass"
```

- [ ] **Step 5: Push**

```bash
git push -u origin main
```

---

## Self-Review

**Spec coverage:** variant (Task 1) ✓; synthesis optional (Task 1) ✓; drop PHASE_LABELS → step counter (Task 1, reveal card) ✓; drop THEMES / theme from SUBJECTS (Task 1, reuses getTheme) ✓; content migration ep01/ep14 (Tasks 2–3) ✓; ModulePlayer wiring + branch/import/file deletion (Task 4) ✓; componentFunctions (Task 4) ✓; reviewManifest + fixtures (Task 5) ✓; COMPONENT_REGISTRY, CLAUDE.md, HISTORY_MODULE_ARCHITECTURE, GOLD_SCREEN_REGISTER, contract doc (Task 6) ✓; LOCKED_COMPONENTS spot-check — `InteractiveHotspotImage` is not locked (verified: not in the locked list); no task needed ✓; verification incl. coordinate render pass (Task 7) ✓.

**Placeholder scan:** no TBD/TODO; every code step shows full content; content migrations give exact key-rename edits with a worked example item.

**Type consistency:** props `variant`/`synthesis` named identically across Task 1 (definition), Task 4 (ModulePlayer passes `variant={cur.variant}` / `synthesis={cur.synthesis||null}`), Task 5 (review entry passes `variant="reveal"` + `synthesis`). Hotspot field `title` (renamed from `label`) consistent across Tasks 2, 3, 5 and the component's `HotspotButton`/label usage. Fixture export `interactiveHotspotReveal` matches `FIX.interactiveHotspotReveal` reference in Task 5.
