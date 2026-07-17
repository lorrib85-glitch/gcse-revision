import { GENERAL } from '../../constants/generalTheme.js'
import { COMPONENT_SIZE, SPACING } from '../../constants/spacing.js'
import { RADII } from '../../constants/radii.js'
import { TYPE } from '../../constants/typography.js'
import { SUBJECTS } from '../../constants/subjects.js'

// ─── MemoryHook — in-page memory anchor ──────────────────────────────────────
// A compact, reusable content block that anchors one hard idea with a memorable
// analogy or mnemonic. It is deliberately passive: the hook should be understood
// at a glance without turning a reading screen into another interaction.
//
// Content component (Route A) — rendered inside a composed screen / the
// ModulePlayer content flow. It never owns a screen.
//
// block shape: {
//   label?: string,     // defaults to 'Memory hook'
//   hook: string,       // the analogy / mnemonic the author supplies
//   image?: string,     // optional square thumbnail (author-supplied)
//   imageAlt?: string,
// }
export default function MemoryHook({ block = {}, subject = 'Biology' }) {
  const theme = SUBJECTS[subject] || SUBJECTS.Biology
  const label = block.label || 'Memory hook'
  const hook = block.hook || ''

  return (
    <aside
      aria-label={label}
      style={{
        display: 'flex',
        gap: SPACING.compact,
        alignItems: 'flex-start',
        margin: `${SPACING.compact}px 0`,
        padding: SPACING.compact,
        background: GENERAL.backgroundSurface,
        border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.soft}`,
        borderLeft: `${COMPONENT_SIZE.accentRail}px solid ${theme.accent}`,
        borderRadius: RADII.medium,
      }}
    >
      {block.image && (
        <img
          src={block.image}
          alt={block.imageAlt || ''}
          style={{
            width: COMPONENT_SIZE.thumbnail,
            height: COMPONENT_SIZE.thumbnail,
            flexShrink: 0,
            objectFit: 'cover',
            borderRadius: RADII.small,
            border: `${COMPONENT_SIZE.hairline}px solid ${GENERAL.line.soft}`,
          }}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...TYPE.label, color: theme.accent, marginBottom: SPACING.micro }}>
          {label}
        </div>
        <p style={{ ...TYPE.body, color: GENERAL.softWhite, margin: 0 }}>
          {hook}
        </p>
      </div>
    </aside>
  )
}
