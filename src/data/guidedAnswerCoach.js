// ─── Guided Answer Coach — "Nail exam technique" ────────────────────────────
//
// Six Edexcel GCSE History (Medicine) question types, each walking the
// student through: the question → what the examiner wants → watch an
// examiner think → an annotated model answer → write with support → write
// with light support → write independently → progress debrief.
//
// Plain JS objects/arrays only — consistent with medicineExamPapers.js and
// modules.js. `attempts.*` use GuidedExamResponse's existing `exam` shape
// (board, subject, topic, question, marks, sections, markScheme, sources?,
// beatText?).

import { J23_Q1, J23_Q2A, J23_Q2B, J23_Q3, J23_Q4, J23_Q5, J23_SOURCE_A, J23_SOURCE_B } from './medicineExamPapers.js'

// ── Newly-authored source pairs, shared between Type C (source utility) and
// Type D (source follow-up) so the text isn't duplicated ────────────────────

const BLACK_DEATH_SOURCES = {
  enquiry: 'how people in medieval England responded to the Black Death',
  sourceA: {
    label: 'Source A',
    attribution: 'From the chronicle of a monk at a monastery in the south of England, written around 1350, describing scenes he witnessed during the Black Death.',
    text: "In that year a plague of great mortality came upon the people, and they died so suddenly that scarcely anyone had time for confession. Many believed it was God's punishment for the sins of the world, and bands of men went from town to town beating themselves with whips and chains, crying out for mercy and calling on others to repent before it was too late. In our own town, the bells rang so often for the dead that the bell-ringers themselves grew sick and died.",
    credit: 'Invented for this exercise — illustrative of contemporary chronicle accounts.',
  },
  sourceB: {
    label: 'Source B',
    attribution: 'From the surviving record of a town council in eastern England, dated 1349, recording decisions made during the plague.',
    text: 'It is ordered that no person shall enter the town from places known to be infected, and that the gates be watched day and night. Because the churchyard is now full, a new pit has been dug beyond the town wall for the burial of the dead, and bodies are to be carried there without delay and covered with lime. Any house where a person has died of the sickness is to be marked and its goods burned.',
    credit: 'Invented for this exercise — illustrative of surviving local administrative records.',
  },
}

const JENNER_SOURCES = {
  enquiry: "reactions to Edward Jenner's work on vaccination",
  sourceA: {
    label: 'Source A',
    attribution: 'From a letter written by Edward Jenner in 1796, describing his experiment on a young boy, James Phipps, after noticing that milkmaids who had caught cowpox seemed protected from smallpox.',
    text: "I took matter from a sore on the hand of a dairymaid who had caught the cowpox from her master's cattle, and inserted it into the arm of a healthy boy of about eight years old by means of two superficial incisions. He felt a little uneasy for a day, but soon recovered. Some weeks afterwards I inoculated him again, this time with matter taken from a smallpox sore. No disease followed. I am encouraged to believe that this discovery may be of great benefit to mankind.",
    credit: "Invented for this exercise — illustrative of Jenner's own written accounts of his experiments.",
  },
  sourceB: {
    label: 'Source B',
    attribution: 'From a letter written by a London physician in 1798, responding to news of Jenner\'s work.',
    text: 'I confess I view this new practice with great suspicion. To take matter from a diseased cow and place it in the body of a healthy child seems to me both unnatural and dangerous, and I cannot accept that it gives lasting protection against smallpox without further trials over many years. Several of my colleagues share my doubts, and some have refused to recommend it to their patients until it has been more fully proven.',
    credit: 'Invented for this exercise — illustrative of contemporary medical scepticism towards vaccination.',
  },
}

const CCS_SOURCES = {
  enquiry: 'how Casualty Clearing Stations dealt with large numbers of casualties on the Western Front',
  sourceA: {
    label: 'Source A',
    attribution: 'From the diary of a nursing sister at a Casualty Clearing Station, written in 1917, describing a busy period after a major attack.',
    text: 'The wounded arrived in such numbers that the marquees were full within hours, and stretchers had to be laid out along the duckboards outside. A doctor moved quickly along the rows, looking briefly at each man and chalking a letter on his forehead or blanket — those who could wait, those needing the theatre at once, and those for whom nothing more could be done. We worked through the night without stopping, and still more ambulances kept coming.',
    credit: 'Invented for this exercise — illustrative of nursing accounts of Casualty Clearing Stations.',
  },
  sourceB: {
    label: 'Source B',
    attribution: 'From a Royal Army Medical Corps organisational report, 1916, describing staffing arrangements at Casualty Clearing Stations.',
    text: 'Each Casualty Clearing Station is to be staffed with surgeons, physicians, nursing sisters and orderlies sufficient to operate continuously during periods of heavy fighting. Cases are to be sorted on arrival according to the urgency of treatment required, so that limited surgical teams can be directed first to those most likely to benefit. Stations situated nearer the front line receive casualties more quickly but are themselves at greater risk from shelling.',
    credit: 'Invented for this exercise — illustrative of RAMC administrative reports on CCS organisation.',
  },
}

// ── Type B — Explain one way similar/different (4 marks) ────────────────────

