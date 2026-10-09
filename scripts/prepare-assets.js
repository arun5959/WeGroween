import { mkdir, copyFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { mediaAssets } from '../src/content/media.js';
import { prepareLogoAssets } from './prepare-logo-assets.js';
import { prepareStoryArtwork } from './prepare-story-artwork.js';

const root = fileURLToPath(new URL('../', import.meta.url));
await prepareLogoAssets();
await prepareStoryArtwork();
// Public media is authoritative: never copy legacy photographs over user assets.
for (const { filename } of Object.values(mediaAssets)) {
  try { await access(resolve(root, 'public/media', filename)); }
  catch { throw new Error(`Missing supplied media: public/media/${filename}`); }
  if (filename.startsWith('story/paper/') && filename.endsWith('-1536.webp')) {
    const small = filename.replace('-1536.webp', '-768.webp');
    try { await access(resolve(root, 'public/media', small)); }
    catch { throw new Error(`Missing responsive story artwork: public/media/${small}`); }
  }
}
await mkdir(resolve(root, 'public/fonts'), { recursive: true });
for (const name of ['fraunces-latin-variable.woff2', 'fraunces-latin-italic-variable.woff2', 'dm-sans-latin-variable.woff2']) {
  try { await copyFile(resolve(root, 'design-system/assets', name), resolve(root, 'public/fonts', name), constants.COPYFILE_EXCL); }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
}
await mkdir(resolve(root, 'public/icons'), { recursive: true });
await copyFile(resolve(root, 'design-system/icons/icons.svg'), resolve(root, 'public/icons/field-notes.svg'));
console.log('Validated public media; prepared the canonical Field Notes icon sprite and missing local fonts.');
