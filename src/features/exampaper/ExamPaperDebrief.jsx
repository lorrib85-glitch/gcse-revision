import { GENERAL } from '../../constants/generalTheme.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function scoreColor(pct) {
  if (pct >= 80) return GENERAL.teal
  if (pct >= 60) return '#F4A261'
  return GENERAL.coral
}

function scoreVerdict(pct) {
  if (pct >= 90) return 'Outstanding'
  if (pct >= 80) return 'Excellent'
  if (pct >= 65) return 'Good'
  if (pct >= 50) return 'Satisfactory'
  if (pct >= 30) return 'Needs work'
  return 'Keep practising'
}

function marksColor(awarded, available) {
  if (!awarded && awarded !== 0) return GENERAL.slate
  if (awarded === 0) return GENERAL.coral
  if (awarded >= available) return GENERAL.teal
  return '#F4A261'
}

function QuestionResult({ question, result, accent }) {
  const earned = result?.marksAwarded ?? 0
  const available = result?.marksAvailable ?? question.marks
  const mc = marksColor(earned, available)

  return (
    <div style={{
      background: GENERAL.neutral[1],
      borderRadius: RADII.medium,
      border: `1px solid rgba(255,255,255,0.06)`,
      padding: '14px',
      marginBottom: 10,
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6, flexShrink: 0,
          background: `${mc}18`, border: `1px solid ${mc}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 700, color: mc }}>
            {question.number}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Sora', sans-serif", fontSize: 13, color: GENERAL.softWhite,
            lineHeight: 1.5, marginBottom: 4,
          }}>
            {question.q.length > 120 ? question.q.slice(0, 120) + '…' : question.q}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{
              fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 700, color: mc,
            }}>
              {earned} / {available} marks
            </span>
            {result?.grade && (
              <span style={{
                fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: mc, background: `${mc}14`,
                padding: '2px 7px', borderRadius: RADII.pill,
              }}>
                {result.grade}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Feedback */}
      {result?.summary && (
        <div style={{
          fontFamily: "'Sora', sans-serif", fontSize: 13, color: GENERAL.softWhite,
          lineHeight: 1.55, marginBottom: result.examinerTip ? 8 : 0,
        }}>
          {result.summary}
        </div>
      )}
      {result?.examinerTip && (
        <div style={{
          fontFamily: "'Sora', sans-serif", fontSize: 12.5, color: GENERAL.slate,
          lineHeight: 1.5, fontStyle: 'italic',
        }}>
          {result.examinerTip}
        </div>
      )}
    </div>
  )
}

export function ExamPaperDebrief({ paper, results, elapsed, onExit, onRetry }) {
  const accent = paper.color || GENERAL.teal
  const allQs = paper.sections.flatMap(s => s.questions)
  const totalAvailable = allQs.reduce((sum, q) => sum + (results[q.id]?.marksAvailable ?? q.marks), 0)
  const totalEarned = allQs.reduce((sum, q) => sum + (results[q.id]?.marksAwarded ?? 0), 0)
  const pct = totalAvailable > 0 ? Math.round((totalEarned / totalAvailable) * 100) : 0
  const verdict = scoreVerdict(pct)
  const col = scoreColor(pct)

  return (
    <div style={{
      minHeight: '100vh',
      background: GENERAL.neutral[0],
      paddingBottom: 120,
    }}>
      {/* Hero score banner */}
      <div style={{
        background: GENERAL.neutral[1],
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: `calc(env(safe-area-inset-top, 0px) + ${SPACING.standard}px) ${SPACING.compact}px ${SPACING.standard}px`,
        textAlign: 'center',
      }}>
        {/* Board / ref chip */}
        <div style={{
          ...TYPE.metadata, color: accent,
          textTransform: 'uppercase', letterSpacing: '0.18em',
          marginBottom: 14,
        }}>
          {paper.board} · {paper.ref} · {paper.year}
        </div>

        {/* Score */}
        <div style={{
          fontFamily: "'Manrope', sans-serif",
          fontSize: 'clamp(48px, 14vw, 64px)',
          fontWeight: 850, lineHeight: 1,
          color: col, marginBottom: 6,
        }}>
          {totalEarned}<span style={{ fontSize: '0.5em', color: GENERAL.slate }}>/{totalAvailable}</span>
        </div>

        {/* Verdict */}
        <div style={{
          ...TYPE.displaySection, fontSize: 20, color: GENERAL.softWhite, marginBottom: 4,
        }}>
          {verdict}
        </div>

        {/* Time taken */}
        {elapsed > 0 && (
          <div style={{
            ...TYPE.body, fontSize: 13, color: GENERAL.slate,
          }}>
            Completed in {formatTime(elapsed)}
            {paper.timeMins && ` · Paper allows ${paper.timeMins} min`}
          </div>
        )}
      </div>

      {/* Question breakdown */}
      <div style={{
        maxWidth: 430, margin: '0 auto',
        padding: `${SPACING.standard}px ${SPACING.compact}px 0`,
      }}>
        <div style={{
          ...TYPE.metadata, color: GENERAL.slate,
          textTransform: 'uppercase', letterSpacing: '0.16em',
          marginBottom: 14,
        }}>
          Question by question
        </div>

        {paper.sections.flatMap(section =>
          section.questions.map(question => (
            <QuestionResult
              key={question.id}
              question={question}
              result={results[question.id]}
              accent={accent}
            />
          ))
        )}

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: SPACING.standard }}>
          <button
            onClick={onRetry}
            style={{
              width: '100%', padding: '16px',
              background: accent, color: '#08090D',
              border: 'none', borderRadius: RADII.large,
              fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Try another paper
          </button>
          <button
            onClick={onExit}
            style={{
              width: '100%', padding: '16px',
              background: 'transparent', color: GENERAL.slate,
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: RADII.large,
              fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
