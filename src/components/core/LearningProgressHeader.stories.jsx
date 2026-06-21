import LearningProgressHeader from './LearningProgressHeader'

export default {
  component: LearningProgressHeader,
  tags: ['ai-generated'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#070a12' }] },
  },
  decorators: [
    Story => (
      <div style={{ background: '#070a12', padding: '16px', minHeight: '80px' }}>
        <Story />
      </div>
    ),
  ],
}

const STAGE_NAV = [
  { id: 'p1', title: 'The Black Death arrives', description: 'How the plague reached England.',  screenIndex: 0  },
  { id: 'p2', title: 'Medieval causes',          description: 'What people believed caused it.', screenIndex: 4  },
  { id: 'p3', title: 'Medieval treatments',      description: 'How they tried to cure it.',      screenIndex: 9  },
  { id: 'p4', title: 'Government responses',     description: 'Actions taken by authorities.',   screenIndex: 14 },
  { id: 'p5', title: 'Review',                   description: 'Consolidate your learning.',      screenIndex: 20 },
  { id: 'p6', title: 'Exam prep',                description: 'Exam practice and application.',  screenIndex: 24 },
]

const SHARED = {
  accent: '#E8A84B',
  accentRgb: '232,168,75',
  onStageJump: () => {},
}

// currentScreen=0: only p1 qualifies (screenIndex 0 ≤ 0) → dot 1 active
export const AtStart = {
  name: 'Start of module — dot 1 active',
  args: { ...SHARED, stageNavigation: STAGE_NAV, currentScreen: 0 },
}

// currentScreen=11: p1(0)✓ p2(4)✓ p3(9)✓ p4(14)✗ → dot 3 active, dots 1–2 done
export const MidModule = {
  name: 'Mid-module — dot 3 active, dots 1–2 complete',
  args: { ...SHARED, stageNavigation: STAGE_NAV, currentScreen: 11 },
}

// currentScreen=26: all screenIndices ≤ 26 → dot 6 active, dots 1–5 done
export const FinalStage = {
  name: 'Final stage — dot 6 active, all previous complete',
  args: { ...SHARED, stageNavigation: STAGE_NAV, currentScreen: 26 },
}

// Empty stageNavigation → component uses INTERNAL_FALLBACK generic labels
export const FallbackLabels = {
  name: 'Fallback labels — no stageNavigation provided',
  args: { ...SHARED, stageNavigation: [], currentScreen: 0 },
}
