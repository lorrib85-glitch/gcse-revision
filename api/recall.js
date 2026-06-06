export const config = { runtime: 'edge' }

const SYSTEM_PROMPT = `You are analysing a GCSE student's free-text recall answer to identify which concepts they remembered from a previous chapter.

You will receive:
1. The student's answer (written from memory)
2. A list of concepts the chapter covered — each has a tag, label, and keywords

For each concept, score how well the student demonstrated knowledge of it:
- 0.0 = Not mentioned at all, or clearly incorrect
- 0.1–0.29 = Extremely vague — barely identifiable
- 0.3–0.69 = Partial recall — mentioned but missing key details or accuracy
- 0.7–0.89 = Good recall — clearly mentioned with reasonable accuracy
- 0.9–1.0 = Comprehensive recall — mentioned with accurate, specific detail

Use the keywords as recognition helpers, but also credit correct synonyms and paraphrasing.
Example: a student writing "bad air" or "smells caused disease" should score well for a miasma-theory concept.
Example: "doctors used herbs" is too vague to score above 0.2 for any specific concept.

Be strict but fair — partial credit is real, but vague general statements should not score above 0.25.

Respond ONLY with this exact JSON format, no other text:
{
  "concepts": [
    { "tag": "<tag>", "score": <0.0-1.0> }
  ],
  "summary": "<one calm honest sentence summarising overall recall quality, aimed at a 15-year-old — no praise inflation>"
}`

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

  const { answer, concepts } = body
  if (!answer || !concepts?.length) {
    return new Response(JSON.stringify({ error: 'Missing fields: answer and concepts required' }), { status: 400 })
  }

  if (answer.trim().length < 5) {
    return new Response(JSON.stringify({
      concepts: concepts.map(c => ({ tag: c.tag, score: 0 })),
      summary: "You haven't written anything yet — even rough notes count, so give it a go first.",
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  const conceptList = concepts.map((c, i) =>
    `${i + 1}. tag: "${c.tag}", label: "${c.label}", keywords: [${(c.keywords || [c.label]).join(', ')}]`
  ).join('\n')

  const userMessage = `Student's recall answer:
"${answer}"

Concepts to assess:
${conceptList}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
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
      else throw new Error('Could not parse model response')
    }

    // Merge labels back from input — model only returns tags
    const conceptMap = Object.fromEntries(concepts.map(c => [c.tag, c.label]))
    result.concepts = result.concepts.map(c => ({
      tag: c.tag,
      label: conceptMap[c.tag] || c.tag,
      score: Math.min(1, Math.max(0, Number(c.score) || 0)),
    }))

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
