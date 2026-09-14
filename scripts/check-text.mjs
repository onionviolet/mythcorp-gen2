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

if (failures.length) {
  console.error(`Em dash found in maintained files:\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Text policy passed for ${files.length} maintained files.`);
}
