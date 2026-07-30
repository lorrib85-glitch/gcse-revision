// ─── Component Review Lab — composed review manifest ─────────────────────────
//
// The established catalogue remains in reviewManifestCore.jsx. This thin layer
// adds review-only variants for component families that are expanding quickly,
// without duplicating the full catalogue or bending production component APIs.

import AngleExplore from '../../components/learning/AngleExplore.jsx'
import AreaPerimeterExplore from '../../components/learning/AreaPerimeterExplore.jsx'
import CalculationBreakdown from '../../components/learning/CalculationBreakdown.jsx'
import TeachScreenShell from '../../components/core/TeachScreenShell.jsx'
import * as FIX from './fixtures.js'
import {
  REVIEW_ENTRIES as CORE_REVIEW_ENTRIES,
  REVIEW_QUESTIONS,
  STATUS_LABELS,
  INTERACTION_LABELS,
} from './reviewManifestCore.jsx'

export { REVIEW_QUESTIONS, STATUS_LABELS, INTERACTION_LABELS }

function sentence(text) {
  const trimmed = String(text || '').trim()
  if (!trimmed) return ''
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`
}

function extendAngleExplore(entry) {
  const variants = Object.fromEntries((entry.variants ?? []).map(variant => [variant.id, variant]))

  return {
    ...entry,
    function: 'Configuration-driven GCSE geometry diagram for exploring angle facts, parallel-line relationships, triangle properties and polygon angle rules. One learner-controlled value drives the SVG while page-level questions and marking remain outside the component.',
    usage: 'New component — pending review; not yet routed in ChapterPlayer. Review variants cover core angle facts, formal parallel-line rules, triangle properties, quadrilateral and polygon angle sums, regular polygons and static jobs.',
    variants: [
      {
        ...variants['angle-types'],
        description: 'Drag the ray through acute, right, obtuse, straight, reflex and full-turn angles; the value and formal classification respond live.',
      },
      variants['straight-line'],
      variants['around-point'],
      variants['vertically-opposite'],
      {
        id: 'parallel-corresponding',
        label: 'Corresponding',
        description: 'Rotate a transversal across marked parallel lines. Matching-corner corresponding angles remain equal and share a colour.',
        render: () => <AngleExplore preset="parallelLines" />,
      },
      {
        id: 'parallel-alternate',
        label: 'Alternate',
        description: 'The equal interior angles sit on opposite sides of the transversal, using the formal AQA term alternate angles.',
        render: () => <AngleExplore preset="parallelAlternate" />,
      },
      {
        id: 'parallel-co-interior',
        label: 'Co-interior',
        description: 'The interior pair on the same side of the transversal changes live while its total remains 180°.',
        render: () => <AngleExplore preset="parallelCoInterior" />,
      },
      variants.triangle,
      {
        id: 'triangle-types',
        label: 'Triangle types',
        description: 'Move through scalene, isosceles, equilateral, right-angled, acute-angled and obtuse-angled triangles with governed side and angle markings.',
        render: () => <AngleExplore preset="triangleTypes" />,
      },
      {
        id: 'quadrilateral',
        label: 'Quadrilateral',
        description: 'Drag one vertex to reshape the quadrilateral while all four interior angles continue to total 360°.',
        render: () => <AngleExplore preset="quadrilateral" />,
      },
      {
        id: 'polygon-sum',
        label: 'Polygon sum',
        description: 'Change the number of sides and watch diagonals split the polygon into n − 2 triangles, deriving its interior-angle sum.',
        render: () => <AngleExplore preset="polygonSum" />,
      },
      {
        id: 'regular-polygon',
        label: 'Regular polygon',
        description: 'Change the number of equal sides to connect exterior angle 360° ÷ n with the matching interior angle.',
        render: () => <AngleExplore preset="regularPolygon" />,
      },
      variants.static,
    ].filter(Boolean),
  }
}

function extendAcronymMemorise(entry) {
  return {
    ...entry,
    render: (fx, context) => {
      const acronym = (fx.items ?? []).map(item => item.letter).join('') || 'This acronym'
      const memoryTarget = fx.memoryTarget
        || fx.rememberTarget
        || fx.topic
        || 'the five ways plants use glucose'
      const headingTarget = memoryTarget.replace(/^the\s+/i, '')
      const introduction = sentence(
        fx.intro || `${acronym} is an easy way to remember ${memoryTarget}`,
      )
      const instruction = fx.instruction || 'Tap each letter to reveal what it stands for.'

      return (
        <TeachScreenShell
          heading={fx.heading || `${acronym}: ${headingTarget}`}
          intro={`${introduction} ${instruction}`}
          subject={entry.subject || 'Biology'}
        >
          {entry.render({
            ...fx,
            memoryTarget,
            showIntro: false,
          }, context)}
        </TeachScreenShell>
      )
    },
  }
}

// Unrouted standalone component (no content type to register yet) — manual
// classification: the learner changes a shape's dimensions and watches the
// boundary length and the space inside respond, with no marking or scoring.
const AREA_PERIMETER_EXPLORE_ENTRY = {
  id: 'area-perimeter-explore',
  name: 'AreaPerimeterExplore',
  interaction: 'reveal',
  status: 'comparison',
  subject: 'Maths',
  renderMode: 'inline',
  function: 'Configuration-driven GCSE area and perimeter diagram — the mensuration sibling of AngleExplore. Learner-controlled dimensions drive a live boundary trace, square-unit grids and decomposition visuals, so perimeter is built by tracing and adding edges while area is built by counting, rearranging or decomposing square units. Page-level prediction, marking and scoring remain outside the component.',
  usage: 'New component — pending review; not yet routed in ChapterPlayer. Review variants cover rectangles and squares, the fixed-perimeter comparison, triangle and parallelogram formula derivation, trapezia, composite rectilinear area and perimeter, and static worked-example use.',
  alternative: 'AngleExplore (angle facts, not mensuration); CalculationBreakdown (carrying out a method, not seeing why a formula holds); a static figure image for one-off diagrams.',
  render: () => <AreaPerimeterExplore preset="rectangle" focus="compare" />,
  fixture: null,
  variants: [
    {
      id: 'rectangle',
      label: 'Rectangle',
      description: 'Separates the two measures at their simplest: dragging width and height shows perimeter accumulating along the boundary while area fills as rows of square units. Reaching the square state marks the equal sides and names side² rather than treating it as a different shape.',
      render: () => <AreaPerimeterExplore preset="rectangle" focus="compare" />,
    },
    {
      id: 'fixed-perimeter',
      label: 'Fixed perimeter',
      description: 'Breaks the "bigger perimeter means bigger area" assumption. The boundary is pinned at 24 cm while the width drags the shape from 1 × 11 through to the 6 × 6 square, so the learner sees area rise and fall against an unchanging perimeter.',
      render: () => <AreaPerimeterExplore preset="fixedPerimeterRectangle" />,
    },
    {
      id: 'triangle-area',
      label: 'Triangle area',
      description: 'Targets the sloping-side misconception directly: the apex slides sideways, the sloping sides visibly change, and the area does not — because base and perpendicular height have not. Pairing a rotated copy into a parallelogram earns the ½ before it is stated.',
      render: () => <AreaPerimeterExplore preset="triangleArea" />,
    },
    {
      id: 'parallelogram',
      label: 'Parallelogram',
      description: 'Shows that slant is not height. Sliding the top edge leaves the area untouched, and the triggered cut-and-slide moves the overhanging triangle across to build the equivalent rectangle, so base × perpendicular height is derived rather than asserted.',
      render: () => <AreaPerimeterExplore preset="parallelogramArea" />,
    },
    {
      id: 'trapezium',
      label: 'Trapezium',
      description: 'Makes ½ × (a + b) × h emerge from a transformation: both parallel sides and the height are adjustable, and joining a rotated copy produces a parallelogram of base a + b and twice the area — the halving then has a visible cause.',
      render: () => <AreaPerimeterExplore preset="trapeziumArea" />,
    },
    {
      id: 'composite-area',
      label: 'Composite area',
      description: 'Teaches that decomposition is a choice, not a rule. Two valid splits and a whole-minus-missing-corner method each reach 36 cm², so the learner judges methods by whether they account for the space rather than by matching a remembered picture.',
      render: () => <AreaPerimeterExplore preset="compositeShape" focus="area" />,
    },
    {
      id: 'composite-perimeter',
      label: 'Composite perimeter',
      description: 'Corrects the most common composite-shape error: the split line used for area stays on screen but muted and excluded, with the explicit statement that an internal line is not part of the perimeter. The two unlabelled outer lengths must be deduced from the opposite sides.',
      render: () => <AreaPerimeterExplore preset="compositeShape" focus="perimeter" />,
    },
    {
      id: 'static',
      label: 'Static worked example',
      description: 'The non-interactive job: an accurate, on-theme diagram with fixed dimensions and no controls, for use inside teaching explanations, worked examples and exam questions where the page — not the diagram — owns the question.',
      render: () => (
        <AreaPerimeterExplore
          preset="trapeziumArea"
          value={{ top: 4, bottom: 8, height: 5 }}
          interactive={false}
        />
      ),
    },
  ],
}

// CalculationBreakdown reviews as one component with optional algebra
// reasoning presentations, not as five components. Every variant renders
// through the same public API — only `block.presentation` changes.
function extendCalculationBreakdown(entry) {
  return {
    ...entry,
    function: 'Multi-step maths walkthrough: breaks one calculation into stages (understand → worked steps → learner-applied step → full solution) and checks understanding at each stage. Optional algebra presentations swap those stages for a scene sequence that explains why an operation is valid, not just which operation to perform.',
    usage: 'New component — pending review; not yet routed in ChapterPlayer. Review variants cover the generic walkthrough and the four opt-in algebra reasoning presentations.',
    alternative: 'GuidedExamResponse (written scaffold); GraphView (data, not procedure); FractionRatioExplore / AreaPerimeterExplore (seeing why a method works, with no staged tutoring).',
    variants: [
      {
        id: 'standard',
        label: 'Standard walkthrough',
        description: 'The generic job, unchanged: interpret one calculation, choose a useful first move, follow worked transformations and complete a step. Works for algebra, percentages, geometry, fractions and science calculations alike, and is what every block without a `presentation` field renders.',
        render: (fx, { onDone }) => <CalculationBreakdown block={fx} onContinue={onDone} />,
      },
      {
        id: 'algebra-why',
        label: 'Algebra Why Lab — 3x = 18',
        description: 'Answers the question a learner who can already "divide by 3" still cannot answer. Four scenes build the coefficient out of repeated addition, name the goal, make the learner commit to an inverse operation against a live subtraction misconception, then divide both sides and confirm by substitution.',
        render: (fx, { onDone }) => <CalculationBreakdown block={FIX.calculationAlgebraWhy} onContinue={onDone} />,
      },
      {
        id: 'inverse-machine',
        label: 'Inverse Operation Studio — 3x + 4 = 19',
        description: 'Teaches order of undoing, which is where multi-step equations are actually lost. The learner identifies the last action performed, chooses its inverse, watches the value move back, and replays the original forward chain as the check. The reverse path is derived from the forward operations, so content cannot state the two inconsistently.',
        render: (fx, { onDone }) => <CalculationBreakdown block={FIX.calculationInverseMachine} onContinue={onDone} />,
      },
      {
        id: 'group-split',
        label: 'Group Split Explorer — 3x = 18',
        description: 'Makes a coefficient concrete before it is abstract. The learner shares 18 counters into three equal groups one tap at a time — or deals them in one action — and sees "divide by 3" as something they have done. Counters are conserved by construction and the whole model is completable from the keyboard.',
        render: (fx, { onDone }) => <CalculationBreakdown block={FIX.calculationGroupSplit} onContinue={onDone} />,
      },
      {
        id: 'balance',
        label: 'Balance & Solve — 3x = 18',
        description: 'Targets the "do it to one side" error directly. The one-sided move is offered as a real choice, refused with an explanation, and shown as a tilt only inside an optional aside — the balance stays level through every valid transformation.',
        render: (fx, { onDone }) => <CalculationBreakdown block={FIX.calculationBalance} onContinue={onDone} />,
      },
      {
        id: 'reduced-motion',
        label: 'Reduced motion',
        description: 'The same Algebra Why Lab sequence with every scene transition removed, so the reduced-motion path can be reviewed as a first-class state rather than assumed.',
        render: (fx, { onDone }) => (
          <CalculationBreakdown block={FIX.calculationAlgebraWhy} reducedMotion onContinue={onDone} />
        ),
      },
      {
        id: 'mobile-width',
        label: 'Mobile width — 320px',
        description: 'The narrowest supported screen, checked against the busiest presentation: eighteen 44px counter targets, three group zones and the equation all have to stay readable and contained rather than scrolling sideways.',
        // A transformed ancestor becomes the containing block for the shell's
        // fixed positioning, so this is a genuine 320px render inside the
        // lab's 390px frame rather than a scaled-down picture of one.
        render: (fx, { onDone }) => (
          <div style={{ width: 320, height: '100%', position: 'relative', transform: 'translateZ(0)', overflow: 'hidden', margin: '0 auto' }}>
            <CalculationBreakdown block={FIX.calculationGroupSplit} onContinue={onDone} />
          </div>
        ),
      },
    ],
  }
}

// AreaPerimeterExplore sits beside its AngleExplore sibling rather than at the
// end of the catalogue, so the two Maths diagram families review together.
export const REVIEW_ENTRIES = CORE_REVIEW_ENTRIES.flatMap(entry => {
  if (entry.id === 'angle-explore') {
    return [extendAngleExplore(entry), AREA_PERIMETER_EXPLORE_ENTRY]
  }

  if (entry.id === 'acronym-memorise') {
    return [extendAcronymMemorise(entry)]
  }

  if (entry.id === 'calculation-breakdown') {
    return [extendCalculationBreakdown(entry)]
  }

  return [entry]
})
