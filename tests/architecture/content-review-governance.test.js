import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const root = resolve(process.cwd())
const read = (rel) => readFileSync(resolve(root, rel), 'utf8')

const contentReview = read('.claude/skills/content-review/SKILL.md')
const patternGovernance = read('docs/system/PATTERN_GOVERNANCE.md')
const workflowC = read('docs/system/workflows/C_CONTENT_MODULE.md')
const brand = read('BRAND.md')

describe('content-review governance integration', () => {
  it('defines the canonical visual-review authority hierarchy in Pattern Governance and the skill', () => {
    for (const doc of [patternGovernance, contentReview]) {
      expect(doc).toContain('Visual-review authority hierarchy')
      expect(doc).toContain('Pattern Governance')
      expect(doc).toMatch(/Product UI Constitution|PRODUCT_UI_CONSTITUTION/)
      expect(doc).toMatch(/Typography System|TYPOGRAPHY_SYSTEM/)
      expect(doc).toMatch(/Subject Theme System|SUBJECT_THEME_SYSTEM/)
      expect(doc).toMatch(/Brand guidance|BRAND\.md/)
      expect(doc).toMatch(/must\s+not override the canonical systems above/)
    }
  })

  it('keeps audit-only as a zero-write mode', () => {
    expect(contentReview).toContain('zero repository writes')
    expect(contentReview).toContain('no review log, backlog entry, fixture update, generated')
    expect(contentReview).toMatch(/Persist findings only when\s+explicitly requested/)
    expect(contentReview).toContain('Create it if it doesn\'t exist outside\n`audit-only`')
  })

  it('allows Workflow C to consult visual governance during content review without authorising redesign', () => {
    expect(workflowC).toContain('During `/content-review`, brand, typography, subject-theme and product-UI')
    expect(workflowC).toContain('does not authorise creation of a new visual system')
    expect(workflowC).toContain('outside approved component and\n     token systems')
    expect(workflowC).toContain('Forbidden by default')
  })

  it('states the sentence-case default and limited uppercase exceptions', () => {
    for (const doc of [contentReview, patternGovernance, brand]) {
      expect(doc).toMatch(/Learning-screen titles, section headings|learning-screen titles, section headings/)
      expect(doc).toContain('use sentence case')
      expect(doc).toMatch(/Uppercase is permitted only|caps are for genuine compact/)
      expect(doc).toMatch(/compact scanning|scanning or notation/)
      expect(doc).toContain('diagram labels')
      expect(doc).toContain('established abbreviations')
    }
    expect(brand).not.toContain('Section labels (`label` style) must be UPPERCASE')
    expect(brand).not.toContain('Uppercase labels, kickers, topic markers')
  })

  it('requires mechanical visual hierarchy checks rather than vague branding review', () => {
    expect(contentReview).toContain('Mechanical visual-quality checklist')
    expect(contentReview).toContain('Each screen must have one unmistakable primary title')
    expect(contentReview).toContain('Supporting headings,\n  lead copy and labels must remain visually subordinate')
    expect(contentReview).toContain('must not compete through similar size, weight or contrast')
    expect(contentReview).toContain('Identify competing font weights')
    expect(contentReview).toContain('new hardcoded type values are not acceptable')
  })


  it('keeps Brand font guidance aligned with canonical Manrope and Sora typography', () => {
    expect(brand).toContain('Manrope and Sora only; no other font families')
    expect(brand).not.toMatch(/font-family ['"]Outfit['"]/)
    expect(brand).not.toContain('No new fonts: Sora and Outfit only')
  })

  it('uses asset-pipeline image review instead of extension-only approval', () => {
    expect(contentReview).toContain('approved asset pipeline')
    expect(contentReview).toContain('do not flag or\napprove solely by file extension')
    expect(brand).toContain('do not approve or reject an asset solely by file extension')
    expect(contentReview).not.toContain('`.webp`\npreferred')
    expect(brand).not.toContain('Always use `.png` extension')
  })
})
