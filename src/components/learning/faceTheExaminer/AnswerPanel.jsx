import { GENERAL } from '../../../constants/generalTheme.js'
import { RADII } from '../../../constants/radii.js'
import { SPACING } from '../../../constants/spacing.js'
import { TYPE } from '../../../constants/typography.js'
import { annotationDot, annotationStyle, buildAnswerSections, getPrimaryImprovementAnnotation } from './utils.js'

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
  const answerSections = buildAnswerSections(examiner.sampleAnswer, examiner.answerSections)
  const annotations = examiner.annotations || []
  const earnedNotes = annotations.filter(annotation => annotation.type === 'strong')
  const improvementNotes = annotations.filter(annotation => annotation.type !== 'strong')
  const primaryImprovement = getPrimaryImprovementAnnotation(annotations, examiner.primaryImprovementId)

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
        <div style={{ ...TYPE.label, color: GENERAL.cinematic.textMuted, marginBottom: 14 }}>
          {examiner.reportLabel || 'Examiner report'}
        </div>
      )}

      {isImproving && primaryImprovement && (
        <div style={{ marginBottom: 20, paddingBottom: 18, borderBottom: `1px solid ${GENERAL.line.faint}` }}>
          <div style={{ ...TYPE.displayCard, color: accent, marginBottom: 5 }}>
            {examiner.repairTitle || 'Fix one weakness'}
          </div>
          <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textSecondary }}>
            {examiner.repairInstruction || 'Rewrite the highlighted sentence. Keep the useful knowledge and add the missing link.'}
          </div>
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
            const canEdit = isImproving && ann.id === primaryImprovement?.id
            const isExpanded = expandedEdit === ann.id
            const editValue = studentEdits[ann.id] || ''
            const hasEdit = Boolean(editValue.trim())
            const prompt = examiner.improvementPrompts?.[ann.id]
            const textareaId = `fte-repair-${ann.id}`

            return (
              <span key={index}>
                <span style={annotationStyle(ann.type, accent)}>{segment.text}</span>
                {canEdit && (
                  <>
                    {' '}
                    <button
                      type="button"
                      className={`fte-improve-btn${hasEdit ? ' edited' : ''}`}
                      aria-expanded={isExpanded}
                      aria-controls={textareaId}
                      onClick={() => {
                        const next = isExpanded ? null : ann.id
                        setExpandedEdit(next)
                        if (next) setTimeout(() => expandedTextareaRef.current?.focus(), 50)
                      }}
                    >
                      {hasEdit ? 'Edited — review' : (prompt?.buttonLabel || 'Rewrite this sentence')}
                    </button>
                    {isExpanded && (
                      <span id={textareaId} style={{ display: 'block', marginTop: 10 }}>
                        {(prompt?.prompt || ann.comment) && (
                          <span style={{ ...TYPE.bodySmall, display: 'block', color: GENERAL.cinematic.textMuted, marginBottom: 8 }}>
                            {prompt?.prompt || ann.comment}
                          </span>
                        )}
                        <textarea
                          ref={expandedTextareaRef}
                          className="fte-textarea"
                          rows={4}
                          aria-label={`Rewrite: ${ann.target}`}
                          placeholder={prompt?.placeholder || 'Rewrite the complete sentence here…'}
                          value={editValue}
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
          <AnnotationList title={examiner.earnedMarksLabel || 'What earned marks'} notes={earnedNotes} accent={accent} />
          <AnnotationList title={examiner.nextMarkLabel || 'What stopped the next mark'} notes={improvementNotes} accent={accent} />
        </div>
      )}
    </article>
  )
}
