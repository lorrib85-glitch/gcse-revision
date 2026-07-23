import CalculationBreakdown from './CalculationBreakdown.jsx'

// Reference worked example: solve 3(x − 4) = 2x + 7 for x.
const block = {
  goalPrompt: 'Solve for x',
  problem: '3(x − 4) = 2x + 7',
  understand: {
    whatsHappening: 'We need to solve for x. That means we want x on its own on one side of the equation.',
    goal: 'Isolate x',
    check: {
      question: 'What is the goal of solving for x?',
      options: ['Make the equation bigger', 'Get x on its own', 'Remove the brackets'],
      correct: 1,
    },
  },
  steps: [
    {
      mode: 'worked',
      title: 'Expand the brackets',
      why: 'Multiply 3 by everything inside the brackets.',
      transform: { from: '3(x − 4) = 2x + 7', to: '3x − 12 = 2x + 7' },
      whyStep: 'Expanding the brackets removes the grouping so we can simplify each side.',
      check: {
        question: 'Is this expansion correct?',
        options: ['3x − 12 = 2x + 7', '3x + 4 = 2x + 7', '3x − 4 = 2x + 7'],
        correct: 0,
      },
      cta: 'Looks good',
    },
    {
      mode: 'worked',
      title: 'Subtract 2x from both sides',
      why: 'This keeps the equation balanced and moves the x terms together.',
      transform: { from: '3x − 12 = 2x + 7', leftOp: '− 2x', rightOp: '− 2x', to: 'x − 12 = 7' },
      whyStep: 'Taking 2x from each side keeps it balanced while collecting the x terms on one side.',
      check: {
        question: 'What should the equation look like after subtracting 2x?',
        options: ['x − 12 = 7', 'x = 19', '5x − 12 = 7'],
        correct: 0,
      },
      cta: 'Continue',
    },
    {
      mode: 'yourTurn',
      title: 'Add 12 to both sides',
      why: 'This will move −12 to the other side to cancel it out.',
      transform: { from: 'x − 12 = 7', leftOp: '+ 12', rightOp: '+ 12', to: 'x = 19' },
      answer: '19',
      resultExpr: 'x = 19',
      hint: 'Think: what happens when you add 12 to both sides? 7 + 12 = ?',
      cta: 'See the solution',
    },
  ],
  solution: {
    celebrateTitle: 'Well done!',
    celebrateSubtitle: 'You solved for x.',
    result: 'x = 19',
    why: 'Each step keeps the equation balanced. We isolate x to find its value.',
  },
}

export default {
  title: 'Learning/CalculationBreakdown',
  component: CalculationBreakdown,
  parameters: { layout: 'fullscreen' },
}

export const Default = {
  args: {
    block,
    onContinue: () => {},
  },
}
