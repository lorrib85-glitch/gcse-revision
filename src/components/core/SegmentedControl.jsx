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
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
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
      {options.map(option => {
        const active = value === option.value
        const disabled = Boolean(option.disabled)

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            aria-disabled={disabled}
            disabled={disabled}
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
