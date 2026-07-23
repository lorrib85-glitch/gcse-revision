// ─── Edexcel GCSE History Paper 1 — June 2023 ────────────────────────────────
// Option 11: Medicine in Britain, c1250–present
// and The British sector of the Western Front, 1914–18
// Ref: 1HI0/11 | Thursday 18 May 2023 | 1 hour 15 minutes | 52 marks

import { SUBJECTS } from '../constants/subjects.js'

const PAPER_SUBJECT = 'History'

// ── Sources Booklet ───────────────────────────────────────────────────────────

export const J23_SOURCE_A = {
  label: 'Source A',
  attribution: 'From the diary of a surgeon on the Western Front, 29 April 1915. He was a pioneer in new techniques of dealing with head injuries. Here he is describing an early attempt at brain surgery with the use of a magnetised nail to remove metal fragments.',
  text: 'Several unsuccessful trials this morning to extract a shell fragment from a soldier\'s brain. Finally, we decided to try using a large wire nail as a magnet. A crowd in the X-ray room and corridor watched as we inserted the nail into the brain. Slowly we extracted the nail – nothing on it! Sighs and groans. I tried again. More sighs, and people began to go out. A third time – nothing. But then I decided to try just once more. And there it was, a little fragment of steel attached to the tip of the nail! Much emotion from everyone!',
  credit: 'Source taken from http://www.vlib.us/medical/Cushing/journal02.html',
}

export const J23_SOURCE_B = {
  label: 'Source B',
  attribution: 'From an account by Gwynedd Lloyd, written in 1915. Lloyd was a civilian volunteer, working at a General Hospital on the Western Front, and had experience in treating injuries. Here she is describing the use of a new liquid solution to treat infected wounds.',
  text: 'We had to mix the liquid solution in large amounts. Tubes were inserted into infected wounds. We used a big syringe to inject this solution into the tubes every three hours so that it would wash round the wound. Even at night, we had to wake the men up to do this. It was very painful for the patients but the infection often started to decrease.\n\nUnfortunately, if the infection was very bad, the wounded limb might still have to be amputated or sometimes the man died. Nevertheless, we did manage to save a great many lives through this treatment.',
  credit: 'Source taken from The Imperial War Museum book of The Western Front by Malcolm Brown © Pan Books, 1991',
}

// ── Individual questions (also used in PAST_PAPER_QS pool) ───────────────────

// Section A — The British sector of the Western Front, 1914–18

export const J23_Q1 = {
  id: 'j23p1_q1',
  q: 'Describe two features of the problems involved in transporting wounded soldiers away from the battleground.\n\nFeature 1:\n\nFeature 2:',
  marks: 4,
  type: 'written',
  commandWord: 'Describe',
  topic: 'Western Front — transport of wounded',
  topicLabel: 'Western Front 1914–18',
  topicId: 'th_wf',
  paper: 'Edexcel Paper 1 — June 2023 (1HI0/11)',
  tags: ['history:medicine', 'history:medicine:chain-of-evacuation', 'history:medicine:trench-system', 'period:western-front', 'theme:war', 'format:written', 'exam-type:describe-two-features', 'skill:recall'],
  ms: `Award 1 mark for each valid feature identified, up to a maximum of two features. The second mark should be awarded for supporting information.\n\n• The recovery and transport of the wounded was made difficult by mud and flooded trenches [1]. The ground did not drain well and explosives churned up the soil [1].\n• Transport along the trenches was difficult, especially for stretcher bearers [1]. The trenches were narrow and constructed in a zig-zag pattern [1].\n• It was difficult to get motorised transport or railways close to the battleground [1]. Horse-drawn ambulances were often used but could not carry many people [1].\n\nAccept other appropriate features and supporting information.`,
}

