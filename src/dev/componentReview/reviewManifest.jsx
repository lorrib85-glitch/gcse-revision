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
import ContentShell from '../../components/layout/ContentShell.jsx'
import TeachScreenShell from '../../components/core/TeachScreenShell.jsx'
import ButtonsAndProgressPage from './ButtonsAndProgressPage.jsx'

// Registered library — self-contained kept components, here to refine in one place.
import FactorWeb from '../../components/learning/FactorWeb.jsx'
import InteractiveHotspotImage from '../../components/learning/InteractiveHotspotImage.jsx'
import CinematicRevealMoment from '../../components/learning/CinematicRevealMoment.jsx'
import ConceptReveal from '../../components/learning/ConceptReveal.jsx'
import ExplainReveal from '../../components/learning/ExplainReveal.jsx'
import ColSortBlock from '../../components/learning/ColSortBlock.jsx'
import VisualNarrativeScreen from '../../components/learning/VisualNarrativeScreen.jsx'
import QuoteAnalyser from '../../components/learning/QuoteAnalyser.jsx'
import KeyFigureReveal from '../../components/learning/KeyFigureReveal.jsx'

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
    alternative: 'InteractiveCollectionExplorer; CinematicRevealMoment; ConceptReveal; VisualNarrativeScreen.',
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
    function: 'Side-by-side theory comparison block with staggered fade-in.',
    usage: 'Used in Episodes 2 and 3, type: theoryCompare.',
    alternative: 'BeforeAfterImageSlider (interactive); MisconceptionCheck.',
    render: (fx) => <TheoryCompareBlock block={fx} subject="History" />,
    fixture: FIX.theoryCompareBlock,
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
    alternative: 'TimelineChain (causal chain); VisualNarrativeScreen.',
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
    id: 'visual-narrative', name: 'VisualNarrativeScreen', group: 'library',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Beat-based narrative screen (portrait/timeline/fact/conclusion beats).',
    usage: 'Used in Episode 3 (Vesalius) and elsewhere, type: visualNarrative.',
    alternative: 'VisualLearning; ConceptReveal.',
    render: (fx, { onDone }) => <VisualNarrativeScreen subject="History" beats={fx.beats} onContinue={onDone} />,
    fixture: FIX.visualNarrative,
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
]
