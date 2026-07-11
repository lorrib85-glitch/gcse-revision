const SCORE_RECALLED = 0.7

export function partitionRecallConcepts(concepts, threshold = SCORE_RECALLED) {
  return {
    recalled: concepts.filter(c => c.score >= threshold),
    missing: concepts.filter(c => c.score < threshold),
  }
}
