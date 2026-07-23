import { useRef, useState } from 'react'
import { GENERAL } from '../../constants/generalTheme.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'

export default function ScoreNumberLine({
  value,
  max = 8,
  min = 0,
  onChange,
  accent = GENERAL.teal,
  label = 'Score',
  disabled = false,
}) {
  const trackRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [focused, setFocused] = useState(false)
  const scores = Array.from({ length: Math.max(1, max - min + 1) }, (_, index) => min + index)
  const selected = typeof value === 'number' ? Math.min(max, Math.max(min, value)) : null
  const selectedIndex = selected === null ? -1 : scores.indexOf(selected)
  const percent = selectedIndex < 0 || scores.length <= 1 ? 0 : (selectedIndex / (scores.length - 1)) * 100
  const edgeOffsetPercent = 50 / scores.length
  const trackWidthPercent = 100 - (edgeOffsetPercent * 2)
  const dense = scores.length > 13
  const labelInterval = scores.length > 17 ? 4 : dense ? 2 : 1

  function selectFromClientX(clientX) {
    const bounds = trackRef.current?.getBoundingClientRect()
    if (!bounds || disabled) return

    const edgeInset = bounds.width / (scores.length * 2)
    const usableWidth = Math.max(1, bounds.width - (edgeInset * 2))
    const ratio = Math.min(1, Math.max(0, (clientX - bounds.left - edgeInset) / usableWidth))
    const next = min + Math.round(ratio * (max - min))
    onChange?.(next)
  }

  function handlePointerDown(event) {
    if (disabled) return
    setDragging(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
    selectFromClientX(event.clientX)
  }

  function handlePointerMove(event) {
    if (dragging) selectFromClientX(event.clientX)
  }

  function handlePointerUp(event) {
    setDragging(false)
    event.currentTarget.releasePointerCapture?.(event.pointerId)
  }

  function handleKeyDown(event) {
    if (disabled) return
    const current = selected ?? min
    let next = current

    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = Math.min(max, current + 1)
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = Math.max(min, current - 1)
    else if (event.key === 'Home') next = min
    else if (event.key === 'End') next = max
    else return

    event.preventDefault()
    onChange?.(next)
  }

  return (
    <div style={{ width: '100%' }}>
      <div
        ref={trackRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-orientation="horizontal"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={selected ?? undefined}
        aria-valuetext={selected === null ? 'No mark selected' : `${selected} out of ${max}`}
        aria-disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => setDragging(false)}
        style={{
          position: 'relative',
          width: '100%',
          padding: '14px 0 4px',
          borderRadius: RADII.medium,
          outline: 'none',
          boxShadow: focused ? `0 0 0 2px ${accent}66` : 'none',
          cursor: disabled ? 'default' : dragging ? 'grabbing' : 'pointer',
          touchAction: 'none',
          transition: 'box-shadow 160ms ease',
        }}
      >
        <div style={{
          position: 'absolute',
          left: `${edgeOffsetPercent}%`,
          right: `${edgeOffsetPercent}%`,
          top: 34,
          height: 2,
          borderRadius: RADII.pill,
          background: GENERAL.line.strong,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          left: `${edgeOffsetPercent}%`,
          top: 34,
          width: `calc(${trackWidthPercent}% * ${percent / 100})`,
          height: 2,
          borderRadius: RADII.pill,
          background: selected === null ? 'transparent' : accent,
          transition: dragging ? 'none' : 'width 180ms ease',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${scores.length}, minmax(0, 1fr))`,
          position: 'relative',
          zIndex: 1,
          pointerEvents: 'none',
        }}>
          {scores.map(score => {
            const isSelected = score === selected
            const isPast = selected !== null && score < selected
            const showLabel = isSelected || score === min || score === max || ((score - min) % labelInterval === 0)
            const restDotSize = dense ? 14 : 18

            return (
              <span
                key={score}
                aria-hidden="true"
                style={{
                  minWidth: 0,
                  minHeight: 52,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: 8,
                }}
              >
                <span style={{
                  width: isSelected ? 28 : restDotSize,
                  height: isSelected ? 28 : restDotSize,
                  marginTop: isSelected ? 0 : (28 - restDotSize) / 2,
                  borderRadius: RADII.pill,
                  display: 'grid',
                  placeItems: 'center',
                  background: isSelected ? accent : isPast ? `${accent}55` : GENERAL.surfaceTint,
                  border: `1px solid ${isSelected ? accent : isPast ? `${accent}66` : GENERAL.line.strong}`,
                  boxShadow: isSelected ? `0 0 0 4px ${accent}18` : 'none',
                  transition: dragging ? 'none' : 'all 160ms ease',
                }}>
                  {isSelected && <span style={{ width: 8, height: 8, borderRadius: RADII.pill, background: GENERAL.textOnAccent }} />}
                </span>
                <span style={{
                  ...TYPE.bodySmall,
                  minHeight: 16,
                  fontSize: dense ? 11 : 12,
                  fontWeight: isSelected ? 800 : 700,
                  color: isSelected ? accent : isPast ? GENERAL.cinematic.textSecondary : GENERAL.cinematic.textSubtle,
                  visibility: showLabel ? 'visible' : 'hidden',
                }}>
                  {score}
                </span>
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
