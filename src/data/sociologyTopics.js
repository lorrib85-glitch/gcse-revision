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
