# Episode 2: A hero with blood on his hands — Architecture

## 1. Identity (brief)

- **Episode:** 2 of 12
- **Title:** A hero with blood on his hands
- **Primary acts:** Act 1, Scene 2
- **Build status:** Not yet built

Content, Storyline, Specification requirements and the full Content reference pack: see `02_A_Hero_With_Blood_On_His_Hands_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Hook & Prior Recall
- **Purpose:** Surface existing knowledge, create narrative tension, prime retrieval.
- **Proposed content for this episode:**
  - Retrieval from Episode 1: What are the witches? What is "Fair is foul"? What is equivocation?
  - Hook question: "Macbeth is a hero in Act 1 — true or false?" (sets up the ambiguity)
  - True/false: "We meet Macbeth in the first scene" / "Macbeth's violence is only described, not shown" / "Duncan is present on the battlefield"
- **Suggested components:**
  - `ChapterHookScreen` — true/false warm-up with Episode 1 retrieval embedded
  - `PriorKnowledgeRecall` — what can students remember about Macbeth's character before learning this scene?

### Section 2 — Plot & Dramatic Action
- **Purpose:** Teach what happens in the scene.
- **Proposed content:**
  - The Captain arrives bleeding; Duncan asks for a report
  - The Captain describes Macbeth's battle against Macdonwald: he unseamed him from the nave to the chaps
  - A second battle against the Norwegian king: Macbeth and Banquo fight together
  - Ross arrives with news of victory; Duncan announces Macbeth will receive the Thane of Cawdor title
  - The dramatic irony: Cawdor was a traitor; Macbeth will become one
  - Why is Macbeth absent from his own introduction scene? (Shakespeare's structural choice — reputation precedes him)
- **Suggested components:**
  - `VisualNarrativeScreen` — narrated scene using portrait-hero format for the Captain's speech
  - `ExplainReveal` — cause-and-effect chain: Macbeth's battle heroism → reward with Cawdor title → irony (traitor's title for a future traitor)

### Section 3 — Theme & Context
- **Purpose:** Connect the scene to major themes and AO3 context.
- **Proposed content:**
  - Theme: Violence/heroism — in Act 1.2, Macbeth's violence is legitimate (in service of the king); contrast with his later violence (in service of ambition)
  - Theme: Loyalty — the scene's contrast: old Cawdor betrayed; Macbeth is loyal (so far)
  - Theme: Masculinity — Jacobean warrior culture: "brave" and "violent" are synonyms; being a man = being capable of extreme violence
  - Context: Jacobean warrior culture; homosociality; the king as the source of legitimate authority over violence
  - Context: Divine right of kings — Duncan as God's representative; Macbeth defending the anointed king
- **Suggested components:**
  - `TheoryCompareBlock` — Act 1.2 reading of Macbeth's violence (heroic) vs Act 3+ reading (tyrannical)
  - `SwipeSort` — "heroic violence" vs "monstrous violence" — which description fits Macbeth at different points?

### Section 4 — Quote Analysis (AO2)
- **Purpose:** Active retrieval and analysis of key quotes.
- **Proposed content:**
  - **"Brave Macbeth — well he deserves that name"**: epithet; the Captain's admiration; the word "brave" = courageous+violent; AO2: the appositive phrase reinforces the character label
  - **"Unseam'd him from the nave to th'chaps"**: violent imagery; the word "unseam'd" (like a tailor, but the act is dismemberment); AO2: the tension between the precision of "unseam'd" and the horror of the act
  - **"What he hath lost, noble Macbeth hath won"**: final line of Captain's section; the title passing motif; AO2: the antithesis (lost/won) sets up the theme of moral exchange throughout the play
  - **"As sparrows eagles, or the hare the lion"**: animal imagery; Macbeth and Banquo are made to seem naturally superior to their enemies; reinforces heroic masculinity and battlefield dominance
  - PQAC frame: students complete an analysis of "unseam'd him from the nave to th'chaps"
- **Suggested components:**
  - `MatchingTask` — match quote to technique to effect
  - `FillInTheBlanksBlock` — complete PQAC for "unseam'd" quote
  - `ColSortBlock` — sort quotes by theme: violence / loyalty / heroism / foreshadowing

### Section 5 — Retrieval & Wider Play Links
- **Purpose:** Interleave; build whole-play awareness before the final exam-prep section.
- **Proposed content:**
  - Retrieve from Episode 1: What did the witches establish? What is "Fair is foul"?
  - Whole-play link: How does the Act 1.2 portrait of Macbeth contrast with the Act 5 verdict "this dead butcher"?
  - Wider link: Banquo is also praised in this scene — why is this important for the later comparison in Act 3.1?
  - Quick quiz: Captain's speech — technique identification
- **Suggested components:**
  - `QuickRecallScreen` — 4 rapid questions: quotes, techniques, themes, context
  - `RecoveryQuizPlayer` — targeted recovery for any missed items

### Section 6 — Exam Practice
- **Purpose:** Final AQA-style practice moment. The final navigation/progress dot must land on exam prep.
- **Proposed content:**
  - Question stem: "How does Shakespeare present Macbeth as a character who changes during the play?" — this episode provides the "before" state; students must identify what changes
  - AQA Jun 2023 indicative content reference: "comments on Macbeth before he appears — a brave warrior"; "Macbeth's use of violence in the context of war/to fulfil his ambition"
  - Guided paragraph: beginning a character arc essay from the starting point (Act 1.2 hero) to the end (Act 5.3 nihilism)
  - Model opening: "Shakespeare introduces Macbeth through the admiring report of a wounded soldier, establishing him as Scotland's greatest warrior before the audience even meets him..."
- **Suggested components:**
  - `GuidedExamResponse` — structured paragraph building on Macbeth's Act 1.2 introduction
  - `ExaminerExplainsScreen` — what examiners want in a "character change" essay opening

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Storyline integration:** The core takeaway (violence rewarded as heroism in Act 1 becomes monstrous when used for ambition in Act 3+) should be introduced as a contrast frame in Section 3. Students should be able to articulate this distinction by the end of Section 3 and use it in Section 6.

2. **Section 2 must explain the structural choice:** Macbeth being absent from the scene that introduces him is a significant dramatic technique. Don't just narrate the scene — teach the decision.

3. **Section 4 — the "unseam'd" quote is the highest-value AO2 moment:** The tension between the precision of "unseam'd" (craft, skill, elegance) and the horror of the act (disembowelment) is an excellent AO2 analytical point that distinguishes Level 4/5 from Level 3.

4. **Section 6 — frame this as the opening of a character arc essay:** The Jun 2023 exam asked specifically about Macbeth as a character who changes. This episode is the essential starting point. The exam practice here should be positioned explicitly as "how to begin a character arc answer."

5. **Retrieval (Section 5) must include Episode 1 content:** This is only the second episode; the retrieval here is light. But ensure "Fair is foul" and equivocation come back — these will be needed repeatedly across all 12 episodes.

---

## 10-point Module Completion Test

- [ ] Students can narrate the episode's plot from memory (Section 2)
- [ ] Students can name and explain at least 2 themes from the episode (Section 3)
- [ ] Students can identify at least 1 key AO3 context point and link it to the text (Section 3)
- [ ] Students have actively retrieved at least 4 key quotes from the episode (Section 4)
- [ ] Students can analyse each key quote using Point → Quote → Analysis → Context (Section 4)
- [ ] Students can identify and name at least 2 language/structural techniques from the episode (Section 4)
- [ ] Students have retrieved content from at least one earlier episode (Section 5)
- [ ] Students have practised at least one AQA-style written response (Section 6)
- [ ] Students have been shown or produced a mark-scheme-aware paragraph (Section 6)
- [ ] The episode's core takeaway (how it contributes to the series throughline) has been stated and practised (Section 3 or 6)
