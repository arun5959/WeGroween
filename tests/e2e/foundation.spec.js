import { test, expect } from '@playwright/test';
import { pages, examplePath } from '../../src/app/routes.js';

test('active header labels grow without moving or resizing the menu items', async ({ page }) => {
  for (const width of [1440, 1050, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    let baseline;
    for (const route of ['/', '/shop', '/our-farm', '/restaurant-supply', '/help']) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      if (width <= 720) await page.getByRole('button', { name: 'Menu', exact: true }).click();
      const links = page.locator('.site-navigation > a');
      const boxes = await links.evaluateAll(elements => elements.map(element => {
        const { x, y, width, height } = element.getBoundingClientRect();
        return { x, y, width, height };
      }));
      if (!baseline) baseline = boxes;
      boxes.forEach((box, index) => {
        for (const dimension of ['x', 'y', 'width', 'height']) {
          expect(Math.abs(box[dimension] - baseline[index][dimension]), `${route} at ${width}px: link ${index} ${dimension}`).toBeLessThan(.5);
        }
      });
      if (route !== '/') {
        const active = page.locator('.site-navigation > a[aria-current="page"]');
        await expect(active).toHaveCount(1);
        await expect.poll(() => active.locator('.navigation-label').evaluate(element => new DOMMatrix(getComputedStyle(element).transform).a)).toBeCloseTo(1.04, 2);
      }
    }
  }
});

test('all current direct links load the correct page and shell without runtime errors', async ({ page }) => {
  const failures = [];
  page.on('pageerror', (error) => failures.push(error.message));
  for (const entry of pages) {
    await page.goto(examplePath(entry));
    await expect(page.locator('#app')).toHaveAttribute('data-page-id', entry.id);
    await expect(page.locator('#app')).toHaveAttribute('data-shell', entry.shell);
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    if (['customer', 'customer-or-guest', 'staff'].includes(entry.access)) {
      await expect(page.locator('#app')).toHaveAttribute('data-status', '403');
      await expect(page.getByText('Sign-in required', { exact: true })).toBeVisible();
    }
  }
  expect(failures).toEqual([]);
});

test('shopping navigation and browser back/forward preserve route and keyboard focus', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Shop this harvest' }).click();
  await expect(page).toHaveURL('/shop');
  await expect(page.locator('#main-content')).toBeFocused();
  await page.getByRole('link', { name: 'Explore mushrooms', exact: true }).click();
  await expect(page).toHaveURL('/shop/category/mushrooms');
  await page.goBack();
  await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C02');
  await page.goForward();
  await expect(page.locator('#app')).toHaveAttribute('data-page-id', 'C03');
});

test('mobile menu handles keyboard escape and every route fits 390px and 320px', async ({ page }) => {
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    for (const entry of pages) {
      await page.goto(examplePath(entry));
      await expect(page.locator('#app')).toHaveAttribute('data-page-id', entry.id);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      expect(overflow, `${entry.id} overflows at ${width}px`).toBe(false);
    }
  }
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Menu', exact: true });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('public routes render useful HTML, photos and local fonts without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const path of ['/', '/shop', '/shop/category/mushrooms', '/products/button-mushrooms']) {
    await page.goto(`http://127.0.0.1:4173${path}`);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toBeVisible();
    const brokenImages = await page.locator('img').evaluateAll((images) => images.filter((image) => !image.complete || image.naturalWidth === 0).length);
    expect(brokenImages).toBe(0);
  }
  await context.close();
});

test('phone emulation keeps hero text and header controls inside the visible viewport', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 440, height: 956 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 });
  const page = await context.newPage();
  for (const width of [440, 390, 320]) {
    await page.setViewportSize({ width, height: 956 });
    await page.goto('http://127.0.0.1:4173/');
    await page.evaluate(() => document.fonts.ready);
    const bounds = await page.evaluate(() => {
      const viewport = document.documentElement.clientWidth;
      const clipped = [...document.querySelectorAll('.mobile-header-controls a, .menu-toggle, .hero-copy h1, .hero-copy .lead, .hero-copy .action-row a')]
        .filter(el => { const rect = el.getBoundingClientRect(); return rect.left < 0 || rect.right > viewport; })
        .map(el => el.getAttribute('aria-label') || el.textContent);
      const text = document.createRange();
      text.selectNodeContents(document.querySelector('.hero-copy h1'));
      return { viewport, scrollWidth: document.documentElement.scrollWidth, clipped, headingClipped: [...text.getClientRects()].some(rect => rect.left < 0 || rect.right > viewport) };
    });
    expect(bounds.viewport).toBe(width);
    expect(bounds.scrollWidth).toBeLessThanOrEqual(width);
    expect(bounds.clipped).toEqual([]);
    expect(bounds.headingClipped).toBe(false);
    await expect(page.locator('.mobile-header-controls').getByRole('link', { name: 'Search', exact: true })).toBeVisible();
    const toggle = page.getByRole('button', { name: 'Menu', exact: true });
    await toggle.click();
    await expect(page.locator('#site-navigation').getByRole('link', { name: 'Cart', exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
  }
  await page.setViewportSize({ width: 440, height: 956 });
  await page.goto('http://127.0.0.1:4173/');
  await page.evaluate(() => { document.documentElement.style.zoom = '1.5'; });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(440);
  await context.close();
});

test('legacy search opens header suggestions safely and unknown routes show 404', async ({ page }) => {
  await page.goto('/search?q=radish');
  await expect(page).toHaveURL('/shop?q=radish');
  await page.getByLabel('Search products').fill('<script>alert(1)</script>');
  await expect(page.locator('[data-header-search-empty]')).toContainText('<script>alert(1)</script>');
  await expect(page.locator('[data-header-search-panel] script')).toHaveCount(0);
  await page.goto('/not-an-existing-route');
  await expect(page.locator('#app')).toHaveAttribute('data-status', '404');
});

test('HTTP denies protected routes, returns proper 404 and redirects legacy categories', async ({ request }) => {
  const headers = { Accept: 'text/html' };
  expect((await request.get('/admin/orders', { headers })).status()).toBe(403);
  expect((await request.get('/account', { headers })).status()).toBe(403);
  expect((await request.get('/unknown-route', { headers })).status()).toBe(404);
  expect((await request.get('/products/unpublished', { headers })).status()).toBe(404);
  const redirected = await request.get('/mushrooms.html', { headers, maxRedirects: 0 });
  expect(redirected.status()).toBe(301);
  expect(redirected.headers().location).toBe('/shop/category/mushrooms');
});
