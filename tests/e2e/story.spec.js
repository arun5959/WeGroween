import { test, expect } from '@playwright/test';

test('the story combines the centered opening, illustrated stages and five timeline chapters', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/our-farm');
  await expect(page).toHaveTitle('Our Story · WeGroween');
  await expect(page.locator('.site-navigation a[href="/our-farm"]')).toHaveAccessibleName('Our Story');
  await expect(page.locator('.site-footer a[href="/our-farm"]')).toHaveText('Our Story');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /terrace gardening.*microgreens and mushrooms/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A few vegetables. A much bigger purpose.');
  await expect(page.locator('.story-stage')).toHaveCount(5);
  await expect(page.locator('.story-stage[aria-current="step"]')).toHaveCount(0);
  await expect(page.locator('.story-chapter')).toHaveCount(5);
  const regions = await page.locator('.story-opening, .story-overview, .story-timeline').evaluateAll(elements => elements.map(element => element.className));
  expect(regions).toEqual(['container story-opening', 'story-overview', 'story-timeline']);
  await page.getByRole('link', { name: 'Follow the journey' }).click();
  await expect(page).toHaveURL(/#story-journey$/);
  await expect(page.locator('#story-journey')).toBeFocused();
  await page.locator('.story-stage').last().click();
  await expect(page).toHaveURL(/#story-chapter-5$/);
  await expect(page.locator('#story-chapter-5')).toBeFocused();
  await expect(page.locator('.story-stage').last()).toHaveAttribute('aria-current', 'step');
  await page.getByRole('link', { name: 'Explore this harvest', exact: true }).click();
  await expect(page).toHaveURL('/shop');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Explore the WeGroween catalogue.');
  await page.goBack();
  await expect(page.locator('.story-chapter')).toHaveCount(5);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /terrace gardening/);
  expect(errors).toEqual([]);
});

test('story progress follows scrolling and dynamic reduced motion removes decorative movement', async ({ page }) => {
  await page.goto('/our-farm');
  const progress = page.locator('.story-progress');
  const initial = await progress.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).d);
  await page.locator('.story-stage').last().click();
  await expect.poll(() => progress.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).d)).toBeGreaterThan(initial);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.brand-story')).not.toHaveClass(/story-motion/);
  await expect.poll(() => progress.evaluate(element => new DOMMatrix(getComputedStyle(element).transform).d)).toBe(1);
  await expect.poll(() => page.locator('.story-copy').evaluateAll(elements => elements.every(element => getComputedStyle(element).transform === 'none'))).toBe(true);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('.brand-story')).toHaveClass(/story-motion/);
});

test('the complete story remains available without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/our-farm');
  await expect(page.locator('.story-chapter')).toHaveCount(5);
  await expect(page).toHaveTitle('Our Story · WeGroween');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /terrace gardening.*microgreens and mushrooms/);
  await expect(page.getByRole('heading', { name: 'Now, we want to grow your trust.' })).toBeVisible();
  await page.locator('.story-stage').last().click();
  await expect(page).toHaveURL(/#story-chapter-5$/);
  await expect(page.locator('#story-chapter-5')).toBeInViewport();
  await context.close();
});

test('chapter anchors clear the sticky header exactly once on desktop and mobile', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const reducedMotion of ['no-preference', 'reduce']) {
      await page.emulateMedia({ reducedMotion });
      await page.goto('/our-farm');
      await page.evaluate(() => document.fonts.ready);
      await page.locator('.story-stage').nth(2).click();
      await expect(page).toHaveURL(/#story-chapter-3$/);
      await expect.poll(() => page.evaluate(() => Math.abs(document.querySelector('#story-chapter-3').getBoundingClientRect().top - document.querySelector('.site-header').getBoundingClientRect().bottom))).toBeLessThan(2);
    }
  }
});
