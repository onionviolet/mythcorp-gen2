import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { formatDryRun, parseTriagedBacklog } from './post-backlog-to-issues.mjs';

test('parses the current triaged backlog shape', () => {
  const input = `# Backlog

## Next audits

- First item that
  continues on another line.
- Second item.

## History

No actionable bullets here.
`;

  assert.deepEqual(parseTriagedBacklog(input), [
    {
      title: 'Next audits',
      items: ['First item that continues on another line.', 'Second item.'],
    },
  ]);
});

test('dry-run report states that remote mutation is disabled', () => {
  const report = formatDryRun([{ title: 'Next audits', items: ['One item.'] }]);

  assert.match(report, /no longer posts GitHub issues/);
  assert.match(report, /Local queue: 1 item in 1 section\./);
  assert.match(report, /No GitHub commands were run\./);
});

test('command runs without gh and rejects mutation-shaped options', () => {
  const script = fileURLToPath(new URL('./post-backlog-to-issues.mjs', import.meta.url));
  const environment = { ...process.env, PATH: '' };
  const dryRun = spawnSync(process.execPath, [script], { encoding: 'utf8', env: environment });
  const createAttempt = spawnSync(process.execPath, [script, '--create'], {
    encoding: 'utf8',
    env: environment,
  });

  assert.equal(dryRun.status, 0);
  assert.match(dryRun.stdout, /No GitHub commands were run\. No issues were created or changed\./);
  assert.equal(dryRun.stderr, '');

  assert.equal(createAttempt.status, 2);
  assert.match(createAttempt.stderr, /Only the read-only --dry-run option is available\./);
  assert.equal(createAttempt.stdout, '');
});

test('implementation has no GitHub CLI or issue creation path', () => {
  const source = readFileSync(new URL('./post-backlog-to-issues.mjs', import.meta.url), 'utf8');

  assert.doesNotMatch(source, /spawnSync|execSync|issue', 'create/);
});
