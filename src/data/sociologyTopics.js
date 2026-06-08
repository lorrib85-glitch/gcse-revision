// ─── AQA GCSE Sociology -- Questions by topic ──────────────────────────────────
// 8192/1: Families & Education | 8192/2: Crime & Deviance + Social Stratification
// Sources: JUN22, JUN23 past papers

export const SOCIOLOGY_TOPIC_GROUPS = [

  // ── FAMILIES ─────────────────────────────────────────────────────────────
  {
    id: 'soc_families_key_terms',
    label: 'Families -- Key Terms',
    icon: '👨‍👩‍👧',
    color: '#FF5C7A',
    bg: 'rgba(255,92,122,.12)',
    border: 'rgba(255,92,122,.28)',
    description: 'Identify key sociological terms used in the study of families. 1-mark multiple choice questions.',
    paper: 'Paper 1',
    skillTip: 'Learn the exact sociological term -- examiners want precision. "Double shift" not just "working and housework". Use your glossary.',
    questions: [
      {
        id: 'soc_f_kt1', source: 'P1 JUN23', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe the experience of women who have both a paid job and have to do most of the housework?',
        options: ['Domestic division of labour', 'Double shift', 'Dual career', 'Dual worker'],
        correctIndex: 1,
        ms: 'B -- Double shift\n[1 mark AO1]',
      },
      {
        id: 'soc_f_kt2', source: 'P1 JUN23', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe the way that parents channel their children\'s interests into toys, games and other activities that are seen as appropriate for their gender?',
        options: ['Canalization', 'Discrimination', 'Idealisation', 'Intergenerational'],
        correctIndex: 0,
        ms: 'A -- Canalization\n[1 mark AO1]',
      },
      {
        id: 'soc_f_kt3', source: 'P1 JUN22', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe partners who live together without either being married or in a civil partnership?',
        options: ['Arranged marriage', 'Cohabitation', 'Commune', 'Conjugal relationships'],
        correctIndex: 1,
        ms: 'B -- Cohabitation\n[1 mark AO1]',
      },
      {
        id: 'soc_f_kt4', source: 'P1 JUN22', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe a family in which a woman holds power and authority?',
        options: ['Matriarchal family', 'Patriarchal family', 'Symmetrical family', 'Traditional family'],
        correctIndex: 0,
        ms: 'A -- Matriarchal family\n[1 mark AO1]',
      },
      {
        id: 'soc_f_kt5', source: 'P1 NOV21', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe a family consisting of parents, their children and other relatives, such as grandparents, aunts and uncles?',
        options: ['Blended family', 'Empty nest family', 'Extended family', 'Nuclear family'],
        correctIndex: 2,
        ms: 'C -- Extended family\n[1 mark AO1]',
      },
      {
        id: 'soc_f_kt6', source: 'P1 NOV21', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe the role men traditionally perform in the family?',
        options: ['Expressive', 'Instrumental', 'Matriarchal', 'Nurturing'],
        correctIndex: 1,
        ms: 'B -- Instrumental\n[1 mark AO1]',
      },
    ],
  },

  {
    id: 'soc_families_describe',
    label: 'Families -- Describe Questions',
    icon: '🏠',
    color: '#FF5C7A',
    bg: 'rgba(255,92,122,.12)',
    border: 'rgba(255,92,122,.28)',
    description: 'Describe sociological concepts, examples and family types. 3-mark questions requiring coherent description using sociological knowledge.',
    paper: 'Paper 1',
    skillTip: 'For 3 marks: Level 3 = coherent description with few inaccuracies. Name the concept clearly, describe what it means, give a specific example or detail. Use at least one sociological term.',
    levelDescriptors: {
      '3 marks': 'Coherent description with few inaccuracies -- good knowledge and understanding',
      '2 marks': 'Partial description -- some relevant material but some inaccuracies or omissions',
      '1 mark':  'Fragments of knowledge -- limited understanding, some inaccurate or irrelevant content',
    },
    questions: [
      {
        id: 'soc_f_d1', source: 'P1 JUN23', marks: 3,
        q: 'Describe one example of a commune.',
        ms: `Level 3 (3 marks): Coherent description with few inaccuracies. Good knowledge and understanding of sociological theories, concepts, evidence and methods.

Indicative content (AO1):
* A group of people who share in the ownership of property and the division of labour, valuing equality and cooperation between members -- such as an Israeli kibbutz.
* A small community who may follow similar political beliefs or environmental principles -- such as Christiania in Copenhagen.
* A small community whose members share in the ownership of wealth and may follow certain religious beliefs -- such as the Bruderhof Christian community in East Sussex.
* A community whose members avoid activities that might exhaust the earth's natural resources -- such as the Findhorn ecovillage community in Scotland.`,
      },
      {
        id: 'soc_f_d2', source: 'P1 JUN23', marks: 3,
        q: 'Identify and describe one consequence of divorce for family members.',
        ms: `Level 3 (3 marks): Coherent description with good knowledge and understanding.

Indicative content (AO1):
* Financial: decisions about dividing property and possessions, usually having to manage with less money coming into the home.
* Emotional: either a change for the better, or a stressful change of circumstances -- particularly for children.
* Co-parenting: logistical issues related to living with one parent but keeping in regular contact with the other.
* Re-partnering: adjusting to step-families, step-parents, and step-siblings.`,
      },
      {
        id: 'soc_f_d3', source: 'P1 JUN22', marks: 3,
        q: 'Describe what sociologists mean by kinship.',
        ms: `Level 3 (3 marks): Coherent description with good knowledge and understanding.

Indicative content (AO1):
* The social relationships derived from blood ties and marriage.
* Familial ties, including husbands and wives, brothers and sisters, aunts and uncles, cousins etc.
* Relationships based on adoption or civil partnerships.
* Kinship networks extend beyond the nuclear family to wider social bonds based on shared ancestry or marriage.`,
      },
      {
        id: 'soc_f_d4', source: 'P1 JUN22', marks: 3,
        q: 'Identify and describe one example of how a grandparent can contribute to family life.',
        ms: `Level 3 (3 marks): Coherent description with good knowledge and understanding.

Indicative content (AO1):
* Childcare: a grandparent may look after young grandchildren so that parent(s) can work and avoid the costs of private childcare.
* Economic support: giving and lending money, providing gifts, helping with household costs.
* Emotional and moral support: listening, talking and offering advice to other family members.
* Passing on cultural traditions, values and family history to younger generations.`,
      },
      {
        id: 'soc_f_d5', source: 'P1 NOV21', marks: 3,
        q: 'Describe one example of patriarchy within families.',
        ms: `Level 3 (3 marks): A coherent description with few inaccuracies. Demonstrates good knowledge and understanding. (AO1)

Indicative content (AO1):
* The dominance of men over women in the family eg money management, decision-maker.
* Distribution of responsibilities for certain domestic tasks eg household chores such as cleaning, doing the laundry.
* Female role as the stay at home housewife and carer.
* Male role as the breadwinner, careerist.`,
      },
      {
        id: 'soc_f_d6', source: 'P1 NOV21', marks: 3,
        q: 'Identify and describe one factor that may have led to an increase in family diversity in Britain.',
        ms: `Level 3 (3 marks): A coherent description with few inaccuracies. Demonstrates good knowledge and understanding. (AO1)

Indicative content (AO1):
* Changes in social attitudes and values eg secularisation and greater acceptance of alternative family structures.
* Increase in numbers divorcing and rise in lone parent families.
* Immigration and cultural differences.
* Increase in people remarrying or cohabiting eg forming blended or reconstituted families.`,
      },
    ],
  },

  {
    id: 'soc_families_item',
    label: 'Families -- Item/Source Questions',
    icon: '📋',
    color: '#FF5C7A',
    bg: 'rgba(255,92,122,.12)',
    border: 'rgba(255,92,122,.28)',
    description: 'Use the provided Item (source) to answer questions. 2-4 mark questions requiring analysis and application from the stimulus material.',
    paper: 'Paper 1',
    skillTip: 'Always refer directly to the Item. Quote or paraphrase it. Then add your own sociological knowledge -- "this links to..." or "a sociologist would argue...". For 2-mark examine questions: one point FROM the item + one reason/evaluation.',
    questions: [
      {
        id: 'soc_f_it1', source: 'P1 JUN22', marks: 2,
        extract: `ITEM A -- Oakley's Research (1974)\n\nIn 1974, Ann Oakley collected information from 40 married women who had one child or more under the age of 5. All of the women were British or Irish born and aged between 20 and 30 years old. Half of her sample were working class and half were middle class. All of the women lived in the London area.\n\nOakley found greater equality in the allocation of domestic tasks between married couples in the middle class than in the working class. However, in both social classes, she found little evidence of their husbands sharing the housework. Only 15% had a husband who shared domestic work to a significant level.\n\nSource: Oakley, A, The Sociology of Housework (1974)`,
        q: 'From Item A, examine one weakness of Oakley\'s research.',
        ms: `2 marks (AO3):\n1 mark: identifying a weakness (line of argument from the item)\n1 mark: evaluating why this is a weakness (judgement/conclusion)\n\nIndicative content:\n* Small sample of only 40 women -- more likely to be unrepresentative, so findings cannot be generalised to all married women.\n* London-based sample -- not representative of women nationally, particularly in rural areas or different regions.\n* Dated research (1974) -- may not reflect contemporary society where gender roles have changed significantly.\n* Sample only focused on married couples -- excludes cohabiting couples, single parents, and same-sex couples.\n* Does not quantify the amount or type of housework, just states "significant level" which is subjective.`,
      },
      {
        id: 'soc_f_it2', source: 'P1 JUN22', marks: 4,
        extract: `ITEM A -- Oakley's Research (1974)\n\nIn 1974, Ann Oakley collected information from 40 married women who had one child or more under the age of 5. All of the women were British or Irish born and aged between 20 and 30 years old. Half of her sample were working class and half were middle class. All of the women lived in the London area.\n\nOakley found greater equality in the allocation of domestic tasks between married couples in the middle class than in the working class. However, in both social classes, she found little evidence of their husbands sharing the housework. Only 15% had a husband who shared domestic work to a significant level.\n\nSource: Oakley, A, The Sociology of Housework (1974)`,
        q: 'Identify and explain one factor that may account for differences in the allocation of domestic tasks as shown in Item A.',
        ms: `4 marks (AO1 = 1, AO2 = 3)\nLevel 4: Relevant factor + detailed well-developed explanation applied to the context\nLevel 3: Relevant factor + explanation with some inaccuracies but some application to context\nLevel 2: Relevant factor + largely inaccurate explanation, weakly applied\nLevel 1: Relevant factor only\n\nIndicative content AO1 (factor):\n* Gender socialisation\n* Traditional norms and values\n* Patriarchy embedded in families and society\n* Media stereotypes\n\nIndicative content AO2 (explanation + application to context):\n* The division of labour is determined by patriarchal norms and values that shape gender roles -- linked to the class differences Oakley found, where traditional working class families may maintain more segregated conjugal roles.\n* Women perform more domestic labour because of traditional socialisation that leads females to assume responsibility for domestic tasks -- which explains why only 15% of husbands shared housework significantly.\n* Media stereotypes often portray women as primarily responsible for domestic tasks, reinforcing traditional gender roles that persist even as women enter the workforce.`,
      },
      {
        id: 'soc_f_it3', source: 'P1 JUN23', marks: 4,
        extract: `ITEM B -- Oakley's Conventional Family (1982)\n\nIn 1982, Ann Oakley defined the conventional family as a nuclear family that consisted of a married couple and their children who lived together. She identified a number of features associated with conventional families:\n* Women were expected to do unpaid work inside the home while men were expected to do paid work outside the home.\n* The man's economic power was linked to his income from paid work.\n* The woman's dependence on the man's wages was an aspect of inequality.\n\nStatistically the conventional family is no longer the norm, but according to Oakley the idea of conventional family life remained a powerful one in society.\n\nSource: Oakley, A, Conventional Families, 1982.`,
        q: 'From Item B, identify and describe one way in which Oakley saw the conventional family as being patriarchal, including what you know of her perspective on the family.',
        ms: `4 marks (AO1 = 1, AO2 = 3)\nLevel 4: Relevant way + detailed well-developed description applied to Oakley's perspective\nLevel 3: Relevant way + description with some inaccuracies but some application\nLevel 2: Relevant way + largely inaccurate description, weakly applied\nLevel 1: Relevant way only\n\nIndicative content AO1:\n* Women were expected to do unpaid work inside the home\n* The man's economic power was linked to his income from paid work\n* The woman's dependence on the man's wages was an aspect of gender inequality\n\nIndicative content AO2:\n* Writing from a feminist perspective, Oakley investigated the 'idea' of the conventional family by reviewing existing data. She argued this idea remained idealised even though it was no longer the dominant family form.\n* Gender role inequalities in the conventional family reinforced patriarchal relationships -- women as unpaid domestic workers, men as breadwinners.\n* Economic power in the conventional family reinforced patriarchy -- the man controlled financial resources, creating dependency for women.`,
      },
      {
        id: 'soc_f_it4', source: 'P1 JUN22', marks: 4,
        extract: `ITEM B -- Zaretsky on the Family (1976)\n\nWriting in 1976, Eli Zaretsky argued that the nuclear family had an economic function that served the interests of capitalism. He believed the family to be a key unit of consumption; in other words families bought and consumed the products of the capitalist economy.\n\nHe also believed that it was through the family that each social class reproduced itself over time. Through inheritance, the bourgeois family transmitted its private property from one generation to the next, whilst the proletarian family reproduced the labour force by producing future generations of workers.\n\nSource: Zaretsky, E, Capitalism, the Family and Personal Life`,
        q: 'From Item B, identify and describe one way in which Zaretsky saw the family as benefiting capitalist society, including what you know of his perspective on the family.',
        ms: `4 marks (AO1 = 1, AO2 = 3)\n\nIndicative content AO1:\n* The family benefits capitalism as a key unit of consumption\n* The family reproduces the labour force for capitalism\n* Through inheritance, the bourgeois family transmits private property\n\nIndicative content AO2:\n* Writing from a Marxist perspective, Zaretsky saw the nuclear family's economic function as benefiting the capitalist ruling class rather than society as a whole.\n* The family as a unit of consumption: families buy and consume the products of the capitalist economy, generating profit for the bourgeoisie.\n* Women as unpaid domestic labour: housewives work for free, keeping workers fed and clothed, and reproduce the next generation of exploited workers -- all benefiting capitalism without cost.\n* The reproduction of class: the bourgeois family passes down private property through inheritance, while the proletarian family reproduces the labour force.`,
      },
      {
        id: 'soc_f_it5', source: 'P1 NOV21', marks: 2,
        extract: `ITEM A -- Divorce Statistics\n\nThe graph in Item A shows official statistics collected by the Office for National Statistics (ONS) on the number of divorces granted in England and Wales over a period of several decades. The data shows an overall upward trend in the number of divorces granted across the period covered.\n\nSource: Office for National Statistics`,
        q: 'From Item A, examine one weakness of using statistics to research divorce.',
        ms: `2 marks (AO3):\n1 mark: identifying a weakness (line of argument relating to methods or findings)\n1 mark: evaluating why this represents a weakness (judgement/conclusion)\n\nIndicative content AO3:\n* Only provides numerical information, whereas qualitative sources such as unstructured interviews would provide in-depth data eg to explain an individual's reasons for seeking a divorce.\n* Limited amount of evidence available eg does not explain the reasons for variations between age groups or ethnic groups, and only provides data from certain years.\n* The exclusive use of statistical data does not allow for triangulation (a comparison of data from a variety of sources, both qualitative and quantitative).`,
      },
      {
        id: 'soc_f_it6', source: 'P1 NOV21', marks: 4,
        extract: `ITEM A -- Divorce Statistics\n\nThe graph in Item A shows official statistics collected by the Office for National Statistics (ONS) on the number of divorces granted in England and Wales over a period of several decades. The data shows an overall upward trend in the number of divorces granted across the period covered.\n\nSource: Office for National Statistics`,
        q: 'Describe the type of statistical data shown in Item A. Identify the trend shown by the data and explain one factor which may account for this trend.',
        ms: `4 marks (AO1 = 1, AO2 = 3) -- 'Context' here refers to the increase in the number of divorces.\n\nLevel 4 (4 marks): Relevant description of the data (AO1). Upward trend identified and an appropriate, detailed and well-developed explanation offered with a clear application to the context. (AO2)\nLevel 3 (3 marks): Relevant description + upward trend identified, explanation contains some inaccuracies/omissions but has some application to context.\nLevel 2 (2 marks): Relevant description + upward trend identified, with no explanation or a largely inaccurate/irrelevant explanation only weakly applied.\nLevel 1 (1 mark): Relevant description of the data only.\n\nIndicative content AO1 (description of data):\n* Official statistics on divorce (collected by or on behalf of the government) showing the number of divorces recorded. Accept interval data. Note: 'quantitative data' alone [all statistics are quantitative] or descriptions of the type of chart are NOT acceptable answers.\n\nIndicative content AO2 (trend + explanation):\n* The trend is up (accept increasing/rising).\n* Legal grounds for divorce have changed eg 'irretrievable breakdown', making it potentially easier/quicker to obtain a divorce.\n* Influence of the feminist movement, with more women unwilling to accept certain behaviour in a marriage/unequal relationship.\n* Changing social attitudes, with divorce becoming more socially acceptable.\n* The declining importance of religion in society, with fewer people having religious objections to divorce.\n* Women are no longer dependent on men for their financial security.`,
      },
      {
        id: 'soc_f_it7', source: 'P1 NOV21', marks: 4,
        extract: `ITEM B -- Willmott and Young's Family Studies\n\nSociologists Michael Young and Peter Willmott studied family life in Britain over several decades.\n\nIn the 1950s, Young and Willmott studied family life in East London, focusing on the traditional working-class community living at that time in Bethnal Green.\n\nIn the early 1970s they conducted a large-scale social survey. In this research they interviewed almost 2000 individuals living in the London area. They concluded that family life had become largely home centred with much of the family's leisure time spent in the home and involving activities such as watching television together. They also concluded that in the 1970s nuclear family, the husband and wife were increasingly sharing their chores around the house, describing this pattern as the development of a 'symmetrical family'.\n\nSource: Willmott, P and Young, M, 'Family and Kinship in East London' (1957) & 'The Symmetrical Family' (1973)`,
        q: 'From Item B, identify and describe the research method used by Willmott and Young in the early 1970s, including what you know of their perspective on the family.',
        ms: `4 marks (AO1 = 1, AO2 = 3) -- 'Context' here refers to the work of Willmott and Young, particularly their perspective on the family.\n\nLevel 4 (4 marks): Relevant research method selected (AO1) and an appropriate, detailed, well-developed description offered with a good application to the context. (AO2)\nLevel 3 (3 marks): Relevant method selected with description containing some inaccuracies/omissions but some application to context.\nLevel 2 (2 marks): Relevant method selected with a largely inaccurate or irrelevant description, only weakly applied.\nLevel 1 (1 mark): Relevant research method selected only.\n\nIndicative content AO1 (method):\n* Social survey.\n* Interviews.\n\nIndicative content AO2 (perspective + application):\n* Writing from a functionalist perspective, Young and Willmott used the term symmetrical family to describe the Stage 3 (home centred) nuclear family, with each spouse sharing chores and decisions.\n* Interviewed almost 2000 people, with each respondent answering an identical set of questions -- a structured, large-scale social survey approach typical of functionalist research into family life.`,
      },
    ],
  },

  {
    id: 'soc_families_methods',
    label: 'Families -- Research Methods',
    icon: '🔬',
    color: '#FF5C7A',
    bg: 'rgba(255,92,122,.12)',
    border: 'rgba(255,92,122,.28)',
    description: 'Apply research methods knowledge to the context of family research. 4-mark identify and explain questions.',
    paper: 'Paper 1',
    skillTip: 'Structure: (1) Name the issue/advantage/disadvantage. (2) Explain what it means generally. (3) Apply it specifically to the family context in the question. Level 4 = strong application to context throughout.',
    questions: [
      {
        id: 'soc_f_m1', source: 'P1 JUN23', marks: 4,
        q: 'Identify and explain one disadvantage of using unstructured interviews to investigate one-person households.',
        ms: `4 marks (AO1 = 1, AO2 = 3)\n\nIndicative content AO1 (disadvantage to identify):\n* Comparability / Reliability / Representativeness / Validity / Interviewer skills / Time / Complex data sets\n\nIndicative content AO2 (explanation applied to context):\n* Not comparable: qualitative data from unstructured interviews is difficult to compare between different one-person households -- each interview will produce different data making patterns hard to identify.\n* Representativeness: the number of unstructured interviews that can be conducted is small, so the sample of one-person households may not be representative of all one-person households nationally.\n* Reliability: questions are not standardised, so the interview cannot be easily replicated -- different researchers asking different questions makes it hard to check findings.\n* Interviewer bias: close involvement between interviewer and interviewee studying one-person households may introduce bias.\n* Time-consuming: unstructured interviews require significant time investment per respondent, limiting the number of one-person households that can be studied.`,
      },
      {
        id: 'soc_f_m2', source: 'P1 JUN23', marks: 4,
        q: 'Identify one practical issue you would need to consider when using postal questionnaires to investigate role relationships within the family and explain how you would deal with this issue in your investigation.',
        ms: `4 marks (AO1 = 1, AO2 = 3)\n\nIndicative content AO1 (practical issue):\n* Time / Cost / Accessibility / Sample size or response rate\n\nIndicative content AO2 (explanation + how you would deal with it):\n* Time: obtaining a large representative sample of family forms would take significant time. Solution: use email/online survey questionnaires to speed up data gathering, or use existing secondary data readily available online.\n* Cost: mailing costs for a national sample would be high. Solution: use email online questionnaires to significantly reduce costs, or seek funding from organisations like the Economic and Social Research Council.\n* Accessibility: gaining access to family households may be difficult. Solution: use unstructured interviews which build rapport and trust, making participants more willing to open up about role relationships.\n* Low response rate: the sample may be small if response rates are poor. Solution: send out more questionnaires, include pre-paid reply envelopes, or offer incentives to encourage responses.`,
      },
      {
        id: 'soc_f_m3', source: 'P1 JUN22', marks: 4,
        q: 'Identify and explain one advantage of using a mixed methods approach to investigate conjugal role relationships.',
        ms: `4 marks (AO1 = 1, AO2 = 3)\n\nIndicative content AO1 (advantage):\n* Methodological pluralism -- develops a more complete picture\n* Triangulation -- cross-checking findings\n* Combines strengths of both quantitative and qualitative methods\n\nIndicative content AO2 (explanation applied to conjugal roles):\n* A mixed methods approach provides both quantitative and qualitative data about conjugal roles, giving a more complete understanding. Quantitative data (e.g. questionnaires) shows how many couples share domestic tasks; qualitative data (e.g. interviews) reveals how couples feel about those roles.\n* Triangulation: findings from qualitative methods can be cross-checked against quantitative findings when investigating conjugal roles, increasing the validity of conclusions.\n* The researcher can add narrative to numbers -- statistics about division of labour gain deeper meaning when combined with interview data about personal experiences of role relationships.`,
      },
      {
        id: 'soc_f_m4', source: 'P1 JUN22', marks: 4,
        q: 'Identify one ethical issue that you would need to consider when investigating relationships within families and explain how you would deal with this issue in your investigation.',
        ms: `4 marks (AO1 = 1, AO2 = 3)\n\nIndicative content AO1 (ethical issue):\n* Anonymity / Avoidance of harm / Confidentiality / Informed consent\n\nIndicative content AO2 (explanation + how to deal with it):\n* Informed consent: ensure all family members know the purpose of the research and agree to participate. Provide a clear information sheet about what the research involves before they commit.\n* Confidentiality: keep personal details between researcher and respondents. Ensure each family member can speak openly about role relationships without fear that their views will be shared with other family members.\n* Anonymity: do not reveal participants' names in published findings. Use pseudonyms or codes to protect the identities of family members.\n* Avoidance of harm: be sensitive to potentially difficult topics -- domestic inequality or conflict within the family could cause distress. Be prepared to signpost support if needed.`,
      },
      {
        id: 'soc_f_m5', source: 'P1 NOV21', marks: 4,
        q: 'Identify and explain one disadvantage of using secondary data to investigate attitudes towards marriage.',
        ms: `4 marks (AO1 = 1, AO2 = 3)\n\nIndicative content AO1:\n* Representativeness.\n* Validity.\n* Bias.\n* The original nature and purpose of the data.\n* Relevance of the secondary data.\n\nIndicative content AO2:\n* Potentially unrepresentative of a wide social group, when investigating attitudes towards marriage.\n* May not provide a true picture of attitudes towards marriage and therefore lack validity.\n* The data may only reflect one point of view with regard to marriage.\n* Concerns over how the data was collected and whether sociological research methods were used to gather data on marriage.\n* The data may not be specifically relevant to marriage, limited or dated in nature.`,
      },
      {
        id: 'soc_f_m6', source: 'P1 NOV21', marks: 4,
        q: 'Identify one function of the family and explain how you would investigate this function using a case study.',
        ms: `4 marks (AO1 = 1, AO2 = 3)\n\nIndicative content AO1 (function):\n* Economic.\n* Primary socialisation.\n* Reproductive.\n* Sexual.\n* Stabilisation of adult personalities.\n\nIndicative content AO2:\n* Identify an appropriate family or families who would be willing to be the subject of a case study.\n* Select an appropriate methodological approach eg interviews, observation or a combination of methods.\n* Take account of relevant ethical issues eg confidentiality.\n* Compare case study data with relevant secondary sources (triangulation).\n* Analyse the data looking at patterns and trends relating to the selected function.`,
      },
    ],
  },

  {
    id: 'soc_families_12mark',
    label: 'Families -- 12-Mark Discuss Questions',
    icon: '⚖️',
    color: '#FF5C7A',
    bg: 'rgba(255,92,122,.12)',
    border: 'rgba(255,92,122,.28)',
    description: '"Discuss how far sociologists would agree..." -- 12-mark extended writing requiring knowledge, application and evaluation of multiple sociological perspectives.',
    paper: 'Paper 1',
    skillTip: 'Structure: Introduction -> Agree (evidence + theory) -> Disagree/Alternative view (evidence + theory) -> Conclusion with your judgement. Use: Functionalism, Marxism, Feminism. Include named sociologists. Evaluate each perspective. "How far" means give a balanced, argued conclusion.',
    levelDescriptors: {
      'Level 4 (10-12)': 'Detailed knowledge + sustained application + developed critical analysis. Wide range of specialist terms. Well-constructed arguments with supported judgements.',
      'Level 3 (7-9)':   'Good knowledge + good application + good analysis. Logical argument but judgements may be indistinct.',
      'Level 2 (4-6)':   'Limited knowledge + limited application + limited analysis. Inconsistencies in argument.',
      'Level 1 (1-3)':   'Fragments of knowledge. Little application. Assertion rather than evaluation.',
    },
    questions: [
      {
        id: 'soc_f_12_1', source: 'P1 JUN23', marks: 12,
        q: 'Discuss how far sociologists would agree that the main function of the family is to serve the needs of capitalism.',
        ms: `12 marks (AO1 = 4, AO2 = 4, AO3 = 4) -- Level of response marking\n\nIndicative content AO1 (knowledge):\n* Marxist perspective on the family (Zaretsky, Engels, Althusser)\n* Functionalist perspective (Parsons, Murdock)\n* Feminist perspective (Oakley, Millett)\n* Concepts: ideology, false consciousness, unit of consumption, reproduction of labour, primary socialisation\n\nIndicative content AO2 (application):\n* Marxist view AGREES: the family serves capitalism by reproducing the labour force, acting as a unit of consumption (buying capitalist products), and maintaining false consciousness. Zaretsky -- women provide unpaid domestic labour that benefits capitalism for free.\n* Functionalist view CHALLENGES: Parsons argues the family serves wider society, not just capitalism -- it provides primary socialisation and emotional stability. These are universal functions not reducible to capitalism.\n* Feminist view PARTIAL AGREEMENT: the family does exploit women's labour for the benefit of a male-dominated capitalist system -- patriarchy and capitalism are intertwined.\n\nIndicative content AO3 (evaluation):\n* Evaluate the Marxist view: does the family always reproduce capitalism or can it be a site of resistance? Evidence of family diversity challenges one-size-fits-all Marxist analysis.\n* Evaluate the functionalist view: is primary socialisation always beneficial? Feminists argue it reproduces gender inequality.\n* Conclusion (how far): to a significant extent, the Marxist view is supported -- but other functions of the family (emotional, reproductive, socialisation) suggest capitalism is not the ONLY or even main beneficiary.`,
      },
      {
        id: 'soc_f_12_2', source: 'P1 JUN23', marks: 12,
        q: 'Discuss how far sociologists would agree that gender roles are equal in families in Britain today.',
        ms: `12 marks (AO1 = 4, AO2 = 4, AO3 = 4)\n\nIndicative content AO1:\n* Feminist perspectives (Oakley -- double shift, triple shift; Duncombe and Marsden)\n* Functionalist/symmetrical family (Young and Willmott)\n* Concept of domestic division of labour, conjugal roles, joint/segregated conjugal roles\n* Statistical evidence on domestic labour distribution\n\nIndicative content AO2:\n* Evidence FOR greater equality: Young and Willmott's symmetrical family thesis -- argue that roles have become more joint and equal, especially in middle class families. Men doing more childcare.\n* Evidence AGAINST equality: Oakley's research -- women still perform more domestic labour. Duncombe and Marsden -- women perform a 'triple shift' (paid work + housework + emotional labour). Statistics show women still do more unpaid domestic work.\n* Feminist view: apparent equality is superficial -- women still carry greater responsibility even when both partners work.\n\nIndicative content AO3:\n* Evaluate Young and Willmott: their research was dated (1970s) and may have overstated equality. Methodology was self-report -- men may have overestimated their contributions.\n* Evaluate feminist view: progress has been made -- more men take paternity leave; attitudes have shifted. But structural inequalities remain.\n* Conclusion: how far -- gender roles have moved towards greater equality but have NOT achieved full equality. Class, ethnicity and age affect how far equality has been reached in specific families.`,
      },
      {
        id: 'soc_f_12_3', source: 'P1 JUN22', marks: 12,
        q: 'Discuss how far sociologists would agree that changes in the law are the main reason for the pattern of divorce in Britain since 1969.',
        ms: `12 marks (AO1 = 4, AO2 = 4, AO3 = 4)\n\nIndicative content AO1:\n* Divorce Reform Act 1969 -- irretrievable breakdown as sole ground\n* Functionalism (Fletcher, Parsons), Marxism (Hart), Feminism (Millett)\n* Changing status of women, secularisation, changing social attitudes, media influence\n\nIndicative content AO2:\n* AGREES -- law is key: Divorce Reform Act 1969 made divorce easier/cheaper. Number of divorces rose sharply after 1969. Further legal changes (1984, Family Law Act 1996) reinforced this trend.\n* CHALLENGES -- other factors: changing status of women (financial independence makes it possible to leave). Secularisation (declining religious opposition to divorce). Changing attitudes (divorce no longer stigmatised). Rising expectations of marriage (Parsons, Fletcher).\n* Feminist view: women initiate majority of divorces -- reflects rejection of patriarchal marriage rather than just legal change.\n\nIndicative content AO3:\n* Evaluate legal change: the law removed barriers but didn't cause the underlying desire to divorce -- other social changes created demand for legal reform.\n* Evaluate women's changing status: a key factor, but class differences exist -- working class women may be less financially independent.\n* Conclusion: legal change was a necessary but not sufficient cause. The law enabled divorce; changes in women's status, attitudes and secularisation explain WHY people wanted to divorce. A multi-causal explanation is most convincing.`,
      },
      {
        id: 'soc_f_12_4', source: 'P1 JUN22', marks: 12,
        q: 'Discuss how far sociologists would agree that the nuclear family is still considered the norm in Britain today.',

        ms: `12 marks (AO1 = 4, AO2 = 4, AO3 = 4)\n\nIndicative content AO1:\n* Functionalism (Parsons, Murdock), New Right (Murray), Feminism, Marxism\n* Family diversity (Rapoports -- 5 types of diversity), lone parents, same-sex families, reconstituted families\n* The 'cereal packet' image of the nuclear family; statistical data on family change\n\nIndicative content AO2:\n* AGREES -- still considered norm: functionalists argue nuclear family best fulfils universal functions. New Right (Murray) sees it as the ideal for child development. Media and advertising still promote nuclear family as ideal image.\n* CHALLENGES -- no longer the norm: Rapoports identify increasing diversity. Lone parent families, cohabiting couples, reconstituted families, same-sex families all increasingly common. Statistics show married couples with children are a minority of households.\n* Feminist view: nuclear family was never ideal -- it was a patriarchal institution that oppressed women. Its decline represents progress.\n\nIndicative content AO3:\n* Evaluate functionalist/New Right: evidence of family diversity directly contradicts the claim. Even if the nuclear family is held up as an ideal, it does not reflect statistical reality.\n* Evaluate diversity argument: is diversity a sign of the nuclear family's decline, or does it coexist alongside it as one family form among many?\n* Conclusion: the nuclear family is no longer statistically the norm but remains a cultural ideal promoted by media, politicians and some sociologists. The extent to which it is 'the norm' depends on whether we mean statistically or culturally.`,
      },
      {
        id: 'soc_f_12_5', source: 'P1 NOV21', marks: 12,
        q: 'Discuss how far sociologists would agree that the traditional nuclear family is the most appropriate family type in which to raise children in Britain today.',
        ms: `12 marks (AO1 = 4, AO2 = 4, AO3 = 4) -- Level of response marking\n\nIndicative content AO1:\n* Functionalists.\n* New Right.\n* Feminists.\n* Marxists.\n* Family diversity.\n* Cereal packet image of the family.\n\nIndicative content AO2:\n* Functionalists, such as Murdock and Parsons, argue that the traditional nuclear family performs essential functions for the individual and society. Importance of the instrumental and expressive roles of the father and mother.\n* New Right perspective emphasises the importance of the traditional nuclear family -- they argue that children are more likely to develop into stable adults if brought up by both parents.\n* Feminists, such as Delphy and Leonard, view traditional nuclear families as patriarchal, a source of female oppression.\n* Marxists, such as Zaretsky, who are critical of the traditional nuclear family, seeing it as serving the needs of capitalism.\n* Other family forms are as appropriate as identified by the Rapoports, with Oakley commenting on how the traditional nuclear family is felt to be increasingly archaic.\n* The ideal family form purported by the media, particularly advertisements, as a stereotypical image that best describes family life in Britain today, with the father as the breadwinner and the mother the housewife.\n\nIndicative content AO3:\n* Analysis and evaluation of the functionalist perspective eg the extent to which the traditional nuclear family is the most appropriate family type in which to raise children in Britain today.\n* Analysis and evaluation of the New Right perspective eg the extent to which the traditional nuclear family is the most appropriate family type in which to raise children in Britain today.\n* Analysis and evaluation of the feminist perspective eg the extent to which the traditional nuclear family exists and families continue to be patriarchal due to canalisation and gender socialisation.\n* Analysis and evaluation of the Marxist perspective eg the extent to which the traditional nuclear family supports the capitalist system.\n* Analysis and evaluation of the impact of family diversity.\n* Analysis and evaluation of the idea of the cereal packet family eg the extent to which this remains the stereotypical image that advertisers still use to describe families and family life in Britain.\n* Evidence-based judgements and conclusions relating to the issue of extent (how far would sociologists agree) in the judgement of the student how far does the evidence support the premise of the question that the traditional nuclear family is the most appropriate family type in which to raise children in Britain today.`,
      },
      {
        id: 'soc_f_12_6', source: 'P1 NOV21', marks: 12,
        q: 'Discuss how far sociologists would agree that gender inequalities continue to exist within the family in Britain today.',
        ms: `12 marks (AO1 = 4, AO2 = 4, AO3 = 4)\n\nIndicative content AO1:\n* Feminism.\n* Functionalism.\n* Marxism.\n* Changing family structures.\n* Changing position of women in society.\n\nIndicative content AO2:\n* Feminist perspectives -- emphasises the patriarchal nature of the family, with women being exploited within the home eg unequal gender division of labour in the family.\n* Functionalist perspectives -- the significance of the symmetrical family as researched by Willmott and Young, suggesting shared conjugal roles.\n* Marxist perspectives -- women and men have unequal roles because that structure supports capitalism. Women who stay at home, doing unpaid housework and emotional work are supporting capitalist society because they are providing healthy, happy workers.\n* The movement towards more dual career/neo-conventional families and the idea of the 'New Man'.\n* Women's changed legal status and employment opportunities, giving them more rights and career prospects, the feminist movement changing attitudes towards gender relations and roles in the family.\n\nIndicative content AO3:\n* Analysis and evaluation of the feminist perspective eg the extent to which gender inequalities exist within the family.\n* Analysis and evaluation of the functionalist perspective eg the extent to which there has been a rise in the symmetrical family.\n* Analysis and evaluation of the Marxist perspective eg the extent to which the family supports capitalism.\n* Analysis and evaluation of the changes in family structures and gender roles eg the extent to which the concept of the New Man exists.\n* Analysis and evaluation of the changes in women's position in society eg the extent to which there is gender equality in society, in relation to the law and employment.\n* Evidence-based judgements and conclusions relating to the issue of extent (how far would sociologists agree) eg in the judgement of the student how far does the evidence suggest the premise of the question that gender inequalities still exist in the family in Britain today.`,
      },
    ],
  },

  // ── EDUCATION ─────────────────────────────────────────────────────────────
  {
    id: 'soc_education_key_terms',
    label: 'Education -- Key Terms',
    icon: '🎓',
    color: '#FF5C7A',
    bg: 'rgba(255,92,122,.12)',
    border: 'rgba(255,92,122,.28)',
    description: 'Identify key sociological terms in the study of education. 1-mark multiple choice questions.',
    paper: 'Paper 1',
    skillTip: 'Know the precise term the examiners use. "Ethnocentric curriculum" not just "biased". "Mixed ability" not "non-setted". Learn definitions from your glossary.',
    questions: [
      {
        id: 'soc_e_kt1', source: 'P1 JUN23', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe a school that is no longer under local authority control and whose funding is provided directly by central government?',
        options: ['Academy', 'Independent', 'Private', 'Public'],
        correctIndex: 0,
        ms: 'A -- Academy\n[1 mark AO1]',
      },
      {
        id: 'soc_e_kt2', source: 'P1 JUN23', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe a curriculum that is biased, coming from the point of view of one culture?',
        options: ['Egalitarian', 'Ethnocentric', 'Ethnographic', 'Exclusive'],
        correctIndex: 1,
        ms: 'B -- Ethnocentric\n[1 mark AO1]',
      },
      {
        id: 'soc_e_kt3', source: 'P1 JUN22', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe the grouping of students of different academic levels in the same class?',
        options: ['Banding', 'Mixed ability', 'Setting', 'Streaming'],
        correctIndex: 1,
        ms: 'B -- Mixed ability\n[1 mark AO1]',
      },
      {
        id: 'soc_e_kt4', source: 'P1 JUN22', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe a state school that does not select pupils on the basis of their ability?',
        options: ['Comprehensive', 'Grammar', 'Independent', 'Private'],
        correctIndex: 0,
        ms: 'A -- Comprehensive\n[1 mark AO1]',
      },
      {
        id: 'soc_e_kt5', source: 'P1 NOV21', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe work-related education and training?',
        options: ['Academic', 'Comprehensive', 'Marketization', 'Vocational'],
        correctIndex: 3,
        ms: 'D -- Vocational\n[1 mark AO1]',
      },
      {
        id: 'soc_e_kt6', source: 'P1 NOV21', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe the process of learning norms and values that takes place outside the family?',
        options: ['Agency of socialisation', 'Primary socialisation', 'Secondary socialisation', 'Selective socialisation'],
        correctIndex: 2,
        ms: 'C -- Secondary socialisation\n[1 mark AO1]',
      },
    ],
  },

  {
    id: 'soc_education_describe',
    label: 'Education -- Describe Questions',
    icon: '📚',
    color: '#FF5C7A',
    bg: 'rgba(255,92,122,.12)',
    border: 'rgba(255,92,122,.28)',
    description: 'Describe sociological concepts in education. 3-mark questions.',
    paper: 'Paper 1',
    skillTip: 'Level 3 requires a coherent, accurate description using sociological vocabulary. Always try to include: the concept name, what it means, and a specific example or evidence.',
    levelDescriptors: {
      '3 marks': 'Coherent description with few inaccuracies -- demonstrates good knowledge',
      '2 marks': 'Partial description -- some relevant material with inaccuracies or omissions',
      '1 mark':  'Fragments of knowledge -- limited understanding',
    },
    questions: [
      {
        id: 'soc_e_d1', source: 'P1 JUN22', marks: 3,
        q: 'Describe one example of cultural capital.',
        ms: `Level 3 (3 marks): Coherent description with good knowledge and understanding.\n\nIndicative content (AO1):\n* Cultural capital (Bourdieu) refers to the knowledge, skills, education, advantages and connections that give a person higher social status in society.\n* Example: middle class parents who read to their children regularly, take them to museums, use extended vocabulary and encourage educational engagement are passing on cultural capital -- knowledge and skills that schools reward.\n* Example: knowing how to speak, act and present oneself in ways that are valued by educational institutions, giving middle class pupils an advantage over working class peers.\n* Example: access to private tutors, educational trips, music lessons -- all forms of cultural capital that help students achieve higher grades.`,
      },
      {
        id: 'soc_e_d2', source: 'P1 JUN22', marks: 3,
        q: 'Identify and describe one counter school subculture.',
        ms: `Level 3 (3 marks): Coherent description with good knowledge and understanding.\n\nIndicative content (AO1):\n* Paul Willis (1977) studied a group of 12 working class boys in a Midlands school who formed an anti-school subculture called 'the lads'. They rejected the school's values, seeing academic work as 'effeminate' and prioritised having a 'laff' over achievement.\n* A counter school subculture is a group of pupils who actively reject the school's norms and values. Members gain status from anti-school behaviour -- being disruptive, truanting, smoking -- rather than academic success.\n* Example: gangs within school that bully high-achieving pupils, calling them 'swots', actively discouraging academic engagement among peers.`,
      },
      {
        id: 'soc_e_d3', source: 'P1 NOV21', marks: 3,
        q: 'Describe one example of the marketization of schools.',
        ms: `Level 3 (3 marks): A coherent description with few inaccuracies. Demonstrates good knowledge and understanding. (AO1)\n\nIndicative content (AO1):\n* Schools promoting themselves in order to compete to attract students.\n* Publishing information on their website eg examination performance.\n* Constructing a prospectus displaying facilities and courses available at the school.`,
      },
      {
        id: 'soc_e_d4', source: 'P1 NOV21', marks: 3,
        q: "Identify and describe one example of how labelling may affect a student's achievement in school.",
        ms: `Level 3 (3 marks): A coherent description with few inaccuracies. Demonstrates good knowledge and understanding. (AO1)\n\nIndicative content (AO1):\n* Students are constantly being assessed and, consequently, they are labelled and placed in particular classes based on the label they have been given.\n* Once a student has been given a label, for example 'bright', others will respond to them and interpret their actions in terms of this label. This student will often act according to the label, so a self-fulfilling prophecy may result.\n* Some studies have shown that teachers label students based on ethnic, gender or social class stereotypes.`,
      },
      {
        id: 'soc_e_d5', source: 'P1 JUN24', marks: 3,
        q: 'Describe one reason why a parent may choose to home educate their child.',
        ms: `Level 3 (3 marks): A coherent description with few inaccuracies, demonstrating good knowledge and understanding. (AO1)\n\nIndicative content (AO1):\n* Parents may feel that the methods of teaching in school are not right for their child and that they can provide a better education for them at home, sometimes with the help of outside tutors.\n* Parents may have philosophical or religious reasons -- being home educated enables there to be no formal rules or set curriculum about how children are taught or what they are taught.\n* Parents may have been home educated themselves or raised in situations in which education was not focused on a traditional school environment.\n* Parents may home educate because they cannot get a place for their child in a school of their choice to meet their child's special needs.\n* Parents may choose to have their child educated at home because their child is unhappy within a school environment.`,
      },
      {
        id: 'soc_e_d6', source: 'P1 JUN24', marks: 3,
        q: 'Identify and describe one way in which the formal curriculum is different to the hidden curriculum.',
        ms: `Level 3 (3 marks): A coherent description with few inaccuracies, demonstrating good knowledge and understanding. (AO1)\n\nIndicative content (AO1):\n* Direct learning of particular knowledge and skills in comparison to the hidden curriculum.\n* The timetabled subjects taught in lessons at school in comparison to the hidden curriculum.\n* The subject content to be taught in state schools as decided by the government in comparison to the hidden curriculum.\n* Often decided by the Department of Education, based on the National Curriculum and consisting of the inclusion of certain core subjects such as mathematics, English, science and IT in comparison to the hidden curriculum.\n* The official curriculum, that is overt and transparent in comparison to the hidden curriculum.`,
      },
    ],
  },

  {
    id: 'soc_education_item',
    label: 'Education -- Item/Source Questions',
    icon: '📋',
    color: '#FF5C7A',
    bg: 'rgba(255,92,122,.12)',
    border: 'rgba(255,92,122,.28)',
    description: 'Use the provided Item (source) to answer questions on education. 2-4 mark questions requiring analysis and application from the stimulus material.',
    paper: 'Paper 1',
    skillTip: "Always refer directly to the Item -- quote or paraphrase it -- then add your own sociological knowledge. For 2-mark 'examine' questions: one point FROM the item + one reason/evaluation. For '...including what you know of X's perspective' questions, name the perspective (functionalist/feminist/Marxist) explicitly.",
    questions: [
      {
        id: 'soc_e_it1', source: 'P1 NOV21', marks: 2,
        extract: `ITEM C -- Callender and Jackson on Student Debt\n\nConcerns have been raised that students from poorer backgrounds are discouraged from applying to university for a number of reasons including the fear of debt. Claire Callender and Jon Jackson investigated the attitudes of students in England who were considering going to university towards debt, and their decisions about whether or not to apply to university.\n\nCallender and Jackson compared students from poorer families with students from better-off backgrounds. They wanted to find out if concerns about cost and debts, especially student loan debt, were more likely to discourage poorer students from applying to university.\n\nThe research involved a survey of prospective higher education students and produced quantitative data. A total of 101 school sixth forms and further education colleges agreed to take part and 3582 self-completion questionnaires were sent out. The schools and colleges were a national stratified random sample. Students were asked whether they agreed with statements about the costs and benefits of going to university.\n\nSource: Callender, C and Jackson, J, 'Fear of Debt and higher education participation', South Bank University, London, (2004)`,
        q: 'From Item C, examine one strength of the research.',
        ms: `2 marks (AO3):\n1 mark: identifying a strength (line of argument from the item)\n1 mark: evaluating why this represents a strength (judgement/conclusion)\n\nIndicative content AO3:\n* The sample used a national sample, as opposed to a limited geographical area, making the sample likely to be more representative.\n* A stratified sample was used, allowing comparison of viewpoints and concerns by social class, gender, etc.\n* Self-completion questionnaire was used to investigate the costs and benefits of going to university, which results in outcomes high in validity and reliability.\n* Data easily accessible and relatively cheap to obtain, which allows for comparisons to be made with other surveys which examine what factors may be affecting applications to university.`,
      },
      {
        id: 'soc_e_it2', source: 'P1 NOV21', marks: 4,
        extract: `ITEM C -- Callender and Jackson on Student Debt\n\nConcerns have been raised that students from poorer backgrounds are discouraged from applying to university for a number of reasons including the fear of debt. Claire Callender and Jon Jackson investigated the attitudes of students in England who were considering going to university towards debt, and their decisions about whether or not to apply to university.\n\nCallender and Jackson compared students from poorer families with students from better-off backgrounds. They wanted to find out if concerns about cost and debts, especially student loan debt, were more likely to discourage poorer students from applying to university.\n\nThe research involved a survey of prospective higher education students and produced quantitative data. A total of 101 school sixth forms and further education colleges agreed to take part and 3582 self-completion questionnaires were sent out. The schools and colleges were a national stratified random sample. Students were asked whether they agreed with statements about the costs and benefits of going to university.\n\nSource: Callender, C and Jackson, J, 'Fear of Debt and higher education participation', South Bank University, London, (2004)`,
        q: 'Identify and explain one factor, other than debt, that may discourage students from poorer backgrounds from applying to university, raised as a concern in Item C.',
        ms: `4 marks (AO1 = 1, AO2 = 3) -- 'Context' here refers to a factor that may account for social class differences in education.\n\nLevel 4 (4 marks): Relevant factor identified (AO1) and an appropriate, detailed and well-developed explanation offered with a clear application to the context. (AO2)\nLevel 3 (3 marks): Relevant factor identified with explanation containing some inaccuracies/omissions but some application to context.\nLevel 2 (2 marks): Relevant factor identified with a largely inaccurate or irrelevant explanation, only weakly applied.\nLevel 1 (1 mark): Relevant factor identified only.\n\nIndicative content AO1:\n* Parental encouragement.\n* Immediate gratification.\n* Structural failings of the education system.\n* University selection processes.\n\nIndicative content AO2:\n* Parents' attitudes towards university may be a factor -- parents from upper and middle-class backgrounds are more likely to have experienced higher education themselves and so may be more likely to encourage their children to follow suit, despite the costs of student loans because of future earnings and career options.\n* Immediate gratification -- enjoying the pleasures of the moment with emphasis on short-term gains, rather than deferred gratification.\n* Structural failings of the education system eg under-performing schools in working-class areas -- less likely to achieve the higher A-level grades required by universities, less likely to be supported by parents and peer group when applying.\n* Students from poorer backgrounds are less likely to be offered unconditional places by a university.`,
      },
      {
        id: 'soc_e_it3', source: 'P1 NOV21', marks: 4,
        extract: `ITEM D -- Parsons on Education\n\nSociologist Talcott Parsons suggested that school acts as a bridge between the home and wider society. School plays a key role in the process of socialisation, following on from the socialisation that takes place in the family. Parsons argued that this is necessary because the family and wider society work in different ways and children need to adapt if they are to cope in the wider world. Schools continue the socialisation process of teaching the norms and values of society.\n\nParsons also suggested that, in families, status is fixed at birth. This is known as ascribed status. However, in society, status based on merit is achieved, rather than ascribed. Parsons believed that education makes the transition from family to society possible by getting people used to universal values and achieved status.\n\nSource: Parsons, T, 'The school class as a social system' in Halsey et al., Education, Economy and Society, New York, The Free Press, (1961)`,
        q: 'From Item D, identify and describe one way in which Parsons saw the education system as important, including what you know of his perspective on education.',
        ms: `4 marks (AO1 = 1, AO2 = 3) -- 'Context' here refers to the work of Parsons and his perspective on education.\n\nLevel 4 (4 marks): Relevant way selected (AO1) and an appropriate, detailed and well-developed description offered with a good application to the context. (AO2)\nLevel 3 (3 marks): Relevant way selected with description containing some inaccuracies/omissions but some application to context.\nLevel 2 (2 marks): Relevant way selected with a largely inaccurate or irrelevant description, only weakly applied.\nLevel 1 (1 mark): Relevant way selected only.\n\nIndicative content AO1:\n* Socialisation.\n* Universal values.\n* Meritocracy.\n\nIndicative content AO2:\n* Writing from a functionalist perspective, Parsons focused on the role of the education system as an agency of secondary socialisation as it prepares children for adult life.\n* Parsons believed an individual is judged on universalistic standards, which are applied to all members regardless of kinship ties. He believed that schools socialise children into the basic values of wider society, maintaining a value consensus that emphasised achievement and equality of opportunity.\n* Parsons argued that schools operate on meritocratic principles, whereby status is achieved on the basis of merit.`,
      },
    ],
  },

  {
    id: 'soc_education_12mark',
    label: 'Education -- 12-Mark Discuss Questions',
    icon: '⚖️',
    color: '#FF5C7A',
    bg: 'rgba(255,92,122,.12)',
    border: 'rgba(255,92,122,.28)',
    description: '"Discuss how far sociologists would agree..." -- 12-mark extended writing on education requiring knowledge, application and evaluation of multiple sociological perspectives.',
    paper: 'Paper 1',
    skillTip: "Structure: Introduction -> Agree (evidence + theory) -> Disagree/Alternative view (evidence + theory) -> Conclusion with your judgement. Use Functionalism, Marxism, Feminism, Interactionism with named sociologists (Parsons, Bourdieu, Willis, Becker). Evaluate each perspective and reach a balanced 'how far' conclusion.",
    levelDescriptors: {
      'Level 4 (10-12)': 'Detailed knowledge + sustained application + developed critical analysis. Wide range of specialist terms. Well-constructed arguments with supported judgements.',
      'Level 3 (7-9)':   'Good knowledge + good application + good analysis. Logical argument but judgements may be indistinct.',
      'Level 2 (4-6)':   'Limited knowledge + limited application + limited analysis. Inconsistencies in argument.',
      'Level 1 (1-3)':   'Fragments of knowledge. Little application. Assertion rather than evaluation.',
    },
    questions: [
      {
        id: 'soc_e_12_1', source: 'P1 NOV21', marks: 12,
        q: "Discuss how far sociologists would agree that family background is the most important factor in explaining differences in students' educational achievement.",
        ms: `12 marks (AO1 = 4, AO2 = 4, AO3 = 4) -- Level of response marking\n\nIndicative content AO1:\n* Functionalism.\n* Marxism.\n* Interactionism.\n* Social class.\n* Ethnicity.\n* Gender.\n\nIndicative content AO2:\n* Functionalists emphasise the importance of socialisation experiences in the home eg cultural deprivation, parental attitudes and language codes (Bernstein) shaping a child's readiness for school.\n* Marxist theorists' view social class as a determinant of educational success eg material deprivation limits access to resources such as books, technology and tutoring, and Bourdieu's concept of cultural capital explains how middle-class families pass on the knowledge and values that schools reward.\n* Interactionists emphasise the processes which may operate within schools eg labelling and the self-fulfilling prophecy, where teacher expectations shaped by a pupil's home background affect how that pupil is taught and how they come to see themselves.\n* Ethnicity and gender also interact with family background eg some ethnic minority pupils experience an ethnocentric curriculum or low teacher expectations rooted in stereotypes about their home life; gendered expectations at home can shape subject choices and aspirations.\n\nIndicative content AO3:\n* Analysis and evaluation of the functionalist/cultural deprivation view eg it can blame working-class families for failure rather than examining the school system itself.\n* Analysis and evaluation of the Marxist/cultural capital view eg Bourdieu's concept is powerful but hard to measure precisely, and some working-class pupils do succeed against the odds.\n* Analysis and evaluation of the interactionist view eg labelling does not explain why some labelled pupils resist and succeed (Mac an Ghaill, Fuller).\n* Counter-evidence: in-school factors such as setting, exclusion rates and the hidden curriculum may matter as much as, or more than, family background for some groups.\n* Evidence-based judgements and conclusions relating to the issue of extent (how far sociologists would agree) -- in the student's judgement, how far the evidence supports the premise that family background is THE most important factor, compared with school-based and wider structural factors.`,
      },
      {
        id: 'soc_e_12_2', source: 'P1 NOV21', marks: 12,
        q: 'Discuss how far sociologists would agree that in-school factors are the main reasons for gender-based differences in subject options and career choices.',
        ms: `12 marks (AO1 = 4, AO2 = 4, AO3 = 4) -- Level of response marking\n\nIndicative content AO1:\n* Feminism.\n* Functionalism.\n* Interactionism.\n* Gendered subject choices and the hidden curriculum.\n* Gender role socialisation.\n\nIndicative content AO2:\n* In-school factors: gendered subject images (eg science seen as 'masculine'), gendered career advice, role models -- the dominance of male teachers in senior positions and in subjects like maths and physics, teacher attention and expectations differing by gender, the hidden curriculum reinforcing traditional gender roles through the formal and informal organisation of the school.\n* Feminist perspectives -- schools can reproduce patriarchal attitudes that channel girls and boys towards different subjects and careers, eg through stereotyped images in textbooks or careers guidance.\n* Interactionist perspectives -- teacher labelling and self-fulfilling prophecy can shape which subjects pupils believe they are 'suited to', reinforcing gendered choices over time.\n* Out-of-school factors as an alternative explanation -- gender role socialisation in the family and media (eg toys, magazines, peer group pressure) shapes preferences and confidence before and alongside the influence of school.\n\nIndicative content AO3:\n* Analysis and evaluation of the in-school explanation eg schools have introduced policies (GIST, WISE) to challenge gender stereotyping in subject choice -- suggesting schools recognise and try to counter their own role in producing these patterns.\n* Analysis and evaluation of the feminist perspective eg it highlights structural patriarchy but may understate how much attitudes have changed -- girls now outperform boys in many subjects at GCSE.\n* Analysis and evaluation of out-of-school explanations eg family and media socialisation may be at least as powerful as anything that happens in school, suggesting in-school factors are not the MAIN reason.\n* Evidence-based judgements and conclusions relating to the issue of extent (how far sociologists would agree) -- the student's judgement on whether in-school processes are the main driver of gendered subject and career choices, or whether they mainly reinforce patterns that begin at home and in wider society.`,
      },
    ],
  },

  // ── CRIME & DEVIANCE ──────────────────────────────────────────────────────
  {
    id: 'soc_crime_key_terms',
    label: 'Crime & Deviance -- Key Terms',
    icon: '⚖️',
    color: '#FF5C7A',
    bg: 'rgba(255,92,122,.12)',
    border: 'rgba(255,92,122,.28)',
    description: 'Identify key sociological terms in crime and deviance. 1-mark multiple choice questions.',
    paper: 'Paper 2',
    skillTip: 'Know the difference between crime (breaking the law) and deviance (breaking social norms). Know labelling theory, self-fulfilling prophecy, dark figure of crime.',
    questions: [
      {
        id: 'soc_c_kt1', source: 'P2 JUN23', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe the process by which people become widely regarded as deviant?',
        options: ['Labelling', 'Profiling', 'Self-fulfilling prophecy', 'Social mobility'],
        correctIndex: 0,
        ms: 'A -- Labelling\n[1 mark AO1]',
      },
      {
        id: 'soc_c_kt2', source: 'P2 JUN23', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe the agency responsible for punishing offenders?',
        options: ['Deterrent system', 'Prison system', 'Rehabilitation system', 'Welfare system'],
        correctIndex: 1,
        ms: 'B -- Prison system\n[1 mark AO1]',
      },
      {
        id: 'soc_c_kt3', source: 'P2 NOV21', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe crime committed by middle-class and upper-class individuals, often in the course of their work?',
        options: ['Anti-social crime', 'Status crime', 'Violent crime', 'White collar crime'],
        correctIndex: 3,
        ms: 'D -- White collar crime\n[1 mark AO1]',
      },
      {
        id: 'soc_c_kt4', source: 'P2 NOV21', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe the research method which asks respondents to identify any crimes they have committed?',
        options: ['Crime study', "Offenders' study", 'Self-report study', 'Victim study'],
        correctIndex: 2,
        ms: 'C -- Self-report study\n[1 mark AO1]',
      },
    ],
  },

  {
    id: 'soc_crime_describe',
    label: 'Crime & Deviance -- Describe Questions',
    icon: '🚨',
    color: '#FF5C7A',
    bg: 'rgba(255,92,122,.12)',
    border: 'rgba(255,92,122,.28)',
    description: 'Describe sociological concepts in crime and deviance. 3-mark questions.',
    paper: 'Paper 2',
    skillTip: 'For deviance questions: remember deviance is relative -- what is deviant changes over time, between cultures and in different contexts. Always make this clear in your answer.',
    levelDescriptors: {
      '3 marks': 'Coherent description with few inaccuracies -- demonstrates good knowledge',
      '2 marks': 'Partial description -- some relevant material with inaccuracies or omissions',
      '1 mark':  'Fragments of knowledge -- limited understanding',
    },
    questions: [
      {
        id: 'soc_c_d1', source: 'P2 JUN23', marks: 3,
        q: 'Describe one example of deviance.',
        ms: `Level 3 (3 marks): Coherent description showing good sociological understanding.\n\nIndicative content (AO1):\n* Deviance is any behaviour that does not conform to dominant norms and values in a society -- it can range from mildly disapproved behaviour to criminal acts.\n* Example: extreme body modification (e.g. subdermal implants, splitting the tongue) -- not illegal but widely considered deviant in mainstream British society as it violates norms about appearance.\n* Example: drinking alcohol in a mosque -- deviant in that context even though legal.\n* Example: a criminal act that is also deviant e.g. vandalism -- breaks both the law and social norms about respecting property.\n* Important: deviance is relative -- what counts as deviant varies by culture, time and context.`,
      },
      {
        id: 'soc_c_d2', source: 'P2 JUN23', marks: 3,
        q: 'Identify and describe one way sociologists attempt to measure the dark figure of crime.',
        ms: `Level 3 (3 marks): Coherent description with good knowledge and understanding.\n\nIndicative content (AO1):\n* The dark figure of crime refers to crime that is not recorded in official statistics -- crimes that go unreported or undetected.\n* Self-report studies: ask people to reveal crimes they have committed and how often. This reveals crimes that were never reported to the police, giving a more complete picture of criminal behaviour.\n* Victim surveys (e.g. the Crime Survey for England and Wales): ask people about crimes they have experienced in the past year, whether or not they reported them. This shows the gap between actual crime and recorded crime.\n* Both methods reveal that official statistics significantly undercount the true extent of crime.`,
      },
      {
        id: 'soc_c_d3', source: 'P2 NOV21', marks: 3,
        q: 'Describe one example of a moral panic.',
        ms: `Level 3 (3 marks): A coherent description with few inaccuracies, demonstrating good knowledge and understanding. (AO1)\n\nIndicative content (AO1):\n* Anti-social behaviour of young people eg hoodie-wearing youths committing crimes.\n* Influence of music eg Drill, Gangsta Rap.\n* Violence in the media eg computer games and films.\n* Other relevant examples can be credited.`,
      },
      {
        id: 'soc_c_d4', source: 'P2 NOV21', marks: 3,
        q: 'Identify and describe one example of deviant behaviour that is not criminal.',
        ms: `Level 3 (3 marks): A coherent description with few inaccuracies, demonstrating good knowledge and understanding. (AO1)\n\nIndicative content (AO1):\n* Sitting next to a stranger on an empty train.\n* Talking in the cinema.\n* Wearing incorrect uniform to school.`,
      },
      {
        id: 'soc_c_d5', source: 'P2 JUN24', marks: 3,
        q: 'Describe one way in which the media may affect the way the public view crime.',
        ms: `Level 3 (3 marks): A coherent description with few inaccuracies, demonstrating good knowledge and understanding. (AO1)\n\nIndicative content (AO1):\n* Certain crimes (eg violent crime) are disproportionately covered in the media, leading to people thinking it is more common than it actually is.\n* Crimes that are committed by certain groups in our society tend to be over-reported (eg ethnic minorities, young people), which can lead to negative labelling.\n* News values will dictate whether a story is seen as newsworthy. Stories will be reported if they fit in with the views of the media and their readership.\n* Deviancy amplification can occur when the media over-report crime-related issues.\n* Increased awareness of certain crimes leading to greater publicity and more effective interventions, eg knife amnesty in local areas, the Reclaim These Streets campaign following the death of Sarah Everard.\n* Social media campaigns appealing for witnesses and circulating safety information, eg after the disappearance of Nicola Bulley and the raising of awareness of phone safety features after Ashling Murphy's death.`,
      },
      {
        id: 'soc_c_d6', source: 'P2 JUN24', marks: 3,
        q: 'Identify and describe one type of deviant behaviour that is tolerated by many people in society.',
        ms: `Level 3 (3 marks): A coherent description with few inaccuracies, demonstrating good knowledge and understanding. (AO1)\n\nIndicative content (AO1):\n* Driving slightly over the speed limit.\n* Cycling on the pavement.\n* Dropping litter.\n* Appropriate contemporary examples should be credited.`,
      },
    ],
  },

  {
    id: 'soc_crime_item',
    label: 'Crime & Deviance -- Item/Source Questions',
    icon: '📋',
    color: '#FF5C7A',
    bg: 'rgba(255,92,122,.12)',
    border: 'rgba(255,92,122,.28)',
    description: 'Use the provided Item to answer questions on crime and deviance. 2-4 mark questions.',
    paper: 'Paper 2',
    skillTip: 'Always reference the Item directly -- quote or paraphrase it. Then extend with your own sociological knowledge. For Item B questions: identify the sociologist\'s perspective clearly (feminist, Marxist etc.) before explaining their argument.',
    questions: [
      {
        id: 'soc_c_it1', source: 'P2 JUN23', marks: 2,
        extract: `ITEM A -- James Patrick's Gang Study (1966-67)\n\nJames Patrick studied a gang of teenage boys in Glasgow. He used covert participant observation. He gained access to the gang by befriending 'Tim', a gang member who acted as his protector. He met with the gang on 12 occasions between October 1966 and January 1967.\n\nPatrick found the gang to be dangerous -- some members became suspicious of him when he chose not to carry a weapon, and was reluctant to fully participate in fights. He left the gang abruptly when the violence became too intense.\n\nPatrick was scared of the gang and waited years before writing up his notes and publishing his work to protect their identities. Patrick's work focused on the social conditions that led to the formation of the gang, such as poverty, unemployment and poor housing conditions.\n\nSource: Patrick, J, A Glasgow Gang Observed, 2013.`,
        q: 'From Item A, examine one strength of the research.',
        ms: `2 marks (AO3):\n1 mark: identifying a strength (line of argument from the item)\n1 mark: evaluating why this represents a strength (judgement/conclusion)\n\nIndicative content:\n* Covert observation: the gang did not know they were being studied, so they behaved naturally -- this avoids the Hawthorne/Observer effect, increasing the validity of Patrick's findings about gang behaviour.\n* Rich qualitative data: the study generated in-depth insight into the motivations and behaviours of gang members -- this level of detail would be impossible to obtain through questionnaires or official statistics.\n* Access via key informant: 'Tim' gave Patrick access to an otherwise closed, dangerous group. This allowed the researcher to observe the gang in real settings while having some protection of identity.`,
      },
      {
        id: 'soc_c_it2', source: 'P2 JUN23', marks: 4,
        extract: `ITEM A -- James Patrick's Gang Study (1966-67)\n\nJames Patrick studied a gang of teenage boys in Glasgow. He used covert participant observation. He gained access to the gang by befriending 'Tim', a gang member who acted as his protector. He met with the gang on 12 occasions between October 1966 and January 1967.\n\nPatrick found the gang to be dangerous -- some members became suspicious of him when he chose not to carry a weapon, and was reluctant to fully participate in fights. He left the gang abruptly when the violence became too intense.\n\nPatrick was scared of the gang and waited years before writing up his notes and publishing his work to protect their identities. Patrick's work focused on the social conditions that led to the formation of the gang, such as poverty, unemployment and poor housing conditions.\n\nSource: Patrick, J, A Glasgow Gang Observed, 2013.`,
        q: 'Identify and explain one factor which may have led to the boys joining the gang, according to Item A.',
        ms: `4 marks (AO1 = 1, AO2 = 3)\n\nIndicative content AO1 (factor -- from Item A):\n* Poverty\n* Unemployment\n* Poor housing conditions\n\nIndicative content AO2 (explanation applied to context):\n* Poverty: boys joined the gang for both social status and utilitarian reasons -- in deprived areas with limited economic opportunities, gangs provide both income and a sense of belonging that mainstream society denies them.\n* Unemployment: with no prospect of legitimate employment, boys turned to the gang out of boredom and to gain social status they could not achieve through work.\n* Poor housing/environment: the boys lived in a high-crime, deprived area of Glasgow where deviant behaviour was prominent -- the social environment normalised gang membership as a response to structural inequality. Merton's strain theory links this to blocked opportunities.`,
      },
      {
        id: 'soc_c_it3', source: 'P2 JUN23', marks: 4,
        extract: `ITEM B -- Heidensohn on Women and Crime (1985)\n\nFrances Heidensohn argued that women commit far less crime than men because of patriarchal control exercised over women in three spheres of life: the home, in public, and in the workplace. Women are controlled in the home by domestic responsibilities and expectations. In public, women face threats of harassment and violence that limit their freedom. In the workplace, women face discrimination and harassment.\n\nSource: Heidensohn, F, Women and Crime, 1985.`,
        q: 'From Item B, identify and explain one reason why women commit less crime than men according to Heidensohn, including what you know of her perspective on this issue.',
        ms: `4 marks (AO1 = 1, AO2 = 3)\n\nIndicative content AO1:\n* Patriarchal control -- specifically in the home, in public, or in the workplace\n\nIndicative content AO2:\n* Writing from a feminist perspective, Heidensohn was interested in why women commit significantly less crime than men. She argued this was not due to natural differences but to patriarchal control that restricted women's freedom.\n* Patriarchal control at home: women are controlled by domestic responsibilities and expectations -- the time and energy spent on housework and childcare limits their opportunity to commit crime.\n* Control in public: threats of harassment, sexual violence and the fear of crime itself restrict women's movement in public spaces, limiting their opportunities to offend.\n* Control in the workplace: workplace discrimination and harassment keep women in subordinate positions with less power and fewer opportunities to commit white-collar crime.\n* Heidensohn uses control theory: women are controlled in multiple spheres simultaneously, whereas men face less control and therefore have more opportunity to offend.`,
      },
      {
        id: 'soc_c_it4', source: 'P2 NOV21', marks: 2,
        extract: `ITEM A -- Statistics on Women and the Criminal Justice System (2018)\n\nIn 2018, the Ministry of Justice published a report entitled 'Statistics on Women and the Criminal Justice System 2017'. This report presented information on offending and victimisation according to gender.\n\nThe report used information from a wide range of sources, such as national statistics and the Crime Survey for England and Wales (CSEW). The report stated the following:\n* 85% of arrests are men\n* 74% of offenders prosecuted were men\n* 95% of the prison population was male\n* women are more likely to experience domestic abuse than men\n* women were most likely to be prosecuted for TV Licence fee evasion, truancy of their children from school, and shoplifting.\n\nSource: Ministry of Justice, 2018`,
        q: 'From Item A, examine one strength of the research.',
        ms: `2 marks (AO3):\n1 mark for providing evidence of an analysis of the item (by indicating a possible strength)\n1 mark for providing evidence of evaluation (making a judgement/reaching a conclusion) by indicating a reason why this represents a strength\n\nIndicative content AO3:\n* National statistics meet the highest standards for trustworthiness, meaning that the validity of the information is strong.\n* The report drew information from a number of sources, meaning that it has been triangulated.\n* The information has been collected over a number of years, allowing for the examination of trends over time.`,
      },
      {
        id: 'soc_c_it5', source: 'P2 NOV21', marks: 4,
        extract: `ITEM A -- Statistics on Women and the Criminal Justice System (2018)\n\nIn 2018, the Ministry of Justice published a report entitled 'Statistics on Women and the Criminal Justice System 2017'. This report presented information on offending and victimisation according to gender.\n\nThe report used information from a wide range of sources, such as national statistics and the Crime Survey for England and Wales (CSEW). The report stated the following:\n* 85% of arrests are men\n* 74% of offenders prosecuted were men\n* 95% of the prison population was male\n* women are more likely to experience domestic abuse than men\n* women were most likely to be prosecuted for TV Licence fee evasion, truancy of their children from school, and shoplifting.\n\nSource: Ministry of Justice, 2018`,
        q: 'Identify and explain one reason for the differences in male and female criminal activity, as referred to in Item A.',
        ms: `4 marks (AO1 = 1, AO2 = 3) -- 'Context' here refers to the offending rate between men and women.\n\nLevel 4 (4 marks): Relevant reason identified (AO1) and an appropriate, detailed and well-developed explanation offered with a clear application to the context. (AO2)\nLevel 3 (3 marks): Relevant reason identified with explanation containing some inaccuracies/omissions but some application to context.\nLevel 2 (2 marks): Relevant reason identified with a largely inaccurate or irrelevant explanation, only weakly applied.\nLevel 1 (1 mark): Relevant reason identified only.\n\nIndicative content AO1:\n* Chivalry thesis.\n* Socialisation.\n* Opportunity.\n\nIndicative content AO2:\n* Chivalry thesis eg the idea that the male-dominated criminal justice system treats women more leniently.\n* Differing socialisation eg traditionally males are socialised into being aggressive and more likely to take risks, women are more likely to have the main caring role.\n* Lack of opportunity eg female behaviour is more regulated than that of males, so there is less opportunity to commit crime.`,
      },
      {
        id: 'soc_c_it6', source: 'P2 NOV21', marks: 4,
        extract: `ITEM B -- Cohen on Status Frustration\n\nAlbert Cohen was interested in the reasons why boys committed crime. He argued that working-class boys were not just judged harshly by middle-class adults, but also by middle-class children -- working-class boys were more likely to be seen as 'failures' by their peers. The standards that these middle-class children applied in terms of language, values and ambitions were likely to make their working-class peers feel inferior and inadequate. This led to status frustration for some working-class boys and they sought to gain status through deviant behaviour and breaking rules.\n\nSource: Cohen, A, Delinquent Boys, (1955)`,
        q: 'From Item B, identify and describe one reason why working-class boys develop status frustration according to Cohen, including what you know of his sociological perspective.',
        ms: `4 marks (AO1 = 1, AO2 = 3) -- 'Context' here refers to the work of Cohen.\n\nLevel 4 (4 marks): Relevant reason selected (AO1) and an appropriate, detailed and well-developed description offered with a good application to the context. (AO2)\nLevel 3 (3 marks): Relevant reason selected with description containing some inaccuracies/omissions but some application to context.\nLevel 2 (2 marks): Relevant reason selected with a largely inaccurate or irrelevant description, only weakly applied.\nLevel 1 (1 mark): Relevant reason selected only.\n\nIndicative content AO1:\n* Educational performance.\n* Employment prospects.\n* Social acceptance.\n\nIndicative content AO2:\n* Cohen approached the study of deviant behaviour from a functionalist perspective eg that everyone holds the same societal goals. In his view a lack of status and low social standing results in status frustration.\n* Due to schools being middle-class institutions, working-class boys are less likely to achieve well, resulting in poor educational performance and often a low status position at school.\n* Poor educational performance often results in low status, low paid employment.\n* The boys turn to criminal behaviour as an alternative route to success and acceptance by others in a similar social position eg boys who have not achieved educational success or status by other legitimate means.`,
      },
    ],
  },

  {
    id: 'soc_crime_12mark',
    label: 'Crime & Deviance -- 12-Mark Discuss Questions',
    icon: '📝',
    color: '#FF5C7A',
    bg: 'rgba(255,92,122,.12)',
    border: 'rgba(255,92,122,.28)',
    description: '"Discuss how far sociologists would agree..." -- 12-mark extended writing on crime and deviance.',
    paper: 'Paper 2',
    skillTip: 'Use at least three perspectives (e.g. Functionalism, Marxism, Feminism, Interactionism). For each: state the view -> explain it with named sociologists -> evaluate it. Reach a clear conclusion addressing "how far". Specialist terms = key marks.',
    levelDescriptors: {
      'Level 4 (10-12)': 'Detailed knowledge + sustained application + developed evaluation. Well-constructed arguments with supported conclusions.',
      'Level 3 (7-9)':   'Good knowledge + good application + good analysis. Logical argument but conclusions may lack development.',
      'Level 2 (4-6)':   'Limited knowledge + limited application. Inconsistencies in argument.',
      'Level 1 (1-3)':   'Fragments of knowledge. Assertion rather than evaluation.',
    },
    questions: [
      {
        id: 'soc_c_12_1', source: 'P2 JUN23', marks: 12,
        q: 'Discuss how far sociologists would agree that informal social control is an effective way of controlling deviant behaviour.',
        ms: `12 marks (AO1 = 4, AO2 = 4, AO3 = 4)\n\nIndicative content AO1:\n* Functionalism (Parsons, Durkheim), Marxism, Feminism (Heidensohn), Interactionism\n* Informal vs formal social control\n* Agencies: family, peer group, media, religion, workplace\n* Concepts: social norms, values, socialisation, deviance, sanctions\n\nIndicative content AO2:\n* Functionalist: informal social control plays a positive role -- family responsible for primary socialisation, transmitting society's norms and values. Effective because it creates internalised values rather than fear of punishment.\n* Marxist: informal social control is effective at maintaining capitalism -- socialisation promotes false consciousness, keeping the working class accepting of their exploitation.\n* Feminist (Heidensohn): informal social control particularly effective in controlling women -- patriarchal control in the home, in public and at work restricts women's freedom and limits deviant behaviour.\n* Interactionist: deviance depends on social reaction -- informal control through disapproval, labelling and stigma can deter deviant behaviour, but labelling can also create deviant careers (Becker).\n\nIndicative content AO3:\n* Evaluate functionalist view: does the family always transmit positive values? Dysfunctional families may socialise children into deviant behaviour.\n* Evaluate Marxist view: does false consciousness actually exist? People do resist capitalist ideology.\n* Evaluate feminist view: has patriarchal control weakened as women gain equality? Women's crime rates are rising.\n* Evaluate interactionism: labelling can increase deviance (self-fulfilling prophecy) rather than control it.\n* Conclusion: informal social control is partially effective but not consistently so. Formal control (law, police) may be needed when informal control breaks down. Effectiveness varies by social class, gender and ethnicity.`,
      },
      {
        id: 'soc_c_12_2', source: 'P2 JUN23', marks: 12,
        q: 'Discuss how far sociologists would agree that people commit crime because of a lack of opportunities within society.',
        ms: `12 marks (AO1 = 4, AO2 = 4, AO3 = 4)\n\nIndicative content AO1:\n* Functionalism (Merton's strain theory, Cohen's status frustration), Marxism, Feminism, Interactionism, New Right\n* Anomie, relative deprivation, subcultural theory\n* Concepts: blocked opportunities, social mobility, meritocracy\n\nIndicative content AO2:\n* Functionalist/strain theory AGREES: Merton argues crime results from frustration when people cannot achieve socially approved goals (e.g. wealth) through legitimate means. Those who face blocked opportunities (poor, minority groups) may turn to crime as an innovation.\n* Cohen's status frustration: working class boys cannot succeed in school, experience status frustration and join deviant subcultures that provide alternative status -- crime as a response to educational failure.\n* Marxist view: crime is a reaction to class-based inequality and economic exploitation -- capitalism creates structural deprivation that makes crime rational for those at the bottom.\n* Feminist: women face different structural barriers -- crime patterns differ by gender, not just opportunity.\n* New Right (Murray): lack of opportunity alone doesn't explain crime -- the underclass culture of welfare dependency creates a subculture where crime is normalised.\n\nIndicative content AO3:\n* Evaluate Merton: not everyone who lacks opportunities commits crime -- why do most people in deprived communities remain law-abiding?\n* Evaluate Cohen: over-focuses on working class/male crime, ignores white-collar crime by those with many opportunities.\n* Evaluate Marxist view: underestimates the role of individual choice and agency.\n* Counter-evidence: white-collar crime (Sutherland) -- committed by those WITH opportunities, not without.\n* Conclusion: lack of opportunities is a significant but not the only factor. Crime is multi-causal -- opportunity, socialisation, individual choice, labelling all play a role.`,
      },
      {
        id: 'soc_c_12_3', source: 'P2 NOV21', marks: 12,
        q: 'Discuss how far sociologists would agree that members of some ethnic groups who are convicted of crimes are more likely to receive a prison sentence.',
        ms: `12 marks (AO1 = 4, AO2 = 4, AO3 = 4)\n\nIndicative content AO1:\n* Marxism.\n* Interactionism.\n* The New Right.\n* Statistics on ethnicity and crime.\n\nIndicative content AO2:\n* Marxism eg that ethnic minority groups are 'over-policed and under-protected', whereas the crimes of powerful groups go largely unpunished.\n* Interactionism eg that ethnic minorities are more likely to be in prison because they are criminalised through negative labelling.\n* The New Right view eg that some ethnic groups are socialised into a culture of the underclass, resulting in a greater acceptance of criminal behaviour.\n* Statistics surrounding ethnicity and imprisonment eg members of some ethnic minority groups convicted of a crime are more likely to be imprisoned than other members of society.\n\nIndicative content AO3:\n* Analysis and evaluation of Marxism, Interactionism, the New Right and statistics as they relate to the view that ethnic minority groups are more likely to receive prison sentences.\n* Evidence-based judgements and conclusions relating to the issue of extent (how far sociologists would agree).`,
      },
      {
        id: 'soc_c_12_4', source: 'P2 NOV21', marks: 12,
        q: 'Discuss how far sociologists would agree that social inequality is the main cause of criminal behaviour.',
        ms: `12 marks (AO1 = 4, AO2 = 4, AO3 = 4)\n\nIndicative content AO1:\n* Marxism.\n* Functionalism.\n* Interactionism.\n* The New Right.\n\nIndicative content AO2:\n* Marxism eg capitalist society is unequal and criminal behaviour is a by-product of this.\n* Functionalism eg the work of Merton and Cohen, which suggest that crime is caused by a lack of educational success/opportunity.\n* Interactionism as an alternative explanation eg that most people commit criminal acts but only some people are caught and labelled for it.\n* The New Right as an alternative explanation eg that crime is caused by inadequate socialisation.\n\nIndicative content AO3:\n* Analysis and evaluation of Marxism eg it over-emphasises class inequality.\n* Analysis and evaluation of functionalism as it relates to social inequality as the main cause of criminal behaviour.\n* Analysis and evaluation of interactionism eg it takes blame away from the perpetrators of crime.\n* Analysis and evaluation of the New Right as it relates to social inequality as the main cause of criminal behaviour.\n* Evidence-based judgements and conclusions relating to the issue of extent.`,
      },
      {
        id: 'soc_c_12_5', source: 'P2 JUN24', marks: 12,
        q: 'Discuss how far sociologists would agree that criminal behaviour amongst young people is a significant problem in society.',
        ms: `12 marks (AO1 = 4, AO2 = 4, AO3 = 4)\n\nIndicative content AO1:\n* Functionalism.\n* Marxism.\n* Interactionism.\n* Focus of media coverage of crime and young people.\n\nIndicative content AO2:\n* Functionalist perspective -- young people commit crime as a way of gaining status in society, eg the work of Cohen. Cohen argued that everyone in society shares the same goals but due to material and cultural deprivation, working class children are likely to fail in education, limiting their job prospects. He terms this 'status frustration' and suggests that young working class boys commit crime as a way of gaining status.\n* Marxist perspective -- young people commit crime as a response to the confines of the capitalist system, eg consumerism drives those who suffer from relative deprivation to commit crime. Those in low income or insecure employment who have no prospect of saving money for a house or car may commit crime to gain material rewards, choosing immediate gratification over long-term saving.\n* Interactionist perspective -- young people do not necessarily commit more crime, but are more likely to be labelled by agents of social control as criminal, eg the work of Becker.\n* Disproportionate media focus on young people's involvement in crime -- young people have, to a large extent, become folk devils and the media sensationalises youth crime (knife crime, gang related crime, anti-social behaviour) in order to sell papers and/or increase web traffic.\n\nIndicative content AO3:\n* Analysis and evaluation of the functionalist perspective eg it ignores how criminal behaviour can be learned and transmitted, and assumes everyone shares the same goals.\n* Analysis and evaluation of the interactionist perspective eg it removes blame from young people and excuses criminal behaviour by placing blame onto society, particularly teachers and the media, for negatively labelling young people and creating a self-fulfilling prophecy.\n* Analysis and evaluation of the media's portrayal of young people in terms of crime eg some sociologists argue youth crime is not the problem -- society's reaction to it is.\n* Evidence-based judgements and conclusions relating to the issue of extent.`,
      },
      {
        id: 'soc_c_12_6', source: 'P2 JUN24', marks: 12,
        q: 'Discuss how far sociologists would agree that crime and deviance are socially constructed.',
        ms: `12 marks (AO1 = 4, AO2 = 4, AO3 = 4)\n\nIndicative content AO1:\n* Interactionism.\n* Functionalism.\n* Feminism.\n* Marxism.\n* Relevant examples of the social construction of criminal and deviant behaviour, including time, place, social situation, culture and age.\n\nIndicative content AO2:\n* Interactionist perspective -- the work of Becker, who suggests that an act only becomes criminal or deviant when others perceive it to be so.\n* Functionalist perspective -- crime is socially constructed in that the social structure generates pressure for deviant behaviour upon some groups in society.\n* Feminist perspective -- crime is socially constructed by a patriarchal society that is not only biased against women but also applies double standards.\n* Marxist perspective -- crime is socially constructed in that the criminal justice system is biased in favour of the rich and powerful.\n* Relevant examples: time (eg smoking in public places became illegal in 2007, suicide was a crime until 1961, homosexuality was a crime until 1967); place (eg smoking in a public place is illegal but smoking in your own home is acceptable); culture (eg in some Arab states using cannabis is legal but drinking alcohol is not); age (eg the legal age of consent is 16, the legal drinking age is 18 -- and deviance is also socially constructed by context, eg wearing a bikini is acceptable on a beach but deviant in a shopping centre).\n\nIndicative content AO3:\n* Analysis and evaluation of the interactionist perspective eg it does not explain why some people commit criminal behaviour in the first place.\n* Analysis and evaluation of the functionalist perspective eg it fails to explain why some groups commit criminal acts while others do not.\n* Analysis and evaluation of the feminist perspective eg it fails to acknowledge the lenient treatment of women in the criminal justice system (chivalry thesis).\n* Analysis and evaluation of the Marxist perspective eg it can romanticise working-class crime.\n* Analysis and evaluation of the relevant examples eg criminal acts can be used to put pressure on the government to make legal changes; sentencing can vary by context (eg self-defence), suggesting courts rather than society decide the degree of criminality.\n* Evidence-based judgements and conclusions relating to the issue of extent.`,
      },
    ],
  },

  // ── SOCIAL STRATIFICATION ──────────────────────────────────────────────────
  {
    id: 'soc_stratification',
    label: 'Social Stratification -- Key Terms & Questions',
    icon: '📊',
    color: '#FF5C7A',
    bg: 'rgba(255,92,122,.12)',
    border: 'rgba(255,92,122,.28)',
    description: 'Class, gender, ethnicity and age inequality. Key terms, describe questions and source-based questions from Paper 2 Section B.',
    paper: 'Paper 2',
    skillTip: 'Know the key concepts: class, meritocracy, glass ceiling, social mobility. Know the key perspectives: Marxism (class conflict), Weberian (multiple inequalities), Functionalism (inequality is functional). Use specific sociologists and studies.',
    questions: [
      {
        id: 'soc_s_kt1', source: 'P2 JUN23', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe the invisible barrier keeping women from achieving senior positions in the workplace?',
        options: ['Alienation', 'Gender role', 'Glass ceiling', 'Social control'],
        correctIndex: 2,
        ms: 'C -- Glass ceiling\n[1 mark AO1]',
      },
      {
        id: 'soc_s_kt2', source: 'P2 JUN23', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe data that accurately reflects the wider population being studied?',
        options: ['Quota sample', 'Representative sample', 'Snowball sample', 'Systematic sample'],
        correctIndex: 1,
        ms: 'B -- Representative sample\n[1 mark AO1]',
      },
      {
        id: 'soc_s_d1', source: 'P2 JUN23', marks: 3,
        q: 'Describe one feature of a meritocracy.',
        ms: `Level 3 (3 marks): Coherent description with good sociological knowledge.\n\nIndicative content (AO1):\n* In a meritocracy, social position and rewards are allocated on the basis of individual talent, hard work and effort -- not birth, class, gender or ethnicity.\n* Everyone has an equal opportunity to succeed regardless of their background -- success is earned rather than inherited.\n* Educational achievement is a key mechanism of meritocracy -- those who do well in school gain access to higher-status occupations.\n* Functionalists (Parsons, Davis and Moore) support the idea of meritocracy -- they argue it is fair because it matches the most talented people to the most important roles.\n* Critics (Marxists, Feminists) argue meritocracy is a myth -- structural inequalities based on class, gender and ethnicity mean true equality of opportunity does not exist.`,
      },
      {
        id: 'soc_s_d2', source: 'P2 JUN23', marks: 3,
        q: 'Identify and describe one example of age discrimination.',
        ms: `Level 3 (3 marks): Coherent description with good sociological knowledge.\n\nIndicative content (AO1):\n* Ageism in the workplace: older workers may be passed over for promotion or made redundant in favour of younger, cheaper workers, despite having more experience.\n* Young people face age discrimination: denied access to jobs requiring experience, paid less than adults for the same work (youth national minimum wage rates), not taken seriously politically despite being affected by policy decisions.\n* Compulsory retirement ages: forcing workers to retire at a fixed age regardless of their ability or desire to continue working.\n* Stereotyping: older people stereotyped as unable to learn new technology; young people stereotyped as lazy, irresponsible or criminal.`,
      },
      {
        id: 'soc_s_kt3', source: 'P2 NOV21', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe a group of people at the very bottom of the social scale who are dependent on welfare benefits?',
        options: ['Bourgeoisie', 'Middle class', 'Proletariat', 'Underclass'],
        correctIndex: 3,
        ms: 'D -- Underclass\n[1 mark AO1]',
      },
      {
        id: 'soc_s_kt4', source: 'P2 NOV21', marks: 1, type: 'mc',
        q: 'What term is commonly used by sociologists to describe a society that rewards people based on their abilities and efforts?',
        options: ['Aristocracy', 'Hierarchy', 'Meritocracy', 'Nepotism'],
        correctIndex: 2,
        ms: 'C -- Meritocracy\n[1 mark AO1]',
      },
      {
        id: 'soc_s_d3', source: 'P2 NOV21', marks: 3,
        q: 'Describe one type of poverty.',
        ms: `Level 3 (3 marks): A coherent description with few inaccuracies, demonstrating good sociological knowledge. (AO1)\n\nIndicative content (AO1):\n* Absolute poverty eg when an individual lacks the basic necessities for survival -- food, shelter etc.\n* Relative poverty eg when an individual's standard of living falls below that of wider society.\n* Child poverty eg when the family's income falls below a certain level.\n* Other relevant types of poverty will be credited.`,
      },
      {
        id: 'soc_s_d4', source: 'P2 NOV21', marks: 3,
        q: "Identify and describe one factor that might affect an individual's life chances.",
        ms: `Level 3 (3 marks): A coherent description with few inaccuracies, demonstrating good sociological knowledge. (AO1)\n\nIndicative content (AO1):\n* Social class eg working classes tend to have poorer life chances.\n* Gender eg women tend to earn less and are more likely to do low status work.\n* Ethnicity eg certain ethnic groups are more likely to suffer material deprivation and do less well educationally.\n* Disability eg individuals with health issues are more likely to suffer from material deprivation and social exclusion.`,
      },
      {
        id: 'soc_s_it1', source: 'P2 NOV21', marks: 2,
        extract: `ITEM C -- Food Banks and the Working Poor\n\nFood banks are run by charities and give food away for free to those in need of emergency food supplies. In recent years, there has been a sharp increase in the use of food banks. In particular, there have been more people using them who are in employment, but in low-paid jobs (the 'working poor'). Some would argue that this is an indicator of an increase in poverty in the UK, as people cannot afford to buy the basic necessities to survive. This increased usage accounts for those both in and out of work. The Trussell Trust is a charity which runs food banks in the UK. In 2019, they released statistics showing the increase in usage of food banks over a five-year period.`,
        q: 'From Item C, examine one weakness of using non-official statistics to investigate poverty.',
        ms: `2 marks (AO3):\n1 mark for identifying a weakness, 1 mark for evaluating why this represents a weakness\n\nIndicative content AO3:\n* Reliability eg non-official statistics may not have the same level of quality as official statistics.\n* Relative approach eg there is no objective measure of earnings or household income.\n* Problem with sample eg unaware how many people actually received the food packages -- were some given to the same families on different occasions?`,
      },
      {
        id: 'soc_s_it2', source: 'P2 NOV21', marks: 4,
        extract: `ITEM C -- Food Banks and the Working Poor\n\nFood banks are run by charities and give food away for free to those in need of emergency food supplies. In recent years, there has been a sharp increase in the use of food banks. In particular, there have been more people using them who are in employment, but in low-paid jobs (the 'working poor'). Some would argue that this is an indicator of an increase in poverty in the UK, as people cannot afford to buy the basic necessities to survive. This increased usage accounts for those both in and out of work. The Trussell Trust is a charity which runs food banks in the UK. In 2019, they released statistics showing the increase in usage of food banks over a five-year period.`,
        q: 'Identify and explain one factor which may account for the increased use of food banks as referred to in Item C.',
        ms: `4 marks (AO1 = 1, AO2 = 3) -- 'Context' here refers to the increased use of food banks.\n\nLevel 4 (4 marks): Relevant factor identified (AO1) and a detailed, well-developed explanation with clear application to context. (AO2)\nLevel 3 (3 marks): Relevant factor identified with explanation containing some inaccuracies/omissions but some application.\nLevel 2 (2 marks): Relevant factor identified with a largely inaccurate/irrelevant explanation, weakly applied.\nLevel 1 (1 mark): Relevant alternative factor identified only.\n\nIndicative content AO1:\n* Low pay.\n* Inequality in society.\n* The welfare state.\n\nIndicative content AO2:\n* Low pay eg changes in the economy have resulted in more low-paid, low-status jobs and zero-hours contracts.\n* Inequality eg persistent structures of inequality in society.\n* Reforms to the welfare state such as universal credit and the benefits cap has resulted in some groups becoming welfare dependent.`,
      },
      {
        id: 'soc_s_it3', source: 'P2 NOV21', marks: 4,
        extract: `ITEM D -- Weber on Social Status\n\nMax Weber was interested in social stratification, and how different groups of people came together to form classes. He believed the term social status could be applied in a positive or negative sense. His idea rested on the following important factors:\n* mode of living (lifestyle)\n* level of education or training\n* prestige (social importance of the family).\n\nBecause of this range of factors, he believed that classes were not necessarily made up of people who were all the same, but groups who shared similar positions in the market economy -- they shared similar earnings, interests and lifestyles.\n\nSource: Weber, M, The Theory and Social and Economic Organisations, (1947)`,
        q: "From Item D, identify and describe one factor that Weber believed to be important when deciding an individual's social status, including what you know of his perspective on this issue.",
        ms: `4 marks (AO1 = 1, AO2 = 3) -- 'Context' here refers to the work of Weber.\n\nLevel 4 (4 marks): Relevant factor selected (AO1) and a detailed, well-developed description with good application to context. (AO2)\nLevel 3 (3 marks): Relevant factor selected with description containing some inaccuracies/omissions but some application.\nLevel 2 (2 marks): Relevant factor selected with a largely inaccurate/irrelevant description, weakly applied.\nLevel 1 (1 mark): Relevant factor selected only.\n\nIndicative content AO1:\n* Lifestyle.\n* Education.\n* Prestige.\n\nIndicative content AO2:\n* Writing in the early 20th century, Weber was inspired by Marx, but offered a more complex interpretation of social stratification related to an individual's market situation.\n* Weber believed that members of the same social classes enjoyed similar lifestyles.\n* Weber believed that members of the same social classes had a similar educational background.\n* Weber believed that members of the same social classes shared a similar social status to their families.`,
      },
      {
        id: 'soc_s_12_1', source: 'P2 NOV21', marks: 12,
        q: "Discuss how far sociologists would agree that social class is the most important factor affecting an individual's life chances.",
        ms: `12 marks (AO1 = 4, AO2 = 4, AO3 = 4)\n\nIndicative content AO1:\n* Marxism.\n* Functionalism.\n* Feminism.\n* The New Right.\n\nIndicative content AO2:\n* Marxism eg an individual's life chances are largely related to their social class.\n* Functionalism eg in a meritocracy, life chances are the product of an individual's hard work and talent.\n* Feminism eg patriarchy ensures that men have better life chances than women.\n* The New Right eg that life chances are related to the lifestyle choices made by an individual.\n\nIndicative content AO3:\n* Analysis and evaluation of Marxism, functionalism, feminism and the New Right as they relate to the view that social class is the most important factor affecting an individual's life chances.\n* Evidence-based judgements and conclusions relating to the issue of extent.`,
      },
      {
        id: 'soc_s_12_2', source: 'P2 NOV21', marks: 12,
        q: 'Discuss how far sociologists would agree that capitalism exploits certain groups in society.',
        ms: `12 marks (AO1 = 4, AO2 = 4, AO3 = 4)\n\nIndicative content AO1:\n* Marxism.\n* Feminism.\n* The New Right.\n* Functionalism.\n* Globalisation.\n\nIndicative content AO2:\n* Marxism eg capitalism exploits the working classes in society, who produce profit for the bourgeoisie through their labour while receiving only a fraction of its value as wages.\n* Feminism eg capitalism exploits women in particular, as men benefit from their unpaid domestic labour, which reproduces and sustains the workforce at no cost to employers.\n* The New Right eg the welfare state has created a benefit-reliant underclass who experience low paid and insecure work as a consequence of their own choices and culture, rather than capitalism itself being to blame.\n* Functionalism eg Davis and Moore argue that unequal rewards are necessary and beneficial to society, motivating the most talented people to fill the most important roles -- inequality is functional, not exploitative.\n* Globalisation eg multinational companies exploit cheap labour in developing countries, extending capitalist exploitation across national borders.\n\nIndicative content AO3:\n* Analysis and evaluation of Marxism eg it may understate the extent to which workers' rights and welfare protections have reduced exploitation in modern Britain.\n* Analysis and evaluation of feminism eg the rise of dual-earner households and changes in the law suggest some reduction in women's exploitation, though unpaid domestic labour persists.\n* Analysis and evaluation of the New Right view eg it can be criticised for blaming individuals for structural inequalities created by the capitalist system itself.\n* Analysis and evaluation of functionalism eg Davis and Moore's concept can be challenged by Tumin, who argues inequality can prevent talented people from disadvantaged backgrounds reaching top positions at all.\n* Evidence-based judgements and conclusions relating to the issue of extent (how far sociologists would agree that capitalism exploits certain groups in society).`,
      },
    ],
  },
]

// ─── Flat lookup ──────────────────────────────────────────────────────────────
export const ALL_SOCIOLOGY_QUESTIONS = SOCIOLOGY_TOPIC_GROUPS.flatMap(g =>
  g.questions.map(q => ({
    ...q,
    topicId:    g.id,
    topicLabel: g.label,
    topicColor: g.color,
    paper:      g.paper,
    skillTip:   g.skillTip,
  }))
)
