import { test, expect } from '@playwright/test';

async function thumbAlpha(locator) {
  return locator.evaluate(element => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d');
    context.fillStyle = getComputedStyle(element, '::-webkit-scrollbar-thumb').backgroundColor;
    context.fillRect(0, 0, 1, 1);
    return context.getImageData(0, 0, 1, 1).data[3];
  });
}
test('page scrollbar is narrow, hidden at rest and visible only during scrolling', async ({ page }) => {
  await page.goto('/help');
  const root = page.locator('html');
  await expect.poll(() => thumbAlpha(root)).toBe(0);
  expect(await root.evaluate(element => getComputedStyle(element, '::-webkit-scrollbar').width)).toBe('6px');
  const initialWidth = await page.evaluate(() => document.documentElement.clientWidth);
  await page.mouse.move(1277, 100);
  expect(await thumbAlpha(root)).toBe(0);
  await page.mouse.move(400, 400);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => thumbAlpha(root)).toBeGreaterThan(0);
  await expect.poll(() => thumbAlpha(page.locator('body'))).toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
  await expect.poll(() => thumbAlpha(root), { timeout: 5000 }).toBe(0);
  await expect.poll(() => thumbAlpha(page.locator('body'))).toBe(0);
  expect(await page.evaluate(() => document.documentElement.clientWidth)).toBe(initialWidth);
  await page.keyboard.press('PageDown');
  await expect.poll(() => thumbAlpha(root)).toBeGreaterThan(0);
});
test('nested cart scrolling reveals its own scrollbar while the background stays hidden', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 420 });
  await page.goto('/help');
  await page.locator('.header-actions a[href="/cart"]').click();
  await expect.poll(() => page.locator('.cart-drawer-panel').evaluate(element => element.getAnimations().length)).toBe(0);
  const content = page.locator('.cart-drawer-content');
  await expect.poll(() => thumbAlpha(content)).toBe(0);
  const box = await content.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, 100);
  await expect.poll(() => thumbAlpha(content)).toBeGreaterThan(0);
  expect(await thumbAlpha(page.locator('html'))).toBe(0);
  expect(await thumbAlpha(page.locator('body'))).toBe(0);
  await expect.poll(() => thumbAlpha(content)).toBe(0);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});
test('reduced motion and system contrast preferences keep scrollbar behavior usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/help');
  const root = page.locator('html');
  await page.keyboard.press('PageDown');
  await expect.poll(() => thumbAlpha(root)).toBe(255);
  await expect.poll(() => thumbAlpha(root)).toBe(0);
  await page.emulateMedia({ forcedColors: 'active' });
  expect(await root.evaluate(element => getComputedStyle(element).scrollbarColor)).toBe('auto');
  expect(await root.evaluate(element => getComputedStyle(element).scrollbarWidth)).toBe('auto');
});
