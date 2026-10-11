import { icon } from './icons.js';
import { categories } from '../content/foundation.js';
import { escapeHtml } from './primitives.js';

export function headerSearchMarkup() {
  return `<form class="header-search-form" role="search" hidden data-header-search autocomplete="off">
    <div class="header-search-field">${icon('search')}<label class="header-search-sr" for="header-search-input">Search products</label><input id="header-search-input" type="search" name="q" placeholder="Search mushrooms, microgreens…" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="header-search-list" autocomplete="off" maxlength="120"><button class="header-search-close" type="button" aria-label="Close search">${icon('close')}</button></div>
    <div class="header-search-panel" data-header-search-panel hidden data-lenis-prevent>
      <p class="header-search-count" data-header-search-count></p><ul id="header-search-list" class="header-search-list" role="listbox" aria-label="Matching products"></ul>
      <div class="header-search-empty" data-header-search-empty hidden><p data-header-search-message></p><p class="header-search-recovery-label">Explore the catalogue</p><div class="header-search-categories">${categories.map(category => `<a href="/shop/category/${category.slug}">${escapeHtml(category.name)}</a>`).join('')}</div></div>
    </div>
    <p class="header-search-sr" role="status" aria-live="polite" aria-atomic="true" data-header-search-status></p>
  </form>`;
}
