// ─── AQA GCSE Sociology Paper 1 — November 2020 ──────────────────────────────
// Section A: The Sociology of Families (50 marks of 100 total)
// Ref: 8192/1 | November 2020 (sat as June 2020 series) | 1 hr 45 mins
// This file contains Section A (Families) only.

const PAPER_ID = 'aqa-8192-1-nov2020'
const TOPIC_ID = 'soc_families'

// ── Sources ───────────────────────────────────────────────────────────────────

const ITEM_A = {
  id: 'item-a',
  label: 'Item A',
  type: 'image',
  src: '/exam-papers/sociology/aqa/8192-1/2020/nov-item-a.png',
  alt: 'Bar chart showing the number of cohabiting couple families in the United Kingdom from 1996 to 2019 in millions, showing a clear upward trend from approximately 1.5 million in 1996 to approximately 3.6 million in 2019.',
  caption: 'Number of cohabiting couple families in the United Kingdom, 1996–2019 (Office for National Statistics)',
}

// Item B text reconstructed from mark scheme context; verify against original paper.
const ITEM_B = {
  id: 'item-b',
  label: 'Item B',
  type: 'text',
  attribution: 'Adapted from Talcott Parsons, The Social System (1951) and Family, Socialisation and Interaction Process (1956)',
  text: `Talcott Parsons argued from a functionalist perspective that the nuclear family performs two essential functions that are irreducible in all modern industrial societies.

The first is the primary socialisation of children. Parsons believed that children learn the basic norms, values and culture of their society within the family. Through this process, children come to accept society's shared values and can function as members of society.

The second is the stabilisation of adult personalities. Parsons suggested that everyday life outside the family — particularly in the workplace — can be stressful and demanding for adults. The family provides a setting in which husband and wife support each other emotionally and can relax and unwind. Within the nuclear family, Parsons identified two complementary roles: the instrumental role, typically performed by the father as breadwinner, and the expressive role, typically performed by the mother who provides care and emotional warmth for children. He argued that these roles were essential for the smooth functioning of society.`,
}

// ── Questions ─────────────────────────────────────────────────────────────────

