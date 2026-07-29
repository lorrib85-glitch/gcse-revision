import { expect, fn, userEvent, within } from 'storybook/test'
import CalculationBreakdown from './CalculationBreakdown.jsx'

const algebra = {
  goalPrompt: 'Solve for x',
  problem: '3(x − 4) = 2x + 7',
  understand: {
    intro: 'We are trying to find the number x stands for. To read that number, x needs to end up on its own.',
    goal: 'Get x on its own',
    whyGoal: 'When x is alone, the equation tells us its value directly.',
    decision: {
      question: 'What should we deal with first?',
      support: 'Look for anything stopping the x terms being brought together.',
      options: [
        {
          label: 'Expand the brackets',
          feedback: 'One x term is trapped inside the brackets. Expanding makes every term visible so we can bring the x terms together.',
        },
        {
          label: 'Subtract 2x from both sides',
          feedback: 'That will be useful later, but first we need to make the x inside the brackets visible.',
        },
        {
          label: 'Add 12 to both sides',
          feedback: 'There is no −12 yet. It appears only after the brackets have been expanded.',
        },
      ],
      correct: 0,
    },
  },
  steps: [
    {
      mode: 'worked',
      title: 'Expand the brackets',
      why: 'Multiply 3 by everything inside the brackets.',
      transform: { from: '3(x − 4) = 2x + 7', to: '3x − 12 = 2x + 7' },
      whyStep: 'The 3 means three lots of every term inside the brackets. Expanding makes those terms visible.',
      check: {
        question: 'Is this expansion correct?',
        options: ['3x − 12 = 2x + 7', '3x + 4 = 2x + 7', '3x − 4 = 2x + 7'],
        correct: 0,
      },
    },
    {
      mode: 'yourTurn',
      title: 'Bring the x terms together',
      why: 'Subtract 2x from both sides so the x terms are on one side.',
      transform: { from: '3x − 12 = 2x + 7', leftOp: '− 2x', rightOp: '− 2x', to: 'x − 12 = 7' },
      answer: '7',
      resultExpr: 'x − 12 = 7',
      hint: '3x − 2x leaves x. What remains on the right?',
      cta: 'See the solution',
    },
  ],
  solution: {
    result: 'x = 19',
    celebrateSubtitle: 'You found the value of x.',
    why: 'Each operation was applied to both sides, so the equation stayed balanced while x was isolated.',
  },
}

const percentage = {
  goalPrompt: 'Work out the new price',
  problem: 'Increase £80 by 15%',
  understand: {
    intro: 'The price starts at £80 and must become 15% larger.',
    goal: 'Find the extra 15%, then add it to £80',
    whyGoal: 'An increase keeps the original amount and adds an extra part to it.',
    decision: {
      question: 'What should we find first?',
      support: 'We need to know how much extra money 15% represents.',
      options: [
        {
          label: '15% of £80',
          feedback: 'The 15% is the extra amount. Once we know its value, we can add it to the original £80.',
        },
        {
          label: '£80 − £15',
          feedback: '15% does not mean £15. A percentage is a fraction of the starting amount.',
        },
        {
          label: '£80 ÷ 15',
          feedback: 'Dividing by 15 does not find 15%. We need a percentage of the original amount.',
        },
      ],
      correct: 0,
    },
  },
  steps: [
    {
      mode: 'worked',
      title: 'Find 15% of £80',
      why: '10% is £8 and 5% is £4, so 15% is £12.',
      transform: { from: '15% of £80', to: '£12' },
      whyStep: 'Breaking 15% into 10% and 5% makes the calculation easier to see.',
    },
    {
      mode: 'yourTurn',
      title: 'Add the increase',
      why: 'The word increase means add the extra amount to the starting price.',
      transform: { from: '£80 + £12', to: '£92' },
      answer: '92',
      resultExpr: '£92',
      hint: 'Add the original £80 and the extra £12.',
    },
  ],
  solution: {
    result: '£92',
    celebrateSubtitle: 'You increased £80 by 15%.',
    why: 'The original £80 stays, and 15% of £80 is added to it.',
  },
}

