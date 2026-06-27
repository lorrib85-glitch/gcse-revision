export default {
  "id": "soc4",
  "subject": "Sociology",
  "number": 4,
  "title": "Family & Households",
  "subtitle": "Why families are more sociological than you realised.",
  "era": "AQA GCSE",
  "icon": "🏠",
  "color": "#D96030",
  "colorLight": "rgba(217,96,48,.12)",
  "hook": {
    "atmosphericOpener": {
      "heading": "What makes a family?",
      "sub": "Families shape almost everything about us.",
      "cta": "Start investigating"
    },
    "statement": "\"Most families today are a mum, dad and two children living under one roof.\"",
    "isTrue": false,
    "accentWords": [
      "mum, dad and two children"
    ],
    "explanation": "The nuclear family is now a minority in Britain. Single-parent households, cohabitation, same-sex families and reconstituted families have fundamentally changed the picture.",
    "wrongFeedback": "Sociologists would strongly disagree. Family diversity is one of the defining features of modern British society.",
    "correctFeedback": "Correct. The nuclear family is no longer the majority household type in the UK.",
    "loadingText": "Sociology has a lot to say about this…",
    "bigQuestion": "So what does a family actually look like today?",
    "revealHeader": "Families come in many forms.",
    "revealItems": [
      {
        "emoji": "🌍",
        "label": "Family diversity",
        "detail": "Lone-parent families, reconstituted families, same-sex families and extended families are all recognised by sociologists as valid family structures."
      },
      {
        "emoji": "📉",
        "label": "Changing families",
        "detail": "Marriage rates are falling. Divorce rates rose sharply through the 20th century. Cohabitation and single-person households are increasingly common."
      },
      {
        "emoji": "⚖️",
        "label": "Feminist perspectives",
        "detail": "Feminists argue traditional family structures can reinforce gender inequality — with women bearing a disproportionate share of domestic labour and emotional work."
      }
    ],
    "punchline": "Sociology asks not just what a family is — but who benefits from it."
  },
  "intro": {
    "learningGoals": [
      "Identify and define the main family types recognised by sociologists",
      "Explain what primary socialisation is and why it matters",
      "Describe the Functionalist view of family life",
      "Describe the Feminist critique of family inequality",
      "Explain how and why families have changed over time",
      "Apply sociological perspectives to real family scenarios"
    ]
  },
  "outcomes": {
    "intro": "The family seems natural. Sociology shows it's actually constructed — and has changed dramatically over time.",
    "bullets": [
      "Describe how family structures in the UK have changed since 1960",
      "Explain what sociologists mean by 'the cereal packet family'",
      "See why Marxists and Feminists both critique the traditional family",
      "Apply functionalist and critical perspectives to modern family life"
    ]
  },
  "recall": {
    "questions": [
      {
        "type": "truefalse",
        "question": "The nuclear family has always been the most common family type.",
        "isTrue": false
      },
      {
        "type": "choice",
        "question": "Functionalists see the family as mainly...",
        "options": [
          "A source of conflict and gender inequality",
          "Performing essential positive functions for society",
          "A capitalist institution that exploits women"
        ],
        "correct": 1
      },
      {
        "type": "connection",
        "question": "Feminist sociologists critique traditional family because...",
        "options": [
          {
            "text": "They believe people should live alone instead",
            "icon": "house"
          },
          {
            "text": "It reinforces unequal gender roles and expectations",
            "icon": "people"
          },
          {
            "text": "Nuclear families are now statistically very rare",
            "icon": "warning"
          }
        ],
        "correct": 1
      }
    ]
  },
  "screens": [
    {
      "label": "Family Types",
      "kicker": "Core Concept",
      "heading": "What even counts as a family?",
      "sub": "Most people think they know. Sociologists quickly realised it's more complicated than that.",
      "blocks": [
        {
          "type": "read",
          "label": "Defining the family",
          "text": "Sociologists define the family as a <strong>social group</strong> sharing ties of kinship, marriage or adoption — often living together and providing emotional and economic support. But definitions vary across cultures, time periods and political perspectives."
        },
        {
          "type": "scenario",
          "situation": "A married couple live with their two school-age children. Both parents work full-time.",
          "question": "Which family type does this describe?",
          "options": [
            {"text": "Nuclear family", "correct": true},
            {"text": "Extended family", "correct": false},
            {"text": "Beanpole family", "correct": false}
          ],
          "correctMsg": "The nuclear family consists of two parents and their dependent children — once considered the 'norm' in Western society.",
          "wrongMsg": "Nuclear family = two parents + dependent children only. Extended families include wider relatives. Beanpole families span many generations with few siblings at each level."
        },
        {
          "type": "scenario",
          "situation": "A mother lives alone with her 10-year-old daughter after separating from her partner. The daughter's father visits at weekends.",
          "question": "Which family type does this describe?",
          "options": [
            {"text": "Extended family", "correct": false},
            {"text": "Lone-parent family", "correct": true},
            {"text": "Reconstituted family", "correct": false}
          ],
          "correctMsg": "Lone-parent families are now a major family type in the UK. Most are headed by women. They are not defined by what they lack — they are a distinct family structure with their own dynamics.",
          "wrongMsg": "A lone-parent family = one parent raising children. Extended families include wider relatives. Reconstituted families are formed from previous relationships joining together."
        },
        {
          "type": "scenario",
          "situation": "Two fathers live with their adopted son and the son's biological grandmother, who provides regular childcare.",
          "question": "Which family type best describes this household?",
          "options": [
            {"text": "Extended family — multiple generations sharing support", "correct": true},
            {"text": "Nuclear family — two parents and one child", "correct": false},
            {"text": "Lone-parent family — only one main carer", "correct": false}
          ],
          "correctMsg": "When wider relatives live with or actively support a household, it moves toward an extended family — regardless of how the couple is composed. Family types can overlap.",
          "wrongMsg": "The grandmother's active, regular involvement in childcare makes this an extended family — wider relatives are part of the household's functioning."
        },
        {
          "type": "colsort",
          "question": "Match each family type to its correct definition.",
          "columns": [
            {
              "label": "NUCLEAR\nTwo parents + dependent children only",
              "color": "#D96030",
              "bg": "rgba(217,96,48,.07)"
            },
            {
              "label": "EXTENDED\nIncludes wider relatives",
              "color": "#A0522D",
              "bg": "rgba(160,82,45,.07)"
            },
            {
              "label": "RECONSTITUTED\nBlended or step-family",
              "color": "#8B6914",
              "bg": "rgba(139,105,20,.07)"
            },
            {
              "label": "BEANPOLE\nMany generations, few siblings",
              "color": "#6B4E3D",
              "bg": "rgba(107,78,61,.07)"
            }
          ],
          "items": [
            {
              "label": "Grandparents, parents and children living together",
              "col": 1,
              "explanation": "Multiple generations under one roof — the defining feature of an extended family."
            },
            {
              "label": "Two parents raising children from previous relationships",
              "col": 2,
              "explanation": "A blended or reconstituted family — also called a step-family."
            },
            {
              "label": "Great-grandparents still living, but only one or two children per generation",
              "col": 3,
              "explanation": "Beanpole: long and thin — many generations alive simultaneously, but few siblings at each level."
            },
            {
              "label": "Married couple with their dependent children, no other relatives",
              "col": 0,
              "explanation": "The classic nuclear family — two parents and their children only."
            }
          ],
          "explanation": "AQA regularly asks students to identify and describe family types. Definitions score marks. Examples alone do not."
        }
      ]
    },
    {
      "label": "Socialisation",
      "kicker": "Core Concept",
      "heading": "Families teach us who to be.",
      "sub": "This is called primary socialisation. It starts from birth and never entirely stops.",
      "blocks": [
        {
          "type": "read",
          "label": "Primary socialisation",
          "text": "<strong>Primary socialisation</strong> is the process through which children learn the basic norms, values, language and behaviour of their society — mainly through the family. It is called \"primary\" because it is the <strong>first</strong> and most fundamental form of socialisation."
        },
        {
          "type": "keypoint",
          "heading": "What families teach",
          "points": [
            {
              "emoji": "🗣️",
              "label": "Language",
              "detail": "Children learn to speak, name objects and communicate emotions through family interaction — before any formal education."
            },
            {
              "emoji": "🤝",
              "label": "Manners and behaviour",
              "detail": "\"Say thank you.\" \"Share your toys.\" Families transmit the basic rules of social interaction from the earliest age."
            },
            {
              "emoji": "⚖️",
              "label": "Norms",
              "detail": "What is considered normal behaviour — mealtimes, routines, how to treat others — is learned at home first."
            },
            {
              "emoji": "💡",
              "label": "Values",
              "detail": "Deeper beliefs — honesty, respect, work ethic — are instilled through family life, often without being stated explicitly."
            }
          ]
        },
        {
          "type": "funfact",
          "heading": "Primary socialisation in action",
          "text": "Parent: \"Say thank you.\"\nChild: \"Why?\"\nParent: \"Because civilisation would collapse.\"\n\nSociologists call this the transmission of norms and values. Parents just call it Tuesday."
        },
        {
          "type": "quiz",
          "question": "Which of the following is learned through primary socialisation?",
          "options": [
            {
              "text": "How to speak and communicate with others",
              "correct": true
            },
            {
              "text": "The laws of thermodynamics",
              "correct": false
            },
            {
              "text": "How to pass a driving test",
              "correct": false
            },
            {
              "text": "GCSE exam technique",
              "correct": false
            }
          ],
          "correctMsg": "Correct. Language and communication are among the earliest things learned through family interaction — the foundation of all socialisation.",
          "wrongMsg": "Primary socialisation is about norms, values, language and behaviour — all transmitted through the family in early childhood."
        },
        {
          "type": "examtip",
          "tip": "AQA distinguishes primary socialisation (family, early childhood) from secondary socialisation (school, peers, media — later in life). Always specify which agency you are describing and which type of socialisation it represents."
        }
      ]
    },
    {
      "label": "Functionalism",
      "kicker": "Sociological Perspectives",
      "heading": "Functionalists say families create stability.",
      "sub": "Everything in society exists for a reason. Families, according to Functionalists, exist for several.",
      "blocks": [
        {
          "type": "read",
          "label": "The Functionalist view",
          "text": "<strong>Functionalists</strong> see the family as a fundamental institution that benefits both individuals and society. Talcott Parsons identified two core functions of the nuclear family: <strong>primary socialisation</strong> of children, and <strong>the stabilisation of adult personalities</strong> — providing emotional support for adults recovering from the demands of work and public life."
        },
        {
          "type": "keypoint",
          "heading": "Functions of the family",
          "points": [
            {
              "emoji": "💬",
              "label": "Emotional support",
              "detail": "The family provides a safe emotional environment — what Parsons called a \"warm bath\" — where adults can recover from the stresses of work and public life."
            },
            {
              "emoji": "📖",
              "label": "Primary socialisation",
              "detail": "Children learn society's norms, values and culture through the family — the essential first step before entering wider institutions."
            },
            {
              "emoji": "🏠",
              "label": "Economic support",
              "detail": "Families pool resources, share costs and provide financial security — particularly for children, elderly and vulnerable members."
            },
            {
              "emoji": "🔄",
              "label": "Social stability",
              "detail": "By transmitting shared values across generations, families maintain social order and ensure society continues to function."
            }
          ]
        },
        {
          "type": "colsort",
          "question": "Match each scenario to the family function it illustrates.",
          "columns": [
            {
              "label": "EMOTIONAL SUPPORT\nComfort and stability",
              "color": "#D96030",
              "bg": "rgba(217,96,48,.07)"
            },
            {
              "label": "SOCIALISATION\nTeaching norms and values",
              "color": "#A0522D",
              "bg": "rgba(160,82,45,.07)"
            },
            {
              "label": "ECONOMIC SUPPORT\nSharing resources",
              "color": "#8B6914",
              "bg": "rgba(139,105,20,.07)"
            }
          ],
          "items": [
            {
              "label": "Parents comfort a child upset after school",
              "col": 0,
              "explanation": "Emotional support — one of Parsons' core functions. The family as a safe, private haven."
            },
            {
              "label": "Parents teach their child to say please and thank you",
              "col": 1,
              "explanation": "Primary socialisation — teaching the norms and values of society through everyday interaction."
            },
            {
              "label": "Grandparents pay for a grandchild's school trip",
              "col": 2,
              "explanation": "Economic support — families sharing financial resources across generations."
            },
            {
              "label": "A stressed parent unwinds at home after a difficult day at work",
              "col": 0,
              "explanation": "Parsons' \"warm bath\" theory — the family stabilises adult personalities by providing a private emotional refuge from the demands of public life."
            }
          ],
          "explanation": "Functionalists see every family function as serving a wider social purpose. For AQA, name the function and explain how it benefits society — not just that it does."
        },
        {
          "type": "funfact",
          "heading": "The warm bath theory",
          "text": "Talcott Parsons described the family as a \"warm bath\" — a place where stressed adults could emotionally recover.\n\nParent, still in work clothes at 8pm, making their third packed lunch while replying to school emails: \"Absolutely. Very warm.\""
        },
        {
          "type": "examtip",
          "tip": "Functionalists focus on what the family does FOR society. In any 6-mark answer: name Parsons, identify at least one function, explain HOW it benefits society — and acknowledge that not everyone agrees (feminists, Marxists)."
        }
      ]
    },
    {
      "label": "Feminism",
      "kicker": "Sociological Perspectives",
      "heading": "Feminists say family life isn't always equal.",
      "sub": "The family can be a site of inequality as well as support. Feminists were among the first sociologists to say so.",
      "blocks": [
        {
          "type": "read",
          "label": "The Feminist critique",
          "text": "<strong>Feminist sociologists</strong> argue that traditional family structure can reinforce gender inequality. Women have historically been expected to perform the majority of <strong>domestic labour</strong> (housework, childcare) and <strong>emotional labour</strong> (managing relationships and feelings in the household) — often unpaid and unrecognised."
        },
        {
          "type": "keypoint",
          "heading": "Key feminist concepts",
          "points": [
            {
              "emoji": "🧹",
              "label": "Domestic labour",
              "detail": "Cooking, cleaning, childcare and household management. Ann Oakley (1974) found women performed the bulk of this even when working full-time."
            },
            {
              "emoji": "💭",
              "label": "Emotional labour",
              "detail": "The invisible work of managing the emotional wellbeing of family members — organising, remembering, worrying. Usually performed by women and rarely acknowledged."
            },
            {
              "emoji": "🎭",
              "label": "Gender role expectations",
              "detail": "Societal expectations around what men and women \"should\" do in family life — which feminists argue are socially constructed, not natural or inevitable."
            },
            {
              "emoji": "📊",
              "label": "The dual burden",
              "detail": "Many women face a \"dual burden\" — combining full-time paid employment with the majority of unpaid domestic work at home. Research consistently replicates Oakley's original finding."
            }
          ]
        },
        {
          "type": "colsort",
          "question": "Is this domestic labour or emotional labour?",
          "columns": [
            {
              "label": "DOMESTIC LABOUR\nPhysical household tasks",
              "color": "#D96030",
              "bg": "rgba(217,96,48,.07)"
            },
            {
              "label": "EMOTIONAL LABOUR\nManaging feelings and relationships",
              "color": "#8B6914",
              "bg": "rgba(139,105,20,.07)"
            }
          ],
          "items": [
            {
              "label": "Cooking dinner every evening",
              "col": 0,
              "explanation": "Domestic labour — a physical, time-consuming task that Oakley found was disproportionately performed by women."
            },
            {
              "label": "Remembering every family member's social commitments",
              "col": 1,
              "explanation": "Emotional and organisational labour — the mental load of tracking what everyone needs."
            },
            {
              "label": "Cleaning and organising the home",
              "col": 0,
              "explanation": "Domestic labour — one of the core tasks examined in Oakley's research."
            },
            {
              "label": "Mediating arguments between siblings",
              "col": 1,
              "explanation": "Emotional labour — managing family relationships is invisible but exhausting work."
            },
            {
              "label": "Organising school admin, uniforms and appointments",
              "col": 1,
              "explanation": "The \"mental load\" — planning and organising that goes largely unseen but falls disproportionately on women."
            }
          ],
          "explanation": "Feminists distinguish these to show that inequality in family life extends beyond visible housework to the invisible management of emotional and organisational life."
        },
        {
          "type": "funfact",
          "heading": "Invisible labour",
          "text": "Dad: \"Just tell me what needs doing.\"\n\nMum, mentally holding the shopping list, three school letters, the dentist appointment, who's upset with whom and why, and the emotional stability of the entire household:\n\n\"Sure.\""
        },
        {
          "type": "examtip",
          "tip": "AQA often asks to compare Functionalist and Feminist views. Functionalists say the family benefits everyone equally. Feminists say it benefits men more — and at women's expense. Structure: state the view → name a sociologist → give evidence."
        }
      ]
    },
    {
      "label": "New Right",
      "kicker": "Sociological Perspectives",
      "heading": "The New Right: family breakdown and the welfare state.",
      "sub": "Charles Murray argued welfare dependency was creating a damaging underclass. A controversial but exam-essential perspective.",
      "headerImage": "/figures/charles-murray.png",
      "blocks": [
        {
          "type": "read",
          "label": "The New Right perspective",
          "text": "The <strong>New Right</strong> is a conservative sociological perspective that emerged in the 1970s–80s. Thinkers like <strong>Charles Murray</strong> and <strong>David Marsland</strong> argue that the traditional nuclear family — with a married male breadwinner and female carer — is the ideal structure for a stable society. They believe state welfare has undermined this ideal by removing the need for two-parent families."
        },
        {
          "type": "keypoint",
          "heading": "Key New Right ideas",
          "points": [
            {
              "emoji": "👤",
              "label": "Charles Murray",
              "detail": "Murray (1984) argued welfare benefits created a growing \"underclass\" — a group dependent on state support with weakened work ethic and family structure. He saw rising lone-parent families as evidence of moral and social decline."
            },
            {
              "emoji": "🏛️",
              "label": "David Marsland",
              "detail": "Marsland argued universal welfare was too generous and created a \"dependency culture\" — removing individual and family responsibility. He called for targeted, not universal, welfare provision."
            },
            {
              "emoji": "💍",
              "label": "The nuclear family ideal",
              "detail": "New Right thinkers see the traditional nuclear family as the best environment for raising children and maintaining social stability. Other family forms are seen as less effective."
            },
            {
              "emoji": "⚠️",
              "label": "The underclass",
              "detail": "Murray's concept: a section of society characterised by welfare dependency, absent fathers, high crime rates and rejection of mainstream values. He blamed welfare, not structural inequality."
            }
          ]
        },
        {
          "type": "misconception",
          "mistakes": [
            {
              "wrong": "The New Right simply hates poor people.",
              "right": "The New Right frames its argument as concern for social stability.",
              "reason": "Murray and Marsland argue welfare harms the people it claims to help by creating long-term dependency. Whether or not you agree, this is the logic you need to explain in an exam — not a personal attack."
            },
            {
              "wrong": "The New Right is the same as Functionalism.",
              "right": "Both favour the nuclear family, but for different reasons.",
              "reason": "Functionalists focus on socialisation and stability. The New Right focuses on welfare dependency and moral responsibility. They are distinct perspectives in AQA Sociology."
            }
          ]
        },
        {
          "type": "colsort",
          "question": "Is this a New Right or Feminist argument?",
          "columns": [
            {
              "label": "NEW RIGHT\nConservative — traditional family ideal",
              "color": "#3B82FF",
              "bg": "rgba(59,130,255,.07)"
            },
            {
              "label": "FEMINIST\nCritique of family inequality",
              "color": "#D96030",
              "bg": "rgba(217,96,48,.07)"
            }
          ],
          "items": [
            {
              "label": "Welfare creates dependency and weakens family structure",
              "col": 0,
              "explanation": "New Right — Murray's core argument about welfare undermining the traditional family."
            },
            {
              "label": "The family reinforces patriarchy and unpaid female labour",
              "col": 1,
              "explanation": "Feminist — Oakley and others argue the family benefits men at women's expense."
            },
            {
              "label": "The nuclear family is the ideal structure for raising children",
              "col": 0,
              "explanation": "New Right — they see the two-parent married family as best for stability and socialisation."
            },
            {
              "label": "Women face a dual burden of paid and unpaid work",
              "col": 1,
              "explanation": "Feminist — the dual burden is a feminist concept about inequality within families."
            },
            {
              "label": "Lone-parent families contribute to social problems",
              "col": 0,
              "explanation": "New Right — Murray linked single parenthood to the underclass and welfare dependency."
            }
          ],
          "explanation": "New Right = traditional values, anti-welfare. Feminist = equality critique, domestic labour. Both evaluate the family but from opposite political standpoints."
        },
        {
          "type": "examtip",
          "tip": "AQA regularly asks you to compare perspectives on the family. New Right vs Feminist is a classic pairing: both evaluate the family critically, but reach opposite conclusions. New Right: family breakdown is caused by welfare. Feminist: family inequality is caused by patriarchy."
        }
      ]
    },
    {
      "label": "Changing Families",
      "kicker": "Social Change",
      "heading": "Families look very different from 100 years ago.",
      "sub": "And 50 years ago. And probably 20 years ago. Families change faster than sociologists can write about them.",
      "blocks": [
        {
          "type": "read",
          "label": "Key changes in family life",
          "text": "Over the last century, British family life has changed significantly. <strong>Marriage rates</strong> have declined, <strong>divorce rates</strong> rose sharply after the 1969 Divorce Reform Act, <strong>cohabitation</strong> has increased, and family structures have diversified considerably. The nuclear family is no longer the majority household form."
        },
        {
          "type": "keypoint",
          "heading": "New family types to know",
          "points": [
            {
              "emoji": "🌳",
              "label": "Beanpole family",
              "detail": "Long and thin — many generations alive simultaneously (great-grandparents through to grandchildren) but few siblings at each level. The result of longer lifespans and lower birth rates."
            },
            {
              "emoji": "🪃",
              "label": "Boomerang family",
              "detail": "Adult children who leave home and then return — usually due to housing costs, student debt or relationship breakdown. Increasingly common in the UK."
            },
            {
              "emoji": "👶",
              "label": "Child-centred family",
              "detail": "Modern families increasingly organise life around children's needs and wellbeing — rather than around adult work obligations or extended family duty."
            }
          ]
        },
        {
          "type": "funfact",
          "heading": "The boomerang family",
          "text": "Adult child: \"I'm just staying temporarily.\"\n\nParents, three years later, eating around a 27-year-old's vinyl collection and discontinued gym equipment:\n\n\"Of course you are.\""
        },
        {
          "type": "keypoint",
          "heading": "Why families have changed",
          "points": [
            {
              "emoji": "⚖️",
              "label": "Legal changes",
              "detail": "The 1969 Divorce Reform Act made divorce significantly easier. The 2004 Civil Partnership Act and 2014 Marriage Act extended marriage rights to same-sex couples."
            },
            {
              "emoji": "💼",
              "label": "Women in the workforce",
              "detail": "Rising female employment from the 1960s onwards changed family dynamics, reducing financial dependence on male partners."
            },
            {
              "emoji": "🏥",
              "label": "Longer life expectancy",
              "detail": "People live longer — creating beanpole structures with more generations alive simultaneously."
            },
            {
              "emoji": "💸",
              "label": "Economic pressures",
              "detail": "Housing costs, student debt and job insecurity have driven both the rise of the boomerang family and later family formation."
            }
          ]
        },
        {
          "type": "quiz",
          "question": "What is a beanpole family?",
          "options": [
            {
              "text": "A family with many siblings at each generation",
              "correct": false
            },
            {
              "text": "A family with many generations alive but few siblings at each level",
              "correct": true
            },
            {
              "text": "A family where adult children return home",
              "correct": false
            },
            {
              "text": "A nuclear family with nearby extended relatives",
              "correct": false
            }
          ],
          "correctMsg": "Exactly. Long and thin — like a beanpole. Many generations simultaneously alive, very few siblings at each level.",
          "wrongMsg": "The beanpole family is defined by its vertical structure: many generations alive at once, but few siblings at each level. It's caused by longer lifespans and declining birth rates. The boomerang family is where adult children return home."
        },
        {
          "type": "examtip",
          "tip": "Beanpole family comes up constantly in AQA papers. Memorise the definition exactly: many generations alive simultaneously, few siblings at each level — caused by longer lifespans and declining birth rates."
        }
      ]
    },
    {
      "label": "Fill the Gaps",
      "kicker": "Retrieval Practice",
      "heading": "Fill in the blanks.",
      "sub": "Drag the correct word into each gap. Three words in the bank are decoys.",
      "blocks": [
        {
          "type": "fillblanks",
          "sentences": [
            {
              "before": "A beanpole family has many",
              "answer": "generations",
              "after": "alive simultaneously."
            },
            {
              "before": "Primary socialisation teaches children the norms and",
              "answer": "values",
              "after": "of their society."
            },
            {
              "before": "A reconstituted family is also called a",
              "answer": "blended",
              "after": "family."
            },
            {
              "before": "Feminists argue women perform a disproportionate amount of",
              "answer": "domestic",
              "after": "labour."
            },
            {
              "before": "An adult child returning to live with parents is part of a",
              "answer": "boomerang",
              "after": "family."
            }
          ],
          "wordBank": [
            "generations",
            "values",
            "blended",
            "domestic",
            "boomerang",
            "weather",
            "chemistry",
            "nuclear"
          ]
        }
      ]
    },
    {
      "label": "Perspectives",
      "kicker": "Apply Your Knowledge",
      "heading": "Who would agree?",
      "sub": "Three perspectives. One statement. Think before you choose.",
      "blocks": [
        {
          "type": "scenario",
          "situation": "\"The family performs essential functions for society — providing socialisation, emotional support and stability for both individuals and the wider social order.\"",
          "question": "Which sociological perspective would most agree with this?",
          "options": [
            {"text": "Functionalism", "correct": true},
            {"text": "Feminism", "correct": false},
            {"text": "Marxism", "correct": false}
          ],
          "correctMsg": "Functionalists view the family as a positive institution that benefits both individuals and society. This view is closely associated with Talcott Parsons.",
          "wrongMsg": "Which perspective sees the family as performing essential, beneficial functions for society as a whole — rather than as a site of inequality or exploitation?"
        },
        {
          "type": "scenario",
          "situation": "\"Domestic labour and emotional work in families falls disproportionately on women — even when both partners work full-time.\"",
          "question": "Which perspective is this most associated with?",
          "options": [
            {"text": "Functionalism", "correct": false},
            {"text": "Feminism", "correct": true},
            {"text": "New Right", "correct": false}
          ],
          "correctMsg": "This is a core feminist argument, supported by Ann Oakley's research. Feminists argue the family reproduces gender inequality through the unequal division of domestic and emotional labour.",
          "wrongMsg": "Which perspective focuses specifically on gender inequality within the family — arguing the family can disadvantage women through unequal domestic and emotional labour?"
        },
        {
          "type": "scenario",
          "situation": "\"Families support capitalism by reproducing a compliant workforce and absorbing the costs of care that the state does not cover.\"",
          "question": "Which perspective does this statement reflect?",
          "options": [
            {"text": "Functionalism", "correct": false},
            {"text": "Feminism", "correct": false},
            {"text": "Marxism", "correct": true}
          ],
          "correctMsg": "Marxists argue the family serves the interests of capitalism — reproducing labour power, socialising workers to accept inequality and providing unpaid care that would otherwise cost the state.",
          "wrongMsg": "Which perspective argues the family primarily serves the interests of capitalism and the ruling class — rather than society as a whole or gender equality?"
        },
        {
          "type": "examtip",
          "tip": "Link each perspective to a key thinker: Functionalism → Parsons; Feminism → Oakley; Marxism → Engels or Zaretsky. Named sociologists lift a 4-mark answer to the top band."
        }
      ]
    },
    {
      "label": "Quick Fire",
      "kicker": "Retrieval Practice",
      "heading": "Quick fire. No notes.",
      "sub": "Speed matters. Retrieval under pressure is exactly what the exam tests.",
      "blocks": [
        {
          "type": "tieredquiz",
          "tiers": [
            {
              "label": "🟢 Round 1 — Definitions",
              "questions": [
                {
                  "q": "TRUE or FALSE: A beanpole family has many siblings at each generation.",
                  "options": [
                    "True",
                    "False"
                  ],
                  "correct": 1,
                  "explanation": "False. A beanpole family has many generations alive simultaneously but FEW siblings at each level — long and thin, not wide."
                },
                {
                  "q": "Which family type includes step-parents and children from previous relationships?",
                  "options": [
                    "Nuclear family",
                    "Reconstituted family",
                    "Beanpole family",
                    "Extended family"
                  ],
                  "correct": 1,
                  "explanation": "A reconstituted (or blended) family is formed when adults with children from previous relationships form a new family unit."
                },
                {
                  "q": "Primary socialisation mainly occurs through which institution?",
                  "options": [
                    "School",
                    "The family",
                    "The media",
                    "Religion"
                  ],
                  "correct": 1,
                  "explanation": "Primary socialisation is the first and most fundamental form — taking place through the family in early childhood."
                }
              ]
            },
            {
              "label": "🟡 Round 2 — Apply It",
              "questions": [
                {
                  "q": "Which sociologist is associated with the feminist study of domestic labour?",
                  "options": [
                    "Talcott Parsons",
                    "Ann Oakley",
                    "Karl Marx",
                    "Max Weber"
                  ],
                  "correct": 1,
                  "explanation": "Ann Oakley's 1974 study found women bear a disproportionate share of domestic labour even when working full-time — the key feminist reference on family inequality."
                },
                {
                  "q": "Which family function did Parsons describe as the \"warm bath\"?",
                  "options": [
                    "Primary socialisation",
                    "Economic support",
                    "Stabilisation of adult personalities",
                    "Social control"
                  ],
                  "correct": 2,
                  "explanation": "Parsons used the \"warm bath\" metaphor to describe how the family allows stressed adults to relax and feel emotionally restored — stabilising their personalities."
                },
                {
                  "q": "An adult child moves back home due to housing costs. What family type does this illustrate?",
                  "options": [
                    "Beanpole family",
                    "Boomerang family",
                    "Extended family",
                    "Child-centred family"
                  ],
                  "correct": 1,
                  "explanation": "The boomerang family describes adult children who return to the parental home — driven by housing costs, student debt and economic pressures."
                }
              ]
            },
            {
              "label": "🔴 Round 3 — Exam Ready",
              "questions": [
                {
                  "q": "A feminist argues the family is a site of gender oppression. Which BEST supports this?",
                  "options": [
                    "Children learn norms through family life",
                    "Women perform most domestic and emotional labour without recognition",
                    "Families provide economic support to all members",
                    "The nuclear family provides stability for society"
                  ],
                  "correct": 1,
                  "explanation": "Feminists argue the family oppresses women through the unequal division of domestic and emotional labour — unpaid, invisible and disproportionately performed by women."
                },
                {
                  "q": "Which statement reflects a FUNCTIONALIST view of the family?",
                  "options": [
                    "The family reinforces gender inequality through domestic labour",
                    "The family serves the interests of capitalism above all else",
                    "The family provides essential functions that benefit society as a whole",
                    "Family diversity shows the nuclear family is no longer relevant"
                  ],
                  "correct": 2,
                  "explanation": "Functionalists see the family as a positive institution performing essential social functions — socialisation, emotional support, stability — for the benefit of all."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "label": "Exam Master",
      "kicker": "Exam Skills",
      "heading": "Exam technique that actually scores marks.",
      "sub": "Different command words need different approaches. Know which is which.",
      "blocks": [
        {
          "type": "keypoint",
          "heading": "Command words",
          "points": [
            {
              "emoji": "1️⃣",
              "label": "IDENTIFY — 1 mark",
              "detail": "One word or short phrase. No explanation needed. \"Identify one family type.\" → Nuclear family."
            },
            {
              "emoji": "2️⃣",
              "label": "DESCRIBE — 2 marks",
              "detail": "Give a feature or example with enough detail. State the thing + a brief description of what it involves."
            },
            {
              "emoji": "3️⃣",
              "label": "EXPLAIN — 4 marks",
              "detail": "Say HOW or WHY. State a point, develop it with reasoning, and give an example or evidence. Avoid vague opinion."
            },
            {
              "emoji": "4️⃣",
              "label": "DISCUSS — 6 marks",
              "detail": "Multiple perspectives, named sociologists, evidence on both sides, and a conclusion. Both views must genuinely appear."
            }
          ]
        },
        {
          "type": "examtip",
          "tip": "The most common mistake: describing a perspective without naming it. \"Some people think families create stability\" scores 0. \"Functionalists, such as Parsons, argue that families…\" begins to score marks immediately."
        },
        {
          "type": "examtip",
          "tip": "For 6-mark \"describe one difference\" questions: state the difference clearly, then develop each side separately. Do NOT blend both views into one confused paragraph — examiners cannot award marks for arguments they can't identify."
        }
      ]
    },
    {
      "label": "Exam Practice",
      "kicker": "GCSE Questions",
      "heading": "GCSE exam practice.",
      "sub": "Real question styles. Real mark schemes. No revision notes.",
      "blocks": [
        {
          "type": "quiz",
          "question": "Identify one type of family. [1 mark]",
          "options": [
            {"text": "Nuclear family", "correct": true},
            {"text": "Peer group", "correct": false},
            {"text": "Trade union", "correct": false},
            {"text": "Secondary school", "correct": false}
          ],
          "correctMsg": "Nuclear family — a valid family type. Also accepted: lone-parent family, extended family, reconstituted family, beanpole family, boomerang family. One accurate term is all that is needed for 1 mark.",
          "wrongMsg": "A family type is a recognised household structure — nuclear, lone-parent, extended, reconstituted, beanpole. Peer groups, unions and schools are not family types."
        },
        {
          "type": "quiz",
          "question": "Describe two functions of the family. [2 marks]",
          "options": [
            {"text": "Primary socialisation — teaching children norms and values. Emotional support — providing a safe environment where adults and children feel supported and emotionally stable.", "correct": true},
            {"text": "Setting national education standards. Enforcing laws and punishing crime in local communities.", "correct": false},
            {"text": "Running the economy. Providing welfare payments to unemployed citizens.", "correct": false},
            {"text": "Primary socialisation — but only for boys. Economic control — managing household budgets exclusively.", "correct": false}
          ],
          "correctMsg": "Two clear functions: primary socialisation (teaching norms and values — Parsons) and emotional support (the 'warm bath' — also Parsons). Both are core Functionalist concepts.",
          "wrongMsg": "Family functions are what the family does for its members and society — socialisation, emotional support, economic support, social stability. National education and law enforcement are state functions."
        },
        {
          "type": "quiz",
          "question": "Explain one way families socialise children. [4 marks]",
          "options": [
            {"text": "Families socialise children through the teaching of norms and values — called primary socialisation. Parents model expected behaviour such as politeness, using positive sanctions (praise) and negative sanctions (withdrawal of privileges). This ensures children learn to participate in society before entering institutions like school.", "correct": true},
            {"text": "Families socialise children by taking them to school, where teachers explain the rules of society.", "correct": false},
            {"text": "Children mainly socialise themselves by watching television and using social media independently.", "correct": false},
            {"text": "Families socialise children by encouraging exam revision and academic achievement.", "correct": false}
          ],
          "correctMsg": "Full marks structure: state the process (primary socialisation), name the mechanism (norms and values, positive/negative sanctions), give a specific example, and link back to wider society. School = secondary socialisation, which comes after family.",
          "wrongMsg": "For a 4-mark explain question: name the sociological concept (primary socialisation), develop with reasoning (sanctions, norms and values), give a specific example, and link back to wider society."
        },
        {
          "type": "quiz",
          "question": "Describe one difference between Functionalist and Feminist views of the family. [6 marks]",
          "options": [
            {"text": "Functionalists (e.g. Parsons) argue the family benefits all members equally — providing socialisation, emotional support and stability. Feminists (e.g. Oakley) argue the family can be a site of gender inequality, with women performing the majority of domestic and emotional labour unpaid and unrecognised. The key difference: Functionalists focus on what the family does for society; Feminists focus on what the family does to women.", "correct": true},
            {"text": "Functionalists argue families create conflict and social division. Feminists argue families create stability and social harmony for everyone equally.", "correct": false},
            {"text": "Both perspectives agree the family reinforces gender inequality, but disagree about whether this is improving over time.", "correct": false},
            {"text": "Functionalists focus on economic class and capitalist exploitation. Feminists focus on social stability and shared norms and values.", "correct": false}
          ],
          "correctMsg": "Strong 6-mark answer: names sociologists on both sides (Parsons + Oakley), states what each argues, gives evidence, identifies the key difference clearly, and adds an evaluative comment.",
          "wrongMsg": "For a 6-mark difference question: name a sociologist on each side (Parsons, Oakley), state what each argues, and clearly identify the key difference. Functionalists say the family benefits everyone; Feminists say it benefits men at women's expense."
        }
      ]
    },
    {
      "label": "Final Boss",
      "kicker": "Boss Fight",
      "heading": "Final boss: what really makes a family?",
      "sub": "Four rounds. Everything from this module. No notes.",
      "blocks": [
        {
          "type": "boss",
          "tier": "🟢",
          "label": "Round 1 — Rapid fire",
          "question": "Answer each question in one precise sentence:\n(a) What is a beanpole family?\n(b) What is primary socialisation?\n(c) Name one function of the family according to Parsons.\n(d) What did Ann Oakley research?\n(e) What is a reconstituted family?\n(f) What is emotional labour?",
          "markPoints": "- (a) Beanpole family: many generations alive simultaneously but few siblings at each level — caused by longer lifespans and declining birth rates\n- (b) Primary socialisation: the process through which children learn society's norms, values and behaviour — mainly through the family, in early childhood\n- (c) Parsons function: primary socialisation of children / stabilisation of adult personalities ('warm bath')\n- (d) Oakley: domestic labour — showing women perform the majority of housework and childcare even when working full-time\n- (e) Reconstituted family: a blended or step-family formed when adults with children from previous relationships form a new family unit\n- (f) Emotional labour: the invisible work of managing family members' emotions, relationships and wellbeing — largely performed by women and rarely recognised\n- Award 1 mark per accurate definition (up to 6 marks)"
        },
        {
          "type": "boss",
          "tier": "🟡",
          "label": "Round 2 — Fix the error",
          "question": "Each statement contains an error. Identify and correct it:\n(a) \"A nuclear family includes grandparents living under the same roof.\"\n(b) \"Functionalists argue the family mainly benefits women by reducing their domestic burden.\"\n(c) \"A boomerang family has many generations alive at the same time but few siblings.\"",
          "markPoints": "- (a) Error: nuclear families do NOT include grandparents. Nuclear = two parents + dependent children only. Grandparents = extended family.\n- (b) Error: Functionalists argue the family benefits ALL members equally — not specifically women. It is Feminists who argue women bear a disproportionate domestic burden.\n- (c) Error: this describes a beanpole family, not a boomerang family. Boomerang = adult children who leave home and return, usually due to housing costs.\n- Award 2 marks per error correctly identified AND corrected (up to 6 marks)"
        },
        {
          "type": "boss",
          "tier": "🟡",
          "label": "Round 3 — Scenario analysis",
          "question": "Apply the correct sociological perspective and explain why.\n\n(a) Two parents both work full-time. One still does most of the cooking, childcare, school admin and emotional support at home. Which perspective analyses this — and why?\n\n(b) A sociologist observes that families teach children to accept authority, follow rules and work hard. A Functionalist and a Marxist are both interested but reach opposite conclusions. What would each say?",
          "markPoints": "- (a) Feminist perspective. Feminists argue the family can be a site of gender inequality — women performing a disproportionate share of domestic and emotional labour even in full-time employment. Ann Oakley's research supports this. The dual burden.\n- (b) Functionalist: teaching children to accept authority is a positive function — prepares them for an ordered society and ensures social stability. Marxist: teaching children to accept authority primarily benefits capitalism — creates a compliant workforce that accepts hierarchy without question.\n- Award marks for: named perspective, specific argument, named sociologist where relevant"
        },
        {
          "type": "boss",
          "tier": "🔴",
          "label": "Round 4 — Final showdown",
          "question": "What is the most important role of the family — emotional support, primary socialisation, social stability, or economic support? Choose one and defend your answer using evidence and sociological terminology.",
          "markPoints": "- No single correct answer. Strong responses: name a sociological perspective that supports the chosen function, reference a specific sociologist, explain HOW the function operates and acknowledge that other functions also have a claim.\n- Emotional support — Parsons' 'warm bath' theory, stabilises adult personalities; challenged by Feminists who argue the care burden is unequal\n- Primary socialisation — first and most fundamental; shapes children's norms and values for life; Functionalist emphasis\n- Social stability — families transmit shared values across generations, maintaining social order; Marxist critique: stability benefits ruling class\n- Economic support — families pool resources; Marxists note families also reproduce labour power for capitalism\n- Award marks for: clear choice, named theory, named sociologist, explanation of mechanism, acknowledgement of counter-argument"
        }
      ]
    }
  ],
  "series": "families",
  "recallTags": [],
  "examTags": [],
  "assetKeys": [],
  "stageNavigation": [
    { "id": "part-1", "title": "Family types", "description": "Defining family structures and primary socialisation.", "screenIndex": 0 },
    { "id": "part-2", "title": "Functionalist view", "description": "What Functionalists say the family does for society.", "screenIndex": 2 },
    { "id": "part-3", "title": "Critical perspectives", "description": "Feminist and New Right critiques of family life.", "screenIndex": 3 },
    { "id": "part-4", "title": "Changing families", "description": "Beanpole, boomerang and child-centred families.", "screenIndex": 5 },
    { "id": "part-5", "title": "Applying perspectives", "description": "Which perspective explains each scenario?", "screenIndex": 7 },
    { "id": "part-6", "title": "Exam technique", "description": "Command words, exam practice and final boss.", "screenIndex": 9 }
  ]
}
