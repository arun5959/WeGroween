import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const folder = fileURLToPath(new URL('../public/media/Logo/', import.meta.url));

// SVG viewports remove spare canvas around the cleaned raster artwork without
// resampling or redrawing the supplied logo. Embedded PNGs keep each SVG portable.
export async function prepareLogoAssets() {
  for (const asset of [
    { source: 'wegroween-header-logo.png', output: 'wegroween-header.svg', width: 2176, height: 723, viewBox: '32 119 2111 460', canvasWidth: 2111, canvasHeight: 460 },
    { source: 'wegroween-footer-logo.png', output: 'wegroween-footer.svg', width: 2079, height: 756, viewBox: '35 128 2018 514', canvasWidth: 2018, canvasHeight: 514 },
    { source: 'wegroween-brand-mark.png', output: 'wegroween-favicon.svg', width: 1254, height: 1254, viewBox: '0 0 1254 1254', canvasWidth: 1254, canvasHeight: 1254, background: '#FBF4E8' },
  ]) {
    const png = await readFile(resolve(folder, asset.source));
    if (png.readUInt32BE(16) !== asset.width || png.readUInt32BE(20) !== asset.height) {
      throw new Error(`Logo dimensions changed: ${asset.source}. Review its viewport before building.`);
    }
    const background = asset.background ? `<rect width="${asset.canvasWidth}" height="${asset.canvasHeight}" fill="${asset.background}"/>` : '';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${asset.canvasWidth}" height="${asset.canvasHeight}" viewBox="${asset.viewBox}">${background}<image width="${asset.width}" height="${asset.height}" href="data:image/png;base64,${png.toString('base64')}"/></svg>\n`;
    await writeFile(resolve(folder, asset.output), svg);
  }
}
