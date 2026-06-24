// ─── AQA GCSE Sociology Paper 1 — June 2019 ──────────────────────────────────
// Section A: The Sociology of Families (50 marks of 100 total)
// Ref: 8192/1 | June 2019 | 1 hr 45 mins
// This file contains Section A (Families) only.

const PAPER_ID = 'aqa-8192-1-jun2019'
const TOPIC_ID = 'soc_families'

// ── Sources ───────────────────────────────────────────────────────────────────

// Item A is a data table from the British Social Attitudes Survey.
// Table reconstructed from mark scheme context; verify against original paper.
const ITEM_A = {
  id: 'item-a',
  label: 'Item A',
  type: 'table',
  caption: 'British Social Attitudes Survey: domestic division of labour in heterosexual couples, 1994–2012 — percentage where the task is done "always or usually" by the woman',
  attribution: 'British Social Attitudes Survey (NatCen Social Research)',
  headers: ['Domestic task', '1994', '2002', '2012'],
  rows: [
    ['Cooking the evening meal', '70%', '63%', '59%'],
    ['Doing the cleaning', '72%', '68%', '61%'],
    ['Doing the laundry', '79%', '74%', '71%'],
    ['Looking after sick family members', '63%', '58%', '58%'],
    ['Doing the grocery shopping', '51%', '48%', '45%'],
  ],
  note: 'Table figures are approximate — verify exact values against the original paper.',
}

// Item B text reconstructed from mark scheme context; verify against original paper.
const ITEM_B = {
  id: 'item-b',
  label: 'Item B',
  type: 'text',
  attribution: 'Adapted from Ann Oakley, Subject Women (1982)',
  text: `Ann Oakley argued that the idea of the conventional family — in which a breadwinning husband, a dependent housewife and their children live together — is not a natural or inevitable family form, but one particular interpretation of the 'facts' of sexuality and reproduction.

To investigate the idea of the conventional family, Oakley drew on a range of secondary sources, including statistical data from official sources such as the Office of Population Censuses and Surveys (OPCS) and the published research of other sociologists who had studied the family. Using this comparative and analytical approach, she found that the idea of the conventional family was still idealised and presented as normal in public life, even though it was no longer the dominant family form. She concluded that the persistence of this ideal reflected the patriarchal ideology of a society that continued to expect women to perform unpaid domestic roles.`,
}

// ── Questions ─────────────────────────────────────────────────────────────────

