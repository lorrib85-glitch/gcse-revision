export const config = { runtime: 'edge' }

const SYSTEM_PROMPT = `You are assessing a GCSE student's free-text recall answer against the actual content of a previous revision module.

You will receive:
1. The key content from the previous module (what was taught)
2. The student's recall answer (what they wrote from memory)
3. A list of concepts from that module — each has a tag and a label

Using the module content as your reference, score how well the student demonstrated knowledge of each concept in their answer:
- 0.0 = No evidence of this concept in the answer, or clearly incorrect
- 0.1–0.29 = Extremely vague reference — barely identifiable
- 0.3–0.69 = Partial recall — concept touched on but key detail missing or imprecise
- 0.7–0.89 = Good recall — concept clearly addressed with reasonable accuracy
- 0.9–1.0 = Strong recall — concept addressed with accurate, specific detail

Assess based on the module content, not keyword matching. Credit correct paraphrasing and synonyms.
Example: "bad smells caused disease" should score well for miasma even without the word "miasma".
Example: "doctors used plants" is too vague to score above 0.2 for herbal remedies — it needs specificity.
Be strict on vague generalisations. Be generous on accurate paraphrasing of the module content.

Respond ONLY with this exact JSON format, no other text:
{
  "concepts": [
    { "tag": "<tag>", "score": <0.0-1.0> }
  ],
  "summary": "<one calm honest sentence about their overall recall quality, aimed at a 15-year-old>"
}`

export default async function handler(req) {
  console.log('[recall] invoked, method:', req.method)

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  console.log('[recall] api key present:', !!apiKey)
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 })
  }

  let body
  try { body = await req.json() } catch {
    console.log('[recall] body parse failed')
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 })
  }

  const { answer, concepts, sourceContent } = body
  console.log('[recall] concepts:', concepts?.length ?? 0, 'answer length:', answer?.length ?? 0)
  if (!answer || !concepts?.length) {
    return new Response(JSON.stringify({ error: 'Missing fields: answer and concepts required' }), { status: 400 })
  }

  if (answer.trim().length < 5) {
    console.log('[recall] answer too short')
    return new Response(JSON.stringify({
      concepts: concepts.map(c => ({ tag: c.tag, score: 0 })),
      summary: "That's a blank page so far. Try jotting down anything that comes to mind — even a half-remembered detail is a good place to start.",
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }

  const conceptList = concepts.map((c, i) =>
    `${i + 1}. tag: "${c.tag}", label: "${c.label}"`
  ).join('\n')

  const userMessage = `Module content (what was taught):
${sourceContent || 'No source content provided — assess based on general GCSE knowledge.'}

Student's recall answer:
"${answer}"

Concepts to assess:
${conceptList}`

  console.log('[recall] calling Anthropic API')
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
      console.log('[recall] Anthropic error:', response.status, err)
      return new Response(JSON.stringify({ error: `API error: ${err}` }), { status: 500 })
    }
    console.log('[recall] Anthropic responded ok')

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
    console.log('[recall] caught error:', err.message)
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