const TYPE_B = {
  id: 'explain-similar-different',
  title: 'Explain one way similar or different',
  marksLabel: '4 marks',
  shortDesc: 'Make the comparison explicit — don\'t just describe both sides.',
  commandWord: 'Explain',
  accent: '#C89B6D',
  worked: {
    question: J23_Q3.q,
    marks: 4,
    sources: [],
    examFocus: {
      whatItsAsking: 'This is a comparison question. You need to identify one similarity or difference, use accurate knowledge from BOTH periods, and state the comparison explicitly — using language like "similarly...", "in contrast...", "unlike...", "whereas...", "this was similar/different because...".',
      rewards: [
        'An explicit comparison sentence — not just two facts side by side',
        'Accurate, specific knowledge from both periods being compared',
        'Comparison language that makes the link clear: "similarly", "in contrast", "unlike", "whereas"',
      ],
      commonMistakes: [
        'Describing both periods separately with no link between them',
        'Comparing two things that aren\'t actually comparable',
        'Vague or generalised knowledge of one or both periods',
      ],
      biggestTrap: 'Describing one period, then the other, and leaving the examiner to spot the comparison. You have to make the link explicit yourself.',
    },
    examinerThinking: [
      {
        weakIdea: 'In the medieval period, lepers were sent away from other people. In the modern period, people with Covid had to isolate.',
        whyNot: 'Two facts placed side by side with no comparison — the examiner has to do the work of spotting the similarity, so it isn\'t credited as analysis.',
        strongerIdea: 'In the medieval period, lepers were forced to live apart from the rest of society in leper hospitals — similarly, in the modern period, people with infectious diseases like TB or Covid-19 have been required to isolate from others.',
        whyBetter: 'The word "similarly" makes the comparison explicit — the examiner can see straight away this is the point, supported by accurate detail from both periods.',
      },
      {
        weakIdea: 'Medieval people thought you should stay healthy. Modern people also think you should stay healthy.',
        whyNot: '"Stay healthy" isn\'t specific enough for either period — this shows limited knowledge and understanding (Level 1).',
        strongerIdea: 'In the medieval period, people believed keeping the four humours balanced through diet and exercise helped prevent illness — this is similar to the modern idea of healthy living, such as the "5-a-day" campaign encouraging fruit and vegetables.',
        whyBetter: 'Both halves of the comparison now use specific, named detail — the four humours, the 5-a-day campaign — which is what Level 2 requires.',
      },
    ],
    modelAnswer: {
      sentences: [
        { text: 'One way that ideas about prevention were similar between the medieval and modern periods is the use of isolation to stop disease spreading.', note: 'States the comparison explicitly at the start — the examiner immediately knows what is being compared.' },
        { text: 'In the medieval period, people who had leprosy were forced to live apart from the rest of society, often in leper hospitals outside towns.', note: 'Specific, accurate knowledge of the medieval period (AO1).' },
        { text: 'Similarly, in the modern period, people suffering from infectious diseases such as TB or Covid-19 have been required to isolate from others to prevent the disease spreading.', note: 'Specific knowledge of the modern period, linked back with "similarly" to complete the comparison (AO2).' },
      ],
    },
  },
  attempts: {
    supported: {
      board: 'edexcel', subject: 'history', topic: 'Medieval Medicine c1250–c1500',
      question: 'Explain one way in which methods of treating illness in the medieval period were similar to methods of treating illness in the eighteenth century.',
      marks: 4,
      beatText: 'Your turn — give it a go',
      sections: [
        { label: 'The medieval period', starter: 'In the medieval period,...', placeholder: 'e.g. ...doctors used bloodletting and herbal remedies based on the theory of the Four Humours.' },
        { label: 'The eighteenth century — make the comparison', starter: 'Similarly, in the eighteenth century,...', placeholder: 'e.g. ...Lady Mary Wortley Montagu introduced inoculation against smallpox in 1721.' },
      ],
      markScheme: "Level 2 (3-4 marks): Features of the periods are analysed to explain a similarity [AO2]. Specific information about the topic is added to support the comparison, showing good knowledge and understanding of the periods [AO1].\n\nLevel 1 (1-2 marks): Simple or generalised comment is offered about a similarity. Generalised information about the topic is included, showing limited knowledge and understanding of the periods.\n\nRelevant points may include:\n• In both periods, people used remedies based on existing medical theory rather than full scientific understanding. In the medieval period, doctors used bloodletting and herbal remedies based on the theory of the Four Humours. In the eighteenth century, Lady Mary Wortley Montagu introduced inoculation against smallpox (1721) — a treatment that worked in practice even though no one understood why, since germ theory did not exist until the 1860s.\n• In both periods, treatments could combine accurate observation with incorrect or absent theory, showing that 'it works' did not always mean 'it is understood'.",
    },
    light: {
      board: 'edexcel', subject: 'history', topic: 'Surgery & Anatomy c1700–c1900',
      question: 'Explain one way in which approaches to surgery before 1700 were different from approaches to surgery in the nineteenth century.',
      marks: 4,
      beatText: 'Light support this time',
      sections: [
        { label: 'Surgery before 1700', placeholder: 'What was surgery like before 1700?' },
        { label: 'The nineteenth century — make the comparison', placeholder: 'How was it different — use "in contrast" or "unlike".' },
      ],
      markScheme: "Level 2 (3-4 marks): Features of the periods are analysed to explain a difference [AO2]. Specific information about the topic is added to support the comparison, showing good knowledge and understanding of the periods [AO1].\n\nLevel 1 (1-2 marks): Simple or generalised comment is offered about a difference. Generalised information about the topic is included, showing limited knowledge and understanding of the periods.\n\nRelevant points may include:\n• Before 1700, surgery was performed without anaesthetics or antiseptics, so patients were conscious, in severe pain, and at very high risk of infection. In contrast, by the nineteenth century, anaesthetics such as ether and chloroform (used by Simpson from 1847) removed pain during operations, and Lister's antiseptic method using carbolic acid (1865) greatly reduced infection.\n• This was a significant difference because surgery became both less painful for patients and far safer, allowing surgeons to attempt longer and more complex operations.",
    },
    independent: {
      board: 'edexcel', subject: 'history', topic: 'Public Health c1800–c1900',
      question: 'Explain one way in which government involvement in public health in the medieval period was similar to government involvement in public health in the nineteenth century.',
      marks: 4,
      beatText: 'Last one — no support',
      sections: [
        { label: 'Your answer', placeholder: '' },
      ],
      markScheme: "Level 2 (3-4 marks): Features of the periods are analysed to explain a similarity [AO2]. Specific information about the topic is added to support the comparison, showing good knowledge and understanding of the periods [AO1].\n\nLevel 1 (1-2 marks): Simple or generalised comment is offered about a similarity. Generalised information about the topic is included, showing limited knowledge and understanding of the periods.\n\nRelevant points may include:\n• In the medieval period, some towns introduced local measures during outbreaks of plague, such as restricting the movement of people from infected areas and burying the dead quickly — an early form of government involvement in public health. Similarly, in the nineteenth century, the government passed Public Health Acts (1848 and 1875) which gave local authorities responsibility for clean water, sewers and sanitation.\n• In both periods, action was taken at a local level to try to protect public health, although the scale and compulsory nature of nineteenth-century legislation was much greater than medieval measures.",
    },
  },
}

// ── Type C — Source utility (8 marks) ───────────────────────────────────────

