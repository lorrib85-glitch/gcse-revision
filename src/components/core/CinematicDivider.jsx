import { GENERAL } from '../../constants/generalTheme.js'
import { hexToRgb } from '../../constants/subjects.js'

const DIVIDER_WIDTHS = {
  compact: 64,
  standard: 96,
  wide: 144,
}

/**
 * Decorative line–diamond–line separator for cinematic and editorial screens.
 *
 * The surrounding component owns placement through `style`; this component owns
 * the motif, governed line colour and subject-accent treatment.
 */
export default function CinematicDivider({
  accent = GENERAL.teal,
  accentRgb,
  size = 'standard',
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
