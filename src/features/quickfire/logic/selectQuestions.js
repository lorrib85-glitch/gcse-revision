import { ALL_QUESTIONS } from '../../../data/questionBanks/questionRegistry.js'

// TODO phase 2: replace with proficiency-adaptive selection
export function selectQuestions({
  subject,
  module: moduleId,
  topic,
  tags,
  difficulty,
  limit,
  shuffle: doShuffle = true,
} = {}) {
  let pool = [...ALL_QUESTIONS]

  if (subject) pool = pool.filter(q => q.subject === subject)
  if (moduleId) pool = pool.filter(q => q.module === moduleId || q.topicId === moduleId)
  if (topic) pool = pool.filter(q => q.topic === topic || q.topicId === topic)
  if (tags) {
    const tagSet = Array.isArray(tags) ? tags : [tags]
    pool = pool.filter(q => q.tags && tagSet.some(t => q.tags.includes(t)))
  }
  if (difficulty) {
    const [min, max] = Array.isArray(difficulty) ? difficulty : [difficulty, difficulty]
    pool = pool.filter(q => q.difficulty >= min && q.difficulty <= max)
  }

  if (doShuffle) {
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]]
    }
  }

  return limit ? pool.slice(0, limit) : pool
}
