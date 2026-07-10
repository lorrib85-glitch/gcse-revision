import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock localStorage-backed storage so all planner tests run in node cleanly.
// Must be declared before the dynamic import below.
const mockSetJson  = vi.fn()
const mockGetArray = vi.fn(() => [])
const mockGetObject = vi.fn(() => ({}))
const mockGetJson  = vi.fn((key, fallback) => fallback)

vi.mock('../../../src/lib/storage.js', () => ({
  getArray:  mockGetArray,
  getObject: mockGetObject,
  getJson:   mockGetJson,
  setJson:   mockSetJson,
  removeKey: vi.fn(),
}))

// Imported after mock declarations so vitest hoists the vi.mock() calls first.
const {
  getPlanningMode,
  calculateSubjectPriority,
  selectMainSubject,
  selectSecondarySubject,
  buildWeekdayBlocks,
  buildSaturdayBlocks,
  buildSundayBlocks,
  buildDailyPlan,
  savePlannerRotation,
  saveWeakPoints,
  ALL_SUBJECTS,
  // Part 2 exports
  PULSE_DURATIONS,
  PULSE_LABELS,
  WEAK_POINT_STATUSES,
  INCOMPLETE_STATUSES,
  MAX_WEEKDAY_CARRYOVER_MINUTES,
  MAX_SUNDAY_CARRYOVER_MINUTES,
  MATHS_INTERLEAVE_FAMILIES,
  HISTORY_INTERLEAVE_THEMES,
  HISTORY_MEDICINE_ERAS,
  SCIENCE_SUBJECTS,
  normalisePulseDuration,
  getPulseLabel,
  getPulseMix,
  calculateWeakPointSeverity,
  updateWeakPointFromResult,
  createOrUpdateWeakPoint,
  applyPulseResultToLearningState,
  selectWeakPointRepair,
  selectInterleavingActivity,
  classifyIncompleteWork,
  handleMissedDay,
  // Part 3 exports
  PAPER_ACTIVITY_TYPES,
  PAPER_PRACTICE_WEIGHTS,
  ERROR_TYPES,
  isTopicEligibleForPaperPractice,
  selectPaperActivity,
  selectWeekendPaperSubject,
  calculatePaperMistakeSeverity,
  selectHighestValuePaperRepair,
  buildPaperReviewSummary,
  calculateSubjectBoostsFromPaper,
  processPaperResults,
  applyPaperResultToLearningState,
} = await import('../../../src/features/planner/dailyPlanner.js')

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const MONDAY    = new Date('2026-06-22')  // day 1
const TUESDAY   = new Date('2026-06-23')  // day 2
const WEDNESDAY = new Date('2026-06-24')  // day 3
const FRIDAY    = new Date('2026-06-26')  // day 5
const SATURDAY  = new Date('2026-06-20')  // day 6
const SUNDAY    = new Date('2026-06-21')  // day 0

const emptyState = {
  scores:          [],
  wrongAnswers:    [],
  correctAnswers:  [],
  moduleStates:    {},
  rotationHistory: {},
  progress:        {},
  weakPoints:      [],
}

const defaultProfile = {
  selectedSubjects: ['History', 'Biology', 'Sociology'],
  weekdayMinutes:   60,
  saturdayMinutes:  90,
  sundayMinutes:    60,
  name:             'Test User',
}

