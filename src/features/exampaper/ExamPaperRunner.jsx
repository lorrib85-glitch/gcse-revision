import { GENERAL } from '../../constants/generalTheme.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import BackButton from '../../components/core/BackButton.jsx'
import { useExamPaperState } from './useExamPaperState.js'
import { ExamPaperSection } from './ExamPaperSection.jsx'
import { ExamPaperMarking } from './ExamPaperMarking.jsx'
import { ExamPaperDebrief } from './ExamPaperDebrief.jsx'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function ExamPaperRunner({ paper, onExit }) {
  const state = useExamPaperState(paper)
  const accent = paper.color || GENERAL.teal

  if (state.phase === 'marking') {
    return <ExamPaperMarking paper={paper} progress={state.markingProgress} />
  }

  if (state.phase === 'debrief') {
    return (
      <ExamPaperDebrief
        paper={paper}
        results={state.markingResults}
        elapsed={state.elapsed}
        onExit={onExit}
        onRetry={() => { state.reset(); onExit() }}
      />
    )
  }

  // ── Paper phase ────────────────────────────────────────────────────────────
  const allQs = state.allQuestions()
  const answeredCount = allQs.filter(q => (state.answers[q.id] ?? '').trim().length > 0).length

  return (
    <div style={{ minHeight: '100vh', background: GENERAL.neutral[0], paddingBottom: 140 }}>

      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: GENERAL.neutral[0],
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: `calc(env(safe-area-inset-top, 0px) + 10px) ${SPACING.compact}px 10px`,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <BackButton onClick={onExit} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700,
            color: GENERAL.softWhite,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {paper.subtitle || paper.title}
          </div>
          <div style={{
            ...TYPE.metadata, color: accent,
            textTransform: 'uppercase', letterSpacing: '0.14em',
          }}>
            {paper.ref} · {paper.totalMarks} marks
          </div>
        </div>
        <div style={{
          fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700,
          color: GENERAL.slate, flexShrink: 0,
        }}>
          {formatTime(state.elapsed)}
        </div>
      </div>

      {/* Paper info banner */}
      <div style={{
        maxWidth: 430, margin: '0 auto',
        padding: `${SPACING.compact}px ${SPACING.compact}px 0`,
      }}>
        <div style={{
          background: GENERAL.neutral[1],
          borderRadius: RADII.medium,
          border: `1px solid rgba(255,255,255,0.06)`,
          borderLeft: `3px solid ${accent}`,
          padding: '12px 14px',
          marginBottom: SPACING.compact,
          display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...TYPE.displaySection, fontSize: 17, color: GENERAL.softWhite, marginBottom: 2 }}>
              {paper.title}
            </div>
            <div style={{ ...TYPE.body, fontSize: 12.5, color: GENERAL.slate }}>
              {paper.date && `${paper.date} · `}{paper.timeMins} minutes · {paper.totalMarks} marks
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{
              ...TYPE.metadata, color: accent,
              textTransform: 'uppercase', letterSpacing: '0.14em',
            }}>
              {paper.board}
            </div>
          </div>
        </div>

        {/* Sections */}
        {paper.sections.map(section => (
          <ExamPaperSection
            key={section.id}
            section={section}
            answers={state.answers}
            results={null}
            onAnswerChange={state.setAnswer}
            accent={accent}
          />
        ))}

        {/* Submit CTA */}
        <div style={{
          paddingTop: SPACING.standard,
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            fontFamily: "'Sora', sans-serif", fontSize: 13, color: GENERAL.slate,
            textAlign: 'center', marginBottom: SPACING.compact,
          }}>
            {answeredCount} of {allQs.length} questions answered
          </div>
          <button
            onClick={state.submit}
            style={{
              width: '100%', padding: '16px 24px',
              background: accent, color: GENERAL.textOnAccent,
              border: 'none', borderRadius: RADII.large,
              fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700,
              cursor: 'pointer',
              opacity: answeredCount === 0 ? 0.5 : 1,
            }}
          >
            Submit paper
          </button>
          <div style={{
            fontFamily: "'Sora', sans-serif", fontSize: 12, color: GENERAL.slate,
            textAlign: 'center', marginTop: 10, lineHeight: 1.5,
          }}>
            Unanswered questions will receive 0 marks. You can still submit.
          </div>
        </div>
      </div>
    </div>
  )
}
