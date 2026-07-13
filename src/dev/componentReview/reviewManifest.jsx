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

import GalensDiagnostic from '../../components/learning/GalensDiagnostic.jsx'
import TheoryLab from '../../components/learning/TheoryLab.jsx'
import SymptomQualityDiagnostic from '../../components/learning/SymptomQualityDiagnostic.jsx'
import CinematicCarousel from '../../components/learning/CinematicCarousel.jsx'
import GraphView from '../../components/learning/GraphView.jsx'
import TimelineChain from '../../components/learning/TimelineChain.jsx'
import CircuitDiagram from '../../components/learning/CircuitDiagram.jsx'
import DragToOrderTask from '../../components/learning/DragToOrderTask.jsx'

import ConnectionMap from '../../components/learning/ConnectionMap.jsx'
import OppositeQualitiesReveal from '../../components/learning/OppositeQualitiesReveal.jsx'
import SymptomProgression from '../../components/learning/SymptomProgression.jsx'
import TimelineCanvas from '../../components/learning/TimelineCanvas.jsx'
import BeforeAfterImageSlider from '../../components/learning/BeforeAfterImageSlider.jsx'
import EvacuationChainRoute from '../../components/learning/EvacuationChainRoute.jsx'
import SpotTheError from '../../components/learning/SpotTheError.jsx'
import MedicalTheoryPrescription from '../../components/learning/MedicalTheoryPrescription.jsx'

import MatchingTask from '../../components/learning/MatchingTask.jsx'
import VisualLearning from '../../components/learning/VisualLearning.jsx'
import GuidedChoiceCarousel from '../../components/learning/GuidedChoiceCarousel.jsx'
import TheoryCompareBlock from '../../components/learning/TheoryCompareBlock.jsx'
import MisconceptionCheck from '../../components/learning/MisconceptionCheck.jsx'

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
}

export const GROUP_LABELS = {
  group1:     'Group 1 — unused / orphaned',
  group2:     'Group 2 — one-off',
  comparison: 'Active comparison components',
}

// Full-bleed components render fixed:inset-0 and manage their own scroll; the
// shell must NOT wrap them in its scrolling column (renderMode: 'fullbleed').
// Inline blocks render within a normal content flow (renderMode: 'inline').

