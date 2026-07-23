# WhatExaminersLookFor

## Purpose

`WhatExaminersLookFor` is a short pre-question briefing. It tells the learner what success looks like before they begin independent exam practice.

It should answer one question:

> What should I deliberately include when I write this answer?

## Correct placement

Use immediately before an independent exam-style response when the learner needs a concise success-criteria reminder.

Do not place it after the learner has submitted an answer. Do not use it as a results screen.

## Content limits

- One short introduction.
- One to three examiner priorities.
- One memorable takeaway.
- Sentence case throughout.
- Wording must come from content data rather than the component.

## Separation from FaceTheExaminer

`WhatExaminersLookFor` teaches the criteria before writing.

`FaceTheExaminer` applies criteria to an answer after writing or asks the learner to judge a sample answer.

`WhatExaminersLookFor` must not contain:

- marks, levels or score prediction;
- student-versus-examiner scoring;
- a full annotated answer;
- an examiner verdict on completed work;
- feedback on a learner submission.

Do not place both components back-to-back unless the first clearly briefs a new independent response and the second occurs only after that response has been completed.

## Preferred data shape

```js
{
  introduction: "Here’s what the examiner is looking for.",
  context: 'Optional question-specific framing.',
  priorities: [
    {
      id: 'clear-point',
      title: 'Make a clear point',
      explanation: 'State the idea directly before adding evidence.',
    },
  ],
  takeaway: 'One short rule the learner can carry into the answer.',
}
```

The legacy `examinerExplains` shape (`opening`, `tips`, `closing`) remains supported temporarily while existing content is migrated.

## Component API

```js
<WhatExaminersLookFor
  subject={subject}
  whatExaminersLookFor={data}
  showBack
  onBack={onBack}
  onContinue={onContinue}
/>
```

The component must remain subject-aware and must not contain History-specific assumptions. Subject tokens control colour and atmosphere. `ContinueCTA` owns the final progression action.
