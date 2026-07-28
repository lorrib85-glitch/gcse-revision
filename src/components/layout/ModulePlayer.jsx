// Legacy compatibility facade for the canonical chapter runtime.
// New production code must import ChapterPlayer directly.

import ChapterPlayer from './ChapterPlayer.jsx'

export { ChapterPlayer }

export default function ModulePlayer({ module, chapter, ...props }) {
  return <ChapterPlayer chapter={chapter || module} {...props} />
}
