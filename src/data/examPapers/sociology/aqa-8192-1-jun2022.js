// ─── AQA GCSE Sociology Paper 1 — June 2022 ──────────────────────────────────
// Section A: The Sociology of Families (50 marks of 100 total)
// Ref: 8192/1 | June 2022 | 1 hr 45 mins
// This file contains Section A (Families) only.

const PAPER_ID = 'aqa-8192-1-jun2022'
const TOPIC_ID = 'soc_families'

// ── Sources ───────────────────────────────────────────────────────────────────

// Item A is a text source about Oakley's 1974 research — no image for this paper.
// Text reconstructed from mark scheme context; verify against original paper.
const ITEM_A = {
  id: 'item-a',
  label: 'Item A',
  type: 'text',
  attribution: 'Adapted from Ann Oakley, The Sociology of Housework (1974)',
  text: `In 1974, Ann Oakley carried out research into housework and its significance for women. She conducted in-depth interviews with a sample of 40 married women living in London. All of the women interviewed were aged between 20 and 30, and had at least one child under the age of five.

Oakley found that the majority of women in her sample — 70% — reported that their husbands gave little or no help with household tasks. She also found that the women were working, on average, 77 hours per week on domestic tasks. Oakley's findings showed a significant level of task allocation by gender: cooking, cleaning, shopping and childcare were primarily the woman's responsibility. She concluded that, despite entering paid employment in greater numbers, women still carried out the majority of domestic labour within the home.`,
}

// Item B text reconstructed from mark scheme context; verify against original paper.
const ITEM_B = {
  id: 'item-b',
  label: 'Item B',
  type: 'text',
  attribution: 'Adapted from Eli Zaretsky, Capitalism, the Family and Personal Life (1976)',
  text: `Eli Zaretsky argued from a Marxist perspective that the nuclear family performs an essential economic function for the capitalist system. Far from serving the interests of all members of society, he believed that the family primarily benefits the bourgeoisie — the capitalist ruling class.

Zaretsky saw the family as a vital unit of consumption: family members buy and consume the goods produced by capitalist industry, thereby enabling the bourgeoisie to make their profits. He also argued that women within the family provide unpaid labour for the capitalist system. As housewives, women keep workers fed, clothed and cared for, and reproduce the next generation of workers — all for free. In this way, the family helps to maintain both existing workers and future workers, at no cost to employers. Zaretsky therefore concluded that the nuclear family, and in particular women's domestic role within it, is structured in a way that serves the economic needs of capitalism rather than the needs of families themselves.`,
}

// ── Questions ─────────────────────────────────────────────────────────────────

