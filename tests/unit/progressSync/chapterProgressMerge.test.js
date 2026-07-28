import { describe, expect, it } from 'vitest'
import {
  mergeProgressData,
  progressDataEqual,
} from '../../../src/data/progressSync/canonicalProgressMerge.js'

describe('chapter progress snapshot migration', () => {
  it('folds legacy and canonical copies into one canonical key', () => {
    const local = {
      'gcse_chapter_history-1': {
        screen: 4,
        hookDone: true,
        examinerAttempts: [{ id: 'local' }],
      },
    }
    const cloud = {
      'gcse_module_history-1': {
        screen: 9,
        completed: true,
        wylDone: true,
        recallDone: true,
        introDone: true,
        examinerAttempts: [{ id: 'cloud' }],
      },
    }

    const merged = mergeProgressData(local, cloud)
    expect(merged['gcse_chapter_history-1']).toEqual({
      screen: 9,
      completed: true,
      hookDone: true,
      wylDone: true,
      recallDone: true,
      introDone: true,
      examinerAttempts: [{ id: 'local' }, { id: 'cloud' }],
    })
    expect(merged['gcse_module_history-1']).toBeUndefined()
  })

  it('maps an old short id to the current canonical chapter key', () => {
    const merged = mergeProgressData(
      {},
      { gcse_module_mod8: { screen: 5, completed: true } },
    )
    expect(merged['gcse_chapter_history-medicine-modern-medicine'])
      .toEqual({ screen: 5, completed: true })
    expect(merged.gcse_module_mod8).toBeUndefined()
  })

  it('is idempotent after migration', () => {
    const migrated = mergeProgressData(
      { 'gcse_module_history-1': { screen: 6, completed: true } },
      {},
    )
    expect(progressDataEqual(mergeProgressData(migrated, migrated), migrated)).toBe(true)
  })
})
