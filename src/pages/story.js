import { brandStory } from '../content/story.js';
import { icon } from '../components/icons.js';
import { escapeHtml, link } from '../components/primitives.js';
import { storyArtwork } from '../components/story-artwork.js';

export function ourStory() {
  return `<div class="brand-story">
    <header class="container story-opening">
      <p class="eyebrow">${escapeHtml(brandStory.eyebrow)}</p>
      <h1>${escapeHtml(brandStory.title)}</h1>
      <p class="lead">${escapeHtml(brandStory.intro)}</p>
      <a class="text-link story-start" href="#story-journey">Follow the journey ${icon('arrow-right')}</a>
    </header>
    <div class="container">
      <figure class="story-overview">
        <nav class="story-stages" aria-label="Our story chapters">
          ${brandStory.chapters.map((chapter, index) => `<a class="story-stage" href="#story-chapter-${index + 1}" data-story-stage="${index}">${icon(chapter.icon)}<span>${escapeHtml(chapter.label)}</span></a>`).join('')}
        </nav>
        <figcaption>A little curiosity can grow a long way.</figcaption>
      </figure>
      <section class="story-timeline" id="story-journey" tabindex="-1" aria-label="The WeGroween journey">
        <div class="story-track" aria-hidden="true"><span class="story-progress"></span></div>
        ${brandStory.chapters.map((chapter, index) => `<article class="story-chapter" id="story-chapter-${index + 1}" aria-labelledby="story-heading-${index + 1}" data-story-chapter="${index}">
          <div class="story-art" aria-hidden="true">${storyArtwork(index)}</div>
          <div class="story-copy"><p class="eyebrow">${String(index + 1).padStart(2, '0')} · ${escapeHtml(chapter.label)}</p><h2 id="story-heading-${index + 1}">${escapeHtml(chapter.title)}</h2><p>${escapeHtml(chapter.body)}</p><p class="story-note">${escapeHtml(chapter.note)}</p></div>
        </article>`).join('')}
      </section>
    </div>
    <section class="story-closing section"><div class="container"><p class="eyebrow">Growing with purpose</p><h2>${escapeHtml(brandStory.closing)}</h2>${link(brandStory.action, '/shop')}</div></section>
  </div>`;
}
