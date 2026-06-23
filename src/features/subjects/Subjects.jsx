import { useState, useEffect } from 'react'
import { GENERAL } from '../../constants/generalTheme.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import { MODULES } from '../../modules.js'
import { getModuleState as safeGetModuleState, getModulePct as modPct, getContinueModule } from '../../progress.js'
import { getWeakestSubject, getBiggestWin } from '../../unifiedWeaknessTracker.js'
import { findTaggedScreen } from '../../data/tagModuleMap.js'
import { StreakChip } from '../home/StreakChip.jsx'
import BackButton from '../../components/core/BackButton.jsx'
import BottomNav from '../../app/BottomNav.jsx'
import { hexToRgb } from '../../constants/subjects.js'

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

const SUBJECT_PALETTES = {
  History:   { sand: '#C89B6D', bronze: '#9A7B4F', cream: '#E8D9B5', espresso: '#2B1A0E', ink: '#14110E' },
  Sociology: { sand: '#C9B07C', bronze: '#9A7B4F', cream: '#E8D9B5', espresso: '#2B2118', ink: '#14110E' },
  Biology:   { sand: '#4CAF7D', bronze: '#2E8B57', cream: '#B8F0D4', espresso: '#0A2E1A', ink: '#061408' },
  Chemistry: { sand: '#9B59E8', bronze: '#7B3BD0', cream: '#DDD0F8', espresso: '#1A0E2B', ink: '#0D0816' },
  Physics:   { sand: '#3B82F6', bronze: '#2563EB', cream: '#DBEAFE', espresso: '#0E1B2B', ink: '#060D18' },
  English:   { sand: '#B66DFF', bronze: '#9B5CFF', cream: '#E8D5FF', espresso: '#1A0B2E', ink: '#0E0618' },
  Maths:     { sand: '#2DD4BF', bronze: '#0D9488', cream: '#CCFBF1', espresso: '#0A2A27', ink: '#041612' },
}

