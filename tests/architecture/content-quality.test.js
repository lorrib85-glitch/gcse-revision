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
  collectLearnerTextSegments,
  guardrailViolations,
  sentenceCaseViolations,
  violationFingerprints,
} from '../../src/data/contentQualityChecks.js'
import { MODULES } from '../../src/modules.js'
import { MODULE_CONTENT_LOADERS } from '../../src/content/moduleContentRegistry.js'
import {
  KNOWN_GUARDRAIL_VIOLATIONS,
  KNOWN_READABILITY_BASELINES,
  KNOWN_SENTENCE_CASE_VIOLATIONS,
  READABILITY_GRADE_TOLERANCE,
} from '../fixtures/content-quality-known-debt.js'
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
    if (typeof loader !== 'function') {
      throw new Error(`${mod.id} has no content loader`)
    }
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

  it('collects string answer options as separate learner-facing segments', () => {
    const segments = collectLearnerTextSegments({
      options: ['First answer', 'Second answer', 'Third answer'],
    })
    expect(segments).toEqual(['First answer', 'Second answer', 'Third answer'])
  })

  it('collects object answer options as separate learner-facing segments', () => {
    const segments = collectLearnerTextSegments({
      options: [{ label: 'First answer' }, { answer: 'Second answer' }],
    })
    expect(segments).toEqual(['First answer', 'Second answer'])
  })

  it('joins separate options and bullets with sentence boundaries, not a run-on space', () => {
    const text = collectLearnerText({
      options: ['First answer', 'Second answer'],
      bullets: ['First bullet', 'Second bullet'],
    })
    expect(text).toBe('First answer. Second answer. First bullet. Second bullet')
  })

  it('excludes implementation metadata from learner text', () => {
    const text = collectLearnerText({
      title: 'Learners read this.',
      id: 'metadata-id',
      tag: 'metadata-tag',
      tags: ['learner sounding tag'],
      type: 'read',
      image: '/asset/path.png',
      backgroundImage: '/images/learner-facing-words.png',
      assetKeys: ['learnerWordsInsideAssetKey'],
      color: '#ffffff',
      colorRgb: '255,255,255',
      bg: 'rgba(0,0,0,.1)',
      colorLight: '#eeeeee',
    })
    expect(text).toContain('Learners read this')
    expect(text).not.toContain('metadata-id')
    expect(text).not.toContain('/asset/path.png')
    expect(text).not.toContain('#ffffff')
    expect(text).not.toContain('learner sounding tag')
    expect(text).not.toContain('learnerWordsInsideAssetKey')
  })
})

