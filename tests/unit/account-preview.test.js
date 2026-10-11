import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderPage } from '../../src/app/render-page.js';
import { createSampleAccount, orderTotal } from '../../src/content/sample-account.js';

test('assumed session uses sample data only in development and production accounts remain protected', () => {
  assert.equal(renderPage('/__account-preview').status, 404);
  assert.doesNotMatch(renderPage('/__account-preview').html, /SAMPLE-1042|aarav@example.invalid/);
  const preview = renderPage('/__account-preview', { development: true });
  assert.equal(preview.status, 200);
  assert.match(preview.html, /Fictional orders, prices and addresses/);
  for (const path of ['/account', '/account/addresses', '/account/orders', '/account/orders/SAMPLE-1042']) {
    assert.equal(renderPage(path).status, 403);
    const local = renderPage(path, { development: true });
    assert.equal(local.status, 200);
    assert.match(local.html, /data-account-assumed-session="true"/);
    assert.doesNotMatch(local.html, /Go to sign in|Explore the sample account/);
  }
  assert.equal(renderPage('/account/orders/unknown', { development: true }).status, 404);
  assert.equal(renderPage('/admin').status, 403);
  assert.equal(renderPage('/admin', { development: true }).status, 200);
  assert.match(renderPage('/admin', { development: true }).html, /Fictional records/);
});
test('sample data resets from an independent fixture and totals reflect line quantities', () => {
  const first = createSampleAccount();
  first.profile.name = 'Changed';
  first.addresses.length = 0;
  assert.equal(createSampleAccount().profile.name, 'Aarav Sample');
  assert.equal(createSampleAccount().addresses.length, 2);
  assert.equal(orderTotal(first.orders[0]), 330);
});