export const J23_Q2A = {
  id: 'j23p1_q2a',
  q: 'How useful are Sources A and B for an enquiry into new techniques being used on the Western Front to deal with injuries?\n\nExplain your answer, using Sources A and B and your knowledge of the historical context.',
  marks: 8,
  type: 'written',
  commandWord: 'How useful',
  topic: 'Western Front — source utility',
  topicLabel: 'Western Front 1914–18',
  topicId: 'th_wf',
  paper: 'Edexcel Paper 1 — June 2023 (1HI0/11)',
  tags: ['history:medicine', 'history:medicine:brain-surgery', 'history:medicine:wound-infection', 'period:western-front', 'theme:war', 'format:written', 'exam-type:source-utility', 'skill:source-analysis'],
  extract: 'SOURCE A (Surgeon\'s diary, 29 April 1915): "Several unsuccessful trials this morning to extract a shell fragment from a soldier\'s brain. Finally, we decided to try using a large wire nail as a magnet... a little fragment of steel attached to the tip of the nail! Much emotion from everyone!" (Pioneer in new techniques of dealing with head injuries.)\n\nSOURCE B (Gwynedd Lloyd, 1915, civilian volunteer at a General Hospital): "We had to mix the liquid solution in large amounts. Tubes were inserted into infected wounds... it was very painful for the patients but the infection often started to decrease... we did manage to save a great many lives through this treatment."',
  ms: `Level 3 (6–8 marks): Judgements on source utility are given, applying valid criteria with developed reasoning taking into account how provenance affects the usefulness of the source content. Sources are analysed to support reasoning about their utility. Contextual knowledge is used in the process of interpreting the sources and applying criteria for judgements on utility.\n\nLevel 2 (3–5 marks): Judgements on source utility are given using valid criteria. Supported by developed comment on content and/or provenance. Contextual knowledge used directly to support comments on usefulness.\n\nLevel 1 (1–2 marks): A simple judgement on utility is given with undeveloped comment on content and/or provenance. Limited contextual knowledge is deployed.\n\nSource A useful because:\n• Shows a new technique (magnetised nail) being used to deal with a head injury\n• Suggests surgeons had to experiment to find successful treatment for injuries caused by shrapnel\n• As a surgeon's diary, records the thoughts and feelings of the person directly involved in developing new techniques\n• As a pioneering surgeon in 1915, provides expert insight into the process of developing new techniques\nContextual knowledge: head wounds were common before the Brodie helmet (1916); X-ray rooms were situated at Base Hospitals and Casualty Clearing Stations.\n\nSource B useful because:\n• Explains the process of using a new solution (Carrel-Dakin) to deal with wound infection\n• Gwynedd Lloyd's personal account includes insight into how difficult the procedure was and how painful it was for the patient\n• She was a volunteer who possibly had little medical knowledge, so she probably could not give a full explanation\nContextual knowledge: soil on the Western Front was full of bacteria causing infection and gangrene; Carrel-Dakin solution or wound abridement used to treat infected wounds.`,
}

export const J23_Q2B = {
  id: 'j23p1_q2b',
  q: 'How could you follow up Source A to find out more about new techniques being used on the Western Front to deal with injuries?\n\nIn your answer, you must give the question you would ask and the type of source you could use. Complete the table below:\n\nDetail in Source A that I would follow up:\n\nQuestion I would ask:\n\nWhat type of source I could use:\n\nHow this might help answer my question:',
  marks: 4,
  type: 'written',
  commandWord: 'How could you follow up',
  topic: 'Western Front — source follow-up',
  topicLabel: 'Western Front 1914–18',
  topicId: 'th_wf',
  paper: 'Edexcel Paper 1 — June 2023 (1HI0/11)',
  tags: ['history:medicine', 'history:medicine:brain-surgery', 'period:western-front', 'theme:war', 'format:written', 'exam-type:source-follow-up', 'skill:source-analysis'],
  extract: 'SOURCE A (Surgeon\'s diary, 29 April 1915): "Several unsuccessful trials this morning to extract a shell fragment from a soldier\'s brain. Finally, we decided to try using a large wire nail as a magnet. A crowd in the X-ray room and corridor watched as we inserted the nail into the brain. Slowly we extracted the nail – nothing on it!... And there it was, a little fragment of steel attached to the tip of the nail! Much emotion from everyone!"',
  ms: `Award 1 mark for selecting a detail in Source A that could form the basis of a follow-up enquiry.\nAward 1 mark for an appropriate follow-up question linked to the detail.\nAward 1 mark for identification of an appropriate source type.\nAward 1 mark for explaining how the source information could help answer the follow-up question.\n\nExample:\n• Detail: 'Finally, we decided to try using a large wire nail as a magnet.' [1]\n• Question: How successful were the new techniques for dealing with injuries to the brain? [1]\n• Source type: A report in a medical journal about dealing with injuries to the brain. [1]\n• How it helps: It would explain the techniques in use and how successful they were. [1]\n\nAccept other appropriate alternatives.`,
}

