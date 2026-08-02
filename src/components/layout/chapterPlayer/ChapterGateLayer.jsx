import ChapterHookScreen from '../ChapterHookScreen.jsx'
import ChapterOutcomeScreen from '../ChapterOutcomeScreen.jsx'
import QuickRecallScreen from '../../learning/QuickRecallScreen.jsx'
import LearningHeader from '../../core/LearningHeader.jsx'

// ChapterPlayer private family — NOT an authorable chapter component.
//
// Renders exactly one of the three universal opener gates a chapter can show
// before its content: hook → outcomes → recall. It is a mapping layer only:
//
//   - the *decision* of which gate to show belongs to getChapterGate()
//     (src/app/chapterNavigation.js), called by ChapterPlayer;
//   - all lifecycle state (hookDone / wylDone / recallDone / navTo), persistence
//     and scroll side effects stay in ChapterPlayer and reach this component as
//     already-bound callbacks.
//
// This component therefore holds no state, reads no storage, and never inspects
// the chapter to decide what to render. It is intentionally absent from
// screenRegistry.js, componentFunctions.js and the Component Lab: authors never
// place a gate, the runtime does.
export default function ChapterGateLayer({
  gateType,
  chapter,
  chapterNum,
  headerProps,
  onExit,
  onHookContinue,
  onOutcomeBack,
  onOutcomeContinue,
  onRecallBack,
  onRecallContinue,
}) {
  if (gateType === 'hook') {
    return (
      <ChapterHookScreen
        subject={chapter.subject}
        chapterNum={chapterNum}
        chapterTitle={chapter.title}
        statement={chapter.hook.statement}
        isTrue={chapter.hook.isTrue}
        accentWords={chapter.hook.accentWords || []}
        explanation={chapter.hook.explanation || chapter.hook.correctFeedback || ''}
        revealBeats={chapter.hook.revealBeats}
        backgroundImage={chapter.hook.backgroundImage || ''}
        onBack={onExit}
        onContinue={onHookContinue}
      />
    )
  }

  if (gateType === 'outcomes') {
    return (
      <ChapterOutcomeScreen
        subject={chapter.subject}
        chapterNum={chapterNum}
        chapterTitle={chapter.title}
        outcomes={chapter.outcomes.bullets || chapter.outcomes}
        onBack={onOutcomeBack}
        onContinue={onOutcomeContinue}
      />
    )
  }

  if (gateType === 'recall') {
    return (
      <QuickRecallScreen
        subject={chapter.subject}
        chapterNum={chapterNum}
        chapterTitle={chapter.title}
        questions={chapter.recall.questions}
        onBack={onRecallBack}
        onContinue={onRecallContinue}
        renderHeader={() => (
          <LearningHeader {...headerProps} currentStage="Discover" visible={true} />
        )}
      />
    )
  }

  return null
}
