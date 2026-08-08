import { useState } from 'react'
import { SUBJECTS } from '../../constants/subjects.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { COMPONENT_SIZE, SPACING } from '../../constants/spacing.js'
import { getBlockDefinition, getScreenType, resolveScreenDefinition } from '../../data/screenRegistry.js'
import ExamQuestionFrame from '../feedback/ExamQuestionFrame.jsx'
import ExplainReveal from '../learning/ExplainReveal.jsx'
import MediaPlaceholder from '../core/MediaPlaceholder.jsx'
import TeachScreenShell from '../core/TeachScreenShell.jsx'
import Infographic from '../learning/Infographic.jsx'
import QuickRecallScreen from '../learning/QuickRecallScreen.jsx'
import TieredQuizScreen from '../learning/TieredQuizScreen.jsx'
import CinematicRevealMoment from '../learning/CinematicRevealMoment.jsx'
import ConceptReveal from '../learning/ConceptReveal.jsx'
import LearningHeader from '../core/LearningHeader.jsx'
import FaceTheExaminer from '../learning/FaceTheExaminer.jsx'
import GuidedExamResponse from '../learning/GuidedExamResponse.jsx'
import InteractiveHotspotImage from '../learning/InteractiveHotspotImage.jsx'
import FillInTheBlanksBlock from '../learning/FillInTheBlanksBlock.jsx'
import AcronymMemorise from '../learning/AcronymMemorise.jsx'
import FlashcardsBlock from '../learning/FlashcardsBlock.jsx'
import MemoryHook from '../learning/MemoryHook.jsx'
import BuilderBlock from '../learning/BuilderBlock.jsx'
import AnswerInteraction from '../core/AnswerInteraction.jsx'
import CardContainer from '../core/CardContainer.jsx'
import GuidedChoiceCarousel from '../learning/GuidedChoiceCarousel.jsx'
import TimelineChain, { TimelineChainBlock } from '../learning/TimelineChain.jsx'
import TimelineCanvas from '../learning/TimelineCanvas.jsx'
import CinematicCarousel from '../learning/CinematicCarousel.jsx'
import TheoryCompare from '../learning/TheoryCompare.jsx'
import GraphView from '../learning/GraphView.jsx'
import ColSortBlock from '../learning/ColSortBlock.jsx'
import SpotTheError from '../learning/SpotTheError.jsx'
import MisconceptionCheck from '../learning/MisconceptionCheck.jsx'
// The canonical component, not the parked ExaminerExplainsScreen alias that
// re-exports it. Phase 4 moved the screen:examinerExplains authoring entry to
// the WhatExaminersLookFor record, so the route names the same identity the
// catalogue does.
import WhatExaminersLookFor from '../learning/WhatExaminersLookFor.jsx'
import CalculationBreakdown from '../learning/CalculationBreakdown.jsx'
// The six figure renderers are subject-specific drawing engines, loaded on
// demand rather than imported here: a History chapter should not download a
// coordinate-plane engine to render a paragraph. The runtime preloads the ones
// a chapter actually contains as soon as its definition resolves, so the
// fallback below is an exception path, not the normal experience. See
// deferredFigures.jsx.
import {
  DeferredFigure,
  LazyAngleExplore,
  LazyAreaPerimeterExplore,
  LazyCircuitDiagram,
  LazyCircuitSymbolReference,
  LazyCoordinatePlaneExplore,
  LazyNumberLineExplore,
} from './deferredFigures.jsx'
import SwipeSort from '../learning/SwipeSort.jsx'
import OppositeQualitiesReveal from '../learning/OppositeQualitiesReveal.jsx'
import VisualLearning from '../learning/VisualLearning.jsx'
import KeyFigureReveal from '../learning/KeyFigureReveal.jsx'
import CentreImageReveal from '../learning/CentreImageReveal.jsx'
import MatchingTask from '../learning/MatchingTask.jsx'
import OrderedRouteTask from '../learning/OrderedRouteTask.jsx'
import PriorKnowledgeRecall from '../learning/PriorKnowledgeRecall.jsx'
import BeforeAfterImageSlider from '../learning/BeforeAfterImageSlider.jsx'
import FactorWeb from '../learning/FactorWeb.jsx'
import QuoteAnalyser from '../learning/QuoteAnalyser.jsx'
import { ScreenTitle, ScreenBody } from '../core/ScreenText.jsx'
import { TYPE } from '../../constants/typography.js'

function ReadBlock({ block }) {
  return (
    <div>
      {block.label && (
        <div style={{
          ...TYPE.eyebrow,
          textTransform: 'uppercase', color: '#70B8FF', marginBottom: 12,
        }}>{block.label}</div>
      )}
      <p style={{
        ...TYPE.body,
        fontSize: '.95rem', lineHeight: 1.7, margin: 0, color: '#C8D0E8',
      }} dangerouslySetInnerHTML={{ __html: block.text }} />
    </div>
  )
}

