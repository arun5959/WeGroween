import { brand, main, skipLink, navLink } from '../components/navigation.js';
export function checkout(content, context) {
  return `${skipLink}<header class="site-header"><div class="container header-inner">${brand()}${navLink('Continue shopping', '/shop', context.path)}${navLink('Contact', '/help', context.path)}</div></header>${main(`<div class="container section">${content}</div>`, 'checkout-layout')}<footer class="container compact-footer">Ordering is not open in this local preview.</footer>`;
}
