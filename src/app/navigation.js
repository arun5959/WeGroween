import { isSitePath } from './hosting.js';

export function safeReturnPath(value, fallback = '/account') {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u0020]/.test(value)) return fallback;
  try {
    const parsed = new URL(value, 'https://wegroween.invalid');
    if (parsed.origin !== 'https://wegroween.invalid' || parsed.pathname.startsWith('/sign-in')) return fallback;
    return parsed.pathname + parsed.search + parsed.hash;
  } catch { return fallback; }
}

export function shouldHandleLink(event, anchor, currentUrl) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (!anchor || anchor.hasAttribute('download') || (anchor.target && anchor.target !== '_self')) return false;
  const url = new URL(anchor.href, currentUrl);
  return url.origin === currentUrl.origin && isSitePath(url.pathname) && !url.hash && url.protocol === currentUrl.protocol;
}
