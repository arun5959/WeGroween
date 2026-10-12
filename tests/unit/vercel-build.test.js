import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { vercelBuildEnvironment } from '../../scripts/build-vercel.js';

test('Vercel explicitly publishes the root-mounted fictional account even with conflicting host variables', () => {
  const environment = { VITE_ACCOUNT_PREVIEW: 'false', WEGROWEEN_BASE_PATH: '/WeGroween/', VERCEL_GIT_COMMIT_SHA: 'sample-commit' };
  const target = vercelBuildEnvironment(environment);
  assert.equal(target.VITE_ACCOUNT_PREVIEW, 'true');
  assert.equal(target.WEGROWEEN_BASE_PATH, '/');
  assert.equal(target.VERCEL_GIT_COMMIT_SHA, 'sample-commit');
  assert.equal(environment.VITE_ACCOUNT_PREVIEW, 'false');
  const config = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url)));
  const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url)));
  assert.equal(config.buildCommand, 'npm run build:vercel');
  assert.equal(pkg.scripts['build:vercel'], 'node scripts/build-vercel.js');
  assert.equal(config.outputDirectory, 'dist');
});
