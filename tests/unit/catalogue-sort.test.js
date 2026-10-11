import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sortCatalogue } from '../../src/app/catalogue-sort.js';

const records = [
  { slug: 'z', name: 'Zebra', samplePrice: 190 },
  { slug: 'b', name: 'button mushrooms', samplePrice: 140 },
  { slug: 'a', name: 'Amber', samplePrice: 190 },
  { slug: 'u', name: 'Unknown' },
];
const ids = products => products.map(product => product.slug);

test('name and price sorts preserve equal-price curation and never mutate the catalogue', () => {
  assert.deepEqual(ids(sortCatalogue(records, 'name-asc')), ['a', 'b', 'u', 'z']);
  assert.deepEqual(ids(sortCatalogue(records, 'name-desc')), ['z', 'u', 'b', 'a']);
  assert.deepEqual(ids(sortCatalogue(records, 'price-asc')), ['b', 'z', 'a', 'u']);
  assert.deepEqual(ids(sortCatalogue(records, 'price-desc')), ['z', 'a', 'b', 'u']);
  assert.deepEqual(ids(sortCatalogue(records, 'selection')), ['z', 'b', 'a', 'u']);
  assert.deepEqual(ids(records), ['z', 'b', 'a', 'u']);
});

test('availability puts available items first, sold-out next and unconfirmed last without inventing stock', () => {
  assert.deepEqual(ids(sortCatalogue(records, 'availability')), ids(records));
  const inventory = [{ id: 'z', stock: 0 }, { id: 'b', stock: 10 }, { id: 'a', stock: 1 }];
  assert.deepEqual(ids(sortCatalogue(records, 'availability', { inventory })), ['b', 'a', 'z', 'u']);
  const confirmed = records.map(product => ({ ...product, availability: product.slug === 'a' ? 'available' : product.slug === 'z' ? 'unavailable' : undefined }));
  assert.deepEqual(ids(sortCatalogue(confirmed, 'availability')), ['a', 'z', 'b', 'u']);
  assert.deepEqual(ids(sortCatalogue(records, 'price-asc', { inventory: [{ id: 'z', price: 10 }] })), ['z', 'b', 'a', 'u']);
});
