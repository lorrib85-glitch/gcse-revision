import { describe, it, expect } from 'vitest'
import {
  FUNCTION_TAGS,
  SCREEN_TYPE_FUNCTIONS,
  getTypeInfo,
  isPassive,
  isAssessed,
} from '../../src/data/componentFunctions.js'
import {
  fleschKincaidGrade,
  stripExamVocabulary,
  collectLearnerText,
  guardrailViolations,
  sentenceCaseViolations,
  violationFingerprints,
} from '../../src/data/contentQualityChecks.js'
import { MODULES } from '../../src/modules.js'
import { MODULE_CONTENT_LOADERS } from '../../src/content/moduleContentRegistry.js'
// This file is the CI regression floor: it enumerates every built episode
// and keeps shrink-only grandfather allowlists so `pnpm verify` catches new
// violations without re-litigating known ones. The actual check functions
// (guardrailViolations, sentenceCaseViolations, etc.) live in
// src/data/contentQualityChecks.js and take a single episode with no
// registry involved — that's what scripts/check-content-quality.mjs uses
// for a live, on-demand check of any one module, which is what
// content-review runs. This file's enumeration is a property of being a
// regression gate, not a requirement of the checks themselves.

async function loadBuiltEpisodes() {
  const builtModules = MODULES.filter(mod => mod.screenCount > 0)
  const episodes = await Promise.all(builtModules.map(async mod => {
    const loader = MODULE_CONTENT_LOADERS[mod.id]
    expect(loader, `${mod.id} has no content loader`).toBeTypeOf('function')
    return loader()
  }))
  return episodes.filter(ep => (ep.screens ?? []).length > 0)
}

const ALL_EPISODES = await loadBuiltEpisodes()

// Every display type used by real content, gathered from screens and their
// nested blocks. Types inside answer options (e.g. 'weak'/'strong' evidence
// labels) are not display types and are excluded by only walking
// screen.type and screen.blocks[].type.
function collectUsedTypes() {
  const types = new Set()
  for (const ep of ALL_EPISODES) {
    for (const screen of ep.screens ?? []) {
      if (screen.type) types.add(screen.type)
      for (const block of screen.blocks ?? []) {
        if (block.type) types.add(block.type)
      }
    }
  }
  return [...types].sort()
}

describe('Component function taxonomy', () => {
  it('defines the nine agreed function tags', () => {
    expect(FUNCTION_TAGS).toEqual([
      'hook-tension',
      'introduce-figure',
      'teach-mechanism',
      'teach-comparison',
      'apply',
      'classify',
      'sequence-process',
      'retrieve',
      'exam-technique',
    ])
  })

  it('every display type used in built content is registered', () => {
    const unregistered = collectUsedTypes().filter(t => !SCREEN_TYPE_FUNCTIONS[t])
    expect(unregistered, `unregistered display types: ${unregistered.join(', ')}`).toEqual([])
  })

  it('every registered type has valid functions and an interaction class', () => {
    for (const [type, info] of Object.entries(SCREEN_TYPE_FUNCTIONS)) {
      expect(info.functions.length, `${type} has no functions`).toBeGreaterThan(0)
      for (const fn of info.functions) {
        expect(FUNCTION_TAGS, `${type} has unknown function "${fn}"`).toContain(fn)
      }
      expect(['passive', 'reveal', 'assessed'], `${type} interaction`).toContain(info.interaction)
    }
  })

  it('helpers agree with the map', () => {
    expect(isPassive('read')).toBe(true)
    expect(isAssessed('quiz')).toBe(true)
    expect(isPassive('quiz')).toBe(false)
    expect(getTypeInfo('read').functions).toContain('teach-mechanism')
    expect(getTypeInfo('nonexistent-type')).toBeNull()
  })
})

// ─── Readability helper ────────────────────────────────────────────────