function ModulePage({ module: mod, onBack, onOpenTopic }) {
  const saved   = safeGetModuleState(mod.id)
  const screenIdx = saved.screen || 0
  const hasStarted = (saved.hookDone && saved.wylDone) || screenIdx > 0

  const topics = (mod.screens || []).map((screen, i) => ({
    number: i + 1,
    title: screen.label || screen.heading || `Topic ${i + 1}`,
    hook: screen.sub || screen.kicker || screen.heading || '',
    status: !hasStarted ? 'not_started'
      : i < screenIdx ? 'completed'
      : i === screenIdx ? 'in_progress'
      : 'not_started',
  }))

  const palette   = SUBJECT_PALETTES[mod.subject] || SUBJECT_PALETTES.History
  const { sand, bronze, cream, espresso, ink } = palette
  const completed = topics.filter(t => t.status === 'completed').length
  const total     = topics.length
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0

  const [ringPct, setRingPct] = useState(0)
  useEffect(() => { const t = setTimeout(() => setRingPct(pct), 80); return () => clearTimeout(t) }, [pct])

  const R       = 32.5
  const CIRCUM  = 2 * Math.PI * R
  const dashOff = CIRCUM * (1 - ringPct / 100)

  const heroImg = mod.headerImage || MODULE_HEADER_IMAGES[mod.id] || '/headers/history-medicine-through-time.webp'
  const sandRgb = hexToRgb(sand)

  return (
    <div style={{ minHeight: '100vh', background: '#08090D', paddingBottom: 120, overflowX: 'hidden', position: 'relative' }}>
      <style>{`
        @keyframes mpNodePulse {
          0%,100% { box-shadow: 0 0 18px rgba(${sandRgb},0.32), 0 0 8px rgba(${sandRgb},0.18); }
          50%      { box-shadow: 0 0 30px rgba(${sandRgb},0.55), 0 0 14px rgba(${sandRgb},0.28); }
        }
        @media (max-width: 374px) {
          .mp-title { font-size: 38px !important; }
          .mp-topic-title { font-size: 19px !important; }
          .mp-cta { min-width: 112px !important; }
          .mp-ring { width: 64px !important; height: 64px !important; }
          .mp-page { padding-left: 20px !important; padding-right: 20px !important; }
          .mp-rail { width: 52px !important; }
        }
      `}</style>

      {/* ── CINEMATIC HEADER (285px) ── */}
      <div style={{ height: 285, position: 'relative', overflow: 'hidden' }}>
        {/* Artwork — right side */}
        <div style={{
          position: 'absolute', right: 0, top: 0, width: '58%', height: 250,
          backgroundImage: `url(${heroImg})`, backgroundSize: 'cover', backgroundPosition: 'center top',
          opacity: 0.78,
        }} />
        {/* Horizontal fade over artwork */}
        <div style={{
          position: 'absolute', right: 0, top: 0, width: '58%', height: 250,
          background: 'linear-gradient(to left, rgba(8,9,13,0) 0%, rgba(8,9,13,0.85) 70%, rgba(8,9,13,1) 100%)',
        }} />
        {/* Full-width left overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, #08090D 0%, rgba(8,9,13,0.92) 38%, rgba(8,9,13,0.35) 100%)',
        }} />
        {/* Bottom fade into page background */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 110,
          background: 'linear-gradient(180deg, transparent 0%, #08090D 92%)',
        }} />

        {/* Back button */}
        <BackButton onClick={onBack} style={{ position: 'absolute', top: 20, left: 24, zIndex: 10 }} />

        {/* Menu button */}
        <button
          style={{
            position: 'absolute', top: 20, right: 24, zIndex: 10,
            width: 44, height: 44, borderRadius: 999,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.82)', fontSize: 22, letterSpacing: 1,
          }}
        >···</button>

        {/* Text block — bottom-left */}
        <div style={{ position: 'absolute', bottom: 22, left: 24, right: '44%', zIndex: 5 }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 13, lineHeight: '18px',
            letterSpacing: '0.14em', color: sand, textTransform: 'uppercase', marginBottom: 10,
          }}>{mod.subject || ''}</div>
          <div className="mp-title" style={{
            fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 42, lineHeight: '44px',
            letterSpacing: '-0.02em', color: '#F5F7FF', maxWidth: 260,
          }}>{mod.title}</div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="mp-page" style={{ padding: '0 24px' }}>

        {/* ── PROGRESS CARD ── */}
        <div style={{
          width: '100%', borderRadius: 28, padding: '22px 24px', boxSizing: 'border-box',
          background: 'rgba(255,255,255,0.055)',
          border: `1px solid ${sand}2E`,
          backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
          boxShadow: '0 18px 50px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
          marginTop: -12, marginBottom: 28,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          {/* Left */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 15, lineHeight: '20px',
              color: 'rgba(255,255,255,0.66)',
            }}>Your progress</div>
            <div style={{
              fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 28, lineHeight: '32px',
              color: '#F5F7FF', marginTop: 6,
            }}>{completed} of {total} completed</div>
            <div style={{ marginTop: 14, height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 999,
                width: `${pct}%`,
                background: `linear-gradient(90deg, ${bronze}, ${sand})`,
                transition: 'width 700ms ease-out',
              }} />
            </div>
          </div>

          {/* Ring */}
          <div className="mp-ring" style={{ flexShrink: 0, width: 72, height: 72, position: 'relative' }}>
            <svg width={72} height={72} viewBox="0 0 72 72" style={{ transform: 'rotate(-90deg)', display: 'block' }}>
              <circle cx={36} cy={36} r={R} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth={7} />
              <circle cx={36} cy={36} r={R} fill="none" stroke={sand} strokeWidth={7}
                strokeDasharray={CIRCUM} strokeDashoffset={dashOff}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 700ms ease-out', filter: `drop-shadow(0 0 5px ${sand}88)` }}
              />
            </svg>
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 20, color: cream, lineHeight: 1,
              }}>{pct}%</span>
            </div>
          </div>
        </div>

        {/* ── TOPIC SECTION LABEL ── */}
        <div style={{
          fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 13, lineHeight: '18px',
          letterSpacing: '0.14em', color: 'rgba(255,255,255,0.45)',
          textTransform: 'uppercase', marginBottom: 18,
        }}>Your Topics</div>

        {/* ── TOPIC RAIL + CARDS ── */}
        <div>
          {topics.map((topic, i) => {
            const isCompleted = topic.status === 'completed'
            const isCurrent   = topic.status === 'in_progress'
            const isUpcoming  = topic.status === 'not_started'
            const isLast      = i === topics.length - 1

            const cardH    = isCurrent ? null : 102  // current card is auto-height
            const nodeSize = isCurrent ? 50 : isCompleted ? 44 : 42

            // Line segment colour: gold if the topic ABOVE this one is completed
            const lineAboveGold = i > 0 && topics[i - 1].status === 'completed'
            // Line below: gold if this topic is completed (flows into next node)
            const lineBelowGold = !isLast && isCompleted

            return (
              <div key={topic.number} style={{
                display: 'flex', gap: 14, alignItems: 'stretch',
                paddingBottom: isLast ? 0 : 14,
              }}>
                {/* Rail column */}
                <div className="mp-rail" style={{
                  width: 58, flexShrink: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                }}>
                  {/* Line above node */}
                  <div style={{
                    width: 2, flexShrink: 0,
                    height: Math.max(0, ((isCurrent ? 108 : cardH) - nodeSize) / 2),
                    background: i === 0 ? 'transparent'
                      : lineAboveGold ? `linear-gradient(180deg, ${sand}, ${sand})`
                      : 'rgba(255,255,255,0.14)',
                  }} />

                  {/* NODE */}
                  {isCompleted && (
                    <div style={{
                      width: 44, height: 44, borderRadius: 999, flexShrink: 0,
                      background: `linear-gradient(135deg, ${bronze}, ${sand})`,
                      border: `1px solid ${cream}72`,
                      boxShadow: `0 0 20px rgba(${sandRgb},0.28), inset 0 1px 0 rgba(255,255,255,0.20)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
                        <path d="M5 11.5L9 15.5L17 7" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                  {isCurrent && (
                    <div style={{
                      width: 50, height: 50, borderRadius: 999, flexShrink: 0,
                      background: `rgba(${hexToRgb(espresso)},0.88)`,
                      border: `2px solid ${sand}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      animation: 'mpNodePulse 2.8s ease-in-out infinite',
                    }}>
                      <span style={{
                        fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 20, color: cream, lineHeight: 1,
                      }}>{topic.number}</span>
                    </div>
                  )}
                  {isUpcoming && (
                    <div style={{
                      width: 42, height: 42, borderRadius: 999, flexShrink: 0,
                      background: 'rgba(255,255,255,0.035)',
                      border: '1.5px solid rgba(255,255,255,0.18)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{
                        fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 17,
                        color: 'rgba(255,255,255,0.45)', lineHeight: 1,
                      }}>{topic.number}</span>
                    </div>
                  )}

                  {/* Line below node — extends through paddingBottom gap too */}
                  {!isLast ? (
                    <div style={{
                      width: 2, flex: 1,
                      background: lineBelowGold
                        ? `linear-gradient(180deg, ${sand}, ${bronze})`
                        : 'rgba(255,255,255,0.14)',
                    }} />
                  ) : (
                    <div style={{ flex: 1 }} />
                  )}
                </div>

                {/* TOPIC CARD */}
                <button
                  onClick={() => onOpenTopic(topic, i)}
                  style={{
                    flex: 1,
                    ...(isCurrent ? { minHeight: 108 } : { height: cardH }),
                    alignSelf: 'flex-start',
                    borderRadius: 22,
                    padding: isCurrent ? '16px 18px 16px 20px' : '18px 18px 18px 20px',
                    cursor: 'pointer', textAlign: 'left', boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: isCurrent ? 'column' : 'row',
                    alignItems: isCurrent ? 'flex-start' : 'center',
                    justifyContent: 'space-between', gap: isCurrent ? 10 : 12,
                    border: isCurrent
                      ? `1.5px solid ${sand}BF`
                      : isCompleted
                        ? `1px solid rgba(${sandRgb},0.10)`
                        : '1px solid rgba(255,255,255,0.07)',
                    background: isCurrent
                      ? `linear-gradient(90deg, rgba(${hexToRgb(espresso)},0.42) 0%, rgba(255,255,255,0.055) 100%)`
                      : isCompleted
                        ? 'rgba(255,255,255,0.045)'
                        : 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                    boxShadow: isCurrent ? `0 0 28px rgba(${sandRgb},0.22), inset 0 1px 0 rgba(255,255,255,0.08)` : 'none',
                    opacity: isUpcoming ? 0.78 : isCompleted ? 0.86 : 1,
                  }}
                >
                  {/* Text */}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="mp-topic-title" style={{
                      fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 21, lineHeight: '25px',
                      color: '#F5F7FF', letterSpacing: '-0.01em',
                      ...(isCurrent
                        ? { wordBreak: 'break-word' }
                        : { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }),
                    }}>{topic.title}</div>
                    {topic.hook && (
                      <div style={{
                        fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 15.5, lineHeight: '21px',
                        color: 'rgba(255,255,255,0.68)', marginTop: 5,
                        overflow: 'hidden', display: '-webkit-box',
                        WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>{topic.hook}</div>
                    )}
                  </div>

                  {/* Right badge / CTA */}
                  {isCompleted && (
                    <div style={{
                      flexShrink: 0, height: 32, padding: '0 12px', borderRadius: 999,
                      background: 'rgba(46,125,72,0.22)',
                      border: '1px solid rgba(83,220,134,0.35)',
                      display: 'flex', alignItems: 'center', gap: 6,
                    }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: 999,
                        background: 'rgba(83,220,134,0.3)', border: '1.5px solid #53DC86',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <svg width={9} height={9} viewBox="0 0 9 9" fill="none">
                          <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#9FE8B6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 13.5, color: '#9FE8B6', whiteSpace: 'nowrap' }}>Completed</span>
                    </div>
                  )}
                  {isCurrent && (
                    <button
                      onClick={e => { e.stopPropagation(); onOpenTopic(topic, i) }}
                      className="mp-cta"
                      style={{
                        alignSelf: 'flex-start',
                        height: 44, padding: '0 20px',
                        borderRadius: 14,
                        background: `linear-gradient(135deg, ${bronze}, ${sand})`,
                        border: 'none', cursor: 'pointer',
                        fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15,
                        color: ink, whiteSpace: 'nowrap',
                        boxShadow: `0 0 24px rgba(${sandRgb},0.30), inset 0 1px 0 rgba(255,255,255,0.22)`,
                        transition: 'transform 120ms ease',
                      }}
                    >Continue →</button>
                  )}
                  {isUpcoming && (
                    <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{
                        height: 32, padding: '0 12px', borderRadius: 999,
                        background: 'rgba(255,255,255,0.075)',
                        display: 'flex', alignItems: 'center',
                        fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 13.5,
                        color: 'rgba(255,255,255,0.62)', whiteSpace: 'nowrap',
                      }}>Not started</div>
                      <span style={{ color: 'rgba(255,255,255,0.42)', fontSize: 20, marginLeft: 8 }}>›</span>
                    </div>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom nav — Subjects always selected */}
      <BottomNav tab="subjects" setTab={() => onBack()} />
    </div>
  )
}

// ─── Modules tab ──────────────────────────────────────────────────────────────

function ModuleCard({ title, subtitle, progress, accentColour, bgGradient, headerImage, icon, isSelected, onClick }) {
  const w = isSelected ? 174 : 154
  const h = isSelected ? 235 : 215
  return (
    <button
      onClick={onClick}
      style={{
        width: w, height: h, flexShrink: 0, position: 'relative',
        borderRadius: 18, overflow: 'hidden',
        cursor: 'pointer',
        border: isSelected ? `1.5px solid ${accentColour}` : '1px solid rgba(255,255,255,0.12)',
        background: bgGradient || '#0D0E10',
        padding: 0, textAlign: 'left',
        boxShadow: isSelected
          ? `0 0 30px ${accentColour}36, 0 12px 32px rgba(0,0,0,0.68), inset 0 1px 0 rgba(255,255,255,0.06)`
          : '0 4px 18px rgba(0,0,0,0.54), inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      {/* cinematic header image */}
      {headerImage && (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${headerImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          filter: 'saturate(0.88) contrast(0.92)',
        }} />
      )}
      {/* bottom dark overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: headerImage
          ? 'linear-gradient(180deg, rgba(5,7,11,0.15) 0%, rgba(5,7,11,0.52) 45%, rgba(5,7,11,0.96) 100%)'
          : 'linear-gradient(180deg, rgba(5,7,11,0.04) 0%, rgba(5,7,11,0.44) 38%, rgba(5,7,11,0.90) 100%)',
      }} />
      {/* bottom text */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 12px 12px', zIndex: 2 }}>
        <div style={{
          fontWeight: 700, fontSize: 18, color: '#F5F7FF',
          lineHeight: '22px', marginBottom: 8, fontFamily: "'Sora', sans-serif",
          letterSpacing: '-0.01em',
        }}>{title}</div>
        <div style={{ marginBottom: 4 }}>
          <span style={{ fontSize: '.6rem', fontWeight: 800, color: accentColour, fontFamily: "'Outfit', sans-serif" }}>
            {progress}%
          </span>
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.10)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            width: progress + '%', height: '100%',
            background: accentColour, borderRadius: 99,
            boxShadow: `0 0 7px ${accentColour}99`,
          }} />
        </div>
      </div>
    </button>
  )
}

function SubjectSection({ heading, accent, modules, onModuleClick }) {
  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        paddingLeft: 18, paddingRight: 18, marginBottom: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontSize: 13, fontWeight: 600, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#F5F2EA',
            fontFamily: "'Outfit', sans-serif",
          }}>{heading}</span>
          <span style={{ color: accent, fontSize: '.82rem', lineHeight: 1 }}>›</span>
        </div>
        <button style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '.72rem', fontWeight: 600, color: accent, padding: 0,
          fontFamily: "'Outfit', sans-serif",
        }}>View all</button>
      </div>
      <div style={{
        display: 'flex', gap: 10, overflowX: 'auto',
        paddingLeft: 18, paddingRight: 18, paddingBottom: 4,
        scrollbarWidth: 'none', msOverflowStyle: 'none',
        alignItems: 'flex-end',
      }}>
        {modules.map(mod => (
          <ModuleCard
            key={mod.id}
            title={mod.title}
            subtitle={mod.subtitle}
            progress={mod.progress}
            accentColour={mod.accent || accent}
            bgGradient={mod.bg}
            icon={mod.icon}
            locked={mod.locked}
            isSelected={mod.isSelected}
            onClick={() => onModuleClick && onModuleClick(mod)}
          />
        ))}
      </div>
    </div>
  )
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
  History:   'Medicine Through Time',
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
    title: 'Medicine Through Time',
    short: 'Medicine',
    headerImage: '/headers/history-medicine-through-time.webp',
    comingSoon: false,
  },
  {
    id: 'spain-new-world',
    title: 'Spain & the New World',
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
    title: 'USA: Conflict at Home & Abroad',
    short: 'USA',
    headerImage: '/headers/history-usa-conflict.webp',
    comingSoon: false,
  },
]