const TYPE_C = {
  id: 'source-utility',
  title: 'How useful are these sources?',
  marksLabel: '8 marks',
  shortDesc: 'Useful for THIS enquiry — link content, provenance and your own knowledge.',
  commandWord: 'How useful',
  accent: '#C89B6D',
  worked: {
    question: J23_Q2A.q,
    marks: 8,
    sources: [J23_SOURCE_A, J23_SOURCE_B],
    examFocus: {
      whatItsAsking: 'Utility means: how useful is this source for THIS exact enquiry — not "is it true" or "is it reliable in general". You must combine the source\'s content, its provenance (who wrote it, when, why), and your own knowledge, all linked back to the enquiry.',
      rewards: [
        'A judgement on how useful each source is for the specific enquiry',
        'Provenance comments that explain WHY that affects usefulness for this enquiry',
        'Own knowledge used to test or develop what the source shows',
      ],
      commonMistakes: [
        'Saying a source is useful "because it\'s primary" with nothing else',
        'Generic provenance comments not linked to the enquiry',
        'Describing the source\'s content without saying how it helps answer the enquiry',
        'Treating "useful" as the same as "true" or "unbiased"',
      ],
      biggestTrap: 'Never let "it\'s primary / biased / reliable" stand alone — every provenance comment must say why that affects how useful the source is for THIS enquiry.',
    },
    examinerThinking: [
      {
        weakIdea: 'Source A is useful because it is a primary source written by someone who was there.',
        whyNot: 'A generic provenance comment — it doesn\'t say anything about why being "there" helps with THIS enquiry into new techniques for dealing with injuries.',
        strongerIdea: 'Source A is useful because the surgeon was personally involved in pioneering new techniques for head injuries, so his diary gives first-hand insight into how a new technique — using a magnetised nail to remove shrapnel — was actually attempted.',
        whyBetter: 'The provenance point (who he was, his role) is now linked directly to the enquiry — it explains why this person\'s account specifically helps.',
      },
      {
        weakIdea: 'Source B might be biased because Gwynedd Lloyd was a volunteer, so it isn\'t very useful.',
        whyNot: 'Assumes "might be biased" automatically means "less useful" — but utility isn\'t about whether a source is biased, it\'s about what it can tell us for this enquiry, even with its limits.',
        strongerIdea: 'Source B is useful because, even though Gwynedd Lloyd was a volunteer without full medical training, her account still describes in detail the practical process of using a new solution to treat infected wounds — directly relevant to the enquiry, even if she couldn\'t explain the science behind it.',
        whyBetter: 'Acknowledges the limitation but still extracts what the source DOES offer for the enquiry — a more sophisticated, Level 3 judgement.',
      },
    ],
    modelAnswer: {
      sentences: [
        { text: "Source A is useful for this enquiry because it shows a surgeon experimenting with a new technique — using a magnetised wire nail to remove a shell fragment from a soldier's brain.", note: 'Content point — directly addresses "new techniques for dealing with injuries" (the enquiry).' },
        { text: 'As the diary of a surgeon who was a pioneer in new techniques for head injuries, Source A gives a first-hand, expert account of how such techniques were developed and tested in practice.', note: 'Provenance point linked to the enquiry — explains why this person\'s perspective specifically helps.' },
        { text: 'This fits with the wider context that head injuries were extremely common on the Western Front before the introduction of the steel Brodie helmet in 1916, so surgeons urgently needed new ways to treat them.', note: 'Own knowledge used to support and contextualise the source\'s content.' },
        { text: 'Source B is useful because it explains the process of using a new liquid solution to wash out and treat infected wounds.', note: 'Content point — another concrete "new technique" relevant to the enquiry.' },
        { text: 'However, as Gwynedd Lloyd was a civilian volunteer rather than a trained medic, her account focuses on the practical experience of carrying out the treatment rather than explaining why it worked — which limits, but does not remove, its usefulness for understanding the technique itself.', note: 'Provenance point that acknowledges a limitation but still links it back to usefulness for the enquiry.' },
        { text: 'This connects to the wider context that wounds on the Western Front were highly prone to infection because of bacteria in the heavily manured soil — exactly the problem this new solution was designed to address.', note: 'Own knowledge linking the source back to the enquiry — completes the Level 3 judgement.' },
      ],
    },
  },
  attempts: {
    supported: {
      board: 'edexcel', subject: 'history', topic: 'Medieval Medicine c1250–c1500',
      question: `How useful are Sources A and B for an enquiry into ${BLACK_DEATH_SOURCES.enquiry}?\n\nExplain your answer, using Sources A and B and your knowledge of the historical context.`,
      marks: 8,
      sources: [BLACK_DEATH_SOURCES.sourceA, BLACK_DEATH_SOURCES.sourceB],
      beatText: 'Your turn — give it a go',
      sections: [
        { label: 'Source A', starter: 'Source A is useful because...', placeholder: 'Content + provenance linked to the enquiry, plus your own knowledge.' },
        { label: 'Source B', starter: 'Source B is useful because...', placeholder: 'Content + provenance linked to the enquiry, plus your own knowledge.' },
      ],
      markScheme: "Level 3 (6-8 marks): Judgements on source utility are given, applying valid criteria with developed reasoning taking into account how provenance affects the usefulness of the source content. Sources are analysed to support reasoning about their utility. Contextual knowledge is used in the process of interpreting the sources and applying criteria for judgements on utility.\n\nLevel 2 (3-5 marks): Judgements on source utility are given using valid criteria. Supported by developed comment on content and/or provenance. Contextual knowledge used directly to support comments on usefulness.\n\nLevel 1 (1-2 marks): A simple judgement on utility is given with undeveloped comment on content and/or provenance. Limited contextual knowledge is deployed.\n\nSource A useful because:\n• Shows that some people responded to the Black Death with religious fear and self-punishment (flagellant processions)\n• Suggests people believed the plague was a punishment from God for sin\n• As a chronicle written by someone living through the period, it records contemporary beliefs and reactions, even if exaggerated\n• A monk's account may emphasise religious explanations because of his own beliefs and role\nContextual knowledge: flagellant movements spread across Europe during the Black Death; the Church taught that plague was sent by God; people often turned to prayer, processions and pilgrimages.\n\nSource B useful because:\n• Shows practical responses — quarantine (watching gates, refusing entry from infected places) and mass burial in pits\n• As an official town record, it likely reflects real measures actually taken, not just rumour or panic\n• Town councils had genuine authority to issue such orders, showing organised local government action\n• Limited in that it does not show how ordinary people felt or whether the orders were obeyed\nContextual knowledge: with around a third of the population dying, churchyards quickly filled; some towns did try to restrict movement and bury victims quickly to limit the spread, though understanding of the cause (miasma/God's punishment, not germs) shaped these measures.",
    },
    light: {
      board: 'edexcel', subject: 'history', topic: 'Surgery & Anatomy c1700–c1900',
      question: `How useful are Sources A and B for an enquiry into ${JENNER_SOURCES.enquiry}?\n\nExplain your answer, using Sources A and B and your knowledge of the historical context.`,
      marks: 8,
      sources: [JENNER_SOURCES.sourceA, JENNER_SOURCES.sourceB],
      beatText: 'Light support this time',
      sections: [
        { label: 'Source A', placeholder: 'Content + provenance linked to the enquiry, plus your own knowledge.' },
        { label: 'Source B', placeholder: 'Content + provenance linked to the enquiry, plus your own knowledge.' },
      ],
      markScheme: "Level 3 (6-8 marks): Judgements on source utility are given, applying valid criteria with developed reasoning taking into account how provenance affects the usefulness of the source content. Sources are analysed to support reasoning about their utility. Contextual knowledge is used in the process of interpreting the sources and applying criteria for judgements on utility.\n\nLevel 2 (3-5 marks): Judgements on source utility are given using valid criteria. Supported by developed comment on content and/or provenance. Contextual knowledge used directly to support comments on usefulness.\n\nLevel 1 (1-2 marks): A simple judgement on utility is given with undeveloped comment on content and/or provenance. Limited contextual knowledge is deployed.\n\nSource A useful because:\n• Shows the actual method Jenner used — taking matter from a cowpox sore and inserting it into a patient, then testing with smallpox matter\n• As Jenner's own first-hand account, it shows his reasoning and confidence in the result\n• Reveals the experimental, trial-based nature of how vaccination was discovered\n• Limited because Jenner, as the discoverer, would want to present his work positively and may not mention failures or risks\nContextual knowledge: Jenner tested his theory on James Phipps in 1796; vaccination (from 'vacca', cow) was based on the observation that milkmaids who caught cowpox rarely caught smallpox; Jenner published his findings in 1798.\n\nSource B useful because:\n• Shows that vaccination was not immediately accepted — many doctors were sceptical and cautious\n• As a letter from a practising physician, it reflects genuine professional opinion at the time, not just official reaction\n• Explains specific reasons for doubt (unnatural method, lack of long-term proof)\n• Limited because it only shows one doctor's view and does not show how opinion changed over time\nContextual knowledge: despite early resistance, vaccination was eventually made compulsory in Britain (1853); Jenner received a parliamentary grant in recognition of his work, but acceptance took time and some opposition continued for decades.",
    },
    independent: {
      board: 'edexcel', subject: 'history', topic: 'Western Front 1914–18',
      question: `How useful are Sources A and B for an enquiry into ${CCS_SOURCES.enquiry}?\n\nExplain your answer, using Sources A and B and your knowledge of the historical context.`,
      marks: 8,
      sources: [CCS_SOURCES.sourceA, CCS_SOURCES.sourceB],
      beatText: 'Last one — no support',
      sections: [
        { label: 'Your answer', placeholder: '' },
      ],
      markScheme: "Level 3 (6-8 marks): Judgements on source utility are given, applying valid criteria with developed reasoning taking into account how provenance affects the usefulness of the source content. Sources are analysed to support reasoning about their utility. Contextual knowledge is used in the process of interpreting the sources and applying criteria for judgements on utility.\n\nLevel 2 (3-5 marks): Judgements on source utility are given using valid criteria. Supported by developed comment on content and/or provenance. Contextual knowledge used directly to support comments on usefulness.\n\nLevel 1 (1-2 marks): A simple judgement on utility is given with undeveloped comment on content and/or provenance. Limited contextual knowledge is deployed.\n\nSource A useful because:\n• Shows the practical reality of triage — sorting casualties by urgency using a chalk system because of overwhelming numbers\n• As a first-hand nursing account, it conveys the pressure and pace of work at a CCS during a major attack\n• Shows that some casualties were judged unlikely to survive and were not prioritised for treatment\n• Limited because it is a personal, emotional account and may not give the full organisational picture\nContextual knowledge: CCSs were set up close behind the front line to deal with casualties quickly; triage systems were developed because of the huge scale of casualties on the Western Front, especially during major offensives.\n\nSource B useful because:\n• Explains the official staffing and triage system behind what Source A describes\n• As an RAMC report, it reflects the planned organisation rather than one person's experience\n• Shows the trade-off between speed (closer to the front) and safety (risk from shelling)\n• Limited because official reports may describe how things were supposed to work rather than what actually happened under pressure\nContextual knowledge: CCSs were part of a 'chain of evacuation' — wounded passed from regimental aid posts to CCSs to base hospitals; triage allowed limited medical staff to be used most effectively given the scale of casualties.",
    },
  },
}

