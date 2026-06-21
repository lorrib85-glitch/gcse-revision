# GCSE Revision App Typography Guidelines

## Manrope + Sora System

### 1. Typography principle

The app uses a two-font system:

- **Manrope** creates brand identity, confidence and cinematic hierarchy.
- **Sora** keeps learning content, UI and interactions clear, compact and readable.

Typography must support the product goal:

> Cinematic clarity: atmospheric and premium, but always easy to read on mobile.

Do not introduce additional font families unless the brand system is formally revised.

---

## 2. Font roles

### Manrope — headings and brand moments

Use **Manrope** for text that needs visual authority, structure or cinematic impact.

Use Manrope for:

- splash / hero headings
- module titles
- screen titles
- section headings
- card titles
- major result headings
- chapter completion headings
- cinematic reveal headlines
- large “moment” statements

Do **not** use Manrope for:

- long paragraphs
- explanations
- answer feedback
- small labels
- button text
- navigation
- metadata
- question helper text

Manrope should make the screen feel premium, not noisy.

### Sora — body, UI and learning clarity

Use **Sora** for functional reading, learning and interaction text.

Use Sora for:

- body copy
- learning explanations
- question text
- answer choices
- feedback text
- hints
- labels
- metadata / kickers
- buttons
- navigation
- progress labels
- tags
- captions
- helper text
- small UI text

Sora should be slightly smaller and tighter than default, because it has a large x-height and can look wide if untreated.

---

## 3. Core type scale

### Screen heading

Use for main page or module-level titles.

```js
screenHeading: {
  fontFamily: "'Manrope', sans-serif",
  fontSize: "clamp(30px, 8vw, 42px)",
  lineHeight: 1.02,
  fontWeight: 800,
  letterSpacing: "-0.045em"
}
```

Use for:

- home hero headline
- module page title
- subject landing title
- completion screen title

Do not use for normal card titles or paragraph-style content.

### Section heading

Use for major screen sections.

```js
sectionHeading: {
  fontFamily: "'Manrope', sans-serif",
  fontSize: "clamp(22px, 6vw, 30px)",
  lineHeight: 1.08,
  fontWeight: 750,
  letterSpacing: "-0.035em"
}
```

Use for:

- screen titles inside modules
- “What do you already know?”
- “Your topics”
- “Exam move”
- major content section titles

### Card title

Use for titles inside cards, modules, options or feature blocks.

```js
cardTitle: {
  fontFamily: "'Manrope', sans-serif",
  fontSize: "1.12rem",
  lineHeight: 1.18,
  fontWeight: 700,
  letterSpacing: "-0.02em"
}
```

Use for:

- module card titles
- topic card titles
- key figure names
- result card titles
- small feature card headings

### Body text

Use for main learning content.

```js
bodyText: {
  fontFamily: "'Sora', sans-serif",
  fontSize: "0.95rem",
  lineHeight: 1.5,
  fontWeight: 400,
  letterSpacing: "-0.005em"
}
```

Use for:

- explanations
- lesson paragraphs
- feedback
- question support text
- module descriptions

Keep body paragraphs short. For mobile GCSE learning, prefer 1–3 short paragraphs over one long block.

### Body small

Use for supporting text.

```js
bodySmall: {
  fontFamily: "'Sora', sans-serif",
  fontSize: "0.84rem",
  lineHeight: 1.45,
  fontWeight: 400,
  letterSpacing: "-0.005em"
}
```

Use for:

- secondary explanations
- card descriptions
- helper text
- supporting context
- small feedback text

### Metadata / kicker

Use for labels, topic markers and small uppercase text.

```js
metadataText: {
  fontFamily: "'Sora', sans-serif",
  fontSize: "0.72rem",
  lineHeight: 1.2,
  fontWeight: 650,
  letterSpacing: "0.10em",
  textTransform: "uppercase"
}
```

Use for:

- “KEY POINT”
- “RETRIEVAL STARTER”
- subject labels
- section labels
- topic markers
- progress/meta information

Do not overuse uppercase. Use it for orientation, not decoration.

### Caption

Use for low-emphasis supporting text.