const geometry = {
  goalPrompt: 'Find the area of the triangle',
  problem: 'Base = 8 cm   Height = 5 cm',
  understand: {
    intro: 'Area tells us how much flat space is inside the triangle.',
    goal: 'Use the base and perpendicular height to find the area',
    whyGoal: 'A triangle is half of a rectangle with the same base and perpendicular height.',
    decision: {
      question: 'Which calculation matches that idea?',
      options: [
        {
          label: '½ × 8 × 5',
          feedback: 'Base × height finds the matching rectangle. Multiplying by ½ keeps only the triangular half.',
        },
        {
          label: '8 + 5',
          feedback: 'Adding lengths does not measure the space inside a shape.',
        },
        {
          label: '8 × 5',
          feedback: 'That finds the whole matching rectangle. The triangle takes up only half of it.',
        },
      ],
      correct: 0,
    },
  },
  steps: [
    {
      mode: 'worked',
      title: 'Multiply the base and height',
      why: 'This finds the area of the matching rectangle.',
      transform: { from: '8 × 5', to: '40' },
      whyStep: 'The rectangle and triangle share the same base and perpendicular height.',
    },
    {
      mode: 'yourTurn',
      title: 'Take half',
      why: 'The triangle is half of that rectangle.',
      transform: { from: '40 ÷ 2', to: '20 cm²' },
      answer: '20',
      resultExpr: '20 cm²',
      hint: 'Half of 40 is…',
    },
  ],
  solution: {
    result: '20 cm²',
    celebrateSubtitle: 'You found the area of the triangle.',
    why: 'The matching rectangle has area 40 cm², and the triangle is half of it.',
  },
}

const fractions = {
  goalPrompt: 'Add the fractions',
  problem: '2/3 + 1/4',
  understand: {
    intro: 'The fractions use different-sized pieces: thirds and quarters.',
    goal: 'Rewrite both fractions using equal-sized pieces',
    whyGoal: 'We can only count pieces together when the pieces are the same size.',
    decision: {
      question: 'What should we do first?',
      options: [
        {
          label: 'Find a common denominator',
          feedback: 'A common denominator rewrites both fractions using the same-sized pieces without changing their values.',
        },
        {
          label: 'Add 3 and 4',
          feedback: 'Adding the denominators would change the size of the pieces instead of making them match.',
        },
        {
          label: 'Add the numerators immediately',
          feedback: 'The numerators count different-sized pieces, so they cannot be combined yet.',
        },
      ],
      correct: 0,
    },
  },
  steps: [
    {
      mode: 'worked',
      title: 'Rewrite both fractions in twelfths',
      why: '12 is the smallest number that both 3 and 4 divide into.',
      transform: { from: '2/3 + 1/4', to: '8/12 + 3/12' },
      whyStep: 'Multiplying the top and bottom by the same number keeps each fraction equal in value.',
    },
    {
      mode: 'yourTurn',
      title: 'Add the equal-sized pieces',
      why: 'The denominators now match, so add the numerators.',
      transform: { from: '8/12 + 3/12', to: '11/12' },
      answer: '11/12',
      resultExpr: '11/12',
      hint: 'Keep the denominator 12 and add 8 + 3.',
    },
  ],
  solution: {
    result: '11/12',
    celebrateSubtitle: 'You added fractions with different denominators.',
    why: 'The fractions were rewritten as twelfths, so the equal-sized pieces could be counted together.',
  },
}

// ─── Algebra reasoning presentations ─────────────────────────────────────────
//
// Opt-in `presentation` blocks. Each one hands the component explicit,
// validated numbers — never an equation string to parse — and the component
// derives the visual model, the wording and (for the machine) the entire undo
// path from them.

const algebraWhyLab = {
  title: 'Why do we divide by 3?',
  goalPrompt: 'Understand what 3x means before solving it',
  presentation: {
    variant: 'algebraWhy',
    model: { variable: 'x', coefficient: 3, total: 18, solution: 6 },
  },
}

const inverseMachine = {
  title: 'Undo it in reverse',
  goalPrompt: 'Solve 3x + 4 = 19 by undoing each action',
  presentation: {
    variant: 'inverseMachine',
    model: {
      variable: 'x',
      operations: [
        { type: 'multiply', value: 3 },
        { type: 'add', value: 4 },
      ],
      result: 19,
    },
  },
}

const groupSplit = {
  title: 'Share it into equal groups',
  goalPrompt: 'See 3x = 18 as three equal shares',
  presentation: {
    variant: 'groupSplit',
    model: { variable: 'x', groupCount: 3, total: 18, solution: 6 },
  },
}

