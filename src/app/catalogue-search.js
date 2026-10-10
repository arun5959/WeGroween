import { products } from '../content/foundation.js';

export function normalizeSearch(value) {
  return String(value ?? '').normalize('NFKD').replace(/\p{M}/gu, '').toLocaleLowerCase('en').replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}

export function searchCatalogue(query, records = products) {
  const normalized = normalizeSearch(query);
  if (normalized.length < 2) return [];
  const words = normalized.split(' ');
  return records.map(product => {
    const name = normalizeSearch(product.name);
    const searchable = normalizeSearch([product.name, product.category, ...(product.searchAliases ?? [])].join(' '));
    if (!words.every(word => searchable.includes(word))) return null;
    const rank = name === normalized ? 0 : name.startsWith(normalized) ? 1 : name.includes(normalized) ? 2 : 3;
    return { product, rank };
  }).filter(Boolean).sort((a, b) => a.rank - b.rank || a.product.name.localeCompare(b.product.name)).map(match => match.product);
}
