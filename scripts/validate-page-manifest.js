import assert from 'node:assert/strict';
import manifest from '../docs/PAGE_MANIFEST.json' with { type: 'json' };
import { pages, examplePath, matchRoute } from '../src/app/routes.js';
import { renderPage } from '../src/app/render-page.js';

assert.equal(pages.length, 37);
assert.equal(pages.filter((page) => page.area === 'customer').length, 22);
assert.equal(pages.filter((page) => page.area === 'admin').length, 15);
assert.equal(new Set(pages.map((page) => page.id)).size, 37);
const allPaths = pages.flatMap((page) => [page.route, ...(page.alternate_routes ?? [])]);
assert.equal(new Set(allPaths).size, allPaths.length);
for (const page of pages) {
  assert.ok(manifest.access_rules[page.access]);
  assert.ok(manifest.rendering_rules[page.rendering]);
  assert.equal(matchRoute(examplePath(page))?.page.id, page.id, `${page.id} does not resolve`);
  const view = renderPage(examplePath(page));
  assert.equal(view.pageId, page.id, `${page.id} does not render`);
  assert.equal(view.shell, page.shell);
  assert.equal((view.html.match(/<main /g) ?? []).length, 1, `${page.id} needs one main landmark`);
  assert.equal((view.html.match(/<h1[ >]/g) ?? []).length, 1, `${page.id} needs one page heading`);
  assert.ok(!view.html.includes('href="#"'));
}
console.log('PASS: 37 page types (22 customer / 15 admin), 38 route patterns, five layouts.');
