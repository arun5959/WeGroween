import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { storyIllustration } from '../src/components/story-artwork.js';

export async function prepareStoryArtwork() {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const [sprite, tokens] = await Promise.all([
    readFile(resolve(root, 'design-system/icons/icons.svg'), 'utf8'),
    readFile(resolve(root, 'design-system/tokens.css'), 'utf8'),
  ]);
  const palette = name => {
    const value = tokens.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]+)`))?.[1];
    if (!value) throw new Error(`Missing illustration color token: ${name}`);
    return value;
  };
  const folder = resolve(root, 'public/media/story');
  await mkdir(folder, { recursive: true });
  for (const [index, filename] of [[0, '01-terrace.svg'], [1, '02-indoor-growing.svg'], [2, '03-purpose.svg'], [4, '05-table.svg']]) {
    let svg = storyIllustration(index, '#');
    const names = new Set([...svg.matchAll(/href="#(wg-[^"]+)"/g)].map(match => match[1]));
    const symbols = [...sprite.matchAll(/<symbol\b[^>]*id="([^"]+)"[\s\S]*?<\/symbol>/g)].filter(match => names.has(match[1])).map(match => match[0]);
    if (symbols.length !== names.size) throw new Error(`Missing approved symbol in ${filename}`);
    const style = `<style>.story-illustration{color:${palette('color-brand-primary')}}.story-detail{stroke:${palette('color-border')}}</style><defs>${symbols.join('')}</defs>`;
    svg = svg.replace(/(<svg[^>]*>)/, `$1${style}`);
    await writeFile(resolve(folder, filename), svg);
  }
}
