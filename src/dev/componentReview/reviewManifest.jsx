// ─── Component Review Lab — review manifest ──────────────────────────────────
//
// DEVELOPMENT-ONLY. One ordered array describing every component under review.
// Each entry carries factual review metadata AND a render() function that
// mounts the real component through its existing API — keeping prop wiring
// beside the metadata so the shell stays component-agnostic and no component
// API is bent to fit the gallery.
//
// This whole directory is excluded from production builds (src/App.jsx dev gate).

import * as FIX from './fixtures.js'
import { SUBJECT_ACCENTS } from '../../constants/subjects.js'

import CinematicCarousel from '../../components/learning/CinematicCarousel.jsx'
import GraphView from '../../components/learning/GraphView.jsx'
import TimelineChain from '../../components/learning/TimelineChain.jsx'
import CircuitDiagram from '../../components/learning/CircuitDiagram.jsx'
import CircuitSymbolReference from '../../components/learning/CircuitSymbolReference.jsx'

import OppositeQualitiesReveal from '../../components/learning/OppositeQualitiesReveal.jsx'
import TimelineCanvas from '../../components/learning/TimelineCanvas.jsx'
import BeforeAfterImageSlider from '../../components/learning/BeforeAfterImageSlider.jsx'
import OrderedRouteTask from '../../components/learning/OrderedRouteTask.jsx'
import SpotTheError from '../../components/learning/SpotTheError.jsx'
import CentreImageReveal from '../../components/learning/CentreImageReveal.jsx'

import MatchingTask from '../../components/learning/MatchingTask.jsx'
import VisualLearning from '../../components/learning/VisualLearning.jsx'
import GuidedChoiceCarousel from '../../components/learning/GuidedChoiceCarousel.jsx'
import TheoryCompareBlock from '../../components/learning/TheoryCompareBlock.jsx'
import MisconceptionCheck from '../../components/learning/MisconceptionCheck.jsx'
import AcronymMemorise from '../../components/learning/AcronymMemorise.jsx'
import MemoryHook from '../../components/learning/MemoryHook.jsx'
import BuilderBlock from '../../components/learning/BuilderBlock.jsx'
import ChapterOutcomeScreen from '../../components/layout/ChapterOutcomeScreen.jsx'
import ChapterCompleteScreen from '../../components/layout/ChapterCompleteScreen.jsx'
import ChapterHookScreen from '../../components/layout/ChapterHookScreen.jsx'
import FillInTheBlanksBlock from '../../components/learning/FillInTheBlanksBlock.jsx'
import SwipeSort from '../../components/learning/SwipeSort.jsx'
import InteractiveCollectionExplorer from '../../components/learning/InteractiveCollectionExplorer.jsx'
import MedievalDiagnosisScene from '../../components/learning/MedievalDiagnosisScene.jsx'
import QuickRecallScreen from '../../components/learning/QuickRecallScreen.jsx'
import ExaminerExplainsScreen from '../../components/learning/ExaminerExplainsScreen.jsx'
import UnifiedQuestionScreen from '../../components/learning/UnifiedQuestionScreen.jsx'
import TieredQuizScreen from '../../components/learning/TieredQuizScreen.jsx'
import WeakSpotRecovery from '../../components/learning/WeakSpotRecovery.jsx'
import RecoveryQuizPlayer from '../../components/learning/RecoveryQuizPlayer.jsx'
import KeyPoint from '../../components/core/KeyPoint.jsx'
import WorkedExample from '../../components/core/WorkedExample.jsx'
import ContentShell from '../../components/layout/ContentShell.jsx'
import TeachScreenShell from '../../components/core/TeachScreenShell.jsx'
import ButtonsAndProgressPage from './ButtonsAndProgressPage.jsx'

// Registered library — self-contained kept components, here to refine in one place.
import FactorWeb from '../../components/learning/FactorWeb.jsx'
import Infographic from '../../components/learning/Infographic.jsx'
import InteractiveHotspotImage from '../../components/learning/InteractiveHotspotImage.jsx'
import CinematicRevealMoment from '../../components/learning/CinematicRevealMoment.jsx'
import ConceptReveal from '../../components/learning/ConceptReveal.jsx'
import ExplainReveal from '../../components/learning/ExplainReveal.jsx'
import ColSortBlock from '../../components/learning/ColSortBlock.jsx'
import QuoteAnalyser from '../../components/learning/QuoteAnalyser.jsx'
import KeyFigureReveal from '../../components/learning/KeyFigureReveal.jsx'
import FaceTheExaminer from '../../components/learning/FaceTheExaminer.jsx'
import GuidedExamResponse from '../../components/learning/GuidedExamResponse.jsx'

// The seven review questions are identical for every component (per brief), so
// they live once here rather than being duplicated per entry.
export const REVIEW_QUESTIONS = [
  'Does this create a genuinely useful learning experience?',
  'Is the interaction understandable without lengthy instructions?',
  'Does it work comfortably on mobile?',
  'Does it perform a distinct pedagogical job?',
  'Is another existing component already better?',
  'Could subject-specific content be moved into data to make the mechanic reusable?',
  'Is the maintenance cost justified?',
]

