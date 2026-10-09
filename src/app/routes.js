import manifest from '../../docs/PAGE_MANIFEST.json' with { type: 'json' };

export const pages = Object.freeze(manifest.pages.map((page) => Object.freeze({ ...page })));
const parameterExamples = { slug: 'mushrooms', orderId: 'preview-order', productId: 'preview-product', customerId: 'preview-customer' };

export function examplePath(page) {
  return page.route.replace(/:([A-Za-z]+)/g, (_, name) => page.id === 'C05' ? 'button-mushrooms' : parameterExamples[name]);
}

export function normalizePath(path) {
  const cleaned = path.replace(/\/{2,}/g, '/');
  return cleaned.length > 1 ? cleaned.replace(/\/$/, '') : cleaned;
}

export function matchRoute(pathname) {
  const path = normalizePath(pathname);
  for (const page of pages) {
    for (const pattern of [page.route, ...(page.alternate_routes ?? [])]) {
      const names = [];
      const expression = pattern.split('/').map((segment) => {
        if (!segment.startsWith(':')) return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        names.push(segment.slice(1));
        return '([^/]+)';
      }).join('/');
      const matched = new RegExp(`^${expression}$`).exec(path);
      if (!matched) continue;
      try {
        const params = Object.fromEntries(names.map((name, i) => [name, decodeURIComponent(matched[i + 1])]));
        if (Object.values(params).some((value) => !/^[a-zA-Z0-9-]+$/.test(value))) return null;
        return { page, params };
      } catch { return null; }
    }
  }
  return null;
}

export function legacyDestination(pathname) {
  return manifest.legacy_redirects.find((entry) => entry.from === pathname)?.to ?? null;
}