// Section B — Medicine in Britain, c1250–present

export const J23_Q3 = {
  id: 'j23p1_q3',
  q: 'Explain one way in which ideas about prevention of illness in the medieval period were similar to ideas about the prevention of illness in the modern period.',
  marks: 4,
  type: 'written',
  commandWord: 'Explain',
  topic: 'Medieval medicine — similarity with modern period',
  topicLabel: 'Medieval Medicine c1250–c1500',
  topicId: 'th1',
  paper: 'Edexcel Paper 1 — June 2023 (1HI0/11)',
  tags: ['history:medicine', 'history:medicine:four-humours', 'history:medicine:quarantine', 'period:medieval', 'period:modern', 'theme:change-continuity', 'format:written', 'exam-type:explain-similar-different', 'skill:analysis'],
  ms: `Level 2 (3–4 marks): Features of the period are analysed to explain a similarity [AO2]. Specific information about the topic is added to support the comparison, showing good knowledge and understanding of the periods [AO1].\n\nLevel 1 (1–2 marks): Simple or generalised comment is offered about a similarity. Generalised information about the topic is included, showing limited knowledge and understanding of the periods.\n\nRelevant points may include:\n• In both periods, there was the idea that it was important to stay healthy in order to prevent illness. In the medieval period, the idea of keeping your humours balanced and staying healthy was similar to the modern idea about healthy living, for example the 5-a-day campaign.\n• In both periods, there was the idea that isolation could prevent the spread of illness. In the medieval period, lepers were forced to live apart from society and in the modern period, people suffering from TB or Covid have been required to isolate.`,
}

export const J23_Q4 = {
  id: 'j23p1_q4',
  q: 'Explain why access to medical care and treatment improved in the modern period.\n\nYou may use the following in your answer:\n• hospitals\n• General Practitioners (GPs)\n\nYou must also use information of your own.',
  marks: 12,
  type: 'written',
  commandWord: 'Explain why',
  topic: 'Modern medicine — access to care',
  topicLabel: 'Modern Medicine c1900–present',
  topicId: 'th_modern',
  paper: 'Edexcel Paper 1 — June 2023 (1HI0/11)',
  tags: ['history:medicine', 'history:medicine:nhs', 'period:modern', 'theme:public-health', 'format:written', 'exam-type:explain-why', 'skill:analysis'],
  ms: `Level 4 (10–12 marks): An analytical explanation is given which is directed consistently at the conceptual focus of the question, showing a line of reasoning that is coherent, sustained and logically structured [AO2]. Accurate and relevant information is precisely selected to address the question directly, showing wide-ranging knowledge and understanding [AO1]. No access to Level 4 for answers which do not go beyond aspects prompted by the stimulus points.\n\nLevel 3 (7–9 marks): An explanation is given, showing some analysis, which is mainly directed at the conceptual focus of the question. It shows a line of reasoning that is generally sustained. Accurate and relevant information included, showing good knowledge and understanding. Maximum 8 marks for Level 3 answers that do not go beyond aspects prompted by the stimulus points.\n\nLevel 2 (4–6 marks): An explanation is given, showing limited analysis with implicit or unsustained links to the conceptual focus. It shows some development and organisation of material, but a line of reasoning is not sustained [AO2]. Accurate and relevant information included, showing some knowledge and understanding of the period [AO1]. Maximum 5 marks for Level 2 answers that do not go beyond aspects prompted by the stimulus points.\n\nLevel 1 (1–3 marks): A simple or generalised answer is given, lacking development and organisation. Limited knowledge and understanding of the topic is shown.\n\nRelevant points may include:\n• Access to treatment for ordinary people who could not afford to see a doctor improved because many town councils and charities set up infirmaries that had outpatient departments.\n• Access to a full range of treatments became available because GPs in the NHS were able to refer patients to receive specialist treatment from consultants in hospitals.\n• During the 1920s, specialist hospitals were set up to provide treatment for TB patients.\n• Access to treatment became more affordable in the early twentieth century because many GPs began to operate a panel system, allowing people to pay a weekly sum in order to access treatment when needed.\n• After 1948, the NHS offered treatment free at the point of access, meaning that people felt more able to seek treatment.\n• Improvements in training for doctors and nurses made specialist treatment more widely available.`,
}