export const EP_AQA8192_J22_Q01 = {
  id: `${PAPER_ID}-q01`,
  paperId: PAPER_ID,
  number: '01',
  q: 'What term is commonly used by sociologists to describe partners who live together without either being married or in a civil partnership?\n\nA  Reconstituted family\nB  Cohabitation\nC  Serial monogamy\nD  Nuclear family',
  marks: 1,
  type: 'written',
  commandWord: null,
  sourceRefs: [],
  ms: 'B (Cohabitation)',
  topic: 'Family types — cohabitation',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J22_Q02 = {
  id: `${PAPER_ID}-q02`,
  paperId: PAPER_ID,
  number: '02',
  q: 'What term is commonly used by sociologists to describe a family in which a woman holds power and authority?\n\nA  Matriarchal family\nB  Patriarchal family\nC  Nuclear family\nD  Extended family',
  marks: 1,
  type: 'written',
  commandWord: null,
  sourceRefs: [],
  ms: 'A (Matriarchal family)',
  topic: 'Family types — matriarchal family',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J22_Q03 = {
  id: `${PAPER_ID}-q03`,
  paperId: PAPER_ID,
  number: '03',
  q: 'Describe what sociologists mean by kinship.',
  marks: 3,
  type: 'written',
  commandWord: 'Describe',
  sourceRefs: [],
  ms: `Level 3 (3 marks): A coherent description with few inaccuracies. Demonstrates good knowledge and understanding.
Level 2 (2 marks): A partial description with some inaccuracies and omissions.
Level 1 (1 mark): Fragments of knowledge, some inaccurate or irrelevant.

Indicative content:
• The social relationships derived from blood ties and marriage.
• Familial ties, including husbands and wives, brothers and sisters, aunts and uncles, cousins, etc.
• Relationships based on adoption or civil partnerships.`,
  topic: 'Family — kinship',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J22_Q04 = {
  id: `${PAPER_ID}-q04`,
  paperId: PAPER_ID,
  number: '04',
  q: 'Identify and describe one example of how a grandparent can contribute to family life.',
  marks: 3,
  type: 'written',
  commandWord: 'Identify and describe',
  sourceRefs: [],
  ms: `Level 3 (3 marks): A coherent description with few inaccuracies. Demonstrates good knowledge and understanding.
Level 2 (2 marks): A partial description with some inaccuracies and omissions.
Level 1 (1 mark): Fragments of knowledge, some inaccurate or irrelevant.

Indicative content:
• By helping with childcare — a grandparent may be able to look after young grandchildren, so that the parent(s) avoid the costs of having to pay for private childcare.
• By providing economic support — giving and lending money, gifts.
• Providing emotional and moral support — listening, talking and offering advice to other family members.`,
  topic: 'Extended family — grandparents\' contribution',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J22_Q05 = {
  id: `${PAPER_ID}-q05`,
  paperId: PAPER_ID,
  number: '05',
  q: 'From Item A, examine one weakness of the research.',
  marks: 2,
  type: 'written',
  commandWord: 'Examine',
  sourceRefs: ['item-a'],
  ms: `1 mark for identifying a possible weakness (AO3) demonstrating a line of argument relating to methods or findings.
1 mark for evaluating (making a judgement/conclusion) why this element represents a possible weakness.

Indicative content:
• Small sample — London-based, meaning it is more likely to be an unrepresentative sample — therefore the findings may not be generalisable to all women in Britain.
• Dated — relevance to contemporary society, e.g. the research is dated (based on a sample of women from 1974) — therefore the findings may no longer reflect current patterns of domestic labour.
• The sample chosen — only focused on married couples — therefore the findings may not reflect domestic arrangements in other types of relationships.
• Doesn't quantify the amount and/or type of housework, just states a 'significant level' — therefore lacks precision.`,
  topic: 'Research methods — weaknesses of small samples',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J22_Q06 = {
  id: `${PAPER_ID}-q06`,
  paperId: PAPER_ID,
  number: '06',
  q: 'Identify and explain one factor that may account for differences in the allocation of domestic tasks as shown in Item A.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and explain',
  sourceRefs: ['item-a'],
  ms: `Level 4 (4 marks): Relevant factor selected (AO1) and an appropriate, detailed and well-developed explanation of relevant sociological theories, concepts, evidence and methods with good application to the context (differences in the allocation of domestic tasks).
Level 3 (3 marks): Relevant factor with explanation containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant factor with a largely inaccurate or irrelevant explanation.
Level 1 (1 mark): Relevant factor selected only.

Indicative content (AO1): Gender socialisation, traditional norms and values, patriarchy embedded in some families and society, media stereotypes.
Indicative content (AO2):
• The division of labour is determined by patriarchal norms and values that shape the gender roles in our culture.
• The persistence of traditional norms and values has led to this domestic division of labour, e.g. in some older working-class families where segregated conjugal roles may be the norm.
• Women perform more domestic labour because some families are very traditional and may continue to socialise females into assuming they are responsible for domestic tasks.
• Media stereotypes often portray women as primarily responsible for many domestic tasks, reinforcing gender inequality.`,
  topic: 'Domestic division of labour — explanations',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J22_Q07 = {
  id: `${PAPER_ID}-q07`,
  paperId: PAPER_ID,
  number: '07',
  q: 'Identify and explain one advantage of using a mixed methods approach to investigate conjugal role relationships.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and explain',
  sourceRefs: [],
  ms: `Level 4 (4 marks): Relevant advantage selected (AO1) and an appropriate, detailed and well-developed explanation of relevant sociological theories, concepts, evidence and methods with good application to the context (investigating conjugal role relationships).
Level 3 (3 marks): Relevant advantage with explanation containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant advantage with a largely inaccurate or irrelevant explanation.
Level 1 (1 mark): Relevant advantage selected only.

Indicative content (AO1): Develop a more complete picture (methodological pluralism), build on different strengths of quantitative and qualitative methods, triangulation.
Indicative content (AO2):
• Using a mixed methods approach provides the opportunity to generate both quantitative and qualitative data, meaning gaining a detailed knowledge and understanding about conjugal roles.
• The researcher can obtain rich insights into people's experiences through qualitative methods and also make connections between variables through quantitative methods. Adding narrative to numbers can give meaning to objective quantitative data, whereas adding statistics to qualitative data can add precision and allow for comparisons.
• Can cross-check the findings from a qualitative method against the findings from a quantitative method to investigate conjugal roles (triangulation).`,
  topic: 'Research methods — advantages of mixed methods',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J22_Q08 = {
  id: `${PAPER_ID}-q08`,
  paperId: PAPER_ID,
  number: '08',
  q: 'From Item B, identify and describe one way in which Zaretsky saw the family as benefiting capitalist society, including what you know of his perspective on the family.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and describe',
  sourceRefs: ['item-b'],
  ms: `Level 4 (4 marks): Relevant way selected (AO1) and an appropriate, detailed and well-developed description of relevant sociological theories, concepts, evidence and methods with good application to the context (Zaretsky's Marxist perspective on the family).
Level 3 (3 marks): Relevant way selected with description containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant way selected with a largely inaccurate or irrelevant description.
Level 1 (1 mark): Relevant way selected only.

Indicative content (AO1): The family benefits capitalism, working in the interests of the bourgeoisie. The family as a unit of consumption. The view that the role of the family in capitalist society is to reproduce labour.
Indicative content (AO2):
• Eli Zaretsky wrote from a Marxist perspective and saw the economic function of the nuclear family benefitting the capitalist ruling class rather than society as a whole.
• The family benefits capitalist society as it serves as a vital unit of consumption, buying and consuming the products of the capitalist economy.
• He believed that the family helps support capitalism by providing plenty of free labour. Women (housewives) work for the capitalist system for free, keeping the workers fed and clothed and reproducing the next generation of exploited workers.`,
  topic: 'Marxist perspectives — Zaretsky and capitalism',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J22_Q09 = {
  id: `${PAPER_ID}-q09`,
  paperId: PAPER_ID,
  number: '09',
  q: 'Identify one ethical issue that you would need to consider when investigating relationships within families and explain how you would deal with this issue in your investigation.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and explain',
  sourceRefs: [],
  ms: `Level 4 (4 marks): Relevant ethical issue selected (AO1) and an appropriate, detailed and well-developed explanation with good application to the context (relationships within families).
Level 3 (3 marks): Relevant ethical issue with explanation containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant ethical issue with a largely inaccurate or irrelevant explanation.
Level 1 (1 mark): Relevant ethical issue selected only.

Indicative content (AO1): Anonymity, avoidance from harm, confidentiality, informed consent.
Indicative content (AO2):
• Anonymity: ensuring names are not revealed in the report or in the data collection process as related to relationships within families.
• Ensuring no harm comes to anyone involved in the research as related to relationships within families.
• Confidentiality: keeping personal details between researcher and respondents. As a researcher, ensuring that each family member would be free to speak openly and honestly about their thoughts, feelings and experiences without fear of upsetting other family members.
• Obtaining informed consent: making sure that respondents know what the researcher is doing and agree to participate as related to relationships within families.`,
  topic: 'Research methods — ethical issues in family research',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J22_Q10 = {
  id: `${PAPER_ID}-q10`,
  paperId: PAPER_ID,
  number: '10',
  q: 'Discuss how far sociologists would agree that changes in the law are the main reason for the pattern of divorce in Britain since 1969.',
  marks: 12,
  type: 'written',
  commandWord: 'Discuss',
  sourceRefs: [],
  ms: `Level 4 (10–12 marks): Detailed knowledge and understanding. Sustained application. Developed critical analysis and evaluation. Well-constructed arguments with supported judgements and evidence-based conclusions.
Level 3 (7–9 marks): Good knowledge and understanding but some elements lacking detail. Good application and analysis.
Level 2 (4–6 marks): Limited knowledge. Limited application. Limited analysis.
Level 1 (1–3 marks): Fragments of basic knowledge. Little or no application. Little or no analysis.

Indicative content (AO1): Functionalism, Marxism, Feminism, changes in the law, changes in the status of women, changing social attitudes and values, impact of secularisation, influence of the media.

Indicative content (AO2):
• Functionalist perspectives of divorce — e.g. Ronald Fletcher's view and that of Parsons.
• Marxist perspectives of divorce — e.g. class-based differences in divorce.
• Feminist perspectives of divorce — e.g. Kate Millett's view and the fact that most divorce petitions are initiated by women.
• Divorce laws: legal changes have made divorce easier, quicker and cheaper to obtain, e.g. Divorce Reform Act (1969) and legislation in 1984 and 1996 (Family Law Act).
• The status of women: improved opportunities may mean they no longer have to be unhappily married because they lack financial independence.
• Attitudinal changes: the extent to which divorce is no longer associated with stigma and is generally more acceptable.
• The decline in religious beliefs (secularisation) among certain social groups which in the past made divorce morally unacceptable.
• Media coverage of issues relating to divorce.

Indicative content (AO3):
• Analysis and evaluation of functionalist perspectives: Fletcher's view that divorce has increased due to people attaching more value to marriage; Parsons' suggestion that the increase in divorce reflects higher values and expectations placed on marriage.
• Analysis and evaluation of Marxist perspectives: whether the rate of divorce is higher among the working class; the work of Hart and changes in the economy.
• Analysis and evaluation of feminist perspective: the impact of the feminist movement/rejection of patriarchy on the pattern of divorce.
• Analysis and evaluation of the impact of legal changes: the increase in divorce following the 1969 Act.
• Analysis and evaluation of the changing position and social status of women.
• Analysis and evaluation of attitudinal changes: the extent to which divorce has become socially acceptable in all sections of society.
• Analysis and evaluation of the decline in religion in British society.
• Evidence-based judgements about how far legal changes are the main reason for the pattern of divorce in Britain since 1969.`,
  topic: 'Divorce — causes and explanations',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J22_Q11 = {
  id: `${PAPER_ID}-q11`,
  paperId: PAPER_ID,
  number: '11',
  q: 'Discuss how far sociologists would agree that the nuclear family is still considered the norm in Britain today.',
  marks: 12,
  type: 'written',
  commandWord: 'Discuss',
  sourceRefs: [],
  ms: `Level 4 (10–12 marks): Detailed knowledge and understanding. Sustained application. Developed critical analysis and evaluation. Well-constructed arguments with supported judgements and evidence-based conclusions.
Level 3 (7–9 marks): Good knowledge and understanding but some elements lacking detail. Good application and analysis.
Level 2 (4–6 marks): Limited knowledge. Limited application. Limited analysis.
Level 1 (1–3 marks): Fragments of basic knowledge. Little or no application. Little or no analysis.

Indicative content (AO1): Functionalism, New Right, Feminism, Marxism, family diversity/alternative family types/statistical data, the cereal packet image of the family.

Indicative content (AO2):
• Functionalist perspective — emphasis on the nuclear family, providing essential functions for society.
• New Right perspective — suggesting that this family form is the best way for children to develop into stable adults. Reference may be made to Charles Murray.
• Feminist perspective — nuclear families viewed as patriarchal, based on male power and dominance over women.
• Marxist perspective — critical of the nuclear family, seeing it as socialising children into accepting the values of capitalism.
• The increasing diversity of the family, as suggested by the Rapoports, with many people living in other family forms, e.g. increasing number of lone parents, same-sex families.
• The nuclear family often being depicted as the norm by the advertising industry.

Indicative content (AO3):
• Analysis and evaluation of the functionalist perspective: extent to which the nuclear family continues to provide essential functions for society.
• Analysis and evaluation of the New Right perspective: extent to which the nuclear family is considered the best family form in which to raise children.
• Analysis and evaluation of the Marxist perspective: extent to which the nuclear family supports the capitalist economic system.
• Analysis and evaluation of the feminist perspective: extent to which the nuclear family continues to be patriarchal.
• Analysis and evaluation of the impact of family diversity: rise in lone parent families (in 2019, the UK had 2.9 million, an increase of 14.5% since 1999).
• Analysis and evaluation of the idea of the cereal packet family.
• Evidence-based judgements about how far the evidence supports the premise that the nuclear family is considered the norm in Britain today.`,
  topic: 'Nuclear family — norm or myth?',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

// ── Assembled paper ───────────────────────────────────────────────────────────

export const AQA_8192_1_JUN2022 = {
  id: PAPER_ID,
  title: 'AQA Sociology Paper 1 — June 2022',
  subtitle: 'Section A: Families',
  ref: '8192/1',
  year: 2022,
  board: 'AQA',
  session: 'jun',
  date: 'June 2022',
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
        EP_AQA8192_J22_Q01,
        EP_AQA8192_J22_Q02,
        EP_AQA8192_J22_Q03,
        EP_AQA8192_J22_Q04,
        EP_AQA8192_J22_Q05,
        EP_AQA8192_J22_Q06,
        EP_AQA8192_J22_Q07,
        EP_AQA8192_J22_Q08,
        EP_AQA8192_J22_Q09,
        EP_AQA8192_J22_Q10,
        EP_AQA8192_J22_Q11,
      ],
    },
  ],
}
