import { getJson, setJson } from '../../../lib/storage.js'

const QF_BEST_KEY = 'gcse_qf_best'

export function readQfBest() {
  return getJson(QF_BEST_KEY, null)
}

export function saveQfBestIfBeaten(correct, answered) {
  const best = readQfBest()
  if (!best || correct > best.correct) {
    setJson(QF_BEST_KEY, { correct, answered, date: new Date().toISOString() })
  }
}
