import { SUBJECTS } from '../../constants/subjects.js'

// ── CardContainer v1 — LOCKED COMPONENT ────────────────────────────────────
// Reusable cinematic content surface for learning modules.
// Subtle atmospheric container that supports readability and pacing.
// Content is the focus; surface almost disappears behind the learning.
//
// Props:
// - children: content
// - variant: 'contained' | 'inline' | 'compact' | 'fullBleed' (default: 'contained')
// - subject: subject key for subtle atmosphere
// - padding: 16 | 24 | 32 (default: 24 for contained, 16 for inline/compact, 32 for fullBleed)
// - contextImage: optional background image URL or imported asset
// - showAtmosphere: boolean (default: true)
export default function CardContainer({
  children,
  variant = 'contained',
  subject,
  padding,
  contextImage,
  showAtmosphere = true,
}) {
  // Resolve subject atmosphere from canonical SUBJECTS source
  const capitalised = subject ? subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase() : null
  const theme = (capitalised && SUBJECTS[capitalised]) || SUBJECTS.Physics
  const rgb = theme.accentRgb
  const tint = `rgba(${rgb}`

  const atmosphereTint = showAtmosphere ? `${tint},0.09)` : 'transparent'
  const atmosphereGlow = showAtmosphere ? `${tint},0.06)` : 'transparent'
  const shadowTint = showAtmosphere ? `${tint},0.08)` : 'rgba(0,0,0,0.2)'

  // ── Contained variant (default) ──
  if (variant === 'contained') {
    const p = padding ?? 24
    return (
      <div style={{
        margin: '20px 0',
        padding: `${p}px`,
        background: `linear-gradient(135deg, rgba(15,20,35,0.5) 0%, rgba(10,15,28,0.5) 100%), ${atmosphereTint}`,
        border: `1px solid rgba(255,255,255,0.08)`,
        borderRadius: 24,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: `
          0 0 1px ${atmosphereGlow},
          0 4px 16px ${shadowTint},
          inset 0 1px 1px rgba(255,255,255,0.05)
        `,
        overflow: 'hidden',
      }}>
        {children}
      </div>
    )
  }

  // ── Inline variant ──
  if (variant === 'inline') {
    const p = padding ?? 16
    return (
      <div style={{
        display: 'inline-block',
        margin: '12px 0',
        padding: `${p}px`,
        background: `rgba(255,255,255,0.03)`,
        border: `1px solid rgba(255,255,255,0.06)`,
        borderRadius: 14,
        boxShadow: `0 0 1px ${atmosphereGlow}`,
      }}>
        {children}
      </div>
    )
  }

  // ── Compact variant ──
  if (variant === 'compact') {
    const p = padding ?? 16
    return (
      <div style={{
        margin: '16px 0',
        padding: `${p}px`,
        background: `linear-gradient(135deg, rgba(15,20,35,0.4) 0%, rgba(10,15,28,0.4) 100%), ${atmosphereTint}`,
        border: `1px solid rgba(255,255,255,0.06)`,
        borderRadius: 20,
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        boxShadow: `0 2px 8px ${shadowTint}`,
      }}>
        {children}
      </div>
    )
  }

  // ── Full bleed variant ──
  if (variant === 'fullBleed') {
    const p = padding ?? 32
    return (
      <div style={{
        position: 'relative',
        margin: '28px -16px',
        padding: `${p}px 16px`,
        minHeight: 240,
        background: contextImage
          ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${contextImage}) center / cover`
          : `linear-gradient(135deg, rgba(10,15,28,0.8) 0%, rgba(8,12,24,0.8) 100%)`,
        backgroundAttachment: 'scroll',
        boxShadow: `inset 0 0 20px ${shadowTint}`,
        overflow: 'hidden',
      }}>
        {children}
      </div>
    )
  }

  return null
}
