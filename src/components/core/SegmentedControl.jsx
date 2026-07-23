import { useRef } from 'react'
import { GENERAL } from '../../constants/generalTheme.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'

/**
 * Shared two-or-more option switcher for stable, mutually exclusive views.
 * Subject identity is supplied through `accent`; disabled options remain visible
 * so the learner can understand the sequence without being able to skip it.
 */
export default function SegmentedControl({
  options,
  value,
  onChange,
  accent,
  ariaLabel = 'Choose a view',
}) {
  const buttonRefs = useRef([])
  const enabledOptions = options.filter(option => !option.disabled)
  const activeEnabledIndex = enabledOptions.findIndex(option => option.value === value)

  function moveFocus(direction) {
    if (enabledOptions.length === 0) return
    const currentIndex = activeEnabledIndex >= 0 ? activeEnabledIndex : 0
    const nextIndex = (currentIndex + direction + enabledOptions.length) % enabledOptions.length
    const nextOption = enabledOptions[nextIndex]
    onChange?.(nextOption.value)
    const optionIndex = options.findIndex(option => option.value === nextOption.value)
    buttonRefs.current[optionIndex]?.focus()
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      moveFocus(1)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      moveFocus(-1)
    } else if (event.key === 'Home' && enabledOptions.length > 0) {
      event.preventDefault()
      onChange?.(enabledOptions[0].value)
      const optionIndex = options.findIndex(option => option.value === enabledOptions[0].value)
      buttonRefs.current[optionIndex]?.focus()
    } else if (event.key === 'End' && enabledOptions.length > 0) {
      event.preventDefault()
      const lastOption = enabledOptions[enabledOptions.length - 1]
      onChange?.(lastOption.value)
      const optionIndex = options.findIndex(option => option.value === lastOption.value)
      buttonRefs.current[optionIndex]?.focus()
    }
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        gap: 4,
        width: '100%',
        padding: 4,
        borderRadius: RADII.medium,
        border: `1px solid ${GENERAL.line.soft}`,
        background: GENERAL.backgroundSunken,
      }}
    >
      {options.map((option, index) => {
        const active = value === option.value
        const disabled = Boolean(option.disabled)
        const firstEnabled = enabledOptions[0]?.value === option.value

        return (
          <button
            ref={element => { buttonRefs.current[index] = element }}
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            aria-disabled={disabled}
            disabled={disabled}
            tabIndex={active || (activeEnabledIndex === -1 && firstEnabled) ? 0 : -1}
            onClick={() => !disabled && onChange?.(option.value)}
            style={{
              ...TYPE.label,
              minWidth: 0,
              minHeight: 46,
              padding: '0 10px',
              borderRadius: RADII.small,
              border: 'none',
              background: active ? GENERAL.surfaceTint : 'transparent',
              color: active ? accent : GENERAL.cinematic.textMuted,
              boxShadow: active ? `inset 0 -2px 0 ${accent}` : 'none',
              cursor: disabled ? 'default' : 'pointer',
              opacity: disabled ? 0.34 : 1,
              transition: 'background 180ms ease, color 180ms ease, box-shadow 180ms ease, opacity 180ms ease',
            }}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
