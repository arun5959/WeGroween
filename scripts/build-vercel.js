import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

// This target publishes fictional account and operations previews. All editable
// operations records stay in this browser; real auth and purchasing remain separate.
export function vercelBuildEnvironment(environment = process.env) {
  return { ...environment, WEGROWEEN_BASE_PATH: '/', VITE_ACCOUNT_PREVIEW: 'true', VITE_OPERATIONS_PREVIEW: 'true' };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!process.env.npm_execpath) throw new Error('Run this target with npm run build:vercel.');
  const result = spawnSync(process.execPath, [process.env.npm_execpath, 'run', 'build'], {
    cwd: fileURLToPath(new URL('../', import.meta.url)),
    env: vercelBuildEnvironment(),
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
  const release = JSON.parse(readFileSync(new URL('../dist/release.json', import.meta.url), 'utf8'));
  const account = readFileSync(new URL('../dist/account/index.html', import.meta.url), 'utf8');
  const admin = readFileSync(new URL('../dist/admin/index.html', import.meta.url), 'utf8');
  if (!release.operationsPreview || !admin.includes('data-workspace-kind="operations"')) throw new Error('Vercel operations preview was not generated correctly.');
  if (!release.accountPreview || release.basePath !== '/' || !account.includes('data-account-preview')) {
    throw new Error('Vercel account preview was not generated correctly.');
  }
  console.log('Verified Vercel account preview and root hosting path.');
}