const balance = {
  title: 'Keep both sides equal',
  goalPrompt: 'See why the same operation goes on both sides',
  presentation: {
    variant: 'balance',
    model: {
      states: [
        { left: '3x', right: '18', operation: '÷ 3', resultLeft: 'x', resultRight: '6' },
      ],
    },
  },
}

// A model that cannot be drawn honestly — 19 does not share equally between 3.
// The component refuses it and renders the generic walkthrough instead.
const invalidGroupSplit = {
  ...algebra,
  presentation: {
    variant: 'groupSplit',
    model: { variable: 'x', groupCount: 3, total: 19, solution: 6.33 },
  },
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function sceneId(canvasElement) {
  return canvasElement.querySelector('[data-cb-scene]')?.getAttribute('data-cb-scene')
}

async function chooseAndCheck(canvas, optionName) {
  await userEvent.click(canvas.getByRole('button', { name: optionName }))
  await userEvent.click(canvas.getByRole('button', { name: 'Check my answer' }))
}

async function continueScene(canvas) {
  await userEvent.click(canvas.getByRole('button', { name: /^(Continue|Next challenge)$/ }))
}

// Feedback copy deliberately appears twice: once in the verdict panel and once
// in the polite live region that announces the change. Assert presence rather
// than uniqueness for anything the live region also carries.
function expectText(canvas, matcher) {
  const matches = canvas.getAllByText(matcher)
  expect(matches.length, `No element matched ${matcher}`).toBeGreaterThan(0)
  return expect(matches[0]).toBeVisible()
}

/**
 * The verdict panel and the reasoning rail must do different jobs: one says
 * what just happened to this equation, the other carries the general rule.
 * They may not share a heading, and no sentence may appear in both.
 */
function expectNoDuplicatedExplanation(canvasElement) {
  const verdict = canvasElement.querySelector('[data-cb-verdict]')
  const rail = canvasElement.querySelector('[data-cb-reasoning-rail]')
  expect(verdict, 'no verdict panel rendered').not.toBeNull()
  expect(rail, 'no reasoning rail rendered').not.toBeNull()

  const headingOf = node => node.querySelector('h3, div')?.textContent?.trim()
  expect(headingOf(verdict)).toBe('What happened')
  expect(headingOf(rail)).toBe('Rule to remember')

  const sentences = node => (node.textContent ?? '')
    .split(/(?<=[.?!])\s+/)
    .map(part => part.trim())
    .filter(part => part.length > 12)

  const railSentences = new Set(sentences(rail))
  const repeated = sentences(verdict).filter(sentence => railSentences.has(sentence))
  expect(repeated, `Sentence repeated in both panels: ${repeated.join(' | ')}`).toEqual([])
}

// ContinueCTA is a locked component and expresses its disabled state through
// styling rather than the `disabled` attribute, so the gate is asserted for
// what it actually has to do: pressing Continue must not advance the scene.
async function expectGateHeld(canvas, canvasElement) {
  const before = sceneId(canvasElement)
  await continueScene(canvas)
  expect(sceneId(canvasElement), 'Continue advanced the scene before the learner had committed to a decision').toBe(before)
}

function expectTouchTargets(canvasElement) {
  const buttons = [...canvasElement.querySelectorAll('button')]
  for (const button of buttons) {
    const { width, height } = button.getBoundingClientRect()
    if (width === 0 && height === 0) continue
    expect(
      height,
      `Interactive target "${button.textContent?.trim() || button.getAttribute('aria-label')}" is under 44px tall`,
    ).toBeGreaterThanOrEqual(43.5)
  }
}

export default {
  title: 'Learning/CalculationBreakdown',
  component: CalculationBreakdown,
  parameters: { layout: 'fullscreen' },
}

// ─── Backwards compatibility — blocks with no `presentation` ─────────────────

export const Default = {
  name: 'Algebra',
  args: { block: algebra, onContinue: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    // The generic understand → steps → solution phase machine is untouched.
    await expect(canvas.getByText('Understand the question')).toBeVisible()
    expect(canvasElement.querySelector('[data-cb-scene]')).toBeNull()

    await userEvent.click(canvas.getByRole('button', { name: /Expand the brackets/ }))
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
    await expect(canvas.getByText('Step 1')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: /3x − 12 = 2x \+ 7/ }))
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
    await expect(canvas.getByText('Step 2')).toBeVisible()

    // The typed answer now uses the governed CheckAnswerCTA.
    await userEvent.type(canvas.getByLabelText('Your answer'), '7')
    await userEvent.click(canvas.getByRole('button', { name: 'Check my answer' }))
    await userEvent.click(canvas.getByRole('button', { name: 'See the solution' }))

    await expect(canvas.getByText('Complete solution')).toBeVisible()
    await expect(canvas.getByText('x = 19')).toBeVisible()

    // onContinue still fires only once past the final phase.
    expect(args.onContinue).not.toHaveBeenCalled()
    await userEvent.click(canvas.getByRole('button', { name: 'Next challenge' }))
    expect(args.onContinue).toHaveBeenCalledTimes(1)
  },
}

