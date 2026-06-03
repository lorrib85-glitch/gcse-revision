# Unified Weakness Tracker — Integration Plan

## Overview

The new `unifiedWeaknessTracker.js` is a comprehensive system that logs every wrong answer across modules, exams, and quizzes, then surfaces weakness data for personalization.

**Core insight:** Every question answered wrong = learning opportunity flagged. Patterns emerge from aggregating wrong answers across the entire site.

---

## Integration Points

### 1. Module Question Answering (src/components/layout/ModulePlayer.jsx)

**What to integrate:**
- Every quiz/MCQ block in a module that gets answered wrong
- Boss blocks (free-text questions) that are graded wrong
- Any other graded activity blocks (Builder, Scenario, etc.)

**Hook location:** In question blocks when the student gets it wrong:

```javascript
import { logWrongAnswer, logCorrectAnswer } from '../../unifiedWeaknessTracker.js'

// When answer is submitted and graded:
if (correct) {
  logCorrectAnswer({
    subject: module.subject,
    topic: screen.label,
    questionId: `${module.id}-${screen.label}`,
    questionText: block.question,
    source: 'module',
    questionType: 'mcq'
  })
  recordScore({ subject: module.subject, earned: 1, possible: 1, source: 'module' })
} else {
  logWrongAnswer({
    subject: module.subject,
    topic: screen.label,
    questionId: `${module.id}-${screen.label}`,
    questionText: block.question,
    marks: 1,
    source: 'module',
    questionType: 'mcq'
  })
}
```

---

### 2. Exam Mode (src/components/feedback/ExamQuestionFrame.jsx)

**What to integrate:**
- Every exam question that gets graded (via `/api/grade` endpoint)
- Track marks awarded vs. marks available

**Hook location:** In `handleCheck()` after grading response arrives:

```javascript
import { logWrongAnswer, logCorrectAnswer } from '../../unifiedWeaknessTracker.js'

// After getting grade response:
const marksAwarded = data.marksAwarded || 0
const marksAvailable = marks || 4

if (marksAwarded === marksAvailable) {
  logCorrectAnswer({
    subject,
    topic: block.topic || 'General',
    questionId: block.id || `exam-${Date.now()}`,
    questionText,
    source: 'exam',
    questionType: 'written'
  })
} else if (marksAwarded < marksAvailable) {
  logWrongAnswer({
    subject,
    topic: block.topic || 'General',
    questionId: block.id || `exam-${Date.now()}`,
    questionText,
    marks: marksAvailable,
    source: 'exam',
    questionType: 'written'
  })
}

recordScore({ subject, earned: marksAwarded, possible: marksAvailable, source: 'exam' })
```

---

### 3. Quick Quiz Mode (if exists)

**What to integrate:**
- Every quiz question answered
- Use weakness data to prioritize weak topics in quiz

**Hook location:** In question submission handling:

```javascript
import { logWrongAnswer, logCorrectAnswer } from './unifiedWeaknessTracker.js'
import { getRecoveryRecommendations } from './unifiedWeaknessTracker.js'

// When answer is selected:
if (correct) {
  logCorrectAnswer({
    subject: q.subject,
    topic: q.topic,
    questionId: q.id,
    source: 'quiz',
    questionType: q.type
  })
} else {
  logWrongAnswer({
    subject: q.subject,
    topic: q.topic,
    questionId: q.id,
    marks: q.marks,
    source: 'quiz',
    questionType: q.type
  })
}

// Prioritize weak topics (replace current topicScores logic):
const recommendations = getRecoveryRecommendations(5)
const priorityTopics = new Set(recommendations.map(r => `${r.subject}/${r.topic}`))
```

---

### 4. Home Screen Weak Zone Display (src/App.jsx)

**What to integrate:**
- Replace `weakestSubject` logic with `getWeakestSubject()` from unified tracker
- Show weak topics in the "Weak Zone" card

**Before:**
```javascript
const weakestSubject = (() => { /* old logic based on score aggregates */ })()
```

**After:**
```javascript
import { getWeakestSubject, getWeakTopics } from './unifiedWeaknessTracker.js'

const weakestData = getWeakestSubject()
const weakTopics = getWeakTopics().slice(0, 3)
```

---

### 5. Recovery Quiz Recommendations

**New feature:** Use `getRecoveryRecommendations()` to suggest what to study next

```javascript
import { getRecoveryRecommendations } from './unifiedWeaknessTracker.js'

const recovery = getRecoveryRecommendations(3)
// Returns: [{ subject, topic, wrongCount, priority, lastFailedDaysAgo }, ...]
```

---

## Implementation Sequence

1. **Add weakness logging to core graded blocks** — QuizBlock, BossBlock, etc.
2. **Add weakness logging to ExamQuestionFrame** — exam mode grading
3. **Update QuickQuiz question flow** — hook up logging and use weak-topic prioritization
4. **Update Home screen** — show weak zones from unified tracker
5. **Add recovery quiz feature** — surface `getRecoveryRecommendations()` in UI
6. **Delete old weaknessTracker.js** — superseded by unified system

---

## Data Flow

```
Student answers question wrong
         ↓
logWrongAnswer({ subject, topic, questionId, ... })
         ↓
Stored in localStorage as gcse_wrong_answers
         ↓
getWeakTopics() aggregates and ranks
         ↓
Home screen, Recovery Quiz, Exam recommendations use the data
         ↓
Personalization: "Study these topics first"
```

---

## API Summary

**Core logging:**
- `logWrongAnswer(metadata)` — log an incorrect answer
- `logCorrectAnswer(metadata)` — log a correct answer

**Queries:**
- `getWeakTopics(threshold)` — all weak topics
- `getWeakAreasBySubject()` — weak topics grouped by subject
- `getTopicStatistics(subject, topic)` — detailed stats for one topic
- `getRecoveryRecommendations(limit)` — sorted list for study priority
- `getWeakestSubject()` — the subject with most wrong answers
- `isWeakArea(subject, topic)` — boolean check
- `getWeaknessSummary()` — overview stats

---

## Notes

- **Metadata is flexible:** Pass whatever is available. At minimum: subject, topic
- **Question IDs:** Auto-generated if not provided (timestamp-based)
- **Mastery detection:** Topics with <20% error rate + 3+ attempts are excluded from "weak" list
- **Storage:** Keeps last 500 wrong + 500 correct answers (balanced for localStorage limits)
- **Backward compatibility:** Old `weaknessTracker.js` API is maintained as legacy functions

---

## Status

✅ **Core tracker system created:** unifiedWeaknessTracker.js  
✅ **Exam mode integration:** ExamQuestionFrame logging added  
✅ **Module imports:** ModulePlayer and App.jsx prepared  
⏳ **Home screen display:** Ready for implementation  
⏳ **Module-level logging:** Need to integrate in individual block components  
⏳ **Recovery quiz UI:** Future enhancement  

