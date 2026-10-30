import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const ROOT = process.cwd();
const LIVE_DOCS = [
  'AGENTS.md',
  'BACKLOG.md',
  'CLAUDE.md',
  'DESIGN.md',
  'MAP.md',
  'README.md',
  'playwright.config.ts',
];
const SOURCE_ROOTS = ['src', 'scripts', 'tools', 'tests'];
const TEXT_EXTENSIONS = new Set(['.css', '.js', '.jsx', '.json', '.md', '.mjs', '.ts', '.tsx']);
const EXCLUDED_SEGMENTS = new Set(['_archive', 'canvasui']);
const EM_DASH = String.fromCodePoint(0x2014);

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (EXCLUDED_SEGMENTS.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collect(path));
    else if (TEXT_EXTENSIONS.has(extname(entry.name))) files.push(path);
  }

  return files;
}

const files = [
  ...LIVE_DOCS.map((file) => join(ROOT, file)),
  ...(await Promise.all(SOURCE_ROOTS.map((directory) => collect(join(ROOT, directory))))).flat(),
];
const failures = [];

for (const file of files) {
  const lines = (await readFile(file, 'utf8')).split('\n');
  lines.forEach((line, index) => {
    if (line.includes(EM_DASH)) failures.push(`${relative(ROOT, file)}:${index + 1}`);
  });
}

// STATUS.md is the current-state file. It grew into a 1,900-line dated log
// once, so its shape is checked here rather than left to prose.
const STATUS_MAX_LINES = 120;
const status = (await readFile(join(ROOT, 'STATUS.md'), 'utf8')).split('\n');
if (status.length > STATUS_MAX_LINES) {
  failures.push(`STATUS.md has ${status.length} lines (cap ${STATUS_MAX_LINES}); move history to docs/STATUS_LOG.md`);
}
status.forEach((line, index) => {
  if (/^##\s.*\b20\d\d-\d\d-\d\d\b/.test(line)) {
    failures.push(`STATUS.md:${index + 1} dated section; update the current-state section and log history in docs/STATUS_LOG.md`);
  }
});

if (failures.length) {
  console.error(`Text policy failed:\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Text policy passed for ${files.length} maintained files.`);
}
