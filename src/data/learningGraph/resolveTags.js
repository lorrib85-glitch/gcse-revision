// ─── Canonical Learning Graph — tag inheritance ─────────────────────────────
//
// Effective tags = module.tags + topic.tags + screen/question.tags, resolved
// at read time. Content never needs to repeat a tag its parent already
// carries, and repeating one is harmless — the resolver dedupes.
//
// Layers are ordered broad → specific; first occurrence wins the position so
// resolved output is stable for tests and analytics.

export function resolveEffectiveTags(...layers) {
  const seen = new Set()
  const out = []
  for (const layer of layers) {
    if (!Array.isArray(layer)) continue
    for (const tag of layer) {
      if (typeof tag !== 'string' || seen.has(tag)) continue
      seen.add(tag)
      out.push(tag)
    }
  }
  return out
}
