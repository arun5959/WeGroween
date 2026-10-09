import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchRoute, examplePath, pages, legacyDestination } from '../../src/app/routes.js';
import { safeReturnPath } from '../../src/app/navigation.js';
import { renderPage } from '../../src/app/render-page.js';
import { escapeHtml } from '../../src/components/primitives.js';

test('manifest resolves every type and product create/edit modes without collision', () => {
  for (const page of pages) assert.equal(matchRoute(examplePath(page)).page.id, page.id);
  assert.equal(matchRoute('/admin/products/new').page.id, 'A06');
  assert.equal(matchRoute('/admin/products/real-product/edit').page.id, 'A06');
  assert.equal(matchRoute('/shop/').page.id, 'C02');
  assert.equal(matchRoute('/account/orders/order-123').params.orderId, 'order-123');
});

test('invalid route parameters and unpublished catalogue records return not-found', () => {
  for (const path of ['/products/%', '/products/%2Fadmin', '/products/%3Cscript%3E', '/admin/orders/a/b']) assert.equal(matchRoute(path), null);
  for (const path of ['/not-real', '/products/not-published', '/shop/category/not-published']) assert.equal(renderPage(path).status, 404);
});

test('all protected pages deny access and collect no credentials or private data', () => {
  for (const page of pages.filter((entry) => ['customer', 'customer-or-guest', 'staff'].includes(entry.access))) {
    const view = renderPage(examplePath(page));
    assert.equal(view.status, 403);
    assert.match(view.html, /Sign-in required/);
    assert.doesNotMatch(view.html, /<input/);
  }
});

test('internal return destinations reject external, backslash and control-character inputs', () => {
  for (const value of ['https://evil.invalid', '//evil.invalid', '/\\evil.invalid', '/\nevil.invalid', '/sign-in?returnTo=/sign-in']) assert.equal(safeReturnPath(value), '/account');
  assert.equal(safeReturnPath('/account/orders?page=2'), '/account/orders?page=2');
});

test('user-origin content is escaped and developer review is disabled outside development', () => {
  assert.equal(escapeHtml('<img onerror="alert(1)">'), '&lt;img onerror=&quot;alert(1)&quot;&gt;');
  assert.equal(renderPage('/__foundation').status, 404);
  assert.equal(renderPage('/__foundation', { development: true }).pageId, 'development');
  assert.equal(legacyDestination('/mushrooms.html'), '/shop/category/mushrooms');
});
