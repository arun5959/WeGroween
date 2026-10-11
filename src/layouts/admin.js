import { brand, main, skipLink, navLink } from '../components/navigation.js';
import { icon } from '../components/icons.js';
export function admin(content, context) {
  const links = [['Overview', '/admin'], ['Orders', '/admin/orders'], ['Products', '/admin/products'], ['Categories', '/admin/categories'], ['Inventory', '/admin/inventory'], ['Customers', '/admin/customers'], ['Restaurant Supply', '/admin/restaurant-supply'], ['Promotions', '/admin/promotions'], ['Delivery', '/admin/delivery'], ['Reports', '/admin/reports'], ['Settings', '/admin/settings']];
  const glyphs = ['cloche', 'receipt', 'produce', 'filter', 'package', 'account', 'microgreens', 'plus', 'delivery', 'calendar', 'information'];
  return `${skipLink}<div class="admin-layout operations-shell"><aside class="admin-sidebar">${brand()}<p class="eyebrow">Operations</p><nav class="side-navigation" aria-label="Admin navigation">${links.map(([label, href], i) => navLink(`${label}`, href, context.path, glyphs[i])).join('')}</nav></aside><div class="admin-workspace"><header class="admin-topbar"><span>WeGroween administration${context.development ? ' · Sample workspace' : ''}</span><a class="text-link" href="/">View storefront ${icon('arrow-right')}</a></header>${main(context.development ? content : `<div class="work-page">${content}</div>`)}</div></div>`;
}
