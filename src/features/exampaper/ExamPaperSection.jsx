import { GENERAL } from '../../constants/generalTheme.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { ExamPaperSource } from './ExamPaperSource.jsx'
import { ExamPaperQuestion } from './ExamPaperQuestion.jsx'

export function ExamPaperSection({ section, answers, results, onAnswerChange, accent }) {
  return (
    <div style={{ paddingTop: SPACING.standard }}>
      {/* Section header */}
      <div style={{ marginBottom: SPACING.compact }}>
        <div style={{
          ...TYPE.displaySection, fontSize: 20, color: GENERAL.softWhite, marginBottom: 4,
        }}>
          {section.title}
        </div>
        {section.instruction && (
          <div style={{
            ...TYPE.body, fontSize: 13, color: GENERAL.slate,
          }}>
            {section.instruction}
          </div>
        )}
      </div>

      {/* Sources */}
      {(section.sources ?? []).length > 0 && (
        <div style={{ marginBottom: SPACING.standard }}>
          {section.sources.map(source => (
            <ExamPaperSource key={source.id} source={source} accent={accent} />
          ))}
        </div>
      )}

      {/* Questions */}
      {section.questions.map(question => (
        <ExamPaperQuestion
          key={question.id}
          question={question}
          answer={answers[question.id] ?? ''}
          result={results ? results[question.id] : null}
          onAnswerChange={onAnswerChange}
          accent={accent}
        />
      ))}
    </div>
  )
}