export const REVIEW_ENTRIES = [
  // ── Group 1 — unused / orphaned ──────────────────────────────────────────
  {
    id: 'galens-diagnostic', name: 'GalensDiagnostic', group: 'group1',
    status: 'routed-unused', subject: 'History', renderMode: 'fullbleed',
    function: 'Reason through Galen’s four-humour theory to reach a period-appropriate diagnosis and opposite-quality treatment.',
    usage: 'Routed in ModulePlayer (type: galensDiagnostic) but no content file uses it.',
    alternative: 'SymptomQualityDiagnostic (newer opposite-quality reveal); TheoryLab.',
    render: (fx, { onDone }) => <GalensDiagnostic block={fx} subject="History" onContinue={onDone} />,
    fixture: FIX.galensDiagnostic,
  },
  {
    id: 'theory-lab', name: 'TheoryLab', group: 'group1',
    status: 'routed-unused', subject: 'History', renderMode: 'fullbleed',
    function: 'Multi-part diagnostic linking a historical belief to its treatment logic and outcome (belief → cause → action → limitation).',
    usage: 'Routed in ModulePlayer (type: theoryLab) but no content file uses it.',
    alternative: 'GalensDiagnostic; MedicalTheoryPrescription; ordinary scenario questions.',
    render: (fx, { onDone }) => <TheoryLab block={fx} subject="History" onContinue={onDone} />,
    fixture: FIX.theoryLab,
  },
  {
    id: 'symptom-quality-diagnostic', name: 'SymptomQualityDiagnostic', group: 'group1',
    status: 'routed-unused', subject: 'History', renderMode: 'fullbleed',
    function: 'Teaches Hot/Cold/Wet/Dry, walks one patient case, then asks for the dominant quadrant and opposite-quality treatment.',
    usage: 'Routed in ModulePlayer (type: symptomQualityDiagnostic); has a story/gold fixture but no shipped content uses it.',
    alternative: 'GalensDiagnostic (older); OppositeQualitiesReveal (reveal only).',
    render: (fx, { onDone }) => <SymptomQualityDiagnostic block={fx} subject="History" onContinue={onDone} />,
    fixture: FIX.symptomQualityDiagnostic,
  },
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
    status: 'routed-unused', subject: 'History', renderMode: 'fullbleed',
    function: 'Horizontal scroll-snap chain of flip cards revealing a chapter’s causal sequence step by step.',
    usage: 'Routed in ModulePlayer (type: timelineChain) but no content file uses it. (TimelineCanvas, its sibling, is used in Episode 2.)',
    alternative: 'TimelineCanvas (swipe-to-pan sibling); EvacuationChainRoute (ordered route).',
    render: (fx, { onDone }) => <TimelineChain block={fx} subject="History" onContinue={onDone} />,
    fixture: FIX.timelineChain,
  },
  {
    id: 'circuit-diagram', name: 'CircuitDiagram', group: 'group1',
    status: 'unused', subject: 'Physics', renderMode: 'inline',
    function: 'GCSE Physics series circuit (battery, wire loop, bulb, switch). A single `closed` prop toggles current flow and bulb glow.',
    usage: 'Not routed in ModulePlayer and not referenced by any content — fully unused. Both states shown here for comparison.',
    alternative: 'None — no other circuit component exists.',
    render: () => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ font: '600 12px Sora, sans-serif', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Open switch</div>
          <CircuitDiagram closed={false} />
        </div>
        <div>
          <div style={{ font: '600 12px Sora, sans-serif', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Closed switch</div>
          <CircuitDiagram closed={true} />
        </div>
      </div>
    ),
    fixture: null,
  },
  {
    id: 'drag-to-order-task', name: 'DragToOrderTask', group: 'group1',
    status: 'unused', subject: 'Biology', renderMode: 'fullbleed',
    function: 'Sequencing mechanic: reorder items into the correct sequence, then submit for feedback.',
    usage: 'Not routed in ModulePlayer and not referenced by any content — fully unused. Judged here as a sequencing mechanic only.',
    alternative: 'EvacuationChainRoute (tap-to-place ordered route); TimelineChain (causal sequence).',
    render: (fx, { onDone }) => <DragToOrderTask items={fx} subject="Biology" onComplete={onDone} />,
    fixture: FIX.dragToOrderTask,
  },

  // ── Group 2 — one-off ────────────────────────────────────────────────────
  {
    id: 'connection-map', name: 'ConnectionMap', group: 'group2',
    status: 'one-off', subject: 'History', renderMode: 'fullbleed',
    function: 'Radial concept explorer: tap central-connected nodes to reveal explanation + retrieval prompt.',
    usage: 'Used once — Episode 1 (medieval beliefs), type: connectionMap.',
    alternative: 'FactorWeb; MatchingTask (for term↔response pairing).',
    render: (fx, { onDone }) => <ConnectionMap block={fx} subject="History" onComplete={onDone} />,
    fixture: FIX.connectionMap,
  },
  {
    id: 'opposite-qualities-reveal', name: 'OppositeQualitiesReveal', group: 'group2',
    status: 'one-off', subject: 'History', renderMode: 'inline',
    function: 'Animated reveal sorting symptoms to a left/right opposite-quality pair (hot vs cold).',
    usage: 'Used once — Episode 1 (medieval beliefs), type: oppositeQualitiesReveal.',
    alternative: 'SymptomQualityDiagnostic; SwipeSort; ColSortBlock.',
    render: (fx) => <OppositeQualitiesReveal block={fx} subject="History" />,
    fixture: FIX.oppositeQualitiesReveal,
  },
  {
    id: 'symptom-progression', name: 'SymptomProgression', group: 'group2',
    status: 'one-off', subject: 'History', renderMode: 'fullbleed',
    function: 'Case-file walkthrough of how an illness develops in the body, stage by stage.',
    usage: 'Used in Episode 2 (Black Death), type: progressionTimeline.',
    alternative: 'ExplainReveal (cause-and-effect chain); TimelineChain.',
    render: (fx, { onDone }) => (
      <SymptomProgression subject="History" title={fx.title} description={fx.description} stages={fx.stages} onContinue={onDone} />
    ),
    fixture: FIX.symptomProgression,
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
        beforeLabel={fx.beforeLabel} afterLabel={fx.afterLabel} heading={fx.heading} subheading={fx.subheading}
        revealText={fx.revealText} accent="#6A343D" initial={fx.initial} onComplete={onDone}
      />
    ),
    fixture: FIX.beforeAfterImageSlider,
  },
  {
    id: 'evacuation-chain-route', name: 'EvacuationChainRoute', group: 'group2',
    status: 'one-off', subject: 'History', renderMode: 'fullbleed',
    function: 'Ordered chain: tap a job card then tap the stage it belongs to. Amber route line + numbered nodes.',
    usage: 'Used in Episode 14 (Western Front), type: evacuationChainRoute.',
    alternative: 'MatchingTask (unordered); DragToOrderTask (pure ordering).',
    render: (fx, { onDone }) => <EvacuationChainRoute screen={fx} subject="History" onComplete={onDone} />,
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
    id: 'medical-theory-prescription', name: 'MedicalTheoryPrescription', group: 'group2',
    status: 'one-off', subject: 'History', renderMode: 'fullbleed',
    function: 'Cause → prescription → reveal flow with a parchment input surface and fuzzy-match validation.',
    usage: 'Used in Episode 1 (medieval beliefs), type: medicalTheoryPrescription.',
    alternative: 'TheoryLab; GalensDiagnostic.',
    render: (fx, { onDone }) => <MedicalTheoryPrescription screen={fx} onComplete={onDone} />,
    fixture: FIX.medicalTheoryPrescription,
  },

  // ── Active comparison components (not deletion candidates) ────────────────
  {
    id: 'matching-task', name: 'MatchingTask', group: 'comparison',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Term-to-description card-pair matching with SVG connectors — for unordered pairings.',
    usage: 'Widely used across History episodes (1–5), type: matchingTask.',
    alternative: 'ConnectionMap; EvacuationChainRoute (ordered).',
    render: (fx, { onDone }) => <MatchingTask screen={fx} subject="History" onComplete={onDone} />,
    fixture: FIX.matchingTask,
  },
  {
    id: 'visual-learning', name: 'VisualLearning', group: 'comparison',
    status: 'comparison', subject: 'History', renderMode: 'fullbleed',
    function: 'Click-to-continue cinematic scene sequence with animated headlines.',
    usage: 'Used across History episodes (1, 2, 3, 14), type: visualLearning.',
    alternative: 'CinematicRevealMoment; ConceptReveal; VisualNarrativeScreen.',
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
]
