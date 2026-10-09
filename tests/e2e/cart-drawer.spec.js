import { test, expect } from '@playwright/test';

test('header and footer cart links open the right drawer without navigation or losing page state', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/help');
  await page.getByLabel('Name (optional)').fill('Unsent visitor');
  const cart = page.locator('.header-actions a[href="/cart"]');
  await cart.click();
  const drawer = page.getByRole('dialog', { name: 'Your cart', exact: true });
  await expect(drawer).toBeVisible();
  await expect(page).toHaveURL('/help');
  await expect(drawer.getByRole('heading', { name: 'Your cart is empty.' })).toBeVisible();
  await expect(drawer.getByRole('button', { name: 'Close cart' })).toBeFocused();
  await expect(cart).toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('Shift+Tab');
  await expect(drawer.getByRole('button', { name: 'Continue browsing' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(drawer.getByRole('button', { name: 'Close cart' })).toBeFocused();
  await expect.poll(() => page.locator('.cart-drawer-panel').evaluate(e => e.getAnimations().length)).toBe(0);
  const bounds = await page.locator('.cart-drawer-panel').boundingBox();
  expect(bounds.x + bounds.width).toBeCloseTo(1280, 0);
  await page.keyboard.press('Escape');
  await expect(drawer).toBeHidden();
  await expect(cart).toBeFocused();
  await expect(page.getByLabel('Name (optional)')).toHaveValue('Unsent visitor');
  await page.locator('.site-footer a[href="/cart"]').click();
  await expect(drawer).toBeVisible();
  await drawer.getByRole('button', { name: 'Continue browsing' }).click();
  await expect(drawer).toBeHidden();
  await expect(page).toHaveURL('/help');
  expect(errors).toEqual([]);
});

test('drawer slides from the right, closes on its backdrop, and locks background scrolling', async ({ page }) => {
  await page.goto('/help');
  const frames = await page.locator('.header-actions a[href="/cart"]').evaluate(async trigger => {
    trigger.click();
    const panel = document.querySelector('.cart-drawer-panel');
    const frames = [];
    const start = performance.now();
    await new Promise(resolve => {
      function sample() {
        frames.push(panel.getBoundingClientRect().x);
        if (performance.now() - start < 430) requestAnimationFrame(sample);
        else resolve();
      }
      requestAnimationFrame(sample);
    });
    return frames;
  });
  expect(frames[0]).toBeGreaterThan(frames.at(-1) + 100);
  expect(frames.some(x => x > frames.at(-1) + 5 && x < frames[0] - 5)).toBe(true);
  const originalY = await page.evaluate(() => scrollY);
  await page.mouse.move(100, 300);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(200);
  expect(await page.evaluate(() => scrollY)).toBeCloseTo(originalY, 0);
  await page.mouse.click(100, 300);
  await expect(page.locator('#cart-drawer')).not.toHaveAttribute('open');
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
});

test('mobile cart opens from the menu and reduced motion skips drawer animations', async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/help');
    await page.getByRole('button', { name: 'Menu', exact: true }).click();
    const cart = page.locator('.mobile-menu-actions a[href="/cart"]');
    await cart.click();
    await expect(page.getByRole('dialog', { name: 'Your cart', exact: true })).toBeVisible();
    await expect(page).toHaveURL('/help');
    await expect.poll(() => page.locator('.cart-drawer-panel').evaluate(e => e.getAnimations().length)).toBe(0);
    const box = await page.locator('.cart-drawer-panel').boundingBox();
    expect(box.x).toBeCloseTo(0, 0);
    expect(box.width).toBe(width);
    await page.keyboard.press('Escape');
    await expect(page.locator('#cart-drawer')).not.toHaveAttribute('open');
    await expect(cart).toBeFocused();
    await expect(page.getByRole('button', { name: 'Menu', exact: true })).toHaveAttribute('aria-expanded', 'true');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await cart.click();
    expect(await page.locator('#cart-drawer').evaluate(e => e.getAnimations({ subtree: true }).length)).toBe(0);
    await page.getByRole('button', { name: 'Close cart' }).click();
    await expect(page.locator('#cart-drawer')).not.toHaveAttribute('open');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  }
});

test('catalogue action closes the drawer before navigation and releases the scroll lock', async ({ page }) => {
  await page.goto('/help');
  await page.locator('.header-actions a[href="/cart"]').click();
  await page.getByRole('dialog').getByRole('link', { name: 'Explore the catalogue' }).click();
  await expect(page).toHaveURL('/shop');
  await expect(page.locator('#cart-drawer')).not.toHaveAttribute('open');
  await expect(page.locator('#main-content')).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  await page.locator('.header-actions a[href="/cart"]').click();
  await page.goBack();
  await expect(page).toHaveURL('/help');
  await expect(page.locator('#cart-drawer')).not.toHaveAttribute('open');
});
