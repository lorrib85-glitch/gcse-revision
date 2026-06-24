// ─── AQA GCSE Sociology Paper 1 — June 2024 ──────────────────────────────────
// Section A: The Sociology of Families (50 marks of 100 total)
// Ref: 8192/1 | 2024 | 1 hr 45 mins
// This file contains Section A (Families) only.

const PAPER_ID = 'aqa-8192-1-jun2024'
const TOPIC_ID = 'soc_families'

// ── Sources ───────────────────────────────────────────────────────────────────

const ITEM_A = {
  id: 'item-a',
  label: 'Item A',
  type: 'image',
  src: '/exam-papers/sociology/aqa/8192-1/2024/jun-item-a.png',
  alt: 'Bar chart showing the average age at first marriage in England and Wales for men and women at selected years between 1971 and 2019, showing a steady increase for both. Men\'s average age rose from about 25 in 1971 to about 33 in 2019. Women\'s average age rose from about 23 in 1971 to about 31 in 2019.',
  caption: 'Average age at first marriage in England and Wales, 1971–2019 (Office for National Statistics)',
}

// Item B text reconstructed from mark scheme context; verify against original paper.
const ITEM_B = {
  id: 'item-b',
  label: 'Item B',
  type: 'text',
  attribution: 'Adapted from Christine Delphy and Diana Leonard, Familiar Exploitation: A New Analysis of Marriage in Contemporary Western Societies (1992)',
  text: `Christine Delphy and Diana Leonard investigated the idea of the symmetrical family by reviewing a range of existing data. They concluded that the family is not symmetrical but is a patriarchal institution that serves the interests of men.

Delphy and Leonard found that women within the family were expected to perform the majority of unpaid domestic labour. Even when women worked outside the home in paid employment, they were still expected to carry out most of the housework and childcare. Women's time at home was, therefore, also work time, whereas men's time at home was leisure time. They argued that this pattern of women performing unpaid work for men represented an exploitation of women within the family. The family, they concluded, benefits men at the expense of women.`,
}

// ── Questions ─────────────────────────────────────────────────────────────────