function makeWeakPoint(overrides = {}) {
  return {
    weakPointId:      'test_wp_1',
    subject:          'History',
    topic:            'germ_theory',
    skillTag:         null,
    misconceptionTag: null,
    errorType:        null,
    severity:         'medium',
    firstSeenAt:      '2026-06-15',
    lastSeenAt:       '2026-06-20',
    timesFailed:      3,
    timesCorrectAfter: 0,
    status:           'new',
    nextReviewAt:     '2026-06-21',
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ─── 1–7: getPlanningMode ─────────────────────────────────────────────────────

describe('getPlanningMode', () => {
  it('returns "weekday" on Monday', () => {
    expect(getPlanningMode(MONDAY, {})).toBe('weekday')
  })

  it('returns "weekday" on Tuesday', () => {
    expect(getPlanningMode(TUESDAY, {})).toBe('weekday')
  })

  it('returns "weekday" on Wednesday', () => {
    expect(getPlanningMode(WEDNESDAY, {})).toBe('weekday')
  })

  it('returns "weekday" on Friday', () => {
    expect(getPlanningMode(FRIDAY, {})).toBe('weekday')
  })

  it('returns "saturday" on Saturday', () => {
    expect(getPlanningMode(SATURDAY, {})).toBe('saturday')
  })

  it('returns "sunday" on Sunday', () => {
    expect(getPlanningMode(SUNDAY, {})).toBe('sunday')
  })

  it('does NOT return "weekend" for any day', () => {
    const days = [MONDAY, TUESDAY, WEDNESDAY, FRIDAY, SATURDAY, SUNDAY]
    days.forEach(d => expect(getPlanningMode(d, {})).not.toBe('weekend'))
  })
})

// ─── buildWeekdayBlocks ───────────────────────────────────────────────────────

describe('buildWeekdayBlocks', () => {
  it('returns exactly four blocks', () => {
    const blocks = buildWeekdayBlocks('History', 'Biology', emptyState, defaultProfile)
    expect(blocks).toHaveLength(4)
  })

  it('block types are pulse, mainProgress, weakRepair, examMove (in order)', () => {
    const blocks = buildWeekdayBlocks('History', 'Biology', emptyState, defaultProfile)
    expect(blocks.map(b => b.type)).toEqual(['pulse', 'mainProgress', 'weakRepair', 'examMove'])
  })

  it('block labels are Start Strong, Main Mission, Fix One Thing, Exam Move (in order)', () => {
    const blocks = buildWeekdayBlocks('History', 'Biology', emptyState, defaultProfile)
    expect(blocks.map(b => b.label)).toEqual([
      'Start Strong', 'Main Mission', 'Fix One Thing', 'Exam Move',
    ])
  })

  it('has no exit ticket block', () => {
    const blocks = buildWeekdayBlocks('History', 'Biology', emptyState, defaultProfile)
    const exitTicket = blocks.find(b =>
      b.type === 'exitTicket' ||
      b.label?.toLowerCase().includes('exit') ||
      b.label?.toLowerCase().includes('ticket')
    )
    expect(exitTicket).toBeUndefined()
  })

  it('durations sum to 60', () => {
    const blocks = buildWeekdayBlocks('History', 'Biology', emptyState, defaultProfile)
    const total = blocks.reduce((sum, b) => sum + b.duration, 0)
    expect(total).toBe(60)
  })

  it('uses fixed durations: 8, 27, 12, 13', () => {
    const blocks = buildWeekdayBlocks('History', 'Biology', emptyState, defaultProfile)
    expect(blocks.map(b => b.duration)).toEqual([8, 27, 12, 13])
  })

  it('puts secondary subject in the pulse (Start Strong) block', () => {
    const blocks = buildWeekdayBlocks('History', 'Biology', emptyState, defaultProfile)
    expect(blocks[0].subject).toBe('Biology')
  })

  it('puts main subject in mainProgress and weakRepair', () => {
    const blocks = buildWeekdayBlocks('History', 'Biology', emptyState, defaultProfile)
    expect(blocks[1].subject).toBe('History')
    expect(blocks[2].subject).toBe('History')
  })

  it('never routes the main-progress block into an unbuilt stub module', () => {
    // Biology's only built module (sci_bio_w1) is complete; the remaining
    // Biology chapters in MODULE_GROUPS are screenCount-0 stubs. The planner
    // must not hand back a stub as the next module — better no module than a
    // dead card pointing at empty content.
    const bioAllDone = {
      ...emptyState,
      moduleStates: { sci_bio_w1: { screen: 9, completed: true } },
    }
    const blocks = buildWeekdayBlocks('Biology', 'History', bioAllDone, defaultProfile)
    const mainBlock = blocks.find(b => b.type === 'mainProgress')
    const stubIds = ['bio_building_life', 'bio_human_machine', 'bio_disease_wars', 'bio_control_systems', 'bio_genetics_evolution', 'bio_ecosystems_group']
    expect(stubIds).not.toContain(mainBlock.moduleId)
  })

  it('uses mainSubject for pulse when secondarySubject is null', () => {
    const blocks = buildWeekdayBlocks('History', null, emptyState, defaultProfile)
    expect(blocks[0].subject).toBe('History')
  })

  it('each block has a reasonCodes array', () => {
    const blocks = buildWeekdayBlocks('History', 'Biology', emptyState, defaultProfile)
    blocks.forEach(b => {
      expect(Array.isArray(b.reasonCodes)).toBe(true)
      expect(b.reasonCodes.length).toBeGreaterThan(0)
    })
  })
})

// ─── buildSaturdayBlocks ─────────────────────────────────────────────────────

describe('buildSaturdayBlocks', () => {
  it('returns exactly four blocks', () => {
    const blocks = buildSaturdayBlocks('History', 'Biology', emptyState, defaultProfile)
    expect(blocks).toHaveLength(4)
  })

  it('block types are pulse, testPaper, markAndReview, targetedRepair (in order)', () => {
    const blocks = buildSaturdayBlocks('History', 'Biology', emptyState, defaultProfile)
    expect(blocks.map(b => b.type)).toEqual([
      'pulse', 'testPaper', 'markAndReview', 'targetedRepair',
    ])
  })

  it('block labels are Pulse Starter, Paper Practice, Mark & Decode, Fix One Thing', () => {
    const blocks = buildSaturdayBlocks('History', 'Biology', emptyState, defaultProfile)
    expect(blocks.map(b => b.label)).toEqual([
      'Pulse Starter', 'Paper Practice', 'Mark & Decode', 'Fix One Thing',
    ])
  })

  it('durations sum to 90', () => {
    const blocks = buildSaturdayBlocks('History', 'Biology', emptyState, defaultProfile)
    const total = blocks.reduce((sum, b) => sum + b.duration, 0)
    expect(total).toBe(90)
  })

  it('uses fixed durations: 15, 50, 15, 10', () => {
    const blocks = buildSaturdayBlocks('History', 'Biology', emptyState, defaultProfile)
    expect(blocks.map(b => b.duration)).toEqual([15, 50, 15, 10])
  })

  it('Mark & Decode is a distinct block (not merged with testPaper)', () => {
    const blocks = buildSaturdayBlocks('History', 'Biology', emptyState, defaultProfile)
    const mark  = blocks.find(b => b.type === 'markAndReview')
    const paper = blocks.find(b => b.type === 'testPaper')
    expect(mark).toBeDefined()
    expect(paper).toBeDefined()
    expect(mark).not.toBe(paper)
  })
})

// ─── buildSundayBlocks ────────────────────────────────────────────────────────

describe('buildSundayBlocks', () => {
  it('returns exactly four blocks', () => {
    const blocks = buildSundayBlocks('History', 'Biology', emptyState, defaultProfile)
    expect(blocks).toHaveLength(4)
  })

  it('block types are pulse, carryOverOrProgress, paperMistakeRepair, lightExamPractice', () => {
    const blocks = buildSundayBlocks('History', 'Biology', emptyState, defaultProfile)
    expect(blocks.map(b => b.type)).toEqual([
      'pulse', 'carryOverOrProgress', 'paperMistakeRepair', 'lightExamPractice',
    ])
  })

  it('block labels are Pulse, Catch-up, Patch, Exam Move', () => {
    const blocks = buildSundayBlocks('History', 'Biology', emptyState, defaultProfile)
    expect(blocks.map(b => b.label)).toEqual(['Pulse', 'Catch-up', 'Patch', 'Exam Move'])
  })

  it('durations sum to 60', () => {
    const blocks = buildSundayBlocks('History', 'Biology', emptyState, defaultProfile)
    const total = blocks.reduce((sum, b) => sum + b.duration, 0)
    expect(total).toBe(60)
  })

  it('uses fixed durations: 15, 25, 10, 10', () => {
    const blocks = buildSundayBlocks('History', 'Biology', emptyState, defaultProfile)
    expect(blocks.map(b => b.duration)).toEqual([15, 25, 10, 10])
  })
})

// ─── buildDailyPlan — storage side effects ────────────────────────────────────

describe('buildDailyPlan — storage side effects', () => {
  it('does NOT call setJson when options.persistRotation is absent', () => {
    buildDailyPlan(defaultProfile, emptyState, MONDAY)
    expect(mockSetJson).not.toHaveBeenCalled()
  })

  it('does NOT call setJson when options.persistRotation is false', () => {
    buildDailyPlan(defaultProfile, emptyState, MONDAY, { persistRotation: false })
    expect(mockSetJson).not.toHaveBeenCalled()
  })

  it('DOES call setJson when options.persistRotation is true', () => {
    buildDailyPlan(defaultProfile, emptyState, MONDAY, { persistRotation: true })
    expect(mockSetJson).toHaveBeenCalled()
  })

  it('savePlannerRotation writes to storage', () => {
    const plan = buildDailyPlan(defaultProfile, emptyState, MONDAY)
    savePlannerRotation(plan)
    expect(mockSetJson).toHaveBeenCalledTimes(1)
  })

  it('calling buildDailyPlan twice with same state returns same mainSubject (no hidden mutation)', () => {
    const plan1 = buildDailyPlan(defaultProfile, emptyState, MONDAY)
    const plan2 = buildDailyPlan(defaultProfile, emptyState, MONDAY)
    expect(plan1.mainSubject).toBe(plan2.mainSubject)
  })
})

// ─── buildDailyPlan — subject containment ────────────────────────────────────

describe('buildDailyPlan — subject containment', () => {
  it('weekday plan only uses subjects from selectedSubjects', () => {
    const profile = { ...defaultProfile, selectedSubjects: ['History', 'Biology'] }
    const plan = buildDailyPlan(profile, emptyState, MONDAY)
    const usedSubjects = new Set(plan.blocks.map(b => b.subject))
    usedSubjects.forEach(s => {
      expect(['History', 'Biology']).toContain(s)
    })
  })

  it('saturday plan only uses subjects from selectedSubjects', () => {
    const profile = { ...defaultProfile, selectedSubjects: ['Maths', 'Chemistry'] }
    const plan = buildDailyPlan(profile, emptyState, SATURDAY)
    const usedSubjects = new Set(plan.blocks.map(b => b.subject))
    usedSubjects.forEach(s => {
      expect(['Maths', 'Chemistry']).toContain(s)
    })
  })

  it('sunday plan only uses subjects from selectedSubjects', () => {
    const profile = { ...defaultProfile, selectedSubjects: ['Sociology'] }
    const plan = buildDailyPlan(profile, emptyState, SUNDAY)
    const usedSubjects = new Set(plan.blocks.map(b => b.subject))
    usedSubjects.forEach(s => {
      expect(['Sociology']).toContain(s)
    })
  })

  it('unselected subjects never appear in generated plans', () => {
    const profile = { ...defaultProfile, selectedSubjects: ['History', 'Sociology'] }
    const plan = buildDailyPlan(profile, emptyState, MONDAY)
    const forbidden = ['Biology', 'Maths', 'Chemistry']
    plan.blocks.forEach(b => {
      expect(forbidden).not.toContain(b.subject)
    })
  })
})

// ─── selectMainSubject — rotation avoidance ───────────────────────────────────

describe('selectMainSubject — rotation avoidance', () => {
  it('avoids yesterday\'s main subject where another option exists', () => {
    const yesterday = '2026-06-21'
    const state = {
      ...emptyState,
      rotationHistory: { [yesterday]: { main: 'History', secondary: 'Biology' } },
    }
    const main = selectMainSubject(['History', 'Biology', 'Sociology'], state, MONDAY)
    expect(main).not.toBe('History')
  })

  it('avoids 2-days-ago main subject where another option exists', () => {
    const twoDaysAgo = '2026-06-20'
    const state = {
      ...emptyState,
      rotationHistory: { [twoDaysAgo]: { main: 'History', secondary: 'Biology' } },
    }
    const main = selectMainSubject(['History', 'Biology', 'Sociology'], state, MONDAY)
    expect(main).not.toBe('History')
  })

  it('falls back to the penalised subject when it\'s the only option', () => {
    const yesterday = '2026-06-21'
    const state = {
      ...emptyState,
      rotationHistory: { [yesterday]: { main: 'History', secondary: null } },
    }
    const main = selectMainSubject(['History'], state, MONDAY)
    expect(main).toBe('History')
  })

  it('rotation penalty is recovered after 3+ days gap', () => {
    const threeDaysAgo = '2026-06-19'
    const state = {
      ...emptyState,
      rotationHistory: { [threeDaysAgo]: { main: 'Biology', secondary: 'Sociology' } },
      wrongAnswers: Array.from({ length: 5 }, () => ({ subject: 'History', topic: 'germ-theory' })),
      correctAnswers: [],
    }
    const main = selectMainSubject(['History', 'Biology', 'Sociology'], state, MONDAY)
    expect(main).toBe('History')
  })
})

// ─── buildDailyPlan integration ───────────────────────────────────────────────

describe('buildDailyPlan — integration', () => {
  it('weekday plan has mode "weekday"', () => {
    const plan = buildDailyPlan(defaultProfile, emptyState, MONDAY)
    expect(plan.mode).toBe('weekday')
  })

  it('saturday plan has mode "saturday"', () => {
    const plan = buildDailyPlan(defaultProfile, emptyState, SATURDAY)
    expect(plan.mode).toBe('saturday')
  })

  it('sunday plan has mode "sunday"', () => {
    const plan = buildDailyPlan(defaultProfile, emptyState, SUNDAY)
    expect(plan.mode).toBe('sunday')
  })

  it('weekday plan totalMinutes is 60', () => {
    const plan = buildDailyPlan(defaultProfile, emptyState, MONDAY)
    expect(plan.totalMinutes).toBe(60)
  })

  it('saturday plan totalMinutes is 90', () => {
    const plan = buildDailyPlan(defaultProfile, emptyState, SATURDAY)
    expect(plan.totalMinutes).toBe(90)
  })

  it('sunday plan totalMinutes is 60', () => {
    const plan = buildDailyPlan(defaultProfile, emptyState, SUNDAY)
    expect(plan.totalMinutes).toBe(60)
  })

  it('plan date matches the supplied date', () => {
    const plan = buildDailyPlan(defaultProfile, emptyState, MONDAY)
    expect(plan.date).toBe('2026-06-22')
  })

  it('plan.mainSubject is one of selectedSubjects', () => {
    const plan = buildDailyPlan(defaultProfile, emptyState, MONDAY)
    expect(defaultProfile.selectedSubjects).toContain(plan.mainSubject)
  })

  it('plan.secondarySubject is different from mainSubject', () => {
    const plan = buildDailyPlan(defaultProfile, emptyState, MONDAY)
    if (plan.secondarySubject !== null) {
      expect(plan.secondarySubject).not.toBe(plan.mainSubject)
    }
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// PART 2 TESTS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── A: Pulse duration system ─────────────────────────────────────────────────

describe('Pulse durations', () => {
  it('valid Pulse duration is returned unchanged', () => {
    expect(normalisePulseDuration(10, 'weekday')).toBe(10)
    expect(normalisePulseDuration(15, 'saturday')).toBe(15)
    expect(normalisePulseDuration(30, 'weekday')).toBe(30)
  })

  it('invalid duration clamps to nearest valid option', () => {
    // 7 is closer to 5 (diff 2) than 10 (diff 3) — wait, |7-5|=2, |7-10|=3 → 5
    expect(normalisePulseDuration(7, 'weekday')).toBe(5)
    // 12 → nearest is 10 (diff 2) or 15 (diff 3) → 10
    expect(normalisePulseDuration(12, 'weekday')).toBe(10)
    // 0 or falsy → weekday default (8 → nearest is 10)
    const result = normalisePulseDuration(0, 'weekday')
    expect(PULSE_DURATIONS.includes(result) || result === 8).toBe(true)
  })

  it('weekday Pulse mix has correct ratios', () => {
    const mix = getPulseMix('weekday', 10)
    expect(mix.spacedRecall).toBe(0.4)
    expect(mix.weakPoints).toBe(0.3)
    expect(mix.recentlyLearned).toBe(0.2)
    expect(mix.interleaving).toBe(0.1)
  })

  it('weekend Pulse mix has correct ratios', () => {
    const mix = getPulseMix('saturday', 15)
    expect(mix.spacedRecall).toBe(0.3)
    expect(mix.weakPoints).toBe(0.3)
    expect(mix.examStyle).toBe(0.2)
    expect(mix.crossSubject).toBe(0.2)
  })

  it('30-minute Power Pulse uses power mix', () => {
    const mix = getPulseMix('weekday', 30)
    expect(mix.weakPoints).toBe(0.35)
    expect(mix.spacedRecall).toBe(0.25)
    expect(mix.examStyle).toBe(0.25)
    expect(mix.olderContent).toBe(0.15)
  })

  it('pulse block in buildWeekdayBlocks includes .pulse metadata', () => {
    const blocks = buildWeekdayBlocks('History', 'Biology', emptyState, defaultProfile)
    const pulse = blocks[0]
    expect(pulse.pulse).toBeDefined()
    expect(pulse.pulse.duration).toBe(8)
    expect(pulse.pulse.label).toBe('Daily Pulse')
    expect(pulse.pulse.mix).toBeDefined()
    expect(typeof pulse.pulse.mix.spacedRecall).toBe('number')
  })
})

// ─── B: Weak point lifecycle ──────────────────────────────────────────────────

describe('Weak point lifecycle', () => {
  it('wrong answer creates a new weak point', () => {
    const result = {
      questionId: 'q1', subject: 'History', topic: 'germ_theory',
      skillTag: null, correct: false, answeredAt: '2026-06-22T10:00:00Z',
    }
    const newState = createOrUpdateWeakPoint(emptyState, result)
    expect(newState.weakPoints).toHaveLength(1)
    expect(newState.weakPoints[0].topic).toBe('germ_theory')
    expect(newState.weakPoints[0].status).toBe('new')
  })

  it('one correct answer does not immediately resolve a weak point', () => {
    const state = { ...emptyState, weakPoints: [makeWeakPoint({ timesFailed: 5, status: 'new' })] }
    const result = {
      questionId: 'q1', subject: 'History', topic: 'germ_theory',
      skillTag: null, correct: true, answeredAt: '2026-06-22T10:00:00Z',
    }
    const newState = applyPulseResultToLearningState(state, result)
    const wp = newState.weakPoints.find(w => w.topic === 'germ_theory')
    expect(wp.status).not.toBe('resolved')
    expect(wp.status).toBe('retest_due')
  })

  it('repeated wrong answers increase weak point severity to high', () => {
    const result = {
      questionId: 'q1', subject: 'History', topic: 'germ_theory',
      skillTag: null, correct: false, answeredAt: '2026-06-22T10:00:00Z',
    }
    let state = { ...emptyState, weakPoints: [] }
    for (let i = 0; i < 5; i++) {
      state = createOrUpdateWeakPoint(state, result)
    }
    const wp = state.weakPoints.find(w => w.topic === 'germ_theory')
    expect(wp.severity).toBe('high')
    expect(wp.timesFailed).toBe(5)
  })

  it('severe overdue weak point is injected into Exam Move via selectInterleavingActivity', () => {
    const state = {
      ...emptyState,
      weakPoints: [makeWeakPoint({
        weakPointId: 'bio_1',
        subject:     'Biology',
        topic:       'cell_division',
        severity:    'high',
        status:      'retest_due',
        timesFailed: 5,
        nextReviewAt: '2026-06-15',  // 7 days overdue relative to MONDAY 2026-06-22
      })],
    }
    const activity = selectInterleavingActivity('History', state, MONDAY)
    expect(activity.reasonCodes).toContain('WEAK_POINT_INJECTION')
    expect(activity.subject).toBe('Biology')
  })
})

// ─── C: Enriched blocks ───────────────────────────────────────────────────────

describe('Enriched blocks', () => {
  it('Fix One Thing gains topic metadata when weak point exists for main subject', () => {
    const state = {
      ...emptyState,
      weakPoints: [makeWeakPoint({ topic: 'germ_theory', skillTag: 'miasma_vs_germ' })],
    }
    const blocks = buildWeekdayBlocks('History', 'Biology', state, defaultProfile)
    const weakRepair = blocks.find(b => b.type === 'weakRepair')
    expect(weakRepair.topic).toBe('germ_theory')
  })

  it('Exam Move gains interleaving metadata where available', () => {
    const state = {
      ...emptyState,
      weakPoints: [makeWeakPoint({ topic: 'germ_theory', skillTag: 'change_and_continuity' })],
    }
    const blocks = buildWeekdayBlocks('History', 'Biology', state, defaultProfile)
    const examMove = blocks.find(b => b.type === 'examMove')
    const hasMetadata = examMove.topic || examMove.skillTag || examMove.interleaveWith?.length
    expect(hasMetadata).toBeTruthy()
  })
})

// ─── D: Interleaving ──────────────────────────────────────────────────────────

describe('Interleaving', () => {
  it('Maths interleaving prefers related skill family, not a random task', () => {
    const state = {
      ...emptyState,
      weakPoints: [makeWeakPoint({ subject: 'Maths', topic: 'fractions', skillTag: 'fractions', severity: 'medium', status: 'new', timesFailed: 2 })],
    }
    const activity = selectInterleavingActivity('Maths', state, MONDAY)
    expect(activity.reasonCodes).not.toContain('INTERLEAVE_GENERAL')
    expect(activity.topic).toBe('number')
  })

  it('Maths interleaving returns related skills within the same family', () => {
    const state = {
      ...emptyState,
      weakPoints: [makeWeakPoint({ subject: 'Maths', topic: 'fractions', skillTag: 'fractions', severity: 'medium', status: 'new', timesFailed: 2 })],
    }
    const activity = selectInterleavingActivity('Maths', state, MONDAY)
    expect(activity.interleaveWith).toEqual(expect.arrayContaining(['percentages', 'ratio']))
  })

  it('Science interleaving crosses Biology, Chemistry, Physics', () => {
    const state = {
      ...emptyState,
      weakPoints: [makeWeakPoint({ subject: 'Chemistry', topic: 'atomic_structure', severity: 'medium', status: 'new', timesFailed: 3 })],
    }
    const activity = selectInterleavingActivity('Biology', state, MONDAY)
    expect(activity.subject).toBe('Chemistry')
    expect(activity.reasonCodes).toContain('INTERLEAVE_CROSS_SUBJECT')
  })

  it('History interleaving uses change and continuity or chronology theme', () => {
    const activity = selectInterleavingActivity('History', emptyState, MONDAY)
    expect(HISTORY_INTERLEAVE_THEMES).toContain(activity.skillTag)
  })
})

// ─── E: Incomplete work classification ────────────────────────────────────────

describe('classifyIncompleteWork', () => {
  it('retrieval returns to pool', () => {
    expect(classifyIncompleteWork({ type: 'retrieval', progressPercent: 0 })).toBe('return_to_pool')
  })

  it('pulse returns to pool', () => {
    expect(classifyIncompleteWork({ type: 'pulse', progressPercent: 0 })).toBe('return_to_pool')
  })

  it('incomplete weak repair converts to recall', () => {
    expect(classifyIncompleteWork({ type: 'weakRepair', incomplete: true, progressPercent: 0 })).toBe('convert_to_recall')
  })

  it('started module above 35% resumes next session', () => {
    expect(classifyIncompleteWork({ type: 'mainProgress', progressPercent: 50 })).toBe('resume_next')
  })

  it('abandoned module below 35% with little time spent becomes shrink_and_retry', () => {
    expect(classifyIncompleteWork({ type: 'mainProgress', progressPercent: 20, timeSpent: 5 })).toBe('shrink_and_retry')
  })
})

// ─── F: Missed day and carry-over ─────────────────────────────────────────────

describe('handleMissedDay', () => {
  it('missed day is folded, not duplicated (foldedMessage present)', () => {
    const missedPlan = buildDailyPlan(defaultProfile, emptyState, MONDAY)
    const result = handleMissedDay(missedPlan)
    expect(result.foldedMessage).toBeTruthy()
    expect(result.carryOver).toBeDefined()
    expect(result.returnToPool).toBeDefined()
  })

  it('weekday carry-over total does not exceed MAX_WEEKDAY_CARRYOVER_MINUTES', () => {
    const missedPlan = buildDailyPlan(defaultProfile, emptyState, MONDAY)
    const result = handleMissedDay(missedPlan)
    const total = result.carryOver.reduce((s, b) => s + b.duration, 0)
    expect(total).toBeLessThanOrEqual(MAX_WEEKDAY_CARRYOVER_MINUTES)
  })

  it('no exit ticket block appears in Part 2 weekday blocks', () => {
    const blocks = buildWeekdayBlocks('History', 'Biology', { ...emptyState, weakPoints: [] }, defaultProfile)
    const exitTicket = blocks.find(b =>
      b.type === 'exitTicket' ||
      b.label?.toLowerCase().includes('exit') ||
      b.label?.toLowerCase().includes('ticket')
    )
    expect(exitTicket).toBeUndefined()
  })

  it('Saturday block structure is intact after Part 2 changes', () => {
    const blocks = buildSaturdayBlocks('History', 'Biology', emptyState, defaultProfile)
    expect(blocks).toHaveLength(4)
    expect(blocks.map(b => b.type)).toEqual(['pulse', 'testPaper', 'markAndReview', 'targetedRepair'])
    expect(blocks.map(b => b.duration)).toEqual([15, 50, 15, 10])
  })

  it('Sunday block structure is intact after Part 2 changes', () => {
    const blocks = buildSundayBlocks('History', 'Biology', emptyState, defaultProfile)
    expect(blocks).toHaveLength(4)
    expect(blocks.map(b => b.type)).toEqual(['pulse', 'carryOverOrProgress', 'paperMistakeRepair', 'lightExamPractice'])
    expect(blocks.map(b => b.duration)).toEqual([15, 25, 10, 10])
  })
})

// ═══════════════════════════════════════════════════════════════════════════════
// PART 3 TESTS — Weekend paper practice
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Shared Part 3 fixtures ───────────────────────────────────────────────────

const samplePaperResult = {
  paperId:       'pr_001',
  subject:       'Maths',
  examBoard:     'AQA',
  paperType:     'paperSection',
  duration:      50,
  marksAvailable: 20,
  marksScored:   14,
  completedAt:   '2026-06-20T10:00:00Z',
  questionResults: [
    { questionId: 'q1', topic: 'ratio',       skillTag: 'ratio_problem_solving', marksAvailable: 4, marksScored: 2, errorType: 'weakMethod' },
    { questionId: 'q2', topic: 'algebra',     skillTag: 'solving_equations',     marksAvailable: 6, marksScored: 3, errorType: 'weakMethod' },
    { questionId: 'q3', topic: 'fractions',   skillTag: 'fraction_operations',   marksAvailable: 4, marksScored: 4, errorType: null },
    { questionId: 'q4', topic: 'probability', skillTag: 'probability_tree',      marksAvailable: 6, marksScored: 5, errorType: 'misreadQuestion' },
  ],
}

// Helper to create a state where a subject has enough correct answers to be
// eligible for paper practice (bypasses the module-state coverage check).
function stateWithAnswers(subjects, paperResults = []) {
  return {
    ...emptyState,
    correctAnswers: subjects.map(s => ({ subject: s, topic: 'sample', date: '2026-01-01', source: 'test' })),
    paperResults,
  }
}

// ─── 1. Saturday block types ──────────────────────────────────────────────────

describe('Part 3 — Saturday block structure', () => {
  it('Saturday plan includes pulse, testPaper, markAndReview, targetedRepair', () => {
    const blocks = buildSaturdayBlocks('History', 'Biology', emptyState, defaultProfile)
    expect(blocks.map(b => b.type)).toEqual(['pulse', 'testPaper', 'markAndReview', 'targetedRepair'])
  })

  // ─── 2. Mark & Decode is never removed ───────────────────────────────────────

  it('markAndReview block is always present and has at least 15 minutes', () => {
    const blocks = buildSaturdayBlocks('History', 'Biology', emptyState, defaultProfile)
    const review = blocks.find(b => b.type === 'markAndReview')
    expect(review).toBeDefined()
    expect(review.duration).toBeGreaterThanOrEqual(15)
  })

  it('markAndReview is a distinct block separate from testPaper', () => {
    const blocks = buildSaturdayBlocks('History', 'Biology', emptyState, defaultProfile)
    const review = blocks.find(b => b.type === 'markAndReview')
    const paper  = blocks.find(b => b.type === 'testPaper')
    expect(review).not.toBe(paper)
    expect(review.label).toBe('Mark & Decode')
  })

  // ─── 3. Longer pulse shrinks paper, not review ────────────────────────────

  it('longer pulse reduces testPaper duration before review duration', () => {
    const profileLongPulse = { ...defaultProfile, saturdayPulseDuration: 20 }
    const blocks           = buildSaturdayBlocks('History', 'Biology', emptyState, profileLongPulse)
    const paper  = blocks.find(b => b.type === 'testPaper')
    const review = blocks.find(b => b.type === 'markAndReview')
    // pulse=20 → paper = 90-20-15-10 = 45, review stays at 15
    expect(paper.duration).toBe(45)
    expect(review.duration).toBe(15)
  })

  it('does not exceed total available time', () => {
    const profileLongPulse = { ...defaultProfile, saturdayPulseDuration: 20 }
    const blocks           = buildSaturdayBlocks('History', 'Biology', emptyState, profileLongPulse)
    const total            = blocks.reduce((s, b) => s + b.duration, 0)
    expect(total).toBe(90)
  })

  // ─── 21. No exit ticket ───────────────────────────────────────────────────

  it('no exit ticket block in Saturday plan', () => {
    const blocks = buildSaturdayBlocks('History', 'Biology', emptyState, defaultProfile)
    const exitTicket = blocks.find(b =>
      b.type === 'exitTicket' ||
      b.label?.toLowerCase().includes('exit') ||
      b.label?.toLowerCase().includes('ticket')
    )
    expect(exitTicket).toBeUndefined()
  })
})

// ─── 4. Sunday block types ────────────────────────────────────────────────────

describe('Part 3 — Sunday block structure', () => {
  it('Sunday plan includes pulse, carryOverOrProgress, paperMistakeRepair, lightExamPractice', () => {
    const blocks = buildSundayBlocks('History', 'Biology', emptyState, defaultProfile)
    expect(blocks.map(b => b.type)).toEqual([
      'pulse', 'carryOverOrProgress', 'paperMistakeRepair', 'lightExamPractice',
    ])
  })

  it('no exit ticket block in Sunday plan', () => {
    const blocks = buildSundayBlocks('History', 'Biology', emptyState, defaultProfile)
    const exitTicket = blocks.find(b =>
      b.type === 'exitTicket' ||
      b.label?.toLowerCase().includes('exit') ||
      b.label?.toLowerCase().includes('ticket')
    )
    expect(exitTicket).toBeUndefined()
  })

  it('lightExamPractice block has practiceType shortExamQuestion', () => {
    const blocks       = buildSundayBlocks('History', 'Biology', emptyState, defaultProfile)
    const lightPractice = blocks.find(b => b.type === 'lightExamPractice')
    expect(lightPractice.practiceType).toBe('shortExamQuestion')
  })
})

// ─── 5–8. Paper subject selection ─────────────────────────────────────────────

describe('Part 3 — selectWeekendPaperSubject', () => {
  // ─── 5. Only selected subjects ───────────────────────────────────────────

  it('paper subject selection only uses selected subjects', () => {
    const state   = stateWithAnswers(['Maths', 'History', 'Sociology'])
    const profile = { ...defaultProfile, selectedSubjects: ['Maths', 'Sociology'] }
    const subject = selectWeekendPaperSubject(state, profile, SATURDAY)
    expect(['Maths', 'Sociology']).toContain(subject)
  })

  // ─── 6. Paper weights favour Maths over Sociology ────────────────────────

  it('paper practice weights favour Maths over History over Sociology when all else equal', () => {
    const state   = stateWithAnswers(['Maths', 'History', 'Sociology'])
    const profile = { ...defaultProfile, selectedSubjects: ['Maths', 'History', 'Sociology'] }
    const subject = selectWeekendPaperSubject(state, profile, SATURDAY)
    expect(subject).toBe('Maths')
  })

  // ─── 7. Recent paper penalty ──────────────────────────────────────────────

  it('subject with recent paper is penalised so a different subject is preferred', () => {
    const recentMathsPaper = {
      paperId: 'pr_x', subject: 'Maths',
      completedAt: '2026-06-14T10:00:00Z',  // 6 days before SATURDAY
    }
    const state   = stateWithAnswers(['Maths', 'History'], [recentMathsPaper])
    const profile = { ...defaultProfile, selectedSubjects: ['Maths', 'History'] }
    // Maths (95) - recent penalty (20) = 75 < History (80) → History wins
    const subject = selectWeekendPaperSubject(state, profile, SATURDAY)
    expect(subject).toBe('History')
  })

  // ─── 8. Weakness boost ────────────────────────────────────────────────────

  it('subject with high weakness count is boosted above the higher-weight subject', () => {
    const state = {
      ...stateWithAnswers(['Maths', 'History']),
      weakPoints: Array.from({ length: 5 }, (_, i) => makeWeakPoint({
        weakPointId: `hist_wp_${i}`,
        subject:     'History',
        topic:       `history_topic_${i}`,
        severity:    'high',
        timesFailed: 5,
      })),
    }
    const profile = { ...defaultProfile, selectedSubjects: ['Maths', 'History'] }
    // History: 80 + 20 (weakness) + 15 = 115 > Maths: 95 + 0 + 15 = 110
    const subject = selectWeekendPaperSubject(state, profile, SATURDAY)
    expect(subject).toBe('History')
  })
})

// ─── 9–10. Topic eligibility ──────────────────────────────────────────────────

describe('Part 3 — isTopicEligibleForPaperPractice', () => {
  // ─── 9. Untaught topics excluded ─────────────────────────────────────────

  it('excludes notStarted topics from paper practice', () => {
    expect(isTopicEligibleForPaperPractice({ status: 'notStarted' })).toBe(false)
  })

  it('includes learned, reviewed, weak, mastered topics', () => {
    expect(isTopicEligibleForPaperPractice({ status: 'learned' })).toBe(true)
    expect(isTopicEligibleForPaperPractice({ status: 'reviewed' })).toBe(true)
    expect(isTopicEligibleForPaperPractice({ status: 'weak' })).toBe(true)
    expect(isTopicEligibleForPaperPractice({ status: 'mastered' })).toBe(true)
  })

  // ─── 10. Diagnostic mode overrides ───────────────────────────────────────

  it('diagnostic mode can include untaught topics', () => {
    expect(isTopicEligibleForPaperPractice({ status: 'notStarted' }, { diagnosticMode: true })).toBe(true)
  })
})

// ─── 11–13. selectPaperActivity ───────────────────────────────────────────────

describe('Part 3 — selectPaperActivity', () => {
  // Drama has no MODULE_GROUP so uses the correctAnswers fallback for coverage.

  it('returns microPaper for low coverage (no answers recorded)', () => {
    const result = selectPaperActivity('Drama', emptyState, 50)
    expect(result).toBe('microPaper')
  })

  it('returns paperSection for medium coverage (10–19 correct answers)', () => {
    const state = {
      ...emptyState,
      correctAnswers: Array.from({ length: 12 }, () => ({ subject: 'Drama', topic: 'performance', date: '2026-01-01', source: 'test' })),
    }
    const result = selectPaperActivity('Drama', state, 50)
    expect(result).toBe('paperSection')
  })

  it('returns fullPaper for high coverage and sufficient time', () => {
    const state = {
      ...emptyState,
      correctAnswers: Array.from({ length: 30 }, () => ({ subject: 'Drama', topic: 'performance', date: '2026-01-01', source: 'test' })),
    }
    const result = selectPaperActivity('Drama', state, 90)
    expect(result).toBe('fullPaper')
  })

  it('returns microPaper in diagnostic mode regardless of coverage', () => {
    const state = {
      ...emptyState,
      correctAnswers: Array.from({ length: 30 }, () => ({ subject: 'Drama', topic: 'performance', date: '2026-01-01', source: 'test' })),
    }
    const result = selectPaperActivity('Drama', state, 90, { diagnosticMode: true })
    expect(result).toBe('microPaper')
  })
})

// ─── 14. Paper result model ───────────────────────────────────────────────────

describe('Part 3 — paper result model', () => {
  it('paper result model accepts question-level marks', () => {
    expect(samplePaperResult.questionResults).toHaveLength(4)
    expect(samplePaperResult.questionResults[0].marksAvailable).toBe(4)
    expect(samplePaperResult.questionResults[0].marksScored).toBe(2)
    expect(samplePaperResult.questionResults[0].errorType).toBe('weakMethod')
  })

  it('ERROR_TYPES constant contains expected error types', () => {
    expect(ERROR_TYPES).toContain('knowledgeGap')
    expect(ERROR_TYPES).toContain('tooVague')
    expect(ERROR_TYPES).toContain('poorExamTechnique')
  })
})

// ─── 15. Paper mistakes create weak points ────────────────────────────────────

describe('Part 3 — processPaperResults', () => {
  it('paper mistakes create weak points for incorrect questions', () => {
    const { weakPoints } = processPaperResults(samplePaperResult, emptyState)
    expect(weakPoints.length).toBeGreaterThan(0)
    const ratioWP = weakPoints.find(wp => wp.topic === 'ratio')
    expect(ratioWP).toBeDefined()
    expect(ratioWP.subject).toBe('Maths')
  })

  it('correct answers do not create weak points', () => {
    const { weakPoints } = processPaperResults(samplePaperResult, emptyState)
    const fractionsWP = weakPoints.find(wp => wp.topic === 'fractions')
    expect(fractionsWP).toBeUndefined()
  })

  // ─── 16. tooVague → exam-technique severity ───────────────────────────────

  it('tooVague error on a question with ≥40% marks lost gets high severity', () => {
    const qResult = {
      topic: 'source_eval', skillTag: 'evaluation',
      marksAvailable: 4, marksScored: 1, errorType: 'tooVague',
    }
    const severity = calculatePaperMistakeSeverity(qResult)
    expect(severity).toBe('high')
  })

  it('zero-mark answer gets high severity regardless of error type', () => {
    const qResult = {
      topic: 'algebra', skillTag: null,
      marksAvailable: 6, marksScored: 0, errorType: 'knowledgeGap',
    }
    const severity = calculatePaperMistakeSeverity(qResult)
    expect(severity).toBe('high')
  })

  // ─── 17. Review summary identifies top pattern ────────────────────────────

  it('paper review summary identifies the top mistake pattern', () => {
    const paperWithVagueness = {
      ...samplePaperResult,
      subject: 'History',
      questionResults: [
        { questionId: 'q1', topic: 'source_eval',    skillTag: 'evaluation', marksAvailable: 4, marksScored: 1, errorType: 'tooVague' },
        { questionId: 'q2', topic: 'source_utility', skillTag: 'inference',  marksAvailable: 4, marksScored: 2, errorType: 'tooVague' },
        { questionId: 'q3', topic: 'chronology',     skillTag: null,         marksAvailable: 2, marksScored: 1, errorType: 'knowledgeGap' },
      ],
    }
    const summary = buildPaperReviewSummary(paperWithVagueness, [])
    expect(summary.topMistakePattern).toBe('tooVague')
    expect(summary).toHaveProperty('highestValueRepair')
    expect(summary).toHaveProperty('quickWin')
  })
})

// ─── 18. Weekend results boost next week ─────────────────────────────────────

describe('Part 3 — applyPaperResultToLearningState', () => {
  it('weekend paper results boost the relevant subject priority for next week', () => {
    const newState = applyPaperResultToLearningState(emptyState, samplePaperResult)
    expect(newState.subjectBoosts).toBeDefined()
    expect(newState.subjectBoosts['Maths']).toBeGreaterThan(0)
  })

  it('paper result is stored in paperResults array', () => {
    const newState = applyPaperResultToLearningState(emptyState, samplePaperResult)
    expect(newState.paperResults).toHaveLength(1)
    expect(newState.paperResults[0].paperId).toBe('pr_001')
  })

  it('weak points are added from paper question results', () => {
    const newState = applyPaperResultToLearningState(emptyState, samplePaperResult)
    expect(newState.weakPoints.length).toBeGreaterThan(0)
  })

  it('calculateSubjectBoostsFromPaper returns higher boost for more marks lost', () => {
    const badPaper    = { ...samplePaperResult, subject: 'History', marksAvailable: 20, marksScored: 0 }
    const averagePaper = { ...samplePaperResult, subject: 'History', marksAvailable: 20, marksScored: 10 }
    const highBoost   = calculateSubjectBoostsFromPaper(badPaper)['History']
    const lowerBoost  = calculateSubjectBoostsFromPaper(averagePaper)['History']
    expect(highBoost).toBeGreaterThan(lowerBoost)
  })
})

// ─── 19–20. Sunday paperMistakeRepair ─────────────────────────────────────────

describe('Part 3 — Sunday paperMistakeRepair source', () => {
  // ─── 19. Uses Saturday paper result ──────────────────────────────────────

  it('Sunday Patch uses Saturday recommended repair when Saturday paper result is available', () => {
    const stateWithPaper = {
      ...emptyState,
      paperResults: [{ ...samplePaperResult, subject: 'Maths', completedAt: '2026-06-20T10:00:00Z' }],
      weakPoints: [{
        weakPointId:      'maths_ratio_1',
        subject:          'Maths',
        topic:            'ratio',
        skillTag:         'ratio_problem_solving',
        errorType:        'weakMethod',
        severity:         'medium',
        firstSeenAt:      '2026-06-20',
        lastSeenAt:       '2026-06-20',
        timesFailed:      2,
        timesCorrectAfter: 0,
        status:           'new',
        nextReviewAt:     '2026-06-21',
      }],
    }
    const profile = { ...defaultProfile, selectedSubjects: ['Maths', 'History'] }
    const blocks  = buildSundayBlocks('Maths', 'History', stateWithPaper, profile)
    const patch   = blocks.find(b => b.type === 'paperMistakeRepair')
    expect(patch.source).toBe('saturdayPaper')
    expect(patch.topic).toBe('ratio')
  })

  // ─── 20. Falls back to weak point ────────────────────────────────────────

  it('Sunday Patch falls back to highest-priority weak point when no Saturday result exists', () => {
    const stateWithWeakPoint = {
      ...emptyState,
      weakPoints: [makeWeakPoint({ subject: 'History', topic: 'germ_theory', status: 'new', timesFailed: 3 })],
    }
    const blocks = buildSundayBlocks('History', null, stateWithWeakPoint, defaultProfile)
    const patch  = blocks.find(b => b.type === 'paperMistakeRepair')
    expect(patch.topic).toBe('germ_theory')
    expect(patch.source).toBeUndefined()
  })

  it('Sunday Patch block is never absent even with no history', () => {
    const blocks = buildSundayBlocks('History', 'Biology', emptyState, defaultProfile)
    const patch  = blocks.find(b => b.type === 'paperMistakeRepair')
    expect(patch).toBeDefined()
    expect(patch.label).toBe('Patch')
  })
})

// ─── 22. classifyIncompleteWork testPaper ─────────────────────────────────────

describe('Part 3 — classifyIncompleteWork testPaper', () => {
  it('started testPaper above 50% resumes next session', () => {
    expect(classifyIncompleteWork({ type: 'testPaper', progressPercent: 60 })).toBe('resume_next')
  })

  it('not-started testPaper is dropped or deferred', () => {
    expect(classifyIncompleteWork({ type: 'testPaper', progressPercent: 0 })).toBe('drop_or_defer')
  })

  it('missed testPaper below 50% is dropped, not carried forward as debt', () => {
    expect(classifyIncompleteWork({ type: 'testPaper', progressPercent: 30 })).toBe('drop_or_defer')
  })
})
