import { GENERAL } from '../../../constants/generalTheme.js'
import { RADII } from '../../../constants/radii.js'
import { SPACING } from '../../../constants/spacing.js'
import { TYPE } from '../../../constants/typography.js'
import { annotationDot, annotationStyle, buildAnswerSections } from './utils.js'

function AnnotationList({ title, notes, accent }) {
  if (notes.length === 0) return null

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ ...TYPE.label, color: GENERAL.cinematic.textMuted, marginBottom: 8 }}>{title}</div>
      {notes.map(annotation => (
        <div key={annotation.id} style={{ display: 'flex', alignItems: 'flex-start', gap: SPACING.micro, marginBottom: SPACING.micro }}>
          <div style={{ width: 8, height: 8, borderRadius: RADII.pill, marginTop: 6, flexShrink: 0, background: annotationDot(annotation.type, accent) }} />
          <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textSecondary }}>
            {annotation.comment}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AnswerPanel({
  accent,
  examiner,
  segments,
  isReveal,
  isImproving,
  expandedEdit,
  setExpandedEdit,
  studentEdits,
  setStudentEdits,
  expandedTextareaRef,
}) {
  const answerSections = buildAnswerSections(examiner.sampleAnswer)
  const annotations = examiner.annotations || []
  const earnedNotes = annotations.filter(annotation => annotation.type === 'strong')
  const improvementNotes = annotations.filter(annotation => annotation.type !== 'strong')

  return (
    <article style={{
      background: 'rgba(8,9,13,0.26)',
      borderTop: `1px solid ${GENERAL.line.faint}`,
      borderRight: `1px solid ${GENERAL.line.faint}`,
      borderBottom: `1px solid ${GENERAL.line.faint}`,
      borderLeft: `2px solid ${accent}88`,
      borderRadius: `0 ${RADII.large}px ${RADII.large}px 0`,
      padding: '18px 18px 20px 20px',
      boxShadow: `inset 0 1px 0 ${GENERAL.line.faint}`,
    }}>
      {(isReveal || isImproving) && (
        <div style={{ ...TYPE.eyebrow, color: GENERAL.cinematic.textMuted, marginBottom: 14 }}>
          Examiner report
        </div>
      )}

      {segments.length === 0 ? (
        <div style={{ display: 'grid', gap: 22 }}>
          {answerSections.map((section, index) => (
            <section key={`${section.label}-${index}`}>
              {answerSections.length > 1 && (
                <div style={{
                  ...TYPE.label,
                  color: index === 0 ? GENERAL.cinematic.textMuted : accent,
                  marginBottom: 7,
                }}>
                  {section.label}
                </div>
              )}
              <div style={{ ...TYPE.examAnswer, color: GENERAL.cinematic.textFact }}>
                {section.text}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div style={{ ...TYPE.examAnswer, color: GENERAL.cinematic.textFact }}>
          {segments.map((segment, index) => {
            if (segment.type === 'plain') return <span key={index}>{segment.text}</span>
            const { ann } = segment
            const isWeak = ann.type === 'weak'
            const isExpanded = expandedEdit === ann.id
            const hasEdit = studentEdits[ann.id]?.trim()

            return (
              <span key={index}>
                <span style={annotationStyle(ann.type, accent)}>{segment.text}</span>
                {isImproving && isWeak && (
                  <>
                    {' '}
                    <button
                      type="button"
                      className={`fte-improve-btn${hasEdit ? ' edited' : ''}`}
                      onClick={() => {
                        const next = isExpanded ? null : ann.id
                        setExpandedEdit(next)
                        if (next) setTimeout(() => expandedTextareaRef.current?.focus(), 50)
                      }}
                    >
                      {hasEdit ? '✓ edited' : (examiner.improvementPrompts?.[ann.id]?.prompt || 'Improve this')}
                    </button>
                    {isExpanded && (
                      <span style={{ display: 'block' }}>
                        <textarea
                          ref={expandedTextareaRef}
                          className="fte-textarea"
                          rows={3}
                          aria-label={`Improve: ${ann.target}`}
                          placeholder={examiner.improvementPrompts?.[ann.id]?.placeholder || 'Add your improvement here…'}
                          value={studentEdits[ann.id] || ''}
                          onChange={event => setStudentEdits(previous => ({ ...previous, [ann.id]: event.target.value }))}
                        />
                      </span>
                    )}
                  </>
                )}
              </span>
            )
          })}
        </div>
      )}

      {(isReveal || isImproving) && annotations.length > 0 && (
        <div style={{ marginTop: 22, borderTop: `1px solid ${GENERAL.line.faint}`, paddingTop: 2 }}>
          <AnnotationList title="What earned marks" notes={earnedNotes} accent={accent} />
          <AnnotationList title="What stopped the next mark" notes={improvementNotes} accent={accent} />
        </div>
      )}

      {isImproving && (
        <div style={{ ...TYPE.eyebrow, marginTop: 20, color: accent }}>
          Fix the weakest sentence
        </div>
      )}
    </article>
  )
}
