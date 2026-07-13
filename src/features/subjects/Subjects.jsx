import { useState, useEffect } from 'react'
import { GENERAL } from '../../constants/generalTheme.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import { MODULES, getModuleAvailability, MODULE_AVAILABILITY } from '../../modules.js'
import { getModuleState as safeGetModuleState, getModulePct as modPct, getContinueModule } from '../../progress.js'
import { getWeakestSubject, getBiggestWin } from '../../unifiedWeaknessTracker.js'
import { findTaggedScreen } from '../../data/tagModuleMap.js'
import { StreakChip } from '../home/StreakChip.jsx'
import BackButton from '../../components/core/BackButton.jsx'
import BottomNav from '../../app/BottomNav.jsx'
import { SUBJECTS, hexToRgb } from '../../constants/subjects.js'

const MODULE_HEADER_IMAGES = {
  'history-medicine-medieval-beliefs-causes': '/headers/history-medicine-through-time.webp',
  'history-medicine-black-death': '/figures/history/medicine/black-death/plague-background.png',
  'history-medicine-renaissance-medicine': '/headers/history-medicine-bloodletting.png',
  'history-medicine-surgery-anaesthetics': '/headers/history-medicine-germ-bridge.png',
  'history-medicine-jenner-vaccination': '/headers/history-medicine-medieval-scripture.png',
  'history-medicine-germ-theory': '/headers/history-medicine-germ-bridge.png',
  'history-medicine-great-stink': '/headers/history-medicine-through-time.webp',
  'history-medicine-surgery-revolution': '/headers/history-medicine-bloodletting.png',
  'history-medicine-accidental-miracle': '/headers/history-medicine-germ-bridge.png',
  'history-medicine-modern-medicine': '/headers/history-medicine-medieval-scripture.png',
  'history-medicine-cancer': '/headers/history-medicine-through-time.webp',
  'sci_bio_w1': '/headers/bio-main.png',
  'bio_building_blocks': '/headers/bio-main.png',
  'math1': '/headers/maths-numbers.webp',
  'math2': '/headers/maths-numbers.webp',
  'soc1': '/headers/sociology-family.webp',
  'soc2': '/headers/sociology-education.webp',
  'soc3': '/headers/sociology-crime.webp',
  'soc4': '/headers/sociology-stratification.webp',
  'soc6': '/headers/sociology-main.webp',
}

// ─── SubjectBrowser ────────────────────────────────────────────────────────────

const SUBJECT_HEADER_IMGS = {
  History:   '/headers/history-medicine-through-time.webp',
  Biology:   '/headers/bio-main.png',
  Chemistry: '/headers/chem-matteratoms.webp',
  Maths:     '/headers/maths-numbers.webp',
  Sociology: '/headers/sociology-family.webp',
  English:   '/headers/english-macbeth.webp',
  Physics:   '/headers/physics-forces.webp',
}

const SUBJECT_DISPLAY_TITLES = {
  History:   'Medicine through time',
  Biology:   'AQA Biology',
  Chemistry: 'AQA Chemistry',
  Maths:     'AQA Mathematics',
  Sociology: 'AQA Sociology',
  English:   'AQA English',
  Physics:   'AQA Physics',
}

const SUBJECT_DESCRIPTIONS = {
  History:   'Explore how medicine and ideas have shaped the world.',
  Biology:   'Build your understanding from cells to ecosystems.',
  Chemistry: 'Master the reactions and patterns behind matter.',
  Maths:     'Build number, algebra and problem-solving fluency.',
  Sociology: 'Understand the social forces that shape our lives.',
  English:   'Sharpen your reading, analysis and writing skills.',
  Physics:   'Explore the forces and energy that shape our world.',
}

const HISTORY_SERIES = [
  {
    id: 'medicine',
    title: 'Medicine through time',
    short: 'Medicine',
    headerImage: '/headers/history-medicine-through-time.webp',
    comingSoon: false,
  },
  {
    id: 'spain-new-world',
    title: 'Spain and the new world',
    short: 'Spain',
    headerImage: '/headers/history-spain-new-world.webp',
    comingSoon: false,
  },
  {
    id: 'elizabethan',
    title: 'Elizabethan England',
    short: 'Elizabethan',
    headerImage: '/headers/history-elizabethan.webp',
    comingSoon: true,
  },
  {
    id: 'usa',
    title: 'USA: conflict at home and abroad',
    short: 'USA',
    headerImage: '/headers/history-usa-conflict.webp',
    comingSoon: false,
  },
]

const ENGLISH_SERIES = [
  {
    id: 'macbeth',
    title: 'Macbeth',
    short: 'Macbeth',
    headerImage: '/headers/history-medicine-through-time.webp',
    comingSoon: false,
  },
  {
    id: 'inspector',
    title: 'An Inspector Calls',
    short: 'Inspector',
    headerImage: '/headers/sociology-family.webp',
    comingSoon: true,
  },
]

