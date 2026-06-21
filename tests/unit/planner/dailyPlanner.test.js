import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock localStorage-backed storage so all planner tests run in node cleanly.
// Must be declared before the dynamic import below.
const mockSetJson  = vi.fn()
const mockGetArray = vi.fn(() => [])
const mockGetObject = vi.fn(() => ({}))

vi.mock('../../../src/lib/storage.js', () => ({
  getArray:  mockGetArray,
  getObject: mockGetObject,
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
  ALL_SUBJECTS,
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
}

const defaultProfile = {
  selectedSubjects: ['History', 'Biology', 'Sociology'],
  weekdayMinutes:   60,
  saturdayMinutes:  90,
  sundayMinutes:    60,
  name:             'Test User',
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ─── 1–3: getPlanningMode ─────────────────────────────────────────────────────

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

// ─── 4–8: Weekday plan structure ──────────────────────────────────────────────

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

  it('puts main subject in mainProgress, weakRepair, examMove', () => {
    const blocks = buildWeekdayBlocks('History', 'Biology', emptyState, defaultProfile)
    expect(blocks[1].subject).toBe('History')
    expect(blocks[2].subject).toBe('History')
    expect(blocks[3].subject).toBe('History')
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

// ─── 9–10: Saturday plan structure ───────────────────────────────────────────

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
    const mark = blocks.find(b => b.type === 'markAndReview')
    const paper = blocks.find(b => b.type === 'testPaper')
    expect(mark).toBeDefined()
    expect(paper).toBeDefined()
    expect(mark).not.toBe(paper)
  })
})

// ─── 11–12: Sunday plan structure ────────────────────────────────────────────

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

// ─── 13: buildDailyPlan purity ────────────────────────────────────────────────

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

// ─── 14: No unselected subject in any plan ────────────────────────────────────

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

// ─── 15: Rotation — same main subject avoided after 2 consecutive days ────────

describe('selectMainSubject — rotation avoidance', () => {
  it('avoids yesterday\'s main subject where another option exists', () => {
    const yesterday = '2026-06-21'  // Sunday before Monday
    const state = {
      ...emptyState,
      rotationHistory: { [yesterday]: { main: 'History', secondary: 'Biology' } },
    }
    // With History penalised -6, Biology or Sociology should win
    const main = selectMainSubject(['History', 'Biology', 'Sociology'], state, MONDAY)
    expect(main).not.toBe('History')
  })

  it('avoids 2-days-ago main subject where another option exists', () => {
    const twoDaysAgo = '2026-06-20'  // Saturday
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
    // Set History as main 3 days ago — penalty should NOT apply (only yesterday and 2-days-ago)
    const threeDaysAgo = '2026-06-19'
    const state = {
      ...emptyState,
      rotationHistory: { [threeDaysAgo]: { main: 'Biology', secondary: 'Sociology' } },
      // Give History a strong weakness signal so it should win without penalty interference
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
