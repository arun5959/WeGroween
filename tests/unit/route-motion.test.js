import { test } from 'node:test';
import assert from 'node:assert/strict';
import { desktopPageOrder, pageMotionDirection } from '../../src/app/route-motion-order.js';

test('all thirty cross-section directions follow the user ordered page sequence', () => {
  desktopPageOrder.forEach((from, a) => desktopPageOrder.forEach((to, b) => {
    assert.equal(pageMotionDirection(from, to), a === b ? null : b > a ? 'forward' : 'backward');
  }));
});

test('route families, legacy paths and query strings keep their section position', () => {
  assert.equal(pageMotionDirection('/products/button-mushrooms', '/help'), 'forward');
  assert.equal(pageMotionDirection('/account/orders', '/our-farm'), 'backward');
  assert.equal(pageMotionDirection('/sign-in', '/shop/'), 'backward');
  assert.equal(pageMotionDirection('/mushrooms.html', '/restaurant-supply'), 'forward');
  assert.equal(pageMotionDirection('/shop', '/search?q=mushrooms'), null);
  assert.equal(pageMotionDirection('/help', '/cart'), null);
  assert.equal(pageMotionDirection('/shopping', '/help'), null);
});
