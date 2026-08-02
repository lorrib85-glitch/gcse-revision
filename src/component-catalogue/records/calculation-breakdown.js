// CalculationBreakdown — component catalogue record.
//
// Build-time governance data. This record is the single home for what the
// catalogue says about CalculationBreakdown; `docs/components/COMPONENT_REGISTRY.md`
// is generated from it. Run `pnpm catalogue:generate` after editing.

export default {
  id: 'calculation-breakdown',
  name: 'CalculationBreakdown',
  source: 'src/components/learning/CalculationBreakdown.jsx',
  exportName: null,
  order: 30,
  section: 'learning',
  kind: 'reusable',
  lifecycle: 'reviewing',
  lifecycleReason: 'Full-screen component available in the Component Lab but not yet routed in ChapterPlayer.jsx.',
  purpose: 'A staged teaching-and-application component that helps the learner interpret one procedural calculation, choose a useful first move, follow worked transformations, complete part of the method themselves and see why the full solution works. It lives inside the standard interaction frame and owns only the local calculation sequence.',
  ownership: {
    internalDirectories: [
      {
        path: 'src/components/learning/calculationBreakdown',
        reason: 'Visual models, controls, figures and parts used only to render CalculationBreakdown, plus its pure operation maths and model validation. Not separately selectable, and deliberately not an authoring choice.'
      }
    ],
    internalFiles: []
  },
  documentation: {
    bestUsedFor: 'Multi-step GCSE Maths or Science calculations where understanding the method matters as much as obtaining the final answer — including equations, rearranging formulae, fractions, percentages, substitution, geometry and scientific equations.',
    props: [
      'block',
      'subject (defaults to Maths)',
      'accent',
      'reducedMotion (test/story override only)',
      'onContinue'
    ],
    dataShape: "{ title?, goalPrompt?, problem, understand: { heading?, intro?, whatsHappening?, goal?, whyGoal?, decision?, check? }, steps: [{ mode: 'worked'|'yourTurn', title, why?, transform: { from, leftOp?, rightOp?, to }, whyStep?, check?, answer?, resultExpr?, hint?, reasoning?, cta? }], solution: { celebrateTitle?, celebrateSubtitle?, result, rows?, why? }, presentation?, backgroundImage?, backgroundOpacity? }",
    dependencies: [
      'GENERAL',
      'SUBJECTS',
      'TYPE',
      'SPACING',
      'RADII',
      'MOTION',
      'ContinueCTA',
      'CheckAnswerCTA',
      'InteractionShell',
      'ScreenTitle',
      'src/components/learning/calculationBreakdown/'
    ],
    usedBy: [],
    usageBoundary: null,
    contractDoc: null,
    story: 'src/components/learning/CalculationBreakdown.stories.jsx',
    governanceRules: [
      "Backwards compatibility is absolute: a block with no presentation field (or variant: 'standard') renders the existing walkthrough unchanged. Every existing algebra, percentage, geometry, fractions and science block is untouched.",
      "Never a parsed equation. Visual models receive explicit numbers. The only string input is operation, read through a closed token grammar ('÷ 3', '+ 4') that rejects anything else; left/right/resultLeft/resultRight are display strings and are never parsed.",
      'Invalid models are refused, not repaired. calculationBreakdownValidation.js rejects inexact group splits, group counts outside 2–5, totals over 30, chains that do not solve to a whole number, no-op steps and division by zero. A rejected model logs its reasons in development and falls back to the standard walkthrough — it never draws misleading groups.',
      'reasoning is optional everywhere. Each variant derives all five explanations from its model; authored copy overrides individual fields. step.reasoning may also be supplied on a generic worked step, where it renders as the same "Why this works" panel.',
      'Use operation language. "Subtract 4 from both sides", never "move the 4 across and change the sign". The plain relationship comes first, the formal term second: "Division undoes multiplication. These are inverse operations."',
      'Choreography is fixed: predict → act → observe → explain → check. The learner commits to at least one decision before any final answer appears; wrong choices explain the misunderstanding and re-open immediately, with no scoring, streaks or progress tracker inside the component.',
      'Scope freeze (2026-07-29): the algebra presentations are architecture complete and pedagogically reviewed — the scene sequence, the verdict/reasoning split, the concrete models and the copy were audited against a 390px and 320px render pass and signed off. Do not refactor, restyle or re-sequence the internals of src/components/learning/calculationBreakdown/ speculatively. Change them when real chapter use exposes a genuine learning problem — not to tidy the structure, shorten a file or unify a pattern. Specifically settled, not accidental: the concrete model stays on screen through each decision scene (do not reduce a choice screen back to a bare equation); the verdict panel ("What happened") is situational and the reasoning rail ("Rule to remember") is general, and they must not share a heading or repeat a sentence; a one-sided balance move breaks the balance immediately and visibly, not behind an optional reveal; and a decision scene carries one instruction, one question and the options, with no support line that restates the question or eliminates a distractor in advance. Extending it with a new validated presentation variant remains in scope.'
    ],
    notes: [
      'Optional algebra reasoning presentations. CalculationBreakdown remains one generic calculation component. block.presentation is an opt-in field that swaps the generic worked-step sequence for a scene sequence built for one specific teaching job — why an algebraic operation is valid, not just which operation to perform. These are not separate components and must not be registered, routed or documented as such; they share this component’s public API, frame, title treatment, stage surface, navigation, CTAs and accessibility behaviour.',
      "Shape: presentation: { variant: 'standard' | 'algebraWhy' | 'inverseMachine' | 'groupSplit' | 'balance', model: { per-variant }, reasoning?: { goal?, structure?, inverse?, equality?, check? } }.",
      'algebraWhy builds a coefficient from repeated addition, names the goal, forces a decision against a live subtraction misconception, then divides both sides and checks by substitution — model { variable, coefficient, total, solution? }. inverseMachine treats multi-step equations as actions undone in reverse order, with the reverse chain derived from the forward operations and never authored — model { variable, operations: [{ type, value }], result }. groupSplit makes a coefficient concrete by sharing the total into equal groups by tap, keyboard or one split action — model { variable, groupCount, total, solution? }. balance shows why the same operation goes on both sides; the one-sided move is offered, refused and explained — model { states: [{ left, right, operation, resultLeft, resultRight, misconception? }] }.',
      'Where the code lives: src/components/learning/calculationBreakdown/ — calculationBreakdownMath.js (pure operation maths), calculationBreakdownValidation.js (model validation and fallback), calculationBreakdownVisualRoles.js (semantic colour roles), calculationBreakdownParts.jsx / calculationBreakdownControls.jsx / calculationBreakdownFigures.jsx (shared display pieces), CalculationVisualModel.jsx (the scene runner) and one file per variant. Maths never lives in JSX; variant rendering is a lookup table, not a switch.'
    ]
  },
  decision: {
    status: 'complete',
    useWhen: 'A calculation contains several connected operations and the learner needs to understand both what to do and why each move is valid or useful. Choose it when the method should be explicitly modelled before the learner applies part of it.',
    doNotUseWhen: 'Only one simple operation is required, a visual model should establish the concept first, the learner is ready for independent exam practice, the content is primarily written analysis or the method varies so widely that one fixed sequence would be misleading.',
    chooseInstead: 'Use FractionRatioExplore, AreaPerimeterExplore or another visual exploration component when the learner first needs to see why the mathematics works. Use BuilderBlock when the learner should reconstruct a short equation from supplied pieces. Use FillInTheBlanksBlock for one missing value or term. Use ExamQuestionFrame when the learner should attempt the full calculation independently. Use GuidedExamResponse for an extended written response rather than a numerical method.',
    contentShape: 'One problem with a clear interpretation, a defined goal, a small number of purposeful steps, an explanation of why each move helps, at least one learner-completed step and a complete final solution with a check or explanation. Avoid breaking obvious arithmetic into patronising micro-steps. Scaffolding should become lighter when stronger learner evidence makes the full support unnecessary.',
    rhythmRole: [
      'teaching',
      'practice',
      'repair'
    ],
    note: null
  },
  contract: {
    criticality: 'standard',
    rationale: null,
    invariants: [],
    exclusivity: null,
    requiresProductDecision: []
  }
}
