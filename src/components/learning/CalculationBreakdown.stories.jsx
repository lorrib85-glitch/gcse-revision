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

export default {
  title: 'Learning/CalculationBreakdown',
  component: CalculationBreakdown,
  parameters: { layout: 'fullscreen' },
}

export const Default = {
  name: 'Algebra',
  args: { block: algebra, onContinue: () => {} },
}

export const Percentage = {
  args: { block: percentage, onContinue: () => {} },
}

export const Geometry = {
  args: { block: geometry, onContinue: () => {} },
}

export const Fractions = {
  args: { block: fractions, onContinue: () => {} },
}
