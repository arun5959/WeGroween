import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, 'svg');

const icons = {
  mushroom: '<path d="M4 11.2c.5-4.4 3.5-7 8.1-7.1 4.4-.1 7.4 2.5 7.9 7.1-2.4.7-5.1.9-7.9.8-2.9.1-5.6-.1-8.1-.8Z"/><path d="M10.1 12c.2 2.7-.1 5.4-1.3 7.8 2.1.4 4.2.4 6.4 0-1.1-2.4-1.5-5.1-1.2-7.8"/><path d="M7.3 10.8c.4-1.6 1.5-2.6 3.1-3.2M16.9 10.6c-.3-1.1-.9-2-1.8-2.7"/>',
  microgreens: '<path d="M4 20h16M8.4 19.8c.1-4.8-.7-8.2-2.5-10.3M12 20c0-7.1 1-11.6 3.1-13.7M16.2 20c-.1-3.9.7-6.9 2.3-8.9"/><path d="M5.9 9.5c-2.4-.1-3.8-1.2-4.1-3.2 2.5-.4 4.3.7 4.1 3.2ZM15.1 6.3c-2.2-.8-3.2-2.3-2.8-4.3 2.5.4 3.7 1.9 2.8 4.3ZM18.5 11.1c1.9-1.3 3.6-1.2 5 .3-1.5 1.8-3.3 1.7-5-.3Z"/>',
  produce: '<path d="M9.1 7.2c-2.7 2.7-4.3 7.1-3.5 11.6 4.6.8 8.9-.9 11.5-3.7 2.1-2.3 2.3-5 .6-6.7-1.7-1.8-5.4-3.4-8.6-1.2Z"/><path d="M10.2 6.6C8.5 4.8 8.5 3 10.1 1.6c1.9 1.7 2 3.5.1 5ZM12.2 6.1c1.5-2.1 3.3-2.7 5.4-1.7-1.1 2.3-2.9 2.9-5.4 1.7ZM8.2 16.7l7.4-7.2"/>',
  fruit: '<path d="M12.3 6.1c-2.9.1-3.8 2.1-4.2 4.1-.3 1.6-1.7 2.8-2 5.1-.4 3 2 5 5.9 5s6.3-2 5.9-5c-.3-2.3-1.7-3.5-2-5.1-.4-2-1.3-4-3.6-4.1Z"/><path d="M12.2 6c-.2-2.2.5-3.8 2.2-4.8M14.3 3.1c1.9-.8 3.5-.4 4.6 1.1-1.8 1.2-3.4.8-4.6-1.1Z"/>',
  exotic: '<path d="m12 3 1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8L12 3Z"/><path d="m18.5 15 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2ZM5.2 3.5l.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6.6-1.7Z"/>',
  cloche: '<path d="M3 17.5h18M5 16.5c.2-5 2.9-8.2 7-8.2s6.8 3.2 7 8.2M10 5.4c.5-.6 1.1-.9 2-.9s1.5.3 2 .9"/><path d="M8 12.5c.8-1.3 2-2 3.7-2"/>',
  basket: '<path d="M4.2 9.5h15.6l-1.6 10H5.8l-1.6-10Z"/><path d="M8.2 9.5C8.7 6.2 10 4.4 12 4.4s3.4 1.8 3.8 5.1M8 13h8M7.4 16h9.2M10 10l.5 9.5M14 10l-.5 9.5"/>',
  package: '<path d="m4 7.4 8-4 8 4v9.2l-8 4-8-4V7.4Z"/><path d="m4.4 7.5 7.6 4 7.6-4M12 11.5v9M8 5.4l8 4"/>',
  delivery: '<path d="M3 6.5h11.5v10H3zM14.5 10h3.1l3.4 3.2v3.3h-6.5z"/><path d="M6.7 19.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM17.8 19.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM5 10h5"/>',
  receipt: '<path d="M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3v-17Z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
  calendar: '<path d="M4 5.5h16v15H4zM4 9.5h16M8 3.5v4M16 3.5v4"/><path d="M9 14c1.8 0 3 .8 3 2.5M12 16.5c0-2.2 1.2-3.4 3.5-3.7"/>',
  repeat: '<path d="M19.3 8.3A7.8 7.8 0 0 0 6 5.8L4 8M4 4v4h4M4.7 15.7A7.8 7.8 0 0 0 18 18.2l2-2.2M20 20v-4h-4"/>',
  location: '<path d="M19 10c0 4.5-7 10.5-7 10.5S5 14.5 5 10a7 7 0 1 1 14 0Z"/><path d="M12 12.5a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.4 2"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.3"/><path d="m15.1 15.1 4.7 4.7"/>',
  account: '<path d="M12.1 12.2a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2ZM4.4 20c.7-4 3.2-6 7.7-6s7 2 7.5 6"/>',
  menu: '<path d="M4 6.5h16M4 12h16M4 17.5h16"/>',
  close: '<path d="m5 5 14 14M19 5 5 19"/>',
  'arrow-right': '<path d="M4 12h15M14 6.5l5.5 5.5-5.5 5.5"/>',
  'chevron-down': '<path d="m5.5 8.5 6.5 6.5 6.5-6.5"/>',
  plus: '<path d="M12 4v16M4 12h16"/>',
  minus: '<path d="M4 12h16"/>',
  check: '<path d="m4.5 12.5 4.8 4.8L19.8 6.8"/>',
  information: '<circle cx="12" cy="12" r="8.5"/><path d="M12 10.5v6M12 7.2h.01"/>',
  warning: '<path d="M11.9 3.5 21 20H3l8.9-16.5Z"/><path d="M12 9v5M12 17h.01"/>',
  error: '<circle cx="12" cy="12" r="8.5"/><path d="m8.7 8.7 6.6 6.6M15.3 8.7l-6.6 6.6"/>',
  filter: '<path d="M3.5 5h17l-6.7 7.4v5.8l-3.6 1.8v-7.6L3.5 5Z"/>',
  water: '<path d="M12 3.2S6.3 10 6.3 14.4a5.7 5.7 0 0 0 11.4 0C17.7 10 12 3.2 12 3.2Z"/><path d="M9.2 15.2c.2 1.4 1.1 2.2 2.6 2.5"/>'
};

