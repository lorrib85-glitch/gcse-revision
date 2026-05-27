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
  // Subject atmosphere palette (matches LearningHeader)
  const PALETTES = {
    history: { base: '#C89B6D', rgb: '200,155,109', tint: 'rgba(200,155,109' },
    biology: { base: '#8FD6A3', rgb: '143,214,163', tint: 'rgba(143,214,163' },
    chemistry: { base: '#8B5CF6', rgb: '139,92,246', tint: 'rgba(139,92,246' },
    physics: { base: '#5DA9E9', rgb: '93,169,233', tint: 'rgba(93,169,233' },
    maths: { base: '#2BBE9A', rgb: '43,190,154', tint: 'rgba(43,190,154' },
    english: { base: '#9E3D52', rgb: '158,61,82', tint: 'rgba(158,61,82' },
    sociology: { base: '#C9B07C', rgb: '201,176,124', tint: 'rgba(201,176,124' },
  }

  const palette = PALETTES[subject?.toLowerCase()] || PALETTES.physics
  const atmosphereTint = showAtmosphere ? `${palette.tint},0.09)` : 'transparent'
  const atmosphereGlow = showAtmosphere ? `${palette.tint},0.06)` : 'transparent'
  const shadowTint = showAtmosphere ? `${palette.tint},0.08)` : 'rgba(0,0,0,0.2)'

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
