# QuoteAnalyser contract

## Purpose

`QuoteAnalyser` is a guided English close-reading journey. It helps a learner move from understanding the moment around a quotation to forming an interpretation, analysing precise word choices and applying the quotation in exam writing.

## Opening sequence

The first page is a **scene-setting introduction**. Its job is to give only the minimum narrative context needed to understand why the quotation is being spoken.

It should:

- orient the learner with the act/scene when useful;
- explain the immediate event or change that triggers the quotation;
- end with a short transition into the speaker’s words;
- avoid interpreting the quotation or revealing the analysis in advance;
- use the standard `ContinueCTA` directly beneath the final line of context.

Do not add a generic heading such as “The moment before”. The content itself should make the page’s introductory purpose clear.

## Interpretation screen

The interpretation screen uses an **open editorial layout**, not a surrounding card or form panel.

It should:

- retain the quote and the governed `CinematicDivider` above the task;
- use `interpretationPrompt` as the main `TYPE.displaySection` heading;
- place the support sentence directly beneath the heading;
- keep the textarea as the main bordered interaction surface;
- place sentence starters inside a collapsed disclosure headed by `interpretationStarterHeading`;
- reveal all supplied starters as quiet rows separated by governed line tokens;
- insert the selected starter into the textarea, close the disclosure and return focus to the answer;
- expose the disclosure state with `aria-expanded` and connect it to its region with `aria-controls`;
- avoid a redundant label such as “Your interpretation” above the main question;
- preserve the same open layout for retry and AI-feedback states.

Do not add a background, border, shadow, blur or rounded container around the entire interpretation section. Visual hierarchy must come from typography, spacing and the meaningful interaction surfaces.

## Interpretation feedback

The feedback screen is a **brief bridge** into key-word analysis, not a second teaching screen.

It should:

- credit no more than one idea the learner genuinely expressed;
- add no more than one useful missing layer;
- use no more than two short pieces of evidence for either idea;
- avoid explaining the evidence in detail, because the next stage teaches the words;
- keep the governed `ContinueCTA` visible immediately after the feedback;
- move directly into the key-word analysis stage.

The feedback should be short enough to scan without scrolling on a typical mobile screen. Detailed connotations, methods and effects belong in the word-analysis stage.

## Data contract

```js
{
  type: 'quoteAnalyser',
  workTitle?,
  speaker?,
  sceneLabel?,
  quote,
  location,
  backgroundImage?,
  context: {
    beats: string[],          // one to three concise scene-setting statements
    transition?: string,     // bridge into the quotation without analysing it
    continueLabel?: string,  // optional override; standard button defaults to Continue
    showWorkTitle?: boolean, // default false
    showScene?: boolean,     // default true
    label?: string,          // optional exceptional label; normally omit
  },
  interpretationPrompt?,
  interpretationInstruction?,
  interpretationPlaceholder?,
  interpretationStarterHeading?,
  interpretationStarters?: string[],
  interpretationSupport?: object,
  analysisIdeas?: object[],
  wordAnalysis?: object,
  meaningSections?: object[],
  essayExample?,
}
```

## Content rules

- Keep context beats short enough to scan on mobile.
- Supply all text through the block; do not add play-, poem- or character-specific copy inside the component.
- The context page establishes events, not meaning. Interpretation begins only after the quotation reveal.
- `interpretationPrompt` is the only task heading on the initial interpretation screen.
- Keep `interpretationStarterHeading` short enough to work as a single accordion row.
- Sentence starters should use the supplied speaker where appropriate and remain editable by the learner.
- Word analysis, meaning sections and essay examples belong in content data rather than component constants.