const categories = {
  crop: ['mushroom', 'microgreens', 'produce', 'fruit', 'exotic', 'water'],
  commerce: ['cloche', 'basket', 'package', 'delivery', 'receipt', 'calendar', 'repeat', 'location', 'clock'],
  interface: ['search', 'account', 'menu', 'close', 'arrow-right', 'chevron-down', 'plus', 'minus', 'check', 'information', 'warning', 'error', 'filter']
};

const svgOpen = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="round">';

await mkdir(outDir, { recursive: true });
await Promise.all(Object.entries(icons).map(([name, body]) => writeFile(join(outDir, `${name}.svg`), `${svgOpen}${body}</svg>\n`, 'utf8')));

const sprite = `<svg xmlns="http://www.w3.org/2000/svg">\n${Object.entries(icons).map(([name, body]) => `  <symbol id="wg-${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="square" stroke-linejoin="round">${body}</symbol>`).join('\n')}\n</svg>\n`;
await writeFile(join(here, 'icons.svg'), sprite, 'utf8');

const manifest = {
  name: 'WeGroween Field Notes',
  version: '1.1.0',
  status: 'approved',
  grid: 24,
  strokeWidth: 1.75,
  linecap: 'square',
  linejoin: 'round',
  color: 'currentColor',
  sizes: [16, 20, 24, 32],
  categories,
  icons: Object.keys(icons)
};
await writeFile(join(here, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

console.log(`Generated ${Object.keys(icons).length} Field Notes icons.`);