function getSubjectModuleList(subjectName) {
  const real = MODULES.filter(m => m.subject === subjectName)
  const cs = (arr) => arr.map(x => ({ ...x, comingSoon: true }))
  switch (subjectName) {
    case 'History':
      return real
    case 'English':
      return cs([
        { id: 'cs_macbeth',   title: 'Macbeth',                subtitle: 'Shakespeare · Power & Ambition' },
        { id: 'cs_inspector', title: 'An Inspector Calls',     subtitle: 'J.B. Priestley' },
        { id: 'cs_poetry',    title: 'Power & Conflict Poetry',subtitle: 'AQA Anthology · 15 poems' },
        { id: 'cs_lang1',     title: 'Language Paper 1',       subtitle: 'Reading & Creative Writing' },
        { id: 'cs_lang2',     title: 'Language Paper 2',       subtitle: 'Non-fiction & Argument' },
      ])
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
  const palette      = SUBJECT_PALETTES[subjectName] || SUBJECT_PALETTES.History
  const { sand, bronze, cream, espresso } = palette
  const accent       = sand
  const accentRgb    = hexToRgb(sand)
  const headerImg    = SUBJECT_HEADER_IMGS[subjectName]    || '/headers/history-medicine-through-time.webp'
  const displayTitle = SUBJECT_DISPLAY_TITLES[subjectName] || subjectName
  const displayDesc  = SUBJECT_DESCRIPTIONS[subjectName]   || ''

  const isHistory = subjectName === 'History'
  const [activeSeries, setActiveSeries] = useState(() => isHistory ? HISTORY_SERIES[0] : null)

  const rawMods = getSubjectModuleList(subjectName)
  const allItems = rawMods.map((mod, i) => {
    if (mod.comingSoon) return { ...mod, number: i + 1, status: 'coming_soon', pct: 0 }
    if (!mod.screenCount) return { ...mod, number: i + 1, status: 'coming_soon', pct: 0 }
    const s = safeGetModuleState(mod.id)
    const screen = s.screen || 0
    const hasStarted = (s.hookDone && s.wylDone) || screen > 0
    const total = mod.screenCount || 1
    // `completed` sticks once a module is finished — reviewing it afterwards moves `screen`
    // back down, but it must never read as anything other than 'completed' again.
    const pct = s.completed ? 100 : Math.min(100, Math.round((screen / total) * 100))
    const status = s.completed ? 'completed' : hasStarted ? 'in_progress' : 'not_started'
    return { ...mod, number: mod.number || i + 1, status, pct }
  })

  const items = (isHistory && activeSeries)
    ? allItems.filter(m => (m.series || 'medicine') === activeSeries.id)
    : allItems

  const heroImage = isHistory && activeSeries ? activeSeries.headerImage : headerImg
  const heroTitle = isHistory && activeSeries ? activeSeries.title : displayTitle

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
            <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 17, color: '#F5F7FF', lineHeight: 1 }}>{overallPct}%</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>Complete</span>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 18, left: 24, right: 108, zIndex: 5 }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 11,
            letterSpacing: '0.16em', color: accent, textTransform: 'uppercase', marginBottom: 7,
          }}>{subjectName}</div>
          <div style={{
            fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 24, lineHeight: '28px',
            letterSpacing: '-0.01em', color: '#F5F7FF',
          }}>{heroTitle}</div>
          {isHistory ? (
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 13, lineHeight: 1.35,
              color: 'rgba(255,255,255,0.52)', marginTop: 6,
            }}>{activeSeries?.comingSoon ? 'Coming soon' : `${items.length} episodes · AQA History`}</div>
          ) : displayDesc ? (
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 13, lineHeight: 1.35,
              color: 'rgba(255,255,255,0.52)', marginTop: 6, maxWidth: 240,
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>{displayDesc}</div>
          ) : null}
        </div>
      </div>

      {/* ── SERIES PICKER (History only) ── */}
      {isHistory && (
        <div style={{
          display: 'flex', gap: 10, padding: '20px 24px 8px',
          overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
        }}>
          {HISTORY_SERIES.map(s => {
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
                    fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 11, lineHeight: 1.25,
                    color: '#fff', textAlign: 'left',
                    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                  }}>{s.title}</div>
                  {s.comingSoon ? (
                    <div style={{
                      marginTop: 3, fontFamily: "'Outfit', sans-serif", fontSize: 9,
                      fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
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
      {isHistory && activeSeries?.comingSoon ? (
        <div style={{ padding: '64px 24px', textAlign: 'center' }}>
          <div style={{
            fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 20, color: '#F5F7FF', marginBottom: 10,
          }}>{activeSeries.title}</div>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.38)', maxWidth: 250, margin: '0 auto',
          }}>This series is being built — episodes will appear here when ready.</div>
        </div>
      ) : (
      <div style={{ padding: '20px 24px 0' }}>
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
                      <path d="M4 9.2L7.2 12.4L14 5.5" stroke="#0D0D0D" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                {isCurrent && (
                  <div style={{
                    width: 56, height: 56, borderRadius: RADII.pill, flexShrink: 0,
                    background: '#0D0D0D', border: `2px solid ${accent}`,
                    boxShadow: `0 0 20px rgba(${accentRgb},0.35)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'sbCurrentGlow 2.8s ease-in-out infinite',
                  }}>
                    <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 24, color: cream, lineHeight: 1 }}>{item.number}</span>
                  </div>
                )}
                {isFuture && (
                  <div style={{
                    width: 40, height: 40, borderRadius: RADII.pill, flexShrink: 0,
                    background: `rgba(${accentRgb},0.08)`, border: `1px solid rgba(${accentRgb},0.25)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 16, color: `rgba(${accentRgb},0.55)`, lineHeight: 1 }}>{item.number}</span>
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
                  background: '#0D0D0D',
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
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 18%, #0D0D0D 78%)' }} />

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
                        fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 11, color: '#FFFFFF',
                      }}>{item.pct}%</span>
                    </div>
                  </div>

                  {/* Title + subtitle on the left, compact "Continue" beside it on the right */}
                  <div style={{ flex: 1, minHeight: 0, padding: '10px 16px 12px', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 16, lineHeight: 1.2, color: '#FFFFFF',
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>
                        {item.title}
                      </div>
                      {desc ? (
                        <div style={{
                          fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600, color: accent, marginTop: 1,
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
                        fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 14, color: '#111',
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
                      fontFamily: "'Sora', sans-serif", fontWeight: 600, fontSize: 14, lineHeight: 1.25, color: 'rgba(255,255,255,0.5)',
                      overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
                    }}>{item.title}</div>
                    {desc ? (
                      <div style={{
                        fontFamily: "'Outfit', sans-serif", fontWeight: 500, fontSize: 11.5, lineHeight: 1.2, color: 'rgba(255,255,255,0.3)', marginTop: 2,
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
                        <path d="M4 9.2L7.2 12.4L14 5.5" stroke="#0D0D0D" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
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
                      fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 15, lineHeight: 1.2, color: 'rgba(255,255,255,0.56)',
                      overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
                    }}>
                      {item.title}
                    </div>
                    {desc ? (
                      <div style={{
                        fontFamily: "'Outfit', sans-serif", fontSize: 12, lineHeight: 1.2, color: 'rgba(255,255,255,0.32)', marginTop: 3,
                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical',
                      }}>
                        {desc}
                      </div>
                    ) : null}
                  </div>
                  {item.status === 'coming_soon' ? (
                    <span style={{
                      flexShrink: 0, marginLeft: 8,
                      fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600,
                      color: `rgba(${accentRgb},0.45)`, letterSpacing: '0.04em',
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

function HistoryMedicineBrowser({ onBack, onOpenModule }) {
  const histMods = MODULES.filter(m => m.subject === 'History')
  const palette  = SUBJECT_PALETTES.History
  const { sand, bronze, cream } = palette

  function modPct(mod) {
    if (!mod?.screenCount) return 0
    const s = safeGetModuleState(mod.id)
    if (s.completed) return 100
    const screen = s.screen || 0
    const hasStarted = (s.hookDone && s.wylDone) || screen > 0
    if (!hasStarted) return 0
    return Math.min(100, Math.round((screen / mod.screenCount) * 100))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#08090D', paddingBottom: 120, overflowX: 'hidden' }}>

      {/* Cinematic header */}
      <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/headers/history-medicine-through-time.webp)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.72,
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #08090D 0%, rgba(8,9,13,0.88) 42%, rgba(8,9,13,0.28) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(180deg, transparent 0%, #08090D 100%)' }} />

        {/* Back button */}
        <BackButton onClick={onBack} style={{ position: 'absolute', top: 20, left: 24, zIndex: 10 }} />

        {/* Title block */}
        <div style={{ position: 'absolute', bottom: 20, left: 24, zIndex: 5 }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 12, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: sand, marginBottom: 6,
          }}>HISTORY</div>
          <div style={{
            fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: 28, lineHeight: '32px',
            letterSpacing: '-0.01em', color: '#F5F7FF',
          }}>Medicine Through Time</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.42)', marginTop: 4 }}>
            {histMods.length} modules · AQA History
          </div>
        </div>
      </div>

      {/* Module list */}
      <div style={{ padding: '16px 24px 0' }}>
        {histMods.map((mod, i) => {
          const pct = modPct(mod)
          const isStarted = pct > 0
          return (
            <button
              key={mod.id}
              onClick={() => onOpenModule && onOpenModule(mod)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 16,
                background: 'rgba(255,255,255,0.045)',
                border: `1px solid rgba(255,255,255,${isStarted ? '0.10' : '0.06'})`,
                borderRadius: 20, padding: '16px 18px', marginBottom: 10,
                cursor: 'pointer', textAlign: 'left', boxSizing: 'border-box',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              {/* Module number */}
              <div style={{
                width: 36, height: 36, borderRadius: 12, flexShrink: 0,
                background: isStarted ? `linear-gradient(135deg, ${bronze}, ${sand})` : 'rgba(255,255,255,0.06)',
                border: isStarted ? `1px solid ${sand}60` : '1px solid rgba(255,255,255,0.10)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 14,
                  color: isStarted ? '#14110E' : 'rgba(255,255,255,0.38)',
                }}>{i + 1}</span>
              </div>

              {/* Text + progress */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 16, lineHeight: '20px',
                  color: '#F5F7FF', marginBottom: 3,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>{mod.title}</div>
                {mod.era && (
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.38)', marginBottom: 8 }}>
                    {mod.era}
                  </div>
                )}
                <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    width: pct + '%', height: '100%', borderRadius: 99,
                    background: `linear-gradient(90deg, ${bronze}, ${sand})`,
                    boxShadow: pct > 0 ? `0 0 6px ${sand}66` : 'none',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>

              {/* % + chevron */}
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 13,
                  color: isStarted ? sand : 'rgba(255,255,255,0.22)',
                }}>{pct}%</span>
                <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: 18 }}>›</span>
              </div>
            </button>
          )
        })}
      </div>

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
    startScreenIndex: findTaggedScreen(biggestWinModule, biggestWinRaw.topic),
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
          <div style={{ ...TYPE.cinematic, fontSize: 46, color: GENERAL.softWhite }}>
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
            fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: GENERAL.slate,
            marginBottom: SPACING.micro,
          }}>Continue</div>
          <div style={{ height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: RADII.pill, overflow: 'hidden' }}>
            <div style={{ width: `${continuePct}%`, height: '100%', background: GENERAL.teal, borderRadius: RADII.pill }} />
          </div>
        </div>

        <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, color: GENERAL.slate, flexShrink: 0 }}>
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
                <span style={{ ...TYPE.cardTitle, fontSize: 17, color: GENERAL.softWhite }}>{biggestWin.label}</span>
              </div>
              <div style={{ ...TYPE.bodySmall, color: GENERAL.slate, marginBottom: SPACING.micro }}>
                {biggestWin.reasonText}
              </div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, color: GENERAL.teal }}>
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
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 600, color: GENERAL.softWhite, marginBottom: 4 }}>
                {s.name}
              </div>
              <div style={{ height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: RADII.pill, overflow: 'hidden', marginBottom: 4 }}>
                <div style={{ width: `${s.pct}%`, height: '100%', background: s.isWeakest ? GENERAL.coral : GENERAL.teal, borderRadius: RADII.pill }} />
              </div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 500, color: GENERAL.slate }}>
                {s.pct}%
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
