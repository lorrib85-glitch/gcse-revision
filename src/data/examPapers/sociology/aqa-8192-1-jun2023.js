// ─── AQA GCSE Sociology Paper 1 — June 2023 ──────────────────────────────────
// Section A: The Sociology of Families (50 marks of 100 total)
// Ref: 8192/1 | Tuesday 16 May 2023 | 1 hr 45 mins
// This file contains Section A (Families) only.

const PAPER_ID = 'aqa-8192-1-jun2023'
const TOPIC_ID = 'soc_families'

// ── Sources ───────────────────────────────────────────────────────────────────

const ITEM_A = {
  id: 'item-a',
  label: 'Item A',
  type: 'image',
  src: '/exam-papers/sociology/aqa/8192-1/2023/jun-item-a.png',
  alt: 'Line graph showing the number of one-person households in England from 1996 to 2021, showing an upward trend from around 5.9 million to approximately 8.3 million.',
  caption: 'Number of one-person households in England, 1996–2021 (Office for National Statistics)',
}

// Item B text reconstructed from mark scheme context; verify against original paper.
const ITEM_B = {
  id: 'item-b',
  label: 'Item B',
  type: 'text',
  attribution: 'Adapted from Ann Oakley, Subject Women (1982)',
  text: `Ann Oakley examined the idea of the conventional family — a breadwinner husband, a dependent housewife and their children — using a wide range of secondary sources and statistical data. She found that the idea of the conventional family continued to be seen as natural and desirable in public life, advertising and the media, even though it was no longer the dominant family form in Britain.

Oakley, writing from a feminist perspective, argued that the conventional family was one particular interpretation of the 'facts' of sexuality and reproduction. Within the conventional family, women were expected to do unpaid domestic work in the home, and their economic dependence on the man's income was treated as normal. The man's economic power over the woman was a key feature of gender inequality within the family. Oakley concluded that the conventional family perpetuated patriarchal relationships and restricted women's opportunities.`,
}

// ── Questions ─────────────────────────────────────────────────────────────────

