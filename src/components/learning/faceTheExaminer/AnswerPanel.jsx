import { SPACING } from '../../../constants/spacing.js'
import { TYPE } from '../../../constants/typography.js'
import { ANN_DOT, ANN_STYLES, buildAnswerSections } from './utils.js'

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

  return (
    <div style={{
      background: 'linear-gradient(180deg, rgba(245,238,225,0.055), rgba(8,9,13,0.22))',
      border: '1px solid rgba(245,238,225,0.09)',
      borderRadius: 22,
      padding: '18px 18px',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 18px 50px rgba(0,0,0,0.28)',
    }}>
      {(isReveal || isImproving) && (
        <div style={{ ...TYPE.overlayEyebrow, color: 'rgba(255,255,255,0.36)', marginBottom: 12 }}>
          Examiner annotations
        </div>
      )}

      {segments.length === 0 ? (
        <div style={{ display: 'grid', gap: 18 }}>
          {answerSections.map((section, index) => (
            <section
              key={`${section.label}-${index}`}
              style={{
                paddingLeft: answerSections.length > 1 ? 14 : 0,
                borderLeft: answerSections.length > 1 ? `2px solid ${index === 0 ? `${accent}66` : 'rgba(245,238,225,0.12)'}` : 'none',
              }}
            >
              {answerSections.length > 1 && (
                <div style={{
                  ...TYPE.bodySmall,
                  color: index === 0 ? `rgba(245,238,225,0.62)` : accent,
                  fontWeight: 800,
                  fontSize: 12,
                  letterSpacing: '0.05em',
                  marginBottom: 7,
                }}>
                  {section.label}
                </div>
              )}
              <div style={{ ...TYPE.examAnswerText, color: 'rgba(245,238,225,0.86)' }}>
                {section.text}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div style={{ ...TYPE.examAnswerText, color: 'rgba(245,238,225,0.9)' }}>
          {segments.map((seg, i) => {
            if (seg.type === 'plain') return <span key={i}>{seg.text}</span>
            const { ann } = seg
            const isWeak = ann.type === 'weak'
            const isExpanded = expandedEdit === ann.id
            const hasEdit = studentEdits[ann.id]?.trim()
            return (
              <span key={i}>
                <span style={ANN_STYLES[ann.type] || {}}>{seg.text}</span>
                {isImproving && isWeak && (
                  <>
                    {' '}
                    <button
                      className={`fte-improve-btn${hasEdit ? ' edited' : ''}`}
                      onClick={() => {
                        const next = isExpanded ? null : ann.id
                        setExpandedEdit(next)
                        if (next) setTimeout(() => expandedTextareaRef.current?.focus(), 50)
                      }}
                    >
                      {hasEdit ? '✓ edited' : (examiner.improvementPrompts?.[ann.id]?.prompt || '+ improve')}
                    </button>
                    {isExpanded && (
                      <span style={{ display: 'block' }}>
                        <textarea
                          ref={expandedTextareaRef}
                          className="fte-textarea"
                          rows={3}
                          placeholder={examiner.improvementPrompts?.[ann.id]?.placeholder || 'Add your improvement here…'}
                          value={studentEdits[ann.id] || ''}
                          onChange={e => setStudentEdits(prev => ({ ...prev, [ann.id]: e.target.value }))}
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

      {(isReveal || isImproving) && (
        <div style={{ marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
          <div style={{ ...TYPE.overlayEyebrow, color: 'rgba(255,255,255,0.36)', marginBottom: 10 }}>
            Examiner notes
          </div>
          {(examiner.annotations || []).map(ann => (
            <div key={ann.id} style={{ display: 'flex', alignItems: 'flex-start', gap: SPACING.micro, marginBottom: SPACING.micro }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0, background: ANN_DOT[ann.type] || 'rgba(255,255,255,0.3)' }} />
              <div style={{ ...TYPE.bodySmallText, color: 'rgba(255,255,255,0.55)' }}>
                {ann.comment}
              </div>
            </div>
          ))}
        </div>
      )}

      {isImproving && (
        <div style={{ ...TYPE.overlayEyebrow, marginTop: 20, color: accent }}>
          Push it up a grade
        </div>
      )}
    </div>
  )
}
