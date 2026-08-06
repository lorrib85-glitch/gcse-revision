import { CURRICULUM_CHAPTERS as CHAPTERS, isChapterAvailable } from '../../data/learnerCurriculum.js'
import { getChapterPct, getProgress } from '../../progress.js'
import { SUBJECT_ACCENTS, hexToRgb } from '../../constants/subjects.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import { StreakChip } from '../home/StreakChip.jsx'
import { formatStudyTime, readStudyTime } from './studyTime.js'

// ─── Progress ───────────────────────────────────────────────────────────────
//
// The "look how far you've come" screen. It reports effort already spent, never
// effort outstanding — no targets, no deficits, no red. Everything shown is
// read from real recorded state; a learner who has done nothing yet sees an
// invitation rather than a wall of zeros.
//
// Deliberately three blocks: a headline, a stat row, and subject rails. Resist
// adding a fourth — the weekly recall trend lives on Pulse and Home already.

function safeRead(read, fallback) {
  try { return read() } catch { return fallback }
}

function readSnapshot() {
  const available = CHAPTERS.filter(isChapterAvailable)
  const pctOf = chapter => safeRead(() => getChapterPct(chapter), 0)

  const completed = []
  const inProgress = []
  for (const chapter of available) {
    const pct = pctOf(chapter)
    if (pct >= 100) completed.push(chapter)
    else if (pct > 0) inProgress.push(chapter)
  }

  const progress = safeRead(getProgress, { streak: 0, bestStreak: 0 })
  const study = safeRead(readStudyTime, { totalSeconds: 0, daysStudied: 0 })

  return {
    available,
    completed,
    inProgress,
    streak: progress.streak || 0,
    bestStreak: progress.bestStreak || 0,
    studySeconds: study.totalSeconds || 0,
    daysStudied: study.daysStudied || 0,
  }
}

function subjectRails(available, completedIds) {
  const bySubject = new Map()
  for (const chapter of available) {
    const row = bySubject.get(chapter.subject) || { subject: chapter.subject, total: 0, done: 0 }
    row.total += 1
    if (completedIds.has(chapter.id)) row.done += 1
    bySubject.set(chapter.subject, row)
  }
  return [...bySubject.values()]
    .map(row => ({ ...row, pct: Math.round((row.done / row.total) * 100) }))
    // Strongest subject first — the page opens on evidence of success.
    .sort((a, b) => b.pct - a.pct || a.subject.localeCompare(b.subject))
}

// One sentence, in the learner's own terms, about what they've built so far.
function headline({ completed, inProgress, studySeconds, streak }) {
  if (completed.length) {
    const chapters = `${completed.length} chapter${completed.length === 1 ? '' : 's'} finished`
    if (streak >= 3) return `${chapters}, ${streak} days in a row. That consistency is what shows up in the exam.`
    if (inProgress.length) return `${chapters}, and ${inProgress.length} more underway. Real ground covered.`
    return `${chapters}. Every one of those is knowledge you can now be tested on.`
  }
  if (inProgress.length === 1) return 'You have a chapter underway. Finish it and it lands here for good.'
  if (inProgress.length > 1) return `You have ${inProgress.length} chapters underway. Finishing one is the quickest win on this page.`
  if (studySeconds > 0) return 'You have put time in today. Finish a chapter and it will show up here.'
  return 'Nothing here yet — and that is fine. Open one chapter and this page starts filling in.'
}

// A quiet closing note. Always says something true; never nags.
function closingNote({ bestStreak, streak, daysStudied }) {
  if (bestStreak > streak && bestStreak >= 3) return `Your best run so far is ${bestStreak} days. That one is beatable.`
  if (daysStudied >= 2) return `You have studied on ${daysStudied} separate days. Spacing it out like that is exactly what makes it stick.`
  return 'Time is counted only while you are actually working through a chapter, quiz or exam — nothing here is estimated.'
}

function HeroAtmosphere() {
  // Concentric arcs — quiet visual echo of a progress ring, never a real
  // measurement. Static by design: this screen is a moment of calm.
  const ring = `rgba(${GENERAL.tealRgb},0.16)`
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <defs>
        <radialGradient id="progressGlow" cx="0.72" cy="0.3" r="0.7">
          <stop offset="0%" stopColor={GENERAL.teal} stopOpacity="0.22" />
          <stop offset="100%" stopColor={GENERAL.teal} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="400" height="300" fill="url(#progressGlow)" />
      {[62, 104, 146].map((r, i) => (
        <circle
          key={r}
          cx="292" cy="88" r={r}
          fill="none" stroke={ring} strokeWidth={i === 0 ? 1.5 : 1}
        />
      ))}
      <circle
        cx="292" cy="88" r="62"
        fill="none" stroke={GENERAL.teal} strokeOpacity="0.5" strokeWidth="2"
        strokeLinecap="round" strokeDasharray="150 250" transform="rotate(-108 292 88)"
      />
    </svg>
  )
}

