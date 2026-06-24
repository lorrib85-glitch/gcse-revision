// ─── AQA GCSE Sociology Paper 1 — November 2021 ──────────────────────────────
// Section A: The Sociology of Families (50 marks of 100 total)
// Ref: 8192/1 | November 2021 | 1 hr 45 mins
// This file contains Section A (Families) only.

const PAPER_ID = 'aqa-8192-1-nov2021'
const TOPIC_ID = 'soc_families'

// ── Sources ───────────────────────────────────────────────────────────────────

const ITEM_A = {
  id: 'item-a',
  label: 'Item A',
  type: 'image',
  src: '/exam-papers/sociology/aqa/8192-1/2021/nov-item-a.png',
  alt: 'Bar chart showing the number of divorces in England and Wales at selected years from 1971 to 2018, showing an upward trend from approximately 74,000 in 1971 to a peak, then some variation. The chart illustrates ONS divorce statistics data.',
  caption: 'Number of divorces in England and Wales at selected years, 1971–2018 (Office for National Statistics)',
}

// Item B text reconstructed from mark scheme context; verify against original paper.
const ITEM_B = {
  id: 'item-b',
  label: 'Item B',
  type: 'text',
  attribution: 'Adapted from Michael Young and Peter Willmott, The Symmetrical Family (1973)',
  text: `Michael Young and Peter Willmott conducted a major social survey in the early 1970s to investigate family life in Britain. They used a structured interview method, employing a team of interviewers to carry out almost 2,000 interviews with respondents across London, with each person answering an identical set of questions about family life and domestic roles.

Young and Willmott argued that by the 1970s, the nuclear family had become what they called a 'symmetrical family'. In the symmetrical family — which they described as Stage 3 of family development — husbands and wives both went out to work, shared in household tasks and made decisions jointly. Unlike earlier stages of the family, the husband in Stage 3 increasingly helped with household tasks such as washing up and cleaning, and spent more time at home with his wife and children. Young and Willmott predicted that the symmetrical family would become more widespread as the principle of stratified diffusion meant that patterns of family life would gradually spread downwards from the higher social classes to the working class.`,
}

// ── Questions ─────────────────────────────────────────────────────────────────

