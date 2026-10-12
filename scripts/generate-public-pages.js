import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages } from '../src/app/routes.js';
import { renderPage } from '../src/app/render-page.js';
import { categories, products } from '../src/content/foundation.js';
import { escapeHtml } from '../src/components/primitives.js';
import manifest from '../docs/PAGE_MANIFEST.json' with { type: 'json' };
import { siteUrl } from '../src/app/hosting.js';
import { publishedOperationsPreview } from '../src/app/operations-review-config.js';
import { developmentWorkspace } from '../src/content/development-workspace.js';
import { publishedAccountPreview } from '../src/app/account-review-config.js';
import { sampleAccount } from '../src/content/sample-account.js';

const output = fileURLToPath(new URL('../dist/', import.meta.url));
const template = await readFile(resolve(output, 'index.html'), 'utf8');
assertMarker(template);
const publicPaths = pages.filter((page) => page.rendering === 'public-html-live-data' && !page.route.includes(':')).map((page) => page.route);
publicPaths.push(...categories.map((item) => `/shop/category/${item.slug}`), ...products.map((item) => `/products/${item.slug}`));

function documentFor(path) {
  const view = renderPage(path);
  return template.replace('<!--page-content-->', view.html)
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(view.title)} · WeGroween</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeHtml(view.description)}">`);
}
// Static hosts need entry documents for concrete client routes on reload too.
const staticPaths = [...new Set([...publicPaths, ...pages.flatMap(page => [page.route, ...(page.alternate_routes ?? [])]).filter(route => !route.includes(':'))])];
if (publishedAccountPreview) staticPaths.push(...sampleAccount.orders.map(order => `/account/orders/${order.id}`));
if (publishedOperationsPreview) staticPaths.push(...developmentWorkspace.orders.map(order => `/admin/orders/${order.id}`), ...developmentWorkspace.products.map(product => `/admin/products/${product.id}/edit`), ...developmentWorkspace.customers.map(customer => `/admin/customers/${customer.id}`));
// Old search URLs hydrate the Shop entry and reopen the header with their query.
staticPaths.push('/search', '/shop/category/combos');
for (const path of staticPaths) {
  const folder = resolve(output, `.${path}`);
  await mkdir(folder, { recursive: true });
  await writeFile(resolve(folder, 'index.html'), documentFor(path));
}
await writeFile(resolve(output, '404.html'), documentFor('/unknown-page'));
// Client-only routes start from an empty shell, never stale prerendered homepage content.
await writeFile(resolve(output, 'app-shell.html'), template);
for (const { from, to } of manifest.legacy_redirects.filter(entry => entry.from !== '/index.html')) {
  const target = escapeHtml(siteUrl(to));
  await writeFile(resolve(output, `.${from}`), `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="robots" content="noindex, nofollow"><meta http-equiv="refresh" content="0; url=${target}"><link rel="canonical" href="${target}"><title>WeGroween</title></head><body><p><a href="${target}">Continue to the catalogue</a></p></body></html>`);
}
await writeFile(resolve(output, '.nojekyll'), '');
await writeFile(resolve(output, 'release.json'), JSON.stringify({ commit: process.env.GITHUB_SHA ?? process.env.VERCEL_GIT_COMMIT_SHA ?? null, basePath: siteUrl('/'), stage: 'foundation', accountPreview: publishedAccountPreview, operationsPreview: publishedOperationsPreview }, null, 2));
await writeFile(resolve(output, 'prerender-manifest.json'), JSON.stringify({ stage: 'foundation', publicPaths, staticPaths, robots: 'noindex, nofollow' }, null, 2));
console.log(`Generated ${publicPaths.length} public HTML routes, ${staticPaths.length} static entries, legacy redirects, 404.html and client app shell. All remain noindex pending launch.`);

function assertMarker(source) {
  if (!source.includes('<!--page-content-->')) throw new Error('Vite HTML output lost the public-page insertion marker.');
}
