import { useRef } from 'react'
import { GENERAL } from '../../constants/generalTheme.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'

/**
 * Shared two-or-more option switcher for stable, mutually exclusive views.
 * Subject identity is supplied through `accent`; disabled options remain visible
 * so the learner can understand the sequence without being able to skip it.
 *
 * `variant="tabs"` presents each option as a clearly separate tab box. Use it
 * when switching views is part of the task and needs stronger affordance than a
 * compact segmented control.
 */
export default function SegmentedControl({
  options,
  value,
  onChange,
  accent,
  ariaLabel = 'Choose a view',
  variant = 'segmented',
}) {
  const buttonRefs = useRef([])
  const enabledOptions = options.filter(option => !option.disabled)
  const activeEnabledIndex = enabledOptions.findIndex(option => option.value === value)
  const isTabVariant = variant === 'tabs'

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
        gap: isTabVariant ? 8 : 4,
        width: '100%',
        padding: isTabVariant ? 0 : 4,
        borderRadius: RADII.medium,
        border: isTabVariant ? 'none' : `1px solid ${GENERAL.line.soft}`,
        background: isTabVariant ? 'transparent' : GENERAL.backgroundSunken,
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
              minHeight: isTabVariant ? 54 : 46,
              padding: isTabVariant ? '0 14px' : '0 10px',
              borderRadius: isTabVariant ? `${RADII.medium}px ${RADII.medium}px ${RADII.small}px ${RADII.small}px` : RADII.small,
              border: isTabVariant
                ? `1px solid ${active ? `${accent}88` : GENERAL.line.medium}`
                : 'none',
              background: isTabVariant
                ? (active ? GENERAL.backgroundSurface : 'rgba(8,9,13,0.56)')
                : (active ? GENERAL.surfaceTint : 'transparent'),
              color: active
                ? accent
                : (isTabVariant ? GENERAL.cinematic.textSecondary : GENERAL.cinematic.textMuted),
              boxShadow: isTabVariant
                ? (active
                    ? `inset 0 -3px 0 ${accent}, 0 10px 24px rgba(0,0,0,0.24)`
                    : `inset 0 1px 0 ${GENERAL.line.faint}`)
                : (active ? `inset 0 -2px 0 ${accent}` : 'none'),
              cursor: disabled ? 'default' : 'pointer',
              opacity: disabled ? 0.34 : 1,
              transition: 'background 180ms ease, border-color 180ms ease, color 180ms ease, box-shadow 180ms ease, opacity 180ms ease',
            }}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