function KeypointBlock({ block }) {
  return (
    <div>
      <div style={{
        ...TYPE.eyebrow,
        textTransform: 'uppercase', color: SUBJECTS.History.accent, marginBottom: 12,
      }}>⭐ Key Point</div>
      {block.text && (
        <p style={{
          ...TYPE.body,
          fontSize: '.95rem', lineHeight: 1.65, margin: 0, color: '#E0E6F0',
        }} dangerouslySetInnerHTML={{ __html: block.text }} />
      )}
      {Array.isArray(block.points) && (
        <ul style={{ margin: 0, paddingLeft: 20, color: '#E0E6F0' }}>
          {block.points.map((point, index) => (
            <li key={index} style={{ ...TYPE.body, fontSize: '.95rem', lineHeight: 1.65, marginBottom: 6 }}>
              {point}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function FunFactBlock({ block }) {
  return (
    <div>
      <div style={{
        ...TYPE.eyebrow,
        textTransform: 'uppercase', color: '#FFC857', marginBottom: 10,
      }}>{block.label || '🤯 Fun Fact'}</div>
      <p style={{
        ...TYPE.body,
        fontSize: '.92rem', margin: 0, color: '#C8D0E8', lineHeight: 1.65,
      }}>{block.text}</p>
    </div>
  )
}

function ExamTipBlock({ block, subject }) {
  const capitalised = subject ? subject.charAt(0).toUpperCase() + subject.slice(1).toLowerCase() : null
  const theme = (capitalised && SUBJECTS[capitalised]) || SUBJECTS.Physics
  const accent = theme.accent
  const examTheme = GENERAL.examTechnique

  return (
    <div>
      <div style={{
        ...TYPE.label,
        color: accent,
        marginBottom: examTheme.labelGap,
        display: 'flex',
        alignItems: 'center',
        gap: SPACING.micro,
      }}>
        <span aria-hidden="true" style={{
          width: SPACING.compact,
          height: COMPONENT_SIZE.accentRail,
          background: accent,
          flexShrink: 0,
        }} />
        {block.label || 'Exam tactic'}
      </div>
      {block.text && (
        <p style={{
          ...TYPE.bodyStrong,
          margin: 0,
          color: examTheme.bodyPrimary,
        }} dangerouslySetInnerHTML={{ __html: block.text }} />
      )}
      {block.tip && (
        <p style={{
          ...TYPE.body,
          margin: block.text ? `${examTheme.sectionGap}px 0 0` : 0,
          color: examTheme.bodySecondary,
        }} dangerouslySetInnerHTML={{ __html: block.tip }} />
      )}
      {Array.isArray(block.phrases) && block.phrases.length > 0 && (
        <div style={{ marginTop: examTheme.sectionGap }}>
          <div style={{
            ...TYPE.label,
            color: examTheme.bodySecondary,
            marginBottom: examTheme.phraseGap,
          }}>
            {block.phrasesLabel || 'Key wording'}
          </div>
          <div style={{ display: 'grid', gap: examTheme.phraseGap }}>
            {block.phrases.map((phrase, index) => (
              <div key={`${phrase}-${index}`} style={{
                ...TYPE.bodyStrong,
                color: examTheme.bodyPrimary,
              }}>{phrase}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function TimelineBlock({ block }) {
  const [open, setOpen] = useState(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '14px 0' }}>
      {block.events.map((e, i) => (
        <div key={i}>
          <button onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', display: 'grid', gridTemplateColumns: '72px 1fr',
              gap: 10, border: 'none', background: 'transparent', cursor: 'pointer',
              textAlign: 'left', padding: 0,
            }}>
            <div style={{
              background: open === i ? '#F5B700' : '#1A2338',
              color: open === i ? '#070500' : '#F5B700',
              border: `1px solid ${open === i ? '#F5B700' : '#2A3552'}`,
              borderRadius: 12, display: 'grid', placeItems: 'center',
              ...TYPE.eyebrow,
              fontSize: '.8rem', padding: '10px 6px', minHeight: 56, transition: 'all .2s',
            }}>{e.year}</div>
            <div style={{
              background: open === i ? 'rgba(245,183,0,.06)' : '#10182B',
              border: `1px solid ${open === i ? 'rgba(245,183,0,.3)' : '#2A3552'}`,
              borderRadius: 12, padding: '12px 14px', transition: 'all .2s',
              display: 'flex', alignItems: 'center',
            }}>
              <span style={{
                ...TYPE.bodyStrong,
                fontSize: '.9rem', color: '#C8D0E8',
              }} dangerouslySetInnerHTML={{ __html: e.text }} />
            </div>
          </button>
        </div>
      ))}
    </div>
  )
}


function RevealBlock({ block }) {
  const [shown, setShown] = useState(false)
  return (
    <div style={{ margin: '14px 0' }}>
      {/* Prompt card */}
      <div style={{
        background: '#10182B',
        border: '1px solid #2A3552',
        borderRadius: 14, padding: '16px 18px', marginBottom: 10,
      }}>
        <div style={{
          ...TYPE.eyebrow,
          textTransform: 'uppercase', color: SUBJECTS.History.accent, marginBottom: 8,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          ⚡ {block.label || 'Rapid Fire Sort'}
        </div>
        <p style={{
          ...TYPE.bodyStrong,
          margin: 0,
          color: '#7C8DB0', fontSize: '.95rem',
        }}>{block.prompt}</p>
      </div>

      {!shown ? (
        <button onClick={() => setShown(true)} style={{
          width: '100%',
          background: 'transparent',
          border: '1px solid #2A3552',
          borderRadius: 14, padding: '14px',
          ...TYPE.button,
          color: '#9CA8C7', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'border-color .2s, color .2s',
        }}>
          Reveal answer →
        </button>
      ) : (
        <div className="fade-up" style={{
          background: 'rgba(77,255,136,.07)',
          border: '1px solid rgba(77,255,136,.25)',
          borderRadius: 14, padding: '16px 18px',
        }}>
          <div style={{
            ...TYPE.eyebrow,
            textTransform: 'uppercase', color: '#4DFF88', marginBottom: 8,
          }}>✓ Answer</div>
          <p style={{
            ...TYPE.body,
            margin: 0, fontSize: '.92rem', color: '#C8D0E8', lineHeight: 1.6,
          }}>{block.answer}</p>
        </div>
      )}
    </div>
  )
}

// ─── MisconceptionBlock ────────────────────────────────────────────────────────
function MisconceptionBlock({ block }) {
  const [revealed, setRevealed] = useState(new Set())
  function reveal(i) { setRevealed(s => { const n = new Set(s); n.add(i); return n }) }
  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        ...TYPE.eyebrow,
        textTransform: 'uppercase', color: '#FF5D73', marginBottom: 10,
      }}>⚠️ {block.label || 'Common Mistakes — tap to reveal why'}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {block.mistakes.map((m, i) => (
          <div key={i} style={{
            background: '#10182B',
            border: `1px solid ${revealed.has(i) ? 'rgba(77,255,136,.25)' : 'rgba(255,93,115,.2)'}`,
            borderRadius: 14, padding: '14px 16px',
            transition: 'border-color .2s',
          }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: revealed.has(i) ? 10 : 0 }}>
              <span style={{ color: '#FF5D73', fontSize: '1rem', flexShrink: 0 }}>✗</span>
              <div style={{
                ...TYPE.body,
                fontSize: '.88rem', color: '#C8D0E8',
                textDecoration: revealed.has(i) ? 'line-through' : 'none',
                opacity: revealed.has(i) ? .5 : 1,
              }}>{m.wrong}</div>
            </div>
            {!revealed.has(i) ? (
              <button onClick={() => reveal(i)} style={{
                marginLeft: 22,
                background: 'rgba(255,93,115,.1)', border: '1px solid rgba(255,93,115,.25)',
                borderRadius: 8, padding: '5px 12px',
                ...TYPE.label,
                fontSize: '.75rem', color: '#FF5D73',
                cursor: 'pointer',
              }}>Why does this lose marks?</button>
            ) : (
              <div className="fade-up" style={{ marginLeft: 22 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                  <span style={{ color: '#4DFF88', flexShrink: 0 }}>✓</span>
                  <div style={{
                    ...TYPE.titleMedium,
                    fontSize: '.88rem', color: '#4DFF88',
                  }}>{m.right}</div>
                </div>
                <div style={{
                  ...TYPE.bodySmall,
                  fontSize: '.78rem', color: '#9CA8C7',
                }}>{m.reason}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── ScenarioBlock — decision game ────────────────────────────────────────────
function ScenarioBlock({ block }) {
  const [current, setCurrent] = useState(0)
  const [answered, setAnswered] = useState([])
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const scenarios = Array.isArray(block.scenarios) ? block.scenarios : [block]
  const scenario = scenarios[current]

  function choose(optIdx) {
    const correct = optIdx === scenario.correctIndex
    if (correct) setScore(s => s + 1)
    setAnswered([...answered, { correct, chosen: optIdx }])
    setTimeout(() => {
      if (current + 1 < scenarios.length) setCurrent(c => c + 1)
      else setDone(true)
    }, 1000)
  }

  if (done) return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'rgba(77,255,136,.07)', border: '1px solid rgba(77,255,136,.25)',
        borderRadius: 16, padding: SPACING.compact, textAlign: 'center',
      }}>
        <div style={{ ...TYPE.titleLarge, fontSize: '1.1rem', color: '#4DFF88', marginBottom: 6 }}>
          {score}/{scenarios.length} — {score === scenarios.length ? 'Perfect! 🎉' : 'Good effort!'}
        </div>
        <p style={{ ...TYPE.body, fontSize: '.85rem', color: '#9CA8C7', margin: 0 }}>
          {block.completionText || 'Scenarios complete.'}
        </p>
      </div>
    </div>
  )

  const lastAnswer = answered[answered.length - 1]
  const justAnswered = lastAnswer && answered.length === current

  return (
    <div style={{ margin: '14px 0' }}>
      <div style={{
        background: 'linear-gradient(145deg, #0A1520, #0D1A28)',
        border: '1px solid rgba(56,210,122,.2)',
        borderRadius: 18, padding: SPACING.compact,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ ...TYPE.eyebrow, textTransform: 'uppercase', color: '#38D27A' }}>
            🌱 {block.label || 'Glucose Decision'}
          </div>
          <div style={{ ...TYPE.metadata, color: '#4A5578' }}>
            {current + 1}/{scenarios.length}
          </div>
        </div>

        <div style={{
          background: '#10182B', border: '1px solid #2A3552',
          borderRadius: 12, padding: '14px', marginBottom: 12,
        }}>
          <p style={{ ...TYPE.titleMedium, fontSize: '.95rem', color: '#F5F7FB', margin: 0 }}>
            {scenario.situation}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {scenario.options.map((opt, i) => (
            <button key={i}
              onClick={() => !justAnswered && choose(i)}
              style={{
                background: justAnswered
                  ? i === scenario.correctIndex ? 'rgba(77,255,136,.12)' : answered[answered.length-1]?.chosen === i ? 'rgba(255,93,115,.1)' : '#10182B'
                  : '#10182B',
                border: `1.5px solid ${justAnswered
                  ? i === scenario.correctIndex ? 'rgba(77,255,136,.4)' : answered[answered.length-1]?.chosen === i ? 'rgba(255,93,115,.35)' : '#2A3552'
                  : '#2A3552'}`,
                borderRadius: 12, padding: '12px 10px',
                cursor: justAnswered ? 'default' : 'pointer',
                ...TYPE.titleMedium,
                fontSize: '.82rem',
                color: justAnswered
                  ? i === scenario.correctIndex ? '#4DFF88' : answered[answered.length-1]?.chosen === i ? '#FF5D73' : '#5A6480'
                  : '#C8D0E8',
                textAlign: 'center', transition: 'all .2s',
              }}>
              {opt}
            </button>
          ))}
        </div>

        {justAnswered && (
          <div className="fade-up" style={{
            marginTop: 10,
            ...TYPE.bodySmall,
            fontSize: '.8rem', color: '#9CA8C7',
          }}>
            {lastAnswer.correct ? `✓ Correct — ${scenario.explanation}` : `✗ ${scenario.explanation}`}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Single screen renderer ───────────────────────────────────────────────────

function UnsupportedBlock({ type, definition }) {
  if (!import.meta.env.DEV) return null
  return (
    <div role="alert" style={{
      margin: '14px 0', padding: 16, borderRadius: 12,
      border: '1px solid rgba(255,141,161,.45)',
      background: 'rgba(255,141,161,.08)', color: '#FFD6DE',
      ...TYPE.bodySmall, lineHeight: 1.55,
    }}>
      <strong>Unsupported block: {type || '<missing>'}</strong>
      <div style={{ marginTop: 6 }}>
        {definition
          ? `The registry points to ${definition.component}, but ScreenRenderer has no implementation.`
          : 'Register this block in src/data/screenRegistry.js before using it in chapter content.'}
      </div>
    </div>
  )
}

function LegacyUnroutedBlock({ type, definition }) {
  if (!import.meta.env.DEV) return null
  return (
    <div role="status" style={{
      margin: '14px 0', padding: 16, borderRadius: 12,
      border: '1px solid rgba(214,155,69,.38)',
      background: 'rgba(214,155,69,.08)', color: '#F0D6AD',
      ...TYPE.bodySmall, lineHeight: 1.55,
    }}>
      <strong>Legacy block: {type}</strong>
      <div style={{ marginTop: 6 }}>
        This extracted content was never routed by ChapterPlayer. New content must use
        {' '}<code>{definition.replacement}</code>.
      </div>
    </div>
  )
}

const BLOCK_RENDERERS = Object.freeze({
  read: ({ block, subject }) => <CardContainer variant="contained" subject={subject} padding={24}><ReadBlock block={block} /></CardContainer>,
  keypoint: ({ block, subject }) => <CardContainer variant="contained" subject={subject} padding={24}><KeypointBlock block={block} /></CardContainer>,
  funfact: ({ block, subject }) => <CardContainer variant="contained" subject={subject} padding={20}><FunFactBlock block={block} /></CardContainer>,
  examtip: ({ block, subject }) => <CardContainer variant="cinematicOverlay" subject={subject} padding={SPACING.compact}><ExamTipBlock block={block} subject={subject} /></CardContainer>,
  timeline: ({ block }) => <TimelineBlock block={block} />,
  reveal: ({ block }) => <RevealBlock block={block} />,
  quiz: ({ block, subject, index, handleQuizComplete }) => <AnswerInteraction block={{ ...block, explanation: undefined }} subject={subject} onComplete={() => handleQuizComplete(index)} />,
  flashcards: ({ block }) => <FlashcardsBlock block={block} />,
  misconception: ({ block }) => <MisconceptionBlock block={block} />,
  acronymMemorise: ({ block }) => <AcronymMemorise block={block} />,
  memoryHook: ({ block, subject }) => <MemoryHook block={block} subject={subject} />,
  builder: ({ block, subject, onScreenComplete }) => <BuilderBlock block={block} subject={subject} onComplete={onScreenComplete} />,
  scenario: ({ block }) => <ScenarioBlock block={block} />,
  boss: ({ block, subject, onScreenComplete }) => <ExamQuestionFrame block={block} subject={subject} mode="practice" onSkip={onScreenComplete} />,
  explainReveal: ({ block, subject, onScreenComplete }) => <ExplainReveal block={block} subject={subject} onComplete={onScreenComplete} />,
  mediaPlaceholder: ({ block, subject, index }) => <div style={{ marginTop: index > 0 ? 28 : 0 }}><MediaPlaceholder subject={subject} kind={block.kind} aspect={block.aspect} caption={block.caption} /></div>,
  fillblanks: ({ block, subject }) => <FillInTheBlanksBlock block={block} subject={subject} />,
  theoryCompare: ({ block, subject }) => <TheoryCompare block={block} subject={subject} />,
  oppositeQualitiesReveal: ({ block, subject }) => <OppositeQualitiesReveal block={block} subject={subject} />,
  graphView: ({ block, subject }) => <GraphView block={block} subject={subject} />,
  timelineChain: ({ block, subject }) => <TimelineChainBlock block={block} subject={subject} />,
  colsort: ({ block, subject }) => <ColSortBlock block={block} subject={subject} />,
  spotTheError: ({ block, subject, onScreenComplete }) => <SpotTheError block={block} subject={subject} onContinue={onScreenComplete} />,
  misconceptionCheck: ({ block, subject, onScreenComplete }) => <MisconceptionCheck block={block} subject={subject} onContinue={onScreenComplete} />,
  // ── Placeable figures ───────────────────────────────────────────────────
  // Six separate types, six separate routes, six separate downloads. They share
  // a prop vocabulary (preset / value / interactive / label) but not an
  // identity: an author places an angle diagram or a number line, never a
  // "figure" with a discriminator. The page owns the question and the marking
  // in every case.
  //
  // Each route mounts its lazy component inside its own DeferredFigure
  // boundary, so a figure still arriving suspends only its own block and a
  // figure that never arrives costs the learner that diagram and nothing else.
  angleFigure: ({ block, subject }) => (
    <DeferredFigure>
      <LazyAngleExplore
        preset={block.preset}
        value={block.value}
        defaultValue={block.defaultValue}
        interactive={block.interactive}
        label={block.label}
        showStatus={block.showStatus}
        subject={subject}
      />
    </DeferredFigure>
  ),
  areaPerimeterFigure: ({ block, subject }) => (
    <DeferredFigure>
      <LazyAreaPerimeterExplore
        preset={block.preset}
        focus={block.focus}
        value={block.value}
        defaultValue={block.defaultValue}
        interactive={block.interactive}
        label={block.label}
        showStatus={block.showStatus}
        subject={subject}
      />
    </DeferredFigure>
  ),
  coordinatePlaneFigure: ({ block, subject }) => (
    <DeferredFigure>
      <LazyCoordinatePlaneExplore
        preset={block.preset}
        focus={block.focus}
        comparisonRule={block.comparisonRule}
        value={block.value}
        defaultValue={block.defaultValue}
        interactive={block.interactive}
        showGuides={block.showGuides}
        difficultyCapabilities={block.difficultyCapabilities}
        xAxis={block.xAxis}
        yAxis={block.yAxis}
        grid={block.grid}
        label={block.label}
        showStatus={block.showStatus}
        subject={subject}
      />
    </DeferredFigure>
  ),
  numberLineFigure: ({ block, subject }) => (
    <DeferredFigure>
      <LazyNumberLineExplore
        preset={block.preset}
        value={block.value}
        defaultValue={block.defaultValue}
        options={block.options}
        interactive={block.interactive}
        label={block.label}
        showStatus={block.showStatus}
        subject={subject}
      />
    </DeferredFigure>
  ),
  circuitDiagram: ({ block }) => (
    <DeferredFigure>
      <LazyCircuitDiagram
        preset={block.preset}
        closed={block.closed}
        defaultClosed={block.defaultClosed}
        interactive={block.interactive}
        label={block.label}
        showStatus={block.showStatus}
      />
    </DeferredFigure>
  ),
  circuitSymbolReference: ({ block }) => (
    <DeferredFigure>
      <LazyCircuitSymbolReference title={block.title} description={block.description} />
    </DeferredFigure>
  ),
})

export const BLOCK_RENDERER_TYPES = Object.freeze(Object.keys(BLOCK_RENDERERS))

function renderBlock({ block, ...context }) {
  const type = block?.type
  const definition = getBlockDefinition(type)
  if (!definition) return <UnsupportedBlock type={type} definition={null} />
  if (definition.status === 'legacy') return <LegacyUnroutedBlock type={type} definition={definition} />
  const render = BLOCK_RENDERERS[type]
  if (!render) return <UnsupportedBlock type={type} definition={definition} />
  return render({ block, ...context })
}

export function ScreenContentRenderer({ screen, subject, onScreenComplete }) {
  const [_completedQuizzes, setCompletedQuizzes] = useState(new Set())

  function handleQuizComplete(blockIndex) {
    setCompletedQuizzes(prev => new Set([...prev, blockIndex]))
  }

  const headingEl = (screen.heading || screen.sub) ? (
    <div style={{ marginBottom: 20 }}>
      {screen.heading && <ScreenTitle>{screen.heading}</ScreenTitle>}
      {screen.sub && <ScreenBody style={{ color: 'rgba(255,255,255,0.65)' }}>{screen.sub}</ScreenBody>}
    </div>
  ) : null

  const blocksMap = (screen.blocks || []).map((block, index) => (
    <div key={index}>
      {renderBlock({
        block,
        index,
        subject,
        onScreenComplete,
        handleQuizComplete,
      })}
    </div>
  ))

  // Infographic screens are the canonical heading + intro + governed media slot
  // composition; the component owns that shape so content just supplies the data.
  if (screen.type === 'infographic') {
    return (
      <Infographic
        subject={subject}
        heading={screen.heading}
        intro={screen.intro}
        media={screen.media}
      />
    )
  }

  // Teach screens compose through TeachScreenShell so the header token and
  // vertical rhythm come from the design system, not the generic block shell.
  if (screen.shell === 'teach') {
    return (
      <TeachScreenShell heading={screen.heading} intro={screen.sub} subject={subject}>
        {blocksMap}
      </TeachScreenShell>
    )
  }

  return (
    <div>
      {headingEl}
      {blocksMap}
    </div>
  )
}



export const FULL_SCREEN_RENDERER_TYPES = Object.freeze([
  "quickRecall",
  "tieredquiz",
  "faceExaminer",
  "guidedExamResponse",
  "naturalSupernaturalSwipe",
  "orderedRouteTask",
  "matchingTask",
  "visualLearning",
  "keyFigureReveal",
  "guidedChoiceCarousel",
  "interactiveImage",
  "centreImageReveal",
  "timelineChain",
  "timelineCanvas",
  "cinematicCarousel",
  "oppositeQualitiesReveal",
  "examinerExplains",
  "priorKnowledgeRecall",
  "conceptReveal",
  "beforeAfterSlider",
  "cinematic",
  "factorWeb",
  "quoteAnalyser",
  "calculationBreakdown"
])

export function ChapterSchemaError({ chapter, errors, onBack }) {
  const showDetails = import.meta.env.DEV
  return (
    <div role="alert" style={{
      minHeight: '100dvh', background: GENERAL.backgroundApp, color: '#F5F7FB',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        <div style={{ ...TYPE.eyebrow, color: '#FF8DA1', marginBottom: 12 }}>Chapter schema error</div>
        <h1 style={{ ...TYPE.displaySection, margin: '0 0 12px' }}>This chapter cannot start safely.</h1>
        <p style={{ ...TYPE.body, color: 'rgba(245,247,251,.72)', lineHeight: 1.6 }}>
          {showDetails
            ? `${chapter?.title || chapter?.id || 'Unknown chapter'} contains screen data that is not registered or is missing required fields.`
            : 'This chapter needs a quick content update before it can continue. Please go back and choose another chapter.'}
        </p>
        {showDetails && (
          <pre style={{
            whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', padding: 14, borderRadius: 12,
            background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)',
            color: '#FFD6DE', ...TYPE.bodySmall, lineHeight: 1.5,
          }}>{errors.map(error => `${error.code}: ${error.message}`).join(String.fromCharCode(10))}</pre>
        )}
        {onBack && <button type="button" onClick={onBack} style={{ marginTop: 16, padding: '10px 16px', borderRadius: 10, cursor: 'pointer' }}>Go back</button>}
      </div>
    </div>
  )
}

function UnsupportedScreen({ screen, chapter, definition }) {
  const type = getScreenType(screen)
  return (
    <ChapterSchemaError
      chapter={chapter}
      errors={[{
        code: definition ? 'MISSING_SCREEN_RENDERER' : 'UNREGISTERED_SCREEN_TYPE',
        message: definition
          ? `Screen type "${type}" is registered to ${definition.component}, but ScreenRenderer has no route.`
          : `Screen type "${type}" is not registered in src/data/screenRegistry.js.`,
      }]}
    />
  )
}

export default function ScreenRenderer({
  screen: cur,
  chapter,
  chapterNum,
  subject = chapter?.subject,
  onScreenComplete,
  isLast,
  handleFinish,
  go,
  screenIndex: screen,
  setScreen,
  setAnimKey,
  scrollToTop,
  headerProps: H,
  subjectColor,
  headerOnBack,
  ihmExploreScreen,
  setIhmExploreScreen,
  selectedHealer,
  setSelectedHealer,
  cinematicHeaderVisible,
  setCinematicHeaderVisible,
}) {
  const definition = resolveScreenDefinition(cur)
  if (!definition) return <UnsupportedScreen screen={cur} chapter={chapter} definition={null} />
  if (definition.layout !== 'full') {
    return <ScreenContentRenderer screen={cur} subject={subject} onScreenComplete={onScreenComplete} />
  }
  const authoredType = getScreenType(cur)
  if (definition.status !== 'derived' && !FULL_SCREEN_RENDERER_TYPES.includes(authoredType)) {
    return <UnsupportedScreen screen={cur} chapter={chapter} definition={definition} />
  }
  // ── Full-screen QuickRecallScreen as in-content screen ────────────────────
  if (cur?.type === 'quickRecall') {
    return (
      <>
        <QuickRecallScreen
          subject={chapter.subject}
          chapterNum={chapterNum}
          chapterTitle={chapter.title}
          questions={cur.questions || []}
          onBack={headerOnBack}
          onContinue={isLast ? handleFinish : () => go(1)}
          renderHeader={() => (
            <LearningHeader {...H} visible={true} />
          )}
        />
      </>
    )
  }

  // ── Full-screen TieredQuizScreen as in-content screen ─────────────────────
  if (cur?.type === 'tieredquiz') {
    return (
      <>
        <TieredQuizScreen
          subject={chapter.subject}
          backgroundImage={cur.backgroundImage}
          tiers={cur.tiers || []}
          renderHeader={() => (
            <LearningHeader {...H} visible={true} />
          )}
          onContinue={isLast ? handleFinish : () => go(1)}
        />
      </>
    )
  }

  // ── FaceTheExaminer as a mid-chapter content screen ─────────────────────────
  if (cur?.type === 'faceExaminer') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <FaceTheExaminer
          chapter={chapter}
          examiner={cur.examiner}
          onExit={headerOnBack}
          onContinue={isLast ? handleFinish : () => go(1)}
        />
      </>
    )
  }

  // ── GuidedExamResponse as a mid-chapter content screen ───────────────────────
  if (cur?.type === 'guidedExamResponse') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <GuidedExamResponse
          chapter={chapter}
          exam={cur.exam}
          embedded
          onExit={headerOnBack}
          onContinue={isLast ? handleFinish : () => go(1)}
        />
      </>
    )
  }

  // ── SwipeSort — supernatural vs natural card sort ─────────────────────────
  if (cur?.type === 'naturalSupernaturalSwipe') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <SwipeSort
          block={cur}
          subject={chapter.subject}
          onComplete={() => { isLast ? handleFinish() : go(1) }}
        />
      </>
    )
  }

  // ── Evacuation chain route — order-and-match chain activity ─────────────
  if (cur?.type === 'orderedRouteTask') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <OrderedRouteTask
          screen={cur}
          subject={chapter.subject}
          onComplete={isLast ? handleFinish : () => go(1)}
        />
      </>
    )
  }

  // ── Matching task — term-to-description connection activity ─────────────
  if (cur?.type === 'matchingTask') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <MatchingTask
          screen={cur}
          subject={chapter.subject}
          onComplete={isLast ? handleFinish : () => go(1)}
        />
      </>
    )
  }

  // ── Visual learning — click-through cinematic scene sequence ─────────────
  if (cur?.type === 'visualLearning') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <VisualLearning
          block={cur}
          subject={chapter.subject}
          onComplete={() => { isLast ? handleFinish() : go(1) }}
        />
      </>
    )
  }

  // ── Key figure reveal — scrollable portrait + knowledge sections ─────────
  if (cur?.type === 'keyFigureReveal') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <KeyFigureReveal
          block={cur}
          subject={chapter.subject}
          onComplete={() => { isLast ? handleFinish() : go(1) }}
        />
      </>
    )
  }

  // ── Full-screen guided choice carousel ────────────────────────────────────
  if (cur?.type === 'guidedChoiceCarousel') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <GuidedChoiceCarousel
          subject={chapter.subject}
          headline={cur.headline}
          question={cur.question}
          helperText={cur.helperText}
          promptVisual={cur.promptVisual}
          options={cur.options || []}
          onBack={headerOnBack}
          onContinue={(nextScreenId, option) => {
            if (option) setSelectedHealer(option)
            // Try to navigate to a named screen; fall back to linear progression
            if (nextScreenId) {
              const targetIdx = chapter.screens.findIndex(
                s => s.id === nextScreenId || s.label === nextScreenId
              )
              if (targetIdx >= 0 && targetIdx !== screen) {
                setScreen(targetIdx)
                setAnimKey(k => k + 1)
                scrollToTop()
                return
              }
            }
            isLast ? handleFinish() : go(1)
          }}
        />
      </>
    )
  }

  // ── Full-screen interactive image — intro hides header, explore shows it ────
  if (cur?.type === 'interactiveImage') {
    const ihmExplore = ihmExploreScreen === screen
    return (
      <>
        <LearningHeader {...H} visible={ihmExplore} />
        <InteractiveHotspotImage
          key={screen}
          subject={chapter.subject}
          title={cur.title}
          introText={cur.introText}
          image={cur.image}
          imageAlt={cur.imageAlt || cur.title}
          hotspots={cur.hotspots || []}
          ctaLabel={cur.ctaLabel}
          variant={cur.variant}
          synthesis={cur.synthesis || null}
          onBack={headerOnBack}
          onEnterExplore={() => setIhmExploreScreen(screen)}
          onContinue={isLast ? handleFinish : () => go(1)}
        />
      </>
    )
  }

  // ── Medical theory prescription — cause → prescription → reveal ──────────────
  if (cur?.type === 'centreImageReveal') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <CentreImageReveal
          screen={cur}
          selectedHealer={selectedHealer}
          onComplete={isLast ? handleFinish : () => go(1)}
        />
      </>
    )
  }

  if (cur?.type === 'timelineChain') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <TimelineChain
          block={cur}
          subject={chapter.subject}
          onContinue={() => isLast ? handleFinish() : go(1)}
        />
      </>
    )
  }

  if (cur?.type === 'timelineCanvas') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <TimelineCanvas
          block={cur}
          subject={chapter.subject}
          onContinue={() => isLast ? handleFinish() : go(1)}
        />
      </>
    )
  }

  if (cur?.type === 'cinematicCarousel') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <CinematicCarousel
          block={cur}
          subject={chapter.subject}
          onContinue={() => isLast ? handleFinish() : go(1)}
        />
      </>
    )
  }

  if (cur?.type === 'oppositeQualitiesReveal') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <TeachScreenShell heading={cur.title} intro={cur.copy} subject={chapter.subject}>
          <OppositeQualitiesReveal block={cur} subject={chapter.subject} />
        </TeachScreenShell>
      </>
    )
  }

  // ── Examiner explains — inline screen using the chapter-level or screen-level data ──
  if (cur?.type === 'examinerExplains') {
    const explainData = cur.examinerExplains || chapter.examinerExplains
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <WhatExaminersLookFor
          subject={chapter.subject}
          examinerExplains={explainData}
          label={cur.label}
          showBack={false}
          onBack={headerOnBack}
          onContinue={isLast ? handleFinish : () => go(1)}
        />
      </>
    )
  }

  // ── Prior knowledge recall — AI-analysed free-text recall at chapter start ──
  if (cur?.type === 'priorKnowledgeRecall') {
    return (
      <>
        <PriorKnowledgeRecall
          block={cur}
          subject={chapter.subject}
          onBack={headerOnBack}
          onContinue={isLast ? handleFinish : () => go(1)}
        />
      </>
    )
  }

  // ── Full-screen concept reveal — tap-through atmospheric sequence ──────────
  if (cur?.type === 'conceptReveal') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <ConceptReveal
          subject={chapter.subject}
          steps={cur.steps || []}
          onRevealStart={() => setCinematicHeaderVisible(true)}
          onContinue={() => isLast ? handleFinish() : go(1)}
        />
      </>
    )
  }

  // ── Before/After image slider — full-screen interactive comparison ──
  if (cur?.type === 'beforeAfterSlider') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <BeforeAfterImageSlider
          beforeSrc={cur.beforeSrc}
          afterSrc={cur.afterSrc}
          beforeAlt={cur.beforeAlt || ''}
          afterAlt={cur.afterAlt || ''}
          beforeLabel={cur.beforeLabel}
          afterLabel={cur.afterLabel}
          heading={cur.heading}
          revealText={cur.revealText}
          accent={subjectColor}
          initial={cur.initial ?? 50}
          onComplete={isLast ? handleFinish : () => go(1)}
        />
      </>
    )
  }

  // ── Full-screen cinematic screen — takes over for type:'cinematic' screens ──
  if (cur?.type === 'cinematic') {
    return (
      <>
        <LearningHeader {...H} visible={cinematicHeaderVisible} />
        <CinematicRevealMoment
          subject={chapter.subject}
          videoSrc={cur.videoSrc}
          fallbackImage={cur.fallbackImage}
          year={cur.year}
          label={cur.label}
          headline={cur.headline}
          body={cur.body}
          paragraphs={cur.paragraphs}
          onContinue={() => isLast ? handleFinish() : go(1)}
          onTextRevealStart={() => setCinematicHeaderVisible(true)}
        />
      </>
    )
  }

  if (cur?.type === 'factorWeb') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <FactorWeb
          block={cur}
          subject={chapter.subject}
          onContinue={() => isLast ? handleFinish() : go(1)}
        />
      </>
    )
  }

  // ── Quote analyser — full-screen quote dissection with 5 analysis items ──────
  if (cur?.type === 'quoteAnalyser') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <QuoteAnalyser
          block={cur}
          subject={chapter.subject}
          onContinue={() => isLast ? handleFinish() : go(1)}
        />
      </>
    )
  }

  // ── Calculation breakdown — full-screen staged method walkthrough ──────────
  // One route for all five presentations: the presentation is chosen inside
  // the block by `presentation.variant`, and the component owns its own title,
  // stage sequence and continuation.
  if (cur?.type === 'calculationBreakdown') {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <CalculationBreakdown
          block={cur}
          subject={chapter.subject}
          onContinue={isLast ? handleFinish : () => go(1)}
        />
      </>
    )
  }

  // ── MisconceptionCheck block — full-screen; must bypass ContentShell's
  // overflowY:auto container which breaks position:fixed on mobile browsers ──
  const mcBlock = (cur?.blocks || []).find(b => b.type === 'misconceptionCheck')
  if (mcBlock) {
    return (
      <>
        <LearningHeader {...H} visible={true} />
        <MisconceptionCheck
          block={mcBlock}
          subject={chapter.subject}
          onContinue={isLast ? handleFinish : () => go(1)}
        />
      </>
    )
  }


  return <UnsupportedScreen screen={cur} chapter={chapter} definition={definition} />
}
