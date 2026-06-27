export default {
  "id": "math1",
  "subject": "Maths",
  "number": 1,
  "title": "Place value and number sense",
  "subtitle": "Ordering numbers, decimals and the number line",
  "era": "Number survival kit",
  "icon": "🔢",
  "color": "#2DD4BF",
  "colorLight": "rgba(45,212,191,.12)",
  "headerImage": "/headers/maths-numbers.webp",

  "module": "number-survival-kit",
  "moduleNumber": 1,
  "chapterNumber": 1,
  "aqaLinks": ["N1", "N2"],
  "mapsToMathsGroups": [],
  "weaknessTags": ["maths:place-value", "maths:ordering-numbers"],
  "prerequisiteChapters": [],

  "hook": {
    "scenario": {
      "location": "AQA Foundation Paper 1, Question 1",
      "hint": "A student writes: 0.35 > 0.9 because 35 is bigger than 9."
    },
    "statement": "0.35 is greater than 0.9",
    "isTrue": false,
    "accentWords": ["0.35", "0.9"],
    "explanation": "0.9 = 0.90. The tenths digit is what matters first — 9 tenths is bigger than 3 tenths. Comparing the digits 35 and 9 as whole numbers ignores place value entirely.",
    "wrongFeedback": "Check the tenths column first. 0.9 has 9 tenths; 0.35 has only 3 tenths.",
    "correctFeedback": "Right. 0.9 = 0.90. Tenths come before hundredths in size — 9 tenths beats 3 tenths.",
    "loadingText": "Let's look at why decimal place value catches people out…",
    "bigQuestion": "How do we compare any two numbers without being tricked by digit size?",
    "revealHeader": "Compare column by column — not digit by digit.",
    "revealItems": [
      {
        "emoji": "📊",
        "label": "Tenths come first",
        "detail": "0.9 has 9 in the tenths place. 0.35 has 3 in the tenths place. 9 tenths > 3 tenths — done. The 5 hundredths in 0.35 is irrelevant once the tenths column is decided."
      },
      {
        "emoji": "🌡️",
        "label": "Negatives flip the rule",
        "detail": "−8 is less than −3 because it is further left on the number line. The digit 8 > 3, but the minus sign means further from zero = smaller."
      },
      {
        "emoji": "⚠️",
        "label": "The exam trap",
        "detail": "Treating decimal digits as a whole number (15 > 2 so 0.15 > 0.2) is the most common ordering error in AQA Foundation mark schemes. It costs 2 marks."
      }
    ],
    "punchline": "Place value columns — not raw digit size — decide which number is bigger."
  },

  "intro": {
    "learningGoals": [
      "Read place value in integers and decimals precisely",
      "Order any mix of positive and negative integers, decimals and simple fractions",
      "Use the symbols =, ≠, <, >, ≤, ≥ correctly in exam answers",
      "Locate and compare values on a number line"
    ]
  },

  "outcomes": {
    "intro": "Place value is the foundation of all AQA maths. Ordering questions appear in Paper 1 every year — usually in the first few questions.",
    "bullets": [
      "Read and write any integer or decimal using correct place value language",
      "Order a mixed set of positives, negatives, decimals and fractions from smallest to largest",
      "Use comparison symbols correctly in written exam answers",
      "Avoid the most common trap: comparing digits as whole numbers without using columns"
    ]
  },

  "recall": {
    "questions": [
      {
        "type": "truefalse",
        "question": "0.9 is greater than 0.35.",
        "isTrue": true
      },
      {
        "type": "choice",
        "question": "Which symbol correctly compares −3 and −8?",
        "options": [
          "−3 < −8",
          "−3 > −8",
          "−3 = −8"
        ],
        "correct": 1
      },
      {
        "type": "connection",
        "question": "The most reliable way to order negative numbers is to...",
        "options": [
          {
            "text": "Compare their digits, ignoring the minus sign",
            "icon": "warning"
          },
          {
            "text": "Use a number line — further right means bigger",
            "icon": "lightbulb"
          },
          {
            "text": "The bigger digit always means bigger value",
            "icon": "arrow"
          }
        ],
        "correct": 1
      }
    ]
  },

  "screens": [
    {
      "tag": "maths:place-value",
      "label": "Place value trap",
      "kicker": "Section 1 — Why it matters",
      "heading": "Which is bigger: 0.35 or 0.9?",
      "sub": "This type of question appears in AQA Foundation Paper 1 every year.",
      "blocks": [
        {
          "type": "read",
          "label": "The exam stake",
          "text": "Ordering numbers is worth <strong>2 marks in every AQA Foundation paper</strong>. The trap is always decimal place value or negative numbers — and it always catches the same mistake."
        },
        {
          "type": "quiz",
          "question": "Which is bigger: 0.35 or 0.9?",
          "options": [
            { "text": "0.35, because 35 is bigger than 9", "correct": false },
            { "text": "0.9, because it has more in the tenths place", "correct": true },
            { "text": "They are equal", "correct": false }
          ],
          "explanation": "0.9 = 9 tenths. 0.35 = 3 tenths and 5 hundredths. Tenths come before hundredths — compare column by column, not digit by digit."
        },
        {
          "type": "examtip",
          "tip": "<strong>Series pillar: Number sense.</strong> Every ordering question in GCSE Maths is solved by going column by column — integer part first, then tenths, then hundredths. Never compare decimal digits as if they were whole numbers."
        }
      ]
    },

    {
      "tag": null,
      "label": "Prior knowledge",
      "kicker": "Section 2 — Check your foundations",
      "heading": "What do you already know?",
      "sub": "These questions check the building blocks for this chapter.",
      "blocks": [
        {
          "type": "read",
          "label": "Prerequisite skills",
          "text": "This chapter requires: <strong>reading whole numbers</strong>, <strong>knowing that the decimal point separates whole parts from parts of one</strong>, and <strong>basic number line reading</strong>."
        },
        {
          "type": "quiz",
          "question": "In the number 4,372 — what digit is in the hundreds place?",
          "options": [
            { "text": "4", "correct": false },
            { "text": "3", "correct": true },
            { "text": "7", "correct": false }
          ],
          "explanation": "4,372: thousands = 4, hundreds = 3, tens = 7, ones = 2. Hundreds is the third column from the right."
        },
        {
          "type": "quiz",
          "question": "Which number is furthest right on a number line?",
          "options": [
            { "text": "−10", "correct": false },
            { "text": "0", "correct": false },
            { "text": "5", "correct": true }
          ],
          "explanation": "Right means bigger. 5 > 0 > −10. Positive numbers are always to the right of zero; negative numbers are always to the left."
        }
      ]
    },

    {
      "tag": "maths:place-value",
      "label": "Integer place value",
      "kicker": "Section 3 — Core idea",
      "heading": "Integers: every column has a name.",
      "sub": "Place value tells you what each digit is worth — not just what it looks like.",
      "blocks": [
        {
          "type": "read",
          "label": "The integer columns",
          "text": "In <strong>6,835</strong>: the 6 means 6 <em>thousands</em>, the 8 means 8 <em>hundreds</em>, the 3 means 3 <em>tens</em>, the 5 means 5 <em>ones</em>.<br/>So 6,835 = 6000 + 800 + 30 + 5."
        },
        {
          "type": "quiz",
          "question": "What is the value of the digit 7 in 47,391?",
          "options": [
            { "text": "7", "correct": false },
            { "text": "700", "correct": false },
            { "text": "7,000", "correct": true }
          ],
          "explanation": "In 47,391: the 7 is in the thousands column. Its value is 7 × 1,000 = 7,000."
        },
        {
          "type": "quiz",
          "question": "Write 50,000 + 400 + 6 as a single number.",
          "options": [
            { "text": "5,406", "correct": false },
            { "text": "50,406", "correct": true },
            { "text": "504,006", "correct": false }
          ],
          "explanation": "50,000 + 400 + 6 = 50,406. There are no thousands or tens, so zeros hold those columns: 5-0-4-0-6."
        }
      ]
    },

    {
      "tag": "maths:place-value",
      "label": "Decimal place value",
      "kicker": "Section 3 — Core idea",
      "heading": "Decimals: the columns keep going after the point.",
      "sub": "After the decimal point: tenths, hundredths, thousandths.",
      "blocks": [
        {
          "type": "read",
          "label": "The decimal columns",
          "text": "In <strong>3.47</strong>: the 4 is in the <em>tenths</em> column (= 4/10 = 0.4), the 7 is in the <em>hundredths</em> column (= 7/100 = 0.07).<br/>So 3.47 = 3 + 0.4 + 0.07."
        },
        {
          "type": "quiz",
          "question": "What does the 5 represent in 0.058?",
          "options": [
            { "text": "5 tenths", "correct": false },
            { "text": "5 hundredths", "correct": true },
            { "text": "5 thousandths", "correct": false }
          ],
          "explanation": "0.058: tenths = 0, hundredths = 5, thousandths = 8. The 5 is in the hundredths column (second place after the decimal)."
        },
        {
          "type": "fillblanks",
          "sentences": [
            {
              "before": "In 2.364, the digit 3 is in the",
              "after": "column.",
              "answer": "tenths",
              "hints": [
                "Count one place after the decimal point.",
                "The first column after the decimal is tenths."
              ]
            },
            {
              "before": "0.07 means 7",
              "after": ".",
              "answer": "hundredths",
              "hints": [
                "The second column after the decimal point.",
                "0.07 = 7/100"
              ]
            }
          ],
          "correctMsg": "Good — the column name matters more than the digit size.",
          "wrongMsg": "Count the columns after the decimal point: tenths (1st), hundredths (2nd), thousandths (3rd)."
        }
      ]
    },

    {
      "tag": null,
      "label": "Comparison symbols",
      "kicker": "Section 3 — Core idea",
      "heading": "Using =, ≠, <, >, ≤, ≥",
      "sub": "These six symbols are tested directly on AQA Foundation papers.",
      "blocks": [
        {
          "type": "read",
          "label": "The six symbols",
          "text": "<strong>=</strong> equals &nbsp;·&nbsp; <strong>≠</strong> not equal to &nbsp;·&nbsp; <strong>&lt;</strong> less than &nbsp;·&nbsp; <strong>&gt;</strong> greater than &nbsp;·&nbsp; <strong>≤</strong> less than or equal to &nbsp;·&nbsp; <strong>≥</strong> greater than or equal to.<br/><br/>Memory trick: the <em>small end</em> of &lt; and &gt; always points to the <em>smaller</em> number."
        },
        {
          "type": "quiz",
          "question": "Which symbol correctly fills the gap?  0.6 __ 0.59",
          "options": [
            { "text": "<", "correct": false },
            { "text": ">", "correct": true },
            { "text": "=", "correct": false }
          ],
          "explanation": "0.6 = 0.60. Compare tenths: 6 > 5. So 0.6 > 0.59. The small end of > points right — toward 0.59, the smaller value."
        },
        {
          "type": "quiz",
          "question": "Which statement is true?",
          "options": [
            { "text": "−5 > −2", "correct": false },
            { "text": "−5 < −2", "correct": true },
            { "text": "−5 ≥ −2", "correct": false }
          ],
          "explanation": "On a number line, −5 is to the left of −2. Left means smaller. So −5 < −2. The small end of < points left — toward −5."
        }
      ]
    },

    {
      "tag": "maths:ordering-numbers",
      "label": "Number line ordering",
      "kicker": "Section 3 — Core idea",
      "heading": "The number line is your ordering tool.",
      "sub": "Left = smaller. Right = bigger. Every number has exactly one position.",
      "blocks": [
        {
          "type": "read",
          "label": "How to use the number line to order",
          "text": "To order a set of numbers: <strong>plot each value on a number line</strong>, then <strong>read left to right</strong> for ascending order (smallest first). Negatives are always left of zero. Decimals sit between integers."
        },
        {
          "type": "quiz",
          "question": "Order from smallest to largest: 3, −1, 0, −4, 2",
          "options": [
            { "text": "−4, −1, 0, 2, 3", "correct": true },
            { "text": "−1, −4, 0, 2, 3", "correct": false },
            { "text": "0, −1, −4, 2, 3", "correct": false }
          ],
          "explanation": "On the number line: −4 is furthest left, then −1, then 0, then 2, then 3. Reading left to right gives ascending order."
        },
        {
          "type": "quiz",
          "question": "Which list is in descending order (largest first)?",
          "options": [
            { "text": "−2, 0, 1.5, 3", "correct": false },
            { "text": "3, 1.5, 0, −2", "correct": true },
            { "text": "1.5, 3, −2, 0", "correct": false }
          ],
          "explanation": "Descending = largest first. Reading the number line right to left: 3, 1.5, 0, −2."
        }
      ]
    },

    {
      "tag": "maths:ordering-numbers",
      "label": "Worked example",
      "kicker": "Section 4 — Examiner method",
      "heading": "Full worked example.",
      "sub": "Show every step — method marks are always available even if the final answer is wrong.",
      "blocks": [
        {
          "type": "read",
          "label": "The question",
          "text": "<strong>Write these numbers in order, starting with the smallest:</strong><br/>−4.5, 3.2, −0.8, 0, 2.7<br/><em>(2 marks)</em>"
        },
        {
          "type": "read",
          "label": "Step 1 — Sort the negatives",
          "text": "Negatives first: −4.5 and −0.8. Among negatives, <em>further from zero = smaller</em>. −4.5 is further from zero than −0.8, so −4.5 &lt; −0.8."
        },
        {
          "type": "read",
          "label": "Step 2 — Order the non-negatives",
          "text": "Non-negatives: 0, 2.7, 3.2. Reading the number line left to right: 0 &lt; 2.7 &lt; 3.2."
        },
        {
          "type": "read",
          "label": "Step 3 — Combine and write",
          "text": "Negatives before zero before positives: <strong>−4.5, −0.8, 0, 2.7, 3.2</strong><br/><br/><em>Mark scheme: 1M for negatives correctly ordered relative to each other; 1A for all five values in correct order.</em>"
        },
        {
          "type": "quiz",
          "question": "Apply the same method: order from smallest — 1.5, −3, −0.5, 0, 4",
          "options": [
            { "text": "−3, −0.5, 0, 1.5, 4", "correct": true },
            { "text": "−0.5, −3, 0, 1.5, 4", "correct": false },
            { "text": "0, −0.5, −3, 1.5, 4", "correct": false }
          ],
          "explanation": "−3 is further from zero than −0.5, so −3 < −0.5. Then 0, 1.5, 4. Full order: −3, −0.5, 0, 1.5, 4."
        }
      ]
    },

    {
      "tag": null,
      "label": "Guided practice",
      "kicker": "Section 5 — Practice with support",
      "heading": "Complete the comparisons.",
      "sub": "Fill each gap with the correct symbol from: =, ≠, <, >, ≤, ≥",
      "blocks": [
        {
          "type": "read",
          "label": "Method reminder",
          "text": "Compare <strong>column by column</strong>: integer part first, then tenths, then hundredths. Stop at the first column where they differ."
        },
        {
          "type": "fillblanks",
          "sentences": [
            {
              "before": "−3",
              "after": "−8",
              "answer": ">",
              "hints": [
                "On the number line, which is further right?",
                "−3 is closer to zero than −8, so it is bigger."
              ]
            },
            {
              "before": "0.4",
              "after": "0.40",
              "answer": "=",
              "hints": [
                "0.4 = 0.40 — trailing zeros after a decimal don't change the value.",
                "Both have 4 tenths and 0 hundredths."
              ]
            },
            {
              "before": "2.08",
              "after": "2.8",
              "answer": "<",
              "hints": [
                "Integer parts are equal. Look at the tenths column.",
                "2.08 has 0 in the tenths place; 2.8 has 8."
              ]
            }
          ],
          "correctMsg": "Good — column-by-column comparison works every time.",
          "wrongMsg": "Go to the first column where they differ. That column decides the comparison."
        }
      ]
    },

    {
      "tag": "maths:place-value",
      "label": "Spot the error",
      "kicker": "Section 6 — Common mistake",
      "heading": "Find and fix the error.",
      "sub": "This specific mistake appears in AQA mark scheme notes as the most common wrong answer.",
      "blocks": [
        {
          "type": "read",
          "label": "The student's working",
          "text": "A student orders 0.2, 0.15, 0.08 and writes:<br/><strong>0.15 &gt; 0.2</strong> (because 15 &gt; 2)<br/>Order: 0.2, 0.08, 0.15"
        },
        {
          "type": "misconceptionCheck",
          "statements": [
            {
              "statement": "The student is correct: 0.15 > 0.2 because 15 is bigger than 2.",
              "answer": false,
              "reveal": "FALSE. 0.15 has 1 in the tenths column. 0.2 has 2 in the tenths column. The tenths column decides: 2 > 1, so 0.2 > 0.15. Comparing 15 and 2 as whole numbers ignores place value — the most common error on ordering questions.",
              "examTrap": "AQA mark schemes flag this as the expected wrong answer. Markers see it in every paper."
            }
          ]
        },
        {
          "type": "quiz",
          "question": "Correct order of 0.2, 0.15, 0.08 from smallest to largest:",
          "options": [
            { "text": "0.08, 0.15, 0.2", "correct": true },
            { "text": "0.2, 0.15, 0.08", "correct": false },
            { "text": "0.08, 0.2, 0.15", "correct": false }
          ],
          "explanation": "Tenths column: 0.08 has 0 tenths, 0.15 has 1 tenth, 0.2 has 2 tenths. Order: 0.08 < 0.15 < 0.2."
        }
      ]
    },

    {
      "tag": null,
      "label": "Maths in the wild",
      "kicker": "Section 7 — Real-world application",
      "heading": "Ordering in real life.",
      "sub": "AQA context questions use temperatures, bank balances and measurements — all solved with the same method.",
      "blocks": [
        {
          "type": "read",
          "label": "Why this matters outside the exam",
          "text": "Weather forecasts compare temperatures (including negatives). Bank statements compare balances. Running race results order times. All of these use place value and number line ordering."
        },
        {
          "type": "scenario",
          "situation": "A weather app shows temperatures: Oslo −8°C, Edinburgh −1°C, Paris 3°C, Cairo 18°C, Reykjavik −11°C.",
          "question": "Which city is coldest?",
          "options": [
            { "text": "Oslo (−8°C)", "correct": false },
            { "text": "Reykjavik (−11°C)", "correct": true },
            { "text": "Edinburgh (−1°C)", "correct": false }
          ],
          "correctMsg": "−11 is the most negative — furthest left on the number line. Reykjavik is coldest.",
          "wrongMsg": "Among negatives, the one furthest from zero is the smallest (coldest). −11 is further from zero than −8 or −1."
        },
        {
          "type": "scenario",
          "situation": "Bank balances: Alex £−45, Bilal £120, Carla £−3, Dana £0.",
          "question": "Who is worst off financially?",
          "options": [
            { "text": "Alex (£−45)", "correct": true },
            { "text": "Carla (£−3)", "correct": false },
            { "text": "Dana (£0)", "correct": false }
          ],
          "correctMsg": "−45 < −3 < 0 < 120. Alex has the most negative balance — furthest in debt.",
          "wrongMsg": "Both Alex and Carla are in debt (negative balance). −45 is more negative than −3."
        }
      ]
    },

    {
      "tag": null,
      "label": "Retrieval",
      "kicker": "Section 8 — Retrieval practice",
      "heading": "Retrieval practice.",
      "sub": "Quick questions to lock in today's learning.",
      "blocks": [
        {
          "type": "read",
          "label": "Why retrieval matters",
          "text": "Retrieving knowledge immediately after learning <strong>doubles long-term retention</strong> compared to re-reading. Answer these without looking back."
        },
        {
          "type": "quiz",
          "question": "What is the value of the 4 in 3.406?",
          "options": [
            { "text": "4 ones", "correct": false },
            { "text": "4 tenths", "correct": true },
            { "text": "4 hundredths", "correct": false }
          ],
          "explanation": "3.406: integer = 3, tenths = 4, hundredths = 0, thousandths = 6. The 4 is in the tenths column."
        },
        {
          "type": "quiz",
          "question": "Order from smallest to largest: −0.5, 0.25, −1, 0",
          "options": [
            { "text": "−1, −0.5, 0, 0.25", "correct": true },
            { "text": "−0.5, −1, 0, 0.25", "correct": false },
            { "text": "0, −0.5, −1, 0.25", "correct": false }
          ],
          "explanation": "−1 is furthest left (furthest from zero), then −0.5, then 0, then 0.25. Ascending order: −1, −0.5, 0, 0.25."
        },
        {
          "type": "quiz",
          "question": "Which symbol makes this true?  2.08 __ 2.8",
          "options": [
            { "text": ">", "correct": false },
            { "text": "=", "correct": false },
            { "text": "<", "correct": true }
          ],
          "explanation": "2.08 vs 2.8: integer parts equal. Tenths column: 0 < 8. So 2.08 < 2.8."
        }
      ]
    },

    {
      "tag": "maths:ordering-numbers",
      "label": "Exam practice",
      "kicker": "Section 9 — AQA exam style",
      "heading": "Exam-style questions.",
      "sub": "AQA wording, method marks shown. Answer before reading the mark scheme.",
      "blocks": [
        {
          "type": "read",
          "label": "AQA exam pattern",
          "text": "Ordering questions on AQA Foundation Paper 1 (non-calculator) award: <strong>1 method mark</strong> for showing a correct partial order, <strong>1 accuracy mark</strong> for a fully correct answer. Always show your working."
        },
        {
          "type": "boss",
          "tier": "🟢",
          "label": "Q1 — Ordering integers (1 mark)",
          "question": "Write these integers in order, starting with the smallest:\n−3, 7, −10, 0, 4",
          "markPoints": [
            "Answer: −10, −3, 0, 4, 7",
            "Award 1 mark for all five values in correct ascending order",
            "Common error: reversing the negatives — writing −3, −10, 0, 4, 7"
          ]
        },
        {
          "type": "boss",
          "tier": "🟡",
          "label": "Q2 — Ordering decimals (2 marks)",
          "question": "Write these numbers in order, starting with the smallest:\n0.6, 0.06, 0.66, 0.606",
          "markPoints": [
            "Answer: 0.06, 0.6, 0.606, 0.66",
            "1 method mark: correct partial order showing place-value comparison (at least 3 in correct relative position)",
            "1 accuracy mark: all four in correct order",
            "Common error: treating 0.606 as bigger than 0.66 because 606 > 66"
          ]
        },
        {
          "type": "boss",
          "tier": "🔴",
          "label": "Q3 — Reasoning about negatives (2 marks, AO2)",
          "question": "Is this statement true or false? Show your reasoning.\n−4.5 > −4.05",
          "markPoints": [
            "Answer: FALSE — −4.5 < −4.05",
            "1 method mark: correct comparison using place value (tenths column: 5 > 0, so −4.5 is more negative / further from zero)",
            "1 accuracy mark: correct conclusion (FALSE) with valid reasoning stated",
            "Reasoning must name the column that differs and explain the direction of the comparison"
          ]
        }
      ]
    },

    {
      "tag": null,
      "label": "Chapter complete",
      "kicker": "Section 10 — Confidence check",
      "heading": "Chapter 1 done.",
      "sub": "Key rules. Top traps. What comes next.",
      "blocks": [
        {
          "type": "read",
          "label": "Key rules for place value and ordering",
          "text": "1. Compare column by column — integer part first, then tenths, then hundredths.<br/>2. Negatives: further from zero = smaller. −8 &lt; −3.<br/>3. 0.4 = 0.40 — trailing zeros after a decimal don't change the value.<br/>4. Ascending order = left to right on the number line. Descending = right to left."
        },
        {
          "type": "read",
          "label": "Top 3 errors from AQA mark schemes",
          "text": "1. <strong>Digit trap:</strong> treating 0.15 &gt; 0.2 because 15 &gt; 2 — ignores place value.<br/>2. <strong>Negative reversal:</strong> thinking −8 &gt; −3 because the digit 8 &gt; 3 — the minus flips it.<br/>3. <strong>Direction error:</strong> answering in descending order when the question asks ascending — re-read every ordering question."
        },
        {
          "type": "examtip",
          "tip": "<strong>Exam habit:</strong> Always re-read 'starting with the smallest' vs 'starting with the largest'. Giving the right values in the wrong direction scores zero — even though your ordering is correct."
        },
        {
          "type": "keypoint",
          "text": "<strong>Chapter 1 complete.</strong> You can now: read place value in integers and decimals · order any mix of positive, negative and decimal values · use comparison symbols correctly · avoid the most common ordering trap.<br/><br/>Next: Chapter 2 — The four operations. Use place value to add, subtract, multiply and divide with precision."
        }
      ]
    }
  ],

  "series": "foundations",
  "recallTags": ["maths:place-value", "maths:ordering-numbers"],
  "examTags": ["N1", "N2"],
  "assetKeys": [],
  "stageNavigation": [
    { "id": "s1", "title": "Place value trap", "description": "Why ordering catches people out", "screenIndex": 0 },
    { "id": "s2", "title": "Prior knowledge", "description": "Columns and the number line", "screenIndex": 1 },
    { "id": "s3", "title": "Integer place value", "description": "Thousands, hundreds, tens, ones", "screenIndex": 2 },
    { "id": "s4", "title": "Decimal place value", "description": "Tenths, hundredths, thousandths", "screenIndex": 3 },
    { "id": "s5", "title": "Comparison symbols", "description": "=, ≠, <, >, ≤, ≥", "screenIndex": 4 },
    { "id": "s6", "title": "Number line ordering", "description": "Left = smaller, right = bigger", "screenIndex": 5 },
    { "id": "s7", "title": "Worked example", "description": "Full ordering method shown step by step", "screenIndex": 6 },
    { "id": "s8", "title": "Guided practice", "description": "Comparison symbol practice", "screenIndex": 7 },
    { "id": "s9", "title": "Spot the error", "description": "Fix the decimal ordering mistake", "screenIndex": 8 },
    { "id": "s10", "title": "Real world", "description": "Temperatures and bank balances", "screenIndex": 9 },
    { "id": "s11", "title": "Retrieval", "description": "Lock it in with quick questions", "screenIndex": 10 },
    { "id": "s12", "title": "Exam practice", "description": "AQA-style ordering questions", "screenIndex": 11 },
    { "id": "s13", "title": "Chapter complete", "description": "Key rules and what comes next", "screenIndex": 12 }
  ]
}