export const Percentage = {
  args: { block: percentage, onContinue: fn() },
}

export const Geometry = {
  args: { block: geometry, onContinue: fn() },
}

export const Fractions = {
  args: { block: fractions, onContinue: fn() },
}

// ─── Algebra Why Lab ─────────────────────────────────────────────────────────

export const AlgebraWhyLab = {
  name: 'Algebra Why Lab — 3x = 18',
  args: { block: algebraWhyLab, onContinue: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    // Scene 1 — 3x is built out of three equal groups, not asserted as a rule.
    expect(sceneId(canvasElement)).toBe('read')
    await expect(canvas.getByText('3x = 3 × x = x + x + x')).toBeVisible()
    expect(canvasElement.querySelector('[data-cb-variable-groups]')?.getAttribute('data-cb-variable-groups')).toBe('3')
    expect(canvasElement.querySelectorAll('[data-cb-variable-group]')).toHaveLength(3)
    expect(canvasElement.querySelector('[data-cb-counter-field]')?.getAttribute('data-cb-counter-field')).toBe('18')

    await continueScene(canvas)

    // Scene 2 — the learner must commit to an inverse operation before the
    // answer is available anywhere on screen.
    expect(sceneId(canvasElement)).toBe('goal')
    await expect(canvas.getByRole('button', { name: /Divide both sides by 3/ })).toBeVisible()
    expect(canvas.queryByText('x = 6')).toBeNull()
    await expectGateHeld(canvas, canvasElement)

    // The concrete model is still on screen at the moment of the decision —
    // three x groups, all 18 counters, and the equation — so the learner can
    // reason from the picture instead of falling back on symbols.
    await expectText(canvas, '3x = 18')
    expect(canvasElement.querySelectorAll('[data-cb-variable-group]')).toHaveLength(3)
    expect(canvasElement.querySelector('[data-cb-counter-field]')?.getAttribute('data-cb-counter-field')).toBe('18')
    // The counters sit in three equal blocks, so the shape of the answer is
    // visible without naming the operation that produces it.
    expect(canvasElement.querySelectorAll('[data-cb-counter-cluster]')).toHaveLength(3)

    // One instruction, one question, no third line eliminating a distractor.
    expect(canvas.queryByText(/Look at what is being done to the variable/)).toBeNull()
    expect(canvas.queryByText('x is being multiplied by 3.')).toBeNull()

    // The subtraction misconception is explained, not just marked wrong.
    await chooseAndCheck(canvas, /Subtract 3 from both sides/)
    await expectText(canvas, /no closer to being on its own/)
    await expectGateHeld(canvas, canvasElement)

    await chooseAndCheck(canvas, /Divide both sides by 3/)
    expectNoDuplicatedExplanation(canvasElement)

    await continueScene(canvas)

    // Scene 3 — dividing by 3 splits 18 into three equal groups of 6.
    expect(sceneId(canvasElement)).toBe('undo')
    await expectText(canvas, '3x ÷ 3 = 18 ÷ 3')
    const zones = [...canvasElement.querySelectorAll('[data-cb-group-zone]')]
    expect(zones).toHaveLength(3)
    expect(zones.map(zone => zone.getAttribute('data-cb-group-count'))).toEqual(['6', '6', '6'])
    await expect(canvas.getByText('Why both sides')).toBeVisible()

    await continueScene(canvas)

    // Scene 4 — reveal, then the substitution check.
    expect(sceneId(canvasElement)).toBe('check')
    await expectText(canvas, 'x = 6')
    await expectText(canvas, '3 × 6 = 18')
    await expect(canvas.getByText('How to check it')).toBeVisible()

    await userEvent.click(canvas.getByRole('button', { name: 'Next challenge' }))
    expect(args.onContinue).toHaveBeenCalledTimes(1)
  },
}