// ── Type D — Source follow-up (4 marks) ─────────────────────────────────────

const TYPE_D = {
  id: 'source-follow-up',
  title: 'How could you follow this up?',
  marksLabel: '4 marks',
  shortDesc: 'A 4-part task, not an essay — detail, question, source type, how it helps.',
  commandWord: 'How could you follow up',
  accent: '#C89B6D',
  worked: {
    question: J23_Q2B.q,
    marks: 4,
    sources: [J23_SOURCE_A],
    examFocus: {
      whatItsAsking: 'This is a structured 4-part task, not an essay. You need to: (1) pick one specific detail from the source, (2) write a question that detail makes you want to ask, (3) name a realistic type of source that could answer it, and (4) explain how that source would help answer your question.',
      rewards: [
        'Picking one precise, named detail — not the source as a whole',
        'A focused, answerable follow-up question linked to that detail',
        'A realistic source type that could plausibly exist and be found',
        'Explaining exactly how the new source would help answer your question',
      ],
      commonMistakes: [
        'Choosing a detail that\'s too broad — "the whole source"',
        'Suggesting "the internet" or another vague source type',
        'Picking a source type that wouldn\'t actually answer your question',
        'Forgetting to explain how the source helps — naming it isn\'t enough',
        'Writing about the whole topic instead of following up the source',
      ],
      biggestTrap: 'A vague, unrealistic follow-up question that isn\'t tied to a specific detail in the source — your question must grow directly out of something you\'ve just read.',
    },
    examinerThinking: [
      {
        weakIdea: 'I would look on the internet to find out more about injuries on the Western Front.',
        whyNot: '"The internet" isn\'t a source type an examiner can credit — it\'s too vague, and doesn\'t connect to anything specific in Source A.',
        strongerIdea: 'I would look for a report in a medical journal about treating brain injuries on the Western Front.',
        whyBetter: 'A realistic, specific source type that could plausibly exist — and it directly follows up the detail about the magnetised nail.',
      },
      {
        weakIdea: 'This would help me find out more about the war.',
        whyNot: '"The war" is the whole topic, not your follow-up question — this doesn\'t explain how the new source answers what you actually asked.',
        strongerIdea: 'This would help because it would explain the techniques being used more widely and show how successful they were.',
        whyBetter: 'Links straight back to the question you asked — the examiner can see exactly what the new source would add.',
      },
    ],
    modelAnswer: {
      sentences: [
        { text: "A detail in Source A that I would follow up is the surgeon's decision to try using a large wire nail as a magnet to remove the shell fragment.", note: '1 mark — picks a specific, named detail from the source rather than the source as a whole.' },
        { text: 'The question I would ask is: how successful were these new techniques for dealing with injuries to the brain?', note: '1 mark — the question grows directly out of the detail and is something the source itself cannot answer.' },
        { text: 'I would look for a report in a medical journal about treating brain injuries on the Western Front.', note: '1 mark — names a realistic, findable source type, not something vague like "the internet".' },
        { text: 'This would help because it would explain the techniques being used more widely and show how successful they were.', note: '1 mark — explicitly links the new source back to the follow-up question, showing how it answers it.' },
      ],
    },
  },
  attempts: {
    supported: {
      board: 'edexcel', subject: 'history', topic: 'Medieval Medicine c1250–c1500',
      question: 'How could you follow up Source A to find out more about flagellant processions during the Black Death?\n\nIn your answer, you must give the question you would ask and the type of source you could use.',
      marks: 4,
      sources: [BLACK_DEATH_SOURCES.sourceA],
      beatText: 'Your turn — give it a go',
      sections: [
        { label: 'Detail I would follow up', starter: 'A detail in Source A that I would follow up is...', placeholder: 'e.g. ...the description of bands of men beating themselves and crying out for mercy.' },
        { label: 'Question I would ask', starter: 'The question I would ask is...', placeholder: 'e.g. ...how widespread were these processions across England?' },
        { label: "Type of source I'd look for", starter: 'I would look for...', placeholder: 'e.g. ...a record from another monastery describing similar events.' },
        { label: 'How this would help', starter: 'This would help because...', placeholder: 'e.g. ...it would show whether this was a local event or happened across the whole country.' },
      ],
      markScheme: "Award 1 mark for selecting a detail in Source A that could form the basis of a follow-up enquiry.\nAward 1 mark for an appropriate follow-up question linked to the detail.\nAward 1 mark for identification of an appropriate source type.\nAward 1 mark for explaining how the source information could help answer the follow-up question.\n\nExample:\n• Detail: 'bands of men went from town to town beating themselves with whips and chains' [1]\n• Question: How widespread were flagellant processions across England during the Black Death? [1]\n• Source type: A chronicle or record from another monastery or town describing flagellant activity elsewhere in England. [1]\n• How it helps: It would show whether this was a local event or part of a wider pattern across the country. [1]\n\nAccept other appropriate alternatives.",
    },
    light: {
      board: 'edexcel', subject: 'history', topic: 'Surgery & Anatomy c1700–c1900',
      question: "How could you follow up Source A to find out more about whether Jenner's vaccination method worked on other patients?\n\nIn your answer, you must give the question you would ask and the type of source you could use.",
      marks: 4,
      sources: [JENNER_SOURCES.sourceA],
      beatText: 'Light support this time',
      sections: [
        { label: 'Detail I would follow up', placeholder: 'A specific detail from Source A...' },
        { label: 'Question I would ask', placeholder: 'A question that detail makes you want to ask...' },
        { label: 'Type of source', placeholder: 'A realistic source that could answer it...' },
        { label: 'How this would help', placeholder: 'How would that source answer your question?' },
      ],
      markScheme: "Award 1 mark for selecting a detail in Source A that could form the basis of a follow-up enquiry.\nAward 1 mark for an appropriate follow-up question linked to the detail.\nAward 1 mark for identification of an appropriate source type.\nAward 1 mark for explaining how the source information could help answer the follow-up question.\n\nExample:\n• Detail: 'Some weeks afterwards I inoculated him again, this time with matter taken from a smallpox sore. No disease followed.' [1]\n• Question: Did this protection from smallpox last when the method was tried on other patients? [1]\n• Source type: A medical journal report from a few years later describing further vaccination trials on other patients. [1]\n• How it helps: It would show whether Jenner's result could be repeated reliably, not just in this one case. [1]\n\nAccept other appropriate alternatives.",
    },
    independent: {
      board: 'edexcel', subject: 'history', topic: 'Western Front 1914–18',
      question: 'How could you follow up Source A to find out more about how the chalk-marking triage system was used at other Casualty Clearing Stations?\n\nIn your answer, you must give the question you would ask and the type of source you could use.',
      marks: 4,
      sources: [CCS_SOURCES.sourceA],
      beatText: 'Last one — no support',
      sections: [
        { label: 'Detail I would follow up', placeholder: '' },
        { label: 'Question I would ask', placeholder: '' },
        { label: 'Type of source', placeholder: '' },
        { label: 'How this would help', placeholder: '' },
      ],
      markScheme: "Award 1 mark for selecting a detail in Source A that could form the basis of a follow-up enquiry.\nAward 1 mark for an appropriate follow-up question linked to the detail.\nAward 1 mark for identification of an appropriate source type.\nAward 1 mark for explaining how the source information could help answer the follow-up question.\n\nExample:\n• Detail: 'A doctor moved quickly along the rows... chalking a letter on his forehead or blanket' [1]\n• Question: Was this chalk-marking triage system used at other Casualty Clearing Stations along the Western Front? [1]\n• Source type: A report or diary from medical staff at a different Casualty Clearing Station. [1]\n• How it helps: It would show whether this was standard practice across the army or particular to this one CCS. [1]\n\nAccept other appropriate alternatives.",
    },
  },
}