export const EP_AQA8192_J24_Q01 = {
  id: `${PAPER_ID}-q01`,
  paperId: PAPER_ID,
  number: '01',
  q: 'What term is commonly used by sociologists to describe a family in which a man holds power and authority?\n\nA  Matriarchal family\nB  Nuclear family\nC  Patriarchal family\nD  Extended family',
  marks: 1,
  type: 'written',
  commandWord: null,
  sourceRefs: [],
  ms: 'C (Patriarchal family)',
  topic: 'Family types — patriarchal family',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J24_Q02 = {
  id: `${PAPER_ID}-q02`,
  paperId: PAPER_ID,
  number: '02',
  q: 'What term is commonly used by sociologists to describe information that is presented in numerical form?\n\nA  Primary data\nB  Secondary data\nC  Qualitative data\nD  Quantitative data',
  marks: 1,
  type: 'written',
  commandWord: null,
  sourceRefs: [],
  ms: 'D (Quantitative data)',
  topic: 'Research methods — types of data',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J24_Q03 = {
  id: `${PAPER_ID}-q03`,
  paperId: PAPER_ID,
  number: '03',
  q: 'Describe one example of primary socialisation.',
  marks: 3,
  type: 'written',
  commandWord: 'Describe',
  sourceRefs: [],
  ms: `Level 3 (3 marks): A coherent description with few inaccuracies. Demonstrates good knowledge and understanding.
Level 2 (2 marks): A partial description with some inaccuracies and omissions.
Level 1 (1 mark): Fragments of knowledge, some inaccurate or irrelevant.

Indicative content:
• Early childhood learning, during which families teach infants rules, patterns of behaviour and belief systems that make involvement in social life possible.
• Infants learning from their parents' language skills they will need in later life in order to communicate with others in society.
• Infants learning table manners from their parents, such as how to use a knife and fork rather than eating with their fingers.`,
  topic: 'Socialisation — primary socialisation',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J24_Q04 = {
  id: `${PAPER_ID}-q04`,
  paperId: PAPER_ID,
  number: '04',
  q: 'Identify and describe one way in which conjugal role relationships may be segregated.',
  marks: 3,
  type: 'written',
  commandWord: 'Identify and describe',
  sourceRefs: [],
  ms: `Level 3 (3 marks): A coherent description with few inaccuracies. Demonstrates good knowledge and understanding.
Level 2 (2 marks): A partial description with some inaccuracies and omissions.
Level 1 (1 mark): Fragments of knowledge, some inaccurate or irrelevant.

Indicative content:
• Where partners have a clear division of labour and perform different household tasks, such as the female does the washing and cooking, whilst the male repairs household equipment and does the DIY.
• Where partners have separate interests and leisure activities, such as the male attending yoga classes with their friends, whilst the female plays for her local football team.
• Where partners perform different functions for the family, such as the male is the breadwinner, whilst the female is responsible for the housework and childcare.`,
  topic: 'Conjugal roles — segregated roles',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J24_Q05 = {
  id: `${PAPER_ID}-q05`,
  paperId: PAPER_ID,
  number: '05',
  q: 'From Item A, examine one strength of the data.',
  marks: 2,
  type: 'written',
  commandWord: 'Examine',
  sourceRefs: ['item-a'],
  ms: `1 mark for identifying a possible strength (AO3).
1 mark for evaluating why this element represents a possible strength.

Indicative content:
• Provides official marriage statistics by gender and changes in different years, so the data can be used to suggest trends over time — therefore useful for identifying patterns in marriage age.
• Quantitative data collected on a large scale to allow generalisations to be made — therefore more likely to be representative of the whole population.
• Official statistics on first marriages are subject to government guidelines and standards, so are therefore more likely to be high in validity.
• Provides a readily available (frequently online) source of data for sociologists, on which they can base their own research.
• Official statistics are considered a trustworthy source and are likely to be reliable.`,
  topic: 'Research methods — strengths of official statistics',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J24_Q06 = {
  id: `${PAPER_ID}-q06`,
  paperId: PAPER_ID,
  number: '06',
  q: 'Identify and explain one factor that may have led to a change in the age at which people first marry as shown in Item A.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and explain',
  sourceRefs: ['item-a'],
  ms: `Level 4 (4 marks): Relevant factor identified (AO1) and an appropriate, detailed and well-developed explanation with clear application to the context (average age of first marriage in England and Wales).
Level 3 (3 marks): Relevant factor with explanation containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant factor with a largely inaccurate or irrelevant explanation.
Level 1 (1 mark): Relevant factor identified only.

Indicative content (AO1): Social attitudes, length of time in education, career opportunities, medical advances, cost implications.
Indicative content (AO2):
• Changing social attitudes — cohabitation is seen as more socially acceptable, so couples are delaying marriage.
• Increased educational opportunities — young people are spending a longer time in full-time education before marrying.
• Increased employment opportunities — young people may prioritise establishing careers before marrying.
• Availability of effective contraception — reduced risk of unplanned pregnancies which may have led couples to marry at an earlier age in the past.
• Financial reasons — many people in their twenties are not financially stable enough to afford the expense of a wedding.`,
  topic: 'Marriage — changing patterns and age',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J24_Q07 = {
  id: `${PAPER_ID}-q07`,
  paperId: PAPER_ID,
  number: '07',
  q: 'Identify and explain one advantage of using a longitudinal study to investigate changing attitudes to marriage.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and explain',
  sourceRefs: [],
  ms: `Level 4 (4 marks): Relevant advantage selected (AO1) and an appropriate, detailed and well-developed explanation with good application to the context (using a longitudinal study to investigate changing attitudes to marriage).
Level 3 (3 marks): Relevant advantage with explanation containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant advantage with a largely inaccurate or irrelevant explanation.
Level 1 (1 mark): Relevant advantage identified only.

Indicative content (AO1): Comparability, validity, use of the same participants, representativeness.
Indicative content (AO2):
• Comparability — by comparing earlier and later studies of the same sample, it may be possible to discover patterns, trends and the causes of changes in attitudes to marriage over time.
• Validity — more valid data may be obtained, as surveys which ask people about past attitudes rely on human memories, and people may forget, distort or exaggerate past opinions. This can be checked by referring back to previous studies.
• Same participants — by keeping the same sample, the researcher can be sure that any changes in attitudes to marriage are not simply due to changes in the makeup of the sample.
• Representativeness — longitudinal studies often involve a large number of participants, making it more likely that the data will be representative.`,
  topic: 'Research methods — advantages of longitudinal studies',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J24_Q08 = {
  id: `${PAPER_ID}-q08`,
  paperId: PAPER_ID,
  number: '08',
  q: 'From Item B, identify and describe one way in which Delphy and Leonard believed that women were exploited within the family, including what you know of their perspective on family life.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and describe',
  sourceRefs: ['item-b'],
  ms: `Level 4 (4 marks): Relevant way selected (AO1) and an appropriate, detailed and well-developed description of relevant sociological theories, concepts, evidence and methods with good application to the context (Delphy and Leonard's feminist perspective on the family).
Level 3 (3 marks): Relevant way selected with description containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant way selected with a largely inaccurate or irrelevant description.
Level 1 (1 mark): Relevant way selected only.

Indicative content (AO1): Women were expected to do unpaid work inside the home. If they worked outside the home they were also expected to do the majority of domestic labour within the home. Time at home for men was leisure time, whereas time at home for women was also work time.
Indicative content (AO2):
• Writing from a feminist perspective, Delphy and Leonard investigated the 'idea' of the symmetrical family by reviewing a range of existing data. They view the family as a patriarchal institution that serves the interests of men.
• Women were expected to do unpaid work inside the home, emphasising the exploitation of women in the family.
• If they worked outside the home they were also expected to do the majority of domestic labour, emphasising the exploitation of women in the family.
• Time spent at home for women was also work time while for men it was leisure time, emphasising the exploitation of women.`,
  topic: 'Feminist perspectives — Delphy and Leonard',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J24_Q09 = {
  id: `${PAPER_ID}-q09`,
  paperId: PAPER_ID,
  number: '09',
  q: 'Identify and explain one disadvantage of using a case study to investigate conjugal roles within the family.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and explain',
  sourceRefs: [],
  ms: `Level 4 (4 marks): Relevant disadvantage identified (AO1) and an appropriate, detailed and well-developed explanation with good application to the context (using a case study to investigate conjugal roles within the family).
Level 3 (3 marks): Relevant disadvantage with explanation containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant disadvantage with a largely inaccurate or irrelevant explanation.
Level 1 (1 mark): Relevant disadvantage identified only.

Indicative content (AO1): Reliability, generalisability, accessibility, researcher effect, time consuming.
Indicative content (AO2):
• Reliability — case studies can be low in reliability. The circumstances may be unique and other case studies may reveal contradictory data, making it difficult to get a detailed understanding of how conjugal roles are distributed within families.
• Generalisability — it may not be possible to generalise on the basis of a single case study as every family will have different roles within their families.
• Accessibility — it can be difficult to arrange the necessary access required as some families will not want to allow a researcher into their lives.
• Researcher effect — the researcher effect may distort the data and valid data on conjugal roles within families will be difficult to obtain.
• Time consuming — case studies are normally conducted over a period of time so are likely to be more time consuming than some other research methods.`,
  topic: 'Research methods — disadvantages of case studies',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J24_Q10 = {
  id: `${PAPER_ID}-q10`,
  paperId: PAPER_ID,
  number: '10',
  q: 'Discuss how far sociologists would agree that family diversity exists in Britain today.',
  marks: 12,
  type: 'written',
  commandWord: 'Discuss',
  sourceRefs: [],
  ms: `Level 4 (10–12 marks): Detailed knowledge and understanding. Sustained application. Developed critical analysis and evaluation. Well-constructed arguments with supported judgements and evidence-based conclusions.
Level 3 (7–9 marks): Good knowledge and understanding but some elements lacking detail. Good application and analysis.
Level 2 (4–6 marks): Limited knowledge. Limited application. Limited analysis.
Level 1 (1–3 marks): Fragments of basic knowledge. Little or no application. Little or no analysis.

Indicative content (AO1): The Rapoports on family diversity, how family forms differ in Britain, changing family structures, Functionalism, Feminism, cultural and ethnic differences, changing social attitudes, media portrayal and the cereal packet family.

Indicative content (AO2):
• The range of family forms that now exist in Britain — lone parent, reconstituted, extended, nuclear, same-sex, beanpole families.
• Comparisons with alternative cultures, e.g. communes (kibbutz).
• Statistical differences between the percentage of each family form over time — e.g. 2.9 million lone-parent families in Britain in 2019 (ONS); 8% of families in England were reconstituted families in 2013.
• Functionalist perspective — the nuclear family as the norm, e.g. in 2019, there were 12.8 million married or civil partnership couple families (ONS), making it the most common type.
• Feminist perspective — reference to Oakley and the myth of the rise in symmetrical families.
• Family diversity evident from different ethnic groups, e.g. the relatively high percentage of extended families within the British Asian community.
• Increasing family diversity due to changes in social attitudes to divorce and legal changes linked to same-sex marriages.
• The conventional nuclear family shown as the norm throughout the advertising industry, creating a stereotypical image.

Indicative content (AO3):
• Analysis and evaluation of the Rapoports: extent to which there is genuine family diversity in modern Britain.
• Analysis and evaluation of quantitative data and official statistics on different family forms.
• Analysis and evaluation of the functionalist perspective and the continued existence of the nuclear family.
• Analysis and evaluation of the feminist perspective: extent to which the symmetrical family exists in modern Britain.
• Analysis and evaluation of cultural and ethnic differences relating to family forms.
• Analysis and evaluation of changing social attitudes as a significant factor.
• Evidence-based judgements about how far the evidence supports the premise that a range of family forms exist in Britain today.`,
  topic: 'Family diversity — Rapoports and changing family forms',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J24_Q11 = {
  id: `${PAPER_ID}-q11`,
  paperId: PAPER_ID,
  number: '11',
  q: 'Discuss how far sociologists would agree that the nuclear family performs important functions for society.',
  marks: 12,
  type: 'written',
  commandWord: 'Discuss',
  sourceRefs: [],
  ms: `Level 4 (10–12 marks): Detailed knowledge and understanding. Sustained application. Developed critical analysis and evaluation. Well-constructed arguments with supported judgements and evidence-based conclusions.
Level 3 (7–9 marks): Good knowledge and understanding but some elements lacking detail. Good application and analysis.
Level 2 (4–6 marks): Limited knowledge. Limited application. Limited analysis.
Level 1 (1–3 marks): Fragments of basic knowledge. Little or no application. Little or no analysis.

Indicative content (AO1): Functionalism, New Right, Feminism, Marxism, alternative family forms, other agencies of socialisation.

Indicative content (AO2):
• Functionalist perspective — reference to Parsons and/or Murdock, who suggest that the nuclear family is ideally suited for the socialisation of children to perform key functions for society (economic, educational, reproductive, sexual).
• New Right perspective — reference to Murray; a lack of a father figure as a role model could be damaging. The nuclear family is best suited for children to develop into stable adult members of society.
• Feminist perspective — reference to Oakley and canalization of children into gender specific roles. Reference to Delphy and Leonard on how the nuclear family is patriarchal and damaging for a modern society.
• Marxist perspective — reference to Zaretsky, who is critical of the nuclear family, viewing it as socialising children into accepting the values of capitalist society.
• The amount of family diversity — reference to the Rapoports, who suggest alternative family forms are just as functional and effective in performing essential functions for society.
• Agencies of socialisation — e.g. media, education. The influence of social media on children's development; how schools perform essential functions for society.

Indicative content (AO3):
• Analysis and evaluation of the functionalist perspective: extent to which the nuclear family performs important functions for society.
• Analysis and evaluation of the New Right perspective.
• Analysis and evaluation of the feminist perspective.
• Analysis and evaluation of the Marxist perspective.
• Analysis and evaluation of the extent of family diversity and whether alternative family forms can perform important functions for society.
• Analysis and evaluation of how much influence other agencies of socialisation have.
• Evidence-based judgements about how far the evidence supports the premise that the nuclear family performs important functions for society.`,
  topic: 'Functionalism and the family — functions for society',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

// ── Assembled paper ───────────────────────────────────────────────────────────

export const AQA_8192_1_JUN2024 = {
  id: PAPER_ID,
  title: 'AQA Sociology Paper 1 — June 2024',
  subtitle: 'Section A: Families',
  ref: '8192/1',
  year: 2024,
  board: 'AQA',
  session: 'jun',
  date: '2024',
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
        EP_AQA8192_J24_Q01,
        EP_AQA8192_J24_Q02,
        EP_AQA8192_J24_Q03,
        EP_AQA8192_J24_Q04,
        EP_AQA8192_J24_Q05,
        EP_AQA8192_J24_Q06,
        EP_AQA8192_J24_Q07,
        EP_AQA8192_J24_Q08,
        EP_AQA8192_J24_Q09,
        EP_AQA8192_J24_Q10,
        EP_AQA8192_J24_Q11,
      ],
    },
  ],
}
