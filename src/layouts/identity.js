import { brand, main, skipLink } from '../components/navigation.js';
export function identity(content) {
  return `${skipLink}<header class="container identity-header">${brand()}<a href="/">Back to the catalogue</a></header>${main(`<div class="identity-content">${content}</div>`, 'container identity-layout')}`;
}
