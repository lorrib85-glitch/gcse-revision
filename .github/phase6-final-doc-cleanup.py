from pathlib import Path

ROOT = Path('.')


def update(path, replacements):
    p = ROOT / path
    text = p.read_text(encoding='utf-8')
    for old, new in replacements:
        text = text.replace(old, new)
    p.write_text(text, encoding='utf-8')


update('src/features/subjects/Subjects.jsx', [
    ('show but never open (guarded in handleCardClick / openModulePlayer).',
     'show but never open (guarded in handleCardClick / openChapterPlayer).'),
    ('// `completed` sticks once a module is finished — reviewing it afterwards moves `screen`',
     '// `completed` sticks once a chapter is finished — reviewing it afterwards moves `screen`'),
    ('// The next module to tackle — whether already in progress or not yet started — is',
     '// The next chapter to tackle — whether already in progress or not yet started — is'),
    ('.filter(Boolean) // drop hidden modules', '.filter(Boolean) // drop hidden chapters'),
])

update('CLAUDE.md', [
    ('overlays, module opening and lazy-loading orchestration',
     'overlays, chapter opening and lazy-loading orchestration'),
    ('weak-spot revisit or continue-module', 'weak-spot revisit or continue-chapter'),
    ('History Module Architecture below', 'History chapter architecture below'),
])

update('.claude/skills/content-create/SKILL.md', [
    ('never add a module to a grandfather allowlist to get green',
     'never add a chapter to a grandfather allowlist to get green'),
])

update('.claude/skills/canonical-topic/SKILL.md', [
    ('"Current module" cell, and "Notes".',
     '"Current module" cell (legacy column name; its value is a chapter ID), and "Notes".'),
    ('supplement any explicit\n"Current module" column in the spine.',
     'supplement any explicit legacy "Current module" column in the spine.'),
    ('- The ordered list of module sections', '- The ordered list of chapter sections'),
    ('- The Module Completion Test', '- The Chapter Completion Test'),
])

for path in [
    'src/data/biologyGroups.js',
    'src/data/chemistryGroups.js',
    'src/data/mathsGroups.js',
    'src/data/sociologyGroups.js',
]:
    update(path, [
        ('array of module definitions', 'array of chapter definitions'),
        ('module definitions', 'chapter definitions'),
        ('module cards', 'chapter cards'),
    ])

update('src/data/learningGraph/concepts/historyMedicine.js', [
    ('legacy single-word screen tags (modules.js screenTags, consumed',
     'legacy single-word screen tags (`src/chapters.js` screenTags, consumed'),
])

update('src/data/contentSupport/historyMedicineEpisode01.js', [
    ('whole-module coverage', 'whole-chapter coverage'),
])

print('Final active guidance wording cleaned')
