// Application routes stay independent of the host's project-directory prefix.
const configuredBase = import.meta.env?.BASE_URL ?? (typeof process !== 'undefined' ? process.env.WEGROWEEN_BASE_PATH : undefined) ?? '/';
export const basePath = `/${configuredBase.split('/').filter(Boolean).join('/')}${configuredBase.split('/').filter(Boolean).length ? '/' : ''}`;

export function siteUrl(value) {
  if (!value.startsWith('/') || value.startsWith('//') || basePath === '/') return value;
  if (value === basePath.slice(0, -1) || value.startsWith(basePath)) return value;
  return basePath + value.slice(1);
}

export function isSitePath(path) {
  return basePath === '/' || path === basePath.slice(0, -1) || path.startsWith(basePath);
}

export function appPath(path) {
  if (basePath === '/' || !isSitePath(path)) return path;
  return '/' + path.slice(basePath.length);
}

export function mountHtml(html) {
  if (basePath === '/') return html;
  return html.replace(/\b(href|src|action)="(\/(?!\/)[^"]*)"/g, (_, attribute, value) => `${attribute}="${siteUrl(value)}"`)
    .replace(/\bsrcset="([^"]*)"/g, (_, sources) => `srcset="${sources.replace(/(^|,\s*)(\/(?!\/)[^\s,]+)/g, (_, separator, value) => separator + siteUrl(value))}"`);
}