export const J23_Q5 = {
  id: 'j23p1_q5',
  q: '\'The work of Thomas Sydenham was the key turning point in medicine in the years c1500–c1700.\'\n\nHow far do you agree? Explain your answer.\n\nYou may use the following in your answer:\n• Sydenham\'s Observationes Medicae (1676)\n• the Four Humours\n\nYou must also use information of your own.',
  marks: 16,
  type: 'written',
  commandWord: 'How far do you agree',
  topic: 'c1500–c1700 — Sydenham as turning point',
  topicLabel: 'Renaissance & the Plague c1500–c1700',
  topicId: 'th2',
  paper: 'Edexcel Paper 1 — June 2023 (1HI0/11)',
  tags: ['history:medicine', 'history:medicine:sydenham', 'history:medicine:four-humours', 'history:medicine:vesalius', 'history:medicine:harvey', 'period:renaissance', 'theme:change-continuity', 'format:written', 'exam-type:how-far-do-you-agree', 'skill:extended-writing'],
  note: 'EITHER Q5 or Q6 — choose one. SPaG marks available (up to 4 additional marks). Total 20 marks.',
  ms: `AO2: 10 marks | AO1: 6 marks | SPaG: up to 4 additional marks. Total: 20 marks.\n\nLevel 4 (13–16 marks): An analytical explanation directed consistently at the conceptual focus, showing a line of reasoning that is coherent, sustained and logically structured [AO2]. Accurate and relevant information is precisely selected [AO1]. Criteria for the required judgement are justified and applied in reaching the overall judgement. No access to Level 4 without going beyond aspects prompted by the stimulus points.\n\nLevel 3 (9–12 marks): An explanation showing some analysis, mainly directed at the conceptual focus. Generally sustained line of reasoning. Good knowledge. Judgement given with some justification. Maximum 11 marks if restricted to stimulus points.\n\nLevel 2 (5–8 marks): Limited analysis with implicit or unsustained links. Some development and organisation. Judgement given but justification asserted or insecure. Maximum 7 marks if restricted to stimulus points.\n\nLevel 1 (1–4 marks): Simple or generalised answer. Limited knowledge. Judgement missing or asserted.\n\nPoints in favour of Sydenham as the key turning point:\n• Published Observationes Medicae (1676) — became a standard medical textbook, replacing emphasis on Galen's ideas\n• Classified diseases and stressed treating the disease not just the symptoms — contrary to Galen's Theory of Opposites\n• Encouraged use of cinchona bark (quinine) for ague and malaria — a new, successful treatment recently discovered in the Americas\n• One of the first to use iron to treat anaemia — a new and effective approach\n\nPoints against / alternative turning points:\n• Many treatments continued to be based on the idea of balancing the humours\n• Although Sydenham's ideas began to be taught and accepted, they had limited impact on the treatment of plague and smallpox\n• Until there was a better understanding of the causes of illness, there was little change in treatments or prevention\n• Other developments were more significant: Vesalius, Harvey, the Royal Society, the printing press, the Great Plague in London 1665, the Reformation\n\nSPaG: 0 (errors severe/nothing written), 1 (threshold — reasonable accuracy, some control of grammar, limited specialist terms), 2–3 (intermediate — considerable accuracy, general control of grammar, good range of specialist terms), 4 (high — consistent accuracy, effective control of grammar, wide range of specialist terms)`,
}