export const EP_AQA8192_N21_Q01 = {
  id: `${PAPER_ID}-q01`,
  paperId: PAPER_ID,
  number: '01',
  q: 'What term is commonly used by sociologists to describe a family consisting of parents, their children and other relatives, such as grandparents, aunts and uncles?\n\nA  Nuclear family\nB  Reconstituted family\nC  Extended family\nD  Beanpole family',
  marks: 1,
  type: 'written',
  commandWord: null,
  sourceRefs: [],
  ms: 'C (Extended family)',
  topic: 'Family types — extended family',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N21_Q02 = {
  id: `${PAPER_ID}-q02`,
  paperId: PAPER_ID,
  number: '02',
  q: 'What term is commonly used by sociologists to describe the role men traditionally perform in the family?\n\nA  Expressive\nB  Instrumental\nC  Breadwinner\nD  Patriarchal',
  marks: 1,
  type: 'written',
  commandWord: null,
  sourceRefs: [],
  ms: 'B (Instrumental)',
  topic: 'Gender roles — instrumental role',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N21_Q03 = {
  id: `${PAPER_ID}-q03`,
  paperId: PAPER_ID,
  number: '03',
  q: 'Describe one example of patriarchy within families.',
  marks: 3,
  type: 'written',
  commandWord: 'Describe',
  sourceRefs: [],
  ms: `Level 3 (3 marks): A coherent description with few inaccuracies. Demonstrates good knowledge and understanding.
Level 2 (2 marks): A partial description with some inaccuracies and omissions.
Level 1 (1 mark): Fragments of knowledge, some inaccurate or irrelevant.

Indicative content:
• The dominance of men over women in the family, e.g. money management, decision-making.
• Distribution of responsibilities for certain domestic tasks, e.g. household chores such as cleaning, doing the laundry assigned to women.
• Female role as the stay at home housewife and carer.
• Male role as the breadwinner and careerist.`,
  topic: 'Patriarchy within the family',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N21_Q04 = {
  id: `${PAPER_ID}-q04`,
  paperId: PAPER_ID,
  number: '04',
  q: 'Identify and describe one factor that may have led to an increase in family diversity in Britain.',
  marks: 3,
  type: 'written',
  commandWord: 'Identify and describe',
  sourceRefs: [],
  ms: `Level 3 (3 marks): A coherent description with few inaccuracies. Demonstrates good knowledge and understanding.
Level 2 (2 marks): A partial description with some inaccuracies and omissions.
Level 1 (1 mark): Fragments of knowledge, some inaccurate or irrelevant.

Indicative content:
• Changes in social attitudes and values, e.g. secularisation and greater acceptance of alternative family structures.
• Increase in numbers divorcing and rise in lone parent families.
• Immigration and cultural differences.
• Increase in people remarrying or cohabiting, e.g. forming blended or reconstituted families.`,
  topic: 'Family diversity — factors in increase',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N21_Q05 = {
  id: `${PAPER_ID}-q05`,
  paperId: PAPER_ID,
  number: '05',
  q: 'From Item A, examine one weakness of using statistics to research divorce.',
  marks: 2,
  type: 'written',
  commandWord: 'Examine',
  sourceRefs: ['item-a'],
  ms: `1 mark for identifying a possible weakness (AO3) demonstrating a line of argument relating to methods or findings.
1 mark for evaluating (making a judgement/conclusion) why this element represents a possible weakness.

Indicative content:
• Only provides numerical information, whereas data gathered from qualitative sources such as unstructured interviews would provide in-depth data, e.g. to explain an individual's reasons for seeking a divorce — therefore the statistics do not fully explain the causes of divorce.
• Limited amount of evidence available for sociologists researching divorce — does not explain the reasons for variations between age groups or ethnic groups, and only provides data from certain years.
• The exclusive use of statistical data does not allow for triangulation (a comparison of data from a variety of sources both qualitative and quantitative).`,
  topic: 'Research methods — weaknesses of official statistics',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N21_Q06 = {
  id: `${PAPER_ID}-q06`,
  paperId: PAPER_ID,
  number: '06',
  q: 'Describe the type of statistical data shown in Item A.\n\nIdentify the trend shown by the data and explain one factor which may account for this trend.',
  marks: 4,
  type: 'written',
  commandWord: 'Describe, Identify and explain',
  sourceRefs: ['item-a'],
  ms: `Level 4 (4 marks): Relevant description of the data (AO1). Upward trend identified and an appropriate, detailed, well-developed explanation with clear application to the context (increase in number of divorces).
Level 3 (3 marks): Data described. Upward trend identified with explanation containing some inaccuracies or omissions.
Level 2 (2 marks): Data described. Upward trend identified with either no explanation or a largely inaccurate explanation.
Level 1 (1 mark): Relevant description of the data only.

Indicative content (AO1): Official statistics on divorce (collected by or on behalf of the government) showing the number of divorces recorded. Accept interval data as correct. 'Quantitative data' alone or descriptions of the chart type are incorrect answers.
Indicative content (AO2):
• The trend is up (accept increasing or rising).
• Legal grounds for divorce have changed, e.g. 'irretrievable breakdown', making it potentially easier/quicker to obtain a divorce.
• Influence of the feminist movement, with more women unwilling to accept certain behaviour in a marriage/unequal relationship.
• Changing social attitudes, with divorce becoming more socially acceptable.
• The declining importance of religion in society, with fewer people having religious objections to divorce.
• Women are no longer dependent on men for their financial security.`,
  topic: 'Divorce — trends and explanations',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N21_Q07 = {
  id: `${PAPER_ID}-q07`,
  paperId: PAPER_ID,
  number: '07',
  q: 'Identify and explain one disadvantage of using secondary data to investigate attitudes towards marriage.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and explain',
  sourceRefs: [],
  ms: `Level 4 (4 marks): Relevant disadvantage selected (AO1) and an appropriate, detailed and well-developed explanation with good application to the context (using secondary data to investigate attitudes towards marriage).
Level 3 (3 marks): Relevant disadvantage with explanation containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant disadvantage with a largely inaccurate or irrelevant explanation.
Level 1 (1 mark): Relevant disadvantage selected only.

Indicative content (AO1): Representativeness, validity, bias, original nature and purpose of the data, relevance of the secondary data.
Indicative content (AO2):
• Potentially unrepresentative of a wide social group when investigating attitudes towards marriage.
• May not provide a true picture of attitudes towards marriage and therefore lack validity.
• The data may only reflect one point of view with regard to marriage.
• Concerns over how the data was collected and whether sociological research methods were used to gather data on marriage.
• The data may not be specifically relevant to marriage, limited or dated in nature.`,
  topic: 'Research methods — disadvantages of secondary data',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N21_Q08 = {
  id: `${PAPER_ID}-q08`,
  paperId: PAPER_ID,
  number: '08',
  q: 'From Item B, identify and describe the research method used by Willmott and Young in the early 1970s, including what you know of their perspective on the family.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and describe',
  sourceRefs: ['item-b'],
  ms: `Level 4 (4 marks): Relevant research method selected (AO1) and an appropriate, detailed and well-developed description of relevant sociological theories, concepts, evidence and methods with good application to the context (Willmott and Young's perspective on the family).
Level 3 (3 marks): Relevant research method selected with description containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant research method selected with a largely inaccurate or irrelevant description.
Level 1 (1 mark): Relevant research method selected only.

Indicative content (AO1): Social survey, interviews.
Indicative content (AO2):
• Writing from a functionalist perspective, Young and Willmott used the term 'symmetrical family' to describe the Stage 3 (home centred) nuclear family, with each spouse sharing chores and decisions.
• Interviewed almost 2,000 people, with each respondent answering an identical set of questions.`,
  topic: 'Functionalist perspectives — Willmott and Young symmetrical family',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N21_Q09 = {
  id: `${PAPER_ID}-q09`,
  paperId: PAPER_ID,
  number: '09',
  q: 'Identify one function of the family and explain how you would investigate this function using a case study.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and explain',
  sourceRefs: [],
  ms: `Level 4 (4 marks): Relevant function selected (AO1) and an appropriate, detailed and well-developed explanation of relevant sociological theories, concepts, evidence and methods with good application to the context (using case studies to research functions of the family).
Level 3 (3 marks): Relevant function selected with explanation containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant function selected with a largely inaccurate or irrelevant explanation.
Level 1 (1 mark): Relevant function selected only.

Indicative content (AO1): Economic, primary socialisation, reproductive, sexual, stabilisation of adult personalities.
Indicative content (AO2):
• Identify an appropriate family or families who would be willing to be the subject of a case study.
• Select an appropriate methodological approach, e.g. interviews, observation or a combination of methods.
• Take account of relevant ethical issues, e.g. confidentiality.
• Compare case study data with relevant secondary sources (triangulation).
• Analyse the data looking at patterns and trends relating to the selected function.`,
  topic: 'Research methods — case studies; functions of the family',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N21_Q10 = {
  id: `${PAPER_ID}-q10`,
  paperId: PAPER_ID,
  number: '10',
  q: 'Discuss how far sociologists would agree that the traditional nuclear family is the most appropriate family type in which to raise children in Britain today.',
  marks: 12,
  type: 'written',
  commandWord: 'Discuss',
  sourceRefs: [],
  ms: `Level 4 (10–12 marks): Detailed knowledge and understanding. Sustained application. Developed critical analysis and evaluation. Well-constructed arguments with supported judgements and evidence-based conclusions.
Level 3 (7–9 marks): Good knowledge and understanding but some elements lacking detail. Good application and analysis.
Level 2 (4–6 marks): Limited knowledge. Limited application. Limited analysis.
Level 1 (1–3 marks): Fragments of basic knowledge. Little or no application. Little or no analysis.

Indicative content (AO1): Functionalists, New Right, Feminists, Marxists, family diversity, cereal packet image of the family.

Indicative content (AO2):
• Functionalists, such as Murdock and Parsons, argue that the traditional nuclear family performs essential functions for the individual and society. Importance of the instrumental and expressive roles.
• New Right perspective emphasises the importance of the traditional nuclear family — they argue that children are more likely to develop into stable adults if brought up by both parents.
• Feminists, such as Delphy and Leonard, view traditional nuclear families as patriarchal, a source of female oppression.
• Marxists, such as Zaretsky, are critical of the traditional nuclear family, seeing it as serving the needs of capitalism.
• Other family forms are as appropriate as identified by the Rapoports, with Oakley commenting on how the traditional nuclear family is felt to be increasingly archaic.
• The ideal family form purported by the media, particularly advertisements, as a stereotypical image (cereal packet family).

Indicative content (AO3):
• Analysis and evaluation of the functionalist perspective: extent to which the traditional nuclear family is the most appropriate family type to raise children.
• Analysis and evaluation of the New Right perspective.
• Analysis and evaluation of the feminist perspective: extent to which the nuclear family continues to be patriarchal due to canalisation and gender socialisation.
• Analysis and evaluation of the Marxist perspective: extent to which the nuclear family supports the capitalist system.
• Analysis and evaluation of the impact of family diversity.
• Analysis and evaluation of the cereal packet family as a stereotypical image.
• Evidence-based judgements about how far the evidence supports the premise that the traditional nuclear family is the most appropriate family type.`,
  topic: 'Nuclear family — functionalism vs. critiques',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_N21_Q11 = {
  id: `${PAPER_ID}-q11`,
  paperId: PAPER_ID,
  number: '11',
  q: 'Discuss how far sociologists would agree that gender inequalities continue to exist within the family in Britain today.',
  marks: 12,
  type: 'written',
  commandWord: 'Discuss',
  sourceRefs: [],
  ms: `Level 4 (10–12 marks): Detailed knowledge and understanding. Sustained application. Developed critical analysis and evaluation. Well-constructed arguments with supported judgements and evidence-based conclusions.
Level 3 (7–9 marks): Good knowledge and understanding but some elements lacking detail. Good application and analysis.
Level 2 (4–6 marks): Limited knowledge. Limited application. Limited analysis.
Level 1 (1–3 marks): Fragments of basic knowledge. Little or no application. Little or no analysis.

Indicative content (AO1): Feminism, Functionalism, Marxism, changing family structures, changing position of women in society.

Indicative content (AO2):
• Feminist perspectives — emphasises the patriarchal nature of the family, with women being exploited within the home, e.g. unequal gender division of labour.
• Functionalist perspectives — the significance of the symmetrical family as researched by Willmott and Young, suggesting shared conjugal roles.
• Marxist perspectives — women and men have unequal roles because that structure supports capitalism. Women who stay at home, doing unpaid housework, support capitalist society.
• The movement towards more dual career/neo-conventional families and the idea of the 'New Man'.
• Women's changed legal status and employment opportunities, giving them more rights and career prospects.

Indicative content (AO3):
• Analysis and evaluation of the feminist perspective: extent to which gender inequalities exist within the family.
• Analysis and evaluation of the functionalist perspective: extent to which there has been a rise in the symmetrical family.
• Analysis and evaluation of the Marxist perspective: extent to which the family supports capitalism.
• Analysis and evaluation of changes in family structures and gender roles: does the concept of the New Man exist?
• Analysis and evaluation of changes in women's position in society: extent to which there is gender equality in society and employment.
• Evidence-based judgements about how far the evidence suggests gender inequalities still exist in the family in Britain today.`,
  topic: 'Gender inequalities within the family',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

// ── Assembled paper ───────────────────────────────────────────────────────────

export const AQA_8192_1_NOV2021 = {
  id: PAPER_ID,
  title: 'AQA Sociology Paper 1 — November 2021',
  subtitle: 'Section A: Families',
  ref: '8192/1',
  year: 2021,
  board: 'AQA',
  session: 'nov',
  date: 'November 2021',
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
        EP_AQA8192_N21_Q01,
        EP_AQA8192_N21_Q02,
        EP_AQA8192_N21_Q03,
        EP_AQA8192_N21_Q04,
        EP_AQA8192_N21_Q05,
        EP_AQA8192_N21_Q06,
        EP_AQA8192_N21_Q07,
        EP_AQA8192_N21_Q08,
        EP_AQA8192_N21_Q09,
        EP_AQA8192_N21_Q10,
        EP_AQA8192_N21_Q11,
      ],
    },
  ],
}