// ── Type E — Explain why (12 marks) ─────────────────────────────────────────

const TYPE_E = {
  id: 'explain-why',
  title: 'Explain why',
  marksLabel: '12 marks',
  shortDesc: 'Causes, not a timeline. Go beyond the stimulus points.',
  commandWord: 'Explain why',
  accent: '#C89B6D',
  worked: {
    question: J23_Q4.q,
    marks: 12,
    sources: [],
    examFocus: {
      whatItsAsking: 'This is a causation question — it wants REASONS, not a timeline or a list of discoveries. Keep asking yourself: "have I actually explained WHY?"',
      rewards: [
        'Each reason explains a mechanism — HOW or WHY something caused the change, not just THAT it happened',
        'At least one reason that goes beyond the stimulus points given in the question',
        'Three developed reasons, each linked clearly back to the question\'s focus',
      ],
      commonMistakes: [
        'Telling the story or timeline of events instead of explaining causes',
        'Only using the stimulus points given — this caps your answer at Level 3',
        'Naming a factor without explaining how it actually changed things',
        'Reasons that drift away from the question\'s focus',
      ],
      biggestTrap: 'Sticking only to the stimulus points (e.g. hospitals, GPs) — even if explained well, this caps your answer below the top level. You need at least one reason of your own.',
    },
    examinerThinking: [
      {
        weakIdea: 'Hospitals were built. GPs treated patients. The NHS was created in 1948. Medicine kept improving after that.',
        whyNot: 'This is a timeline of events, not an explanation — it doesn\'t say WHY access to care improved, just that things happened.',
        strongerIdea: 'Access to treatment became more affordable because, before the NHS, many GPs operated a panel system allowing people to pay a small weekly sum — and after 1948, the NHS made treatment free at the point of use, removing the cost barrier that had stopped many people seeking help.',
        whyBetter: 'Names the mechanism (the cost barrier being removed) and explains HOW the change actually improved access — this is causation, not narration.',
      },
      {
        weakIdea: 'GPs could refer patients to hospitals for more treatment.',
        whyNot: 'Names a method (referral) but doesn\'t explain HOW this actually improved access — what difference did referral make?',
        strongerIdea: 'Within the NHS, GPs could refer patients to specialist consultants in hospitals for treatments GPs themselves couldn\'t provide, meaning ordinary people gained access to a much wider range of treatment than before, regardless of their ability to pay privately.',
        whyBetter: 'Explains the mechanism — referral linked GPs to specialist hospital care — and links it directly back to "access", the conceptual focus of the question.',
      },
    ],
    modelAnswer: {
      sentences: [
        { text: 'One reason access to medical care improved in the modern period was the creation of the NHS in 1948.', note: 'States the reason clearly.' },
        { text: 'Before 1948, many people could not afford to see a doctor, although some GPs operated a panel system allowing patients to pay a small weekly sum towards treatment.', note: 'Explains the mechanism behind the old problem — sets up why the change mattered.' },
        { text: 'After 1948, the NHS offered treatment free at the point of use, meaning people no longer had to weigh up the cost of seeing a doctor against their other needs.', note: 'Explains HOW the change worked — the actual mechanism causing improved access.' },
        { text: 'This meant that people who had previously avoided or delayed treatment because of cost were now able to access medical care when they needed it, directly improving access to treatment for the whole population.', note: 'Links the mechanism explicitly back to "access" — the conceptual focus of the question.' },
      ],
    },
  },
  attempts: {
    supported: {
      board: 'edexcel', subject: 'history', topic: 'Medieval Medicine c1250–c1500',
      question: 'Explain why the Church both helped and hindered medicine in the Middle Ages. [12 marks]',
      marks: 12,
      beatText: 'Your turn — give it a go',
      sections: [
        { label: 'One reason', starter: 'One reason was...', placeholder: 'Name a way the Church helped or hindered, then explain HOW.' },
        { label: 'Another reason', starter: 'Another reason was...', placeholder: 'A different reason — explain the mechanism, not just what happened.' },
        { label: 'A further reason', starter: 'A further reason was...', placeholder: 'A third reason, ideally going beyond the obvious points.' },
      ],
      markScheme: "Helped: preserved Galen's texts in universities; ran hospitals like St Bartholomew's (1123); provided care for sick; trained physicians. Hindered: discouraged dissection (body needed to be whole for resurrection); treated Galen's work as unquestionable; linked illness to sin/God's punishment; discouraged new thinking. Strong answers explain the mechanism, not just list.",
    },
    light: {
      board: 'edexcel', subject: 'history', topic: 'Surgery & Anatomy c1700–c1900',
      question: 'Explain why anaesthetics both helped and created new problems for surgery. [12 marks]',
      marks: 12,
      beatText: 'Light support this time',
      sections: [
        { label: 'How anaesthetics helped', placeholder: 'Explain the mechanism — not just "patients felt no pain".' },
        { label: 'New problems they created', placeholder: 'Explain HOW the new problems arose because of anaesthetics.' },
      ],
      markScheme: "Helped: removed pain, patients could stay still, surgeons could work more carefully, longer operations possible. Problems: longer operations increased infection risk; overconfidence led to more ambitious surgery before antiseptics; chloroform could be fatal if overdosed (Hannah Greener, 1848). Strong answers explain both effects with specific evidence.",
    },
    independent: {
      board: 'edexcel', subject: 'history', topic: 'Public Health c1800–c1900',
      question: 'Explain why the government was slow to improve public health in the early 19th century. [12 marks]',
      marks: 12,
      beatText: 'Last one — no support',
      sections: [
        { label: 'Your answer', placeholder: '' },
      ],
      markScheme: "Key reasons: laissez-faire attitude (government should not interfere); cost — ratepayers did not want to pay; miasma theory meant people did not fully understand disease; vested interests (landlords, water companies); local not national responsibility; 1848 Act was optional not compulsory. Strong answers explain mechanism with evidence.",
    },
  },
}

