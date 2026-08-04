// ─── System reference ────────────────────────────────────────────────────────
//
// The owner surface for everything that is real, previewable and governed but
// is NOT a chapter-building choice — reached at ?systemReference=true.
//
// This is not the Component Lab, and it is deliberately a sibling rather than a
// section of it. The Lab answers one question: "what can I author into a
// chapter?" Every row there is a screen or block type an author writes. The
// four screens below are placed by the runtime from chapter metadata or app
// state, and the buttons page is a design-system reference rather than a
// component at all. Showing them in the Lab as disabled or catalogue-only rows
// would keep answering a question the Lab is not asking, so they moved here
// instead — with their live previews intact. Nothing was deleted.
//
// OWNER TOOL, SHIPPED IN EVERY BUILD, like the Lab: src/App.jsx lazy-imports it
// behind its own query flag, so it is its own chunk that learners never
// download. It writes no learner data — it shares the Lab's isolated storage
// scope for the same reason the Lab has one.
//
// It reuses the shared owner-surface shell (src/dev/labShell.jsx) rather than
// reimplementing it, so a screen reviewed here is framed exactly as it is in
// the Lab: a genuine 390px viewport, actual-size or fit-screen. Sharing the
// shell is not sharing the population — it reaches into nothing the Lab owns.

import { useEffect, useState } from 'react'
import { getActiveScope, setActiveScope } from '../../lib/storage.js'
import { GENERAL } from '../../constants/generalTheme.js'
import { SUBJECT_ACCENTS } from '../../constants/subjects.js'
import { PreviewModeTabs, PreviewSurface } from '../labShell.jsx'
import { ctrlBtn, exitToApp, mono } from '../labShellTokens.js'
import * as FIX from '../componentReview/fixtures.js'
import ButtonsAndProgressPage from './ButtonsAndProgressPage.jsx'
import ChapterHookScreen from '../../components/layout/ChapterHookScreen.jsx'
import ChapterOutcomeScreen from '../../components/layout/ChapterOutcomeScreen.jsx'
import ChapterCompleteScreen from '../../components/layout/ChapterCompleteScreen.jsx'
import WeakSpotRecovery from '../../components/learning/WeakSpotRecovery.jsx'

const DEV_REVIEW_SCOPE = 'devreview'

const noop = () => {}

// Each entry says *why* it is here rather than in the Lab. "Not authorable" is
// the whole reason this surface exists, so it is the first thing each row says.
const REFERENCE_ITEMS = [
  {
    id: 'buttons-and-progress',
    name: 'Buttons and progress',
    section: 'Design system',
    placedBy: 'Not a component — a reference page for the governed button, divider and progress patterns.',
    renderMode: 'inline',
    render: () => <ButtonsAndProgressPage />,
  },
  {
    id: 'chapter-hook-screen',
    name: 'ChapterHookScreen',
    section: 'Runtime-placed screens',
    placedBy: 'ChapterPlayer places it from the chapter’s hook metadata. It never appears in a screens array.',
    renderMode: 'fullbleed',
    render: () => {
      const fx = FIX.chapterHook
      return (
        <ChapterHookScreen
          subject="History" chapterNum={fx.chapterNum} chapterTitle={fx.chapterTitle}
          statement={fx.statement} isTrue={fx.isTrue} accentWords={fx.accentWords}
          explanation={fx.explanation} onBack={noop} onContinue={noop}
        />
      )
    },
  },
  {
    id: 'chapter-outcome-screen',
    name: 'ChapterOutcomeScreen',
    section: 'Runtime-placed screens',
    placedBy: 'ChapterPlayer places it from the chapter’s outcomes metadata. It never appears in a screens array.',
    renderMode: 'fullbleed',
    render: () => {
      const fx = FIX.chapterOutcome
      return (
        <ChapterOutcomeScreen
          subject="Biology" chapterNum={2} chapterTitle={fx.chapterTitle}
          outcomes={fx.outcomes} onBack={noop} onContinue={noop}
        />
      )
    },
  },
  {
    id: 'chapter-complete-screen',
    name: 'ChapterCompleteScreen',
    section: 'Runtime-placed screens',
    placedBy: 'LegacyApp renders it as the chapter-complete overlay at the end of every chapter. It is never authored.',
    renderMode: 'fullbleed',
    render: () => {
      const fx = FIX.chapterComplete
      return (
        <ChapterCompleteScreen
          accent={SUBJECT_ACCENTS.History}
          completedChapter={fx.completedChapter}
          supportingCopy={fx.supportingCopy}
          nextChapterNum={fx.nextChapterNum}
          nextChapterTitle={fx.nextChapterTitle}
          nextChapterLabel={fx.nextChapterLabel}
          onContinue={noop} onQuiz={noop} onHome={noop}
          tab="subjects" setTab={noop}
        />
      )
    },
  },
  {
    id: 'weak-spot-recovery',
    name: 'WeakSpotRecovery',
    section: 'Runtime-placed screens',
    placedBy: 'Dormant. Designed to appear when the tracker detects a struggling learner; its ChapterPlayer integration was never reachable and was removed. The component and its contract are retained, not retired.',
    renderMode: 'fullbleed',
    render: () => (
      <WeakSpotRecovery
        block={FIX.weakSpotRecovery} subject="History" progress={{ current: 3, total: 8 }}
        onBack={noop} onFixWeakSpot={noop} onSkip={noop}
      />
    ),
  },
]

