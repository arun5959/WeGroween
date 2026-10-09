import { brand, main, skipLink, navLink } from '../components/navigation.js';
export function admin(content, context) {
  const links = [['Overview', '/admin'], ['Orders', '/admin/orders'], ['Products', '/admin/products'], ['Categories', '/admin/categories'], ['Inventory', '/admin/inventory'], ['Customers', '/admin/customers'], ['Restaurant Supply', '/admin/restaurant-supply'], ['Promotions', '/admin/promotions'], ['Delivery', '/admin/delivery'], ['Reports', '/admin/reports'], ['Settings', '/admin/settings']];
  return `${skipLink}<div class="admin-layout"><aside class="admin-sidebar">${brand()}<p class="eyebrow">Operations</p><nav class="side-navigation" aria-label="Admin navigation">${links.map(([label, href]) => navLink(label, href, context.path)).join('')}</nav></aside><div class="admin-workspace"><header class="admin-topbar"><span>WeGroween administration</span><a href="/">View storefront</a></header>${main(`<div class="section">${content}</div>`)}</div></div>`;
}
