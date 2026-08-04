// ─── Component Lab — preview adapters ────────────────────────────────────────
//
// The Component Lab is the chapter-building component library, and this file is
// its handwritten layer: React imports, JSX, fixtures, render callbacks, the
// subject palette an example uses, render framing, controlled state, authoring
// modes and preview-only variants.
//
// This is an OWNER TOOL that ships in every build. It is not stripped from the
// production bundle — src/App.jsx lazy-imports the Lab behind a query flag, so
// it is its own chunk that learners never download, which is not the same thing
// as being excluded. See src/App.jsx for the accurate account of the boundary.
//
// **Adapters are keyed by authoring key** — `screen:<type>` / `block:<type>` —
// which is what an author actually picks. The generated projection
// (src/data/generated/componentLabRegistry.js) owns every catalogue fact: the
// canonical name, the content contract, pedagogy, Decision guidance, lifecycle,
// criticality and measured content usage. **Nothing here restates any of
// them.** An adapter that hand-wrote a name or a usage figure is how the two
// stale claims the Phase 4 census found got into the old manifest.
//
// Every adapter carries a `minimalScreen`: the smallest chapter screen that
// satisfies its contract, asserted against the real chapter validator by
// tests/architecture/component-lab-authoring-coverage.test.js. A preview with
// no writable content shape is a gallery exhibit, not a component library.
//
// What is NOT here: the five runtime and design-system items that an author
// never selects. They live on the System reference surface
// (?systemReference=true), previewable in full — see src/dev/systemReference/.

import * as FIX from './fixtures.js'
import { SCREEN_RENDERER_ADAPTERS } from './labScreenRendererAdapters.jsx'
import { SUBJECT_ACCENTS } from '../../constants/subjects.js'

import AcronymMemorise from '../../components/learning/AcronymMemorise.jsx'
import AngleExplore from '../../components/learning/AngleExplore.jsx'
import AnswerInteraction from '../../components/core/AnswerInteraction.jsx'
import AreaPerimeterExplore from '../../components/learning/AreaPerimeterExplore.jsx'
import BeforeAfterImageSlider from '../../components/learning/BeforeAfterImageSlider.jsx'
import BuilderBlock from '../../components/learning/BuilderBlock.jsx'
import CalculationBreakdown from '../../components/learning/CalculationBreakdown.jsx'
import CentreImageReveal from '../../components/learning/CentreImageReveal.jsx'
import CinematicCarousel from '../../components/learning/CinematicCarousel.jsx'
import CinematicRevealMoment from '../../components/learning/CinematicRevealMoment.jsx'
import CircuitDiagram from '../../components/learning/CircuitDiagram.jsx'
import CircuitSymbolReference from '../../components/learning/CircuitSymbolReference.jsx'
import ColSortBlock from '../../components/learning/ColSortBlock.jsx'
import ConceptReveal from '../../components/learning/ConceptReveal.jsx'
import ContentShell from '../../components/layout/ContentShell.jsx'
import CoordinatePlaneExplore from '../../components/learning/CoordinatePlaneExplore.jsx'
import ExamQuestionFrame from '../../components/feedback/ExamQuestionFrame.jsx'
import ExplainReveal from '../../components/learning/ExplainReveal.jsx'
// The public identity, never the private faceTheExaminer/ family container.
import FaceTheExaminer from '../../components/learning/FaceTheExaminer.jsx'
import FactorWeb from '../../components/learning/FactorWeb.jsx'
import FillInTheBlanksBlock from '../../components/learning/FillInTheBlanksBlock.jsx'
import FlashcardsBlock from '../../components/learning/FlashcardsBlock.jsx'
import GraphView from '../../components/learning/GraphView.jsx'
import GuidedChoiceCarousel from '../../components/learning/GuidedChoiceCarousel.jsx'
import GuidedExamResponse from '../../components/learning/GuidedExamResponse.jsx'
import Infographic from '../../components/learning/Infographic.jsx'
import InteractiveHotspotImage from '../../components/learning/InteractiveHotspotImage.jsx'
import KeyFigureReveal from '../../components/learning/KeyFigureReveal.jsx'
import MatchingTask from '../../components/learning/MatchingTask.jsx'
import MediaPlaceholder from '../../components/core/MediaPlaceholder.jsx'
import MemoryHook from '../../components/learning/MemoryHook.jsx'
import MisconceptionCheck from '../../components/learning/MisconceptionCheck.jsx'
import NumberLineExplore from '../../components/learning/NumberLineExplore.jsx'
import OppositeQualitiesReveal from '../../components/learning/OppositeQualitiesReveal.jsx'
import OrderedRouteTask from '../../components/learning/OrderedRouteTask.jsx'
import PriorKnowledgeRecall from '../../components/learning/PriorKnowledgeRecall.jsx'
import QuickRecallScreen from '../../components/learning/QuickRecallScreen.jsx'
import QuoteAnalyser from '../../components/learning/QuoteAnalyser.jsx'
import SpotTheError from '../../components/learning/SpotTheError.jsx'
import SwipeSort from '../../components/learning/SwipeSort.jsx'
import TeachScreenShell from '../../components/core/TeachScreenShell.jsx'
import TheoryCompare from '../../components/learning/TheoryCompare.jsx'
import TieredQuizScreen from '../../components/learning/TieredQuizScreen.jsx'
import TimelineCanvas from '../../components/learning/TimelineCanvas.jsx'
import TimelineChain, { TimelineChainBlock } from '../../components/learning/TimelineChain.jsx'
import VisualLearning from '../../components/learning/VisualLearning.jsx'
import WhatExaminersLookFor from '../../components/learning/WhatExaminersLookFor.jsx'

