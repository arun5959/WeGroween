import { test, expect } from '@playwright/test';
import { siteUrl } from '../../src/app/hosting.js';

test('rendered pages load modern raster images without missing images or legacy raster requests', async ({ page }) => {
  const rasterRequests = [], errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (request.resourceType() === 'image') rasterRequests.push(request.url()); });
  for (const route of ['/', '/shop', '/products/button-mushrooms', '/our-farm', '/restaurant-supply', '/help', '/account', '/admin', '/admin/products']) {
    await page.goto(siteUrl(route));
    await expect(page.locator('#app')).toHaveAttribute('data-status', /200|403/);
    const loaded = await page.locator('img').evaluateAll(images => Promise.all(images.map(image => new Promise(resolve => {
      image.loading = 'eager';
      if (image.complete) resolve(image.naturalWidth > 0);
      else { image.onload = () => resolve(true); image.onerror = () => resolve(false); }
    }))));
    expect(loaded.every(Boolean), route).toBe(true);
    const legacy = await page.locator('img').evaluateAll(images => images.filter(image => /\.(png|jpe?g|gif|bmp)(?:$|[?#])/i.test(image.currentSrc)).map(image => image.currentSrc));
    expect(legacy, route).toEqual([]);
  }
  expect(rasterRequests.filter(url => /\.(png|jpe?g|gif|bmp)(?:$|[?#])/i.test(url))).toEqual([]);
  expect(errors).toEqual([]);
});