export const EP_AQA8192_N20_Q01 = {
  id: `${PAPER_ID}-q01`,
  paperId: PAPER_ID,
  number: '01',
  q: 'What term is commonly used by sociologists to describe a pattern of divorce and remarriage where an individual marries several times but only to one partner at a time?\n\nA  Monogamy\nB  Cohabitation\nC  Reconstituted family\nD  Serial monogamy',
  marks: 1,
  type: 'written',
  commandWord: null,
  sourceRefs: [],
  ms: 'D (Serial monogamy)',
  topic: 'Marriage — serial monogamy',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N20_Q02 = {
  id: `${PAPER_ID}-q02`,
  paperId: PAPER_ID,
  number: '02',
  q: 'What term is commonly used by sociologists to describe when two adults with children from previous relationships remarry to form a new family?\n\nA  Extended family\nB  Reconstituted family\nC  Lone parent family\nD  Nuclear family',
  marks: 1,
  type: 'written',
  commandWord: null,
  sourceRefs: [],
  ms: 'B (Reconstituted family / blended family)',
  topic: 'Family types — reconstituted family',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N20_Q03 = {
  id: `${PAPER_ID}-q03`,
  paperId: PAPER_ID,
  number: '03',
  q: 'Describe a dual career family.',
  marks: 3,
  type: 'written',
  commandWord: 'Describe',
  sourceRefs: [],
  ms: `Level 3 (3 marks): A coherent description with few inaccuracies. Demonstrates good knowledge and understanding.
Level 2 (2 marks): A partial description with some inaccuracies and omissions.
Level 1 (1 mark): Fragments of knowledge, some inaccurate or irrelevant.

Indicative content:
• A family in which both parents have paid employment outside of the home.
• The jobs are professions/career based with advancement goals rather than temporary work.
• Both partners pursue an independent career.
• Linked to the idea of the neo-conventional family and dual-breadwinner/earner/worker family.`,
  topic: 'Family types — dual career family',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N20_Q04 = {
  id: `${PAPER_ID}-q04`,
  paperId: PAPER_ID,
  number: '04',
  q: 'Identify and describe one factor that may have led to an increase in the number of lone parent families in Britain.',
  marks: 3,
  type: 'written',
  commandWord: 'Identify and describe',
  sourceRefs: [],
  ms: `Level 3 (3 marks): A coherent description with few inaccuracies. Demonstrates good knowledge and understanding.
Level 2 (2 marks): A partial description with some inaccuracies and omissions.
Level 1 (1 mark): Fragments of knowledge, some inaccurate or irrelevant.

Indicative content:
• Divorce — e.g. legal changes have made divorce easier, quicker and cheaper to obtain.
• Changes in the labour market — e.g. women are less economically dependent on men.
• Changing social attitudes — e.g. attitudes towards marriage and the status of lone parents have become more accepting.`,
  topic: 'Lone parent families — factors in increase',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N20_Q05 = {
  id: `${PAPER_ID}-q05`,
  paperId: PAPER_ID,
  number: '05',
  q: 'From Item A, examine one strength of using statistics to research cohabiting couple families.',
  marks: 2,
  type: 'written',
  commandWord: 'Examine',
  sourceRefs: ['item-a'],
  ms: `1 mark for identifying a possible strength (AO3) demonstrating a line of argument relating to methods or findings.
1 mark for evaluating (making a judgement/conclusion) why this element represents a possible strength.

Indicative content:
• Official statistics are subject to government guidelines/official standards — therefore more likely to be valid and trustworthy.
• Provides a readily available (frequently online) source of data for sociologists — therefore accessible and relatively cheap to obtain, allowing for comparisons with other sources.
• The data is collected over a period of time and can be used to identify trends — therefore useful for researching patterns of change in cohabiting couple families.
• The data can be used to challenge assumptions about the rate of cohabitation or qualify media coverage.`,
  topic: 'Research methods — strengths of official statistics',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N20_Q06 = {
  id: `${PAPER_ID}-q06`,
  paperId: PAPER_ID,
  number: '06',
  q: 'Describe the type of statistical data shown in Item A.\n\nIdentify the trend shown by the data and explain one factor which may account for this trend.',
  marks: 4,
  type: 'written',
  commandWord: 'Describe, Identify and explain',
  sourceRefs: ['item-a'],
  ms: `Level 4 (4 marks): Relevant description of the data (AO1). Upward trend identified and an appropriate, detailed, well-developed explanation with clear application to the context (increase in number of cohabiting couple families in the UK).
Level 3 (3 marks): Data described. Trend identified with explanation containing some inaccuracies or omissions.
Level 2 (2 marks): Data described. Trend identified with either no explanation or a largely inaccurate explanation.
Level 1 (1 mark): Relevant description of the data only.

Indicative content (AO1): Official statistics (collected by or on behalf of the government) showing the number of cohabiting couple families in the United Kingdom. Accept interval data as correct. 'Quantitative data' alone or description of the chart type are incorrect answers.
Indicative content (AO2):
• The trend is up (accept increasing or rising).
• Changing social attitudes — e.g. cohabitation is seen as more socially acceptable within some social groups.
• Secularisation — e.g. the declining influence of religion in society and therefore of religiously sanctioned marriage amongst some social groups.
• Expense of marriage — e.g. cohabitation may be seen as a cheaper option to marriage by some couples.`,
  topic: 'Cohabitation — trends and explanations',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N20_Q07 = {
  id: `${PAPER_ID}-q07`,
  paperId: PAPER_ID,
  number: '07',
  q: 'Identify and explain one disadvantage of using postal questionnaires to investigate attitudes towards cohabitation.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and explain',
  sourceRefs: [],
  ms: `Level 4 (4 marks): Relevant disadvantage selected (AO1) and an appropriate, detailed and well-developed explanation with good application to the context (attitudes towards cohabitation).
Level 3 (3 marks): Relevant disadvantage with explanation containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant disadvantage with a largely inaccurate or irrelevant explanation.
Level 1 (1 mark): Relevant disadvantage selected only.

Indicative content (AO1): Lack of flexibility, low response rates, quality of data, bias, validity.
Indicative content (AO2):
• Lack of flexibility — postal questionnaires close off, rather than open up, new and interesting issues about cohabitation, limiting opportunities for respondents to express their own views.
• Low response rates — respondents may be unrepresentative of cohabiting couples, raising questions about the validity of any results.
• Quality of data — postal questionnaires do not allow for the collection of in-depth qualitative data about attitudes towards cohabitation as they are based on pre-set standardised questions.
• Bias — the wording and focus of the questions are predetermined by the researcher, imposing their own prior assumptions on the respondent.
• Validity — there is no way of knowing who has actually completed the questionnaire, or whether the questions have been correctly interpreted.`,
  topic: 'Research methods — disadvantages of postal questionnaires',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N20_Q08 = {
  id: `${PAPER_ID}-q08`,
  paperId: PAPER_ID,
  number: '08',
  q: 'From Item B, identify and describe one way in which the family can be seen as important for society, including what you know of Parsons\' perspective on the family.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and describe',
  sourceRefs: ['item-b'],
  ms: `Level 4 (4 marks): Relevant ideas selected (AO1) and an appropriate, detailed and well-developed description of relevant sociological theories, concepts, evidence and methods with good application to the context (Parsons' functionalist perspective on the family).
Level 3 (3 marks): Relevant ideas selected with description containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant ideas selected with a largely inaccurate or irrelevant description.
Level 1 (1 mark): Relevant idea selected only.

Indicative content (AO1): Functionalist perspective, primary socialisation of children, stabilisation of adult personalities.
Indicative content (AO2):
• Parsons wrote from a functionalist perspective. He identified two vital functions that families perform in all societies: the primary socialisation of children and the stabilisation of adult personalities.
• Primary socialisation — Parsons suggested that children learn the culture of their society through this process. The family is functionally important because it socialises children and they learn to accept society's shared values.
• Stabilisation of adult personalities — Parsons suggested that everyday life outside the family can be stressful for adults. However, husband and wife support each other emotionally. In his view, the family is functionally important not only for children but also because it helps to maintain the emotional stability of adults.`,
  topic: 'Functionalist perspectives — Parsons and the family',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N20_Q09 = {
  id: `${PAPER_ID}-q09`,
  paperId: PAPER_ID,
  number: '09',
  q: 'Identify and explain one advantage of using unstructured interviews to research the role of parents in families.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and explain',
  sourceRefs: [],
  ms: `Level 4 (4 marks): Relevant advantage selected (AO1) and an appropriate, detailed and well-developed explanation with good application to the context (the role of parents in families).
Level 3 (3 marks): Relevant advantage with explanation containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant advantage with a largely inaccurate or irrelevant explanation.
Level 1 (1 mark): Relevant advantage selected only.

Indicative content (AO1): Flexibility, quality of data, response rates, validity.
Indicative content (AO2):
• Flexibility — unstructured interviews allow the researcher the flexibility to investigate a line of enquiry into the role of parents in families that may not have been anticipated.
• Quality of the data — qualitative (in-depth) data on the roles which parents may have in families can be gathered.
• Response rates — unstructured interviews avoid some of the problems with alternative methods such as a low response rate from postal questionnaires.
• Validity — unstructured interviews allow a rapport to build between the researcher and respondents which can reveal more valid data on family relationships.`,
  topic: 'Research methods — advantages of unstructured interviews',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N20_Q10 = {
  id: `${PAPER_ID}-q10`,
  paperId: PAPER_ID,
  number: '10',
  q: 'Discuss how far sociologists would agree that families in Britain today are symmetrical.',
  marks: 12,
  type: 'written',
  commandWord: 'Discuss',
  sourceRefs: [],
  ms: `Level 4 (10–12 marks): Detailed knowledge and understanding. Sustained application. Developed critical analysis and evaluation. Well-constructed arguments with supported judgements and evidence-based conclusions.
Level 3 (7–9 marks): Good knowledge and understanding but some elements lacking detail. Good application and analysis.
Level 2 (4–6 marks): Limited knowledge. Limited application. Limited analysis.
Level 1 (1–3 marks): Fragments of basic knowledge. Little or no application. Little or no analysis.

Indicative content (AO1): Functionalism, Feminism, Willmott and Young, traditional roles within the family, changing roles and relationships within families.

Indicative content (AO2):
• Functionalist perspectives on the symmetrical family.
• Feminist perspectives on the symmetrical family — e.g. the work of Oakley on families and conjugal role relationships.
• The theory of the symmetrical family as developed by Willmott and Young — e.g. the principle of stratified diffusion.
• The persistence of traditional role relationships, e.g. segregated conjugal roles.
• New Man and dual career families.

Indicative content (AO3):
• Analysis and evaluation of functionalist theories: regarding the importance of family life and the nature of relationships within marriage.
• Analysis and evaluation of feminist theories: extent to which patriarchal role relationships can be demonstrated to remain within contemporary families.
• Analysis and evaluation of the work of Willmott and Young: criticisms of their theory and the research that underpinned it.
• Analysis and evaluation of evidence for the persistence of traditional role relationships, e.g. the dual burden/triple shift.
• Analysis and evaluation of changing role relationships: does the 'new man' actually exist?
• Evidence-based judgements about how far the evidence supports the premise that the symmetrical family exists in Britain today.`,
  topic: 'Symmetrical family — Willmott and Young',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N20_Q11 = {
  id: `${PAPER_ID}-q11`,
  paperId: PAPER_ID,
  number: '11',
  q: 'Discuss how far sociologists would agree that the extended family is still important in Britain today.',
  marks: 12,
  type: 'written',
  commandWord: 'Discuss',
  sourceRefs: [],
  ms: `Level 4 (10–12 marks): Detailed knowledge and understanding. Sustained application. Developed critical analysis and evaluation. Well-constructed arguments with supported judgements and evidence-based conclusions.
Level 3 (7–9 marks): Good knowledge and understanding but some elements lacking detail. Good application and analysis.
Level 2 (4–6 marks): Limited knowledge. Limited application. Limited analysis.
Level 1 (1–3 marks): Fragments of basic knowledge. Little or no application. Little or no analysis.

Indicative content (AO1): Functionalist perspective, Feminist perspective, Marxist perspective, cultural/ethnic differences, economic changes, official statistics.

Indicative content (AO2):
• Functionalist perspective — e.g. the functional importance of the extended family.
• Feminist perspective — e.g. demands placed on women, in providing child care and looking after elderly parents.
• Marxist perspective — e.g. the extended family as beneficial to the capitalist economic system.
• Cultural/ethnic differences — e.g. the extended family in British Asian family life.
• Changing role of women — e.g. women's increased employment opportunities and growing financial independence potentially reducing the need for a supportive extended family.
• Official statistics — e.g. trend data on households in the United Kingdom.

Indicative content (AO3):
• Analysis and evaluation of the functionalist perspective on the importance of the extended family.
• Analysis and evaluation of the feminist perspective on the demands placed on women by the extended family.
• Analysis and evaluation of the Marxist perspective on the importance of the extended family.
• Analysis and evaluation of cultural and ethnic differences relating to the importance of the extended family.
• Analysis and evaluation of changing role of women and employment as significant factors.
• Analysis and evaluation of relevant official statistics.
• Evidence-based judgements about how far the evidence suggests the extended family is still important in Britain today.`,
  topic: 'Extended family — continued importance',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

// ── Assembled paper ───────────────────────────────────────────────────────────

export const AQA_8192_1_NOV2020 = {
  id: PAPER_ID,
  title: 'AQA Sociology Paper 1 — November 2020',
  subtitle: 'Section A: Families',
  ref: '8192/1',
  year: 2020,
  board: 'AQA',
  session: 'nov',
  date: 'November 2020',
  subject: 'Sociology',
  totalMarks: 50,
  timeMins: 105,
  color: '#A79B8C',
  accentRgb: '167,155,140',
  sectionScope: 'A',
  sections: [
    {
      id: 'section-a',
      title: 'Section A: Families',
      instruction: 'Answer all questions in this section.',
      sources: [ITEM_A, ITEM_B],
      questions: [
        EP_AQA8192_N20_Q01,
        EP_AQA8192_N20_Q02,
        EP_AQA8192_N20_Q03,
        EP_AQA8192_N20_Q04,
        EP_AQA8192_N20_Q05,
        EP_AQA8192_N20_Q06,
        EP_AQA8192_N20_Q07,
        EP_AQA8192_N20_Q08,
        EP_AQA8192_N20_Q09,
        EP_AQA8192_N20_Q10,
        EP_AQA8192_N20_Q11,
      ],
    },
  ],
}