export const STATUS_LABELS = {
  'unused':        'Unused',
  'routed-unused': 'Routed but unused',
  'one-off':       'One-off',
  'comparison':    'Active comparison',
  'reference':     'Reference',
}

export const GROUP_LABELS = {
  group1:     'Group 1 — unused / orphaned',
  group2:     'Group 2 — one-off',
  comparison: 'Active comparison components',
  library:    'Registered library — refine here',
}

// Full-bleed components render fixed:inset-0 and manage their own scroll; the
// shell must NOT wrap them in its scrolling column (renderMode: 'fullbleed').
// Inline blocks render within a normal content flow (renderMode: 'inline').

export const REVIEW_ENTRIES = [
  // ── Group 1 — unused / orphaned ──────────────────────────────────────────
  {
    id: 'cinematic-carousel', name: 'CinematicCarousel', group: 'group1',
    status: 'routed-unused', subject: 'Biology', renderMode: 'fullbleed',
    function: 'Full-screen deep-dive carousel: one large image at a time with a sliding name + key-facts panel, for browsing a small related set.',
    usage: 'Routed in ModulePlayer (type: cinematicCarousel) but no content file uses it.',
    alternative: 'InteractiveCollectionExplorer; CinematicRevealMoment (imageReveal mode).',
    render: (fx, { onDone }) => <CinematicCarousel block={fx} subject="Biology" onContinue={onDone} />,
    fixture: FIX.cinematicCarousel,
  },
  {
    id: 'graph-view-scatter', name: 'GraphView (scatter)', group: 'group1',
    status: 'routed-unused', subject: 'Maths', renderMode: 'inline',
    function: 'Embeddable SVG chart (bar/line/scatter/pie) for interpreting GCSE data inline within a content screen.',
    usage: 'Routed in ModulePlayer (type: graphView) but no content file uses it.',
    alternative: 'Static figure image; MathsDiagram.',
    render: (fx) => <GraphView block={fx} subject="Maths" />,
    fixture: FIX.graphViewScatter,
  },
  {
    id: 'graph-view-line', name: 'GraphView (line)', group: 'group1',
    status: 'routed-unused', subject: 'Biology', renderMode: 'inline',
    function: 'Same component, line-graph mode: enzyme activity vs temperature — tests label readability and interpretation value.',
    usage: 'Routed in ModulePlayer (type: graphView) but no content file uses it.',
    alternative: 'Static figure image; MathsDiagram.',
    render: (fx) => <GraphView block={fx} subject="Biology" />,
    fixture: FIX.graphViewLine,
  },
  {
    id: 'timeline-chain', name: 'TimelineChain', group: 'group1',
    status: 'one-off', subject: 'History', renderMode: 'fullbleed',
    function: 'Horizontal scroll-snap chain of flip cards revealing a chapter’s causal sequence step by step.',
    usage: 'Now used in Episode 2 (both plague-progression + aftermath screens, migrated from progressionTimeline).',
    alternative: 'TimelineCanvas (scroll-snap sibling); OrderedRouteTask (ordered route).',
    render: (fx, { onDone }) => <TimelineChain block={fx} subject="History" onContinue={onDone} />,
    fixture: FIX.timelineChain,
  },
  {
    id: 'circuit-diagram', name: 'CircuitDiagram', group: 'group1',
    status: 'unused', subject: 'Physics', renderMode: 'inline',
    function: 'Configuration-driven GCSE circuit diagram. It renders exam-recognisable symbols, responsive layouts and optional physical switch interaction; page-level questions and predictions remain outside the component.',
    usage: 'Not routed in ModulePlayer and not referenced by content yet. Review variants now cover series, parallel, measurement, read-only and shared symbol-reference jobs.',
    alternative: 'CircuitSymbolReference is the read-only symbol-learning sibling; no alternative connected-circuit component exists.',
    render: () => <CircuitDiagram />,
    fixture: null,
    variants: [
      {
        id: 'simple-series',
        label: 'Simple series',
        description: 'Core one-switch circuit: open and close the physical switch to observe the complete-circuit relationship.',
        render: () => <CircuitDiagram />,
      },
      {
        id: 'two-switch-series',
        label: 'Two switches',
        description: 'Two independent switches share one series loop. One remaining gap keeps the whole circuit off.',
        render: () => <CircuitDiagram preset="twoSwitchSeries" />,
      },
      {
        id: 'parallel-branches',
        label: 'Parallel branches',
        description: 'Two independently switched branches prove that one lamp can stay on while the other branch is open.',
        render: () => <CircuitDiagram preset="parallelBranches" />,
      },
      {
        id: 'measurement-circuit',
        label: 'Measurement circuit',
        description: 'Read-only placement diagram: ammeter in the main series loop and voltmeter connected across the resistor.',
        render: () => <CircuitDiagram preset="measurementCircuit" />,
      },
      {
        id: 'read-only',
        label: 'Read-only',
        description: 'The same connected-circuit renderer with interaction disabled for teaching, worked examples and exam questions.',
        render: () => <CircuitDiagram defaultClosed interactive={false} />,
      },
      {
        id: 'symbol-reference',
        label: 'Symbol reference',
        description: 'Shared GCSE reference board built from the same governed primitives, including cell, battery, meters, sensors and semiconductor symbols.',
        render: () => <CircuitSymbolReference />,
      },
    ],
  },

  // ── Group 2 — one-off ────────────────────────────────────────────────────
  {
    id: 'opposite-qualities-reveal', name: 'OppositeQualitiesReveal', group: 'group2',
    status: 'one-off', subject: 'History', renderMode: 'fullbleed',
    function: 'Cinematic guided reveal that moves each example from a neutral centre into one of two opposing concept groups.',
    usage: 'Used twice in Episode 1 (hot/cold and wet/dry), type: oppositeQualitiesReveal.',
    alternative: 'SwipeSort and ColSortBlock assess classification; this component teaches the contrast first.',
    render: (fx, { onDone }) => (
      <ContentShell subject="History" header="none">
        <TeachScreenShell heading={fx.title} intro={fx.copy} subject="History">
          <OppositeQualitiesReveal
            block={{ ...fx, backgroundMode: 'screen' }}
            subject="History"
            onComplete={onDone}
          />
        </TeachScreenShell>
      </ContentShell>
    ),
    fixture: FIX.oppositeQualitiesReveal,
  },
  {
    id: 'timeline-canvas', name: 'TimelineCanvas', group: 'group2',
    status: 'one-off', subject: 'History', renderMode: 'fullbleed',
    function: 'Swipe-to-pan canvas across a wide chain of cards with connectors that draw in as you pan; tap + to reveal why each step mattered.',
    usage: 'Used in Episode 2 (Black Death), type: timelineCanvas.',
    alternative: 'TimelineChain (scroll-snap sibling).',
    render: (fx, { onDone }) => <TimelineCanvas block={fx} subject="History" onContinue={onDone} />,
    fixture: FIX.timelineCanvas,
  },
  {
    id: 'before-after-slider', name: 'BeforeAfterImageSlider', group: 'group2',
    status: 'one-off', subject: 'History', renderMode: 'fullbleed',
    function: 'Full-screen drag slider comparing two states of the same image.',
    usage: 'Used in Episode 13 (Can we beat cancer?), type: beforeAfterSlider.',
    alternative: 'TheoryCompareBlock (side-by-side, no interaction).',
    render: (fx, { onDone }) => (
      <BeforeAfterImageSlider
        beforeSrc={fx.beforeSrc} afterSrc={fx.afterSrc} beforeAlt={fx.beforeAlt} afterAlt={fx.afterAlt}
        beforeLabel={fx.beforeLabel} afterLabel={fx.afterLabel} heading={fx.heading}
        revealText={fx.revealText} accent={SUBJECT_ACCENTS.History} initial={fx.initial} onComplete={onDone}
      />
    ),
    fixture: FIX.beforeAfterImageSlider,
  },
  {
    id: 'ordered-route-task', name: 'OrderedRouteTask', group: 'group2',
    status: 'one-off', subject: 'History', renderMode: 'fullbleed',
    function: 'Ordered chain: one job card at a time — tap the stage it belongs to. Accent route line + numbered nodes.',
    usage: 'Used in Episode 14 (Western Front), type: orderedRouteTask (renamed from evacuationChainRoute).',
    alternative: 'MatchingTask (unordered).',
    render: (fx, { onDone }) => <OrderedRouteTask screen={fx} subject="History" onComplete={onDone} />,
    fixture: FIX.evacuationChainRoute,
  },
  {
    id: 'spot-the-error', name: 'SpotTheError', group: 'group2',
    status: 'routed-unused', subject: 'Biology', renderMode: 'fullbleed',
    function: 'Diagnostic precision check: select the error in a statement, explain why it is wrong, then rewrite it correctly.',
    usage: 'Routed in ModulePlayer (type: spotTheError) but no content file uses it. (Brief lists it under one-off; evidence shows it is unused.)',
    alternative: 'MisconceptionCheck (true/false trap); FaceTheExaminer.',
    render: (fx, { onDone }) => <SpotTheError block={fx} subject="Biology" onContinue={onDone} />,
    fixture: FIX.spotTheError,
  },
  {
    id: 'centre-image-reveal', name: 'CentreImageReveal', group: 'group2',
    status: 'one-off', subject: 'History', renderMode: 'fullbleed',
    function: 'Cause → prescription → reveal flow with a parchment input surface and fuzzy-match validation.',
    usage: 'Used in Episode 1 (medieval beliefs), type: centreImageReveal (renamed from medicalTheoryPrescription).',
    alternative: 'GuidedExamResponse (scaffolded written answer).',
    render: (fx, { onDone }) => <CentreImageReveal screen={fx} onComplete={onDone} />,
    fixture: FIX.medicalTheoryPrescription,
  },
  {
    id: 'acronym-memorise', name: 'AcronymMemorise', group: 'group2',
    status: 'one-off', subject: 'Biology', renderMode: 'inline',
    function: 'Tap-to-reveal mnemonic block: each acronym letter expands to show what it stands for and why it matters (e.g. SCARF — five uses of glucose).',
    usage: 'Used in Plant Cells & Photosynthesis (sci_bio_w1), block type: acronymMemorise. Extracted from an inline definition in ModulePlayer into a standalone component.',
    alternative: 'FlashcardsBlock (recall); FillInTheBlanksBlock.',
    render: (fx) => <AcronymMemorise block={fx} />,
    fixture: FIX.acronymMemorise,
  },
  {
    id: 'builder-block', name: 'BuilderBlock — reaction', group: 'library',
    status: 'comparison', subject: 'Biology', renderMode: 'inline',
    function: 'Reusable select-and-place builder with a reaction layout for grouped inputs and outputs.',
    usage: 'Used in Plant Cells & Photosynthesis (sci_bio_w1), block type: builder. The same engine now supports calculations and quotations through data-driven layouts.',
    alternative: 'FillInTheBlanksBlock (inline typed gaps); ColSortBlock.',
    render: (fx, { onDone }) => <BuilderBlock block={fx} subject="Biology" onComplete={onDone} />,
    fixture: FIX.builderBlock,
  },
  {
    id: 'builder-block-maths', name: 'BuilderBlock — Maths', group: 'library',
    status: 'comparison', subject: 'Maths', renderMode: 'inline',
    function: 'Missing-value calculation builder with fixed mathematical notation, compact number pieces and tabular numerals.',
    usage: 'Reusable BuilderBlock layout: equation. Demonstrates the same repair-first interaction without forcing Maths into the science reaction structure.',
    alternative: 'FillInTheBlanksBlock for typed answers; WorkedExample for explained methods.',
    render: (fx, { onDone }) => <BuilderBlock block={fx} subject="Maths" onComplete={onDone} />,
    fixture: FIX.builderMaths,
  },
  {
    id: 'builder-block-quote', name: 'BuilderBlock — quote', group: 'library',
    status: 'comparison', subject: 'English', renderMode: 'inline',
    function: 'Quotation reconstruction layout with preserved line breaks, inline gaps and literary serif treatment.',
    usage: 'Reusable BuilderBlock layout: quote. Designed for short, high-value quotation recall rather than long paragraph completion.',
    alternative: 'FillInTheBlanksBlock for ordinary prose; QuoteAnalyser for deeper analysis after recall.',
    render: (fx, { onDone }) => <BuilderBlock block={fx} subject="English" onComplete={onDone} />,
    fixture: FIX.builderQuote,
  },

  // ── Active comparison components (not deletion candidates) ────────────────
  {
    id: 'matching-task', name: 'MatchingTask', group: 'comparison',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Term-to-description card-pair matching with SVG connectors — for unordered pairings.',
    usage: 'Widely used across History episodes (1–5), type: matchingTask.',
    alternative: 'MatchingTask (unordered).',
    render: (fx, { onDone }) => <MatchingTask screen={fx} subject="History" onComplete={onDone} />,
    fixture: FIX.matchingTask,
  },
  {
    id: 'visual-learning', name: 'VisualLearning', group: 'comparison',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Click-to-continue cinematic scene sequence with animated headlines.',
    usage: 'Used across History episodes (1, 2, 3, 14), type: visualLearning.',
    alternative: 'InteractiveCollectionExplorer; CinematicRevealMoment; ConceptReveal; TimelineChain (reveal variant).',
    render: (fx, { onDone }) => <VisualLearning block={fx} subject="History" onComplete={onDone} />,
    fixture: FIX.visualLearning,
  },
  {
    id: 'guided-choice-carousel', name: 'GuidedChoiceCarousel', group: 'comparison',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Scrollable single-choice carousel with atmospheric option cards.',
    usage: 'Used in Episodes 1 and 2, type: guidedChoiceCarousel.',
    alternative: 'InteractiveCollectionExplorer; CinematicCarousel.',
    render: (fx, { onDone }) => (
      <GuidedChoiceCarousel
        subject="History" headline={fx.headline} question={fx.question} helperText={fx.helperText}
        options={fx.options} onBack={() => {}} onContinue={onDone}
      />
    ),
    fixture: FIX.guidedChoiceCarousel,
  },
  {
    id: 'theory-compare-block', name: 'TheoryCompareBlock', group: 'comparison',
    status: 'comparison', subject: 'History', renderMode: 'inline',
    function: 'Belief-versus-reality comparison with a staggered reveal and final takeaway.',
    usage: 'Used in Episode 2 (Black Death), type: theoryCompare.',
    alternative: 'BeforeAfterImageSlider (interactive); MisconceptionCheck.',
    render: (fx) => <TheoryCompareBlock block={fx} subject="History" />,
    fixture: FIX.theoryCompareBlock,
  },
  {
    id: 'theory-compare-people', name: 'TheoryCompareBlock — people', group: 'comparison',
    status: 'comparison', subject: 'History', renderMode: 'inline',
    function: 'Cinematic person-to-person comparison with paired hero art, progressive comparison prompts and a final evidence-based takeaway.',
    usage: 'Used in Episode 3 (Galen and Vesalius), type: theoryCompare, variant: people.',
    alternative: 'KeyFigureReveal for one person; ColSortBlock for assessed classification.',
    render: (fx, { onDone }) => <TheoryCompareBlock block={fx} subject="History" onComplete={onDone} />,
    fixture: FIX.theoryComparePeople,
  },
  {
    id: 'misconception-check', name: 'MisconceptionCheck', group: 'comparison',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Cinematic true/false misconception trap, one statement at a time, with a calm reveal.',
    usage: 'Used across History episodes (1, 2, 3, 14), type: misconceptionCheck.',
    alternative: 'SpotTheError; FaceTheExaminer.',
    render: (fx, { onDone }) => <MisconceptionCheck block={fx} subject="History" onContinue={onDone} />,
    fixture: FIX.misconceptionCheck,
  },

  // ── Registered library — self-contained kept components, refine here ──────
  {
    id: 'factor-web', name: 'FactorWeb', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Radial causes/factors web: explore each factor, then make a relative-importance judgement.',
    usage: 'Used in Episode 3 (Vesalius) and now Episode 1 (migrated from ConnectionMap).',
    alternative: 'MatchingTask (unordered pairing).',
    render: (fx, { onDone }) => <FactorWeb block={fx} subject="History" onContinue={onDone} />,
    fixture: FIX.factorWeb,
  },
  {
    id: 'infographic', name: 'Infographic', group: 'library',
    status: 'one-off', subject: 'History', renderMode: 'inline',
    function: 'Canonical screen for type infographic: one teaching heading and framing line (owned by the approved TeachScreenShell) then a single governed infographic media slot (MediaPlaceholder) — either a reserved diagram or a progressive quadrant reveal.',
    usage: 'Routed in ModulePlayer (type: infographic) and used by Episode 1 "Galen treated with opposites" — the first infographic screen. Reusable across subjects for any heading + intro + infographic composition.',
    alternative: 'Compose TeachScreenShell + MediaPlaceholder directly; MediaPlaceholder alone for a bare media slot.',
    render: (fx, { onDone }) => (
      <Infographic
        subject="History"
        heading={fx.heading}
        intro={fx.intro}
        media={fx.media}
        onContinue={onDone}
      />
    ),
    fixture: FIX.infographic,
  },
  {
    id: 'interactive-hotspot-image', name: 'InteractiveHotspotImage', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Full-screen image with a two-phase intro → explore flow: tap glowing hotspots to read a label, description and extra fact for each point on the image.',
    usage: 'Used in Episode 1 (Tap the Four Humours) and Episode 2 (the dock at Melcombe), type: interactiveImage.',
    alternative: 'InteractiveCollectionExplorer (themed sheets, no image anchoring); CinematicCarousel.',
    render: (fx, { onDone }) => (
      <InteractiveHotspotImage
        subject="History" title={fx.title} introText={fx.introText}
        image={fx.image} imageAlt={fx.imageAlt} hotspots={fx.hotspots} ctaLabel={fx.ctaLabel}
        onContinue={onDone}
      />
    ),
    fixture: FIX.interactiveHotspotImage,
  },
  {
    id: 'cinematic-reveal-moment', name: 'CinematicRevealMoment', group: 'library',
    status: 'one-off', subject: 'History', renderMode: 'fullbleed',
    function: 'Full-screen cinematic opener: a video plays (with a still-image fallback), then label, headline and body reveal line by line over a darkening frame before the Continue prompt.',
    usage: 'Used in Episode 2 (Black Death opening), type: cinematic.',
    alternative: 'VisualLearning (click-through scenes); ConceptReveal; CinematicCarousel.',
    render: (fx, { onDone }) => (
      <CinematicRevealMoment
        subject="History" label={fx.label} videoSrc={fx.videoSrc} fallbackImage={fx.fallbackImage}
        year={fx.year} headline={fx.headline} body={fx.body}
        onContinue={onDone}
      />
    ),
    fixture: FIX.cinematicRevealMoment,
  },
  {
    id: 'memory-hook', name: 'MemoryHook', group: 'library',
    status: 'routed-unused', subject: 'Biology', renderMode: 'inline',
    function: 'In-page "make it stick" reminder: anchors one hard idea with a memorable analogy/mnemonic. Optional thumbnail; learner can rewrite the hook in their own words (persisted via storage.js).',
    usage: 'Routed in ModulePlayer (type: memoryHook); available for placement within any subject page. No content file uses it yet.',
    alternative: 'KeyPoint (states the screen’s rule); AcronymMemorise (interactive acronym drill).',
    render: (fx) => <MemoryHook block={fx} subject="Biology" />,
    fixture: FIX.memoryHook,
  },
  {
    id: 'concept-reveal', name: 'ConceptReveal', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Tap-through atmospheric concept steps (main line + support line over background imagery).',
    usage: 'Used across History episodes for chapter-opening concept framing.',
    alternative: 'VisualLearning; CinematicRevealMoment.',
    render: (fx, { onDone }) => <ConceptReveal subject="History" steps={fx.steps} onContinue={onDone} />,
    fixture: FIX.conceptReveal,
  },
  {
    id: 'explain-reveal', name: 'ExplainReveal', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Progressive cause-and-effect reasoning chain, revealed one step at a time.',
    usage: 'Used for building an explanation step by step.',
    alternative: 'TimelineChain (causal chain, or reveal variant).',
    render: (fx, { onDone }) => <ExplainReveal block={fx} subject="History" onComplete={onDone} />,
    fixture: FIX.explainReveal,
  },
  {
    id: 'col-sort-block', name: 'ColSortBlock', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'inline',
    function: 'Sort items into labelled columns (change/continuity, classify) with per-item feedback.',
    usage: 'Used in History episodes for change/continuity sorting.',
    alternative: 'SwipeSort; MatchingTask.',
    render: (fx) => <ColSortBlock block={fx} subject="History" />,
    fixture: FIX.colSort,
  },
  {
    id: 'quote-analyser', name: 'QuoteAnalyser', group: 'library',
    status: 'comparison', subject: 'English', renderMode: 'fullbleed',
    function: 'Full-screen quote dissection: tap through five analysis lenses on one literary quote.',
    usage: 'English literature quote analysis, type: quoteAnalyser.',
    alternative: 'None — English-specific close reading.',
    render: (fx, { onDone }) => <QuoteAnalyser block={fx} subject="English" onContinue={onDone} />,
    fixture: FIX.quoteAnalyser,
  },
  {
    id: 'key-figure-reveal', name: 'KeyFigureReveal', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Scrollable portrait-hero screen introducing a key person, with up to four knowledge sections.',
    usage: 'Used across History episodes to introduce figures, type: keyFigureReveal.',
    alternative: 'MedievalDiagnosisScene (scene intro); ConceptReveal.',
    render: (fx, { onDone }) => <KeyFigureReveal block={fx} subject="History" onComplete={onDone} />,
    fixture: FIX.keyFigureReveal,
  },
  {
    id: 'face-the-examiner', name: 'FaceTheExaminer', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Examiner-style marking flow: guess the mark, pick the criteria, reveal the annotated answer with strong/weak/irrelevant tags, then improve the weak points and re-mark.',
    usage: 'Used as the module-level examiner in History episodes (1, 2, 3, 14), via module.examiner, and routable mid-module as type: faceExaminer.',
    alternative: 'GuidedExamResponse (scaffolded written answer); MisconceptionCheck / SpotTheError (shorter diagnostic checks).',
    render: (fx, { onDone }) => (
      <FaceTheExaminer
        module={{ id: 'review-lab-fte', subject: 'History' }}
        examiner={fx}
        onExit={() => {}}
        onContinue={onDone}
      />
    ),
    fixture: FIX.faceTheExaminer,
  },
  {
    id: 'guided-exam-response', name: 'GuidedExamResponse', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Guided written-answer scaffold: dark beat → "your turn" intro → section-by-section writing lanes, then examiner marking with a mark-by-mark breakdown and a rewritten sentence.',
    usage: 'Used in Episode 3 (Vesalius 12-marker), type: guidedExamResponse. Also drives the worked-answer stages of GuidedAnswerCoach in Exam Mode.',
    alternative: 'FaceTheExaminer (mark-the-answer diagnostic); GuidedAnswerCoach (full multi-stage exam-technique flow).',
    render: (fx, { onDone }) => (
      <GuidedExamResponse
        module={{ id: 'review-lab-ger', subject: 'History' }}
        exam={fx}
        onExit={() => {}}
        onContinue={onDone}
      />
    ),
    fixture: FIX.guidedExamResponse,
  },
  {
    id: 'buttons-and-progress', name: 'Buttons and progress', group: 'library',
    status: 'reference', subject: 'History', renderMode: 'inline',
    function: 'Reference page: every governed button style and progression/progress indicator rendered live, each labelled with its name.',
    usage: 'Development reference only. Shows ContinueCTA, CinematicContinueCTA, CheckAnswerCTA, BackButton, ExitButton, ModuleToolbar, the BUTTONS token tiers, cinematic-primary-action, NavArrow, LearningProgressHeader, SequenceProgress, ScoreNumberLine, CircularTimer and the pill progress bar pattern.',
    alternative: 'docs/system/BUTTON_RADII_SYSTEM.md (the written spec these components implement).',
    render: () => <ButtonsAndProgressPage />,
    fixture: null,
  },
  {
    id: 'chapter-outcome-screen', name: 'ChapterOutcomeScreen', group: 'library',
    status: 'comparison', subject: 'Biology', renderMode: 'fullbleed',
    function: 'Full-screen chapter-opening outcomes reveal: chapter title, "what you\'re about to uncover" label, and staggered learning-outcome items over a subject backdrop.',
    usage: 'Routed in ModulePlayer as the chapter outcome screen; used across modules.',
    alternative: 'ChapterHookScreen (true/false warm-up opener); ConceptReveal.',
    render: (fx, { onDone }) => (
      <ChapterOutcomeScreen
        subject="Biology" chapterNum={2} chapterTitle={fx.chapterTitle}
        outcomes={fx.outcomes} onBack={() => {}} onContinue={onDone}
      />
    ),
    fixture: FIX.chapterOutcome,
  },
  {
    id: 'chapter-complete-screen', name: 'ChapterCompleteScreen', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'End-of-chapter completion screen: animated checkmark ring, "Complete" headline, continue-to-next-chapter primary CTA, quick-quiz row, optional past-paper row and Return Home.',
    usage: 'Shown as the chapter-complete overlay in LegacyApp (view: chapter-complete) at the end of every module chapter.',
    alternative: 'ChapterOutcomeScreen (chapter opening, not completion).',
    render: (fx, { onDone }) => (
      <ChapterCompleteScreen
        accent={SUBJECT_ACCENTS.History}
        completedChapter={fx.completedChapter}
        supportingCopy={fx.supportingCopy}
        nextChapterNum={fx.nextChapterNum}
        nextChapterTitle={fx.nextChapterTitle}
        nextChapterLabel={fx.nextChapterLabel}
        onContinue={onDone} onQuiz={onDone} onHome={onDone}
        tab="subjects" setTab={() => {}}
      />
    ),
    fixture: FIX.chapterComplete,
  },
  {
    id: 'chapter-hook-screen', name: 'ChapterHookScreen', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Chapter-opening true/false warm-up: a bold statement the learner judges true or false, then a reveal explaining why.',
    usage: 'Routed in ModulePlayer as the chapter hook opener; completes the chapter-framing trio with ChapterOutcomeScreen and ChapterCompleteScreen.',
    alternative: 'MisconceptionCheck (multi-statement trap); ConceptReveal (passive framing).',
    render: (fx, { onDone }) => (
      <ChapterHookScreen
        subject="History" chapterNum={fx.chapterNum} chapterTitle={fx.chapterTitle}
        statement={fx.statement} isTrue={fx.isTrue} accentWords={fx.accentWords}
        explanation={fx.explanation} onBack={onDone} onContinue={onDone}
      />
    ),
    fixture: FIX.chapterHook,
  },
  {
    id: 'fill-in-the-blanks', name: 'FillInTheBlanksBlock', group: 'library',
    status: 'comparison', subject: 'Biology', renderMode: 'inline',
    function: 'Inline typed-gap recall block: complete each sentence with the exact term, with staged hints on a wrong answer.',
    usage: 'Routed in ModulePlayer (type: fillblanks); used across History and Science episodes.',
    alternative: 'BuilderBlock (select-and-place gaps); AcronymMemorise.',
    render: (fx, { onDone }) => <FillInTheBlanksBlock block={fx} subject="Biology" onContinue={onDone} />,
    fixture: FIX.fillInTheBlanks,
  },
  {
    id: 'swipe-sort', name: 'SwipeSort', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Swipe-gesture sorting: swipe each card left or right into one of two labelled columns, with a per-item explanation on release.',
    usage: 'Routed in ModulePlayer (type: naturalSupernaturalSwipe); used in Episodes 2, 4 and 5.',
    alternative: 'ColSortBlock (tap-to-column, inline); MatchingTask.',
    render: (fx, { onDone }) => <SwipeSort block={fx} subject="History" onComplete={onDone} />,
    fixture: FIX.swipeSort,
  },
  {
    id: 'interactive-collection-explorer', name: 'InteractiveCollectionExplorer', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Themed explorer: tap objects on a background scene to open colour-coded sheets that reveal one line at a time, then a synthesis screen.',
    usage: 'Routed in ModulePlayer (type: collectionExplorer); used in Episodes 1 and 14.',
    alternative: 'InteractiveHotspotImage (image-anchored hotspots); CinematicCarousel.',
    render: (fx, { onDone }) => (
      <InteractiveCollectionExplorer
        subject="History" title={fx.title} description={fx.description}
        backgroundImage={fx.backgroundImage} items={fx.items} synthesis={fx.synthesis}
        onContinue={onDone}
      />
    ),
    fixture: FIX.collectionExplorer,
  },
  {
    id: 'medieval-diagnosis-scene', name: 'MedievalDiagnosisScene', group: 'library',
    status: 'one-off', subject: 'History', renderMode: 'inline',
    function: 'Cinematic 9:16 SVG scene: Thomas at a candlelit table with the four medieval explanations of illness as tappable zones. Opens the centreImageReveal select phase.',
    usage: 'Used in Episode 1 (medieval beliefs). Reduced motion renders the static end state.',
    alternative: 'InteractiveHotspotImage (photographic hotspots); KeyFigureReveal.',
    render: (fx, { onDone }) => (
      <MedievalDiagnosisScene
        theories={fx.theories} completedIds={[]} playIntro={true} onSelectZone={onDone}
      />
    ),
    fixture: FIX.medievalDiagnosisScene,
  },
  {
    id: 'quick-recall-screen', name: 'QuickRecallScreen', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Rapid-fire retrieval: a short run of full-screen choice questions with immediate feedback, for end-of-chapter recall.',
    usage: 'Routed in ModulePlayer (type: quickRecall); used across History episodes.',
    alternative: 'TieredQuizScreen (learner picks difficulty); UnifiedQuestionScreen (single question).',
    render: (fx, { onDone }) => (
      <QuickRecallScreen
        subject="History" chapterNum={fx.chapterNum} chapterTitle={fx.chapterTitle}
        questions={fx.questions} onBack={onDone} onContinue={onDone}
      />
    ),
    fixture: FIX.quickRecall,
  },
  {
    id: 'examiner-explains-screen', name: 'ExaminerExplainsScreen', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'How-examiners-think reveal: an opening line, tips revealed one at a time, and a closing line — exam-technique framing before a written task.',
    usage: 'Routed in ModulePlayer (type: examinerExplains); used across History episodes before exam-style questions.',
    alternative: 'GuidedAnswerCoach (full multi-stage coach); FaceTheExaminer.',
    render: (fx, { onDone }) => (
      <ExaminerExplainsScreen subject="History" examinerExplains={fx} onBack={onDone} onContinue={onDone} />
    ),
    fixture: FIX.examinerExplains,
  },
  {
    id: 'unified-question-screen', name: 'UnifiedQuestionScreen', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Single full-screen choice question with a hint, feedback and explanation — the shared question renderer used inside QuickRecall and TieredQuiz.',
    usage: 'Composed by QuickRecallScreen and TieredQuizScreen; the canonical single-question screen.',
    alternative: 'ExamQuestionFrame (mark-scheme reveal); MisconceptionCheck.',
    render: (fx, { onDone }) => (
      <UnifiedQuestionScreen
        question={fx.question} type={fx.type} options={fx.options} correct={fx.correct}
        hint={fx.hint} explanation={fx.explanation} subject="History" onComplete={onDone}
      />
    ),
    fixture: FIX.unifiedQuestion,
  },
  {
    id: 'tiered-quiz-screen', name: 'TieredQuizScreen', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Learner picks a difficulty tier, then answers that tier’s questions — self-levelled retrieval.',
    usage: 'Routed in ModulePlayer (type: tieredquiz); used across Sociology and other modules.',
    alternative: 'QuickRecallScreen (fixed single run); RecoveryQuizPlayer.',
    render: (fx, { onDone }) => <TieredQuizScreen subject="History" tiers={fx.tiers} onContinue={onDone} />,
    fixture: FIX.tieredQuiz,
  },
  {
    id: 'weak-spot-recovery', name: 'WeakSpotRecovery', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Behavioural intervention screen shown when the tracker detects a struggling learner: names the gap and offers a targeted recovery quiz or a skip.',
    usage: 'Shown by ModulePlayer when a weak spot is detected mid-module; routes into RecoveryQuizPlayer.',
    alternative: 'RecoveryQuizPlayer (the quiz it launches); ProgressRecoveryCard.',
    render: (fx, { onDone }) => (
      <WeakSpotRecovery
        block={fx} subject="History" progress={{ current: 3, total: 8 }}
        onBack={onDone} onFixWeakSpot={onDone} onSkip={onDone}
      />
    ),
    fixture: FIX.weakSpotRecovery,
  },
  {
    id: 'recovery-quiz-player', name: 'RecoveryQuizPlayer', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Lightweight recovery quiz: 3–4 focused questions loaded by id from recoveryQuizzes.js, launched after a detected weak spot.',
    usage: 'Launched by WeakSpotRecovery via recoveryQuizId; a short targeted retrieval loop.',
    alternative: 'QuickRecallScreen (chapter recall); TieredQuizScreen.',
    render: (fx, { onDone }) => <RecoveryQuizPlayer recoveryQuizId={fx} onComplete={onDone} onBack={onDone} />,
    fixture: FIX.recoveryQuizId,
  },
  {
    id: 'key-point', name: 'KeyPoint', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'inline',
    function: 'Inline rule takeaway: states the one rule a teach screen leaves the learner with, with optional accented words and icon.',
    usage: 'Routed in ModulePlayer (type: keypoint); used across subjects to fix the screen’s core rule.',
    alternative: 'WorkedExample (applies the rule to a case); MemoryHook (analogy/mnemonic).',
    render: (fx) => <KeyPoint text={fx.text} emphasis={fx.emphasis} subject="History" />,
    fixture: FIX.keyPoint,
  },
  {
    id: 'worked-example', name: 'WorkedExample', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'inline',
    function: 'Inline case → apply → result block: walks one specific case through a rule, with chips for the given facts and a highlighted result.',
    usage: 'Used across subjects (History, Maths) to demonstrate applying a rule to a worked case.',
    alternative: 'KeyPoint (states the rule, no case); GuidedExamResponse (full written scaffold).',
    render: (fx) => (
      <WorkedExample
        subject="History" chips={fx.chips} scenario={fx.scenario} working={fx.working} result={fx.result}
      />
    ),
    fixture: FIX.workedExample,
  },
]
