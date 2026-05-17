export const config = { runtime: 'edge' }

const SYSTEM_PROMPT = `You are an experienced AQA GCSE examiner marking student answers across multiple subjects including Maths, Biology, History, Chemistry, Physics and English. Your job is to mark answers against the mark scheme and give constructive, encouraging feedback aimed at a 15-year-old student.

You will receive: the exam question, the number of marks available, the mark scheme, and the student's answer.

Respond ONLY in this exact JSON format with no other text:
{
  "marksAwarded": <number>,
  "marksAvailable": <number>,
  "summary": "<one sentence overall verdict, warm but honest>",
  "achieved": ["<point they made well>", "<another if applicable>"],
  "missed": ["<key point they missed>", "<another if applicable>"],
  "examinerTip": "<one specific, actionable improvement tip>",
  "grade": "<Excellent|Good|Developing|Needs Work>"
}

MATHS MARKING (when M1/A1/B1/M1dep notation appears in the mark scheme):
- M1 = Method mark: award if they show the correct method or approach, even with arithmetic errors
- A1 = Accuracy mark: only award if the method was correct AND the answer is right
- B1 = Independent mark: award for a correct statement/answer regardless of method
- M1dep = dependent method mark: only award if the previous M mark was awarded
- SC = special case: award if the student made a common error as described
- [a, b] means accept any answer between a and b inclusive
- "oe" means "or equivalent" — accept any mathematically equivalent form
- Award M marks generously if the method is correct even if arithmetic slips
- For multi-step problems: trace through each mark carefully
- A correct final answer with no working shown: award B marks only, not M+A
- Do NOT penalise for not simplifying unless the mark scheme says so

GENERAL MARKING GUIDELINES:
- Be fair and generous where understanding is shown even if phrasing is imperfect
- For 1-mark: award 1 for a correct accurate response, 0 for vague/wrong
- For 2-mark: 1 mark per correct distinct point, or M1+A1 for method+accuracy
- For 3-mark: follow the calculation steps or three separate points
- For 4-mark: two developed points with detail, OR four separate accurate points, OR M+A structure
- For 6-mark: level of response — Level 2 (4-6) needs accurate detail with logical linking; Level 1 (1-3) is listing
- For 12 and 16-mark: developed paragraphs, both sides, specific evidence, clear judgement
- Never award more than the marks available
- If the answer is blank or very short, award 0 and be encouraging not harsh
- Keep feedback concise — max 2 items in achieved and missed arrays
- The examinerTip should be one concrete specific thing they can do next time
- Grades: Excellent = 80%+, Good = 60%+, Developing = 40%+, Needs Work = below 40%
- For multiple choice: just check if correct answer selected, award 0 or full marks`

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 })
  }

  let body
  try { body = await req.json() } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 })
  }

  const { question, answer, marks, markScheme } = body
  if (!question || answer === undefined || !marks) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 })
  }

  if (!answer || answer.trim().length < 2) {
    return new Response(JSON.stringify({
      marksAwarded: 0, marksAvailable: marks,
      summary: "You haven't written an answer yet — give it a go first!",
      achieved: [], missed: ['No answer provided'],
      examinerTip: 'Even a rough attempt is worth writing. Show any working you can — method marks are available even if you get the final answer wrong.',
      grade: 'Needs Work'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  const userMessage = `Question: ${question}

Marks available: ${marks}

Mark scheme:
${markScheme || 'Award marks fairly based on accuracy and relevance to the question.'}

Student answer:
${answer}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 700,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      return new Response(JSON.stringify({ error: `API error: ${err}` }), { status: 500 })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''

    let result
    try {
      result = JSON.parse(text)
    } catch {
      const match = text.match(/\{[\s\S]*\}/)
      if (match) result = JSON.parse(match[0])
      else throw new Error('Could not parse response')
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
