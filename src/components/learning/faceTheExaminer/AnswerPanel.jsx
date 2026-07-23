import { useEffect, useState } from 'react'
import { GENERAL } from '../../../constants/generalTheme.js'
import { RADII } from '../../../constants/radii.js'
import { TYPE } from '../../../constants/typography.js'
import { annotationDot, annotationStyle, buildAnswerSections, getPrimaryImprovementAnnotation } from './utils.js'

function annotationLabel(annotation, examiner) {
  if (annotation.type === 'strong') return examiner.annotationStrengthLabel || 'Earned a mark'
  if (annotation.type === 'irrelevant') return examiner.annotationIrrelevantLabel || 'Not needed'
  return examiner.annotationImprovementLabel || 'Needs improvement'
}

function AnswerContent({
  accent,
  answerSections,
  segments,
  annotations = [],
  interactive = false,
  selectedAnnotationId,
  onSelectAnnotation,
}) {
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
      {segments.map((segment, index) => {
        if (segment.type === 'plain') return <span key={index}>{segment.text}</span>

        const annotationIndex = annotations.findIndex(annotation => annotation.id === segment.ann.id)
        const annotationNumber = annotationIndex >= 0 ? annotationIndex + 1 : null
        const colour = annotationDot(segment.ann.type, accent)
        const selected = selectedAnnotationId === segment.ann.id

        if (!interactive) {
          return <span key={index} style={annotationStyle(segment.ann.type, accent)}>{segment.text}</span>
        }

        return (
          <button
            key={index}
            type="button"
            className="fte-annotation-target"
            aria-pressed={selected}
            aria-label={`Annotation ${annotationNumber}: ${segment.ann.comment}`}
            onClick={() => onSelectAnnotation?.(segment.ann.id)}
            style={{
              display: 'inline',
              padding: '1px 2px',
              margin: '0 1px',
              border: 'none',
              borderBottom: `1.5px solid ${colour}`,
              borderRadius: 3,
              background: selected ? `${colour}18` : 'transparent',
              color: 'inherit',
              font: 'inherit',
              lineHeight: 'inherit',
              cursor: 'pointer',
              boxDecorationBreak: 'clone',
              WebkitBoxDecorationBreak: 'clone',
              transition: 'background 160ms ease, box-shadow 160ms ease',
              boxShadow: selected ? `0 0 0 1px ${colour}44` : 'none',
            }}
          >
            {segment.text}
            {annotationNumber !== null && (
              <span
                aria-hidden="true"
                style={{
                  display: 'inline-grid',
                  placeItems: 'center',
                  width: 18,
                  height: 18,
                  marginLeft: 4,
                  borderRadius: RADII.pill,
                  background: colour,
                  color: GENERAL.textOnAccent,
                  fontSize: 10,
                  fontWeight: 800,
                  lineHeight: 1,
                  verticalAlign: '0.12em',
                }}
              >
                {annotationNumber}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function AnnotationNote({ annotation, annotationNumber, accent, examiner }) {
  if (!annotation) return null
  const colour = annotationDot(annotation.type, accent)

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        marginTop: 18,
        padding: '14px 16px',
        borderLeft: `2px solid ${colour}`,
        borderRadius: `0 ${RADII.small}px ${RADII.small}px 0`,
        background: `${colour}0F`,
        animation: 'fte-panel-up 220ms ease both',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
        <span style={{
          display: 'inline-grid',
          placeItems: 'center',
          width: 22,
          height: 22,
          borderRadius: RADII.pill,
          background: colour,
          color: GENERAL.textOnAccent,
          fontSize: 11,
          fontWeight: 800,
        }}>
          {annotationNumber}
        </span>
        <span style={{ ...TYPE.label, color: colour }}>
          {annotationLabel(annotation, examiner)}
        </span>
      </div>
      <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textSecondary }}>
        {annotation.comment}
      </div>
    </div>
  )
}

function MarkedAnswerToggle({ accent, answerSections, segments, annotations, examiner }) {
  const [open, setOpen] = useState(false)
  const [selectedAnnotationId, setSelectedAnnotationId] = useState(null)
  const selectedAnnotation = annotations.find(annotation => annotation.id === selectedAnnotationId) || null
  const selectedAnnotationNumber = selectedAnnotation
    ? annotations.findIndex(annotation => annotation.id === selectedAnnotation.id) + 1
    : null

  function toggleOpen() {
    setOpen(previous => {
      const next = !previous
      if (next && !selectedAnnotationId && annotations.length > 0) setSelectedAnnotationId(annotations[0].id)
      return next
    })
  }

  return (
    <div style={{ marginTop: 10 }}>
      <button
        type="button"
        className="fte-marked-toggle"
        aria-expanded={open}
        onClick={toggleOpen}
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
        <span>{examiner.markedAnswerToggleLabel || 'Review the marked answer'}</span>
        <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1, transform: open ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 180ms ease' }}>+</span>
      </button>

      {open && (
        <div style={{ padding: '16px 0 8px', borderTop: `1px solid ${GENERAL.line.faint}`, animation: 'fte-panel-up 260ms ease both' }}>
          {annotations.length > 0 && (
            <div style={{ ...TYPE.bodySmall, color: GENERAL.cinematic.textMuted, marginBottom: 14 }}>
              {examiner.annotationInstruction || 'Tap a numbered highlight to see the examiner’s note.'}
            </div>
          )}
          <AnswerContent
            accent={accent}
            answerSections={answerSections}
            segments={segments}
            annotations={annotations}
            interactive={annotations.length > 0}
            selectedAnnotationId={selectedAnnotationId}
            onSelectAnnotation={setSelectedAnnotationId}
          />
          <AnnotationNote
            annotation={selectedAnnotation}
            annotationNumber={selectedAnnotationNumber}
            accent={accent}
            examiner={examiner}
          />
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

        <MarkedAnswerToggle
          accent={accent}
          answerSections={answerSections}
          segments={segments}
          annotations={annotations}
          examiner={examiner}
        />
      </article>
    )
  }

  if (isReveal) {
    return (
      <article>
        <MarkedAnswerToggle
          accent={accent}
          answerSections={answerSections}
          segments={segments}
          annotations={annotations}
          examiner={examiner}
        />
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
