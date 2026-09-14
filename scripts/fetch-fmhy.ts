import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, '..');
const DATA_DIR = join(REPO_ROOT, 'src/app/fmhy/_data');
const OUTPUT_PATH = join(DATA_DIR, 'backup-sites.json');

const RAW_BASE = 'https://raw.githubusercontent.com/fmhy/edit/main/docs';

type BackupSite = { name: string; url: string; note: string };
type BackupGroup = { heading: string; sites: BackupSite[] };
type BackupData = { fetchedAt: string; groups: BackupGroup[] };

async function fetchMarkdown(file: string): Promise<string> {
  const headers: Record<string, string> = { 'User-Agent': 'mythcorp-mirror' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`${RAW_BASE}/${file}`, { headers });
  if (!res.ok) throw new Error(`fetch returned ${res.status}`);
  return res.text();
}

function parseBackups(md: string): BackupGroup[] {
  const lines = md.split(/\r?\n/);
  const groups: BackupGroup[] = [];
  let current: BackupGroup | null = null;

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith('## ')) {
      current = { heading: line.slice(3).trim(), sites: [] };
      groups.push(current);
      continue;
    }
    if (!current) continue;
    if (!/^[*\-+]\s/.test(line)) continue;

    const rest = line.replace(/^[*\-+]\s+/, '').trim();
    const match = rest.match(/^(\*\*)?\[([^\]]+)\]\(([^)]+)\)(\*\*)?/);
    if (!match) continue;

    const name = match[2].trim();
    const url = match[3].trim();
    const after = rest.slice(match[0].length).trim();
    const note = after
      .replace(/^[-:]\s*/, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    current.sites.push({ name, url, note });
  }

  return groups.filter((g) => g.sites.length > 0);
}

async function main(): Promise<void> {
  const fetchedAt = new Date().toISOString();
  console.log('Fetching FMHY backup sites from docs/other/backups.md...');

  const md = await fetchMarkdown('other/backups.md');
  const groups = parseBackups(md);

  await mkdir(DATA_DIR, { recursive: true });
  const data: BackupData = { fetchedAt, groups };
  await writeFile(OUTPUT_PATH, JSON.stringify(data, null, 2) + '\n', 'utf8');

  const total = groups.reduce((n, g) => n + g.sites.length, 0);
  console.log(`Wrote ${groups.length} groups, ${total} backup sites to backup-sites.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