// ─── Inverse Operation Studio ────────────────────────────────────────────────

export const InverseOperationStudio = {
  name: 'Inverse Operation Studio — 3x + 4 = 19',
  args: { block: inverseMachine, onContinue: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    // Scene 1 — the forward chain, in the order it was applied.
    expect(sceneId(canvasElement)).toBe('read-forward')
    const forward = canvasElement.querySelector('[data-cb-machine="forward"]')
    expect(forward).not.toBeNull()
    await expectText(canvas, 'Multiply by 3')
    await expectText(canvas, 'Add 4')

    await continueScene(canvas)

    // Scene 2 — the last action is identified before anything is undone.
    expect(sceneId(canvasElement)).toBe('identify-last')
    await chooseAndCheck(canvas, /^B Add 4/)
    await expectText(canvas, /first one we undo/)
    await continueScene(canvas)

    // Scene 3 — the reverse path is derived: subtract 4 comes first.
    expect(sceneId(canvasElement)).toBe('undo-0')
    await expectText(canvas, 'Undo + 4')
    expect(canvasElement.querySelector('[data-cb-machine="reverse"]')).not.toBeNull()
    await chooseAndCheck(canvas, /Subtract 4 from both sides/)
    await expectText(canvas, '19 − 4 = 15')
    // The verdict says what just happened; the rail carries the general rule.
    // Neither repeats the other, and they no longer share a heading.
    expectNoDuplicatedExplanation(canvasElement)
    await expectText(canvas, /Subtraction undoes addition/)
    await continueScene(canvas)

    // Scene 4 — then divide by 3, revealing x = 5.
    expect(sceneId(canvasElement)).toBe('undo-1')
    await expectText(canvas, 'Undo × 3')
    await chooseAndCheck(canvas, /Divide both sides by 3/)
    await expectText(canvas, '15 ÷ 3 = 5')
    await continueScene(canvas)

    // Scene 5 — replaying the original forward machine returns 19.
    expect(sceneId(canvasElement)).toBe('replay-check')
    await expectText(canvas, 'x = 5')
    await expectText(canvas, 'Matches the result')
    await expectText(canvas, /returns 19/)

    await userEvent.click(canvas.getByRole('button', { name: 'Next challenge' }))
    expect(args.onContinue).toHaveBeenCalledTimes(1)
  },
}

// ─── Group Split Explorer ────────────────────────────────────────────────────

