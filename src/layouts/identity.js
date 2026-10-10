import { brand, main, skipLink } from '../components/navigation.js';
import { icon } from '../components/icons.js';
export function identity(content) {
  return `${skipLink}<header class="container identity-header">${brand()}<a class="text-link" href="/shop">${icon('arrow-left')}Back to the catalogue</a></header>${main(`<div class="identity-content">${content}</div>`, 'container identity-layout')}`;
}
