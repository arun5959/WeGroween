import { catalogueSortOptions } from './catalogue-sort.js';

export function shopQuery(search = '') {
  const query = new URLSearchParams(search);
  const sort = catalogueSortOptions.some(([value]) => value === query.get('sort')) ? query.get('sort') : 'selection';
  return { view: query.get('view') === 'all' ? 'all' : 'selections', sort };
}

export function shopDestination(category = 'all', view = 'all', sort = 'selection') {
  const path = category === 'all' ? '/shop' : `/shop/category/${category}`;
  const query = new URLSearchParams();
  if (category === 'all' && view === 'all') query.set('view', 'all');
  if (view === 'all' && sort !== 'selection') query.set('sort', sort);
  return path + (query.size ? `?${query}` : '');
}
