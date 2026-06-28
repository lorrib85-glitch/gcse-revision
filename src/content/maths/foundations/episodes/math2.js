export default {
  "id": "math2",
  "subject": "Maths",
  "number": 2,
  "title": "The four operations",
  "subtitle": "Add, subtract, multiply and divide with confidence",
  "era": "Number survival kit",
  "icon": "➗",
  "color": "#2DD4BF",
  "colorLight": "rgba(45,212,191,.12)",
  "headerImage": "/headers/maths-numbers.webp",

  "module": "number-survival-kit",
  "moduleNumber": 1,
  "chapterNumber": 2,
  "aqaLinks": ["N2", "N3"],
  "mapsToMathsGroups": ["maths_bidmas"],
  "weaknessTags": ["maths:four-operations", "maths:written-methods"],
  "prerequisiteChapters": ["math1"],

  "hook": {
    "scenario": {
      "location": "AQA Foundation Paper 1 (non-calculator)",
      "hint": "A student calculates 0.3 × 0.3 and writes 0.9."
    },
    "statement": "0.3 × 0.3 = 0.9",
    "isTrue": false,
    "accentWords": ["0.3 × 0.3", "0.9"],
    "explanation": "3 × 3 = 9. But 0.3 has 1 decimal place and 0.3 has 1 decimal place — the product needs 2 decimal places in total. So 0.3 × 0.3 = 0.09, not 0.9.",
    "wrongFeedback": "Count the decimal places: 0.3 (one d.p.) × 0.3 (one d.p.) = 2 d.p. in the answer. So the answer needs two decimal places.",
    "correctFeedback": "Right. 3 × 3 = 9, then two decimal places gives 0.09.",
    "loadingText": "Let's see why decimal multiplication needs a counting rule…",
    "bigQuestion": "How do written methods protect you when mental arithmetic isn't enough?",
    "revealHeader": "Count decimal places — don't guess where the point goes.",
    "revealItems": [
      {
        "emoji": "📐",
        "label": "Count, then place",
        "detail": "Multiply as if the numbers are integers (3 × 3 = 9). Then count total decimal places in both numbers (1 + 1 = 2). Place the point 2 from the right: 0.09."
      },
      {
        "emoji": "🔁",
        "label": "Inverse check saves marks",
        "detail": "If 0.3 × 0.3 = 0.09, then 0.09 ÷ 0.3 should give 0.3. Inverse operations are a fast way to check whether an answer is sensible."
      },
      {
        "emoji": "⚠️",
        "label": "The common trap",
        "detail": "Students who don't count decimal places can write 0.9 — ten times too large. The method protects you from that slip."
      }
    ],
    "punchline": "Written methods with clear steps — not rushed mental shortcuts — help you keep marks when calculations get messy."
  },

  "intro": {
    "learningGoals": [
      "Use column methods for addition, subtraction, multiplication and division",
      "Keep decimal points aligned when adding and subtracting decimals",
      "Count decimal places when multiplying decimals",
      "Choose between mental, written and calculator methods",
      "Use inverse operations to check any calculation"
    ]
  },

  "outcomes": {
    "intro": "The four operations appear regularly across AQA Foundation papers. Written methods let you earn method marks even when arithmetic goes wrong.",
    "bullets": [
      "Apply column addition and subtraction to integers and decimals without errors",
      "Use short multiplication, 2-digit multiplication and bus-stop division with confidence",
      "Count decimal places in multiplication to place the point correctly",
      "Choose a sensible method: mental, written or calculator",
      "Use inverse operations as a checking strategy under exam conditions"
    ]
  },

  "recall": {
    "questions": [
      {
        "type": "truefalse",
        "question": "0.3 × 0.3 = 0.09",
        "isTrue": true
      },
      {
        "type": "choice",
        "question": "When adding decimals in a column method, what must you align?",
        "options": [
          "The rightmost digits",
          "The decimal points",
          "The largest numbers"
        ],
        "correct": 1
      },
      {
        "type": "connection",
        "question": "The inverse of multiplication is...",
        "options": [
          { "text": "Addition — undo by adding back", "icon": "warning" },
          { "text": "Division — undo by dividing", "icon": "lightbulb" },
          { "text": "Subtraction — undo by subtracting", "icon": "arrow" }
        ],
        "correct": 1
      }
    ]
  },

  "screens": [
    {
      "tag": "maths:four-operations",
      "label": "Decimal multiplication trap",
      "kicker": "Section 1 — Why it matters",
      "heading": "0.3 × 0.3 is not 0.9.",
      "sub": "Decimal multiplication catches students who skip the written method.",
      "blocks": [
        {
          "type": "read",
          "label": "The exam stake",
          "text": "Four-operation skills appear regularly across AQA Foundation papers. Paper 1 is non-calculator, so clear written methods matter."
        },
        {
          "type": "quiz",
          "question": "Calculate: 0.4 × 0.2",
          "options": [
            { "text": "0.8 — multiply 4 × 2 = 8, keep one decimal place", "correct": false },
            { "text": "0.08 — multiply 4 × 2 = 8, count two decimal places total", "correct": true },
            { "text": "8 — just multiply the digits", "correct": false }
          ],
          "explanation": "4 × 2 = 8. 0.4 has 1 d.p. and 0.2 has 1 d.p. Total: 2 d.p. Place the point 2 from the right: 0.08."
        },
        {
          "type": "examtip",
          "tip": "<strong>Series pillar: Number sense.</strong> Paper 1 tests written methods, not just mental shortcuts. Show clear steps so your method can still earn credit if one arithmetic digit slips."
        }
      ]
    },

    {
      "tag": null,
      "label": "Prior knowledge",
      "kicker": "Section 2 — Check your foundations",
      "heading": "Building on Chapter 1.",
      "sub": "Chapter 2 uses place value and column names from Chapter 1.",
      "blocks": [
        {
          "type": "read",
          "label": "Prerequisite: place value columns",
          "text": "Prerequisite from Chapter 1: <strong>thousands, hundreds, tens, ones</strong> for integers; <strong>tenths, hundredths</strong> for decimals. Column methods only work when you line up the right columns."
        },
        {
          "type": "quiz",
          "question": "In 4.56 + 2.3, which digits go in the tenths column?",
          "options": [
            { "text": "5 and 3", "correct": true },
            { "text": "6 and 3", "correct": false },
            { "text": "4 and 2", "correct": false }
          ],
          "explanation": "4.56: tenths = 5, hundredths = 6. 2.3: tenths = 3. Align the decimal points and the tenths column contains 5 and 3."
        },
        {
          "type": "quiz",
          "question": "Which of these is the largest value?",
          "options": [
            { "text": "0.35", "correct": false },
            { "text": "3.5", "correct": true },
            { "text": "0.035", "correct": false }
          ],
          "explanation": "3.5 has a 3 in the ones column. 0.35 has a 3 in the tenths column. 0.035 has a 3 in the hundredths column. Ones > tenths > hundredths."
        }
      ]
    },

    {
      "tag": "maths:written-methods",
      "label": "Addition and subtraction",
      "kicker": "Section 3 — Core idea",
      "heading": "Column methods for addition and subtraction.",
      "sub": "Right to left. Carry into the next column. Borrow from the next column.",
      "blocks": [
        {
          "type": "read",
          "label": "Column addition — the method",
          "text": "Line up by place value. Add each column <strong>right to left</strong>. If a column total is ≥10, write the ones digit and <strong>carry</strong> the tens digit into the next column.<br/><br/>Example: 347 + 285<br/>&nbsp;&nbsp; 3 4 7<br/>+ 2 8 5<br/>──────<br/>&nbsp;&nbsp; 6 3 2<br/>(7+5=12, write 2 carry 1; 4+8+1=13, write 3 carry 1; 3+2+1=6)"
        },
        {
          "type": "quiz",
          "question": "Calculate: 465 + 378",
          "options": [
            { "text": "733", "correct": false },
            { "text": "843", "correct": true },
            { "text": "753", "correct": false }
          ],
          "explanation": "5+8=13 (write 3, carry 1). 6+7+1=14 (write 4, carry 1). 4+3+1=8. Answer: 843."
        },
        {
          "type": "read",
          "label": "Column subtraction — the method",
          "text": "Line up by place value. Subtract each column <strong>right to left</strong>. If a column digit is too small, <strong>borrow</strong> 1 from the next column (makes that column 10 bigger; reduces the next column by 1).<br/><br/>Example: 503 − 268<br/>&nbsp;&nbsp; 5 0 3<br/>− 2 6 8<br/>──────<br/>&nbsp;&nbsp; 2 3 5<br/>(borrow to get 13−8=5; borrow again to get 9−6=3 after adjustment; 4−2=2)"
        },
        {
          "type": "quiz",
          "question": "Calculate: 502 − 147",
          "options": [
            { "text": "355", "correct": true },
            { "text": "365", "correct": false },
            { "text": "345", "correct": false }
          ],
          "explanation": "Borrow to get 12−7=5. Borrow again: 9−4=5 (after reducing hundreds). 4−1=3. Check: 355+147=502 ✓. Answer: 355."
        }
      ]
    },

    {
      "tag": "maths:written-methods",
      "label": "Multiplication and division",
      "kicker": "Section 3 — Core idea",
      "heading": "Multiplication and division methods.",
      "sub": "Short methods first, then a proper 2-digit by 2-digit method.",
      "blocks": [
        {
          "type": "read",
          "label": "Short multiplication",
          "text": "Multiply each digit of the larger number by the single digit. Work <strong>right to left</strong>. Carry any tens into the next column.<br/><br/>Example: 346 × 7<br/>&nbsp;&nbsp; 3 4 6<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;× 7<br/>──────<br/>&nbsp;&nbsp; 2 4 2 2<br/>(6×7=42, write 2 carry 4; 4×7=28+4=32, write 2 carry 3; 3×7=21+3=24)"
        },
        {
          "type": "quiz",
          "question": "Calculate: 238 × 4",
          "options": [
            { "text": "852", "correct": false },
            { "text": "952", "correct": true },
            { "text": "832", "correct": false }
          ],
          "explanation": "8×4=32 (write 2 carry 3). 3×4=12+3=15 (write 5 carry 1). 2×4=8+1=9. Answer: 952."
        },
        {
          "type": "read",
          "label": "Two-digit by two-digit multiplication",
          "text": "For 47 × 38, split the second number into 30 and 8.<br/><br/>47 × 8 = 376<br/>47 × 30 = 1410<br/>Add the partial products: 376 + 1410 = <strong>1786</strong>.<br/><br/>The key idea is the <strong>tens row</strong>: multiplying by 30 is ten times bigger than multiplying by 3, so the place value shifts left."
        },
        {
          "type": "quiz",
          "question": "Use partial products: 26 × 34 = ?",
          "options": [
            { "text": "884", "correct": true },
            { "text": "780", "correct": false },
            { "text": "624", "correct": false }
          ],
          "explanation": "26 × 4 = 104. 26 × 30 = 780. Add: 104 + 780 = 884."
        },
        {
          "type": "read",
          "label": "Bus-stop division (short division)",
          "text": "Write the divisor outside, dividend inside the 'bus stop'. Divide into each digit <strong>left to right</strong>. Carry remainders into the next digit.<br/><br/>Example: 952 ÷ 4<br/>4 ) 9 5 2<br/>&nbsp;&nbsp;&nbsp; 2 3 8<br/>(9÷4=2 rem 1; 15÷4=3 rem 3; 32÷4=8)"
        },
        {
          "type": "quiz",
          "question": "Calculate: 756 ÷ 3",
          "options": [
            { "text": "252", "correct": true },
            { "text": "242", "correct": false },
            { "text": "262", "correct": false }
          ],
          "explanation": "7÷3=2 rem 1. 15÷3=5 rem 0. 6÷3=2. Answer: 252. Check: 252×3=756 ✓."
        },
        {
          "type": "quiz",
          "question": "Calculate: 86 ÷ 4",
          "options": [
            { "text": "21 remainder 2", "correct": false },
            { "text": "21.5", "correct": true },
            { "text": "22.5", "correct": false }
          ],
          "explanation": "4 goes into 8 twice. 4 goes into 6 once remainder 2. In a measurement or money-style context, continue the division: 20 tenths ÷ 4 = 5 tenths, so 86 ÷ 4 = 21.5."
        }
      ]
    },

    {
      "tag": "maths:four-operations",
      "label": "Decimal operations",
      "kicker": "Section 3 — Core idea",
      "heading": "The decimal point rules.",
      "sub": "Alignment for adding and subtracting. Place-counting for multiplying. Integer conversion for some divisions.",
      "blocks": [
        {
          "type": "read",
          "label": "Adding and subtracting decimals",
          "text": "Always align the <strong>decimal points</strong> — not the last digits.<br/><br/>Example: 3.6 + 1.45<br/>&nbsp;&nbsp; 3 . 6 0<br/>+ 1 . 4 5<br/>──────────<br/>&nbsp;&nbsp; 5 . 0 5<br/>Write 3.60 (pad with a zero) so both numbers have the same number of decimal places."
        },
        {
          "type": "quiz",
          "question": "Calculate: 5.7 + 2.84",
          "options": [
            { "text": "7.91", "correct": false },
            { "text": "8.54", "correct": true },
            { "text": "8.44", "correct": false }
          ],
          "explanation": "Write 5.70 to align: 5.70 + 2.84. Hundredths: 0+4=4. Tenths: 7+8=15 (write 5 carry 1). Ones: 5+2+1=8. Answer: 8.54."
        },
        {
          "type": "quiz",
          "question": "Calculate: 7.2 − 3.85",
          "options": [
            { "text": "4.65", "correct": false },
            { "text": "3.35", "correct": true },
            { "text": "3.45", "correct": false }
          ],
          "explanation": "Write 7.2 as 7.20, then subtract 3.85. 7.20 − 3.85 = 3.35. The zero placeholder matters."
        },
        {
          "type": "read",
          "label": "Multiplying decimals",
          "text": "Multiply as integers, then count total decimal places.<br/><br/>Example: 2.3 × 1.4<br/>Step 1: 23 × 14 = 322<br/>Step 2: 2.3 has 1 d.p., 1.4 has 1 d.p. Total: 2 d.p.<br/>Step 3: Place point 2 from right: <strong>3.22</strong>"
        },
        {
          "type": "quiz",
          "question": "Calculate: 1.5 × 0.6",
          "options": [
            { "text": "9.0", "correct": false },
            { "text": "0.9", "correct": true },
            { "text": "0.09", "correct": false }
          ],
          "explanation": "15 × 6 = 90. 1.5 has 1 d.p., 0.6 has 1 d.p. Total: 2 d.p. Place 2 from right in 90: 0.90 = 0.9."
        },
        {
          "type": "quiz",
          "question": "Calculate: 8.4 ÷ 0.4",
          "options": [
            { "text": "2.1", "correct": false },
            { "text": "21", "correct": true },
            { "text": "210", "correct": false }
          ],
          "explanation": "Multiply both numbers by 10 to make the divisor an integer: 8.4 ÷ 0.4 = 84 ÷ 4 = 21."
        }
      ]
    },

    {
      "tag": "maths:four-operations",
      "label": "Choosing a method",
      "kicker": "Section 3 — Core idea",
      "heading": "Mental, written or calculator?",
      "sub": "Good mathematicians choose the fastest reliable method, not always the longest one.",
      "blocks": [
        {
          "type": "read",
          "label": "Pick the method before calculating",
          "text": "Use <strong>mental methods</strong> for simple facts and friendly numbers. Use <strong>written methods</strong> for multi-step or non-calculator work. Use a <strong>calculator</strong> on calculator papers, but estimate first so you can spot nonsense answers."
        },
        {
          "type": "quiz",
          "question": "Which method is most sensible for 12 × 5?",
          "options": [
            { "text": "Mental — 10×5 plus 2×5", "correct": true },
            { "text": "Long column multiplication", "correct": false },
            { "text": "Calculator only", "correct": false }
          ],
          "explanation": "12 × 5 is friendly: 10×5 = 50 and 2×5 = 10, total 60. Mental is fastest and reliable."
        },
        {
          "type": "quiz",
          "question": "Which method is most sensible for 347 × 8 on Paper 1?",
          "options": [
            { "text": "Written short multiplication", "correct": true },
            { "text": "Calculator", "correct": false },
            { "text": "Guess from the size of the numbers", "correct": false }
          ],
          "explanation": "Paper 1 is non-calculator. 347 × 8 needs a written method so you can carry accurately and show working."
        },
        {
          "type": "quiz",
          "question": "On a calculator paper, what should you do before typing £12.47 × 18?",
          "options": [
            { "text": "Estimate roughly, then calculate", "correct": true },
            { "text": "Type it and trust any answer", "correct": false },
            { "text": "Avoid the calculator", "correct": false }
          ],
          "explanation": "Estimate: £12.47 is about £12.50, and 12.5 × 18 is about £225. So a calculator answer near £224.46 is sensible."
        }
      ]
    },

    {
      "tag": null,
      "label": "Inverse operations",
      "kicker": "Section 3 — Core idea",
      "heading": "Use the inverse to check.",
      "sub": "Addition undoes subtraction. Division undoes multiplication. A quick check catches slips.",
      "blocks": [
        {
          "type": "read",
          "label": "The four inverse pairs",
          "text": "<strong>Addition ↔ Subtraction:</strong> if 347 + 285 = 632, then 632 − 285 = 347.<br/><strong>Multiplication ↔ Division:</strong> if 238 × 4 = 952, then 952 ÷ 4 = 238.<br/><br/>Inverses let you check calculations quickly."
        },
        {
          "type": "quiz",
          "question": "A student calculates 15 × 32 = 570. They check using the inverse. What should they calculate?",
          "options": [
            { "text": "570 − 32", "correct": false },
            { "text": "570 ÷ 15", "correct": true },
            { "text": "570 ÷ 32 or 570 ÷ 15 — either is fine", "correct": false }
          ],
          "explanation": "The inverse of ×15 is ÷15. So check: 570 ÷ 15 = 38 ≠ 32. The original calculation is wrong. (Correct answer: 15 × 32 = 480.)"
        },
        {
          "type": "quiz",
          "question": "The inverse check gives: 480 ÷ 15 = 32. What does this confirm?",
          "options": [
            { "text": "15 × 32 = 480 is correct", "correct": true },
            { "text": "Nothing — inverse checks only work for addition", "correct": false },
            { "text": "480 is divisible by 15, but that doesn't prove the original", "correct": false }
          ],
          "explanation": "480 ÷ 15 = 32 confirms that 15 × 32 = 480. The inverse check matches, so the calculation is correct."
        }
      ]
    },

    {
      "tag": "maths:four-operations",
      "label": "Worked example",
      "kicker": "Section 4 — Examiner method",
      "heading": "Multi-step finance problem.",
      "sub": "AQA finance questions use all four operations. Show every step.",
      "blocks": [
        {
          "type": "read",
          "label": "The question",
          "text": "<strong>Sam earns £9.75 per hour and works 16 hours. She pays £28.40 in tax. How much does she take home?</strong><br/><em>(3 marks)</em>"
        },
        {
          "type": "read",
          "label": "Step 1 — Multiply (gross pay)",
          "text": "Gross pay = £9.75 × 16<br/>975 × 16 = 975 × 10 + 975 × 6 = 9750 + 5850 = 15600<br/>2 d.p. in 9.75, 0 d.p. in 16 → 2 d.p. in answer: <strong>£156.00</strong><br/><em>(1M for correct multiplication method)</em>"
        },
        {
          "type": "read",
          "label": "Step 2 — Subtract (take-home pay)",
          "text": "Take-home = £156.00 − £28.40<br/>&nbsp;&nbsp; 1 5 6 . 0 0<br/>− &nbsp;&nbsp; 2 8 . 4 0<br/>────────────<br/>&nbsp;&nbsp; 1 2 7 . 6 0<br/>Answer: <strong>£127.60</strong><br/><em>(1M for subtraction method; 1A for correct answer)</em>"
        },
        {
          "type": "quiz",
          "question": "A cleaner earns £11.50/hour and works 8 hours. Expenses are £14.20. What is the take-home pay?",
          "options": [
            { "text": "£77.80", "correct": true },
            { "text": "£78.80", "correct": false },
            { "text": "£89.80", "correct": false }
          ],
          "explanation": "£11.50 × 8: 1150 × 8 = 9200, 2 d.p. → £92.00. Then £92.00 − £14.20 = £77.80."
        }
      ]
    },

    {
      "tag": null,
      "label": "Guided practice",
      "kicker": "Section 5 — Practice with support",
      "heading": "Complete the written method steps.",
      "sub": "Fill in the missing numbers in these calculations.",
      "blocks": [
        {
          "type": "read",
          "label": "Method reminder",
          "text": "Column addition: right to left, carry when ≥10.<br/>Decimal addition and subtraction: align the decimal points first — pad shorter decimals with zeros if needed.<br/>2-digit multiplication: calculate each partial product, then add them."
        },
        {
          "type": "fillblanks",
          "sentences": [
            {
              "before": "In 346 × 7: 6 × 7 = 42, write 2 carry",
              "after": ".",
              "answer": "4",
              "hints": [
                "42 = 4 tens + 2 ones. Write the 2 and carry the tens digit.",
                "How many tens are in 42?"
              ]
            },
            {
              "before": "In 47 × 38, one partial product is 47 × 30 =",
              "after": ".",
              "answer": "1410",
              "hints": [
                "47 × 3 = 141, then multiply by 10 because it is 30.",
                "The tens row must shift left."
              ]
            },
            {
              "before": "In 7.20 − 3.85, the zero after 7.2 is a",
              "after": "placeholder.",
              "answer": "hundredths",
              "hints": [
                "7.2 becomes 7.20 so the decimal places line up.",
                "The second digit after the decimal is the hundredths column."
              ]
            },
            {
              "before": "To check 18 × 5 = 90 using the inverse, calculate 90 ÷",
              "after": ".",
              "answer": "5",
              "hints": [
                "The inverse of × 5 is ÷ 5.",
                "Undo the original operation."
              ]
            }
          ],
          "correctMsg": "Good — working through the method step by step earns marks even if later arithmetic slips.",
          "wrongMsg": "Go through the method one step at a time: align columns, carry or borrow, then check with the inverse."
        }
      ]
    },

    {
      "tag": "maths:four-operations",
      "label": "Spot the error",
      "kicker": "Section 6 — Common mistake",
      "heading": "Find the decimal column error.",
      "sub": "Decimal misalignment is a common mark-losing error.",
      "blocks": [
        {
          "type": "read",
          "label": "The student's working",
          "text": "A student calculates 3.72 + 1.5 and writes:<br/><br/>&nbsp;&nbsp; 3 . 7 2<br/>+ &nbsp;&nbsp; 1 . 5<br/>──────────<br/>&nbsp;&nbsp; 3 . 8 7<br/><br/>They aligned the <em>last digits</em> instead of the <em>decimal points</em>."
        },
        {
          "type": "misconceptionCheck",
          "statements": [
            {
              "statement": "3.87 is the correct answer to 3.72 + 1.5.",
              "answer": false,
              "reveal": "FALSE. The student put 1.5 in the wrong column — they aligned the last digits (2 and 5) instead of the decimal points. Correct method: write 1.5 as 1.50, then align: 3.72 + 1.50 = 5.22.",
              "examTrap": "Always write trailing zeros to make decimal place counts equal before adding or subtracting."
            }
          ]
        },
        {
          "type": "quiz",
          "question": "Correct answer for 3.72 + 1.5:",
          "options": [
            { "text": "3.87", "correct": false },
            { "text": "5.22", "correct": true },
            { "text": "4.72", "correct": false }
          ],
          "explanation": "Write 1.5 as 1.50. Align decimal points: 3.72 + 1.50. Hundredths: 2+0=2. Tenths: 7+5=12 (write 2, carry 1). Ones: 3+1+1=5. Answer: 5.22."
        }
      ]
    },

    {
      "tag": null,
      "label": "Maths in the wild",
      "kicker": "Section 7 — Real-world application",
      "heading": "All four operations in a shop.",
      "sub": "AQA finance context questions test the same written methods in a real-world setting.",
      "blocks": [
        {
          "type": "read",
          "label": "Finance vocabulary you need to know",
          "text": "<strong>Cost price</strong> = what the shop pays &nbsp;·&nbsp; <strong>Selling price</strong> = what the customer pays &nbsp;·&nbsp; <strong>Profit</strong> = selling price − cost price &nbsp;·&nbsp; <strong>Loss</strong> = cost price − selling price when cost is higher &nbsp;·&nbsp; <strong>Balance</strong> = total in − total out."
        },
        {
          "type": "scenario",
          "situation": "A market trader buys 24 jars for £1.35 each and sells them all for £2.50 each.",
          "question": "What is the total profit?",
          "options": [
            { "text": "£27.60", "correct": true },
            { "text": "£32.40", "correct": false },
            { "text": "£11.40", "correct": false }
          ],
          "correctMsg": "Cost: 24 × £1.35 = £32.40. Revenue: 24 × £2.50 = £60.00. Profit: £60.00 − £32.40 = £27.60.",
          "wrongMsg": "Profit = total selling price − total cost price. Work out each total first, then subtract."
        },
        {
          "type": "scenario",
          "situation": "A phone costs £420. A customer pays with three £200 notes.",
          "question": "How much change do they receive?",
          "options": [
            { "text": "£160", "correct": false },
            { "text": "£180", "correct": true },
            { "text": "£200", "correct": false }
          ],
          "correctMsg": "3 × £200 = £600. Change = £600 − £420 = £180.",
          "wrongMsg": "Step 1: find the total paid (3 × 200). Step 2: subtract the price (600 − 420)."
        }
      ]
    },

    {
      "tag": null,
      "label": "Retrieval",
      "kicker": "Section 8 — Mixed retrieval",
      "heading": "Mixed retrieval practice.",
      "sub": "Questions from this chapter and Chapter 1. Answer without looking back.",
      "blocks": [
        {
          "type": "read",
          "label": "Why mixed retrieval works",
          "text": "Mixing questions from different topics strengthens long-term memory more than blocked practice. Expect one question from Chapter 1."
        },
        {
          "type": "quiz",
          "question": "Calculate: 0.5 × 0.6",
          "options": [
            { "text": "0.3", "correct": true },
            { "text": "3.0", "correct": false },
            { "text": "0.03", "correct": false }
          ],
          "explanation": "5 × 6 = 30. 0.5 has 1 d.p., 0.6 has 1 d.p. Total: 2 d.p. Place 2 from right: 0.30 = 0.3."
        },
        {
          "type": "quiz",
          "question": "Order from smallest to largest: −2, 0.5, −0.5, 1",
          "options": [
            { "text": "−2, −0.5, 0.5, 1", "correct": true },
            { "text": "−0.5, −2, 0.5, 1", "correct": false },
            { "text": "0.5, 1, −0.5, −2", "correct": false }
          ],
          "explanation": "From Chapter 1: number line left to right. −2 is furthest left, then −0.5, then 0.5, then 1."
        },
        {
          "type": "quiz",
          "question": "A student says 384 ÷ 6 = 54. They check using the inverse. What is 54 × 6?",
          "options": [
            { "text": "384", "correct": false },
            { "text": "324", "correct": true },
            { "text": "384 — the inverse confirms it", "correct": false }
          ],
          "explanation": "54 × 6: 4×6=24 (write 4, carry 2). 5×6=30+2=32. Answer: 324 ≠ 384. The original division was wrong. Correct: 384 ÷ 6 = 64."
        },
        {
          "type": "quiz",
          "question": "Which method is most sensible for 24 × 25?",
          "options": [
            { "text": "Mental: 25 × 4 = 100, so 25 × 24 = 600", "correct": true },
            { "text": "Always use a calculator, even on Paper 1", "correct": false },
            { "text": "Guess because it is close to 500", "correct": false }
          ],
          "explanation": "A mental shortcut works well here: 24 lots of 25 = 6 lots of 100 = 600."
        }
      ]
    },

    {
      "tag": "maths:four-operations",
      "label": "Exam practice",
      "kicker": "Section 9 — AQA exam style",
      "heading": "Exam-style questions.",
      "sub": "AQA-style wording, method marks shown. Write your method before reading the mark scheme.",
      "blocks": [
        {
          "type": "read",
          "label": "AQA exam pattern",
          "text": "Four-operation questions on non-calculator papers often reward separate marks for <strong>method</strong> and <strong>accuracy</strong>. A wrong final answer can still earn credit if the method is clear."
        },
        {
          "type": "boss",
          "tier": "🟢",
          "label": "Q1 — Decimal addition (2 marks)",
          "question": "Calculate: 4.38 + 2.7\nShow your working.",
          "markPoints": [
            "Answer: 7.08",
            "Method: decimal points aligned (4.38 + 2.70 seen or implied)",
            "Common error: 4.38 + 2.7 = 4.65 (misaligned — placed 7 in the hundredths column)"
          ]
        },
        {
          "type": "boss",
          "tier": "🟡",
          "label": "Q2 — Two-digit multiplication (2 marks)",
          "question": "Calculate: 47 × 38\nShow your working.",
          "markPoints": [
            "Answer: 1786",
            "Method: 47 × 8 = 376 and 47 × 30 = 1410, then add partial products",
            "Common error: forgetting the tens-row shift and using 47 × 3 instead of 47 × 30"
          ]
        },
        {
          "type": "boss",
          "tier": "🔴",
          "label": "Q3 — Finance problem (3 marks, N2)",
          "question": "A plumber charges £45 per hour plus a £28 call-out fee.\nShe works for 3.5 hours.\nWork out the total charge.",
          "markPoints": [
            "Answer: £185.50",
            "1M: £45 × 3.5 or equivalent (= £157.50)",
            "1M: adding call-out fee (their hourly total + £28)",
            "1A: £185.50",
            "Common error: 45 × 35 = 1575 without placing decimal (gives £1575 — ten times too large)"
          ]
        }
      ]
    },

    {
      "tag": null,
      "label": "Chapter complete",
      "kicker": "Section 10 — Confidence check",
      "heading": "Chapter 2 done.",
      "sub": "Key rules. Top traps. What comes next.",
      "blocks": [
        {
          "type": "read",
          "label": "Key rules for the four operations",
          "text": "1. Column methods: work right to left; carry or borrow as needed.<br/>2. Decimal addition/subtraction: align the decimal points — pad with zeros if needed.<br/>3. Decimal multiplication: multiply as integers, then count total d.p. and place the point.<br/>4. Two-digit multiplication: build partial products, then add them.<br/>5. Division: carry remainders, and continue into decimals when the context needs an exact decimal answer.<br/>6. Method choice: mental for friendly numbers, written for non-calculator complexity, calculator with estimation on calculator papers.<br/>7. Inverse check: after any calculation, undo it with the opposite operation."
        },
        {
          "type": "read",
          "label": "Top 3 errors from AQA mark schemes",
          "text": "1. <strong>Decimal misalignment:</strong> lining up last digits instead of decimal points in column addition/subtraction.<br/>2. <strong>Decimal place count:</strong> counting only one set of d.p. in multiplication (forgetting to add both).<br/>3. <strong>Missing place-value shift:</strong> treating ×30 like ×3 in a 2-digit multiplication."
        },
        {
          "type": "examtip",
          "tip": "<strong>Exam habit:</strong> On Paper 1, write the method clearly. On calculator papers, estimate first so you can spot a nonsense answer."
        },
        {
          "type": "keypoint",
          "text": "<strong>Chapter 2 complete.</strong> You can now: use column methods for all four operations · work with decimals without misplacing the point · choose a sensible method · use inverse operations to catch errors · apply these to finance contexts.<br/><br/>Next: Chapter 3 — Negative numbers without panic. Extend the number line below zero and handle operations with negatives."
        }
      ]
    }
  ],

  "series": "foundations",
  "recallTags": ["maths:four-operations", "maths:written-methods"],
  "examTags": ["N2", "N3"],
  "assetKeys": [],
  "stageNavigation": [
    { "id": "s1", "title": "Decimal trap", "description": "Why decimal operations need a rule", "screenIndex": 0 },
    { "id": "s2", "title": "Prior knowledge", "description": "Place value from Chapter 1", "screenIndex": 1 },
    { "id": "s3", "title": "Add and subtract", "description": "Column methods, carrying and borrowing", "screenIndex": 2 },
    { "id": "s4", "title": "Multiply and divide", "description": "Short methods, partial products and division", "screenIndex": 3 },
    { "id": "s5", "title": "Decimal operations", "description": "Align, count and convert", "screenIndex": 4 },
    { "id": "s6", "title": "Choosing a method", "description": "Mental, written or calculator", "screenIndex": 5 },
    { "id": "s7", "title": "Inverse operations", "description": "Check any calculation with the opposite", "screenIndex": 6 },
    { "id": "s8", "title": "Worked example", "description": "Multi-step wages and tax problem", "screenIndex": 7 },
    { "id": "s9", "title": "Guided practice", "description": "Written method fill-in-the-blanks", "screenIndex": 8 },
    { "id": "s10", "title": "Spot the error", "description": "Fix the decimal misalignment", "screenIndex": 9 },
    { "id": "s11", "title": "Real world", "description": "Shopping, profit and wages", "screenIndex": 10 },
    { "id": "s12", "title": "Retrieval", "description": "Mixed questions from Ch1 and Ch2", "screenIndex": 11 },
    { "id": "s13", "title": "Exam practice", "description": "AQA-style written method questions", "screenIndex": 12 },
    { "id": "s14", "title": "Chapter complete", "description": "Key rules and what comes next", "screenIndex": 13 }
  ]
}
