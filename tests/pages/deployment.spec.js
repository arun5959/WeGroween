import { test, expect } from '@playwright/test';
import { siteUrl } from '../../src/app/hosting.js';

test('mounted navigation, history, search, and cart stay at the publishing address', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(siteUrl('/'));
  await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C01');
  await page.locator('#site-navigation').getByRole('link', { name: 'Shop', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(siteUrl('/shop') + '$'));
  await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C02');
  await page.goBack();
  await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C01');
  await page.goto(siteUrl('/search?q=radish'));
  await expect(page).toHaveURL(new RegExp(siteUrl('/shop') + '\\?q=radish$'));
  await expect(page.getByLabel('Search products')).toHaveValue('radish');
  await expect(page.locator('[role="option"]')).toContainText('Radish microgreens');
  await page.goto(siteUrl('/'));
  await page.locator('.header-actions').getByRole('link', { name: 'Cart', exact: true }).click();
  await expect(page.locator('#cart-drawer')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#cart-drawer')).not.toBeVisible();
  expect(errors).toEqual([]);
});

test('direct routes, assets, legacy redirects, denied access, and unknown pages survive static hosting', async ({ page, request }) => {
  for (const path of ['/shop', '/our-farm', '/help', '/products/button-mushrooms', '/cart', '/sign-in', '/account', '/admin', '/checkout']) {
    const response = await page.goto(siteUrl(path));
    expect(response.status()).toBe(200);
    await expect(page.locator('#app')).not.toHaveAttribute('data-page-id', '404');
    const images = await page.locator('img').evaluateAll(images => Promise.all(images.map(image => new Promise(resolve => { image.loading = 'eager'; if (image.complete) resolve(image.naturalWidth > 0); else { image.onload = () => resolve(true); image.onerror = () => resolve(false); } }))));
    expect(images.every(Boolean)).toBe(true);
    if (['/account', '/admin', '/checkout'].includes(path)) await expect(page.locator('#app')).toHaveAttribute('data-status', '403');
    const rootUrls = await page.locator('[href], [src]').evaluateAll(elements => elements.flatMap(element => ['href', 'src'].map(attribute => element.getAttribute(attribute)).filter(value => value?.startsWith('/') && !value.startsWith('//'))));
    expect(rootUrls.every(value => value.startsWith(siteUrl('/')))).toBe(true);
  }
  for (const file of ['/icons/field-notes.svg', '/fonts/dm-sans-latin-variable.woff2', '/media/Logo/wegroween-favicon.svg']) expect((await request.get(siteUrl(file))).status()).toBe(200);
  await page.goto(siteUrl('/mushrooms.html'));
  await expect(page).toHaveURL(new RegExp(siteUrl('/shop/category/mushrooms') + '$'));
  const unknown = await page.goto(siteUrl('/unknown-release-path'));
  expect(unknown.status()).toBe(404);
  await expect(page.locator('#app')).toHaveAttribute('data-status', '404');
  const dynamicDenied = await page.goto(siteUrl('/admin/orders/example-order'));
  expect(dynamicDenied.status()).toBe(404);
  await expect(page.locator('#app')).toHaveAttribute('data-status', '403');
});

test('public pages render without JavaScript on mobile', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  for (const path of ['/', '/shop', '/our-farm', '/help']) {
    const response = await page.goto(`http://127.0.0.1:4183${siteUrl(path)}`);
    expect(response.status()).toBe(200);
    await expect(page.locator('main h1')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await context.close();
});