export const J23_Q6 = {
  id: 'j23p1_q6',
  q: '\'People\'s attitudes about medicine, in the years c1700–c1900, became increasingly positive.\'\n\nHow far do you agree? Explain your answer.\n\nYou may use the following in your answer:\n• vaccination\n• infectious diseases\n\nYou must also use information of your own.',
  marks: 16,
  type: 'written',
  commandWord: 'How far do you agree',
  topic: 'c1700–c1900 — attitudes to medicine',
  topicLabel: 'Surgery & Anatomy c1700–c1900',
  topicId: 'th3',
  paper: 'Edexcel Paper 1 — June 2023 (1HI0/11)',
  tags: ['history:medicine', 'history:medicine:jenner', 'history:medicine:vaccination', 'period:18th-19th-century', 'theme:change-continuity', 'format:written', 'exam-type:how-far-do-you-agree', 'skill:extended-writing'],
  note: 'EITHER Q5 or Q6 — choose one. SPaG marks available (up to 4 additional marks). Total 20 marks.',
  ms: `AO2: 10 marks | AO1: 6 marks | SPaG: up to 4 additional marks. Total: 20 marks.\n\nLevel 4 (13–16 marks): An analytical explanation directed consistently at the conceptual focus, showing a line of reasoning that is coherent, sustained and logically structured [AO2]. Accurate and relevant information is precisely selected [AO1]. Criteria for the required judgement are justified and applied. No access to Level 4 without going beyond aspects prompted by the stimulus points.\n\nLevel 3 (9–12 marks): Some analysis, mainly directed at conceptual focus. Generally sustained reasoning. Good knowledge. Judgement with some justification. Maximum 11 marks if restricted to stimulus points.\n\nLevel 2 (5–8 marks): Limited analysis. Some development and organisation. Judgement given but justification asserted or insecure. Maximum 7 marks if restricted to stimulus points.\n\nLevel 1 (1–4 marks): Simple or generalised answer. Limited knowledge. Judgement missing or asserted.\n\nPoints in favour of increasingly positive attitudes:\n• Public acceptance of Jenner's work on smallpox vaccination demonstrated by a parliamentary grant and public recognition of the improvement in prevention of illness\n• The work of individuals such as Edward Jenner and John Snow created a positive attitude towards medicine — they showed improvements could have a big impact on people's daily lives and health\n• Increasing public respect for doctors and medicine during the nineteenth century as the standard of medical qualifications improved and the General Medical Council was founded\n• Respect for medicine increased as it began to be seen as having a scientific basis following the work of Pasteur and Koch\n\nPoints against / continuity of negative attitudes:\n• The knowledge that doctors could not treat infectious diseases and many chronic conditions meant that public attitudes were often negative\n• People were often critical of medicine and were slow to accept it when doctors tried new ideas — Jenner's ideas were ridiculed\n• Treatment was often ineffective and throughout the period there was little progress in treatment, so there was limited respect for medicine\n• Access to doctors remained expensive and therefore most people had little direct experience of the improved standard of medicine, meaning attitudes often remained negative\n\nSPaG: 0 (errors severe/nothing written), 1 (threshold — reasonable accuracy, some control of grammar, limited specialist terms), 2–3 (intermediate — considerable accuracy, general control of grammar, good range of specialist terms), 4 (high — consistent accuracy, effective control of grammar, wide range of specialist terms)`,
}

// ── Full paper (for timed exam mode) ─────────────────────────────────────────

export const MEDICINE_2023_PAPER = {
  id: 'edexcel-1hi0-11-june2023',
  title: 'Edexcel History Paper 1 — June 2023',
  subtitle: 'Medicine in Britain, c1250–present & Western Front 1914–18',
  ref: '1HI0/11',
  year: 2023,
  board: 'Edexcel',
  date: 'Thursday 18 May 2023',
  totalMarks: 52,
  timeMins: 75,
  subject: PAPER_SUBJECT,
  color: SUBJECTS[PAPER_SUBJECT].subjectBrowserAccent,
  // Paper-level learning-graph tags; each question keeps its own concept tags
  tags: ['history:medicine', 'paper:medicine', 'examboard:edexcel', 'tier:gcse'],
  // Full ordered question list for the paper view (with rendering metadata)
  questions: [
    { ...J23_Q1, sectionHeader: 'Section A — The British sector of the Western Front, 1914–18', sectionNote: 'Answer Questions 1 and 2.', sourcesBooklet: [J23_SOURCE_A, J23_SOURCE_B] },
    { ...J23_Q2A, sourceRefs: ['A', 'B'] },
    { ...J23_Q2B, sourceRefs: ['A'] },
    { ...J23_Q3, sectionHeader: 'Section B — Medicine in Britain, c1250–present', sectionNote: 'Answer Questions 3 and 4. Then answer EITHER Question 5 OR Question 6.' },
    { ...J23_Q4 },
    { ...J23_Q5, isChoice: true, choiceHeader: 'Answer EITHER Question 5 OR Question 6', spagNote: 'Spelling, punctuation, grammar and use of specialist terminology will be assessed in this question. Up to 4 additional marks available.' },
    { ...J23_Q6, isChoice: true, spagNote: 'Spelling, punctuation, grammar and use of specialist terminology will be assessed in this question. Up to 4 additional marks available.' },
  ],
}

export const ALL_MEDICINE_PAPERS = [MEDICINE_2023_PAPER]
