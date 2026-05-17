// ─── AQA GCSE English Language — Questions organised by skill/question type ──
// 8700/1 Paper 1: Explorations in creative reading and writing
// 8700/2 Paper 2: Writers' viewpoints and perspectives
// Sources: JUN22, JUN23 past papers

// ─── Level descriptors shared across reading questions ────────────────────────
export const LEVEL_DESCRIPTORS = {
  4: { label: 'Perceptive, detailed', range: 'Top of mark range' },
  3: { label: 'Clear, relevant',      range: 'Middle of mark range' },
  2: { label: 'Some, attempts',       range: 'Lower middle' },
  1: { label: 'Simple, limited',      range: 'Bottom of mark range' },
}

// ─── Topic groups ─────────────────────────────────────────────────────────────
export const ENGLISH_TOPIC_GROUPS = [

  // ── Q1 type: List / True or False ────────────────────────────────────────
  {
    id: 'q1_retrieval',
    label: 'Q1 — Retrieval & Identification',
    icon: '🔍',
    color: '#9D5CFF',
    bg: 'rgba(157,92,255,.12)',
    border: 'rgba(157,92,255,.28)',
    description: 'Paper 1 Q1: List four things. Paper 2 Q1: Choose four true statements. Quick retrieval from a specific section of the text.',
    paper: 'Both papers',
    marks: 4,
    skillTip: 'Each mark = one correct point. Quote or paraphrase — both are fine. Do NOT copy out the whole paragraph. Check you are reading the RIGHT lines.',
    questions: [
      {
        id: 'el_p1j23_q1', source: 'P1 JUN23', marks: 4, type: 'written',
        extract: `The narrator describes hyenas in lines 1–6 of the source. The passage establishes that hyenas 'worried' the narrator (Pi). It mentions hyenas attacking zebras, gnus, water buffaloes, and full-grown herd members. Hyenas are described as hardy attackers who rise up from kickings and buttings immediately, who attack in packs, and who are clever — distracting prey from its mother.`,
        q: `Read again the first part of the source, from lines 1 to 6.\n\nList FOUR things about hyenas from this part of the source.\n\n(Source: Life of Pi by Yann Martel — the narrator Pi describes hyenas.)`,
        ms: `Award 1 mark for each correct, distinct point about hyenas (not about Pi/the narrator). Up to 4 marks.\n\nAcceptable answers include:\n• Hyenas worry the narrator / cause worry\n• Hyenas attack zebras\n• Hyenas attack gnus / water buffaloes / buffaloes\n• Hyenas attack any animal they can run down\n• Hyenas attack in packs / groups\n• Hyenas attack the full-grown members of a herd\n• Hyenas are hardy / resilient / tough / determined\n• Hyenas rise up from kickings and buttings immediately\n• Hyenas never give up\n• Hyenas are clever\n• Hyenas distract prey from its mother\n\nREJECT:\n• Anything about Pi or the narrator rather than hyenas\n• Hyenas have a simple lack of will (wrong — they do NOT lack will)\n• Hyenas get distracted (wrong)`,
      },
      {
        id: 'el_p1j22_q1', source: 'P1 JUN22', marks: 4, type: 'written',
        extract: `The source is an extract from 'The Pearl' by John Steinbeck. Lines 1–6 describe the brush house and what is happening. The sun is warming the house and breaking through crevices in long streaks. A streak falls on a hanging bed-box suspended from the ceiling on ropes. Baby Coyotito is in the bed-box. There is a tiny movement near the hanging box — a scorpion moving slowly down the rope with its stinging tail out behind it.`,
        q: `Read again the first part of the source, from lines 1 to 6.\n\nList FOUR things about the brush house and what is happening in this part of the source.\n\n(Source: 'The Pearl' by John Steinbeck — the opening of the novel.)`,
        ms: `Award 1 mark for each correct, distinct point about the brush house or what is happening. Up to 4 marks.\n\nAcceptable answers include:\n• The sun is warming the house\n• Sun is breaking through the crevices in long streaks\n• The house has crevices\n• A streak of sun falls on the bed-box\n• There is a hanging bed-box\n• The bed-box hangs from the ceiling / from ropes / from a roof support\n• Baby Coyotito is in the hanging bed-box\n• There is a tiny movement near the hanging box\n• A scorpion is moving slowly down the rope\n• The scorpion's stinging tail is out\n\nREJECT:\n• The baby moved in a tiny movement (it's the scorpion)\n• Kino and Juana are freezing`,
      },
      {
        id: 'el_p2j23_q1', source: 'P2 JUN23', marks: 4, type: 'mc_multi',
        extract: `Source A is a travel writing extract. The narrator is on a long train journey. He describes being near the end of a journey that has lasted over a week. He writes about a dining car on the train and having eaten poor bread. He feels disconnected from society. He has had little to do. He does not know what he will do when he leaves the train.`,
        q: `Read again the first part of Source A from lines 1 to 7.\n\nChoose FOUR statements below which are TRUE. (Source A is a travel writing extract about a long train journey.)\n\nA — The writer is at the start of his train journey.\nB — The writer is looking forward to leaving the train.\nC — The writer will be on the train for three more days.\nD — The train has a carriage where meals are served.\nE — The writer thinks the bread has been delicious.\nF — The writer feels that he has been cut off from society while on the train.\nG — The writer has had many activities to keep him busy on the train.\nH — The writer does not have any plans for when he leaves the train.\n\nWrite the four correct letters:`,
        ms: `TRUE statements: B, D, F, H\n\nA = FALSE (he is near the END of his journey)\nB = TRUE (he is looking forward to leaving)\nC = FALSE (not three more days)\nD = TRUE (the train has a dining car)\nE = FALSE (the bread has NOT been delicious)\nF = TRUE (he feels cut off from society)\nG = FALSE (he has had little to do)\nH = TRUE (he has no plans for after the journey)\n\nAward 1 mark per correct letter identified, up to 4. Penalise extra wrong answers.`,
      },
      {
        id: 'el_p2j22_q1', source: 'P2 JUN22', marks: 4, type: 'mc_multi',
        extract: `Source A is a piece of writing about a family holiday to France. The writer is not happy about going. The writer has been to France before (the word 'again' is used). The writer does not think evil powers ruin holidays but thinks holidays are mental and physical challenges. The writer is a child/teenager at the time. The family are travelling through countryside (not a city). The fields have sunflowers (not wheat). The writer says holidays can look attractive but she thinks this is a trick.`,
        q: `Read again the first part of Source A from lines 1 to 9.\n\nChoose FOUR statements below which are TRUE. (Source A is about a family camping holiday to France.)\n\nA — The writer's mother was happy to be going on holiday.\nB — This is the first time the writer has been to France.\nC — The writer thinks evil powers ruin holidays.\nD — The writer thinks holidays are mental and physical challenges.\nE — The writer is a teenager at the time of the holiday.\nF — The family are travelling through a city.\nG — The fields on either side of the road are full of wheat.\nH — The writer admits that holidays can look attractive but she thinks this is a trick.\n\nWrite the four correct letters:`,
        ms: `TRUE statements: A, D, E, H\n\nA = TRUE (the writer's mother was happy to go)\nB = FALSE ('again' implies she has been before)\nC = FALSE (she does not say evil powers cause it)\nD = TRUE (she calls holidays 'mental and physical challenges')\nE = TRUE (she is a teenager)\nF = FALSE (they travel through countryside, not a city)\nG = FALSE (the fields have sunflowers, not wheat)\nH = TRUE (she admits holidays look attractive but calls it a trick)\n\nAward 1 mark per correct letter, up to 4.`,
      },
    ],
  },

  // ── Q2 type: Language analysis ────────────────────────────────────────────
  {
    id: 'q2_language',
    label: 'Q2 — Language Analysis (P1) / Summary (P2)',
    icon: '✍️',
    color: '#9D5CFF',
    bg: 'rgba(157,92,255,.12)',
    border: 'rgba(157,92,255,.28)',
    description: 'P1 Q2 (8 marks): How does the writer use language here? Analyse words, phrases, language features and sentence forms with subject terminology. P2 Q2 (8 marks): Summarise differences between two texts.',
    paper: 'Both papers',
    marks: 8,
    skillTip: 'The magic formula: QUOTE → TECHNIQUE (name it) → EFFECT (what it makes the reader think/feel) → DEEPER MEANING (why the writer chose it). Always embed quotes. Never just "the writer uses adjectives."',
    levelDescriptors: {
      '7-8': 'Perceptive, detailed — analyses the effect of language; judicious quotes; sophisticated terminology',
      '5-6': 'Clear, relevant — explains effects clearly; range of relevant quotes; clear accurate terminology',
      '3-4': 'Some understanding — comments on effect; some appropriate quotes; some terminology',
      '1-2': 'Simple — simple comment on language; simple reference; basic/imprecise terminology',
    },
    questions: [
      {
        id: 'el_p1j23_q2', source: 'P1 JUN23', marks: 8, type: 'written',
        extract: `"I am not one to hold a prejudice against any animal, but it is a plain fact that the spotted hyena is not well served by its appearance. It is ugly beyond redemption. Its shaggy, coarse coat is a bungled mix of colours, with the spots having none of the classy ostentation of a leopard's, they look rather like the symptoms of a skin disease. The head is broad and too massive, with a high forehead, like that of a bear, but suffering from a receding hairline, and with ears that look ridiculously mouse-like, large and round, when they haven't been torn off in battle. The mouth is forever open and panting. The nostrils are too big. The tail is scraggly and unwagging. All the parts put together look doglike, but like no dog anyone would want as a pet."`,
        q: `Look in detail at this extract from lines 10 to 19 of the source:\n\n[See extract above — the hyena's appearance]\n\nHow does the writer use language here to describe the hyena's appearance?\n\nYou could include the writer's choice of:\n• words and phrases\n• language features and techniques\n• sentence forms.\n\n[8 marks]`,
        ms: `Level 4 (7-8): Perceptive, detailed analysis. Analyses effects of language choices; judicious textual detail; sophisticated accurate terminology.\nExample of L4: "The adjective 'ugly' labels the hyena as grotesque immediately, emphasised by the harshness of the short declarative sentence. 'Beyond redemption' has connotations of being saved from evil — as if the hyena's ugliness is symbolic of a deeper sinister nature that cannot be reversed."\n\nLevel 3 (5-6): Clear, relevant explanation. Explains effects clearly; range of relevant quotes; clear accurate terminology.\nExample of L3: "'It is ugly beyond redemption' — the short sentence is deliberately blunt. The adjective 'ugly' introduces the animal as hideous, and 'redemption' suggests there is nothing that could save it."\n\nLevel 2 (3-4): Some understanding. Comments on effect; some appropriate quotes; some terminology.\nExample of L2: "The writer uses adjectives like 'ugly beyond redemption' to make the hyena sound horrible."\n\nLevel 1 (1-2): Simple comment on language; simple reference; basic terminology.\n\nKey features to discuss:\n• Adjectives: 'ugly', 'shaggy', 'coarse' — unpleasant appearance\n• Verbs: 'bungled' — not a perfect creation\n• Contrast/antithesis: 'none of the classy ostentation of a leopard's' — unfavourable comparison\n• Simile: 'like the symptoms of a skin disease' — exaggerates unpleasant appearance\n• Adverbs/intensifiers: 'too massive', 'ridiculously mouse-like', 'too big' — disproportionate features\n• Humour/hyperbole: 'suffering from a receding hairline' — mocks the hyena\n• Short declarative sentences: 'The nostrils are too big.' — adds harsh, dismissive tone\n• Antithesis: 'doglike, but like no dog anyone would want as a pet'`,
      },
      {
        id: 'el_p1j22_q2', source: 'P1 JUN22', marks: 8, type: 'written',
        extract: `The extract (lines 7–17) describes Kino watching a scorpion move towards his baby. In his mind a new song had come, the Song of Evil, the music of the enemy, and underneath, the Song of the Family cried plaintively. The scorpion moved delicately down the rope toward the box. Kino stood perfectly still while the song of evil ran through him, a savage, secret, dangerous melody. He watched the scorpion move. It lifted its tail and as the tail curled, Kino's hand leaped to catch it, but his fingers closed on air. The scorpion fell into the box.`,
        q: `Look in detail at this extract from lines 7 to 17 of the source:\n\n[See extract above — Kino watching the scorpion]\n\nHow does the writer use language here to describe the conflict between Kino and the scorpion?\n\nYou could include the writer's choice of:\n• words and phrases\n• language features and techniques\n• sentence forms.\n\n[8 marks]`,
        ms: `Level 4 (7-8): Perceptive, detailed analysis of language.\nExample of L4: "The writer uses an extended metaphor of the 'Song of Evil' and 'Song of the Family' to present the contrast between good and evil. The juxtaposition between the songs — the evil melody that 'ran through him' and the family song crying 'plaintively' underneath — portrays the Family as threatened by something unstoppable. The triplet of adjectives 'savage, secret, dangerous' suggests a threat that is both violent and hidden, emphasising its sinister nature."\n\nLevel 3 (5-6): Clear explanation of effects with relevant quotes and terminology.\nExample of L3: "The writer describes the threat as 'savage, secret, dangerous melody'. The adjectives suggest a huge sense of immediate danger. The word 'savage' emphasises the violence of the threat while 'secret' implies it is hidden and inescapable."\n\nLevel 2 (3-4): Some comment on effect with some terminology.\nLevel 1 (1-2): Simple comment with basic reference.\n\nKey features:\n• Extended metaphor: 'Song of Evil' / 'Song of the Family' — conflict between good and evil\n• Triplet/tricolon of adjectives: 'savage, secret, dangerous' — intensity of threat\n• Juxtaposition: good vs evil, family vs scorpion\n• Verbs: 'leaped', 'closed on air' — speed and failure\n• Short sentences building tension: 'The scorpion fell into the box'\n• Personification of the songs — gives inner conflict an external form`,
      },
      {
        id: 'el_p2j23_q2', source: 'P2 JUN23', marks: 8, type: 'written',
        extract: `Source A: A 1920s travel writing extract. The narrator has been on a train for over a week. The train has a mail van, a dining car, and five sleeping cars. It is a long, developed commercial train. \n\nSource B: An 1830 letter. The writer is experiencing train travel for the first time. The train has a 'little engine' and just one 'uncovered carriage' with 'benches'. It is early, experimental railway travel.`,
        q: `You need to refer to Source A and Source B for this question.\n\nThe writers in Source A and Source B are travelling on different types of trains.\n\nUse details from BOTH sources to write a summary of what you understand about the DIFFERENCES between the two trains.\n\n[8 marks]`,
        ms: `Level 4 (7-8): Perceptive synthesis. Makes perceptive inferences from both texts; judicious textual detail; shows perceptive differences between texts.\nExample of L4: "The train in Source A has been built to transport both mail and people across long distances, with 'a dining car' and 'five sleeping cars' indicating how train travel had become commercialised by the 1920s. This sophistication contrasts sharply with Source B, where the train is just a functional 'uncovered carriage' with 'benches', reflecting the earliest stage of rail development where the goal was simply to prove the engine worked, not to provide passenger comfort."\n\nLevel 3 (5-6): Clear synthesis from both texts; clear inferences; clear differences identified.\nLevel 2 (3-4): Some interpretation from one/both texts; some differences noted.\nLevel 1 (1-2): Simple paraphrase from one/both texts; simple differences.\n\nAreas to compare:\n• Size (Source A: large multi-carriage; Source B: 'little engine' and one carriage)\n• Facilities/comfort (Source A: dining car, sleeping cars; Source B: uncovered carriage with benches)\n• Purpose (Source A: commercial passenger + mail transport; Source B: experimental/mechanical)\n• Stage of development (Source A: 1920s maturity; Source B: 1830s very first trains)\n• Duration of journey (Source A: over a week; Source B: short demonstration ride)`,
      },
      {
        id: 'el_p2j22_q2', source: 'P2 JUN22', marks: 8, type: 'written',
        extract: `Source A: A family holiday to France, camping. The campsite is crowded, muddy, noisy, flooded by rain. Facilities are poor and unpleasant. The family are miserable.\n\nSource B: A writer who enjoys camping and describes a beautiful, peaceful campsite in natural surroundings with good facilities, freedom, and joy.`,
        q: `You need to refer to Source A and Source B for this question.\n\nThe writers in Source A and Source B stay in very different camping sites.\n\nUse details from BOTH sources to write a summary of what you understand about the DIFFERENCES between the two camping sites.\n\n[8 marks]`,
        ms: `Level 4 (7-8): Perceptive synthesis from both texts with judicious textual detail; perceptive differences between the two sites.\n\nLevel 3 (5-6): Clear synthesis; clear inferences from both texts; clear differences identified with relevant supporting detail.\nExample of L3: "The campsite in Source A is chaotic and unpleasant. The writer describes it as flooded and crowded, suggesting a lack of organisation and comfort. In contrast, the campsite in Source B is peaceful and natural, with the writer describing beautiful surroundings that suggest freedom and tranquillity."\n\nLevel 2 (3-4): Some interpretation; some appropriate references from one or both texts; some differences noted.\nLevel 1 (1-2): Simple paraphrase; simple differences.\n\nAreas to compare:\n• Conditions (Source A: muddy, flooded, chaotic; Source B: peaceful, natural, beautiful)\n• Facilities (Source A: poor and unpleasant; Source B: good / well-equipped)\n• Atmosphere (Source A: miserable, overcrowded; Source B: free, joyful)\n• The writers' feelings (Source A: negative/resentful; Source B: positive/enthusiastic)`,
      },
    ],
  },

  // ── Q3 type: Structure analysis ───────────────────────────────────────────
  {
    id: 'q3_structure',
    label: 'Q3 — Structure Analysis',
    icon: '🏗️',
    color: '#3B82FF',
    bg: 'rgba(59,130,255,.12)',
    border: 'rgba(59,130,255,.28)',
    description: 'P1 Q3 (8 marks): How has the writer structured the text? P2 Q3 (12 marks): How does the writer use language to describe [an event]? Think about whole-text, paragraph and sentence-level structural choices.',
    paper: 'Both papers',
    marks: 8,
    skillTip: 'Structure = what the writer focuses on AND how they change that focus. Think: beginnings, endings, shifts in focus, pace changes, perspective changes, what is foregrounded vs delayed. Not just "paragraphs" or "short sentences."',
    levelDescriptors: {
      '7-8': 'Perceptive — analyses effects of structural features; judicious examples; sophisticated terminology',
      '5-6': 'Clear — explains effects of structural choices clearly; range of relevant examples; accurate terminology',
      '3-4': 'Some — comments on structural features; some examples; some terminology',
      '1-2': 'Simple — simple comment on structure; simple reference; limited terminology',
    },
    questions: [
      {
        id: 'el_p1j23_q3', source: 'P1 JUN23', marks: 8, type: 'written',
        q: `You now need to think about the whole of the source.\n\nThis text is from the middle of a novel about Pi, a boy trapped on a lifeboat with dangerous animals including a hyena.\n\nHow has the writer structured the text to interest you as a reader?\n\nYou could write about:\n• what the writer focuses your attention on at the beginning of the source\n• how and why the writer changes this focus as the source develops\n• any other structural features that interest you.\n\n[8 marks]`,
        ms: `Level 4 (7-8): Perceptive, detailed understanding of structural features.\nExample of L4: "The writer opens by establishing Pi as anxious ('worried'), rooted in his father's warnings about hyenas — this creates an atmosphere of expected threat. The narrator then presents the power imbalance between himself and the hyena, signalling imminent danger. However, by the end of the extract this threat diminishes as the hyena 'did not move' for the rest of the day, creating a structure that builds to an anticlimactic but unsettling resolution."\n\nLevel 3 (5-6): Clear understanding of structural choices and their effects.\nExample of L3: "The writer begins by introducing the main source of tension immediately ('it was the hyena that worried me'), then describes the hyena's dangerous qualities, building dread. The focus then shifts to the hyena's wild behaviour aboard the boat, before the threat unexpectedly subsides, leaving the reader uncertain about Pi's safety."\n\nLevel 2 (3-4): Some comment on structural features with some examples.\nLevel 1 (1-2): Simple comment on structure with limited reference.\n\nStructural features to discuss:\n• Opening focus on Pi's worry and prior knowledge — establishes anxious tone immediately\n• Shift from description (hyena's nature) to action (hyena on the boat)\n• Power dynamic — Pi as observer, hyena as unpredictable threat\n• Narrative perspective shifts — what Pi knows vs what he sees\n• Pacing: tension builds, then unexpectedly dissipates at the end\n• Ending with 'did not move' — unresolved threat, reader left anxious`,
      },
      {
        id: 'el_p1j22_q3', source: 'P1 JUN22', marks: 8, type: 'written',
        q: `You now need to think about the whole of the source.\n\nThis text is from the beginning of a novel called 'The Pearl' by John Steinbeck. It opens in a brush house where Kino, his wife Juana, and baby Coyotito live. A scorpion threatens the baby.\n\nHow has the writer structured the text to interest you as a reader?\n\nYou could write about:\n• what the writer focuses your attention on at the beginning of the source\n• how and why the writer changes this focus as the source develops\n• any other structural features that interest you.\n\n[8 marks]`,
        ms: `Level 4 (7-8): Perceptive, detailed analysis.\nExample of L4: "The extract begins with a positive, calm image of a sunny family home. However, the same sunlight that creates warmth also illuminates the scorpion, creating an ironic structural shift — the symbol of safety (light) becomes the agent of exposure to danger. Both the scorpion and Kino mirror each other structurally ('It stopped' / 'Kino stood perfectly still'), holding the reader in suspense. The sting occurs as an abrupt structural pivot that accelerates pace sharply."\n\nLevel 3 (5-6): Clear explanation of structural choices and effects.\nExample of L3: "The writer begins with a calm, sunny setting in the family home, creating a sense of peace. Then the writer shifts focus to the scorpion moving towards the baby, creating tension. After the sting, the pace increases rapidly as Kino and Juana react, showing the urgency of the danger."\n\nLevel 2 (3-4): Some comment on structural changes with some examples.\nLevel 1 (1-2): Simple comment.\n\nStructural features:\n• Calm opening (sunlight, domestic warmth) → sudden threat introduced\n• Parallel structure: scorpion movements mirrored by Kino's stillness\n• Narrative zoom: wide setting → tight focus on scorpion and baby\n• Pace shifts: slow and tense during the stalk → rapid action after the sting\n• Ending that propels the reader forward — what happens to the baby?`,
      },
      {
        id: 'el_p2j23_q3', source: 'P2 JUN23', marks: 12, type: 'written',
        extract: `From Source A (1920s travel writing), lines 12–23 describe a train crash. Key language in the extract includes: 'a frightful crash', 'fearful force', 'drunkenly', 'cannonaded', 'broke both my legs', 'end of the world', 'sprawled foolishly', 'snorting steam', 'defiant and naughty look', 'definitely conscious of indiscretion', 'disposed of primly', 'refreshingly scandalous'. The narrator is calm and wryly amused afterwards.`,
        q: `You now need to refer ONLY to Source A from lines 12 to 23.\n\nSource A is a travel writing extract. In this section, the writer describes experiencing a train crash.\n\nHow does the writer use language to describe the train crash?\n\n[12 marks]`,
        ms: `Level 4 (10-12): Detailed, perceptive understanding of language.\nExample of L4: "The writer uses hyperbole 'my heaviest suitcase was cannonaded down' — the military verb 'cannonaded' suggests the crash turned his own luggage into a weapon against him, conveying how he felt victimised by the train itself. This dramatic escalation is then undercut by the wry, calm tone afterwards ('I felt very much annoyed'), creating a darkly comic structure."\n\nLevel 3 (7-9): Clear understanding of language choices and effects with relevant quotes and accurate terminology.\nExample of L3: "The hyperbole 'cannonaded' describes the force of the crash in dramatic terms, as if he was being bombarded. The metaphor suggests the crash was like a military attack."\n\nLevel 2 (4-6): Some comment on language with some appropriate quotes and some terminology.\nLevel 1 (1-3): Simple comment on language with simple reference.\n\nKey language features:\n• Hyperbole: 'cannonaded', 'end of the world', 'broken both my legs' — dramatic exaggeration of impact\n• Verbs: 'tilted', 'dug in', 'disposed' — physical violence of crash\n• Alliteration: 'fearful force' — emphasis on violence\n• Adverbs: 'drunkenly' (train's movement), 'primly', 'refreshingly', 'definitely' — comic contrast\n• Personification: 'sprawled foolishly', 'defiant and naughty look', 'definitely conscious of indiscretion' — the train presented as a misbehaving child\n• Short sentences: 'I sat up in my bed.' / 'I felt very much annoyed.' — calm understatement contrasting the chaos\n• Oxymoron/juxtaposition: 'grotesque' and 'primly' — the absurd alongside the formal\n• Zoomorphism: 'snorting steam' — the train as a dangerous animal`,
      },
      {
        id: 'el_p2j22_q3', source: 'P2 JUN22', marks: 12, type: 'written',
        extract: `From Source A, lines 29–38 describe a rain storm at the campsite. The extract describes intense rain, flooding, and the storm destroying the campsite. Key language: the rain 'hammered', 'torrential', 'sheets of rain', personification of the storm as aggressive and deliberate, the campsite becoming a 'swamp', sounds of the wind, children crying, the chaos of tents collapsing.`,
        q: `You now need to refer ONLY to Source A from lines 29 to 38.\n\nSource A is about a family camping holiday to France. In this section, the writer describes a rain storm.\n\nHow does the writer use language to describe the rain and the storm?\n\n[12 marks]`,
        ms: `Level 4 (10-12): Detailed, perceptive analysis of language choices and effects.\n\nLevel 3 (7-9): Clear explanation of language choices with range of relevant quotes and accurate terminology.\nExample of L3: "The writer uses aggressive verbs like 'hammered' to describe the rain, giving it a violent, almost human quality. The use of personification makes the storm seem deliberately hostile, as if it is attacking the campers rather than simply falling."\n\nLevel 2 (4-6): Some comment on language with some appropriate quotes and some terminology.\nLevel 1 (1-3): Simple comment with simple reference.\n\nKey features to discuss:\n• Aggressive/violent verbs to describe the rain's actions\n• Personification — storm as a deliberate, hostile force\n• Sensory details — sounds, sights of flooding\n• Short sentences to convey panic and rapid events\n• Contrast between the earlier positive expectation of the holiday and the storm's destruction\n• Hyperbole if present — exaggerating the disaster\n• Similes/metaphors for water/flooding`,
      },
    ],
  },

  // ── Q4 type: Evaluation (P1) / Comparison (P2) ────────────────────────────
  {
    id: 'q4_evaluation',
    label: 'Q4 — Evaluation (P1) / Comparison (P2)',
    icon: '⚖️',
    color: '#FF8A1F',
    bg: 'rgba(255,138,31,.12)',
    border: 'rgba(255,138,31,.28)',
    description: 'P1 Q4 (20 marks): To what extent do you agree with the student statement? Evaluate the text critically. P2 Q4 (16 marks): Compare how writers convey feelings and perspectives across both texts.',
    paper: 'Both papers',
    marks: 20,
    skillTip: 'For Q4 P1: Give your VIEW first, then prove it with quotes + analysis of WHY the writer made those choices. Agree/disagree partially — show complexity. For Q4 P2: Always link the two texts. Use comparative connectives: "In contrast to...", "Similarly...", "Whereas Source A..., Source B...".',
    levelDescriptors: {
      '16-20': 'Perceptive, detailed — convincing critical response; perceptive understanding of methods; judicious textual detail',
      '11-15': 'Clear, relevant — clear and relevant evaluation; clear understanding of methods; range of references',
      '6-10':  'Some attempts — some response to statement; some understanding of methods; some textual reference',
      '1-5':   'Simple, limited — simple comment; limited understanding; simple/copied reference',
    },
    questions: [
      {
        id: 'el_p1j23_q4', source: 'P1 JUN23', marks: 20, type: 'written',
        q: `Focus this part of your answer on the second part of the source, from line 20 to the end.\n\nA student said: "This part of the story, where the hyena behaves wildly, is funny rather than frightening. The writer suggests that the hyena is actually no serious threat to Pi."\n\nTo what extent do you agree?\n\nIn your response, you could:\n• consider your impressions of how the hyena behaves\n• evaluate how the writer presents the threat of the hyena to Pi\n• support your response with references to the text.\n\n[20 marks]`,
        ms: `Level 4 (16-20): Perceptive, detailed evaluation. Convincing and critical response; perceptive understanding of writer's methods; judicious textual detail; evaluates critically the effects on the reader.\n\nLevel 3 (11-15): Clear and relevant evaluation. Clear and relevant response; clear understanding of writer's methods; range of relevant references.\n\nLevel 2 (6-10): Some attempts at evaluation. Some response to the statement; some understanding of methods; some appropriate textual reference.\n\nLevel 1 (1-5): Simple, limited comment. Simple comment on the text; limited understanding of methods.\n\nStrong answers will:\n• Engage critically with the statement — neither simply agree nor disagree, but evaluate with nuance\n• Consider HOW the hyena's wild behaviour creates humour (e.g. chaotic, undignified actions)\n• BUT ALSO consider how the threat remains real beneath the comedy (e.g. the hyena IS dangerous)\n• Quote specific examples and analyse the writer's methods — not just what happens but how it is written\n• Evaluate what effect this creates on the reader and WHY the writer may have made these choices\n• Consider the student statement explicitly — 'to some extent' / 'however'`,
      },
      {
        id: 'el_p1j22_q4', source: 'P1 JUN22', marks: 20, type: 'written',
        q: `Focus this part of your answer on the second part of the source, from line 19 to the end.\n\nA student said: "In this part of the story, Juana's reaction to the danger facing their baby is different to Kino's. The writer shows that Kino is unhelpful, and it is Juana who tries to save the baby's life."\n\nTo what extent do you agree?\n\nIn your response, you could:\n• consider Juana's and Kino's reactions to the danger facing their baby\n• evaluate how the writer presents Juana's and Kino's different reactions\n• support your response with references to the text.\n\n[20 marks]`,
        ms: `Level 4 (16-20): Perceptive, detailed evaluation.\nExample approach: "Kino's instinctive reaction to eliminate the threat by killing the scorpion is no less effective than Juana's. The writer creates contrast between the parents' protective instincts through animal imagery — Juana is presented with 'eyes as cold as the eyes of a lioness', showing controlled maternal determination. Kino, on the other hand, is described with violent animal words like 'snarling' and 'bared', showing primal aggression. Neither is 'unhelpful' — they simply express protective instinct differently."\n\nLevel 3 (11-15): Clear evaluation with methods explained and relevant quotes.\n\nLevel 2 (6-10): Some engagement with the statement, some understanding of methods.\n\nLevel 1 (1-5): Simple comment on the text.\n\nPoints to evaluate:\n• Kino kills the scorpion — this IS helpful; the student statement is debatable\n• Animal imagery for both parents — lioness (Juana), snarling animal (Kino)\n• Juana's iron determination: 'there was iron in Juana'\n• Juana's actions: sucks the poison from the baby — practical and determined\n• Kino's role: leads them to get a doctor; 'Kino followed her' — arguably Juana leads\n• The word 'unhelpful' is simplistic — both parents act instinctively and effectively`,
      },
      {
        id: 'el_p2j23_q4', source: 'P2 JUN23', marks: 16, type: 'written',
        q: `For this question, you need to refer to the WHOLE of Source A, together with the WHOLE of Source B.\n\nSource A is a 1920s travel account of a long train journey by a bored, experienced traveller.\nSource B is an 1830 letter from a passenger experiencing train travel for the first time, filled with wonder and excitement.\n\nCompare how the writers convey their DIFFERENT feelings and perspectives about their experiences of travelling on a train.\n\nIn your answer, you could:\n• compare their different feelings and perspectives\n• compare the methods the writers use to convey their different feelings and perspectives\n• support your response with references to both texts.\n\n[16 marks]`,
        ms: `Level 4 (13-16): Perceptive, detailed comparison. Analyses how writers' methods are used; judicious supporting detail from both texts; detailed and perceptive understanding of different ideas and perspectives.\n\nExample of L4: "The writer of Source A expresses contempt for train travel through the repetition and listing of 'no more' in his opening paragraph, creating a rhythm of exhausted monotony that reflects the tedium of over a week's travel. This attitude of weary dismissal contrasts completely with the writer of Source B, whose use of the noun 'raptures' — with its connotations of euphoria and almost spiritual ecstasy — captures the overwhelming novelty of her very first train experience."\n\nLevel 3 (9-12): Clear and relevant comparison with methods explained and relevant references from both texts.\n\nLevel 2 (5-8): Attempts at comparison; some comment on methods; some references from one or both texts.\n\nLevel 1 (1-4): Simple cross-reference of texts.\n\nFeelings/perspectives to compare:\n• Boredom/monotony (A) vs wonder/excitement (B)\n• Familiarity/experience (A) vs novelty/innocence (B)\n• Contempt/apathy (A) vs admiration/awe (B)\n• Confinement felt (A) vs freedom experienced (B)\n\nMethods to compare:\n• Listing/repetition: 'no more' (A) — exhausted catalogue of discomforts\n• Word choice: 'raptures' (B) — spiritual ecstasy at novelty\n• Tone: sardonic, mocking (A); excited, explanatory (B)\n• First-person perspective but different audiences: public travel writing (A), private letter (B)\n• Both use sensory description but to opposite effect`,
      },
      {
        id: 'el_p2j22_q4', source: 'P2 JUN22', marks: 16, type: 'written',
        q: `For this question, you need to refer to the WHOLE of Source A, together with the WHOLE of Source B.\n\nSource A describes a miserable family camping holiday to France — the writer finds it exhausting, chaotic and deeply unpleasant.\nSource B describes a camping experience the writer loves — peaceful, natural and joyful.\n\nCompare how the writers convey their DIFFERENT thoughts and feelings about camping experiences.\n\nIn your answer, you could:\n• compare their different thoughts and feelings about camping experiences\n• compare the methods they use to convey their thoughts and feelings\n• support your response with references to both texts.\n\n[16 marks]`,
        ms: `Level 4 (13-16): Perceptive, detailed comparison with analysis of methods, judicious textual detail from both, sophisticated understanding of contrasting perspectives.\n\nLevel 3 (9-12): Clear and relevant comparison. Methods clearly explained; relevant references from both texts; clear understanding of contrasting feelings.\nExample of L3: "The writer of Source A feels that camping is an ordeal, using language that suggests suffering and chaos, while the writer of Source B presents camping as liberating and beautiful. Source A uses dark, violent language like [quote] to convey misery, whereas Source B uses [quote] to suggest joy and peace."\n\nLevel 2 (5-8): Some attempts at comparison; some appropriate references from one or both texts.\nLevel 1 (1-4): Simple cross-reference.\n\nKey contrasts:\n• Attitude to nature: threatening/hostile (A) vs beautiful/restorative (B)\n• Family experience: miserable/chaotic (A) vs peaceful/joyful (B)\n• Writer's tone: resentful, ironic, humorous (A); enthusiastic, celebratory (B)\n• Structure: narrative of events building to disaster (A); reflective celebration (B)\n• Methods: sarcasm and irony (A); lyrical, positive vocabulary (B)`,
      },
    ],
  },

  // ── Q5 type: Creative/Persuasive Writing ─────────────────────────────────
  {
    id: 'q5_writing',
    label: 'Q5 — Section B Writing',
    icon: '✏️',
    color: '#4DFF88',
    bg: 'rgba(77,255,136,.1)',
    border: 'rgba(77,255,136,.25)',
    description: 'P1 Q5 (40 marks): Descriptive or narrative creative writing. P2 Q5 (40 marks): Argue or persuade in a specific form (speech, article, letter). 24 marks for content/organisation + 16 marks for technical accuracy.',
    paper: 'Both papers',
    marks: 40,
    skillTip: 'Plan BEFORE you write (5 minutes). For creative: use the senses, vary sentence length, start with something unexpected. For persuasive: know your audience, use AFOREST techniques (Anecdote, Facts, Opinions, Rhetorical questions, Emotive language, Statistics, Triplets). Always have a strong opening and a punchy conclusion.',
    levelDescriptors: {
      '22-24 (content)': 'Compelling, convincing — ambitious vocabulary; assuredly matched tone/register; inventive structure',
      '19-21 (content)': 'Convincing — extensive vocabulary; consciously crafted devices; effective structure',
      '14-18 (content)': 'Consistent, clear — increasingly sophisticated vocabulary; deliberate structural choices',
      '7-13 (content)':  'Some success — some varied vocabulary; some structural choices; some awareness of form',
      '1-6 (content)':   'Simple — simple vocabulary; limited structure; basic awareness of task',
    },
    questions: [
      {
        id: 'el_p1j23_q5', source: 'P1 JUN23', marks: 40, type: 'written',
        q: `Section B — Writing\n\nYou are advised to spend about 45 minutes on this section.\n\nA travel website is running a creative writing competition.\n\nEither:\nWrite a DESCRIPTION of a wild or remote place, as suggested by this picture: [An image showing a dramatic natural landscape]\n\nOr:\nWrite the OPENING of a story about a person who is being closely watched.\n\n(24 marks for content and organisation + 16 marks for technical accuracy)\n[40 marks total]`,
        ms: `Content and Organisation (24 marks):\nLevel 4 Upper (22-24): Compelling and convincing. Assuredly matched tone/register. Ambitious vocabulary, sustained crafting of linguistic devices. Varied and inventive structural features. Fluently linked paragraphs.\nLevel 4 Lower (19-21): Convincing. Extensive vocabulary with conscious crafting. Varied and effective structural features. Highly engaging with developed complex ideas.\nLevel 3 (14-18): Consistent and clear. Increasingly sophisticated vocabulary. Deliberate structural choices. Clearly organised paragraphs.\nLevel 2 (7-13): Some success. Some varied vocabulary and linguistic devices. Some structural features. Paragraphs used but not always securely.\nLevel 1 (1-6): Simple awareness. Simple vocabulary. Limited awareness of form/structure.\n\nTechnical Accuracy / AO6 (16 marks):\n13-16: Extensive and ambitious vocabulary; varied and inventive sentence structures; high level of accuracy in spelling and punctuation.\n9-12: Increasingly sophisticated vocabulary; variety of sentence structures; generally accurate.\n5-8: Vocabulary chosen for effect; some varied sentences; some accurate spelling and punctuation.\n1-4: Simple vocabulary; simple sentence structures; errors that hinder communication.\n\nKey advice for high marks:\n• Vary sentence length deliberately — mix short punchy sentences with longer flowing ones\n• Use all five senses to create vivid description\n• Show not tell — describe effects not just facts\n• Have a distinctive narrative voice\n• Use structural features: starting in media res, circular structure, unexpected shifts`,
      },
      {
        id: 'el_p1j22_q5', source: 'P1 JUN22', marks: 40, type: 'written',
        q: `Section B — Writing\n\nA travel website is running a creative writing competition and will publish the winning entries.\n\nEither:\nWrite a DESCRIPTION of an unusual place to stay, as suggested by this picture: [Image of an unusual accommodation]\n\nOr:\nWrite a STORY about a life-saving rescue.\n\n(24 marks for content and organisation + 16 marks for technical accuracy)\n[40 marks total]`,
        ms: `Content and Organisation (24 marks) — same level descriptors as above.\n\nTechnical Accuracy (16 marks) — same as above.\n\nFor DESCRIPTION: Focus on making the unusual place feel vivid and atmospheric. Use sensory details, interesting viewpoint, structural choices that mirror the place's strangeness (e.g. fragmented sentences for a chaotic place, long flowing sentences for a peaceful one).\n\nFor STORY: Have a clear narrative arc. Build tension before the rescue. Make the reader care about the character in danger. Strong, hook opening. Don't rush the resolution.`,
      },
      {
        id: 'el_p2j23_q5', source: 'P2 JUN23', marks: 40, type: 'written',
        q: `Section B — Writing\n\n"Cars are convenient, comfortable and save time. However, we need to use them less by making public transport such as trains, trams and buses cheaper, more reliable and easier to access."\n\nWrite a SPEECH to be given at a meeting of your local council in which you argue your point of view on this statement.\n\n(24 marks for content and organisation + 16 marks for technical accuracy)\n[40 marks total]`,
        ms: `Content and Organisation (24 marks) — level descriptors as above.\nTechnical Accuracy (16 marks) — as above.\n\nKey advice for this task:\n• Open with a direct, confident address: "Councillors, residents, fellow citizens…"\n• Take a clear position early — don't sit on the fence\n• Use rhetorical techniques: Rule of three, rhetorical questions, anecdote, statistics, repetition\n• Counter-argue before dismissing: "Some will say cars are essential. And they are right that…but…"\n• Vary sentence structure for rhetorical effect\n• End with a strong call to action\n• Match register to a formal speech: authoritative, passionate but not hysterical\n• Remember your audience: local council — practical, evidence-based, community-focused`,
      },
      {
        id: 'el_p2j22_q5', source: 'P2 JUN22', marks: 40, type: 'written',
        q: `Section B — Writing\n\n"Holidays don't need to be faraway and expensive. They just need to give people a break from everyday life and the chance to relax."\n\nWrite an ARTICLE for a magazine in which you argue your point of view on this statement.\n\n(24 marks for content and organisation + 16 marks for technical accuracy)\n[40 marks total]`,
        ms: `Content and Organisation (24 marks) — level descriptors as above.\nTechnical Accuracy (16 marks) — as above.\n\nKey advice for this task:\n• Article features: headline, subheading, paragraphs, perhaps a brief quote\n• Match tone to a magazine — more informal than a speech but still clear and purposeful\n• Take a clear position from the opening\n• Use a mix of personal anecdote AND wider evidence/argument\n• Rhetorical techniques: anecdote, rhetorical questions, statistics, triplets\n• Consider your magazine audience — who reads it? Match your examples and register accordingly\n• End memorably: a powerful final line that echoes your opening`,
      },
    ],
  },

  // ── Skills: Language techniques ───────────────────────────────────────────
  {
    id: 'language_techniques',
    label: 'Language Techniques — Practice & Identification',
    icon: '🔬',
    color: '#34D5FF',
    bg: 'rgba(52,213,255,.12)',
    border: 'rgba(52,213,255,.28)',
    description: 'Practise identifying and analysing language techniques: metaphor, simile, personification, alliteration, hyperbole, and more — using real exam extracts.',
    paper: 'Skills practice',
    marks: 4,
    skillTip: 'Never just name the technique — always explain the EFFECT. "The writer uses a metaphor" is worth nothing. "The metaphor X suggests Y, which makes the reader feel Z" is worth marks.',
    questions: [
      {
        id: 'lt1', source: 'Skills', marks: 4, type: 'written',
        q: `Read this short extract:\n\n"The storm crashed against the windows with savage fury. Trees bowed their heads in defeat. The little town held its breath."\n\nIdentify TWO language techniques used in this extract and for each one:\n• Name the technique\n• Quote the example\n• Explain the effect on the reader`,
        ms: `Award up to 2 marks per technique identified and explained (up to 4 marks total).\n\nAcceptable techniques:\n• Personification: 'Trees bowed their heads in defeat' — gives the trees human qualities, making them seem vulnerable like people, creating empathy and emphasising the power of the storm\n• Personification: 'The little town held its breath' — the town is presented as a living thing full of fear and anticipation, creating tension\n• Metaphor: 'savage fury' — the storm is presented as a violent, uncontrollable creature, making it seem more threatening and dangerous\n• Alliteration: (if present in the text) — creates rhythm and emphasis\n• Short sentence: 'The little town held its breath.' — creates tension and suspense, mirrors the silence and stillness\n\nFull marks (4): Two techniques correctly named, quoted, and with clear analysis of effect.\n3 marks: Two techniques identified but one effect is weak/imprecise.\n2 marks: One technique with good analysis, or two with very basic explanations.\n1 mark: One technique named with very basic comment.`,
      },
      {
        id: 'lt2', source: 'Skills', marks: 4, type: 'written',
        q: `Read this extract:\n\n"Revision is a prison with invisible walls. Every hour I sit at my desk, another hour of my life disappears into the void. But somewhere — far away — sunlight waits."\n\nIdentify TWO language techniques and explain the effect of each one.\n\nFor each:\n• Name the technique\n• Quote the example\n• Explain the effect on the reader`,
        ms: `Award up to 2 marks per technique (up to 4 marks total).\n\nAcceptable answers:\n• Metaphor: 'Revision is a prison with invisible walls' — presents revision as imprisonment, suggesting the writer feels trapped and unable to escape; the word 'invisible' makes it more sinister — you cannot see or fight these walls\n• Metaphor: 'another hour of my life disappears into the void' — 'the void' suggests an emptiness that consumes time, creating a sense of hopelessness and despair\n• Personification: 'sunlight waits' — hope is given a human quality of patience, suggesting that better times are coming and are almost within reach\n• Contrast/juxtaposition: the darkness of 'prison' and 'void' contrasted with the lightness of 'sunlight' — creates a sense of hope emerging from suffering\n• Short sentence/fragment: 'But somewhere — far away — sunlight waits.' — the dashes slow the reader down, creating a sense of longing and distance`,
      },
      {
        id: 'lt3', source: 'Skills', marks: 2, type: 'written',
        q: `What is the difference between a SIMILE and a METAPHOR?\n\nGive one example of each.`,
        ms: `Simile: a comparison using 'like' or 'as'. Example: "Her voice was like thunder." (or any valid example using like/as)\n\nMetaphor: a direct comparison stating something IS something else (no 'like' or 'as'). Example: "Her voice was thunder." (or any valid metaphor)\n\n[1 mark per correct definition with valid example — 2 marks total]`,
      },
      {
        id: 'lt4', source: 'Skills', marks: 3, type: 'written',
        q: `Explain the following language techniques with a brief definition and one example of each:\n\n1. Personification\n2. Hyperbole\n3. Alliteration`,
        ms: `1. Personification: Giving human qualities to non-human things.\nExample: "The wind howled in anger" / "The trees whispered secrets"\n[1 mark for definition + valid example]\n\n2. Hyperbole: Deliberate exaggeration for effect, not meant literally.\nExample: "I've told you a million times" / "I'm so hungry I could eat a horse"\n[1 mark]\n\n3. Alliteration: Repetition of the same consonant sound at the beginning of nearby words.\nExample: "Peter Piper picked a peck" / "wild and windy weather"\n[1 mark]`,
      },
    ],
  },

  // ── Skills: Structuring answers ───────────────────────────────────────────
  {
    id: 'answer_structure',
    label: 'How to Structure English Answers',
    icon: '📝',
    color: '#FF5C7A',
    bg: 'rgba(255,92,122,.12)',
    border: 'rgba(255,92,122,.28)',
    description: 'Learn the exact paragraph structures AQA rewards. PEEL, SQUID, and how to write analytical paragraphs that gain marks at Level 3 and 4.',
    paper: 'Skills practice',
    marks: 6,
    skillTip: 'The examiner reads thousands of answers. Stand out by: having a clear point, quoting precisely, naming the technique, explaining the effect, and linking to the writer\'s purpose. Every paragraph = one clear idea developed fully.',
    questions: [
      {
        id: 'as1', source: 'Skills', marks: 6, type: 'written',
        q: `Read this Level 2 paragraph and rewrite it at Level 3 or Level 4.\n\nLevel 2 paragraph:\n"The writer uses the word 'savage' to make the scorpion sound scary. This shows the reader that the scorpion is dangerous. There are also lots of adjectives which make it more exciting."\n\nProblems with this paragraph:\n• 'Scary' and 'exciting' are too vague\n• No subject terminology beyond 'adjectives'\n• No analysis of WHY the writer chose this word\n• No embedded quote — the quote is clumsy\n\nNow write a Level 3/4 paragraph about the scorpion extract using this structure:\n[Point] The writer... [Quote — embedded] ...using the [technique]... [Effect] This suggests... [Deeper meaning] The writer may have chosen this because...`,
        ms: `Level 4 model (7-8 marks if this were a full answer):\n\n"The writer presents the scorpion as an overwhelming threat through the triplet of adjectives 'savage, secret, dangerous', which intensifies the sense of immediate danger surrounding Kino's family. The word 'savage' carries connotations of uncontrollable violence, suggesting the scorpion cannot be reasoned with, while 'secret' implies a hidden menace that cannot easily be detected or defended against. Together, these adjectives create a sense of inescapable dread — the threat is both violent AND invisible — making the reader feel the same helplessness as Kino himself."\n\nLevel 3 model:\n"The writer describes the threat as a 'savage, secret, dangerous melody'. The triplet of adjectives suggests both the violence and the hidden nature of the danger. 'Savage' emphasises the brutal threat to the family, while 'dangerous' and 'secret' suggest it cannot be easily seen or stopped. This creates a sense of dread and helplessness in the reader."\n\nMark the student's paragraph on how well it:\n• Makes a clear analytical point [1]\n• Embeds a precise quote [1]\n• Names and explains a technique [1]\n• Analyses the effect on the reader [1]\n• Goes beyond surface meaning to writer's purpose [1]\n• Uses accurate subject terminology [1]`,
      },
      {
        id: 'as2', source: 'Skills', marks: 4, type: 'written',
        q: `For a P2 Q4 Comparison question, you need to compare how TWO writers present their feelings.\n\nHere are two points about their feelings. Connect them into ONE comparison paragraph using the sentence starters given:\n\nWriter of Source A: Feels trapped and bored on the train. Uses repetition of 'no more' to list what they're sick of.\n\nWriter of Source B: Feels excited and amazed. Uses the word 'raptures' to show their joy.\n\nWrite a comparison paragraph starting with:\n"The writer of Source A conveys... [their feeling]. This is shown through... In contrast, the writer of Source B..."`,
        ms: `Level 3/4 model comparison paragraph:\n\n"The writer of Source A conveys a deep sense of exhaustion and contempt for train travel. This is shown through the repetition of 'no more' in the opening section, which creates a rhythm of weary frustration — each repetition adding to a catalogue of things the writer can no longer endure. The effect is one of someone counting down the final moments of an ordeal, not a journey. In contrast, the writer of Source B conveys a sense of overwhelming, almost spiritual excitement about her experience. The noun 'raptures' — with its connotations of ecstasy and intense joy — captures the novelty of her first train journey. Where the writer of Source A is numbed by too much experience, the writer of Source B is transformed by having none."\n\nMark on:\n• Clear comparison of feelings [1]\n• Methods identified and explained for Source A [1]\n• Methods identified and explained for Source B [1]\n• Effect on reader for each [1]`,
      },
    ],
  },
]

// ─── Flat question lookup ─────────────────────────────────────────────────────
export const ALL_ENGLISH_QUESTIONS = ENGLISH_TOPIC_GROUPS.flatMap(g =>
  g.questions.map(q => ({
    ...q,
    topicId:    g.id,
    topicLabel: g.label,
    topicColor: g.color,
    paper:      g.paper,
    skillTip:   g.skillTip,
  }))
)