```js
captionText: {
  fontFamily: "'Sora', sans-serif",
  fontSize: "0.78rem",
  lineHeight: 1.35,
  fontWeight: 400,
  letterSpacing: "-0.003em"
}
```

Use for:

- image captions
- quiet helper text
- legal/small notes
- secondary progress notes

### Button text

Use for CTAs and tappable actions.

```js
buttonText: {
  fontFamily: "'Sora', sans-serif",
  fontSize: "0.92rem",
  lineHeight: 1.2,
  fontWeight: 700,
  letterSpacing: "-0.005em"
}
```

Use for:

- Continue buttons
- answer buttons
- action buttons
- navigation CTAs

Button labels should be short and direct.

---

## 4. Mobile-first spacing rules

Use an **8px spacing system**.

Approved spacing values:

```txt
4px   // micro adjustment only
8px   // tight internal spacing
12px  // compact text grouping
16px  // standard internal spacing
24px  // screen/card padding
32px  // large section spacing
40px+ // only for hero or cinematic spacing
```

Avoid random values unless solving a specific visual alignment issue.

### Text spacing

Heading to body:

```txt
Screen heading → body: 12–16px
Section heading → body: 8–12px
Card title → body: 6–10px
Metadata → heading/title: 8–10px
```

Paragraph spacing:

```txt
Between short body paragraphs: 10–12px
Between body and CTA: 20–28px
Between separate cards: 12–16px
Between major screen sections: 24–32px
```

Line length on mobile:

```txt
Body text should usually sit within 28–42 characters per line.
Large headings should avoid more than 3 lines.
Question text should avoid more than 4 lines.
```

If text becomes longer, split it into a reveal, card sequence, or retrieval interaction.

---

## 5. Letter spacing rules

### Manrope

Manrope headings should usually use **negative tracking**.

```txt
Large headings: -0.045em
Section headings: -0.035em
Card titles: -0.02em
```

This keeps headings compact, cinematic and confident.

### Sora

Sora body/UI text should usually use **slightly reduced spacing**.

```txt
Body: -0.005em
Body small: -0.005em
Buttons: -0.005em
Captions: -0.003em
Metadata: +0.08em to +0.12em only when uppercase
```

Avoid using Sora body text at 18px with default tracking unless deliberately creating a large reading moment.

---

## 6. Weight rules

Use hierarchy through weight before adding colour, glow or decoration.

```txt
Manrope 800: hero/screen headings
Manrope 750: section headings
Manrope 700: card titles

Sora 700: buttons, important labels
Sora 650: metadata/kickers
Sora 500: emphasis inside body or question text
Sora 400: normal body copy
```

Avoid using too many weights on one screen.

Recommended maximum per screen:

```txt
1 heading weight
1 body weight
1 label/button weight
```

---

## 7. Accessibility and readability

Minimum practical sizes:

```txt
Body text: 15px minimum
Small supporting text: 13px minimum
Metadata: 11–12px minimum
Buttons: 15px minimum
```

Avoid low-contrast text below 14px.

Do not place long body text over busy images unless there is a dark overlay behind it.

For image overlays:

```txt
Use Manrope for headline.
Use Sora for body.
Keep body to 1–2 short sentences.
Use stronger overlay darkness rather than adding glow to text.
```

---

## 8. Anti-drift rules

Components must not invent typography.

Do not add one-off typography declarations directly inside components unless there is a specific exception.

Use typography tokens instead:

```js
...TYPE.screenHeading
...TYPE.sectionHeading
...TYPE.cardTitle
...TYPE.bodyText
...TYPE.bodySmall
...TYPE.metadataText
...TYPE.captionText
...TYPE.buttonText
```

If a new text style is needed, add a named token to the typography system first.

---

## 9. Decision rule

When choosing between Manrope and Sora:

```txt
Is the text creating hierarchy, identity or a cinematic moment?
→ Use Manrope.

Is the text being read, tapped, answered, scanned or used to learn?
→ Use Sora.
```

When unsure, default to **Sora** for clarity.

---

## 10. Brand summary

The final typography system is:

```txt
Manrope = cinematic hierarchy
Sora = readable learning and UI
```

The app should feel premium and atmospheric, but never harder to read because of the design.