function getSubjectModuleList(subjectName) {
  const real = MODULES.filter(m => m.subject === subjectName)
  const cs = (arr) => arr.map(x => ({ ...x, comingSoon: true }))
  switch (subjectName) {
    case 'History':
      return real
    case 'English': {
      const macbethCh1 = MODULES.find(m => m.id === 'english-macbeth-power-ambition')
      return [
        macbethCh1 ? { ...macbethCh1, series: 'macbeth', number: 1 } : null,
        { id: 'cs_macbeth_2', title: 'Out, damned spot',                  subtitle: 'Guilt and consequence',          comingSoon: true, series: 'macbeth',   number: 2 },
        { id: 'cs_macbeth_3', title: 'Double, double, toil and trouble',  subtitle: 'The witches and fate',           comingSoon: true, series: 'macbeth',   number: 3 },
        { id: 'cs_macbeth_4', title: 'Fair is foul, foul is fair',        subtitle: 'Appearance vs reality',          comingSoon: true, series: 'macbeth',   number: 4 },
        { id: 'cs_inspector_1', title: 'We are members of one body',      subtitle: "Priestley's social message",     comingSoon: true, series: 'inspector', number: 1 },
        { id: 'cs_inspector_2', title: 'I accept no blame',               subtitle: 'Responsibility and denial',      comingSoon: true, series: 'inspector', number: 2 },
        { id: 'cs_inspector_3', title: 'Fire, blood and anguish',         subtitle: 'Consequences and resolution',    comingSoon: true, series: 'inspector', number: 3 },
      ].filter(Boolean)
    }
    case 'Physics':
      return cs([
        { id: 'cs_forces', title: 'Forces & Motion',     subtitle: 'AQA Physics · Topic 5 & 6' },
        { id: 'cs_energy', title: 'Energy',              subtitle: 'AQA Physics · Topic 1' },
        { id: 'cs_waves',  title: 'Waves & Electricity', subtitle: 'AQA Physics · Topic 6 & 2' },
        { id: 'cs_space',  title: 'Space',               subtitle: 'AQA Physics · Topic 8' },
        { id: 'cs_matter', title: 'Matter & Particles',  subtitle: 'AQA Physics · Topic 3 & 4' },
      ])
    default:
      if (real.length > 0) return real
      return cs([{ id: `cs_${subjectName.toLowerCase()}`, title: 'Content coming soon', subtitle: subjectName }])
  }
}

