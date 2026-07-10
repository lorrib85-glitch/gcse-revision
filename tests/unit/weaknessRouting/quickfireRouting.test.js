import { describe, it, expect, beforeEach } from 'vitest'
import { quickFireFromBank } from '../../../src/features/quickfire/logic/convertBankQuestion.js'
import {
  logWrongAnswer,
  logCorrectAnswer,
  getBiggestWin,
  getWeakTopics,
  clearWeaknessLog,
} from '../../../src/unifiedWeaknessTracker.js'
import { TAG_MODULE_MAP, findTaggedScreen } from '../../../src/data/tagModuleMap.js'
import { MODULES, isModuleAvailable } from '../../../src/modules.js'

function installLocalStorage() {
  const store = {}
  globalThis.localStorage = {
    get length() { return Object.keys(store).length },
    key: (i) => Object.keys(store)[i] ?? null,
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v) },
    removeItem: (k) => { delete store[k] },
    clear: () => { for (const k of Object.keys(store)) delete store[k] },
  }
  return store
}

let store
beforeEach(() => { store = installLocalStorage(); clearWeaknessLog() })

// storage.js namespaces every key by the active account scope; no user is
// signed in in this test file, so everything lives under the guest scope.
const scopedKey = key => `guest::${key}`

// A canonical QuickFire bank row: human topic label + canonical routing tag.
const MEDIEVAL_ROW = {
  id: 'qq_h1', subject: 'History', topic: 'Medieval Medicine', tag: 'four-humours',
  type: 'mcq', question: 'What caused disease?', options: ['Humours', 'Germs'], correctIndex: 0,
}

describe('QuickFire → canonical concept identity', () => {
  it('conversion forwards the canonical routing tag alongside the display topic', () => {
    const conv = quickFireFromBank(MEDIEVAL_ROW)
    expect(conv.topic).toBe('Medieval Medicine')   // human label preserved
    expect(conv.tag).toBe('four-humours')          // canonical routing identity
    expect(conv.moduleId).toBe(TAG_MODULE_MAP['four-humours'])
  })

  it('an incorrect QuickFire answer records both a display label and a canonical concept tag', () => {
    logWrongAnswer({ subject: 'History', topic: 'Medieval Medicine', conceptTag: 'four-humours', source: 'quiz', questionType: 'mcq' })
    const raw = JSON.parse(store[scopedKey('gcse_wrong_answers')])
    expect(raw[0].topic).toBe('Medieval Medicine')
    expect(raw[0].conceptTag).toBe('four-humours')
  })

  it('the weakness becomes eligible for valid recovery routing to an available module and a real tagged screen', () => {
    for (let i = 0; i < 2; i++) {
      logWrongAnswer({ subject: 'History', topic: 'Medieval Medicine', conceptTag: 'four-humours', source: 'quiz', questionType: 'mcq' })
    }
    const win = getBiggestWin()
    expect(win).toBeTruthy()
    // UI still shows the natural topic name, not the internal tag.
    expect(win.topic).toBe('Medieval Medicine')
    expect(win.conceptTag).toBe('four-humours')

    // Route resolves to a real, available module...
    const mod = MODULES.find(m => m.id === win.moduleId)
    expect(mod).toBeTruthy()
    expect(isModuleAvailable(mod)).toBe(true)

    // ...and to an exact tagged teaching screen.
    const screen = findTaggedScreen(mod, win.conceptTag)
    expect(screen).toBeTypeOf('number')
    expect(screen).toBeGreaterThanOrEqual(0)
    expect(screen).toBeLessThan(mod.screenCount)
  })

  it('a correct answer updates the same canonical weakness (error rate falls / clears)', () => {
    for (let i = 0; i < 2; i++) {
      logWrongAnswer({ subject: 'History', topic: 'Medieval Medicine', conceptTag: 'four-humours', source: 'quiz' })
    }
    const before = getWeakTopics().find(t => t.topic === 'Medieval Medicine')
    expect(before).toBeTruthy()
    for (let i = 0; i < 5; i++) {
      logCorrectAnswer({ subject: 'History', topic: 'Medieval Medicine', conceptTag: 'four-humours', source: 'quiz' })
    }
    const after = getWeakTopics().find(t => t.topic === 'Medieval Medicine')
    if (after) expect(after.errorRate).toBeLessThan(before.errorRate)
    else expect(after).toBeUndefined() // mastered out of the weak list
  })
})

describe('QuickFire routing — legacy / backward compatibility', () => {
  it('legacy human-label-only records (no concept tag) are never mis-routed by their label text', () => {
    for (let i = 0; i < 3; i++) {
      logWrongAnswer({ subject: 'History', topic: 'Medieval Medicine', source: 'quiz' }) // no conceptTag
    }
    // "Medieval Medicine" is not a TAG_MODULE_MAP key, so it must not resolve.
    expect(getBiggestWin()).toBeNull()
  })

  it('sources that log the canonical slug directly as topic still route (prior-knowledge recall)', () => {
    for (let i = 0; i < 2; i++) {
      logWrongAnswer({ subject: 'History', topic: 'germ-theory', source: 'module' }) // slug-as-topic, no conceptTag
    }
    const win = getBiggestWin()
    expect(win).toBeTruthy()
    expect(win.moduleId).toBe(TAG_MODULE_MAP['germ-theory'])
    expect(win.conceptTag).toBe('germ-theory')
  })

  it('existing history written before conceptTag existed remains readable and safe', () => {
    // Simulate a pre-migration stored log with no conceptTag field at all.
    store[scopedKey('gcse_wrong_answers')] = JSON.stringify([
      { timestamp: Date.now(), date: '2026-06-01', subject: 'History', topic: 'Renaissance Medicine', questionId: 'old-1', marks: 1, source: 'quiz', questionType: 'mcq' },
      { timestamp: Date.now(), date: '2026-06-01', subject: 'History', topic: 'Renaissance Medicine', questionId: 'old-2', marks: 1, source: 'quiz', questionType: 'mcq' },
    ])
    // Reads without throwing; the human-label topic is not a routing key → no mis-route.
    const weak = getWeakTopics()
    expect(weak.find(t => t.topic === 'Renaissance Medicine')).toBeTruthy()
    expect(getBiggestWin()).toBeNull()
  })
})