describe('Readability helper', () => {
  it('scores simple text at a low grade', () => {
    const simple = 'The dog ran to the park. It was a warm day. The boy threw the ball.'
    expect(fleschKincaidGrade(simple)).toBeLessThan(4)
  })

  it('scores dense academic text at a high grade', () => {
    const dense =
      'Notwithstanding contemporaneous epidemiological understanding, practitioners persistently administered counterproductive interventions, exacerbating physiological deterioration.'
    expect(fleschKincaidGrade(dense)).toBeGreaterThan(12)
  })

  it('exam vocabulary is neutralised before scoring', () => {
    const text = 'Miasma explained disease as bad air.'
    const stripped = stripExamVocabulary(text)
    expect(stripped).not.toMatch(/miasma/i)
    expect(fleschKincaidGrade(stripped)).toBeLessThanOrEqual(fleschKincaidGrade(text))
  })

  it('collects learner-facing strings from a screen', () => {
    const screen = {
      heading: 'Doctors could finally see inside the body.',
      blocks: [{ type: 'read', text: 'X-rays changed diagnosis.' }],
    }
    const text = collectLearnerText(screen)
    expect(text).toContain('see inside the body')
    expect(text).toContain('X-rays changed diagnosis')
  })

  it('collects nested learner-facing content and answer options', () => {
    const screen = {
      title: 'Nested lesson title.',
      learningGoals: ['Explain the cause.', 'Apply it to an exam answer.'],
      profile: { lines: ['A profile line learners read.'] },
      narrative: { facts: [{ statement: 'Narrative fact for learners.' }] },
      options: [{ label: 'Answer option A.' }, { answer: 'Answer option B.' }],
    }
    const text = collectLearnerText(screen)
    expect(text).toContain('Nested lesson title')
    expect(text).toContain('Explain the cause')
    expect(text).toContain('A profile line learners read')
    expect(text).toContain('Narrative fact for learners')
    expect(text).toContain('Answer option A')
    expect(text).toContain('Answer option B')
  })

  it('excludes implementation metadata from learner text', () => {
    const text = collectLearnerText({
      title: 'Learners read this.',
      id: 'metadata-id',
      tag: 'metadata-tag',
      type: 'read',
      image: '/asset/path.png',
      color: '#ffffff',
      colorRgb: '255,255,255',
      bg: 'rgba(0,0,0,.1)',
      colorLight: '#eeeeee',
    })
    expect(text).toContain('Learners read this')
    expect(text).not.toContain('metadata-id')
    expect(text).not.toContain('/asset/path.png')
    expect(text).not.toContain('#ffffff')
  })
})

describe('Exam-preparation completion contract', () => {
  it('accepts examiner teaching followed by assessed exam-technique practice', () => {
    const ep = {
      screens: [
        { type: 'examinerExplains', heading: 'Examiner teaches how to answer.' },
        { type: 'guidedExamResponse', question: 'Now write the exam move.' },
      ],
    }
    expect(violationFingerprints(guardrailViolations(ep))).toEqual([])
  })

  it('rejects passive examiner advice with no later assessed exam-technique component', () => {
    const ep = {
      screens: [
        { type: 'examinerExplains', heading: 'Examiner teaches how to answer.' },
        { type: 'read', text: 'The lesson ends with advice only.' },
      ],
    }
    expect(violationFingerprints(guardrailViolations(ep))).toContain('EXAM_PREP_NO_ASSESSMENT:screen:0')
  })
})

// ─── Quality floor (⚙ guardrails from CONTENT_BUILD_TEMPLATE.md) ─────────

