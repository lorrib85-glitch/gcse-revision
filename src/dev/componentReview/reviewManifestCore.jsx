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
import { getTypeInfo } from '../../data/componentFunctions.js'

import AngleExplore from '../../components/learning/AngleExplore.jsx'
import NumberLineExplore from '../../components/learning/NumberLineExplore.jsx'
import CoordinatePlaneExplore from '../../components/learning/CoordinatePlaneExplore.jsx'
import CalculationBreakdown from '../../components/learning/CalculationBreakdown.jsx'
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
import TheoryCompare from '../../components/learning/TheoryCompare.jsx'
import MisconceptionCheck from '../../components/learning/MisconceptionCheck.jsx'
import AcronymMemorise from '../../components/learning/AcronymMemorise.jsx'
import FlashcardsBlock from '../../components/learning/FlashcardsBlock.jsx'
import MemoryHook from '../../components/learning/MemoryHook.jsx'
import BuilderBlock from '../../components/learning/BuilderBlock.jsx'
import ChapterOutcomeScreen from '../../components/layout/ChapterOutcomeScreen.jsx'
import ChapterCompleteScreen from '../../components/layout/ChapterCompleteScreen.jsx'
import ChapterHookScreen from '../../components/layout/ChapterHookScreen.jsx'
import FillInTheBlanksBlock from '../../components/learning/FillInTheBlanksBlock.jsx'
import SwipeSort from '../../components/learning/SwipeSort.jsx'
import QuickRecallScreen from '../../components/learning/QuickRecallScreen.jsx'
import WhatExaminersLookFor from '../../components/learning/WhatExaminersLookFor.jsx'
import TieredQuizScreen from '../../components/learning/TieredQuizScreen.jsx'
import WeakSpotRecovery from '../../components/learning/WeakSpotRecovery.jsx'
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
// MedievalDiagnosisScene, UnifiedQuestionScreen and RecoveryQuizPlayer are not
// imported here — they are internal children of CentreImageReveal,
// QuickRecallScreen/TieredQuizScreen, and WeakSpotRecovery respectively, and
// are not independently selectable module-building choices (see reviewed-out
// entries note below).
import FaceTheExaminerContainer from '../../components/learning/faceTheExaminer/FaceTheExaminerContainer.jsx'
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

// Interaction class — two sources, never copied by hand:
//  • Entries that name a registered `contentType` get their interaction
//    derived below via getTypeInfo() from src/data/componentFunctions.js —
//    the single canonical source, so the lab can never drift out of sync
//    with it.
//  • Entries with no `contentType` (structural module screens outside the
//    content-type taxonomy, unrouted standalone components, and general
//    UI/design-system references) carry a manual `interaction` instead.
// 'uncategorised' is reserved for genuine unresolved cases only — not a
// holding area for things that belong in General components or should be
// removed from the lab.
export const INTERACTION_LABELS = {
  passive:       'Passive — reads or views',
  reveal:        'Reveal — actively explores but isn’t marked',
  assessed:      'Assessed — gives an answer that can be right or wrong',
  uncategorised: 'Uncategorised — genuinely unresolved',
  general:       'General components',
}

// Full-bleed components render fixed:inset-0 and manage their own scroll; the
// shell must NOT wrap them in its scrolling column (renderMode: 'fullbleed').
// Inline blocks render within a normal content flow (renderMode: 'inline').