// ── Type F — How far do you agree? (16 marks + 4 SPaG) ──────────────────────

const TYPE_F = {
  id: 'how-far-do-you-agree',
  title: 'How far do you agree?',
  marksLabel: '16 marks + 4 SPaG',
  shortDesc: 'Sustained judgement throughout — not "balance" with a bolted-on ending.',
  commandWord: 'How far do you agree',
  accent: '#C89B6D',
  worked: {
    question: J23_Q5.q,
    marks: 16,
    sources: [],
    examFocus: {
      whatItsAsking: 'This is a judgement question. It needs support, challenge, comparison, SUSTAINED judgement throughout — not just at the end — and a justified conclusion. Don\'t aim for "balance" — aim for a judgement you build and defend as you go, using criteria like significance, scale, how long-lasting a change was, and whether ideas, treatment, prevention or access actually changed.',
      rewards: [
        'A clear line of argument that weighs evidence on both sides using real judgement criteria — significance, scale, how long-lasting, how widespread, whether things actually changed',
        'Sustained judgement language throughout — not just in the conclusion',
        'A conclusion that is justified by what has gone before, not bolted on',
      ],
      commonMistakes: [
        '"On one hand... on the other hand..." with a bolted-on "to some extent" conclusion',
        'Treating "how far do you agree" as "list arguments for and against"',
        'A conclusion that doesn\'t follow from the evidence given',
        'Using only the stimulus points — this caps the level',
      ],
      biggestTrap: '"On one hand... on the other hand..." followed by a vague "so to some extent I agree" — with no sustained judgement built up along the way.',
    },
    examinerThinking: [
      {
        weakIdea: 'On one hand, Sydenham wrote Observationes Medicae. On the other hand, some doctors still used the four humours. So to some extent it was a turning point.',
        whyNot: 'This just lists two facts and bolts on "to some extent" — there\'s no judgement about WHICH matters more, or WHY.',
        strongerIdea: "Sydenham's Observationes Medicae (1676) was significant because it became a standard medical textbook and encouraged doctors to treat the disease itself rather than relying on Galen's Theory of Opposites — but this suggests a shift in medical thinking among the educated elite, not a turning point in the treatment most ordinary people actually received.",
        whyBetter: 'Makes a judgement about the SIGNIFICANCE and SCALE of the change — acknowledging the idea changed, but questioning whether it changed practice widely enough to count as a turning point.',
      },
      {
        weakIdea: 'In conclusion, Sydenham was quite important but not the only factor, so to some extent he was a turning point.',
        whyNot: 'This conclusion doesn\'t follow from any specific argument made earlier — it could be glued onto almost any essay on almost any topic.',
        strongerIdea: "In contrast, treatments based on balancing the four humours, such as bloodletting and purging, continued to be widely used well into the eighteenth century, which suggests that Sydenham's ideas changed medical theory before they changed everyday treatment — meaning the real turning point in treatment came later, once the causes of disease were better understood.",
        whyBetter: 'Builds directly on the earlier point about theory vs practice, and reaches a conclusion justified by the specific evidence and criteria used throughout — not asserted at the last minute.',
      },
    ],
    modelAnswer: {
      sentences: [
        { text: "Sydenham's Observationes Medicae (1676) was important because it became a standard medical textbook and encouraged doctors to classify and treat diseases directly, rather than relying on Galen's Theory of Opposites.", note: 'Establishes the case FOR Sydenham as a turning point, with specific evidence — the named text and date.' },
        { text: "This suggests a real shift in medical thinking among trained doctors, but it does not by itself show that treatment for most people changed — Sydenham's ideas had to spread before they could have a wider impact.", note: 'Sustained judgement — qualifies the significance of the point just made, rather than leaving it to stand alone.' },
        { text: 'In contrast, treatments based on balancing the four humours, such as bloodletting and purging, continued to be widely used well into the eighteenth century, showing strong continuity in everyday practice.', note: '"In contrast" signals the challenge — directly engages with the claim made in the first sentence.' },
        { text: 'This suggests that Sydenham changed medical theory before he changed treatment, so while his work was an important step, the wider turning point in treatment came later, once the causes of disease were better understood.', note: 'A justified conclusion that follows directly from the comparison just made — sustained judgement, not a bolted-on ending.' },
      ],
    },
  },
  attempts: {
    supported: {
      board: 'edexcel', subject: 'history', topic: 'Medieval Medicine c1250–c1500',
      question: 'How far was the Black Death a turning point in the history of medicine? Explain your answer. [16 marks]',
      marks: 16,
      beatText: 'Your turn — give it a go',
      sections: [
        { label: 'For — it was a turning point', starter: 'One way the Black Death was a turning point was...', placeholder: 'Specific evidence, then say what it suggests about change.' },
        { label: 'Against — limited change', starter: 'However, it can be argued that...', placeholder: 'Specific evidence of continuity, linked back to your first point.' },
        { label: 'Your judgement', starter: 'Overall, I think...', placeholder: 'A conclusion that follows from the points above — not a fresh idea.' },
      ],
      markScheme: "Was a turning point: exposed limits of medieval medicine; prompted some public health action. Counter: beliefs and treatments barely changed; humours still dominant after 1349; no new understanding of disease. Strong answers need specific evidence (1348 arrival, a third died, miasma/God's punishment blamed), explain why change/continuity happened, reach clear supported judgement.",
    },
    light: {
      board: 'edexcel', subject: 'history', topic: 'Renaissance & the Plague c1500–c1700',
      question: 'How far did the Renaissance change medicine? Explain your answer. [16 marks]',
      marks: 16,
      beatText: 'Light support this time',
      sections: [
        { label: 'What changed', placeholder: 'Specific evidence of change, with a judgement on its significance.' },
        { label: 'What stayed the same — and your judgement', placeholder: 'Specific evidence of continuity, then a conclusion that weighs both.' },
      ],
      markScheme: "Changed: Vesalius corrected anatomy, Harvey proved circulation, Paré improved surgery, printing press spread ideas. Continuity: treatments barely changed, humours still used, bleeding/purging continued, Great Plague 1665 shows disease understanding remained poor. Strong answers: balanced argument with specific evidence, clear judgement on extent of change.",
    },
    independent: {
      board: 'edexcel', subject: 'history', topic: 'Surgery & Anatomy c1700–c1900',
      question: "How important was Lister's use of antiseptics in improving surgery? [16 marks]",
      marks: 16,
      beatText: 'Last one — no support',
      sections: [
        { label: 'Your answer', placeholder: '' },
      ],
      markScheme: "Important: carbolic acid dramatically reduced infection deaths; applied Pasteur's germ theory practically; changed surgical practice; aseptic surgery followed. Limits: other factors also improved surgery — anaesthetics (Simpson 1847), blood groups, aseptic methods went further; initial resistance from surgeons. Strong answers: weigh against other factors, reach supported judgement.",
    },
  },
}

