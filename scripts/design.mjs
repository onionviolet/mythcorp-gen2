import { spawn, spawnSync } from 'node:child_process';
import { dirname, delimiter } from 'node:path';
import { fileURLToPath } from 'node:url';


const env = { ...process.env };
if (process.platform === 'win32') {
  // Popmelt picks the first result from where.exe. A shell shim cannot be spawned directly.
  const lookup = spawnSync('where.exe', ['codex.exe'], { encoding: 'utf8' });
  const executable = lookup.stdout?.trim().split(/\r?\n/)[0];
  if (lookup.status === 0 && executable) {
    const key = Object.keys(env).find(name => name.toLowerCase() === 'path') ?? 'Path';
    env[key] = dirname(executable) + delimiter + env[key];
  }
}

const cli = new URL('./cli.mjs', import.meta.resolve('@popmelt.com/core'));
const child = spawn(process.execPath, [
  fileURLToPath(cli), 'wrap', '--', 'next', 'dev', '-H', '127.0.0.1', ...process.argv.slice(2),
], { env, stdio: 'inherit' });
child.on('exit', code => { process.exitCode = code ?? 1; });