export const GroupSplitExplorer = {
  name: 'Group Split Explorer — 3x = 18',
  args: { block: groupSplit, onContinue: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    expect(sceneId(canvasElement)).toBe('read')
    expect(canvasElement.querySelectorAll('[data-cb-counter]')).toHaveLength(18)
    await continueScene(canvas)

    // Scene 2 — nothing has been shared yet, and Continue is held back.
    expect(sceneId(canvasElement)).toBe('share')
    expect(canvasElement.querySelectorAll('[data-cb-counter="loose"]')).toHaveLength(18)
    expect(canvasElement.querySelectorAll('[data-cb-counter="grouped"]')).toHaveLength(0)
    await expectGateHeld(canvas, canvasElement)

    // The algebra stays visible while the counters move, and the receiving
    // group is marked on screen rather than only in the ARIA label.
    await expectText(canvas, '3x = 18')
    expect(canvasElement.querySelector('[data-cb-group-next="true"]')?.getAttribute('data-cb-group-zone')).toBe('0')
    await expectText(canvas, 'Next')

    // Keyboard alone can deal counters — dragging is never required.
    const firstCounter = canvas.getAllByRole('button', { name: /Deal a counter into group/ })[0]
    firstCounter.focus()
    await userEvent.keyboard('{Enter}')
    expect(canvasElement.querySelectorAll('[data-cb-counter="loose"]')).toHaveLength(17)
    expect(canvasElement.querySelectorAll('[data-cb-counter="grouped"]')).toHaveLength(1)
    // The marker follows the rotation, so the next destination is predictable.
    expect(canvasElement.querySelector('[data-cb-group-next="true"]')?.getAttribute('data-cb-group-zone')).toBe('1')

    // Conservation: loose + grouped is always the original total.
    expect(canvasElement.querySelectorAll('[data-cb-counter]')).toHaveLength(18)

    // And the whole model can be completed from the keyboard.
    const splitAll = canvas.getByRole('button', { name: 'Split into 3 equal groups' })
    splitAll.focus()
    await userEvent.keyboard('{Enter}')

    const zones = [...canvasElement.querySelectorAll('[data-cb-group-zone]')]
    expect(zones).toHaveLength(3)
    expect(zones.map(zone => zone.getAttribute('data-cb-group-count'))).toEqual(['6', '6', '6'])
    expect(canvasElement.querySelectorAll('[data-cb-counter="loose"]')).toHaveLength(0)
    expect(canvasElement.querySelectorAll('[data-cb-counter="grouped"]')).toHaveLength(18)

    await continueScene(canvas)

    expect(sceneId(canvasElement)).toBe('reveal')
    await expectText(canvas, 'x = 6')
    await expectText(canvas, '3 × 6 = 18')

    await userEvent.click(canvas.getByRole('button', { name: 'Next challenge' }))
    expect(args.onContinue).toHaveBeenCalledTimes(1)
  },
}

// ─── Balance & Solve ─────────────────────────────────────────────────────────

export const BalanceAndSolve = {
  name: 'Balance & Solve — 3x = 18',
  args: { block: balance, onContinue: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    // Scene 1 — the equation begins equal, and the figure says so.
    expect(sceneId(canvasElement)).toBe('read')
    expect(canvasElement.querySelector('[data-cb-balance]')?.getAttribute('data-cb-balance')).toBe('valid')
    await expectText(canvas, 'Balanced. Anything done from here has to keep it that way.')
    await continueScene(canvas)

    // Scene 2 — the one-sided move is offered, refused, and explained. It can
    // never complete the step.
    expect(sceneId(canvasElement)).toBe('choose-0')

    // Nothing tells the learner the goal is to keep the balance true — that
    // is what the one-sided attempt is there to teach them.
    expect(canvas.queryByText(/The same action on both sides is the only move/)).toBeNull()
    expect(canvas.queryByText(/without breaking the balance/)).toBeNull()
    expect(canvasElement.querySelector('[data-cb-balance]')?.getAttribute('data-cb-balance')).toBe('valid')

    // A one-sided move breaks the balance immediately and visibly.
    await chooseAndCheck(canvas, /Divide one side only by 3/)
    const broken = canvasElement.querySelector('[data-cb-balance]')
    expect(broken?.getAttribute('data-cb-balance')).toBe('invalid')
    expect(broken?.getAttribute('data-cb-balance-changed-side')).toBe('left')
    expect(canvasElement.querySelector('[data-cb-balance-beam]')?.getAttribute('data-cb-balance-beam')).toBe('tipped')
    // The incorrect equation is retained, the changed side is named, and the
    // announcement says the sides are no longer equal.
    await expectText(canvas, '3x ÷ 3 = 18')
    await expectText(canvas, 'Only the left side changed')
    await expectText(canvas, /no longer equal/)
    await expectGateHeld(canvas, canvasElement)

    // Immediate retry: choosing correctly restores the level balance.
    await chooseAndCheck(canvas, /Divide both sides by 3/)
    expect(canvasElement.querySelector('[data-cb-balance]')?.getAttribute('data-cb-balance')).toBe('valid')
    await continueScene(canvas)

    // Scene 3 — the same operation on both sides, balance still level.
    expect(sceneId(canvasElement)).toBe('apply-0')
    await expectText(canvas, '3x ÷ 3 = 18 ÷ 3')
    expect(
      [...canvasElement.querySelectorAll('[data-cb-balance]')].map(node => node.getAttribute('data-cb-balance')),
    ).toEqual(['valid'])

    // The optional "what if we changed only one side?" aside is gone — that
    // lesson now happens at the moment of the choice, unconditionally.
    expect(canvas.queryByRole('button', { name: /changed only one side/ })).toBeNull()

    await continueScene(canvas)

    expect(sceneId(canvasElement)).toBe('reveal')
    await expectText(canvas, 'x = 6')
    expect(canvasElement.querySelector('[data-cb-balance]')?.getAttribute('data-cb-balance')).toBe('valid')

    await userEvent.click(canvas.getByRole('button', { name: 'Next challenge' }))
    expect(args.onContinue).toHaveBeenCalledTimes(1)
  },
}