export const SYSTEM_REFERENCE_ITEM_IDS = Object.freeze(REFERENCE_ITEMS.map(item => item.id))

export default function SystemReference() {
  useEffect(() => {
    const prev = getActiveScope()
    setActiveScope(DEV_REVIEW_SCOPE)
    return () => setActiveScope(prev)
  }, [])

  const [activeId, setActiveId] = useState(null)
  const [previewMode, setPreviewMode] = useState('actual')
  const [renderError, setRenderError] = useState(null)
  const active = REFERENCE_ITEMS.find(item => item.id === activeId) ?? null

  const sections = [...new Set(REFERENCE_ITEMS.map(item => item.section))]

  return (
    <div style={{ minHeight: '100vh', background: GENERAL.backgroundApp, color: GENERAL.softWhite }}>
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '20px 16px 64px' }}>
        <header style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ ...mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: GENERAL.coral }}>
              Owner tool
            </div>
            <button onClick={exitToApp} style={{ ...ctrlBtn, flexShrink: 0 }}>Exit to app ✕</button>
          </div>
          <h1 style={{ ...mono, fontSize: 22, fontWeight: 700, margin: '4px 0 6px' }}>System reference</h1>
          <p style={{ ...mono, fontSize: 13, lineHeight: 1.5, color: GENERAL.slate, margin: 0 }}>
            Runtime screens and design-system patterns, previewed live at ~390px. None of
            these is a chapter authoring choice — the runtime places them, or they are
            reference material. For the things you can author, open the Component lab.
          </p>
        </header>

        {active ? (
          <div>
            <button onClick={() => { setActiveId(null); setRenderError(null) }} style={{ ...ctrlBtn, marginBottom: 12 }}>
              ‹ All references
            </button>
            <div style={{
              background: GENERAL.backgroundSurface, border: `1px solid ${GENERAL.line.soft}`,
              borderLeft: `3px solid ${GENERAL.coral}`, borderRadius: 12, padding: '14px 15px',
            }}>
              <div style={{ ...mono, fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{active.name}</div>
              <div style={{ ...mono, fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GENERAL.slate, marginBottom: 3 }}>
                Why it is not an authoring choice
              </div>
              <div style={{ ...mono, fontSize: 13, lineHeight: 1.5 }}>{active.placedBy}</div>
            </div>
            {active.renderMode === 'fullbleed' && (
              <div style={{ marginTop: 12 }}>
                <PreviewModeTabs previewMode={previewMode} onPreviewMode={setPreviewMode} accent={GENERAL.coral} />
              </div>
            )}
            {renderError && (
              <p style={{ ...mono, fontSize: 12, color: GENERAL.error, margin: '10px 0 0' }}>{renderError}</p>
            )}
          </div>
        ) : (
          sections.map(section => (
            <section key={section} style={{ marginBottom: 24 }}>
              <div style={{ ...mono, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: GENERAL.slate, marginBottom: 10 }}>
                {section}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {REFERENCE_ITEMS.filter(item => item.section === section).map(item => (
                  <button key={item.id} onClick={() => setActiveId(item.id)} style={{
                    ...mono, textAlign: 'left', cursor: 'pointer',
                    background: GENERAL.backgroundSurface, border: `1px solid ${GENERAL.line.soft}`,
                    borderRadius: 12, padding: '13px 14px', color: GENERAL.softWhite,
                    borderLeft: `3px solid ${GENERAL.coral}`,
                  }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 5 }}>{item.name}</div>
                    <div style={{ fontSize: 12.5, lineHeight: 1.45, color: GENERAL.slate }}>{item.placedBy}</div>
                  </button>
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {active && (
        <div style={{ maxWidth: 420, margin: '0 auto' }}>
          <PreviewSurface
            key={active.id}
            fullbleed={active.renderMode === 'fullbleed'}
            previewMode={previewMode}
            accent={GENERAL.coral}
            resetKey={active.id}
            onError={setRenderError}
          >
            {active.render()}
          </PreviewSurface>
        </div>
      )}
    </div>
  )
}