// ── Type A — Describe two features (4 marks) ────────────────────────────────

const TYPE_A = {
  id: 'describe-two-features',
  title: 'Describe two features',
  marksLabel: '4 marks',
  shortDesc: 'Pick two features and develop each one — not a list of four.',
  commandWord: 'Describe',
  accent: '#C89B6D',
  worked: {
    question: J23_Q1.q,
    marks: 4,
    sources: [],
    examFocus: {
      whatItsAsking: '"Describe two features" means: choose two accurate features and add supporting detail to each. For each one, first identify it clearly, then add a sentence that develops it — what it involved, how it worked, or why it mattered. One mark for identifying each feature, one mark for developing it.',
      rewards: [
        'Choosing two clearly different features — not two versions of the same point',
        'A short supporting sentence for each feature that adds real detail',
        'Specific, named detail — places, processes, examples — not just general statements',
      ],
      commonMistakes: [
        'Listing three or four features with no development',
        'Writing two sentences that are really the same point twice',
        'Vague supporting detail that could apply to almost any feature',
      ],
      biggestTrap: 'Feature-dumping — listing several things in a few words each, hoping quantity will be rewarded. Two well-developed features always beat four undeveloped ones.',
    },
    examinerThinking: [
      {
        weakIdea: 'The trenches were muddy. The trenches were narrow. Stretcher bearers found it hard. There weren\'t many vehicles.',
        whyNot: 'Four features, none developed — the examiner can only credit the first one or two as "identified", and nothing earns the second mark for each feature.',
        strongerIdea: 'The trenches were often flooded and muddy because the ground did not drain well and explosions churned up the soil, which made it very difficult for stretcher bearers to carry the wounded.',
        whyBetter: 'One feature, properly developed — identification (mud and flooding) plus an explanation of why it happened and what effect it had. That\'s 2 marks from a single, well-built point.',
      },
      {
        weakIdea: 'Transport was also difficult.',
        whyNot: '"Transport was difficult" just repeats the question — it doesn\'t tell the examiner anything new.',
        strongerIdea: 'Trenches were dug in a narrow, zig-zag pattern, which made it very hard for stretcher bearers carrying a wounded man to move quickly along them.',
        whyBetter: 'Names a specific feature (narrow zig-zag trenches) and explains its consequence (slow stretcher transport) — a second, independent point worth its own 2 marks.',
      },
    ],
    modelAnswer: {
      sentences: [
        { text: 'One feature was that the trenches were often muddy and flooded.', note: '1 mark — identifies a specific feature of the problem.' },
        { text: 'This was because the ground did not drain well and explosions from shells churned up the soil, making it extremely hard for stretcher bearers to move through.', note: '1 mark — develops the feature with supporting detail: why it happened and its effect.' },
        { text: 'A second feature was that the trenches were narrow and built in a zig-zag pattern.', note: '1 mark — identifies a second, distinct feature.' },
        { text: 'This made it very difficult for stretcher bearers carrying a wounded soldier to move quickly along the trench to safety.', note: '1 mark — develops the second feature, explaining its impact on transporting the wounded.' },
      ],
    },
  },
  attempts: {
    supported: {
      board: 'edexcel', subject: 'history', topic: 'Medieval Medicine c1250–c1500',
      question: 'Describe two features of medieval hospitals. [4 marks]',
      marks: 4,
      beatText: 'Your turn — give it a go',
      sections: [
        { label: 'Feature 1', starter: 'One feature was...', placeholder: 'e.g. ...hospitals were run by the Church, by monks and nuns.' },
        { label: 'Feature 2', starter: 'A second feature was...', placeholder: 'e.g. ...they focused on care and prayer rather than curing disease.' },
      ],
      markScheme: "Award up to 2 marks per feature (1 for identifying, 1 for supporting detail). Features include: run by the Church/monks/nuns; focused on care and prayer rather than curing disease; St Bartholomew's Hospital founded 1123; patients prayed and received basic care; hospitals were places of rest not medical treatment; staffed by religious orders.",
    },
    light: {
      board: 'edexcel', subject: 'history', topic: 'Surgery & Anatomy c1700–c1900',
      question: 'Describe two problems with surgery before the 1840s. [4 marks]',
      marks: 4,
      beatText: 'Light support this time',
      sections: [
        { label: 'Problem 1', placeholder: 'Identify the problem, then add a detail about its effect.' },
        { label: 'Problem 2', placeholder: 'Identify a different problem, then add a detail about its effect.' },
      ],
      markScheme: 'Award up to 2 marks per problem. Problems: no anaesthetic so patients conscious and in pain; no antiseptics so infection was common; no blood transfusions so blood loss often fatal; dirty instruments spread infection; surgeons judged on speed not care.',
    },
    independent: {
      board: 'edexcel', subject: 'history', topic: 'Public Health c1800–c1900',
      question: 'Describe two features of the 1875 Public Health Act. [4 marks]',
      marks: 4,
      beatText: 'Last one — no support',
      sections: [
        { label: 'Your answer', placeholder: '' },
      ],
      markScheme: 'Award up to 2 marks per feature. Features: compulsory clean water supply; compulsory sewage systems; local authorities had to appoint medical officers of health; made sanitation improvements mandatory; shift away from laissez-faire; built on the weaker 1848 Act.',
    },
  },
}

export const GUIDED_COACH_TYPES = [TYPE_A, TYPE_B, TYPE_C, TYPE_D, TYPE_E, TYPE_F]
