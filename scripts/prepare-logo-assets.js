import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const folder = fileURLToPath(new URL('../public/media/Logo/', import.meta.url));

// Visible logos use lossless cropped WebP. Retain the old SVG URLs for cached
// documents, with WebP payloads rather than the previous embedded PNGs.
export async function prepareLogoAssets() {
  const assets = JSON.parse(await readFile(resolve(folder, 'webp-manifest.json'), 'utf8'));
  for (const asset of assets) {
    const source = await readFile(resolve(folder, asset.source));
    if (createHash('sha256').update(source).digest('hex') !== asset.sourceSha256) {
      throw new Error(`Logo source changed: ${asset.source}. Run scripts/prepare-modern-media.py.`);
    }
    const webp = await readFile(resolve(folder, asset.output));
    if (webp.toString('ascii', 0, 4) !== 'RIFF' || webp.toString('ascii', 8, 12) !== 'WEBP') throw new Error(`Invalid WebP logo: ${asset.output}`);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${asset.width}" height="${asset.height}" viewBox="0 0 ${asset.width} ${asset.height}"><image width="${asset.width}" height="${asset.height}" href="data:image/webp;base64,${webp.toString('base64')}"/></svg>\n`;
    await writeFile(resolve(folder, asset.output.replace('.webp', '.svg')), svg);
  }
}
