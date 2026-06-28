export default {
  "id": "math8",
  "subject": "Maths",
  "number": 8,
  "title": "Fractions that actually make sense",
  "subtitle": "Equivalent fractions, simplifying, ordering and fractions of amounts",
  "era": "Number survival kit",
  "icon": "½",
  "color": "#2DD4BF",
  "colorLight": "rgba(45,212,191,.12)",
  "headerImage": "/headers/maths-numbers.webp",

  "module": "number-survival-kit",
  "moduleNumber": 1,
  "chapterNumber": 8,
  "aqaLinks": ["N8", "N10", "R8"],
  "mapsToMathsGroups": ["maths_fractions"],
  "weaknessTags": ["maths:equivalent-fractions", "maths:simplifying-fractions", "maths:fractions-of-amounts", "maths:mixed-numbers"],
  "prerequisiteChapters": ["math1", "math2", "math6"],

  "hook": {
    "scenario": {
      "location": "AQA Foundation Paper 1 (non-calculator)",
      "hint": "A question says 'Find 1/4 of Andrew's share of £56.' A student writes £1.40 as their answer."
    },
    "statement": "1/4 of £56 = £1.40",
    "isTrue": false,
    "accentWords": ["1/4", "£1.40"],
    "explanation": "1/4 means one part out of four equal parts. £56 ÷ 4 = £14. The error is reading the fraction 1/4 as the decimal 1.4 and multiplying: 1.4 × £1 = £1.40.",
    "wrongFeedback": "Think about what the fraction means. 1/4 is one out of four parts, not a decimal. Divide £56 into four equal parts.",
    "correctFeedback": "Right. 1/4 means divide by 4: £56 ÷ 4 = £14. Reading 1/4 as 1.4 is one of the most common fraction errors on Paper 1.",
    "loadingText": "Let's make fractions actually make sense…",
    "bigQuestion": "Why does every fraction question connect back to one skill — finding what's common?",
    "revealHeader": "Every fraction skill uses one idea: equal parts.",
    "revealItems": [
      {
        "emoji": "🍕",
        "label": "Simplifying",
        "detail": "18/24 looks complex, but HCF(18,24) = 6. Divide both by 6: 3/4. Same value, simpler form."
      },
      {
        "emoji": "📏",
        "label": "Ordering",
        "detail": "You cannot compare 3/4 and 5/6 directly. Convert to a common denominator (12): 9/12 vs 10/12. Now it is obvious."
      },
      {
        "emoji": "⚖️",
        "label": "Fraction of amount",
        "detail": "3/5 of 40: divide by the denominator first (40 ÷ 5 = 8), then multiply by the numerator (8 × 3 = 24). Order always matters."
      }
    ],
    "punchline": "Simplifying is the most common dropped mark on fraction questions. AQA always requires the final answer in its simplest form."
  },

  "intro": {
    "learningGoals": [
      "Generate and identify equivalent fractions",
      "Simplify any fraction to its lowest terms using HCF",
      "Convert between improper fractions and mixed numbers in both directions",
      "Order fractions by converting to a common denominator",
      "Find a fraction of any amount using the divide-then-multiply method",
      "Express one share of a ratio as a fraction of the total"
    ]
  },

  "outcomes": {
    "intro": "Fractions appear on every AQA paper. Simplifying, ordering, and calculating with fractions all build from two ideas: equal parts and common factors. This chapter connects those ideas into a single toolkit.",
    "bullets": [
      "Simplify fractions by dividing numerator and denominator by their HCF",
      "Convert improper fractions to mixed numbers and back",
      "Order fractions using a common denominator",
      "Find a fraction of an amount: ÷ denominator × numerator",
      "Express a ratio share as a fraction of the total",
      "Always check the final answer is in its simplest form"
    ]
  },

  "recall": {
    "questions": [
      {
        "type": "truefalse",
        "question": "1/4 of £56 = £1.40.",
        "isTrue": false
      },
      {
        "type": "choice",
        "question": "What is the HCF of 18 and 24?",
        "options": ["3", "6", "12"],
        "correct": 1
      },
      {
        "type": "connection",
        "question": "To find 3/5 of 40, you should...",
        "options": [
          { "text": "Divide by 5 then multiply by 3", "icon": "lightbulb" },
          { "text": "Multiply by 5 then divide by 3", "icon": "warning" },
          { "text": "Multiply by 3/5 then add 40", "icon": "arrow" }
        ],
        "correct": 0
      }
    ]
  },

  "screens": [
    {
      "tag": "maths:equivalent-fractions",
      "label": "Fraction trap",
      "kicker": "Section 1 — Why it matters",
      "heading": "Reading 1/4 as 1.4 is the most common fraction error.",
      "sub": "A fraction and a decimal are not the same thing.",
      "blocks": [
        {
          "type": "read",
          "label": "The exam stake",
          "text": "Fraction of amount questions appear on every paper. The most common error is misreading the fraction as a decimal. <strong>1/4 does not mean 1.4.</strong> It means one part out of four equal parts — divide, then multiply."
        },
        {
          "type": "misconceptionCheck",
          "statements": [
            {
              "statement": "1/4 of £56 = £1.40, because 1/4 is the same as 0.25 multiplied by something.",
              "answer": false,
              "reveal": "FALSE. 1/4 of £56 = £56 ÷ 4 = £14. Reading 1/4 as the decimal 1.4 gives the wrong method entirely. Always read fractions as division: numerator ÷ denominator.",
              "examTrap": "If the question says 'find 1/4 of…', divide the amount by 4. Do not convert to 1.4."
            }
          ]
        },
        {
          "type": "quiz",
          "question": "Find 1/4 of £56.",
          "options": [
            { "text": "£1.40", "correct": false },
            { "text": "£14", "correct": true },
            { "text": "£224", "correct": false }
          ],
          "explanation": "1/4 means divide by 4: £56 ÷ 4 = £14. Not £1.40 (reading 1/4 as 1.4)."
        }
      ]
    },

    {
      "tag": null,
      "label": "Prior knowledge",
      "kicker": "Section 2 — Check your foundations",
      "heading": "Fractions rely on division and common factors.",
      "sub": "Chapter 6 skills feed directly into simplifying and ordering fractions.",
      "blocks": [
        {
          "type": "read",
          "label": "What you already know",
          "text": "Chapter 6 gave you HCF and LCM. Chapter 2 gave you division fluency. Both feed directly into this chapter: HCF is used to simplify fractions to lowest terms, and LCM is used to order fractions by finding a common denominator."
        },
        {
          "type": "quiz",
          "question": "Find the HCF of 18 and 24.",
          "options": [
            { "text": "3", "correct": false },
            { "text": "6", "correct": true },
            { "text": "12", "correct": false }
          ],
          "explanation": "Factors of 18: 1, 2, 3, 6, 9, 18. Factors of 24: 1, 2, 3, 4, 6, 8, 12, 24. HCF = 6."
        },
        {
          "type": "quiz",
          "question": "Find the LCM of 4 and 6.",
          "options": [
            { "text": "2", "correct": false },
            { "text": "12", "correct": true },
            { "text": "24", "correct": false }
          ],
          "explanation": "Multiples of 4: 4, 8, 12, 16… Multiples of 6: 6, 12, 18… First common multiple = 12."
        }
      ]
    },

    {
      "tag": "maths:equivalent-fractions",
      "label": "Equivalent fractions",
      "kicker": "Section 3 — Core idea",
      "heading": "Multiply or divide both top and bottom by the same number.",
      "sub": "You are multiplying by 1 in disguise — the value never changes.",
      "blocks": [
        {
          "type": "read",
          "label": "How equivalent fractions work",
          "text": "Multiply numerator and denominator by the same number:<br/><strong>1/4 = 3/12</strong> (multiply both by 3).<br/><br/>Divide numerator and denominator by the same number:<br/><strong>20/30 = 2/3</strong> (divide both by 10).<br/><br/>Both operations are equivalent to multiplying by 1. The value of the fraction does not change."
        },
        {
          "type": "quiz",
          "question": "Which fraction is equivalent to 3/5?",
          "options": [
            { "text": "6/8", "correct": false },
            { "text": "9/15", "correct": true },
            { "text": "6/25", "correct": false }
          ],
          "explanation": "Multiply 3/5 by 3/3: (3×3)/(5×3) = 9/15."
        },
        {
          "type": "quiz",
          "question": "Fill the gap: 20/30 = ?/3.",
          "options": [
            { "text": "2", "correct": true },
            { "text": "6", "correct": false },
            { "text": "10", "correct": false }
          ],
          "explanation": "20/30 ÷ 10/10 = 2/3. Denominator goes from 30 to 3 by dividing by 10. Numerator: 20 ÷ 10 = 2."
        }
      ]
    },

    {
      "tag": "maths:simplifying-fractions",
      "label": "Simplifying to lowest terms",
      "kicker": "Section 3 — Core idea",
      "heading": "Find HCF — then divide both numerator and denominator.",
      "sub": "Stopping too early costs the A mark. Check HCF(numerator, denominator) = 1.",
      "blocks": [
        {
          "type": "read",
          "label": "The method",
          "text": "To simplify 18/24:<br/>Step 1: HCF(18, 24) = 6<br/>Step 2: 18 ÷ 6 = 3; 24 ÷ 6 = 4<br/>Simplified: <strong>3/4</strong><br/><br/>Check: HCF(3, 4) = 1 ✓ — already in lowest terms.<br/><br/>Common error: dividing by 2 twice (→ 9/12, then → 3/4) — this works but takes longer. Using HCF in one step is faster."
        },
        {
          "type": "quiz",
          "question": "Simplify 18/24 to its lowest terms.",
          "options": [
            { "text": "9/12", "correct": false },
            { "text": "6/8", "correct": false },
            { "text": "3/4", "correct": true }
          ],
          "explanation": "HCF(18,24) = 6. 18 ÷ 6 = 3; 24 ÷ 6 = 4. Answer: 3/4. 9/12 and 6/8 are not fully simplified."
        },
        {
          "type": "quiz",
          "question": "Simplify 24/36.",
          "options": [
            { "text": "8/12", "correct": false },
            { "text": "2/3", "correct": true },
            { "text": "4/6", "correct": false }
          ],
          "explanation": "HCF(24,36) = 12. 24 ÷ 12 = 2; 36 ÷ 12 = 3. Answer: 2/3."
        }
      ]
    },

    {
      "tag": "maths:mixed-numbers",
      "label": "Improper fractions and mixed numbers",
      "kicker": "Section 3 — Core idea",
      "heading": "Convert between improper fractions and mixed numbers.",
      "sub": "Both conversions use the same division fact.",
      "blocks": [
        {
          "type": "read",
          "label": "Both conversions",
          "text": "<strong>Improper → mixed number:</strong> divide numerator by denominator.<br/>17/5: 17 ÷ 5 = 3 remainder 2 → <strong>3 and 2/5</strong><br/><br/><strong>Mixed number → improper:</strong> (whole × denominator) + numerator; same denominator.<br/>2 and 3/4: (2 × 4) + 3 = 11 → <strong>11/4</strong>"
        },
        {
          "type": "quiz",
          "question": "Write 23/5 as a mixed number.",
          "options": [
            { "text": "4 and 2/5", "correct": false },
            { "text": "4 and 3/5", "correct": true },
            { "text": "5 and 3/5", "correct": false }
          ],
          "explanation": "23 ÷ 5 = 4 remainder 3. So 23/5 = 4 and 3/5."
        },
        {
          "type": "quiz",
          "question": "Write 2 and 3/4 as an improper fraction.",
          "options": [
            { "text": "5/4", "correct": false },
            { "text": "9/4", "correct": false },
            { "text": "11/4", "correct": true }
          ],
          "explanation": "(2 × 4) + 3 = 8 + 3 = 11. Answer: 11/4."
        }
      ]
    },

    {
      "tag": "maths:fractions-of-amounts",
      "label": "Fractions of amounts",
      "kicker": "Section 3 — Core idea",
      "heading": "Divide by denominator first. Multiply by numerator second.",
      "sub": "Step 1 finds one part. Step 2 finds the number of parts you need.",
      "blocks": [
        {
          "type": "read",
          "label": "The method",
          "text": "To find 3/5 of 40:<br/>Step 1: 40 ÷ 5 = 8 (one part, or 1/5)<br/>Step 2: 8 × 3 = 24 (three parts, or 3/5)<br/><br/>The method works for any fraction of any amount. Always divide by the denominator first."
        },
        {
          "type": "quiz",
          "question": "Find 3/8 of 56.",
          "options": [
            { "text": "14", "correct": false },
            { "text": "21", "correct": true },
            { "text": "24", "correct": false }
          ],
          "explanation": "56 ÷ 8 = 7 (one part). 7 × 3 = 21 (three parts). M1 for dividing by 8; A1 for 21."
        },
        {
          "type": "quiz",
          "question": "Find 2/7 of 63.",
          "options": [
            { "text": "9", "correct": false },
            { "text": "18", "correct": true },
            { "text": "21", "correct": false }
          ],
          "explanation": "63 ÷ 7 = 9 (one part). 9 × 2 = 18."
        }
      ]
    },

    {
      "tag": "maths:simplifying-fractions",
      "label": "Ordering fractions",
      "kicker": "Section 3 — Core idea",
      "heading": "Order fractions using a common denominator.",
      "sub": "Convert all fractions to the LCM denominator, then compare numerators.",
      "blocks": [
        {
          "type": "read",
          "label": "The method",
          "text": "Order 3/4, 2/3, 5/6 from smallest to largest.<br/>LCM(4, 3, 6) = 12<br/>3/4 = 9/12; 2/3 = 8/12; 5/6 = 10/12<br/>Order of numerators: 8, 9, 10 → <strong>2/3 &lt; 3/4 &lt; 5/6</strong>"
        },
        {
          "type": "quiz",
          "question": "Order 2/3, 5/9 and 7/12 from smallest to largest.",
          "options": [
            { "text": "5/9, 7/12, 2/3", "correct": true },
            { "text": "7/12, 2/3, 5/9", "correct": false },
            { "text": "2/3, 5/9, 7/12", "correct": false }
          ],
          "explanation": "LCM(3,9,12) = 36. 2/3=24/36; 5/9=20/36; 7/12=21/36. Order: 20/36 < 21/36 < 24/36 → 5/9 < 7/12 < 2/3."
        },
        {
          "type": "quiz",
          "question": "Which is larger: 3/4 or 5/6?",
          "options": [
            { "text": "3/4, because 3 < 5", "correct": false },
            { "text": "5/6", "correct": true },
            { "text": "They are equal", "correct": false }
          ],
          "explanation": "Common denominator 12: 3/4 = 9/12; 5/6 = 10/12. 10/12 > 9/12, so 5/6 > 3/4."
        }
      ]
    },

    {
      "tag": "maths:fractions-of-amounts",
      "label": "Worked example",
      "kicker": "Section 4 — Examiner method",
      "heading": "Ratio fractions and fractions of amounts.",
      "sub": "Two common question types — same chapter, same skills.",
      "blocks": [
        {
          "type": "read",
          "label": "Question 1 — ratio fraction",
          "text": "<strong>Andrew and Bruce share money in the ratio 5:6. What fraction of the total does Bruce receive?</strong><br/><br/>Total parts = 5 + 6 = 11<br/>Bruce's share = 6 parts out of 11<br/>Answer: <strong>6/11</strong><br/><br/>HCF(6,11) = 1, so 6/11 is already in simplest form. No further simplification."
        },
        {
          "type": "read",
          "label": "Question 2 — fraction of amount",
          "text": "<strong>Find 3/8 of 56.</strong><br/><br/>56 ÷ 8 = 7 (one part)<br/>7 × 3 = <strong>21</strong><br/><br/>Mark scheme: M1 for 56 ÷ 8 seen; A1 for 21. Both steps must be visible for full marks."
        },
        {
          "type": "quiz",
          "question": "Carol and Dan share money in the ratio 3:8. What fraction of the total does Carol receive?",
          "options": [
            { "text": "3/8", "correct": false },
            { "text": "3/11", "correct": true },
            { "text": "8/11", "correct": false }
          ],
          "explanation": "Total parts = 3 + 8 = 11. Carol has 3 parts out of 11. Answer: 3/11."
        }
      ]
    },

    {
      "tag": null,
      "label": "Guided practice",
      "kicker": "Section 5 — Practice with support",
      "heading": "Fill in the missing values.",
      "sub": "Simplifying, converting and calculating with fractions.",
      "blocks": [
        {
          "type": "fillblanks",
          "sentences": [
            {
              "before": "HCF(18, 24) = 6, so 18/24 simplifies to",
              "after": ".",
              "answer": "3/4",
              "hints": ["Divide both 18 and 24 by 6.", "18 ÷ 6 = 3 and 24 ÷ 6 = 4."]
            },
            {
              "before": "2 and 3/4 as an improper fraction is",
              "after": ".",
              "answer": "11/4",
              "hints": ["(whole × denominator) + numerator.", "(2 × 4) + 3 = 11."]
            },
            {
              "before": "23/5 as a mixed number is 4 and",
              "after": "/5.",
              "answer": "3",
              "hints": ["23 ÷ 5 = 4 remainder ?", "23 ÷ 5 = 4 remainder 3."]
            },
            {
              "before": "3/5 of 40 =",
              "after": ".",
              "answer": "24",
              "hints": ["First find 1/5 of 40.", "40 ÷ 5 = 8; 8 × 3 = ?"]
            }
          ],
          "correctMsg": "Good — you are applying HCF, conversion and fraction of amounts correctly.",
          "wrongMsg": "For simplifying: use HCF, divide both. For converting: (whole × denominator) + numerator. For fraction of amount: ÷ denominator, × numerator."
        }
      ]
    },

    {
      "tag": "maths:simplifying-fractions",
      "label": "Spot the error",
      "kicker": "Section 6 — Common mistake",
      "heading": "Fix the simplification error.",
      "sub": "The same operation must be applied to both numerator and denominator.",
      "blocks": [
        {
          "type": "read",
          "label": "The student's working",
          "text": "A student simplifies 15/20:<br/>15 ÷ 5 = 3<br/>Answer written: <strong>3/20</strong>"
        },
        {
          "type": "misconceptionCheck",
          "statements": [
            {
              "statement": "3/20 is the correct simplification of 15/20.",
              "answer": false,
              "reveal": "FALSE. The student divided the numerator by 5 but forgot to divide the denominator too. Both must be divided by the same number: 15 ÷ 5 = 3 and 20 ÷ 5 = 4. Correct answer: 3/4.",
              "examTrap": "Simplifying a fraction is multiplying by 5/5 = 1. If you only change one part, you change the value."
            }
          ]
        },
        {
          "type": "quiz",
          "question": "Simplify 15/20 correctly.",
          "options": [
            { "text": "3/20", "correct": false },
            { "text": "15/4", "correct": false },
            { "text": "3/4", "correct": true }
          ],
          "explanation": "HCF(15, 20) = 5. 15 ÷ 5 = 3; 20 ÷ 5 = 4. Answer: 3/4."
        }
      ]
    },

    {
      "tag": null,
      "label": "Maths in the wild",
      "kicker": "Section 7 — Real-world application",
      "heading": "Fractions appear in recipes, surveys and splitting bills.",
      "sub": "The divide-then-multiply method works in every real-world context.",
      "blocks": [
        {
          "type": "scenario",
          "situation": "A recipe uses 3/4 of a cup of flour for 6 biscuits. Tom wants to make 10 biscuits.",
          "question": "What fraction of a cup of flour does Tom need? (Give your answer as a fraction in its simplest form.)",
          "options": [
            { "text": "10/8 cups = 5/4 cups = 1 and 1/4 cups", "correct": true },
            { "text": "3/4 cups", "correct": false },
            { "text": "1 and 3/4 cups", "correct": false }
          ],
          "correctMsg": "For 1 biscuit: 3/4 ÷ 6 = 3/24 = 1/8 cup. For 10 biscuits: 1/8 × 10 = 10/8 = 5/4 = 1 and 1/4 cups. Simplify: HCF(10,8) = 2 → 5/4.",
          "wrongMsg": "Find the flour for 1 biscuit first (divide 3/4 by 6), then multiply by 10. Remember to simplify the final answer."
        },
        {
          "type": "scenario",
          "situation": "24 out of 32 students in a class say they prefer science to maths.",
          "question": "What fraction of the class prefers science? Give your answer in its simplest form.",
          "options": [
            { "text": "24/32", "correct": false },
            { "text": "3/4", "correct": true },
            { "text": "6/8", "correct": false }
          ],
          "correctMsg": "24/32 — HCF(24,32) = 8. 24 ÷ 8 = 3; 32 ÷ 8 = 4. Simplest form: 3/4. Note: 6/8 is not fully simplified.",
          "wrongMsg": "Divide numerator and denominator by their HCF. HCF(24,32) = 8. 6/8 is not simplest form — check HCF(6,8) = 2."
        }
      ]
    },

    {
      "tag": null,
      "label": "Retrieval",
      "kicker": "Section 8 — Retrieval practice",
      "heading": "Retrieval practice.",
      "sub": "Mixed questions from Chapters 5–7.",
      "blocks": [
        {
          "type": "quiz",
          "question": "Write 3.7 × 10⁻⁵ as an ordinary number.",
          "options": [
            { "text": "370,000", "correct": false },
            { "text": "0.000037", "correct": true },
            { "text": "0.00037", "correct": false }
          ],
          "explanation": "From Chapter 7: negative power means small number. Move decimal 5 places left: 3.7 → 0.000037."
        },
        {
          "type": "quiz",
          "question": "Find the LCM of 8 and 12.",
          "options": [
            { "text": "4", "correct": false },
            { "text": "24", "correct": true },
            { "text": "96", "correct": false }
          ],
          "explanation": "From Chapter 6: multiples of 8: 8, 16, 24… Multiples of 12: 12, 24… LCM = 24."
        },
        {
          "type": "quiz",
          "question": "Round 2.475 to 2 decimal places.",
          "options": [
            { "text": "2.47", "correct": false },
            { "text": "2.48", "correct": true },
            { "text": "2.5", "correct": false }
          ],
          "explanation": "From Chapter 5: look at the third decimal digit (5). Round up: 2.47 → 2.48."
        }
      ]
    },

    {
      "tag": "maths:fractions-of-amounts",
      "label": "Exam practice",
      "kicker": "Section 9 — AQA exam style",
      "heading": "Exam-style questions.",
      "sub": "AQA-style wording, method marks shown. Answer before reading the mark scheme.",
      "blocks": [
        {
          "type": "boss",
          "tier": "🟢",
          "label": "Q1 — Simplify (1 mark)",
          "question": "Simplify 24/36. Give your answer as a fraction in its simplest form.",
          "markPoints": [
            "HCF(24, 36) = 12",
            "24 ÷ 12 = 2; 36 ÷ 12 = 3",
            "Answer: 2/3",
            "Common error: 4/6 or 8/12 — not fully simplified"
          ]
        },
        {
          "type": "boss",
          "tier": "🟡",
          "label": "Q2 — Order fractions (2 marks)",
          "question": "Write these fractions in order of size, smallest first: 2/3, 5/9, 7/12.",
          "markPoints": [
            "Common denominator: LCM(3, 9, 12) = 36",
            "2/3 = 24/36; 5/9 = 20/36; 7/12 = 21/36",
            "Order: 5/9, 7/12, 2/3",
            "M1 for a correct common denominator method; A1 for correct order"
          ]
        },
        {
          "type": "boss",
          "tier": "🔴",
          "label": "Q3 — Ratio fraction (2 marks)",
          "question": "Alice and Ben share prize money in the ratio 4:7. What fraction of the total prize money does Ben receive?",
          "markPoints": [
            "Total parts = 4 + 7 = 11",
            "Ben's fraction = 7/11",
            "HCF(7,11) = 1 so already in simplest form",
            "Common error: writing 7/4 (ratio share ÷ other share) instead of 7/11"
          ]
        }
      ]
    },

    {
      "tag": null,
      "label": "Chapter complete",
      "kicker": "Section 10 — Confidence check",
      "heading": "Chapter 8 done.",
      "sub": "Key rules. Top traps. What comes next.",
      "blocks": [
        {
          "type": "read",
          "label": "Key rules for fractions",
          "text": "1. <strong>Equivalent fractions:</strong> multiply or divide both numerator and denominator by the same number.<br/>2. <strong>Simplifying:</strong> divide both by HCF; check HCF(numerator, denominator) = 1.<br/>3. <strong>Improper → mixed:</strong> divide; quotient = whole; remainder = new numerator.<br/>4. <strong>Mixed → improper:</strong> (whole × denominator) + numerator; same denominator.<br/>5. <strong>Ordering:</strong> convert all to LCM denominator; compare numerators.<br/>6. <strong>Fraction of amount:</strong> ÷ denominator (one part) × numerator.<br/>7. <strong>Ratio fraction:</strong> one share ÷ total parts."
        },
        {
          "type": "read",
          "label": "Top 3 errors",
          "text": "1. <strong>Not simplifying the final answer:</strong> 6/8 instead of 3/4 always loses the A mark — AQA always asks for simplest form.<br/>2. <strong>Simplifying only the numerator:</strong> 15/20 → 3/20 (forgot to divide denominator too).<br/>3. <strong>Reading fractions as decimals:</strong> 1/4 of £56 → £1.40 (treating 1/4 as 1.4)."
        },
        {
          "type": "examtip",
          "tip": "<strong>Exam habit:</strong> After every fraction answer, ask: can I still simplify? Find HCF(numerator, denominator). If it is not 1, divide both by it. AQA always requires simplest form for the A mark."
        },
        {
          "type": "keypoint",
          "text": "<strong>Chapter 8 complete.</strong> You can now: generate equivalent fractions · simplify using HCF · convert between improper and mixed forms · order fractions by common denominator · find fractions of amounts · express ratio shares as fractions.<br/><br/>Next: Chapter 9 — Fraction calculations (adding, subtracting, multiplying and dividing fractions)."
        }
      ]
    }
  ],

  "series": "foundations",
  "recallTags": ["maths:equivalent-fractions", "maths:simplifying-fractions", "maths:fractions-of-amounts", "maths:mixed-numbers"],
  "examTags": ["N8", "N10", "R8"],
  "assetKeys": [],
  "stageNavigation": [
    { "id": "s1",  "title": "Fraction trap",            "description": "Reading 1/4 as 1.4",                 "screenIndex": 0  },
    { "id": "s2",  "title": "Prior knowledge",          "description": "HCF, LCM and division",               "screenIndex": 1  },
    { "id": "s3",  "title": "Equivalent fractions",     "description": "Multiply or divide both parts",        "screenIndex": 2  },
    { "id": "s4",  "title": "Simplifying",              "description": "Divide both by HCF",                  "screenIndex": 3  },
    { "id": "s5",  "title": "Improper and mixed",       "description": "Convert between forms",               "screenIndex": 4  },
    { "id": "s6",  "title": "Fractions of amounts",     "description": "Divide then multiply",                "screenIndex": 5  },
    { "id": "s7",  "title": "Ordering fractions",       "description": "Common denominator method",           "screenIndex": 6  },
    { "id": "s8",  "title": "Worked example",           "description": "Ratio fraction + fraction of amount", "screenIndex": 7  },
    { "id": "s9",  "title": "Guided practice",          "description": "Simplifying and converting blanks",   "screenIndex": 8  },
    { "id": "s10", "title": "Spot the error",           "description": "Fix numerator-only simplification",   "screenIndex": 9  },
    { "id": "s11", "title": "Real world",               "description": "Recipes and surveys",                 "screenIndex": 10 },
    { "id": "s12", "title": "Retrieval",                "description": "Mixed questions from Ch5–Ch7",        "screenIndex": 11 },
    { "id": "s13", "title": "Exam practice",            "description": "AQA-style fraction questions",        "screenIndex": 12 },
    { "id": "s14", "title": "Chapter complete",         "description": "Key rules and next step",             "screenIndex": 13 }
  ]
}
