#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RETIRED_MESSAGE = [
  'Retired: this command no longer posts GitHub issues.',
  'BACKLOG.md is the triaged local source of truth, while GitHub Issues need',
  'reconciliation against shipped work before any remote changes are made.',
];

export function parseTriagedBacklog(text) {
  const sections = [];
  let section;
  let item;

  for (const line of text.replaceAll('\r\n', '\n').split('\n')) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      section = { title: heading[1], items: [] };
      sections.push(section);
      item = undefined;
      continue;
    }

    const bullet = line.match(/^-\s+(.+)$/);
    if (section && bullet) {
      item = bullet[1].trim();
      section.items.push(item);
      continue;
    }

    if (section && item && /^\s{2,}\S/.test(line)) {
      item = `${item} ${line.trim()}`;
      section.items[section.items.length - 1] = item;
    }
  }

  return sections.filter(({ items }) => items.length > 0);
}

export function formatDryRun(sections) {
  const itemCount = sections.reduce((total, section) => total + section.items.length, 0);
  const itemLabel = itemCount === 1 ? 'item' : 'items';
  const sectionLabel = sections.length === 1 ? 'section' : 'sections';
  const lines = [
    ...RETIRED_MESSAGE,
    '',
    `Local queue: ${itemCount} ${itemLabel} in ${sections.length} ${sectionLabel}.`,
  ];

  for (const section of sections) {
    lines.push('', `${section.title} (${section.items.length})`);
    for (const item of section.items) lines.push(`- ${item}`);
  }

  lines.push('', 'No GitHub commands were run. No issues were created or changed.');
  return lines.join('\n');
}

export function main(argv = process.argv.slice(2)) {
  const unknownOptions = argv.filter((arg) => arg !== '--dry-run');
  if (unknownOptions.length > 0) {
    console.error(`Unsupported option: ${unknownOptions.join(', ')}`);
    console.error('Only the read-only --dry-run option is available.');
    process.exitCode = 2;
    return;
  }

  const backlogPath = new URL('../BACKLOG.md', import.meta.url);
  let raw;
  try {
    raw = readFileSync(backlogPath, 'utf8');
  } catch {
    console.error(`BACKLOG.md not found at ${fileURLToPath(backlogPath)}`);
    process.exitCode = 1;
    return;
  }

  console.log(formatDryRun(parseTriagedBacklog(raw)));
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) main();