// The seven review questions are identical for every selection, so they live
// once here rather than being duplicated per adapter.
export const REVIEW_QUESTIONS = [
  'Does this create a genuinely useful learning experience?',
  'Is the interaction understandable without lengthy instructions?',
  'Does it work comfortably on mobile?',
  'Does it perform a distinct pedagogical job?',
  'Is another existing component already better?',
  'Could subject-specific content be moved into data to make the mechanic reusable?',
  'Is the maintenance cost justified?',
]

// Full-bleed components render fixed:inset-0 and manage their own scroll, so the
// shell must not wrap them in its scrolling column. Inline blocks flow in the
// normal content column.
const standardScreen = (...blocks) => ({ type: 'standard', blocks })

export const LAB_ADAPTERS = {
  ...SCREEN_RENDERER_ADAPTERS,

  // ── Reading, retrieval and recall blocks ──────────────────────────────────
  'block:quiz': {
    renderMode: 'inline',
    subject: 'History',
    fixture: {
      type: 'quiz',
      question: 'Which humour was believed to cause a fever when it grew too plentiful?',
      options: ['Blood', 'Phlegm', 'Black bile', 'Yellow bile'],
      correct: 3,
      explanation: 'Yellow bile was classed as hot and dry, so an excess of it was blamed for fevers.',
    },
    minimalScreen: standardScreen({
      type: 'quiz',
      question: 'Which humour was believed to cause a fever when it grew too plentiful?',
      options: ['Blood', 'Phlegm', 'Black bile', 'Yellow bile'],
      correct: 3,
      explanation: 'Yellow bile was classed as hot and dry, so an excess of it was blamed for fevers.',
    }),
    render: (fx, { onDone }) => <AnswerInteraction block={fx} subject="History" onComplete={onDone} />,
  },

  'block:boss': {
    renderMode: 'inline',
    subject: 'History',
    fixture: {
      type: 'boss',
      question: 'Describe two features of medieval hospitals.',
      marks: 4,
      commandWord: 'Describe',
      markPoints: [
        'Most were run by the Church, so care was religious as well as physical.',
        'They cared for the poor and travellers rather than treating the seriously ill.',
      ],
    },
    minimalScreen: standardScreen({
      type: 'boss',
      question: 'Describe two features of medieval hospitals.',
      marks: 4,
      markPoints: [
        'Most were run by the Church, so care was religious as well as physical.',
        'They cared for the poor and travellers rather than treating the seriously ill.',
      ],
    }),
    render: (fx, { onDone }) => (
      <ExamQuestionFrame block={fx} subject="History" mode="practice" onSkip={onDone} onComplete={onDone} />
    ),
  },

  'block:flashcards': {
    renderMode: 'inline',
    subject: 'History',
    fixture: FIX.flashcardsBlock,
    minimalScreen: standardScreen({ type: 'flashcards', cards: FIX.flashcardsBlock.cards }),
    render: fx => <FlashcardsBlock block={fx} />,
  },

  'block:acronymMemorise': {
    renderMode: 'inline',
    subject: 'Biology',
    fixture: FIX.acronymMemorise,
    minimalScreen: standardScreen({ type: 'acronymMemorise', ...FIX.acronymMemorise }),
    // Wrapped in TeachScreenShell so the heading and framing line come from the
    // design system, matching how the block is composed in a real chapter.
    render: (fx, context) => {
      const acronym = (fx.items ?? []).map(item => item.letter).join('') || 'This acronym'
      const memoryTarget = fx.memoryTarget || fx.rememberTarget || fx.topic
        || 'the five ways plants use glucose'
      const headingTarget = memoryTarget.replace(/^the\s+/i, '')
      const introduction = sentence(fx.intro || `${acronym} is an easy way to remember ${memoryTarget}`)
      const instruction = fx.instruction || 'Tap each letter to reveal what it stands for.'
      return (
        <TeachScreenShell
          heading={fx.heading || `${acronym}: ${headingTarget}`}
          intro={`${introduction} ${instruction}`}
          subject="Biology"
        >
          <AcronymMemorise block={{ ...fx, memoryTarget, showIntro: false }} {...context} />
        </TeachScreenShell>
      )
    },
  },

  'block:memoryHook': {
    renderMode: 'inline',
    subject: 'Biology',
    fixture: FIX.memoryHook,
    minimalScreen: standardScreen({ type: 'memoryHook', ...FIX.memoryHook }),
    render: fx => <MemoryHook block={fx} subject="Biology" />,
  },

  'block:fillblanks': {
    renderMode: 'inline',
    subject: 'Biology',
    fixture: FIX.fillInTheBlanks,
    minimalScreen: standardScreen({ type: 'fillblanks', sentences: FIX.fillInTheBlanks.sentences }),
    render: (fx, { onDone }) => <FillInTheBlanksBlock block={fx} subject="Biology" onContinue={onDone} />,
  },

  'block:builder': {
    renderMode: 'inline',
    subject: 'Biology',
    fixture: FIX.builderBlock,
    minimalScreen: standardScreen({ type: 'builder', ...FIX.builderBlock }),
    render: (fx, { onDone }) => <BuilderBlock block={fx} subject="Biology" onComplete={onDone} />,
    // One contract, three layouts. These were three separate Lab rows before
    // Phase 4, which is exactly the record-per-preview mistake: an author picks
    // `builder` once and chooses a layout inside it.
    variants: [
      {
        id: 'reaction',
        label: 'Reaction',
        description: 'Grouped inputs and outputs — the science layout the block was first built for.',
        fixture: FIX.builderBlock,
        render: (fx, { onDone }) => <BuilderBlock block={fx} subject="Biology" onComplete={onDone} />,
      },
      {
        id: 'equation',
        label: 'Maths',
        description: 'Missing-value calculation with fixed mathematical notation, compact number pieces and tabular numerals.',
        fixture: FIX.builderMaths,
        render: (fx, { onDone }) => <BuilderBlock block={fx} subject="Maths" onComplete={onDone} />,
      },
      {
        id: 'quote',
        label: 'Quote',
        description: 'Quotation reconstruction with preserved line breaks, inline gaps and a literary serif treatment.',
        fixture: FIX.builderQuote,
        render: (fx, { onDone }) => <BuilderBlock block={fx} subject="English" onComplete={onDone} />,
      },
    ],
  },

  'block:colsort': {
    renderMode: 'inline',
    subject: 'History',
    fixture: FIX.colSort,
    minimalScreen: standardScreen({ type: 'colsort', columns: FIX.colSort.columns, items: FIX.colSort.items }),
    render: fx => <ColSortBlock block={fx} subject="History" />,
  },

  'block:spotTheError': {
    renderMode: 'fullbleed',
    subject: 'Biology',
    fixture: FIX.spotTheError,
    minimalScreen: standardScreen({ type: 'spotTheError', ...FIX.spotTheError }),
    render: (fx, { onDone }) => <SpotTheError block={fx} subject="Biology" onContinue={onDone} />,
  },

  'block:misconceptionCheck': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.misconceptionCheck,
    minimalScreen: standardScreen({ type: 'misconceptionCheck', ...FIX.misconceptionCheck }),
    render: (fx, { onDone }) => <MisconceptionCheck block={fx} subject="History" onContinue={onDone} />,
    // The derived screen route. ScreenRenderer promotes a screen containing a
    // misconceptionCheck block to a full-screen presentation; an author writes
    // the block and gets this. It is shown here as a presentation of this one
    // choice — never as a second row in the index.
    presentations: [
      {
        key: 'screen:misconceptionCheck',
        description: 'How the runtime presents this block when it is the only thing on a screen: promoted to full screen so its fixed positioning is not trapped inside a scrolling container.',
        renderMode: 'fullbleed',
        render: (fx, { onDone }) => <MisconceptionCheck block={fx} subject="History" onContinue={onDone} />,
      },
    ],
  },

  // ── Explanation and comparison blocks ─────────────────────────────────────
  'block:explainReveal': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.explainReveal,
    minimalScreen: standardScreen({ type: 'explainReveal', ...FIX.explainReveal }),
    render: (fx, { onDone }) => <ExplainReveal block={fx} subject="History" onComplete={onDone} />,
  },

  'block:theoryCompare': {
    renderMode: 'inline',
    subject: 'History',
    fixture: FIX.theoryCompare,
    minimalScreen: standardScreen({ type: 'theoryCompare', ...FIX.theoryCompare }),
    render: (fx, { onDone }) => <TheoryCompare block={fx} subject="History" onComplete={onDone} />,
  },

  'block:oppositeQualitiesReveal': {
    renderMode: 'inline',
    subject: 'History',
    fixture: FIX.oppositeQualitiesReveal,
    minimalScreen: standardScreen({ type: 'oppositeQualitiesReveal', ...FIX.oppositeQualitiesReveal }),
    // The block level: composed inline within a teach screen alongside other
    // blocks, rather than owning the whole screen.
    render: (fx, { onDone }) => (
      <OppositeQualitiesReveal block={fx} subject="History" onComplete={onDone} />
    ),
  },

  'block:timelineChain': {
    renderMode: 'inline',
    subject: 'History',
    fixture: FIX.timelineChain,
    minimalScreen: standardScreen({ type: 'timelineChain', ...FIX.timelineChain }),
    // TimelineChainBlock is its own named export and its own catalogue record.
    // The screen and block levels are genuinely different components, which is
    // why they are two rows rather than one row with a variant.
    render: fx => <TimelineChainBlock block={fx} subject="History" />,
  },

  'block:graphView': {
    renderMode: 'inline',
    subject: 'Maths',
    fixture: FIX.graphViewScatter,
    minimalScreen: standardScreen({ type: 'graphView', ...FIX.graphViewScatter }),
    render: fx => <GraphView block={fx} subject="Maths" />,
    // One contract, one component, one `chartType` field — two rows before
    // Phase 4, one row with two variants now.
    variants: [
      {
        id: 'scatter',
        label: 'Scatter',
        description: 'Correlation between two measured variables.',
        fixture: FIX.graphViewScatter,
        render: fx => <GraphView block={fx} subject="Maths" />,
      },
      {
        id: 'line',
        label: 'Line',
        description: 'Enzyme activity against temperature — tests label readability and interpretation value.',
        fixture: FIX.graphViewLine,
        render: fx => <GraphView block={fx} subject="Biology" />,
      },
    ],
  },

  'block:mediaPlaceholder': {
    renderMode: 'inline',
    subject: 'History',
    fixture: { kind: 'diagram', aspect: '16:9', caption: 'The four humours and their paired qualities' },
    minimalScreen: standardScreen({
      type: 'mediaPlaceholder',
      kind: 'diagram',
      aspect: '16:9',
      caption: 'The four humours and their paired qualities',
    }),
    render: fx => (
      <MediaPlaceholder subject="History" kind={fx.kind} aspect={fx.aspect} caption={fx.caption} />
    ),
    variants: [
      {
        id: 'diagram',
        label: 'Diagram',
        description: 'A reserved diagram slot: the space is committed to at authoring time so the layout is already right when the artwork lands.',
        fixture: { kind: 'diagram', aspect: '16:9', caption: 'The four humours and their paired qualities' },
        render: fx => <MediaPlaceholder subject="History" kind={fx.kind} aspect={fx.aspect} caption={fx.caption} />,
      },
      {
        id: 'image',
        label: 'Image',
        description: 'A reserved photographic or illustrative slot at portrait aspect.',
        fixture: { kind: 'image', aspect: '4:5', caption: 'A physician consulting a urine wheel' },
        render: fx => <MediaPlaceholder subject="History" kind={fx.kind} aspect={fx.aspect} caption={fx.caption} />,
      },
    ],
  },

  // ── Placeable figures — six types, six identities ─────────────────────────
  'block:angleFigure': {
    renderMode: 'inline',
    subject: 'Maths',
    fixture: { preset: 'angleTypes' },
    minimalScreen: standardScreen({ type: 'angleFigure', preset: 'triangle' }),
    render: () => <AngleExplore />,
    variants: [
      { id: 'angle-types', label: 'Angle types', description: 'Drag the ray through acute, right, obtuse, straight, reflex and full-turn angles; the value and formal classification respond live.', render: () => <AngleExplore /> },
      { id: 'straight-line', label: 'Straight line', description: 'Two angles share a straight line; dragging the dividing ray keeps their live sum at 180°.', render: () => <AngleExplore preset="straightLine" /> },
      { id: 'around-point', label: 'Around a point', description: 'Three angles meet at a point; dragging one ray keeps the running total at 360°.', render: () => <AngleExplore preset="aroundPoint" /> },
      { id: 'vertically-opposite', label: 'Vertically opposite', description: 'Two crossing lines make two equal pairs — equal angles share a colour, and rotating one line preserves the equality.', render: () => <AngleExplore preset="verticallyOpposite" /> },
      { id: 'parallel-corresponding', label: 'Corresponding', description: 'Rotate a transversal across marked parallel lines. Matching-corner corresponding angles remain equal and share a colour.', render: () => <AngleExplore preset="parallelLines" /> },
      { id: 'parallel-alternate', label: 'Alternate', description: 'The equal interior angles sit on opposite sides of the transversal, using the formal AQA term alternate angles.', render: () => <AngleExplore preset="parallelAlternate" /> },
      { id: 'parallel-co-interior', label: 'Co-interior', description: 'The interior pair on the same side of the transversal changes live while its total remains 180°.', render: () => <AngleExplore preset="parallelCoInterior" /> },
      { id: 'triangle', label: 'Triangle', description: 'Drag the apex of the triangle: all three interior angles update while their sum stays at 180°.', render: () => <AngleExplore preset="triangle" /> },
      { id: 'triangle-types', label: 'Triangle types', description: 'Move through scalene, isosceles, equilateral, right-angled, acute-angled and obtuse-angled triangles with governed side and angle markings.', render: () => <AngleExplore preset="triangleTypes" /> },
      { id: 'quadrilateral', label: 'Quadrilateral', description: 'Drag one vertex to reshape the quadrilateral while all four interior angles continue to total 360°.', render: () => <AngleExplore preset="quadrilateral" /> },
      { id: 'polygon-sum', label: 'Polygon sum', description: 'Change the number of sides and watch diagonals split the polygon into n − 2 triangles, deriving its interior-angle sum.', render: () => <AngleExplore preset="polygonSum" /> },
      { id: 'regular-polygon', label: 'Regular polygon', description: 'Change the number of equal sides to connect exterior angle 360° ÷ n with the matching interior angle.', render: () => <AngleExplore preset="regularPolygon" /> },
      { id: 'static', label: 'Static diagram', description: 'The same renderer with interaction disabled at a fixed value, for teaching, worked examples and exam questions.', render: () => <AngleExplore value={120} interactive={false} /> },
    ],
  },

  'block:areaPerimeterFigure': {
    renderMode: 'inline',
    subject: 'Maths',
    fixture: { preset: 'rectangle' },
    minimalScreen: standardScreen({ type: 'areaPerimeterFigure', preset: 'rectangle', focus: 'compare' }),
    render: () => <AreaPerimeterExplore preset="rectangle" focus="compare" />,
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
          <AreaPerimeterExplore preset="trapeziumArea" value={{ top: 4, bottom: 8, height: 5 }} interactive={false} />
        ),
      },
    ],
  },

  'block:coordinatePlaneFigure': {
    renderMode: 'inline',
    subject: 'Maths',
    fixture: { preset: 'plotPoint' },
    minimalScreen: standardScreen({ type: 'coordinatePlaneFigure', preset: 'plotPoint' }),
    render: () => <CoordinatePlaneExplore />,
    variants: [
      { id: 'plot-point', label: 'Plot a point', description: 'Drag a point and read its coordinate. Guide lines belong to the active point alone.', render: () => <CoordinatePlaneExplore preset="plotPoint" /> },
      { id: 'quadrants', label: 'Quadrants', description: 'The four quadrants labelled with their sign pairs, named live as the point moves.', render: () => <CoordinatePlaneExplore preset="plotPoint" focus="quadrants" /> },
      { id: 'midpoint', label: 'Midpoint', description: 'The x-values and y-values bracketed and averaged separately, so the formula is read off the picture.', render: () => <CoordinatePlaneExplore preset="midpoint" /> },
      { id: 'straight-line', label: 'Straight line', description: 'y = mx + c with the rise/run triangle and the y-intercept marked.', render: () => <CoordinatePlaneExplore preset="straightLine" /> },
      { id: 'parallel', label: 'Parallel lines', description: 'Equal rise/run triangles on both lines, with intercepts set independently.', render: () => <CoordinatePlaneExplore preset="straightLine" focus="compare" comparisonRule="parallel" /> },
      { id: 'table-of-values', label: 'Table of values', description: 'One point, no line; two points, a provisional dashed line; three, solid — the third coordinate confirms the rule.', render: () => <CoordinatePlaneExplore preset="tableOfValues" defaultValue={{ m: 2, c: 1, step: 2 }} /> },
      { id: 'intersection', label: 'Intersection', description: 'The meeting point substituted back into both equations, which is what makes it a solution.', render: () => <CoordinatePlaneExplore preset="intersection" /> },
      { id: 'translate', label: 'Translate', description: 'A column vector sliding every vertex by the same amount, at the model extreme.', render: () => <CoordinatePlaneExplore preset="translate" defaultValue={{ dx: 8, dy: 5 }} /> },
      { id: 'reflect', label: 'Reflect', description: 'A diagonal mirror line with all six original and image vertices on one plane.', render: () => <CoordinatePlaneExplore preset="reflect" defaultValue={{ mirrorValue: 0, mirror: 'yEqualsX' }} /> },
      { id: 'rotate', label: 'Rotate', description: 'A quarter turn about a non-origin centre, with the direction control on screen.', render: () => <CoordinatePlaneExplore preset="rotate" difficultyCapabilities={{ nonOriginCentre: true }} defaultValue={{ cx: 1, cy: -1, angle: '270', direction: 'anticlockwise' }} /> },
      { id: 'enlarge', label: 'Enlarge', description: 'Scale factor 3 about a non-origin centre, with the full ray from centre to image.', render: () => <CoordinatePlaneExplore preset="enlarge" difficultyCapabilities={{ nonOriginCentre: true, fractionalScaleFactor: true, negativeScaleFactor: true }} defaultValue={{ cx: -1, cy: -1, scaleFactor: '3' }} /> },
      { id: 'static-exam', label: 'Static exam figure', description: 'interactive={false} — no handles, no live region, but a full descriptive summary for screen readers.', render: () => <CoordinatePlaneExplore preset="reflect" interactive={false} /> },
      {
        id: 'physics-distance-time',
        label: 'Physics distance–time',
        description: 'Cross-subject: axis labels, units and independent scales make a usable science graph, not a recoloured Maths diagram.',
        render: () => (
          <CoordinatePlaneExplore
            preset="straightLine"
            subject="Physics"
            interactive={false}
            xAxis={{ label: 'Time', unit: 's', min: 0, max: 20, step: 5 }}
            yAxis={{ label: 'Distance', unit: 'm', min: 0, max: 100, step: 20 }}
            defaultValue={{ m: 4, c: 0 }}
          />
        ),
      },
    ],
  },

  'block:numberLineFigure': {
    renderMode: 'inline',
    subject: 'Maths',
    fixture: { preset: 'orderNumbers' },
    minimalScreen: standardScreen({ type: 'numberLineFigure', preset: 'orderNumbers' }),
    render: () => <NumberLineExplore />,
    variants: [
      { id: 'order-numbers', label: 'Ordering', description: 'Slide one value between four pinned ones — integers, a decimal and a fraction — and watch the ordering statement re-sort. Landing on a pinned value shows the two forms sharing a point.', render: () => <NumberLineExplore preset="orderNumbers" /> },
      { id: 'negative-movement', label: 'Negative moves', description: 'Addition and subtraction as directed movement: an animated arc shows the jump, and adding a negative visibly lands where subtracting does.', render: () => <NumberLineExplore preset="negativeMovement" /> },
      { id: 'rounding-intervals', label: 'Rounding', description: 'The two multiples a value sits between, with the halfway point marked. Precision switches between nearest 10, whole number and 1 d.p.', render: () => <NumberLineExplore preset="roundingIntervals" /> },
      { id: 'inequality-range', label: 'Inequalities', description: 'Open and closed endpoints, direction, symbol and interval notation stay tied together as the endpoint moves.', render: () => <NumberLineExplore preset="inequalityRange" /> },
      { id: 'bounds-interval', label: 'Bounds', description: 'The error interval of a rounded value — lower bound included, upper bound excluded, shown as a filled and an open endpoint.', render: () => <NumberLineExplore preset="boundsInterval" /> },
      { id: 'multiply-pattern', label: 'Multiplying', description: 'Multiplying by a negative as repeated jumps in the opposite direction — the jumps stay the same size, only their direction flips.', render: () => <NumberLineExplore preset="multiplyPattern" /> },
      { id: 'estimate-range', label: 'Estimation', description: 'Estimation as a range rather than a single answer: drag an estimate and see whether it lands inside the sensible band around the exact value.', render: () => <NumberLineExplore preset="estimateRange" /> },
      { id: 'static', label: 'Static diagram', description: 'The same renderer with interaction disabled at fixed values, for teaching, worked examples and exam questions.', render: () => <NumberLineExplore preset="inequalityRange" value={{ endpoint: 2 }} interactive={false} /> },
    ],
  },

  'block:circuitDiagram': {
    renderMode: 'inline',
    subject: 'Physics',
    fixture: { preset: 'simpleSeries' },
    minimalScreen: standardScreen({ type: 'circuitDiagram', preset: 'simpleSeries' }),
    render: () => <CircuitDiagram />,
    variants: [
      { id: 'simple-series', label: 'Simple series', description: 'Core one-switch circuit: open and close the physical switch to observe the complete-circuit relationship.', render: () => <CircuitDiagram /> },
      { id: 'two-switch-series', label: 'Two switches', description: 'Two independent switches share one series loop. One remaining gap keeps the whole circuit off.', render: () => <CircuitDiagram preset="twoSwitchSeries" /> },
      { id: 'parallel-branches', label: 'Parallel branches', description: 'Two independently switched branches prove that one lamp can stay on while the other branch is open.', render: () => <CircuitDiagram preset="parallelBranches" /> },
      { id: 'measurement-circuit', label: 'Measurement circuit', description: 'Read-only placement diagram: ammeter in the main series loop and voltmeter connected across the resistor.', render: () => <CircuitDiagram preset="measurementCircuit" /> },
      { id: 'read-only', label: 'Read-only', description: 'The same connected-circuit renderer with interaction disabled for teaching, worked examples and exam questions.', render: () => <CircuitDiagram defaultClosed interactive={false} /> },
    ],
  },

  'block:circuitSymbolReference': {
    renderMode: 'inline',
    subject: 'Physics',
    fixture: {},
    minimalScreen: standardScreen({ type: 'circuitSymbolReference' }),
    // Its own selection, not a preset of the circuit diagram: a read-only board
    // is a different author choice and a different interaction class.
    render: () => <CircuitSymbolReference />,
  },

  // ── Full-screen learning screens ──────────────────────────────────────────
  'screen:calculationBreakdown': {
    renderMode: 'fullbleed',
    subject: 'Maths',
    fixture: FIX.calculationBreakdown,
    minimalScreen: { type: 'calculationBreakdown', ...FIX.calculationBreakdown },
    render: (fx, { onDone }) => <CalculationBreakdown block={fx} onContinue={onDone} />,
    // Five authoring MODES, not five components and not five types. All five
    // share this envelope, this renderer route and one validation entry point,
    // so they are one contract — but an author genuinely chooses between them,
    // so each has to be individually selectable.
    modes: [
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
        fixture: FIX.calculationAlgebraWhy,
        render: (fx, { onDone }) => <CalculationBreakdown block={fx} onContinue={onDone} />,
      },
      {
        id: 'inverse-machine',
        label: 'Inverse Operation Studio — 3x + 4 = 19',
        description: 'Teaches order of undoing, which is where multi-step equations are actually lost. The learner identifies the last action performed, chooses its inverse, watches the value move back, and replays the original forward chain as the check. The reverse path is derived from the forward operations, so content cannot state the two inconsistently.',
        fixture: FIX.calculationInverseMachine,
        render: (fx, { onDone }) => <CalculationBreakdown block={fx} onContinue={onDone} />,
      },
      {
        id: 'group-split',
        label: 'Group Split Explorer — 3x = 18',
        description: 'Makes a coefficient concrete before it is abstract. The learner shares 18 counters into three equal groups one tap at a time — or deals them in one action — and sees "divide by 3" as something they have done. Counters are conserved by construction and the whole model is completable from the keyboard.',
        fixture: FIX.calculationGroupSplit,
        render: (fx, { onDone }) => <CalculationBreakdown block={fx} onContinue={onDone} />,
      },
      {
        id: 'balance',
        label: 'Balance & Solve — 3x = 18',
        description: 'Targets the "do it to one side" error directly. The one-sided move is offered as a real choice, refused with an explanation, and shown as a tilt only inside an optional aside — the balance stays level through every valid transformation.',
        fixture: FIX.calculationBalance,
        render: (fx, { onDone }) => <CalculationBreakdown block={fx} onContinue={onDone} />,
      },
    ],
    // Preview-only. Neither changes the authored content, so neither is a mode.
    variants: [
      {
        id: 'reduced-motion',
        label: 'Reduced motion',
        description: 'The same Algebra Why Lab sequence with every scene transition removed, so the reduced-motion path can be reviewed as a first-class state rather than assumed.',
        fixture: FIX.calculationAlgebraWhy,
        render: (fx, { onDone }) => <CalculationBreakdown block={fx} reducedMotion onContinue={onDone} />,
      },
      {
        id: 'mobile-width',
        label: 'Mobile width — 320px',
        description: 'The narrowest supported screen, checked against the busiest presentation: eighteen 44px counter targets, three group zones and the equation all have to stay readable and contained rather than scrolling sideways.',
        fixture: FIX.calculationGroupSplit,
        // A transformed ancestor becomes the containing block for the shell's
        // fixed positioning, so this is a genuine 320px render inside the lab's
        // 390px frame rather than a scaled-down picture of one.
        render: (fx, { onDone }) => (
          <div style={{ width: 320, height: '100%', position: 'relative', transform: 'translateZ(0)', overflow: 'hidden', margin: '0 auto' }}>
            <CalculationBreakdown block={fx} onContinue={onDone} />
          </div>
        ),
      },
    ],
  },

  'screen:cinematicCarousel': {
    renderMode: 'fullbleed',
    subject: 'Biology',
    fixture: FIX.cinematicCarousel,
    minimalScreen: { type: 'cinematicCarousel', ...FIX.cinematicCarousel },
    render: (fx, { onDone }) => <CinematicCarousel block={fx} subject="Biology" onContinue={onDone} />,
  },

  'screen:timelineChain': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.timelineChain,
    minimalScreen: { type: 'timelineChain', ...FIX.timelineChain },
    render: (fx, { onDone }) => <TimelineChain block={fx} subject="History" onContinue={onDone} />,
  },

  'screen:oppositeQualitiesReveal': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.oppositeQualitiesReveal,
    minimalScreen: { type: 'oppositeQualitiesReveal', ...FIX.oppositeQualitiesReveal },
    render: (fx, { onDone }) => (
      <ContentShell subject="History" header="none">
        <TeachScreenShell heading={fx.title} intro={fx.copy} subject="History">
          <OppositeQualitiesReveal block={{ ...fx, backgroundMode: 'screen' }} subject="History" onComplete={onDone} />
        </TeachScreenShell>
      </ContentShell>
    ),
  },

  'screen:timelineCanvas': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.timelineCanvas,
    minimalScreen: { type: 'timelineCanvas', ...FIX.timelineCanvas },
    render: (fx, { onDone }) => <TimelineCanvas block={fx} subject="History" onContinue={onDone} />,
  },

  'screen:beforeAfterSlider': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.beforeAfterImageSlider,
    minimalScreen: { type: 'beforeAfterSlider', ...FIX.beforeAfterImageSlider },
    render: (fx, { onDone }) => (
      <BeforeAfterImageSlider
        beforeSrc={fx.beforeSrc} afterSrc={fx.afterSrc} beforeAlt={fx.beforeAlt} afterAlt={fx.afterAlt}
        beforeLabel={fx.beforeLabel} afterLabel={fx.afterLabel} heading={fx.heading}
        revealText={fx.revealText} accent={SUBJECT_ACCENTS.History} initial={fx.initial} onComplete={onDone}
      />
    ),
  },

  'screen:orderedRouteTask': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.evacuationChainRoute,
    minimalScreen: { type: 'orderedRouteTask', ...FIX.evacuationChainRoute },
    render: (fx, { onDone }) => <OrderedRouteTask screen={fx} subject="History" onComplete={onDone} />,
  },

  'screen:centreImageReveal': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.medicalTheoryPrescription,
    minimalScreen: { type: 'centreImageReveal', ...FIX.medicalTheoryPrescription },
    render: (fx, { onDone }) => <CentreImageReveal screen={fx} onComplete={onDone} />,
  },

  'screen:matchingTask': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.matchingTask,
    minimalScreen: { type: 'matchingTask', ...FIX.matchingTask },
    render: (fx, { onDone }) => <MatchingTask screen={fx} subject="History" onComplete={onDone} />,
  },

  'screen:visualLearning': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.visualLearning,
    minimalScreen: { type: 'visualLearning', ...FIX.visualLearning },
    render: (fx, { onDone }) => <VisualLearning block={fx} subject="History" onComplete={onDone} />,
  },

  'screen:guidedChoiceCarousel': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.guidedChoiceCarousel,
    minimalScreen: { type: 'guidedChoiceCarousel', ...FIX.guidedChoiceCarousel },
    render: (fx, { onDone }) => (
      <GuidedChoiceCarousel
        subject="History" headline={fx.headline} question={fx.question} helperText={fx.helperText}
        options={fx.options} onBack={() => {}} onContinue={onDone}
      />
    ),
  },

  'screen:factorWeb': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.factorWeb,
    minimalScreen: { type: 'factorWeb', ...FIX.factorWeb },
    render: (fx, { onDone }) => <FactorWeb block={fx} subject="History" onContinue={onDone} />,
  },

  'screen:infographic': {
    renderMode: 'inline',
    subject: 'History',
    fixture: FIX.infographic,
    minimalScreen: { type: 'infographic', ...FIX.infographic },
    render: (fx, { onDone }) => (
      <Infographic subject="History" heading={fx.heading} intro={fx.intro} media={fx.media} onContinue={onDone} />
    ),
  },

  'screen:interactiveImage': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.interactiveHotspotImage,
    minimalScreen: { type: 'interactiveImage', ...FIX.interactiveHotspotImage },
    render: (fx, { onDone }) => (
      <InteractiveHotspotImage
        subject="History" title={fx.title} introText={fx.introText}
        image={fx.image} imageAlt={fx.imageAlt} hotspots={fx.hotspots} ctaLabel={fx.ctaLabel}
        onContinue={onDone}
      />
    ),
    // One type, one contract, one `variant` field — two Lab rows before Phase 4.
    variants: [
      {
        id: 'detail',
        label: 'Detail',
        description: 'Tap a glowing hotspot to read a label, description and extra fact for each point on the image.',
        fixture: FIX.interactiveHotspotImage,
        render: (fx, { onDone }) => (
          <InteractiveHotspotImage
            subject="History" title={fx.title} introText={fx.introText}
            image={fx.image} imageAlt={fx.imageAlt} hotspots={fx.hotspots} ctaLabel={fx.ctaLabel}
            onContinue={onDone}
          />
        ),
      },
      {
        id: 'reveal',
        label: 'Reveal',
        description: 'Tap a hotspot to page through several pieces of information, then a synthesis "collection complete" screen once all are explored.',
        fixture: FIX.interactiveHotspotReveal,
        render: (fx, { onDone }) => (
          <InteractiveHotspotImage
            subject="History" variant="reveal" title={fx.title} introText={fx.introText}
            image={fx.image} imageAlt={fx.imageAlt} hotspots={fx.hotspots} synthesis={fx.synthesis}
            onContinue={onDone}
          />
        ),
      },
    ],
  },

  'screen:cinematic': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.cinematicRevealMoment,
    minimalScreen: { type: 'cinematic', ...FIX.cinematicRevealMoment },
    render: (fx, { onDone }) => (
      <CinematicRevealMoment
        subject="History" label={fx.label} videoSrc={fx.videoSrc} fallbackImage={fx.fallbackImage}
        year={fx.year} headline={fx.headline} body={fx.body}
        onContinue={onDone}
      />
    ),
  },

  'screen:conceptReveal': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.conceptReveal,
    minimalScreen: { type: 'conceptReveal', ...FIX.conceptReveal },
    render: (fx, { onDone }) => <ConceptReveal subject="History" steps={fx.steps} onContinue={onDone} />,
  },

  'screen:quoteAnalyser': {
    renderMode: 'fullbleed',
    subject: 'English',
    fixture: FIX.quoteAnalyser,
    minimalScreen: { type: 'quoteAnalyser', ...FIX.quoteAnalyser },
    render: (fx, { onDone }) => <QuoteAnalyser block={fx} subject="English" onContinue={onDone} />,
  },

  'screen:keyFigureReveal': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.keyFigureReveal,
    minimalScreen: { type: 'keyFigureReveal', ...FIX.keyFigureReveal },
    render: (fx, { onDone }) => <KeyFigureReveal block={fx} subject="History" onComplete={onDone} />,
  },

  'screen:faceExaminer': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.faceTheExaminer,
    minimalScreen: { type: 'faceExaminer', examiner: FIX.faceTheExaminer },
    render: (fx, { onDone }) => (
      <FaceTheExaminer
        chapter={{ id: 'component-lab-fte', subject: 'History' }}
        examiner={fx}
        onExit={() => {}}
        onContinue={onDone}
      />
    ),
  },

  'screen:guidedExamResponse': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.guidedExamResponse,
    minimalScreen: { type: 'guidedExamResponse', exam: FIX.guidedExamResponse },
    render: (fx, { onDone }) => (
      <GuidedExamResponse
        chapter={{ id: `component-lab-ger-${fx.subject || 'general'}`, subject: fx.subject }}
        exam={fx}
        onExit={() => {}}
        onContinue={onDone}
      />
    ),
    variants: [
      { id: 'history', label: 'History', description: 'Edexcel explain-why response with two developed reasons and staged factual prompts.', fixture: FIX.guidedExamResponse },
      { id: 'english', label: 'English', description: 'AQA literature response using an extract, interpretation, close analysis and a whole-text link.', fixture: FIX.guidedExamResponseEnglish },
      { id: 'science', label: 'Science', description: 'AQA Biology required-practical response covering method, variables and a measurable end point.', fixture: FIX.guidedExamResponseScience },
      { id: 'maths', label: 'Maths', description: 'AQA calculation response with working, a final answer and light method support.', fixture: FIX.guidedExamResponseMaths },
      { id: 'sociology', label: 'Sociology', description: 'AQA evaluation response with supporting argument, challenge and reasoned judgement.', fixture: FIX.guidedExamResponseSociology },
    ],
  },

  'screen:examinerExplains': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.examinerExplains,
    minimalScreen: { type: 'examinerExplains', examinerExplains: FIX.examinerExplains },
    // The canonical component. Phase 4 moved this authoring entry off the
    // parked ExaminerExplainsScreen alias, so the Lab, the catalogue and the
    // runtime all name the same identity.
    render: (fx, { onDone }) => (
      <WhatExaminersLookFor subject="History" whatExaminersLookFor={fx} onBack={onDone} onContinue={onDone} />
    ),
  },

  'screen:naturalSupernaturalSwipe': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.swipeSort,
    minimalScreen: { type: 'naturalSupernaturalSwipe', ...FIX.swipeSort },
    render: (fx, { onDone }) => <SwipeSort block={fx} subject="History" onComplete={onDone} />,
  },

  'screen:quickRecall': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.quickRecall,
    minimalScreen: { type: 'quickRecall', ...FIX.quickRecall },
    render: (fx, { onDone }) => (
      <QuickRecallScreen
        subject="History" chapterNum={fx.chapterNum} chapterTitle={fx.chapterTitle}
        questions={fx.questions} onBack={onDone} onContinue={onDone}
      />
    ),
  },

  'screen:tieredquiz': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: FIX.tieredQuiz,
    minimalScreen: { type: 'tieredquiz', ...FIX.tieredQuiz },
    render: (fx, { onDone }) => <TieredQuizScreen subject="History" tiers={fx.tiers} onContinue={onDone} />,
  },

  'screen:priorKnowledgeRecall': {
    renderMode: 'fullbleed',
    subject: 'History',
    fixture: {
      title: 'What do you already know?',
      prompt: 'Write down everything you can remember about how people in the Middle Ages explained illness.',
      concepts: ['four humours', 'miasma', 'astrology', 'divine punishment'],
    },
    minimalScreen: {
      type: 'priorKnowledgeRecall',
      title: 'What do you already know?',
      prompt: 'Write down everything you can remember about how people in the Middle Ages explained illness.',
      concepts: ['four humours', 'miasma', 'astrology', 'divine punishment'],
    },
    render: (fx, { onDone }) => (
      <PriorKnowledgeRecall block={fx} subject="History" onBack={onDone} onContinue={onDone} />
    ),
  },
}

function sentence(text) {
  const trimmed = String(text || '').trim()
  if (!trimmed) return ''
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`
}