// Known content debt is tracked by exact shrink-only fingerprints. New
// fingerprints fail even when a module already has existing debt; fixed
// fingerprints can be removed without adding replacement exemptions.
const KNOWN_GUARDRAIL_VIOLATIONS = {
  "history-medicine-medieval-beliefs-causes": ["READABILITY:screen:0","READABILITY:screen:10","READABILITY:screen:11","READABILITY:screen:12","READABILITY:screen:17","READABILITY:screen:19","READABILITY:screen:20","READABILITY:screen:23","READABILITY:screen:24","READABILITY:screen:28","READABILITY:screen:29","READABILITY:screen:3","READABILITY:screen:31","READABILITY:screen:5","READABILITY:screen:6","READABILITY:screen:7","READABILITY:screen:8","STAGE_NO_ASSESSMENT:part-1"],
  "history-medicine-black-death": ["READABILITY:screen:0","READABILITY:screen:11","READABILITY:screen:14","READABILITY:screen:15","READABILITY:screen:18","READABILITY:screen:22","READABILITY:screen:3","READABILITY:screen:4","READABILITY:screen:6","READABILITY:screen:7","READABILITY:screen:9"],
  "history-medicine-renaissance-medicine": ["READABILITY:screen:0","READABILITY:screen:1","READABILITY:screen:10","READABILITY:screen:12","READABILITY:screen:13","READABILITY:screen:14","READABILITY:screen:15","READABILITY:screen:3","READABILITY:screen:4","READABILITY:screen:6","READABILITY:screen:7","READABILITY:screen:8","READABILITY:screen:9"],
  "history-medicine-vesalius-beginning-doubt": ["EXAM_PREP_NO_ASSESSMENT:screen:10","READABILITY:screen:0","READABILITY:screen:2","READABILITY:screen:3","READABILITY:screen:4","READABILITY:screen:7","READABILITY:screen:8","READABILITY:screen:9"],
  "history-medicine-harvey-pare-renaissance-method": ["EXAM_PREP_NO_ASSESSMENT:screen:10","READABILITY:screen:0","READABILITY:screen:2","READABILITY:screen:3","READABILITY:screen:6","READABILITY:screen:8","READABILITY:screen:9"],
  "history-medicine-surgery-anaesthetics": ["PASSIVE_RUN:screen:4","READABILITY:screen:0","READABILITY:screen:1","READABILITY:screen:2","READABILITY:screen:3","READABILITY:screen:4","READABILITY:screen:5","READABILITY:screen:6","READABILITY:screen:7","READABILITY:screen:8","READABILITY:screen:9","STAGE_NAV_NOT_INCREASING:part-5","STAGE_NO_ASSESSMENT:part-1"],
  "history-medicine-great-plague-1665": ["EXAM_PREP_NO_ASSESSMENT:screen:10","READABILITY:screen:0","READABILITY:screen:2","READABILITY:screen:5","READABILITY:screen:9"],
  "history-medicine-jenner-vaccination": ["READABILITY:screen:0","STAGE_NAV_NOT_INCREASING:part-2","STAGE_NAV_NOT_INCREASING:part-3","STAGE_NAV_NOT_INCREASING:part-4","STAGE_NAV_NOT_INCREASING:part-5","STAGE_NAV_NOT_INCREASING:part-6"],
  "history-medicine-germ-theory": ["PASSIVE_RUN:screen:5","READABILITY:screen:2","READABILITY:screen:3","READABILITY:screen:4","READABILITY:screen:5","READABILITY:screen:6","READABILITY:screen:7","READABILITY:screen:8","STAGE_NAV_NOT_INCREASING:part-2"],
  "history-medicine-great-stink": ["READABILITY:screen:0","READABILITY:screen:1","READABILITY:screen:2","READABILITY:screen:3","READABILITY:screen:4","READABILITY:screen:5"],
  "history-medicine-surgery-revolution": ["READABILITY:screen:1","READABILITY:screen:3","READABILITY:screen:4","READABILITY:screen:5","READABILITY:screen:6","READABILITY:screen:9"],
  "history-medicine-accidental-miracle": ["READABILITY:screen:0","READABILITY:screen:1","READABILITY:screen:10","READABILITY:screen:2","READABILITY:screen:3","READABILITY:screen:4","READABILITY:screen:5","READABILITY:screen:6","READABILITY:screen:7","READABILITY:screen:8"],
  "history-medicine-modern-medicine": ["READABILITY:screen:0","READABILITY:screen:1","READABILITY:screen:2","READABILITY:screen:3","READABILITY:screen:4","READABILITY:screen:5","READABILITY:screen:6","READABILITY:screen:7","READABILITY:screen:8"],
  "history-medicine-cancer": ["READABILITY:screen:0","READABILITY:screen:1","READABILITY:screen:10","READABILITY:screen:2","READABILITY:screen:3","READABILITY:screen:5","READABILITY:screen:6","READABILITY:screen:7","STAGE_NO_ASSESSMENT:part-3"],
  "history-medicine-western-front": ["READABILITY:screen:0","READABILITY:screen:1","READABILITY:screen:10","READABILITY:screen:12","READABILITY:screen:14","READABILITY:screen:16","READABILITY:screen:2","READABILITY:screen:3","READABILITY:screen:5","READABILITY:screen:6","READABILITY:screen:8"],
  "bio_building_blocks": ["READABILITY:screen:11","READABILITY:screen:12","READABILITY:screen:13","READABILITY:screen:3","READABILITY:screen:4","READABILITY:screen:6","READABILITY:screen:8","READABILITY:screen:9","STAGE_NO_ASSESSMENT:part-3"],
  "sci_bio_w1": ["READABILITY:screen:0","READABILITY:screen:5","READABILITY:screen:8"],
  "math1": ["READABILITY:screen:11","READABILITY:screen:9"],
  "math2": ["READABILITY:screen:0","READABILITY:screen:12","READABILITY:screen:13","READABILITY:screen:5","READABILITY:screen:8"],
  "math3": ["READABILITY:screen:0","READABILITY:screen:12","READABILITY:screen:13","READABILITY:screen:7","READABILITY:screen:9"],
  "math4": ["READABILITY:screen:0","READABILITY:screen:10","READABILITY:screen:11","READABILITY:screen:12","READABILITY:screen:2","READABILITY:screen:3","READABILITY:screen:4","READABILITY:screen:5","READABILITY:screen:6","READABILITY:screen:7","READABILITY:screen:9"],
  "math5": ["READABILITY:screen:11","READABILITY:screen:4","READABILITY:screen:5"],
  "math6": ["READABILITY:screen:1"],
  "math7": ["READABILITY:screen:1","READABILITY:screen:10"],
  "math8": ["READABILITY:screen:13","READABILITY:screen:2","READABILITY:screen:4","READABILITY:screen:6","READABILITY:screen:8","READABILITY:screen:9"],
  "soc1": ["READABILITY:screen:0","READABILITY:screen:1","READABILITY:screen:10","READABILITY:screen:11","READABILITY:screen:2","READABILITY:screen:3","READABILITY:screen:4","READABILITY:screen:5","READABILITY:screen:6","READABILITY:screen:7","READABILITY:screen:8","READABILITY:screen:9"],
  "soc2": ["READABILITY:screen:10","READABILITY:screen:11","READABILITY:screen:12","READABILITY:screen:13","READABILITY:screen:14","READABILITY:screen:15","READABILITY:screen:2","READABILITY:screen:3","READABILITY:screen:4","READABILITY:screen:5","READABILITY:screen:6","READABILITY:screen:7","READABILITY:screen:8","READABILITY:screen:9"],
  "soc3": ["READABILITY:screen:0","READABILITY:screen:1","READABILITY:screen:10","READABILITY:screen:11","READABILITY:screen:2","READABILITY:screen:3","READABILITY:screen:4","READABILITY:screen:5","READABILITY:screen:6","READABILITY:screen:7","READABILITY:screen:8","READABILITY:screen:9"],
  "soc4": ["READABILITY:screen:0","READABILITY:screen:1","READABILITY:screen:10","READABILITY:screen:11","READABILITY:screen:2","READABILITY:screen:3","READABILITY:screen:4","READABILITY:screen:5","READABILITY:screen:7","READABILITY:screen:8","READABILITY:screen:9"],
  "soc6": ["READABILITY:screen:0","READABILITY:screen:1","READABILITY:screen:10","READABILITY:screen:11","READABILITY:screen:2","READABILITY:screen:3","READABILITY:screen:4","READABILITY:screen:5","READABILITY:screen:6","READABILITY:screen:7","READABILITY:screen:8","READABILITY:screen:9","STAGE_NO_ASSESSMENT:part-1"],
  "english-macbeth-power-ambition": ["STAGE_NAV_NOT_INCREASING:part-2","STAGE_NAV_NOT_INCREASING:part-3","STAGE_NAV_NOT_INCREASING:part-4","STAGE_NAV_NOT_INCREASING:part-5","STAGE_NAV_NOT_INCREASING:part-6"],
}

