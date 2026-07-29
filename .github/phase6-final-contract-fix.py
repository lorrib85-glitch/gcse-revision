from pathlib import Path
import re

path = Path('tests/architecture/content-loading-boundary.test.js')
text = path.read_text(encoding='utf-8')

# Keep exactly one canonical loader import even if the earlier compatibility
# migration temporarily produced a duplicate line.
import_line = "import { CHAPTER_CONTENT_LOADERS } from '../../src/content/chapterContentRegistry.js'\n"
text = re.sub(
    r"(?:import \{ CHAPTER_CONTENT_LOADERS \} from '\.\./\.\./src/content/chapterContentRegistry\.js'\n)+",
    import_line,
    text,
    count=1,
)

canonical_owner = """describe('Content-loading boundary — one canonical registry owner', () => {
  it('chapterContentRegistry.js is the sole CHAPTER_CONTENT_LOADERS definition', () => {
    const registryPath = resolve(root, 'src/content/chapterContentRegistry.js')
    const violators = allSrcFiles.filter(file => {
      if (file === registryPath) return false
      return /(?:export\s+)?const\s+CHAPTER_CONTENT_LOADERS\s*=/.test(readFileSync(file, 'utf8'))
    })
    expect(
      violators.map(file => file.replace(root + '/', '')),
      'CHAPTER_CONTENT_LOADERS defined outside chapterContentRegistry.js',
    ).toHaveLength(0)
  })
})

"""
text, count = re.subn(
    r"describe\('Content-loading boundary — one canonical registry owner'.*?(?=describe\('Content-loading boundary — registry values')",
    lambda _match: canonical_owner,
    text,
    count=1,
    flags=re.S,
)
if count != 1:
    raise RuntimeError(f'canonical loader owner section: expected one match, found {count}')

path.write_text(text, encoding='utf-8')
print('Canonical loader ownership contract deduplicated')