describe('Exam-preparation completion contract', () => {
  it.each(['faceExaminer', 'guidedExamResponse', 'examscored', 'misconceptionCheck', 'spotTheError'])(
    'accepts examiner teaching followed by assessed exam-technique practice: %s',
    type => {
      const ep = {
        screens: [
          { type: 'examinerExplains', heading: 'Examiner teaches how to answer.' },
          { type, question: 'Now write the exam move.' },
        ],
      }
      expect(violationFingerprints(guardrailViolations(ep))).toEqual([])
    }
  )

  it('accepts examiner teaching followed later by assessed exam-technique practice', () => {
    const ep = {
      screens: [
        { type: 'examinerExplains', heading: 'Examiner teaches how to answer.' },
        { type: 'read', text: 'Keep this advice in mind.' },
        { type: 'guidedExamResponse', question: 'Now write the exam move.' },
      ],
    }
    expect(violationFingerprints(guardrailViolations(ep))).toEqual([])
  })

  it('rejects assessed retrieval as exam-prep follow-up', () => {
    const ep = {
      screens: [
        { type: 'examinerExplains', heading: 'Examiner teaches how to answer.' },
        { type: 'quickRecall', question: 'Recall a fact.' },
      ],
    }
    expect(violationFingerprints(guardrailViolations(ep))).toContain('EXAM_PREP_NO_ASSESSMENT:screen:0')
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

  it('rejects exam practice before examiner teaching because ordering matters', () => {
    const ep = {
      screens: [
        { type: 'guidedExamResponse', question: 'Practice first.' },
        { type: 'examinerExplains', heading: 'Examiner teaches afterwards.' },
      ],
    }
    expect(violationFingerprints(guardrailViolations(ep))).toContain('EXAM_PREP_NO_ASSESSMENT:screen:1')
  })
})

// ─── Quality floor (⚙ guardrails from CONTENT_BUILD_TEMPLATE.md) ─────────

// Known content debt lives in tests/fixtures/content-quality-known-debt.js.
// The fixture is explicit reviewable governance data; tests never regenerate it.
function compareKnownGuardrailDebt(actualViolations, expectedFingerprints = []) {
  const actual = actualViolations.filter(v => v.code !== 'READABILITY').map(v => v.fingerprint).sort()
  expect(actual).toEqual(expectedFingerprints)
}

function compareKnownReadabilityDebt(actualViolations, expectedBaselines = {}) {
  const actual = actualViolations.filter(v => v.code === 'READABILITY')
  const actualFingerprints = actual.map(v => v.fingerprint).sort()
  const expectedFingerprints = Object.keys(expectedBaselines).sort()
  expect(actualFingerprints).toEqual(expectedFingerprints)
  for (const violation of actual) {
    const maxGrade = expectedBaselines[violation.fingerprint] + READABILITY_GRADE_TOLERANCE
    expect(
      violation.grade,
      `${violation.fingerprint} grade ${violation.grade.toFixed(2)} exceeds baseline ${expectedBaselines[violation.fingerprint].toFixed(2)} + tolerance ${READABILITY_GRADE_TOLERANCE}`
    ).toBeLessThanOrEqual(maxGrade)
  }
}

function sentenceCaseFingerprints(ep) {
  return sentenceCaseViolations(ep).map(v => v.fingerprint).sort()
}

describe('Known-debt ratchet helpers', () => {
  it('passes unchanged known readability debt', () => {
    const actual = [{ code: 'READABILITY', fingerprint: 'READABILITY:screen:4', grade: 7.2 }]
    expect(() => compareKnownReadabilityDebt(actual, { 'READABILITY:screen:4': 7.2 })).not.toThrow()
  })

  it('passes improved readability that remains a known violation', () => {
    const actual = [{ code: 'READABILITY', fingerprint: 'READABILITY:screen:4', grade: 7.1 }]
    expect(() => compareKnownReadabilityDebt(actual, { 'READABILITY:screen:4': 7.2 })).not.toThrow()
  })

  it('ignores insignificant readability calculation noise within tolerance', () => {
    const actual = [{ code: 'READABILITY', fingerprint: 'READABILITY:screen:4', grade: 7.2 + READABILITY_GRADE_TOLERANCE }]
    expect(() => compareKnownReadabilityDebt(actual, { 'READABILITY:screen:4': 7.2 })).not.toThrow()
  })

  it('fails when known readability debt gets materially worse', () => {
    const actual = [{ code: 'READABILITY', fingerprint: 'READABILITY:screen:4', grade: 12.8 }]
    expect(() => compareKnownReadabilityDebt(actual, { 'READABILITY:screen:4': 7.2 })).toThrow()
  })

  it('fails when a new readability violation appears', () => {
    const actual = [
      { code: 'READABILITY', fingerprint: 'READABILITY:screen:4', grade: 7.2 },
      { code: 'READABILITY', fingerprint: 'READABILITY:screen:5', grade: 7.3 },
    ]
    expect(() => compareKnownReadabilityDebt(actual, { 'READABILITY:screen:4': 7.2 })).toThrow()
  })

  it('sentence-case fingerprints are stable by location rather than only words', () => {
    const ep = { screens: [{ blocks: [{ label: 'Bad Title Case' }] }] }
    expect(sentenceCaseFingerprints(ep)).toEqual(['SENTENCE_CASE:screens[0].blocks[0].label:run:0'])
  })

  it('sentence-case comparison fails for a new location in a module with old debt', () => {
    const actual = ['SENTENCE_CASE:screens[0].title:run:0', 'SENTENCE_CASE:screens[1].title:run:0']
    const expected = ['SENTENCE_CASE:screens[0].title:run:0']
    expect(actual).not.toEqual(expected)
  })
})

describe('Content quality floor', () => {
  it('enumerates every built module from MODULES and MODULE_CONTENT_LOADERS', () => {
    const expectedBuiltIds = MODULES.filter(mod => mod.screenCount > 0).map(mod => mod.id).sort()
    const inspectedIds = ALL_EPISODES.map(ep => ep.id).sort()
    expect(inspectedIds).toEqual(expectedBuiltIds)
  })

  for (const ep of ALL_EPISODES) {
    if ((ep.screens ?? []).length === 0) continue // stubs are covered by placeholder-module-safety
    it(`${ep.id} meets the quality floor (or is grandfathered)`, () => {
      const violations = guardrailViolations(ep)
      compareKnownGuardrailDebt(violations, KNOWN_GUARDRAIL_VIOLATIONS[ep.id] ?? [])
      compareKnownReadabilityDebt(violations, KNOWN_READABILITY_BASELINES[ep.id] ?? {})
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

// Known sentence-case debt is exact by content location + run index.
// New title-case copy in an old module gets a new fingerprint and fails.
describe('Sentence-case guard', () => {
  for (const ep of ALL_EPISODES) {
    if ((ep.screens ?? []).length === 0) continue
    it(`${ep.id} uses sentence case in label/title/heading/sub (or is grandfathered)`, () => {
      expect(sentenceCaseFingerprints(ep)).toEqual(KNOWN_SENTENCE_CASE_VIOLATIONS[ep.id] ?? [])
    })
  }
})
