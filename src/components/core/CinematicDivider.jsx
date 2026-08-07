import { GENERAL } from '../../constants/generalTheme.js'
import { hexToRgb } from '../../constants/subjects.js'

const DIVIDER_WIDTHS = {
  compact: 80,
  standard: 96,
  wide: 144,
}

/**
 * Decorative line–diamond–line separator for cinematic and editorial screens.
 *
 * The component owns the motif, governed line colour, subject-accent treatment
 * and its default balanced alignment. Consumers can opt into start alignment
 * explicitly without rebuilding the divider locally.
 */
export default function CinematicDivider({
  accent = GENERAL.teal,
  accentRgb,
  size = 'standard',
  align = 'center',
  style,
}) {
  const resolvedAccentRgb = accentRgb || hexToRgb(accent)
  const width = DIVIDER_WIDTHS[size] || DIVIDER_WIDTHS.standard

  return (
    <div
      aria-hidden="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width,
        maxWidth: '100%',
        ...style,
        marginInline: align === 'center' ? 'auto' : undefined,
      }}
    >
      <span style={{ height: 1, flex: 1, background: GENERAL.line.medium }} />
      <span
        style={{
          width: 5,
          height: 5,
          flex: '0 0 5px',
          transform: 'rotate(45deg)',
          border: `1px solid rgba(${resolvedAccentRgb}, 0.62)`,
        }}
      />
      <span style={{ height: 1, flex: 1, background: GENERAL.line.medium }} />
    </div>
  )
}
