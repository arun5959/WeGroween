import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mediaAssets } from '../../src/content/media.js';

test('every supplied delivery raster uses WebP/AVIF and has a valid file signature', () => {
  for (const asset of Object.values(mediaAssets)) for (const file of [asset, ...(asset.sources || [])]) {
    assert.match(file.filename, /\.(webp|avif)$/);
    const bytes = readFileSync(new URL('../../public/media/' + file.filename, import.meta.url));
    if (file.filename.endsWith('.webp')) {
      assert.equal(bytes.toString('ascii', 0, 4), 'RIFF');
      assert.equal(bytes.toString('ascii', 8, 12), 'WEBP');
    }
  }
  const html = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
  assert.match(html, /type="image\/webp" href="\/media\/Logo\/wegroween-favicon.webp"/);
});
