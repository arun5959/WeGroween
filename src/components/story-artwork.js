import { icon } from './icons.js';
import { mediaAssets } from '../content/media.js';

// Retain the earlier Field Notes scenes as standalone rollback exports.
export function storyIllustration(index, prefix = '/icons/field-notes.svg#') {
  const glyph = (name, x, y, size) => `<use href="${prefix}wg-${name}" x="${x}" y="${y}" width="${size}" height="${size}"/>`;
  const scenes = {
    0: `${glyph('microgreens', 169, 56, 142)}<path class="story-scene-line" d="M159 196h162l-13 62H172l-13-62Z"/><path class="story-detail" d="M123 277h234"/>`,
    1: `${glyph('microgreens', 79, 67, 124)}${glyph('mushroom', 277, 70, 118)}<path class="story-scene-line" d="M72 199h143l-10 44H82l-10-44Zm196 0h141l-10 44H278l-10-44Z"/><path class="story-detail" d="M55 264h370"/>`,
    2: `${glyph('microgreens', 36, 123, 70)}${glyph('basket', 172, 85, 136)}${glyph('cloche', 371, 126, 74)}${glyph('arrow-right', 123, 149, 28)}${glyph('arrow-right', 331, 149, 28)}`,
    4: `<ellipse class="story-scene-line" cx="240" cy="165" rx="147" ry="96"/><ellipse class="story-detail" cx="240" cy="165" rx="126" ry="77"/>${glyph('microgreens', 166, 103, 86)}${glyph('mushroom', 232, 168, 76)}${glyph('fruit', 276, 98, 64)}`,
  };
  if (!(index in scenes)) throw new Error(`No story illustration for stage ${index + 1}`);
  return `<svg class="story-illustration" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="round">${scenes[index]}</svg>`;
}

export function storyArtwork(index) {
  // Stage 4 preserves the chosen brand panel: label, supplied logo and crop motif.
  if (index === 3) return `<div class="story-art-panel story-art-panel--brand"><p class="story-art-label">The idea gained a name</p><img class="story-brand-logo" src="${mediaAssets.logoHeader.src}" alt="" width="2111" height="460" decoding="async"><div class="story-brand-crops">${icon('microgreens')}<span></span>${icon('mushroom')}</div></div>`;
  const labels = ['A terrace beginning', 'Microgreens and mushrooms', 'From crops to kitchens', '', 'Care, brought to the table'];
  const artwork = { 0: mediaAssets.storyTerrace, 1: mediaAssets.storyIndoor, 2: mediaAssets.storyPurpose, 4: mediaAssets.storyTable }[index];
  if (!artwork) throw new Error(`No story artwork for stage ${index + 1}`);
  const small = artwork.src.replace('-1536.webp', '-768.webp');
  // Supporting symbolic artwork is decorative; the adjacent copy tells the story.
  return `<div class="story-art-panel story-art-panel--paper"><p class="story-art-label">${labels[index]}</p><img class="story-paper-illustration" src="${artwork.src}" srcset="${small} 768w, ${artwork.src} 1536w" sizes="(max-width: 720px) calc(100vw - 64px), (max-width: 1280px) calc((100vw - 160px) / 2), 560px" alt="" width="1536" height="1024" loading="lazy" decoding="async"></div>`;
}
