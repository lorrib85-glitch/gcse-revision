/**
 * QuickFire exit contract (Phase 6 / backlog A1).
 *
 * The bug this pins: TestTab used to hand QuickFireMode a local state setter
 * (`onExit={() => setQfSessionActive(false)}`) instead of the parent's onExit.
 * Finishing a round therefore fell through to an internal subject-selection
 * landing rather than returning the learner to Pulse / Home / the chapter they
 * came from — and that landing could not even render, because its browsers read
 * useTestData() and TestDataProvider wraps only the Exams tab.
 *
 * TestTab is a plain function component, so calling it and inspecting the
 * returned element asserts the wiring itself, not a rendered snapshot.
 */

import { describe, it, expect, vi } from 'vitest'
import React from 'react'
import TestTab from '../../../src/features/quickfire/QuickFire.jsx'
import { QuickFireMode } from '../../../src/features/quickfire/modes/QuickFireMode.jsx'
import { ExamMode } from '../../../src/features/quickfire/modes/ExamMode.jsx'

// The `unit` vitest project runs with `extends: false` and therefore without the
// React plugin, so esbuild compiles JSX with the classic `React.createElement`
// runtime. Nothing puts React in scope for a source file that never imports it,
// so expose it globally for the duration of this suite.
globalThis.React = React

describe('TestTab mode="quickfire"', () => {
  it('renders the QuickFire round, never a subject-selection landing', () => {
    const element = TestTab({ mode: 'quickfire', onExit: () => {} })
    expect(element.type).toBe(QuickFireMode)
  })

  it('passes the parent onExit straight through to QuickFireMode', () => {
    const onExit = vi.fn()
    const element = TestTab({ mode: 'quickfire', onExit })

    expect(
      element.props.onExit,
      'QuickFireMode must receive the parent onExit by identity — a local wrapper ' +
      'means the round exits into TestTab instead of back to its origin tab.',
    ).toBe(onExit)
  })

})

describe('TestTab mode="exam"', () => {
  it('renders Exam Mode with the parent navigation callbacks intact', () => {
    const onExit = vi.fn()
    const onOpenChapter = vi.fn()
    const onOpenPulse = vi.fn()
    const clearExamAutoStart = vi.fn()
    const examAutoStart = { paperId: 'medicine-2023' }

    const element = TestTab({
      mode: 'exam',
      onExit,
      onOpenChapter,
      onOpenPulse,
      examAutoStart,
      clearExamAutoStart,
    })

    expect(element.type).toBe(ExamMode)
    expect(element.props.onExit).toBe(onExit)
    expect(element.props.onOpenChapter).toBe(onOpenChapter)
    expect(element.props.onOpenPulse).toBe(onOpenPulse)
    expect(element.props.examAutoStart).toBe(examAutoStart)
    expect(element.props.clearExamAutoStart).toBe(clearExamAutoStart)
  })
})

describe('TestTab — unsupported modes', () => {
  it('renders nothing for the removed default "test" mode', () => {
    expect(TestTab({ mode: 'test', onExit: () => {} })).toBeNull()
  })

  it('renders nothing when no mode is given', () => {
    expect(TestTab({})).toBeNull()
  })
})
