import { GENERAL } from '../../constants/generalTheme.js'
import { TYPE } from '../../constants/typography.js'
import { SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'

const GRADE_COLORS = {
  'Excellent':   '#2A9D8F',
  'Good':        '#2A9D8F',
  'Satisfactory':'#F4A261',
  'Needs Work':  '#E76F51',
  'No answer':   '#5A6367',
  'Error':       '#5A6367',
}

function marksColor(awarded, available) {
  if (awarded === null || awarded === undefined) return GENERAL.slate
  if (awarded === 0) return '#E76F51'
  if (awarded >= available) return '#2A9D8F'
  return '#F4A261'
}

function textareaMinHeight(marks) {
  if (marks <= 1) return 80
  if (marks <= 3) return 120
  if (marks <= 4) return 180
  if (marks <= 6) return 240
  return 320
}

export function ExamPaperQuestion({ question, answer, onAnswerChange, result, accent }) {
  const hasResult = !!result
  const gradeColor = result ? (GRADE_COLORS[result.grade] || GENERAL.slate) : accent
  const earned = result?.marksAwarded ?? null
  const available = result?.marksAvailable ?? question.marks

  return (
    <div style={{
      background: GENERAL.neutral[1],
      borderRadius: RADII.medium,
      border: `1px solid rgba(255,255,255,0.06)`,
      overflow: 'hidden',
      marginBottom: SPACING.compact,
    }}>
      {/* Question header row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 14px 0',
      }}>
        {/* Q number */}
        <div style={{
          width: 32, height: 32, borderRadius: RADII.small,
          background: `rgba(${question.marks >= 10 ? '42,157,143' : '255,255,255'},.08)`,
          border: `1px solid ${accent}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 700,
            color: accent, letterSpacing: '0.02em',
          }}>
            {question.number}
          </span>
        </div>

        {/* Chips row */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', flex: 1 }}>
          {question.commandWord && (
            <span style={{
              fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: accent, background: `${accent}18`,
              padding: '3px 8px', borderRadius: RADII.pill,
            }}>
              {question.commandWord}
            </span>
          )}
          {(question.sourceRefs ?? []).map(ref => (
            <span key={ref} style={{
              fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 600,
              letterSpacing: '0.10em', textTransform: 'uppercase',
              color: GENERAL.slate, background: 'rgba(255,255,255,0.06)',
              padding: '3px 8px', borderRadius: RADII.pill,
            }}>
              {ref === 'item-a' ? 'Item A' : ref === 'item-b' ? 'Item B' : ref}
            </span>
          ))}
        </div>

        {/* Marks */}
        <div style={{
          fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 700,
          color: hasResult ? marksColor(earned, available) : GENERAL.slate,
          whiteSpace: 'nowrap',
          marginLeft: 'auto', flexShrink: 0,
        }}>
          {hasResult ? `${earned} / ${available}` : `[${question.marks}]`}
        </div>
      </div>

      {/* Question text */}
      <div style={{
        padding: '10px 14px',
        ...TYPE.body, color: GENERAL.softWhite, lineHeight: 1.6,
      }}>
        {question.q}
      </div>

      {/* Answer area */}
      <div style={{ padding: '0 14px 14px' }}>
        <textarea
          value={answer ?? ''}
          onChange={e => onAnswerChange(question.id, e.target.value)}
          placeholder={`Write your answer here…`}
          disabled={hasResult}
          style={{
            width: '100%', boxSizing: 'border-box',
            minHeight: textareaMinHeight(question.marks),
            background: hasResult ? 'rgba(255,255,255,0.03)' : GENERAL.neutral[2],
            border: `1px solid ${hasResult ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.10)'}`,
            borderRadius: RADII.small,
            color: GENERAL.softWhite,
            fontFamily: "'Sora', sans-serif", fontSize: 14, lineHeight: 1.6,
            padding: '12px',
            resize: 'vertical',
            outline: 'none',
            transition: 'border-color 0.15s',
            opacity: hasResult ? 0.7 : 1,
          }}
          onFocus={e => { if (!hasResult) e.target.style.borderColor = accent }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)' }}
        />

        {/* Marking result */}
        {hasResult && (
          <div style={{
            marginTop: 10, padding: 14,
            background: `${gradeColor}10`,
            border: `1px solid ${gradeColor}30`,
            borderRadius: RADII.small,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{
                fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase', color: gradeColor,
              }}>
                {result.grade}
              </span>
              <span style={{
                fontFamily: "'Sora', sans-serif", fontSize: 13, fontWeight: 700,
                color: marksColor(earned, available),
              }}>
                {earned} / {available} marks
              </span>
            </div>
            {result.summary && (
              <p style={{
                ...TYPE.bodySmall, color: GENERAL.softWhite, lineHeight: 1.55,
                margin: '0 0 6px',
              }}>
                {result.summary}
              </p>
            )}
            {result.examinerTip && (
              <p style={{
                ...TYPE.bodySmall, color: GENERAL.slate, lineHeight: 1.5,
                margin: 0, fontStyle: 'italic',
              }}>
                {result.examinerTip}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
