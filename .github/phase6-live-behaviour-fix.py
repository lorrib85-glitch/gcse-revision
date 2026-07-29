from pathlib import Path

ROOT = Path('.')

# Quick Fire recovery metadata routes to one chapter, not a parent module.
path = ROOT / 'src/features/quickfire/logic/convertBankQuestion.js'
text = path.read_text(encoding='utf-8')
text = text.replace('TAG_MODULE_MAP', 'TAG_CHAPTER_MAP')
text = text.replace('tagModuleMap.js', 'tagChapterMap.js')
text = text.replace('moduleId:', 'chapterId:')
text = text.replace('TAG_CHAPTER_MAP key', 'TAG_CHAPTER_MAP key')
path.write_text(text, encoding='utf-8')

# Journey and routing tests now assert only canonical output fields. Keep one
# explicit source='module' record where the test is deliberately proving old
# stored telemetry remains readable.
journey = ROOT / 'tests/unit/journeys/learnerJourneys.test.js'
if journey.exists():
    value = journey.read_text(encoding='utf-8')
    value = value.replace('payload.nextModule', 'payload.nextChapter')
    journey.write_text(value, encoding='utf-8')

routing = ROOT / 'tests/unit/weaknessRouting/quickfireRouting.test.js'
if routing.exists():
    value = routing.read_text(encoding='utf-8')
    value = value.replace('tagModuleMap.js', 'tagChapterMap.js')
    value = value.replace('TAG_MODULE_MAP', 'TAG_CHAPTER_MAP')
    value = value.replace('conv.moduleId', 'conv.chapterId')
    value = value.replace('win.moduleId', 'win.chapterId')
    value = value.replace('available module', 'available chapter')
    value = value.replace('real, available module', 'real, available chapter')
    value = value.replace('const mod = CHAPTERS.find(m => m.id === win.chapterId)', 'const chapter = CHAPTERS.find(item => item.id === win.chapterId)')
    value = value.replace('expect(mod).toBeTruthy()', 'expect(chapter).toBeTruthy()')
    value = value.replace('isChapterAvailable(mod)', 'isChapterAvailable(chapter)')
    value = value.replace('findTaggedChapterScreen(mod, win.conceptTag)', 'findTaggedChapterScreen(chapter, win.conceptTag)')
    value = value.replace('mod.screenCount', 'chapter.screenCount')
    # This one case intentionally represents history written under the old source label.
    value = value.replace("topic: 'germ-theory', source: 'chapter' }) // slug-as-topic", "topic: 'germ-theory', source: 'module' }) // legacy slug-as-topic")
    routing.write_text(value, encoding='utf-8')

print('Final chapter navigation payloads migrated')