export const EP_AQA8192_J23_Q01 = {
  id: `${PAPER_ID}-q01`,
  paperId: PAPER_ID,
  number: '01',
  q: 'What term is commonly used by sociologists to describe the experience of women who have both a paid job and have to do most of the housework?\n\nA  Triple shift\nB  Double shift\nC  Dual burden\nD  Domestic division of labour',
  marks: 1,
  type: 'written',
  commandWord: null,
  sourceRefs: [],
  ms: 'B (Double shift)',
  topic: 'Domestic division of labour — double shift',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J23_Q02 = {
  id: `${PAPER_ID}-q02`,
  paperId: PAPER_ID,
  number: '02',
  q: 'What term is commonly used by sociologists to describe the way that parents channel their children\'s interests into toys, games and other activities that are seen as appropriate for their gender?\n\nA  Canalization\nB  Manipulation\nC  Canalisation\nD  Gender norms',
  marks: 1,
  type: 'written',
  commandWord: null,
  sourceRefs: [],
  ms: 'A (Canalization)',
  topic: 'Gender socialisation — canalization',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J23_Q03 = {
  id: `${PAPER_ID}-q03`,
  paperId: PAPER_ID,
  number: '03',
  q: 'Describe one example of a commune.',
  marks: 3,
  type: 'written',
  commandWord: 'Describe',
  sourceRefs: [],
  ms: `Level 3 (3 marks): A coherent description with few inaccuracies. Demonstrates good knowledge and understanding of relevant sociological theories, concepts, evidence and methods.
Level 2 (2 marks): A partial description with some inaccuracies and omissions.
Level 1 (1 mark): Fragments of knowledge, some inaccurate or irrelevant.

Indicative content:
• A group of people who share in the ownership of property and the division of labour, valuing equality and cooperation between members, such as an Israeli kibbutz.
• A small community who may follow similar political beliefs or environmental principles, such as Christiania in Copenhagen.
• A small community whose members share in the ownership of wealth and may follow certain religious beliefs, such as the Bruderhof Christian community in East Sussex.
• A small community whose members share in the ownership of property and the division of labour, such as the Findhorn ecovillage community in Scotland.`,
  topic: 'Family diversity — alternatives to nuclear family',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J23_Q04 = {
  id: `${PAPER_ID}-q04`,
  paperId: PAPER_ID,
  number: '04',
  q: 'Identify and describe one consequence of divorce for family members.',
  marks: 3,
  type: 'written',
  commandWord: 'Identify and describe',
  sourceRefs: [],
  ms: `Level 3 (3 marks): A coherent description with few inaccuracies. Demonstrates good knowledge and understanding.
Level 2 (2 marks): A partial description with some inaccuracies or omissions.
Level 1 (1 mark): Fragments of knowledge, some inaccurate or irrelevant.

Indicative content:
• Financial: decisions about dividing property and possessions, usually having to manage with less money coming into the home.
• Emotional: either a change for the better or a stressful change of circumstances.
• Co-parenting: logistical issues related to living with one parent but keeping in regular contact with the other.`,
  topic: 'Divorce — consequences',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J23_Q05 = {
  id: `${PAPER_ID}-q05`,
  paperId: PAPER_ID,
  number: '05',
  q: 'From Item A, examine one strength of using statistics to research one-person households.',
  marks: 2,
  type: 'written',
  commandWord: 'Examine',
  sourceRefs: ['item-a'],
  ms: `1 mark for identifying a possible strength (AO3) demonstrating a line of argument relating to methods or findings.
1 mark for evaluating (making a judgement/conclusion) by indicating why this element represents a possible strength.

Indicative content:
• Quantitative data collected on a large scale (national level), increasing the likelihood of a representative sample — therefore more reliable for making generalisations about one-person households across England.
• A reliable data source since it is high quality statistical information produced by a national organisation — therefore likely to be more valid and trustworthy.
• The data is readily available each year, so allows for comparisons over time to be made — therefore useful for identifying patterns and trends in one-person households.
• The data can be used as a starting point for further sociological investigation into explanations for changes shown.`,
  topic: 'Research methods — strengths of official statistics',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J23_Q06 = {
  id: `${PAPER_ID}-q06`,
  paperId: PAPER_ID,
  number: '06',
  q: 'Describe the type of statistical data shown in Item A.\n\nIdentify the trend shown by the data and explain one factor which may account for this trend.',
  marks: 4,
  type: 'written',
  commandWord: 'Describe, Identify and explain',
  sourceRefs: ['item-a'],
  ms: `Level 4 (4 marks): Relevant description of the data (AO1). Upward trend identified and an appropriate, detailed, well-developed explanation with clear application to context (increase in one-person households).
Level 3 (3 marks): Data described. Upward trend identified with an explanation containing some inaccuracies or omissions.
Level 2 (2 marks): Data described. Upward trend identified with either no explanation or a largely inaccurate explanation.
Level 1 (1 mark): Relevant description of the data only.

Indicative content (AO1): Official statistics on one-person households (collected by or on behalf of the government). Accept interval data as correct. 'Quantitative data' alone or description of the chart type are incorrect answers.
Indicative content (AO2):
• The trend is up (accept increasing or rising).
• Changing social attitudes to relationships, with greater acceptance of alternatives to living as a family.
• Increased life expectancy, with people living longer so there are more elderly, one-person households.
• Individualism in society, with more people choosing solo living or choosing to live apart from their partner.`,
  topic: 'One-person households — trends and explanations',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J23_Q07 = {
  id: `${PAPER_ID}-q07`,
  paperId: PAPER_ID,
  number: '07',
  q: 'Identify and explain one disadvantage of using unstructured interviews to investigate one-person households.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and explain',
  sourceRefs: [],
  ms: `Level 4 (4 marks): Relevant disadvantage selected (AO1) and an appropriate, detailed and well-developed explanation of relevant sociological theories, concepts, evidence and methods with good application to the context (investigating one-person households).
Level 3 (3 marks): Relevant disadvantage with explanation containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant disadvantage with a largely inaccurate or irrelevant explanation.
Level 1 (1 mark): Relevant disadvantage identified only.

Indicative content (AO1): Comparability, representativeness, reliability, validity, interviewer skills, time, complex data sets.
Indicative content (AO2):
• Data not in numerical form, therefore difficult to make comparisons between one-person households.
• Potential issues of representativeness relating to the number of interviews conducted.
• Difficult to replicate and check findings as questions not standardised.
• Interviewer bias may be a problem due to close involvement between interviewer and interviewee.
• Success depends on personal skills of the interviewer.
• Can be particularly time consuming for the researcher.
• Complex data sets can be difficult to analyse.`,
  topic: 'Research methods — disadvantages of unstructured interviews',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J23_Q08 = {
  id: `${PAPER_ID}-q08`,
  paperId: PAPER_ID,
  number: '08',
  q: 'From Item B, identify and describe one way in which Oakley saw the conventional family as being patriarchal, including what you know of her perspective on the family.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and describe',
  sourceRefs: ['item-b'],
  ms: `Level 4 (4 marks): Relevant way selected (AO1) and an appropriate, detailed and well-developed description of relevant sociological theories, concepts, evidence and methods with good application to the context (Oakley's feminist perspective on the family).
Level 3 (3 marks): Relevant way selected with description containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant way selected with a largely inaccurate or irrelevant description.
Level 1 (1 mark): Relevant way selected only.

Indicative content (AO1): Women were expected to do unpaid work inside the home. The man's economic power was linked to his income from paid work. The woman's dependence on the man's wages was an aspect of gender inequality.
Indicative content (AO2):
• Writing from a feminist perspective, Oakley investigated the 'idea' of the conventional family by reviewing a range of existing data. She suggested that the idea of the conventional family was still idealised even though it was no longer the dominant family form.
• Gender role inequalities in the conventional family reinforced patriarchal relationships.
• Economic power in the conventional family reinforced patriarchal relationships.
• Financial inequality in the conventional family reinforced patriarchal relationships.`,
  topic: 'Feminist perspectives — Oakley and patriarchy',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J23_Q09 = {
  id: `${PAPER_ID}-q09`,
  paperId: PAPER_ID,
  number: '09',
  q: 'Identify one practical issue you would need to consider when using postal questionnaires to investigate role relationships within the family and explain how you would deal with this issue in your investigation.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and explain',
  sourceRefs: [],
  ms: `Level 4 (4 marks): Relevant practical issue selected (AO1) and an appropriate, detailed and well-developed explanation with good application to the context (using postal questionnaires to investigate role relationships within families).
Level 3 (3 marks): Relevant practical issue with explanation containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant practical issue with a largely inaccurate or irrelevant explanation.
Level 1 (1 mark): Relevant practical issue identified only.

Indicative content (AO1): Time, cost, accessibility, sample size/response rate.
Indicative content (AO2):
• Time: obtaining a large representative sample would take significant time. A method such as sending out email/online questionnaires would speed up data gathering.
• Cost: mailing costs would be relatively high when seeking national generalisations. Cheaper alternative methods such as email questionnaires could reduce costs significantly.
• Accessibility: obtaining access to family member households may be difficult. Unstructured interviews may be more suitable as they build rapport and trust.
• Sample size/response rate: sample may be small due to low response rates. Consider sending out more questionnaires, pre-paid envelopes or offering incentives to encourage response.`,
  topic: 'Research methods — practical issues with postal questionnaires',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J23_Q10 = {
  id: `${PAPER_ID}-q10`,
  paperId: PAPER_ID,
  number: '10',
  q: 'Discuss how far sociologists would agree that the main function of the family is to serve the needs of capitalism.',
  marks: 12,
  type: 'written',
  commandWord: 'Discuss',
  sourceRefs: [],
  ms: `Level 4 (10–12 marks): Detailed knowledge and understanding. Sustained application of relevant theories, concepts, evidence and methods. Developed critical analysis and evaluation. Well-constructed arguments with supported judgements and evidence-based conclusions.
Level 3 (7–9 marks): Good knowledge and understanding but some elements lacking detail. Good application and analysis.
Level 2 (4–6 marks): Limited knowledge. Limited application. Limited analysis.
Level 1 (1–3 marks): Fragments of basic knowledge. Little or no application. Little or no analysis.

Indicative content (AO1): Marxism, Functionalism, Feminism, education as an alternative agency, media as an alternative agency, changes in significance of the family.

Indicative content (AO2):
• Marxist perspective — the nuclear family socialises children into accepting the values of capitalism. Reference to Eli Zaretsky and the family as a vital unit of consumption.
• Functionalist perspective — the nuclear family provides essential functions for society (sexual, reproductive, economic, educational). Reference to Parsons and Murdock.
• Feminist perspective — nuclear families are patriarchal, based on male power and dominance. Reference to Delphy and Leonard.
• The education system as an alternative agent serving capitalism more significantly than the family. Reference to Bowles and Gintis.
• The mass media as an alternative agent serving the needs of capitalism.

Indicative content (AO3):
• Analysis and evaluation of Marxist perspective: extent to which Zaretsky's view that the family serves capitalism remains significant.
• Analysis and evaluation of functionalist perspective: extent to which Parsons' view that the family serves society's needs (not just capitalism) is convincing.
• Analysis and evaluation of feminist perspective: extent to which Delphy and Leonard's emphasis on unpaid domestic labour remains relevant.
• Analysis and evaluation of education and media as more significant agents serving capitalism than the family.
• Evidence-based judgements and conclusions about how far the evidence supports the premise that the main function of the family is to serve capitalism.`,
  topic: 'Marxism and the family — capitalism',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J23_Q11 = {
  id: `${PAPER_ID}-q11`,
  paperId: PAPER_ID,
  number: '11',
  q: 'Discuss how far sociologists would agree that gender roles are equal in families in Britain today.',
  marks: 12,
  type: 'written',
  commandWord: 'Discuss',
  sourceRefs: [],
  ms: `Level 4 (10–12 marks): Detailed knowledge and understanding. Sustained application. Developed critical analysis and evaluation. Well-constructed arguments with supported judgements and evidence-based conclusions.
Level 3 (7–9 marks): Good knowledge and understanding but some elements lacking detail. Good application and analysis.
Level 2 (4–6 marks): Limited knowledge. Limited application. Limited analysis.
Level 1 (1–3 marks): Fragments of basic knowledge. Little or no application. Little or no analysis.

Indicative content (AO1): Functionalism, Feminism, Marxism, family diversity, traditional norms and values, media images, contemporary studies and evidence.

Indicative content (AO2):
• Functionalist perspective — reference to Young and Willmott and the 'symmetrical family' with integrated conjugal roles.
• Feminist perspective — reference to Oakley, Delphy and Leonard, and concepts such as the dual burden and double/triple shift.
• Marxist perspective — unpaid work done by the housewife benefits the capitalist system.
• The increasing diversity of the family as suggested by the Rapoports, with many differing conjugal roles (segregated, integrated).
• Continuation of traditional norms and values through canalization/gender socialisation.
• Media stereotyping, with women portrayed as primarily responsible for domestic tasks.
• British Social Attitudes data (Scott and Clery) suggesting gender inequalities persist within families.

Indicative content (AO3):
• Analysis and evaluation of functionalist perspective: extent to which gender roles are equal, with rise in the 'New Man'.
• Analysis and evaluation of feminist perspective: extent to which the nuclear family continues to be patriarchal, having segregated conjugal roles.
• Analysis and evaluation of Marxist perspective: extent to which the nuclear family supports the capitalist economic system.
• Analysis and evaluation of family diversity: rise in lone parent families and same-sex families.
• Analysis and evaluation of the impact of gender socialisation on children following traditional gender roles.
• Analysis and evaluation of media's role in perpetuating gender inequality.
• Evidence-based judgements about how far the evidence supports the premise that gender roles are equal in families today.`,
  topic: 'Gender roles and inequalities in the family',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

// ── Assembled paper ───────────────────────────────────────────────────────────

export const AQA_8192_1_JUN2023 = {
  id: PAPER_ID,
  title: 'AQA Sociology Paper 1 — June 2023',
  subtitle: 'Section A: Families',
  ref: '8192/1',
  year: 2023,
  board: 'AQA',
  session: 'jun',
  date: 'Tuesday 16 May 2023',
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
        EP_AQA8192_J23_Q01,
        EP_AQA8192_J23_Q02,
        EP_AQA8192_J23_Q03,
        EP_AQA8192_J23_Q04,
        EP_AQA8192_J23_Q05,
        EP_AQA8192_J23_Q06,
        EP_AQA8192_J23_Q07,
        EP_AQA8192_J23_Q08,
        EP_AQA8192_J23_Q09,
        EP_AQA8192_J23_Q10,
        EP_AQA8192_J23_Q11,
      ],
    },
  ],
}
