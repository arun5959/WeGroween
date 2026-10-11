import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSearch, searchCatalogue } from '../../src/app/catalogue-search.js';
import { renderPage } from '../../src/app/render-page.js';
import { pages, matchRoute } from '../../src/app/routes.js';

test('catalogue search normalizes input and searches only actual public records', () => {
  assert.equal(normalizeSearch('  RÁDISH--Microgreens  '), 'radish microgreens');
  for (const query of ['', ' ', 'a', 'pear']) assert.deepEqual(searchCatalogue(query), []);
  assert.deepEqual(new Set(searchCatalogue('mushroom').map(product => product.slug)), new Set(['button-mushrooms', 'oyster-mushrooms', 'white-oyster-mushrooms', 'golden-oyster-mushrooms', 'mushroom-microgreen-pairing', 'oyster-radish-pairing']));
  assert.deepEqual(searchCatalogue('RADISH micro').map(product => product.slug), ['radish-microgreens', 'oyster-radish-pairing']);
  assert.deepEqual(searchCatalogue('mushroom radish').map(product => product.slug), ['oyster-radish-pairing']);
});
test('ranking prioritizes exact names and aliases require all query words', () => {
  const records = [
    { slug: 'a', name: 'Fresh mushrooms', category: 'produce' },
    { slug: 'b', name: 'Mushrooms', category: 'produce' },
    { slug: 'c', name: 'Mushrooms selection', category: 'produce' },
    { slug: 'd', name: 'Oyster crop', category: 'produce', searchAliases: ['mushrooms'] },
  ];
  assert.deepEqual(searchCatalogue('mushrooms', records).map(product => product.slug), ['b', 'c', 'a', 'd']);
  assert.deepEqual(searchCatalogue('oyster mushrooms', records).map(product => product.slug), ['d']);
});
test('search is a shared interface state and old search paths render the shop entry', () => {
  assert.equal(pages.length, 36);
  assert.equal(matchRoute('/search'), null);
  assert.equal(renderPage('/search').pageId, 'C02');
  assert.doesNotMatch(renderPage('/search').html, /catalogue-search|Search the catalogue\./);
});