// Authored entries. Ones with a `contentType` omit `interaction` here — it's
// derived canonically below, never copied by hand.
const RAW_ENTRIES = [
  // ── Unused / orphaned ─────────────────────────────────────────────────────
  {
    id: 'cinematic-carousel', name: 'CinematicCarousel', contentType: 'cinematicCarousel',
    status: 'routed-unused', subject: 'Biology', renderMode: 'fullbleed',
    function: 'Full-screen deep-dive carousel: one large image at a time with a sliding name + key-facts panel, for browsing a small related set.',
    usage: 'Routed in ModulePlayer (type: cinematicCarousel) but no content file uses it.',
    alternative: 'InteractiveHotspotImage (reveal variant); CinematicRevealMoment (imageReveal mode).',
    render: (fx, { onDone }) => <CinematicCarousel block={fx} subject="Biology" onContinue={onDone} />,
    fixture: FIX.cinematicCarousel,
  },
  {
    id: 'graph-view-scatter', name: 'GraphView (scatter)', contentType: 'graphView',
    status: 'routed-unused', subject: 'Maths', renderMode: 'inline',
    function: 'Embeddable SVG chart (bar/line/scatter/pie) for interpreting GCSE data inline within a content screen.',
    usage: 'Routed in ModulePlayer (type: graphView) but no content file uses it.',
    alternative: 'Static figure image; MathsDiagram.',
    render: (fx) => <GraphView block={fx} subject="Maths" />,
    fixture: FIX.graphViewScatter,
  },
  {
    id: 'graph-view-line', name: 'GraphView (line)', contentType: 'graphView',
    status: 'routed-unused', subject: 'Biology', renderMode: 'inline',
    function: 'Same component, line-graph mode: enzyme activity vs temperature — tests label readability and interpretation value.',
    usage: 'Routed in ModulePlayer (type: graphView) but no content file uses it.',
    alternative: 'Static figure image; MathsDiagram.',
    render: (fx) => <GraphView block={fx} subject="Biology" />,
    fixture: FIX.graphViewLine,
  },
  {
    id: 'timeline-chain', name: 'TimelineChain', contentType: 'timelineChain',
    status: 'one-off', subject: 'History', renderMode: 'fullbleed',
    function: 'Horizontal scroll-snap chain of flip cards revealing a chapter’s causal sequence step by step.',
    usage: 'Now used in Episode 2 (both plague-progression + aftermath screens, migrated from progressionTimeline).',
    alternative: 'TimelineCanvas (scroll-snap sibling); OrderedRouteTask (ordered route).',
    render: (fx, { onDone }) => <TimelineChain block={fx} subject="History" onContinue={onDone} />,
    fixture: FIX.timelineChain,
  },
  {
    // Unrouted standalone component (no content type to register yet) —
    // manual classification: default render is the interactive toggle
    // switch, tapped to explore the open/closed circuit with no scoring.
    id: 'circuit-diagram', name: 'CircuitDiagram', interaction: 'reveal',
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

  // ── One-off ───────────────────────────────────────────────────────────────
  {
    id: 'opposite-qualities-reveal', name: 'OppositeQualitiesReveal', contentType: 'oppositeQualitiesReveal',
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
    id: 'timeline-canvas', name: 'TimelineCanvas', contentType: 'timelineCanvas',
    status: 'one-off', subject: 'History', renderMode: 'fullbleed',
    function: 'Swipe-to-pan canvas across a wide chain of cards with connectors that draw in as you pan; tap + to reveal why each step mattered.',
    usage: 'Used in Episode 2 (Black Death), type: timelineCanvas.',
    alternative: 'TimelineChain (scroll-snap sibling).',
    render: (fx, { onDone }) => <TimelineCanvas block={fx} subject="History" onContinue={onDone} />,
    fixture: FIX.timelineCanvas,
  },
  {
    id: 'before-after-slider', name: 'BeforeAfterImageSlider', contentType: 'beforeAfterSlider',
    status: 'one-off', subject: 'History', renderMode: 'fullbleed',
    function: 'Full-screen drag slider comparing two states of the same image.',
    usage: 'Used in Episode 13 (Can we beat cancer?), type: beforeAfterSlider.',
    alternative: 'TheoryCompare (side-by-side comparison).',
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
    id: 'ordered-route-task', name: 'OrderedRouteTask', contentType: 'orderedRouteTask',
    status: 'one-off', subject: 'History', renderMode: 'fullbleed',
    function: 'Ordered chain: one job card at a time — tap the stage it belongs to. Accent route line + numbered nodes.',
    usage: 'Used in Episode 14 (Western Front), type: orderedRouteTask (renamed from evacuationChainRoute).',
    alternative: 'MatchingTask (unordered).',
    render: (fx, { onDone }) => <OrderedRouteTask screen={fx} subject="History" onComplete={onDone} />,
    fixture: FIX.evacuationChainRoute,
  },
  {
    id: 'spot-the-error', name: 'SpotTheError', contentType: 'spotTheError',
    status: 'routed-unused', subject: 'Biology', renderMode: 'fullbleed',
    function: 'Diagnostic precision check: select the error in a statement, explain why it is wrong, then rewrite it correctly.',
    usage: 'Routed in ModulePlayer (type: spotTheError) but no content file uses it. (Brief lists it under one-off; evidence shows it is unused.)',
    alternative: 'MisconceptionCheck (true/false trap); FaceTheExaminerContainer.',
    render: (fx, { onDone }) => <SpotTheError block={fx} subject="Biology" onContinue={onDone} />,
    fixture: FIX.spotTheError,
  },
  {
    id: 'centre-image-reveal', name: 'CentreImageReveal', contentType: 'centreImageReveal',
    status: 'one-off', subject: 'History', renderMode: 'fullbleed',
    function: 'Cause → prescription → reveal flow with a parchment input surface and fuzzy-match validation.',
    usage: 'Used in Episode 1 (medieval beliefs), type: centreImageReveal (renamed from medicalTheoryPrescription).',
    alternative: 'GuidedExamResponse (scaffolded written answer).',
    render: (fx, { onDone }) => <CentreImageReveal screen={fx} onComplete={onDone} />,
    fixture: FIX.medicalTheoryPrescription,
  },
  {
    id: 'acronym-memorise', name: 'AcronymMemorise', contentType: 'acronymMemorise',
    status: 'one-off', subject: 'Biology', renderMode: 'inline',
    function: 'Tap-to-reveal mnemonic block: each acronym letter expands to show what it stands for and why it matters (e.g. SCARF — five uses of glucose).',
    usage: 'Used in Plant Cells & Photosynthesis (sci_bio_w1), block type: acronymMemorise. Extracted from an inline definition in ModulePlayer into a standalone component.',
    alternative: 'FlashcardsBlock (recall); FillInTheBlanksBlock.',
    render: (fx) => <AcronymMemorise block={fx} />,
    fixture: FIX.acronymMemorise,
  },
  {
    id: 'flashcards-block', name: 'FlashcardsBlock', contentType: 'flashcards',
    status: 'comparison', subject: 'History', renderMode: 'inline',
    function: 'Two-column tap-to-reveal prompt and answer cards for a small set of independent facts. Reveal-only: the component does not score recall or log weakness evidence.',
    usage: 'Used across Medicine episodes 4, 7, 8 and 13, block type: flashcards. Extracted from ModulePlayer into a standalone component so the live pattern can be reviewed and refined in the Component Lab.',
    alternative: 'AcronymMemorise for one mnemonic set; QuickRecallScreen for objectively marked retrieval; MatchingTask when the learner must connect paired items.',
    render: (fx) => <FlashcardsBlock block={fx} />,
    fixture: FIX.flashcardsBlock,
  },
  {
    id: 'builder-block', name: 'BuilderBlock — reaction', contentType: 'builder',
    status: 'comparison', subject: 'Biology', renderMode: 'inline',
    function: 'Reusable select-and-place builder with a reaction layout for grouped inputs and outputs.',
    usage: 'Used in Plant Cells & Photosynthesis (sci_bio_w1), block type: builder. The same engine now supports calculations and quotations through data-driven layouts.',
    alternative: 'FillInTheBlanksBlock (inline typed gaps); ColSortBlock.',
    render: (fx, { onDone }) => <BuilderBlock block={fx} subject="Biology" onComplete={onDone} />,
    fixture: FIX.builderBlock,
  },
  {
    id: 'builder-block-maths', name: 'BuilderBlock — Maths', contentType: 'builder',
    status: 'comparison', subject: 'Maths', renderMode: 'inline',
    function: 'Missing-value calculation builder with fixed mathematical notation, compact number pieces and tabular numerals.',
    usage: 'Reusable BuilderBlock layout: equation. Demonstrates the same repair-first interaction without forcing Maths into the science reaction structure.',
    alternative: 'FillInTheBlanksBlock for typed answers.',
    render: (fx, { onDone }) => <BuilderBlock block={fx} subject="Maths" onComplete={onDone} />,
    fixture: FIX.builderMaths,
  },
  {
    id: 'builder-block-quote', name: 'BuilderBlock — quote', contentType: 'builder',
    status: 'comparison', subject: 'English', renderMode: 'inline',
    function: 'Quotation reconstruction layout with preserved line breaks, inline gaps and literary serif treatment.',
    usage: 'Reusable BuilderBlock layout: quote. Designed for short, high-value quotation recall rather than long paragraph completion.',
    alternative: 'FillInTheBlanksBlock for ordinary prose; QuoteAnalyser for deeper analysis after recall.',
    render: (fx, { onDone }) => <BuilderBlock block={fx} subject="English" onComplete={onDone} />,
    fixture: FIX.builderQuote,
  },

  // ── Active comparison components (not deletion candidates) ────────────────
  {
    id: 'matching-task', name: 'MatchingTask', contentType: 'matchingTask',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Term-to-description card-pair matching with SVG connectors — for unordered pairings.',
    usage: 'Widely used across History episodes (1–5), type: matchingTask.',
    alternative: 'MatchingTask (unordered).',
    render: (fx, { onDone }) => <MatchingTask screen={fx} subject="History" onComplete={onDone} />,
    fixture: FIX.matchingTask,
  },
  {
    id: 'visual-learning', name: 'VisualLearning', contentType: 'visualLearning',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Click-to-continue cinematic scene sequence with animated headlines.',
    usage: 'Used across History episodes (1, 2, 3, 14), type: visualLearning.',
    alternative: 'InteractiveHotspotImage (reveal variant); CinematicRevealMoment; ConceptReveal; TimelineChain (reveal variant).',
    render: (fx, { onDone }) => <VisualLearning block={fx} subject="History" onComplete={onDone} />,
    fixture: FIX.visualLearning,
  },
  {
    id: 'guided-choice-carousel', name: 'GuidedChoiceCarousel', contentType: 'guidedChoiceCarousel',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Scrollable single-choice carousel with atmospheric option cards.',
    usage: 'Used in Episodes 1 and 2, type: guidedChoiceCarousel.',
    alternative: 'InteractiveHotspotImage (reveal variant); CinematicCarousel.',
    render: (fx, { onDone }) => (
      <GuidedChoiceCarousel
        subject="History" headline={fx.headline} question={fx.question} helperText={fx.helperText}
        options={fx.options} onBack={() => {}} onContinue={onDone}
      />
    ),
    fixture: FIX.guidedChoiceCarousel,
  },
  {
    id: 'theory-compare', name: 'TheoryCompare', contentType: 'theoryCompare',
    status: 'comparison', subject: 'History', renderMode: 'inline',
    function: 'Side-by-side comparison of two approaches, people or theories: optional paired hero art, progressive comparison prompts and a final evidence-based takeaway. When no portraits are supplied the two portrait boxes render empty, ready for images in future.',
    usage: 'Used in Episode 3 (Galen and Vesalius), Episode 2 (Black Death beliefs) and Biology cell comparisons, type: theoryCompare.',
    alternative: 'KeyFigureReveal for one person; ColSortBlock for assessed classification; MisconceptionCheck.',
    render: (fx, { onDone }) => <TheoryCompare block={fx} subject="History" onComplete={onDone} />,
    fixture: FIX.theoryCompare,
  },
  {
    id: 'misconception-check', name: 'MisconceptionCheck', contentType: 'misconceptionCheck',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Cinematic true/false misconception trap, one statement at a time, with a calm reveal.',
    usage: 'Used across History episodes (1, 2, 3, 14), type: misconceptionCheck.',
    alternative: 'SpotTheError; FaceTheExaminerContainer.',
    render: (fx, { onDone }) => <MisconceptionCheck block={fx} subject="History" onContinue={onDone} />,
    fixture: FIX.misconceptionCheck,
  },

  // ── Registered library — self-contained kept components, refine here ──────
  {
    id: 'factor-web', name: 'FactorWeb', contentType: 'factorWeb',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Radial causes/factors web: explore each factor, then make a relative-importance judgement.',
    usage: 'Used in Episode 3 (Vesalius) and now Episode 1 (migrated from ConnectionMap).',
    alternative: 'MatchingTask (unordered pairing).',
    render: (fx, { onDone }) => <FactorWeb block={fx} subject="History" onContinue={onDone} />,
    fixture: FIX.factorWeb,
  },
  {
    id: 'infographic', name: 'Infographic', contentType: 'infographic',
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
    id: 'interactive-hotspot-image', name: 'InteractiveHotspotImage', contentType: 'interactiveImage',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Full-screen image with a two-phase intro → explore flow: tap glowing hotspots to read a label, description and extra fact for each point on the image.',
    usage: 'Used in Episode 1 (Tap the Four Humours) and Episode 2 (the dock at Melcombe), type: interactiveImage.',
    alternative: 'InteractiveHotspotImage reveal variant; CinematicCarousel.',
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
    id: 'interactive-hotspot-image-reveal', name: 'InteractiveHotspotImage (reveal)', contentType: 'interactiveImage',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Reveal variant: tap a hotspot to page through multiple pieces of information (reveals), then a synthesis "collection complete" screen once all are explored.',
    usage: 'Used in Episode 1 (staying well in 1400) and Episode 14 (trench conditions), type: interactiveImage + variant: reveal.',
    alternative: 'InteractiveHotspotImage (detail variant) for single-card hotspots.',
    render: (fx, { onDone }) => (
      <InteractiveHotspotImage
        subject="History" variant="reveal" title={fx.title} introText={fx.introText}
        image={fx.image} imageAlt={fx.imageAlt} hotspots={fx.hotspots} synthesis={fx.synthesis}
        onContinue={onDone}
      />
    ),
    fixture: FIX.interactiveHotspotReveal,
  },
  {
    id: 'cinematic-reveal-moment', name: 'CinematicRevealMoment', contentType: 'cinematic',
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
    id: 'memory-hook', name: 'MemoryHook', contentType: 'memoryHook',
    status: 'routed-unused', subject: 'Biology', renderMode: 'inline',
    function: 'In-page "make it stick" reminder: anchors one hard idea with a memorable analogy/mnemonic. Optional thumbnail; learner can rewrite the hook in their own words (persisted via storage.js).',
    usage: 'Routed in ModulePlayer (type: memoryHook); available for placement within any subject page. No content file uses it yet.',
    alternative: 'AcronymMemorise (interactive acronym drill).',
    render: (fx) => <MemoryHook block={fx} subject="Biology" />,
    fixture: FIX.memoryHook,
  },
  {
    id: 'concept-reveal', name: 'ConceptReveal', contentType: 'conceptReveal',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Tap-through atmospheric concept steps (main line + support line over background imagery).',
    usage: 'Used across History episodes for chapter-opening concept framing.',
    alternative: 'VisualLearning; CinematicRevealMoment.',
    render: (fx, { onDone }) => <ConceptReveal subject="History" steps={fx.steps} onContinue={onDone} />,
    fixture: FIX.conceptReveal,
  },
  {
    id: 'explain-reveal', name: 'ExplainReveal', contentType: 'explainReveal',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Progressive cause-and-effect reasoning chain, revealed one step at a time.',
    usage: 'Used for building an explanation step by step.',
    alternative: 'TimelineChain (causal chain, or reveal variant).',
    render: (fx, { onDone }) => <ExplainReveal block={fx} subject="History" onComplete={onDone} />,
    fixture: FIX.explainReveal,
  },
  {
    id: 'col-sort-block', name: 'ColSortBlock', contentType: 'colsort',
    status: 'comparison', subject: 'History', renderMode: 'inline',
    function: 'Sort items into labelled columns (change/continuity, classify) with per-item feedback.',
    usage: 'Used in History episodes for change/continuity sorting.',
    alternative: 'SwipeSort; MatchingTask.',
    render: (fx) => <ColSortBlock block={fx} subject="History" />,
    fixture: FIX.colSort,
  },
  {
    id: 'quote-analyser', name: 'QuoteAnalyser', contentType: 'quoteAnalyser',
    status: 'comparison', subject: 'English', renderMode: 'fullbleed',
    function: 'Full-screen quote dissection: tap through five analysis lenses on one literary quote.',
    usage: 'English literature quote analysis, type: quoteAnalyser.',
    alternative: 'None — English-specific close reading.',
    render: (fx, { onDone }) => <QuoteAnalyser block={fx} subject="English" onContinue={onDone} />,
    fixture: FIX.quoteAnalyser,
  },
  {
    id: 'key-figure-reveal', name: 'KeyFigureReveal', contentType: 'keyFigureReveal',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Scrollable portrait-hero screen introducing a key person, with up to four knowledge sections.',
    usage: 'Used across History episodes to introduce figures, type: keyFigureReveal.',
    alternative: 'MedievalDiagnosisScene (scene intro); ConceptReveal.',
    render: (fx, { onDone }) => <KeyFigureReveal block={fx} subject="History" onComplete={onDone} />,
    fixture: FIX.keyFigureReveal,
  },
  {
    id: 'face-the-examiner', name: 'FaceTheExaminerContainer', contentType: 'faceExaminer',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Examiner-style marking flow: guess the mark, pick the criteria, reveal the annotated answer with strong/weak/irrelevant tags, then improve the weak points and re-mark.',
    usage: 'Used as the module-level examiner in History episodes (1, 2, 3, 14), via module.examiner, and routable mid-module as type: faceExaminer.',
    alternative: 'GuidedExamResponse (scaffolded written answer); MisconceptionCheck / SpotTheError (shorter diagnostic checks).',
    render: (fx, { onDone }) => (
      <FaceTheExaminerContainer
        module={{ id: 'review-lab-fte', subject: 'History' }}
        examiner={fx}
        onExit={() => {}}
        onContinue={onDone}
      />
    ),
    fixture: FIX.faceTheExaminer,
  },
  {
    id: 'guided-exam-response', name: 'GuidedExamResponse', contentType: 'guidedExamResponse',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Cross-subject written-response scaffold: optional opening beat, governed exam prompt, section-by-section writing support and AI marking against the supplied board-specific mark scheme.',
    usage: 'Used in History episodes and GuidedAnswerCoach. Component Lab variants verify History, English, Biology, Maths and Sociology question structures through the same API.',
    alternative: 'FaceTheExaminerContainer (mark-the-answer diagnostic); GuidedAnswerCoach (full multi-stage exam-technique flow).',
    render: (fx, { onDone }) => (
      <GuidedExamResponse
        module={{ id: `review-lab-ger-${fx.subject || 'general'}`, subject: fx.subject }}
        exam={fx}
        onExit={() => {}}
        onContinue={onDone}
      />
    ),
    fixture: FIX.guidedExamResponse,
    variants: [
      {
        id: 'history',
        label: 'History',
        description: 'Edexcel explain-why response with two developed reasons and staged factual prompts.',
        fixture: FIX.guidedExamResponse,
      },
      {
        id: 'english',
        label: 'English',
        description: 'AQA literature response using an extract, interpretation, close analysis and a whole-text link.',
        fixture: FIX.guidedExamResponseEnglish,
      },
      {
        id: 'science',
        label: 'Science',
        description: 'AQA Biology required-practical response covering method, variables and a measurable end point.',
        fixture: FIX.guidedExamResponseScience,
      },
      {
        id: 'maths',
        label: 'Maths',
        description: 'AQA calculation response with working, a final answer and light method support.',
        fixture: FIX.guidedExamResponseMaths,
      },
      {
        id: 'sociology',
        label: 'Sociology',
        description: 'AQA evaluation response with supporting argument, challenge and reasoned judgement.',
        fixture: FIX.guidedExamResponseSociology,
      },
    ],
  },
  {
    // Shared UI / design-system reference, not a learning interaction —
    // General components section, not Passive/Reveal/Assessed.
    id: 'buttons-and-progress', name: 'Buttons and progress', interaction: 'general',
    status: 'reference', subject: 'History', renderMode: 'inline',
    function: 'Reference page: every governed button style and progression/progress indicator rendered live, each labelled with its name.',
    usage: 'Development reference only. Shows ContinueCTA, CinematicContinueCTA, CheckAnswerCTA, BackButton, ExitButton, LearningToolbar, the BUTTONS token tiers, cinematic-primary-action, NavArrow, LearningProgressHeader, SequenceProgress, ScoreNumberLine, CircularTimer and the pill progress bar pattern.',
    alternative: 'docs/system/BUTTON_RADII_SYSTEM.md (the written spec these components implement).',
    render: () => <ButtonsAndProgressPage />,
    fixture: null,
  },
  {
    // Structural module screen outside the content-type taxonomy — genuine
    // module-building choice, given an explicit local classification.
    id: 'chapter-outcome-screen', name: 'ChapterOutcomeScreen', interaction: 'passive',
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
    // Structural module screen outside the content-type taxonomy — genuine
    // module-building choice, given an explicit local classification.
    id: 'chapter-complete-screen', name: 'ChapterCompleteScreen', interaction: 'passive',
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
    // Structural module screen outside the content-type taxonomy — genuine
    // module-building choice, given an explicit local classification (the
    // learner judges a statement true/false, so it can be right or wrong).
    id: 'chapter-hook-screen', name: 'ChapterHookScreen', interaction: 'assessed',
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
    id: 'fill-in-the-blanks', name: 'FillInTheBlanksBlock', contentType: 'fillblanks',
    status: 'comparison', subject: 'Biology', renderMode: 'inline',
    function: 'Inline typed-gap recall block: complete each sentence with the exact term, with staged hints on a wrong answer.',
    usage: 'Routed in ModulePlayer (type: fillblanks); used across History and Science episodes.',
    alternative: 'BuilderBlock (select-and-place gaps); AcronymMemorise.',
    render: (fx, { onDone }) => <FillInTheBlanksBlock block={fx} subject="Biology" onContinue={onDone} />,
    fixture: FIX.fillInTheBlanks,
  },
  {
    id: 'swipe-sort', name: 'SwipeSort', contentType: 'naturalSupernaturalSwipe',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Swipe-gesture sorting: swipe each card left or right into one of two labelled columns, with a per-item explanation on release.',
    usage: 'Routed in ModulePlayer (type: naturalSupernaturalSwipe); used in Episodes 2, 4 and 5.',
    alternative: 'ColSortBlock (tap-to-column, inline); MatchingTask.',
    render: (fx, { onDone }) => <SwipeSort block={fx} subject="History" onComplete={onDone} />,
    fixture: FIX.swipeSort,
  },
  {
    id: 'quick-recall-screen', name: 'QuickRecallScreen', contentType: 'quickRecall',
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
    id: 'examiner-explains-screen', name: 'WhatExaminersLookFor', contentType: 'examinerExplains',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Pre-question examiner briefing: introduces the priorities an examiner rewards before the learner begins a written task.',
    usage: 'Canonical WhatExaminersLookFor component, routed through the legacy ModulePlayer type examinerExplains while content migrates.',
    alternative: 'GuidedAnswerCoach (full multi-stage coach); FaceTheExaminerContainer.',
    render: (fx, { onDone }) => (
      <WhatExaminersLookFor subject="History" whatExaminersLookFor={fx} onBack={onDone} onContinue={onDone} />
    ),
    fixture: FIX.examinerExplains,
  },
  {
    id: 'tiered-quiz-screen', name: 'TieredQuizScreen', contentType: 'tieredquiz',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Learner picks a difficulty tier, then answers that tier’s questions — self-levelled retrieval.',
    usage: 'Routed in ModulePlayer (type: tieredquiz); used across Sociology and other modules.',
    alternative: 'QuickRecallScreen (fixed single run); RecoveryQuizPlayer.',
    render: (fx, { onDone }) => <TieredQuizScreen subject="History" tiers={fx.tiers} onContinue={onDone} />,
    fixture: FIX.tieredQuiz,
  },
  {
    // Structural module screen outside the content-type taxonomy — genuine
    // module-building choice, given an explicit local classification.
    id: 'weak-spot-recovery', name: 'WeakSpotRecovery', interaction: 'passive',
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
    id: 'calculation-breakdown', name: 'CalculationBreakdown', contentType: 'calculationBreakdown',
    status: 'comparison', subject: 'Maths', renderMode: 'fullbleed',
    function: 'Multi-step maths walkthrough: breaks one calculation into stages (understand → worked steps → learner-applied step → full solution) and checks understanding at each stage.',
    usage: 'New component — pending review; not yet routed in ModulePlayer.',
    alternative: 'GuidedExamResponse (written scaffold); GraphView (data, not procedure).',
    render: (fx, { onDone }) => <CalculationBreakdown block={fx} onContinue={onDone} />,
    fixture: FIX.calculationBreakdown,
  },
  {
    // Unrouted standalone component (no content type to register yet) —
    // manual classification: the learner drags a ray (or a triangle's apex)
    // and watches values, classifications and angle facts respond, with no
    // scoring.
    id: 'angle-explore', name: 'AngleExplore', interaction: 'reveal',
    status: 'comparison', subject: 'Maths', renderMode: 'inline',
    function: 'Configuration-driven GCSE angle diagram — the Maths sibling of CircuitDiagram. Shapes and angles render as SVG; one draggable value drives live sector values, classifications and an angle-fact status line. Page-level questions and marking remain outside the component.',
    usage: 'New component — pending review; not yet routed in ModulePlayer. Review variants cover angle types, straight-line, around-a-point, vertically-opposite, triangle and static jobs.',
    alternative: 'GraphView (data charts, not angle facts); static figure image for non-interactive diagrams.',
    render: () => <AngleExplore />,
    fixture: null,
    variants: [
      {
        id: 'angle-types',
        label: 'Angle types',
        description: 'Drag the ray to change the angle: the value and its classification (acute, right, obtuse, straight, reflex) respond live.',
        render: () => <AngleExplore />,
      },
      {
        id: 'straight-line',
        label: 'Straight line',
        description: 'Two angles share a straight line; dragging the dividing ray keeps their live sum at 180°.',
        render: () => <AngleExplore preset="straightLine" />,
      },
      {
        id: 'around-point',
        label: 'Around a point',
        description: 'Three angles meet at a point; dragging one ray keeps the running total at 360°.',
        render: () => <AngleExplore preset="aroundPoint" />,
      },
      {
        id: 'vertically-opposite',
        label: 'Vertically opposite',
        description: 'Two crossing lines make two equal pairs — equal angles share a colour, and rotating one line preserves the equality.',
        render: () => <AngleExplore preset="verticallyOpposite" />,
      },
      {
        id: 'triangle',
        label: 'Triangle',
        description: 'Drag the apex of the triangle: all three interior angles update while their sum stays at 180°.',
        render: () => <AngleExplore preset="triangle" />,
      },
      {
        id: 'static',
        label: 'Static diagram',
        description: 'The same renderer with interaction disabled at a fixed value, for teaching, worked examples and exam questions.',
        render: () => <AngleExplore value={120} interactive={false} />,
      },
    ],
  },
  {
    // Unrouted standalone component (no content type to register yet) —
    // manual classification: the learner moves points, lines and shapes on a
    // coordinate plane and watches the rule respond, with no scoring.
    id: 'coordinate-plane-explore', name: 'CoordinatePlaneExplore', interaction: 'reveal',
    status: 'comparison', subject: 'Maths', renderMode: 'inline',
    function: 'Configuration-driven GCSE coordinate plane — position, quadrants, midpoints, straight-line graphs, tables of values, intersections and the four transformations on one plane with one interaction model. A three-tier annotation contract keeps only one point fully annotated. Page-level questions and marking remain outside the component.',
    usage: 'New component — pending review; not yet routed in ModulePlayer. Review variants cover all nine presets, a static exam figure and a cross-subject science framing.',
    alternative: 'NumberLineExplore (one dimension); GraphView (data charts); AngleExplore (angle facts); AreaPerimeterExplore (mensuration).',
    render: () => <CoordinatePlaneExplore />,
    fixture: null,
    variants: [
      {
        id: 'plot-point',
        label: 'Plot a point',
        description: 'Drag a point and read its coordinate. Guide lines belong to the active point alone.',
        render: () => <CoordinatePlaneExplore preset="plotPoint" />,
      },
      {
        id: 'quadrants',
        label: 'Quadrants',
        description: 'The four quadrants labelled with their sign pairs, named live as the point moves.',
        render: () => <CoordinatePlaneExplore preset="plotPoint" focus="quadrants" />,
      },
      {
        id: 'midpoint',
        label: 'Midpoint',
        description: 'The x-values and y-values bracketed and averaged separately, so the formula is read off the picture.',
        render: () => <CoordinatePlaneExplore preset="midpoint" />,
      },
      {
        id: 'straight-line',
        label: 'Straight line',
        description: 'y = mx + c with the rise/run triangle and the y-intercept marked.',
        render: () => <CoordinatePlaneExplore preset="straightLine" />,
      },
      {
        id: 'parallel',
        label: 'Parallel lines',
        description: 'Equal rise/run triangles on both lines, with intercepts set independently.',
        render: () => (
          <CoordinatePlaneExplore preset="straightLine" focus="compare" comparisonRule="parallel" />
        ),
      },
      {
        id: 'table-of-values',
        label: 'Table of values',
        description: 'One point, no line; two points, a provisional dashed line; three, solid — the third coordinate confirms the rule.',
        render: () => <CoordinatePlaneExplore preset="tableOfValues" defaultValue={{ m: 2, c: 1, step: 2 }} />,
      },
      {
        id: 'intersection',
        label: 'Intersection',
        description: 'The meeting point substituted back into both equations, which is what makes it a solution.',
        render: () => <CoordinatePlaneExplore preset="intersection" />,
      },
      {
        id: 'translate',
        label: 'Translate',
        description: 'A column vector sliding every vertex by the same amount, at the model extreme.',
        render: () => <CoordinatePlaneExplore preset="translate" defaultValue={{ dx: 8, dy: 5 }} />,
      },
      {
        id: 'reflect',
        label: 'Reflect',
        description: 'A diagonal mirror line with all six original and image vertices on one plane.',
        render: () => (
          <CoordinatePlaneExplore
            preset="reflect"
            defaultValue={{ mirrorValue: 0, mirror: 'yEqualsX' }}
          />
        ),
      },
      {
        id: 'rotate',
        label: 'Rotate',
        description: 'A quarter turn about a non-origin centre, with the direction control on screen.',
        render: () => (
          <CoordinatePlaneExplore
            preset="rotate"
            difficultyCapabilities={{ nonOriginCentre: true }}
            defaultValue={{ cx: 1, cy: -1, angle: '270', direction: 'anticlockwise' }}
          />
        ),
      },
      {
        id: 'enlarge',
        label: 'Enlarge',
        description: 'Scale factor 3 about a non-origin centre, with the full ray from centre to image.',
        render: () => (
          <CoordinatePlaneExplore
            preset="enlarge"
            difficultyCapabilities={{ nonOriginCentre: true, fractionalScaleFactor: true, negativeScaleFactor: true }}
            defaultValue={{ cx: -1, cy: -1, scaleFactor: '3' }}
          />
        ),
      },
      {
        id: 'static-exam',
        label: 'Static exam figure',
        description: 'interactive={false} — no handles, no live region, but a full descriptive summary for screen readers.',
        render: () => <CoordinatePlaneExplore preset="reflect" interactive={false} />,
      },
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
  {
    // Unrouted standalone component (no content type to register yet) —
    // manual classification: the learner drags a point along a number line and
    // watches position, movement, intervals and bounds respond, with no
    // scoring.
    id: 'number-line-explore', name: 'NumberLineExplore', interaction: 'reveal',
    status: 'comparison', subject: 'Maths', renderMode: 'inline',
    function: 'Configuration-driven GCSE number line — the shared visual foundation for number topics, and a sibling of AngleExplore. Ordering, directed movement, rounding intervals, inequalities, bounds, multiplication patterns and estimation ranges all render on one line with one interaction model. Page-level questions and marking remain outside the component.',
    usage: 'New component — pending review; not yet routed in ModulePlayer. Review variants cover all seven presets plus a static job.',
    alternative: 'AngleExplore (angle facts); AreaPerimeterExplore (mensuration); GraphView (data charts); a static figure image for non-interactive diagrams.',
    render: () => <NumberLineExplore />,
    fixture: null,
    variants: [
      {
        id: 'order-numbers',
        label: 'Ordering',
        description: 'Slide one value between four pinned ones — integers, a decimal and a fraction — and watch the ordering statement re-sort. Landing on a pinned value shows the two forms sharing a point.',
        render: () => <NumberLineExplore preset="orderNumbers" />,
      },
      {
        id: 'negative-movement',
        label: 'Negative moves',
        description: 'Addition and subtraction as directed movement: an animated arc shows the jump, and adding a negative visibly lands where subtracting does.',
        render: () => <NumberLineExplore preset="negativeMovement" />,
      },
      {
        id: 'rounding-intervals',
        label: 'Rounding',
        description: 'The two multiples a value sits between, with the halfway point marked. Precision switches between nearest 10, whole number and 1 d.p.',
        render: () => <NumberLineExplore preset="roundingIntervals" />,
      },
      {
        id: 'inequality-range',
        label: 'Inequalities',
        description: 'Open and closed endpoints, direction, symbol and interval notation stay tied together as the endpoint moves.',
        render: () => <NumberLineExplore preset="inequalityRange" />,
      },
      {
        id: 'bounds-interval',
        label: 'Bounds',
        description: 'The error interval of a rounded value — lower bound included, upper bound excluded, shown as a filled and an open endpoint.',
        render: () => <NumberLineExplore preset="boundsInterval" />,
      },
      {
        id: 'multiply-pattern',
        label: 'Multiplying',
        description: 'Multiplying by a negative as repeated jumps in the opposite direction — the jumps stay the same size, only their direction flips.',
        render: () => <NumberLineExplore preset="multiplyPattern" />,
      },
      {
        id: 'estimate-range',
        label: 'Estimation',
        description: 'Estimation as a range rather than a single answer: drag an estimate and see whether it lands inside the sensible band around the exact value.',
        render: () => <NumberLineExplore preset="estimateRange" />,
      },
      {
        id: 'static',
        label: 'Static diagram',
        description: 'The same renderer with interaction disabled at fixed values, for teaching, worked examples and exam questions.',
        render: () => (
          <NumberLineExplore preset="inequalityRange" value={{ endpoint: 2 }} interactive={false} />
        ),
      },
    ],
  },
]

export const REVIEW_ENTRIES = RAW_ENTRIES.map(entry => (
  entry.contentType
    ? { ...entry, interaction: getTypeInfo(entry.contentType)?.interaction ?? 'uncategorised' }
    : entry
))