// ─── Governance ──────────────────────────────────────────────────────────────

export const ReducedMotion = {
  name: 'Reduced motion',
  args: { block: algebraWhyLab, reducedMotion: true, onContinue: fn() },
  play: async ({ canvasElement }) => {
    const scene = canvasElement.querySelector('[data-cb-scene]')
    await expect(scene).toHaveAttribute('data-reduced-motion', 'true')
    // No entrance animation is scheduled at all when motion is reduced.
    expect(getComputedStyle(scene).animationName).toBe('none')
  },
}

export const ReducedMotionBalanceBreak = {
  name: 'Reduced motion — balance break is static',
  args: { block: balance, reducedMotion: true, onContinue: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await continueScene(canvas)
    await chooseAndCheck(canvas, /Divide one side only by 3/)

    // The reduced-motion path reaches the same tilted end state — it is not
    // skipped, only un-animated.
    const figure = canvasElement.querySelector('[data-cb-balance]')
    expect(figure?.getAttribute('data-cb-balance')).toBe('invalid')
    await expect(figure).toHaveAttribute('data-reduced-motion', 'true')

    const beam = canvasElement.querySelector('[data-cb-balance-beam]')
    expect(beam?.getAttribute('data-cb-balance-beam')).toBe('tipped')
    expect(getComputedStyle(beam).transitionDuration).toBe('0s')
    expect(getComputedStyle(beam).transform).not.toBe('none')
  },
}

export const MobileWidth = {
  name: 'Mobile width — 320px',
  args: { block: groupSplit, onContinue: fn() },
  // A transformed ancestor becomes the containing block for the shell's fixed
  // positioning, so this renders the component at a genuine 320px.
  decorators: [
    Story => (
      <div style={{ width: 320, height: 720, position: 'relative', transform: 'translateZ(0)', overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    const shell = canvasElement.querySelector('[data-cb-scene]')
    expect(shell.scrollWidth).toBeLessThanOrEqual(shell.clientWidth)
    expectTouchTargets(canvasElement)

    await continueScene(canvas)

    // The counter field is the widest thing this component draws.
    const sharing = canvasElement.querySelector('[data-cb-scene]')
    expect(sharing.scrollWidth).toBeLessThanOrEqual(sharing.clientWidth)
    expectTouchTargets(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Split into 3 equal groups' }))
    const zones = canvasElement.querySelector('[data-cb-group-zones]')
    expect(zones.scrollWidth).toBeLessThanOrEqual(zones.clientWidth)
  },
}

export const MobileWidthDecision = {
  name: 'Mobile width — 320px, decision scene',
  args: { block: algebraWhyLab, onContinue: fn() },
  decorators: [
    Story => (
      <div style={{ width: 320, height: 720, position: 'relative', transform: 'translateZ(0)', overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await continueScene(canvas)

    // The densest screen in the component — equation, three x groups, three
    // clustered blocks of counters and three options — still contained.
    const scene = canvasElement.querySelector('[data-cb-scene]')
    expect(scene.getAttribute('data-cb-scene')).toBe('goal')
    expect(scene.scrollWidth).toBeLessThanOrEqual(scene.clientWidth)
    expect(canvasElement.querySelectorAll('[data-cb-variable-group]')).toHaveLength(3)
    expect(canvasElement.querySelectorAll('[data-cb-counter-cluster]')).toHaveLength(3)
    expectTouchTargets(canvasElement)
  },
}

export const InvalidModelFallsBack = {
  name: 'Invalid model falls back to standard',
  args: { block: invalidGroupSplit, onContinue: fn() },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    // 19 counters cannot be shared equally between 3 groups, so no visual
    // model is drawn — the generic walkthrough renders instead.
    expect(canvasElement.querySelector('[data-cb-scene]')).toBeNull()
    await expect(canvas.getByText('Understand the question')).toBeVisible()
  },
}
