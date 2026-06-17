// ─── Component Style Helpers ───────────────────────────────────────────────
//
// Use these functions to apply consistent typography and button styles
// across all pages and components. Never hardcode font sizes or button heights.
//
// Example:
//   <h1 style={screenHeading()}>Welcome back</h1>
//   <h2 style={sectionHeading()}>Your weak spots</h2>
//   <button style={buttonPrimary()}>Continue →</button>

import { TYPE } from './typography.js'
import { BUTTONS } from './buttons.js'
import { SPACING } from './spacing.js'
import { RADII } from './radii.js'

// ──────────────────────────────────────────────────────────────────────────
// HEADINGS & TEXT
// ──────────────────────────────────────────────────────────────────────────

/**
 * Main screen heading (e.g., Home hero "Good evening")
 * Uses TYPE.hero
 */
export const screenHeading = () => ({
  ...TYPE.hero,
})

/**
 * Section heading (e.g., "Weak zones", "Continue learning")
 * Uses TYPE.sectionTitle (28px, 600 weight)
 */
export const sectionHeading = () => ({
  ...TYPE.sectionTitle,
})

/**
 * Card/module title (e.g., module name on a card)
 * Uses TYPE.cardTitle (22px, 600 weight)
 */
export const cardHeading = () => ({
  ...TYPE.cardTitle,
})

/**
 * Subsection or small heading (e.g., topic name, quiz round label)
 * Uses bodySmall + 600 weight (16px, 600 weight)
 */
export const smallHeading = () => ({
  ...TYPE.bodySmall,
  fontWeight: 600,
})

/**
 * Body copy (standard reading text, descriptions)
 * Uses TYPE.body (18px, 400 weight)
 */
export const bodyText = () => ({
  ...TYPE.body,
})

/**
 * Small body text (secondary descriptions, metadata)
 * Uses TYPE.bodySmall (16px, 400 weight)
 */
export const smallText = () => ({
  ...TYPE.bodySmall,
})

/**
 * Metadata/label text (captions, timestamps, category tags)
 * Uses TYPE.metadata (14px, 500 weight, +0.08em letter-spacing)
 */
export const metadataText = () => ({
  ...TYPE.metadata,
})

/**
 * Cinematic/editorial text (full-screen reveals, story moments)
 * Uses TYPE.cinematic (38px, IBM Plex Serif, 600 weight)
 */
export const cinematicHeading = () => ({
  ...TYPE.cinematic,
})

// ──────────────────────────────────────────────────────────────────────────
// BUTTONS
// ──────────────────────────────────────────────────────────────────────────

/**
 * Primary CTA button (full-width "Continue →" buttons)
 * Height: 56px, large border-radius, accent color
 */
export const buttonPrimary = (accentColor = '#2BBE9A') => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: SPACING.sm,
  height: BUTTONS.primary.height,
  borderRadius: BUTTONS.primary.borderRadius,
  paddingX: BUTTONS.primary.paddingX,
  fontSize: BUTTONS.primary.fontSize,
  fontWeight: BUTTONS.primary.fontWeight,
  fontFamily: "'Sora', sans-serif",
  background: accentColor,
  color: '#F5F7FF',
  border: 'none',
  cursor: 'pointer',
  transition: BUTTONS.primary.transition,
  ':active': {
    transform: `scale(${BUTTONS.primary.pressScale})`,
  },
})

/**
 * Secondary button (supporting actions, less emphasis)
 * Height: 56px, medium border-radius, subtle background
 */
export const buttonSecondary = () => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: SPACING.sm,
  height: BUTTONS.secondary.height,
  borderRadius: BUTTONS.secondary.borderRadius,
  paddingX: BUTTONS.secondary.paddingX,
  fontSize: BUTTONS.secondary.fontSize,
  fontWeight: BUTTONS.secondary.fontWeight,
  fontFamily: "'Sora', sans-serif",
  background: 'rgba(255, 255, 255, 0.06)',
  color: '#F5F7FF',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  cursor: 'pointer',
  transition: BUTTONS.secondary.transition,
  ':active': {
    transform: `scale(${BUTTONS.secondary.pressScale})`,
  },
})

/**
 * Compact button (inline actions, "Try again", "Show hint")
 * Height: 44px, small border-radius, minimal visual weight
 */
export const buttonCompact = () => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: SPACING.xs,
  height: BUTTONS.compact.height,
  borderRadius: BUTTONS.compact.borderRadius,
  paddingX: BUTTONS.compact.paddingX,
  fontSize: BUTTONS.compact.fontSize,
  fontWeight: BUTTONS.compact.fontWeight,
  fontFamily: "'Sora', sans-serif",
  background: 'rgba(255, 255, 255, 0.06)',
  color: '#F5F7FF',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  cursor: 'pointer',
  transition: BUTTONS.compact.transition,
  ':active': {
    transform: `scale(${BUTTONS.compact.pressScale})`,
  },
})

/**
 * Text button (minimal, link-like actions)
 * No background, no border, just text with hover opacity
 */
export const buttonText = () => ({
  display: 'inline-block',
  fontSize: BUTTONS.text.fontSize,
  fontWeight: BUTTONS.text.fontWeight,
  fontFamily: "'Outfit', sans-serif",
  color: '#A89FC2',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  transition: BUTTONS.text.transition,
  opacity: BUTTONS.text.opacity,
  ':hover': {
    opacity: 0.72,
  },
})

// ──────────────────────────────────────────────────────────────────────────
// LAYOUT HELPERS
// ──────────────────────────────────────────────────────────────────────────

/**
 * Standard screen padding (left/right)
 */
export const screenPadding = {
  paddingLeft: SPACING.md,
  paddingRight: SPACING.md,
}

/**
 * Standard gap between stacked sections
 */
export const sectionGap = {
  marginTop: SPACING.lg,
}

/**
 * Standard gap between cards
 */
export const cardGap = {
  marginBottom: SPACING.sm,
}