describe('Content quality floor', () => {
  it('enumerates every built module from MODULES and MODULE_CONTENT_LOADERS', () => {
    const expectedBuiltIds = MODULES.filter(mod => mod.screenCount > 0).map(mod => mod.id).sort()
    const inspectedIds = ALL_EPISODES.map(ep => ep.id).sort()
    expect(inspectedIds).toEqual(expectedBuiltIds)
  })

  for (const ep of ALL_EPISODES) {
    if ((ep.screens ?? []).length === 0) continue // stubs are covered by placeholder-module-safety
    it(`${ep.id} meets the quality floor (or is grandfathered)`, () => {
      const fingerprints = violationFingerprints(guardrailViolations(ep))
      expect(fingerprints).toEqual(KNOWN_GUARDRAIL_VIOLATIONS[ep.id] ?? [])
    })
  }

  it('the floor is real: episode 12 as-built violates it (spec success criterion 4)', () => {
    const ep12 = ALL_EPISODES.find(e => e.id === 'history-medicine-modern-medicine')
    expect(guardrailViolations(ep12).length).toBeGreaterThan(0)
  })
})

// ─── Sentence-case guard (P7) ─────────────────────────────────────────────
// CLAUDE.md requires sentence case for all titles/headings written into the
// codebase. Existing violations are grandfathered per-episode (shrink-only);
// fixing them is content-review work, not this test's job.

// Episodes with known sentence-case violations. Shrink-only — fixing an
// episode's copy removes it here. Never add a NEW episode to this list.
const SENTENCE_CASE_GRANDFATHERED_EPISODES = new Set([
  'history-medicine-medieval-beliefs-causes',
  'history-medicine-black-death',
  'history-medicine-renaissance-medicine',
  'history-medicine-surgery-anaesthetics',
  'history-medicine-jenner-vaccination',
  'history-medicine-germ-theory',
  'history-medicine-great-stink',
  'history-medicine-surgery-revolution',
  'history-medicine-accidental-miracle',
  'history-medicine-modern-medicine',
  'history-medicine-cancer',
  'history-medicine-western-front',
  'math8', 'soc2', 'soc3', 'soc4', 'soc6', 'bio_building_blocks', 'sci_bio_w1',
])

describe('Sentence-case guard', () => {
  for (const ep of ALL_EPISODES) {
    if ((ep.screens ?? []).length === 0) continue
    it(`${ep.id} uses sentence case in label/title/heading/sub (or is grandfathered)`, () => {
      const violations = sentenceCaseViolations(ep)
      if (SENTENCE_CASE_GRANDFATHERED_EPISODES.has(ep.id)) return // shrink-only allowlist
      expect(violations, violations.join('\n')).toEqual([])
    })
  }
})
