import { normalizePath, legacyDestination } from './routes.js';
import { appPath } from './hosting.js';

export const desktopPageOrder = Object.freeze(['/', '/shop', '/our-farm', '/restaurant-supply', '/help', '/account']);

function position(value) {
  const pathname = normalizePath(appPath(new URL(value, 'https://wegroween.invalid').pathname));
  const path = legacyDestination(pathname) ?? pathname;
  if (path === '/') return 0;
  if (path === '/shop' || path.startsWith('/shop/') || path.startsWith('/products/') || path === '/search') return 1;
  if (path === '/our-farm') return 2;
  if (path === '/restaurant-supply') return 3;
  if (path === '/help') return 4;
  if (path === '/account' || path.startsWith('/account/') || ['/sign-in', '/register', '/recover-password'].includes(path)) return 5;
  return null;
}

export function pageMotionDirection(from, to) {
  const start = position(from), end = position(to);
  if (start === null || end === null || start === end) return null;
  return end > start ? 'forward' : 'backward';
}
