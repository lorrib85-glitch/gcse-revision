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
 * Uses TYPE.screenHeading (Manrope, 800 weight)
 */
export const screenHeading = () => ({
  ...TYPE.screenHeading,
})

/**
 * Section heading (e.g., "Weak zones", "Continue learning")
 * Uses TYPE.sectionHeading (Manrope, 700/750 weight)
 */
export const sectionHeading = () => ({
  ...TYPE.sectionHeading,
})

/**
 * Card/module title (e.g., module name on a card)
 * Uses TYPE.cardTitle (Manrope, 700 weight)
 */
export const cardHeading = () => ({
  ...TYPE.cardTitle,
})

/**
 * Subsection or small heading (e.g., topic name, quiz round label)
 * Uses Manrope if it is genuinely a heading for hierarchy.
 */
export const smallHeading = () => ({
  ...TYPE.cardTitle,
  fontSize: '1rem',
})

/**
 * Body copy (standard reading text, descriptions)
 * Uses TYPE.bodyText (Sora, 400 weight)
 */
export const bodyText = () => ({
  ...TYPE.bodyText,
})

/**
 * Small body text (secondary descriptions, metadata)
 * Uses TYPE.bodySmallText (Sora, 400 weight)
 */
export const smallText = () => ({
  ...TYPE.bodySmallText,
})

/**
 * Metadata/label text (captions, timestamps, category tags)
 * Uses TYPE.metadataText (Sora, 600 weight, uppercase)
 */
export const metadataText = () => ({
  ...TYPE.metadataText,
})

/**
 * Cinematic/editorial text (full-screen reveals, story moments)
 * Uses TYPE.cinematic (Manrope, cinematic weight)
 */
export const cinematicHeading = () => ({
  ...TYPE.cinematic,
})

// ──────────────────────────────────────────────────────────────────────────
// BUTTONS
// ──────────────────────────────────────────────────────────────────────────

/**
 * Primary CTA button (full-width "Continue →" buttons)
 * Height: 58px, large border-radius, accent color, Sora 700
 */
export const buttonPrimary = (accentColor = '#2BBE9A') => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: SPACING.sm,
  height: BUTTONS.primary.height,
  borderRadius: BUTTONS.primary.borderRadius,
  paddingLeft: BUTTONS.primary.paddingX,
  paddingRight: BUTTONS.primary.paddingX,
  fontSize: TYPE.buttonText.fontSize,
  fontWeight: TYPE.buttonText.fontWeight,
  fontFamily: TYPE.buttonText.fontFamily,
  letterSpacing: TYPE.buttonText.letterSpacing,
  lineHeight: TYPE.buttonText.lineHeight,
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
 * Height: 56px, medium border-radius, subtle background, Sora 700
 */
export const buttonSecondary = () => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: SPACING.sm,
  height: BUTTONS.secondary.height,
  borderRadius: BUTTONS.secondary.borderRadius,
  paddingLeft: BUTTONS.secondary.paddingX,
  paddingRight: BUTTONS.secondary.paddingX,
  fontSize: TYPE.buttonText.fontSize,
  fontWeight: TYPE.buttonText.fontWeight,
  fontFamily: TYPE.buttonText.fontFamily,
  letterSpacing: TYPE.buttonText.letterSpacing,
  lineHeight: TYPE.buttonText.lineHeight,
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
 * Height: 44px, small border-radius, minimal visual weight, Sora 700
 */
export const buttonCompact = () => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: SPACING.xs,
  height: BUTTONS.compact.height,
  borderRadius: BUTTONS.compact.borderRadius,
  paddingLeft: BUTTONS.compact.paddingX,
  paddingRight: BUTTONS.compact.paddingX,
  fontSize: '0.88rem',
  fontWeight: TYPE.buttonText.fontWeight,
  fontFamily: TYPE.buttonText.fontFamily,
  letterSpacing: TYPE.buttonText.letterSpacing,
  lineHeight: TYPE.buttonText.lineHeight,
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
  fontSize: TYPE.buttonText.fontSize,
  fontWeight: TYPE.buttonText.fontWeight,
  fontFamily: TYPE.buttonText.fontFamily,
  letterSpacing: TYPE.buttonText.letterSpacing,
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
