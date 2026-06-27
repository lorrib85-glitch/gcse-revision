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
      background: 'rgba(255,255,255,0.035)',
      border: '1px solid rgba(255,255,255,0.055)',
      borderRadius: 18,
      padding: '15px 15px',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
    }}>
      {(isReveal || isImproving) && (
        <div style={{ ...TYPE.overlayEyebrow, color: 'rgba(255,255,255,0.36)', marginBottom: 12 }}>
          Examiner annotations
        </div>
      )}

      {segments.length === 0 ? (
        <div style={{ display: 'grid', gap: 12 }}>
          {answerSections.map((section, index) => (
            <div
              key={`${section.label}-${index}`}
              style={{
                borderRadius: answerSections.length > 1 ? 14 : 0,
                padding: answerSections.length > 1 ? '12px 12px' : 0,
                background: answerSections.length > 1 ? 'rgba(0,0,0,0.16)' : 'transparent',
                border: answerSections.length > 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              {answerSections.length > 1 && (
                <div style={{ ...TYPE.overlayEyebrow, color: accent, marginBottom: 7 }}>
                  {section.label}
                </div>
              )}
              <div style={{ ...TYPE.examAnswerText, color: 'rgba(245,238,225,0.88)' }}>
                {section.text}
              </div>
            </div>
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
