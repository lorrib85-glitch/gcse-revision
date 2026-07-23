import { describe, expect, it } from 'vitest'
import { GENERAL } from '../../src/constants/generalTheme.js'
import { SUBJECTS } from '../../src/constants/subjects.js'

function relativeLuminance(hex) {
  const channels = hex
    .replace('#', '')
    .match(/.{2}/g)
    .map(channel => parseInt(channel, 16) / 255)
    .map(channel => (
      channel <= 0.04045
        ? channel / 12.92
        : ((channel + 0.055) / 1.055) ** 2.4
    ))

  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2])
}

function contrastRatio(first, second) {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second))
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second))
  return (lighter + 0.05) / (darker + 0.05)
}

describe('English subject theme contrast', () => {
  const english = SUBJECTS.English

  it('keeps the primary rosewood readable on both English backgrounds', () => {
    expect(contrastRatio(english.accent, english.background)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio(english.accent, english.backgroundSecondary)).toBeGreaterThanOrEqual(4.5)
  })

  it('keeps accent-filled controls readable with the shared foreground token', () => {
    expect(contrastRatio(GENERAL.textOnAccent, english.accent)).toBeGreaterThanOrEqual(4.5)
  })

  it('retains deep oxblood as a supporting literary shade rather than the readable accent', () => {
    expect(english.palette.oxblood).toBe('#6A343D')
    expect(english.accentTertiary).toBe(english.palette.oxblood)
  })
})
