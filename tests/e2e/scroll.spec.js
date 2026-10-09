import { test, expect } from '@playwright/test';

test('wheel scrolling progresses smoothly and settles at the requested position', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await page.mouse.move(700, 400);
  await page.mouse.wheel(0, 700);
  await page.waitForFunction(() => scrollY > 0 && scrollY < 690);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(690);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(710);
});

test('in-page skip link preserves the fragment and keyboard focus while scrolling', async ({ page }) => {
  await page.goto('/');
  await page.mouse.move(700, 400);
  await page.mouse.wheel(0, 700);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(690);
  const skipLink = page.getByRole('link', { name: 'Skip to content', exact: true });
  await skipLink.focus();
  await skipLink.click();
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.locator('#main-content')).toBeFocused();
  await expect.poll(() => page.evaluate(() => Math.abs(document.getElementById('main-content').getBoundingClientRect().top - document.querySelector('.site-header').getBoundingClientRect().bottom))).toBeLessThan(2);
});

test('changing reduced-motion preference disables smoothing and supports native keyboard scroll', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/lenis/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).not.toHaveClass(/lenis/);
  expect(await page.locator('html').evaluate(node => getComputedStyle(node).scrollBehavior)).toBe('auto');
  await page.keyboard.press('PageDown');
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('html')).toHaveClass(/lenis/);
});