function StatTile({ value, unit, label, accent, valueSize = 28 }) {
  return (
    <div style={{
      background: GENERAL.neutral[1],
      border: `1px solid ${GENERAL.line.faint}`,
      borderRadius: RADII.medium,
      padding: '14px 12px',
      minWidth: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
        {/* Never wrap a stat: a value broken across two lines reads as an
            error, and it drags the whole row out of alignment. */}
        <span style={{ ...TYPE.displaySection, fontSize: valueSize, color: accent, whiteSpace: 'nowrap' }}>{value}</span>
        {unit && (
          <span style={{ ...TYPE.metadata, fontSize: 12, color: GENERAL.slate }}>{unit}</span>
        )}
      </div>
      <div style={{ ...TYPE.caption, color: GENERAL.slate, marginTop: 4 }}>{label}</div>
    </div>
  )
}

function SubjectRail({ subject, done, total, pct }) {
  const accent = SUBJECT_ACCENTS[subject] || GENERAL.teal
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: SPACING.micro }}>
        <span style={{ ...TYPE.bodyStrong, fontSize: 15, color: GENERAL.softWhite }}>{subject}</span>
        <span style={{ ...TYPE.caption, color: GENERAL.slate, flexShrink: 0 }}>
          {done} of {total}
        </span>
      </div>
      <div style={{
        marginTop: 7, height: 5, borderRadius: RADII.pill,
        background: `rgba(${hexToRgb(GENERAL.slate)},0.14)`,
        overflow: 'hidden',
      }}>
        <div style={{
          // A started-but-unfinished subject still shows a sliver, so the rail
          // never reads as "you have done nothing here".
          width: `${done > 0 ? Math.max(pct, 4) : 0}%`,
          height: '100%', borderRadius: RADII.pill,
          background: `linear-gradient(90deg, rgba(${hexToRgb(accent)},0.55), ${accent})`,
        }} />
      </div>
    </div>
  )
}

export default function ProgressTab() {
  const snapshot = readSnapshot()
  const completedIds = new Set(snapshot.completed.map(chapter => chapter.id))
  const rails = subjectRails(snapshot.available, completedIds)
  const showRails = rails.length > 0 && snapshot.completed.length > 0
  const note = closingNote(snapshot)

  return (
    <div style={{ minHeight: '100vh', background: GENERAL.neutral[0], paddingBottom: 110, overflowX: 'hidden' }}>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', width: '100%', height: '30vh', minHeight: 230, maxHeight: 300, overflow: 'hidden' }}>
        <HeroAtmosphere />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(180deg, rgba(13,15,16,0.35) 0%, rgba(13,15,16,0) 42%, ${GENERAL.neutral[0]} 100%)`,
        }} />

        {/* Top row — logo + streak */}
        <div style={{
          position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 14px)',
          left: SPACING.compact, right: SPACING.compact, zIndex: 2,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <img src="/images/app/logo.png" alt="RISE" style={{ height: 30, width: 'auto', display: 'block', borderRadius: RADII.small }} />
          <StreakChip />
        </div>

        {/* Headline */}
        <div style={{ position: 'absolute', left: SPACING.compact, right: SPACING.compact, bottom: SPACING.standard, zIndex: 2 }}>
          <div style={{ ...TYPE.displaySection, fontSize: 46, color: GENERAL.softWhite }}>
            Your progress<span style={{ color: GENERAL.teal }}>.</span>
          </div>
          <div style={{ ...TYPE.eyebrow, fontSize: 12, color: GENERAL.teal, marginTop: 10 }}>
            How far you have come
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 430, margin: '0 auto', padding: `0 ${SPACING.compact}px` }}>

        {/* ── Headline sentence ── */}
        <div style={{ ...TYPE.body, fontSize: 15, color: 'rgba(241,250,238,0.82)', marginTop: SPACING.compact }}>
          {headline(snapshot)}
        </div>

        {/* ── Stat row ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: SPACING.micro, marginTop: SPACING.compact + 4,
        }}>
          <StatTile
            value={snapshot.completed.length}
            label={snapshot.completed.length === 1 ? 'chapter done' : 'chapters done'}
            accent={GENERAL.softWhite}
          />
          <StatTile
            value={formatStudyTime(snapshot.studySeconds)}
            // 'Nh Nm' is the widest value on the row, so it gets its own size.
            valueSize={snapshot.studySeconds >= 3600 ? 22 : 28}
            label={snapshot.studySeconds > 0 ? 'time invested' : 'starts today'}
            accent={GENERAL.teal}
          />
          <StatTile
            value={snapshot.streak}
            unit={snapshot.streak === 1 ? 'day' : 'days'}
            label="in a row"
            accent={GENERAL.coral}
          />
        </div>

        {/* ── Subject rails ── */}
        {/* Withheld until there is something to show. Five empty rails on day
            one is a list of everything not done — the opposite of the job. */}
        {showRails && (
          <div style={{ marginTop: SPACING.standard + 4 }}>
            <div style={{ ...TYPE.eyebrow, fontSize: 11, letterSpacing: '0.18em', color: GENERAL.slate, marginBottom: 14 }}>
              Across your subjects
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {rails.map(rail => <SubjectRail key={rail.subject} {...rail} />)}
            </div>
          </div>
        )}

        {/* ── Closing note ── */}
        {note && (
          <div style={{
            ...TYPE.bodySmall, color: GENERAL.slate,
            marginTop: SPACING.standard, paddingTop: SPACING.compact,
            borderTop: `1px solid ${GENERAL.line.faint}`,
          }}>
            {note}
          </div>
        )}

      </div>
    </div>
  )
}