export const EP_AQA8192_J19_Q01 = {
  id: `${PAPER_ID}-q01`,
  paperId: PAPER_ID,
  number: '01',
  q: 'What term is commonly used by sociologists to describe a family that consists of a couple whose children have moved out of the family home?\n\nA  Reconstituted family\nB  Lone parent family\nC  Empty nest family\nD  Beanpole family',
  marks: 1,
  type: 'written',
  commandWord: null,
  sourceRefs: [],
  ms: 'C (Empty nest family)',
  topic: 'Family types — empty nest family',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J19_Q02 = {
  id: `${PAPER_ID}-q02`,
  paperId: PAPER_ID,
  number: '02',
  q: 'Which sociological perspective focuses on patriarchy and gender relationships?\n\nA  Feminist\nB  Functionalist\nC  Marxist\nD  New Right',
  marks: 1,
  type: 'written',
  commandWord: null,
  sourceRefs: [],
  ms: 'A (Feminist)',
  topic: 'Sociological perspectives — feminism',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J19_Q03 = {
  id: `${PAPER_ID}-q03`,
  paperId: PAPER_ID,
  number: '03',
  q: 'Describe one function of families.',
  marks: 3,
  type: 'written',
  commandWord: 'Describe',
  sourceRefs: [],
  ms: `Level 3 (3 marks): A coherent description with few inaccuracies. Demonstrates good knowledge and understanding.
Level 2 (2 marks): A partial description with some inaccuracies and omissions.
Level 1 (1 mark): Fragments of knowledge, some inaccurate or irrelevant.

Indicative content:
• Primary socialisation: in early childhood, the learning of basic behaviour patterns, language and skills for later life, so that young children learn the culture and shared values of their society.
• Economic function: society needs a way of providing people with financial support. Adult family members provide shelter, food and money for their children.
• Educational: culture needs to be transmitted to the next generation, so children are effectively socialised into the dominant norms and values of a society.
• Reproductive: society requires new members to ensure the continuation of society. The family produces the next generation of society's members.
• Sexual: the family regulates a married couple's sexual behaviour, thereby helping to stabilise society by regulating sexual activity.
• Stabilises adult personalities: the family provides a warm, loving home where adults can relax and unwind. Emotional support and security within the family reduces stress and strengthens social stability.`,
  topic: 'Functions of the family',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J19_Q04 = {
  id: `${PAPER_ID}-q04`,
  paperId: PAPER_ID,
  number: '04',
  q: 'Identify and describe one criticism that Marxists make about families.',
  marks: 3,
  type: 'written',
  commandWord: 'Identify and describe',
  sourceRefs: [],
  ms: `Level 3 (3 marks): A coherent description with few inaccuracies. Demonstrates good knowledge and understanding.
Level 2 (2 marks): A partial description with some inaccuracies and omissions.
Level 1 (1 mark): Fragments of knowledge, some inaccurate or irrelevant.

Indicative content:
• The Marxist perspective argues that the family is an institution through which social inequalities continue from one generation to the next.
• The bourgeoisie are able to pass on their wealth to family members. In this way, the social class system is re-created over time.
• Educational advantages are passed down through families. For instance, only people from affluent backgrounds can afford to send their children to expensive private schools.
• Through the socialisation process within the family, working-class people may learn to accept their subordinate position in capitalist society and see the system as fair.`,
  topic: 'Marxist perspectives — critique of the family',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J19_Q05 = {
  id: `${PAPER_ID}-q05`,
  paperId: PAPER_ID,
  number: '05',
  q: 'From Item A, examine one strength of the research.',
  marks: 2,
  type: 'written',
  commandWord: 'Examine',
  sourceRefs: ['item-a'],
  ms: `1 mark for identifying a possible strength (AO3) demonstrating a line of argument relating to methods or findings.
1 mark for evaluating (making a judgement/conclusion) why this element represents a possible strength.

Indicative content:
• The sample was nationally representative — therefore it would give a more accurate account of how housework is undertaken by heterosexual couples across the country rather than being restricted to one area.
• Many of the questions are repeated over time, so it is possible to measure any changes in social attitudes and behaviours over time regarding trends in the domestic division of labour.
• Data easily accessible and relatively cheap to obtain, allowing for comparisons to be made with other surveys which suggest there has or has not been a move towards symmetry.
• Data likely to be more accurate as it is based on behaviours rather than attitudes towards gender roles in the home.`,
  topic: 'Research methods — strengths of social surveys',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J19_Q06 = {
  id: `${PAPER_ID}-q06`,
  paperId: PAPER_ID,
  number: '06',
  q: 'Identify and explain one factor that may account for the traditional division of domestic labour shown in Item A.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and explain',
  sourceRefs: ['item-a'],
  ms: `Level 4 (4 marks): Relevant factor identified and an appropriate, detailed and well-developed explanation with clear application to the context (traditional division of domestic labour).
Level 3 (3 marks): Relevant factor with explanation containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant factor with a largely inaccurate or irrelevant explanation.
Level 1 (1 mark): Relevant factor identified only.

Indicative content (AO1): Continuation of patriarchy in society, gender socialisation, traditional norms and values, dual burden/triple shift, media stereotypes.
Indicative content (AO2):
• Feminists would suggest that men and women remain unequal within the family and women still do most of the housework. They see this inequality as stemming from the fact that the family and society are male dominated or patriarchal.
• Sociological research has shown that sex-typing of domestic tasks remains strong. The persistence of traditional norms and values has led to these behaviours regarding the domestic division of labour.
• The division of labour is determined by patriarchal norms and values that shape the gender roles in our culture.
• Dual burden/triple shift: women in paid employment continue to perform more domestic labour because that is what society expects them to do and has socialised them to do.
• Media stereotypes continue to portray women as primarily responsible for many domestic tasks.`,
  topic: 'Domestic division of labour — explanations',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J19_Q07 = {
  id: `${PAPER_ID}-q07`,
  paperId: PAPER_ID,
  number: '07',
  q: 'Identify and explain one disadvantage of using structured interviews to investigate conjugal role relationships.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and explain',
  sourceRefs: [],
  ms: `Level 4 (4 marks): Relevant disadvantage selected (AO1) and an appropriate, detailed and well-developed explanation with good application to the context (investigating conjugal role relationships).
Level 3 (3 marks): Relevant disadvantage with explanation containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant disadvantage with a largely inaccurate or irrelevant explanation.
Level 1 (1 mark): Relevant disadvantage selected only.

Indicative content (AO1): The inflexibility of structured interviews, the interviewer effect, the quality of the data.
Indicative content (AO2):
• The inflexibility of structured interviews does not allow the researcher the flexibility to investigate a line of enquiry into conjugal role relationships that may not have been anticipated. Structured interviews close off, rather than open up, new and interesting issues, limiting opportunities for respondents to express their own views.
• The interviewer effect: the social characteristics of the interviewer (e.g. age, gender, ethnicity) may affect the validity of the data, raising questions about the accuracy and truthfulness of responses. Respondents may give socially acceptable answers or answers that show them in a good light.
• The quality of the data gathered: structured interviews do not allow for the collection of in-depth qualitative data about conjugal relationships as they are based on a pre-set list of standardised questions. The wording and focus of the questions are predetermined by the researcher.`,
  topic: 'Research methods — disadvantages of structured interviews',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J19_Q08 = {
  id: `${PAPER_ID}-q08`,
  paperId: PAPER_ID,
  number: '08',
  q: 'From Item B, identify and describe the research method used by Oakley, including what you know of her perspective on the family.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and describe',
  sourceRefs: ['item-b'],
  ms: `Level 4 (4 marks): Relevant ideas selected (AO1) and an appropriate, detailed and well-developed description of relevant sociological theories, concepts, evidence and methods with good application to the context (Oakley's feminist perspective on the family).
Level 3 (3 marks): Relevant ideas selected with description containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant ideas selected with a largely inaccurate or irrelevant description.
Level 1 (1 mark): Relevant idea selected only.

Indicative content (AO1): Secondary sources, the work of other sociologists/literature review, statistical data.
Indicative content (AO2):
• Oakley writes from a feminist perspective; she suggested that the idea of the conventional family was one particular interpretation of the 'facts' of sexuality and reproduction.
• She compared and analysed a range of pre-existing research from other sociologists who had studied the family.
• She used the data to provide a critical analysis of the conventional nuclear family. She was investigating the 'idea' of the conventional family and how it was still idealised even though it was no longer the dominant family form.
• She supported her argument with relevant statistical data, e.g. official statistics provided by the OPCS.`,
  topic: 'Feminist perspectives — Oakley and the conventional family',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J19_Q09 = {
  id: `${PAPER_ID}-q09`,
  paperId: PAPER_ID,
  number: '09',
  q: 'Identify one ethical issue you would need to consider when investigating attitudes towards arranged marriage and explain how you would deal with this issue in your investigation.',
  marks: 4,
  type: 'written',
  commandWord: 'Identify and explain',
  sourceRefs: [],
  ms: `Level 4 (4 marks): Relevant ethical issue selected and an appropriate, detailed and well-developed explanation with clear application to the context (attitudes towards arranged marriage).
Level 3 (3 marks): Relevant ethical issue with explanation containing some inaccuracies or omissions.
Level 2 (2 marks): Relevant ethical issue with a largely inaccurate or irrelevant explanation.
Level 1 (1 mark): Relevant ethical issue selected only.

Indicative content (AO1): Anonymity, confidentiality, informed consent, avoidance of harm.
Indicative content (AO2):
• Anonymity: ensuring names are not revealed in your report or in the data collection process as related to the issue under investigation (attitudes towards arranged marriage).
• Confidentiality: keeping secure any personal details exchanged between you and the respondent as related to the issue under investigation (attitudes towards arranged marriage).
• Gaining informed consent: making sure that your respondents know what you are doing and agree to participate as related to the issue under investigation (attitudes towards arranged marriage).
• Ensuring no harm comes to anyone involved as related to the issue under investigation (attitudes towards arranged marriage).`,
  topic: 'Research methods — ethical issues',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J19_Q10 = {
  id: `${PAPER_ID}-q10`,
  paperId: PAPER_ID,
  number: '10',
  q: 'Discuss how far sociologists would agree that families are the main agent of socialisation.',
  marks: 12,
  type: 'written',
  commandWord: 'Discuss',
  sourceRefs: [],
  ms: `Level 4 (10–12 marks): Detailed knowledge and understanding. Sustained application. Developed critical analysis and evaluation. Well-constructed arguments with supported judgements and evidence-based conclusions.
Level 3 (7–9 marks): Good knowledge and understanding but some elements lacking detail. Good application and analysis.
Level 2 (4–6 marks): Limited knowledge. Limited application. Limited analysis.
Level 1 (1–3 marks): Fragments of basic knowledge. Little or no application. Little or no analysis.

Indicative content (AO1): Functionalism, Feminism, Marxism, alternative agencies of socialisation, changes in the significance of the family as an agency of socialisation.

Indicative content (AO2):
• Functionalist perspectives on families as an agency of socialisation. Reference to Parsons' functionalist account of primary socialisation.
• Feminist perspectives on families as helping to preserve patriarchy as a consequence of socialisation.
• Marxist perspectives on families as a unit of consumption supporting the capitalist system as a consequence of socialisation.
• Alternative agencies of socialisation, e.g. the education system and the mass media.
• Evidence for/against the reduced significance of the family as an agent of socialisation.

Indicative content (AO3):
• Analysis and evaluation of functionalist theories: e.g. the extent to which Parsons' view is significant.
• Analysis and evaluation of feminist theories: e.g. the extent to which Oakley's view is significant.
• Analysis and evaluation of Marxist theories: e.g. the extent to which Zaretsky's argument remains significant.
• Analysis and evaluation of the significance of other agents of socialisation, e.g. the role of the mass media/social media.
• Analysis and evaluation of evidence for the reduced significance of the family as an agency of socialisation.
• Evidence-based judgements about how far the evidence supports the premise that families are the main agent of socialisation.`,
  topic: 'Socialisation — family as the main agent',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

export const EP_AQA8192_J19_Q11 = {
  id: `${PAPER_ID}-q11`,
  paperId: PAPER_ID,
  number: '11',
  q: 'Discuss how far sociologists would agree that marriage is still important in Britain today.',
  marks: 12,
  type: 'written',
  commandWord: 'Discuss',
  sourceRefs: [],
  ms: `Level 4 (10–12 marks): Detailed knowledge and understanding. Sustained application. Developed critical analysis and evaluation. Well-constructed arguments with supported judgements and evidence-based conclusions.
Level 3 (7–9 marks): Good knowledge and understanding but some elements lacking detail. Good application and analysis.
Level 2 (4–6 marks): Limited knowledge. Limited application. Limited analysis.
Level 1 (1–3 marks): Fragments of basic knowledge. Little or no application. Little or no analysis.

Indicative content (AO1): Functionalist perspective, Feminist perspective, Marxist perspective, cultural/ethnic differences, changing social attitudes, changing role of women, cost of marriage, the Marriage (Same Sex Couples) Act 2013, secularisation, official statistics.

Indicative content (AO2):
• Functionalist perspective: the functional importance of marriage and family life, e.g. ensuring the health and survival of society.
• Feminist perspective: marriage as primarily of benefit to men.
• Marxist perspective: marriage and conventional family life as beneficial to the capitalist economic system.
• Cultural/ethnic differences: for example, marriage is still seen as very important in British Asian family life.
• Changing social attitudes: less stigma attached to living together without being married today than in previous years.
• Changing role of women: e.g. women's growing financial independence means they have less need for the security of marriage and support from men.
• Cost of marriage: the average cost of a wedding in Britain is now over £20,000. Cohabiting may be seen by many couples as a cheaper option.
• Same-sex couples: demand for legal changes and the popularity of marriage amongst same-sex couples.
• Secularisation: the decline of religious observance as a contributory factor, e.g. cohabitation is no longer commonly regarded as 'sinful'.
• Official statistics: whilst many people are still marrying, a recent decline in the number of people marrying suggests it may be considered less important.

Indicative content (AO3):
• Analysis and evaluation of the functionalist perspective on the importance of marriage.
• Analysis and evaluation of the feminist perspective on the importance of marriage.
• Analysis and evaluation of the Marxist perspective on the importance of marriage.
• Analysis and evaluation of the cultural and ethnic differences relating to the importance of marriage.
• Analysis and evaluation of changing social attitudes as a significant factor.
• Analysis and evaluation of the changing role of women in society as a significant factor.
• Analysis and evaluation of the cost of marriage as a significant factor.
• Analysis and evaluation of the significance of same-sex marriage.
• Analysis and evaluation of secularisation as a significant factor.
• Analysis and evaluation of relevant official statistics.
• Evidence-based judgements about how far the evidence suggests marriage is still important in Britain today.`,
  topic: 'Marriage — continued importance',
  topicLabel: 'Families',
  topicId: TOPIC_ID,
}

// ── Assembled paper ───────────────────────────────────────────────────────────

export const AQA_8192_1_JUN2019 = {
  id: PAPER_ID,
  title: 'AQA Sociology Paper 1 — June 2019',
  subtitle: 'Section A: Families',
  ref: '8192/1',
  year: 2019,
  board: 'AQA',
  session: 'jun',
  date: 'June 2019',
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
        EP_AQA8192_J19_Q01,
        EP_AQA8192_J19_Q02,
        EP_AQA8192_J19_Q03,
        EP_AQA8192_J19_Q04,
        EP_AQA8192_J19_Q05,
        EP_AQA8192_J19_Q06,
        EP_AQA8192_J19_Q07,
        EP_AQA8192_J19_Q08,
        EP_AQA8192_J19_Q09,
        EP_AQA8192_J19_Q10,
        EP_AQA8192_J19_Q11,
      ],
    },
  ],
}
