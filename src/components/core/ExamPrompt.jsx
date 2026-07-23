import { GENERAL } from '../../constants/generalTheme.js'
import { SPACING } from '../../constants/spacing.js'
import { TYPE } from '../../constants/typography.js'

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function stripTrailingMarks(question, marks) {
  if (typeof question !== 'string') return question

  const trimmed = question.trim()
  const markValue = Number.isFinite(Number(marks)) ? escapeRegExp(Number(marks)) : '\\d+'
  const bracketed = new RegExp(`\\s*[\\[(]\\s*${markValue}\\s*marks?\\s*[\\])]\\s*[.!?]?\\s*$`, 'i')
  const unbracketed = new RegExp(`\\s+${markValue}\\s*marks?\\s*[.!?]?\\s*$`, 'i')

  return trimmed.replace(bracketed, '').replace(unbracketed, '').trim()
}

function marksLabel(marks) {
  const value = Number(marks)
  if (!Number.isFinite(value)) return null
  return `${value} ${value === 1 ? 'mark' : 'marks'}`
}

// Cross-subject exam-question primitive. It deliberately uses Sora rather than a
// subject-specific literary face so the same prompt treatment works for prose,
// quotations, calculations, equations and source questions.
export default function ExamPrompt({
  question,
  marks,
  accent = GENERAL.teal,
  variant = 'hero',
  showMarks = true,
  style,
}) {
  const displayedQuestion = stripTrailingMarks(question, marks)
  const displayedMarks = marksLabel(marks)
  const promptType = variant === 'compact' ? TYPE.examQuestion : TYPE.examPromptHero

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.micro, ...style }}>
      <div style={{
        ...promptType,
        color: GENERAL.cinematic.textPrimary,
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {displayedQuestion}
      </div>
      {showMarks && displayedMarks && (
        <div style={{ ...TYPE.label, color: accent }}>{displayedMarks}</div>
      )}
    </div>
  )
}
