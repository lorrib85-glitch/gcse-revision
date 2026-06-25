import { useState, useEffect } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { MOTION } from '../../constants/motion.js'
import { SPACING } from '../../constants/spacing.js'
import { BUTTONS } from '../../constants/buttons.js'
import { logWrongAnswer, logCorrectAnswer } from '../../unifiedWeaknessTracker.js'
import ContinueCTA from '../core/ContinueCTA.jsx'
import { TYPE } from '../../constants/typography.js'

export default function DragToOrderTask({
  items = [],           // [{ id, label, description? }, ...]
  subject = 'History',
  onComplete,
  backgroundImage,
}) {
  const subjectData = SUBJECTS[subject] || SUBJECTS.History
  const accent = subjectData.accent
  const rgb = subjectData.accentRgb

  const [currentOrder, setCurrentOrder] = useState(items.map(item => item.id))
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  // Correct order is the original order from props
  const correctOrder = items.map(item => item.id)
  const isOrderCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder)

  const orderedItems = currentOrder.map(id => items.find(item => item.id === id))

  function handleDragStart(e, index) {
    setDraggedItem(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e, index) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggedItem !== null && draggedItem !== index) {
      setDragOverIndex(index)
    }
  }

  function handleDragLeave() {
    setDragOverIndex(null)
  }

  function handleDrop(e, dropIndex) {
    e.preventDefault()
    if (draggedItem === null) return

    const newOrder = [...currentOrder]
    const draggedId = newOrder[draggedItem]
    newOrder.splice(draggedItem, 1)
    newOrder.splice(dropIndex, 0, draggedId)

    setCurrentOrder(newOrder)
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  function handleSubmit() {
    const correct = isOrderCorrect
    setSubmitted(true)
    setIsCorrect(correct)

    const questionText = items.map(item => item.label).join(', ')
    if (!correct) {
      logWrongAnswer({
        subject: subject,
        topic: 'Timeline ordering',
        questionId: `drag-order-${items.map(i => i.id).join('-')}`,
        questionText: `Put in order: ${questionText}`,
        source: 'module',
        questionType: 'sequence',
        marks: 1,
      })
    } else {
      logCorrectAnswer({
        subject: subject,
        topic: 'Timeline ordering',
        questionId: `drag-order-${items.map(i => i.id).join('-')}`,
        marks: 1,
      })
    }
  }

  function handleReset() {
    setCurrentOrder(items.map(item => item.id))
    setSubmitted(false)
    setIsCorrect(false)
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  function handleContinue() {
    onComplete?.()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: '#08090D',
      overflow: 'auto',
      display: 'flex', flexDirection: 'column',
    }}>
      <style>{`
        @keyframes dto-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Background image */}
      {backgroundImage && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          zIndex: 0, opacity: 1, pointerEvents: 'none',
        }} />
      )}

      {/* Dark overlay */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(8,9,13,0.88)',
        zIndex: 1, pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        flex: 1, display: 'flex', flexDirection: 'column',
        padding: `${SPACING.standard}px 20px`,
        maxWidth: 520, width: '100%', margin: '0 auto',
        boxSizing: 'border-box',
        justifyContent: 'flex-start',
        paddingTop: 80,
      }}>

        {/* Instruction */}
        <div style={{
          fontFamily: TYPE.bodyText.fontFamily,
          fontWeight: 700, fontSize: 26,
          lineHeight: 1.15, color: '#FFFFFF',
          marginBottom: SPACING.standard,
          animation: 'dto-fade-in 360ms cubic-bezier(0.22,1,0.36,1) both',
        }}>
          Put in chronological order
        </div>

        <div style={{
          fontFamily: TYPE.bodyText.fontFamily,
          fontSize: 13, color: 'rgba(255,255,255,0.64)',
          marginBottom: SPACING.large,
          animation: 'dto-fade-in 360ms cubic-bezier(0.22,1,0.36,1) 60ms both',
        }}>
          Drag items to arrange them by date (earliest first)
        </div>

        {/* Items list */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: SPACING.micro,
          marginBottom: SPACING.large,
        }}>
          {orderedItems.map((item, index) => {
            const isDragging = draggedItem === index
            const isDragOver = dragOverIndex === index
            const dragOpacity = isDragging ? 0.5 : 1

            return (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                style={{
                  padding: `${SPACING.small}px ${SPACING.standard}px`,
                  background: 'rgba(36,22,11,0.72)',
                  border: `1px solid ${isDragOver ? accent : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 14,
                  cursor: isDragging ? 'grabbing' : 'grab',
                  opacity: dragOpacity,
                  boxShadow: isDragOver ? `0 0 0 2px ${accent}` : 'none',
                  transform: isDragging ? 'scale(1.03) translateY(-4px)' : 'scale(1)',
                  transition: isDragging ? 'none' : `all ${MOTION.duration.instant} ease`,
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.small }}>
                  {/* Drag handle */}
                  <div style={{
                    fontSize: '1.2rem', color: accent, flexShrink: 0,
                  }}>
                    ⋮⋮
                  </div>

                  {/* Item content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: TYPE.bodyText.fontFamily,
                      fontWeight: 600, fontSize: 15,
                      color: '#FFFFFF', marginBottom: 4,
                    }}>
                      {index + 1}. {item.label}
                    </div>
                    {item.description && (
                      <div style={{
                        fontFamily: TYPE.bodyText.fontFamily,
                        fontSize: 12, color: 'rgba(255,255,255,0.52)',
                      }}>
                        {item.description}
                      </div>
                    )}
                  </div>

                  {/* Feedback icons */}
                  {submitted && (
                    <div style={{
                      fontSize: '1.4rem', flexShrink: 0,
                      animation: 'dto-fade-in 300ms ease both',
                    }}>
                      {index === correctOrder.indexOf(item.id) ? '✓' : '✗'}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Feedback message */}
        {submitted && (
          <div style={{
            padding: `${SPACING.small}px ${SPACING.standard}px`,
            background: isCorrect ? 'rgba(72,178,80,0.12)' : 'rgba(232,76,69,0.12)',
            border: `1px solid ${isCorrect ? 'rgba(72,178,80,0.3)' : 'rgba(232,76,69,0.3)'}`,
            borderRadius: 12,
            marginBottom: SPACING.large,
            animation: 'dto-fade-in 300ms ease both',
          }}>
            <div style={{
              fontFamily: TYPE.bodyText.fontFamily,
              fontWeight: 700, fontSize: 14,
              color: isCorrect ? '#48B250' : '#E84C45',
              marginBottom: 4,
            }}>
              {isCorrect ? '✓ Perfect!' : '✗ Not quite'}
            </div>
            <div style={{
              fontFamily: TYPE.bodyText.fontFamily,
              fontSize: 13, color: 'rgba(255,255,255,0.64)',
            }}>
              {isCorrect
                ? 'You got the chronological order right!'
                : 'Check the dates and try again — the order should follow the timeline.'}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{
          display: 'flex', gap: SPACING.small, marginTop: 'auto',
        }}>
          {!submitted ? (
            <button
              onClick={handleSubmit}
              style={{
                flex: 1, height: 48,
                background: accent, border: 'none', borderRadius: 12,
                fontFamily: TYPE.bodyText.fontFamily, fontWeight: 700, fontSize: 15,
                color: '#08090D', cursor: 'pointer',
                transition: `all ${MOTION.duration.instant} ease`,
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.85'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Check order →
            </button>
          ) : (
            <>
              <button
                onClick={handleReset}
                style={{
                  flex: 1, height: BUTTONS.continue.height,
                  background: 'rgba(255,255,255,0.08)', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: BUTTONS.continue.borderRadius,
                  fontFamily: TYPE.bodyText.fontFamily, fontWeight: 700, fontSize: 15,
                  color: 'rgba(255,255,255,0.72)', cursor: 'pointer',
                  transition: `all ${MOTION.duration.instant} ease`,
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.12)'
                  e.target.style.color = '#FFFFFF'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.08)'
                  e.target.style.color = 'rgba(255,255,255,0.72)'
                }}
              >
                Try again
              </button>
              <div style={{ flex: 1 }}>
                <ContinueCTA
                  onClick={handleContinue}
                  accent={accent}
                  onMouseEnter={(e) => e.target.style.opacity = '0.85'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                />
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
