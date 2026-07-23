import { useEffect, useState } from 'react'
import { GENERAL } from '../../../constants/generalTheme.js'
import { RADII } from '../../../constants/radii.js'
import { SPACING } from '../../../constants/spacing.js'
import { TYPE } from '../../../constants/typography.js'
import { annotationDot, annotationStyle, buildAnswerSections, getPrimaryImprovementAnnotation } from './utils.js'

function AnnotationList({ title, notes, accent }) {
  if (notes.length === 0) return null

  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ ...TYPE.label, color: GENERAL.cinematic.textMuted, marginBottom: 10 }}>{title}</div>
      {notes.map(annotation => (
        <div key={annotation.id} style={{ display: 'flex', alignItems: 'flex-start', gap: SPACING.micro, marginBottom: SPACING.micro }}>
          <div style={{ width: 8, height: 8, borderRadius: RADII.pill, marginTop: 7, flexShrink: 0, background: annotationDot(annotation.type, accent) }} />
          <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textSecondary }}>
            {annotation.comment}
          </div>
        </div>
      ))}
    </div>
  )
}

function AnswerContent({ accent, answerSections, segments }) {
  if (segments.length === 0) {
    return (
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
    )
  }

  return (
    <div style={{ ...TYPE.examAnswer, color: GENERAL.cinematic.textFact }}>
      {segments.map((segment, index) => (
        segment.type === 'plain'
          ? <span key={index}>{segment.text}</span>
          : <span key={index} style={annotationStyle(segment.ann.type, accent)}>{segment.text}</span>
      ))}
    </div>
  )
}

function MarkedAnswerToggle({ accent, answerSections, segments, examiner }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ marginTop: 24, borderTop: `1px solid ${GENERAL.line.faint}` }}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(previous => !previous)}
        style={{
          ...TYPE.label,
          width: '100%',
          minHeight: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: '0 2px',
          border: 'none',
          background: 'transparent',
          color: open ? accent : GENERAL.cinematic.textSecondary,
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span>{examiner.markedAnswerToggleLabel || 'View marked answer'}</span>
        <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1, transform: open ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 180ms ease' }}>+</span>
      </button>

      {open && (
        <div style={{ padding: '16px 0 8px', borderTop: `1px solid ${GENERAL.line.faint}`, animation: 'fte-panel-up 260ms ease both' }}>
          <AnswerContent accent={accent} answerSections={answerSections} segments={segments} />
        </div>
      )}
    </div>
  )
}

export default function AnswerPanel({
  accent,
  examiner,
  segments,
  isReveal,
  isImproving,
  studentEdits,
  setStudentEdits,
  expandedTextareaRef,
}) {
  const answerSections = buildAnswerSections(examiner.sampleAnswer, examiner.answerSections)
  const annotations = examiner.annotations || []
  const earnedNotes = annotations.filter(annotation => annotation.type === 'strong')
  const improvementNotes = annotations.filter(annotation => annotation.type !== 'strong')
  const primaryImprovement = getPrimaryImprovementAnnotation(annotations, examiner.primaryImprovementId)
  const repairPrompt = primaryImprovement ? examiner.improvementPrompts?.[primaryImprovement.id] : null
  const editValue = primaryImprovement ? (studentEdits[primaryImprovement.id] || '') : ''

  useEffect(() => {
    if (!isImproving || !primaryImprovement) return undefined
    const id = setTimeout(() => expandedTextareaRef.current?.focus(), 120)
    return () => clearTimeout(id)
  }, [isImproving, primaryImprovement, expandedTextareaRef])

  if (isImproving && primaryImprovement) {
    return (
      <article style={{
        background: 'rgba(8,9,13,0.14)',
        borderLeft: `2px solid ${accent}88`,
        borderRadius: `0 ${RADII.medium}px ${RADII.medium}px 0`,
        padding: '20px 18px 22px 20px',
      }}>
        <div style={{ ...TYPE.displayCard, color: accent, marginBottom: 6 }}>
          {examiner.repairTitle || 'Fix one weakness'}
        </div>
        <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textSecondary, marginBottom: 22 }}>
          {examiner.repairInstruction || 'Keep the useful knowledge and add the missing link.'}
        </div>

        <div style={{ marginBottom: 18 }}>
          <div style={{ ...TYPE.label, color: GENERAL.cinematic.textMuted, marginBottom: 8 }}>
            {examiner.originalSentenceLabel || 'Original sentence'}
          </div>
          <div style={{ ...TYPE.body, color: GENERAL.cinematic.textFact, paddingLeft: 14, borderLeft: `2px solid ${accent}66` }}>
            {primaryImprovement.target}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ ...TYPE.label, color: GENERAL.cinematic.textMuted, marginBottom: 8 }}>
            {examiner.missingLinkLabel || 'What is missing'}
          </div>
          <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textSecondary }}>
            {repairPrompt?.prompt || primaryImprovement.comment}
          </div>
        </div>

        <label style={{ ...TYPE.label, display: 'block', color: GENERAL.cinematic.textMuted, marginBottom: 8 }} htmlFor={`fte-repair-${primaryImprovement.id}`}>
          {examiner.rewriteLabel || 'Your rewrite'}
        </label>
        <textarea
          id={`fte-repair-${primaryImprovement.id}`}
          ref={expandedTextareaRef}
          className="fte-textarea"
          rows={5}
          aria-label={`Rewrite: ${primaryImprovement.target}`}
          placeholder={repairPrompt?.placeholder || 'Rewrite the complete sentence here…'}
          value={editValue}
          onChange={event => setStudentEdits(previous => ({ ...previous, [primaryImprovement.id]: event.target.value }))}
        />

        <MarkedAnswerToggle accent={accent} answerSections={answerSections} segments={segments} examiner={examiner} />
      </article>
    )
  }

  if (isReveal) {
    return (
      <article style={{
        background: 'rgba(8,9,13,0.14)',
        borderLeft: `2px solid ${accent}88`,
        borderRadius: `0 ${RADII.medium}px ${RADII.medium}px 0`,
        padding: '4px 18px 18px 20px',
      }}>
        {annotations.length > 0 ? (
          <>
            <AnnotationList title={examiner.earnedMarksLabel || 'What earned marks'} notes={earnedNotes} accent={accent} />
            <AnnotationList title={examiner.nextMarkLabel || 'What stopped the next mark'} notes={improvementNotes} accent={accent} />
            <MarkedAnswerToggle accent={accent} answerSections={answerSections} segments={segments} examiner={examiner} />
          </>
        ) : (
          <AnswerContent accent={accent} answerSections={answerSections} segments={segments} />
        )}
      </article>
    )
  }

  return (
    <article style={{
      background: 'rgba(8,9,13,0.14)',
      borderLeft: `2px solid ${accent}88`,
      borderRadius: `0 ${RADII.medium}px ${RADII.medium}px 0`,
      padding: '18px 18px 20px 20px',
    }}>
      <AnswerContent accent={accent} answerSections={answerSections} segments={segments} />
    </article>
  )
}