function SubjectBrowser({ subjectName, onBack, onOpenModule }) {
  const sand         = SUBJECTS[subjectName]?.subjectBrowserAccent || SUBJECTS.History.subjectBrowserAccent
  const bronze       = SUBJECTS[subjectName]?.subjectBrowserAccentDark || SUBJECTS.History.subjectBrowserAccentDark
  const accent       = sand
  const accentRgb    = hexToRgb(sand)
  const headerImg    = SUBJECT_HEADER_IMGS[subjectName]    || '/headers/history-medicine-through-time.webp'
  const displayTitle = SUBJECT_DISPLAY_TITLES[subjectName] || subjectName
  const displayDesc  = SUBJECT_DESCRIPTIONS[subjectName]   || ''

  const isHistory = subjectName === 'History'
  const isEnglish = subjectName === 'English'
  const hasSeries = isHistory || isEnglish
  const [activeSeries, setActiveSeries] = useState(() => {
    if (isHistory) return HISTORY_SERIES[0]
    if (isEnglish) return ENGLISH_SERIES[0]
    return null
  })

  const rawMods = getSubjectModuleList(subjectName)
  const allItems = rawMods.map((mod, i) => {
    if (mod.comingSoon) return { ...mod, number: i + 1, status: 'coming_soon', pct: 0 }
    // Canonical availability: hidden stubs drop out entirely, coming-soon stubs
    // show but never open (guarded in handleCardClick / openModulePlayer).
    const availability = getModuleAvailability(mod)
    if (availability === MODULE_AVAILABILITY.HIDDEN) return null
    if (availability !== MODULE_AVAILABILITY.AVAILABLE) return { ...mod, number: i + 1, status: 'coming_soon', pct: 0 }
    const s = safeGetModuleState(mod.id)
    const screen = s.screen || 0
    const hasStarted = (s.hookDone && s.wylDone) || screen > 0
    const total = mod.screenCount || 1
    // `completed` sticks once a module is finished — reviewing it afterwards moves `screen`
    // back down, but it must never read as anything other than 'completed' again.
    const pct = s.completed ? 100 : Math.min(100, Math.round((screen / total) * 100))
    const status = s.completed ? 'completed' : hasStarted ? 'in_progress' : 'not_started'
    return { ...mod, number: mod.number || i + 1, status, pct }
  }).filter(Boolean) // drop hidden modules

  const defaultSeries = isHistory ? 'medicine' : 'macbeth'
  const items = (hasSeries && activeSeries)
    ? allItems.filter(m => (m.series || defaultSeries) === activeSeries.id)
    : allItems

  const heroImage = hasSeries && activeSeries ? activeSeries.headerImage : headerImg
  const heroTitle = hasSeries && activeSeries ? activeSeries.title : displayTitle

  const completedCount = items.filter(m => m.status === 'completed').length
  const realCount      = items.filter(m => m.status !== 'coming_soon').length
  const overallPct     = realCount > 0 ? Math.round((completedCount / realCount) * 100) : 0

  // The next module to tackle — whether already in progress or not yet started — is
  // highlighted as the hero CTA, so finishing one module always hands off the spotlight.
  const nextUpIndex = items.findIndex(m => m.status !== 'completed' && m.status !== 'coming_soon')

  const [ringPct, setRingPct] = useState(0)
  useEffect(() => { const t = setTimeout(() => setRingPct(overallPct), 80); return () => clearTimeout(t) }, [overallPct])

  const RING_SIZE = 68
  const R       = 31
  const CIRCUM  = 2 * Math.PI * R
  const dashOff = CIRCUM * (1 - ringPct / 100)

  // Small progress ring overlaid on the current card's thumbnail
  const CARD_RING_SIZE = 44
  const CARD_RING_R    = 17
  const CARD_RING_CIRCUM = 2 * Math.PI * CARD_RING_R

  function handleCardClick(item) {
    if (item.status === 'coming_soon') return
    const realMod = MODULES.find(m => m.id === item.id)
    if (realMod && onOpenModule) onOpenModule(realMod)
  }

  function thumbFor(item) {
    return item.headerImage || MODULE_HEADER_IMAGES[item.id] || headerImg
  }

  function stripEra(s) {
    return s.replace(/,?\s*c?\.?\s*\d{3,4}\s*[–-]\s*c?\.?\s*\d{2,4}\s*$/i, '').trim()
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050505', paddingBottom: 120, overflowX: 'hidden' }}>
      <style>{`
        @keyframes sbCurrentGlow {
          0%,100% { box-shadow: 0 0 16px rgba(${accentRgb},0.30), 0 0 7px rgba(${accentRgb},0.16); }
          50%      { box-shadow: 0 0 26px rgba(${accentRgb},0.46), 0 0 12px rgba(${accentRgb},0.24); }
        }
      `}</style>

      {/* ── HERO ── */}
      <div style={{ height: 198, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.92,
          transition: 'background-image 0.3s ease',
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, bottom: 0, width: '68%',
          background: 'linear-gradient(to right, rgba(5,5,5,0.72) 0%, rgba(5,5,5,0.24) 65%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 85,
          background: 'linear-gradient(180deg, transparent 0%, #050505 100%)',
        }} />
        <BackButton onClick={onBack} style={{ position: 'absolute', top: 20, left: 24, zIndex: 10 }} />

        {/* Module journey indicator — circular progress, draws in on mount */}
        <div style={{ position: 'absolute', top: 20, right: 24, zIndex: 10, width: RING_SIZE, height: RING_SIZE, opacity: 0.9 }}>
          <svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`} style={{ transform: 'rotate(-90deg)', display: 'block' }}>
            <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={5} />
            <circle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={R} fill="none" stroke={accent} strokeWidth={5}
              strokeDasharray={CIRCUM} strokeDashoffset={dashOff} strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.22, 1, 0.36, 1)' }} />
          </svg>
          <div style={{
            position: 'absolute', inset: 7, borderRadius: RADII.pill,
            background: 'rgba(5,5,5,0.5)', backdropFilter: 'blur(2px)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ ...TYPE.titleLarge, fontSize: 17, color: '#F5F7FF' }}>{overallPct}%</span>
            <span style={{ ...TYPE.eyebrow, fontSize: 7, textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>Complete</span>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 18, left: 24, right: 108, zIndex: 5 }}>
          <div style={{
            ...TYPE.eyebrow,
            fontSize: 11, color: accent, textTransform: 'uppercase', marginBottom: 7,
          }}>{subjectName}</div>
          <div style={{
            ...TYPE.displaySection,
            fontSize: 24, color: '#F5F7FF',
          }}>{heroTitle}</div>
          {hasSeries ? (
            <div style={{
              ...TYPE.bodySmall,
              fontSize: 13, color: 'rgba(255,255,255,0.52)', marginTop: 6,
            }}>{activeSeries?.comingSoon ? 'Coming soon'
              : isHistory ? `${items.length} episodes · Edexcel History`
              : `${items.length} chapters · AQA English literature`}</div>
          ) : displayDesc ? (
            <div style={{
              ...TYPE.bodySmall,
              fontSize: 13, color: 'rgba(255,255,255,0.52)', marginTop: 6, maxWidth: 240,
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>{displayDesc}</div>
          ) : null}
        </div>
      </div>

      {/* ── SERIES PICKER ── */}
      {hasSeries && (
        <div style={{
          display: 'flex', gap: 10, padding: '20px 24px 8px',
          overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
        }}>
          {(isHistory ? HISTORY_SERIES : ENGLISH_SERIES).map(s => {
            const isActive = activeSeries?.id === s.id
            return (
              <button
                key={s.id}
                onClick={() => setActiveSeries(s)}
                style={{
                  flexShrink: 0, width: 136, height: 84, borderRadius: 16,
                  overflow: 'hidden', position: 'relative', cursor: 'pointer',
                  border: isActive ? `2px solid ${accent}` : '2px solid transparent',
                  padding: 0, opacity: isActive ? 1 : 0.38,
                  transform: isActive ? 'scale(1.04)' : 'scale(1)',
                  transformOrigin: 'center bottom',
                  transition: 'opacity 0.22s, transform 0.22s, border-color 0.22s',
                  boxShadow: isActive ? `0 0 18px rgba(${accentRgb},0.4)` : 'none',
                }}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${s.headerImage})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.12) 100%)',
                }} />
                <div style={{ position: 'absolute', bottom: 8, left: 10, right: 10 }}>
                  <div style={{
                    ...TYPE.eyebrow,
                    fontSize: 11, color: '#fff', textAlign: 'left',
                    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>{s.title}</div>
                  {s.comingSoon ? (
                    <div style={{
                      ...TYPE.eyebrow,
                      marginTop: 3, fontSize: 9, textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.45)',
                    }}>Coming soon</div>
                  ) : null}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* ── MODULE JOURNEY ── */}
      {hasSeries && activeSeries?.comingSoon ? (
        <div style={{ padding: '64px 24px', textAlign: 'center' }}>
          <div style={{
            ...TYPE.displayCard,
            fontSize: 20, color: '#F5F7FF', marginBottom: 10,
          }}>{activeSeries.title}</div>
          <div style={{
            ...TYPE.bodySmall,
            fontSize: 14, color: 'rgba(255,255,255,0.38)', maxWidth: 250, margin: '0 auto',
          }}>This series is being built — episodes will appear here when ready.</div>
        </div>
      ) : (
      <div style={{ padding: '20px 24px 0' }}>
        {/* Owner-only entry to the Component Review Lab (personal inspection
            tool). Deliberately NOT a MODULES entry — it opens the lab full-page
            via the ?componentReview flag rather than routing through
            ModulePlayer, so it needs no content loader and touches no learner
            data. History-only. */}
        {isHistory && (
          <button
            onClick={() => window.location.assign(window.location.pathname + '?componentReview=true')}
            style={{
              width: '100%', textAlign: 'left', cursor: 'pointer', marginBottom: 18,
              background: 'rgba(255,255,255,0.02)', color: '#F5F7FF',
              border: `1px dashed rgba(${accentRgb},0.5)`, borderRadius: RADII.medium,
              padding: '16px 18px',
            }}
          >
            <div style={{ ...TYPE.eyebrow, fontSize: 10, textTransform: 'uppercase', color: accent, marginBottom: 6 }}>
              Dev · test tool
            </div>
            <div style={{ ...TYPE.displayCard, fontSize: 18, color: '#F5F7FF', marginBottom: 4 }}>
              Component review lab
            </div>
            <div style={{ ...TYPE.bodySmall, fontSize: 13, color: 'rgba(255,255,255,0.52)' }}>
              Inspect unused, orphaned and one-off components. Opens outside the learner flow.
            </div>
          </button>
        )}
        {items.map((item, i) => {
          const isCompleted = item.status === 'completed'
          const isCurrent   = item.status !== 'coming_soon' && i === nextUpIndex
          const isFuture    = !isCompleted && !isCurrent
          const isLast      = i === items.length - 1
          const next        = items[i + 1]
          // Completed and future read as smaller, quieter cards; current dominates as the hero
          const cardH       = isCurrent ? 206 : isCompleted ? 76 : 80
          const nodeSize    = isCurrent ? 56 : isCompleted ? 42 : 40
          const OVERLAP     = 14
          const segAboveAccent = i > 0 && !isFuture && (items[i - 1].status === 'completed' || items[i - 1].status === 'in_progress')
          const segBelowAccent = !isLast && isCompleted
          const rowGap = !next ? 0 : isCurrent ? 12 : 8
          const desc  = item.subtitle || item.era || ''
          const thumb = thumbFor(item)
          const dotsTotal  = 5
          const dotsFilled = Math.min(dotsTotal, Math.round((item.pct / 100) * dotsTotal))

          return (
            <div key={item.id} style={{ display: 'flex', alignItems: 'stretch', gap: 12, paddingBottom: rowGap, position: 'relative' }}>

              {/* Timeline column — nodes overlap the card's left edge so the journey reads as attached */}
              <div style={{ width: 64, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                <div style={{
                  width: 2, flexShrink: 0,
                  height: Math.max(0, (cardH - nodeSize) / 2),
                  background: i === 0 ? 'transparent' : segAboveAccent ? accent : `rgba(${accentRgb},0.18)`,
                }} />

                {isCompleted && (
                  <div style={{
                    width: 42, height: 42, borderRadius: RADII.pill, flexShrink: 0,
                    background: accent,
                    boxShadow: `0 0 14px rgba(${accentRgb},0.4), 0 0 5px rgba(${accentRgb},0.5)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                      <path d="M4 9.2L7.2 12.4L14 5.5" stroke={GENERAL.neutral[900]} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                {isCurrent && (
                  <div style={{
                    width: 56, height: 56, borderRadius: RADII.pill, flexShrink: 0,
                    background: GENERAL.neutral[900], border: `2px solid ${accent}`,
                    boxShadow: `0 0 20px rgba(${accentRgb},0.35)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'sbCurrentGlow 2.8s ease-in-out infinite',
                  }}>
                    <span style={{ ...TYPE.displaySection, fontSize: 24, color: GENERAL.softWhite }}>{item.number}</span>
                  </div>
                )}
                {isFuture && (
                  <div style={{
                    width: 40, height: 40, borderRadius: RADII.pill, flexShrink: 0,
                    background: `rgba(${accentRgb},0.08)`, border: `1px solid rgba(${accentRgb},0.25)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ ...TYPE.titleLarge, fontSize: 16, color: `rgba(${accentRgb},0.55)` }}>{item.number}</span>
                  </div>
                )}

                {!isLast ? (
                  <div style={{ width: 2, flex: 1, background: segBelowAccent ? accent : `rgba(${accentRgb},0.18)` }} />
                ) : <div style={{ flex: 1 }} />}
              </div>

              {isCurrent ? (
                /* ── CURRENT — the hero. Full-width image up top fading to dark, compact title+button row below ── */
                <button onClick={() => handleCardClick(item)} style={{
                  flex: 1, minWidth: 0, height: cardH, marginLeft: -OVERLAP, borderRadius: 24, overflow: 'hidden', boxSizing: 'border-box',
                  background: GENERAL.neutral[900],
                  border: `1.5px solid ${accent}`,
                  animation: 'sbCurrentGlow 2.8s ease-in-out infinite',
                  cursor: 'pointer', textAlign: 'left', display: 'flex', flexDirection: 'column', padding: 0,
                }}>
                  {/* Thumbnail banner — spans the full card width, fades into the dark background below */}
                  <div style={{ position: 'relative', height: 112, width: '100%', flexShrink: 0 }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      backgroundImage: `url(${thumb})`, backgroundSize: 'cover', backgroundPosition: 'center',
                    }} />
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to bottom, transparent 18%, ${GENERAL.neutral[900]} 78%)` }} />

                    {/* Progress ring — overlaid on the image; arc length matches % complete, image darkened behind it for contrast */}
                    <div style={{ position: 'absolute', left: 12, bottom: 12, width: CARD_RING_SIZE, height: CARD_RING_SIZE }}>
                      <div style={{ position: 'absolute', inset: -4, borderRadius: RADII.pill, background: 'rgba(5,5,5,0.6)' }} />
                      <svg width={CARD_RING_SIZE} height={CARD_RING_SIZE} viewBox={`0 0 ${CARD_RING_SIZE} ${CARD_RING_SIZE}`}
                        style={{ position: 'relative', transform: 'rotate(-90deg)', display: 'block' }}>
                        <circle cx={CARD_RING_SIZE / 2} cy={CARD_RING_SIZE / 2} r={CARD_RING_R} fill="none" stroke="rgba(255,255,255,0.26)" strokeWidth={3.5} />
                        <circle cx={CARD_RING_SIZE / 2} cy={CARD_RING_SIZE / 2} r={CARD_RING_R} fill="none" stroke={accent} strokeWidth={3.5}
                          strokeDasharray={CARD_RING_CIRCUM} strokeDashoffset={CARD_RING_CIRCUM * (1 - item.pct / 100)} strokeLinecap="round" />
                      </svg>
                      <span style={{
                        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        ...TYPE.eyebrow, fontSize: 11, color: '#FFFFFF',
                      }}>{item.pct}%</span>
                    </div>
                  </div>

                  {/* Title + subtitle on the left, compact "Continue" beside it on the right */}
                  <div style={{ flex: 1, minHeight: 0, padding: '10px 16px 12px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        ...TYPE.titleLarge, fontSize: 16, color: '#FFFFFF',
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>
                        {item.title}
                      </div>
                      {desc ? (
                        <div style={{
                          ...TYPE.eyebrow, fontSize: 11, color: accent, marginTop: 1,
                          overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                        }}>
                          {stripEra(desc)}
                        </div>
                      ) : null}
                      <div style={{ display: 'flex', gap: 6, marginTop: 5 }}>
                        {Array.from({ length: dotsTotal }).map((_, di) => (
                          <span key={di} style={{
                            width: 7, height: 7, borderRadius: RADII.pill,
                            background: di < dotsFilled ? accent : 'transparent',
                            border: di < dotsFilled ? 'none' : '1px solid rgba(255,255,255,0.24)',
                          }} />
                        ))}
                      </div>
                    </div>
                    <div
                      onClick={(e) => { e.stopPropagation(); handleCardClick(item) }}
                      style={{
                        height: 40, borderRadius: 12, padding: '0 18px', flexShrink: 0,
                        background: `linear-gradient(180deg, ${sand}, ${bronze})`,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap',
                        ...TYPE.button, fontSize: 14, color: '#111',
                      }}
                    >{item.pct > 0 ? 'Continue' : 'Start'}</div>
                  </div>
                </button>
              ) : isCompleted ? (
                /* ── COMPLETED — small, closed card. Quiet, finished, still revisitable ── */
                <button onClick={() => handleCardClick(item)} style={{
                  flex: 1, minWidth: 0, height: cardH, marginLeft: -OVERLAP, borderRadius: 16, boxSizing: 'border-box',
                  padding: '10px 14px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)',
                  opacity: 0.7, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center',
                }}>
                  <div style={{
                    flexShrink: 0, width: 48, height: 48, borderRadius: 11, overflow: 'hidden',
                    backgroundImage: `url(${thumb})`, backgroundSize: 'cover', backgroundPosition: 'center',
                    filter: 'grayscale(0.5)', opacity: 0.78,
                  }} />
                  <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                    <div style={{
                      ...TYPE.label, fontSize: 14, color: 'rgba(255,255,255,0.5)',
                      overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                    }}>{item.title}</div>
                    {desc ? (
                      <div style={{
                        ...TYPE.bodySmall, fontSize: 11.5, color: 'rgba(255,255,255,0.3)', marginTop: 2,
                        overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                      }}>{stripEra(desc)}</div>
                    ) : null}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0, marginLeft: 8 }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: RADII.pill, flexShrink: 0,
                      background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width={11} height={11} viewBox="0 0 18 18" fill="none">
                        <path d="M4 9.2L7.2 12.4L14 5.5" stroke={GENERAL.neutral[900]} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </button>
              ) : (
                /* ── FUTURE — smaller, dimmer card. Later, not locked, just not yet ── */
                <button onClick={() => handleCardClick(item)} style={{
                  flex: 1, minWidth: 0, height: cardH, marginLeft: -OVERLAP, borderRadius: 18, boxSizing: 'border-box',
                  padding: '10px 12px', background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.05)',
                  opacity: 0.55, cursor: item.status === 'coming_soon' ? 'default' : 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center',
                }}>
                  <div style={{
                    flexShrink: 0, width: 52, height: 52, borderRadius: 12, overflow: 'hidden',
                    backgroundImage: `url(${thumb})`, backgroundSize: 'cover', backgroundPosition: 'center',
                    filter: 'grayscale(0.5)', opacity: 0.7,
                  }} />
                  <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                    <div style={{
                      ...TYPE.displayCard, fontSize: 15, color: 'rgba(255,255,255,0.56)',
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
                    }}>
                      {item.title}
                    </div>
                    {desc ? (
                      <div style={{
                        ...TYPE.bodySmall, fontSize: 12, color: 'rgba(255,255,255,0.32)', marginTop: 3,
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
                      }}>
                        {desc}
                      </div>
                    ) : null}
                  </div>
                  {item.status === 'coming_soon' ? (
                    <span style={{
                      flexShrink: 0, marginLeft: 8,
                      ...TYPE.eyebrow, fontSize: 11,
                      color: `rgba(${accentRgb},0.45)`,
                    }}>Coming soon</span>
                  ) : (
                    <div style={{ display: 'flex', gap: 5, flexShrink: 0, marginLeft: 8 }}>
                      {Array.from({ length: dotsTotal }).map((_, di) => (
                        <span key={di} style={{ width: 6, height: 6, borderRadius: RADII.pill, border: '1px solid rgba(255,255,255,0.16)' }} />
                      ))}
                    </div>
                  )}
                </button>
              )}
            </div>
          )
        })}
      </div>
      )}

      <BottomNav tab="subjects" setTab={() => onBack()} />
    </div>
  )
}

// "Your subjects" row on the Subjects tab — each subject picks one cinematic
// topic image at random from its own content, rather than a fixed logo.
const SUBJECT_NAMES = ['History', 'Biology', 'Chemistry', 'Physics', 'Maths', 'English', 'Sociology']

const SUBJECT_TOPIC_IMAGES = {
  History:   ['/headers/history-medicine-through-time.webp', '/headers/history-elizabethan.webp', '/headers/history-spain-new-world.webp', '/headers/history-usa-conflict.webp'],
  Biology:   ['/headers/bio-humanmachine.webp', '/headers/bio-diseasewars.webp', '/headers/bio-energyforlife.webp', '/headers/bio-controlsystems.webp', '/headers/bio-genetics.webp', '/headers/bio-ecosystems.webp'],
  Chemistry: ['/headers/chem-matteratoms.webp', '/headers/chem-reactions.webp', '/headers/chem-rates.webp', '/headers/chem-earth.webp'],
  Physics:   ['/headers/physics-energy.webp', '/headers/physics-forces.webp', '/headers/physics-matter.webp', '/headers/physics-space.webp', '/headers/physics-waves.webp'],
  Maths:     ['/headers/maths-numbers.webp', '/headers/maths-algebra.webp', '/headers/maths-geometry.webp', '/headers/maths-data.webp', '/headers/maths-realworld.webp'],
  English:   ['/headers/english-inspector.webp', '/headers/english-macbeth.webp', '/headers/english-poetry.webp', '/headers/english-reading.webp'],
  Sociology: ['/headers/sociology-family.webp', '/headers/sociology-education.webp', '/headers/sociology-crime.webp', '/headers/sociology-stratification.webp'],
}

export default function ModulesTab({ onOpenModule }) {
  const [subjectBrowser, setSubjectBrowser] = useState(null)
  const [subjectImages] = useState(() => {
    const map = {}
    SUBJECT_NAMES.forEach(name => {
      const pool = SUBJECT_TOPIC_IMAGES[name]
      map[name] = pool[Math.floor(Math.random() * pool.length)]
    })
    return map
  })

  if (subjectBrowser) {
    return <SubjectBrowser subjectName={subjectBrowser} onBack={() => setSubjectBrowser(null)} onOpenModule={onOpenModule} />
  }

  const continueModule = getContinueModule()
  const continuePct = modPct(continueModule)
  const continueHeaderImage = continueModule.headerImage || MODULE_HEADER_IMAGES[continueModule.id] || '/headers/history-medicine-through-time.webp'

  const biggestWinRaw = getBiggestWin()
  const biggestWinModule = biggestWinRaw ? MODULES.find(m => m.id === biggestWinRaw.moduleId) : null
  const biggestWin = biggestWinModule ? {
    ...biggestWinRaw,
    mod: biggestWinModule,
    headerImage: biggestWinModule.headerImage || MODULE_HEADER_IMAGES[biggestWinModule.id],
    startScreenIndex: findTaggedScreen(biggestWinModule, biggestWinRaw.conceptTag),
  } : null

  const weakestSubject = getWeakestSubject()?.subject || null
  const subjectThumbs = SUBJECT_NAMES.map(name => {
    const mods = MODULES.filter(m => m.subject === name)
    const pct = mods.length ? Math.round(mods.reduce((sum, m) => sum + modPct(m), 0) / mods.length) : 0
    return { name, image: subjectImages[name], pct, isWeakest: name === weakestSubject }
  })

  return (
    <div style={{ background: GENERAL.neutral[0], minHeight: '100vh', paddingBottom: 108, overflowX: 'hidden' }}>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', width: '100%', height: '34vh', minHeight: 260, maxHeight: 340, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${continueHeaderImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'saturate(0.9)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, rgba(13,15,16,0.5) 0%, rgba(13,15,16,0.1) 28%, rgba(13,15,16,0.25) 58%, ${GENERAL.neutral[0]} 100%)`,
        }} />

        {/* Streak badge */}
        <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 14px)', right: SPACING.compact, zIndex: 2 }}>
          <StreakChip />
        </div>

        {/* Headline */}
        <div style={{ position: 'absolute', left: SPACING.compact, right: SPACING.compact, bottom: SPACING.standard, zIndex: 2 }}>
          <div style={{ ...TYPE.displayHero, fontSize: 46, color: GENERAL.softWhite }}>
            Keep going<span style={{ color: GENERAL.teal }}>.</span>
          </div>
          <div style={{ ...TYPE.body, color: 'rgba(241,250,238,0.7)', marginTop: SPACING.micro }}>
            {continueModule.title}
          </div>
        </div>
      </div>

      {/* ── Continue row ── */}
      <button
        onClick={() => onOpenModule && onOpenModule(continueModule)}
        style={{
          display: 'flex', alignItems: 'center', gap: SPACING.compact, width: '100%',
          padding: `${SPACING.standard}px ${SPACING.compact}px 0`,
          background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: RADII.pill, flexShrink: 0,
          background: GENERAL.neutral[2], border: `1px solid rgba(${GENERAL.tealRgb},0.35)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
            <path d="M2 1.5L13 8L2 14.5V1.5Z" fill={GENERAL.teal} />
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            ...TYPE.eyebrow,
            textTransform: 'uppercase', color: GENERAL.slate,
            marginBottom: SPACING.micro,
          }}>Continue</div>
          <div style={{ height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: RADII.pill, overflow: 'hidden' }}>
            <div style={{ width: `${continuePct}%`, height: '100%', background: GENERAL.teal, borderRadius: RADII.pill }} />
          </div>
        </div>

        <div style={{ ...TYPE.label, fontSize: 13, color: GENERAL.slate, flexShrink: 0 }}>
          {continuePct}%
        </div>
      </button>

      {/* ── Biggest win ── */}
      {biggestWin && (
        <div style={{ padding: `${SPACING.separation}px ${SPACING.compact}px 0` }}>
          <div style={{ ...TYPE.metadata, color: GENERAL.slate, textTransform: 'uppercase', marginBottom: SPACING.compact }}>
            Biggest win
          </div>
          <button
            onClick={() => onOpenModule && onOpenModule(biggestWin.mod, biggestWin.startScreenIndex)}
            style={{
              display: 'flex', alignItems: 'center', gap: SPACING.compact, width: '100%',
              padding: SPACING.compact, borderRadius: RADII.large,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              cursor: 'pointer', textAlign: 'left',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.micro, marginBottom: SPACING.micro }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M13 2L4.5 13H11L10 22L19.5 10H13L13 2Z" fill={GENERAL.teal} />
                </svg>
                <span style={{ ...TYPE.displayCard, fontSize: 17, color: GENERAL.softWhite }}>{biggestWin.label}</span>
              </div>
              <div style={{ ...TYPE.bodySmall, color: GENERAL.slate, marginBottom: SPACING.micro }}>
                {biggestWin.reasonText}
              </div>
              <div style={{ ...TYPE.label, fontSize: 13, color: GENERAL.teal }}>
                Revisit →
              </div>
            </div>
            <div style={{
              width: 76, height: 76, borderRadius: RADII.medium, flexShrink: 0, overflow: 'hidden',
              backgroundImage: `url(${biggestWin.headerImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
            }} />
          </button>
        </div>
      )}

      {!biggestWin && (
        <div style={{ padding: `${SPACING.separation}px ${SPACING.compact}px 0` }}>
          <div style={{ ...TYPE.metadata, color: GENERAL.slate, textTransform: 'uppercase', marginBottom: SPACING.compact }}>
            Biggest win
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: SPACING.compact, width: '100%',
            padding: SPACING.compact, borderRadius: RADII.large,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M13 2L4.5 13H11L10 22L19.5 10H13L13 2Z" fill={GENERAL.teal} />
            </svg>
            <div style={{ ...TYPE.bodySmall, color: GENERAL.slate }}>
              Answer a few questions and we'll show you exactly where to focus next.
            </div>
          </div>
        </div>
      )}

      {/* ── Your subjects ── */}
      <div style={{ padding: `${SPACING.separation}px 0 0` }}>
        <div style={{ ...TYPE.metadata, color: GENERAL.slate, textTransform: 'uppercase', marginBottom: SPACING.compact, padding: `0 ${SPACING.compact}px` }}>
          Your subjects
        </div>
        <div style={{
          display: 'flex', gap: SPACING.compact, overflowX: 'auto',
          padding: `0 ${SPACING.compact}px`, paddingBottom: SPACING.micro,
          scrollbarWidth: 'none', msOverflowStyle: 'none',
        }}>
          {subjectThumbs.map(s => (
            <button
              key={s.name}
              onClick={() => setSubjectBrowser(s.name)}
              style={{ flexShrink: 0, width: 104, background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{
                width: 104, height: 140, borderRadius: RADII.medium, overflow: 'hidden',
                backgroundImage: `url(${s.image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                marginBottom: SPACING.micro,
              }} />
              <div style={{ ...TYPE.label, fontSize: 13, color: GENERAL.softWhite, marginBottom: 4 }}>
                {s.name}
              </div>
              <div style={{ height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: RADII.pill, overflow: 'hidden', marginBottom: 4 }}>
                <div style={{ width: `${s.pct}%`, height: '100%', background: s.isWeakest ? GENERAL.coral : GENERAL.teal, borderRadius: RADII.pill }} />
              </div>
              <div style={{ ...TYPE.metadata, color: GENERAL.slate }}>
                {s.pct}%
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
