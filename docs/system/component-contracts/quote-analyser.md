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
  interpretationStarters?: string[],
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
- Sentence starters should use the supplied speaker where appropriate and remain editable by the learner.
- Word analysis, meaning sections and essay examples belong in content data rather than component constants.
