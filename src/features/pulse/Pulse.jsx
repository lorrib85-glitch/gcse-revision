import { TYPE } from '../../constants/typography.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { getWeeklyTrend } from '../../progress.js'
import { getWeakTopics } from '../../unifiedWeaknessTracker.js'
import { StreakChip } from '../home/StreakChip.jsx'

// Muted antique gold — Pulse challenge-card accent only
const PULSE_GOLD = '#D2A24C'

function PulseSparkline({ points }) {
  if (!points || points.length < 2) return null
  const w = 110, h = 48
  const min = Math.min(...points), max = Math.max(...points)
  const range = (max - min) || 1
  const step = w / (points.length - 1)
  const coords = points.map((p, i) => [(i * step).toFixed(1), (h - 6 - ((p - min) / range) * (h - 12)).toFixed(1)])
  const line = coords.map(c => c.join(',')).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ flexShrink: 0, marginTop: 4 }}>
      <defs>
        <linearGradient id="pulseSpark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={GENERAL.teal} stopOpacity="0.35" />
          <stop offset="100%" stopColor={GENERAL.teal} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${line} ${w},${h}`} fill="url(#pulseSpark)" />
      <polyline points={line} fill="none" stroke={GENERAL.teal} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function NavArrow({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

// best: { correct, answered } | null — passed from LegacyApp where readQfBest() lives (shared with QuickFire)
export default function PulseTab({ onStartQuickFire, best }) {
  const trend = getWeeklyTrend()

  let trendHeadline = null
  let trendColor = GENERAL.teal
  let trendNote = trend.trendNote
  if (trend.thisAvg != null && trend.prevAvg != null) {
    const delta = trend.thisAvg - trend.prevAvg
    trendHeadline = delta === 0 ? `${trend.thisAvg}%` : `${delta > 0 ? '+' : ''}${delta}%`
    trendColor = delta >= 0 ? GENERAL.teal : GENERAL.coral
  } else if (trend.thisAvg != null) {
    trendHeadline = `${trend.thisAvg}%`
  }

  const weakCount = getWeakTopics().length

  const modes = [
    {
      id: 'weak',
      accent: GENERAL.teal,
      featured: true,
      kicker: 'Continue',
      title: 'Weak spots',
      titleColor: GENERAL.softWhite,
      lines: [
        { text: 'Best for you', bright: true },
        { text: weakCount > 0 ? `${weakCount} topic${weakCount === 1 ? ' needs' : 's need'} attention` : "We'll find your gaps as you play" },
      ],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="8.5" stroke={GENERAL.teal} strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" fill={GENERAL.teal} />
        </svg>
      ),
    },
    {
      id: 'sprint',
      accent: GENERAL.coral,
      kicker: 'Start',
      title: '90 second sprint',
      titleColor: GENERAL.coral,
      lines: [
        { text: 'Mixed questions.' },
        { text: 'A new set every time.' },
      ],
      icon: (
        <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 14, fontWeight: 700, color: GENERAL.coral, letterSpacing: '-0.02em' }}>90</span>
      ),
    },
    {
      id: 'best',
      accent: PULSE_GOLD,
      kicker: 'Challenge',
      title: 'Beat your best',
      titleColor: PULSE_GOLD,
      lines: [
        { text: best ? `Can you beat your best score of ${best.correct}/${best.answered}?` : 'Play a first round to set the score to beat.' },
      ],
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PULSE_GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 21h8M12 17v4" />
          <path d="M7 4h10v5a5 5 0 0 1-10 0V4z" />
          <path d="M7 6H4.5A1.5 1.5 0 0 0 3 7.5C3 9.5 4.5 10.8 7 11" />
          <path d="M17 6h2.5A1.5 1.5 0 0 1 21 7.5C21 9.5 19.5 10.8 17 11" />
        </svg>
      ),
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: GENERAL.neutral[0], paddingBottom: 110, overflowX: 'hidden' }}>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', width: '100%', height: '34vh', minHeight: 260, maxHeight: 340, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/headers/pulse-quickquiz.png)',
          backgroundSize: 'cover', backgroundPosition: 'center right',
          filter: 'saturate(0.92)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, rgba(13,15,16,0.5) 0%, rgba(13,15,16,0.1) 28%, rgba(13,15,16,0.25) 58%, ${GENERAL.neutral[0]} 100%)`,
        }} />

        {/* Top row — logo + streak */}
        <div style={{
          position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 14px)',
          left: SPACING.compact, right: SPACING.compact, zIndex: 2,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <img src="/logo.png" alt="RISE" style={{ height: 30, width: 'auto', display: 'block', borderRadius: RADII.small }} />
          <StreakChip />
        </div>

        {/* Headline */}
        <div style={{ position: 'absolute', left: SPACING.compact, right: SPACING.compact, bottom: SPACING.standard, zIndex: 2 }}>
          <div style={{ ...TYPE.displaySection, fontSize: 46, color: GENERAL.softWhite }}>
            Quick quiz<span style={{ color: GENERAL.teal }}>.</span>
          </div>
          <div style={{
            marginTop: 10,
            fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 600,
            letterSpacing: '0.22em', textTransform: 'uppercase', color: GENERAL.teal,
          }}>
            90 second sprint
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 430, margin: '0 auto', padding: `0 ${SPACING.compact}px` }}>

        {/* ── Your progress ── */}
        <div style={{ marginTop: SPACING.compact + 4 }}>
          <div style={{
            fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: GENERAL.slate,
            marginBottom: 10,
          }}>
            Your progress
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: SPACING.compact }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {trendHeadline && (
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ ...TYPE.displaySection, fontSize: 34, color: trendColor }}>{trendHeadline}</span>
                  <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 500, color: GENERAL.slate }}>this week</span>
                </div>
              )}
              <div style={{
                ...TYPE.body, fontSize: 13, color: GENERAL.slate,
                marginTop: 6, maxWidth: 210,
              }}>
                {trendNote}
              </div>
            </div>
            <PulseSparkline points={trend.points} />
          </div>
        </div>

        {/* ── Quiz modes ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: SPACING.compact + 4 }}>
          {modes.map(m => (
            <button
              key={m.id}
              onClick={onStartQuickFire}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
                padding: '14px 16px', cursor: 'pointer',
                borderRadius: RADII.large,
                background: m.featured
                  ? `linear-gradient(135deg, rgba(${GENERAL.tealRgb},0.14) 0%, rgba(${GENERAL.tealRgb},0.04) 100%)`
                  : GENERAL.neutral[1],
                border: m.featured
                  ? `1px solid rgba(${GENERAL.tealRgb},0.5)`
                  : '1px solid rgba(255,255,255,0.06)',
                borderLeft: m.featured ? undefined : `2px solid ${m.accent}`,
              }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                border: `1.5px solid ${m.accent}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {m.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.2em', textTransform: 'uppercase', color: m.accent, marginBottom: 4,
                }}>
                  {m.kicker}
                </div>
                <div style={{ ...TYPE.displaySection, fontSize: 22, color: m.titleColor, marginBottom: 4 }}>
                  {m.title}
                </div>
                {m.lines.map((line, i) => (
                  <div key={i} style={{
                    ...TYPE.body, fontSize: 12.5,
                    color: line.bright ? 'rgba(241,250,238,0.82)' : GENERAL.slate,
                  }}>
                    {line.text}
                  </div>
                ))}
              </div>
              <NavArrow color={m.accent} />
            </button>
          ))}
        </div>

      </div>
    </div>
  )
}
